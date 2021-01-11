<template>
    <d2-container class="add-material-depot">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="values" ref="generateForm" @on-change="selectGenerateChange">
                <template slot="parentId">
                    <qqt-cascader :value="values.parentList" :options="materialOptions" :isShowElement="!transform.isShowDetails" :defaultParams="defaultCandidates" @cascaded="values.parentList = $event" />
                </template>
            </fm-generate-form>
            <bottomInformation :values="values" fieldTitle="录入" timeTitle="录入" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails" @click="onSubmit">保存</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { queryDicByIds } from '../../../../../api/system/dic/dic'
import { addMaterialDepot, editMaterialDepot, getMaterialDepotById } from '../../../../../api/materialEquipmentManagement/basicInformation/materialDepot'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import { MATERIALDEPOT } from '../../../../../enum/DICTIONARY'
import { upload, qqtCascader } from '../../../../../components/qqt-subassembly'
import { mapActions } from 'vuex'

import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import util from '@/libs/util.js'
let than = this
export default {

    components: {
        'qqt-cascader': qqtCascader,
        'bottomInformation': bottomInformation
    },

    data () {
        return {
            jsonData: {},
            remote: {},
            brand: [],
            department: [],
            specification: [],
            upLoadFileDefaultList: [],
            transform: {
                isShowDetails: false
            },
            values: {
                createName: util.cookies.get ('username'),
                parentList: [],
                departmentId: ''
            },
            defaultCandidates: {
                value: 'id',
                label: 'name',
                children: 'children',
                checkStrictly: true
            },
            materialOptions: []
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDMATERIALDEPOT}).then(res => {
                if (res) {
                    let element = JSON.parse(res)
                    element.list.forEach (item => {
                        if (item.model == 'rules') {
                            item.columns.forEach (data => {
                                switch (data.list[0].model) {
                                    case 'brandName':
                                    case 'specificationName':
                                    case 'technicalParameters':
                                    case 'unit':
                                        data.list[0].rules[1].message = `${data.list[0].name}必须填写。如果没有，请填写 "无"`
                                        break
                                }
                            })
                        }
                    })
                    this.jsonData = element
                }
            })
        },

        upLoadFileCallBack (item) {
            this.values['fileList'] = item
        },

        selectGenerateChange (field, val) {
            let item = ''
            switch (field) {
                case 'brandId':
                    item = this.brand.find (f => f.id === val)
                    if (item) this.values['brandName'] = item.name
                    break;
                case 'specificationId':
                    item = this.specification.find (f => f.id === val)
                    if (item) this.values['specificationName'] = item.name
                    break;
                case 'departmentId':
                    item = this.department.find (f => f.id === val)
                    if (item) this.values['departmentName'] = item.name
                    break;
            }
        },

        closePageTag () {
            let tagName = this.$route.path
            let path = `/materialEquipmentManagement/basicInformation/materialDepot`
            let name = 'materialDepot'
            let params = { treeId: this.values.parentList }
            this.close ({ tagName, path, name, params })
        },

        onSubmit () {
            let element = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then(item => {
                let url = ''
                if (!item || !element) return
                Object.assign (this.values, item, element)
                this.values['groupId'] = this.values.parentList[this.values.parentList.length - 1]
                this.values.id == null ? url = addMaterialDepot : url = editMaterialDepot
                url (this.values).then(res => {
                    if (res.code === 200) {
                        this.$message.success ('操作成功')
                        this.closePageTag ()
                    }
                })
            })
        },

        getQueryDicByIdList () {
            let list = [ MATERIALDEPOT.BRAND, MATERIALDEPOT.SPECIFICATION ]
            queryDicByIds (list).then (item => {
                if (!item) return
                this.brand = item[MATERIALDEPOT.BRAND]
                this.specification = item[MATERIALDEPOT.SPECIFICATION]
                this.neatenData ()
            })
        },

        neatenData () {
            this.remote = {
                getBrandId (resolve) {
                    resolve (than.brand)
                },
                getSpecificationId (resolve) {
                    resolve (than.specification)
                },
                getConsumables (resolve) {
                    resolve ([
                        {
                            value: '0',
                            label: '否'
                        },
                        {
                            value: '1',
                            label: '是'
                        }
                    ])
                },
                getDepartmentId (resolve) {
                    resolve (than.department)
                }
            }
        },

        getMaterialDepotData (id) {
            getMaterialDepotById ({id: id}).then (res => {
                if (res) {
                    Object.assign (this.values, res)
                    this.values = JSON.parse (JSON.stringify (this.values))
                    if (this.values.fileList && this.values.fileList.length > 0) {
                        this.values.fileList.forEach(item => {
                            let m = {
                                status : 'finished',
                                response : {
                                    url : item.url,
                                    size: item.size,
                                    name: item.name
                                }
                            }
                            this.upLoadFileDefaultList.push(m)
                        })
                    }
                }
                
            })
        }
    },

    created () {
        this.getFormByJson ()
        this.getQueryDicByIdList ()
        this.transform = this.$route.params.transform
        this.materialOptions = this.$route.params.data
        this.values['parentList'] = this.$route.params.superiorId
        if (this.$route.params && this.$route.params.relevancyId) {
            this.getMaterialDepotData (this.$route.params.relevancyId)
        }
    },

    mounted () {
        than = this
    }
}
</script>

<style lang='scss' scoped>
.add-material-depot {
    .drawer-btn{
        padding-top: 10px;
        text-align: center;
    }
}
</style>
