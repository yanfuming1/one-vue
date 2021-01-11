<template>
    <d2-container class="address-book">
        <template slot="header">
            <div class="address-book-header">
                <span class="address-book-header___search">
                    <el-button type="primary" size="mini" icon="el-icon-upload2" v-if="$has('resmanage:resourceManage:add')" @click="showUpLoad" class="address-book-header-button">上传</el-button>
                    <el-button-group class="share-btn-group">
                        <el-button size="mini" v-if="$has('resmanage:resourceManage:add')" @click="newFolder" icon="el-icon-folder-add">新建文件夹</el-button>
                    </el-button-group>
                    <el-button-group class="share-btn-group">
                        <!-- <el-button size="mini" @click="shareSelect" icon="el-icon-share">分享</el-button> -->
                        <el-button size="mini" @click="batchDownload" icon="el-icon-download">下载</el-button>
                        <el-button size="mini" v-if="$has('resmanage:resourceManage:deleteBatch')" @click="deleteData" icon="el-icon-delete">批量删除</el-button>
                        <!-- <el-button size="mini" @click="">重命名</el-button>
                        <el-button size="mini" @click="">复制到</el-button>
                        <el-button size="mini" @click="">移动到</el-button> -->
                    </el-button-group>
                </span>
                <div class="disk-top-right">
                    <el-input placeholder="请输入内容" v-model="filterText" @change="getTableData" size="mini" suffix-icon="el-icon-search"></el-input>
                    <span class="style-change" @click="showList"><i class="el-icon-s-fold"></i></span>
                    <span class="style-change" @click="showBlock"><i class="el-icon-menu"></i></span>
                </div>
            </div>
        </template>
        <div class="address-book-center">
            <div class="disk-con-top">
                <p>资料<el-button v-if="showBack" type="text" @click="backParent">返回上一级</el-button></p>
            </div>
            <div class="table-style" v-if="showStyle">
                <qqt-table 
                    ref="table" 
                    :data="tableData" 
                    :rowHeader="rowHeader" 
                    :fromDisk="fromDisk"
                    :option="tableOption" 
                    :pageShow="pageShow"
                    :dynamicHeader="dynamicHeader"
                    :identification="identification"
                    @rowOperation="rowOperation"
                    @refreshData="getTableData"
                    @createFolder="createFolder"
                    @cancelCreateFolder="cancelCreateFolder"
                    @selectionChange="selectChange"></qqt-table>
            </div>
            <div v-else>
                <block-show 
                    ref="blockShow"
                    :tableData="blockData" 
                    @rowOperation="rowOperation" 
                    @cancelCreateFolder="cancelCreateFolder" 
                    @createFolder="createFolder" 
                    @blockChose="blockChose"
                    @refreshData="getTableData"
                    @selectionChange="selectChange"></block-show>
            </div>
        </div>
        <!-- 上传 -->
        <disk-up-load ref="diskUpLoad" :showUpload="showUpload" @closeDialog="closeDialog" @startUpLoad="startUpLoad"></disk-up-load>
        <!-- 权限 -->
        <disk-limits-drawer ref="diskLimitsDrawer" :showDrawer="showDrawer" :permissionList="permissionList" :rowItem="choseRow" @permissionAdd="permissionAdd" @closeDrawer="closeDrawer"></disk-limits-drawer>
        <!-- 分享 -->
        <share-files ref="shareFiles" :shareData="shareData"></share-files>
        <!-- 移动到 -->
        <disk-file-tree ref="diskFileTree" :identification="identification" :operationTitle="operationTitle" @moveOrCopyOperation="moveOrCopyOperation"></disk-file-tree>
        <el-dialog v-dialogDrag :visible.sync="imgShow" class="imgShowBox" v-if="imgShow" title="图片预览" top="5vh"  width="50%">
            <img  :src="dialogImageUrl" width="100%" height="100%"></img>
        </el-dialog>
    </d2-container>
