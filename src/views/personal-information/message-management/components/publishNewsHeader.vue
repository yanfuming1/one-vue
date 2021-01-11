<template>
    <div>
        <el-form :inline="true" ref="form" size="mini">
            <el-form-item v-if="$has ('administer:message:add')" >
                <el-button type="primary" @click="addPublishEven">添加</el-button>
            </el-form-item>
            <el-form-item label prop="name">
                <el-input v-model="keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dataSearch">搜索</el-button>
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
            <el-form-item>状态</el-form-item>
            <el-form-item label prop="state">
                <el-select v-model="state" placeholder="请选择要搜索的状态" style="width: 160px;" clearable @change ="stateData" value="">
                    <el-option label="已下线" value="0" />
                    <el-option label="已发布" value="1" />
                    <el-option label="未发布" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>办理状态</el-form-item>
            <el-form-item label prop="procState">
                <el-select v-model="procState" placeholder="请选择要搜索的状态" style="width: 160px;" clearable @change ="procStateData" value=" ">
                    <el-option label="初始化" value="1" />
                    <el-option label="待审批" value="2" />
                    <el-option label="审批中" value="3" />
                    <el-option label="已驳回" value="4" />
                    <el-option label="已作废" value="5" />
                    <el-option label="已完结" value="10" />
                    <el-option label="待提交" value="6" />
                </el-select>
            </el-form-item>
            <el-form-item>审核状态</el-form-item>
            <el-form-item label prop="audit">
                <el-select v-model="audit" placeholder="请选择要搜索的状态" style="width: 160px;" clearable @change ="auditData" value="">
                    <el-option label="未审核" value="0" />
                    <el-option label="已审核" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="clearAll">重置</el-button>
            </el-form-item>
            <el-form-item v-if="$has ('administer:message:delete')">
                <el-button type="primary" @click="deletePubilshNews">批量删除</el-button>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button size="mini" icon="el-icon-check" @click="toExamineMessageEvent">审核</el-button>
                    <el-button size="mini" icon="el-icon-close" @click="unExamineMessageEvent">反审核</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                </el-button-group>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'publishNewsHeader',
        data () {
            return {
                radio1: '全部',
                keywords: '',
                state: '',
                procState: '',
                audit: '',
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
            };
        },
        methods: {
            dataSearch () {
                this.$emit('dataSearch', this.keywords, this.createDate)
            },
            stateData () {
                this.$emit('stateData', this.state)
            },
            procStateData () {
                this.$emit('procStateData', this.procState)
            },
            auditData () {
                this.$emit('auditData', this.audit)
            },
            addPublishEven () {
                this.$emit('addPublishEven')
            },
            deletePubilshNews () {
                this.$emit('deletePubilshNews')
            },
            clearAll () { 
                this.keywords = this.state = this.procState = this.audit = ''
                this.$emit('clearAll')
            },
            toExamineMessageEvent () {
                this.$emit('toExamineMessageEvent')
            },
            unExamineMessageEvent () {
                this.$emit('unExamineMessageEvent')
            },
            printTable () {
                this.$emit ('printTable')
            }
    }
    }
</script>

<style scoped>
  
</style>