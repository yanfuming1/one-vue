<template>
    <d2-container class="address-book project-common-in certificate-container">
        <template slot="header">
            <div class="address-book-header">
                <el-form :inline="true" ref="form" size="mini" @submit.native.prevent>
                    <el-form-item v-if="$has ('administer:credential:add')"> <el-button type="primary" class="customer-list-header-add" size="mini" @click="addCertificate">添加</el-button> </el-form-item>
                    <el-form-item> <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search.name" size="mini"></el-input> </el-form-item>
                    <el-form-item>
                        <el-date-picker style="width:320px;" v-model="selectTime" type="datetimerange" :picker-options="pickerOptions" range-separator="至" :default-time="['08:00:00', '18:00:00']"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" align="right" @change="searchModelSynopsis()" >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="customer-list-header-button" size="mini" @click="searchModelSynopsis">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" plain class="customer-list-header-button" size="mini" @click="resetSearch">重置</el-button>
                    </el-form-item>
                    <el-form-item label="证书状态" >
                        <el-select size="mini" v-model="search.state" placeholder="请选择" style="width: 150px;" clearable @change="searchModelSynopsis()">
                            <el-option v-for="item in stateOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否借出" >
                        <el-select size="mini" v-model="search.loan" placeholder="请选择" style="width: 150px;" clearable @change="searchModelSynopsis()">
                            <el-option v-for="item in loanOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否在建">
                        <el-select size="mini" v-model="search.abuilding" placeholder="请选择" style="width: 150px;" clearable @change="searchModelSynopsis()">
                            <el-option v-for="item in abuildingOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="$has ('administer:credential:delete')"> <el-button type="primary" class="customer-list-header-button" size="mini" @click="deleteBatch">批量删除</el-button></el-form-item>
                    <el-form-item v-if="$has ('administer:credential:changeLoan')"> <el-button type="success" class="customer-list-header-button" size="mini" @click="cerBorrow">证书借用</el-button></el-form-item>
                    <el-form-item v-if="$has ('administer:credential:reliantFeeRegister')"> <el-button type="warning" class="customer-list-header-button" size="mini" @click="cerPay">挂靠费申请</el-button></el-form-item>
                    <el-form-item>
                        <el-button-group style="margin-left: 10px;">
                            <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                            <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        <div class="address-book-center">
            <qqt-table
                ref="table" 
                :exportData="exportData"
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                :dynamicHeader="dynamicHeader"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>  
import { qqtTable } from '../../../../components/qqt-subassembly'
import { getDocumentList, credentialDel, cerQueryById, borrowSearch, payRecordAdd, listByStartCrew, updataOutOrCancellation } from '../../../../api/officalDocument/index'
import { CERTIFICATE } from '../../../../enum/FORMCODE'
import { queryDicById } from '../../../../api/system/dic/dic'
import { getCertificateClassification } from '@api/officalDocument/classificationPersonalCertificates'
import CerBorrow from "./components/components/cerBorrow";
import PayCall from "./components/components/payCall";
import util from '@/libs/util'
let that
export default {
    name: "index",
    data () {
        return {
            tableData: {},
            selectTable: [],
            dynamicHeader: {
                // tableId: 'T_1572501173',
                // isSave: true
            },
            stateOption: [
                { label: '未到期', value: '未到期' },
                { label: '到期', value: '到期' },
                { label: '延期', value: '延期' }
            ],
            loanOption: [
                { label: '未借出', value: '0' },
                { label: '已借出', value: '1' },
                { label: '申请中', value: '2' }
            ],
            abuildingOption: [
                { label: '是', value: '是' },
                { label: '否', value: '否' }
            ],
            rowHeader: [
                {
                    prop: 'name',
                    label: '证书名称',
                    isShow: true,
                    render: (h, params) => {
                        return h('el-button', {
                            style: { color: '#3ba5ff' },
                            attrs: { type: 'text' },
                            on: {
                                click: () => {
                                    cerQueryById({ id: params.row.id }).then(res => {
                                        that.$router.push({
                                            path: 'officialDocumentDetail',
                                            name: 'officialDocumentDetail',
                                            params: {
                                                major: that.optionMajor,
                                                level: that.optionLevel,
                                                nameList: that.cerNameList,
                                                unitList: that.unitList,
                                                info: res,
                                                isDetail: true
                                            }
                                        })
                                    })
                                }
                            }
                        }, params.row.name)
                    }
                },{
                    prop: 'encoding',
                    label: '证书编号',
                    isShow: true
                },{
                    prop: 'possessor',
                    label: '持证人',
                    isShow: true
                },{
                    prop: 'isAbuilding',
                    label: '是否在建',
                    isShow: true,
                },{
                    prop: 'isLoanName',
                    label: '是否借出',
                    isShow: true,
                    render: (h, parms) => {
                        let text = ""
                        switch(parms.row.isLoan){
                            case '0':
                                text = '未借出'
                                break
                            case '1':
                                text = '已借出'
                                break
                            case '2':
                                // text = parms.row.useFlow === '1' ? '申请中' : '已借出'
                                text = '申请中'
                                break
                        }
                        return h('p', {}, parms.row.isLoanName = text);
                    }
                },{
                    prop: 'useFlowName',
                    label: '是否需要审批',
                    isShow: true,
                    render: (h, parms) => {
                        return h('p', { }, parms.row.useFlowName = parms.row.useFlow === '1' ? '是' : '否');
                    }
                },{
                    prop: 'unitListName',
                    label: '发证单位',
                    isShow: true,
                    width: 200,
                    render: (h, parms) => {
                        return h('p', {}, parms.row.unitListName = parms.row.certiLineList.length > 0 ? parms.row.certiLineList[0].issueUnit : '无');
                    }
                },{
                    prop: 'credentialState',
                    label: '证书状态',
                    isShow: true,
                },{
                    prop: 'createName',
                    label: '登记人',
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '200px',
                    render: (h, parms) => {
                        return [
                            this.$has ('administer:credential:edit') ? h('el-button', {
                                props:{ type: 'text', },
                                attrs: { type: 'text',disabled: parms.row.level == null ? parms.row.isLoan === '1' || parms.row.isLoan === '2' ? true : false : true},
                                on:{
                                    click: () => {
                                        cerQueryById({id: parms.row.id }).then(res => {
                                            console.log(this.$router.options.routes);
                                            that.$store.commit ('d2admin/page/titleSet', '编辑证书')
                                            that.$router.push({
                                                path: 'officialDocument',
                                                name: 'officialDocument',
                                                params: {
                                                    major: that.optionMajor,
                                                    level: that.optionLevel,
                                                    nameList: that.cerNameList,
                                                    unitList: that.unitList,
                                                    info: res,
                                                    isDetail: false
                                                }
                                            })
                                        })
                                    }
                                }
                            }, '编辑') : '',
                            this.$has ('administer:credential:delete') ? h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ type: 'text', disabled: parms.row.level == null ? parms.row.isLoan === '1' || parms.row.isLoan === '2' ? true : false : true},
                                on:{
                                    click: () => {
                                        this.$confirm('此操作将永久删除该证书, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            cancelButtonClass: "btn-custom-cancel",
                                            type: 'warning'
                                        }).then(() => {
                                            credentialDel({ids: parms.row.id}).then(res => {
                                                that.$message.success("删除成功")
                                                that.getList()
                                            })
                                        })
                                    }
                                }
                            }, '删除') : '',
                            h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.level == null ? false : true },
                                on:{
                                    click: () => {
                                        this.$confirm('作废该证书, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            cancelButtonClass: "btn-custom-cancel",
                                            type: 'warning'
                                        }).then(() => {
                                            this.updataOutOrCancellation (parms.row.id, '2')
                                        })
                                    }
                                }
                            }, '作废'),
                            h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.level == null ? false : true },
                                on:{
                                    click: () => {
                                        this.$confirm('转出该证书, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            cancelButtonClass: "btn-custom-cancel",
                                            type: 'warning'
                                        }).then(() => {
                                            this.updataOutOrCancellation (parms.row.id, '1')
                                        })
                                    }
                                }
                            }, '转出'),
                        ]
                    }
                }
            ],
            tableOption: {
                border: false
            },
            optionMajor: [],
            optionLevel: [],
            isShow: false,
            useFlow: false,
            selectData: [],
            search: {
                loan: '',
                name: '',
                pageNo: '1',
                pageSize: '10',
                state: '',
                createTime: null,
                updateTime: null,
                abuilding: ''
            },
            dialogVisible: false,
            temData: {},
            flow:[],
            cerNameList: [],
            unitList: [], // 发证单位
            exportData: [],
            selectTime: [],
            pickerOptions: {},
        }
    },
    methods: {
        addCertificate () {
            this.$store.commit ('d2admin/page/titleSet', '新建证书')
            this.$router.push({
                path: 'officialDocument',
                name: 'officialDocument',
                params: {
                    major: this.optionMajor,
                    level: this.optionLevel,
                    nameList: this.cerNameList,
                    unitList: this.unitList,
                    isDetail: false,
                    isAdd: true
                }
            })
        },
        selectChange (data) {
            this.selectTable = data
        },
        handlePaginationChange (page) {
            this.search.pageNo  = page.current
            this.search.pageSize = page.size
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },
        resetSearch () {
            this.search = {
                loan: '',
                name: '',
                pageNo: '1',
                pageSize: '10',
                state: '',
                createTime: null,
                updateTime: null
            }
            this.selectTime = []
            this.getList()
        },

        searchModelSynopsis () {
            this.getBorrow ({
                'name': this.search.name ? this.search.name : null,
                'createTime': this.selectTime ? this.selectTime[0] : null,
                'updateTime': this.selectTime ? this.selectTime[1] : null,
                'state': this.search.state ? this.search.state : null,
                'loan': this.search.loan ? this.search.loan : null,
                'isAbuilding': this.search.abuilding ? this.search.abuilding : null

            })
        }, 
        getBorrow (text) {
            borrowSearch({
                ...text,
                'pageNo': this.search.pageNo,
                'pageSize': this.search.pageSize
            }).then(res => {
                that.tableData = res
            })
        },
        getList () {
            getDocumentList().then(res => {
                this.tableData = res
            })
        },

        updataOutOrCancellation (id, type) {
            updataOutOrCancellation ({'id': id, type: type}).then (res => {
                if (res) this.$message.success (`${type == '2' ? '作废' : '转出'}成功`), this.getBorrow ()
            })
        },

        // 批量删除
        deleteBatch () {
            if(this.selectTable.length > 0) {
                let ids = ''
                this.selectTable.forEach(item => {
                    ids += item.id + ','
                })
                this.$confirm('此操作将永久删除该证书, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    credentialDel(
                        {ids: ids}
                    ).then(res => {
                        that.$message.success("删除成功")
                        that.getList()
                    })
                }).catch(() => {
                    this.$message.info('已取消删除');
                });
            } else {
                this.$message.warning("未选择证书")
            }
        },
        // 证书借用
        cerBorrow () {
            if(this.selectTable.length > 0){
                this.selectData = this.selectTable
                this.useFlow = false
                let isLoan = false
                let isAbuilding = false
                this.selectTable.forEach(item => {
                    if(item.useFlow === "1"){ this.useFlow = true }
                    if(item.isLoan === '1' || item.isLoan === '2'){ isLoan = true }
                    if(item.isAbuilding === "是") { isAbuilding = true }
                })
                if(isLoan){
                    util.confirm("选择的证书含有已借出的证书或者正在申请中的证书,确定借出吗？").then(res => {
                        if (res) { this.goBorrowPage() }
                    })
                    return
                } 
                if(isAbuilding) {
                    util.confirm("选择的证书含有在建的证书,确定借出吗？").then(res => {
                        if (res) { this.goBorrowPage() }
                    })
                    return
                }
                this.goBorrowPage()
            }else{
                this.$message.warning("未选择证书")
            }
        },
        goBorrowPage () {
            this.$router.push({
                path: 'cerBorrow',
                name: 'cerBorrow',
                params: {
                    cerInfo: this.selectTable,
                    newSub: true,
                    useFlow: this.useFlow,
                }
            })
        },
        // 挂靠费
        cerPay () {
            if(this.selectTable.length === 0){
                this.$message.warning("未选择证书")
            }else if(this.selectTable.length > 1){
                this.$message.warning("只能选择一个证书进行登记")
            }else{
                this.$router.push({
                    path: 'payCall',
                    name: 'payCall',
                    params: {
                        cerInfo: this.selectTable[0]
                    }
                })
            }
        },
        getTemData(data){
            this.temData = data
        },
        handleClose (done) {
            done()
        },
        closeB () {
            this.isShow = false
        },
        getCommonInfo (){
            let jsonData = {
                formKey:CERTIFICATE.USEFLOWBORROW
            }
            listByStartCrew(jsonData).then(res => { this.flow = res })
            getCertificateClassification({  affiliationType: '0' }).then(res => { this.cerNameList = res})
            queryDicById({ id: '1168431017937518592' }).then(res => { this.optionMajor= res })
            queryDicById({ id: '1171610409157152768' }).then(res => { this.optionLevel= res })
            queryDicById({ id: '1176796218676121600' }).then(res => { this.unitList = res })
        },
        uploadFun () { 
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel()
            })
        },
        printTable () {
            this.$refs.table.printTable (this.selectData)
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    switch(item.isLoan){
                        case '0':
                            item.isLoan = '未借出'
                            break
                        case '1':
                            item.isLoan = '已借出'
                            break
                        case '2':
                            item.isLoan = '申请中'
                            break
                    }
                    item.useFlow = item.useFlow === '1' ? '是' : '否'
                    item.unitList = item.certiLineList.length === 0 ? '无' : item.certiLineList[0].issueUnit
                });
                resolve (true)
            });
        },
    },
    created () {
        this.getList()
    },
    mounted () {
        that = this
        this.getCommonInfo()
    },
    components: {
        PayCall,
        CerBorrow,
        'qqt-table': qqtTable
    },
}
</script>

<style lang="scss">
.certificate-container{
    .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .el-range-separator{
        display: contents;
    }
}
.address-book {
    .address-book-center {
        height: 100%;
        background: $color-bg3;
        box-shadow: 0 2px 12px 0 $color-border-shadow;
    }
    .d2-container-full__body {
        padding: 0 20px 20px !important;
    }
}
</style>
