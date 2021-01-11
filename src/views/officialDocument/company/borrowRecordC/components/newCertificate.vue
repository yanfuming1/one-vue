<template>
<div class="new-certificate">
    <div v-if="isEmpty">
        <fm-generate-form
            :data="jsonData"
            :remote="remoteFunctions"
            :value="values"
            :transform="transform"
            ref="generateForm"
            @on-change="selectChange">
            <template slot="nameCertificate">
                <el-form :model="formData" :rules="rules" ref="form">
                    <el-form-item label="证书类别或名称:" label-width="130px"> 
                    <el-select v-model="formData.name" placeholder="请选择证书类别或名称:" ref="costNameSelect" :disabled="transform.isShowDetails" style="width: 100%">
                        <el-option :value="formData.credentialId" style="width:  100%;height:200px;overflow: auto;background-color:#fff">
                            <el-tree
                                :data="certificateClassificationData"
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
                        <el-col :span="12" style="height: 58px !important">
                            <el-form-item label="到期提醒:">
                                <el-switch v-model="remindForm.isRemind" style="width: 100%" :disabled="transform.isShowDetails" @change="switchChange"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="被提醒人:" prop="remindId">
                                <el-select v-model="remindForm.remindId" filterable multiple style="width: 100%" :disabled="choseRemind" size="medium" placeholder="请选择">
                                    <el-option v-for="item in remindPeoList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="提醒方式:" prop="remindType">
                                <el-select v-model="remindForm.remindType" style="width: 100%" :disabled="choseRemind" size="medium" placeholder="请选择">
                                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </fm-generate-form>
        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
    </div>
    <div v-if="!isEmpty">
        <fm-generate-form
            :data="jsonData"
            :remote="remoteFunctions"
            :value="values" 
            :transform="transform"
            ref="generateForm" 
            @on-change="selectChange">
            <template slot="nameCertificate">
                <el-form :model="formData" :rules="rules" ref="form">
                    <el-form-item label="证书类别或名称:" label-width="130px"> 
                    <el-select v-model="formData.name" placeholder="请选择证书类别或名称:" ref="costNameSelect" :disabled="transform.isShowDetails" style="width: 100%">
                        <el-option :value="formData.credentialId" style="width:  100%;height:200px;overflow: auto;background-color:#fff">
                            <el-tree
                                :data="certificateClassificationData"
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
                        <el-col :span="12" style="height: 58px !important">
                            <el-form-item label="到期提醒:">
                                <el-switch v-model="remindForm.isRemind" style="width: 100%" :disabled="transform.isShowDetails" @change="switchChange"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="被提醒人:" prop="remindId">
                                <el-select v-model="remindForm.remindId" filterable multiple style="width: 100%" :disabled="choseRemind" size="medium" placeholder="请选择">
                                    <el-option v-for="item in remindPeoList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="提醒方式:" prop="remindType">
                                <el-select v-model="remindForm.remindType" style="width: 100%" :disabled="choseRemind" size="medium" placeholder="请选择">
                                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </fm-generate-form>
        <bottomInformation :values="values" :upLoadFileDefaultList="upLoadFileDefaultList" :transform="transform" ref="bottomInformation"></bottomInformation>
    </div>
</div>
</template>

