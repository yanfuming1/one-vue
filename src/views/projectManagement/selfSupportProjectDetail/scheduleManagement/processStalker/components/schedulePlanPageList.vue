<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
                <!-- <span class="qqt-container-full-header-operation___left">
                    <span class="qqt-container-full-header___search">
                        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="filterText" size="mini"></el-input>
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
                </span> -->
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>
<script>
import { selfSchedulePlanPageList, selfSchedulePlanDel, selfSchedulePlanQueryById, schedulePlanActualList } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
import { qqtTable } from '@/components/qqt-subassembly';
import { mapState } from 'vuex';
import projectInfo from '../../../components/commenInfo/projectInfo';
import util from '@/libs/util.js';
export default {
    data () {
        return {
            filterText: '',
            options: [],
            createDate: [],
            tableSelectData: [],
            selectTime: [],
            tableOption: {
                border: false
            },
            transform: {
                isShowDetails: false
            },
            dynamicHeader: {
                tableId: '',
                isSave: false
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
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
            tableData: {},
            recordList: {},
            rowHeader: [
                {
                    prop: 'planName',
                    label: '计划名称',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: { 'typefaceColor': true, },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('进度跟踪详情', parms.row.id)
                                }
                            }
                        }, parms.row.planName)
                    }
                },
                {
                    prop: 'version',
                    label: '版本号',
                    width: "140",
                    isShow: true
                },
                {
                    prop: 'createName',
                    label: '计划编制人',
                    width: '100',
                    isShow: true,
                },
                {
                    prop: 'createTime',
                    label: '计划编制日期',
                    isShow: true,
                    width: '180',
                },
                 {
                    prop: '',
                    label: '操作',
                    width: 150,
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text', },
                                on:{
                                    click: () => {
                                        this.routerLinkRecord ('滞后分析', parms.row.id)
                                    }
                                }
                            }, '滞后分析'),
                        ]
                    }
                }
            ],
            proCode: '',
            isShowDetails: false,
            projectCode: '',
        }
    },

    methods: {
        routerLinkRecord (name,id) {
            this.$router.push ({
                path: 'hysteresisPage',
                name: 'hysteresisPage',
                params: {
                    relevancyId: id,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', name)
        },
        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis () {
            this.getBudgetInfoPage ({
                'name': this.filterText ? this.filterText : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime': this.createDate ? this.createDate[1] : null})
        },

        resetSearch () {
            this.filterText = ''
            this.createDate = []
            this.selectTime = []
            this.searchModelSynopsis ()
        },

        getTime (time) {
            this.createDate = time
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },

        getBudgetInfoPage (text) {
            this.projectCode = this.selfSupportProject.projectCode
            selfSchedulePlanPageList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size,
                'projectCode': this.selfSupportProject.projectCode,
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        deleteBudgetInfoList () {
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('请选择一条数据')
                return
            }
            let ids = ''
            let canDel = true
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                    if(res.procState !== '1') { canDel = false }
                })
            }
            if(canDel) {
                this.deleteBudgetInfoById ({'ids': ids.substring(0, ids.length - 1)})
            } else {
                this.$message.warning("选择内容有正在审批或者已完结的内容，不能删除!!!")
            }
        },

        deleteBudgetInfoById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    selfSchedulePlanDel (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getBudgetInfoPage ()
                        }
                    })
                }
            })
        },

        addBudgetInfo () {
            this.isShowDetails = false
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.getBudgetInfoPage ()
        },

        exportExcel () {
            this.$refs.table.getExportExcel ()
        },

        routerLink (title, id = '') {
            this.$router.push ({
                path: 'schedulePlanPageAdd',
                name: 'schedulePlanPageAdd',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                    changeAdd: true,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
    },

    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo,
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
            this.getBudgetInfoPage ()
        }
    }
}
</script>
<style lang="scss">
.record-drawer{
    .el-drawer__body{
        height: 100%;
        overflow-y: scroll;
    }
}
</style>
