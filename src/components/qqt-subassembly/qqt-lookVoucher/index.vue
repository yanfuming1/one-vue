<template>
    <div  style="display:inline-block;margin-right:10px">
        <!-- 凭证录入按钮  -->
        <!-- <el-button size="small" type="info" @click="voucherBtn">凭证录入</el-button> -->  
        <el-dialog
            title="记账凭证"
            :visible.sync="centerDialogVisible"
            width="70%"
            @close="closeDialog">
            <pz-table ref="pzTable" :pzRowData="pzRowData"></pz-table>
            <span slot="footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <!-- <el-button type="primary" v-if="btnShow" @click="dialogComfirm">确 定</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {add,goAdd,queryByItemId,confGetById,editSomeThing} from '../../../api/financialManagement/voucher/index';
    import pzTable from './pzTable';
    import util from '@/libs/util.js'
    export default {
        props: {
            data: {
                type: Object,
            },
            showComfirm: {
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        components: {
            pzTable
        },
        data() {
            return {
                pzRowData: {},
                centerDialogVisible: false,
                flowData: {},
                btnShow: false
            }
        },
        mounted () {
        },
        methods: {
            getCode () {
                goAdd().then(res=>{
                    confGetById ({id:'1196963121869107200'}).then(data=> {
                        this.pzRowData = {
                            fnancemanager: util.cookies.get ('username'),
                            dobill: util.cookies.get ('username'),
                            inputtime: new Date().format('yyyy-MM-dd'),
                            accounting: res,
                            unit:  data.value,
                            doc: 0
                        }
                    })
                })
            },
            CNEdit() {
                let data = {
                    id:  this.pzRowData.id,
                    bookkeeping:  util.cookies.get ('username'),
                    review:  util.cookies.get ('username'),
                }
                editSomeThing(data).then(res=> {

                })
            },
            queryByItemId (data) {
                queryByItemId({itemId:data.id}).then(res => {
                    if (res.id) {
                        this.pzRowData = res;
                    } else {
                        this.getCode();
                    }
                })
            },
            dialogComfirm () {
                this.$refs.pzTable.getData().then(res => {
                    let jsonData = {
                        ...res,
                    }
                    this.saveData(jsonData)
                })
            },
            saveData (data) {
                data.itemid = this.flowData.id;
                add (data).then(res => {
                    this.$message.success('保存成功')
                    this.centerDialogVisible = false
                })
            },
            closeDialog () {
                this.centerDialogVisible = false
            },
            voucherBtn () {
                this.centerDialogVisible = true;
            },
        },
        watch: {
            data: {
                deep:true,
                immediate: true,
                handler (data) {
                    this.flowData = data;
                    if (data.id) {
                        this.queryByItemId(data)
                    }
                }
            },
            showComfirm: {
                deep:true,
                immediate: true,
                handler (value) {
                    this.btnShow = value;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>