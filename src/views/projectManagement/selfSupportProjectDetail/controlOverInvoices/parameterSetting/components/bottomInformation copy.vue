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
                    <div v-if="!transform.isShowDetails">
                        <el-button v-if="isShowCreateFile" :disabled="transform.isShowDetails" type="text" @click="$emit ('createFile')">点击创建文件</el-button>
                    </div>
            </div>
        </div>
        <fm-generate-form 
            :data="jsonData"
            :remote="remote"
            :value="information"
            :transform="transform"
            :remoteOption="remoteOption"
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
                default: () => '登记'
            },

            timeTitle: {
                type: String,
                default: () => '登记'
            },

            isSingleton: {
                type: Boolean,
                default: () => false
            },

            isGrid: {
                type: Boolean,
                default: () => false
            }
        },

        data () {
            return {
                num: 0,
                remote: {},
                jsonData: {},
                newValue:{},
                information: {
                    createBy: '',
                    createName: '',
                    createTime: '',
                    departmentName: '',
                    departmentId: '',
                    companyName: '',
                    companyId: ''
                },
                remoteOption: {
                    departmentList: [],
                    companyList: []
                },
                processModuleId: PROPRIETARYPROJECT.BOTTOMINFORMATION,
                upLoadFileList: [],
                loadFormByJson: true
            }
        },

        methods: {

            getFormByJson () {
                this.processModuleId = this.isGrid ? PROPRIETARYPROJECT.BOTTOMINFORMATIONNOTGRID : PROPRIETARYPROJECT.BOTTOMINFORMATION
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) {
                        let element = JSON.parse(res)
                        if (!this.isGrid) {
                            element.list[1].columns[0]['list'][0]['name'] = this.fieldTitle + '人'
                            element.list[1].columns[3]['list'][0]['name'] = this.timeTitle + '时间'

                            if (this.transform.isShowDetails) {
                                element.list[1].columns[1]['list'][0]['model'] = 'companyName'
                                element.list[1].columns[2]['list'][0]['model'] = 'departmentName'
                                element.list[1].columns[1]['list'][0]['type'] = element.list[1].columns[2]['list'][0]['type'] = 'input'
                            } else {
                                element.list[1].columns[1]['list'][0]['model'] = 'companyId'
                                element.list[1].columns[2]['list'][0]['model'] = 'departmentId'
                                element.list[1].columns[1]['list'][0]['type'] = element.list[1].columns[2]['list'][0]['type'] = 'select'
                            }
                        }
                        this.jsonData = element
                    }
                })
            },

            getCompanyByUserIdList (id, boolean) {
                getCompanyByUserId ({'userId': id}).then (res => {
                    if (res && res.length > 0) {
                        this.remoteOption.companyList = res
                        if (boolean) {
                            console.log(this.information);
                            let index = this.remoteOption.companyList.findIndex (f => f.id == this.information['companyId'])
                            if (index == -1) this.information['companyId'] = this.information['companyName'] = this.information['departmentId'] = this.information['departmentName'] = ''
                        } else {
                            if (res.length == 1) {
                                this.information['companyId'] = res[0]['id'], this.information['companyName'] = res[0]['name']
                            }
                        }
                    }
                    this.getDepIdByCompanyIdList (boolean ? this.information['companyId'] : res.length == 1 ? res[0].id : false, this.newValue.createBy ? id : util.cookies.get ('uuid'), boolean)
                }).finally(res => {
                    if (!boolean) this.getFormByJson ()
                })
            },

            getDepIdByCompanyIdList (id, userId, boolean) {
                if (!id) return
                getOrganizationByCompanyId ({'id': id, 'userId': userId}).then(res => {
                    if (res && res.length > 0) {
                        this.remoteOption.departmentList = res
                        if (boolean) {
                            let index = this.remoteOption.departmentList.findIndex (f => f.id == this.information['departmentId'])
                            if (index == -1) this.information['departmentId'] = this.information['departmentName'] = ''
                        }
                        if (res.length == 1 && this.information['departmentId'] == '') {
                            this.information['departmentId'] = res[0]['id'], this.information['departmentName'] = res[0]['name']
                        }
                    }
                }).finally(res => {
                    if (boolean) this.getFormByJson ()
                })
            },

            selectGenerateChange (field, val, models) {
                let item = ''
                switch (field) {
                    case 'departmentId':
                        this.information['departmentId'] = val
                        item = this.remoteOption.departmentList.find (f => f.id === val)
                        if (item) this.information['departmentName'] = item.name
                        break
                    case 'companyId':
                        if (val == this.information['companyId']) return
                        this.remoteOption.departmentList = []
                        this.information['departmentId'] = ''
                        this.information['companyId'] = val
                        item = this.remoteOption.companyList.find (f => f.id === val)
                        if (item) this.information['companyName'] = item.name
                        this.getDepIdByCompanyIdList (val, this.information['createBy'], false)
                        break
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

            getAllUpLoadFile () {
                return this.information['fileList']
            },

            removeFile (index) {
                this.$emit ('removeFile', index)
            },

            getData () {
                let data = this.$refs.generateForm.getDataNotPromise ()
                if (data) {
                    return this.information
                } else {
                    return false
                }
            },

            initLoadData () {
                if (this.num > 2) return
                if (this.newValue.createBy) {
                    const { createBy, createName, createTime, departmentId, departmentName, companyId, companyName } = this.newValue
                    let item = { createBy, createName, createTime, departmentId, departmentName, companyId, companyName }
                    Object.assign (this.information, item)
                    this.num = 2
                    !this.transform.isShowDetails ? this.getCompanyByUserIdList (this.information.createBy, true) : this.loadFormByJson ? this.getFormByJson () : ''
                }else if (!this.transform.isShowDetails) {
                    if (this.num == 0) this.getCompanyByUserIdList (util.cookies.get ('uuid'), false)
                    this.$set (this.information, 'createName', util.cookies.get ('username'))
                    this.$set (this.information, 'createBy', util.cookies.get ('uuid'))
                }
                ++this.num
            }
        },

        created () {
            if (this.upLoadFileList.length == 0 && this.upLoadFileDefaultList.length > 0) {
                this.upLoadFileList = this.upLoadFileDefaultList
            }
            this.initLoadData ()
        },
        
        watch: {
            values: {
                deep: true,
                immediate:true,
                handler (val) {
                    this.newValue = val
                    if (val.createBy) {
                        const { createBy, createName, createTime, departmentId, departmentName, companyId, companyName } = val
                        let item = { createBy, createName, createTime, departmentId, departmentName, companyId, companyName }
                        Object.assign (this.information, item)
                        !this.transform.isShowDetails ? this.getCompanyByUserIdList (this.information.createBy, true) : this.loadFormByJson ? this.getFormByJson () : ''
                    }else {
                        val.departmentId = '';
                        val.departmentName = '';
                        val.companyId = '';
                        val.companyName = '';
                        this.information.departmentId = '';
                        this.information.departmentName = '';
                        this.information.companyId = '';
                        this.information.companyName = '';
                        this.getCompanyByUserIdList (util.cookies.get ('uuid'), false)
                        this.$set (this.information, 'createName', util.cookies.get ('username'))
                        this.$set (this.information, 'createBy', util.cookies.get ('uuid'))
                    }
                    // this.initLoadData ()
                }
            },
            upLoadFileDefaultList: {
                deep: true,
                immediate: true,
                handler (val) {
                    this.upLoadFileList = val
                }
            },
            transform: {
                deep: true,
                handler (val) {
                    if (val.isShowDetails) {
                        this.loadFormByJson = false
                        return
                    }
                    if (this.remoteOption.companyList.length == 0) this.getCompanyByUserIdList (util.cookies.get ('uuid'), true)
                    this.getFormByJson ()
                }
            }
        },

        components: {
            'up-load': upload
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