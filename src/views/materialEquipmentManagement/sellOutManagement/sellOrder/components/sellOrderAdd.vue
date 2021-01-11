<template>
    <d2-container class="address-book open-tender">
        <el-card class="box-card closeHeader">
            <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div class="rent-out-box">
                <el-form :model="rentForm" :rules="rules" size="medium" ref="rentForm" class="rentForm" label-width="140px">
                    <el-row><el-divider content-position="left">基础信息</el-divider></el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出售订单单号:">
                                <qqt-input v-model="rentForm.ordercode" :value="rentForm.ordercode" :placeholder="'自动生成'" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出售单名称:" prop="ordername">
                                <qqt-input v-model="rentForm.ordername" :value="rentForm.ordername" :isShowElement="!transform.isShowDetails"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物品名称:">
                                <qqt-input v-model="rentForm.name" :value="rentForm.name" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="出售合同单号:">
                                <qqt-input v-model="rentForm.contractcode" :value="rentForm.contractcode" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出售合同名称:">
                                <qqt-input v-model="rentForm.contractname" :value="rentForm.contractname" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="品牌:">
                                <qqt-input v-model="rentForm.brandName" :value="rentForm.brandName" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="规格型号:">
                                <qqt-input v-model="rentForm.specificationName" :value="rentForm.specificationName" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="数量:">
                                <qqt-input v-model="rentForm.number " :value="rentForm.number " :type="numberType" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计量单位:">
                                <qqt-input v-model="rentForm.unit" :value="rentForm.unit" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="合同金额:">
                                <qqt-input v-model="rentForm.contractMoney" :value="rentForm.contractMoney" :isShowElement="noInput" 
                                        :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="结算方式:">
                                 <qqt-input v-model="rentForm.settlementMethod" :value="rentForm.settlementMethod" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="退换期限:" prop="refundPeriod">
                                <el-select v-model="rentForm.refundPeriod" clearable style="width:100%;" :disabled="transform.isShowDetails">
                                    <el-option v-for="item in eeturnDateList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="是否配送:">
                                <el-radio-group v-model="rentForm.isdelivery" :disabled="!noInput" @change="data => radioChange('isdelivery', data)">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="配送方式:">
                                <qqt-input v-model="rentForm.deliveryWay" :value="rentForm.deliveryWay" :isShowElement="noInput"></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="运费:">
                                <qqt-input v-model="rentForm.carriage" :value="rentForm.carriage" :isShowElement="noInput" 
                                    :isMoneyType="isMoneyType" :btnTitle="'元'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="是否开具发票:">
                                <el-radio-group v-model="rentForm.isopen" @change="data => radioChange('invoice', data)" :disabled="!noInput">
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="0">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="发票类型:">
                                <qqt-input v-model="rentForm.invoiceType" :value="rentForm.invoiceType" :isShowElement="noInput" ></qqt-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="税率:">
                                <qqt-input v-model="rentForm.taxRate" :value="rentForm.taxRate" :isShowElement="noInput" 
                                    :type="numberType" :btnTitle="'%'"></qqt-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="开票金额:">
                                <qqt-input v-model="rentForm.taxAmount" :value="rentForm.taxAmount" :isShowElement="noInput" 
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
                        <el-divider content-position="left">附件</el-divider>
                        <div class="up-load-div">
                            <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                        </div>
                    </el-row>
                    <el-row>
                        <bottomInformation :values="rentForm" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    </el-row>
                </el-form> 
            </div>
            <div class="drawer-btn">
                <el-button type="warning" v-if="!transform.isShowDetails" size="small" @click="save">保存</el-button>
                <el-button v-if="!transform.isShowDetails && $has('material:sell:order:submit')" type="primary" size="small" @click="submit">提交</el-button>
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
import { sellOrderQueryById, sellOrderAdd, sellOrderEdit, rentalOrderSaveSubmit, sellOrderSaveSubmit, } from 
        '../../../../../api/materialEquipmentManagement/sellManagement/sellOrder/index'
import { sellContractQueryById } from '../../../../../api/materialEquipmentManagement/sellManagement/sellContract/index'
import { upload, qqtInput, } from '../../../../../components/qqt-subassembly'
import util from '../../../../../libs/util'
export default {
    components: {
        'up-load' : upload,
        qqtInput,
        'bottomInformation': bottomInformation,
    },
    data () {
        return {
            rentForm: {
                ordername: null,
                refundPeriod: null,
                applytime: new Date().format('yyyy-MM-dd')
            },
            noInput: false,
            rules: {
                'ordername': [ { required: true, message: '请输入出售订单名称', trigger: ['change', 'blur']} ],
                'refundPeriod': [ { required: true, message: '请选择退换期限', trigger: ['change', 'blur']} ]
            },
            transform: {
                isShowDetails: false,
            }, 
            proposerList: [],  // 申请人
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
            // 申请人
            let proposerItem = this.$store.getters['d2admin/allUser/getData'].find(el => el.id === data.proposerId)
            if(proposerItem) { data.proposer = proposerItem.name }

            // 工作部门
            let sectionItem = this.sectionList.find(el => el.id === data.departmentId)
            if(sectionItem) { data.departmentName = sectionItem.name }

            return data
        },
        save () {
            let item = this.$refs.bottomInformation.getData ()
            this.$refs.rentForm.validate((valid) => {
                if(valid) {
                    this.rentForm = this.prepareData(JSON.parse(JSON.stringify(this.rentForm)))
                    Object.assign(this.rentForm, item)
                    let url = this.$route.params.isAdd ? sellOrderAdd : sellOrderEdit
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
                    sellOrderSaveSubmit(this.rentForm).then(res => {
                        this.$message.success("提交成功~~~")
                        this.closeTab()
                    })
                }
            })
        },
        getPurchaseRequest(id) {
            sellOrderQueryById({id: id}).then(res => {
                res.contractMoney = res.contractMoney + ''
                res.carriage = res.carriage + ''
                res.taxRate = res.taxRate === 'undefined' ? '' : res.taxRate + ''
                res.taxAmount = res.taxAmount === 'undefined' ? '' : res.taxAmount + ''
                this.setFile(res.fileList)
                this.rentForm = res
                this.getDepartList(res.createBy)
            })
        },
        getOptions () {
            queryDicById({id: PURCHASEREQUEST.EETURNDATELIST}).then(res => { this.eeturnDateList = res })
        },
        getDepartList (userId) {
            getUserDepartById({	userId: userId}).then(res => { this.sectionList = res})
        }
    },
    mounted() {

    },
    created () {
        this.getOptions()
        this.proposerList = this.$store.getters['d2admin/allUser/getData']
        this.transform = this.$route.params.transform || {}
        if(this.$route.params.isAdd) {
            sellContractQueryById({id : this.$route.params.contractId }).then(res => {
                console.log(res)
                delete res.procInstId
                delete res.state
                delete res.rentalStatus
                delete res.procState
                delete res.rentalStatus 
                delete res.deliveryStatus
                delete res.inventoryStatus
                delete res.id
                delete res.createBy
                delete res.createName
                delete res.createTime
                delete res.departmentId
                delete res.departmentName

                res.rentalContractId = res.id
                res.name = res.goodsname
                res.code = res.goodscode
                res.number = res.number + ''
                res.contractMoney = res.contractMoney + ''
                res.carriage = res.freight + ''
                res.taxRate = res.taxRate === 'undefined' ? '' : res.taxRate + ''
                res.taxAmount = res.taxAmount === 'undefined' ? '' : res.taxAmount + ''

                res.proposerId = util.cookies.get ('uuid')
                this.getDepartList(util.cookies.get('uuid'))
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
}
</style>