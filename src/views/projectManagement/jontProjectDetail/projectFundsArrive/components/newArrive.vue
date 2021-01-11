<template>
    <d2-container class="arrive-new">
        <el-dialog
            v-dialogDrag
            title="提示"
            :visible.sync="hint"
            width="30%"
            :close-on-click-modal="false"
            :before-close="hintEnter">
            <div style="text-align:center;">
                <img src="../../components/img/mark.png">
                <p style="color:red;text-align:center;font-size:18px;">此项目的立项审批没有通过不能进行到账资金登记！</p>
            </div>
            <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
                <el-button size="mini" type="primary" @click="hintEnter">去立项登记查看</el-button>
            </span>
        </el-dialog>
        <el-card class="box-card closeHeader">
            <div slot="header" ><el-button type="text" @click="cancel"><i class="el-icon-close"></i></el-button></div>
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                @btn-click="choseData"
                ref="generateForm"/>
            <bottomInformation :values="values" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div class="drawer-btn">
                <el-button type="primary" v-if="!transform.isShowDetails" size="small" @click="subInfo">保存</el-button>
                <el-button type="warning" v-if="!transform.isShowDetails && $has('joint:funds:submit')" size="small" @click="submitInfo">提交</el-button>
                <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                <el-button size="small" v-if="!transform.isShowDetails" @click="cancel">取消</el-button>
                <el-button type="primary" v-if="transform.isShowDetails" size="small" @click="cancel">关闭</el-button>
            </div>
            <fund-determination :dialogVisible='dialogVisible' :fromBack='fromBack' @closeDialog='closeDialog' @getData='getDialogData'></fund-determination>
        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    </d2-container>
