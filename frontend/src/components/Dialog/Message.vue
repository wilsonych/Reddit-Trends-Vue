<template>
    <div class="alert visible" :class="message.type === 'error' ? 'alert-danger' : 'alert-primary'" role="alert">
        <pre>{{message.message}}</pre>
    </div>
</template>
<script>
export default {
    props: ["message"],
};
</script>
<style>
.visible {
    animation: fadeIn linear 1s;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

</style>
