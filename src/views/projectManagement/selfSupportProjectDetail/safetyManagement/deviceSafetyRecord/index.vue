<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <el-row> <project-info></project-info></el-row>
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addIndex">添加</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        @keyup.enter.native="searchModelSynopsis"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
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
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteIndexList">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <!-- <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button> -->
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center self-safty">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange" />
        </div>
    </d2-container>
</template>

<script>
import { deviceSafetyPageList, deviceSafetyDel } from '@/api/selfProject/safetyManagement/deviceSafety/index'
import { qqtTable } from '@/components/qqt-subassembly'
import projectInfo from '../../components/commenInfo/projectInfo'
import { mapState } from 'vuex'
import util from '@/libs/util.js'
export default {
    data () {
        return {
            filterText: '',
            options: [],
            createDate: [],
            tableSelectData: [],
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
            tableData: {},
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
            rowHeader: [
                {
                    prop: 'untitled3',
                    label: '设备名称',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: {
                                'typefaceColor': true,
                            },
                            on:{
                                click: () => {
                                    this.transform.isShowDetails = true
                                    this.routerLink ('设备安全巡查详情', parms.row.id)
                                }
                            }
                        }, parms.row.untitled3)
                    }
                },
                {
                    prop: 'procState',
                    label: '办理状态',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', { }, util.handleState(parms.row.procState))
                    }
                },{
                    prop: 'agent',
                    label: '待办人',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.agent ? parms.row.agent : '无' )
                    }
                },
                {
                    prop: 'createName',
                    label: '登记人',
                    isShow: true,
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true,
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                attrs:{ disabled: parms.row.procState ==='1' ? false : true },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        this.routerLink ('设备安全巡查编辑', parms.row.id)
                                    }
                                }
                            }, '编辑'),
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.deleteIndexObject (parms.row.id)
                                    }
                                }
                            }, '删除')
                        ]
                    }
                }
            ]
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis () {
            this.getIndexPage ({
                'keywords': this.filterText ? this.filterText : null,
                'time': this.createDate ? this.createDate[0] + ',' + this.createDate[1] : null})
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                this.searchModelSynopsis ()
            });
        },

        getIndexPage (text) {
            deviceSafetyPageList ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size,
                'projectCode': this.selfSupportProject.projectCode
            }).then( res => {
                if (res) this.tableData = res
            })
        },

        deleteIndexObject (id) {
            this.deleteIndexById ({'ids': id})
        },

        deleteIndexList () {
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('请选择一条数据')
                return
            }
            let ids = ''
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                })
            }
            this.deleteIndexById ({'ids': ids.substring(0, ids.length - 1)})
        },

        deleteIndexById (id) {
            util.confirm ().then (boolean => {
                if (boolean) {
                    deviceSafetyDel (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getIndexPage ()
                        }
                    })
                }
            })
        },

        addIndex () {
            this.transform.isShowDetails = false
            this.routerLink ('添加设备安全巡查记录')
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.getIndexPage ()
        },

        exportExcel () {
            this.$refs.table.getExportExcel ()
        },

        routerLink (title, id = '') {
            this.$router.push ({
                path: 'addDeviceSafety',
                name: 'addDeviceSafety',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },

    async created () {
        this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
    },

    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo,
    },

    mounted () {
        this.getIndexPage ()
    },

    watch: {
        selfSupportProject () {
            this.getIndexPage ()
        }
    },
}
</script>
