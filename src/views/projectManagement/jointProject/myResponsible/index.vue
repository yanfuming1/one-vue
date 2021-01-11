<template>
    <d2-container class="address-book">
        <template slot="header">
            <div class="address-book-header">
                <el-row>
                    <el-col :span="24">
                        <span class="address-book-header___search">
                            <!-- <el-button type="primary" size="mini" class="address-book-header-button" @click="newReserve">添加</el-button> -->
                            <el-input
                                placeholder="请输入内容"
                                prefix-icon="el-icon-search"
                                v-model="filterForm.name"
                                size="mini">
                            </el-input>
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
                        </span>
                        <!-- <span class="customer-list-header-operation___right">
                            <el-button-group>
                                <el-button size="mini" icon="el-icon-download" @click="">筛选</el-button>
                                <el-button size="mini" icon="el-icon-upload2" @click="">导入</el-button>
                                <el-button size="mini" icon="el-icon-position" @click="">导出</el-button>
                            </el-button-group>
                        </span> -->
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form ref="form" class="header-form" :model="filterForm" label-width="120px">
                            <el-col :span="12">
                                <el-form-item label="资质要求:">
                                    <el-select v-model="filterForm.qualificationRequirement" size="mini" clearable style="width:100%;" @change="searchModelSynopsis" placeholder="请选择">
                                        <el-option v-for="item in qualificationList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联营负责人:">
                                    <el-select v-model="filterForm.jointPrincipal" size="mini" clearable style="width:100%;" @change="searchModelSynopsis" placeholder="请选择">
                                        <el-option v-for="item in JointPersonList"
                                            :key="item.id"
                                            :label="item.cusName"
                                            :value="item.cusName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </template>
        <div class="address-book-center">
            <qqt-table
                :data="tableData"
                :rowHeader="rowHeader"
                :option="tableOption"
                :dynamicHeader="dynamicHeader"
                @selectionChange="selectChange"
                @page="handlePaginationChange"></qqt-table>
        </div>
    </d2-container>
</template>