<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { GetDepartTreeNew } from '../../../../../api/system/depart/depart-tree'
import { GetStaffByGroupId } from '../../../../../api/system/staff/staff'
import { getCertificateClassification } from '@api/officalDocument/classificationPersonalCertificates'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { CERTIFICATE } from '../../../../../enum/FORMCODE'
import util from '../../../../../libs/util'
let that = this
export default {
    name: "newCertificat",
    props:{
        value: {
            type: Object,
            default: {}
        },
        cerNameList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    components: {
        'bottomInformation': bottomInformation,
    },
    data () {
        return {
            jsonData: {},
            transform: {
                isShowDetails: true
            }, 
            remindPeoList: this.$store.getters['d2admin/allUser/getData'],
            isEmpty: true,
            departList: [],
            remindForm: {
                isRemind: false,
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
            defaultProps: {
                children: 'children',
                label: 'credentialName',
                value: 'id'
            },
            certificateClassificationData: [],
            upLoadFileDefaultList: [],
            choseRemind: true,
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
            remoteFunctions: {
                getUser (resolve) { resolve(that.$store.getters['d2admin/allUser/getData']) },
                getDepart (resolve) { resolve(that.$store.getters['d2admin/allUser/getDepartData']) },
                // getCerName (resolve) { resolve(that.cerNameList) }
            },
            formData: {
                name: '',
                credentialId: '',
                affiliationType: '1',
            },
            values: {
                name: '',
                credentialId: '',
                affiliationType: '1',
            },
            custodyDep: ''
        }
    },
    methods: {
        selectChange(field, val, model){
            switch(field){
                case 'openingDate':
                    // 发证日期
                    this.values.openingDate = val
                    if (this.values.dateDue !== '' && this.values.dateDue !== null) {
                        let openingDate = new Date (val)
                        let dateDue = new Date (this.values.dateDue)
                        if (dateDue < openingDate) {
                            this.$message.warning ('发证日期不能大于到期日期')
                            model.openingDate = ''
                            this.values = model
                        }
                    }
                    break
                case 'dateDue':
                    // 到期日期
                    this.values.dateDue = val
                    if (this.values.openingDate !== '' && this.values.openingDate !== null) {
                        let dateDue = new Date (val)
                        let openingDate = new Date (this.values.openingDate)
                        if (dateDue < openingDate) {
                            this.$message.warning ('发证日期不能大于到期日期')
                            model.dateDue = ''
                            this.values = model
                        }
                    }
                    break
                case 'theirDepartmentId':
                    this.departList.forEach ( item => {
                        if (val[0] == item.id) { item.child.forEach( son => {
                            if (val[1] == son.id) this.custodyDep = item.name + '/' + son.name
                            console.log(this.custodyDep)
                        } )}
                    })
                    this.getUserByDep(val[val.length-1])
                    break
            }
        },
        getCertificateClassificationEvent () {
            getCertificateClassification({affiliationType:this.formData.affiliationType}).then ( res => {
                if (res.length > 0) this.certificateClassificationData = res
            })
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
        getData () {
            let bottomItem = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                this.$refs.remindForm.validate((valid) => {
                    if(data && bottomItem && valid) {
                        Object.assign(data, bottomItem, this.remindForm, this.formData)
                        if(this.remindPeoList) {
                            this.remindPeoList.forEach(item => {
                                if(data.keeperId === item.id){ data.keeper = item.name }
                            })
                        }
                        let arr = []
                        if(util.isArray(data.remindId)) {
                            data.remindId.forEach(item => {
                                this.remindPeoList.forEach(tem => {
                                    if(item === tem.id){ arr.push(tem.name) }
                                })
                            })
                            data.remindPeople = arr.join(',')
                            data.remindId = data.remindId.join(',')
                        }
                        // this.cerNameList.forEach(item => {
                        //     if(data.credentialId === item.id){
                        //         data.name = item.name
                        //     }
                        // })
                        data.isRemind = data.isRemind ? '1' : '0'
                        data.custodyDep = this.custodyDep
                        this.$emit('setTemData', data)
                    }
                })
            })
        },
        setBackInfo(){
            // this.cerNameList.forEach(item => {
            //     if(item.name === this.values.name){
            //         this.values.credentialId = item.id
            //     }
            // })
            this.remindForm = {
                isRemind: this.values.isRemind === '1' ? true : false,
                remindId: this.values.remindId,
                remindType: this.values.remindType,
            }
            if(this.remindForm.remindId && util.isString(this.remindForm.remindId)) {
                this.remindForm.remindId = util.splitData(this.remindForm.remindId, ',')
            }
            if (this.values.theirDepartmentId) {
                this.getUserByDep(this.values.theirDepartmentId[this.values.theirDepartmentId.length-1])
            }
            this.fileDefaultNeaten (this.values)
            this.formData.name = this.values.name;
            this.formData.credentialId = this.values.credentialId
        },

        fileDefaultNeaten (res) {
            this.upLoadFileDefaultList = []
            if (res.fileList && res.fileList.length > 0) {
                res.fileList.forEach(item => {
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
            } 
        },

        setDetail (type) {
            this.transform.isShowDetails = type === '1' ? true : false
        },

        getUserByDep (id) {
            GetStaffByGroupId ({ 'depId': id, 'pageNo': '1',  'pageSize': '1000' }).then (res => {
                if (res.records && res.records.length > 0) {
                    this.neataData (res.records)
                    this.remindPeoList = res.records
                }
            })
        },
        
        neataData (allUser) {
            this.remoteFunctions = {
                getUser (resolve) { resolve(allUser) },
                getDepart (resolve) { resolve(that.departList) },
                remindType (resolve) {
                    let options = [
                        { value: '1', label: '短信' },
                        { value: '2', label: '钉钉' },
                        { value: '3', label: '消息' },
                    ]
                    resolve(options)
                },
                // getCerName (resolve) { resolve(that.cerNameList) }
            }
        },
        handleNodeClick (node){
            if(node){
                this.formData.name = node.credentialName
                this.formData.credentialId = node.id
                this.$refs.costNameSelect.blur()
                Object.assign(this.values, this.formData)
            }
        },
    },
    created() {
        that = this
        this.values = this.value.id ? this.value : {}
        this.setBackInfo()
        this.isEmpty = this.value.id ? false : true
        formGetJson({ 'code': CERTIFICATE.COMPANYCERADD}).then(res => {
            this.jsonData = JSON.parse(res)
        }).finally(() => {this.getCertificateClassificationEvent()})
        GetDepartTreeNew().then(res => { this.departList.push(res), this.neataData([]) })
    },
    watch: {
        value : {
            deep: true,
            handler: (newVal, old) =>{
                that.values = newVal.id ? newVal : {}
                that.isEmpty = newVal.id ? false : true
                that.setBackInfo()
            }
        } 
    }
}
</script>

<style lang="scss">

</style>
