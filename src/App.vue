<template>
    <div id="app">
        <Qwixx />
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
    stayWake: number | null = null;

    count = 0;
    err: any;

    async created() {
        if ("wakeLock" in navigator) {
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
                this.err = err;
            }
        } else if (navigator.vendor === "Apple Computer, Inc.") {
            this.stayWake = setInterval(() => {
                // eslint-disable-next-line no-self-assign
                location.href = location.href;
                window.setTimeout(window.stop, 0);
            }, 30000);
        } else {
            this.noSleep = new NoSleep();
            document.addEventListener("click", this.setNoSleep);
        }
    }

    setNoSleep() {
        this.count += 1;
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

        if (this.stayWake) {
            clearInterval(this.stayWake);
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
