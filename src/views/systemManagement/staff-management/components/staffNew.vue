<template>
    <d2-container class="address-book">
        <el-card class="box-card">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm"/>
        </el-card>
    </d2-container>
</template>
<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
let that = this
let temDb = ''
export default {
    name: "index",
    components: {},
    data() {
        return {
            jsonData: {},
            remoteFuncs: {},
            values: {
                
            },
            transform:{
                isShowDetails: true
            },
        }
    },
    methods:{
        valueChange(field, val, model){

        }
    },
    async created () {
        that = this
        
    },
    async mounted() {
        formGetJson({ code: 'staffManagement' }).then(res => {
            this.jsonData = JSON.parse(res)
        })
    }
}
</script>

<style scoped lang="scss">

</style>