<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" :title="name" width="50%" :before-close="handleClose">
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :value="values"
            :transform="transform"
            ref="generateForm"
            @on-change="selectGenerateChange"
        />
        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" v-if="!transform.isShowDetails" @click="saveSealRegistration">保 存</el-button>
            <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </el-dialog>
</template>

<script>
    import { formGetJson } from '../../../../../api/system/fromManagement/index'
    import { GetDepartTreeNew } from '../../../../../api/system/depart/depart-tree'
    import { getSealRegistrationById, editSealRegistration, addSealRegistration } from '../../../../../api/administrativeManagement/managementSignet/sealRegistration'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../../../enum/FORMCODE'
    import { GetStaffByGroupId } from '../../../../../api/system/staff/staff'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapState } from "vuex"

    import printTemplateByHtml from '../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    let than = this
    export default {
        
        props: {
            archiveId: String,
            managementSignetTreeId: String,
            dialogVisible: {
                type: Boolean,
                default: () => false
            },
            name: {
                type: String,
                default: '印章登记'
            },
            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: false
                    }
                }
            },
            classify: {
                type: Array,
                default: () => []
            }
        },

        data () {
            return {
                isEdit: true,
                jsonData: {},
                num: 0,
                remote: {},
                departList: [],
                departmentAllUser: [],
                keepdepartmentAllUser: [],
                upLoadFileDefaultList: [],
                code: BASICSCODE.ADMIN_SEALREG,
                values: {
                    sealtype: this.managementSignetTreeId,
                }
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.SEALREGISTRATION}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            getSealRegistration (id) {
                getSealRegistrationById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        if (res.keepdepartmentId) {
                            res.keepdepartmentList = JSON.parse (res.keepdepartmentId)
                            this.getUserByDepartmentId (res.keepdepartmentList[res.keepdepartmentList.length - 1], 'keepdepartmentList', true)
                        }
                        this.updataFileList (res.fileList)
                    }
                })
            },

            saveSealRegistration () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData ().then (data => {
                    if (data && item) {
                        Object.assign (this.values, data, item)
                        if (this.values.id == null) {
                            addSealRegistration (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('保存成功')
                                    this.$emit ('close', true, this.values.sealtype)
                                }
                            })
                        } else {
                            editSealRegistration (this.values).then (res => {
                                if (res.code === 200) {
                                    this.$message.success ('修改成功')
                                    this.$emit ('close', true, this.values.sealtype)
                                }
                            })
                        }
                    }
                })
            },

            selectGenerateChange (field, val, models) {
                let item = '', num = 0
                switch (field) {
                    case 'keepdepartmentList':
                        models.keeppersonId = this.values['keeppersonId'] = ''
                        switch (field) {
                            case 'keepdepartmentList':
                                if ((val instanceof Array) == false) return
                                this.values['keepdepartment'] = ''
                                this.values.keepdepartmentList = val
                                this.values['keepdepartmentId'] = JSON.stringify (val)
                                this.neatenKeepdepartment (this.departList, val, num)
                                this.values['keepdepartment'] = this.values['keepdepartment'].substring (0, this.values['keepdepartment'].length - 1)
                                break
                        }
                        this.getUserByDepartmentId (val[val.length - 1], field)
                        break
                    case 'keeppersonId':
                        switch (field) {
                            case 'keeppersonId':
                                item = this.keepdepartmentAllUser.find ( f => f.id === val )
                                if (item) {
                                    this.values['keepperson'] = item.name
                                    this.values['keeppersonId'] = val
                                }
                                break;
                        }
                        break
                    default:
                        this.values[field] = val
                        break
                }
            },

            getUserByDepartmentId (id, field, boolean = false) {
                GetStaffByGroupId ({
                    'depId': id,
                    'pageNo': '1',
                    'pageSize': '1000'
                }).then (res => {
                    switch (field) {
                        case 'keepdepartmentList':
                            this.keepdepartmentAllUser = res.records || []
                            break
                    }
                    this.neatenData (boolean)
                })
            },

            getDepartTreeList () {
                this.departList = []
                GetDepartTreeNew ().then(res => {
                    if (res) this.departList.push (res), this.neatenData ()
                })
            },

            neatenKeepdepartment (list, val, num) {
                let item = list.find ( f => f.id == val[num] )
                if (item) {
                    this.values['keepdepartment'] += item.name + '/'
                    this.neatenKeepdepartment (item.child || [], val, ++num)
                }
            },

            updataFileList (list) {
                if (list.length > 0) {
                    list.forEach(item => {
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
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.archiveId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res || [])
                })
            },

            neatenData (boolean = false) {
                this.remote = {
                    getSealtype (resolve) {
                        resolve (than.classify)
                    },

                    getDepartment (resolve) {
                        resolve (than.departList || [])
                    },

                    getKeepdepartmentStaff (resolve) {
                        resolve (than.keepdepartmentAllUser || [])
                    }
                }

                if (boolean) this.getFormByJson ()
            }
        },

        created () {
            this.getDepartTreeList ()
            if (this.archiveId) {
                this.isEdit = false
                this.getSealRegistration (this.archiveId)
            } else {
                this.getFormByJson ()
            }
        },

        mounted () {
            than = this
        },

        components: {
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation
        }
    }
</script>
