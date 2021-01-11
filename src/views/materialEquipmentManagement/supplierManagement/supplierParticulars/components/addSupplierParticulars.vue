<template>
    <d2-container class="add-supplier-particulars">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="values" ref="generateForm" @on-change="selectGenerateChange" />
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                供货物品
            </el-divider>
            <el-button class="add-supplier-particulars-button" size="mini" round @click="dialogVisible = true">从材料库导入</el-button>
            <qqt-relate-table :data="values.materialAddlines" ref="materials" :isShowAdd="false" :isDefaultShowRow="false" :rowHeader="materialsHeader" :isShowDetails="transform.isShowDetails" />
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails" @click="onSubmit">保存</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <popout-material-depot v-if="dialogVisible" :dialogVisible="dialogVisible" @close="getMaterialData" />
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import { upload, qqtRelateTable } from '../../../../../components/qqt-subassembly'
import { getUserDepartById } from '../../../../../api/system/depart/depart'
import { addSupplierParticulars } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierParticulars'
import { getDepIdByUserId } from '../../../../../api/system/workflow'
import { CITYJSON } from '../../../../../enum/CTIYS'
import { mapActions, mapState } from 'vuex'

import popoutMaterialDepot from '../../../basicInformation/materialDepot/components/popoutMaterialDepot'
import util from '@/libs/util.js'
let than = this
export default {

    data () {
        return {
            jsonData: {},
            remote: {},
            values: {
                materialAddlines: [],
                operator: util.cookies.get ('username'),
                transactionDepartmentName: '',
            },
            depart: [],
            userList: [],
            dialogVisible: false,
            upLoadFileDefaultList: [],
            transform: {
                isShowDetails: false
            },
            materialsHeader: [
                {
                    prop: 'code',
                    label: '材料编码',
                    isShow: true,
                    type: 'text',
                    isShowDetails: true
                },
                {
                    prop: 'name',
                    label: '名称',
                    isShow: true,
                    type: 'text',
                    isShowDetails: true
                },
                {
                    prop: 'brandName',
                    label: '品牌',
                    isShow: true,
                    type: 'text',
                    isShowDetails: true
                },
                {
                    prop: 'specificationName',
                    label: '规格型号',
                    isShow: true,
                    type: 'text',
                    isShowDetails: true
                },
                {
                    prop: 'unit',
                    label: '计量单位',
                    isShow: true,
                    type: 'text',
                    isShowDetails: true
                },
                {
                    prop: 'money1',
                    label: '单价',
                    isShow: true,
                    type: 'money'
                },
                {
                    prop: 'consumablesName',
                    label: '是否消耗品',
                    isShow: true,
                    type: 'text',
                    isShowDetails: true
                },
                {
                    prop: 'remark',
                    label: '备注',
                    isShow: true,
                    type: 'text'
                }
            ]
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.SUPPLIERPARTICULARS}).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        upLoadFileCallBack (item) {
            this.values.fileList = item
        },

        selectGenerateChange (field, val, model) {
            let item = ''
            switch (field) {
                case 'transactionDepartment':
                    item = this.depart.find (f => f.id === val)
                    if (item) this.values.transactionDepartmentName = item.name
                    this.getDepIdByUserIdList (val)
                    break
            }
        },

        getDepIdByUserIdList (id) {
            getUserDepartById({'userId': id}).then(res => {
                if (res && res.length > 0) this.depart = res, this.neatenData (res)
            })
        },

        closePageTag () {
            let tagName = this.$route.path
            let path = `/materialEquipmentManagement/supplierManagement/supplierParticulars`
            let name = 'supplierParticulars'
            let params = { relevancyId: this.$route.params.relevancyId }
            this.close ({ tagName, path, name, params })
        },

        onSubmit () {
            let boolean = this.$refs.materials.verify ()
            this.$refs.generateForm.getData ().then(item => {
                if (item && boolean){
                    item['materialAddlines'] = boolean
                    item['supplierId'] = this.$route.params.data.id
                    item['supplierName'] = this.$route.params.data.nameSupplier
                    addSupplierParticulars (item).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.closePageTag ()
                        }
                    })
                }
            })
        },

        neatenData () {
            this.remote = {
                getTransactionDepartment (resolve) {
                    resolve (than.depart)
                }
            }
        },

        getMaterialData (item) {
            this.dialogVisible = false
            if (item) {
                item.forEach (res => {
                    res['transactionDepartment'] = this.values.transactionDepartmentName
                    res['operator'] = this.values.agentName
                    res['supplierId'] = this.$route.params.data.id
                    res['consumablesName'] = res.consumables == '1' ? '是' : '否'
                    res['datetime1'] = new Date ()
                    res['materialId'] = res.id
                })
                this.values['materialAddlines'].push (...item)
            }
        }
    },

    created () {
        this.getFormByJson ()
        this.transform = this.$route.params.transform
        this.getDepIdByUserIdList (util.cookies.get ('uuid'))
    },

    mounted () {
        than = this
    },

    components: {
        'up-load': upload,
        'qqt-relate-table': qqtRelateTable,
        'popout-material-depot': popoutMaterialDepot
    }
}
</script>

<style lang='scss' scoped>
.add-supplier-particulars {
    .drawer-btn{
        padding-top: 10px;
        text-align: center;
    }
    .add-supplier-particulars-content___upload {
        padding: 0 30px;
        .add-supplier-particulars-content___label {
            font-size: 14px;
            float: left;
            color: $input-disable;
            margin-left: 18px
        }
        .add-supplier-particulars-content___right {
            margin-left: 90px
        }
    }
    .add-supplier-particulars-button {
        float: right;
        position: relative;
        top: -38px;
    }
    .el-divider--horizontal {
        width: 92% !important;
    }
}
</style>
