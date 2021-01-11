<template>
    <d2-container class="address-book">
        <el-card class="box-card cash-return">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFunctions"
                :remoteOption="remoteOption"
                :value="values"
                :transform="transform"
                ref="generateForm"/>
            <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button size="small" type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button type="primary" size="small" @click="closeTag">关闭</el-button>
            </div>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>

<script>
import bottomInformation from '../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { jointProectAdd, getProEdit, getProById, getProjectAllOptions } from '../../../../api/jointProject/index'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { getCompanyQueryTree } from '../../../../api/system/depart/depart'
import { CERTIFICATE } from '../../../../enum/FORMCODE'
import { PORJECT_INFO, PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import { mapActions } from 'vuex'
import QqtFlowTabs from "../../../../components/qqt-subassembly/qqt-flow-tabs/qqt-flow-tabs";
let that = this
export default {
    name: "projectRecords",
    components: { QqtFlowTabs, bottomInformation,
        'print-template-by-html': printTemplateByHtml },
    data () {
        return {
            jsonData: {},
            transform: {
                isShowDetails: true
            },
            remoteFunctions: {},
            values: {},
            tempData: {},
            remoteOption: {
                customer: [],
                departList: [],
                companyList: []
            },
            proId: '',
            code: BASICSCODE.JOINT_PROJECT
        }
    },
    methods: {
        
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),

        remoteFunc () {
            this.remoteFunctions = {
                getBusinessPersonnelId(resolve){ resolve(that.$store.getters['d2admin/allUser/getData']) },
                getJointPrincipalId(resolve){ resolve(that.remoteOption.customer) },
            }
        }, 
        closeTag () {
            let tagName = this.$route.path
            let path = '/projectManagement/jointProject/allProject'
            this.close ({ tagName, path })
        },

        async printTemplate () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': db.get('proID').value()}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        
        formatData (data) {
            let associatedTem = this.remoteOption.customer.find(el => el.id === data.associatedPersonId)
            data.associatedPerson = associatedTem ? associatedTem.cusName : ''
            let userTem = this.$store.getters['d2admin/allUser/getData'].find(el => el.id === data.businessPersonnelId)
            data.businessPersonnel = userTem ? userTem.name : ''
            let departTem = this.$store.getters['d2admin/allUser/getDepartData'].find(el => el.id === data.businessDepartmentId)
            data.businessDepartment = departTem ? departTem.name : ''
            return data
        },

        saveNewPro () {
            this.$refs.generateForm.getData().then(data => {
                data = this.formatData(JSON.parse(JSON.stringify(data)))
                data.id = this.proId
                let tem = {
                    id: this.proId,
                    jointProject: data
                }
                getProEdit(tem).then(res => {
                    this.$message.success('编辑成功~~~')
                    this.transform.isShowDetails = true
                })
            })
        },

        editInfo(){
            this.transform.isShowDetails = false
        },
        cancel () {
            this.values = this.tempData
            this.transform.isShowDetails = true
        },

        getInfo () {
            getProById({id: this.proId}).then(res => {
                this.values = res
                this.values.projectfund = res.untitled5.projectfund
                this.tempData = res
            })
        },

        getJson () {
            formGetJson({code: CERTIFICATE.PROJECTRECORDS}).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },

        getAllOption () {
            getProjectAllOptions().then(res => {
                this.remoteOption = res
                this.remoteFunc()
            })
            getCompanyQueryTree().then(list => { 
                this.remoteOption.companyList = [ list ]
                this.remoteOption.departList = this.$store.getters['d2admin/allUser/getDepartData']
            })
        }
    },
    async mounted() {
        that = this
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('proID').value()
        this.getAllOption()
        this.getInfo()
        this.getJson()
    }
}
</script>

<style scoped lang="scss">
.drawer-btn{
    text-align: center;
    margin-top: 150px
}
</style>
