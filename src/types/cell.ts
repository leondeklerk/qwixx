import type { RuleType } from "./rules";

export interface Cell {
    checked: boolean;
    type: CellType;
    displayValue?: string;
    color?: string;
    rules?: RuleType[];
}

export enum CellType {
    Field,
}
