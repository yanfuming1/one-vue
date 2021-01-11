<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="rent-out-box">
                <el-form :model="rentForm" :rules="rules" size="medium" ref="rentForm" class="rentForm" label-width="120px">
                    <el-row><el-divider content-position="left">基础信息</el-divider></el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="归还登记单号:">
                                <qqt-input v-model="rentForm.returnRegistrationNumber" :value="rentForm.returnRegistrationNumber" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="登记单名称:" prop="rentalOrderName">
                                <qqt-input v-model="rentForm.returnRegistrationName" :value="rentForm.returnRegistrationName" :isShowElement="!transform.isShowDetails"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="类型:" prop="rentalType">
                                <qqt-input v-model="rentForm.rentalType" :value="rentForm.rentalType" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出租订单单号:">
                                <qqt-input v-model="rentForm.rentalOrderNumber" :value="rentForm.rentalOrderNumber" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出租订单名称:" prop="rentalOrderName">
                                <qqt-input v-model="rentForm.rentalOrderName" :value="rentForm.rentalOrderName" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请时间:">
                                <el-date-picker value-format='yyyy-MM-dd' v-model="rentForm.orderTime" type="date" :disabled="!noInput"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="品牌:">
                                <qqt-input v-model="rentForm.rentalBrand" :value="rentForm.rentalBrand" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格型号:" prop="specificationsModels">
                                <qqt-input v-model="rentForm.specificationsModels" :value="rentForm.specificationsModels" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="存放仓库:">
                                <qqt-input v-model="rentForm.libraryStoragePlant" :value="rentForm.libraryStoragePlant" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="仓库地点:">
                                <qqt-input v-model="rentForm.factoryLibraryLocation" :value="rentForm.factoryLibraryLocation" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="数量:">
                                <qqt-input v-model="rentForm.quantity" :value="rentForm.quantity" :isShowElement="noInput" :type="numberType"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原值:">
                                <qqt-input v-model="rentForm.originalValue" :value="rentForm.originalValue" :isShowElement="noInput" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
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
                                <el-form-item label="出租天数:" prop="rentNumberDays">
                                <qqt-input v-model="rentForm.rentNumberDays" :value="rentForm.rentNumberDays" :isShowElement="!transform.isShowDetails" 
                                        :type="numberType" :btnTitle="'天'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计价方式:"> 
                                <!-- 合同中 commence -->
                                <qqt-input v-model="rentForm.pricingManner" :value="rentForm.pricingManner" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                                <el-form-item label="滞纳金:">
                                <qqt-input v-model="rentForm.overdueFine" :value="rentForm.overdueFine" :isShowElement="!transform.isShowDetails" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <!-- <el-col :span="8">
                            <el-form-item label="租用周期:">
                                 <qqt-input v-model="rentForm.leasePeriod" :value="rentForm.leasePeriod" :type="numberType" :btnTitle="'天'" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item label="出租完好度:"> 
                                <!-- 合同中 commence -->
                                <qqt-input v-model="rentForm.rentalIntegrity" :value="rentForm.rentalIntegrity" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="归还完好度:" prop="returnIntegrity">
                                <el-select v-model="rentForm.returnIntegrity" clearable style="width:100%;" :disabled="transform.isShowDetails">
                                    <el-option v-for="item in commenceList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="结算方式:">
                                 <qqt-input v-model="rentForm.meansPayments" :value="rentForm.meansPayments" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="总价:" prop="totalPrices">
                                 <qqt-input v-model="rentForm.totalPrices" :value="rentForm.totalPrices" :isShowElement="!transform.isShowDetails" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合同金额:">
                                <qqt-input v-model="rentForm.rent" :value="rentForm.rent" :isShowElement="noInput" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="押金:">
                                <qqt-input v-model="rentForm.cashPledge" :value="rentForm.cashPledge" :isShowElement="!transform.isShowDetails" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="仓库名称:">
                                <qqt-input v-model="rentForm.libraryStoragePlant" :value="rentForm.libraryStoragePlant" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                                <el-form-item label="仓库地点:">
                                <qqt-input v-model="rentForm.factoryLibraryLocation" :value="rentForm.factoryLibraryLocation" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否超期:" prop="whetherExtended">
                                <el-radio-group v-model="rentForm.whetherExtended" :disabled="transform.isShowDetails" @change="data => radioChange('whetherExtended', data)">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="滞纳金缴纳金额:">
                               <qqt-input v-model="rentForm.amountLateFe" :value="rentForm.amountLateFe" :isShowElement="!isAmountLateFe" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否赔偿:" prop="compensation">
                                <el-radio-group v-model="rentForm.compensation" :disabled="transform.isShowDetails" @change="data => radioChange('compensation', data)">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="赔偿方式:">
                               <el-select v-model="rentForm.waysCompensation" clearable style="width:100%;" @change="compensationChange" :disabled="!needCompensation">
                                    <el-option v-for="item in waysCompensationList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="赔偿金:">
                                <qqt-input v-model="rentForm.damage" :value="rentForm.damage" :isShowElement="needCompensation" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="押金退还:">
                                <qqt-input v-model="rentForm.depositEfund" :value="rentForm.depositEfund" :isShowElement="!transform.isShowDetails" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
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
                        <el-divider content-position="left">生产商信息</el-divider>
                        <el-col :span="8">
                            <el-form-item label="生产商:">
                                <qqt-input v-model="rentForm.manufacturer" :value="rentForm.manufacturer" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人:">
                                <qqt-input v-model="rentForm.manufacturerContacts" :value="rentForm.manufacturerContacts" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话:">
                                <qqt-input v-model="rentForm.manufacturerPhone" :value="rentForm.manufacturerPhone" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-divider content-position="left">供应商信息</el-divider>
                        <el-col :span="8">
                            <el-form-item label="供应商:">
                                <qqt-input v-model="rentForm.supplier" :value="rentForm.supplier" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人:">
                                <qqt-input v-model="rentForm.supplierContacts" :value="rentForm.supplierContacts" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话:">
                                <qqt-input v-model="rentForm.supplierPhone" :value="rentForm.supplierPhone" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-divider content-position="left">附件</el-divider>
                        <div class="up-load-div">
                        <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                    </el-row>
                </el-form> 
            </div>
            <div class="drawer-btn">
                <el-button type="warning" v-if="!transform.isShowDetails" size="small" @click="save">保存</el-button>
                <el-button v-if="!transform.isShowDetails" type="primary" size="small" @click="submit">提交</el-button>
                <el-button type="primary" size="small" @click="closeTab">关闭</el-button>
            </div>
        </el-card>
    </d2-container>
