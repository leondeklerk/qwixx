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
                :finished="finished"
            />
        </tbody>
    </table>
    <div class="grid grid-cols-3 w-full my-4 font-semibold">
        <div class="flex content-center justify-center text-center align-center text-slate-200">
            <button @click="reset" class="flex rounded-lg bg-red-600 h-full w-1/4 text-center justify-center items-center">RESET</button>
        </div>
        <div class="inline-block content-center justify-center items-center font-medium dark:text-slate-200" v-if="board">
            <p>MISLUKTE WORPEN (-{{ scoreMapping.failPenalty }})</p>
            <input
                v-for="(fail, index) in board.fails"
                :key="index"
                v-model="board.fails[index]"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-800 rounded border-gray-400 dark:border-gray-50 m-2"
            />
        </div>
        <div class="flex content-center justify-center items-center text-slate-200">
            <button
                v-if="!finished"
                @click="manualFinish = true"
                class="flex rounded-lg shadow-sm bg-blue-600 h-full w-1/4 text-center justify-center items-center"
            >
                SCORE
            </button>
            <div class="text-black dark:text-slate-200 text-2xl font-medium" v-else>{{ total }}</div>
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
    return manualFinish.value || board.value?.rows.filter((row) => row.lock).length === board.value?.lockFinishCount;
});

function reset() {
    manualFinish.value = false;
    store.setBoard(useDefaultGenerator());
}
</script>
