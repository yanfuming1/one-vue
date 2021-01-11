<template>
<div class="cer-back">
    <fm-generate-form
        :data="jsonData"
        :remote="remoteFunctions"
        :value="values"
        ref="generateForm"
        @on-change="selectChange"/>
</div>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { CERTIFICATE } from '../../../../../enum/FORMCODE'
    let that = this
    export default {
        name: "giveBack",
        props: {
            backInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data () {
            return {
                jsonData: {},
                remoteFunctions:{
                },
                values: {}
            }
        },
        methods: {
            selectChange() {

            },
            getData () {
                this.$refs.generateForm.getData().then(data => {
                    that.$emit('backData', data)
                })
            }
        },
        mounted() {
            that = this
            this.values = this.backInfo
            formGetJson({
                'code': CERTIFICATE.CERGIVEBACK
            }).then(res => {
                that.jsonData = JSON.parse(res)
            })
        },
        watch: {
            backInfo(newVal, old){
                this.values = newVal
            }
        }
    }
</script>

<style lang="scss">
.cer-back{
    .form-table .el-button{
        display: none;
    }
    .form-table .hover-row .scope-index{
        display: block;
    }
    .form-table .hover-row .scope-action{
        display: none;
    }
}
</style>
