<template>
    <d2-container>
        <el-card class="box-card closeHeader">
        <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
        <div class="ser-info" v-if="jsonData.list.length > 0">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFunctions"
                :value="values"
                :transform="information"
                ref="generateForm"
                @on-change="selectChange">
                <template slot="nameCertificate">
                    <el-form :model="values" :rules="rules" ref="form">
                        <el-form-item label="证书类别或名称:" label-width="130px" prop="name"> 
                            <el-select v-model="values.name" placeholder="请选择证书类别或名称:" ref="costNameSelect" :disabled="information.isShowDetails" style="width: 100%">
                                <el-option :value="values.credentialId" style="width:  100%;height:200px;overflow: auto;background-color:#fff">
                                    <el-tree
                                        :data="$route.params.nameList"
                                        :props="defaultProps"
                                        @node-click="handleNodeClick"
                                    ></el-tree>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </template>
                <template slot="remindForm">
                    <el-form ref="remindForm" :rules="remindFormRules" :model="remindForm" label-width="130px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="到期提醒:">
                                    <el-switch v-model="remindForm.remind" :disabled="information.isShowDetails" @change="switchChange"></el-switch>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="被提醒人:" prop="remindId">
                                    <el-select v-model="remindForm.remindId" filterable multiple :disabled="choseRemind" size="medium" style="width:100%;" placeholder="请选择">
                                        <el-option v-for="item in remindPeoList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="提醒方式:" prop="remindType">
                                    <el-select v-model="remindForm.remindType" :disabled="choseRemind" size="medium" style="width:100%;" placeholder="请选择">
                                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </fm-generate-form>
            <div>
                <up-load :isShowUpload="!information.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upLoad" />
                <bottomInformation :values="values" :isShowAccessory="false" :transform="information" ref="bottomInformation"></bottomInformation>
            </div>

            <div class="newCerDiv">
                <el-button type="warning" size="small" v-if="!information.isShowDetails" @click="saveData">保存</el-button>
                <!-- <el-button type="primary" v-if="!information.isShowDetails" size="small">提交</el-button> -->
                <el-button v-if="information.isShowDetails" type="info" size="small" @click="printTemplate">打印</el-button>
                <el-button v-if="!information.isShowDetails" size="small" @click="closeTab">取消</el-button>
                <el-button v-if="information.isShowDetails" type="primary" size="small" @click="closeTab">关闭</el-button>
            </div>
        </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
    import { upload } from '../../../../../../components/qqt-subassembly'
    import { formGetJson } from '../../../../../../api/system/fromManagement/index'
    import { credentialAdd,cerEdit ,companyCerAdd } from '../../../../../../api/officalDocument/index'
    import { CERTIFICATE } from '../../../../../../enum/FORMCODE'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
    import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
    import { GetDepartTreeNew } from '../../../../../../api/system/depart/depart-tree'
    import { mapActions } from 'vuex'
    import bottomInformation from '../../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
    import { GetStaffByGroupId } from '../../../../../../api/system/staff/staff'
    import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
    import util from '../../../../../../libs/util'
    let that = this
    export default {
        name: "index",
        components: {
            'up-load' : upload,
            'bottomInformation': bottomInformation,
            'print-template-by-html': printTemplateByHtml
        },
        data () {
            return {
                jsonData: {
                    "list": [],
                    "config": {
                        "labelWidth": 100,
                        "labelPosition": "right",
                        "size": "small",
                        "customClass": ""
                    }
                },
                information: {
                    isShowDetails: this.$route.params.isDetail
                },
                remoteFunctions: {},
                values: {
                    name: '',
                    credentialId: ''
                },
                //上传附件回显时临时存储
                upLoadFileDefaultList: [],
                formData: {
                    name: '',
                    credentialId: ''
                },
                urlData: [],
                optionMajor: [],
                optionLevel: [],
                isEdit: false,
                temData: {},
                remindForm: {
                    remind: false,
                    remindId: '',
                    remindType: '',
                },
                remindFormRules: {
                    remindId: [ ],
                    remindType: [ ]
                },
                rules: {
                    name: [{ required: true, message: "请选择证书分类或名称", trigger: ["blur",'change'] }],
                },
                typeOptions: [
                    {
                        value: '1',
                        label: '短信'
                    },
                    // {
                    //     value: '2',
                    //     label: '钉钉'
                    // },
                    // {
                    //     value: '4',
                    //     label: '微信'
                    // },
                    {
                        value: '3',
                        label: '系统消息'
                    }
                ],
                remindPeoList: this.$store.getters['d2admin/allUser/getData'],
                choseRemind: true,
                departList: [],
                custodyDepartmentName: '',
                code: BASICSCODE.ADMIN_CREDENTIAL,
                defaultProps: {
                    children: 'children',
                    label: 'credentialName',
                    value: 'id'
                },
            }
        },
        methods: {
            ...mapActions('d2admin/page', [
                'close',
                'open'
            ]),
            upLoadFileCallBack (data) {
                this.urlData = data
            },
            selectChange (field, value, models) {
                switch (field) {
                    case 'custodyDepartmentId':
                        models.staffId = ''
                        let i = 0
                        this.custodyDepartmentName = ''
                        this.getDepartmenName (this.departList, value, i)
                        this.getUserByDepartmentId (value[value.length-1])
                        break;
                }
            },

            getDepartmenName (departList, value, i) {
                departList.forEach (res => {
                    if (res.id == value[i]) {
                        this.custodyDepartmentName += res.name
                        if (res.child && res.child.length > 0) {
                            this.getDepartmenName (res.child, value, ++i)
                        }
                    }
                })
            },

            setData (data) {
                // this.$store.getters['d2admin/allUser/getData'].forEach(item => {
                if (this.remindPeoList) {
                    let temUserS = this.remindPeoList.find(el => el.id === data.staffId) 
                    if (temUserS) { data.staffName = temUserS.name }
                }
                let arr = []
                data.remindId && data.remindId.forEach(item => {
                    let temUser = this.remindPeoList.find(el => el.id === item)
                    if(temUser) { arr.push(temUser.name) }
                })
                data.remindName = arr.join(',')
                data.remindId = data.remindId.join(',')
                // let temCer = this.$route.params.nameList.find(el => el.id === data.credentialId)
                // if (temCer) { data.name = temCer.name }
                data.certiLineList.forEach(item => {
                    this.$route.params.level.forEach(it => {
                        if(item.levelId === it.id){ item.level = it.name }
                    })
                    this.$route.params.major.forEach(it => {
                        if(item.specialtyTypeId === it.id){ item.specialtyType = it.name }
                    })
                    that.$route.params.unitList.forEach(it => {
                        if(item.unitId === it.id){ item.issueUnit = it.name }
                    })
                })
                data.useFlow = data.useFlow ? '1' : '0'
                data.remind = data.remind ? '1' : '0'
                return data
            },
            saveData () {
                let item = this.$refs.bottomInformation.getData ()
                this.$refs.generateForm.getData().then(data => {
                    this.$refs.remindForm.validate(remindForm => {
                        if(data && remindForm) {
                            if(data.certiLineList[0].specialtyTypeId === ""){
                                this.$message.warning("请填写证书专业信息!!!")
                                return
                            } else {
                                Object.assign(this.formData,this.remindForm, data, item)
                                this.formData = this.setData(this.formData)
                                this.formData.fileList = this.urlData
                                this.formData.custodyDepartmentName = this.custodyDepartmentName
                                if(this.$route.params.isAdd){
                                    credentialAdd( this.formData ).then(res => {
                                        this.$message.success("添加成功")
                                        this.closeTab()
                                    })
                                }else{
                                    this.formData.certilineId = that.$route.params.info.certilineId
                                    this.formData.id = this.$route.params.info.id
                                    this.formData.custodyDepartmentName = this.custodyDepartmentName
                                // console.log(this.formData);
                                // console.log(this.values);
                                this.formData.name = this.values.name
                                // return
                                    cerEdit( this.formData ).then(res => {
                                        this.$message.success("编辑成功")
                                        this.closeTab()
                                    })
                                }
                            }
                        }
                    })
                })
            },
            closeTab(){
                this.$router.go(-1)
                let tagName = this.$route.path
                this.close ({ tagName })
            },
            printTemplate () {
                getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.info.id}).then(res => {
                    if (res) res.useNumber = '0', this.$refs.printTemp.printTemplate (res)
                })
            },
            fileReturn (fileList) {
                this.upLoadFileDefaultList = []
                this.urlData = fileList
                fileList.forEach(item => {
                    let m = {
                        status : 'finished',
                        response : {
                            url : item.url,
                            size: item.size,
                            name: item.name
                        }
                    }
                    this.upLoadFileDefaultList.push(m)
                })
            },
            getUserByDepartmentId (id) {
                GetStaffByGroupId ({
                    'depId': id,
                    'pageNo': '1',
                    'pageSize': '1000'
                }).then (res => {
                    if (res.records && res.records.length > 0) {
                        this.neataData (res.records)
                        // this.remindPeoList = res.records
                    }
                })
            },
            neataData (data) {
                this.remoteFunctions = {
                    getStaffId (resolve) { resolve(data) },
                    getDepartment (resolve) {
                        resolve(that.departList)
                        // resolve(that.$store.getters['d2admin/allUser/getDepartData'])
                    },
                    setMindType(resolve) {
                        let options = [
                            {value: '1', label: '短信'},
                            {value: '2', label: '钉钉'},
                            {value: '3', label: '消息'}
                        ]
                        resolve(options)
                    },

                    getCerName(resolve) { resolve(that.$route.params.nameList) },
                    getMajorType (resolve) { resolve(that.$route.params.major) },
                    getLevelId (resolve) { resolve(that.$route.params.level) },
                    getUnitList(resolve) { resolve(that.$route.params.unitList) }
                }
            },
            switchChange (value) {
                this.choseRemind = value ? false : true
                if(value) {
                    this.remindFormRules = {
                        remindId: [ { required: true, message: '请选择被提醒人', trigger: ['change', 'blur'] } ],
                        remindType: [ { required: true, message: '请选择提醒方式', trigger: ['change', 'blur'] } ]
                    }
                } else {
                    this.remindFormRules = {
                        remindId: [ ],
                        remindType: [ ]
                    }
                    this.remindForm = {
                        remind: false,
                        remindId: '',
                        remindType: '',
                    }
                }
                this.$refs.remindForm.resetFields()
            },

            handleNodeClick (node){
                if(node.parentId != '0'){
                    console.log(this.$route.params.nameList)
                    let list = this.$route.params.nameList
                    this.formData.name = this.values.name = node.credentialName
                    this.formData.credentialId = this.values.credentialId = node.id
                    this.$refs.costNameSelect.blur()
                } else {
                    this.$message.warning('请选择证书名称')
                    this.$refs.costNameSelect.blur()
                    return
                }
            },
        },
        created () {
            GetDepartTreeNew().then(res => { this.departList.push(res), this.neataData([]) })
        },
        mounted () {
            that = this

            if(this.$route.params.isAdd){
                this.neataData([])
            }else{
                if(this.$route.params.info){
                    if(this.$route.params.info.custodyDepartmentId) {
                        this.getUserByDepartmentId(this.$route.params.info.custodyDepartmentId[this.$route.params.info.custodyDepartmentId.length-1])
                    }
                    this.temData = this.$route.params.info
                    this.temData.useFlow = this.temData.useFlow === '1' ? true : false
                    if(!util.isArray(this.temData.remindId)) {
                        this.temData.remindId = util.splitData(this.temData.remindId, ',')
                    }
                    Object.assign(this.remindForm, this.temData)
                    const { remind, remindId, remindType } = this.temData
                    this.remindForm = {
                        remind: remind === '1' ? true : false, 
                        remindId: remindId, 
                        remindType: remindType,
                    }
                    this.temData.useNumber = this.temData.useNumber + ''
                    this.values = Object.assign({}, this.temData)
                    this.fileReturn(this.temData.fileList)
                }else{
                    this.isEdit = false
                }
            }
            formGetJson({'code': CERTIFICATE.CREATECERTIFICATE}).then(res => {
                this.jsonData = JSON.parse(res)
            })
        }
    }
</script>

<style lang="scss">
.newCerDiv{
    margin-top: 30px;
    text-align: center;
}
.ser-info{
    .form-table{
        .scope-action{ display: none; }
        .scope-index{ display: block !important; }
        &>button{ display: none; }
    }
}
</style>
