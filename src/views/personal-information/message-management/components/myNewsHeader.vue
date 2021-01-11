<template>
    <div>
        <el-form :inline="true" size="mini">
             <el-form-item label prop="name">
                <el-input v-model="keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" style="width: 200px;" :clearable="true"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dataSearch">搜索</el-button>
            </el-form-item>
            <el-form-item class="reset">
                <el-button type="info" @click="resetBtn"> 重置
                </el-button>
             </el-form-item>
            <el-button-group>
                <el-radio-group v-model="messageStateData" size="mini" @change="messageStateEven">
                    <el-radio-button label="2">全部</el-radio-button>
                    <el-radio-button label="0">未读</el-radio-button>
                    <el-radio-button label="1">已读</el-radio-button>
                </el-radio-group>
            </el-button-group>
            <el-button-group class="m-l-20">
                <el-button size="mini" @click="unreadLogoBtn">标为已读</el-button>
                <el-button size="mini" @click="logoReadBtn">全部已读</el-button>
            </el-button-group>
            <el-button-group class="m-l-20">
                <el-button size="mini" @click="batchDeletionBtn">批量删除</el-button>
                <el-button size="mini" @click="delAllBtn">全部删除</el-button>
            </el-button-group>
        </el-form>
        <el-form class="messageStatus">
            <i class="leftLine"></i> 消息类型
            <el-button plain  size="mini" @click="allNewsBtn">全部消息 ( {{ messageNumberData.All }} ) </el-button>
            <el-button plain  size="mini" @click="systemMessageBtn">系统消息 ( {{ messageNumberData.sysType }} ) </el-button>
            <el-button plain  size="mini" @click="announcementMessageBtn">公告消息 ( {{ messageNumberData.annType }} ) </el-button>
            <el-button plain  size="mini" @click="activityMessageBtn">通知消息 ( {{ messageNumberData.msgType }} ) </el-button>
            <el-button plain  size="mini" @click="otherNewsBtn">其他消息 ( {{ messageNumberData.otherType }} ) </el-button>
        </el-form>
    </div>
</template>
<script>
import { messageNumber } from "../../../../api/personal-information/messageManagement"
    export default {
        name: 'myNewsHeader',
        data () {
            return {
                messageStateData: '2',
                messageNumberData:{
                    All:'',
                    sysType:'',
                    annType:'',
                    msgType:'',
                    otherType:''
                },
                keywords:''
            };
        },
        methods: {
            messageNumberEven () {
                messageNumber ().then( res => {
                    this.messageNumberData = res
                }).catch( err => {
                    console.log(err)
                })
            },
            dataSearch () {
                this.$emit('dataSearch', this.keywords)
            },
            messageStateEven ( ) {
                this.$emit('messageStateEven',this.messageStateData)
            },
            unreadLogoBtn () {
                this.$emit('unreadLogoBtn')
            },
            logoReadBtn () {
                this.$emit('logoReadBtn')
            },
            batchDeletionBtn () {
                this.$emit('batchDeletionBtn')
            },
            delAllBtn () {
                this.$emit('delAllBtn')
            },
            resetBtn () {
                this.$emit('resetBtn')
                this.keywords = ''
            },
            allNewsBtn () {
                this.$emit('allNewsBtn')
            },
            systemMessageBtn () {
                this.$emit('systemMessageBtn')
            },
            announcementMessageBtn () {
                this.$emit('announcementMessageBtn')
            },
            activityMessageBtn () {
                this.$emit('activityMessageBtn')
            },
            otherNewsBtn () {
                this.$emit('otherNewsBtn')
            }
        },
        mounted () {
            this.messageNumberEven ()
        }
        
    }
</script>

<style scoped lang='scss'>
    .reset {
        padding-left: 15px
    }
    .fa-refresh:before {
        margin-right: 5px;
    }
    .messageStatus {
        margin: 10px;
        .leftLine {
            border-left: 3px solid #84b7fa;
            padding-right: 15px;
        }
    }
    .messageStatus > button{
        margin: 0 10px
    }
</style>