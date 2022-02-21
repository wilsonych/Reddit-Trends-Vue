<template>
    <div class="container-fluid h-100">
        <div class="row center mt-10">
            <h1 class="center">Dashboard</h1>
        </div>
        <div class="row center h-50 py-0">
            <Chart />
            <div class="col-xl-6 mb-4 d-flex flex-column justify-content-between">
                <Card tittle="Post total" target="/count/post" icon="fa-calculator" border/>
                <Card tittle="Trend total" target="/count/post_trend" icon="fa-globe-americas" border/>
                <Card tittle="Last update" target="/count/last" date icon="fa-clock" border/>
                <Card tittle="Memory" target="/status/ram" date icon="fa-memory" :custHandler="handleMenoryCard" border/>
            </div>
        </div>
        <div class="row center h-40 py-0">
            <Docker/>
        </div>   
    </div>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Home/Card";
import Chart from "@/components/Home/Chart";
import Docker from "@/components/Home/Docker";
export default {
    name: "Home",
    components: { Card, Chart ,Docker},
    methods: {
        handleMenoryCard(result) {
            console.log(result)
            return `${result.total-result.free} / ${result.total} MB`
        },
    },
};
</script>
<style>
.center {
    margin: auto;
    padding: 10px;
}
</style>
