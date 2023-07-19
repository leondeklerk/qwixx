import { defineStore } from "pinia";
import type { Board } from "@/types/board";
import { ref, type Ref } from "vue";

export const useBoardStore = defineStore(
    "board",
    () => {
        const board: Ref<Board | null> = ref(null);

        function setBoard(newBoard: Board) {
            board.value = newBoard;
        }
        return { board, setBoard };
    },
    {
        persist: true,
    },
);
