<template>
    <div class="h-full items-center justify-center flex py-[10%] px-[10%]" :class="classObject">
        <!-- A field can either be selected (represented with an X), or display its value -->
        <div
            v-if="type === CellType.Field"
            @click="onClick"
            class="shadow-md w-full h-full flex py-[5%] bg-white dark:bg-slate-900 rounded-lg items-center justify-center opacity-90"
            :class="{
                'hover:opacity-80 hover:cursor-pointer': !value && validated && !closed,
                'opacity-80': !value && !validated,
                'text-slate-700 opacity-90': value,
            }"
        >
            <i v-if="value" class="fa-solid fa-x text-[2vw] dark:text-slate-300" />
            <span v-else class="text-[1.9vw]" :class="{ 'opacity-50': !validated }">{{ displayValue }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CellType, type Cell } from "@/types/cell";
import { useSequentialRule } from "./rules/sequentialRule";

interface Props {
    /**
     * Determine the type of cell.
     *
     * field: a regular board cell with a score value attached to it
     */
    type?: CellType;
    /**
     * The display value used in cells of type field
     */
    displayValue?: string;
    /**
     * The closed state of this cell, closed cells can not be changed (clicked)
     */
    closed?: boolean;
    /**
     * A read-only cell cannot change state (clicked)
     */
    readonly?: boolean;
    /**
     * The selected state of the cell
     */
    modelValue: boolean;
    /**
     * The background color of the cell
     */
    color: string;
    /**
     * The index of this cell.
     */
    index: number;
    /**
     * The list of cells in this row.
     */
    cells: Cell[];
}

const props = withDefaults(defineProps<Props>(), {
    type: CellType.Field,
    closed: false,
    readonly: false,
});

const validated = computed(() => {
    return useSequentialRule(props.cells, props.index).isValid;
});

const emit = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

// Define the v-model for the cell selected state
const value = computed({
    get() {
        return props.modelValue;
    },
    set(value: boolean) {
        emit("update:modelValue", value);
    },
});

function onClick() {
    // Only allow selection when the cell is not closed and not read only
    if (validated.value && !props.readonly && !props.closed) {
        value.value = !value.value;
    }
}

const classObject = computed(() => {
    let result = {
        [props.color]: props.color,
    };
    return result;
});
</script>
