<template>
    <div class="card shadow mb-4 w-100">
        <div class="card-header py-3" width="100%">
            <div class="form-row align-items-center">
                <h6 class="m-0 font-weight-bold text-primary">Post Detail ({{ symbols.length }})</h6>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <v-text-field v-model="searchTarget" append-icon="mdi-magnify" label="Search" single-line hide-details clearable></v-text-field>
                <v-data-table :headers="headers" :items="symbols" :search="searchTarget" class="elevation-1">
                    <template v-slot:item.id="props">
                        <button @click="switchChart(props.item.id)" class="text-dark">
                            {{ props.item.id }}
                        </button>
                    </template>
                    <template v-slot:item.forum="props">
                        <span @click="searchTarget = props.item.forum">{{ props.item.forum }}</span>
                    </template>
                    <template v-slot:item.created="props">
                        {{ new Date(props.item.created).toLocaleString().slice(0, -3) }}
                    </template>
                    <template v-slot:item.updated="props">
                        {{ new Date(props.item.updated).toLocaleString().slice(0, -3) }}
                    </template>
                    <template v-slot:item.title="props">
                        <a
                            :href="`https://www.reddit.com/r/${props.item.forum}/comments/${props.item.id}`"
                            v-html="props.item.title.replace(new RegExp(searchTarget, 'i'), `<mark>${searchTarget}</mark>`)"
                        ></a>
                    </template>
                </v-data-table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["symbols", "switchChart"],
    methods: {
        handleSearch(val) {
            this.searchTarget = val;
        },
    },
    data() {
        return {
            searchTarget: "",
            headers: [],
            definedColumns: [
                { text: "ID", value: "id" },
                { text: "Forum", value: "forum" },
                { text: "Create at", value: "created" },
                { text: "Title", value: "title" },
                { text: "Update at", value: "updated" },
                { text: "Vote", value: "vote" },
                { text: "Comment", value: "comment" },
            ],
        };
    },
    async mounted() {
        /**
         * This make sure the table headers(definedColumns) exist in the symbols object keys
         */
        const sleep = async (s) => {
            return new Promise((resolve) => setTimeout(resolve, s * 1000));
        }
        let counter = 0
        while(!this.symbols[0]){
            await sleep(1)
            console.log("not data found")
            counter++
            if(counter==5) return
        }
        this.headers = this.definedColumns.filter((col) => this.symbols[0][col.value]);
    },
};
</script>
<style>
mark {
    background-color: yellow;
    color: black;
    padding: 0;
}
</style>
