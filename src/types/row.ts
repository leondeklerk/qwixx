import type { Cell } from "./cell";

export interface Row {
    cells: Cell[];
    score: number;
    lockCount: number;
    color: string;
    lock: boolean;
    cross: boolean;
}
