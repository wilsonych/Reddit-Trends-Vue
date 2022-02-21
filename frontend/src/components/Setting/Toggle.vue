<template>
    <div :class="col ? col : 'col-6'">
        <div class="row">
            <label for="customRange1" class="form-label col-8 mt-2">{{ tittle }}</label>
            <div class="col-4">
                <button type="button text-white" class="btn  btn-block" :class="model ? 'btn-primary' : 'btn-danger'" @click="$emit('update:model', !model)">
                    {{ model ? "Yes" : "No" }}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "SettingToggle",
    props: ["tittle", "model", "col"],
};
</script>