</template>
<script>
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { getProById,getProjectAllOptions } from '../../../../../api/jointProject/index'
import { upload } from '@/components/qqt-subassembly'
import { PORJECT_INFO } from '../../../../../enum/PROJECT'
import bottomInformation from '../../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import fundDetermination from '../../cashDepositManagement/components/fundDetermination'
import { projectFundsAdd,projectFundsEdit,projectFundsSubmit } from '../../../../../api/jointProject/projectFund/index'
import { mapActions } from 'vuex'
import util from '../../../../../libs/util'
import { operationalLog } from '../../../../../api/system/loginLog/operationalLog'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
let that = this
export default {
    name: 'newArrive',
    components:{
        fundDetermination,
        bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data() {
        return {
            hint: false,
            dialogVisible: false,
            jsonData: {},
            remoteFuncs: {
            },
            values: {
                payUnit: "",
                accountNumber: "",
                arrivalMoney: "",
                openingBank: "",
                projectPool: '',
            },
            proId: '',
            transform: {
                isShowDetails: false
            },
            accountFundId: '',
            projectBalance: '',
            projectTotalMoney: '',
            remoteOptions: {},
            temValue: {},
            fromBack: true,
            fileList: [],
            upLoadFileDefaultList: [],
            code: BASICSCODE.JOINT_PROJECT_FUNDS
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        hintClose(){
            this.hint = false;
        },
        hintEnter(){
            let tagName = this.$route.path
            let path = '/projectManagement/jontProjectDetail/projectApproval'
            let name = 'projectApproval'
            this.close ({ tagName, path, name })
        },
        submitInfo(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    Object.assign(res, bottomInformation)
                    res.section = util.jointData(res.section, ',')
                    res.accountFundId = this.accountFundId;
                    res.projectId = this.proId;
                    res.fileList = this.fileList
                    res.accountFundId = this.accountFundId === '' ?  this.$route.params.fundInfo.accountFundId : this.accountFundId ;
                    if(!this.$route.params.isAdd){
                        res.id = this.$route.params.fundInfo.id;
                    }
                    let tem = {
                        id: this.proId,
                        projectFunds: res
                    };
                    projectFundsSubmit(tem).then(res => {
                        this.$message.success("提交成功~~~");
                        this.cancel()
                    })
                }
            });
        },
        subInfo() {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    Object.assign(res, bottomInformation)
                    res.section = util.jointData(res.section, ',')
                    res.accountFundId = this.accountFundId;
                    res.fileList = this.fileList
                    res.projectId = this.proId
                    let tem = {
                        id: this.proId,
                        projectFunds: res
                    }
                    if(this.$route.params.isAdd){
                        projectFundsAdd(tem).then(res => {
                            this.$message.success("添加成功~~~")
                            this.cancel()
                        })
                    }else{
                        tem.projectFunds.id = this.$route.params.fundInfo.id
                        tem.projectFunds.projectId = this.$route.params.fundInfo.projectId
                        tem.projectFunds.accountFundId = this.accountFundId === '' ?  this.$route.params.fundInfo.accountFundId : this.accountFundId ;
                        projectFundsEdit(tem).then(res => {
                            that.$message.success("编辑成功~~~")
                            that.cancel()
                        })
                    }
                }
            })
        },
        closeDialog(){
            this.dialogVisible = false
        },
        getDialogData(data){
            this.dialogVisible = false
            this.values.payUnit = data.payaccount
            this.values.accountNumber = data.paynum
            this.values.arrivalMoney = data.gatheringamount
            this.values.projectRemainingSum = data.gatheringamount
            this.values.openingBank = data.paybank
            this.values.arrivalDate = data.createdbytime
            this.values.bigWrite = util.convertCurrency(data.gatheringamount)
            this.values.gatheringaccount = data.gatheringaccount
            this.values.gatheringbank = data.gatheringbank
            this.values.gatheringtime = this.values.arrivalDate = data.gatheringtime
            this.values.gatheringway = data.gatheringway
            this.accountFundId = data.id
        },
        choseData(value, field){
            switch(field){
                case 'payUnit' :
                    if (!this.transform.isShowDetails) {
                        this.dialogVisible = true
                    }
                    break
                default:
                    break
            }
        },
        cancel() {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        async printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.$route.params.fundInfo.id}).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        showDialog() {
            this.dialogVisible = true
        },
        handleClose(done) {
            done()
        },
        valueChange(field, value, model) {
            // this.values = Object.assign({}, this.values, model)
            this.$set(this.values, field, value)
            switch (field) {
                case 'payUnit':
                    this.$route.params.payUnit.forEach(item => {
                        if(item.name === value){
                            model.openingBank = item.openingBank
                            model.accountNumber = item.account
                            this.values = Object.assign({}, this.values, model) 
                        }
                    })
                    break
                case 'tenderPrice':
                    this.values.tenderPrice = value + ''
                    break
                case 'projectPool':
                    if(Number(value) > Number(model.arrivalMoney) || parseFloat(value) < 0) {
                        this.$message.warning(parseFloat(value) < 0 ? '认定到项目资金池的金额不能小于0' : '认定到项目资金池的金额不能大于本次到账的金额!!!')
                        model.projectPool = parseFloat(value) < 0 ? '0' : model.arrivalMoney
                    }
                    model.projectRemainingSum = Number(model.arrivalMoney) - Number(model.projectPool) + ''
                    this.values = Object.assign({}, this.values, model)
                    break
                default:
                    break
            }
        },
        getProInfo() {
            getProById({ id :  this.proId }).then(res => {
                this.hint = res.state === '3' ? false :true ;
                this.values.projectName = res.projectName;
                this.values.tenderPrice = res.tenderPrice;
                this.values.projectBalance = res.projectBalance + ''
                this.values.projectTotalMoney = res.projectTotalMoney + ''
                this.values.section = res.section !== '' ? util.splitData(res.section, ',') : []
            }).finally(() => {
                this.getJson()
            })
        },
        getJson() {
            formGetJson({ code: PORJECT_INFO.FUNDSARRIVE }).then(res => {
                this.jsonData = JSON.parse(res)
            })
        },
        setInfo(data){
            data.projectBalance = data.projectBalance + ''
            data.projectTotalMoney = data.projectTotalMoney + ''
            data.section = util.isString(data.section) ? util.splitData(data.section, ',') : data.section
            data.bigWrite = util.convertCurrency(data.arrivalMoney)
            this.fileList = data.fileList
            this.setFile(data.fileList)
            Object.assign(this.values, data)
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
        
        async getInfo(){
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            if(this.$route.params.isAdd){
                this.getProInfo()
            }else{
                this.setInfo(this.$route.params.fundInfo)
                this.getJson()
            }
        },
        setRemote(option){
            this.remoteFuncs = {
                getSection(resolve) {
                    resolve(option.section)
                },
                getPayUnit(resolve){
                    let options = []
                    resolve(options)
                }
            }
        }
    },
    mounted() {
        getProjectAllOptions().then(options => {
            this.setRemote(options)
            this.remoteOptions = options
        }).finally(() => {
            that = this
            this.getInfo()
        })
    },

    created () {
        if(this.$route.params.isShowDetail){
            this.transform.isShowDetails = true
        } else {
            this.transform.isShowDetails = false
        }
    }
}
</script>
<style lang="scss">
.arrive-new{
    .el-dialog__footer{
        text-align: center;
    }
}
.drawer-btn{
    text-align: center;
}
</style>
