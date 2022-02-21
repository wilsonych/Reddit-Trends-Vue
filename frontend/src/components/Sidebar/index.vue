<template>
    <!-- Sidebar -->
    <ul class="navbar-nav bg-gradient-dark sidebar sidebar-dark accordion" id="accordionSidebar" ref="accordionSidebar">
        <!-- Sidebar - Brand -->
        <a class="sidebar-brand d-flex align-items-center justify-content-center">
            <div class="sidebar-brand-icon rotate-n-15">
                <i class="fas fa-laugh-wink"></i>
            </div>
            <div class="sidebar-brand-text mx-3">Reddit Trend</div>
        </a>

        <hr class="sidebar-divider my-0" />
        <div class="sidebar-heading">Identify</div>
        <Nav :text="this.$store.state.user || 'Not login'" target="/user" icon="fa-user" />

        <hr class="sidebar-divider my-0" />
        <div class="sidebar-heading">Main</div>
        <Nav text="Dashboard" target="/" icon="fa-home" />
        <Nav text="Reddit Post" target="/post" icon="fa-mail-bulk" />
        <Nav text="Symbol Trend" target="/symbol" icon="fa-poll-h" />

        <Nav text="Login" v-if="!isLogined" target="/Login" icon="fa-fingerprint"  />
        <Nav text="Logout" v-else target="/" @click.native="logout" icon="fa-id-badge"/>

        <!-- Divider -->
        <div v-if="isLogined">      
            <hr class="sidebar-divider my-0" />
            <div class="sidebar-heading">Endpoint</div>
            <Nav :text="$store.state.endpoint" target="/" @click.native="isEditing=!isEditing"/>
            <Nav v-if="isEditing" text="Edit endpoint" target="/" icon="fa-edit">
                <input class="form-control" type="text" v-model="endpoint" @input="editEndpoint"/>
            </Nav>  

            <hr class="sidebar-divider d-none d-md-block" />
            <div class="sidebar-heading">Time measure</div>
            <Nav :text="this.$store.state.timeMeasure?' ON':' OFF'" target="/" @click.native="toggleTimeMeasure" icon="fa-clock" />
        </div>

        <!-- Sidebar Toggler (Sidebar) -->
        <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle" @click="sidebarToggle"></button>
        </div>
    </ul>
    <!-- End of Sidebar -->
</template>
<script>
import Nav from "@/components/Sidebar/Nav";
import {endpoint} from "@/store"
export default {
    data() {
        return {
            isEditing:false,
            endpoint:""
        };
    },
    computed: {
        isLogined: function() {
            return this.$store.getters.isLogined;
        },
    },
    methods: {
        sidebarToggle() {
            this.$parent.sidebarToggle();
        },
        logout() {
            this.$store.commit("logout", {});
        },
        toggleTimeMeasure(){
            this.$store.commit("toggleTimeMeasure",{})
        },
        editEndpoint(){
            this.$store.commit("setEndpoint",this.endpoint?this.endpoint:endpoint)
        }
    },
    components: { Nav },
};
</script>
