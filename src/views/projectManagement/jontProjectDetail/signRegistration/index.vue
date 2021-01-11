<template>
    <d2-container class="address-book">
        <el-card class="box-card">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm"/>
                <money-add-line ref="moneyAddLine" :isShowDetails="transform.isShowDetails" :dataInfo="addLineData"></money-add-line>
                <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                <div class="drawer-btn" v-if="transform.isShowDetails && transform.isShowEdit && $has('joint:apply:edit')">
                    <el-button type="primary" size="small" @click="editInfo">编辑</el-button>
                    <el-button size="small" type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                </div>
                <div class="drawer-btn" v-if="transform.isShowDetails && !transform.isShowEdit">
                    <el-button type="primary" size="small" @click="editInfo" v-if="values.audit == '0' ">编辑</el-button>
                    <el-button size="small" type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button type="primary" size="small" @click="closeTab">关闭</el-button>
                </div>
                <div class="drawer-btn" v-if="!transform.isShowDetails">
                    <el-button type="primary" size="small" @click="subNewPro" v-if="$has('joint:apply:add')">保存</el-button>
                    <el-button type="warning" size="small" @click="submitPro">提交</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { PORJECT_INFO, CER_INFO } from '../../../../enum/PROJECT'
import bottomInformation from '../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import moneyAddLine from '../components/moneyAddLine'
import { getProApplyById, signProEdit,contactInfoForList, getProjectAllOptions , signProSubmit } from '../../../../api/jointProject/index'
import { CITYJSON } from '../../../../enum/CTIYS'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import util from '../../../../libs/util'
import { mapActions } from 'vuex'
let that = this
let temDb = ''
export default {
    name: "index",
    components: {
        'money-add-line': moneyAddLine,
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data() {
        return {
            contactInfos:[],
            jsonData:{},
            remoteFuncs: {

            },
            values: {
                qualificationRequirement: [],
                section: [],
                line10List: [{}],
                projectLocation: [],
                projectType: [],
                fiveBigShotsId: []
            },
            temValue: {},
            transform:{
                isShowDetails: false,
                isShowEdit: false,
            },
            account: 0,
            proId: '',
            remoteOption: {},
            addLineData: {
                tableData: [{}],
                charge: '',
                bigWriteCharge: ''
            },
            code: BASICSCODE.JOINT_PROJECTSIGNUP
        }
    },
    methods:{
        ...mapActions('d2admin/db', [
            'database',
        ]),
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        subNewPro() {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if (data && item) {
                    data = Object.assign({}, data, item)
                    let temData = this.setData(data)
                    temData.id = this.proId
                    let tem = {
                        id: this.proId,
                        jointProjectApply: temData
                    }
                    signProEdit(tem).then(res => {
                        this.$message.success("保存成功~~")
                        this.transform.isShowDetails = true;
                        this.transform.isShowEdit = false;
                    })
                }
            })
        },
        //提交
        submitPro(){
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(data => {
                if (data && item) {
                    data = Object.assign({}, data, item)
                    let temData = this.setData(data);
                    temData.id = this.proId;
                    temData.charge = temData.charge === 'NaN' ? 0 : temData.charge;
                    let tem = {
                        id: this.proId,
                        jointProjectApply: temData
                    };
                    signProSubmit(tem).then(res => {
                        this.$message.success("提交成功~~");
                        this.transform.isShowDetails = true;
                        this.transform.isShowEdit = false;
                    })
                }
            })
        },
        setData (res) {
            this.remoteOption.customer.forEach(item => {
                if(res.associatedPersonId === item.id){
                    res.associatedPerson = item.cusName
                }
            })
            this.remoteOption.company.forEach(item => {
                if(res.biddingCompanyId === item.id){
                    res.biddingCompanyName = item.organiname
                }
            })
            res.associatedPersons = ''
            this.remoteOption.contactInfos.forEach(item => {
                if(res.associatedPersonIds === item.id){
                    res.associatedPersons = item.contact
                }
            })
            res.section = res.section ? util.jointData(res.section, ',') : res.section
            res.projectLocation = res.projectLocation ? util.jointData(res.projectLocation, '/') : res.projectLocation
            res.projectType = res.projectType ? util.jointData(res.projectType, ','):res.projectType
            res.qualificationRequirement = res.qualificationRequirement ? util.jointData(res.qualificationRequirement, ',') : res.qualificationRequirement
            // 项目经理、五大员、A证、B证、C证、
            res.projectManager = ''
            this.remoteOption.manager.forEach(item => {
                if(item.id === res.projectManagerId){
                    res.projectManager = item.possessor
                }
            })
            res.technicalDirector = ''
            this.remoteOption.principal.forEach(item => {
                if(item.id === res.technicalDirectorId){
                    res.technicalDirector = item.possessor
                }
            })
            res.acertificate = ''
            this.remoteOption.a.forEach(item => {
                if(item.id === res.acertificateId){
                    res.acertificate = item.possessor
                }
            })
            res.bcertificate = ''
            this.remoteOption.b.forEach(item => {
                if(item.id === res.bcertificateId){
                    res.bcertificate = item.possessor
                }
            })
            res.ccertificate = ''
            this.remoteOption.c.forEach(item => {
                if(item.id === res.ccertificateId){
                    res.ccertificate = item.possessor
                }
            })

            if(this.remoteOption.five.length > 0) {
                let temArr = []
                this.remoteOption.five.forEach(item => {
                    res.fiveBigShotsId.forEach(it => {
                        if(item.id === it) {
                            temArr.push(item.possessor)
                        }
                    })
                })
                res.fiveBigShots = util.jointData(temArr, ',')
            }
            res.fiveBigShotsId = res.fiveBigShotsId ? util.jointData(res.fiveBigShotsId, ',') : null

            let addData = this.$refs.moneyAddLine.getData()
            res.line10List = addData.tableData
            res.charge = addData.charge
            res.bigWriteCharge = addData.bigWriteCharge
            return res
        },
        cancel() {
            this.transform.isShowDetails = true;
            // this.transform.isShowEdit = false;
        },
        editInfo () {
            this.transform.isShowDetails = false;
            this.transform.isShowEdit = true
        },
        closeTab () {
            this.$router.go(-1);
            let tagName = this.$route.path;
            this.close ({ tagName});
        },

        async printTemplate () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': db.get('proID').value()}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        
        valueChange (m1, m2, m3) {
            this.values = m3
            switch(m1){
                case 'associatedPersonIds':
                    this.remoteOption.contactInfos.forEach(item => {
                        if(item.id === m2){
                            m3.phones = item.contactcell
                        }
                    })
                    this.values = m3
                    break
                case 'projectManagerId':
                    if(this.remoteOption.manager.length > 0){
                        this.remoteOption.manager.forEach(item => {
                            if (item.id === m2) {
                                // util.confirm
                                if(item.isAbuilding === '是' || item.isLoan === '1'){
                                    if(!util.confirm("您选择的证书是在建状态或者已经借出,请谨慎选择!!!")){
                                        m3.projectManagerId = ''
                                        this.values = m3
                                    }
                                }
                            }
                        })
                    }
                    break
                case 'technicalDirectorId':
                    if(this.remoteOption.principal.length > 0){
                        this.remoteOption.principal.forEach(item => {
                            if (item.id === m2) {
                                // util.confirm
                                if(item.isAbuilding === '是' || item.isLoan === '1'){
                                    if(!util.confirm("您选择的证书是在建状态或者已经借出,请谨慎选择!!!")){
                                        m3.technicalDirectorId = ''
                                        this.values = m3
                                    }
                                }
                            }
                        })
                    }
                    break
                case 'acertificateId':
                    if(this.remoteOption.a.length > 0){
                        this.remoteOption.a.forEach(item => {
                            if (item.id === m2) {
                                // util.confirm
                                if(item.isAbuilding === '是' || item.isLoan === '1'){
                                    if(!util.confirm("您选择的证书是在建状态或者已经借出,请谨慎选择!!!")){
                                        m3.acertificateId = ''
                                        this.values = m3
                                    }
                                }
                            }
                        })
                    }
                    break
                case 'bcertificateId':
                    if(this.remoteOption.b.length > 0){
                        this.remoteOption.b.forEach(item => {
                            if (item.id === m2) {
                                // util.confirm
                                if(item.isAbuilding === '是' || item.isLoan === '1'){
                                    if(!util.confirm("您选择的证书是在建状态或者已经借出,请谨慎选择!!!")){
                                        m3.bcertificateId = ''
                                        this.values = m3
                                    }
                                }
                            }
                        })
                    }
                    break
                case 'ccertificateId':
                    if(this.remoteOption.c.length > 0){
                        this.remoteOption.c.forEach(item => {
                            if (item.id === m2) {
                                // util.confirm
                                if(item.isAbuilding === '是' || item.isLoan === '1'){
                                    if(!util.confirm("您选择的证书是在建状态或者已经借出,请谨慎选择!!!")){
                                        m3.ccertificateId = ''
                                        this.values = m3
                                    }
                                }
                            }
                        })
                    }
                    break
                case 'fiveBigShotsId':
                    // 多选
                    if(this.remoteOption.five.length > 0) {
                        this.remoteOption.five.forEach(item => {
                            m2.forEach(it => {
                                if(item.id === it.id) {
                                    if(item.isAbuilding === '是' || item.isLoan === '1'){
                                        if(!util.confirm("您选择的证书是在建状态或者已经借出,请谨慎选择!!!")){
                                            m3.fiveBigShotsId = []
                                            this.values = m3
                                            return false
                                        }
                                    }
                                }
                            })
                        })
                    }
                    break
                default:
                    break
                    
                this.values[field] = value
            }
        },
        async getProInfo() {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            getProApplyById({
                id: this.proId
            }).then(res => {
                if (res.audit === '1') {
                    this.transform.isShowDetails = true
                    this.transform.isShowEdit = false
                }
                if(util.isString(res.qualificationRequirement)){
                    res.qualificationRequirement = util.splitData(res.qualificationRequirement, ',')
                }
                res.section = util.isArray(res.section) ? res.section : []
                res.qualificationRequirement = util.isArray(res.qualificationRequirement) ? res.qualificationRequirement : []
                res.projectType = util.isArray(res.projectType) ? res.projectType : []
                res.fiveBigShotsId = res.fiveBigShotsId && res.fiveBigShotsId.length > 0 && res.fiveBigShotsId[0] != '' ? res.fiveBigShotsId : null
                this.addLineData.tableData = util.isArray(res.line10List) ? res.line10List : [{}]
                this.values = res
                setTimeout(() => {
                    this.transform.isShowDetails = false
                },300)
                setTimeout(() => {
                    this.transform.isShowDetails = true
                },700)
            }).finally(res => {
                this.getInfo()
            })
        },
        getInfo(){
            contactInfoForList({ id: this.values.associatedPersonId }).then(res => {
                this.contactInfos = res.contactInfos
                // this.setRemot(res.contactInfos)
                this.remoteOption.contactInfos = res.contactInfos
                this.setRemotFunc(this.remoteOption)
            }).finally(() => {
                this.getJson()
            })
        },
        getJson(){
            formGetJson({
                code: PORJECT_INFO.SIGNREGISTRATION
            }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        setRemotFunc (option) {
            this.remoteFuncs = {
                getAssociatedPerson (resolve) {resolve(option.customer)},
                getPlace (resolve) {resolve(CITYJSON)},
                getFiveBigShots (resolve) {resolve(option.five)},
                getProjectManager (resolve) {resolve(option.manager)},
                getTechnicalDirector (resolve) {resolve(option.principal)},
                getAcertificate (resolve) {resolve(option.a)},
                getBcertificate (resolve) {resolve(option.b)},
                getCcertificate (resolve){resolve(option.c)},
                getSection(resolve) {resolve(option.section)},
                getProjectType(resolve) {resolve(option.projectType)},
                getBiddingCompany(resolve){resolve(option.company)},
                getRequirement(resolve) {resolve(option.aptitude)},
                getContactPerson(resolve){resolve(option.contactInfos)}
            }
        },
    },
    async created () {
        that = this
        temDb = await this.database()
    },
    mounted() {
        getProjectAllOptions().then(res => {
            this.remoteOption = res
        }).finally(() => {
            this.getProInfo()
        })
    },
}
</script>

<style scoped lang="scss">
.drawer-btn{
    text-align: center;
}
</style>
