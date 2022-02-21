<template>
    <Center>
        <img class="" src="img/loading.gif" />
        <div class="row center">
            <h2 class="center">Loading...</h2>
        </div>
    </Center>
</template>
<script>
import Center from "@/components/Center";
export default {
    components: { Center },
};
</script>

<style>
.center {
    margin: auto;
    padding: 10px;
}
* {
    color: rgb(133, 135, 150);
}
</style>
