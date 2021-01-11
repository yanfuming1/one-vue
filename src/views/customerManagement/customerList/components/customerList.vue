<template>
    <d2-container type="fulls" class="customer-list">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="auth.add && identification != '2'">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addCustomer">添加</el-button>
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
                        v-model="filterList.createDate"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        @change="selectChangeData('createDate')" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="identification != '2'">
                    <el-button type="primary" class="qqt-container-full-header-top___button" v-if="auth.delBat" @click="deleteCustomerList">批量删除</el-button>
                    <el-button type="warning" class="qqt-container-full-header-top___button" v-if="auth.informationdit" @click="updataSalesInformation(true)">业务负责人变更</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-share" v-if="identification != '2'" @click="updataSalesInformation(false)">共享</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
            <div class="qqt-container-full-header-bottom">
                <el-row :gutter="30">
                    <el-form :model="filterList" label-position="left" label-width="90px" size="medium">
                        <el-col :span="6" v-if="identification == '1'">
                            <el-form-item label="客户来源:">
                                <qqt-select :valueArray="filterList.customerSource" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户来源'" :options="remoteFuncs.customerSource" @select="page.current = 1, page.size = 10, filterList.customerSource = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="identification == '1'">
                            <el-form-item label="客户分类:">
                                <qqt-select :valueArray="filterList.customerCategory" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户类型'" :options="remoteFuncs.customerCategory" @select="page.current = 1, page.size = 10, filterList.customerCategory = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="identification == '1'">
                            <el-form-item label="客户性质:">
                                <qqt-select :valueArray="filterList.charaterCustomer" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户性质'" :options="remoteFuncs.charaterCustomer" @select="page.current = 1, page.size = 10, filterList.charaterCustomer = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属行业:">
                                <qqt-select :valueArray="filterList.industryCategory" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择所属行业'" :options="remoteFuncs.industryCategory" @select="page.current = 1, page.size = 10, filterList.industryCategory = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所在地区:">
                                <el-cascader v-model="filterList.unitAddress" size="mini" style="width: 100%" :options="cityJson" clearable :filterable="true" placeholder="+ 请选择所在地区" @change="page.current = 1, page.size = 10, filterList.unitAddress = $event; selectChangeData()"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="identification == '1'">
                            <el-form-item label="客户状态:">
                                <qqt-select :valueArray="filterList.customerStatus" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户类型'" :options="remoteFuncs.customerOptions" @select="page.current = 1, page.size = 10, filterList.customerStatus = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="客户等级:">
                                <qqt-select :valueArray="filterList.clientGrade" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择客户等级'" :options="remoteFuncs.clientGradeOptions" @select="page.current = 1, page.size = 10, filterList.clientGrade = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="信用评价:">
                                <qqt-select :valueArray="filterList.creditscore" size="mini" :defaultProp="customerProp" :collapseTags="true" :multiple="multiple" :filterable="filterable" :placeholder="'+ 请选择信用评价'" :options="creditscoreOptiosn" @select="page.current = 1, page.size = 10, filterList.creditscore = $event; selectChangeData()"></qqt-select>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-row>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <sales-information-update v-if="dialogVisible" :identification="identification" :dialogVisible="dialogVisible" sonProp="sonData" :data="values" :essentialData="essentialData" :values="primaryPrincipal" @change="updataCustomerList"></sales-information-update>
        <customer-share :identification="identification" :dialog="dialog" :essentialData="essentialData" @close="updataCustomerList"/>
    </d2-container>
</template>

<script>
import { qqtTable, qqtSelect, qqtCascader } from '../../../../components/qqt-subassembly'
import { getAssociatedCompanyCustomerList, 
         deleteAssociatedCompanyCustomer, 
         getAssociatedCompanyCustomerManagement, 
         getAssociatedCompanyCustomerPageList,

         // 添加关注
         addCustomeAttention,

         // 甲方
         deleteFirstPartyCustomer,
         getFirstPartyCustomerManagement,
         getFirstPartyCustomerPageList } from '../../../../api/customerManagement/customerList'
