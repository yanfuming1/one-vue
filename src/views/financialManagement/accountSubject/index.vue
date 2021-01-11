<template>
    <d2-container class="accountSubject" v-if="!dialogShow">
        <!-- <draggable>
            <div style="width:100px;height:100px;background-color:#333">测试数据</div>
        </draggable>

        <div class="hooveDiv" @mouseenter="mousemove" style="width:250px;height:200px;background-color:#999;border:1px solid #000;margin-top:200px;">
            放到这里
        </div> -->
        <div class="bodyDiv">
            <el-row style="width:100%">
                <el-col :span="4" style="height:100%">
                    <el-card style="height: 100%;">
                        <div slot="header">
                            <i class="titleLine"></i>
                            <span class="titleSpan">会计科目核算</span>
                        </div>
                        <div class="cardBody">
                            <el-tree :data="listData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="19"  style="height:100%;margin-left:30px">
                    <el-card style="height: 100%;padding:20px">
                        <template>
                            <el-form :inline="true" class="demo-form-inline " :model="search"  ref="form" size="mini" label-width="100px">
                                    <el-form-item v-if="$has ('finance:accountingSubject:add')">
                                        <el-button type="primary" size="mini" @click="addBtn">添加</el-button>
                                    </el-form-item>
                                    <el-form-item  prop="keywords">
                                        <el-input v-model="search.keywords"  placeholder="请输入关键字"  :clearable="true"/>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="dataSearch()">搜索</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="info" @click="reset()">重置</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                                    </el-form-item>
                                </el-form>
                                <div class="fina_applica_center">
                                    <qqt-table :data="tableData" 
                                        ref="table" :exportData="exportData"
                                        :rowHeader="rowHeader" 
                                        :option="tableOption"           
                                        @page="pageChange"
                                        @selectionChange="selectChange">
                                    </qqt-table>
                                </div> 
                        </template>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </d2-container>
    <add-dialog v-else :dialogData="dialogData" :isAdd="isAdd" @dialogCancel="dialogCancel" ></add-dialog>
