<template>
    <div class="container-fluid" :class="{ complete: state.complete }">
        <div
            v-for="(row, rIndex) in state.rows"
            :key="rIndex"
            class="row no-gutters"
            :class="{
                red: row.color === 'red',
                yellow: row.color === 'yellow',
                green: row.color === 'blue',
                blue: row.color === 'green',
                locked: row.locked || row.closed,
            }"
        >
            <div
                v-for="(col, cIndex) in row.columns"
                :key="cIndex"
                class="col-1"
                :class="{
                    selected: col.selected,
                    hover: !col.selected && !row.locked && !row.closed && !state.complete,
                    'end-cell': col.isLock,
                }"
            >
                <div v-if="col.isLock" @click="select(row, col)" class="icon-wrapper">
                    <font-awesome-icon v-if="row.locked" icon="fa-solid fa-lock" />
                    <font-awesome-icon v-else icon="fa-solid fa-lock-open" />
                </div>
                <div v-if="col.isLock" @click="closeRow(row)" class="icon-wrapper">
                    <font-awesome-icon icon="fa-solid fa-slash" />
                </div>
                <div v-else class="text-wrapper" @click="select(row, col)">
                    <font-awesome-icon v-if="col.selected" icon="fa-solid fa-times" />
                    <span v-else class="text">{{ col.value }}</span>
                </div>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col"></div>
            <div class="col">
                <span>MISLUKTE WORPEN (-5)</span>
            </div>
            <div class="col">
                <span v-if="state.complete">TOTAAL</span>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col">
                <button ref="resetButton" type="button" class="btn btn-danger" @click="reset">Reset</button>
            </div>
            <div class="col">
                <div v-for="(pass, index) in state.passes" :key="index" class="d-inline-flex p-2">
                    <input
                        @input="addPass(pass)"
                        v-model="pass.checked"
                        :disabled="pass.checked || state.complete"
                        type="checkbox"
                        class="form-check-input"
                    />
                </div>
            </div>
            <div class="col">
                <button v-if="!state.complete" ref="generateButton" type="button" class="text-truncate btn btn-primary" @click="generate">
                    Score
                </button>
                <span v-else>{{ count }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import BoardFactory from "./board";
import type { Column, Pass, Row, Board } from "./board";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

let state = reactive<Board>(localStorage["qwixx"] ? JSON.parse(localStorage["qwixx"]) : new BoardFactory().create("default"));

let points: { [key: number]: number } = {
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
};

let count = computed(() => {
    let total = 0;
    total += state.passes.filter((pass: Pass) => pass.checked).length * -5;

    state.rows.forEach((row: Row) => {
        let pointScore = 0;
        if (row.locked) {
            pointScore += 1;
        }

        row.columns.forEach((col: Column) => {
            if (col.selected) {
                pointScore += 1;
            }
        });

        if (pointScore) {
            total += points[pointScore];
        }
    });
    return total;
});

const $toast = useToast();
const resetButton = ref<HTMLButtonElement | null>(null);
const generateButton = ref<HTMLButtonElement | null>(null);

updateCache();

function reset() {
    state.complete = false;
    state.rows.forEach((row: Row) => {
        row.locked = false;
        row.closed = false;
        row.columns.forEach((column: Column) => {
            column.selected = false;
        });
    });
    state.passes.forEach((pass: Pass) => {
        pass.checked = false;
    });
    resetButton.value?.blur();
    cacheState();
}

function generate() {
    state.complete = true;
    generateButton.value?.blur();
    cacheState();
}

function addPass(pass: Pass) {
    pass.checked = true;
    if (state.passes.filter((pass: Pass) => pass.checked).length === 4) {
        state.complete = true;
    }
    cacheState();
}

function closeRow(row: Row) {
    if (!row.locked) {
        row.closed = !row.closed;
    }
}

function select(row: Row, column: Column) {
    if (state.complete) {
        return;
    }
    if (row.locked || row.closed) {
        return;
    }
    if (column.isLock) {
        let selectedCols = row.columns.filter((rowCol: Column) => rowCol.selected);
        if (selectedCols.length < 5) {
            showWarning("Requires at least five selected squares in this row");
            return;
        }
        let last = row.columns[10];
        if (last && !last.selected) {
            showWarning("Requires the last square to be selected");
            return;
        }

        column.selected = true;
        row.locked = true;
        let closedRows = state.rows.filter((value: Row) => value.locked);
        if (closedRows.length === 2) {
            state.complete = true;
        }
        cacheState();
        return;
    }

    let higherLocked = row.columns.some((col: Column) => {
        return col.index > column.index && col.selected;
    });
    if (!column.selected && higherLocked) {
        showWarning("Can only select succeeding squares");
        return;
    }
    column.selected = !column.selected;
    cacheState();
}

function cacheState() {
    localStorage.setItem("qwixx", JSON.stringify(state));
}

function updateCache() {
    let board = new BoardFactory().create("default");
    if (!state.version || state.version !== board.version) {
        updateObject(state, board as unknown as Record<string, unknown>);
        cacheState();
    }
}

function updateObject(old: Record<string, unknown>, updated: Record<string, unknown>) {
    Object.keys(updated).forEach((key: string) => {
        if (!Object.keys(old).includes(key)) {
            old[key] = updated[key];
        }
        if (typeof updated[key] === "object") {
            updateObject(old[key] as Record<string, unknown>, updated[key] as Record<string, unknown>);
        }
    });
}

function showWarning(message: string) {
    $toast.open({
        message: message,
        type: "warning",
        position: "bottom",
    });
}
</script>

<style lang="scss" scoped>
.complete {
    cursor: default !important;
}

.row.penalty {
    padding: 0em;
}

.icon-wrapper {
    background: white;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    opacity: 90%;
    cursor: pointer;
    touch-action: manipulation;
    border-radius: 50%;
    aspect-ratio: 1/1;
}

.end-cell > :nth-child(even).icon-wrapper {
    margin-left: 5%;
}

.selected {
    .text-wrapper {
        background: #5a5a65;
        opacity: 100%;
        color: black !important;
    }

    .icon-wrapper {
        background: transparent;
        opacity: 100%;
        color: #232327;
    }
}

.hover {
    .text-wrapper:hover {
        opacity: 80%;
    }

    .icon-wrapper:hover {
        opacity: 80%;
    }
}

.row {
    margin-right: 0;
    margin-left: 0;

    > .col,
    > [class*="col-"] {
        padding-top: 1%;
        padding-bottom: 1%;
        padding-right: 0.5%;
        padding-left: 0.5%;
    }
}

.red {
    background: #e7153b;

    .text-wrapper {
        color: #e7153b;
    }
}

.blue {
    background: #1a61b3;

    .text-wrapper {
        color: #1a61b3;
    }
}

.green {
    background: #3cac2c;

    .text-wrapper {
        color: #3cac2c;
    }
}

.yellow {
    background: #ffc400;

    .text-wrapper {
        color: #ffc400;
    }
}

.text-wrapper {
    width: 90%;
    height: 100%;
    display: flex;
    text-align: center;
    background: white;
    opacity: 90%;
    cursor: pointer;
    text-align: center;
    touch-action: manipulation;
    border-radius: 0.5em;
    align-content: center;
    align-items: center;
    justify-content: center;
    margin: auto;
}

.text {
    margin: auto;
}

.end-cell {
    border-left: 0.1em solid #232327;
    display: flex;
    justify-content: center;
}

.container-fluid > :nth-child(2n).locked {
    background: gray;
    cursor: cursor;
}

.container-fluid > .locked {
    background: #3b3b40;
}

.locked,
.complete {
    .text-wrapper,
    .icon-wrapper {
        cursor: default;
    }

    .text,
    .icon {
        color: black;
        opacity: 30%;
        cursor: cursor;
    }
}

.btn:focus {
    outline: none;
}

.container-fluid {
    padding: 0em;
}

.text {
    font-size: 100%;
}

.svg-inline--fa {
    width: 60%;
    aspect-ratio: 1/1;
}
</style>
