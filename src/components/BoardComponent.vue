<template>
    <div class="w-screen h-screen flex flex-col">
        <!-- Board -->
        <div class="w-screen" v-if="board">
            <board-row
                v-for="(row, index) in board.rows"
                :lock-count="row.lockCount"
                :cells="row.cells"
                :key="index"
                :color="row.color"
                v-model:lock="row.lock"
                v-model:cross="row.cross"
                :finished="finished"
            />
        </div>
        <!-- Controls -->
        <div class="w-screen flex flex-row mt-4 py-4">
            <div class="basis-1/4 flex align-center place-content-center text-white">
                <button @click="reset" class="rounded-lg w-[70%] shadow-sm bg-red-600 text-[1.8vw] hover:opacity-80">RESET</button>
            </div>
            <div class="grow flex align-center place-content-center" v-if="board">
                <div class="flex flex-col place-content-center text-center">
                    <p class="text-[1.8vw] dark:text-slate-200">MISLUKTE WORPEN (-{{ scoreMapping.failPenalty }})</p>
                    <div class="flex flex-row place-content-between">
                        <input
                            v-for="(fail, index) in board.fails"
                            :key="index"
                            :disabled="finished"
                            v-model="board.fails[index]"
                            type="checkbox"
                            class="focus:ring-0 focus:ring-offset-0 rounded-sm w-[1.8vw] h-[1.8vw] m-[0.8vw] text-blue-600 dark:bg-slate-500"
                            :class="{
                                'cursor-pointer': !finished,
                                'opacity-40': finished,
                                'hover:opacity-60': !finished && !fail,
                                'hover:opacity-90': !finished && fail,
                            }"
                        />
                    </div>
                </div>
            </div>
            <div class="basis-1/4 flex align-center place-content-center text-black text-center">
                <button
                    v-if="!finished"
                    @click="manualFinish = true"
                    class="text-white rounded-lg w-[70%] shadow-sm bg-blue-600 text-[1.8vw] hover:opacity-80"
                >
                    SCORE
                </button>
                <div class="text-[1.8vw] self-center font-medium dark:text-slate-200" v-else>{{ total }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useBoardStore } from "@/store/board";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import BoardRow from "./BoardRow.vue";
import useDefaultGenerator, { scoreMapping } from "./boards/default";

const manualFinish = ref(false);
const store = useBoardStore();

const { board } = storeToRefs(store);

if (!board.value) {
    store.setBoard(useDefaultGenerator());
}

const total = computed(() => {
    let score = 0;

    board.value?.rows.forEach((row) => {
        let count = row.cells.filter((cell) => cell.checked).length;
        if (row.lock) {
            count += 1;
        }

        score += scoreMapping[count] || 0;
    });

    const fails = board.value?.fails.filter((fail) => fail) || [];
    score -= fails.length * scoreMapping.failPenalty;

    return score;
});

const finished = computed(() => {
    return (
        manualFinish.value ||
        board.value?.rows.filter((row) => row.lock).length === board.value?.lockFinishCount ||
        board.value?.fails.filter((fail) => fail).length === board.value?.fails.length
    );
});

function reset() {
    manualFinish.value = false;
    store.setBoard(useDefaultGenerator());
}
</script>