<script>
import { qqtTable } from '../../../../components/qqt-subassembly'
import menu from '../../../../layout/header-aside/components/mixin/menu'
import { allCustomerList,jointResponsibleList,getProById,jointScopeAddOrCancelAttention } from '../../../../api/jointProject/index'
import { PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { queryDicById } from '../../../../api/system/dic/dic'
import util from '../../../../libs/util'
import { mapActions } from 'vuex'
let temDb = ''
export default {
    name: "index",
    components: {
        qqtTable,
    },
    data () {
        return {
            filterForm: {
                name: '',
                pageNo: '1',
                pageSize: '10',
                jointPrincipal: '',
                qualificationRequirement: '',
                createTime: '',
                updateTime: '',
            },
            selectTime: [],
            JointPersonList: [],
            tableOption: {
                border: false,
                height: 555
            },
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
            tableData: {},
            rowHeader: [
                {
                    prop: '',
                    label: '  ',
                    isShow: true,
                    width: 30,
                    render: (h, parms) => {
                        return h('i', {
                            attrs: {
                                class: 'iconfont iconwuxing'
                            },
                            style:{
                                color: parms.row.isAttention === '1' ? '#409EFF' : '#999',
                            },
                            on:{
                                click: () => {
                                    jointScopeAddOrCancelAttention({id: parms.row.id
                                    }).then(res => {
                                        if (parms.row.isAttention === '1') {
                                            this.$message.success("取消关注~~~")
                                            parms.row.isAttention = '0';
                                        } else {
                                            this.$message.success("关注成功~~~")
                                            parms.row.isAttention = '1';
                                        }
                                    })
                                    this.searchModelSynopsis()
                                }
                            }
                        }, "")
                    }
                },{
                    prop: 'itemNumber',
                    label: '项目编码',
                    isShow: true,
                    width: 150,
                    render: (h, parms) => {
                        return h('div', {
                            style:{color: '#409EFF', cursor: 'pointer' },
                            on:{
                                click: async () => {
                                    menu.methods.handleMenuSelect('/jontProjectDetail')
                                    const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                    db.set('proID', parms.row.id).write()
                                    db.set('proCode', parms.row.itemNumber).write()
                                }
                            }
                        }, parms.row.itemNumber)
                    }
                },{
                    prop: 'projectName',
                    label: '项目名称',
                    width: 200,
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            style:{color: '#409EFF', cursor: 'pointer' },
                            on:{
                                click: async () => {
                                    menu.methods.handleMenuSelect('/jontProjectDetail')
                                    const db = await this.$store.dispatch('d2admin/db/database', {user: true})
                                    db.set('proID', parms.row.id).write()
                                    db.set('proCode', parms.row.itemNumber).write()
                                }
                            }
                        }, parms.row.projectName)
                    }
                },{
                    prop: 'projectType',
                    label: '项目类别',
                    width: 150,
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {}, parms.row.projectType === null ? '无' : parms.row.projectType)
                    }
                },{
                    prop: 'biddingCompanyName',
                    label: '投标公司',
                    width: 180,
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {}, parms.row.biddingCompanyName === null ? '无' : parms.row.biddingCompanyName)
                    }
                },{
                    prop: 'qualificationRequirement',
                    label: '资质要求',
                    width: "120",
                    isShow: true,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.qualificationRequirement === null ? '无' : parms.row.qualificationRequirement)
                    }
                },{
                    prop: 'isBid',
                    label: '是否中标',
                    width: 100,
                    isShow: true,
                    render: (h, parms) => {
                        if (parms.row.isBid) {
                            return h('div', {}, parms.row.isBid === '1' ? '中标' : '未中标')
                        } else {
                            return h('div', {}, '未选择')
                        }

                    }
                },{
                    prop: 'tenderPrice',
                    label: '中标价格(元)',
                    isShow: true,
                    isMoney: true,
                    width: 120,
                    render: (h, parms) => {
                        return h('span', {}, parms.row.tenderPrice ? util.moneyTransform(parms.row.tenderPrice) : '无')
                    }
                },{
                    prop: 'projectManager',
                    label: '项目经理',
                    isShow: true,
                    width: 100,
                    render: (h, parms) => {
                        return h('div', {}, parms.row.projectManager === null ? '无' : parms.row.projectManager)
                    }
                },{
                    prop: 'associatedPerson',
                    label: '联营人',
                    width: 100,
                    isShow: true
                },{
                    prop: 'phone',
                    label: '联系电话',
                    width: 120,
                    isShow: true
                },{
                    prop: 'createTime',
                    label: '创建时间',
                    width: 180,
                    isShow: true
                },{
                    prop: "",
                    label:"操作",
                    width: 100,
                    fixed: 'right',
                    isShow: true,
                    render: (h, parms) => {
                        return [
                            h('el-button', {
                                props:{
                                    type: 'text',
                                },
                                attrs:{
                                    disabled: parms.row.audit ==='1' ? true :false ,
                                },
                                on:{
                                    click: () => {
                                        getProById({id: parms.row.id}).then(res => {
                                            this.$router.push({
                                                path: 'projectRecordsAll',
                                                name: 'projectRecordsAll',
                                                params: {
                                                    info: res,
                                                    isEdit: true,
                                                }
                                            })
                                        })
                                    }
                                }
                            }, '编辑'),
                        ]
                    }
                },
            ],
            dynamicHeader: {},
            qualificationList: [],
            clearable: true,
        }
    },
    async created () {
        temDb = await this.database()
        if(!util.isArray(temDb.value().JointPerson)){
            allCustomerList().then(res => {
                this.JointPersonList = res
                temDb.set('JointPerson', res).write()
            })
        } else {
            this.JointPersonList = temDb.value().JointPerson
        }
        queryDicById({
            id: PROJECT_GETINFOID.QUALIFICATIONREQUIREMENT
        }).then(res => {
            this.qualificationList = res
        })
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        getTime (time) {
            this.filterForm.createTime = time ? time[0] : ''
            this.filterForm.updateTime = time ? time[1] : ''
            this.getTableData()
        },
        searchModelSynopsis () {
            this.getTableData()
        },
        resetSearch () {
            this.selectTime = []
            this.filterForm.name = ''
            this.filterForm.pageNo = '1'
            this.filterForm.pageSize = '10'
            this.filterForm.jointPrincipal = ''
            this.filterForm.qualificationRequirement = ''
            this.filterForm.createTime = ''
            this.filterForm.updateTime = ''
            this.getTableData()
        },
        selectChange (data) {},
        handlePaginationChange (page) {
            this.filterForm.pageSize = page.size
            this.filterForm.pageNo = page.current
            this.getTableData()
        },
        getTableData () {
            jointResponsibleList(this.filterForm).then(res => {
                this.tableData = res
            })
        }
    },
    mounted () {
        this.getTableData()
    }
}
</script>

<style lang="scss">
.address-book {
    .d2-container-full .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .address-book-header {
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
        .header-form{
            margin-top: 15px;
            overflow: hidden;
            .el-form-item{
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
    }
}
</style>

