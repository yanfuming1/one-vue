<template>
    <d2-container class="analyze"  type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <project-info></project-info>
            </div>
        </template>
        <el-row style="height:100%">
            <el-col :span="13" style="height:100%;">
                <div class="qqt-container-full___center">
                    <qqt-table :data="tableData" ref="table" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @page="handlePaginationChange" />
                </div>
            </el-col>
            <el-col :span="10" :offset="1" style="height:100%">
               <div class="rightCard">
                    <div class="headBox">
                        进度计划视图
                    </div>
                    <div class="headContent">
                        <progress-bar :data="tableData.records" :prop="barProp"></progress-bar>
                    </div>
               </div>
            </el-col>
        </el-row>
    </d2-container>
</template>

<script>
    import projectInfo from '../../components/commenInfo/projectInfo';
    import { selfSchedulePlanPageList, selfSchedulePlanDel, selfSchedulePlanQueryById, schedulePlanActualList } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
    import { mapState,mapActions } from 'vuex';
    import { qqtTable } from '@/components/qqt-subassembly';
    import progressBar from './components/progressBar';
    export default {
        components: {
            projectInfo,
            qqtTable,
            progressBar
        },
        data() {
            return {
                dynamicHeader: {
                    tableId: '',
                    isSave: false
                },
                tableOption: {
                    border: false
                },
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                transform: {
                    isShowDetails: false
                },
                tableData: {records:[]},
                barProp:'donePercent',
                rowHeader: [
                    {
                        prop: 'planName',
                        label: '计划名称',
                        isShow: true,
                        render: (h, parms) => {
                            return h('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink ('进度分析详情', parms.row.id)
                                    }
                                }
                            }, parms.row.planName)
                        }
                    },
                    {
                        prop: 'donePercent',
                        label: '进度',
                        width: "140",
                        isShow: true,
                        render: (h, parms) => {
                            let text = parms.row.donePercent ? parms.row.donePercent : 0 ;
                            
                            return h('div', {
                            }, text + ' %')
                        }
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
                ],
            }
        },
        methods: {
            ...mapActions('d2admin/page', [
                'close',
                'open'
            ]),
            getBudgetInfoPage (text) {
                this.projectCode = this.selfSupportProject.projectCode
                selfSchedulePlanPageList ({
                    ...text,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'projectCode': this.selfSupportProject.projectCode,
                }).then( res => {
                    if (res) {
                        this.tableData = res
                    }
                })
            },
            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'analyzeDetail',
                    name: 'analyzeDetail',
                    params: {
                        relevancyId: id,
                        transform: this.transform,
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },
            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis ()
                });
            },
        },
        computed: {
            ...mapState ('d2admin/selfSupportProject', [
                'selfSupportProject'
            ])
        },
        mounted () {
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

<style lang="scss" >
.analyze{
    .rightCard{
        background: #ffffff;
        padding: 10px;
        height: 100%;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .headBox{
            height: 40px;
            line-height: 40px;
            font-size: 20px;
        }
        .headContent {
            color: red;
            max-height: 480px;
            overflow-y:scroll;
        }
        .headContent::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>