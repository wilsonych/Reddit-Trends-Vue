<template>
    <div id="wrapper">
        <SideBar v-bind:class="{ toggled: isActive }" />
        <Dialog />
        <router-view />
    </div>
</template>

<script>
import SideBar from "@/components/Sidebar";
import Dialog from "@/components/Dialog";
import axios from "axios";

export default {
    name: "App",
    data() {
        return {
            isActive: false,
        };
    },
    methods: {
        sidebarToggle() {
            this.isActive = !this.isActive;
        },
        checkLogin() {
            const token = window.localStorage.getItem("token");
            const user = window.localStorage.getItem("user");

            if (token) {
                axios.defaults.headers.Authorization = token;
                this.$store.commit("login", {token:token,user:user});
            }
        },
    },
    components: {
        SideBar,
        Dialog,
    },
    created() {
        this.checkLogin();
    },
};
</script>
<style>
.v-application {
    font-weight: 500;
}
</style>
