import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faLockOpen, faLock, faTimes, faSlash } from "@fortawesome/free-solid-svg-icons";

import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/main.css";

const app = createApp(App);

/* Font Awesome*/
library.add(faLockOpen, faLock, faTimes, faSlash);
app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
