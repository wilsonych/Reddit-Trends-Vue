<template>
    <div class="modal fade" :class="show ? 'show' : ''" :style="`display:${show ? 'block' : 'none'}`" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Setting</h5>
                    <button type="button" class="close" @click="toggle(false)">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <Range tittle="Min Vote" min="0" max="200" col="col-6" :model.sync="setting.minVote" />
                        <Range tittle="Min Comment" min="0" max="200" col="col-6" :model.sync="setting.minComment" />
                    </div>
                    <div class="row">
                        <Range tittle="Limit" min="1000" max="3000" col="col-6" :model.sync="setting.limit" />
                        <Select tittle="Forum" col="col-6" :model.sync="setting.forum" :targets="forums" />
                    </div>
                    <div class="row">
                        <DateRange tittle="Date range" col="col-6" :model.sync="setting.dateRange" @click="setting.dateRange = $event" />          
                    </div>
                    <hr class="dropdown-divider" />
                    <div class="row">
                        <Range tittle="Max Y Axes" min="1000" max="4000" col="col-6" :model.sync="chartSetting.maxY" />
                        <div class="col-6">
                            <label for="customRange1" class="form-label">Display</label>
                            <div class="text-white d-flex justify-content-end mx-0">
                                <button class="btn ml-1" :class="chartSetting.show == 'vote' ? 'btn-primary' : 'btn-light'" @click="chartSetting.show = 'vote'">Vote</button>
                                <button class="btn ml-1" :class="chartSetting.show == 'comment' ? 'btn-primary' : 'btn-light'" @click="chartSetting.show = 'comment'">Comment</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary text-white" @click="_refresh">Refresh</button>
                    <button type="button" class="btn btn-primary text-white" @click="render">Render</button>
                    <button type="button" class="btn btn-secondary text-white" data-dismiss="modal" @click="toggle(false)">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Range from "@/components/Setting/Range.vue";
import Select from "@/components/Setting/Select.vue";
import DateRange from "@/components/Setting/DateRange";
import Toggle from "@/components/Setting/Toggle";

export default {
    props: ["setting", "refresh", "chartSetting", "show", "toggle","renderChart"],
    data() {
        return {
            forums: ["SPACs", "stocks", "wallstreetbets", "CryptoCurrency", "SatoshiStreetBets"],
            display: false,
            y: 0,
        };
    },
    methods: {
        _refresh(){
            this.toggle(false)
            this.refresh()
        },
        render() {
            this.toggle(false)
            this.renderChart()
        },
    },
    components: { Range, Select, DateRange, Toggle },
};
</script>

<style>
.fade {
    background: rgba(0, 0, 0, 0.5);
}
</style>
