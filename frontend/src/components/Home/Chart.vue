<template>
    <div class="col-xl-6 col-md-12 mb-4">
        <div class="card shadow h-100 w-100 py-2 border-left-primary">
            <div class="card-body">
                <div class="row no-gutters align-items-center h-100">
                    <canvas ref="dashboardChart"> </canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Chart from "chart.js";
import apiHandler from "@/lib/apiHandler";
export default {
    methods: {
        buildChart(labels, datas, color) {
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: "Post count of each forum",
                        data: datas,
                        backgroundColor: color,
                        hoverOffset: 4,
                    },
                ],
            };
            const ctx = this.$refs.dashboardChart;
            new Chart(ctx, {
                type: "doughnut",
                data: data,
            });
        },
        fetchForum() {
            const random255 = () => {
                return Math.floor(Math.random() * 200);
            };
            const randomCol = () => {
                return `rgb(${random255()},${random255()}, ${random255()})`;
            };
            const option = { url: "/count/forum" };

            apiHandler(option, (response) => {
                const labels = [];
                const data = [];
                const color = [];
                response.forEach((x) => {
                    labels.push(x.forum);
                    data.push(x.count);
                    color.push(randomCol());
                });
                this.buildChart(labels, data, color);
            });
        },
    },
    created() {
        this.fetchForum();
    },
};
</script>
