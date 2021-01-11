<template>
    <d2-container class="my-concem-list">
        <template slot="header">
            <div class="my-concem-list-header">
                <div class="my-concem-list-header___top">
                    
                    <span class="my-concem-list-header___search">
                        <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            v-model="filterText" size="mini">
                        </el-input>
                        <el-button type="primary" class="my-concem-list-header-button" @click="searchModelSynopsis">搜索</el-button>
                        <el-button type="info" class="customer-list-header-button" @click="resetBtn" size="mini">重置</el-button>
                    </span>
                    <span class="qqt-date">
                        <el-date-picker
                            size="mini"
                            v-model="filterList.createDate"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['08:00:00', '18:00:00']"
                            @change="selectChangeData('createDate')" 
                            align="right" />
                    </span>
                    <span class="my-concem-list-header-operation___right">
                        <el-button type="primary" class="my-concem-list-header-button" v-has="'attention:list:deleteBatch'" @click="batchRemoveConcernsEven">批量取消关注</el-button>
                    </span>
                    <span class="my-concem-list-header-operation___right">
                        <el-button-group>
                            <el-button size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
                        </el-button-group>
                    </span>
                </div>
                <div class="my-concem-list-header___bottom">
                    <el-row>
                        <el-form :model="filterList" label-width="120px" size="medium">
                            <el-col :span="8">
                                <el-form-item label="客户状态:">
                                    <qqt-select size="mini" :valueArray="filterList.customerStatus" :defaultProp="customerProp" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户状态'" :options="remoteFuncs.customerOptions" @select="filterList.customerStatus = $event; selectChangeData('customerStatus')"></qqt-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="客户等级:">
                                    <qqt-select size="mini" :valueArray="filterList.clientGrade" :defaultProp="customerProp" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户等级'" :options="remoteFuncs.clientGradeOptions" @select="filterList.clientGrade = $event; selectChangeData('clientGrade')"></qqt-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务负责人:">
                                    <qqt-select size="mini" :valueArray="filterList.businessLeader" :defaultProp="personnelProp" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择业务负责人'" :options="remoteFuncs.businessLeaderOptions" @select="filterList.businessLeader = $event; selectChangeData('businessLeader')"></qqt-select>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-row>
                </div>
            </div>
        </template>
        <div class="my-concem-list-center">
            <qqt-table ref="table" :exportData="tableData.records" :data="tableData" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <div>
            <sales-information-update :dialogVisible="dialogVisible" :data="values" @change="updataCustomerList"></sales-information-update>
        </div>
    </d2-container>
</template>

<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { myConcemList, removeConcerns, batchRemoveConcerns, poolFirstPartyBatchDeletion } from '../../../../api/customerManagement/myClientModule'
import { 
    getAssociatedCompanyCustomerManagement,
    getFirstPartyCustomerManagement} from '../../../../api/customerManagement/customerList'
import { getCustomerDictionaryListQueryByIds } from '../../../../api/customerManagement/expandInformation'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { getCustomerDictionaryList } from '../../../../api/customerManagement/expandInformation'
import { mapActions } from 'vuex'
import { CITYJSON } from '../../../../enum/CTIYS'

import salesInformationUpdate from './salesInformationUpdate'
import menu from '../../../../layout/header-aside/components/mixin/menu'
import util from '@/libs/util.js'
export default {
    name: 'myConcern',
    data () {
        return {

            filterText: '',

            keywords: '',

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
                        return h('div', {},
                        [
                            h ('div', {
                                on: { 
                                    click: () => {
                                        if (parms.row.attention === '0') {

                                        }
                                        
                                        if (parms.row.attention === '1') {

                                        }
                                    } 
                                }
                           }),
                           h ('div', {
                               class: {
                                    'typefaceColor': true,
                                },
                                on:{
                                    click: () =>
                                     { this.skipToMyCustomer (parms.row) }
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
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '100',
                    render: (h, parms) => { 
                        return [
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        removeConcerns ({
                                            'id':parms.row.caId
                                        }).then( res => {
                                            this.$message.success("已取消关注")
                                            this.resetPge ()
                                            this.getMyConcernList()
                                        }).catch( err=> {
                                            this.$message.warning("取消关注失败")
                                        })
                                    }
                                }
                            }, this.$has ('attention:list:delete') ? '取消关注' : '')
                        ]
                    }
                }
            ],

            page: {
                current: 1,
                size: 10,
                total: 0
            },

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
                tableId: 'T_1109875024',
                isSave: true
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

                customerType: [],

                charaterCustomer: [],

                customerSource: [],
                
                contactType: []
            },

            customerStatus: '',

            clientGrade: '',

            businessLeader: '',
        }
    },

    methods: {
        // 初始化加载列表
        getMyConcernList (keywords) {
            let buLeId = util.cookies.get ('uuid')
            myConcemList ({
                buLeId,
                ...keywords,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                this.tableData = res
            })
        },

        resetPge () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
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

        // 批量删除
        batchRemoveConcernsEven () {
            let ids = ''
            let attention = ''
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.caId + ','
                    attention += res.attention + ','
                })
                batchRemoveConcerns({
                    ids
                }).then( res => {
                    this.getMyConcernList ()
                    this.$message.success("取消关注成功")
                }).catch( err => {
                    this.$message.warning("取消关注失败")
                })
            }
        },

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
                    item.myClientPath = 'myConcern'
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

        // 销售信息更新
        updataSalesInformation () {
            if (this.tableSelectData.length !== 1) {
                this.$message.warning ('请选择一条数据')
                return
            }
            this.values = this.tableSelectData[0]
            this.dialogVisible = true
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

        // 取消销售信息更新
        updataCustomerList () {
            this.dialogVisible = false
            this.getMyConcernList()
        },
        
        // 编辑
        updataCustomerData (id, clientType) {
            this.$router.push({
                path: 'createMyCustomer',
                name: 'createMyCustomer',
                query: {
                    'id': id
                },
                params: {
                    'remoteFuncs': this.remoteFuncs,
                    clientType: clientType
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
            this.getMyConcernList ({'keywords': this.filterText ? this.filterText : null,
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
        'qqt-table': qqtTable,
        'sales-information-update': salesInformationUpdate
    },

    created () {
        this.resetPage ()

        this.getMyConcernList()

         // 获取扩展信息数据
        this.getExpandInformationData ()

        // 获取员工字典
        this.getStaffStaffDictionary ()

        // 获取客户字典
        this.getCustomerDictionary ()
    },
    watch: {
        $route (val) {
            if ( val.name === 'myConcern') {
                this.resetBtn ()
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    .my-concem-list {
        .my-concem-list-header {
            padding-top: 10px;
            .my-concem-list-header___top{
                .my-concem-list-header___search {
                    .el-input {
                        width: 10%;
                        top: -1px;
                    }
                }
                .qqt-date{
                    padding-left: 20px;
                    .el-date-editor.el-input__inner {
                        width: 25%;
                    }
                }
                .my-concem-list-header-operation___right {
                    padding-left: 20px;
                }
            }
            .my-concem-list-header___bottom {
                margin: 20px 0 0 -50px;
            }
        }
        .my-concem-list-center {
            height: 102%;
            margin-top: -15px;
            background: $color-bg3;
            box-shadow: 0 2px 12px 0 $color-border-shadow;
        }
    }
    .my-concem-list-header-button {
        padding: 0 5px;
        height: 26px;
        border-radius: 3px;
    }
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 5px !important;
        top: -1px
    }
</style>
