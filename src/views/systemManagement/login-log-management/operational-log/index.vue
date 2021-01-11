<template>
    <d2-container>
        <template>
            <div slot="header" class="work-adjustment-header">
                <el-form :inline="true" :model="form" ref="form" size="mini">
                    <el-form-item label prop="name">
                        <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" @keyup.enter.native="operationalData" style="width: 200px;" :clearable="true" />
                    </el-form-item>
                    <el-form-item label="" prop="status">
                        <el-select v-model="form.status" placeholder="请选择要搜索的状态" style="width: 160px;" clearable @change.native="statusData" value="">
                            <el-option label="成功" value="1"/>
                            <el-option label="失败" value="0"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="dataSearch">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="handleFormReset">
                            重置
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker
                            size="mini"
                            v-model="createDate"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至" 
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['08:00:00', '18:00:00']"
                            @change="dataSearch()" 
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-if="$has('sys:log:del')" @click="deleteAll"> 批量删除 </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 表格数据内容 -->
            <div class="operational-log">
                 <qqt-table :data="operationalLogData" :show-overflow-tooltip="true" :rowHeader="rowHeader" :option="tableOption"
                    @selectionChange="selectChange" @page="handlePaginationChange" :dynamicHeader="dynamicHeader">
                </qqt-table>
            </div>
               
        </template>
    </d2-container>
</template>
<script>
    import { operationalLog ,operationalLogDelete ,operationalPaging,delAll} from '../../../../api/system/loginLog/operationalLog'
    let that = this
    export default {
        data() {
            return {
                operationalLogData:{},
                // 单行删除数据
                delItem: {
                    id: '',
                },

                form: {
                    keywords: '',
                    status: '',
                },

                // 时间搜索
                createDate: [],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick (picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, 
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }, 
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                // 批量删除
                multipleSelection: [],
                searchName: '',
                rowHeader: [
                    {
                        prop: 'createdBy',
                        label: '用户名',
                        isShow:true
                    },
                    {
                        prop: 'model',
                        label: '用户操作',
                        isShow:true
                    },
                    {
                        prop: 'url',
                        label: '请求URL',
                    },
                    {
                        prop: 'time',
                        label: '请求时长（秒）',
                        isShow:true
                    },
                    {
                        prop: 'status',
                        label: '状态',
                        isShow: true,
                        render:(h, params) =>{
                            return h('div', {

                            }, params.row.status === '1' || params.row.status === '成功' ? '成功' : '失败')
                        },

                    },
                    {
                        prop: 'ip',
                        label: '操作IP',
                        isShow:true
                    },
                    {
                        prop: 'facility',
                        label: '登录设备信息',
                       
                        render:(h) =>{
                            return h('div', {
                    
                            }, navigator.userAgent)
                        },
                        isShow:true
                    },
                    {
                        prop: 'createdTime',
                        label: '登录时间',
                        isShow:true
                    },
                    {
                        prop: '',
                        label: '操作',
                        render: (h,params) => {
                            return this.$has ('sys:log:del') ? h('el-button', {
                                props: {
                                    type: 'text'
                                },
                                  on: {
                                    click: () => {
                                        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            cancelButtonClass: "btn-custom-cancel",
                                            type: 'warning'
                                        }).then(() => {
                                            that.delItem.id = params.row.id
                                            operationalLogDelete(
                                                {id : params.row.id}
                                            ).then(res => {
                                                this.operationalData();
                                                this.$message.success('操作成功')
                                            }).catch(err => {
                                                this.$message.error('删除失败')
                                            });
                                        }).catch(() => {
                                            this.$message({
                                                type: 'info',
                                                message: '已取消删除'
                                            });          
                                        });
                                    },
                                }
                            }, '删除') : ''
                        },
                        isShow:true
                        
                    }
                ],
                tableOption: {
                    border: false
                },
                dynamicHeader: {
                    tableId: 'T_1018017584',
                    isSave: true
                },
                pageNo: 0,
                loading: false,
                page: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                cat: [],
            }
        },
        methods: {
            operationalData (form, status) {
                operationalLog({
                    ...form,
                    ...status,
                    pageNo: this.page.current,
                    pageSize: this.page.size
                  }).then(res => {
                  this.page.total = res.total
                  this.operationalLogData = res.total > 0 ? res : {}
                })
            },

            handleFormReset() {
                this.form.keywords = ''
                this.form.status = ''
                this.createDate = []
                this.operationalData ()
            },

            deleteAll(){
                if (this.multipleSelection.length <= 0 ){
                    this.$message.warning('请选择要删除的数据')
                } else {
                     this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        cancelButtonClass: "btn-custom-cancel",
                        type: 'warning'
                    }).then(() => {
                        let str = '';
                        if (this.multipleSelection && this.multipleSelection.length > 0) {
                            this.multipleSelection.forEach(res => {
                                str += res.id + ','
                            })
                            delAll({ids:str.substring(0, str.length - 1)}).then(res => {
                                this.operationalData();
                                this.$message.success('操作成功')
                            })
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
            },

             // 搜索
            dataSearch (boolean = true) {
                if (boolean) this.resetPage ()
                this.operationalData({
                    'status': this.form.status ? this.form.status : null,
                    'keywords': this.form.keywords ? this.form.keywords : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime':this.createDate ? this.createDate[1] : null
                })
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            },

            // 复选框选中的数据
            selectChange(val) {
                this.multipleSelection = val
            },
            // 分页变化改动
            handlePaginationChange(val) {
                this.page = val
                operationalPaging({

                }).then(res => {
                    that.operationalPaging = val
                })
                this.$nextTick(() => {
                    this.dataSearch(false)
                })
            },
        },

        components: {
            qqtTable: () => import('../../../../components/qqt-subassembly/qqt-table/qqt-table')
        },
        mounted() {
            this.operationalData()
            that = this
        }
    }
</script>

<style lang="scss" scoped>
    .operational-log-header{
        margin-bottom: -25px
    }
    .operational-log{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
</style>
