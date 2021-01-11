<template>
    <d2-container class="item-information">
        <div class="item-information-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" :isShowProject="true" :isShowInvoice="true" />
            <div class="item-information-center___bottom">
                <div class="item-information-center___bottom-header">
                    <el-row>
                        <div class="item-information-center___bottom-header-left">
                            <span class="bottom-header-left-line"></span>
                            <p>项目列表</p>
                        </div>
                        <div class="item-information-center___bottom-header-right">
                            <el-button plain size="medium" @click="getJointVentureInformation()">全部项目</el-button>
                            <el-button plain size="medium" @click="getJointVentureInformation('1')">报名项目</el-button>
                            <el-button plain size="medium" @click="getJointVentureInformation('2')">开标项目</el-button>
                            <el-button plain size="medium" @click="getJointVentureInformation('3')">立项项目</el-button>
                        </div>
                    </el-row>
                </div>
                <template class="item-information-center___bottom-bottom">
                    <qqt-table :data="projectInformation" :dynamicHeader="dynamicHeader" :option="tableOption" :rowHeader="rowHeader"  @selectionChange="selectChange"></qqt-table>
                </template>
                <div class="item-information-center___button">
                    <el-button @click="closeTag">返回</el-button>
                </div>
            </div>
        </div>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { qqtTable } from '../../../../../components/qqt-subassembly'
import customerDetailsHeader from '../../components/customerDetailsHeader'
import menu from '../../../../../layout/header-aside/components/mixin/menu'
import { jointVentureInformation } from '../../../../../api/customerManagement/itemInformation'
import util from '@/libs/util.js'
export default {
    name: 'itemInformation',

    data () {
        return {
            projectInformation:{},
            rowHeader: [
                {
                    prop: 'projectName',
                    label: '项目名称',
                    isShow:true,
                    render: (h, parms) => {
                        return h('el-button', {
                            props:{
                                type: 'text',
                            },
                            on:{
                                click: async () => {
                                    menu.methods.handleMenuSelect('/jontProjectDetail')
                                    const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                    db.set('proID', parms.row.id).write()
                                }
                            }
                        }, parms.row.projectName)
                    }
                },
                {
                    prop: 'section',
                    label: '项目标段',
                    isShow:true
                },
                {
                    prop: 'projectType',
                    label: '工程类别',
                    isShow:true,
                },
                {
                    prop: 'projectManager',
                    label: '项目经理',
                    isShow:true
                },
                {
                    prop: 'registrationDeadline',
                    label: '报名时间',
                    isShow:true
                },
                {
                    prop: 'bidOpeningTime',
                    label: '开标时间',
                    isShow:true
                },
                {
                    prop: 'theWinningTime',
                    label: '立项时间',
                    isShow:true
                },
                {
                    prop: 'balanceName',
                    label: '项目可用余额',
                    render: (h, params) => {
                        return h('div', {}, params.row.balanceName = util.moneyTransform (params.row.balance))
                    },
                    isShow:true,
                }
            ],
            loading: false,
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            dynamicHeader: {
                tableId: 'T_1572430752543',
                isSave: false
            },
            multipleSelection:[],
            tableOption: {}
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getJointVentureInformation (value) {
            
            let associatedPersonId = this.customerInfor.id
            let obj = {
                associatedPersonId: this.customerInfor.id,
                state: value ? value : "0",
            }
            console.log(obj);
            jointVentureInformation(
                obj
            ).then( res => {
                this.projectInformation = res
            })
        },

        // 复选框选中的数据
        selectChange (val) {
            this.multipleSelection = val
        },
            // 分页变化改动
        handlePaginationChange(val) {
            this.page = val;
            this.$nextTick(() => {

            });
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

    watch: {
        customerInfor () {
            if (this.customerInfor.id) {
                this.getJointVentureInformation()
            }
        },

        $route (val) {
            if (val.path.indexOf('itemInformation') !== -1) {
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
            }
        }
    },

    components: {
        'qqt-table': qqtTable,
        'customer-details-header': customerDetailsHeader
    }
}
</script>

<style lang='scss' scoped>
    .item-information {
        .item-information-center {
            height: 100%;
            padding: 10px;
          
            .item-information-center___bottom {
                height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                    .item-information-center___bottom-header{
                        padding: 20px 0 20px 32px;
                        .item-information-center___bottom-header-left{
                            display: flex;
                        }
                            .bottom-header-left-line{
                                border-left: 3px solid $color-text-title;
                                margin-right: 6px;
                            }
                            .item-information-center___bottom-header-left > p{
                                color:  $color-text-title;
                                font-size: 14px;
                            }
                            .item-information-center___bottom-header-right{
                                padding-right: 20px;
                                float: right;
                                margin-top: -22px
                            }
                    }
                    .item-information-center___bottom-bottom{
                        padding-top: 12px
                    }
                    .item-information-center___button {
                        text-align: center;
                        padding-top: 20px;
                        button {
                            height: 30px;
                            padding: 6px 10px;
                            .el-button--primary {
                                background-color: $color-button-dialog-affirm
                            }
                        }
                    }
            }
        }
    }
</style>
