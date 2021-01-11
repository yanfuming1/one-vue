<template>
    <div>
        <div class="total-assets-header">
            <div class="total-assets-header-operation">
                <div class="total-assets-header-btns">
                    <el-button size="medium" plain @click="fundSituationBtn">资金情况</el-button>
                    <el-button size="medium" plain @click="capitalFlowInformationBtn">资金流动信息</el-button>
                    <el-button size="medium" plain @click="loanInformationBtn()">借贷信息</el-button>
                </div>
                <div class="total-assets-header-seach" v-if="!fundSituationContent">
                    <el-form :inline="true" size="medium">
                        <el-form-item label prop="name">
                            <el-input v-model="keyword" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchPageList">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <fund-situation ref="fundSituationRef" v-if="fundSituationContent"/>
        <capital-flow-information :filterText="filterText" v-if="capitalFlowInformationContent"/>

        <template  :filterText="filterText" v-if="loanInformationContent" class="item-information-center___bottom-bottom">
            <qqt-table :data="loanInformationData" :rowHeader="rowHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </template>

    </div>
</template>
<script>
import { mapState } from 'vuex'
import { loanInformationList } from "../../../../../api/customerManagement/capitalAccount"
import fundSituation from "./totalAssetsContent/fundSituation"
import capitalFlowInformation from "./totalAssetsContent/capitalFlowInformation"
// import loanInformation from "./totalAssetsContent/loanInformation"
export default {

    data ( ) {
        return {
            fundSituationContent:true,
            capitalFlowInformationContent:false,
            loanInformationContent:false,
            filterText: '',
            keyword: '',
            loanInformationData:{},
            rowHeader: [
                {
                    prop: 'createTime',
                    label: '借贷时间',
                    isShow:true,
                },
                {
                    prop: 'matEndowment',
                    label: '借贷总额',
                    isShow:true
                },
                {
                    prop: 'isPay',
                    label: '是否还款',
                    isShow:true,
                    render: (h, parms) => {
                        let text = ''
                        text = parms.row.isPay === '1' ? '是' : '否'
                        return h('div', {}, text)
                    }
                },
         /*       {
                    prop: 'ip',
                    label: '未还金额',
                    isShow:true
                },*/
                {
                    prop: 'updateTime',
                    label: '最近还款时间',
                    isShow:true
                },
                {
                    prop: 'projectName',
                    label: '关联项目',
                    isShow:true
                },
                {
                    prop: 'createName',
                    label: '经手人',
                    isShow:true
                },
                // {
                //     prop: '',
                //     label: '所属部门',
                //     render: (h, params) => {
                //         return h('el-button', {
                //             props: {
                //                 type: 'text'
                //             },
                //             on: {
                //                 click: () => {

                //                 },
                //             }
                //         }, '查看')
                //     },
                //     isShow:true
                // }
            ],
            loading: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            tableOption: {}
        }
    },

    methods: {
        resetData(){
            this.$refs.fundSituationRef.resetData();
        },
        fundSituationBtn () {
            this.fundSituationContent = true
            this.capitalFlowInformationContent = false
            this.loanInformationContent = false
        },

        capitalFlowInformationBtn () {
            this.fundSituationContent = false
            this.capitalFlowInformationContent = true
            this.loanInformationContent = false
        },
        // 获取借贷信息列表
        loanInformationBtn (pageNo = 1) {
            loanInformationList ({
                id: this.customerInfor.id,
                pageNo
            }).then (res => {
                this.loanInformationData = res
            })
            this.fundSituationContent = false
            this.capitalFlowInformationContent = false
            this.loanInformationContent = true
        },

        searchPageList () {
            this.filterText = this.keyword
        },

        selectChange (val) {
            console.log(val);
            this.multipleSelection = val
        },
            // 分页变化改动
        handlePaginationChange(val) {
            // console.log(val);
            // return
            this.page = val;
            this.$nextTick(() => {
                this.loanInformationBtn(this.page.current)
            });
        }
    },

    components: {
        'fund-situation':fundSituation,
        'capital-flow-information':capitalFlowInformation,
        // 'loan-information':loanInformation,
        qqtTable: () => import('../../../../../components/qqt-subassembly/qqt-table/qqt-table'),
    },
    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
        ])
    },
}
</script>
<style lang='scss' scoped>
    .total-assets-header-operation{
        display: flex;
        .total-assets-header-seach{
           margin-left: auto;
           margin-right: 20px
        }
    }
</style>
