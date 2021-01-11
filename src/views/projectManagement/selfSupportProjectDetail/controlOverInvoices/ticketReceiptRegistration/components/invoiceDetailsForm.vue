<template>
    <div class="invoice-details-form">
        <div class="invoice-details-form-title">
            <!-- <p>发票明细</p> -->
            <!-- invoiceTypeOrg -->
            <el-input class="invoiceType" v-model="formData.invoiceTypeOrg" :disabled="transform.isShowDetails"></el-input>
        </div>
        <div class="invoice-details-form-date" style="height:30px">
            <!-- <el-row>
                <el-col :span="16">&nbsp;</el-col>
                <el-col :span="2">
                    <p>开票日期:</p>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="formData.invoiceDate" :disabled="transform.isShowDetails"></el-input>
                </el-col>
            </el-row> -->
        </div>
            <div class="invoice-details-conent">
                <div class="invoice-details-form-body">
                <div class="invoice-details-form-conent">
                    <div class="invoice-details-form-purchaser">购买方</div>
                    <ul>
                        <li>
                            <label> 名称：</label>
                            <span>
                                <el-input  v-if="!showPurchaserSelect" v-model="formData.purchaserName" :disabled="transform.isShowDetails"></el-input>
                                <el-select
                                    style="width:100%;height:100%"
                                    v-else
                                    @change="selectChange($event)"
                                    v-model="selectId"
                                    filterable
                                    allow-create
                                    default-first-option
                                    placeholder="请选择">
                                    <el-option
                                    v-for="item in selectData"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </span>
                        </li>
                        <li>
                            <label>纳税人识别号：</label>
                            <span>
                                <el-input v-model="formData.purchaserRegisterNum" :disabled="transform.isShowDetails"></el-input>
                            </span>
                        </li>
                        <li>
                            <label>地址、电话：</label>
                            <span>
                                <el-input v-model="formData.purchaserAddress" :disabled="transform.isShowDetails"></el-input>
                            </span>
                        </li>
                        <li>
                            <label>开户行及账号：</label>
                            <span>
                                <el-input v-model="formData.purchaserBank" :disabled="transform.isShowDetails"></el-input>
                            </span>
                        </li>
                    </ul>
                    <div class="invoice-details-form-password">密码区</div>
                    <div class="invoice-details-form-pwdInfo">
                         <!-- <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}" v-model="formData.password" :disabled="transform.isShowDetails"></el-input> -->
                         <el-input class="password" maxlength="27" v-model="formData.password" :disabled="transform.isShowDetails"></el-input>
                         <el-input class="password" maxlength="27" v-model="formData.password1" :disabled="transform.isShowDetails"></el-input>
                         <el-input class="password" maxlength="27" v-model="formData.password2" :disabled="transform.isShowDetails"></el-input>
                         <el-input class="password" maxlength="27" v-model="formData.password3" :disabled="transform.isShowDetails"></el-input>
                    </div>
                </div>
                <div class="invoice-details-form-goods-info">
                    <add-invoice-line ref="invoiceLine" :data="formData.invoiceDetailLine" :isShowDetails ="transform.isShowDetails"></add-invoice-line>
                </div>
                <div class="invoice-details-form-body">
                    <div class="invoice-details-form-conent">
                        <div class="invoice-details-form-purchaser">销售方</div>
                            <ul>
                                <li>
                                    <label> 名称：</label>
                                    <span>
                                        <el-input v-if="!showSellerSelect" v-model="formData.sellerName" :disabled="transform.isShowDetails"></el-input>
                                        <el-select
                                            style="width:100%;height:100%"
                                            v-else
                                            @change="selectChange($event)"
                                            v-model="selectId"
                                            filterable
                                            allow-create
                                            default-first-option
                                            placeholder="请选择">
                                            <el-option
                                            v-for="item in selectData"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </span>
                                </li>
                                <li>
                                    <label>纳税人识别号：</label>
                                    <span>
                                        <el-input v-model="formData.sellerRegisterNum" :disabled="transform.isShowDetails"></el-input>
                                    </span>
                                </li>
                                <li>
                                    <label>地址、电话：</label>
                                    <span>
                                        <el-input v-model="formData.sellerAddress" :disabled="transform.isShowDetails"></el-input>
                                    </span>
                                </li>
                                <li>
                                    <label>开户行及账号：</label>
                                    <span>
                                        <el-input v-model="formData.sellerBank" :disabled="transform.isShowDetails"></el-input>
                                    </span>
                                </li>
                            </ul>
                            <div class="invoice-details-form-password">备注</div>
                            <div class="invoice-details-form-pwdInfo">
                                <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10}" v-model="formData.remarks" :disabled="transform.isShowDetails"></el-input>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="invoice-details-form-bottom">
            <el-form :model="invoiceData" ref="form">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="收款人:" prop="payee" label-width="60px">
                            <el-input v-model="formData.payee" :disabled="transform.isShowDetails"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="复核:" prop="checker" label-width="80px">
                            <el-input v-model="formData.checker" :disabled="transform.isShowDetails"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="开票人:" prop="noteDrawer" label-width="100px">
                            <el-input v-model="formData.noteDrawer" :disabled="transform.isShowDetails"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="销货方（章）:" prop="name" label-width="130px">
                            <!-- <el-input v-model="formData.sellerSeal" :disabled="transform.isShowDetails"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            
        </div>
    </div>
</template>

