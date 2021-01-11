<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                    <span class="qqt-container-full-header-operation___left" v-if="$has ('administer:corporationCharter:add')">
                        <el-button type="primary" class="customer-list-header-button" @click="addCertificate">添加</el-button>
                    </span>
                    <span class="qqt-container-full-header___search">
                        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="pageInfo.name" size="mini"></el-input>
                        <span style="margin-right:10px;">
                            <el-date-picker
                                size="mini"
                                style="width:320px;"
                                v-model="createDate"
                                type="datetimerange"
                                @change="searchModelSynopsis()" 
                                :unlink-panels="true"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :default-time="['08:00:00', '18:00:00']"
                                align="right">
                            </el-date-picker>
                        </span>
                    </span>
                    <span class="customer-list-header-operation___right" style="margin-right: 10px;">
                        <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                        <el-button type="info" class="qqt-container-full-header-top___button" @click="resetSearch">重置</el-button>
                    </span>
                    <span class="customer-list-header-operation___right">
                        <el-button v-if="$has ('administer:corporationCharter:delete')" type="primary" class="qqt-container-full-header-top___button" @click="deleteBatch">批量删除</el-button>
                        <el-button v-if="$has ('administer:corporationCharter:changeLoan')" type="warning" class="qqt-container-full-header-top___button" @click="cerBorrow">证书借用</el-button>
                    </span>
                    <el-button-group style="margin-left: 10px;">
                        <el-button size="mini" icon="el-icon-upload2" @click="uploadFun">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                    <span class="qqt-container-full-header-operation___right">
                        <p>证书状态:</p>
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="expire" :options="stateOption" :defaultProp="stateDefaultProp" :size="'mini'" :placeholder="'请选择'" @select="expire = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </span>
                    <span class="qqt-container-full-header-operation___right">
                        <p>是否借出:</p>
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="isLoan" :options="isLoanOptions" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="isLoan = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </span>
            </div>
        </template>
        <div class="customer-list-center">
            <qqt-table
                ref="table"
                :exportData="exportData"
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
        <el-dialog
            v-dialogDrag
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <!-- 证书添加 -->
            <new-certificat
                v-if="addCer"
                ref="companyCer"
                :cerNameList="cerNameList"
                :value="backVal"
                @setTemData="setTemData"/>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="saveBtn" @click="subCer">保 存</el-button>
                <el-button type="info" v-if="saveBtn == false" @click="printTemplate">打印</el-button>
                <el-button @click="dialogVisible = false, certificate = false, addCer = false">取 消</el-button>
            </span>
        </el-dialog>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import {qqtTable, qqtSelect} from "../../../../components/qqt-subassembly";
