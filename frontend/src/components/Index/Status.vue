<template>
    <div class="col my-3 h-100">
        <div class="row d-flex justify-content-center">
            <div class="col-xl-2">
                <i class="fas fa-2x text-gray-300" :class="icon || ''"></i>
            </div>
            <div class="col-xl-4">
                <div class="row font-weight-bold"><h2 class="h5">{{ tittle }}</h2></div>
                <div class="row"><p class="mb-0">{{ content }}</p></div>
            </div>
        </div>
    </div>
</template>
<script>
import apiHandler from "@/lib/apiHandler";
export default {
    data() {
        return {
            content: "",
        };
    },
    created() {
        const fetchOption = { method: "get", url: this.target };
        if (this.target) {
            this.content = "Loading...";
            apiHandler(fetchOption, (result) => {
                if (this.custHandler) return (this.content = this.custHandler(result));
                result = this.date != null ? new Date(result) : parseInt(result);
                this.content = result.toLocaleString();
            });
        }
    },
    props: ["icon", "tittle", "target", "date", "custHandler", "info"],
};
</script>
