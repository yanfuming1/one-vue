<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header___search">
                    <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="filterForm.name" size="mini"></el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="searchModelSynopsis">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetSearch">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-date-picker
                        v-model="selectTime"
                        type="datetimerange"
                        size="mini"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['08:00:00', '18:00:00']"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="getTime"
                        align="right">
                    </el-date-picker>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>项目类别:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="filterForm.projectTypeDicId" :options="projectCategoryList" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="filterForm.projectTypeDicId = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <p>工程类别:</p>
                    <div class="qqt-container-full-header-state___select">
                        <qqt-select :value="filterForm.projectCategoryDicId" :options="projectCategoryList" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="filterForm.projectCategoryDicId = $event, searchModelSynopsis ()"></qqt-select>
                    </div>
                </span>
            </div>
        </template>
        <div class="address-book-center">
            <qqt-table
                ref="table" 
                :exportData="exportData"
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                :dynamicHeader="dynamicHeader"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
        <el-dialog v-dialogDrag title="共享类型" :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
            <el-form ref="shareForm" :model="shareForm" label-width="0px">
                <el-form-item>
                    <el-checkbox-group v-model="shareForm.type" @change="boxChange">
                        <el-checkbox label="1" name="type">查看</el-checkbox>
                        <el-checkbox label="2" name="type">管理</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subShare">确定</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog v-dialogDrag title="共享人员" :visible.sync="shareUserDialog" width="40%" :before-close="handleClose">
            <el-form ref="shareUserForm" :model="shareUserForm" label-width="120px">
                <el-form-item label="已经共享的人员:">
                    <el-checkbox-group v-model="userList" @change="shareUserChange">
                        <div v-for="(item, index) in shareUserForm.userList">
                            <el-checkbox :label="item.id" :key="item.id">{{ item.username }}</el-checkbox>
                        </div>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button v-if="showCancelBtn" type="primary" @click="subShareUserList">取消选中人的分享</el-button>
                <el-button @click="shareUserDialog = false">取消</el-button>
            </span>
        </el-dialog>
        <user-modules v-if="isShow" :userIds="user" :department="department" :startCrew="startCrew" @clearUserPage="clearUserPage" @closeFun="closeFun"></user-modules>
    </d2-container>
</template>
<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { getAllProList, jointSearchList,jointDeleteBatch, jointScopeAddOrCancelAttention,
         getProjectAllOptions, shareProject, lookShareProject, cancelShareProject } from '../../../../api/jointProject/index'
