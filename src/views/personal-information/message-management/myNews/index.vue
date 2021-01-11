<template>
    <d2-container class="myNews">
        <template v-if="!isDetail">
            <template slot="header">
                <myNewsHeader
                    @dataSearch = "dataSearch"
                    @unreadLogoBtn="unreadLogoBtn" 
                    @logoReadBtn="logoReadBtn"
                    @batchDeletionBtn="batchDeletionBtn"
                    @delAllBtn="delAllBtn"
                    @resetBtn="resetBtn"
                    @allNewsBtn="allNewsBtn"
                    @systemMessageBtn="systemMessageBtn"
                    @announcementMessageBtn="announcementMessageBtn"
                    @activityMessageBtn="activityMessageBtn"
                    @otherNewsBtn="otherNewsBtn"
                    @messageStateEven="messageStateEven"
                    />
            </template>
            <!-- 表格内容  -->
            <div class="my-news-table">
                 <qqt-table :data="getMyMessageData" :rowHeader="rowHeader" :option="tableOption" @selectionChange="selectChange"></qqt-table>
            </div>
        </template>
  </d2-container>
</template>

<script>
import myNewsHeader from '../components/myNewsHeader'
import qqtTable from "../../../../components/qqt-subassembly/qqt-table/qqt-table";
import {myMessageList, pagedListSearch, newsDetails, myMessageBatchDeletion, myMessagedelAll, markedRead, allRead} from "../../../../api/personal-information/messageManagement"
    export default {
        data () {
            return {
                isDetail: false,
                getMyMessageData:{
                    records:  [],
                    browseNumber:''
                },
                dataInformation:[],
                rowHeader: [
                    {
                        prop: "title",
                        label: "标题",
                        isShow: true,
                        render: (h, params) => {
                            return  [
                            h ('div', {
                                    class: {
                                        'forbidden': params.row.browseNumber === 0,
                                    },
                            }),
                            h ('div', {
                                class: {
                                    'typefaceColor': true,
                                },
                                 on: {
                                    click: () => {
                                        newsDetails ({id:params.row.id}).then((res)=>{
                                            this.$router.push({
                                                path: 'newsDetail',
                                                name: 'newsDetail',
                                                params: {
                                                    detailData: res
                                                }
                                            })
                                        })
                                    }
                                }
                            }, params.row.title)
                            ]
                        }
                    },
                    {
                        prop: "type",
                        label: "消息类型",
                        isShow: true,
                         render:(h, params) =>{
                            return h('div', {

                            }, params.row.type === '1' ? '系统消息' : ( params.row.type === "2" ? '公告消息' : ( params.row.type === "3" ? '通知消息' : "其他")))
                        },
                    },
                    {
                        prop:"createTime",
                        label:"日期",
                        isShow: true
                    },
                ],
                multipleSelection: [],
                tableOption: {
                    border: false
                },
                keywords:'',
                loading: false,
                page: {
                   current: 1,
                   size: 10,
                   total: 0
                },
                detailData:{}
            }
        },
        methods:{
            getMyMessageEven ( ) {
                myMessageList ({
                    pageNo: this.page.current,
                    pageSize: this.page.size
                }).then( res => {
                    console.log(res)
                    this.getMyMessageData = res
                    this.getMyMessageData = res.total > 0 ? res : {}
                })
            },
            // 分页变化改动
            handlePaginationChange(val) {
                this.page = val;
                this.$nextTick(() => {
                    this.getMyMessageEven()
                });
            },

            dataSearch (keywords) {
                this.keywords = keywords
                pagedListSearch({
                    name: this.keywords
                }).then( res => {
                    this.getMyMessageData = res
                })
            },

            messageStateEven (messageStateData) {
                if ( messageStateData == "0" ) {
                    pagedListSearch ({
                        read: 0
                    }).then( res => {
                        this.getMyMessageData = res
                    })
                } else if ( messageStateData == "1" ) {
                    pagedListSearch ({
                        read: 1
                    }).then( res => {
                        this.getMyMessageData = res
                    })
                } else {
                    this.getMyMessageEven()
                }
            },

            unreadLogoBtn ( ) {
                // 标为已读
                if( this.multipleSelection.length <= 0){
                    this.$message.warning('请选择需要标记为已读的数据')
                } else {
                    let str = '';
                    if ( this.multipleSelection && this.multipleSelection.length > 0){
                        this.multipleSelection.forEach(res=>{
                            str += res.id + ','
                            markedRead ({
                                ids :str.substring(0, str.length-1)
                            }).then( res=> {
                                this.$message.success('标记成功')
                                this.getMyMessageEven()
                            }).catch( err => {
                                this.$message.warning('标记失败')
                            })
                        })
                    }    
                }
            },

            logoReadBtn ( ) {
                if (this.getMyMessageData.length <= 0) {
                    this.$message.warning('暂无数据标记为已读')
                } else {
                    allRead( ).then(res => {
                        this.$message.success('标记成功')
                        this.getMyMessageEven()
                    }).catch(err => {
                        this.$message.error('标记失败')
                    });
                }
            },

            batchDeletionBtn () {
                if( this.multipleSelection.length <= 0){
                    this.$message.warning('请选择需要删除的数据')
                } else {
                    let str = '';
                    if ( this.multipleSelection && this.multipleSelection.length > 0){
                        this.multipleSelection.forEach(res=>{
                            str += res.id + ','
                            myMessageBatchDeletion ({
                                ids :str.substring(0, str.length-1)
                            }).then( res=> {
                                this.$message.success('删除成功')
                                this.getMyMessageEven()
                            }).catch( err => {
                                this.$message.warning('删除失败')
                            })
                        })
                    }    
                }
            },

            delAllBtn ( ) {
                myMessagedelAll () .then( res => {
                    this.$message.success('删除成功')
                    this.getMyMessageEven()
                }).catch( err => {
                    this.$message.warning('删除失败')
                })
            },

            resetBtn (keywords) {
                this.getMyMessageEven()
                this.keywords = keywords
            },

            allNewsBtn ( ) {
                this.getMyMessageEven()
            },

            // 系统消息
            systemMessageBtn ( ) {
                myMessageList ({
                    type:1
                }).then( res => {
                    this.getMyMessageData = res
                })
            },

            // 通告消息
            announcementMessageBtn ( ) {
                myMessageList ({
                    type:2
                }).then( res => {
                    this.getMyMessageData = res
                })
            },

            // 活动公告
            activityMessageBtn ( ) {
                 myMessageList ({
                    type:3
                }).then( res => {
                    this.getMyMessageData = res
                })
            },
            
            // 其他消息
            otherNewsBtn ( ) {
                 myMessageList ({
                    type: '4'
                }).then( res => {
                    this.getMyMessageData = res
                })
            },

             // 分页变化改动
            handlePaginationChange(val) {
                this.page = val;
                this.$nextTick(() => {
                    this.getMyMessageEven()
                });
            },

            // 复选框选中的数据
            selectChange(val) {
                this.multipleSelection = val;
            },
            // 取消消息详情
            cancelFun () {
                this.isDetail = false;
            }
        },
        components :{
            'myNewsHeader': myNewsHeader,
            "qqt-table": qqtTable,
        },
        mounted() {
            this.getMyMessageEven()
        }
    }
</script>

<style lang='scss'>
.myNews{
    .d2-container-full__header {
        padding-bottom: 0px !important
    }
    .my-news-table{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
}
</style>