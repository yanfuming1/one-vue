<template>
    <d2-container class="address-book project-common-in">
        <template slot="header">
            <project-common :fromArrive="fromArrive"></project-common>
            <div class="address-book-header">
                <span class="address-book-header___search">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="queryInfo.name" size="mini"></el-input>
                    <span class="address-book-header___search">
                        <el-date-picker
                            v-model="selectTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            @change="getTime"
                            :unlink-panels="true"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['08:00:00', '18:00:00']"
                            align="right">
                        </el-date-picker>
                    </span>
                    <el-button type="primary" size="mini" class="address-book-header-button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" size="mini" class="address-book-header-button" @click="resetSearch">重置</el-button>
                </span>
                <!-- <el-button type="danger" size="mini" style="margin-right: 5px;" @click="listDel">批量删除</el-button> -->
                <el-button-group> 
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </el-button-group>
            </div>
        </template> 
        <div class="address-book-center">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="已扣费用" name="first">
                    <qqt-table
                        ref="table"
                        :exportData="exportData"
                        :data="tableData"
                        :rowHeader="rowHeader"
                        :option="tableOption"
                        :dynamicHeader="dynamicHeader1"
                        @selectionChange="selectChange"
                        @page="handlePaginationChange"></qqt-table>
                </el-tab-pane>
                <el-tab-pane label="暂押费用" name="second">
                    <qqt-table
                        ref="tableDetain"
                        :exportData="exportData"
                        :data="tableData"
                        :rowHeader="rowHeader1"
                        :option="tableOption"
                        :dynamicHeader="dynamicHeader2"
                        @selectionChange="selectChange"
                        @page="handlePaginationChange"></qqt-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog v-dialogDrag :title="dialogTitle" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                v-if="showRelease"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm"/>
            <el-table :data="releaseData" v-if="!showRelease" style="width: 100%"> 
                <el-table-column  label="序号" type="index" width="60" />   
                <el-table-column prop="line2" label="本次释放金额" width="180"> </el-table-column>
                <el-table-column prop="line3" label="释放人员" width="180"> </el-table-column>
                <el-table-column prop="line4" label="释放说明"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="releaseSave">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>