</template>
<script>
import { mapActions } from 'vuex'
import { queryDicById } from '../../../../../api/system/dic/dic'
import { PURCHASEREQUEST } from '../../../../../enum/DICTIONARY'
import { materialGroupList } from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutApply/index'
import { rentalOrderQueryById,} from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutOrder/index'
import { rentalReturnQueryById, rentalReturnAdd, rentalReturnEdit, rentalReturnSaveSubmit } from '../../../../../api/materialEquipmentManagement/rentOutManagement/rentOutReturn/index'
import { upload, qqtInput, } from '../../../../../components/qqt-subassembly'
import util from '../../../../../libs/util'
export default {
    components: {
        'up-load' : upload,
        qqtInput,
    },
    data () {
        return {
            rentForm: {},
            noInput: false,
            rules: {
                'rentalOrderName': [ { required: true, message: '请输入登记单名称', trigger: ['blur', 'change'] }, ],
                'rentNumberDays': [ { required: true, message: '请输入出租天数', trigger: ['blur', 'change'] }, ],
                'returnIntegrity': [ { required: true, message: '请选择归还完好度', trigger: ['blur', 'change'] }, ],
                'totalPrices': [ { required: true, message: '请输入总价', trigger: ['blur', 'change'] }, ],
                'whetherExtended': [ { required: true, message: '请选择是否超期', trigger: ['blur', 'change'] }, ],
                'compensation': [ { required: true, message: '请选择是否赔偿', trigger: ['blur', 'change'] }, ],
            },
            transform: {
                isShowDetails: false,
            },
            commenceList: [],  // 完好度
            waysCompensationList: [],  // 赔偿方式
            isMoneyType: true,
            textarea: 'textarea',
            upLoadFileDefaultList: [],
            numberType: 'number',
            needCompensation: false,
            isAmountLateFe: true,
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
                case 'compensation':
                    // 是否赔偿
                    this.needCompensation = value === '1' ? true : false
                    this.rentForm.waysCompensation = value === '1' ? this.rentForm.waysCompensation : ''
                    this.rentForm.damage = value === '1' ? this.rentForm.damage : ''
                    break
                case 'whetherExtended':
                    // 是否超期
                    this.isAmountLateFe = value === '1' ? false : true
                    this.rentForm.amountLateFe = value === '1' ? this.rentForm.amountLateFe : ''
                    break
            }
        },
        upLoadFileCallBack (file) {
            this.rentForm.fileList = file
        },
        // 赔偿方式
        compensationChange (value) {
            console.log(value)
            this.$set(this.rentForm, this.rentForm.waysCompensation, value)
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
            this.$refs.rentForm.validate((valid) => {
                if(valid) {
                    this.rentForm = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    let url = this.$route.params.isAdd ? rentalReturnAdd : rentalReturnEdit
                    url(this.rentForm).then(res => {
                        this.$message.success(this.$route.params.isAdd ? '添加成功~~~' : '编辑成功~~~')
                        this.closeTab()
                    })
                }
            })
        },
        submit () {
            this.$refs.rentForm.validate((valid) => {
                if(valid) {
                    this.rentForm = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    rentalReturnSaveSubmit(this.rentForm).then(res => {
                        this.$message.success("提交成功~~~")
                        this.closeTab()
                    })
                }
            })
        }, 
        getPurchaseRequest(id) {
            rentalReturnQueryById({id: id}).then(res => {
                this.setFile(res.fileList)
                
                res.quantity = res.quantity + ''
                res.cashPledge = res.cashPledge + ''
                res.totalPrices = res.totalPrices + ''
                res.damage = res.damage + ''
                res.depositEfund = res.depositEfund + ''
                res.originalValue = res.originalValue + ''
                res.overdueFine = res.overdueFine + ''
                res.rent = res.rent + ''
                res.rentalUnitPrice = res.rentalUnitPrice + ''

                this.needCompensation = this.transform.isShowDetails ? false : res.compensation === '1' ? false : true
                this.isAmountLateFe = this.transform.isShowDetails ? true : res.whetherExtended === '1' ? false : true

                res = this.changeType(res)
                this.rentForm = JSON.parse(JSON.stringify(res))
            })
        },
        getOptions () {
            queryDicById({id: PURCHASEREQUEST.COMMENCE}).then(res => { this.commenceList = res })
            queryDicById({id: PURCHASEREQUEST.WAYSCOMPENSATIONLIST}).then(res => { console.log(res) 
                this.waysCompensationList = res })
        },
        changeType (res) {
            res.cashPledge = res.cashPledge + ''
            res.rentalUnitPrice = res.rentalUnitPrice  + ''
            res.rentNumberDays = res.rentNumberDays + ''
            res.overdueFine = res.overdueFine + ''

            return res
        }
    },
    mounted() {

    },
    created () {
        this.getOptions()
        this.transform = this.$route.params.transform || {}
        if(this.$route.params.isAdd) {
            rentalOrderQueryById({id : this.$route.params.orderId }).then(res => {
                res.rentalContractId = res.id
                res.id = ''
                res.digest = ''
                res = this.changeType(res)
                res.quantity = res.quantity + ''
                res.rentalIntegrity = res.commence + ''
                res.rent = res.orderMoney + ''

                res.procInstId = null
                res.state = null
                res.rentalStatus = null
                res.procState = null
                res.rentalStatus = null
                res.deliveryStatus = null
                res.inventoryStatus = null
                res.createBy = null
                res.createName = null
                res.createTime = null
                res.updateBy = null
                res.updateName = null
                res.updateTime = null
                this.rentForm = JSON.parse(JSON.stringify(res))
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
}
</style>