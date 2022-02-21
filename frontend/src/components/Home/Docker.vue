<template>
    <div class="col-xl-12">
        <div class="row">
            <div class="w-50" v-for="id in ids" :key="id">
                <Card class="m-2"  :tittle="containers[id].name" icon="fa-box">
                    <div class="text-xs row">
                        <div class="col-6"><b>Image: </b>{{ containers[id].image }}</div>
                        <div class="col-6"><b>Started: </b>{{ new Date(parseInt(containers[id].started)).toLocaleString().slice(0, -3) }}</div>
                    </div>
                    <div class="text-xs row">
                        <div class="col-6" v-if="containers[id].memUsage">
                            <b>CPU: </b>{{ containers[id].cpuPercent }}%
                            <div class="progress">
                                <div class="progress-bar bg-success" role="progressbar" :style="`width: ${containers[id].cpuPercent}%`" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                        <div class="col-6" v-if="containers[id].cpuPercent">
                            <b>Mem: </b>{{ containers[id].memUsage }}/{{ containers[id].memLimit }} MB
                            <div class="progress">
                                <div class="progress-bar bg-info" role="progressbar" :style="`width: ${(containers[id].memUsage/containers[id].memLimit)*100}%`" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
import apiHandler from "@/lib/apiHandler";
import Card from "@/components/Home/Card";
export default {
    components: { Card },
    data() {
        return {
            theme: ["primary", "secondary", "success", "danger", "warning", "info", "dark"],
            containers: {},
            ids: [],
        };
    },
    methods: {
        fetchStatus() {
            const fetchOption = { method: "get", url: "/status/containerStatus" };
            apiHandler(fetchOption, (result) => {
                result.forEach((el) => {
                    this.containers[el.id] = { ...this.containers[el.id], ...el };
                });
            });
        },
        fetchStatusWebsocket() {
            console.log(process.env.VUE_APP_WS_ADDRESS)
            const ws = new WebSocket(process.env.VUE_APP_WS_ADDRESS);
            ws.onopen = () => {
                console.log("open connection");
            };

            ws.onclose = () => {
                console.log("close connection");
                this.fetchStatus()
            };

            ws.onmessage = (event) => {
                JSON.parse(event.data).forEach((el) => {
                    this.containers[el.id] = { ...this.containers[el.id], ...el };
                });
            };
        },
    },
    created() {
        const fetchOption = { method: "get", url: "/status/containerInfo" };
        apiHandler(fetchOption, (result) => {
            this.ids = result.map((con) => {
                this.$set(this.containers, con.id, {
                    name: con.name,
                    image: con.image,
                    started: con.started,
                    memUsage: null,
                    cpuPercent: null,
                    memLimit: null,
                });
                return con.id;
            });
            this.fetchStatusWebsocket();
        });
    },
    props: [],
};
</script>
