<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="newReserve">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="filterForm.keywords" size="mini"></el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetSearch">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        size="mini"
                        style="width:320px;"
                        v-model="selectTime"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="getTime"
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" icon="el-icon-check" @click="checkAgainstPurchaseRequestData ('1')">审核</el-button>
                        <el-button size="mini" icon="el-icon-close" @click="checkAgainstPurchaseRequestData ('0')">反审核</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="address-book-center">
            <qqt-table ref="table" :exportData="exportData" :data="tableData" :rowHeader="rowHeader" :option="tableOption" :dynamicHeader="dynamicHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>
<script>
import { qqtTable } from '@/components/qqt-subassembly'
import { earlyStagePageList, stageDeleteBatch, stageCheckOrAgainst  } from '@/api/selfProject/earlyStage/index'
import projectInfo from '../components/commenInfo/projectInfo'
import { mapState } from 'vuex'
import util from '../../../../libs/util'
export default {
    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo,
    },
    data () {
        return {
            selectTime: [], 
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            filterForm: {
                keywords: '',
                pageNo: '1',
                pageSize: '10',
                createTime: '',
                updateTime: '',
            },
            exportData: [],
            tableData: {},
            rowHeader: [
                {
                    prop: 'projectStageDic',
                    label: '项目当前所处阶段',
                    width: "150",
                    isShow: true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('earlyStageAdd', { transform: this.transform, relevancyId: parms.row.id, procInstId: parms.row.procInstId}, '前期跟踪详情')
                                }
                            }
                        }, parms.row.projectStageDic)
                    }
                },{
                    prop: 'projectGradingDic',
                    label: '项目当前等级',
                    isShow: true,
                    width: "140",
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{ type: 'text', },
                            on:{
                                click: async () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink('earlyStageAdd', { transform: this.transform, relevancyId: parms.row.id, procInstId: parms.row.procInstId}, '前期跟踪详情')
                                }
                            }
                        }, parms.row.projectGradingDic)
                    }
                },{
                    prop: 'name',
                    label: '被跟踪人',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'department',
                    label: '所在部门',
                    width: "120",
                    isShow: true,
                },{
                    prop: 'duty',
                    label: '职务/岗位',
                    isShow: true,
                    width: "100",
                },{
                    prop: 'phone',
                    label: '联系电话',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'createName',
                    label: '跟踪人',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'tailTime',
                    label: '跟踪时间',
                    isShow: true,
                    width: "160",
                },{
                    prop: 'wayDic',
                    label: '跟踪方式',
                    width: "80",
                    isShow: true
                },{
                    prop: 'tailResult',
                    label: '跟踪效果',
                    width: "120",
                    isShow: true
                },{
                    prop: 'procStateName',
                    label: '办理状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', { }, parms.row.procStateName = util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'agent',
                    label: '待办人',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agent ? parms.row.agent : '无' )
                    }
                },{
                    prop: 'auditStateName',
                    label: '审核状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                            style: { color: parms.row.auditState === '1' ? '#67C23A' : '#F56C6C' }
                        }, parms.row.auditStateName = parms.row.auditState === '1' ? '已审核' : '未审核')
                    }
                },{
                    prop: 'createName',
                    label: '创建人',
                    width: "100",
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '创建时间',
                    width: "160",
                    isShow: true
                },{
                    prop: "",
                    label:"操作",
                    fixed: "right",
                    width: "150",
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text' },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink('earlyStageAdd', { transform: this.transform, relevancyId: parms.row.id, procInstId: parms.row.procInstId}, '前期跟踪编辑')
                                    }
                                }
                            }, '编辑'),
                            h('el-button', {
                                props:{ type: 'text' },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        util.confirm('确定删除这条内容吗？').then(valid => {
                                            if (valid) {
                                                stageDeleteBatch({ ids : parms.row.id }).then(res => {
                                                    if (res) {
                                                        this.$message.success("删除成功!!!")
                                                        this.searchModelSynopsis()
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }, '删除'),
                        ]
                    }
                },
            ],
            tableOption: {
                border: true
            },
            dynamicHeader: {
                // tableId: 'T_1572488196',
                // isSave: true
            },
            selectData: [],
            transform: {
                isShowDetails: false
            }
        }
    },
    methods: {

        newReserve() {
            this.transform.isShowDetails = false
            this.routerLink('earlyStageAdd', { isAdd: true, transform: this.transform }, '新建前期跟踪')
        },

        routerLink (url, params, title) {
            this.$router.push({
                path: url,
                name: url,
                params: params
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },

        getTime (data) {
            this.filterForm.createTime = data && data.length > 0 ? data[0] : ''
            this.filterForm.updateTime = data && data.length > 0 ? data[1] : ''
            this.searchModelSynopsis()
        },

        searchModelSynopsis () {
            earlyStagePageList({
                ...this.filterForm,
                time: this.filterForm.length>0 ? this.filterForm.createTime + ',' + this.filterForm.updateTime : "",
                projectCode: this.selfSupportProject.projectCode
            }).then(res => {
                this.tableData = res
            })
        },

        resetSearch () {
            this.selectTime = []
            this.filterForm = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                createTime: '',
                updateTime: '',
            }
            this.searchModelSynopsis()
        },

        printTable () {
            this.$refs.table.printTable (this.selectData)
        },

        selectChange (data) {
            this.selectData = data
        },

        handlePaginationChange (data) {
            this.filterForm.pageNo = data.current
            this.filterForm.pageSize = data.size
            this.searchModelSynopsis()
        },

        checkAgainstPurchaseRequestData (type) {
            if (this.selectData.length === 0) {
                this.$message.warning("未选择内容!!!")
            } else if(this.selectData.length > 1){
                this.$message.warning("只能选择单条内容!!!")
            } else if(this.selectData[0].state === type){
                this.$message.warning(type === '1' ? '选择的内容已审核，请重新选择!!!' : '选择的内容已反审核，请重新选择!!!')
            } else {
                stageCheckOrAgainst({ id: this.selectData[0].id, type: type }).then(res => {
                    this.$message.success(res.message)
                    this.searchModelSynopsis()
                })
            }
        }
    },

    mounted () {
        this.searchModelSynopsis()
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    async created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    watch: {
        selfSupportProject () {
            this.searchModelSynopsis ()
        }
    },

}
</script>
<style lang="scss">
</style>