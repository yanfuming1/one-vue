<template>
    <d2-container class="news-container">
        <template>
            <template slot="header">
               <publishNewsHeader
                    :publishNewsData = "publishNewsData"
                    @dataSearch = "dataSearch"
                    @stateData = "stateData"
                    @procStateData = "procStateData"
                    @auditData = "auditData"
                    @clearAll = "clearAll"
                    @addPublishEven = "addPublishEven"
                    @deletePubilshNews = "deletePubilshNewsAll"
                    @toExamineMessageEvent = 'toExamineMessageEvent'
                    @unExamineMessageEvent = 'unExamineMessageEvent'
                    @printTable = "printTable"
               />
            </template>
            <!-- 表格内容  -->
            <div class="publish-news-table">
                <qqt-table 
                    ref="table"
                    :data="getPublishMessageData" 
                    :rowHeader="rowHeader" 
                    :option="tableOption"
                    @page="handlePaginationChange"
                    @selectionChange="selectChange"></qqt-table>
            </div>
        </template>
        <multifile-preview :dialogVisible="dialogVisible" :upLoadFileList="upLoadFileList" @change="closeMultifilePreview"></multifile-preview>
  </d2-container>
</template>

<script>
import publishNewsHeader from '../components/publishNewsHeader'
import addPubilshInfo from '../components/addPublishInfo'
import multifilePreview from './components/multifilePreview'
import qqtTable from "../../../../components/qqt-subassembly/qqt-table/qqt-table";
import util from '@/libs/util'
import { fileOnlineView, searchPageList } from '@/api/configuration/index'
import { publishMessagepersion, publishNews, publishMessagesOffline, pluginMessageDelectAll, searchPulishMessageList, newsDetails, browerNumber,
toExamineMessage } from "../../../../api/personal-information/messageManagement"
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
                addPublishData:'',
                identification: '',
                editPublishData:{},
                addPubilshDialogForm:false,
                transform: {
                    isShowDetails: false
                },
                rowHeader: [],
                upLoadFileList: [],
                tableOption: {
                    border: false
                },
                keywords:'',
                state:'',
                audit: '',
                procState: '',
                page: {
                   current: 1,
                   size: 10,
                   total: 0
                },
                relevancyId:'',
                onlinePreview: false,
                dialogVisible: false
            }
        },
        methods:{
            getPublishMessageEven (item) {
                let id = ''
                this.identification == '1' ? id = util.cookies.get ('uuid') : id = null
                searchPulishMessageList ({
                    ...item,
                    'pageNo': this.page.current,
                    'pageSize': this.page.size,
                    'id': id
                }).then( res => {
                    this.getPublishMessageData = res
                    console.log(res)
                })
            },

            searchModelSynopsis (boolean = true) {
                if (boolean) this.resetPage ()
                this.getPublishMessageEven({
                    'name': this.keywords ? this.keywords : null,
                    'state': this.state ? this.state : null,
                    'procState': this.procState ? this.procState : null,
                    'audit': this.audit ? this.audit : null,
                    'createTime': this.createDate ? this.createDate[0] : null,
                    'updateTime':this.createDate ? this.createDate[1] : null
                })
            },

            dataSearch (keywords, createDate) {
                this.createDate = createDate
                this.keywords = keywords
                this.searchModelSynopsis ()
            },

            stateData (state) {
                this.state = state
                this.searchModelSynopsis ()
            },

            procStateData (procState) {
                this.procState = procState
                this.searchModelSynopsis ()
            },
            auditData (audit) {
                this.audit = audit
                this.searchModelSynopsis ()
            },

            clearAll () {
                this.getPublishMessageEven ()
            },

            routerLink (title, id = '') {
                this.$router.push ({
                    path: 'addPublishNewsDialog',
                    name: 'addPublishNewsDialog',
                    params: {
                        isAdd : true,
                        identification: this.identification
                    }
                })
                this.$store.commit ('d2admin/page/titleSet', title)
            },

            addPublishEven () {
                switch (this.identification) {
                    case '0' :
                        this.routerLink ('添加公告')
                        break
                    case '1' :
                        this.routerLink ('新增消息')
                        break
                }
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
            handlePaginationChange(page) {
                this.page = page;
                this.$nextTick(() => {
                    this.searchModelSynopsis (false)
                });
            },
            successFun () {
                this.getPublishMessageEven();
            },

            toExamineMessageEvent () {
                if ( this.multipleSelection.length === 1) {
                    if (this.multipleSelection[0].audit === '0') {
                        this.$confirm('您是否要审核该条数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            toExamineMessage({
                                id: this.multipleSelection[0].id,
                                type: '1'
                            }).then(res=> {
                            if (res.success) {
                                this.$message.success('审核成功');
                            } else {
                                this.$message.error(res.message);
                            }
                            this.getPublishMessageEven ();
                            })
                        })
                    } else {
                        this.$message.error('该数据已审核不支持继续审核');
                    } 
                } else if (this.multipleSelection.length === 0) {
                    this.$message.error('请选择要审核的数据');
                } else {
                    this.$message.error('只支持单条数据操作');
                }
            },

            unExamineMessageEvent () {
                if (this.multipleSelection.length === 1) {
                    if (this.multipleSelection[0].audit === '1') {
                        this.$confirm('您是否要反审核该条数据', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            toExamineMessage({
                                id: this.multipleSelection[0].id,
                                type: '0'
                            }).then(res=> {
                                if (res.success) {
                                    this.$message.success('反审核成功');
                                } else {
                                    this.$message.error(res.message);
                                }
                                    this.getPublishMessageEven();
                                })
                        })

                    } else {
                    this.$message.error('该数据未审核不支持继续反审核');
                    }
                } else if (this.multipleSelection.length === 0) {
                    this.$message.error('请选择要审核的数据');
                } else {
                    this.$message.error('只支持单条数据操作');
                }
            },

            getInvisiblePerson (id) {
                browerNumber ({'id': id }).then( res => {
                    console.log(res)
                })
            },

            getFileOnlineView () {
                searchPageList({'identification' :'9' }).then(res => {
                    this.onlinePreview = res[1].value === '1' ? true : false
                })
            },

            initRowHandle () {
                this.rowHeader = [
                    {
                        prop: "title",
                        label: "标题",
                        isShow: true,
                        width:'250',
                        render: (h, params) => {
                            return  [
                            h ('div', {
                                class: {
                                    'typefaceColor': true, 
                                },
                                on: {
                                    click: (index, row) => {
                                        this.transform.isShowDetails = true
                                        switch (this.identification) {
                                            case '0' :
                                                this.routerLink ('公告详情')
                                                break
                                            case '1' :
                                                this.routerLink ('消息详情')
                                                break
                                        }
                                        this.$router.push({
                                            path: 'addPublishNewsDialog',
                                            name: 'addPublishNewsDialog',   
                                            params: {
                                                identification: this.identification,
                                                procInstId: params.row.procInstId,
                                                transform: this.transform,
                                                relevancyId: params.row.id,
                                                scope: params.row.scope,
                                                stick: params.row.stick
                                            }
                                        })
                                    }
                                }
                            }, params.row.title)
                            ]
                        }
                        
                    },
                    {
                        prop: "scope",
                        label: "可见范围",
                        isShow: true,
                        width:'150',
                    },
                    {
                        prop: "browseNumber",
                        label: "已读人数",
                        isShow: true,
                        width: '145',
                        sortable: true
                    },
                    {
                        prop: "notBrowseNumber",
                        label: "未读人数",
                        isShow: true,
                        width: '145',
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {}, [
                                h('span', {
                                    style: {
                                        'width': '100px',
                                        'overflow': 'hidden',
                                        'text-overflow': 'ellipsis',
                                        'white-space': 'nowrap',
                                    }
                                }, params.row.notBrowseNumber),
                                // h ('el-button', {
                                //     props:{
                                //         type: 'primary',
                                //         size: 'mini',
                                //         round: true
                                //     },
                                //     style: {
                                //         float: 'right',
                                //         padding: '5px 10px',
                                //     },
                                //     class: {
                                //         // 'isDisplay': this.isDialog ? true : false
                                //     },
                                //     on:{
                                //         click: () => {
                                //             this.getInvisiblePerson (params.row.id)
                                //         }
                                //     }
                                // }, '查看')
                            ])
                        }
                    },
                    {
                        prop: "stickName",
                        label: "置顶",
                        isShow: true,
                        sortable: true,
                        render:(h, params) =>{
                            return h('div', {

                            }, params.row.stickName = params.row.stick == '1' ? '置顶' : '普通')
                        },
                    },
                    {
                        prop: 'procStateName',
                        label: '办理状态',
                        isShow:true,
                        render: (h,params) =>{
                            let text = '';
                            if (params.row.procState === '1') {
                                text = '初始化';
                            } else if (params.row.procState === '2') {
                                text = '待审批';
                            } else  if (params.row.procState === '3'){
                                text = '审批中';
                            } else  if (params.row.procState === '4'){
                                text = '已驳回';
                            } else  if (params.row.procState === '5'){
                                text = '已作废';
                            } else  if (params.row.procState === '10'){
                                text = '已完结';
                            }  else  if (params.row.procState === '6'){
                                text = '待提交';
                            } 
                                return h('div',{

                                }, params.row.procStateName = text)
                            }
                    },
                    {
                        prop: 'stateName',
                        label: '审核状态',
                        isShow:true,
                        render: (h,params) =>{
                            let text = '';
                            if (params.row.audit === '0') {
                                text = '未审核';
                            } else if (params.row.audit === '1') {
                                text = '已审核';
                            }
                            return h('div',{
                            
                            }, params.row.stateName = text)
                        }
                    },
                    {
                        prop: 'agent',
                        label: '待办人',
                        isShow:true
                    },
                    {
                        prop: 'createName',
                        label: '拟稿人',
                        isShow:true
                    },
                    {
                        prop:"createTime",
                        label:"发布日期",
                        isShow: true,
                        width:'200',
                        sortable: true
                    },
                    // {
                    //     prop: 'createTime',
                    //     label: '拟稿时间',
                    //     isShow:true,
                    //     width: '160'
                    // },
                    {
                        prop: "",
                        label: "操作",
                        isShow: true,
                        width: '220',
                        fixed: 'right',
                        render:(h, params) => {
                            return [
                                this.$has ('administer:message:edit') ? h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    attrs: {
                                        disabled: params.row.procState != '1' ? true : false
                                    },
                                    on: {
                                        click: (index, row) => {
                                            switch (this.identification) {
                                                case '0' :
                                                    this.routerLink ('编辑公告')
                                                    break
                                                case '1' :
                                                    this.routerLink ('编辑消息')
                                                    break
                                            }
                                            this.rowData = params.row
                                            this.transform.isShowDetails = false
                                            this.$router.push({
                                                path: 'addPublishNewsDialog',
                                                name: 'addPublishNewsDialog',
                                                params: {
                                                    identification: this.identification,
                                                    transform: this.transform,
                                                    relevancyId: params.row.id,
                                                    scope: params.row.scope,
                                                    stick: params.row.stick
                                                }
                                            })
                                        }
                                    }
                                },"编辑") : '',
                                this.$has ('administer:message:preview') ? h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    on: {
                                        click: (index, row) => {
                                            if (this.onlinePreview) {
                                                this.dialogVisible = true
                                                this.updataFileList (params.row.fileList)
                                            } else {
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
                                    }
                                },"预览") : '',
                                this.$has ('administer:message:issueMsg') ? h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    attrs: {
                                        disabled: params.row.procState == 10 ? params.row.state == 1 ? true : false : true
                                    },
                                    on: {
                                        click: () => {
                                            this.publishNewsid.id = params.row.id
                                            this.$confirm('是否发布此次消息，继续?', '提示', {
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
                                },"发布") : '',
                                this.$has ('administer:message:down') ? h("el-button",{
                                    props: {
                                        type: "text"
                                    },
                                    attrs: {
                                        disabled: params.row.state == '1' ? false : true
                                    },
                                    on: {
                                        click: () => {
                                            this.delItem.id = params.row.id
                                            publishMessagesOffline({id : params.row.id})
                                            this.$confirm('此操作将永久下线该消息, 是否继续?', '提示', {
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
                                },"下线") : '',
                            ];
                        },
                    },
                ]
            },

            updataFileList (list = []) {
                let fileList = []
                if (list.length > 0) {
                    list.forEach(item => {
                        let m = {
                            status : 'finished',
                            response : {
                                url : item.url,
                                size: item.size,
                                name: item.name
                            }
                        }
                        fileList.push(m)
                    })
                }
                this.upLoadFileList = fileList
            },

            closeMultifilePreview () {
                this.dialogVisible = false
            },

            printTable () {
                this.$refs.table.printTable (this.multipleSelection)
            },

            resetPage () {
                this.page = {
                    current: 1,
                    size: 10,
                    total: 0
                }
            }
        },
        created () {
            this.identification = this.$route.params.identification
            this.initRowHandle ()
            this.getFileOnlineView ()
        },

        components :{
            'publishNewsHeader': publishNewsHeader,
            'multifile-preview': multifilePreview,
            "qqt-table": qqtTable
        },

        mounted() {
            this.getPublishMessageEven()
        },

        watch: {
            $route (val) {
                if (val.path.indexOf('publishNews') !== -1) {
                    this.identification = val.params.identification
                    this.initRowHandle ()
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
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