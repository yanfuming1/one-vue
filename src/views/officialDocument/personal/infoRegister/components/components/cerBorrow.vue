<template>
    <el-dialog
        v-dialogDrag
        title="证书借用申请"
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="handleClose">
        <use-flow-b
            :secValues="values"
            :flow="flowList"
            ref="onFlow"
            @backData="backData"
            v-if="useFlow"/>
        <no-flow-b
            :secValues="values"
            ref="noFlow"
            @backData="backData"
            v-if="!useFlow"/>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="subBorrow">确 定</el-button>
            <el-button @click="cancelBorrow">取 消</el-button>
        </span>
    </el-dialog> 
</template>

<script>
    import UseFlowB from "./useFlowB";
    import NoFlowB from "./noFlowB";
    import { borrowRecordNoFlow, borrowRecordUseFlow } from "../../../../../../api/officalDocument/index"
    let that = this
    export default {
        name: "cerBorrow",
        components: {NoFlowB, UseFlowB},
        props: {
            show: {
                type: Boolean,
                default: false
            },
            useFlow: {
                type: Boolean,
                default: false
            },
            selectData: {
                type: Array,
                default: () => {
                    return []
                }
            },
            flow: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data () {
            return {
                dialogVisible: false,
                values: {
                    credentialLoan: [
                        {
                            name: "",
                            possessor: "",
                            encoding: "",
                            purpose: "",
                            borrowDate: ""
                        }
                    ],
                    receiver: "",
                    affiliatedConpany: "",
                    phone: "",
                    registerDate: "",
                    temData: {}
                },
                flowList: []
            }
        },
        methods: {
            handleClose(done){
                done()
            },
            cancelBorrow(){
                this.$emit("closeBorrow")
            },
            subBorrow(){
                if(this.useFlow){
                    this.$refs.onFlow.getData()
                    setTimeout(() => {
                        for(let i = 0; i < that.temData.credentialLoanList.length; i++){
                            that.temData.credentialLoanList[i].credentialId = that.selectData[i].id
                        }
                        if(that.temData.pdfId === ''){
                            that.$message.warning("请选择流程!!")
                        } else {
                            borrowRecordUseFlow(
                                this.temData
                            ).then(res => {
                                that.$message.success("借用成功~")
                                that.$emit("closeBorrow")
                            })
                        }
                    }, 1000)
                }else{
                    // 不走流程
                    this.$refs.noFlow.getData()
                    setTimeout(() => {
                        for(let i = 0; i < that.temData.credentialLoan.length; i++){
                            that.temData.credentialLoan[i].credentialId = that.selectData[i].id
                            that.temData.credentialLoan[i].borrower = that.temData.receiver
                        }
                        console.log(that.temData)
                        borrowRecordNoFlow(that.temData).then(res => {
                            that.$message.success("借用成功~")
                            that.$emit("closeBorrow")
                        })
                    }, 1000)
                }
            },
            backData (data) {
                this.temData = data
            },
            // getFlow (data) {
            //     this.flowList = data
            // }
        },
        mounted () {
            that = this
            this.flowList = this.flow
        },
        watch: {
            show () {
                this.dialogVisible = this.show
            },
            selectData(newVal, old){
                this.values.credentialLoan = []
                // useFlow
                this.values.credentialLoanList = []
                newVal.forEach(item => {
                    let tem = {}
                    tem.name = item.name
                    tem.possessor = item.possessor
                    tem.encoding = item.encoding
                    tem.purpose = ''
                    tem.borrowDate = ''
                    if(this.useFlow){
                        this.values.credentialLoanList.push(tem)
                    }else{
                        this.values.credentialLoan.push(tem)
                    }
                })
            },
            flow (newVal, old) {
                this.flowList = newVal
            }
        }
    }
</script>

<style scoped>

</style>
