<template>
   <d2-container type="fulls" class="parameterSetting">
        <el-tabs @tab-click="tabClick" v-model="activeName"  type="border-card" class="cardTabs">
            <el-tab-pane name="1" :label="tabTop ? '销售方' : '购买方'" >
                 <el-form :inline="true">
                    <el-form-item >
                        <el-button type="primary" size="mini" v-if="auth.add" class="qqt-container-full-header-top___button" @click="addFun">添加</el-button>
                    </el-form-item>
                    <el-form-item >
                        <el-input
                            placeholder="请输入内容"
                            style="width:150px;"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchData"
                            v-model="search.name" size="mini">
                        </el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" size="mini" class="qqt-container-full-header-top___button" @click="searchData">搜索</el-button>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="info" size="mini" class="qqt-container-full-header-top___button" @click="reset">重置</el-button>
                    </el-form-item>
                    <el-form-item label prop="dateTime"> 
                       <el-date-picker
                        v-model="dateTime"
                        style="width:250px"
                        type="daterange"
                        size="mini"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd"
                        @change="searchData"
                        end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                 </el-form>
                <div class="qqt-container-full___center">
                    <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :rowHeader="rowHeader"  :option="tableOption"  @page="handlePaginationChange" />
                </div>
            </el-tab-pane>
            <el-tab-pane name="2" :label="tabTop ? '购买方' : '销售方'">
                <add-detail ref="tabsDetail" :data="ourData" :isEdit="!auth.save" :title="detailTitle"></add-detail>
                <div style="text-align:center">
                    <el-button size="small"  type="primary" v-if="auth.save" @click="saveFun">保存</el-button> 
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="60%"
            @close="detailCancel"
            v-dialogDrag
            :close-on-click-modal="false"
            >
            <add-detail ref="tabsDialog" :data="detailData" :isEdit="isEdit" :title="detailTitle" :tabTop="tabTop"></add-detail>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailCancel">取 消</el-button>
                <el-button type="primary" @click="detailOk">确 定</el-button>
            </span>
        </el-dialog>
   </d2-container>
</template>

