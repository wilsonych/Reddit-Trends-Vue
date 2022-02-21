<template>
    <div :class="col ? col : 'col-6'">
        <div class="row">
            <label for="customRange1" class="form-label col-6">Forum</label>
            <div class="col-6">
                <select :value="model" @input="$emit('update:model', $event.target.value)" class="form-control">
                    <option></option>
                    <option v-for="target in targets" :key="target">{{ target }}</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "SettingSelect",
    props: ["tittle", "targets", "model", "col"],
};
</script>
