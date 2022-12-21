import { CellType, type Cell } from "@/types/cell";
import type { Board } from "@/types/board";

export default function useDefaultGenerator() {
    const rowCount = 4;
    const fieldCount = 12;
    const lockCount = 5;
    const colorMapping: { [key: number]: string } = {
        0: "red",
        1: "yellow",
        2: "blue",
        3: "green",
    };
    const allowedFails = 4;
    const lockFinishCount = 2;
    const board: Board = {
        rows: [],
        fails: [],
        lockFinishCount: lockFinishCount,
    };

    for (let i = 0; i < allowedFails; i++) {
        board.fails.push(false);
    }

    for (let i = 0; i < rowCount; i++) {
        const row = {
            color: colorMapping[i],
            score: 0,
            lockCount: lockCount,
            cells: [] as Cell[],
            lock: false,
        };

        if (i < rowCount / 2) {
            for (let j = 2; j <= fieldCount; j++) {
                const field = {
                    type: CellType.Field,
                    checked: false,
                    displayValue: `${j}`,
                };
                row.cells.push(field);
            }
        } else {
            for (let j = fieldCount; j >= 2; j--) {
                const field = {
                    type: CellType.Field,
                    checked: false,
                    displayValue: `${j}`,
                };
                row.cells.push(field);
            }
        }

        board.rows.push(row);
    }

    return board;
}

export const scoreMapping: { [key: number]: number; failPenalty: number } = {
    1: 1,
    2: 3,
    3: 6,
    4: 10,
    5: 15,
    6: 21,
    7: 28,
    8: 36,
    9: 45,
    10: 55,
    11: 66,
    12: 78,
    failPenalty: 5,
};
