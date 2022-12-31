<template>
    <table class="w-fit table-fixed font-medium">
        <tbody class="" v-if="board">
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
        </tbody>
    </table>
    <div class="grid grid-cols-3 w-full my-4 font-semibold">
        <div class="flex content-center justify-center text-center items-center align-center text-slate-200">
            <button @click="reset" class="flex rounded-lg bg-red-600 h-fit py-[1vw] w-1/2 text-center justify-center items-center text-[1.4vw]">
                RESET
            </button>
        </div>
        <div class="inline-block content-center justify-center items-center font-medium dark:text-slate-200" v-if="board">
            <p class="text-[1.2vw]">MISLUKTE WORPEN (-{{ scoreMapping.failPenalty }})</p>
            <input
                v-for="(fail, index) in board.fails"
                :key="index"
                :disabled="finished"
                v-model="board.fails[index]"
                type="checkbox"
                class="focus:ring-0 focus:ring-offset-0 rounded-sm m-[0.8vw] text-blue-600 dark:bg-slate-500"
                :class="{
                    'hover:cursor-pointer': !finished,
                    'opacity-40': finished,
                }"
            />
        </div>
        <div class="flex content-center justify-center items-center text-slate-200">
            <button
                v-if="!finished"
                @click="manualFinish = true"
                class="flex rounded-lg shadow-sm h-fit py-[1vw] bg-blue-600 w-1/2 text-center justify-center items-center text-[1.4vw]"
            >
                SCORE
            </button>
            <div class="text-black dark:text-slate-200 text-2xl font-medium text-[1.4vw]" v-else>{{ total }}</div>
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
