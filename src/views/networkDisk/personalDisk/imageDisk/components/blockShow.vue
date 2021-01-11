<template>
    <div class="block-list-div">
        <div class="block-list-top">
            <el-checkbox v-model="allSelect" :indeterminate="isIndeterminate" @change="setSelectAll">全选</el-checkbox>
            <el-divider></el-divider>
        </div>
        <el-row class="block-content-div">
            <div v-if="dataList.length > 0">
                <el-checkbox-group v-model="checkList" @change="getCheck">
                    <el-col :span="3" v-for="(item, index) in dataList" :key="index" class="block-item-div">
                        <div class="block-item">
                            <p class="block-item-checkbox"><el-checkbox :label="item.id"></el-checkbox></p>
                            <div v-if="item.newFolder || item.reName">
                                <el-image :src="require('../../../../../assets/image/filebox.png')"></el-image>
                                <el-input size="mini" placeholder="请输入文件夹名称" v-model="item.name"></el-input>
                                <el-button size="mini" type="primary" icon="el-icon-check" @click="newFolder(index)" circle></el-button>
                                <el-button size="mini" type="info" icon="el-icon-close" @click="cancelNewFolder(index)" circle style="margin-left:10px;"></el-button>
                            </div>
                            <div v-else>
                                <el-image v-if="item.resourcetype === '7'" :src="item.url" @click="getChild(index)" @contextmenu.prevent="operation(item)"></el-image>
                                <el-image v-else :src="imgUrl[Number(item.resourcetype)]" @click="getChild(index)" @contextmenu.prevent="operation(item)"></el-image>
                                <p class="block-item-title">{{ item.name }}</p>
                            </div>
                        </div>
                    </el-col>
                </el-checkbox-group>
            </div> 
            <div v-if="dataList.length === 0">
                <p style="line-height:50px;font-size:16px;margin-top:50px;text-align:center;color:#999;">暂无数据</p>
            </div>
        </el-row>
        <d2-contextmenu
            :visible.sync="contextmenuFlag"
            :x="contentmenuX"
            :y="contentmenuY">
            <d2-contextmenu-list
                :menulist="contextmenuList"
                @rowClick="contextmenuClick"/>
        </d2-contextmenu>
    </div>
</template>
<script>
import util from '../../../../../libs/util'
import { resourceReName } from '../../../../../api/disk/personalImage'
export default {
    name: 'blockShow',
    components: {
        D2Contextmenu: () => import('../../../../../layout/header-aside/components/contextmenu'),
        D2ContextmenuList: () => import('../../../../../layout/header-aside/components/contextmenu/components/contentmenuList')
    },
    props: {
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            dataList: [],
            checkList: [],
            selectItemList: [],
            allSelect: false,
            isIndeterminate: false,
            selectItem: {},
            imgUrl: [
                require('../../../../../assets/image/filebox.png'),
                require('../../../../../assets/image/filebox.png'),
                require('../../../../../assets/image/docx.png'),
                require('../../../../../assets/image/pdf.png'),
                require('../../../../../assets/image/txt.png'),
                require('../../../../../assets/image/EXCEL.png'),
                require('../../../../../assets/image/zip.png'),
                require('../../../../../assets/image/docx.png'),
                require('../../../../../assets/image/ppt.png'),
                require('../../../../../assets/image/unknow.png'),
            ],
            // 右键的内容
            contextmenuFlag: false,
            contentmenuX: 0,
            contentmenuY: 0,
            contextmenuList: [
                { icon: 'gears', title: '权限设置', value: 'limits' },
                { icon: 'share-alt', title: '分享', value: 'share' },
                { icon: 'cloud-download', title: '下载', value: 'download' },
                { icon: 'files-o', title: '复制到', value: 'copy' },
                { icon: 'refresh', title: '重命名', value: 'rename' },
                { icon: 'exchange', title: '移动到', value: 'moveto' },
                { icon: 'trash-o', title: '删除', value: 'delete' },
            ],
        }
    },
    methods: {
        // 获取选择的内容
        getCheck () {
            if (this.checkList.length === 0){
                this.isIndeterminate = false
                this.allSelect = false
            } else if (this.checkList.length < this.dataList.length) {
                this.isIndeterminate = true
            } else if (this.checkList.length === this.dataList.length) {
                this.isIndeterminate = false
                this.allSelect = true
            }
            this.selectItemList = []
            this.checkList.forEach(it => {
                this.dataList.forEach(item => {
                    if (it === item.id) {
                        this.selectItemList.push(item)
                    }
                })
            })
            this.$emit("selectionChange", this.selectItemList)
        },
        // 全选
        setSelectAll () {
            if (this.allSelect) {
                this.dataList.forEach(item => {
                    this.checkList.push(item.id)
                })
            } else {
                this.checkList = []
            }
        },
        // 点击文件夹
        getChild (index) {
            if (!this.dataList[index].newFolder && this.dataList[index].resourcetype === '1') {
                this.$emit("blockChose", this.dataList[index])
            }
        },
        // 新建文件夹
        newFolder (index) {
            if(this.dataList[index].name === ""){
                this.$message.warning("请输入文件夹的名称!!!")
            } else {
                if (this.dataList[index].id === undefined) {
                    // 说明是新建
                    this.$emit("createFolder", this.dataList[index].name)
                } else {
                    // 说明是重命名
                    resourceReName(this.dataList[index]).then(res => {
                        if(res.code === 200){
                            this.$message.success("重命名成功~~~")
                            this.$emit('refreshData')
                        }
                    })
                }
            }
        },
        cancelNewFolder (index) {
            if (this.dataList[index].id === undefined) {
                // 说明是取消新建
                this.$emit("cancelCreateFolder")
            } else {
                // 说明是取消重命名
                this.$message.warning("取消重命名")
                this.$emit('refreshData')
            }
        },
        // 右键操作
        operation (row) {
            this.selectItem = row
            this.contentmenuX = event.clientX
            this.contentmenuY = event.clientY
            this.contextmenuFlag = true
        },
        // 具体操作
        contextmenuClick (command) {
            this.handleControlItemClick(command)
        },
        // 网盘右键的方法
        handleControlItemClick (command) {
            this.$emit("rowOperation", command, this.selectItem)
            this.contextmenuFlag = false
        },
        setRenameItem (row) {
            // 重命名
            this.dataList.forEach(item => {
                if (item.id === row.id) {
                    item.reName = true
                }
            })
        }
    },
    mounted () {
        this.dataList = this.tableData
        this.checkList = []
        this.allSelect = false
        this.isIndeterminate = false
    },
    watch: {
        tableData : {
            handler (newVal, old) {
                this.dataList = newVal
                this.checkList = []
                this.allSelect = false
                this.isIndeterminate = false
            },
            immediate: true,
            deep: true
        }
    }
}
</script>
<style lang="scss">
.block-list-div{
    padding: 0px 10px;
    .block-list-top{
        .el-checkbox__label{
            color: #999;
        }
        .el-divider{
            margin: 10px 0px 0px 0px;
        }
    }
    .block-item-div{
        padding: 15px;
    }
    .block-item{
        cursor: pointer;
        padding: 10px;
        .el-image{
            width: 100%;
            height: 130px;
            text-align: center;
            .el-image__inner{
                width: 80%;
                max-width: 120px;
                height: auto;
            }
        }
        .el-button{
            margin-top: 5px;
        }
        .block-item-title{
            text-align: center;
            font-size: 12px;
        }
        .block-item-checkbox{
            padding-left: 10%;
            .el-checkbox__label{
                display: none;
            }
        }
        &:hover{
            background-color: #ECF6FF;
        }
    }
}
</style>