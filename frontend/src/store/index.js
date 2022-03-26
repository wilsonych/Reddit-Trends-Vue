import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

//export const endpoint= Vue.config.devtools ? "http://150.230.38.246:3001/api" : "http://150.230.38.246/api"

export default new Vuex.Store({
    state: {
        token: null,
        user: null,
        message: [],
        timeMeasure: false
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            axios.defaults.headers.Authorization = token
        },
        setUser(state, user) {
            state.user = user;
        },
        logout(state, _) {
            state.token = null;
            state.user = null;
            window.localStorage.removeItem("token");
            window.localStorage.removeItem("user");
        },
        login(state, data) {
            state.token = data.token;
            state.user = data.user;
            window.localStorage.setItem("token", data.token);
            window.localStorage.setItem("user", data.user);
            axios.defaults.headers.Authorization = data.token
        },
        setMessage(state, data) {
            state.message.push(data);
            setTimeout(() => state.message.shift(), 10000)
        },
        toggleTimeMeasure(state, data) {
            state.timeMeasure = !state.timeMeasure
        }
    },
    getters: {
        isLogined: (state) => !!state.token,
    },
    modules: {}
});