</template>
<script>
    import {listAllSubject,tableList,goAdd} from '../../../api/financialManagement/accountSubject';
    import util from '@/libs/util';
    import Draggable from 'vuedraggable'

    import {qqtTable} from '../../../components/qqt-subassembly';
    import titleLine from '../component/titleLine/titleLine';
    import addDialog from './components/addDialog';
    export default {
        components: {
            titleLine,
            qqtTable,
            addDialog,
            'draggable': Draggable

        },
        data() {
            return {
                isAdd:'添加',
                exportData: [],
                tableData: {},
                listData: [],
                dialogData:{},
                dialogShow:false,
                superiorcode: '',
                selectData: [],
                tableOption: {
                    border: false,
                    isOpenSummary: false,
                },
                rowHeader: [
                     {
                        prop: 'subjectname',
                        label: '科目名称',
                        isShow: true,
                        minWidth: '160px'
                    },
                    {
                        prop: 'subjectserial',
                        label: '科目序号',
                        isShow: true,
                        width: '120px'
                    },
                    {
                        prop: 'subjectseq',
                        label: '科目级别',
                        isShow: true,
                        width: '120px'
                    },
                    {
                        prop: 'subjectcode',
                        label: '科目编码',
                        isShow: true,
                        width: '120px'
                    },
                    {
                        prop: 'superiorname',
                        label: '上级名称',
                        isShow: true,
                        minWidth: '160px'
                    },
                    {
                        prop: 'superiorseq',
                        label: '上级级别',
                        isShow: true,
                        width: '120px'
                    },
                    {
                        prop: 'subfullname',
                        label: '科目全称',
                        isShow: true,
                        minWidth: '160px'
                    },
                    {
                        prop: '',
                        width: '120px',
                        label: '操作',
                        isShow: true,
                        render: (createElement, params) => {
                            return createElement('div',
                                [
                                    this.$has ('finance:accountingSubject:edit') ? createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                        style:{
                                        },
                                        on: {
                                            click: () => {
                                                this.dialogShow = true;
                                                this.dialogData = params.row
                                                this.isAdd = '编辑';
                                                
                                            }
                                        }
                                    },'编辑') : '',
                                    createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                        style:{
                                        },
                                        on: {
                                            click: () => {
                                                this.dialogShow = true;
                                                this.dialogData = params.row
                                                this.isAdd = '详情';
                                            }
                                        }
                                    },'详情')
                                ]
                            )
                        }
                    }
                ],
                defaultProps: {
                    children: 'accountingSubjects',
                    label: 'subjectname'
                },
                search: {
                    keywords: '',
                    superiorcode: '',
                    pageNo: 1,
                    pageSize: 10,
                }
            }
        },
        methods: {
            mousemove (e) {
            },
            handleNodeClick (data) {
                this.superiorcode = data.subjectcode;
                this.search.superiorcode = this.superiorcode;
                this.dataSearch();
            },
            reset () {
                this.search.pageNo = 1;
                this.search.pageSize = 10;
                this.search.keywords = '';
                this.search.superiorcode = '';
                this.dialogShow = false;
                this.dataSearch();
                // listAllSubject ().then(res => {
                //     this.listData = res;
                // })
            },
            dialogCancel () {
                this.search.pageNo = 1;
                this.search.pageSize = 10;
                this.search.keywords = '';
                this.search.superiorcode = '';
                this.dialogShow = false;
                this.dataSearch();
                listAllSubject ().then(res => {
                    this.listData = res;
                })
            },
            // 添加
            addBtn () {
                if (this.superiorcode === '') {
                    this.$message.error('请先选择核算科目类')
                    return
                }
                this.dialogShow = true;
                this.getAddData({'superiorcode':this.superiorcode})
            },
            getAddData (data) {
                goAdd (data).then(res => {
                    res.settime = new Date().format('yyyy-MM-dd hh:mm:ss')
                    res.subjectname = '';
                    res.subjectserial = '';
                    res.subjectseq = '';
                    res.superiorcode = res.subjectcode;
                    res.remark = '';
                    res.substatus = '使用';
                    res.subjectcode = '';
                    this.dialogData = res;
                    this.isAdd = '添加';

                })
            },
            dataSearch () {
                 tableList (this.search).then(res => {
                    this.tableData = res;
                }).catch(err => {
                    console.log(err);
                });
                this.selectData = [];
            },
            pageChange (data) {
                this.search.pageNo = data.current;
                this.search.pageSize = data.size;
                this.dataSearch();
            },
            getExportData () {
                this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
                return new Promise((resolve, reject) => {
                    resolve (true)
                });
            },
            uploadFun () { 
                this.getExportData().then(res => {
                    this.$refs.table.getExportExcel()
                })
            },
            selectChange (val) {
                this.selectData = val;
            },

            printTable () {
                this.$refs.table.printTable (this.selectData)
            }
        },
        mounted () {
            listAllSubject ().then(res => {
                this.listData = res;
            })
            this.dataSearch()
        },
    }
</script>

<style lang="scss">
.hooveDiv:hover{
    // transform: scale(1.5)
    background-color: aqua!important
}
.accountSubject{
    .titleLine {
        border: 1px solid $color-vertical-line;
    }
    .titleSpan{
        padding-left: 10px;
        font-size: 16px;
    }
    .cardBody{
        height: 550px;
        padding: 20px;
        overflow-y: scroll;
        margin-right: -18px;
    }
    .el-card__body{
        padding: 0;
    }
    .bodyDiv{
        min-height: 100%;
        display: flex;
        .leftDiv{
            flex: 2;
            min-height: 100%;
            margin-right: 15px
        }
        .rightDiv{
            flex: 7.5;
            min-height: 100%;
        }
    }
}
</style>