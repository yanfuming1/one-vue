<template>
    <d2-container class="customer-list">
        <template slot="header">
            <div class="customer-list-header">
                <div class="customer-list-header___top">
                    <span class="customer-list-header___search">
                        <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            v-model="filterText" size="mini">
                        </el-input>
                        <el-button type="primary" class="customer-list-header-button" @click="searchModelSynopsis">搜索</el-button>
                        <el-button type="info" class="customer-list-header-button" @click="resetBtn">重置</el-button>
                    </span>
                    <span class="qqt-date">
                        <el-date-picker 
                            size="mini"
                            v-model="filterList.createDate" 
                            align="right" 
                            type="datetimerange"
                            placeholder="选择日期" 
                            :picker-options="pickerOptions" 
                            @change="selectChangeData('createDate')" 
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :default-time="['08:00:00', '18:00:00']"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
                    </span>
                    <span class="customer-list-header-operation___right">
                        <el-button-group>
                            <el-button size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
                        </el-button-group>
                    </span>
                </div>
                <div class="customer-list-header___bottom">
                    <el-row>
                        <el-form :model="filterList" label-width="120px" size="medium">
                            <el-col :span="8">
                                <el-form-item label="客户状态:">
                                    <qqt-select 
                                        size="mini"
                                        :valueArray="filterList.customerStatus" 
                                        :defaultProp="customerProp" 
                                        :multiple="multiple" 
                                        :filterable="filterable" 
                                        :placeholder="'+ 请选择客户状态'" 
                                        :options="remoteFuncs.customerOptions" 
                                        @select="filterList.customerStatus = $event; 
                                        selectChangeData('customerStatus')"></qqt-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="客户等级:">
                                    <qqt-select 
                                        size="mini"
                                        :valueArray="filterList.clientGrade" 
                                        :defaultProp="customerProp" 
                                        :multiple="multiple" 
                                        :filterable="filterable" 
                                        :placeholder="'+ 请选择客户等级'" 
                                        :options="remoteFuncs.clientGradeOptions" 
                                        @select="filterList.clientGrade = $event; 
                                        selectChangeData('clientGrade')">
                                    </qqt-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务负责人:">
                                    <qqt-select 
                                        size="mini"
                                        :valueArray="filterList.businessLeader" 
                                        :defaultProp="personnelProp" 
                                        :multiple="multiple" 
                                        :filterable="filterable" 
                                        :placeholder="'+ 请选择业务负责人'" 
                                        :options="remoteFuncs.businessLeaderOptions" 
                                        @select="filterList.businessLeader = $event; 
                                        selectChangeData('businessLeader')">
                                    </qqt-select>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                </div>
            </div>
        </template>
        <div class="customer-list-center">
            <qqt-table ref="table" :exportData="tableData.records" :data="tableData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { iCanSeele } from '../../../../api/customerManagement/myClientModule'
import { 
    getAssociatedCompanyCustomerManagement,
    getFirstPartyCustomerManagement} from '../../../../api/customerManagement/customerList'
import { getCustomerDictionaryListQueryByIds } from '../../../../api/customerManagement/expandInformation'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { getCustomerDictionaryList } from '../../../../api/customerManagement/expandInformation'
import { mapActions } from 'vuex'
import { CITYJSON } from '../../../../enum/CTIYS'

