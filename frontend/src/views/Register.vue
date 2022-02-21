<template>
    <div class="flex-fill d-flex align-items-center">
        <div class="container-fluid text-center w-50">
            <form>
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-4 col-form-label">Username</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" v-model="username" />
                    </div>
                </div>
                <div class="form-group row" >
                    <label for="inputPassword" class="col-sm-4 col-form-label">Password </label>
                    <div class="col-sm-8">
                        <input type="password" class="form-control" v-model="password.password" />
                    </div>
                </div>
                <div class="form-group row" >
                    <label for="inputPassword" class="col-sm-4 col-form-label">Confirm password </label>
                    <div class="col-sm-8">
                        <input type="password" class="form-control" v-model="password.confirm" />
                    </div>
                </div>
                <div class="form-group row justify-content-center" >
                    <button class="btn btn-primary text-white" @click="reg" type="submit">Register</button>
                    <button class="btn btn-secondary text-white" type="reset">Reset</button>
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
    data() {
        return {
            username: "",
            password: {
                password: "",
                confirm: "",
            },
            isLoading: false,
        };
    },
    components: { Loading },
    methods: {
        reg(e) {
            e.preventDefault();
            if(this.password.password!=this.password.confirm) return this.$store.commit("setMessage", { type: "error", message: "Password not match" })
            
            const option = {
                method: "post",
                url: "/user/signup",
                data: {
                    username: this.username,
                    password: this.password.password,
                },
            };

            apiHandler(option, (response) => {
                const token = "Bearer " + response.token;
                const user = response.user;
                this.$store.commit("login", {token:token,user:user});
                this.$store.commit("setMessage", { type: "", message: "Register success" }) 
                this.$router.push({ name: "Home" });
                this.isLoading = false;
            });
        },
    },
};
</script>
