<template>
    <div class="cer-borrow">
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
        name: "borrowOut",
        props: {
            cerInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        data () {
            return {
                jsonData: {},
                remoteFunctions: {},
                values: {},
            }
        },
        methods: {
            selectChange () {},
            getData(){
                this.$refs.generateForm.getData().then(data => {
                    this.$emit('backData', data)
                })
            }
        },
        mounted() {
            that = this
            this.values = this.cerInfo
            formGetJson({
                'code': CERTIFICATE.BORROWOUT
            }).then(res => {
                that.jsonData = JSON.parse(res)
            })
        },
        watch: {
            cerInfo(newVal, old){
                this.values = newVal
            }
        }
    }
</script>

<style lang="scss">
.cer-borrow{
    .el-form-item--small>.el-form-item__content span>.form-table>button{
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
