<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm">
                <template slot="addline">
                    <material-list 
                        ref="materialList" 
                        :numberLabel="numberLabel" 
                        :mianId="mianId" 
                        :showSupplier="showSupplier" 
                        :dataInfo="materialListData" 
                        :isShowDetails="transform.isShowDetails"></material-list>
                </template>
            </fm-generate-form>
            <div class="up-load-div">
                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
            </div>
            <div class="drawer-btn">
                <el-button type="warning" v-if="!transform.isShowDetails" size="small" @click="subNewPro">提交</el-button>
                <!-- <el-button v-if="!transform.isShowDetails" type="primary" size="small" @click="subProcess">提交</el-button> -->
                <el-button size="small" v-if="!transform.isShowDetails" @click="closeTab">取消</el-button>
                <el-button type="primary" v-if="transform.isShowDetails"  size="small" @click="closeTab">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import { getUserDepartById } from '../../../../../api/system/depart/depart'
import { synopsisList, registerAdd, registerEdit, } from '../../../../../api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { upload } from '../../../../../components/qqt-subassembly'
import materialList from '../../components/materialList'
import { MATERIALEQUIPMENTMANAGEMENT } from '../../../../../enum/FORMCODE'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import util from '../../../../../libs/util'
let that = this
export default {
    name: 'registerAdd',
    components: {
        materialList,
        'up-load' : upload,
    },
    data () {
        return {
            jsonData: {},
            remoteFuncs: {},
            values: {},
            transform: {
                isShowDetails: false,
            },
            upLoadFileDefaultList: [],
            // 添加行的供应商显示
            showSupplier: true,
            selectOption: {},
            materialListData: [],
            mianId: '',
            backRegister: true,
            numberLabel: '总数量',
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        valueChange (field, value, model) {
            switch (field) {
                case 'depositoryId':
                    let depository = this.selectOption.depositoryList.find(el => el.id === value)
                    if (depository) {
                        model.depositoryAddress = depository.detailedAddress
                        this.values = model
                    }
                    break
            }
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        getJson () {
            formGetJson({
                code: MATERIALEQUIPMENTMANAGEMENT.RECEIVEREGISTER
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        // 文件上传
        upLoadFileCallBack (data) {
            this.fileList = data
        },

        // 保存
        subNewPro () {
            this.$refs.generateForm.getData().then(res => {
                res = this.prepareData(res)
                if (this.$route.params.isAdd) {
                    registerAdd(res).then(resData => {
                        this.$message.success("添加成功~~~")
                        this.closeTab()
                    })
                } else {
                    res.id = this.$route.params.receiveInfo.id
                    registerEdit(res).then(resData => {
                        this.$message.success("编辑成功~~~")
                        this.closeTab()
                    })
                }
            })
        },

        prepareData (res) {
            res.fileList = this.fileList
            // 仓库
            let depositoryItem = this.selectOption.depositoryList.find(el => el.id === res.depositoryId)
            if(depositoryItem){ res.depositoryName = depositoryItem.name }

            if(util.isArray(res.section)) {
                res.section = util.jointData(res.section)
            }
            let materialListData = this.$refs.materialList.getData()
            materialListData.forEach(item => {
                item.type = '0'
            })
            res.materialList = materialListData
            res.depositoryId = this.$route.params.receiveInfo.depositoryId
            
            return res
        },

        setRomte (option) {
            this.remoteFuncs = {
                registertype (resolve) {
                    let option = [
                        { value: '0', label: '项目使用' },
                        { value: '1', label: '工程使用' },
                        { value: '2', label: '其他使用' },
                    ]
                    resolve(option)
                },
                getRelatedProjectId (resolve) {},
                getDepartmentId (resolve) { resolve(option.departList) },
                getAllUser (resolve) { resolve(that.$store.getters['d2admin/allUser/getData']) }
            }
        },

        formatData (data) {
            this.mianId = data.id
            this.values = data
            if(!this.$route.params.isAdd){
                this.materialListData = data.materialList
            }
            this.setFile(data.fileList)
            this.fileList = data.fileList
        },

        setFile(fileList){
            this.upLoadFileDefaultList = []
            if(fileList && fileList.length > 0){
                fileList.forEach(item => {
                    let tem = {
                        status: "finished",
                        response: {
                            name: item.name,
                            url: item.url,
                            size: item.size
                        }
                    }
                    this.upLoadFileDefaultList.push(tem)
                })
            }
        },
    },
    mounted () {
        this.formatData(this.$route.params.receiveInfo)
        this.transform.isShowDetails = this.$route.params.showDetail
    },
    created () {
        that = this
        getUserDepartById({	userId: util.cookies.get('uuid')}).then(res => { 
            this.selectOption['departList'] = res
        }).finally(() => {
            this.setRomte(this.selectOption)
            this.getJson()
        })
    }
}
</script>
<style lang="scss">
.address-book{
    .drawer-btn{
        margin-top: 30px;
        text-align: center;
    }
}
</style>