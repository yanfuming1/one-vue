<template>
    <d2-container type="fulls" class="relationship-record">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addRelationshipRecord">添加</el-button>
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
                        v-model="createDate"
                        type="daterange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="searchModelSynopsis()" 
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="auth.delBat">
                    <el-button type="primary" class="qqt-container-full-header-top___button" v-has="'relationship:list:deleteBatch'" @click="deleteRelationshipRecordList">批量删除</el-button>
                </span>
                <span>
                    <el-form class="relationship-record-header___from" :model="filterList" label-width="95px" size="medium">
                        <el-form-item label="联系方式:">
                            <qqt-select :value="filterList.customerStatus" size="mini" :defaultProp="defaultProp" :filterable="filterable" :placeholder="'+ 请选择联系类型'" :options="options" @select="getContactType"></qqt-select>
                        </el-form-item>
                    </el-form>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="handleBtn('打印')">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :dynamicHeader="dynamicHeader" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <add-relationship-record :drawer="drawer" v-if="drawer" :identification="identification" :customer="customer" :state="state" :remoteFunc="remoteFuncs" @change="updataRelationshipRecordList"></add-relationship-record>
    </d2-container>
</template>

<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { getCustomerDictionaryQueryById } from '../../../../api/customerManagement/expandInformation'
import { CUSTOMERAUTHORIZATION } from '../../../../enum/DICTIONARY'
import { getRelationshipRecordList, 
         deleteRelationshipRecord, 
         getFirstPartyRelationshipRecordList, 
         deleteFirstPartyRelationshipRecord,
         getRelationshipRecordData,
         getFirstPartyRelationshipRecordData } from '../../../../api/customerManagement/relationshipRecord'
import { getAssociatedCompanyCustomerPageList, getFirstPartyCustomerPageList } from '../../../../api/customerManagement/customerList'
import { mapState } from 'vuex'

