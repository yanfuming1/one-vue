<template>
    <div class="project-pategory-excel">
        <div class="project-pategory-box">
            <div class="project-pategory-item" v-for="item in projectCategoryList" :key='item.id'>
                <div @click="choseChange(item.id)" v-if="!isShowDetails">
                    <span v-if="item.choseItem" class="chose"> {{ item.name }} </span>
                    <span v-else> {{ item.name }} </span>
                </div>
                <div v-else>
                    <span v-if="item.choseItem" class="chose"> {{ item.name }} </span>
                    <span v-else> {{ item.name }} </span>
                </div>
            </div>
        </div>
        <div class="project-pategory-content">
            <div class="btn-box">
                <span v-if="!fromChange">
                <el-button v-if="!isShowDetails" type="danger" size="mini" round icon="el-icon-refresh-right" @click="resetExcel">重置</el-button>
                <el-button v-if="!isShowDetails" type="warning" size="mini" round icon="el-icon-download" @click="downloadBudgetTemplate">下载模板</el-button>
                <el-button v-if="!isShowDetails" type="primary" size="mini" round icon="el-icon-upload2" @click="importExcel">导入</el-button>
                <el-upload
                    v-show="upLoadShow"
                    class="upload-demo"
                    action="http://192.168.2.180/qqtoi/file/upload"
                    ref="upLoadExcel"
                    :limit="1"
                    accept=".xlsx,.xls"
                    :on-change="handleFileUploaderChange"
                    :before-upload="beforeUpload"
                    :file-list="fileList">
                    <el-button type="primary" size="mini" round icon="el-icon-download">导入</el-button>
                </el-upload>
                <el-divider direction="vertical"></el-divider>
                </span>
                <el-button-group>
                    <el-button size="mini" icon="el-icon-upload2" @click="exportExcel">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer" @click="printTable">打印</el-button>
                </el-button-group>
            </div>
            <div class="content-excel">
                <el-tabs v-model="selectedTabsValue" type="card">
                    <el-tab-pane
                        :key="item.order"
                        v-for="(item, index) in editableTabs"
                        :label="item.title"
                        :name="`${item.order}`">
                        <template>
                        <ExeclComponent
                            ref="execlComponent"
                            @changeData="changeData"
                            @changeValue="changeValue"
                            @changeClick="changeClick"
                            :fromChange="fromChange"
                            :isShowDetails="isShowDetails"
                            :templateInfo="templateInfo"
                            :selectedTabsValue="selectedTabsValue"
                            :selectedProjectType="selectedProjectType"
                            :selectedInfo="selectedInfo"/>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>    
</template>
<script>
import ExeclComponent from "./ExeclComponent.vue";
import { dataJson, publicJson }from "./mock.js";
import { excelUpLoad, downloadTemplate } from '@/api/selfProject/budgetControl/budgetInfo/index'

