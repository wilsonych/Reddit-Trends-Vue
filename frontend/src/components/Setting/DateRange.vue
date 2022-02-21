<template>
    <div :class="col ? col : 'col-6'">
        <div class="row">
            <label for="customRange1" class="form-label col-8 mt-2">{{ tittle }}</label>
            <div class="col-4">
                <button v-if="!picker" type="button text-white" class="btn btn-primary" @click="picker = !picker">Show</button>
                <button v-else type="button text-white" class="btn btn-secondary" @click="picker = !picker">Close</button>
            </div>
        </div>
        <div class="row mt-1 text-white">
            <v-date-picker v-if="picker" v-model="dateRange" range elevation="15" width="100%"></v-date-picker>
        </div>
    </div>
</template>
<script>
export default {
    name: "SettingDateRange",
    props: ["tittle", "min", "max", "model", "col"],
    computed: {
        dateRange: {
            get() {
                return this.model;
            },
            set(val) {
                this.$emit("click", val);
            },
        },
    },
    data() {
        return {
            picker: false,
        };
    },
};
</script>
<style>
.text-white .v-picker__title__btn,
.text-white .v-picker__title__btn * {
    color: white !important;
}
</style>