<script>
    import { qqtTable, qqtSelect } from '@/components/qqt-subassembly'
    import { parameterPage, parameterDeleteDataPage, parameterEdit, parameterAdd, onOurPart} from '@/api/selfProject/controlOverInvoices/parameterSetting'
    import { mapState } from 'vuex'
    import addDetail from './components/addDetail.vue';
    import util from '@/libs/util.js'
    export default {
        components: {
            qqtTable,
            addDetail
        },
        name:'parameterSetting',
        data() {
            let vm = this;
            return {
                auth:{
                    add:false,
                    edit:false,
                    del:false,
                    save:false,
                },
                detailData: {},
                ourData:{},
                dialogTitle: '添加',
                detailTitle: '',
                dialogVisible: false,
                activeName: '1',
                tabTop:false,
                isEdit:false,
                dateTime:null,
                search:{
                    name:''
                },
                tableOption: {
                    border: false
                },
                tableData:{records:[]},
                identification:'',
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                rowHeader: [
                    {
                        prop: 'name',
                        label: '销售方名称',
                        isShow: true
                    },
                    {
                        prop: 'bank',
                        label: '开户行及账号',
                        isShow: true
                    },
                    {
                        prop: 'address',
                        label: '地址、电话',
                        isShow: true
                    },
                    {
                        prop: 'registerNum',
                        label: '纳税人识别号',
                        isShow: true
                    },
                    {
                        prop: 'createName',
                        label: '设置人',
                        isShow: true,
                    },
                    {
                        prop: 'createTime',
                        label: '设置时间',
                        isShow: true,
                    },
                    {
                        prop: '',
                        label: '操作',
                        isShow: true,
                        fixed: 'right',
                        width: '150',
                        render: (h, params) => {
                            return [
                                this.auth.edit ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                    on:{
                                        click: () => {
                                            this.dialogTitle = '编辑'
                                            this.detailData = params.row;
                                            this.dialogVisible = true;
                                            this.isEdit = true;
                                        }
                                    }
                                }, '编辑'):'',
                                this.auth.del ? h('el-button', {
                                    props:{
                                        type: 'text',
                                    },
                                   on:{
                                        click: () => {
                                            this.deleteById (params.row.id)
                                        }
                                    }
                                }, '删除'):''
                            ]
                        }
                    }
                ]
            }
        },
        methods: {
            getOnOurPart () {
                let obj = {
                    'invoiceSource':this.tabTop && this.activeName == '2' ? 2 : 1,
                    'purchaser':this.tabTop && this.activeName == '2' ? 1 : 0
                }
                onOurPart (obj).then(res => {
                    this.ourData = res;
                    this.ourData.id ? this.isEdit = true : this.isEdit = false
                })
            },
            showBtn (type) {
                let flag = true;
                switch (type) {
                    case 'add':
                    case 'save':
                       
                        break;
                
                    default:
                        break;
                }
                return flag
            },
            saveFun () {
                  this.$refs.tabsDetail.getData().then(res => {
                    let url = this.ourData.id ? parameterEdit : parameterAdd
                    // 销售方0 购买方1
                    // 进项购买方  //销项发票 销售方
                    let jsonData = {
                        ...res,
                        'invoiceSource':this.tabTop && this.activeName == '2' ? 2 : 1,
                        'purchaser':this.tabTop && this.activeName == '2' ? 1 : 0
                    }
                    url (jsonData).then (data => {
                        if (this.ourData.id) {
                            this.$message.success('修改成功')
                        } else {
                            this.$message.success('添加成功')
                        }
                        this.ourData = data;
                    })
                  })
            },
            tabClick () {
                if (this.activeName == '1' && this.tabTop) {
                    this.detailTitle = '销售方'
                } else if (this.activeName == '1' && !this.tabTop) {
                    this.detailTitle = '购买方';
                } else if (this.activeName == '2' && !this.tabTop) {
                    this.detailTitle = '销售方'
                    this.getOnOurPart();
                } else {
                    this.getOnOurPart();
                    this.detailTitle = '购买方'
                }
            },
            detailCancel () {
                this.$refs.tabsDialog.$refs.ruleForm.resetFields()
                this.dialogVisible = false;
            },
            detailOk () {
                this.$refs.tabsDialog.getData().then(res => {
                    let url = this.dialogTitle === '添加' ? parameterAdd : parameterEdit

                    let jsonData = {
                        ...res,
                        'invoiceSource':this.tabTop ? 2 : 1,
                        'purchaser':this.tabTop ? 0 : 1
                    }
                    url (jsonData).then (data => {
                        if ( this.dialogTitle === '添加') {
                            this.$message.success('添加成功')
                            this.tableData.records.splice(0,0,data);
                            this.tableData.total ++;
                        } else {
                            this.tableData.records.splice(0,1,data);
                            this.$message.success('修改成功')
                        }
                        this.dialogVisible = false;
                    })
                })

            },
            // 添加
            addFun() {
                this.dialogTitle =  '添加';
                this.isEdit = false;
                this.dialogVisible = true;
                this.detailData = {};
            },
            deleteById (id) {
                util.confirm ().then (boolean => {
                    if (boolean) {
                        parameterDeleteDataPage ({
                            'id': id
                        }).then(res => {
                            let index = this.tableData.records.findIndex (res=> res.id === id)
                            this.tableData.records.splice(index,1);
                            this.tableData.total --;
                            this.$message.success(res.message)
                        })
                       
                    }
                })
            },
            // 搜索
            searchData () {
                if (this.dateTime) {
                    this.page.createTime = this.dateTime[0] + ' 00:00:00';
                    this.page.updateTime = this.dateTime[1] + ' 23:59:59';
                } else {
                    this.page.createTime = ''
                    this.page.updateTime = ''
                }
               this.queryList ({createTime:this.page.createTime,updateTime:this.page.updateTime})
            },
            queryList (data) {
                parameterPage ({
                    ...data,
                    'name':this.search.name,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'invoiceSource':this.tabTop ? 2 : 1,
                    'purchaser':this.tabTop ? 0 : 1

                }).then((result) => {
                    this.tableData = result;
                }).catch((err) => {
                    
                });
            },
            // 重置
            reset () {
                this.search.name = '';
                this.dateTime = null;
                this.page.createTime = '';
                this.page.updateTime = '';
                this.queryList();
            },
            dateChange (value) {

            },
            handlePaginationChange (page) {
                this.page = page;
                this.$nextTick(() => {
                    this.queryList ()
                });
            },
            judge () {

                var result =  this.$route.path.endsWith("tabTop/1") || this.$route.path.endsWith("income/1");
                //  || this.$route.path.endsWith("tabTop/2")
                this.tabTop = result
                return result
            },
            decideLoadDataWay () {
                this.identification = this.$route.params.identification
                if (this.identification == '1') {
                    this.activeName = '1';
                    this.tabTop = true;
                } else {
                    this.activeName = '2';
                    this.tabTop = false;
                }
                 if (this.activeName == '1' && this.tabTop) {
                    this.detailTitle = '销售方'
                } else if (this.activeName == '1' && !this.tabTop) {
                    this.detailTitle = '购买方'
                } else if (this.activeName == '2' && !this.tabTop) {
                    this.detailTitle = '销售方'
                } else {
                    this.detailTitle = '购买方'
                }
                this.search.name = '';
                this.dateTime =null;
                this.page.createTime = '';
                this.page.updateTime = '';
                this.queryList();
            },
            _validationAuth () {
                // 外层发票 进项发票 销售方  invoiceSource 2 purchaser 0  购买方 invoiceSource 2 purchaser 1
                // 外层发票 销项发票 销售方  invoiceSource 1 purchaser 1  购买方 invoiceSource 1 purchaser 0

                // 自营项目 进项发票 销售方  invoiceSource 2 purchaser 0  购买方 invoiceSource 2 purchaser 1
                // 自营项目 销项发票 销售方  invoiceSource 1 purchaser 1  购买方 invoiceSource 1 purchaser 0
                if (this.$route.path.endsWith("tabTop/1")) {
                    this.auth.add  = this.$has ('invoice:parameter:add:2s')
                    this.auth.edit = this.$has ('invoice:parameter:edit:2s')
                    this.auth.del  = this.$has ('invoice:parameter:delete:2s')
                    this.auth.save = this.$has ('invoice:parameter:add:2p')
                } else if (this.$route.path.endsWith("tabTop/2")) {
                    this.auth.add  = this.$has ('invoice:parameter:add:1p')
                    this.auth.edit = this.$has ('invoice:parameter:edit:1p')
                    this.auth.del  = this.$has ('invoice:parameter:delete:1p')
                    this.auth.save = this.$has ('invoice:parameter:save:1s')
                } else if (this.$route.path.endsWith("income/1")) {
                    this.auth.add  = this.$has ('invoice:parameter:add:2ss')
                    this.auth.edit = this.$has ('invoice:parameter:edit:2ss')
                    this.auth.del  = this.$has ('invoice:parameter:delete:2ss')
                    this.auth.save = this.$has ('invoice:parameter:add:2ps')
                } else if (this.$route.path.endsWith("output/2")) {
                    this.auth.add  = this.$has ('invoice:parameter:add:1ps')
                    this.auth.edit = this.$has ('invoice:parameter:edit:1ps')
                    this.auth.del  = this.$has ('invoice:parameter:delete:1ps')
                    this.auth.save = this.$has ('invoice:parameter:add:1ss')
                } else if (this.$route.path.endsWith("jointProjectOutput/1")) {
                    this.auth.add  = this.$has ('invoice:parameter:add:2sj')
                    this.auth.edit = this.$has ('invoice:parameter:edit:2sj')
                    this.auth.del  = this.$has ('invoice:parameter:delete:2sj')
                    this.auth.save = this.$has ('invoice:parameter:add:2pj')
                } else if (this.$route.path.endsWith("jointProjectOutput/2")) {
                    this.auth.add  = this.$has ('invoice:parameter:add:1pj')
                    this.auth.edit = this.$has ('invoice:parameter:edit:1pj')
                    this.auth.del  = this.$has ('invoice:parameter:delete:1pj')
                    this.auth.save = this.$has ('invoice:parameter:add:1sj')
                }
            },
        },
        mounted () {
            this.decideLoadDataWay();
        },
        created () {
            this._validationAuth();
            this.judge();
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.getOnOurPart()
            });
        },
        watch: {
            $route (val) {
                if (val.path.indexOf('parameterSetting') !== -1) {
                    this.decideLoadDataWay ()
                    this.judge();
                    this.getOnOurPart()
                    this._validationAuth();
                }
            }
        },
    }
</script>

<style lang="scss" >
.parameterSetting{
    .cardTabs{
        height: 100%;
    }
    .el-date-editor .el-range-separator{
       padding: 0px;
    }
}
</style>