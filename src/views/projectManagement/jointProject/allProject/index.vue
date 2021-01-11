<template>
    <d2-container class="address-book">
        <template slot="header">
            <div class="address-book-header">
                <el-row>
                    <el-col :span="24">
                        <span class="address-book-header___search">
                            <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="filterForm.name" size="mini"></el-input>
                            <span>
                                <el-date-picker
                                    style="width:350px;"
                                    v-model="selectTime"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    @change="getTime"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :default-time="['08:00:00', '18:00:00']"
                                    align="right">
                                </el-date-picker>
                            </span>
                            <el-button type="primary" size="mini" class="address-book-header-button" @click="searchModelSynopsis">搜索</el-button>
                            <el-button type="info" size="mini" class="address-book-header-button" @click="resetSearch">重置</el-button>
                            <el-button type="success" size="mini" class="address-book-header-button" @click="shareProject">共享</el-button>
                            <el-button-group>
                                <el-button size="mini" @click="uploadFun" icon="el-icon-upload2">导出</el-button>
                                <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                            </el-button-group>
                        </span>
                        <span class="qqt-container-full-header-operation___right">
                            <p>是否中标:</p>
                            <div class="qqt-container-full-header-state___select">
                                <qqt-select :value="filterForm.isBid" :options="bidOptions" :size="'mini'" :placeholder="'请选择'" @select="filterForm.isBid = $event, searchModelSynopsis ()"></qqt-select>
                            </div>
                        </span>
                        <span class="qqt-container-full-header-operation___right">
                            <p>业务负责人:</p>
                            <div class="qqt-container-full-header-state___select">
                                <qqt-select :value="filterForm.businessPersonnelId" :options="businessPersonnelList" :defaultProp="defaultProp" :size="'mini'" :placeholder="'请选择'" @select="filterForm.businessPersonnelId = $event, searchModelSynopsis ()"></qqt-select>
                            </div>
                        </span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form ref="form" class="header-form" :model="filterForm" label-width="120px">
                            <el-col :span="6">
                                <el-form-item label="资质要求:">
                                    <el-select v-model="filterForm.businessType" size="mini" style="width:100%;" clearable @change="searchModelSynopsis" placeholder="请选择">
                                        <el-option v-for="item in qualificationList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="联营负责人:">
                                    <el-select v-model="filterForm.jointPrincipal" size="mini" style="width:100%;" clearable @change="searchModelSynopsis" placeholder="请选择">
                                        <el-option v-for="item in JointPersonList"
                                            :key="item.id"
                                            :label="item.cusName"
                                            :value="item.cusName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" class="bottom">
                                <el-form-item label="工程类别:">
                                    <el-select v-model="filterForm.projectType" size="mini" style="width:100%;" clearable @change="searchModelSynopsis" placeholder="请选择">
                                        <el-option v-for="item in projectTypeList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </template>
        <div class="address-book-center project-name-cell">
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
                        <div v-for="(item, index) in shareUserForm.userList" :key="index">
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
        <user-modules v-if="isShow" :showDialog="isShow" :userIds="user" :department="department" :startCrew="startCrew" @clearUserPage="clearUserPage" @closeFun="closeFun"></user-modules>
    </d2-container>
</template>
<script>
import { qqtTable, qqtSelect } from '../../../../components/qqt-subassembly'
import { getAllProList, jointSearchList,jointDeleteBatch, getProById, jointScopeAddOrCancelAttention,
     getProjectAllOptions, shareProject, lookShareProject, cancelShareProject } from '../../../../api/jointProject/index'
