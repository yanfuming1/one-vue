<template>
    <d2-container class="address-book">
        <template slot="header">
            <div class="address-book-header">
                <el-row> <project-info :proCode='proCode' @getProjectInfo="getProjectInfo"></project-info></el-row>
                <el-row>
                    <span class="address-book-header___search">
                        <el-button type="primary" size="mini" icon="el-icon-suitcase-1" @click="levelSetting" class="address-book-header-button">级别设置</el-button>
                        <span v-for="item in levelList">
                            <el-tag :style="{background:item.bgColor, borderColor: item.bgColor}" effect="dark">{{ item.rank }}</el-tag>
                            <el-tag :style="{borderColor: item.bgColor, color: item.bgColor }" effect="plain">{{ item.name }}</el-tag>
                        </span>
                    </span>
                    <span class="address-book-header___search position-right">
                        <!-- <el-button type="success" size="mini" icon="el-icon-suitcase-1" @click="submitNewStageData" class="address-book-header-button">项目划分提交</el-button> -->
                        <!-- <span>划分规范查询：</span>
                        <el-select v-model="value" size="mini" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-button-group>
                            <el-button size="mini" icon="el-icon-upload2">导出</el-button>
                            <el-button size="mini" icon="el-icon-printer">打印</el-button>
                        </el-button-group> -->
                    </span>
                </el-row>
            </div>
        </template>
        <div class="address-book-center project-segregation">
            <el-row style="height:calc(100% - 34px);">
                <el-col :span="6" class="left-tree">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>项目划分</span>
                            <el-button v-if="canEdit" class='right-btn' style="float: right; padding: 3px 0" @click="addProject" type="text">添加顶级工程</el-button>
                        </div>
                        <div class="text item">
                            <project-tree :canEdit="canEdit" :levelList='levelList' :proData="treeData" @editChild="editChild" @appChild='appChild' @deleteChild='deleteChild'></project-tree>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="18" class="right-table">
                    <el-card class="box-card">
                        <div class="qqt-container-full-center___top">
                            <qqt-flow-tabs :procInstId="procInstId">
                                <template slot="content">
                                    <div class="qqt-container-full-center-header">{{proName}}项目划分</div>
                                    <tree-table :levelList='levelList' :proData='treeData'></tree-table>
                                </template>
                            </qqt-flow-tabs>
                        </div>  
                    </el-card>
                </el-col>
            </el-row>
            <div class="qqt-container-full-content___button" style="height:34px; text-align: center; padding-top:2px;">
                <!-- <el-button size="mini" type="warning" v-if="canReSub && procInstId !== ''" @click="isSendBack = true, subValue['flag'] = '1', submitNewStageData ()">重新提交</el-button> -->
                <el-button size="mini" type="primary" v-if="stutas == 'backlog'" @click="visible = true, subValue['flag'] = '1', title = '审批意见'">同意</el-button>
                <el-button size="mini" type="warning" v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1" @click="visible = isTurnManage = true, subValue['flag'] = '0', title = '转办意见'">转办</el-button>
                <el-button size="mini" type="success" v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1" @click="visible = isReject = true, subValue['flag'] = '2', title = '驳回意见'">驳回</el-button>
                <!-- <el-button size="mini" type="info" v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1" @click="visible = true, subValue['flag'] = '3', title = '作废意见'">作废</el-button> -->
                <el-button size="mini" type="primary" v-if="canEdit || procInstId === ''" @click="subValue['flag'] = '1', submitNewStageData ()">提交</el-button>
                <el-button size="mini" @click="closePageTag">关闭</el-button>
            </div>
        </div>
        <level-setting :propData='levelList' :dialogVisible='settingVisible' @closeSetting='closeSetting'></level-setting>
        <add-project :dialogVisible='projectVisible' :proData='proItem' @closeAddProject='closeAddProject'></add-project>
        <qqt-send-process v-if="dialogVisible" :dialogVisible="dialogVisible" :processModuleId="processModuleId" :isSendBack="isSendBack" :prossValue="prossValue" @close="dialogVisible = false" @selectData="updataNewStage"/>
        <qqt-consent :dialogVisible="visible" :msg="nodeData.msg" :taskId="$route.params.taskId || ''" :type="subValue['flag']" :isReject="isReject" :isTurnManage="isTurnManage" @close="consentNewStage" />
    </d2-container>
