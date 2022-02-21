<template>
    <div class="card shadow" :class="borderColor">
        <div class="card-body p-3">
            <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                    <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        {{ tittle }}
                    </div>
                    <slot></slot>
                    <div class="h5 mb-0 font-weight-bold text-gray-800">                        
                        {{ content }}
                    </div>
                </div>
                <div class="col-auto">
                    <i class="fas fa-2x text-gray-300" :class="icon || ''"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import apiHandler from "@/lib/apiHandler";
export default {
    data() {
        return {
            theme: ["primary", "secondary", "success", "danger", "warning", "info", "dark"],
            content:"",
            borderColor:""
        };
    },
    created() {
        console.log( this.border)
        this.borderColor = this.border==""?`border-left-${this.theme[Math.floor(Math.random() * this.theme.length)]}`:""
        const fetchOption = { method: "get", url: this.target };
        if (this.target) {
            this.content="Loading..."
            apiHandler(fetchOption, (result) => {
                if (this.custHandler) return (this.content = this.custHandler(result));
                result = this.date != null ? new Date(result) : parseInt(result);
                this.content = result.toLocaleString();
            });
        }
    },
    props: ["tittle", "icon", "target", "date", "custHandler","border"],
};
</script>
