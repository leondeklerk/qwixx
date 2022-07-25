import layout from "../layouts/default.json";

export default class BoardFactory {
    create(board: string): Board {
        if (board === "default") {
            return layout as Board;
        } else {
            return layout as Board;
        }
    }
}

export interface Column {
    index: number;
    isLock: boolean;
    selected: boolean;
    value: number;
}

export interface Row {
    columns: Column[];
    color: string;
    locked: boolean;
    closed: boolean;
}

export interface Board {
    version: string;
    rows: Row[];
    complete: boolean;
    passes: Pass[];
}

export interface Pass {
    checked: boolean;
}
