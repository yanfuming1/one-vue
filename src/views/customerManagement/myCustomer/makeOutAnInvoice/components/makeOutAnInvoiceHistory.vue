<template>
    <div>
        <div class="relationship-record-center-title">
            <div class="relationship-record-center___longString">
                <p>发票记录</p>
            </div>
            <!-- <div class="relationship-record-center___right">
                <el-button type="primary" plain @click="drawer = true">新增联系记录</el-button>
            </div> -->
        </div>
        <div class="relationship-record-center___bottomLine"></div>
        <div class="relationship-record-center___details">
            <qqt-table 
                :data="tableData"
                :rowHeader="rowHeader"
                :pageShow="pageShow"
                :isShowIndex="isShowIndex"
                :isShowSelection="isShowSelection"
                :isShowGroup="isShowGroup"
                :isDrag="isDrag"
                :option="tableOption"
                ></qqt-table>
        </div>
    </div>
</template>

<script>
import { qqtTable } from '../../../../../components/qqt-subassembly'
export default {
    data () {
        return {
            pageShow: false,
            isShowIndex: false,
            isShowSelection: false,
            isShowGroup: false,
            isDrag: false,
            drawer: false,
            tableOption: {
                border: false
            },
            remoteFuncs: {
                customerList: []
            },
            tableData: {
                records: []
            },
            rowHeader: [
                {
                    prop: 'contactDate',
                    label: '发票抬头',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'contactType',
                    label: '纳税人识别号',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'customerName',
                    label: '开户银行',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'relatedProjects',
                    label: '银行账号',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'nextContactDate',
                    label: '地址',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'nextContactDate',
                    label: '联系电话',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'nextContactDate',
                    label: '登记人',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'nextContactDate',
                    label: '登记时间',
                    isShow: true,
                    align: 'center'
                }
            ],
        }
    },

    methods: {
        
    },

    components: {
        'qqt-table': qqtTable,
    },
}
</script>

<style lang='scss' scoped>
    .relationship-record-center-title {
        padding: 30px 45px 10px;
        .relationship-record-center___longString {
            border-left: 3px solid $color-text-title;
            p {
                color:  $color-text-title;
                display: inline-block;
                margin: 0px;
                margin-left: 10px;
            }
        }
    }
    .relationship-record-center___bottomLine {
        top: -5px;
        border-top: solid $color-straight-line3 1px;
        right: -20px;
    }
    .relationship-record-center___details {
        height: 75%;
        padding: 30px 0;
    }
</style>
