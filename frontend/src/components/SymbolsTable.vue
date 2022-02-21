<template>
    <div class="card shadow mb-4 w-100">
        <div class="card-header py-3" width="100%">
            <div class="form-row d-flex justify-content-between">
                <h6 class="m-0 font-weight-bold text-primary">
                    {{ tittle }}
                </h6>
                <button @click="toggle" class="btn btn-primary btn-sm">Setting</button>
            </div>
        </div>
        <div class="card-body">
            <v-data-table :items="keywords" :headers="headers" dense class="elevation-1">
                <template v-slot:item.key="props">
                    <span @click="searchPost(props.item.key)">{{ props.item.key }}</span>
                </template>
            </v-data-table>
        </div>
    </div>
</template>
<script>
export default {
    name: "SymbolsTable",
    props: ["keywords", "searchPost", "tittle","toggle"],
    data() {
        return {
            headers: [
                { text: "key", value: "key" },
                { text: "count", value: "count" },
            ],
        };
    },
};
</script>
