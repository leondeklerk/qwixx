<template>
    <tr class="h-full">
        <td class="p-0 h-full select-none" v-for="(cell, index) in cells" :key="index">
            <board-cell
                v-if="cell.type === CellType.Field"
                :type="cell.type"
                :closed="closed"
                v-model="cell.checked"
                :display-value="cell.displayValue"
                :readonly="readonly"
                :color="cell.color || color"
                :cells="cells"
                :index="index"
            />
        </td>
        <td class="p-0 h-full border-l border-black" :class="color">
            <div class="flex py-[12%] h-full w-full place-content-evenly items-center opacity-90">
                <div
                    @click="onLock"
                    class="shadow-md flex rounded-full h-full bg-white dark:bg-slate-900 aspect-square items-center justify-center"
                    :class="{
                        'hover:opacity-80 hover:cursor-pointer': !closed && lockValidation,
                        'opacity-80 cursor-default': !lockValidation && !locked,
                    }"
                >
                    <i v-if="locked" class="fa-solid fa-lock aspect-square text-[1.7vw] text-[#232327] dark:text-white" />
                    <i
                        v-else
                        class="fa-solid fa-lock-open text-[1.7vw] text-[#232327] opacity-90 dark:text-white"
                        :class="{ 'opacity-50': !lockValidation }"
                    />
                </div>
                <div
                    @click="onCross"
                    class="shadow-md flex rounded-full h-full bg-white dark:bg-slate-900 aspect-square items-center justify-center"
                    :class="{
                        ' hover:opacity-80 hover:cursor-pointer': !closed,
                    }"
                >
                    <i class="fa-solid fa-slash text-[1.7vw] text-[#232327] dark:text-white" />
                </div>
            </div>
        </td>
    </tr>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Cell } from "@/types/cell";
import { CellType } from "@/types/cell";
import BoardCell from "./BoardCell.vue";
import { useAtLeastCheckedRule } from "./rules/atLeastCheckedRule";
import { useRequireIndexRule } from "./rules/requireIndexRule";

interface Props {
    cells: Cell[];
    lockCount: number;
    readonly?: boolean;
    color: string;
    finished: boolean;
    lock: boolean;
    cross: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    readonly: false,
    finished: false,
    cross: false,
});

const emit = defineEmits<{ (e: "update:lock", value: boolean): void; (e: "update:cross", value: boolean): void }>();

const locked = computed({
    get() {
        return props.lock;
    },
    set(value: boolean) {
        emit("update:lock", value);
    },
});

const crossed = computed({
    get() {
        return props.cross;
    },
    set(value: boolean) {
        emit("update:cross", value);
    },
});

const closed = computed(() => crossed.value || locked.value || props.finished);

const lockValidation = computed(() => {
    return useAtLeastCheckedRule(props.cells, 5).isValid && useRequireIndexRule(props.cells, props.cells.length - 1).isValid;
});

function onLock() {
    if (!props.finished && !locked.value && lockValidation.value) {
        locked.value = true;
    }
}

function onCross() {
    if (!props.finished && !locked.value) {
        crossed.value = true;
    }
}
</script>
