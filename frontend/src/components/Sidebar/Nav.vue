<template>
    <li class="nav-item active">
        <a class="nav-link">
            <i class="fa" :class="icon || 'fa-tachometer-alt'"></i>
            <router-link :to="target">                
                <span style="color: white">{{ text }}</span>
                <slot></slot>
            </router-link>
        </a>
    </li>
</template>
<script>
export default {
    props: ["text", "target", "icon"],
};
</script>