import menu from '../../../../layout/header-aside/components/mixin/menu'
import util from '@/libs/util.js'
export default {
    name: 'iCanSeeIt',
    data () {
        return {

            filterText: '',

            keywords: '',

            characteristic: '',
            
            identification: '',
            
            allowCreate: true,

            filterable: true,

            multiple: true,

            dialogVisible: false,

            tableSelectData: [],

            rowHeader: [
                {
                    prop: 'customerNumber',
                    label: '客户编码',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            on: { click: () => { this.skipToMyCustomer (parms.row) } }
                        },
                        [
                           h ('div', {
                                class: {
                                    'iconfont iconwuxing off': parms.row.attention === '0',
                                    'iconfont iconwuxing on': parms.row.attention === '1',
                                },
                           }),
                           h ('div', {
                               class: {
                                    'typefaceColor': true,
                                },
                           }, parms.row.customerNumber)
                        ], )
                    }
                },
                {
                    prop: 'cusName',
                    label: '客户名称',
                    isShow: true
                },
                {
                    prop: 'clientTypeName',
                    label: '客户类型',
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {},
                            parms.row.clientTypeName = parms.row.clientType == '甲方客户' ? '普通客户' : parms.row.clientType
                        )
                    }
                },
                {
                    prop: 'customerStatus',
                    label: '客户状态',
                    isShow: true
                },
                {
                    prop: 'clientGrade',
                    label: '客户等级',
                    isShow: true
                },
                {
                    prop: 'businessLeader',
                    label: '业务负责人',
                    isShow: true
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    isShow: true
                }
            ],

            page: {},

            filterList: {
                customerStatus: [],
                createDate: null,
                clientGrade: [],
                businessLeader: []
            },

            pickerOptions: {

                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
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

            tableOption: {
                border: true
            },

            dynamicHeader: {
                tableId: 'T_1099506556',
                isSave: true,
            },

            customerProp: {
                value: 'id',
                label: 'proName'
            },

            personnelProp: {
                value: 'id',
                label: 'name'
            },

            tableData: {},

            values: {},

            remoteFuncs: {

                customerOptions: [],

                clientGradeOptions: [],

                businessLeaderOptions: [],

                customerQualification: [],

                projectManagementLevel: [],

                industryCategory: [],

                expandInformation: [],

                charaterCustomer: [],

                customerSource: [],
                
                contactType: []
            }
        }
    },

    methods: {
        getICanSeeleList (keywords) {
            iCanSeele ({ 
                ...keywords,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                 this.tableData = res
            }).catch( err=> {
                console.log(err)
            })
        },
        
        ...mapActions ('d2admin/customer/', [
            'remoteFuncsSet'
        ]),

        selectChange (item) {
            this.tableSelectData = item
        },

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
               this.fuzzySearch (false)
            });
        },

        // 搜索
        searchModelSynopsis () {
            this.fuzzySearch ()
        },

        resetBtn () {
            this.filterText = ''
            this.filterList = {
                customerStatus: [],
                createDate: null,
                clientGrade: [],
                businessLeader: []
            }
            this.resetPage ()
            this.filterText = this.customerStatus = this.businessLeader = this.clientGrade = ''
            this.fuzzySearch ()
        },

         // 客户编码跳转客户资料信息事件
       skipToMyCustomer (data) {
            let url = ''
            switch (data.clientType) {
                case '联营客户':
                    url = getAssociatedCompanyCustomerManagement
                    break
                case '甲方客户':
                    url = getFirstPartyCustomerManagement
                    break
            }
            url ({'id': data.id}).then(item => {
                if (item) {
                    this.identification = data.clientType.includes ('联营客户') ? '0' : '1'
                    this.$store.dispatch ('d2admin/customer/identificationSet', this.identification)
                    if (item && item.positionInIndustryId) {
                        item.positionInIndustryIds = JSON.parse (item.positionInIndustryId)
                    }
                    if (item && item.industryCategoryId) {
                        item.industryCategoryIds = JSON.parse (item.industryCategoryId)
                    }
                    if (item.unitAddressId) {
                        item.unitAddressIds = JSON.parse (item.unitAddressId)
                    }
                    item['upLoadFileDefaultList'] = this.neatenUploadData (item)
                    item['address'] = item.unitAddress + item.detailedAddress
                    item['iCanSeeIt'] = true
                    item.myClientPath = 'iCanSeeIt'
                    this.$store.dispatch ('d2admin/customer/customerInformation', { item })
                    switch (this.identification) {
                        case '0':
                            menu.methods.handleMenuSelect('/myCustomer')
                            break
                        case '1':
                            menu.methods.handleMenuSelect('/myFirstPartyCustomer')
                            break
                    }
                    
                }
            })
        },

        neatenUploadData (item) {
            let list = []
            if (item.fileList && item.fileList.length > 0) {
                item.fileList.forEach(item => {
                    let m = {
                        status : 'finished',
                        response : {
                            url : item.url,
                            size: item.size,
                            name: item.name
                        }
                    }
                    list.push(m)
                })
            }
            return list
        },

        neatenCascaderData (list, value, num) {
            let item = list.find (f => f.value === value[num])
            if (item) {
                this.detailsData += item.label
                if (item.children && item.children.length > 0) {
                    this.neatenCascaderData (item.children, value, num + 1)
                }
            }
        },

        // 获取扩展信息数据
        getExpandInformationData () {

            let ids = `${CUSTOMERAUTHORIZATION.CUSTOMERSTATUS},${CUSTOMERAUTHORIZATION.CLIENTGRADE},${CUSTOMERAUTHORIZATION.PROJECTMANAGEMENTLEVEL},${CUSTOMERAUTHORIZATION.INDUSTRYCATEGORY},${CUSTOMERAUTHORIZATION.CUSTOMERTYPE},${CUSTOMERAUTHORIZATION.CHARATERCUSTOMER},${CUSTOMERAUTHORIZATION.CUSTOMERSOURCE},${CUSTOMERAUTHORIZATION.CONTACTTYPE},${CUSTOMERAUTHORIZATION.CUSTOMERCATEGORY}`
            getCustomerDictionaryListQueryByIds ({'ids': ids}).then(expandInformation => {
                if (expandInformation == null || expandInformation.length == 0) return
                expandInformation.forEach (res => {
                    switch (res.id) {
                        case CUSTOMERAUTHORIZATION.CUSTOMERSTATUS:
                            this.remoteFuncs.customerOptions = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CLIENTGRADE:
                            this.remoteFuncs.clientGradeOptions = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CUSTOMERQUALIFICATION:
                            this.remoteFuncs.customerQualification = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.PROJECTMANAGEMENTLEVEL:
                            this.remoteFuncs.projectManagementLevel = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.INDUSTRYCATEGORY:
                            this.remoteFuncs.industryCategory = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CUSTOMERTYPE:
                            this.remoteFuncs.customerType = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CHARATERCUSTOMER:
                            this.remoteFuncs.charaterCustomer = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CUSTOMERSOURCE:
                            this.remoteFuncs.customerSource = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CONTACTTYPE:
                            this.remoteFuncs.contactType = res.customerDictionaryList
                            break
                    }
                })
                let item = this.remoteFuncs
                this.remoteFuncsSet ({ item })
            })
        },

        // 获取员工字典
        getStaffStaffDictionary () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.remoteFuncs.businessLeaderOptions = res
                }
            })
        },

        // 选择更改数据
        selectChangeData (data) {
            let item = {}
            this.customerStatus = this.clientGrade = this.businessLeader = ''
            this.filterList.customerStatus.forEach (id => {
                item = this.remoteFuncs.customerOptions.find (r => r.id === id)
                this.customerStatus += item.proName + ','
            })

            this.filterList.clientGrade.forEach (id => {
                item = this.remoteFuncs.clientGradeOptions.find (r => r.id === id)
                this.clientGrade += item.proName + ','
            })

            this.filterList.businessLeader.forEach (id => {
                item = this.remoteFuncs.businessLeaderOptions.find (r => r.id === id)
                this.businessLeader += item.name + ','
            })

            this.fuzzySearch ()
        },

        // 获取客户字典
        getCustomerDictionary () {
            getCustomerDictionaryList ().then (res => {
                if (res) {
                    this.remoteFuncs.expandInformation = res
                    let item = this.remoteFuncs
                    this.remoteFuncsSet ({ item })
                }
            })
        },

        fuzzySearch (boolean = true) {
            if (boolean) this.resetPage ()
            this.getICanSeeleList ({'keywords': this.filterText ? this.filterText : null,
                'customerStatus': this.customerStatus ? this.customerStatus.substring (0, this.customerStatus.length - 1) : null,
                'clientGrade': this.clientGrade ? this.clientGrade.substring (0, this.clientGrade.length - 1) : null,
                'businessLeader': this.businessLeader ? this.businessLeader.substring (0, this.businessLeader.length - 1) : null,
                'createTime': this.filterList.createDate ? this.filterList.createDate[0] : null,
                'updateTime':this.filterList.createDate ? this.filterList.createDate[1] : null})
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
        }
    },

    components: {
        'qqt-select': qqtSelect,
        'qqt-table': qqtTable
    },

    created () {
        this.resetPage ()

        this.getICanSeeleList()

        // 获取扩展信息数据
        this.getExpandInformationData ()

        // 获取员工字典
        this.getStaffStaffDictionary ()

        // 获取客户字典
        this.getCustomerDictionary ()
    },

    watch: {
        $route (val) {
            if ( val.name === 'iCanSeeIt') {
                this.resetBtn()
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    .customer-list {
        .customer-list-header {
            padding-top: 10px;
            .customer-list-header___top{
                .customer-list-header___search {
                    .el-input {
                        width: 10%;
                        padding-right: 10px;
                        top: -1px;
                    }
                }
                .qqt-date{
                    padding-left: 20px;
                    .el-date-editor.el-input__inner {
                        width: 25%;
                    }
                }
                .customer-list-header___state{
                    padding-left: 10px;
                    p {
                        display: inline-block;
                    }
                    .customer-list-header-state___select {
                        padding-left: 10px;
                        width: 5%;
                        display:inline-block;
                    }

                }
                .customer-list-header-operation___right {
                    padding-left: 20px;
                }
            }
            .customer-list-header___bottom {
                margin: 20px 0 0 -50px;
            }
        }
        .customer-list-center {
            height: 102%;
            margin-top: -15px;
            background: $color-bg3;
            box-shadow: 0 2px 12px 0 $color-border-shadow;
        }
    }
    .customer-list-header-button {
        padding: 0 5px;
        height: 26px;
        border-radius: 3px;
    }
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 5px !important;
        top: -1px
    }
</style>
