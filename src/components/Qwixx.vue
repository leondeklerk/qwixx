<template>
    <div class="container-fluid h-50" :class="{ complete: complete }">
        <div
            v-for="row in rows"
            :key="row"
            class="row no-gutters"
            :class="{ red: row == 0, yellow: row == 1, green: row == 2, blue: row == 3, locked: isLocked(row) }"
        >
            <div
                v-for="cell in getCells(row)"
                :key="cell"
                class="col-1"
                :class="{
                    selected: isSelected(row, cell),
                    hover: isSelected(row, cell) === '' && !isLocked(row) && !complete,
                    'end-cell': cell === 13
                }"
            >
                <div v-if="cell == 13" @click="select(row, cell)" class="icon-wrapper">
                    <!-- <p > -->
                    <font-awesome-icon v-if="isLocked(row)" icon="fa-solid fa-lock" />
                    <font-awesome-icon v-else icon="fa-solid fa-lock-open" />
                    <!-- </p> -->
                </div>
                <div v-else class="text-wrapper" @click="select(row, cell)">
                    <font-awesome-icon v-if="isSelected(row, cell)" icon="fa-solid fa-times" />
                    <span v-else class="text">{{ cell }}</span>
                </div>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col"></div>
            <div class="col">
                <span>MISLUKTE WORPEN</span>
            </div>
            <div class="col">
                <span v-if="complete">TOTAAL</span>
            </div>
        </div>
        <div class="row no-gutters">
            <div class="col">
                <button ref="resetButton" type="button" class="btn btn-danger" @click="reset">Reset</button>
            </div>
            <div class="col">
                <div v-for="index in 4" :key="index" class="d-inline-flex p-2">
                    <input
                        @input="addPenalty(index)"
                        v-model="checked[index]"
                        :disabled="checked[index] || complete"
                        type="checkbox"
                        class="form-check-input"
                    />
                </div>
            </div>
            <div class="col">
                <button v-if="!complete" ref="generateButton" type="button" class="text-truncate btn btn-primary" @click="generate">Score</button>
                <span v-else>{{ count }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Qwixx extends Vue {
    $refs!: {
        resetButton: HTMLButtonElement;
        generateButton: HTMLButtonElement;
    };

    rows = [0, 1, 2, 3];

    state: { [key: string]: boolean } = {};

    counts: { [key: number]: number } = {};

    locked: { [key: number]: boolean } = {};

    checked: { [key: number]: boolean } = {};

    lockedCount = 0;

    complete = false;

    penalCount = 0;

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

    get count() {
        let total = 0;
        total += this.penalCount * -5;

        this.rows.forEach((row) => {
            let pointScore = 0;
            if (this.locked[row]) {
                pointScore += 1;
            }

            if (this.counts[row]) {
                pointScore += this.counts[row];
            }

            if (pointScore) {
                total += this.points[pointScore];
            }
        });
        return total;
    }

    reset() {
        this.state = {};
        this.counts = {};
        this.locked = {};
        this.checked = {};
        this.lockedCount = 0;
        this.complete = false;
        this.penalCount = 0;
        this.$refs.resetButton.blur();
    }

    generate() {
        this.complete = true;
        this.$refs.generateButton.blur();
    }

    addPenalty(index: number) {
        Vue.set(this.checked, index, true);
        this.penalCount += 1;
        if (this.penalCount == 4) {
            this.complete = true;
        }
    }

    isSelected(row: number, cell: number) {
        if (this.state[`${row},${cell}`]) {
            return "selected";
        } else {
            return "";
        }
    }

    @Prop() private msg!: string;

    isLocked(row: number) {
        if (this.locked[row]) {
            return true;
        }
        return false;
    }

    select(row: number, cell: number) {
        if (this.complete) {
            return;
        }

        if (this.locked[row]) {
            return;
        }
        if (cell === 13) {
            if (this.counts[row] < 5) {
                return;
            }

            if ((row < 2 && !this.state[`${row},12`]) || (row > 1 && !this.state[`${row},2`])) {
                return;
            }

            Vue.set(this.locked, row, true);
            this.lockedCount += 1;

            if (this.lockedCount === 2) {
                this.complete = true;
            }
            return;
        }

        if (!this.state[`${row},${cell}`]) {
            if (this.counts[row]) {
                this.counts[row] += 1;
            } else {
                Vue.set(this.counts, row, 1);
            }
            Vue.set(this.state, `${row},${cell}`, true);
        } else {
            if (this.counts[row]) {
                this.counts[row] -= 1;
            } else {
                Vue.set(this.counts, row, 0);
            }
            Vue.set(this.state, `${row},${cell}`, false);
        }
    }

    getCells(row: number) {
        let cells = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        if (row < 2) {
            return cells.concat([13]);
        } else {
            return cells.concat().reverse().concat([13]);
        }
    }

    getColor(row: number) {
        switch (row) {
            case 0:
                return "red";
            case 1:
                return "yellow";
            case 2:
                return "green";
            default:
                return "blue";
        }
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

.hover:hover {
    opacity: 80%;
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

.container > :nth-child(2n).locked {
    background: gray;
    cursor: cursor;
}

.container > .locked {
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
