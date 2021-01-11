<template>
    <d2-container type="fulls" class="addProjectDepartment">
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
                            人员信息
                        </el-divider>
                        <div class="add-project-department-button">
                            <el-button size="mini" type="primary" icon="el-icon-plus" round @click="addProjectMember" :disabled="transform.isShowDetails">添加</el-button>
                        </div>
                        <div v-for="(value, index) in memberList" :key="index">
                            <div class="add-project-department-line" v-show="index != 0"></div>
                            <fm-generate-form :data="jsonData" :remote="remote" :remoteOption="remoteOption" :value="value" :transform="transform" @on-object-change="selectGenerateChange ($event, index)" :ref="'generateForm' + index" />
                        </div>
                        <bottom-information :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation" />
                    </template>
                </qqt-flow-tabs>
            </div>
            <div class="qqt-container-full-content___button">
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId !== ''" @click="isSendBack = true, values['flag'] = '1', submitProjectDepartmentData ()">重新提交</el-button>
                <el-button type="primary" v-if="stutas == 'backlog'" @click="visible = true, values['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <el-button type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, values['flag'] = '3', title = '作废意见'">作废</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && procInstId === ''" @click="saveProjectDepartment">保存</el-button>
                <el-button type="primary" v-if="!transform.isShowDetails && procInstId === ''" @click="values['flag'] = '1', submitProjectDepartmentData ()">提交</el-button>
                <el-button type="info" size="mini" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button @click="closePageTag">关闭</el-button>
            </div>
        </el-card>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataProjectDepartment"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="values['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentProjectDepartment" />
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { getProjectDepartmentById, editProjectDepartment,
                addProjectDepartment, submitProjectDepartment, completeProjectDepartment,
                resetSubmitProjectDepartment, getProjectDepartmentAll, getProjectRoleAll } from '@/api/selfProject/operatingReserve/projectDepartment'
    import { qqtSendProcess, qqtFlowTabs, qqtConsent, qqtRelateTable } from '@/components/qqt-subassembly'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { getProjectPositionAll  } from '@/api/system/positionManagement'
    import { formGetJson } from '@/api/system/fromManagement/index'
    import { getstaffListAll } from '@/api/system/staff/staff'
    import { PROPRIETARYPROJECT } from '@/enum/FORMCODE'
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
                num: '',
                title: '',
                stutas: '',
                procInstId: '',
                values: {},
                remote: {},
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
                    sourcesOptions: [
                        {
                            value: '1',
                            label: '公司调剂'
                        },
                        {
                            value: '2',
                            label: '社会聘用'
                        },
                        {
                            value: '3',
                            label: '熟人介绍'
                        },
                        {
                            value: '4',
                            label: '网上招聘'
                        },
                        {
                            value: '5',
                            label: '其它渠道'
                        }
                    ]
                },
                visible: false,
                isReject: false,
                isSendBack: false,
                isTurnManage: false,
                dialogVisible: false,
                code: BASICSCODE.SELF_DEPARTMENT_CREATE,
                processModuleId: PROPRIETARYPROJECT.ADDPROJECTDEPARTMENT,
                upLoadFileDefaultList: [],
                departmentList: [],
                positionList: [],
                memberList: [],
                roleList: [],
                userList: [],
                dutyList: []
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

            getProjectDepartment (id) {
                let str = ''
                getProjectDepartmentById ({'id': id}).then (res => {
                    if (res) {
                        this.values = res
                        this.values.memberList.forEach (item => {
                            str += item.name + ','
                            item['departmentIdList'] = JSON.parse (item.departmentId)
                            item['projectRoleIdList'] = JSON.parse (item.projectRoleId)
                        })
                        this.memberList = JSON.parse (JSON.stringify (this.values.memberList))
                        this.prossValue.title = `项目部组建:【 ${str.substring (0, str.length - 1)} 】`
                        this.fileDefaultNeaten (res)
                    }
                })
            },

            saveProjectDepartment () {
                let url = '', element = {}, require = true
                element = this.$refs.bottomInformation.getData ()
                require = this.neateanPersonalInformation ()
                if (require && element) {
                    Object.assign (this.values, element)
                    this.values['memberList'] = this.memberList
                    this.values.id == null ? url = addProjectDepartment : url = editProjectDepartment
                    url (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success ('保存成功')
                            this.closePageTag ()
                        }
                    })
                }
            },

            submitProjectDepartmentData () {
                let element = {}, require = true, str = ''
                element = this.$refs.bottomInformation.getData ()
                require = this.neateanPersonalInformation ()
                if (require && element) {
                    Object.assign (this.values, element)
                    this.values['memberList'] = this.memberList
                    this.values.memberList.forEach (item => str += item.name + ',')
                    this.dialogVisible = true
                    this.prossValue = {
                        title: this.$route.params.title || `项目部组建:【 ${str.substring (0, str.length - 1)} 】`,
                        pdfId: this.$route.params.procDefId || '',
                        degree: this.$route.params.degree || '',
                        msg: '',
                    }
                }
            },

            updataProjectDepartment (item, boolean) {
                let url = ''
                this.dialogVisible = this.isSendBack = false
                item['taskId'] = this.$route.params.taskId || ''
                this.values['completeTask'] = item
                boolean ? url = resetSubmitProjectDepartment : url = submitProjectDepartment
                url (this.values).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            },

            consentProjectDepartment (item = '', boolean = false) {
                this.visible = this.isTurnManage = this.isReject = false
                if (boolean) {
                    this.closePageTag ()
                    return
                }
                if (item) {
                    this.values['completeTask'] = item
                    completeProjectDepartment (this.values).then (res => {
                        if (res.code === 200) {
                            this.$message.success (res.message)
                            this.closePageTag ()
                        }
                    })
                }
            },

            getDetailsList (taskId) {
                getDetails (taskId).then (res => { if (res) this.nodeData = res })
            },

            getstaffList () {
                getstaffListAll ().then (res => { if (res) this.userList = res, this.neateanRemote () })
            },

            getProjectDepartmentList (code) {
                if (!code) return
                getProjectDepartmentAll ({code: code}).then (res => {
                    if (res && res.length > 0) {
                        this.departmentList = res, this.neateanRemote ()
                    } else {
                        this.$message.warning ('项目部门为空，请联系管理员')
                    }
                })
            },

            getProjectRoleAList () {
                getProjectRoleAll ().then ( res => { 
                    if (res && res.length > 0) {
                        this.roleList = res, this.neateanRemote ()
                    } else {
                        this.$message.warning ('项目角色为空，请联系管理员')
                    }
                 })
            },

            getProjectPositionList () {
                getProjectPositionAll ().then (res => { if (res) this.dutyList = res })
            },

            neateanPersonalInformation () {
                let require = true, item = {}
                this.memberList.forEach ((res, index) => {
                    item = this.$refs[`generateForm${index}`][0].getDataNotPromise ()
                    item ? Object.assign (this.memberList[index], item) : require = false
                })
                return require
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = ``
                this.stutas ? path = `/approval/${this.stutas}` : path = `/projectManagement/selfSupportProjectDetail/operatingReserve/projectDepartment`
                this.close ({ tagName, path })
            },

            getProjectCode (projectCode) {
                this.values['projectCode'] = projectCode
                this.getProjectDepartmentList (projectCode)
            },

            addProjectMember () {
                let data = { accountNumber: '', phone: '' }
                this.memberList.push (data)
            },

            clearUserPage (list) {
                console.log(list)
                if (list.length == 0 || list.length > 1) {
                    this.$message.warning ('选择一条数据')
                    return
                }
                if (list[0].id.indexOf ('D') != -1) {
                    this.$message.warning ('只能选择人员')
                    return
                }


            },

            selectGenerateChange (data, index) {
                let item = '', str = '', list = []
                switch (data.field) {
                    case 'departmentIdList':
                        if (data.value instanceof Array) {
                            data.value.forEach (id => {
                                item = this.departmentList.find (f => f.id === id)
                                if (item) str = item.name + ','
                            })
                            this.memberList[index]['department'] = str.substring (0, str.length - 1)
                            this.memberList[index]['departmentId'] = JSON.stringify (data.value)
                        }
                        break
                    case 'projectRoleIdList':
                        if (data.value instanceof Array) {
                            data.value.forEach (id => {
                                item = this.roleList.find (f => f.id === id)
                                if (item) str = item.name + ','
                            })
                            this.memberList[index]['projectRole'] = str.substring (0, str.length - 1)
                            this.memberList[index]['projectRoleId'] = JSON.stringify (data.value)
                        }
                        break
                    case 'userId':
                        item = this.userList.find (f => f.id === data.value)
                        if (item) {
                            this.memberList[index]["userId"] = data.value
                            this.memberList[index]['name'] = item.name
                            this.memberList[index].accountNumber = item.jobNumber
                            this.memberList[index].phone = item.phone
                            this.memberList[index].email = item.email
                        }
                        break
                    case 'dutyId':
                        item = this.dutyList.find (f => f.id === data.value)
                        if (item) {
                            this.memberList[index]['duty'] = item.name
                        }
                        break
                }
            },

            neateanRemote () {
                this.remote = {
                    getDepartment (resolve) {
                        resolve (than.departmentList)
                    },

                    getProjectRole (resolve) {
                        resolve (than.roleList)
                    },

                    getUserList (resolve) {
                        resolve (than.userList)
                    },

                    getDutyList (resolve) {
                        resolve (than.dutyList)
                    }
                }
            },

            fileDefaultNeaten (res) {
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
                        this.upLoadFileDefaultList.push(m)
                    })
                }
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
                    this.getProjectDepartment (this.$route.params.relevancyId)
                } else {
                    this.addProjectMember ()
                }
            }
        },

        created () {
            this.getProjectPositionList ()
            this.getProjectRoleAList ()
            this.getFormByJson ()
            this.updataRouter ()
            this.getstaffList ()
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
            'qqt-consent': qqtConsent
        }
    }
</script>

<style lang='scss'>
    .addProjectDepartment {
        .add-project-department-button {
            margin-top: -40px;
            position: absolute;
            right: 40px;
            text-align: right;
        }
        .add-project-department-line {
            width: 97.6%;
            height: 1px;
            background-image: linear-gradient(to right, #d6d6d6 0%, #d4d4d4 50%, transparent 50%);
            background-size: 15px 1px;
            margin: 0 0 20px 40px;
        }
    }
</style>