</template>
<script>
import qqtTable from './components/qqt-table'
import shareFiles from './components/shareFiles'
import blockShow from './components/blockShow'
import diskUpLoad from './components/diskUpLoad'
import diskLimitsDrawer from './components/diskLimitsDrawer'
import diskFileTree from './components/diskFileTree'
import { fileUpload, fastDFSDownload  , filePersonUpload, docPreview} from '../../../../api/system/file/file'
import { diskSearch, getParentById, resourceManageAdd, resourceDelete, resourceReName, getPerListByFileId, 
        resourCopy, resourPerAdd, resourGetLink } from '../../../../api/disk/personalImage'
import { personalTable, personalCreateFolder } from '../../../../api/disk/truePersonal'
import util from '../../../../libs/util'
import md5 from 'js-md5';
export default {
    name: "index",
    components:{
        'qqt-table': qqtTable,
        // 分享
        'share-files': shareFiles,
        'block-show': blockShow,
        'disk-up-load': diskUpLoad,
        'disk-limits-drawer': diskLimitsDrawer,
        'disk-file-tree': diskFileTree,
    },
    data() {
        return {
            dialogImageUrl:'',
            imgShow:false,
            filterText: null,
            operationTitle: '',
            pageShow: false,
            showStyle: true,
            tableData: {
                records: []
            },
            showBack: false,
            seletData: [],
            rowHeader: [
                {
                    prop: 'resourcetype',
                    label: '',
                    isShow: true,
                    width: "50",
                    render: (h, parms) => {
                        let url = ''
                        switch(parms.row.resourcetype){
                            //  1 文件夹 2 word 3 pdf 4 txt 5 excel  6zip 7img 8ppt 9未知
                            case '1':
                                url = require("@/assets/image/filebox.png")
                                break
                            case '2':
                                url = require("@/assets/image/docx.png")
                                break
                            case '3':
                                url = require("@/assets/image/pdf.png")
                                break
                            case "4":
                                url = require("@/assets/image/txt.png")
                                break
                            case "5":
                                url = require("@/assets/image/EXCEL.png")
                                break
                            case "6":
                                url = require("@/assets/image/zip.png")
                                break
                            case "7":
                                url = parms.row.url
                                break
                            case "8":
                                url = require("@/assets/image/ppt.png")
                                break
                            case "9":
                                url = require("@/assets/image/unknow.png")
                                break
                            default:
                                break
                        }
                        return  [h('el-image', {
                            attrs: { src: url },
                            style:{ width: "30px",height: "30px" },
                        }, "")]
                    }
                },
                {
                    prop: 'name',
                    label: '文件名',
                    type: 'name',
                    isShow: true,
                    render: (h, params) => {
                        return h('el-button', {
                            style: { color: '#3ba5ff'},
                            attrs: { type: 'text'},
                            on: {
                                click: () => {
                                    if(params.row.resourcetype === '1'){
                                        this.nowId = params.row.id
                                        this.parentId = params.row.parentId
                                        this.showBack = true
                                        this.filterText = null
                                        this.getTableData()
                                    }
                                }
                            }
                        }, params.row.name)
                    }
                },{
                    prop: 'resourcesize',
                    label: '大小',
                    isShow: true,
                    render: (h, parms) => {
                        return  [h('p', {}, parms.row.resourcesize === null || parms.row.resourcetype === '1' ? '-' : util.nFormatter(parms.row.resourcesize))]
                    }
                },
                {
                    prop: 'createName',
                    label: '创建人',
                    isShow: true,
                },{
                    prop: 'createTime',
                    label: '创建日期',
                    isShow: true,
                },{
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render: (h, parms) => {
                        return [
                            parms.row.url 
                                && (parms.row.url.endsWith('docx') 
                                || parms.row.url.endsWith('xlsx') 
                                || parms.row.url.endsWith('doc') 
                                || parms.row.url.endsWith('pdf') 
                                || parms.row.url.endsWith('png') 
                                || parms.row.url.endsWith('jpg') 
                                || parms.row.url.endsWith('jpeg') 
                                || parms.row.url.endsWith('gif') 
                                || parms.row.url.endsWith('svg') 
                                || parms.row.url.endsWith('xls')) ? h ('i', {
                                class: {
                                    'el-icon-view': true
                                },
                                style: {
                                    'font-size': '20px',
                                    'padding': '5px',
                                    'color': '#409EFF'
                                },
                                on:{
                                    click: () => {
                                        this.examineCompileAccessory (parms.row.url, '0')
                                    }
                                }
                            }) : '',
                            parms.row.url 
                                && (parms.row.url.endsWith('docx') 
                                || parms.row.url.endsWith('xlsx')) ? h ('i', {
                                class: {
                                    'el-icon-edit-outline': true
                                },
                                style: {
                                    'font-size': '20px',
                                    'padding': '5px',
                                    'color': '#409EFF'
                                },
                                on:{
                                    click: () => {
                                        this.examineCompileAccessory (parms.row.url, '1')
                                    }
                                }
                            }) : ''
                        ]
                    }
                }
            ],
            tableOption:{
                border: false
            },
            dynamicHeader:{
                // tableId: 'T_1576475898',
                // isSave: true
            },
            parentId: '0',
            nowId: '0',
            fromDisk: true,
            blockData: [],
            showUpload: false,
            showDrawer: false,
            moveOrCopy: 'move',
            choseRow: {},
            // 获取权限
            permissionList: [],
            shareData: {},
            identification: '',
        }
    },
    methods: {
        getTableData () {
            this.tableData = { records: [] }
            if (this.identification === '0') {
                diskSearch({parentId: this.nowId, name: this.filterText ? this.filterText : null}).then(res => {this.setInfo(res)}).finally(() => {this.getTableBack()})
            } else {
                personalTable({parentId: this.nowId, name: this.filterText ? this.filterText : null}).then(res => {this.setInfo(res)}).finally(() => {this.getTableBack()})
            }
        },

        setInfo (res) {
            this.tableData = {records: res}
            this.blockData = res
            this.nowId = res.length > 0 ? this.filterText ? this.nowId : res[0].parentId : this.nowId
            this.showBack = this.nowId === '0' ? false : true
        },
        
        getTableBack(){
            if(this.showBack){
                getParentById({
                    id: this.nowId
                }).then(res => {
                    // parentId 是父级的父级，用于返回上一级使用
                    this.parentId = res.result === null ? '0' : res.id
                })
            }
        },

        selectChange (data) {
            this.seletData = data
        },

        shareSelect(){
            if(this.seletData.length === 0) {
                this.$message.warning("请选择分享的内容!!")
            } else {
                this.$refs.shareFiles.showDialog()
            }
        },
        // 上传
        showUpLoad () {
            this.showUpload = true
        },
        // 取消上传
        closeDialog () {
            this.showUpload = false
        },

        // 开始上传
        startUpLoad (fileList) {
            fileList.forEach((file, index) => {
            let fd = new FormData()
            fd.append('file', file.raw)
            let fileType = util.getFileType(file.name)
            let url = ''
            filePersonUpload(fd).then(res => {url = res}).finally(() => {
                let newItem = { 
                    name: file.name,
                    parentId: this.nowId === '0' ? '' : this.nowId,
                    resourcesize: file.size,
                    newFolder: true,
                    resourcetype: fileType,
                    url: url,
                    identype: this.identification === '0' ? '2' : '1'
                }
                resourceManageAdd(newItem).then(res => {
                    if (index === (fileList.length - 1)) {
                        this.$refs.diskUpLoad.handleRemove()
                        this.$message.success("上传成功~~~")
                        this.showUpload = false
                    }
                    this.getTableData()
                })
            })
            })
        },
        // 新建文件夹
        newFolder () {
            let newItem = {
                name: "",
                parentId: this.nowId,
                resourcesize: null,
                updateBy: null,
                updateTime: "",
                newFolder: true,
                resourcetype: '1'
            }
            this.tableData.records.unshift(newItem)
        },

        // 批量下载
        batchDownload () {
             if(this.seletData.length === 0) {
                this.$message.warning("请选择下载的内容!!!")
            } else {
                let canDownload = true
                this.seletData.forEach(item => {
                    if(item.resourcetype === '1'){
                        canDownload = false
                    }
                })
                if(canDownload){
                    this.seletData.forEach(item => {
                        this.downloadFile(item)
                    })
                } else {
                    this.$message.warning("文件夹不可下载，请重新选择!!!")
                }
            }
        },
        downloadFile (row) {
            const elink = document.createElement('a')
            elink.download = row.name
            elink.style.display = 'none'
            elink.href = process.env.VUE_APP_API+"/file/download?fileOldName="+row.name+"&filePath="+row.url
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.$message.success ('下载成功')
        },
        // 删除
        deleteData () {
            util.confirm("确定要删除所选内容吗？").then(validate => {
                if (validate) {
                    let ids = ''
                    this.seletData.forEach(item => {
                        ids += item.id + ','
                    })
                    ids = ids.substring(0, ids.length - 1)
                    resourceDelete({ids: ids}).then(res => {
                        this.$message.success("删除成功~~~")
                        this.getTableData()
                    })
                } else {
                    this.$message.warning("已取消删除")
                }
            })
        },
        // 移动到或者复制到
        moveOrCopyOperation (choseItem) {
            if (this.moveOrCopy === 'move') {
                this.choseRow.parentId = choseItem.id
                resourceReName(this.choseRow).then(res => {
                    this.$message.success("操作成功~~~")
                    this.$refs.diskFileTree.cancel()
                    this.getTableData()
                })
            } else {
                resourCopy({
                    id1: this.choseRow.id,
                    id2: choseItem.id
                }).then(res => {
                    if (res.code === 200) {
                        this.$message.success("复制成功~~~")
                        this.$refs.diskFileTree.cancel()
                        this.getTableData()
                    }
                })
            }
        },
        // 添加权限
        permissionAdd (perList) {
            perList.forEach(item => {
                item.resourceid = this.choseRow.id
            })
            resourPerAdd(perList).then(res => {
                this.$message.success("添加成功~~~")
                this.showDrawer = false
            })
        },
        // 列表展示
        showList () {
            this.showStyle = true
        },
        showBlock () {
            this.showStyle = false
        },
        // 返回上一级
        backParent () {
            this.nowId = this.parentId
            this.getTableData()
        },
        // 单行右键的事件
        rowOperation(command, row){
            this.choseRow = row
            switch (command) {
                case 'limits':
                    // 设置单条的权限
                    this.showDrawer = true
                    getPerListByFileId({resid: row.id}).then(res => {
                        this.permissionList = res
                    })
                    break
                case 'share':
                    // 单条分享
                    if(row.url !== null){
                        resourGetLink().then(res => {
                            // let url = 'http://localhost:8080/networkPan'
                            let url = process.env.NODE_ENV !== 'development' ? _this.$store.state.d2admin.config.VUE_APP_IP : process.env.VUE_APP_IP + '/networkPan'
                            this.shareData['url'] = url + '?id=' +  row.id + '&code=' + md5(res.code)
                            this.shareData['code'] = res.code
                            this.$refs.shareFiles.showDialog()  
                        })
                    } else {
                        this.$message.warning("文件夹目前不可分享")
                    }
                    break
                case 'download':
                    // 下载
                    if (row.resourcetype === '1') {
                        this.$message.warning("文件夹不可下载!!!")
                    } else {
                        this.downloadFile(row)
                    }
                    break
                case 'copy':
                    // 复制
                    // 移动到
                    this.moveOrCopy = 'copy',
                    this.operationTitle = '复制到'
                    this.$refs.diskFileTree.showDialog()
                    break
                case 'rename':
                    // 重命名
                    if(this.showStyle){
                        // 说名是列表
                        this.$refs.table.setRenameItem(row)
                    } else {
                        this.$refs.blockShow.setRenameItem(row)
                    }
                    break
                case 'moveto':
                    // 移动到
                    this.moveOrCopy = 'move',
                    this.operationTitle = '移动到'
                    this.$refs.diskFileTree.showDialog()
                    break
                case 'delete':
                    // 删除
                    util.confirm("确定要删除所选内容吗？").then(validate => {
                        if (validate) {
                            resourceDelete({ids: row.id}).then(res => {
                                this.$message.success("删除成功~~~")
                                this.getTableData()
                            })
                        } else {
                            this.$message.warning("已取消删除")
                        }
                    })
                    break
            }
        },

        closeDrawer () {
            this.showDrawer = false
        },
        
        // 块样式点击选择
        blockChose (item) {
            this.nowId = item.id
            this.parentId = item.parentId
            this.showBack = true
            this.getTableData()
        },

        // 创建文件夹
        createFolder (folderName) {
            let resourceManage = {
                name: folderName,
                parentId: this.nowId === '0' ? null : this.nowId,
                resourcetype: '1',
                identype: this.identification === '0' ? '2' : '1'
            }
            if (this.identification === '0') {
                resourceManageAdd(resourceManage).then(res => {
                    this.getTableData()
                    this.$refs.diskFileTree.getTreeData(this.identification)
                    this.$message.success("添加成功~~~")
                })
            } else {
                personalCreateFolder(resourceManage).then(res => {
                    this.getTableData()
                    this.$refs.diskFileTree.getTreeData()
                    this.$message.success("添加成功~~~")
                })
            }
        },
        // 取消创建文件夹
        cancelCreateFolder () {
            this.tableData.records.shift()
        },

        examineCompileAccessory (url, type) {
            let index= url.lastIndexOf(".");
            let ext = url.substr(index+1);
            const imglist = ['png', 'jpg', 'jpeg', 'gif', 'svg'];
            let flag = imglist.findIndex(item => item === ext) !== -1 ? true :false;
            if (flag) {
                this.imgShow = true;
                this.dialogImageUrl = url;
            } else {
                docPreview ({path: url, type: type}).then (res => {
                    if (res) window.open (res)
                })
            }
        }
    },
    mounted () {
        this.identification = this.$route.params.identification
        this.getTableData()
    },
    watch : {
        $route (val) {
            if (val.path.indexOf('networkDisk') !== -1) {
                this.identification = val.params.identification
                this.nowId = '0'
                this.getTableData()
            }
        }
    }
}
</script>
<style lang="scss">
.address-book {
    .d2-container-full .d2-container-full__header{
        padding-bottom: 0px !important;
    }
    .address-book-header-button{
        margin-right: 10px;
    }
    .address-book-header {
        .address-book-header___search {
            .el-input {
                width: 10%;
                padding-right: 10px;
            }
            .share-btn-group{
                margin-right: 10px;
                .el-button{
                    color: #65AEF2;
                }
            }
        }
        .el-date-editor{
            width: 300px;
            margin-right: 10px;
        }
        .disk-top-right{ 
            width: 220px;
            float: right;
            display: flex;
            .el-input{
                width: 150px;
                .el-input__inner{
                    border-radius: 15px;
                }
            }
            .style-change{
                font-size: 30px;
                height: 30px;
                width: 30px;
                display: inline-block;
                position: relative;
                margin-left: 5px;
                i{ 
                    position: absolute;
                }
            }
        }
    }
    .address-book-center {
        box-shadow: 0 2px 12px 0 $color-border-shadow;
        background: $color-bg3;
        height: 100%;
        .disk-con-top{
            p{
                line-height: 40px;
                font-weight: bold;
                font-size: 15px;
                padding-left: 10px;
                .el-button{
                    float: right;
                    margin-right: 20px;
                }
            }
        }
    }
}
</style>