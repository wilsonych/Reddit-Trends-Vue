import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "@/plugins/vuetify";
import Vuex from "vuex";

Vue.config.productionTip = false;

const app = new Vue({
    router,
    store,
    vuetify,
    Vuex,
    render: (h) => h(App),
}).$mount("#app");

window.app = app;

