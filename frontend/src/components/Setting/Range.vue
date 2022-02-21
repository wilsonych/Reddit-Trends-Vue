<template>
    <div :class="col?col:'col-6'" >
        <div class="row">
            <label for="customRange1" class="form-label col-8 mt-2">{{ tittle }}</label>
            <div class="col-4">
                <input class="form-control" type="text" :value="model" @input="$emit('update:model', $event.target.value)" />
            </div>
        </div>
        <input type="range" class="form-range w-100 mt-2" :min="min" :max="max" :value="model" @input="$emit('update:model', $event.target.value)" />
    </div>
</template>
<script>
export default {
    name: "SettingRange",
    props: ["tittle", "min", "max", "model","col"],
};
</script>
