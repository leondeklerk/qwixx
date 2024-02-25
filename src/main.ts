import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { createVfm } from "vue-final-modal";
import "./assets/main.css";
import "vue-final-modal/style.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(pinia);

const vfm = createVfm();
app.use(vfm);

app.mount("#app");
