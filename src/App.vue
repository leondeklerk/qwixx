<template>
    <QwixxBoard />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import NoSleep from "nosleep.js";
import QwixxBoard from "./components/QwixxBoard.vue";

// WakeLock type not properly supported yet
type WakeLock = any;

let wakeLock: WakeLock | null = null;
let noSleep: NoSleep | null = null;
let unsupported = false;

setupWakeLock();

async function setupWakeLock() {
    // Apple devices can only support a good experience with the wake lock API, which currently does not exist.
    unsupported = /iPhone|iPod|iPad|Macintosh/i.test(navigator.userAgent);
    if ("wakeLock" in navigator) {
        if (unsupported) {
            unsupported = false;
        }

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            wakeLock = await navigator.wakeLock.request("screen");
            wakeLock.addEventListener("release", () => {
                wakeLock = null;
            });

            document.addEventListener("visibilityChange", onVisibilityChange);
        } catch (err) {
            console.log("WakeLock failure:", err);
        }
    } else if (!unsupported) {
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.wakeLock = await navigator.wakeLock.request("screen");
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