import { companyCerList, companyCerAdd, companyCerQuery, companyCerEdit, companyCerDel, companyCerSearch, listByStartCrew, companyBorrowAdd } from '../../../../api/officalDocument/index'
import NewCertificat from "../borrowRecordC/components/newCertificate";
import UseFlowB from "../../personal/infoRegister/components/components/useFlowB";
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { CERTIFICATE } from '../../../../enum/FORMCODE'
import { queryDicById } from '../../../../api/system/dic/dic'
import util from '../../../../libs/util';
export default {
    name: "index",
    components: {UseFlowB, NewCertificat, qqtTable, qqtSelect, 'print-template-by-html': printTemplateByHtml },
    data () {
        return {
            exportData:[],
            createDate: [],
            isLoan: '',
            expire: '',
            isLoanOptions: [
                {
                    id: '0',
                    name: '未借出'
                },
                {
                    id: '1',
                    name: '已借出'
                },
                {
                    id: '2',
                    name: '申请中'
                }
            ],
            stateOption: [
                { id: '0', name: '未到期' },
                { id: '1', name: '已到期' }
            ],
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            stateDefaultProp: {
                value: 'name',
                label: 'name'
            },
            tableData: {},
            backVal: {},
            saveBtn: true,
            code: BASICSCODE.ADMIN_CORPORATION_CHARTER,
            businessId: '',
            rowHeader: [
                {
                    prop: 'name',
                    label: '证书名称',
                    isShow: true,
                    width: '180',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', },
                                on:{
                                    click: () => {
                                        companyCerQuery({ id: parms.row.id }).then(res => {
                                            this.businessId = res.id
                                            this.dialogTitle = parms.row.name
                                            this.dialogVisible = true
                                            this.addCer = true
                                            this.isAdd = false
                                            this.saveBtn = false
                                            setTimeout(() => {
                                                this.$refs.companyCer.setDetail('1')
                                                this.backVal = res
                                            }, 500)
                                        })
                                    }
                                }
                            }, parms.row.name)
                        ]
                    }
                },{
                    prop: 'encoding',
                    label: '证书编号',
                    isShow: true
                },
                {
                    prop: 'issueUnit',
                    label: '发证单位',
                    isShow: true
                },
                {
                    prop: 'isLoanName',
                    label: '是否借出',
                    isShow: true,
                    render: (h, parms) => {
                        let res = '';
                        if ( parms.row.isLoan === '1'){
                            res = '已借出';
                        }else  if ( parms.row.isLoan === '0'){
                            res = '未借出';
                        } else {
                            res = '申请中';
                        }
                        return h('p', { }, parms.row.isLoanName = res);
                    }
                }, 
                {
                    prop: 'custodyDep',
                    label: '保管部门',
                    isShow: true,
                    width: '245'
                },{
                    prop: 'keeper',
                    label: '保管人',
                    isShow: true
                },
                {
                    prop: 'credentialState',
                    label: '证书状态',
                    isShow: true,
                    // render: (h, parms) => {
                    //     return h('div', {},
                    //        parms.row.expireName = parms.row.expire === '0' ? '未到期' : '已到期' 
                    //     )
                    // }
                },
                {
                    prop: 'createName',
                    label: '登记人',
                    isShow: true
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true,
                    width: '180'
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render: (h, parms) => {
                        return [
                            this.$has ('administer:corporationCharter:edit') ? h('el-button', {
                                props:{ type: 'text', },
                                attrs: {
                                    disabled: parms.row.isLoan === '0' ? false : true
                                },
                                on:{
                                    click: () => {
                                        companyCerQuery({ id: parms.row.id }).then(res => {
                                            this.dialogTitle = parms.row.name
                                            this.dialogVisible = true
                                            this.isAdd = false
                                            this.addCer = true
                                            this.saveBtn = true
                                            setTimeout(() => {
                                                this.$refs.companyCer.setDetail('0')
                                                    this.backVal = res
                                            }, 500)

                                        })
                                    }
                                }
                            }, '编辑') : '',
                            this.$has ('administer:corporationCharter:delete') ? h('el-button', {
                                props:{ type: 'text', },
                                attrs: {
                                    disabled: parms.row.isLoan === '0' ? false : true
                                },
                                on:{
                                    click: () => {
                                        util.confirm('此操作将永久删除该证书, 是否继续?').then(valid => {
                                            if (valid) {
                                                companyCerDel({ids: parms.row.id}).then(res => {
                                                    this.$message.success("删除成功~~~")
                                                    this.searchModelSynopsis()
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '删除') : '',
                        ]
                    }
                }
            ],
            tableOption:  {
                border: false
            },
            filterText: '',
            dialogVisible: false,
            certificate: false,
            dialogTitle: '添加证书',
            temData: {},
            isAdd: true,
            selectData: [],
            pageInfo: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null
            },
            addCer: true,
            flowList: [],
            values: {
                credentialLoanList: [
                    {
                        name: "",
                        possessor: "",
                        encoding: "",
                        purpose: "",
                        borrowDate: ""
                    }
                ]
            },
            cerNameList: []
        }
    },
    methods: {
        handlePaginationChange (page) {
            this.pageInfo.pageNo = page.current
            this.pageInfo.pageSize = page.size
            this.searchModelSynopsis(false)
        },
        // 表格选择
        selectChange (data) {
            this.selectData = data
        },
        // 添加证书
        addCertificate () {
            this.addCer = true
            this.dialogVisible = true
            this.dialogTitle = "添加证书"
            this.certificate = false
            this.isAdd = true
            this.backVal = {}
            this.saveBtn = true
            setTimeout(() => {
                this.$refs.companyCer.setDetail('0')
                this.backVal = {}
            }, 500)
        },
        // 搜索
        searchModelSynopsis (boolean = true) {
            if (boolean) {
                this.pageInfo.pageNo = '1'
                this.pageInfo.pageSize = '10'
            }
            companyCerSearch({
                'name': this.pageInfo.name ? this.pageInfo.name : null,
                'isLoan': this.isLoan ? this.isLoan : null,
                'expire': this.expire ? this.expire : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime':this.createDate ? this.createDate[1] : null,
                'pageNo': this.pageInfo.pageNo,
                'pageSize': this.pageInfo.pageSize,
            }).then(res => {
                this.tableData = res
            })
        },
        resetSearch () {
            this.pageInfo = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: null,
                updateTime: null
            }
            this.isLoan = '',
            this.expire = '',
            this.createDate = []
            this.searchModelSynopsis()
        },

        // 借证登记
        cerBorrow () {
            if(this.selectData.length === 0){
                this.$message.warning("没有选择要借出的证书!!")
            }else{
                let isLoan = false
                this.selectData.forEach(item => {
                    if(item.isLoan === '1' || item.isLoan === '2'){
                        isLoan = true
                    }
                })
                if(isLoan){
                    this.$message.warning("选择的证书含有已借出的证书或者正在申请中的证书,请重新选择!")
                    return false
                }else{
                    this.$router.push({
                        path: 'cerBorrowC',
                        name: 'cerBorrowC',
                        params: {
                            cerInfo: this.selectData,
                            newSub: true
                        }
                    })
                }
            }
        },
        // 批量删除
        deleteBatch () {
            if(this.selectData.length === 0){
                this.$message.warning("没有选择删除的证书!!")
            }else{
                let ids = ''
                this.selectData.forEach(item => {
                    ids += item.id + ','
                })
                companyCerDel({
                    ids : ids
                }).then(res => {
                    this.$message.success("删除成功~~~")
                    this.searchModelSynopsis()
                })
            }
        },
        handleClose(done){
            done()
        },
        // 添加提交
        subCer () {
            if(this.addCer){
                // 添加
                this.$refs.companyCer.getData()
            }else{
                // 证书借出
                this.$refs.onFlow.getData()
            }
        },
        setTemData(data) {
            this.temData = data
            if(this.isAdd){
                // 说明是添加
                companyCerAdd(this.temData).then(res => {
                    this.$message.success('添加成功~~~')
                    this.dialogVisible = false
                    this.certificate = false
                    this.addCer = false
                    this.searchModelSynopsis()
                })
            } else {
                this.temData['id'] = this.backVal.id
                companyCerEdit(this.temData ).then(res => {
                    this.$message.success("编辑成功~~~")
                    this.dialogVisible = false
                    this.certificate = false
                    this.addCer = false
                    this.searchModelSynopsis()
                })
            }
        },
        uploadFun(){
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel()
            })
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.isLoan = item.isLoan === '1' ? '是' : '否'
                });
                resolve (true)
            });
        },
        printTable () {
            this.$refs.table.printTable (this.selectData)
        },
        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.businessId }).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
    },
    mounted() {
        this.searchModelSynopsis()
        let jsonData = {
            formKey:CERTIFICATE.USEFLOWBORROW
        };
        listByStartCrew(jsonData ).then(res => {
            this.flowList = res
        })
        queryDicById({  id: '1239372056181690368' }).then(res => {
            this.cerNameList= res
        })
    }
}
</script>