import { getCustomerDictionaryListQueryByIds } from '../../../../api/customerManagement/expandInformation'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { getCustomerDictionaryList } from '../../../../api/customerManagement/expandInformation'
import { getAssociatedCompanySalesInformationById, getFirstPartySalesInformationById } from '../../../../api/customerManagement/salesInformation'
import { mapActions } from 'vuex'
import { removeConcerns } from '../../../../api/customerManagement/myClientModule'
import { CITYJSON } from '../../../../enum/CTIYS'

import customerShare from './customerShare'
import salesInformationUpdate from './salesInformationUpdate'
import menu from '../../../../layout/header-aside/components/mixin/menu'
import util from '@/libs/util.js'
export default {
    name: 'customerList',
    data () {
        return {

            filterText: '',

            characteristic: '',
            
            identification: '',
            
            detailsData: '',

            customerStatus: '',

            clientGrade: '',

            creditscore: '',

            customerSource: '',

            unitAddress: '',

            industryCategory: '',

            charaterCustomer: '',

            customerCategory: '',

            allowCreate: true,

            filterable: true,

            multiple: true,

            dialogVisible: false,

            dialog: false,

            tableSelectData: [],

            essentialData: [], 

            rowHeader: [],

            page: {},

            filterList: {
                customerStatus: [],
                createDate: null,
                clientGrade: [],
                creditscore: [],
                customerSource: [],
                unitAddress: [],
                industryCategory: [],
                charaterCustomer: [],
                customerCategory: []
            },

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
        
            tableOption: {
                border: false
            },

            dynamicHeader: {
                tableId: 'T_1572430550543',
                // isSave 如果改为true，会调用获取动态表头的接口，会报错，但无其他影响，所以改为false，如果有其他问题可以改这里试试
                isSave: false
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

            primaryPrincipal: {},

            values: [],

            remoteFuncs: {
                customerOptions: [],
                clientGradeOptions: [],
                businessLeaderOptions: [],
                projectManagementLevel: [],
                industryCategory: [],
                expandInformation: [],
                customerType: [],
                charaterCustomer: [],
                customerCategory: [],
                customerSource: [],
                contactType: []
            },

            auth: {
                add: true,
                edit: true,
                delBat: true,
                informationdit: true
            },
            
            transform: {
                isShowDetails: false
            },

            creditscoreOptiosn: [
                {
                    id: '5',
                    proName: '优秀'
                },
                {
                    id: '4',
                    proName: '良好'
                },
                {
                    id: '3',
                    proName: '一般'
                },
                {
                    id: '2',
                    proName: '差'
                },
                {
                    id: '1',
                    proName: '极差'
                }
            ],

            unitAddressParams: {
                label: 'label',
                value: 'value',
                children: 'children',
            },

            cityJson: CITYJSON,
        }
    },

    methods: {

        ...mapActions ('d2admin/customer/', [
            'remoteFuncsSet'
        ]),

        selectChange (item) {
            this.tableSelectData = item
        },

        handlePaginationChange (page) {
            this.page = page
            this.$nextTick(() => {
                this.fuzzySearch (false)
            });
        },

        searchModelSynopsis () {
            this.fuzzySearch ()
        },

        getCustomerPageLists (text) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = getAssociatedCompanyCustomerPageList
                    break
                case '1':
                    url = getFirstPartyCustomerPageList
                    break
            }
            url ({
                ...text,
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then (res => {
                if (res) {
                    this.tableData = res
                }
            })
        },

        deleteCustomerObject (id) {
            this.deleteCustomerById ({'ids': id})
        },

        deleteCustomerList () {
            let ids = ''
            let isDelete = true
            if (this.tableSelectData && this.tableSelectData.length === 0) {
                this.$message.warning ('至少选择一条数据')
                return
            }
            this.tableSelectData.forEach(res => {
                if (res.createBy === util.cookies.get ('uuid')) {
                    ids += res.id + ','
                } else {
                    this.$message.warning (`{ ${res.cusName} } 非自己创建无法删除, 重新选择`)
                    isDelete = false
                }
            })
            if (isDelete) {
                this.deleteCustomerById ({'ids': ids.substring(0, ids.length - 1)})
            }
        },

        deleteCustomerById (id) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = deleteAssociatedCompanyCustomer
                    break
                case '1':
                    url = deleteFirstPartyCustomer
                    break
            }
            util.confirm ().then (boolean => {
                if (boolean) {
                    url (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getCustomerPageLists ()
                        }
                    })
                }
            })
        },

        skipToMyCustomer (data) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = getAssociatedCompanyCustomerManagement
                    break
                case '1':
                    url = getFirstPartyCustomerManagement
                    break
                case '2':
                    this.transform.isShowDetails = true
                    let title = '全部客户详情'
                    let boolean = data.clientType.includes ('联营')
                    this.toEditPage (title, data.id, boolean)
                    return
            }
            url ({'id': data.id}).then(item => {
                if (item) {
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

        

        updataSalesInformation (boolean) {
            this.essentialData = []
            if (this.tableSelectData && this.tableSelectData.length === 0) {
                this.$message.warning ('至少选择一条数据')
                return
            }
            let str = ''
            let obj = {}
            let name = ''
            let strId = ''
            let isCreate = true
            let isBusinessLeader = true
            this.tableSelectData.forEach (res => {
                res['sonData'] = []
                isCreate = isBusinessLeader = true
                strId += res.id + ','
                if (res.buLeId === util.cookies.get ('uuid')) {
                    str = this.neatenData (str, res)
                } else {
                    isCreate = false
                }

                if (isCreate) return

                if (res.createBy !== util.cookies.get ('uuid')) {
                    isBusinessLeader = false
                } else {
                    str = this.neatenData (str, res)
                }

                if (!isCreate && !isBusinessLeader) {
                    name += res.cusName + ','
                }
            })
            if (name) {
                this.$message.warning (`{${name.substring (0, name.length - 1)}}  您非业务负责人和创建人，无法进行业务负责人变更`)
                return
            }
            if (boolean) {
                this.primaryPrincipal['formerHeadOf'] = str.substring (0, str.length - 1)
                this.batchGetCustomerOperationData (strId.substring (0, strId.length - 1))
            } else {
                this.dialog = true
            }
            
        },

        neatenData (str, res) {
            let item = {}
            let index = str.includes (res.businessLeader)
            if (!index) {
                str += res.businessLeader + ','
            }
            const {id, cusName, businessLeader: formerHeadOf, buLeId: formerHeadOfId} = res
            item = {id, cusName, formerHeadOf, formerHeadOfId}
            this.essentialData.push (item)
            return str
        },

        batchGetCustomerOperationData (id) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url= getAssociatedCompanySalesInformationById
                    break;
                case '1':
                    url = getFirstPartySalesInformationById
                    break;
            }
            url ({'cusId': id}).then (res => {
                if (res.length > 0) {
                    let index = -1
                    res.forEach (item => {
                        index = this.tableSelectData.findIndex (f => f.id === item.cusId)
                        if (index !== -1) {
                            this.tableSelectData[index]['sonData'].push (item)
                        }
                    })
                }
                this.values = this.tableSelectData
            })
            this.dialogVisible = true
        },

        getExpandInformationData () {

            let ids = `${CUSTOMERAUTHORIZATION.CUSTOMERSTATUS},${CUSTOMERAUTHORIZATION.CLIENTGRADE},${CUSTOMERAUTHORIZATION.PROJECTMANAGEMENTLEVEL},${CUSTOMERAUTHORIZATION.INDUSTRYCATEGORY},${CUSTOMERAUTHORIZATION.CUSTOMERTYPE},${CUSTOMERAUTHORIZATION.CHARATERCUSTOMER},${CUSTOMERAUTHORIZATION.CUSTOMERSOURCE},${CUSTOMERAUTHORIZATION.CONTACTTYPE},${CUSTOMERAUTHORIZATION.CUSTOMERCATEGORY}`
            getCustomerDictionaryListQueryByIds ({ 'ids': ids }).then(expandInformation => {
                if (expandInformation == null || expandInformation.length == 0) return
                expandInformation.forEach (res => {
                    switch (res.id) {
                        case CUSTOMERAUTHORIZATION.CUSTOMERSTATUS:
                            this.remoteFuncs.customerOptions = res.customerDictionaryList
                            break
                        case CUSTOMERAUTHORIZATION.CLIENTGRADE:
                            this.remoteFuncs.clientGradeOptions = res.customerDictionaryList
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
                        case CUSTOMERAUTHORIZATION.CUSTOMERCATEGORY:
                            this.remoteFuncs.customerCategory = res.customerDictionaryList
                            break
                    }
                })
                let item = this.remoteFuncs
                this.remoteFuncsSet ({ item })
            })
        },

        getStaffStaffDictionary () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.remoteFuncs.businessLeaderOptions = res
                }
            })
        },

        updataCustomerList () {
            this.dialogVisible = this.dialog = false
            this.getCustomerPageLists ()
        },

        addCustomer () {
            this.transform.isShowDetails = false
            let name = this.identification === '0' ? '联营人' : ''
            this.toEditPage (`添加${name}客户`)
        },

        updataCustomerData (id) {
            this.transform.isShowDetails = false
            let name = this.identification === '0' ? '联营人' : ''
            this.toEditPage (`编辑${name}客户`, id)
        },

        toEditPage (title, id = '', boolean = false) {
            this.$router.push({
                path: 'addCustomer',
                name: 'addCustomer',
                query: {
                    'identification': this.identification
                },
                params: {
                    'id': id,
                    'boolean': boolean,
                    'remoteFuncs': this.remoteFuncs,
                    'transform': this.transform
                }
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },

        attentionCustomerList (id) {
            this.$store.commit ('d2admin/loading/noAllowShow')
            addCustomeAttention ({
                'cusId': id,
                'salesmanId': util.cookies.get ('uuid')
            }).then(item => {
                if (item.code === 200) {
                    this.$message.success ('关注成功')
                    this.getCustomerPageLists ()
                }
            })
        },

        selectChangeData (data) {
            let item = {}
            this.customerStatus = this.clientGrade = this.creditscore 
                = this.customerSource = this.unitAddress = this.industryCategory = this.charaterCustomer = this.customerCategory = ''
            this.filterList.customerStatus.forEach (id => { this.customerStatus += id + ',' })
            this.filterList.clientGrade.forEach (id => { this.clientGrade += id + ',' })
            this.filterList.creditscore.forEach (id => { this.creditscore += id + ',' })
            this.filterList.customerSource.forEach (id => { this.customerSource += id + ',' })
            this.filterList.unitAddress.forEach (id => { this.unitAddress += id + ',' })
            this.filterList.industryCategory.forEach (id => { this.industryCategory += id + ',' })
            this.filterList.charaterCustomer.forEach (id => { this.charaterCustomer += id + ',' })
            this.filterList.customerCategory.forEach (id => { this.customerCategory += id + ',' })

            this.fuzzySearch ()
        },

        getCustomerDictionary () {
            getCustomerDictionaryList ().then (res => {
                if (res) {
                    this.remoteFuncs.expandInformation = res
                    let item = this.remoteFuncs
                    this.remoteFuncsSet ({ item })
                }
            })
        },

        resetModelSynopsis () {
            this.filterList = {
                customerStatus: [],
                createDate: null,
                clientGrade: [],
                creditscore: [],
                customerSource: [],
                unitAddress: [],
                industryCategory: [],
                charaterCustomer: [],
                customerCategory: []
            },
            this.resetPage ()
            this.filterText = this.customerStatus = this.clientGrade = this.creditscore 
                = this.customerSource = this.unitAddress = this.industryCategory = this.charaterCustomer = this.customerCategory = ''
            this.getCustomerPageLists ()
        },

        removeAttentionCustomer (id) {
            this.$store.commit ('d2admin/loading/noAllowShow')
            removeConcerns ({'id': id}).then (res => {
                if (res.code === 200) {
                    this.$message.success ('取消关注成功')
                    this.getCustomerPageLists ()
                }
            })
        },

        fuzzySearch (boolean = true) {
            let str = '', item = {}
            if (boolean) this.resetPage ()
            str = this.identification == '0' ? 'positionInIndustryId' : 'industryCategoryId'
            item = {'keywords': this.filterText ? this.filterText : null,
                'customerStatusId': this.customerStatus ? this.customerStatus.substring (0, this.customerStatus.length - 1) : null,
                'clientGradeId': this.clientGrade ? this.clientGrade.substring (0, this.clientGrade.length - 1) : null,
                'creditscore': this.creditscore ? this.creditscore.substring (0, this.creditscore.length - 1) : null,
                'customerSourceId': this.customerSource ? this.customerSource.substring (0, this.customerSource.length - 1) : null,
                'unitAddressId': this.unitAddress ? this.unitAddress.substring (0, this.unitAddress.length - 1) : null,
                'charaterCustomerId': this.charaterCustomer ? this.charaterCustomer.substring (0, this.charaterCustomer.length - 1) : null,
                'customerCategoryId': this.customerCategory ? this.customerCategory.substring (0, this.customerCategory.length - 1) : null,
                'createTime': this.filterList.createDate ? this.filterList.createDate[0] : null,
                'updateTime':this.filterList.createDate ? this.filterList.createDate[1] : null}
            item[str] = this.industryCategory ? this.industryCategory.substring (0, this.industryCategory.length - 1) : null
            this.getCustomerPageLists (item)
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        },

        updataCreditscore (data) {
            let str = ''
            let num = Number.parseInt (data)
            switch (num) {
                case 5:
                    str = '优秀'
                    break;
                case 4:
                    str = '良好'
                    break;
                case 3:
                    str = '一般'
                    break;
                case 2:
                    str = '差'
                    break;
                case 1:
                    str = '极差'
                    break;
            }
            return str
        },

        // 验证权限
        _validationAuth () {
            this.auth.add = this.identification === '0' ? this.$has ('client:list:add') : this.$has ('clients:list:add')
            this.auth.edit = this.identification === '0' ? this.$has('client:list:edit') : this.$has ('clients:list:edit')
            this.auth.delBat = this.identification === '0' ? this.$has('client:list:deleteBatch') : this.$has ('clients:list:deleteBatch')
            this.auth.informationdit = this.identification === '0' ? this.$has('client:list:updateInformation') : this.$has ('clients:list:updateInformation')
        },

        isShwoHeader () {
            this.rowHeader = [
                {
                    prop: 'customerNumber',
                    label: this.identification == '1' ? '客户编码' : '联营人编码',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                            [
                                h ('div', {
                                    class: {
                                        'iconfont iconwuxing off': parms.row.attention === '0',
                                        'iconfont iconwuxing on': parms.row.attention === '1',
                                    },
                                    style: {
                                        'cursor': 'pointer'
                                    },
                                    on: { 
                                        click: () => {

                                            if (parms.row.attention === '0') {
                                                this.attentionCustomerList (parms.row.id)
                                            }
                                            
                                            if (parms.row.attention === '1') {
                                                this.removeAttentionCustomer (parms.row.caId)
                                            }
                                        } 
                                    }
                                }),
                                h ('div', {
                                        class: {
                                            'typefaceColor': true,
                                        },
                                        on: { click: () => { this.skipToMyCustomer (parms.row) } }
                                }, parms.row.customerNumber)
                            ]
                        )
                    }
                },
                {
                    prop: 'cusName',
                    label: this.identification == '1' ? '客户名称' : '联营人姓名',
                    isShow: true
                },
                {
                    prop: 'cusPhone',
                    label: '联系电话',
                    isShow: this.identification == '1' ? false : true
                },
                {
                    prop: 'customerSource',
                    label: '客户来源',
                    isShow: this.identification == '1' ? true : false
                },
                {
                    prop: 'customerCategory',
                    label: '客户分类',
                    isShow: this.identification == '1' ? true : false
                },
                {
                    prop: 'charaterCustomer',
                    label: '客户性质',
                    isShow: this.identification == '1' ? true : false
                },
                {
                    prop: 'industryCategory',
                    label: '所属行业',
                    isShow: this.identification == '1' ? true : false
                },
                {
                    prop: 'positionInIndustry',
                    label: '所属行业',
                    isShow: this.identification == '1' ? false : true
                },
                {
                    prop: 'unitAddress',
                    label: '所在地区',
                    isShow: true
                },
                {
                    prop: 'customerType',
                    label: '联营人特点',
                    isShow: this.identification == '1' ? false : true
                },
                {
                    prop: 'customerStatus',
                    label: '客户状态',
                    isShow: this.identification == '1' ? true : false
                },
                {
                    prop: 'clientGrade',
                    label: this.identification == '1' ? '客户等级' : '联营人等级',
                    isShow: true
                },
                {
                    prop: 'creditscoreName',
                    label: '信用评价',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('div', {}, parms.row.creditscoreName = this.updataCreditscore (parms.row.creditscore)),
                        ]
                    }
                },
                {
                    prop: 'businessLeader',
                    label: '业务负责人',
                    isShow: true
                },
                {
                    prop: 'createName',
                    label: '登记人',
                    isShow: true
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    isShow: true
                },
                {
                    prop: '',
                    label: '操作',
                    fixed: "right",
                    width: 150,
                    isShow: this.identification != '2' ? true : false,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.updataCustomerData (parms.row.id)
                                    }
                                }
                            }, this.auth.edit ? this.identification != '2' ? '编辑' : '' : ''),
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        if (parms.row.createBy !== util.cookies.get ('uuid')) {
                                            this.$message.warning ( `{ ${parms.row.cusName} } 非自己创建无法删除`)
                                            return
                                        }
                                        this.deleteCustomerObject (parms.row.id)
                                    }
                                }
                            }, this.auth.delBat ? this.identification != '2' ? '删除' : '' : '')
                        ]
                    }
                }
            ]
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
        },

        printTable () {
            this.$refs.table.printTable (this.tableSelectData)
        }
    },

    components: {
        'qqt-select': qqtSelect,
        'qqt-table': qqtTable,
        'qqt-cascader': qqtCascader,
        'customer-share': customerShare,
        'sales-information-update': salesInformationUpdate
    },

    created () {
        this.resetPage ()
        this.identification = this.$route.params.identification
        this.$store.dispatch ('d2admin/customer/identificationSet', this.identification)
        this.getExpandInformationData ()
        this.getStaffStaffDictionary ()
        this.getCustomerDictionary ()
        this.getCustomerPageLists ()
        this.isShwoHeader ()
    },

    mounted () {
        this._validationAuth ()
    },

    watch: {
        $route (val) {
            if (val.path.indexOf('customerList') !== -1) {
                this.identification = val.params.identification
                this.resetModelSynopsis ()
                this.isShwoHeader ()
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    }
}
</script>

<style lang='scss'>
    .customer-list {
        
        .qqt-container-full__body {
            padding: 0 20px 20px !important;
        }
    }
</style>
