<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";

defineProps<{
    title?: string;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();
</script>

<template>
    <VueFinalModal
        class="flex justify-center items-center"
        content-class="w-0.5 flex flex-col bg-white dark:bg-zinc-900 rounded-lg min-w-[40%]"
    >
        <div class="flex px-4 py-2 content-center border-b-2">
            <h1 class="flex-auto text-2xl text-black dark:text-slate-200">{{ title }}</h1>
            <i
                class="fa-solid fa-xmark text-black dark:text-slate-200 self-center fa-xl"
                @click="emit('close')"
            />
        </div>
        <div class="px-4 py-2 text-black dark:text-slate-200 text-center">
            <slot />
        </div>
    </VueFinalModal>
</template>