<script>
import addInvoiceLine from '../../components/addInvoiceLine'
export default {
    props:{
        invoiceData: {
            type: Object,
            default: () => {
                return {}
            }
        },
        transform: {
            type: Object,
            default: () => {
                return {}
            }
        },
        selectData: {
            type: Array,
            default: () => {
                return []
            }
        },
    },
    data () {
        return {
            showPurchaserSelect:false,
            showSellerSelect:false,
            showSelectData:[],
            selectId:'',
            formData: {
                invoiceDate: '',
                purchaserName: '',
                purchaserRegisterNum: '',
                purchaserAddress: '',
                purchaserBank: '',
                password: '',
                password1: '',
                password2: '',
                invoiceTypeOrg:'',
                password3: '',
                invoiceDetailLine: [],
                sellerName: '',
                sellerRegisterNum: '',
                sellerAddress: '',
                sellerBank: '',
                remarks: '',
                payee: '',
                checker: '',
                noteDrawer: '',
                sellerSeal: '',
                invoiceSource:''
            }
        }
    },

    methods: {
        selectChange (value) {
            let data = this.showSelectData.find(res=> res.id === value);
            if (this.showPurchaserSelect) {
                if (data) {
                    this.formData.purchaserName = data.name;
                    this.formData.purchaserRegisterNum = data.registerNum;
                    this.formData.purchaserAddress = data.address;
                    this.formData.purchaserBank = data.bank;
                } else {
                    this.formData.purchaserName = value;
                    this.formData.purchaserRegisterNum = '';
                    this.formData.purchaserAddress = '';
                    this.formData.purchaserBank = '';
                } 
            } else {
                if (data) {
                    this.formData.sellerName = data.name;
                    this.formData.sellerRegisterNum = data.registerNum;
                    this.formData.sellerAddress = data.address;
                    this.formData.sellerBank = data.bank;
                } else {
                    this.formData.sellerName = value;
                    this.formData.sellerRegisterNum = '';
                    this.formData.sellerAddress = '';
                    this.formData.sellerBank = '';
                }
            }
            
        },
        getFormData () {
            let data = this.$refs.invoiceLine.getData ()
            if (data) {
                return Object.assign ({}, this.formData, data)
            } else {
                this.$message.error('发票必填项请补充完整')
            }
           
            // return this.$refs.invoiceLine.getData ()
        },

        getInvioceData () {
            let data = {}
            data =  this.formData
            return data
        }

    },

    components: {
        'add-invoice-line': addInvoiceLine
    },

    mounted () {
        // console.log(this.invoiceData)
    },
    watch: {
        selectData:{
            deep:true,
            immediate:true,
            handler (data) {
                if (data.length> 0 ) {
                    if (this.invoiceData.invoiceSource == '1') {
                        this.showPurchaserSelect = true;
                        this.showSellerSelect = false;
                    } else {
                        this.showSellerSelect = true;
                        this.showPurchaserSelect = false;
                    }
                    this.showSelectData = data;
                }
            }
        },
        invoiceData: {
            deep:true,
            immediate:true,
            handler (data) {
                data.invoiceTypeOrg =  data.invoiceTypeOrg ? data.invoiceTypeOrg :'普通发票'
                this.formData = {...this.formData,...data}
            }
        }
    },
}
</script>
<style lang="scss">
    .invoice-details-form {
        margin: 0 auto;
        .el-input__inner {
            border: none;
        }
        .el-textarea__inner {
            border: 0px;
        }
        p {
            color: $color-project-select;
        }
        .invoice-details-form-title {
            font-size: 18px;
            text-align: center;
            position: relative;
            p {
                margin: 0 auto;
                width: 100px;
                border-bottom:3px double $color-project-select;
                cursor:pointer;
            }
        }
        .invoiceType{
            input{
                font-size: 25px;
                text-align: center;
            }
        }
        .invoiceType::after {
            content: '';
            width: 300px;
            border-bottom:3px double $color-project-select;
            cursor:pointer;
            position: absolute;
            left: 50%;
            transform: translate(-150px);
            height: 20px;
            bottom: 0;
        }
        .invoice-details-form-date {
       
        }
        .invoice-details-conent {
            border-left: 1px solid $color-project-select;
            border-right: 1px solid $color-project-select;
            .invoice-details-form-body {
                margin-top: 22px;
            }
            .invoice-details-form-conent {
                height: 171px;
                width: 100%;
                display: flex;
                align-items: center;
                border-top: 1px solid $color-project-select;
                border-bottom: 1px solid $color-project-select;
                .invoice-details-form-purchaser {
                    height: 170px;
                    width: 32px;
                    border-right: 1px solid $color-project-select;
                    padding: 0 10px;
                    display: flex;
                    align-items: center;
                    color: $color-project-select;
                }
                .el-select{
                    .el-input{
                        height: 100%;
                        .el-input__inner{
                            height: 100%;
                        }
                    }
                }
                ul {
                    width: 50%;
                    padding: 0;
                }
                li {
                    display: flex;
                    width: 100%;
                    height: 42.5px;
                    line-height: 32px;
                    border-bottom: 1px solid $color-project-select;
                    label {
                        color: $color-project-select;
                        width: 22%;
                        border-right: 1px solid $color-project-select;
                        padding: 0 12px;
                    }
                    span {
                        width: 65%;
                        height: 100%;
                        .el-input__inner {
                            border: 0px;
                        }
                    }
                }
            .invoice-details-form-password {
                height: 170px;
                    width: 32px;
                    padding: 0 10px;
                    border-right: 1px solid $color-project-select;
                    border-left: 1px solid $color-project-select;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    color: $color-project-select;
            }
            .invoice-details-form-pwdInfo {
                    flex: 1;
                    padding: 12px;
                    height: 170px;
                    overflow: auto;

                }
                .password{
                    input {
                        letter-spacing:  8px;
                        font-size: 15px;
                    }
                }
            }
        }
        .invoice-details-form-bottom {
            margin-top: 6px;
            .el-form-item__label {
                color: $color-project-select;
            }
        }
        
    }

</style>