import addRelationshipRecord from './addRelationshipRecord'
import util from '@/libs/util.js'
import { add } from '../../../../api/financialManagement/voucher'
export default {
    name: 'relationshipRecord',
    data () {
        return {
            filterText: '',
            identification: '',
            allowCreate: true,
            filterable: true,
            drawer: false,
            options: [],
            createDate: [],
            rowHeader: [],
            tableSelectData: [],
            tableOption: {
                border: false
            },
            dynamicHeader: {
                tableId: 'T_1572430637541',
                isSave: true,
            },
            defaultProp: {
                value: 'id',
                label: 'proName'
            },
            filterList: {
                customerStatus: '',
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            tableData: {},
            customer: '',
            remoteFuncs: {
                customerList: []
            },
            state: true,
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
            auth: {
                add:true,
                edit:true,
                del:true,
                delBat:true
            }
        }
    },

    methods: {

        selectChange (item) {
            this.tableSelectData = item
        },

        searchModelSynopsis () {
            this.getRelationshipRecordPage ({
                'keywords': this.filterText ? this.filterText : null,
                'createTime': this.createDate ? this.createDate[0] : null,
                'updateTime': this.createDate ? this.createDate[1] : null,
                'contactTypeId': this.filterList.customerStatus ? this.filterList.customerStatus : null})
        },
        
        isShowHeader () {
            this.rowHeader = [
                {
                        prop: 'contactDate',
                        label: '联系日期',
                        isShow: true,
                        render: (h, parms) => {
                            return [
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.state = true
                                            this.editCustomerData (parms.row.id)
                                        }
                                    }
                                }, parms.row.contactDate)
                            ]
                        }
                    },
                    {
                        prop: 'contactType',
                        label: '联系方式',
                        isShow: true,
                    },
                    {
                        prop: 'customerName',
                        label: this.identification == '1' ? '客户名称' : '联营人姓名' ,
                        isShow: true
                    },
                    {
                        prop: 'remark',
                        label: '联系内容',
                        isShow: true
                    },
                    {
                        prop: 'nextContactDate',
                        label: '下次联系日期',
                        isShow: true
                    },
                    {
                        prop: 'relatedProjects',
                        label: '关联项目',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '创建人',
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
                                            this.state = false
                                            this.editCustomerData (parms.row.id)
                                        }
                                    }
                                }, this.auth.edit ? '编辑' : ''),
                                h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.deleteCustomerObject (parms.row.id)
                                        }
                                    }
                                }, this.auth.del ? '删除' : '')
                            ]
                        }
                    }
            ]
        },
        
        

        handlePaginationChange (page) {
            this.page = page;
            this.$nextTick(() => {
                if (this.filterText === '') {
                    this.getRelationshipRecordPage ()
                } else {
                    this.getRelationshipRecordPage ({'keywords': this.filterText ? this.filterText : null, 'contactTypeId': this.filterList.customerStatus ? this.filterList.customerStatus : null})
                }
            });
        },

        getRelationshipRecordPage (text) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = getRelationshipRecordList
                    break
                case '1':
                    url = getFirstPartyRelationshipRecordList
                    break
            }
            url ({
                ...text,
                'contactsId': util.cookies.get ('uuid'),
                'pageNo': this.page.current,
                'pageSize': this.page.size
            }).then( res => {
                if (res) {
                    this.tableData = res
                }
            }).catch(err => {
                this.tableData = {}
            })
        },

        deleteCustomerObject (id) {
            this.deleteRelationshipRecordById ({'ids': id})
        },

        deleteRelationshipRecordList () {
            if (this.tableSelectData.length === 0) {
                this.$message.warning ('请选择一条数据')
                return
            }
            let ids = ''
            if (this.tableSelectData && this.tableSelectData.length > 0) {
                this.tableSelectData.forEach(res => {
                    ids += res.id + ','
                })
            }
            this.deleteRelationshipRecordById ({'ids': ids.substring(0, ids.length - 1)})
        },

        deleteRelationshipRecordById (id) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = deleteRelationshipRecord
                    break
                case '1':
                    url = deleteFirstPartyRelationshipRecord
                    break
            }
            util.confirm ().then (boolean => {
                if (boolean) {
                    url (id).then(res => {
                        if (res.code === 200) {
                            this.$message.success(res.message)
                            this.getRelationshipRecordPage ()
                        }
                    })
                }
            })
        },

        addRelationshipRecord () {
            this.customer = ''
            this.drawer = true
            this.state = false
        },

        getExpandInformationData () {
            getCustomerDictionaryQueryById ({'id': CUSTOMERAUTHORIZATION.CONTACTTYPE}).then(res => {
                if (res.records == null || res.records.length == 0) {
                    return
                }
                this.options = res.records
            }) 
        },

        getCustomerPage () {
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
                'pageNo': '1',
                'pageSize': '100'
            }).then(res => {
                if (res.records && res.records.length > 0) {
                    this.remoteFuncs.customerList = res.records
                } else {
                    this.remoteFuncs.customerList = []
                }
            })
        },

        updataRelationshipRecordList () {
            this.drawer = false
            this.getRelationshipRecordPage ()
        },

        editCustomerData (id) {
            this.customer = id
            this.drawer = true
        },

        getContactType (data) {
            this.page.current = 1
            this.page.size = 10,
            this.filterList.customerStatus = data
            this.getRelationshipRecordPage ({'keywords': this.filterText ? this.filterText : null, 'contactTypeId': data})
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.createDate = []
            this.filterList.customerStatus = ''
            this.getRelationshipRecordPage ()
        },

        // 验证权限
        _validationAuth () {
            this.auth.add = this.identification === '0' ? this.$has ('relationship:list:add') : this.$has ('relationships:list:add')
            this.auth.edit = this.identification === '0' ? this.$has('relationship:list:edit') : this.$has ('relationships:list:edit')
            this.auth.del = this.identification === '0' ? this.$has('relationship:list:delete') : this.$has ('relationships:list:delete')
            this.auth.delBat = this.identification === '0' ? this.$has('relationship:list:deleteBatch') : this.$has ('relationships:list:deleteBatch')
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
        },

        handleBtn (val) {
            this.$refs.table.printTable (this.selectRow)
        }
    },

    components: {
        'qqt-table': qqtTable,
        'qqt-select': qqtSelect,
        'add-relationship-record': addRelationshipRecord
    },

    created () {
        this.identification = this.$route.params.identification
        this.getExpandInformationData ()
        this.getRelationshipRecordPage ()
        this.getCustomerPage ()
        this.isShowHeader ()
    },

    watch: {
        $route (val) {
            if (val.path.indexOf('relationshipRecord') !== -1) {
                this.identification = val.params.identification
                this.getRelationshipRecordPage ()
                this.getCustomerPage ()
                this.isShowHeader ()
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    },

    mounted () {
        this._validationAuth ()
    }
}
</script>

<style lang='scss'>
    .relationship-record {
        .relationship-record-header___from {
            display: inline-block;
            width: 20%;
            .el-form-item {
                margin-bottom: 0px !important
            }
        }
        .el-input__prefix, .el-input__suffix {
            top: -1px !important
        }
    }
</style>
