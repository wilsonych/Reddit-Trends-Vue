<template>
    <div class="flex-fill d-flex align-items-center">
        <div class="container-fluid text-center w-50">
            <form>
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-4 col-form-label" disable>Username</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" v-model="username" />
                    </div>
                </div>
                <div class="form-group row" v-if="isEditing">
                    <label for="inputPassword" class="col-sm-4 col-form-label">Old password </label>
                    <div class="col-sm-8">
                        <input type="password" class="form-control" v-model="password.old" />
                    </div>
                </div>
                <div class="form-group row" v-if="isEditing">
                    <label for="inputPassword" class="col-sm-4 col-form-label">New password </label>
                    <div class="col-sm-8">
                        <input type="password" class="form-control" v-model="password.new" />
                    </div>
                </div>
                <div class="form-group row justify-content-center" v-if="isEditing">
                    <button class="btn btn-primary text-white" @click="login" type="submit">Submit</button>
                    <button class="btn btn-secondary text-white" type="reset">Reset</button>
                </div>
                
                <button v-else class="btn btn-primary text-white" @click="isEditing = !isEditing" type="button">Change password</button>
                
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
                old: "",
                new: "",
            },
            isEditing: false,
            isLoading: false,
        };
    },
    components: { Loading },
    methods: {
        login(e) {
            e.preventDefault();
            
            const option = {
                method: "put",
                url: "/user",
                data: {
                    username: this.username,
                    newPassword: this.password.new,
                    oldPassword:this.password.old
                },
            };

            apiHandler(option, (response) => {           
                this.$store.commit("setMessage", { type: "", message: response })     
                this.$router.push({ name: "Home" });
                this.isLoading = false;
            });
        },
    },
    mounted(){
        this.username=this.$store.state.user
    }
};
</script>
