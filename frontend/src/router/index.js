import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Post from "@/views/Post.vue";
import Login from "@/views/Login.vue";
import Symbols from "@/views/Symbols.vue";
import User from "@/views/User";
import Register from "@/views/Register";
import store from "@/store/index.js";
import Index from "@/views/Index"

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Index,
        props: true,
    },
    {
        path: "/reg",
        name: "Register",
        component: Register,
        props: true,
    },
    {
        path: "/post",
        name: "RedditPost",
        component: Post,
        props: true,
        meta: {
            requireLogin: true,
        },
    },
    {
        path: "/user",
        name: "User",
        component: User,
        props: true,
        meta: {
            requireLogin: true,
        },
    },
    {
        path: "/symbol",
        name: "Symbol",
        component: Symbols,
        meta: {
            requireLogin: true,
        },
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requireLogin) {
        if (!store.getters.isLogined) {
            const token = window.localStorage.getItem("token");
            if (!token) {
                next({ name: "Login" });
            } else {
                store.commit("setToken", token);
            }
        }
    }
    next();
});

export default router;
