<template>
    <el-dialog title="从预算中导入" :visible.sync="dialogVisible" width="65%" :before-close="handleClose">
        <div class="budget-information-page">
            <qqt-table :data="budgetInformationData" :option="tableOption" :rowHeader="rowHeader" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('close')">取 消</el-button>
            <el-button type="primary" @click="getBudgetInformationData">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { getBudgetManagerCostSearch } from '@/api/selfProject/economicCalculation/costRegistration/responsibilityCost'
    import { qqtTable } from '@/components/qqt-subassembly'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            projectCode: {
                type: String,
                default: ()=>""
            }
        },
        data() {
            return {
                budgetInformationData: {
                    records: []
                },
                tableOption: {
                    border: false
                },
                rowHeader: [
                    {
                        prop: 'budgetCode',
                        label: '预算编号',
                        isShow:true,
                    },
                    {
                        prop: 'budgetName',
                        label: '预算名称',
                        isShow:true
                    },
                    {
                        prop: 'budgetTypeDic',
                        label: '预算类型名称',
                        isShow:true
                    },
                    {
                        prop: 'projectCategoryName',
                        label: '工程类别',
                        isShow:true, 
                        render: (h, parms) => {
                            return h('span', {
                            }, parms.row.projectCategoryName = parms.row.projectCategory == 1 ? '水利水电' : parms.row.projectCategory == 2 ? '市政公用' : (parms.row.projectCategory == 3 ? '公路桥梁' : '房屋建筑'))
                        }
                    },
                    {
                        prop: 'createName',
                        label: '创建人',
                        isShow:true
                    },
                    {
                        prop: 'createTime',
                        label: '创建时间',
                        isShow:true
                    }
                ],
            };
        },
        methods: {
            handleClose (done) {
                this.$emit('close')
            },
            getBudgetInformationData() {
                this.$emit('getBudgetInformationData', this.multipleSelection)
            },

            getBudgetManagerPage () {
                getBudgetManagerCostSearch({'projectCode':this.projectCode}).then( res => {
                    this.budgetInformationData = res
                })
            },

            selectChange (val) {
                this.multipleSelection = val
            },

            // 分页变化改动
            handlePaginationChange(val) {
                this.page = val;
                this.$nextTick(() => {
                    this.getBudgetManagerPage()
                });
            }
        },

        components: {
            'qqt-table': qqtTable
        },

        watch: {
            projectCode () {
                if(this.projectCode) this.getBudgetManagerPage ()
            }
        },

        created () {
        }
    };
</script>

<style scoped>
    .budget-information-page {

    }
</style>