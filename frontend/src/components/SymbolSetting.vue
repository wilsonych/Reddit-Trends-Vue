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
                        <Range tittle="Minimiun counter" min="0" max="15" :model.sync="symbolSetting.min" />
                        <Range tittle="Fetch limit" min="0" max="5000" :model.sync="symbolSetting.limit" />
                    </div>
                    <div class="row">
                        <Toggle tittle="Stock only" :model.sync="symbolSetting.adoptFilter" />
                        <Toggle tittle="Uppercase only" :model.sync="symbolSetting.uppercase" />
                    </div>                    
                    <div class="row">
                        <DateRange tittle="Date range" :model.sync="symbolSetting.dateRange" @click="symbolSetting.dateRange = $event" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger text-white" data-dismiss="modal" @click="_refresh">Refresh</button>
                    <button type="button" class="btn btn-primary text-white" data-dismiss="modal" @click="_save">Save</button>
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
    props: ["setting", "save", "refresh","symbolSetting", "show", "toggle"],
    data() {
        return {};
    },
    methods: {
        _refresh(){
            this.refresh()
            this.toggle(false);
        },
        _save() {
            this.toggle(false);
            this.save();
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
