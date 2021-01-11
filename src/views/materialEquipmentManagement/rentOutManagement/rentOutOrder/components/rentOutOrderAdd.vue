<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="rent-out-box">
                <el-form :model="rentForm" :rules="rules" size="medium" ref="rentForm" class="rentForm" label-width="120px">
                    <el-row><el-divider content-position="left">基础信息</el-divider></el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出租订单单号:">
                                <qqt-input v-model="rentForm.rentalOrderNumber" :value="rentForm.rentalOrderNumber" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="出租订单名称:" prop="rentalOrderName">
                                <qqt-input v-model="rentForm.rentalOrderName" :value="rentForm.rentalOrderName" :isShowElement="!transform.isShowDetails"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出租合同单号:" prop="rentalContractNumber">
                                <qqt-input v-model="rentForm.rentalContractNumber" :value="rentForm.rentalContractNumber" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出租合同名称:" prop="rentalContractName">
                                <qqt-input v-model="rentForm.rentalContractName" :value="rentForm.rentalContractName" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物品名称:">
                                <qqt-input v-model="rentForm.rentalName" :value="rentForm.rentalType" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="类型:">
                                <qqt-input v-model="rentForm.rentalType" :value="rentForm.rentalType" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌:" prop="rentalBrand">
                                <qqt-input v-model="rentForm.rentalBrand" :value="rentForm.rentalBrand" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格型号:" prop="specificationsModels">
                                <qqt-input v-model="rentForm.specificationsModels" :value="rentForm.specificationsModels" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="计量单位:" prop="unitMeasurement">
                                <qqt-input v-model="rentForm.unitMeasurement" :value="rentForm.unitMeasurement" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单金额:">
                                <qqt-input v-model="rentForm.orderMoney" :value="rentForm.orderMoney" :isShowElement="noInput" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="结算方式:" prop="meansPayments">
                                 <qqt-input v-model="rentForm.meansPayments" :value="rentForm.meansPayments" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出租方:">
                                <qqt-input v-model="rentForm.lessor" :value="rentForm.lessor" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="承租方:">
                                <qqt-input v-model="rentForm.tenantry" :value="rentForm.tenantry" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出租单价:">
                                <qqt-input v-model="rentForm.rentalUnitPrice" :value="rentForm.rentalUnitPrice" :isShowElement="noInput" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出租天数:">
                                <qqt-input v-model="rentForm.rentNumberDays" :value="rentForm.rentNumberDays" :isShowElement="noInput" 
                                        :type="numberType" :btnTitle="'天'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计价方式:">
                                <qqt-input v-model="rentForm.pricingManner" :value="rentForm.pricingManner" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="滞纳金:">
                                <qqt-input v-model="rentForm.overdueFine" :value="rentForm.overdueFine" :isShowElement="noInput" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="退换期限:">
                                <el-select v-model="rentForm.eeturnDate" clearable style="width:100%;" :disabled="transform.isShowDetails">
                                    <el-option v-for="item in eeturnDateList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="完好度:">
                                <el-select v-model="rentForm.commence" clearable style="width:100%;" :disabled="!noInput">
                                    <el-option v-for="item in commenceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="仓库名称:">
                                <qqt-input v-model="rentForm.libraryStoragePlant" :value="rentForm.libraryStoragePlant" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                                <el-form-item label="仓库地点:">
                                <qqt-input v-model="rentForm.factoryLibraryLocation" :value="rentForm.factoryLibraryLocation" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单时间:">
                                <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.orderTime" type="date" :disabled="transform.isShowDetails"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否配送:">
                                <el-radio-group v-model="rentForm.distribution" :disabled="!noInput" @change="data => radioChange('distribution', data)">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="配送方式:">
                                <qqt-input v-model="rentForm.modeDistribution" :value="rentForm.carriage" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="运费:">
                                <qqt-input v-model="rentForm.carriage" :value="rentForm.carriage" :isShowElement="noInput" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否开具发票:">
                                <el-radio-group v-model="rentForm.invoice" @change="data => radioChange('invoice', data)" :disabled="!noInput">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                                <el-form-item label="发票类型:">
                                <qqt-input v-model="rentForm.invoiceType" :value="rentForm.invoiceType" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="押金:" prop="cashPledge">
                                <qqt-input v-model="rentForm.cashPledge" :value="rentForm.cashPledge" :isShowElement="noInput" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开票金额:">
                                <qqt-input v-model="rentForm.invoiceAmount" :value="rentForm.invoiceAmount" :isShowElement="noInput" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="税率:">
                                <qqt-input v-model="rentForm.taxRate" :value="rentForm.taxRate" :isShowElement="noInput" 
                                    :type="numberType" :btnTitle="'%'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="摘要:">
                                <qqt-input v-model="rentForm.digest" :value="rentForm.digest" :type='textarea' :isShowElement="!transform.isShowDetails"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-divider content-position="left">附件</el-divider>
                        <div class="up-load-div">
                            <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                        <bottomInformation :values="rentForm" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </el-row>
                </el-form> 
            </div>
            <div class="drawer-btn">
                <el-button type="warning" v-if="!transform.isShowDetails" size="small" @click="save">保存</el-button>
                <el-button v-if="!transform.isShowDetails && $has('material:rental:order:delete')" type="primary" size="small" @click="submit">提交</el-button>
                <el-button type="primary" size="small" @click="closeTab">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
import { getUserDepartById } from '../../../../../api/system/depart/depart'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { materialGroupList } from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
import { rentalOrderQueryById, rentalOrderAdd, rentalOrderEdit, rentalOrderSaveSubmit, } from 
        '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutOrder/index'
