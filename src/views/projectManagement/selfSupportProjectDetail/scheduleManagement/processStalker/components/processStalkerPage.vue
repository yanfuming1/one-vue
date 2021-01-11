<template>
    <d2-container type="fulls" class="process-warning-box">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :pageShow="pageShow" :exportData="tableData.records" :rowHeader="rowHeader" 
                :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" />
        </div>
    </d2-container>
</template>

<script>
import { listByOverallIdList } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
import { qqtTable } from '@/components/qqt-subassembly';
import { mapState } from 'vuex';
import projectInfo from '../../../components/commenInfo/projectInfo';
import util from '@/libs/util.js';
export default {
    data () {
        return {
            colors: [ '#8d43ad', '#42a1ff', '#2898b0', '#37373D', '#73C991', '#6B96AD' ],
            pageShow: false,
            filterText: '',
            options: [],
            createDate: [],
            tableSelectData: [],
            tableOption: {
                border: false,
                height: 610
            },
            transform: {
                isShowDetails: false
            },
            overallId: '',
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
                    prop: 'number',
                    label: '编号',
                    isShow: true,
                    width: 100,
                    render: (h, parms) => {
                        return h('span', { style: { color: this.colors[Number(parms.row.rankNumber)-1] } }, parms.row.number)
                    }
                },
                {
                    prop: 'name',
                    label: '名称',
                    isShow: true,
                    width: 150,
                    render: (h, parms) => {
                        return h('span', { style: { color: "#FE3F31" } }, parms.row.name)
                    }
                },
                // {
                //     prop: 'supplierCategory',
                //     label: '预警信息',
                //     isShow: true
                // },
                {
                    prop: 'prepositionList',
                    label: '前置任务',
                    isShow: true,
                    width: 180,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.prepositionList)
                    }
                },
                {
                    prop: 'planLimit',
                    label: '计划工期',
                    isShow: true,
                    width: 100,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.planLimit + '天')
                    }
                },
                {
                    prop: 'planStartDate',
                    label: '计划开工日期',
                    isShow: true,
                    width: 150
                },
                {
                    prop: 'planEndDate',
                    label: '计划完工日期',
                    isShow: true,
                    width: 150
                },
                {
                    prop: 'realityStartDate',
                    label: '实际开工日期',
                    isShow: true,
                    width: 150
                },
                {
                    prop: 'realityEndDate',
                    label: '实际完工日期',
                    isShow: true,
                    width: 150
                },
                {
                    prop: 'donePercent',
                    label: '进度(%)',
                    isShow: true,
                    width: 100
                },
                {
                    prop: 'startWarning',
                    label: '开工预警',
                    isShow: true,
                    width: 100,
                    render: (h, parms) => {
                        let text = '正常'
                        switch(parms.row.startWarning) {
                            case '1': text = 'I级'; break
                            case '2': text = 'II级'; break
                            case '3': text = 'III级'; break
                            case '4': text = 'IV级'; break
                            case '5': text = 'V级'; break
                        }
                        return h('span', {
                            style: { color: text === '正常' ? "#606266" : "#FE3F31" }
                        }, text)
                    }
                },
                {
                    prop: 'endWarning',
                    label: '完工预警',
                    isShow: true,
                    width: 100,
                    render: (h, parms) => {
                        let text = '正常'
                        switch(parms.row.startWarning) {
                            case '1': text = 'I级'; break
                            case '2': text = 'II级'; break
                            case '3': text = 'III级'; break
                            case '4': text = 'IV级'; break
                            case '5': text = 'V级'; break
                        }
                        return h('span', {
                            style: { color: text === '正常' ? "#606266" : "#FE3F31" }
                        }, text)
                    }
                },
                {
                    prop: 'taskPrincipal',
                    label: '任务负责人',
                    isShow: true,
                    width: 100,
                    render: (h, parms) => {
                        return h('span', { style: { color: "#FE3F31" } }, parms.row.taskPrincipal)
                    }
                }]
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis () {
            this.getProcessWarningPagePage ({
                'name': this.filterText ? this.filterText : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime': this.createDate ? this.createDate[1] : null})
        },

        getProcessWarningPagePage (text) {
            listByOverallIdList ({ 'overallId': this.overallId }).then( res => {
                console.log(JSON.parse(JSON.stringify(res)))
                // if (res) { this.tableData = { 'records': res, } }
            })
        },

        addProcessWarningPage () {
            this.transform.isShowDetails = false
            this.routerLink ('添加供应商')
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.getProcessWarningPagePage ()
        },

        exportExcel () {
            this.$refs.table.getExportExcel ()
        },

        routerLink (title, id = '') {
            this.$router.push ({
                path: 'addProcessWarningPage',
                name: 'addProcessWarningPage',
                params: {
                    relevancyId: id,
                    transform: this.transform,
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
    },

    components: {
        'qqt-table': qqtTable,
        'project-info': projectInfo,
    },

    created () {
        this.overallId = this.$route.params.relevancyId
        this.getProcessWarningPagePage ()
    }
}
</script>
<style lang="scss">
.process-warning-box{
    .qqt-container-full__body{ padding-top: 0px !important; }
}
</style>
