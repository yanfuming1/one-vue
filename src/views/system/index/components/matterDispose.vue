<template>
    <el-card shadow="never" class="matter-dispose">
        <div slot="header" class="clearfix">
            <span>事项处理</span>
            <i class="iconfont iconwofuzede"/>
            <div class="line"></div>
        </div>
        <el-row>
            <el-button size="mini" round autofocus @click="requestType = 'BACKLOG', getTableData (), btnTitle = '办理'">我的待办</el-button>
            <el-button size="mini" round @click="requestType = 'HAVE_FINISHED', getTableData (), btnTitle = '查看'">我的已办</el-button>
            <el-button size="mini" round @click="requestType = 'APPLY_FINISHED', getTableData (), btnTitle = ''">已完结</el-button>
        </el-row>
        <div class="matter-dispose-table" v-show="processList.length > 0">
            <tr v-for="(item, index) in processList" :class="{'tableColor': index % 2 == 0}">
                <td>
                    <div class="matter-dispose-table-dot"></div>
                    {{ item.processVariables.title }}
                </td>
                <td>{{ item.processVariables.initiatorUserName }}</td>
                <td>{{ item.startTime }}</td>
                <td>
                    <el-button v-if="requestType != 'APPLY_INTERRUPT' && requestType != 'APPLY_FINISHED'" type="text" @click="transactionFlow (item)">{{ btnTitle }}</el-button>
                </td>
            </tr>
        </div>
        <div v-show="processList.length == 0" class="matter-dispose-empty">暂无数据</div>
    </el-card>
</template>

<script>
    import { getProcessPage, getModelList, hasten,pendingCount} from '../../../../api/approval/common';
    export default {

        data () {
            return {
                processList: [],
                requestType: 'BACKLOG',
                btnTitle: '办理'
            }
        },

        methods: {

            getTableData () {
                getProcessPage ({'requestType': this.requestType}).then( res => {
                   // console.log(res.records)
                    this.processList = res.records
                })
            },
          //点击按钮
            transactionFlow (item) {
                let data = JSON.parse(JSON.stringify(item));
                data.pathName = this.verdictIdentification (this.requestType)
                data['transform'] = this.pageShow (data)
                this.routerLink (data)
            },

            routerLink (data) {
                const { pathName, procInstId, taskId, transform, procDefId } = data
                const { relevancyId, degree, formKey, title } = data.processVariables
                this.$router.push({
                    path: data.processVariables.formKey,
                    name: data.processVariables.formKey,
                    params: {
                        detailData: JSON.stringify(data),
                        title,
                        taskId,
                        degree,
                        formKey,
                        pathName,
                        procDefId,
                        transform,
                        procInstId,
                        relevancyId
                    }
                })
            },

            pageShow (data) {
                let item = {
                isShowDetails: true
                }
                switch (data.pathName) {
                case 'sendBack':
                    item.isShowDetails = false
                    break;
                case 'examine':
                    if (data && data.processVariables && data.processVariables.processState === '6') {
                    item.isShowDetails = false
                    }
                    break
                }
                return item
            },

            verdictIdentification (type) {
                let item = ''
                switch (type) {
                    case 'BACKLOG':
                        item = 'backlog'
                        break
                    case 'HAVE_FINISHED':
                        item = 'finishedProcess'
                        break
                    case 'START':
                        item = 'examine'
                        break
                    case 'WAITING_SUBMIT':
                        item = 'examine'
                        break
                    case 'APPLYING':
                        item = 'examine'
                        break
                    case 'SEND_BACK':
                        item = 'sendBack'
                        break
                    case 'APPLY_INTERRUPT':
                        item = 'alreadyApproved'
                        break
                    case 'APPLY_FINISHED':
                        item = 'alreadyApproved'
                        break
                }
                return item
            }
        },

        created () {
            this.getTableData ()
        }
    }
</script>

<style lang='scss'>
    .matter-dispose {
        border: solid 1px transparent !important;
        .clearfix {
            font-size: 16px;
            .line {
                border-bottom: 2px solid $startusing;
                width: 67px;
                position: relative;
                top: 8px
            }
            i {
                float: right;
                color: $startusing;
                font-size: 24px;
                position: relative;
                top: -6px;
            }
        }
        .el-card__header {
            border-bottom: 1px solid transparent !important;
            padding: 0 0 10px 0px !important
        }
        .el-card__body {
            padding: 20px 0 0 0 !important
        }
        .matter-dispose-table {
            margin-top: 15px;
            height: 185px;
            overflow: auto;
            border-collapse:collapse;
            .matter-dispose-table-dot {
                border-radius: 50%;
                width: 7px;
                height: 7px;
                background: #84b7fa;
                position: relative;
                top: -1px;
                right: 5px;
                display: inline-block;
            }
            .tableColor {
                background: $color-bg4;
            }
            tr {
                border: solid 1px $color-straight-line2;
                height: 41px;
                line-height: 41px;
            }
            th, td {
                width: 48%;
                padding: 0px 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            tr:hover {
                background: $color-table-hover
            }
        }
        .matter-dispose-empty {
            text-align: center;
            padding-top: 20px;
            color: $color-text-placehoder
        }
    }
</style>
