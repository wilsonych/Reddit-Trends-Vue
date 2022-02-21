<template>
    <div class="card shadow mb-4 w-100">
        <div class="card-header py-3" width="100%">
            <div class="form-row d-flex justify-content-between">
                <h6 class="my-auto font-weight-bold text-primary">Trend on {{ chartSetting.show }}</h6>
                <button @click="toggle" class="btn btn-primary btn-sm">Setting</button>
            </div>
        </div>

        <div class="card-body" ref="body" width="900" height="450" style="position: relative; z-index: 1; padding: 0">
            <canvas ref="myChart" width="900" height="450"> </canvas>
        </div>
    </div>
</template>
<script>
import Chart from "chart.js";
import moment from "moment";

export default {
    data() {
        return {
            loading: true,
            chart: "",
            canvas: null,
        };
    },
    /**
    watch: {
        post: function () {
            this.initData();
        },
        "chartSetting.show"() {
            this.initData();
        },
    },
     */
    props: ["post", "chartSetting", "searchPost", "toggle"],

    methods: {
        buildChart(data) {
            const formatDate = (value) => moment(String(value)).format("DD/MM hh:mm");
            if (this.chart) {
                this.chart.destroy();
            }
            const ctx = this.$refs.myChart;
            this.chart = new Chart(ctx, {
                type: "line",
                data: data,
                options: {
                    elements: {
                        point: {
                            radius: 2,
                        },
                    },
                    tooltips: {
                        callbacks: {
                            title: function (tooltipItems, data) {
                                const d = data.datasets[tooltipItems[0].datasetIndex].data[tooltipItems[0].index].x;
                                return new Date(d).toLocaleString();
                            },
                        },
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
                                    callback: (value) => new Date(value).toLocaleString().replace(/\/2021|\/2022/g, ""), //formatDate(new Date(parseInt(value))),
                                },
                            },
                        ],
                    },
                    legend: {
                        display: false,
                    },
                    onClick: (evt) => {
                        const firstPoint = this.chart.getElementAtEvent(evt)[0];

                        if (firstPoint) {
                            const label = this.chart.data.datasets[firstPoint._datasetIndex].label;
                            this.searchPost(label);
                        }
                    },
                },
            });
        },
        async initData() {
            let counter =0
            const sleep = async (s) => {
                return new Promise((resolve) => setTimeout(resolve, s * 1000));
            }            
            while (!this.post.length && counter<10){
                await sleep(0.5)                
                counter++
            }
            const random255 = () => {
                return Math.floor(Math.random() * 255);
            };
            const randomCol = () => {
                return `rgb(${random255()},${random255()}, ${random255()})`;
            };
            const lineChartData = this.post.reduce(
                (chartData, row) => {
                    const labels = chartData.labels;
                    const datasets = chartData.datasets;
                    if (!labels.includes(row.updated)) {
                        labels.unshift(row.updated);
                    }

                    if (!datasets[row.id]) {
                        datasets[row.id] = new Object({
                            label: row.id,
                            backgroundColor: "rgba(255,255, 255,0)",
                            borderColor: randomCol(),
                            data: [],
                        });
                    } else {
                        // Get the vote or commend
                        const value = parseInt(row[this.chartSetting.show]);
                        if (value > this.chartSetting.minY && value < this.chartSetting.maxY) {
                            datasets[row.id].data.unshift({
                                x: row.updated,
                                y: value,
                            });
                        }
                    }

                    return { labels: labels, datasets: datasets };
                },
                { labels: [], datasets: [] }
            );

            lineChartData.datasets = Object.values(lineChartData.datasets);

            this.buildChart(lineChartData);
        },
    },
};
</script>
<style>
.loading {
    position: absolute;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    overflow: auto;
    /* Enable scroll if needed */
    width: 100%;
    height: 100%;
}
</style>
