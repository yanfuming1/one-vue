<template>
    <el-dialog title="质量验收" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :value="values"
            :transform="transform"
            ref="generateForm"
            @on-change="selectGenerateChange">
        </fm-generate-form>
        <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
        <span slot="footer" class="dialog-footer">
            <el-button v-if="!transform.isShowDetails" type="primary" @click="savaQualityCheckAccept">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { queryDicById } from '@/api/system/dic/dic'
import { PROPRIETARYPROJECT } from "@/enum/FORMCODE.js"
import { formGetJson } from '@/api/system/fromManagement/index'
import { staffStaffDictionary } from "@/api/system/staff/staff"
import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
import { addQualityCheckAccept, editQualityCheckAccept, getQualityCheckAcceptById, getQualityCheckAcceptPageList } from "@/api/selfProject/qualityManagement/qualityCheckAccept"
import { getQualityStandardList} from '@/api/selfProject/qualityManagement/qualityStandard'
import bottomInformation from '../../../businessBidding/components/bottomInformation'
import util from '@/libs/util'
export default {
    props: {

        dialogVisible: {
            type: Boolean,
            default: false
        },

        taskData: {
            type: Object,
            default: () => {
                return {}
            }
        },

        transform: {
            type: Object,
            default: () => {
                return { isShowDetails: false }
            }
        },
    },
    data () {
        return {
            processModuleId: PROPRIETARYPROJECT.QUALITYCHECKACCEPT,
            remote: {},
            values: {},
            jsonData: {},
            taskTree: [],
            isShowElement: true,
            taskPrincipalList: [],
            standardRequireList: [],
            acceptMethodList: [],
            defaultParams: {
                label: 'name',
                value: 'id',
                children: 'children',
                checkStrictly: true
            },
        }
    },
    methods: {

        handleClose () {
            this.$emit ('close')
        },
        
        selectGenerateChange (field, value, model) {
            let item = {}
            switch (field) {
                case 'qualityPrincipalId':
                    this.values['qualityPrincipalId'] = value
                    item = this.taskPrincipalList.find (f => f.id == value)
                    if (item) this.values['qualityPrincipal'] = item.name
                    break
                case 'acceptMethodId':
                    this.values['acceptMethodId'] = value
                    item = this.acceptMethodList.find (f => f.id == value)
                    if (item) this.values['acceptMethod'] = item.name
                    break
                case 'codeRequirement':
                    this.values['codeRequirementId'] = value
                    item = this.standardRequireList.find (f => f.id == value)
                    if (item) this.values['codeRequirement'] = item.standardName
                    break
                default:
                    this.values[field] = value
                    break
            }
        },
        
        savaQualityCheckAccept () {
            let url = '', element = {}
            element = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData ().then (data => {
                if (data && element) {
                    Object.assign (this.values, data, element)
                    url = this.values.id ? editQualityCheckAccept : addQualityCheckAccept
                    url (this.values).then (res => {
                        if (res) this.$message.success(res.message), this.$emit('close', true)
                    })
                }
            })
        },

        getQualityCheckAccept (id) {
            getQualityCheckAcceptById ({'id': id}).then (res => {
                if (res) this.values = res
            })
        },

        getQueryDicByIdList () {
            staffStaffDictionary ().then (res => {
                if (res && res.length > 0) this.taskPrincipalList = res, this.formatRemote ()
            })
            queryDicById ({'id': PROPRIETARYPROJECTDICTIONARY.ACCEPTANCEMETHOD}).then (item => {
                if (!item) return
                this.acceptMethodList = item
                this.formatRemote ()
            })
        },

        getQualityCheckAcceptList (projectCode) {
            getQualityCheckAcceptPageList ({ projectCode }).then (res => {
                if (res) res.push ({id: '0', name: '无'}), this.taskTree = res,  this.formatRemote ()
            })
        },

        getQualityStandard (projectCode) {
            getQualityStandardList ({ projectCod: projectCode, procState: '10' }).then (res => {
                if (res) this.standardRequireList = res, this.formatRemote ()
            })
        },

        formatRemote () {
            let than = this
            this.remote = {
                getTaskPrincipalList (resolve) { resolve (than.taskPrincipalList) },
                getStandardRequire (resolve) { resolve (than.standardRequireList) },
                getAcceptMethod (resolve) { resolve (than.acceptMethodList) },
                getParentList (resolve) { resolve (than.taskTree) }
            }
        },
        
        getFormJson () {
            formGetJson ({ 'code': this.processModuleId }).then(res => {
                if (res) this.jsonData = JSON.parse(res)
            })
        },

        updataRouter () {
            Object.assign (this.values, this.taskData)
            if (this.taskData) {
                this.taskData.id ? this.getQualityCheckAccept (this.taskData.id) : ''
                this.taskData.projectCode ? (this.getQualityCheckAcceptList (this.taskData.projectCode), this.getQualityStandard (this.taskData.projectCode)) : ''
            }
        }
    },

    created () {
        this.getFormJson ()
        this.updataRouter ()
        this.getQueryDicByIdList ()
    },

    components: {
        'bottomInformation': bottomInformation,
    }
}
</script>