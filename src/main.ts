import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faLockOpen, faLock, faTimes } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faLockOpen, faLock, faTimes);

/* add font awesome icon component */
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

setTimeout(() => {
    /* */
}, 100000);

new Vue({
    render: (h) => h(App)
}).$mount("#app");