import util from '@/libs/util';
export default {
    components: {
        ExeclComponent
    },
    props: {
        values: {
            type: Object,
            default () { return {} },
        },
        isShowDetails: {
            type: Boolean,
            default: false,
        },
        fromChange: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            fileList: [],
            projectCategoryList: [
                { id: '1', name: '水利水电工程', choseItem: false },
                { id: '2', name: '市政公用工程', choseItem: false },
                { id: '3', name: '公路桥梁工程', choseItem: false },
                { id: '5', name: '房屋建筑工程', choseItem: false },
            ],
            value: {
               projectCategory: '', 
            },
            selectedTabsValue: '0',
            editableTabs: [],
            changeItem: [],
            templateInfo: "", // 全部的模版信息
            selectedProjectType: "", // 选中的工程大类
            selectedInfo: "", // 选中的模版信息
            temDataJson: {},
            dataSource: {},
            upLoadShow: false,
            tabIndex: 0,
        }
    },
    methods: {
        
        cleanExcel (boolean = false) {
            if (boolean) this.temDataJson.execlData = [], this.dataSource = {}
            this.editableTabs = []
            this.templateInfo = "" // 全部的模版信息
            this.selectedInfo = "" // 选中的模版信息
            this.temDataJson = {}
            this.selectedTabsValue = '0'
        },

        choseChange (id) {
            if(!this.fromChange) {
                this.selectedProjectType = id
                this.projectCategoryList.forEach(item => {
                    item.choseItem = item.id === id ? true : false
                })
                this.cleanExcel()
            }
        },

        beforeUpload (file) {
            let mrFormData = new FormData()
            mrFormData.append('file', file)
            mrFormData.append('type', this.selectedProjectType)
            excelUpLoad(mrFormData).then(res => {
                this.temDataJson = res
                this.dataSource = { ...res }
                this.setData()
            })
            return false            
        },

        downloadBudgetTemplate () {
            if (this.selectedProjectType === "") {
                this.$message.warning("请先选择导入的工程类别!!!")
                return
            }
            downloadTemplate ({type: this.selectedProjectType}).then (res => {
                if (res) this.downloadFile (res)
            })
        },

        importExcel () {
            if (this.selectedProjectType === "") {
                this.$message.warning("请先选择导入的工程类别!!!")
            } else {
                this.$refs['upLoadExcel'].$refs['upload-inner'].handleClick()
            }
        },

        handleFileUploaderChange (file) {
            
        },

        downloadFile (url) {
            const elink = document.createElement('a')
            elink.download = '水利水电工程模板.xls'
            elink.style.display = 'none'
            elink.href = process.env.VUE_APP_API+"/file/download?fileOldName=水利水电工程模板.xls&filePath=" + url
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.$message.success ('下载成功')
        },

        // 导出
        exportExcel() {
            this.$emit("exportExcel")
        },

        // 打印
        printTable() {
            if(this.$refs.execlComponent && this.$refs.execlComponent.length > 0) {
                this.$refs.execlComponent[0].printPage()
            }
        },

        resetExcel () {
            this.cleanExcel(true)
            this.selectedProjectType = "" // 选中的工程大类
        },
        
        setData () {
            if(this.temDataJson.execlData) {
                this.templateInfo = this.temDataJson;
                this.editableTabs = this.temDataJson.execlData;
                this.selectedInfo = this.temDataJson.execlData.filter(
                    item => item.order == this.selectedTabsValue,
                )[0];
            }
        },

        // 获取数据
        getData () {
            return { projectCategory: this.selectedProjectType, excelModelType: this.templateInfo }
        },

        changeData (projectType, tablsNum, newVal) {
            switch(projectType){
                case '1': // 水利水电
                    this.temDataJson.execlData[parseInt(tablsNum)].data = newVal
                    this.setData()
                break
            }
        },
        // 查看变更记录
        changeClick (kind, budgetId, bgId, fieldValue, fieldName) {
            let item = { kind: kind, id: budgetId, bgId: bgId, fieldValue: fieldValue, fieldName: fieldName }
            this.$emit('changeClick', item)
        },

        // 输入改变时
        changeValue (budgetId, bgId, fieldValue, fieldName) {
            if (budgetId && this.fromChange) {
                // 变更
                let kind = this.selectedInfo.kind
                if(util.isArray(this.selectedInfo.data)){
                    this.selectedInfo.data.forEach(item => {
                        if(item.bgId === bgId && item[fieldName] !== fieldValue || bgId === '') {
                        this.addChangeItem (this.selectedInfo.kind, budgetId, bgId, fieldValue, fieldName)
                        }
                    })
                } else {
                    if(this.selectedInfo.data[fieldName] !== fieldValue) {
                        this.addChangeItem (this.selectedInfo.kind, budgetId, bgId, fieldValue, fieldName)
                    }
                }
            }
        },
        addChangeItem (kind, budgetId, bgId, fieldValue, fieldName) {
            let canAdd = true
            if(this.changeItem.length !== 0) {
                this.changeItem.forEach(item => {
                    if(item.budgetId === budgetId && item.fieldValue === fieldValue && item.fieldName === fieldName) {
                        Object.assign(item, { kind: kind, budgetId: budgetId, bgId: bgId, fieldValue: fieldValue,  fieldName: fieldName, })
                        this.$emit('changeItemAdd', this.changeItem)
                        canAdd = false
                        return
                    }
                })
            }
            if(canAdd) { 
                this.changeItem.push({ kind: kind, budgetId: budgetId,   bgId: bgId,  fieldValue: fieldValue, fieldName: fieldName, })
                this.$emit('changeItemAdd', this.changeItem)
            }
        },

    },
    watch : {
        selectedTabsValue: function(val, oldV) {
            this.selectedInfo = this.temDataJson.execlData.filter(
                item => item.order == val,
            )[0];
        },
        selectedProjectType: function (newVal, oldV) {
            this.choseChange (newVal)
            // this.temDataJson = this.values.projectCategory ? this.values.excelModelType || {} : {}
            if (this.values.projectCategory) {
                this.temDataJson = this.values.excelModelType || {}
            } else {
                if (newVal == this.dataSource.execlTypeCode) this.temDataJson = { ...this.dataSource }
            }
            this.setData()
        },
        values: {
            handler(newVal, oldValue) {
                if(newVal.projectCategory) {
                    this.selectedProjectType = newVal.projectCategory
                    this.projectCategoryList.forEach(item => {
                        if(item.id === newVal.projectCategory) { item.choseItem = true }
                    })
                    this.temDataJson = newVal.excelModelType || {}
                    this.setData()
                }
            },
            immediate: true
        }
    },
    created() {
        this.setData()
    },
}
</script>
<style lang="scss">
.project-pategory-excel{
    padding: 10px;
    padding-bottom: 30px;
    background: #F4F5F7;
    .project-pategory-box{
        overflow: auto;
        .project-pategory-item{
            text-align: center;
            width: 130px;
            float: left;
            span{
                cursor: pointer;
                color: #409eff;
                padding: 5px 15px;
                border-radius: 18px;
                border: 1px solid transparent;
                &.chose{
                    border: 1px solid #409eff;
                }
            }
        }
    }
    .project-pategory-content{
        .btn-box{
            text-align: right;
            border-bottom: 1px solid #DCDFE6;
            &>button { padding: 6px 15px; height: 24px; }
            .upload-demo{ 
                display: inline-block; 
                margin-left: 10px;
                button{ padding: 5px 15px; padding-bottom: 4px; }
                .el-upload-list{
                    display: none;
                }
            }
        }
        .content-excel{
            margin-top: 20px;
            background: #FFF;
        }
    }
}
</style>