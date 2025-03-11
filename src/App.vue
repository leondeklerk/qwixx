<template>
    <div class="w-full h-full">
        <board-component />
        <ModalsContainer />
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import NoSleep from "nosleep.js";
import BoardComponent from "./components/BoardComponent.vue";
import { ModalsContainer } from "vue-final-modal";

let wakeLock: WakeLockSentinel | null = null;
let noSleep: NoSleep | null = null;

setupWakeLock();

async function setupWakeLock() {
    if (navigator.wakeLock) {
        try {
            wakeLock = await navigator.wakeLock.request("screen");
            wakeLock.addEventListener("release", () => {
                wakeLock = null;
            });

            document.addEventListener("visibilityChange", onVisibilityChange);
        } catch (err) {
            console.info("WakeLock failure:", err);
        }
    } else {
        noSleep = new NoSleep();
        document.addEventListener("click", setNoSleep);
    }
}

function setNoSleep() {
    if (noSleep && !noSleep.isEnabled) {
        noSleep.enable();
    }
}

async function onVisibilityChange() {
    if (wakeLock !== null && document.visibilityState === "visible") {
        wakeLock = await navigator.wakeLock.request("screen");
    }
}

onBeforeUnmount(async () => {
    if (wakeLock) {
        wakeLock.release().then(() => {
            wakeLock = null;
        });
    }

    if (noSleep) {
        noSleep.disable();
    }

    document.removeEventListener("visibilitychange", onVisibilityChange);
    document.removeEventListener("click", setNoSleep);
});
</script>

<style lang="scss" scoped></style>
