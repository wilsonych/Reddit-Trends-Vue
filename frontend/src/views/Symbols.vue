<template>
    <div id="content-wrapper" class="d-flex flex-column" style="width: 95%">
        <v-app>
            <div id="" style="">
                <div class="container-fluid" style="" ref="frame">
                    <Setting :show="symbolSetting.show" :toggle="toggleSetting" :symbolSetting="symbolSetting" :save="save" :refresh="fetchPostDetails"/>
                    <div class="row">
                        <Loading v-if="isLoading" />
                        <SymbolsTable
                            v-else
                            :keywords="keywords"
                            :searchPost="handleSearchPost"
                            :toggle="toggleSetting"
                            :tittle="`Keywords Trend ${this.symbolSetting.dateRange[0] || new Date(Date.now() - 86400000 * 7).toLocaleDateString().replace(/\//g, '-')} to ${
                                this.symbolSetting.dateRange[1] || new Date().toLocaleDateString().replace(/\//g, '-')
                            }`"
                        />
                    </div>

                    <div class="row">
                        <DetailTable v-if="!isLoading" :symbols="post" ref="DetailTable" :switchChart="(e) => {}" />
                    </div>
                </div>
            </div>
        </v-app>
    </div>
</template>

<script>
// @ is an alias to /src
import SymbolsTable from "@/components/SymbolsTable";
import Setting from "@/components/SymbolSetting";
import DetailTable from "@/components/DetailTable";
import Loading from "@/components/Loading";
import filter from "../data/filter.js";
import symbols from "../data/symbol.js";

import apiHandler from "@/lib/apiHandler";

export default {
    name: "RedditPost",
    /** 
    watch: {
        symbolSetting: {
            handler: function (val, oldVal) {
                this.filterKeywords();
            },
            deep: true,
        },
    },
    */
    data() {
        return {
            isLoading: true,
            keywords: [],
            post: [],
            symbolSetting: {
                show: false,
                min: 1,
                uppercase: false,
                adoptFilter: false,
                dateRange: [],
                limit: 3000,
            },
        };
    },
    methods: {
        save() {
            this.filterKeywords();
        },
        toggleSetting(bool = true) {
            this.symbolSetting.show = bool;
        },
        handleSearchPost(s) {
            this.$refs.DetailTable.handleSearch(s);
        },
        filterKeywords(posts) {
            const keys = {};
            this.keywords = [];
            this.post.forEach((x) => {
                const title = x.title.replace(/[^A-Za-z0-9 ]/g, ""); //.toLowerCase();

                title.split(" ").forEach((word) => {
                    if (word == "") return;
                    if (word.match(/[0-9]/) || filter.includes(word.toLowerCase())) return;
                    if (this.symbolSetting.adoptFilter && !symbols.includes(word)) return;
                    if (this.symbolSetting.uppercase && word != word.toUpperCase()) return;
                    if (keys[word]) {
                        keys[word] = keys[word] + 1;
                    } else {
                        keys[word] = 1;
                    }
                });
            });

            this.keywords = Object.keys(keys)
                .filter((key) => keys[key] > this.symbolSetting.min)
                .map((key) => ({ key: key, count: keys[key] }));
        },
        fetchPostDetails() {
            this.isLoading = true;
            this.symbolSetting.display = false;
            this.symbolSetting.dateRange.sort();

            const option = {
                method: "get",
                url: "/post/lastest",
                params: {
                    start: Date.parse(this.setting.dateRange[0]) || Date.parse(new Date(Date.now() - 86400000 * 7)),
                    end: Date.parse(this.setting.dateRange[1]) || Date.parse(new Date()),
                    limit: this.symbolSetting.limit,
                },
            };

            apiHandler(option, (response) => {
                console.log(response);
                this.post = response;
                this.filterKeywords();
                this.isLoading = false;
            });
        },
    },
    components: {
        SymbolsTable,
        Setting,
        Loading,
        DetailTable,
        Setting,
    },
    mounted() {
        this.fetchPostDetails();
    },
};
</script>
<style>
.mt-alerts {
    position: fixed;
    z-index: 999;
    left: 50%;
    top: 1%;
}
.list-group {
    max-height: 700px;
    margin-bottom: 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
}
</style>
