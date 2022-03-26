<template>
    <div class="card shadow mb-4 w-100">
        <div class="card-header py-3" width="100%">
            <div class="form-row d-flex justify-content-between">
                <h6 class="my-auto font-weight-bold text-primary">
                    Details on {{ chartSetting.show }}
                </h6>
                <button @click="toggle" class="btn btn-primary btn-sm">
                    Setting
                </button>
            </div>
        </div>

        <div
            class="card-body"
            ref="body"
            width="900"
            height="450"
            style="position: relative; z-index: 1; padding: 0"
        >
            <canvas ref="myChart" width="900" height="450"> </canvas>
        </div>
    </div>
</template>
<script>
import Chart from "chart.js";
export default {
    data() {
        return {
            loading: true,
            url: "",
            postTrend: {},
            chart: "",
            canvas: null,
        };
    },
    /** 
    watch: {
        post: function () {
            this.initData();
        },
    },
    */
    props: ["post", "chartSetting", "toggle"],
    methods: {
        async initData() {
            let counter = 0;
            const sleep = async (s) => {
                return new Promise((resolve) => setTimeout(resolve, s * 1000));
            };
            while (!this.post.length && counter < 10) {
                await sleep(0.5);
                counter++;
            }

            var labels = [];
            var comment = [];
            var vote = [];
            this.post.forEach((x) => {
                comment.unshift(x.comment);
                vote.unshift(x.vote);
                labels.unshift(x.updated);
            });

            this.buildChart({
                datasets: [
                    {
                        data: vote,
                        label: "Vote",
                        backgroundColor: "rgba(255,255, 255,0)",
                        borderColor: "rgb(51,0, 255)",
                    },
                    {
                        data: comment,
                        label: "Comment",
                        backgroundColor: "rgba(255,255, 255,0)",
                        borderColor: "rgb(255,0, 0)",
                    },
                ],
                labels: labels,
            });
        },
        buildChart(data) {
            if (this.chart) {
                this.chart.destroy();
            }
            const ctx = this.$refs.myChart;
            var self = this;
            this.chart = new Chart(ctx, {
                type: "line",
                data: data,
                options: {
                    elements: {
                        point: {
                            radius: 2,
                        },
                    },
                    animation: {
                        duration: 1000,
                        onComplete: function (animation) {
                            self.loading = false;
                        },
                    },
                    hover: {
                        animationDuration: 0, // duration of animations when hovering an item
                    },
                    responsiveAnimationDuration: 0,
                    ticks: {
                        autoSkip: true,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    callback: function (value) {
                                        return new Date(value)
                                            .toLocaleString()
                                            .replace(/\/2021|\/2022/g, "")
                                            .slice(0, -6); // delete 2021 and second
                                    },
                                    autoSkip: true,
                                    maxTicksLimit: 20,
                                },
                            },
                        ],
                    },
                    legend: {
                        display: false,
                    },
                },
            });
        },
    },
};
</script>
