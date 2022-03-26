<template>
    <div id="content-wrapper" class="d-flex flex-column" style="width: 95%">
        <v-app>
            <div id="" style="">
                <div class="container-fluid" style="" ref="frame">
                    <DetailSetting :show="setting.show" :toggle="toggleSetting" :setting="setting" :refresh="refresh" :chart-setting="chartSetting" :renderChart="renderChart" />
                    <div class="row">
                        <TrendChart ref="trendChart" v-if="displayAllPost" :post="postTrend" :chart-setting="chartSetting" :searchPost="handleSearchPost" :toggle="toggleSetting" />
                        <DetailChart ref="detailChart" v-else :post="postTrend" :chart-setting="chartSetting" :toggle="toggleSetting" />
                    </div>

                    <Loading v-if="isLoading" />
                    <div class="row" v-else>
                        <DetailTable :symbols="post" :switchChart="handleSwitchChart" ref="DetailTable" />
                    </div>
                </div>
            </div>
        </v-app>
    </div>
</template>

<script>
// @ is an alias to /src
import TrendChart from "@/components/TrendChart";
import DetailChart from "@/components/DetailChart";
import DetailTable from "@/components/DetailTable";
import Setting from "@/components/DetailSetting";
import Loading from "@/components/Loading";
import apiHandler from "@/lib/apiHandler";
import DetailSetting from "@/components/DetailSetting";
export default {
    name: "RedditPost",
    data() {
        return {
            postTrend: [],
            DetailChart: [],
            setting: {
                show: false,
                limit: 2000,
                minVote: 100,
                minComment: 100,
                maxYAxes: 2000,
                forum: "",
                dateRange: [], // [Date.now() - 86400000 * 7, Date.now()],
            },
            chartSetting: {
                minY: 0,
                maxY: 2000,
                show: "vote",
            },
            displayAllPost: true,
            post: [],
            searchTarget: "",
            errorMsg: [],
            isLoading: true,
        };
    },
    methods: {
        toggleSetting(bool = true) {
            this.setting.show = bool;
        },
        refresh(){
            this.fetchAllPostTrend()
            this.fetchPostDetails()
        },
        renderChart() {
            console.log("displayAllPost?",this.displayAllPost)
            const child = this.displayAllPost ? this.$refs.trendChart : this.$refs.detailChart;
            child.initData();
        },
        handleSwitchChart(symbol) {
            console.log(symbol);
            if (symbol) {
                this.fetchSpecifiedPostTrend(symbol);
            } else {
                this.fetchAllPostTrend();
            }
            this.displayAllPost = !this.displayAllPost;
        },
        handleSettingChange(key, value) {
            this.setting[key] = value;
        },
        handleSearchPost(post) {
            this.$refs.DetailTable.handleSearch(post);
        },
        fetchAllPostTrend() {
            this.isLoading = true;
            this.setting.dateRange.sort();
            const option = {
                url: "/post/trend",
                params: {
                    limit: this.setting.limit,
                    minVote: this.setting.minVote,
                    minComment: this.setting.minComment,
                    forum: this.setting.forum,
                    start: Date.parse(this.setting.dateRange[0]) || Date.parse(new Date(Date.now() - 86400000 * 7)),
                    end: Date.parse(this.setting.dateRange[1]) || Date.parse(new Date()),
                },
            };
            apiHandler(option, (response) => {
                console.log("response",response)
                this.postTrend = response;
                this.displayAllPost = true;
                this.isLoading = false;
                this.renderChart();
            });
        },
        fetchSpecifiedPostTrend(symbol) {
            this.isLoading = true;
            const option = {
                url: "/post/trendSymbol",
                params: {
                    limit: this.setting.limit,
                    symbol: symbol,
                },
            };
            apiHandler(option, (response) => {
                this.postTrend = response;
                this.isLoading = false;
                this.renderChart();
            });
        },
        fetchPostDetails() {
            this.isLoading = true;
            this.setting.dateRange.sort();
            const option = {
                url: "/post/lastest",
                params: {
                    limit: 2000,
                    start: Date.parse(this.setting.dateRange[0]) || Date.parse(new Date(Date.now() - 86400000 * 7)),
                    end: Date.parse(this.setting.dateRange[1]) || Date.parse(new Date()),
                },
            };
            apiHandler(option, (response) => {
                console.log(response);
                this.post = response;
                this.isLoading = false;
                //this.renderChart();
            });
        },
    },
    components: { TrendChart, DetailChart, DetailTable, Setting, Loading,DetailSetting },
    mounted() {
        this.refresh();
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
</style>
