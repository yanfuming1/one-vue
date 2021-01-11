<template>
    <d2-container class="relationship-record">
        <div class="relationship-record-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" />
            <div class="relationship-record-center___bottom">
                <div class="relationship-record-center-title">
                    <div class="relationship-record-center___longString">
                        <p>联系记录</p>
                    </div>
                </div>
                <div class="relationship-record-center_right">
                    <el-button type="primary" plain @click="drawer = true, customer=''" v-if="add && !customerInfor.iCanSeeIt">新增联系记录</el-button>
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
                        :dynamicHeader="dynamicHeader"
                        ></qqt-table>
                </div>
                <div class="relationship-record-center___button">
                    <div class="relationship-record-center-button___return">
                        <el-button @click="closeTag">返回</el-button>
                    </div>
                    
                </div>
            </div>
        </div>
        <add-relationship-record :drawer="drawer" v-if="drawer" :addcustomer="customerInfor.id" :values="values" :customer="customer" :identification="identification" :remoteFunc="remoteFuncs" @change="updataRelationshipRecordList"></add-relationship-record>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { qqtTable } from '../../../../../components/qqt-subassembly'
import { getRelationshipRecordListById, getFirstPartyRelationshipRecordListById } from '../../../../../api/customerManagement/relationshipRecord'
import { getAssociatedCompanyCustomerPageList, getFirstPartyCustomerPageList } from '../../../../../api/customerManagement/customerList'

import customerDetailsHeader from '../../components/customerDetailsHeader'
import addRelationshipRecord from '../../../relationshipRecord/components/addRelationshipRecord'
import util from '@/libs/util.js'
export default {
    data () {
        return {
            add: true,
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
            dynamicHeader: {
                tableId: 'T_1572430698541',
                isSave: true
            },
            rowHeader: [
                {
                    prop: 'contactDate',
                    label: '联系日期',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'contactType',
                    label: '联系方式',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'customerName',
                    label: '联营人姓名',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'remark',
                    label: '联系内容',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'nextContactDate',
                    label: '下次联系日期',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'createName',
                    label: '创建人',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    isShow: true,
                    align: 'center'
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    align: 'center',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.updataRecordContattoCommercialeData (parms.row)
                                    }
                                }
                            }, '编辑'),
                        ]
                    }
                }
            ],
            values: {
                contactDate: '',
                contactType: '',
                customerId: '',
                projectId: '',
                nextContactDate: '',
                remark: '',
            },
            customer: ''
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        updataRecordContattoCommercialeData (item) {
            this.values = item
            this.customer = item.id
            this.values.customerId = this.customerInfor.id
            this.drawer = true
        },
        
        getRelationshipRecordList () {
            let url = '' 
            let id = this.customerInfor.id
            this.values.customerId = this.customerInfor.id
            switch (this.identification) {
                case '0':
                    url = getRelationshipRecordListById
                    break
                case '1':
                    url = getFirstPartyRelationshipRecordListById
                    break
            }
            url ({'customerId': id}).then(res => {
                if (res && res.length > 0) {
                    this.tableData.records = res
                } else {
                    this.tableData.records = []
                }
            })
        },

        updataRelationshipRecordList () {
            this.drawer = false
            this.getRelationshipRecordList ()
        },

        getCustomerPage () {
            let url = ''
            this.remoteFuncs.customerList = []
            switch (this.identification) {
                case '0':
                    url = getAssociatedCompanyCustomerPageList
                    break
                case '1':
                    url = getFirstPartyCustomerPageList
                    break
            }
            url ({
                'pageNo': '1',
                'pageSize': '1000'
            }).then(res => {
                if (res.records && res.records.length > 0) {
                    this.remoteFuncs.customerList = res.records
                } else {
                    this.remoteFuncs.customerList = []
                }
            })
        },

        closeTag () {
            let tagName = this.$route.path
            let path = ''
            
            if (this.customerInfor.myClientPath) {
                path = `/customerManagement/myClientModule/${this.customerInfor.myClientPath}`
            } else {
                path = `/customerManagement/customerList/${this.identification}`
            }
            this.close ({tagName, path})
        },

        // 验证权限
        _validationAuth () {
            this.add = this.identification === '0' ? this.$has ('relationship:list:add') : this.$has ('relationships:list:add')
        }
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
            'identification'
        ])
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
    },

    components: {
        'qqt-table': qqtTable,
        'customer-details-header': customerDetailsHeader,
        'add-relationship-record': addRelationshipRecord
    },

    watch: {
        customerInfor () {
            if (this.customerInfor.id) {
                this.getRelationshipRecordList ()
                this.getCustomerPage ()
            }
        },

        $route (val) {
            if (val.path.indexOf('recordContattoCommerciale') !== -1) {
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            }
        }
    },

    mounted () {
        this._validationAuth ()
    }
}
</script>

<style lang='scss' scoped>
    .relationship-record {
        .relationship-record-center {
            height: 100%;
            padding: 10px;
            .relationship-record-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                font-size: 14px;
                .relationship-record-center-title {
                    padding: 30px 32px 10px;
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
            }
            .relationship-record-center___details {
                height: 75%;
                padding-bottom: 30px;
            }
            .relationship-record-center___button {
                text-align: right;
                padding-top: 20px;
                padding-right: 40px;
                .relationship-record-center-button___return {
                    text-align: center
                }
                button {
                    height: 30px;
                    padding: 6px 10px;
                    .el-button--primary {
                        background-color: $color-button-dialog-affirm
                    }
                }
            }
            .relationship-record-center_right {
                position: absolute;
                margin-top: -40px;
                right: 50px;
                z-index: 999;
                button {
                    height: 30px;
                    padding: 6px 10px;
                    .el-button--primary {
                        background-color: $color-button-dialog-affirm
                    }
                }
            }
        }
        .relationship-record-header-button {
            height: 26px;
            border-radius: 3px;
            color: #ffffff;
            background-color: $color-button-typeface1;
            border: 1px solid $color-button-typeface1
        }
        .el-button--mini, .el-button--mini.is-round {
            padding: 6px 10px !important;
            top: -1px
        }
    }
</style>