import { queryDicById } from '../../../../api/system/dic/dic'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { getCompanyDepDic } from '../../../../api/system/depart/depart'
import { getstaffListAll } from '../../../../api/system/staff/staff'
import menu from '../../../../layout/header-aside/components/mixin/menu'
import util from '../../../../libs/util'
import userModules from '../../../personal-information/message-management/components/userModules'
import { PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { log } from 'util'
export default {
    name: "index",
    components: {qqtTable, userModules, qqtSelect},
    data() {
        return {
            userName: util.cookies.get ('username'),
            JointPersonList: [],
            allUser: [],
            departList: [],
            qualificationList: [],
            rowHeader: [
                {
                    prop: 'isAttention',
                    label: '关注',
                    isShow: true,
                    width: "50",
                    render: (h, parms) => {
                        return h('i', {
                            attrs: { class: 'iconfont iconwuxing' },
                            style:{ color: parms.row.isAttention === '1' ? '#409EFF' : '#999', },
                            on:{
                                click: () => {
                                    jointScopeAddOrCancelAttention({ id: parms.row.id}).then(res => {
                                        if (parms.row.isAttention === '1') {
                                            this.$message.success("取消关注~~~")
                                            parms.row.isAttention = '0';
                                        } else {
                                            this.$message.success("关注成功~~~")
                                            parms.row.isAttention = '1';
                                        }
                                    })
                                }
                            }
                        }, "")
                    }
                },{
                    prop: 'itemNumber',
                    label: '项目编码',
                    width: "150",
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            props:{type: 'text', },
                            style:{color: '#409EFF', cursor: 'pointer' },
                            on:{
                                click: async () => {
                                    menu.methods.handleMenuSelect('/jontProjectDetail')
                                    const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                    db.set('proID', parms.row.id).write()
                                    db.set('proCode', parms.row.itemNumber).write()
                                    db.set('proName', parms.row.projectName).write()
                                }
                            }
                        }, parms.row.itemNumber)
                    }
                },{
                    prop: 'projectName',
                    label: '项目名称',
                    isShow: true,
                    width: "180",
                    render: (h, parms) => {
                        return h('span', {
                            props:{ type: 'text', },
                            style:{ color: '#409EFF', cursor: 'pointer' },
                            on:{
                                click: async () => {
                                    menu.methods.handleMenuSelect('/jontProjectDetail')
                                    const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                    db.set('proID', parms.row.id).write()
                                    db.set('proCode', parms.row.itemNumber).write()
                                    db.set('proName', parms.row.projectName).write()
                                }
                            }
                        }, parms.row.projectName)
                    }
                },{
                    prop: 'projectTypeName',
                    label: '工程类别',
                    isShow: true,
                    width: "150",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.projectTypeName = parms.row.projectType === null ? '无' : parms.row.projectType)
                    }
                },{
                    prop: 'qualificationRequirementName',
                    label: '资质要求',
                    width: "120",
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.qualificationRequirementName = parms.row.qualificationRequirement === null ? '无' : parms.row.qualificationRequirement)
                    }
                },{
                    prop: 'sectionName',
                    label: '标段',
                    isShow: true,
                    width: "100",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.sectionName = parms.row.section === null ? '无' : parms.row.section)
                    }
                },{
                    prop: 'biddingCompanyTitle',
                    label: '投标公司',
                    isShow: true,
                    width: "150",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.biddingCompanyTitle = parms.row.biddingCompanyName === null ? '无' : parms.row.biddingCompanyName)
                    }
                },{
                    prop: 'registrationDeadlineName',
                    label: '报名时间',
                    isShow: true,
                    width: "150",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.registrationDeadlineName = parms.row.registrationDeadline === null ? '无' : parms.row.registrationDeadline)
                    }
                },{
                    prop: 'bidOpeningTimeString',
                    label: '开标时间',
                    isShow: true,
                    width: "150",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.bidOpeningTimeString = parms.row.bidOpeningTime === null ? '无' : parms.row.bidOpeningTime)
                    }
                },{
                    prop: 'isBidName',
                    label: '是否中标',
                    isShow: true,
                    width: "80",
                    render: (h, parms) => {
                        let text = ''
                        if(parms.row.isBid === null) {
                            text = '未填写'
                        } else {
                            text = parms.row.isBid === '1' ? '中标' : '未中标'
                        }
                        return h('div', {}, parms.row.isBidName = text)
                    }
                },{
                    prop: 'theWinningTimeString',
                    label: '中标时间',
                    isShow: true,
                    isMoney: true,
                    width: "120",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.theWinningTimeString = parms.row.theWinningTime ? parms.row.theWinningTime : '无')
                    }
                },{
                    prop: 'tenderPriceName',
                    label: '中标价格',
                    isShow: true,
                    isMoney: true,
                    width: "120",
                    isOpenSummary: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.tenderPriceName = parms.row.tenderPrice ? util.moneyTransform(parms.row.tenderPrice) : '无')
                    }
                },{
                    prop: 'projectManagerName',
                    label: '项目经理',
                    isShow: true,
                    width: "100",
                    render: (h, parms) => {
                        return h('span', {}, parms.row.projectManagerName = parms.row.projectManager === null ? '无' : parms.row.projectManager)
                    }
                },{
                    prop: 'associatedPerson',
                    label: '联营人',
                    width: "100",
                    isShow: true
                },{
                    prop: 'phone',
                    label: '联系电话',
                    width: "120",
                    isShow: true
                },{// },{
                //     prop: 'businessDepartment',
                //     label: '工作部门',
                //     width: "100",
                //     isShow: true
                // },{
                    prop: 'businessPersonnel',
                    label: '业务负责人',
                    width: "100",
                    isShow: true
                },{
                    prop: 'createName',
                    label: '登记人',
                    width: "180",
                    isShow: true
                },
                {
                    prop: 'createTime',
                    label: '登记时间',
                    width: "180",
                    isShow: true
                },{
                    prop: "",
                    label:"操作",
                    fixed: "right",
                    width: "150",
                    isShow: true,
                    render: (h, parms) => {
                        // 不是项目创建人或者负责人不能编辑
                        let canEdit = false
                        if(parms.row.businessPersonnel === this.userName || 
                            parms.row.createName === this.userName) {
                            canEdit = true
                        }
                        return [
                            this.$has('joint:project:edit') ? h('el-button', {
                                props:{ type: 'text', },
                                attrs:{ disabled: parms.row.audit === '0' && canEdit ? false : true , },
                                on:{
                                    click: () => {
                                        this.transform.isShowDetails = false
                                        getProById({id: parms.row.id }).then(res => {
                                            this.$router.push({
                                                path: 'projectRecordsAll',
                                                name: 'projectRecordsAll',
                                                params: {
                                                    info: res,
                                                    isEdit: true,
                                                    transform: this.transform
                                                }
                                            })
                                        })
                                    }
                                }
                            }, '编辑') : '',
                            h('el-button', {
                                props:{ type: 'text',},
                                on:{
                                    click: () => {
                                       lookShareProject({projectId: parms.row.id}).then(res => {
                                           if(res.length === 0){
                                               this.$message.warning("此项目没有共享人员!!!")
                                           }else{
                                               this.userList = []
                                               this.shareUserForm.userList = res
                                               this.choseProId = parms.row.id
                                               this.shareUserDialog = true
                                           }
                                       })
                                    }
                                }
                            }, '查看共享'),
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
                border: true,
                isOpenSummary: true
            },
            businessPersonnelList: [],
            projectTypeList: [],
            filterForm: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                businessType: '',
                projectType: '',
                businessPersonnelId: '',
                businessDepartment: '',
                jointPrincipal: '',
                createTime: '',
                updateTime: '',
                isBid: '',
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
            selectTime: '',
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
            bidOptions: [
                {
                    value: '1',
                    label: '中标'
                },
                {
                    value: '0',
                    label: '未中标'
                }
            ],
            transform: {
                isShowDetails: false
            }
        }
    },
    methods: {
        newReserve() {
            this.$router.push({
                path: 'projectRecordsAll',
                name: 'projectRecordsAll',
                params: {
                    isEdit: false,
                }
            })
        },
        searchModelSynopsis(boolean = true) {
            if (boolean) {
                this.filterForm.pageNo = '1'
                this.filterForm.pageSize = '10'
            }
            jointSearchList(this.filterForm).then(res => {
                this.tableData = res
            })
        },
        resetSearch() {
            this.filterForm = {
                name: '',
                pageNo: '1',
                pageSize: '10',
                businessType: '',
                projectType: '',
                businessPersonnelId: '',
                businessDepartment: '',
                jointPrincipal: '',
                createTime: '',
                updateTime: '',
                isBid: '',
            }
            this.selectTime = []
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
            this.filterForm.createTime = this.selectTime ? this.selectTime[0] : ''
            this.filterForm.updateTime = this.selectTime ? this.selectTime[1] : ''
            this.searchModelSynopsis()
        },
        handlePaginationChange(data){
            this.filterForm.pageNo = data.current
            this.filterForm.pageSize = data.size
            this.searchModelSynopsis(false)
        },
        getList(){
            getAllProList().then(res => {
                this.tableData = res
            })
        },
        shareProject(){
            if(this.proArr.length === 0){
                this.$message.warning("请选择要共享的项目!!!")
            } else {
                // let canShare = false
                // this.proArr.forEach(item => {
                //     if(item.businessPersonnel === this.userName || item.createName === this.userName) {
                //         canShare = true
                //     }
                // })
                // if(canShare) {
                    this.isShow = true
                // } else {
                //     this.$message.warning("你不是项目的创建者或者负责人，不能进行共享!!!")
                // }
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
            let list = this.proArr && this.proArr.length > 0 ? JSON.parse (JSON.stringify (this.proArr)) : JSON.parse (JSON.stringify (this.tableData.records))
            list.forEach (res => { res.isAttention = res.isAttention == 0 ? '未关注' : '关注' })
            console.log(list);
            this.$refs.table.printTable (list)
        },
        getExportData () {
            this.exportData = JSON.parse(JSON.stringify((this.tableData.records))) || [];
            return new Promise((resolve, reject) => {
                this.exportData.forEach((item,index) => {
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

        getStaffAllList () {
            getstaffListAll().then(res => {
                this.businessPersonnelList = res
            })
        }
    },
    created () {
        this.getStaffAllList ()
        getCompanyDepDic().then(res => { this.departList = res })
    },
    mounted() {
        this.getList()
        getProjectAllOptions().then(res => {
            this.JointPersonList = res.customer
            this.qualificationList = res.aptitude
            this.projectTypeList = res.projectType
            this.allUser = this.$store.getters['d2admin/allUser/getData']
        })
    },
}
</script>

<style lang="scss">
.address-book {
    .d2-container-full .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .address-book-header {
        .el-range__close-icon{ line-height: 22px !important; }
        .el-date-editor{
            width: 300px;
            height: 30px;
            margin-right: 10px;
            .el-range-input{
                width: 42%;
            }
            .el-range-separator{
                width: 7%;
                line-height: 23px;
            }
            .el-range__icon{
                line-height: 20px;
            }
        }
        .address-book-header___search {
            .address-book-header-button{
                margin-right: 10px;
            }
            .el-input {
                width: 10%;
                padding-right: 10px;
            }
        }
        .qqt-container-full-header-operation___right {
            padding: 0 5px;
            p {
                display: inline-block;
            }
            .qqt-container-full-header-state___select {
                padding-left: 10px;
                width: 7%;
                // height: 30px;
                display:inline-block;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
                width: 20%;
                height: 29px !important;
                .el-range-separator {
                width: 10% !important;
                }
            }
        }
        .header-form{
            margin-top: 15px;
            overflow: hidden;
            .el-form-item{
                margin-bottom: 0px;
            }
            .bottom .el-form-item{
                margin-bottom: 0px;
            }
            .el-form-item__label{
                line-height: 35px;
            }
            .el-form-item__content{
                line-height: 35px;
                .el-input__inner{
                    height: 35px;
                }
            }
        }
    }
    .address-book-center {
        height: 100%;
        overflow-y: scroll;
    }
    // .project-name-cell{
    //     .el-table__body-wrapper{
    //         .el-table__row td:nth-child(5){
    //             span{ 
    //                 display: inline-block;
    //                 width: 100%;
    //                 text-overflow: ellipsis;
    //                 overflow: hidden;
    //                 white-space: nowrap;
    //                 text-align: left;
    //             }
    //         }
    //     }
    // }
}
</style>
