<template>
    <div class="flex" :class="color">
        <div class="grow grid grid-cols-11">
            <div v-for="(cell, index) in cells" :key="index" class="">
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
            </div>
        </div>
        <div class="flex border border-black h-100"></div>
        <div class="px-[0.5vw] py-[1vw] flex place-content-center align-center items-center">
            <span
                @click="onLock"
                class="fa-stack text-[1.8vw]"
                :class="{
                    'hover:opacity-80 dark:hover:opacity-[70%] hover:cursor-pointer': !closed && lockValidation,
                    'opacity-[70%] cursor-default': !lockValidation && !locked,
                }"
            >
                <i class="fa-solid fa-circle fa-stack-2x text-white dark:text-[#232327] opacity-90"></i>
                <i v-if="locked" class="fa-solid fa-lock fa-stack-1x text-black dark:text-slate-200" />
                <i v-else class="fa-solid fa-lock-open fa-stack-1x text-black dark:text-slate-200" />
            </span>
        </div>
        <div class="px-[0.5vw] py-[1vw] flex place-content-center align-center items-center">
            <span
                @click="onCross"
                class="fa-stack text-[1.8vw]"
                :class="{
                    ' hover:opacity-80 hover:cursor-pointer': !closed,
                }"
            >
                <i class="fa-solid fa-circle fa-stack-2x text-white dark:text-[#232327] opacity-90"></i>
                <i
                    class="fa-solid fa-xmark fa-stack-1x text-black dark:text-slate-200"
                    :class="{
                        'opacity-[50%]': closed,
                    }"
                ></i>
            </span>
        </div>
    </div>
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
