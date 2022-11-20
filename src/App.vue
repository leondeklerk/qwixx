<template>
    <div id="app">
        <qwixx />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Qwixx from "./components/Qwixx.vue";
import NoSleep from "nosleep.js";

@Component({
    components: {
        Qwixx
    }
})
export default class App extends Vue {
    /* eslint-disable */
    // @ts-ignore
    wakeLock: WakeLock | null = null;
    /* eslint-enable */
    noSleep: NoSleep | null = null;
    unsupported = false;

    async created() {
        // Apple devices can only support a good experience with the wake lock API, which currently does not exist.
        this.unsupported = /iPhone|iPod|iPad|Macintosh/i.test(navigator.userAgent);
        if ("wakeLock" in navigator) {
            if (this.unsupported) {
                this.unsupported = false;
            }

            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                this.wakeLock = await navigator.wakeLock.request("screen");
                this.wakeLock.addEventListener("release", () => {
                    this.wakeLock = null;
                });

                document.addEventListener("visibilityChange", this.onVisibilityChange);
            } catch (err) {
                console.log("WakeLock failure:", err);
            }
        } else if (!this.unsupported) {
            this.noSleep = new NoSleep();
            document.addEventListener("click", this.setNoSleep);
        }
    }

    setNoSleep() {
        if (this.noSleep && !this.noSleep.isEnabled) {
            this.noSleep.enable();
        }
    }

    async onVisibilityChange() {
        if (this.wakeLock !== null && document.visibilityState === "visible") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.wakeLock = await navigator.wakeLock.request("screen");
        }
    }

    async beforeDestroy() {
        if (this.wakeLock) {
            this.wakeLock.release().then(() => {
                this.wakeLock = null;
            });
        }

        if (this.noSleep) {
            this.noSleep.disable();
        }

        document.removeEventListener("visibilitychange", this.onVisibilityChange);
        document.removeEventListener("click", this.setNoSleep);
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0.5em;
    height: 100%;
    margin-left: 0.5em;
    margin-right: 0.5em;
}
</style>
