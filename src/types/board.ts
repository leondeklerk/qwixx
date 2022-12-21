import type { Row } from "./row";

export interface Board {
    rows: Row[];
    fails: boolean[];
    lockFinishCount: number;
}
