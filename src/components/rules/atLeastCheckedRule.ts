import type { Cell } from "@/types/cell";

export function useAtLeastCheckedRule(precedingCells: Cell[], count: number) {
    let selectedCount = 0;
    precedingCells.forEach((cell) => {
        if (cell.checked) {
            selectedCount++;
        }
    });
    const isValid = selectedCount >= count;
    return { isValid };
}
