<template>
    <d2-container class="project-patrol-registration">
        <div slot="header" class="project-patrol-registration-module">
            <el-form :inline="true" :model="form" ref="form" size="mini" @submit.native.prevent>
                <el-form-item>
                    <el-button type="primary" v-if="$has('joint:patrol:add')" @click="addJointInspectionRecord">添加</el-button>
                </el-form-item>
                <el-form-item label prop="name">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" 
                        :clearable="true" 
                        @keyup.enter.native="dataSearch"/>
                </el-form-item>
                <span class="address-book-header___search" >
                    <el-date-picker
                        style="width: 320px; margin-right:10px;"
                        v-model="selectTime"
                        type="datetimerange"
                        @change="getTime"
                        size="mini"
                        :unlink-panels="true"   
                        range-separator="至"
                        format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['08:00:00', '18:00:00']"
                        align="right">
                    </el-date-picker>
                </span>
                <el-form-item>
                    <el-button type="primary" @click="dataSearch">搜索</el-button>
                </el-form-item>
                <el-form-item>
                <el-form-item>
                    <el-button type="info" @click="resetBtn">重置</el-button>
                </el-form-item>
                    <el-button type="danger" v-if="$has('joint:patrol:delete')" @click="delectAll">批量删除</el-button>
                </el-form-item>
                <el-button-group>
                    <!-- <el-button size="mini" icon="el-icon-download" @click="">筛选</el-button> -->
                    <el-button size="mini" icon="el-icon-upload2" @click="uploadFun">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </el-button-group>
            </el-form>
        </div>
    
        <template>
            <qqt-table ref="table" :exportData="exportData" :data="projectPatrolRegistrationData" :dynamicHeader="dynamicHeader" :option="tableOption" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </template>
    </d2-container>
</template>


<script>
import {mapActions } from 'vuex'
import { jointInspectionRecord, basicInformationQueryItem, deletePatrolRecordByID, batchDeletePatrolRecord } from '../../../../../api/jointProject/projectInspectionRegistration'
import util from '../../../../../libs/util'
export default {
    data () {
        return {
            form: {
                keywords:''
            },
            selectTime: [],
            values: {},
            isEdit:false,
            dynamicHeader: {
                tableId: 'T_1572505285',
                isSave: true,
            },
            projectPatrolRegistrationData: { },
            tableOption: {
                border: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            proId:'',
            projectInformationData:{},
            rowData:[],
            rowHeader: [
                {
                    prop: 'projectName',
                    label: '项目名称',
                    isShow:true,
                    render: (h, params) => {
                        return h('span', {
                            style: {color: '#409EFF', cursor: 'pointer',},
                            on: {
                                click: (index, row) => {
                                    this.rowData = params.row
                                    this.$router.push({
                                        path: 'addProjectPatrolRegistration',
                                        name: 'addProjectPatrolRegistration',
                                        params: {
                                            isRdit : false,
                                            isAdd: false,
                                            isDetail: true,
                                            rowData: this.rowData
                                        }
                                    })
                                }
                            }
                        }, params.row.projectName)
                    }
                },
                {
                    prop: 'section',
                    label: '标段',
                    isShow:true
                },
                {
                    prop: 'inspectingOfficer',
                    label: '巡查人',
                    isShow:true
                },
                {
                    prop: 'patrolTime',
                    label: '巡查时间',
                    isShow:true
                },
                {
                    prop: 'inspectionsNumber',
                    label: '巡查次数',
                    isShow:true
                },
                {
                    prop: 'inspectionResults',
                    label: '巡查结果',
                    isShow:true
                },
                {
                    prop: 'treatmentMeasures',
                    label: '巡查措施',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '登记人',
                    isShow:true
                },
                 {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow:true
                },
                {
                    prop: "",
                    label: "操作",
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render:(h, params) => {
                        return [
                            h("el-button",{
                                props: {
                                    type: "text"
                                },
                                on: {
                                    click: (index, row) => {
                                        this.rowData = params.row
                                        this.$router.push({
                                            path: 'addProjectPatrolRegistration',
                                            name: 'addProjectPatrolRegistration',
                                            params: {
                                                isAdd : false,
                                                rowData: this.rowData
                                            }
                                        })
                                    }
                                }
                            },  this.$has('joint:patrol:edit') ? "编辑" : ''),
                            h("el-button",{
                                props: { type: "text" },
                                on: {
                                    click: () => {
                                        util.confirm('此操作将永久删除该文件, 是否继续?').then(vaild => {
                                            if (vaild) {
                                                deletePatrolRecordByID({ id: params.row.id }).then( res => {
                                                    this.$message.success('删除成功')
                                                    this.getprojectPatrolRegistrationList ()
                                                }).catch( err => {
                                                    this.$message.error("删除失败")
                                                })
                                            } else {
                                                this.$message({
                                                    type: 'info',
                                                    message: '已取消删除'
                                                })
                                            }
                                        })
                                    }
                                }
                            },  this.$has('joint:patrol:delete') ? "删除" : ''),
                        ];
                    },
                },
            ],
            exportData: []
        }
    },
    methods: {
        dataSearch () {
            this.getprojectPatrolRegistrationList ({name:this.form.keywords})
        },

        async getprojectPatrolRegistrationList () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            jointInspectionRecord({
                name:this.form.keywords,
                pageNo: this.page.current,
                pageSize: this.page.size,
                projectId: this.proId,
                createTime: this.selectTime ? this.selectTime[0] : '',
                updateTime: this.selectTime ? this.selectTime[1] : ''
            }).then( res => {
                this.projectPatrolRegistrationData = res
            })
        },

        addJointInspectionRecord () {
            this.$router.push({
                path: 'addProjectPatrolRegistration',
                name: 'addProjectPatrolRegistration',
                params: {
                    isAdd : true
                }
            })
        },

        editJointInspectionRecord ( ) {
            
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },
        
        delectAll () {
            let ids = ''
            if (this.multipleSelection == undefined) {
               this.$message.warning("请选择至少一条数据")
            } else {
                this.multipleSelection.forEach(item => {
                    ids += item.id + ','
                })
                ids = ids.substring(0, ids.length - 1)
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "btn-custom-cancel",
                    type: 'warning'
                }).then(() => {
                    batchDeletePatrolRecord({
                        ids: ids
                    }).then( res => {
                        this.$message.success('删除成功')
                        this.getprojectPatrolRegistrationList ()
                    }).catch( err => {
                        this.$message.error("删除失败")
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }
        },

        resetBtn () {
            this.form.keywords = ''
            this.selectTime = []
            this.getprojectPatrolRegistrationList ()
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val
            this.getprojectPatrolRegistrationList()
        },
        getTime(time){
            this.getprojectPatrolRegistrationList()
        },
        uploadFun(){
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel()
            })
        },
        printTable () {
            this.$refs.table.printTable (this.multipleSelection)
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.projectPatrolRegistrationData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {});
                resolve (true)
            });
        },
        ...mapActions('d2admin/page', [
            'close',
            'database'
        ]),
    },
    created() {
        this.getprojectPatrolRegistrationList ()
        
    },
    components: {
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table')
    }
}
</script>

<style lang="scss">
.project-patrol-registration{
    .d2-container-full__header{
        padding-bottom: 0px !important; 
        .el-range-separator{ display: contents; }
    }
    .el-range-separator{ display: contents; }
    .el-date-editor .el-range-input { width: 47%; }
    .project-patrol-registration-module{
        margin-bottom: 0px;
        .el-form-item{
            margin-bottom: 0px;
        }
        .el-button-group{
            .el-button{
                height: 30px;
            }
        }
    }
}
</style>