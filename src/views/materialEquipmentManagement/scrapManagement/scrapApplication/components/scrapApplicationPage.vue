<template>
<!-- 离职申请  -->
    <d2-container>
        <div slot="header" class="purchase-warehousing-page">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" @keyup.enter.native="dataSearch"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        size="mini"
                        v-model="createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至" 
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="dataSearch()" 
                        align="right">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="batchDeleteEven">批量删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="isResignationApproval">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="unResignationApproval">反审核</el-button>
                    </el-button-group>
                </el-form-item>
                <el-form-item>
                    <el-button-group>
                        <el-button size="mini" @click="" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </el-form-item>
            </el-form>
        </div>
        
        <div class="purchase-warehousing-conent">
            <qqt-table :data="resignationApplicationData" :option="tableOption" ref="table" :dynamicHeader="dynamicHeader" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        
    </d2-container>
</template>


<script>
// import { resignationApplicationPageSearch, deleteResignationApplicationID, batchDeleteResignationApplication, queryResignationByID,
//     resignationApproval
// } from '../../../../api/personnelManagement/leaveApplication'
export default {
    comments: {
        
    },
    data () {
        return {
            form: {
                keywords:''
            },
            
            transform: {
                isShowDetails: false
            },

            // 时间搜索
            createDate: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, 
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },

            resignationApplicationData: { },
            multipleSelection: [],
            tableOption: {
                border: true
            }, 
            dynamicHeader: {
                tableId: 'T_1095440192',
                isSave: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            isAdd:false,
            rowData:[],
            rowHeader: [
                {
                    prop: 'leavingCode',
                    label: '盘点编号',
                    isShow:true,
                    width:'150',
                    render: (h, params) => {
                        return h('el-button', {
                            style: {
                                color: '#3ba5ff'
                            },
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'addResignationApplication',
                                        name: 'addResignationApplications',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.leavingCode)
                    }
                },
                {
                    prop: 'leavingName',
                    label: '盘点名称',
                    isShow:true,
                    width:'150',
                    render: (h, params) => {
                        return h('el-button', {
                            style: {
                                color: '#3ba5ff'
                            },
                            attrs: {
                                type: 'text'
                            },
                            on: {
                                click: (index, row) => {
                                    this.transform.isShowDetails = true
                                    this.$router.push({
                                        path: 'addResignationApplication',
                                        name: 'addResignationApplications',
                                        params: {
                                            procInstId: params.row.procInstId,
                                            transform: this.transform,
                                            relevancyId: params.row.id
                                        }
                                    })
                                }
                            }
                        }, params.row.leavingName)
                    }
                },
                {
                    prop: 'procState',
                    label: '盘点部门',
                    isShow:true,
                    width:'150',
                    render: (h,params) =>{
                        let text = '';
                        if (params.row.procState === '1') {
                            text = '初始化';
                        } else if (params.row.procState === '2') {
                            text = '待审批';
                        } else  if (params.row.procState === '3'){
                            text = '审批中';
                        } else  if (params.row.procState === '4'){
                            text = '已驳回';
                        } else  if (params.row.procState === '5'){
                            text = '已作废';
                        } else  if (params.row.procState === '10'){
                            text = '已完结';
                        }  else  if (params.row.procState === '6'){
                            text = '待提交';
                        } 
                            return h('div',{

                            }, params.row.procStateName = text)
                        }
                },
                {
                    prop: 'state',
                    label: '盘点类型',
                    isShow:true,
                    width:'120',
                    render: (h,params) =>{
                        let text = '';
                        if (params.row.state === '0') {
                            text = '未审核';
                        } else if (params.row.state === '1') {
                            text = '审核';
                        }
                        return h('div',{
                        
                        }, params.row.stateName = text)
                    }
                },
                {
                    prop: 'agent',
                    label: '经办人',
                    isShow:true,
                    width:'100',
                },
                {
                    prop: 'department',
                    label: '开始日期',
                    isShow:true,
                    width:'120',
                },
                {
                    prop: 'entryTime',
                    label: '结束日期',
                    isShow: true,
                    width:'180',
                    sortable: true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    render:(h, params) => {
                        return [
                            h("el-button",{
                                props: {
                                    type: "danger"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                            
                                }
                            },"终止入库"),
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.transform.isShowDetails = false
                                        this.$router.push({
                                            path: 'addResignationApplication',
                                            name: 'addResignationApplications',
                                            params: {
                                                transform: this.transform,
                                                relevancyId: params.row.id
                                            }
                                        })
                                    }
                                }
                            },"编辑"),
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                attrs: {
                                    disabled: params.row.procState === '1' ? false : true
                                },
                                style:{
                                    color: params.row.procState === '1'? '#409EFF' : '#999',
                                },
                                on: {
                                    click: () => {
                                        // this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                                        //     confirmButtonText: '确定',
                                        //     cancelButtonText: '取消',
                                        //     type: 'warning'
                                        // }).then(() => {
                                        //     deleteResignationApplicationID({
                                        //         id: params.row.id
                                        //     }).then( res => {
                                        //         this.$message.success('删除成功')
                                        //         this.getEntryRegistrationList ()
                                        //     }).catch( err => {
                                        //         this.$message.error("删除失败")
                                        //     })
                                        // }).catch(() => {
                                        //     this.$message({
                                        //         type: 'info',
                                        //         message: '已取消删除'
                                        //     });          
                                        // });
                                    }
                                }
                            },"删除"),
                        ];
                    },
                },
            ],
        }
    },
    methods: {

        // 搜索
        dataSearch () {
            // this.getEntryRegistrationList ({
            //     'name': this.form.keywords ? this.form.keywords : null,
            //     'createTime': this.createDate ? this.createDate[0] : null,
            //     'updateTime':this.createDate ? this.createDate[1] : null
            // })
        },

        // 重置
        resetBtn () {
            // this.filterText = ''
            // this.createDate = []
            // this.getEntryRegistrationList ()
        },

        // 批量删除
        batchDeleteEven () {
            // let ids = ''
            // if (this.multipleSelection.length == 0 ) {
            //    this.$message.warning("请选择至少一条数据")
            // } else {
            //     this.multipleSelection.forEach(item => {
            //         this.multipleSelection = item
            //     });
            //     if (this.multipleSelection.procState == '1'){
            //         this.$message.warning('被选中的数据中有已进入流程，禁止删除')
            //     } else {
            //         this.multipleSelection.forEach(item => {
            //             ids += item.id + ','
            //         })
            //         ids = ids.substring(0, ids.length - 1)
            //         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //         }).then(() => {
            //             batchDeleteResignationApplication({
            //                 ids: ids
            //             }).then( res => {
            //                 this.$message.success('删除成功')
            //                 this.getEntryRegistrationList ()
            //             }).catch( err => {
            //                 this.$message.error("删除失败")
            //             })
            //         }).catch(() => {
            //             this.$message({
            //                 type: 'info',
            //                 message: '已取消删除'
            //             });          
            //         });
            //     }
                
            // }
        },

        // 初始化加载数据
        getEntryRegistrationList (item) {
            // resignationApplicationPageSearch({
            //     ...item,
            //     pageNo: this.page.current,
            //     pageSize: this.page.size
            // }).then( res => {
            //     this.resignationApplicationData = res
            // })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },

        // 分页变化改动
        handlePaginationChange(val) {
            // this.page = val;
            // this.$nextTick(() => {
            //     this.selectChangeData ()
            // });
        },

        isResignationApproval () {
            // if ( this.multipleSelection.length === 1) {
            //     if (this.multipleSelection[0].state === '0') {
            //         this.$confirm('您是否要审核该条数据', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //         }).then(() => {
            //             resignationApproval({
            //                 id: this.multipleSelection[0].id,
            //                 type: '1'
            //             }).then(res=> {
            //             if (res.success) {
            //                 this.$message.success(res.message);
            //             } else {
            //                 this.$message.error(res.message);
            //             }
            //             this.getEntryRegistrationList ();
            //             })
            //         })
            //     } else {
            //         this.$message.error('该数据已审核不支持继续审核');
            //     } 
            // } else if (this.multipleSelection.length === 0) {
            //     this.$message.error('请选择要审核的数据');
            // } else {
            //     this.$message.error('只支持单条数据操作');
            // }
        },

        unResignationApproval () {
            // if (this.multipleSelection.length === 1) {
            //     if (this.multipleSelection[0].state === '0') {
            //         this.$confirm('您是否要反审核该条数据', '提示', {
            //             confirmButtonText: '确定',
            //             cancelButtonText: '取消',
            //             type: 'warning'
            //         }).then(() => {
            //             resignationApproval({
            //                 id: this.multipleSelection[0].id,
            //                 type: '0'
            //             }).then(res=> {
            //                 if (res.success) {
            //                     this.$message.success(res.message);
            //                 } else {
            //                     this.$message.error(res.message);
            //                 }
            //                     this.getEntryRegistrationList();
            //                 })
            //         })

            //     } else {
            //     this.$message.error('该数据未审核不支持继续反审核');
            //     }
            // } else if (this.multipleSelection.length === 0) {
            //     this.$message.error('请选择要审核的数据');
            // } else {
            //     this.$message.error('只支持单条数据操作');
            // }
        },

        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
        }

    },
    mounted() {
        // this.getEntryRegistrationList()
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    },
}
</script>

<style lang="scss" scoped>
    .purchase-warehousing-page{
        margin-bottom: -20px;
    }
    .resignation-application{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>