import type { Cell } from "@/types/cell";

export function useRequireIndexRule(cells: Cell[], index: number) {
    let isValid = false;
    if (index > 0 && index < cells.length) {
        isValid = cells[index]?.checked ?? false;
    }
    return { isValid };
}
