<template>
    <d2-container class="i-created-customer-list">
        <template slot="header">
            <div class="customer-list-header">
                <div class="customer-list-header___top">
                    <span class="customer-list-header___search">
                        <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchICreated"
                            v-model="filterText" size="mini">
                        </el-input> 
                        <el-button type="primary" class="customer-list-header-button" @click="searchICreated">搜索</el-button>
                        <el-button type="info" class="customer-list-header-button" @click="resetBtn">重置</el-button>
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
                    <span class="customer-list-header-operation___right">
                        <el-button type="primary" class="customer-list-header-button" v-has="'client:list:cusdeleteBatch'" @click="deleteCustomerList">批量删除</el-button>
                        <el-button type="warning" class="customer-list-header-button" @click="updataSalesInformation(true)">业务负责人变更</el-button>
                        
                    </span>
                    <span class="customer-list-header-operation___right">
                        <el-button-group>
                            <el-button size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
                            <el-button size="mini" icon="el-icon-share" @click="updataSalesInformation(false)">共享</el-button>

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
                                        selectChangeData('customerStatus')">
                                    </qqt-select>
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
            <qqt-table ref="table" :data="tableData" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>

        </div>
        <div>
            <sales-information-update v-if="dialogVisible" :identification="salesInformationIdentification" :dialogVisible="dialogVisible" sonProp="sonData" :data="values" :essentialData="essentialData" :values="primaryPrincipal" @change="updataCustomerList"></sales-information-update>
            <customer-share :identification="identification" :dialog="dialog" :essentialData="essentialData" @close="updataCustomerList"/>
        </div>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { createCustomerList, addConcern, removeConcerns, poolFirstPartyBatchDeletion} from '../../../../api/customerManagement/myClientModule'
import { 
    getAssociatedCompanyCustomerManagement,
    getFirstPartyCustomerManagement,
    deleteAssociatedCompanyCustomer, 
    updataAssociatedCompanyCustomer, 
    // 甲方客户
    deleteFirstPartyCustomer, 
    updataFirstPartyCustomer } from '../../../../api/customerManagement/customerList'
import { getCustomerDictionaryListQueryByIds, getCustomerDictionaryList } from '../../../../api/customerManagement/expandInformation'
import { getAssociatedCompanySalesInformationById, getFirstPartySalesInformationById } from '../../../../api/customerManagement/salesInformation'

import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { CITYJSON } from '../../../../enum/CTIYS'

