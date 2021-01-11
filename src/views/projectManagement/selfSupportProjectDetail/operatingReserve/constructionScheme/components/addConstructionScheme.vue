<template>
    <d2-container type="fulls" class="addConstructionScheme">
        <el-card class="box-card closeHeader">
            <div slot="header">
                <el-button type="text" @click="closePageTag"><i class="el-icon-close"></i></el-button>
            </div>
            <div class="qqt-container-full-center___top">
                <qqt-flow-tabs :procInstId="procInstId">
                    <template slot="content">
                        <project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
                        <el-divider content-position="left">
                            <div class="generate-from-divider___line"></div>
                            施工方案审批
                        </el-divider>
                        <div v-for="(value, index) in constructionScheme" :key="index">
                            <div class="addConstructionScheme-line" v-show="index != 0"></div>
                            <fm-generate-form :data="jsonData" :remote="remote" :value="value" :remoteOption="remoteOption[`unitOptions${index}`]" :transform="transform" :ref="'generateForm' + index" @on-object-change="selectGenerateChange ($event, index)" />
                            <el-divider content-position="left">
                                <div class="addConstructionScheme_files">附件</div>
                            </el-divider>
                            <div class="files-upload___right">
                                <el-tag v-if="!transform.isShowDetails" style="margin-bottom:10px;" size="mini" type="warning">每次只能上传一个文件</el-tag>
                                <up-load id="male" @upLoadFileSingleton="upLoadFileCallBack ($event)" @before="beforeIndex(index)" :isSingleton="true" :isShowUpload="!transform.isShowDetails" :propList="value.upLoadFileDefaultList" ref="upLoad" />
                            </div>
                        </div>
                        <el-button v-if="!transform.isShowDetails" type="primary" :disabled="transform.isShowDetails" round @click="addConstructionScheme" size="mini" class="addConstructionScheme_button">添加</el-button>
                        <bottom-information fieldTitle="申请" timeTitle="申请" :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitConstructionSchemeData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveConstructionScheme">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitConstructionSchemeData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataConstructionScheme"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentConstructionScheme" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getConstructionSchemeById, editConstructionScheme,
                addConstructionScheme, submitConstructionScheme, completeConstructionScheme, resetSubmitConstructionScheme } from '@/api/selfProject/operatingReserve/constructionScheme'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, upload, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getCompanyAndPosition } from '@/api/system/depart/depart'
    import { PROPRIETARYPROJECTDICTIONARY } from '@/enum/DICTIONARY'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
    import { queryDicById } from '@/api/system/dic/dic'
    import { getDetails } from '@/api/approval/common'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { mapActions } from 'vuex'

    import printTemplateByHtml from '../../../../../systemManagement/printTemplate/components/printTemplateByHtml'
    import bottomInformation from '../../../businessBidding/components/bottomInformation'
    import projectInformationBasic from '../../components/projectInformationBasic'
    import util from '@/libs/util.js'
    let than = this
    export default {

        data () {
            return {
                title: '',
                index: '',
                stutas: '',
                strName: '',
                secondId: '',
                procInstId: '',
                remote: {},
                values: {},
                jsonData: {},
                nodeData: {
                    operation: '',
                    msg: ''
                },
                transform: {
                    isShowDetails: false
                },
                prossValue: {
                    title: ''
                },
                remoteOption: {
                    unitOptions0: {}
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_CONSTRUCTION_SCHEME_AUDIT,
                processModuleId: PROPRIETARYPROJECT.ADDCONSTRUCTIONSCHEME,
                constructionScheme: [],
                schemeTypeList: [],
                companyList: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getFormByJson () {
                formGetJson ({ 'code': this.processModuleId }).then(res => {
                    if (res) this.jsonData = JSON.parse(res)
                })
            },

            getConstructionScheme (id) {
                getConstructionSchemeById ({'secondId': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.prossValue.title = `施工方案:【 ${this.strName} 】`
                        this.fileDefaultNeaten (this.values)
                    }
                })
            },

            saveConstructionScheme () {
                let url = '', element = {}, require = true
                element = this.$refs.bottomInformation.getData ()
                require = this.neateanConstructionScheme ()
                if (element && require) {
                    Object.assign (this.values, element)
                    this.values['schemeAudit'] = this.constructionScheme
                    this.values.secondId == null ? url = addConstructionScheme : url = editConstructionScheme
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            submitConstructionSchemeData () {
                let element = {}, require = true
                element = this.$refs.bottomInformation.getData ()
                require = this.neateanConstructionScheme ()
                if (element && require) {
                    Object.assign (this.values, element)
                    this.values['schemeAudit'] = this.constructionScheme
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `施工方案:【 ${this.strName} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            },

            updataConstructionScheme (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                this.values.schemeAudit.forEach (res => { delete res['upLoadFileDefaultList']})
                boolean ? url = resetSubmitConstructionScheme : url = submitConstructionScheme
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentConstructionScheme (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    item['relevancyId'] = this.secondId
                    this.values['completeTask'] = item
                    completeConstructionScheme (item).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getQueryDicByIdList () {
                queryDicById ({'id': PROPRIETARYPROJECTDICTIONARY.SCHEMETYPEDIC}).then (item => {
                    if (item == null || item.length == 0) return
                    this.schemeTypeList = item
                    this.neateanRemote ()
                })
            },

            getCompanyByUserIdList (id, boolean, index = -1) {
                getCompanyAndPosition ({'userId': id}).then (res => {
                    if (res && res.length > 0) {
                        boolean ? this.companyList = res : this.neateanOption (res, index)
                        if (this.secondId == '' && boolean) this.addConstructionScheme ()
                    }
                })
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            selectGenerateChange (data, index) {
                console.log(data);
                let item = ''
                switch (data.field) {
                    case 'schemeTypeDicId':
                        item = this.schemeTypeList.find (f => f.id === data.value)
                        if (item) this.constructionScheme[index]['schemeTypeDic'] = item.name
                        break
                    case 'unitId':
                        let selectData = this.remoteOption[`unitOptions${index}`]['unitOptions']
                        let findData = selectData.find (f => f.id === data.value)
                        if (findData) this.constructionScheme[index]['unitName'] = findData.name
                        break
                }
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/operatingReserve/constructionScheme`
                this.close ({ tagName, path })
            },
            
            beforeIndex (index) {
                this.index = index
            },
            
            upLoadFileCallBack (item) {
                let strList = item.response.name.split ('.')
                this.constructionScheme[this.index]['size'] = (item.response.size / 1024 / 1024).toFixed (2)
                this.constructionScheme[this.index]['format'] = strList[strList.length - 1]
                this.constructionScheme[this.index]['fileList'] = [item.response]
                this.constructionScheme[this.index]['upLoadFileDefaultList'] = [item]
                this.constructionScheme = JSON.parse (JSON.stringify (this.constructionScheme))
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
            },

            addConstructionScheme () {
                let data = { uploadId: util.cookies.get ('uuid'), uploadName: util.cookies.get ('username'), fileList: [], upLoadFileDefaultList: [], format: '', size: '', duty: this.companyList[0]['address'] }
                this.$set (this.remoteOption, `unitOptions${this.constructionScheme.length}`, {})
                this.$set (this.remoteOption[`unitOptions${this.constructionScheme.length}`], 'unitOptions', this.companyList)
                this.constructionScheme.push (data)
            },

            neateanRemote () {
                this.remote = {

                    getSchemeType (resolve) {
                        resolve (than.schemeTypeList)
                    }
                }
            },

            neateanOption (list, index) {
                if (index == -1) return
                this.$set (this.remoteOption, `unitOptions${index}`, {})
                this.$set (this.remoteOption[`unitOptions${index}`], 'unitOptions', list)
            },

            neateanConstructionScheme () {
                let require = true, item = {}, str = ''
                this.constructionScheme.forEach ((res, index) => {
                    
                    item = this.$refs[`generateForm${index}`][0].getDataNotPromise ()
                    item ? (Object.assign (this.constructionScheme[index], item), str += res.name + ',') : require = false
                })
                this.strName = str.substring (0, str.length - 1)
                return require
            },

            fileDefaultNeaten (data) {
                let str = ''
                data.schemeAudit.forEach ((res, index) => {
                    let list = []
                    str += res.name + ','
                    this.getCompanyByUserIdList (res.uploadId, false, index)
                    if (res.fileList && res.fileList.length > 0) {
                        res.fileList.forEach(item => {
                            let m = {
                                status : 'finished',
                                response : {
                                    url : item.url,
                                    size: item.size,
                                    name: item.name
                                }
                            }
                            list.push (m)
                        })
                    }
                    res['upLoadFileDefaultList'] = list
                })
                this.strName = str.substring (0, str.length - 1)
                this.constructionScheme = data.schemeAudit
            },

            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.relevancyId}).then(res => {
                    if (res) this.$refs.printTemp.printTemplate (res)
                })
            },

            updataRouter () {
                if (this.$route.params) {
                    this.transform = this.$route.params.transform || {}
                    this.stutas = this.$route.params.pathName || ''
                    this.procInstId = this.$route.params.procInstId || ''
                }
                if (this.$route.params && this.$route.params.taskId) {
                    this.getDetailsList (this.$route.params.taskId)
                }
                if (this.$route.params && this.$route.params.relevancyId) {
                    this.secondId = this.$route.params.relevancyId
                    this.getConstructionScheme (this.$route.params.relevancyId)
                }
            }
        },

        created () {
            this.getCompanyByUserIdList (util.cookies.get ('uuid'), true)
            this.getQueryDicByIdList ()
            this.getFormByJson ()
            this.updataRouter ()
        },

        mounted () {
            than = this
        },

        components: {
            'project-information-basic': projectInformationBasic,
            'print-template-by-html': printTemplateByHtml,
            'bottomInformation': bottomInformation,
            'qqt-send-process': qqtSendProcess,
            'qqt-flow-tabs': qqtFlowTabs,
            'qqt-consent': qqtConsent,
            'up-load': upload
        }
    }
</script>

<style lang='scss'>
    .addConstructionScheme {
        .addConstructionScheme_files {
            // border: 2px solid $color-primary;
            padding: 0px 0px 0px 10px;
            // border-radius: 13px;
            position: relative;
            &::before{ 
                content: '';
                width: 3px;
                height: 15px;
                position: absolute;
                background: #346fff;
                left: 0px;
                top: 3px;
            }
        }
        .addConstructionScheme-line {
            width: 97.6%;
            height: 1px;
            background-image: linear-gradient(to right, #d6d6d6 0%, #d4d4d4 50%, transparent 50%);
            background-size: 15px 1px;
            margin: 0 0 20px 40px;
        }
        .addConstructionScheme_button {
            margin: 5px 0 20px 35px;
        }
        .files-upload___right {
            margin-left: 40px
        }
    }
</style>
