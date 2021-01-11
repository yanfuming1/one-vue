<template>
    <div class="bottomInformation">
        <div v-if="isShowAccessory">
            <el-divider content-position="left">
                <div class="generate-from-divider___line"></div>
                附件
            </el-divider>
            <div :style="{'margin-left': left}">
                <up-load
                    id="male"
                    @upLoadFileCallBack="upLoadFileCallBack"
                    @upLoadFileSingleton="upLoadFileSingleton"
                    @remove="removeFile"
                    :isSingleton="isSingleton"
                    :isShowUpload="!transform.isShowDetails"
                    :propList="upLoadFileList" ref="upLoad" />
                    <el-button v-if="isShowCreateFile" :disabled="transform.isShowDetails" type="text" @click="$emit ('createFile')">点击创建文件</el-button>
            </div>
        </div>
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :value="information"
            :transform="transform"
            ref="generateForm"
            @on-change="selectGenerateChange"
        >
        </fm-generate-form>
    </div>
</template>

<script>
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
    import { upload } from '@/components/qqt-subassembly'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { CITYJSON } from '@/enum/CTIYS'

    import util from '@/libs/util.js'
    let than = this
    export default {

        props: {
            
            transform: {
                type: Object,
                default: () => {}       
            },
            
            upLoadFileDefaultList: {
                type: Array,
                default: () => []
            },

            values: {
                type: Object,
                default: () => ({})
            },

            left: {
                type: String,
                default: () => '45px'
            },

            isShowAccessory: {
                type: Boolean,
                default: () => true
            },

            isShowCreateFile: {
                type: Boolean,
                default: () => false
            },

            fieldTitle: {
                type: String,
                default: () => '创建'
            },

            isSingleton: {
                type: Boolean,
                default: () => false
            }
        },

        data () {
            return {
                num: 0,
                remote: {},
                jsonData: {},
                information: {
                    createBy: util.cookies.get ('uuid'),
                    createName: '',
                    createTime: '',
                    departmentName: '',
                    departmentId: '',
                    companyName: '',
                    companyId: ''
                },
                processModuleId: PROPRIETARYPROJECT.BOTTOMINFORMATION,
                departmentList: [],
                upLoadFileList: [],
                companyList: [],
            }
        },

        methods: {

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        element.list.forEach (item => {
                            if (item.columns && item.columns.length > 0) {
                                item.columns[0]['list'][0]['name'] = this.fieldTitle + '人'
                                item.columns[3]['list'][0]['name'] = this.fieldTitle + '时间'
                            }
                        })
                        this.jsonData = element
                    }
                })
            },

            getCompanyByUserIdList (id, boolean) {
                getCompanyByUserId ({'userId': id}).then (res => {
                    if (res && res.length > 0) this.companyList = res, this.neatenData ()
                    if (res.length == 1) this.information['companyId'] = res[0].id, this.information['companyName'] = res[0].name
                    this.getDepIdByCompanyIdList (boolean ? this.information.companyId : res.length == 1 ? res[0].id : false, this.values.createBy ? id : util.cookies.get ('uuid'), boolean)
                }).finally(res => {
                    if (!boolean) this.getFormByJson ()
                })
            },

            getDepIdByCompanyIdList (id, userId, boolean) {
                if (this.transform.isShowDetails && (!id || this.departmentList.length > 0)) return
                getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                    if (res && res.length > 0) this.departmentList = res, this.neatenData ()
                    if (res.length == 1) this.information['departmentId'] = res[0].id, this.information['departmentName'] = res[0].name
                }).finally(res => {
                    if (boolean) this.getFormByJson ()
                })
            },

            selectGenerateChange (field, val, models) {
                let item = '', str = ''
                switch (field) {
                    case 'departmentId':
                        this.information.departmentId = val
                        item = this.departmentList.find (f => f.id === val)
                        if (item) this.information['departmentName'] = item.name
                        break
                    case 'companyId':
                        this.information.departmentId = ''
                        this.information.companyId = val
                        item = this.companyList.find (f => f.id === val)
                        if (item) this.information['companyName'] = item.name
                        this.getDepIdByCompanyIdList (val, this.information.createBy, false)
                        break
                }
            },

            neatenData () {
                this.remote = {
                    getDepartment (resolve) {
                        resolve (than.departmentList)
                    },
                    getCompany (resolve) {
                        resolve (than.companyList)
                    }
                }
            },

            upLoadFileCallBack (item) {
                if (!this.isSingleton) this.information['fileList'] = item
            },

            upLoadFileSingleton (item) {
                this.upLoadFileList = [item]
                this.information['fileList'] = [item.response]
            },

            upLoadFileCreate (item) {
                if (this.information['fileList'] && this.information['fileList'].length > 0) {
                    this.information['fileList'].push (item)
                } else {
                    this.information['fileList'] = [item]
                }
                
            },

            removeFile (index) {
                this.$emit ('removeFile', index)
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    return Object.assign ({}, this.information, data)
                } else {
                    return false
                }
            },

            initLoadData () {
                if (this.values.createBy) {
                    const { createBy, createName, createTime, departmentId, departmentName, companyId, companyName } = this.values
                    let data = { createBy, createName, createTime, departmentId, departmentName, companyId, companyName }
                    Object.assign (this.information, data)
                    if (this.num <= 1) this.getCompanyByUserIdList (data.createBy, true)
                }else {
                    if (this.num == 0) this.getCompanyByUserIdList (util.cookies.get ('uuid'), false)
                    this.$set (this.information, 'createName', util.cookies.get ('username'))
                }
                ++this.num
            }
        },

        created () {
            this.initLoadData ()
        },
        
        watch: {
            values: {
                deep: true,
                handler (val) {
                    this.initLoadData ()
                }
            },
            upLoadFileDefaultList (val) {
                this.upLoadFileList = val
            }
        },

        components: {
            'up-load': upload
        },

        mounted () {
            than = this
        }
    }
</script>
<style lang="scss" >
    .bottomInformation {
        .el-button--text {
            color: $color-danger !important;
        }
    }
</style>