import { rentalContractQueryById } from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutContract/index'
import { upload, qqtInput, } from '../../../../../components/qqt-subassembly'
import util from '../../../../../libs/util'
let than = this
export default {
    components: {
        'up-load' : upload,
        'qqt-input' : qqtInput,
        'bottomInformation': bottomInformation
    },
    data () {
        than = this
        return {
            rentForm: {},
            noInput: false,
            rules: {
                rentalOrderName: [
                    { required: true, message: '请输入订单名称', trigger: ['change', 'blur'] } ,
                ]
            },
            transform: {
                isShowDetails: false,
            },
            rentalTypeList: [], // 类型
            commenceList: [
                { id: '1', name: '一成新' },{ id: '2', name: '二成新' },
                { id: '3', name: '三成新' },{ id: '4', name: '四成新' },
                { id: '5', name: '五成新' },{ id: '6', name: '六成新' },
                { id: '7', name: '七成新' },{ id: '8', name: '八成新' },
                { id: '9', name: '九成新' },{ id: '10', name: '十成新' },
            ],  // 完好度
            sectionList: [], // 工作部门
            isMoneyType: true,
            textarea: 'textarea',
            upLoadFileDefaultList: [],
            numberType: 'number',
            eeturnDateList: [],  // 退还期限
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close'
        ]),
        closeTab() {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        // 单选改变时
        radioChange(field, value) {
            switch (field) {
                case 'invoice':
                    // 是否开具发票
                    this.invoiceTypeChose = value === '1' ? false : true
                    if(value === '0') {
                        this.rentForm.invoiceTypeId = ''
                    }
                    break
                case 'distribution':
                    // 是否配送
                    this.distributionChose = value === '1' ? false : true
                    if(value === '0') {
                        this.rentForm.modeDistributionId = ''
                        this.rentForm.carriage = ''
                        this.rentForm.deliveryDate = ''
                    }
                    break
            }
        },
        upLoadFileCallBack (file) {
            this.rentForm.fileList = file
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
        prepareData (data) {
            return data
        },
        save () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.rentForm.validate((valid) => {
                if(valid) {
                    this.rentForm = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    Object.assign(this.rentForm, item)
                    let url = this.$route.params.isAdd ? rentalOrderAdd : rentalOrderEdit
                    url(this.rentForm).then(res => {
                        this.$message.success(this.$route.params.isAdd ? '添加成功~~~' : '编辑成功~~~')
                        this.closeTab()
                    })
                }
            })
        },
        submit () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.rentForm.validate((valid) => {
                if(valid) {
                    this.rentForm = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    Object.assign(this.rentForm, item)
                    rentalOrderSaveSubmit(this.rentForm).then(res => {
                        this.$message.success("提交成功~~~")
                        this.closeTab()
                    })
                }
            })
        },
        getPurchaseRequest(id) {
            rentalOrderQueryById({id: id}).then(res => {
                res.carriage =  res.carriage + ''
                res.cashPledge = res.cashPledge + ''
                res.distribution = res.distribution + ''
                res.invoice = res.invoice + ''
                res.taxRate = res.taxRate + ''
                res.invoiceAmount = res.invoiceAmount + ''
                res.orderMoney = res.orderMoney + ''
                res.rentalUnitPrice = res.rentalUnitPrice  + ''
                res.rentNumberDays = res.rentNumberDays + ''
                res.overdueFine = res.overdueFine + ''
                this.setFile(res.fileList)
                this.rentForm = JSON.parse(JSON.stringify(res))
            })
        },
        getOptions () {
            materialGroupList().then(res => { this.rentalTypeList = res })
            queryDicById({id: PURCHASEREQUEST.EETURNDATELIST}).then(res => { this.eeturnDateList = res })
        }
    },
    mounted() {

    },
    created () {
        this.getOptions()
        this.transform = this.$route.params.transform || {}
        if(this.$route.params.isAdd) {
            rentalContractQueryById({id : this.$route.params.contractId }).then(res => {
                res.invoiceAmount = res.taxForehead + ''
                res.orderMoney = res.contractAmount + ''
                res.rentalContractId = res.id
                res.carriage =  res.carriage + ''
                res.cashPledge = res.cashPledge + ''
                res.distribution = res.distribution + ''
                res.invoice = res.invoice + ''
                res.taxRate = res.taxRate + ''
                res.rentalUnitPrice = res.rentalUnitPrice  + ''
                res.rentNumberDays = res.rentNumberDays + ''
                res.overdueFine = res.overdueFine + ''
                delete res.id
                delete res.procInstId
                delete res.state
                delete res.rentalStatus
                delete res.procState
                delete res.deliveryStatus
                delete res.inventoryStatus
                delete res.createBy
                delete res.createName
                delete res.createTime
                delete res.departmentId
                delete res.departmentName

                this.rentForm = Object.assign({}, res)
            })
        } else {
            this.getPurchaseRequest(this.$route.params.relevancyId)
        }
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
.rentForm{
    .el-select{
        width: 100%;
    }
    .el-input__inner{
        border-radius: 0px;
    }
    .el-divider__text{
        display: inline-block;
        position: relative;
        padding-left: 27px;
        &::before{
            content: "";
            width: 3px;
            height: 15px;
            background-color: #346fff;
            position: absolute;
            top: 3px;
            left: 17px;
        }
    }
    .generate-from-divider___line{
        display: none;
    }
}
</style>