</template>
<script>
import { projectSegregationGetTree, projectLevelSettingList, projectLevelSettingAdd, projectModelAdd, projectModelDel,
    projectSegregationSub, projectModelResub, projectModelApproval, projectModelOperation,projectModelEdit } from '@/api/selfProject/projectSegregation'
import { qqtSendProcess, qqtFlowTabs, qqtConsent, } from '@/components/qqt-subassembly'
import projectInfo from '../components/commenInfo/projectInfo'
import { PORJECT_INFO } from '@/enum/SELFPROJECT'
import { getDetails } from '@/api/approval/common'
import levelSetting from './components/levelSetting'
import addProject from './components/addProject'
import treeTable from '../components/treeTable'
// import treeTable from './components/treeTable'
import { mapActions } from 'vuex'
import projectTree from '../components/projectTree'
import util from '../../../../libs/util'
export default {
    components: {
        'project-info': projectInfo,
        'project-tree': projectTree,
        'qqt-send-process': qqtSendProcess,
        'qqt-flow-tabs': qqtFlowTabs,
        'qqt-consent': qqtConsent,
        'tree-table': treeTable,
        'level-setting': levelSetting,
        'add-project': addProject
    },
    data () {
        return {
            proCode: '',
            value: '',
            options: [
                { value:'1', label: '1' }
            ],
            treeData: [],
            procInstId: '',
            settingVisible: false,
            levelList: [],
            projectVisible: false,
            proItem: {},
            stutas: '',
            visible: false,
            isReject: false,
            isSendBack: false,
            isTurnManage: false,
            dialogVisible: false,
            processModuleId: PORJECT_INFO.PROJECTSEGREGATIONADD,
            prossValue: {
                title: ''
            },
            subValue: {},
            proName: '',
            nodeData: {
                operation: '',
                msg: ''
            },
            canEdit: true,
            canReSub: false,
        }
    },
    methods: {
        
        ...mapActions('d2admin/page', [
            'close',
        ]),

        // 级别设置
        levelSetting () {
            if(this.canEdit) {
                this.settingVisible = true
            } else {
                this.$message.warning("当前不可设置级别!!!")
            }
        },

        closeSetting (data) {
            if (data) {
                data.forEach(item => { item.projectCode = this.proCode })
                projectLevelSettingAdd({ projectCode: this.proCode, list: data }).then(res => {
                    this.$message.success(res.message)
                    this.searchLeveSetting()
                })
            }
            this.settingVisible = false
        },
        
        getTreeData (code) {
            projectSegregationGetTree({ projectCode : code }).then(res => {
                this.treeData = res 
            })
        },

        searchLeveSetting () {
            projectLevelSettingList({ projectCode : this.proCode }).then(res => {
                this.levelList = res
            })
        },

        addProject () {
            this.proItem = {
                id: '',
                name: '',
                number: '',
                parentId: '',
                parentName: '',
                parentNumber: '',
                rank: '',
                rankName: '',
                rankNumber: '',
                remark: '',
            }
            this.projectVisible = true
        },

        closeAddProject (data) {
            if (data) {
                data.projectCode = this.proCode
                let temData = Object.assign({}, data)
                delete temData.rankNumber
                let url = ''
                data.id ? url = projectModelEdit : url = projectModelAdd
                url(temData).then(res => {
                    if(res) { this.$message.success(res.message) }
                    this.getTreeData(data.projectCode)
                    this.searchLeveSetting ()
                })
            }
            this.projectVisible = false
        },
        editChild (data) {
            this.proItem = data;
            this.projectVisible = true

        },
        appChild (parentInfo) {
            if(parseInt(parentInfo.rankNumber) === this.levelList.length) {
                this.$message.warning('当前已是最大等级，不能添加子项目!!!')
                return false
            }
            this.proItem = {
                id: '',
                name: '',
                number: '',
                parentId: parentInfo.id,
                parentName: parentInfo.name,
                parentNumber: parentInfo.number + '',
                rank: this.levelList[parseInt(parentInfo.rankNumber)-1].rank + '',
                rankName: this.levelList[parseInt(parentInfo.rankNumber)-1].name,
                rankNumber: parentInfo.__identity + '',
                remark: '',
            }
            this.projectVisible = true
        },

        deleteChild (parentInfo) {
            util.confirm('确定删除此项目吗？').then(valid => {
                if (valid) {
                    projectModelDel({ id: parentInfo.id }).then(res => {
                        if(res) {
                            this.$message.success(res.message)
                            this.getTreeData(parentInfo.projectCode)
                        }
                    })
                }
            })
        },

        submitNewStageData () {
            this.subValue.projectCode = this.proCode
            this.prossValue = {
                title: this.$route.params.title || `自营项目划分审批:【 ${this.proName} 】`,
                pdfId: this.$route.params.procDefId || '',
                degree: this.$route.params.degree || '',
                msg: '',
            }
            this.dialogVisible = true
        },

        updataNewStage (item, boolean) {
            let url = ''
            this.dialogVisible = this.isSendBack = false
            item['taskId'] = this.$route.params.taskId || ''
            this.subValue['completeTask'] = item
            // console.log(this.subValue)
            boolean ? url = projectModelResub : url = projectSegregationSub
            url (this.subValue).then (res => {
                if (res.code === 200) {
                    this.$message.success (res.message)
                    this.closePageTag ()
                }
            })
        },

        consentNewStage (item = '', boolean = false) {
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closePageTag ()
                return
            }
            if (item) {
                this.subValue.projectCode = this.proCode
                this.subValue['completeTask'] = item
                // console.log(this.subValue)
                projectModelOperation (this.subValue).then (res => {
                    if (res.code === 200) {
                        this.$message.success (res.message)
                        this.closePageTag ()
                    }
                })
            }
        },

        closePageTag () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },

        // 查询审批信息
        getFlowInfo (code) {
            projectModelApproval({ projectCode: code }).then(res => {
                if (res.procState) {
                    this.canEdit = res.procState === '1' || res.procState === '6' ? true : false
                    this.canReSub = res.procState === '1' || res.procState === '4' ? true : false
                    this.subValue['id'] = res.id
                    this.procInstId = res.procInstId || ''
                } else {
                    this.canEdit = true
                    this.canReSub = false
                }
            })
        },

        getDetailsList (taskId) {
            getDetails (taskId).then (res => { 
                if (res){
                     this.nodeData = res 
                }
                
            })
        },

        getProjectInfo (data) {
            this.proName = data.projectName
        },

        updataRouter () {
            
            if (this.$route.params && this.$route.params.taskId) {
                this.getDetailsList (this.$route.params.taskId)
            }
            if (this.$route.params && this.$route.params.relevancyId) {
                this.proCode = this.$route.params.relevancyId
                this.getTreeData(this.$route.params.relevancyId)
                this.getFlowInfo(this.$route.params.relevancyId)
                this.searchLeveSetting()
            } else {
                this.getTreeData(this.proCode)
                this.searchLeveSetting()
            }
        }
    },
    async mounted () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        if (this.$route.params.detailData) {
            this.stutas = this.$route.params.pathName || ''
            this.procInstId = this.$route.params.procInstId || ''
        } else {
            this.proCode = db.get('selfProCode').value()
            this.getFlowInfo(this.proCode)
        }
        this.updataRouter ()
    }
}
</script>
<style lang="scss">
.address-book {
    .d2-container-full .d2-container-full__header{ padding-bottom: 0px !important; }
    .address-book-header {
        .address-book-header___search {
            .address-book-header-button{ margin-right: 10px; }
            .el-tag{ height: 29px; line-height: 29px; margin-right: 7px; }
        }
        .position-right{
            float: right;
            .el-input{ width: 150px; margin-right: 10px; }
        }
    }
    .address-book-center { height: 100%; }
    .project-segregation{
        .left-tree{
            height: 100%;
            padding-right: 10px;
            .el-card{
                height: 100%;
                .el-card__header{ 
                    padding: 15px 10px; border-bottom: 1px dashed #EBEEF5; color: 13px; font-size: 14px;
                    .clearfix{ 
                        padding-left: 15px;
                        span{ 
                            position: relative;
                            &:before{ content: ''; height: 15px; position: absolute; left: -8px; top: 1px; width: 2px; background: #409eff; }
                        }
                        .right-btn{
                            span { &:before{ width: 0px;} }
                        }
                    }
                }
                .el-card__body{ padding: 10px; height: calc(100% - 52px); overflow-y: scroll; }
            }
        }
        .right-table{
            height: 100%;
            .el-card{ height: 100%; overflow-y: scroll; }
            .qqt-container-full-center-header {
                height: 30px;
                font-size: 20px;
                text-align: center;
            }
        }
    }
}
</style>