<template>
    <d2-container class="add-entrepot">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="values" ref="generateForm" @btn-click="isShowAdminDialog = true" ></fm-generate-form>
            <entrepot-sinceBy
                :entrepotSinceBy="values"
                :entrepotOption="entrepotOption"
                :structureOptions="structureOptions"
                :unitMeasurementOptions="unitMeasurementOptions"
                :rentStandardOptions="rentStandardOptions"
                ref="entrepot"
                :isShowElement="!transform.isShowDetails"
            />
            <bottomInformation :values="values" fieldTitle="设置" timeTitle="设置" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button type="primary" size="mini" v-if="!transform.isShowDetails" @click="onSubmit">保存</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <user-modules :showDialog="isShowAdminDialog" ref="userModules" title="选择人员" :isShowRole="false" @clearUserPage="getAdmin" @closeFun="isShowAdminDialog = false"/>
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import { addEntrepot, editEntrepot, getEntrepotById } from '../../../../../api/materialEquipmentManagement/basicInformation/entrepot'
import { queryDicByIds } from '../../../../../api/system/dic/dic'
import { upload } from '../../../../../components/qqt-subassembly'
import { ENTREPOT } from '../../../../../enum/DICTIONARY'
import { CITYJSON } from '../../../../../enum/CTIYS'
import { mapActions } from 'vuex'

import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import entrepotSinceBy from './entrepotSinceBy'
import util from '@/libs/util.js'
let than = this
export default {
    
    data () {
        return {
            remote: {},
            jsonData: {},
            entrepotOption: [],
            structureOptions: [],
            unitMeasurementOptions: [],
            upLoadFileDefaultList: [],
            rentStandardOptions: [],
            values: {
                fileList: [],
                projectType: '',
                affiliation: '1',
                projectId: '',
                sectionName: '',
                adminName: ''
            },
            transform: {
                isShowDetails: false
            },
            entrepotSinceBy: {},
            isShowAdminDialog: false
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            formGetJson ({'code': MATERIALEQUIPMENTMANAGEMENT.ADDENTREPOT}).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        upLoadFileCallBack (item) {
            this.values.fileList = item
        },

        closePageTag () {
            let params = {}
            let tagName = this.$route.path
            let path = `/materialEquipmentManagement/basicInformation/entrepot`
            let name = 'entrepot'
            if (this.entrepotSinceBy) params = { treeId: this.entrepotSinceBy.parentList }
            this.close ({ tagName, path, name, params })
        },

        onSubmit () {
            this.$refs.generateForm.getData ().then(item => {
                let url = '', element = {}
                this.entrepotSinceBy = this.$refs.entrepot.verify ()
                element = this.$refs.bottomInformation.getData ()
                if (item && this.entrepotSinceBy && element) {
                    Object.assign (this.values, this.entrepotSinceBy, item, element)
                    this.values['groupId'] = this.entrepotSinceBy.parentList[this.entrepotSinceBy.parentList.length - 1]
                    this.values.id == null ? url = addEntrepot : url = editEntrepot
                    url (this.values).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('操作成功')
                            this.closePageTag ()
                        }
                    })
                }
            })
        },

        getEntrepotData (id) {
            getEntrepotById ({id: id}).then (res => {
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
        },

        getQueryDicByIdList () {
            let list = [ ENTREPOT.STRUCTURE, ENTREPOT.UNITMEASUREMENT, ENTREPOT.RENTSTANDARD]
            queryDicByIds (list).then (item => {
                if (!item) return
                this.unitMeasurementOptions = item[ENTREPOT.UNITMEASUREMENT]
                this.rentStandardOptions = item[ENTREPOT.RENTSTANDARD]
                this.structureOptions = item[ENTREPOT.STRUCTURE]
            })
        },

        getAdmin (list) {
            let id = '',  str = '', userList = []
            if (list.length == 0) {
                this.$message.warning ('至少选择一条数据')
                return
            }
            userList = this.$refs.userModules.getSelectUser ()
            this.isShowAdminDialog = false
            userList.forEach (data => {
                data.item.forEach (res => {
                    if (res.isCheck) id += res.id + ',', str += res.name + ','
                })
            })
            this.values['adminId'] = id.substring (0, id.length - 1)
            this.values['adminName'] = str.substring (0, str.length - 1)
        }
    },

    created () {
        this.getFormByJson ()
        this.getQueryDicByIdList ()
        this.transform = this.$route.params.transform
        this.entrepotOption = this.$route.params.data
        this.values['parentList'] = this.$route.params.superiorId
        if (this.$route.params && this.$route.params.relevancyId) {
            this.getEntrepotData (this.$route.params.relevancyId)
        }
    },

    mounted () {
        than = this
    },

    components: {
        'user-modules': userModules,
        'entrepot-sinceBy': entrepotSinceBy,
        'bottomInformation': bottomInformation
    }
}
</script>

<style lang='scss'>
.add-entrepot {
    .el-input__inner {
        border-radius: 0px !important;
    }
    .drawer-btn{
        padding-top: 10px;
        text-align: center;
    }
    .add-entrepot-content___upload {
        padding: 0 30px;
        .add-entrepot-content___label {
            font-size: 14px;
            float: left;
            margin-left: 16px;
            color: $input-disable
        }
        .add-entrepot-content___right {
            margin-left: 90px
        }
    }
}
</style>
