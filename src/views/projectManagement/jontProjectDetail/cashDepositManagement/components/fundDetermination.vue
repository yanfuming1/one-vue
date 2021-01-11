<template>
    <el-dialog
        v-dialogDrag
        :title="title"
        :incomeTitle="incomeTitle"
        :visible.sync="dialogVisible"
        width="70%"
        :before-close="handleClose">
        <el-form ref="pageInfo" class="fund-search" :model="pageInfo" label-width="80px">
            <el-input size="medium" v-model="pageInfo.keywords" placeholder="请输入关键字"></el-input>
            <el-button size="medium" type="primary" @click="getTableData">搜索</el-button>
        </el-form>
        <qqt-table
            :data="tableData"
            :rowHeader="rowHeader"
            :option="tableOption"
            @selectionChange="selectChange"
            @page="handlePaginationChange"></qqt-table>

        <div slot="footer" class="dialog-footer fund-footer">
            <el-button type="primary" size="small" @click="submit">确 定</el-button>
            <el-button size="small" @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { accountQueryList } from '../../../../../api/jointProject/index'
import { qqtTable } from '../../../../../components/qqt-subassembly'
export default {
    name: 'fundDetermination',
    components: {qqtTable}, 
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        fromBack: {
            type: Boolean,
            default: false
        },
        incomeTitle: {
            type: Boolean,
            default: false
        },
    },
    data () {
        return {
            tableData: {},
            rowHeader: [
                {
                    prop: 'gatheringamount',
                    label: '到账金额（元）',
                    isShow: true,
                    isMoney: true,
                },
                {
                    prop: 'affirmstate',
                    label: '认定状态',
                    isShow: true
                },
                {
                    prop: 'companycollection',
                    label: '公司收款账户',
                    isShow: true,
                },
                {
                    prop: 'gatheringaccount',
                    label: '公司收款账号',
                    isShow: true
                },
                {
                    prop: 'payaccount',
                    label: '对方付款账户',
                    isShow: true
                },
                {
                    prop: 'paymark',
                    label: '付款留言',
                    isShow: true
                },
                {
                    prop: 'gatheringtime',
                    label: '收到时间',
                    isShow: true,
                    render: (h,params) => {
                    let text = '';
                    text = params.row.gatheringtime ? new Date(params.row.gatheringtime).format('yyyy-MM-dd hh:mm:ss') : '';
                    return h('div',{
                    },text) 
                    }
                },
                {
                    prop: 'createdbytime',
                    label: '登记时间',
                    isShow: true,
                    render: (h,params) => {
                    let text = '';
                    text = params.row.createdbytime ? new Date(params.row.createdbytime).format('yyyy-MM-dd hh:mm:ss') : '';
                    return h('div',{
                    },text) 
                    }
                },
                {
                    prop: 'createdby',
                    label: '登记人',
                    width: '100px',
                    isShow: true,
                },
            ],
            tableOption: {
                border: false,
                height: 300,
            },
            selectData: [],
            pageInfo : {
                keywords: '',
                pageNo : '1',
                pageSize : '10',
            },
            title: '保证金退还认定',
        }
    },
    methods: {
        handleClose(done){
            this.$emit('closeDialog')
        },
        submit () {
            if(this.selectData.length > 1){
                this.$message.warning("只能选择一个内容!!!")
            }else{
                this.$emit('getData', this.selectData[0])
            }
        }, 
        selectChange(data){
            this.selectData = data
        },
        handlePaginationChange(page){
            this.pageInfo.pageNo = page.current
            this.pageInfo.pageSize = page.size
            this.getTableData()
        },
        cancel(){
            this.$emit('closeDialog')
        },
        getTableData(){
            accountQueryList(
                this.pageInfo
            ).then(res => {
                this.tableData = res
            })
        }
    },
    mounted () {
        this.title = this.fromBack ? '工程款到账认定' : (this.incomeTitle ? '到账资金认定' : '保证金退还认定')
        // this.getTableData()
    },
    watch: {
        fromBack(newVal, old){
            this.title = newVal ? '工程款到账认定' : '保证金退还认定'
        },
        dialogVisible(newVal, old){
            this.pageInfo.keywords = ''
            if(newVal){
                this.tableData = {}
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.fund-footer{
    text-align: right;
    margin-top: 40px;
}
.fund-search{
    margin-bottom: 20px;
    .el-input{
        width: 180px;
        margin-right: 20px;
        .el-input__inner{
            height: 33px;
            line-height: 33px;
        }
    }
}
</style>