<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import projectCommon from '../components/projectCommon'
import { qqtTable } from '../../../../components/qqt-subassembly'
import { mapActions } from 'vuex'
import { withHoldDeductSearch,withHoldDel, withHoldPledgeSearch, withHoldRelease, lookDetainRecord} from '../../../../api/jointProject/deductedAndTemporarily/index'
export default {
    name: "name",
    components: {
        qqtTable,
        projectCommon
    },
    data() {
        return {
            fromArrive: true,
            queryInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                projectId: '',
                startDate: null,
                endDate: null
            },
            tableData: {},
            dynamicHeader1: {
                // tableId: 'T_1572504929',
                // isSave: true
            },
            dynamicHeader2: {
                // tableId: 'T_1572504940',
                // isSave: true
            },
            rowHeader: [
                {
                    prop: 'name',
                    label: '费用名称',
                    isShow: true,
                },{
                    prop: 'money',
                    label: '已扣金额',
                    isShow: true,
                    isMoney: true,
                    isOpenSummary: true,
                },{
                    prop: 'stateName',
                    label: '状态',
                    isShow: true,
                    render: (h, parms) => {
                        let text = ''
                        switch(parms.row.operationType){
                            case '1':
                                text = parms.row.state === '1' ? '已扣款' : '未扣款'
                                break
                            case '0':
                                text = parms.row.state === '1' ? '已释放' : '未释放'
                                break
                        }
                        return h('p', {}, parms.row.stateName = text)
                    }
                },{
                    prop: 'createName',
                    label: '登记人',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true,
                },
            ],
            rowHeader1: [
                {
                    prop: 'name',
                    label: '费用名称',
                    isShow: true,
                },{
                    prop: 'money',
                    label: '暂押总金额',
                    isShow: true,
                    isMoney: true,
                    isOpenSummary: true,
                },{
                    prop: 'notReleaseMoney',
                    label: '未释放金额',
                    isShow: true,
                    isMoney: true,
                    isOpenSummary: true,
                },{
                    prop: 'stateName',
                    label: '状态',
                    isShow: true,
                    render: (h, parms) => {
                        let text = ''
                        switch(parms.row.operationType){
                            case '1':
                                text = parms.row.state === '1' ? '已扣款' : '未扣款'
                                break
                            case '0':
                                text = parms.row.state === '1' ? '已释放' : '未释放'
                                break
                        }
                        return h('p', {}, parms.row.stateName = text)
                    }
                },{
                    prop: 'createName',
                    label: '登记人',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    render: (h, parms) => {
                        return [h('el-button', {
                            attrs: {
                                type: 'text',
                                disabled: parms.row.isCheck === '1' ? false : true
                            },
                            style:{ color: parms.row.isCheck === '1' ? '#409EFF' : '#999', },
                            on: {
                                click: () => {
                                    this.releaseId = parms.row.id
                                    this.values.canReleaseMoney = parms.row.notReleaseMoney
                                    this.values.money = ""
                                    this.values.name = ""
                                    this.showRelease = true
                                    this.dialogTitle = '释放金额'
                                    this.dialogVisible = true
                                    this.$refs.generateForm.reset()
                                }
                            }
                        }, this.$has('joint:withhold:release') ? '释放' : ''),
                        h('el-button', { 
                            attrs: {
                                type: 'text',
                                disabled: parms.row.isCheck === '1' ? false : true
                            },
                            style:{ color: parms.row.isCheck === '1' ? '#409EFF' : '#999', },
                            on: {
                                click: () => {
                                    lookDetainRecord({id: parms.row.id}).then(res => {
                                        this.showRelease = false
                                        this.dialogVisible = true
                                        this.dialogTitle = '本次释放记录'
                                        this.releaseData = res
                                    })
                                }
                            }
                        }, '查看释放记录'),]
                    }
                },
            ],
            tableOption: {
                border: false,
                isOpenSummary: true,
            },
            activeName: 'first',
            selectData: [],
            dialogVisible: false,

            jsonData: {},
            values: {
                canReleaseMoney: '0',
                money: '0',
                name: ''
            },
            remoteFuncs: {},
            transform: {
                isShowDetails: false
            },
            releaseId: '',
            canSub: true,
            showRelease: false,
            releaseData: [],
            dialogTitle: '',
            selectTime: [],
            pickerOptions: {},
            exportData: []
        }
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        searchModelSynopsis() {
            this.getTableData()
        },
        resetSearch () {
            this.queryInfo.name = ''
            this.queryInfo.pageNo = '1'
            this.queryInfo.pageSize = '10'
            this.queryInfo.startDate = null
            this.queryInfo.endDate = null
            this.selectTime = []
            this.getTableData()
        },
        listDel() {
            if(this.selectData.length === 0){
                this.$message.info('未选择删除的项目')
                return false
            }
            let ids = ''
            this.selectData.forEach(item => {
                ids += item.id + ','
            })
            ids = ids.substring(0, ids.length - 1)
            this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                type: 'warning'
                }).then(() => {
                    withHoldDel({
                        ids: ids
                    }).then(res => {
                        this.$message.success("删除成功~~~")
                        this.getTableData()
                    })
                }).catch(() => {
                    this.$message.info('已取消删除');          
                });
        },
        handleClick(){
            this.queryInfo.pageNo = '1'
            this.queryInfo.pageSize = '10'
            this.getTableData()
        },
        getTime(data){
            if(data){
                this.queryInfo.startDate = data[0]
                this.queryInfo.endDate = data[1]
                this.getTableData()
            }
        },
        selectChange(data) {
            this.selectData = data
        },
        handlePaginationChange(page) {
            this.queryInfo.pageNo = page.current
            this.queryInfo.pageSize = page.size
            this.getTableData()
        },
        getTableData() {
            if(this.activeName === 'first'){
                withHoldDeductSearch(
                    this.queryInfo
                ).then(res => {
                    this.tableData = res
                })
            }else{
                withHoldPledgeSearch(
                    this.queryInfo
                ).then(res => {
                    this.tableData = res
                })
            }
        },
        uploadFun(){
            this.getExportData().then(res => {
                if(this.activeName === 'first'){
                    this.$refs.table.getExportExcel()
                }else {
                    this.$refs.tableDetain.getExportExcel()
                }
            })
        },
        printTable () {
            let table = this.activeName == 'first' ? 'table' : 'tableDetain'
            this.$refs[table].printTable (this.selectData)
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.operationType = item.operationType === '1' ? '应扣' : '暂押'
                    switch(item.operationType){
                        case '应扣':
                            item.state = item.state === '1' ? '已扣款' : '未扣款'
                            break
                        case '暂押':
                            item.state = item.state === '1' ? '已释放' : '未释放'
                            break
                    }
                });
                resolve (true)
            });
        },
        handleClose(){
            this.dialogVisible = false
        },
        valueChange(field, value, model){
            switch(field){
                case 'money':
                    if(parseFloat(value) > model.canReleaseMoney){
                        model.money = ''
                        this.$message.warning("释放金额不能大于未释放金额!!!");
                        this.canSub = false
                        // this.$refs.generateForm.reset()
                    } else {
                        this.canSub = true
                    }
                    break
            }
            this.values = model
        },
        releaseSave () {
            if(this.canSub){
                this.$refs.generateForm.getData().then(res => {
                    res.projectId = this.queryInfo.projectId
                    res.id = this.releaseId
                    withHoldRelease(res).then(res => {
                        this.$message.success("释放成功~~~")
                        this.getTableData()
                        this.dialogVisible = false
                    })
                })
            }
        }
    },
    async mounted() {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.queryInfo.projectId = db.get('proID').value()

        this.getTableData()
        formGetJson({
            code: "releaseMoney"
        }).then(res => {
            this.jsonData = JSON.parse(res)
        })
    }
}
</script>
<style lang="scss">
.address-book.project-common-in{
    .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .address-book-header {
        .el-date-editor{
            width: 360px;
            height: 30px;
            margin-right: 10px;
            padding-right: 0px;
            .el-range-input{
                width: 38%;
            }
            .el-range-separator{
                width: 7%;
                line-height: 23px;
            }
            .el-range__icon{
                line-height: 20px;
            }
        }
        .el-date-editor .el-range__icon{
            line-height: 21px;
        }
        .el-input__icon.el-range__close-icon{
            line-height: 21px;
        }
        .address-book-header___search {
            .el-input {
                width: 10%;
                padding-right: 10px;
            }
            .el-date-editor--datetimerange{
                top: 0px;
            }
            .address-book-header-button{
                margin-right: 10px;
            }
        }
        .header-form{
            margin-top: 20px;
            .el-form-item{
                margin-bottom: 12px;
            }
            .bottom .el-form-item{
                margin-bottom: 0px;
            }
            .el-form-item__label{
                line-height: 35px;
            }
            .el-form-item__content{
                line-height: 35px;
                .el-input__inner{
                    height: 35px;
                }
            }
        }
    }
    .address-book-center {
        height: 100%;
        background: rgba($color: #FFF, $alpha: 0.5);
        .el-tabs{
            height: calc(100% - 50px);
            .el-tabs__header{
                margin-bottom: 0px;
                padding-top: 15px;
            }
            .el-tabs__nav{
                margin-left: 40px;
            }
            .el-tabs__content{
                height: 100%;
            }
        }
    }
}
</style>