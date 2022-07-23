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
                locked: row.locked || row.closed
            }"
        >
            <div
                v-for="(col, cIndex) in row.columns"
                :key="cIndex"
                class="col-1"
                :class="{
                    selected: col.selected,
                    hover: !col.selected && !row.locked && !row.closed && !state.complete,
                    'end-cell': col.isLock
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
                <div v-for="(pass, index) in this.state.passes" :key="index" class="d-inline-flex p-2">
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Awake from "./awake";
import BoardFactory, { Column, Pass, Row } from "./board";

@Component
export default class Qwixx extends Vue {
    $refs!: {
        resetButton: HTMLButtonElement;
        generateButton: HTMLButtonElement;
    };

    state = localStorage["qwixx"] ? JSON.parse(localStorage["qwixx"]) : new BoardFactory().create("default");

    points: { [key: number]: number } = {
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
        12: 78
    };

    first = true;

    get count() {
        let total = 0;
        total += this.state.passes.filter((pass: Pass) => pass.checked).length * -5;

        this.state.rows.forEach((row: Row) => {
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
                total += this.points[pointScore];
            }
        });
        return total;
    }

    reset() {
        this.state.complete = false;
        this.state.rows.forEach((row: Row) => {
            row.locked = false;
            row.columns.forEach((column: Column) => {
                column.selected = false;
            });
        });
        this.state.passes.forEach((pass: Pass) => {
            pass.checked = false;
        });
        this.$refs.resetButton.blur();
        this.first = false;
        this.cacheState();
    }

    generate() {
        this.state.complete = true;
        this.$refs.generateButton.blur();
        this.cacheState();
    }

    addPass(pass: Pass) {
        pass.checked = true;
        if (this.state.passes.filter((pass: Pass) => pass.checked).length === 4) {
            this.state.complete = true;
        }
        this.cacheState();
    }

    closeRow(row: Row) {
        if (!row.locked) {
            row.closed = !row.closed;
        }
    }

    select(row: Row, column: Column) {
        if (this.first) {
            this.first = false;
            new Awake().initialize();
        }
        if (this.state.complete) {
            return;
        }
        if (row.locked || row.closed) {
            return;
        }
        if (column.isLock) {
            let selectedCols = row.columns.filter((rowCol: Column) => rowCol.selected);
            if (selectedCols.length < 5) {
                return;
            }
            let last = row.columns.filter((value: Column, index: number) => index === 10);
            if (last && last[0] && !last[0].selected) {
                return;
            }

            column.selected = true;
            row.locked = true;
            let closedRows = this.state.rows.filter((value: Row) => value.locked);
            if (closedRows.length === 2) {
                this.state.complete = true;
            }
            this.cacheState();
            return;
        }

        column.selected = !column.selected;
        this.cacheState();
    }

    cacheState() {
        localStorage.setItem("qwixx", JSON.stringify(this.state));
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
