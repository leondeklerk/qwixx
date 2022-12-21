import type { Cell } from "@/types/cell";

export function useSequentialRule(cells: Cell[], index: number) {
    const isValid = cells.slice(index + 1).filter((cell) => cell.checked).length === 0;
    return { isValid };
}
