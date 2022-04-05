<template>
    <div class="flex-fill d-flex align-items-center">
        <div class="container-fluid text-center w-50">
            <form>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" v-model="username" />
                </div>
            </div>
            <div class="form-group row">
                <label for="inputPassword" class="col-sm-2 col-form-label">Password </label>
                <div class="col-sm-10">
                    <input type="password" class="form-control" v-model="password" />
                </div>
            </div>

            <div class="form-group row justify-content-center">
                <button class="btn btn-primary text-white" @click="login" type="submit">Login</button>
                <button class="btn btn-primary text-white" @click="$router.push({ name:'Register' })" type="button">Register</button>
            </div>
            
            <Loading v-if="isLoading" />
            </form>
        </div>
    </div>
</template>
<script>
import Loading from "@/components/Loading";
import apiHandler from "@/lib/apiHandler";

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            message: null,
            isLoading: false,
        };
    },
    components: { Loading },
    methods: {
        login(e) {
            e.preventDefault();
            if(!this.username || !this.password) return this.$store.commit("setMessage", { type: "error", message: "Username and password are required" })
            this.isLoading = true;
            
            const option = {method:"post",url:"/user/signin",data:{
                username: this.username,
                password: this.password,
            }}
            
            apiHandler(option,(response)=>{
                const token = "Bearer " + response.token;
                const user = response.user;
                this.$store.commit("login", {token:token,user:user});
                this.$router.push({ name: "Dashboard" });
                this.isLoading = false;
            })
        },
    },
};
</script>
