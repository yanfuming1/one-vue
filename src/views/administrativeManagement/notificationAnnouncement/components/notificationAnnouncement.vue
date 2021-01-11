<template>
    <d2-container class="news-container">
        <template>
            <template slot="header">
               <notification-announcement-header
                    :publishNewsData = "publishNewsData"
                    @dataSearch = "dataSearch"
                    @statusData = "statusData"
                    @addPublishEven = "addPublishEven"
                    @deletePubilshNews = "deletePubilshNewsAll"
               />
            </template>
            <template>
                <add-notification-announcement 
                    ref="dialog"
                    :title="formTitle" 
                    :isAdd="isAdd"
                    :addPubilshDialogForm="addPubilshDialogForm"
                    @cancelPubilshDialogForm="cancelPubilshDialogEven" 
                    @successFun="successFun"
                    :rowData="rowData"
                ></add-notification-announcement>
            </template>
            <!-- 表格内容  -->
            <div class="publish-news-table">
                <qqt-table 
                    :data="getPublishMessageData" 
                    :rowHeader="rowHeader" 
                    :option="tableOption"
                    @page="handlePaginationChange"
                    @selectionChange="selectChange"></qqt-table>
            </div>
        </template>
  </d2-container>
</template>

<script>
import notificationAnnouncementHeader from '../components/notificationAnnouncementHeader'
import addNotificationAnnouncement from '../components/addNotificationAnnouncement'
import qqtTable from "../../../../components/qqt-subassembly/qqt-table/qqt-table";
import util from '@/libs/util'
import { publishMessageList, publishNews, publishMessagesOffline, pluginMessageDelectAll, searchPulishMessageList, newsDetails, browerNumber  } from "../../../../api/personal-information/messageManagement"
    export default {
        data () {
            return {
                rowData: {},
                publishNewsData:{},
                getPublishMessageData:{
                    records:  [],
                },
                multipleSelection:[],
                delItem:{},
                publishNewsid:{},
                formTitle: '',
                addPublishData:'',
                editPublishData:{},
                addPubilshDialogForm:false,
                rowHeader: [
                    {
                        prop: "title",
                        label: "标题",
                        isShow: true,
                        render: (h, params) => {
                            return  [
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
                                        })                                    }
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

                            }, params.row.type === '1' ? '系统' : ( params.row.type === "2" ? '公告' : ( params.row.type === "3" ? '通知' : "消息")))
                        },
                    },
                    {
                        prop: "scope",
                        label: "可见范围",
                        isShow: true
                    },
                    {
                        prop: "browseNumber",
                        label: "已读人数",
                        isShow: true,
                        sortable: true
                    },
                    {
                        prop: "notBrowseNumber",
                        label: "未读人数",
                        isShow: true,
                        sortable: true
                    },
                    {
                        prop:"createdTime",
                        label:"日期",
                        isShow: true,
                        sortable: true
                    },
                    {
                        prop: "stick",
                        label: "置顶",
                        isShow: true,
                        sortable: true,
                        render:(h, params) =>{
                            return h('div', {

                            }, params.row.stick === '1' || params.row.stick === '置顶' ? '置顶' : '普通')
                        },
                    },
                    {
                        prop: "",
                        label: "操作",
                        isShow: true,
                        render:(h, params) => {
                            return [
                                h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    on: {
                                        click: (index, row) => {
                                            this.isAdd = false
                                            this.addPubilshDialogForm = true
                                            this.formTitle = "编辑公告"
                                            this.$refs.dialog.showDrawer()
                                            this.rowData = params.row;
                                            this.rowData.scopeName = params.row.scope;
                                        }
                                    }
                                },"编辑"),
                                h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    attrs: {
                                        disabled: params.row.state === '1' ? true : false
                                    },
                                    on: {
                                        click: () => {
                                            this.publishNewsid.id = params.row.id
                                            this.$confirm('是否发布此次公告，继续?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(res => {
                                                publishNews({id : params.row.id}).then(()=>{
                                                    this.$message.success('发布成功')
                                                    this.getPublishMessageEven()
                                                })
                                            }).catch(err => {
                                                this.$message.error('发布失败')
                                            });
                                        }
                                    }
                                },"发布"),
                                h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    on: {
                                        click: () => {
                                            this.delItem.id = params.row.id
                                            publishMessagesOffline({id : params.row.id})
                                            this.$confirm('此操作将永久下线该公告, 是否继续?', '提示', {
                                                confirmButtonText: '确定',
                                                cancelButtonText: '取消',
                                                type: 'warning'
                                            }).then(res => {
                                                this.$message.success('下线成功')
                                                this.getPublishMessageEven()
                                            }).catch(err => {
                                                this.$message.error('下线失败')
                                            });
                                        }
                                    }
                                },"下线"),
                            ];
                        },
                    },
                ],
                tableOption: {
                    border: false,
                },
                keywords:'',
                status:'',
                isAdd: false,
                page: {
                   current: 1,
                   size: 10,
                   total: 0
                },
            }
        },
        methods:{
            getPublishMessageEven (keywords,status) {
                publishMessageList ({
                    ...keywords,
                    ...status,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size
                }).then( res => {
                    this.getPublishMessageData = res
                })

            },

            dataSearch (keywords) {
                this.keywords = keywords
                searchPulishMessageList({
                    name: this.keywords
                }).then( res => {
                    console.log(res)
                    this.getPublishMessageData = res
                }).catch( err => {
                    console.log(err)
                })
            },

            statusData (status) {
                this.status = status
                searchPulishMessageList({
                    status: this.status
                }).then( res => {
                    this.getPublishMessageData = res
                }).catch( err => {
                    console.log(err)
                })
            },

            addPublishEven () {
                this.$refs.dialog.showDrawer()
                this.rowData = {}
                this.formTitle = "新增公告"
                this.addPubilshDialogForm = true
                this.isAdd = true
            },
            deletePubilshNewsAll () {
                if (this.multipleSelection.length <= 0) {
                    this.$message.warning('请选择需要删除的数据')
                } else {
                    let str = '';
                    if (this.multipleSelection && this.multipleSelection.length > 0) {
                        this.multipleSelection.forEach(res => {
                            str += res.id + ','
                        })
                        pluginMessageDelectAll({ids: str.substring(0, str.length - 1)}).then(res => {
                            this.getPublishMessageEven()
                            this.$message.success('操作成功')
                        }).catch(err => {
                            this.$message.error('删除失败')
                        });

                    }
                }
            },

            cancelPubilshDialogEven () {
                this.addPubilshDialogForm = false
            },
            // 复选框选中的数据
            selectChange(val) {
                this.multipleSelection = val;
            },
             // 分页变化改动
            handlePaginationChange(val) {
                console.log(val)
                let jsonData = {
                    pageNo:val.current,
                    pageSize:val.size,
                }
                this.$nextTick(() => {
                    publishMessageList (jsonData).then( res => {
                        this.getPublishMessageData = res
                    })
                });
            },
            successFun () {
                this.getPublishMessageEven();
            }
        },
        components :{
            'notification-announcement-header': notificationAnnouncementHeader,
            "qqt-table": qqtTable,
            'add-notification-announcement':addNotificationAnnouncement
        },
        mounted() {
            this.getPublishMessageEven()
        }
    }
</script>

<style lang='scss'>
.news-container{
    .d2-container-full__header {
        padding-bottom: 0px !important
    }
    .publish-news-table{
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 102%;
        margin-top: -15px
    }
}
</style>