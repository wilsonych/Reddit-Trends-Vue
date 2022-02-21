<template>
    <div class="justify-content-center w-100 mt-2">
        <ul class="pagination justify-content-center">
            <li class="page-item" :class="[pagination.current == 1 ? 'disabled' : '']">
                <a class="page-link" @click="handlePageClick(pagination.current - 1)" href="#" tabindex="-1">Previous</a>
            </li>
            <li class="page-item" v-for="p in Math.ceil(totalItem / pagination.itemsPerPage)" v-bind:key="p" :class="p == pagination.current ? 'active' : ''">
                <a class="page-link" @click="handlePageClick(p)" href="#">{{ p }}</a>
            </li>

            <li class="page-item" :class="pagination.current == Math.ceil(totalItem / pagination.itemsPerPage) ? 'disabled' : ''">
                <a class="page-link" @click="handlePageClick(pagination.current + 1)" href="#">Next</a>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: "Pagination",
    props: ["pagination", "totalItem", "handlePageClick"],
};
</script>