<style lang="scss">
.customer-list {
    .customer-list-header {
        padding-top: 10px;
        .customer-list-header___top{
            .customer-list-header___search {
                .el-input {
                    width: 10%;
                    padding-right: 10px;
                    top: -1px;
                }
                .el-date-editor{
                    width: 240px;
                }
            }
            .el-range-editor--mini .el-range-separator{
                display: inline-table;
            }
            .customer-list-header___state{
                padding-left: 10px;
                p {
                    display: inline-block;
                }
                .customer-list-header-state___select {
                    padding-left: 10px;
                    width: 5%;
                    display:inline-block;
                }
            }
            .customer-list-header-operation___left {
                padding-right: 10px;
            }
            .customer-list-header-operation___right {
                padding-left: 20px;
            }
            .customer-list-header___audit {
                padding-left: 20px;
                .el-button {
                    background: $color-button-reset !important;
                }
            }
        }
    }
    .customer-list-center {
        height: 100%;
        margin-top: -15px;
        background: $color-bg3;
        box-shadow: 0 2px 12px 0 $color-border-shadow;
    }
}
.customer-list-header-button {
    padding: 0 5px;
    height: 26px;
    border-radius: 3px;
}
.el-button--mini, .el-button--mini.is-round {
    padding: 6px 5px !important;
    top: -1px
}
</style>
