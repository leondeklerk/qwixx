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

export type Column = {
    index: number;
    isLock: boolean;
    selected: boolean;
    value: number;
};

export type Row = {
    columns: Column[];
    color: string;
    locked: boolean;
    closed: boolean;
};

export type Board = {
    version: string;
    rows: Row[];
    complete: boolean;
    passes: Pass[];
};

export type Pass = {
    checked: boolean;
};