import customerShare from '../../customerList/components/customerShare'
import salesInformationUpdate from '../../customerList/components/salesInformationUpdate'
import menu from '../../../../layout/header-aside/components/mixin/menu'
import util from '@/libs/util.js'
export default {
    data () {
        return {
            transform: {
                isShowDetails: false
            },

            // 筛选文本（搜索）
            filterText: '',

            keywords: '',

            // 可过滤（头部下拉筛选）
            filterable: true,

            detailsData:'',

            identification: '',

            multiple: true,

            dialogVisible: false,

            dialog: false,

            tableSelectData: [],
            
            essentialData: [], 

            clientTypeData:'',

            rowHeader: [
                {
                    prop: 'customerNumber',
                    label: '客户编码',
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
                        ])
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
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                           parms.row.customerStatus ? parms.row.customerStatus = parms.row.customerStatus : parms.row.customerStatus = '无' 
                        )
                    }
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
                    width: '150',
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ 
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.updataCustomerData (parms.row.id, parms.row.clientType)
                                    }
                                }
                            }, '编辑'),
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        if (parms.row.attention === "0") {
                                            if (parms.row.clientType == "联营客户" ){
                                                deleteAssociatedCompanyCustomer({'ids':parms.row.id}).then( res => {
                                                    this.$message.success(res.message)
                                                    this.getCreateCustomerList()
                                                }).catch(err => {
                                                    this.$message.error(res.message)
                                                })
                                            } else if (parms.row.clientType == "甲方客户"){
                                                deleteFirstPartyCustomer({'ids':parms.row.id}).then( res => {
                                                    this.$message.success(res.message)
                                                    this.getCreateCustomerList()
                                                }).catch(err => {
                                                    console.log(err)
                                                    this.$message.error(res.message)
                                                })
                                            } else {
                                                console.log(err)
                                            }
                                        } else {
                                            this.$message.warning("被选中的客户内有已关注的，删除失败")
                                        }
                                    }
                                }
                            }, '删除')
                        ]
                    }
                }
            ],

            page: {},

            // 头部下拉框中的数据
            filterList: {
                customerStatus: [], // 客户状态
                createDate: null, // 创建日期
                clientGrade: [],    // 客户等级
                businessLeader: []  // 业务负责人
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
                tableId: 'T_1004611666',
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

            values: [],
            
            primaryPrincipal: {},

            remoteFuncs: {

                customerOptions: [],    // 客户状态

                clientGradeOptions: [], // 客户等级

                businessLeaderOptions: [],  // 业务负责人选项

                customerQualification: [],  // 客户资质

                projectManagementLevel: [], // 项目管理水平

                industryCategory: [],   // 行业类别

                expandInformation: [],  // 展开信息

                customerType: [],   // 客户类型

                charaterCustomer: [],   // 客户性质

                customerSource: [], // 客户来源
                
                contactType: [] // 联系类型
            },

            customerStatus: '',

            clientGrade: '',

            businessLeader: '',

            salesInformationIdentification: ''
        }
    },

    methods: {
        // 初始化加载列表
        getCreateCustomerList (keywords) {
            createCustomerList ({
                ...keywords,
                'createBy': util.cookies.get ('uuid'),
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                this.tableData = res
            })
        },
        
        // 表单设计器下拉函数方法
        ...mapActions ('d2admin/customer/', [
            'remoteFuncsSet'
        ]),

        selectChange (item) {
            this.tableSelectData = item
        },

        // 搜索
        searchICreated () {
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
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
            this.filterText = this.customerStatus = this.businessLeader = this.clientGrade = ''
            this.getCreateCustomerList ()
        },

        // 我创建关注 
        attentionCustomerList (id) {
            this.$store.commit ('d2admin/loading/noAllowShow')
            addConcern ({
                'cusId': id,
                'salesmanId': util.cookies.get ('uuid')
            }).then(item => {
                if (item.code === 200) {
                    this.$message.success ('关注成功')
                    this.getCreateCustomerList ()
                }
            })
        },

        removeAttentionCustomer (caId) {
            this.$store.commit ('d2admin/loading/noAllowShow')
            removeConcerns ({'id': caId}).then (res => {
                if (res.code === 200) {
                    this.$message.success ('取消关注成功')
                    this.getCreateCustomerList ()
                }
            })
        },

        // 搜索分页查询
        handlePaginationChange (page) {
            // 调用分页列表查询接口，将分页查询出来的数据赋值给当前内容， 点击下一页时调用数据化加载数据的列表
            this.page = page;
            this.$nextTick(() => {
               this.fuzzySearch (false)
            });
        },

        // 批量删除按钮事件
        deleteCustomerList () {
            let ids = ''
            let attention = ''
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                    attention += res.attention + ','
                })
                if (attention.includes('1')) {
                    this.$message.warning("被选中的客户内有已关注的，删除失败")
                    return
                } else {
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                       poolFirstPartyBatchDeletion({
                            ids
                        }).then( res => {
                            this.getCreateCustomerList ()
                            this.$message.success("删除成功")
                        }).catch( err => {
                            this.$message.warning("删除失败")
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
            } else {
                this.$message.warning("请至少选择一条需删除的数据")
            }
        },

        // 销售信息更新
        updataSalesInformation (boolean) {
            if (this.tableSelectData.length !== 1) {
                this.$message.warning ('请选择一条数据')
                return
            }
            this.clientTypeData = this.tableSelectData[0].clientType
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
                this.salesInformationIdentification = res.clientType.includes ('联营客户') ? '0' : '1'
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
                this.$message.warning (`${name.substring (0, name.length - 1)} 您非业务负责人和创建人，无法进行客户更新`)
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
            switch (this.tableSelectData[0].clientType) {
                case '联营客户':
                    url= getAssociatedCompanySalesInformationById
                    break;
                case '甲方客户':
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

        // 客户编码跳转客户资料信息事件
       skipToMyCustomer (data) {
            let url = ''
            switch (data.clientType) {
                case '联营客户':
                    url =
                     getAssociatedCompanyCustomerManagement
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
                    item.myClientPath = 'iCreated'
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

        // 获取员工字典 ( 获取业务负责人 )
        getStaffStaffDictionary () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.remoteFuncs.businessLeaderOptions = res
                }
            })
        },

        // 取消销售信息更新
        updataCustomerList () {
            this.dialogVisible = this.dialog = false
            this.getCreateCustomerList()
        },
        
        updataCustomerData (id, clientType) {
            this.transform.isShowDetails = false
            this.identification = clientType.includes ('联营') ? '0' : '1' 
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

        // 头部下拉 选择更改数据
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
            // 获取客户字典列表 项目字典标表-分页列表查询
            getCustomerDictionaryList ().then (res => {
                if (res) {
                    // 下拉展开信息赋值给 res
                    this.remoteFuncs.expandInformation = res
                    let item = this.remoteFuncs
                    this.remoteFuncsSet ({ item })
                }
            })
        },

        fuzzySearch (boolean = true) {
            if (boolean) this.resetPage ()
            this.getCreateCustomerList ({'keywords': this.filterText ? this.filterText : null,
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
    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor'
        ])
    },
    components: {
        'qqt-select': qqtSelect,
        'qqt-table': qqtTable,
        'customer-share': customerShare,
        'sales-information-update': salesInformationUpdate
    },
    created () {
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
        this.resetPage ()

        this.getCreateCustomerList()

        // 获取扩展信息数据
        this.getExpandInformationData ()

        // 获取员工字典
        this.getStaffStaffDictionary ()

        // 获取客户字典
        this.getCustomerDictionary ()
    },
    
    watch: {
        $route (val) {
            if ( val.name === 'iCreated') {
                this.resetBtn ()
            }
        }
    }


}
</script>

<style lang='scss'>
    .i-created-customer-list {
        .customer-list-header {
            padding-top: 10px;
            .customer-list-header___top{
                .customer-list-header-button {
                    padding: 0 5px;
                    height: 26px;
                    border-radius: 3px;
                }
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
</style>
