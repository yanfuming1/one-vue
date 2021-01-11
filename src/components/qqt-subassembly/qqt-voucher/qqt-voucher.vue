<template>
    <div  style="display:inline-block;margin-right:10px">
        <!-- <el-button size="small" type="info" @click="voucherBtn">凭证录入</el-button> -->
        <el-dialog
            title="记账凭证"
            :visible.sync="centerDialogVisible"
            width="70%"
            @close="$emit('dialogCancel')">
            <pz-table ref="pzTable" :pzRowData="pzRowData"></pz-table>
            <span slot="footer">
                <el-button @click="dialogCancel">取 消</el-button>
                <el-button type="primary"  @click="dialogComfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {add,goAdd,queryByItemId,confGetById} from '../../../api/financialManagement/voucher/index';
    import pzTable from '../../../views/financialManagement/voucher/component/pzTable';
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
            },
            voucherShow: {
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
            dialogCancel () {
                // this.centerDialogVisible = false;
                this.$emit('dialogCancel');
            },
            voucherShowFun () {
                return new Promise((resolve, reject) => {
                    this.centerDialogVisible = true;
                    resolve(true)
                })
            },
            getCode () {
                goAdd().then(res=>{
                    confGetById ({id:'1196963121869107200'}).then(data=> {
                          this.pzRowData = {
                            fnancemanager: util.cookies.get ('username'),
                            dobill: util.cookies.get ('username'),
                            inputtime: new Date().format('yyyy-MM-dd'),
                            accounting: res,
                            unit:  data.value,
                            doc: 1
                        }
                    })
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
                this.$emit('dialogComfirm')
            },
            comfirmData () {
                return  new Promise ((resolve,reject) => {
                    this.$refs.pzTable.getData().then(res => {
                        let jsonData = {
                            ...res,
                            itemid: this.flowData.id
                        }
                        add (jsonData).then(res => {
                            this.$message.success('保存成功')
                            this.centerDialogVisible = false
                            resolve(true);
                        }).catch(res => {
                            reject(false);
                        })
                        // this.saveData(jsonData)
                        // jsonData.itemid = this.flowData.id;
                    })
                })
            },
            saveData (data) {
                new Promise ((resolve,reject) => {
                    data.itemid = this.flowData.id;
                    add (data).then(res => {
                        this.$message.success('保存成功')
                        this.centerDialogVisible = false
                        resolve(true)
                    }).catch(res => {
                        reject(false)
                    })
                })
            },
            closeDialog () {
                console.log(11)
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
            },
            voucherShow: {
                deep:true,
                immediate: true,
                handler (flag) {
                //    console.log(flag)
                    this.centerDialogVisible = flag;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>