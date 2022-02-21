<template>
    <div class="dialog">
        <Message v-for="message in $store.state.message" :key="message.msg" :message="message"/>
    </div>
</template>
<script>
import Message from "./Message.vue"
export default {    
    components: { Message },
};
</script>
<style>
.dialog {
    z-index: 2000;
    position: fixed;
    right: 1%;
    top:1%
}
</style>