import { getSelfProjectPrincipalList, selfProjectDelete, getSelfProjectHighestVersion, updataSelfProjectAttention} from '../../../../api/selfProject/allProject/index'
import { queryDicById } from '../../../../api/system/dic/dic'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { GetDepart } from '../../../../api/system/depart/depart'
import menu from '../../../../layout/header-aside/components/mixin/menu'
import util from '../../../../libs/util'
import userModules from '../../../personal-information/message-management/components/userModules'
import { PROJECT_GETINFOID } from '../../../../enum/PROJECT'
export default {
    name: "index",
    components: {qqtTable, userModules, qqtSelect},
    data() {
        return {
            JointPersonList: [],
            allUser: [],
            departList: [],
            qualificationList: [],
            projectCategoryList: [],
            rowHeader: [
                {
                    prop: 'attention',
                    label: '关注',
                    isShow: true,
                    width: "50",
                    render: (h, parms) => {
                        return h('i', {
                            attrs: {
                                class: 'iconfont iconwuxing'
                            },
                            style:{
                                color: parms.row.attention === '1' ? '#409EFF' : '#999',
                            },
                            on:{
                                click: () => {
                                    updataSelfProjectAttention({
                                        projectCode: parms.row.projectCode
                                    }).then(res => {
                                        if (parms.row.attention === '1') {
                                            this.$message.success("取消关注~~~")
                                        } else {
                                            this.$message.success("关注成功~~~")
                                        }
                                        this.searchModelSynopsis (this.filterForm.pageNo, this.filterForm.pageSize)
                                    })
                                }
                            }
                        }, "")
                    }
                },{
                    prop: 'projectCode',
                    label: '项目编码',
                    width: "160",
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: { 'typefaceColor': true },
                            on:{
                                click: async () => {
                                    if (parms.row.procState === '10') {
                                        menu.methods.handleMenuSelect('/selfSupportProjectDetail')
                                        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                        db.set('selfProID', parms.row.id).write()
                                        db.set('selfProCode', parms.row.projectCode).write()
                                        this.getSelfProjectHighestVersionData (parms.row.projectCode)
                                    } else {
                                        this.$message.warning("新建项目未审批完结，不能进入项目详情!!!")
                                    }
                                }
                            }
                        }, parms.row.projectCode)
                    }
                },{
                    prop: 'projectName',
                    label: '项目名称',
                    width: "220",
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            class: { 'typefaceColor': true },
                            on:{
                                click: async () => {
                                    if (parms.row.procState === '10') {
                                        menu.methods.handleMenuSelect('/selfSupportProjectDetail')
                                        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                        db.set('selfProID', parms.row.id).write()
                                        db.set('selfProCode', parms.row.projectCode).write()
                                        db.set('selfProName', parms.row.projectName).write()
                                        this.getSelfProjectHighestVersionData (parms.row.projectCode)
                                    } else {
                                        this.$message.warning("新建项目未审批完结，不能进入项目详情!!!")
                                    }
                                }
                            }
                        }, parms.row.projectName)
                    }
                },{
                    prop: 'projectTypeDic',
                    label: '项目类别',
                    isShow: true,
                    width: "150",
                    render: (h, parms) => {
                        return h('span', {
                        }, parms.row.projectTypeDic === null ? '无' : parms.row.projectTypeDic)
                    }
                },{
                    prop: 'projectCategoryDic',
                    label: '工程类别',
                    width: "180",
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                        }, parms.row.projectCategoryDic === null ? '无' : parms.row.projectCategoryDic)
                    }
                },{
                    prop: 'createPatternDic',
                    label: '项目建设模式',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'openTime',
                    label: '开标时间',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'bidTime',
                    label: '中标时间',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'tenderPrice',
                    label: '中标价(元)',
                    isShow: true,
                    width: "120",
                },
                {
                    prop: 'procStateName',
                    label: '办理状态',
                    width: "120",
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {
                        }, parms.row.procStateName = parms.row.procState ? util.handleState(parms.row.procState) : '无')
                    }
                },{
                    prop: 'ownerUnitName',
                    label: '业主单位',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'createName',
                    label: '创建人',
                    isShow: true,
                    width: "120",
                },{
                    prop: 'createTime',
                    label: '创建时间',
                    isShow: true,
                    width: "160",
                },{
                    prop: "",
                    label:"操作",
                    fixed: "right",
                    width: "140",
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{ type: 'text' },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = true
                                        this.routerLink('selfProjectAdd', { transform: this.transform, relevancyId: parms.row.id }, '自营项目详情')
                                    }
                                }
                            }, '查看')
                        ]
                    }
                },
            ],
            defaultProp: {
                value: 'id',
                label: 'name'
            },
            dynamicHeader: {
                // tableId: 'T_1572488196',
                // isSave: true
            },
            tableData: {},
            tableOption: {
                border: true
            },
            filterForm: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                businessType: '',
                businessPersonnel: '',
                businessDepartment: '',
                projectCategoryDicId: '',
                projectTypeDicId: '',
                jointPrincipal: '',
                createTime: '',
                updateTime: '',
            },
            jointPerson: [],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            selectTime: [],
            proArr: [],
            user: [],
            department: [],
            startCrew: [],
            isShow: false,
            lastChoseUser: '',
            dialogVisible: false,
            shareForm: {
                type: []
            },
            shareUserDialog: false,
            shareUserForm: {
                userList: []
            },
            userList: [],
            choseProId: '',
            showCancelBtn: false,
            exportData: [],
            transform: {
                isShowDetails: false
            },
            identification: '',
        }
    },
    methods: {
        routerLink (url, params, title) {
            this.$router.push({
                path: url,
                name: url,
                params: params
            })
            this.$store.commit ('d2admin/page/titleSet', title)
        },
        searchModelSynopsis(pageNo = '1', pageSize = '10') {
            this.filterForm.pageNo = pageNo
            this.filterForm.pageSize = pageSize
            getSelfProjectPrincipalList(this.filterForm).then(res => {
                this.tableData = res
            })
        },

        resetSearch() {
            this.selectTime = []
            this.filterForm = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                businessType: '',
                businessPersonnel: '',
                businessDepartment: '',
                projectCategoryDicId: '',
                projectTypeDicId: '',
                jointPrincipal: '',
            } 
            this.searchModelSynopsis()
        },
        selectChange(data){
            this.proArr = []
            if(data.length > 0){
                data.forEach(item => {
                    this.proArr.push(item.id)
                })
            }
        },
        getTime() {
            this.filterForm.createTime = this.selectTime[0]
            this.filterForm.updateTime = this.selectTime[1]
            this.searchModelSynopsis()
        },
        handlePaginationChange(data){
            this.filterForm.pageNo = data.current
            this.filterForm.pageSize = data.size
            getSelfProjectPrincipalList(this.filterForm).then(res => {
                this.tableData = res
            })
        },
        getList(){
            getSelfProjectPrincipalList().then(res => {
                this.tableData = res
            })
        },
        shareProject(){
            if(this.proArr.length === 0){
                this.$message.warning("请选择要共享的项目!!!")
            } else {
                this.isShow = true
            }
        },
        handleClose(done){
            done()
        },
        clearUserPage(data) {
            let hasDep = false
            let choseUser = []
            if(data.length === 0){
                this.$message.warning("请选择共享的人员!!!")
            } else {
                data.forEach(item => {
                    if(item.id.indexOf("D") !== -1){
                        // 说明选择的有部门
                        hasDep = true
                    }
                })
                if(hasDep){
                    this.$message.warning("不能选择部门,请选择人员!!!")
                } else {
                    data.forEach(it => {
                        let tempArr = new Set(choseUser)
                        if(!tempArr.has(it.id)){
                            choseUser.push(it.id)
                        }
                    })
                    this.lastChoseUser = util.jointData(choseUser, ',')
                    this.isShow = false
                    this.shareForm.type = []
                    this.dialogVisible = true
                }
            }
        },
        closeFun() {
            this.isShow = false;
        },
        subShare() {
            if(this.shareForm.length === 0){
                this.$message.warning("请选择共享类型!!!")
            } else {
                let tempArr = new Set(this.shareForm.type)
                let lastType = tempArr.has("2") ? "2" : "1"
                shareProject({
                    projectId: util.jointData(this.proArr, ','),
                    type: lastType,
                    userId: this.lastChoseUser
                }).then(res => {
                    if(res.success){
                        this.$message.success("共享成功~~~")
                    }
                    this.dialogVisible = false
                })
            }
        },
        boxChange(value){
            if(this.shareForm.type.length === 1){
                if(this.shareForm.type[0] === '2'){
                    this.shareForm.type.push('1')
                }
            }
        },
        subShareUserList () {
            let tem = {
                projectId: this.choseProId,
                userId: util.jointData(this.userList, ',')
            }
            cancelShareProject(tem).then(res => {
                this.$message.success("取消共享人员成功~~~")
                this.shareUserDialog = false
            })
        },
        shareUserChange() {
            if(this.userList.length > 0){
                this.showCancelBtn = true
            }
        },
        uploadFun(){
            this.getExportData().then(res => {
                this.$refs.table.getExportExcel()
            })
        },
        printTable () {
            this.$refs.table.printTable (this.proArr)
        },
        getSelfProjectHighestVersionData (projectCode) {
            getSelfProjectHighestVersion ({'projectCode': projectCode}).then (res => {
                this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformation', res)
            })
        },

        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
                    item.procState = util.handleState(item.procState)
                    item.isAttention = item.isAttention === '1' ? '已关注' : '未关注'
                    switch(item.isBid){
                        case '':
                            item.isBid = "未填写"
                            break
                        case '1':
                            item.isBid = '中标'
                            break
                        case '0':
                            item.isBid = '未中标'
                            break
                    }
                });
                resolve (true)
            });
        },
    },
    mounted() {
        this.searchModelSynopsis()
        this.identification = this.$route.params.identification
        getProjectAllOptions().then(res => {
            this.projectCategoryList = res.projectType
            this.allUser = this.$store.getters['d2admin/allUser/getData']
            this.departList = this.$store.getters['d2admin/allUser/getDepartData']
        })
    }
}
</script>

<style lang="scss">
.header-form{
    margin-top: 15px;
    overflow: hidden;
    .el-form-item{
        margin-bottom: 0px;
    }
}
</style>
