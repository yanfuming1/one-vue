<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="auth.add">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="customerAuthorization">分享</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="auth.del">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchCustomerAuthorizationData">移除分享</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="auth.del">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <div class="qqt-container-full-center___left">
            <qqt-tree 
                :title="'分享类型'"
                ref="tree"
                :data="data"
                :btnTitle="null"
                :isShowUpdate="false"
                :isShowAdd="false"
                :isShowCheckbox="true"
                :isShowDel="false"
                :defaultProps="defaultProps"
                @historicalData="historicalDataObject"
                @checkChange="getCheckChange"
                ></qqt-tree>
        </div>
        <div class="qqt-container-full-center___right">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader" :pageShow="false" :isDrag="isDrag" :isShowIndex="isShowIndex" :option="tableOption" @selectionChange="selectChange" @page="handlePaginationChange"></qqt-table>
        </div>
        <user-modules title="请选择分享给那部门、人员或角色" :showDialog="isAuditman" @clearUserPage="clearUserPage" @closeFun="isAuditman = false"></user-modules>
    </d2-container>
</template>

<script>
import { qqtTable, qqtTree } from '../../../../components/qqt-subassembly'
import { getCustomerDictionaryList } from '../../../../api/customerManagement/expandInformation'
import { getCustomerListById, 
         addCustomerAuthorization, 
         deleteBatchCustomerAuthorization,
         
         addFirstPartyCustomerAuthorization,
         getFirstPartyCustomersAuthorizationListById,
         deleteBatchFirstPartyCustomerAuthorization} from '../../../../api/customerManagement/customerAuthorization'

import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import util from '@/libs/util.js'
export default {
    name: 'customerAuthorization',
    data () {
        return {
            filterText: '',
            identification: '',
            isShowIndex: false,
            isAuditman: false,
            isDrag: false,
            data: [],
            treeCheckData: [],
            checkData: [],
            historicalData: {},
            rowHeader: [
                {
                    prop: 'authorizationType',
                    label: '授权类型',
                    isShow: true,
                },
                {
                    prop: 'authorizationObject',
                    label: '授权对象',
                    isShow: true,
                },
                {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    width: 240,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ 
                                    type: 'text',
                                },
                                on:{
                                    click: () => {
                                        this.deleteCustomerAuthorization (parms.row.id)
                                    }
                                }
                            }, this.$has ('authorization:list:delete') ? '删除' : '')
                        ]
                    }
                }
            ],
            tableData: {
                records: []
            },
            tableOption: {
                border: false
            },
            defaultProps: {
                children: 'child',
                label: 'proName'
            },
            auth: {
                add:true,
                del:true
            }
        }
    },

    methods: {

        searchModelSynopsis () {
            this.getCustomerListToObject (this.historicalData.id, {'name': this.filterText})
        },

        selectChange (item) {
            this.checkData = item
        },

        handlePaginationChange (page) {
        
        },

        historicalDataObject (item) {
            this.historicalData = item
            this.$store.commit ('d2admin/loading/noAllowShow')
            this.getCustomerListToObject (item.id)
        },

        getCustomerDictionary () {
            this.data = []
            getCustomerDictionaryList ().then(res => {
                if (res && res.length > 0) {
                    this.data = res
                }
            })
        },

        getCustomerListToObject (id, text) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = getCustomerListById
                    break
                case '1':
                    url = getFirstPartyCustomersAuthorizationListById
                    break
            }
            url ({
                ...text,
                'id': id,
                'createBy': util.cookies.get ('uuid')
            }).then(res => {
                if (res) {
                    this.treeCheckData = []
                    this.tableData.records = res
                }
            })
        },

        clearUserPage (item) {
            if (item && item.length > 0) {
                this.addCustomerAuthorizationList (item)
            }
            this.isAuditman = false
        },

        customerAuthorization () {
            if (this.treeCheckData && this.treeCheckData.length > 0) {
                this.isAuditman = true
            } else {
                this.$message.warning ('至少选择一条数据')
            }
        },

        addCustomerAuthorizationList (data) {
            let list = []
            let url = ''
            this.treeCheckData.forEach (tree => {
                data.forEach (item => {
                    let customer = {
                        authorizationObject: item.name,
                        authorizationObjectId: item.id,
                        authorizationType: tree.proName,
                        authorizationTypeId: tree.id
                    }
                    list.push (customer)
                })
            })
            switch (this.identification) {
                case '0':
                    url = addCustomerAuthorization
                    break
                case '1':
                    url = addFirstPartyCustomerAuthorization
                    break
            }
            url (list).then (res => {
                if (res.code === 200) {
                    this.treeCheckData = []
                    this.$message.success ('授权成功')
                    this.$refs.tree.resetCheckState ()
                    this.getCustomerListToObject (this.historicalData.id)
                }
            })
        },

        deleteCustomerAuthorization (id) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = deleteBatchCustomerAuthorization
                    break
                case '1':
                    url = deleteBatchFirstPartyCustomerAuthorization
                    break
            }
            util.confirm() .then (boolean => {
                if (boolean) {
                    url ({'ids': id}).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('删除成功')
                            this.getCustomerListToObject (this.historicalData.id)
                        }
                    })
                }
            })
        },

        deleteBatchCustomerAuthorizationData () {
            if (this.checkData.length === 0) {
                this.$message.warning ('至少选择 一条数据')
                return
            }
            let str = ''
            this.checkData.forEach (res => {
                str += res.id + ','
            })
            this.deleteCustomerAuthorization (str.substring (0, str.length - 1))
        },

        resetModelSynopsis () {
            this.filterText = ''
            this.getCustomerListToObject (this.historicalData.id)
        },

        getCheckChange (data) {
            this.treeCheckData = data.filter ( f => f.parentId !== '0')
        },

        // 验证权限
        _validationAuth() {
            this.auth.add = this.identification === '0' ? this.$has ('authorization:list:insertForeach') : this.$has ('authorizations:list:insertForeach')
            this.auth.del = this.identification === '0' ? this.$has('authorization:list:delete') : this.$has ('authorizations:list:delete')
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
        }

    },
    
    components: {
        'qqt-table': qqtTable,
        'qqt-tree': qqtTree,
        'user-modules': userModules
    },

    created () {
        this.identification = this.$route.params.identification
        this.$store.dispatch ('d2admin/customer/identificationSet', this.identification)
        this.getCustomerDictionary ()
    },

    watch: {
        $route (val) {
            if (val.path.indexOf('customerAuthorization') !== -1) {
                this.identification = val.params.identification
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
            }
        }
    },

    mounted () {
        this._validationAuth ()
    }
}
</script>

