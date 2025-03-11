<template>
    <div class="w-screen h-screen flex flex-col">
        <!-- Board -->
        <div
            v-if="board"
            class="w-screen"
        >
            <board-row
                v-for="(row, index) in board.rows"
                :key="index"
                v-model:lock="row.lock"
                v-model:cross="row.cross"
                :lock-count="row.lockCount"
                :cells="row.cells"
                :color="getColor(row, index)"
                :finished="finished"
            />
        </div>
        <!-- Controls -->
        <div class="w-screen flex flex-row mt-4 py-4">
            <div class="basis-1/5 flex align-center place-content-center text-white">
                <button
                    class="rounded-lg w-[70%] shadow-sm bg-red-600 text-[1.8vw] hover:opacity-80"
                    @click="reset"
                >
                    RESET
                </button>
            </div>
            <div
                v-if="board"
                class="grow flex align-center place-content-center"
            >
                <div class="flex flex-col place-content-center text-center">
                    <p class="text-[1.8vw] dark:text-slate-200">MISLUKTE WORPEN (-{{ scoreMapping.failPenalty }})</p>
                    <div class="flex flex-row place-content-between">
                        <input
                            v-for="(fail, index) in board.fails"
                            :key="index"
                            v-model="board.fails[index]"
                            :disabled="finished"
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
            <div class="basis-1/5 flex align-center place-content-center text-black text-center">
                <button
                    v-if="!finished"
                    class="text-white rounded-lg w-[70%] shadow-sm bg-blue-600 text-[1.8vw] hover:opacity-80"
                    @click="manualFinish = true"
                >
                    SCORE
                </button>
                <div
                    v-else
                    class="text-[1.8vw] self-center font-medium dark:text-slate-200"
                >
                    {{ total }}
                </div>
            </div>
            <div class="flex align-center place-content-center text-center mr-9">
                <div class="px-[0.5vw] py-[1vw] flex place-content-center align-center items-center">
                    <i
                        class="fa-solid fa-circle-question fa-2xl text-slate-600 dark:text-slate-400 hover:text-slate-500 hover:dark-text-slate-400"
                        @click="open"
                    ></i>
                </div>
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
import type { Row } from "@/types/row";
import { useModal } from "vue-final-modal";
import ScoresModal from "./ScoresModal.vue";

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
        board.value?.rows.filter((row) => row.lock || row.cross).length === board.value?.lockFinishCount ||
        board.value?.fails.filter((fail) => fail).length === board.value?.fails.length
    );
});

function reset() {
    manualFinish.value = false;
    store.setBoard(useDefaultGenerator());
}

function getColor(row: Row, index: number) {
    if (row.cross || row.lock) {
        if (index % 2 === 0) {
            return "bg-slate-500";
        } else {
            return "bg-slate-600";
        }
    }
    return row.color;
}

const scoreText = computed(() => {
    const rows: string[] = [];
    rows.push(`<div class="flex"><p class="flex-auto">Crosses</p><p class="flex-auto">Score</p></div>`);
    for (const mappingKey of Object.keys(scoreMapping)) {
        if (mappingKey === "failPenalty") {
            continue;
        }

        // @ts-expect-error - Object key is a string
        rows.push(`<div class="flex"><p class="flex-auto">${mappingKey}</p><p class="flex-auto">${scoreMapping[mappingKey]}</p></div>`);
    }
    return rows;
});

const { open, close } = useModal({
    component: ScoresModal,
    attrs: {
        title: "Scores",
        onClose: () => {
            close();
        },
    },
    slots: {
        default: scoreText.value.join("\n"),
    },
});
</script>
