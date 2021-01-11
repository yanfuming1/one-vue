<template>
    <d2-container class="open-tender">
        <el-card class="box-card cash-return closeHeader">
             <div slot="header"><el-button type="text" @click="closeTab"><i class="el-icon-close"></i></el-button></div>
            <div v-if="fromProcess">
                <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <el-card :body-style="{ padding: '20px' }">
                        <el-form ref="formData" :model="formData" size="medium" :rules="rules" label-width="200px">
                            <el-divider>项目基本信息</el-divider>
                            <div class="project-base-info">
                                <el-row>
                                    <el-col :span="16"><el-form-item label="项目名称:" required><p>{{ formData.projectName }}</p></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="项目编码:" required><p>{{ formData.itemNumber }}</p></el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="标段:" required><p>{{ formData.section }}</p></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="保证金类型:" required><p>{{ formData.marginType }}</p></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="保证金退还编码:" required><p>{{ formData.marginCode }}</p></el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="联营人:"><p>{{ formData.associatedPerson }}</p></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="联系电话:"><p>{{ formData.phone }}</p></el-form-item></el-col>
                                </el-row>
                            </div>
                            <div class="retuern-content">
                                <el-tabs v-model="activeName" type="card">

                                    <!-- 收取单位退还认定 -->
                                    <el-tab-pane :label="label1" name="first">
                                        <div class="label1-content" @click="getBankInfo">
                                            <el-row>
                                                <el-col :span="8"><el-form-item label="退还单位户名:">
                                                    <el-input size="medium" disabled v-model="bankData.retreatUnitAccount"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="开户行:">
                                                    <el-input size="medium" disabled v-model="bankData.openingBank"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="账号:">
                                                    <el-input size="medium" disabled v-model="bankData.accountNumber"></el-input>
                                                </el-form-item></el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="8"><el-form-item label="退还金额:">
                                                    <qqt-input :size="size" :isShowElement="isShowElement" v-model="bankData.gatheringamount" :isMoneyType="isMoney" :value="bankData.gatheringamount" :btnTitle="'元'"></qqt-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="退还时间:">
                                                    <el-input size="medium" disabled v-model="bankData.createTime"></el-input>
                                                </el-form-item></el-col>
                                            </el-row>
                                            <bottom-information :values="firmlyBelieve" :fieldTitle="fieldTitleF" :timeTitle="timeTitleF" :transform="transform" :isShowAccessory="false"  ref="firmlyBelieve" />
                                        </div>
                                    </el-tab-pane>

                                    <!-- 公司垫付资金 -->
                                    <el-tab-pane :label="label2" name="second">
                                        <div class="label2-content">
                                            <el-row>
                                                <el-col :span="8"><el-form-item label="垫付金额:">
                                                    <el-input size="medium" disabled v-model="formData.matEndowment"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="大写:">
                                                    <el-input size="medium" disabled v-model="formData.amountInWords"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="是否计息:">
                                                    <el-radio disabled v-model="formData.isRate" label="1">是</el-radio>
                                                    <el-radio disabled v-model="formData.isRate" label="0">否</el-radio>
                                                </el-form-item></el-col>
                                            </el-row>
                                            <el-row v-if="showAccrual">
                                                <el-col :span="8"><el-form-item label="计息方式:">
                                                    <el-input size="medium" disabled v-model="formData.interestAccrualMannerName"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="利率:">
                                                    <el-input size="medium" disabled v-model="formData.interestRate"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="起息日期:">
                                                    <el-input size="medium" disabled v-model="formData.dateValue"></el-input>
                                                </el-form-item></el-col>
                                            </el-row>
                                            <el-row v-if="showAccrual">
                                                <el-col :span="8"><el-form-item label="结息日期:">
                                                    <el-date-picker v-model="formData.interestSettlementDate" v-if="!isShowDetails" @change="dateChange" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                                                    <el-input size="medium" v-if="isShowDetails" disabled v-model="formData.interestSettlementDate"></el-input>
                                                </el-form-item></el-col>
                                                <el-col :span="8"><el-form-item label="共计利息:">
                                                    <el-input v-model="formData.interest" v-if="!isShowDetails"><template slot="append">元</template></el-input>
                                                    <el-input size="medium" v-if="isShowDetails" disabled v-model="formData.interest"></el-input>
                                                </el-form-item></el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="6">
                                                    <el-form-item label="经办人:">
                                                        <el-input size="medium" disabled v-model="advancePayment.createName"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="工作单位:">
                                                        <el-input size="medium" disabled v-model="advancePayment.companyName"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="工作部门:">
                                                        <el-input size="medium" disabled v-model="advancePayment.departmentName"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-form-item label="登记时间:">
                                                        <el-input size="medium" disabled v-model="advancePayment.createTime"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </div>
                                    </el-tab-pane>

                                    <!-- 扣除金额 -->
                                    <el-tab-pane :label="label3" name="third">
                                        <should-pay :dataInfo="dataInfo" :costType="costType" :isShowDetails="isShowDetails" @change="label3Data" ref="shouldPay"></should-pay>
                                    </el-tab-pane>

                                    <!-- 退还联营人金额 -->
                                    <el-tab-pane :label="label4" name="fourth">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-form-item label="退还到联营人资金池总金额:" :rules="newRules.surrenderPool" prop="surrenderPool">
                                                    <qqt-input :btnTitle="'元'" :value='formData.surrenderPool' :isShowElement="!isShowDetails" :isMoneyType="isMoneyType" @input="changeMoney"></qqt-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8"><el-form-item label="退还联营人账户金额:" :rules="newRules.surrenderValue" prop="surrenderValue">
                                                <qqt-input :btnTitle="'元'" :value='formData.surrenderValue' :isShowElement="surValueShow" :isMoneyType="isMoneyType" @input="changeMoney1"></qqt-input>
                                            </el-form-item></el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8"><el-form-item label="联营人收款户名:" :rules="newRules.retreatUnitAccount" prop="retreatUnitAccount">
                                                <el-select v-model="formData.retreatUnitAccount" allow-create clearable filterable default-first-option v-if="!isShowDetails" @change="selectAccount">
                                                    <el-option v-for="(item,index) in collectUnitAccount" :key="index" :label="item.name" :value="item.name">
                                                        <span style="margin-right: 10px;">{{ item.name }}</span>
                                                        <span style="float:right; color: #8492a6; font-size: 13px; line-height:35px;">{{ item.account }}</span>
                                                    </el-option>
                                                </el-select>
                                                <el-input v-if="isShowDetails" v-model="formData.retreatUnitAccount" disabled></el-input>
                                            </el-form-item></el-col>
                                            <el-col :span="8"><el-form-item label="开户行:" :rules="newRules.openingBank" prop="openingBank">
                                                <el-input v-model="formData.openingBank" v-if="!isShowDetails"></el-input>
                                                <el-input v-if="isShowDetails" v-model="formData.openingBank" disabled></el-input>
                                            </el-form-item></el-col>
                                            <el-col :span="8"><el-form-item label="账号:" :rules="newRules.accountNumber" prop="accountNumber">
                                                 <el-input v-model="formData.accountNumber" :disabled="isShowDetails">
                                                    <el-button type="primary" slot="append" @click="accountFun" v-if="!isShowDetails">
                                                        收藏
                                                    </el-button>
                                                </el-input>
                                            </el-form-item></el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8"><el-form-item label="退还时间:" :rules="newRules.returnTheTime" prop="returnTheTime">
                                                <el-date-picker v-model="formData.returnTheTime" value-format="yyyy-MM-dd" v-if="!isShowDetails" type="date"></el-date-picker>
                                                <el-input v-if="isShowDetails" v-model="formData.returnTheTime" disabled></el-input>
                                            </el-form-item></el-col>
                                            <el-col :span="16"><el-form-item label="附言:">
                                                <el-input v-model="formData.postscript" v-if="!isShowDetails" type="textarea"></el-input>
                                                <el-input v-if="isShowDetails" v-model="formData.postscript" type="textarea" disabled></el-input>
                                            </el-form-item></el-col>
                                        </el-row>
                                        <bottom-information :values="surrender" :fieldTitle="surrenderS" :timeTitle="timeTitleS" :transform="transform" :isShowAccessory="false"  ref="surrender" />
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                            <accountant :isShowDetails="accIsShowDetails" v-if='showCompany' :dataInfo="accDataInfo" ref="accountant"></accountant>
                            <div class="up-load-div">
                                <el-divider content-position="left">附件</el-divider>
                                <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                            </div>
                            <div>
                                <el-divider>备注</el-divider>
                                <el-row class="remark">
                                    <el-col :span="24">
                                        <el-input v-model="formData.remark" v-if="!isShowDetails" :rows="4" type="textarea"></el-input>
                                        <p v-if="isShowDetails">{{ formData.remark }}</p>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-form>

                        <el-row>
                            <el-col :span="24" style="text-align:center" class="d2-mt-20">
                                <qqt-look-voucher :data="cloneData" ref="voucher"></qqt-look-voucher>
                                <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                                <el-button size="small" type="primary" v-if="isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                                <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                                <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                                <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                                <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                                <el-button size="small" type="primary" v-if="backlog" plain @click="closeTab">取消</el-button>
                                <el-button size="small" type="primary" v-if="!backlog" @click="closeTab">关闭</el-button>
                            </el-col>
                        </el-row>
                    </el-card>
                </template>
                </qqt-flow-tabs>
                <el-dialog
                    v-dialogDrag
                    title="驳回"
                    :visible.sync="rejectShow"
                    width="30%">
                    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="驳回节点：" prop="rejectVal">
                        <el-select v-model="form.rejectVal"  placeholder="" >
                        <el-option v-for="item in returnList"
                            :key="item.activityId"
                            :label="item.name"
                            :value="item.activityId">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="驳回理由：" prop="paymessage">
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入驳回理由"
                            v-model="form.paymessage">
                        </el-input>
                    </el-form-item>
                    </el-form>
                    <span slot="footer">
                        <el-button type="primary" @click="rejectOk">确 定</el-button>
                        <el-button @click="rejectCancel">取 消</el-button>
                    </span>
                </el-dialog>
            </div>
            <div v-if="!fromProcess">
            <el-form ref="formData" :model="formData" :rules="rules" size="medium" label-width="200px">
                <el-divider>项目基本信息</el-divider>
                <div class="project-base-info">
                    <el-row>
                        <el-col :span="16"><el-form-item label="项目名称:" required><p>{{ formData.projectName }}</p></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="项目编码:" required><p>{{ formData.itemNumber }}</p></el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><el-form-item label="标段:" required><p>{{ formData.section }}</p></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="保证金类型:" required><p>{{ formData.marginType }}</p></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="保证金退还编码:" required><p>{{ formData.marginCode }}</p></el-form-item></el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><el-form-item label="联营人:"><p>{{ formData.associatedPerson }}</p></el-form-item></el-col>
                        <el-col :span="8"><el-form-item label="联系电话:"><p>{{ formData.phone }}</p></el-form-item></el-col>
                    </el-row>
                </div>
                <div class="retuern-content">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

                        <!-- 收取单位退还认定 -->
                        <el-tab-pane :label="label1" name="first">
                            <div class="label1-content" @click="getBankInfo">
                                <el-row>
                                    <el-col :span="8"><el-form-item label="退还单位户名:">
                                        <el-input size="medium" disabled v-model="bankData.retreatUnitAccount"></el-input>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="开户行:">
                                        <el-input size="medium" disabled v-model="bankData.openingBank"></el-input>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="账号:">
                                        <el-input size="medium" disabled v-model="bankData.accountNumber"></el-input>
                                    </el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8"><el-form-item label="退还金额:">
                                        <qqt-input :size="size" :isShowElement="isShowElement" v-model="bankData.gatheringamount" :isMoneyType="isMoney" :value="bankData.gatheringamount" :btnTitle="'元'"></qqt-input>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="退还时间:">
                                        <el-input size="medium" disabled v-model="bankData.createTime"></el-input>
                                    </el-form-item></el-col>
                                </el-row>
                                <bottom-information :values="firmlyBelieve" :fieldTitle="fieldTitleF" :timeTitle="timeTitleF" :transform="transform" :isShowAccessory="false"  ref="firmlyBelieve" />
                            </div>
                        </el-tab-pane>

                        <!-- 公司垫付资金 -->
                        <el-tab-pane :label="label2" name="second">
                            <div class="label2-content">
                                <el-row>
                                    <el-col :span="8"><el-form-item label="垫付金额:"><p>{{ formData.matEndowment }}</p></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="大写:"><p>{{ formData.amountInWords }}</p></el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="是否计息:">
                                        <el-radio disabled v-model="formData.isRate" label="1">是</el-radio>
                                        <el-radio disabled v-model="formData.isRate" label="0">否</el-radio>
                                    </el-form-item></el-col>
                                </el-row>
                                <el-row v-if="showAccrual">
                                    <el-col :span="8"><el-form-item label="计息方式:">
                                        <el-select v-if="!isShowDetails" v-model="formData.interestAccrualManner" @change="onChange" placeholder="请选择">
                                            <el-option v-for="item in accrualMannerOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                        <el-input v-if="isShowDetails" v-model="formData.interestAccrualMannerName" disabled></el-input>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="利率:">
                                        <el-input v-if="!isShowDetails" v-model="formData.interestRate" @input="onChange"><template slot="append">%</template></el-input>
                                        <el-input v-if="isShowDetails" v-model="formData.interestRate" disabled><template slot="append">%</template></el-input>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="起息日期:"><p>{{ formData.dateValue }}</p></el-form-item></el-col>
                                </el-row>
                                <el-row v-if="showAccrual">
                                    <el-col :span="8"><el-form-item label="结息日期:">
                                        <el-date-picker v-model="formData.interestSettlementDate" v-if="!isShowDetails" @change="dateChange" value-format="yyyy-MM-dd" type="date"></el-date-picker>
                                        <el-input v-if="isShowDetails" v-model="formData.interestSettlementDate" disabled></el-input>
                                    </el-form-item></el-col>
                                    <el-col :span="8"><el-form-item label="共计利息:">
                                        <el-input v-model="formData.interest" v-if="!isShowDetails"><template slot="append">元</template></el-input>
                                        <el-input v-if="isShowDetails" v-model="formData.interest" disabled><template slot="append">元</template></el-input>
                                    </el-form-item></el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6">
                                        <el-form-item label="经办人:">
                                            <el-input size="medium" disabled v-model="advancePayment.createName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="工作单位:">
                                            <el-input size="medium" disabled v-model="advancePayment.companyName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="工作部门:">
                                            <el-input size="medium" disabled v-model="advancePayment.departmentName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="登记时间:">
                                            <el-input size="medium" disabled v-model="advancePayment.createTime"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-tab-pane>

                        <!-- 扣除金额 -->
                        <el-tab-pane :label="label3" name="third">
                            <should-pay :dataInfo="dataInfo" :costType="costType" :isShowDetails="isShowDetails" @change="label3Data" ref="shouldPay"></should-pay>
                        </el-tab-pane>

                        
                        <el-tab-pane :label="label4" name="fourth">
                            <el-row>
                                <el-col :span="8">
                                    <el-form-item label="退还到联营人资金池总金额:" :rules="newRules.surrenderPool" prop="surrenderPool">
                                        <qqt-input :btnTitle="'元'" v-model="formData.surrenderPool" :value='formData.surrenderPool' :isShowElement="!isShowDetails" :isMoneyType="isMoneyType" @input="changeMoney"></qqt-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="退还联营人账户金额:" :rules="newRules.surrenderValue" prop="surrenderValue">
                                        <qqt-input :btnTitle="'元'" :value='formData.surrenderValue' :isShowElement="surValueShow" :isMoneyType="isMoneyType" @input="changeMoney1"></qqt-input>
                                    </el-form-item>
                                </el-col> 
                            </el-row>
                            <el-row>
                                <el-col :span="8"><el-form-item label="联营人收款户名:" :rules="newRules.retreatUnitAccount" prop="retreatUnitAccount">
                                    <el-select v-model="formData.retreatUnitAccount" allow-create clearable filterable default-first-option v-if="!isShowDetails" @change="selectAccount">
                                        <el-option v-for="(item,index) in collectUnitAccount" :key="index" :label="item.name" :value="item.name">
                                            <span style="margin-right: 10px;">{{ item.name }}</span>
                                            <span style="float:right; color: #8492a6; font-size: 13px; line-height:35px;">{{ item.account }}</span>
                                        </el-option>
                                    </el-select>
                                    <el-input v-if="isShowDetails" v-model="formData.retreatUnitAccount" disabled></el-input>
                                </el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="开户行:" :rules="newRules.openingBank" prop="openingBank">
                                    <el-input v-model="formData.openingBank" v-if="!isShowDetails"></el-input>
                                    <el-input v-if="isShowDetails" v-model="formData.openingBank" disabled></el-input>
                                </el-form-item></el-col>
                                <el-col :span="8"><el-form-item label="账号:" :rules="newRules.accountNumber" prop="accountNumber">
                                    <el-input v-model="formData.accountNumber" :disabled="isShowDetails">
                                        <el-button type="primary" slot="append" @click="accountFun" v-if="!isShowDetails">
                                            收藏
                                        </el-button>
                                    </el-input>
                                </el-form-item></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="8"><el-form-item label="时间:" :rules="newRules.returnTheTime" prop="returnTheTime">
                                    <el-date-picker v-model="formData.returnTheTime" value-format="yyyy-MM-dd" v-if="!isShowDetails" type="date"></el-date-picker>
                                    <el-input v-if="isShowDetails" v-model="formData.returnTheTime" disabled></el-input>
                                </el-form-item></el-col>
                                <el-col :span="16"><el-form-item label="附言:">
                                    <el-input v-model="formData.postscript" v-if="!isShowDetails" type="textarea"></el-input>
                                    <el-input v-if="isShowDetails" v-model="formData.postscript" type="textarea" disabled></el-input>
                                </el-form-item></el-col>
                            </el-row>
                            <bottom-information :values="surrender" :fieldTitle="surrenderS" :timeTitle="timeTitleS" :transform="transform" :isShowAccessory="false"  ref="surrender" />
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="up-load-div">
                    <el-divider content-position="left">附件</el-divider>
                    <up-load :isShowUpload="!transform.isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                </div>
                <div>
                    <el-divider>备注</el-divider>
                    <el-row class="remark">
                        <el-col :span="24">
                            <el-input v-model="formData.remark" v-if="!isShowDetails" :rows="4" type="textarea"></el-input>
                            <p v-if="isShowDetails">{{ formData.remark }}</p>
                        </el-col>
                    </el-row>
                </div>
                <div class="btn-group">
                    <el-button type="warning" v-if="!isShowDetails" @click="subForm" size="small">保存</el-button>
                    <el-button type="primary" v-if="!isShowDetails && $has('joint:marginReturn:submit')" size="small" @click="subFlow">提交</el-button>
                    <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button size="small" v-if="!isShowDetails" @click="closeTab">取消</el-button>
                    <el-button type="primary" v-if="isShowDetails" size="small" @click="closeTab">关闭</el-button>
                </div>
            </el-form>
            </div>

        </el-card>
        <print-template-by-html v-show="false" :code="code" ref="printTemp" />
        <fund-determination :dialogVisible='dialogVisible' @closeDialog='closeDialog' @getData='getDialogData'></fund-determination>
        <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
        <qqt-send-process v-if="processVisible" :isSendBack='isSendBack' :dialogVisible="processVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
        <qqt-consent :msg="msg" :dialogVisible="visible" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>
<script>
import util from '../../../../../libs/util'
import fundDetermination from './fundDetermination'
import { qqtSendProcess, qqtInput, qqtFlowDiagram,qqtFlowTabs,qqtConsent,qqtLookVoucher,upload } from '@/components/qqt-subassembly'
import { getDetails,findReverseRoute,careOf} from '../../../../../api/approval/common'
import { getByAccountByAssociatedId } from '../../../../../api/financialManagement/staffLoan/index'
import { addRefundData, editRefundData,sumbitRefundData,getRefundById,getByAccountTypeListAll,
         marginReturnOperation, cashReturnBankAccount, getProjectAllOptions} from '../../../../../api/jointProject/index'
import userModules from '../../../../systemManagement/processDefinition/processModules/userModules'
import accountant from '../../../../approval/components/pushPage/projectCashRequest/components/accountant'
import shouldPay from './shouldPay'
import { mapActions } from 'vuex'
import bottomInformation from '../../../../projectManagement/selfSupportProjectDetail/businessBidding/components/bottomInformation'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
export default {
    name: 'cashReturn',
    components: {
        qqtSendProcess,
        shouldPay,
        fundDetermination,
        qqtFlowDiagram,
        qqtFlowTabs,
        accountant,
        userModules,
        qqtConsent,
        qqtInput,
        qqtLookVoucher,
        'up-load': upload,
        'bottom-information': bottomInformation,
        'print-template-by-html': printTemplateByHtml
    },
    data () {
        return {
            size: 'medium',
            isMoney: true,
            isShowElement: false,
            costType: [],
            cloneData:{},
            returnInfo: {},
            transform: {
                isShowDetails: false
            },
            formData: {
                id: '',
                projectName: '',
                section: '',
                itemNumber: '',
                phone: '',
                interestSettlementDate: '',
                interest: '',
                direction: '0',
                retreatUnitAccount: '',
                openingBank: '',
                accountNumber: '',
                surrenderValue: '',
                returnTheTime: '',
                postscript: '',
                remark: '',
                accountFundId: '',
            },
            fieldTitleF: '认定',
            timeTitleF: '认定',
            deductD: '登记',
            timeTitleD: "登记",
            surrenderS: '经办',
            timeTitleS: '经办',
            marginReturn: {},
            firmlyBelieve: {},
            surrender: {},
            advancePayment: {
                companyName: '',
                departmentName: '',
                createName: '',
                createTime: ''
            },
            bankData: {
                retreatUnitAccount: '',
                openingBank: '',
                accountNumber: '',
                gatheringamount: '',
                createTime: ''
            },
            activeName: 'first',
            label1: '收取单位退还认定',
            label2: '公司垫付资金: 0元',
            label3: '扣除金额: 0元',
            label4: '退还联营人金额: 0元',
            proId: '',
            dataInfo: [],
            isShowDetails: false,
            collectUnitAccount: [],
            dialogVisible: false,
            showCompany: true,
            rules: {
                retreatUnitAccount: [{ required: true, message: '请选择单位户名', trigger: 'blur' }],
                openingBank: [{ required: true, message: '请填写开户行', trigger: 'blur' }],
                accountNumber: [{ required: true, message: '请填写账号', trigger: 'blur' }],
                surrenderValue: [{ required: true, message: '请填写金额', trigger: 'blur' }],
                returnTheTime: [{ required: true, message: '请选择退还时间', trigger: 'blur' }],
            },
            newRules: {
                retreatUnitAccount : [{ required: true, message: '请输入退还单位户名', trigger: ['blur','change'] }],
                openingBank  : [{ required: true, message: '请输入开户行', trigger: ['blur','change'] }],
                accountNumber  : [{ required: true, message: '请输入账号', trigger: ['blur','change'] }],
                surrenderPool : [{ required: true, message: '请输入退还到联营人资金池总金额', trigger: ['blur','change'] }],
                surrenderValue : [{ required: true, message: '请输入退还联营人账户金额', trigger: 'blur' }],
                returnTheTime  : [{ required: true, message: '请输入退还时间', trigger: ['blur','change'] }],
            },
            label3Money: 0,
            subValue: {},
            accIsShowDetails: true,
            processVisible: false,
            prossValue: {},
            processModuleId: "",
            fromProcess: false,
            accDataInfo: [],
            backlog: false,
            isSendBack: false,
            dialogVisible: false,
            prossValue: {},
            processModuleId: '',
            subValue: {},
            taskId: '',
            procInstId: '',
            pdfId: '',
            tabShow: false,
            isShow: false,
            user: [],
            department: [],
            returnList: [],
            btnList: '',
            processValue: {
                title: '',
                pdfId: '',
                degree: '',
            },
            rules: {
                rejectVal: [{ required: true, message: '请选择驳回节点', trigger: ['change','blur'] }],
                paymessage: [{ required: true, message: '请选择驳回理由', trigger:  ['change','blur'] }],
                },
            form: {
                rejectVal: '',
                paymessage: ''
            },
            rejectShow: false,
            isProcessInstance: '',
            backUnit: true,
            accrualMannerOption: [
                {value: '1197335230566318080',label: '日息'},
                {value: '1197334487260151808',label: '月息'},
                {value: '1197317410252005376',label: '年息'}
            ],
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            isMoneyType: true,
            surrenderValueTem: 0,
            valueEqual: false,
            showAccrual: true,
            surValueShow: false,
            msg: '',
            fileList: [],
            upLoadFileDefaultList: [],
            code: BASICSCODE.JOINT_MARGIN_RETURN
        }
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        // 收藏
        accountFun () {
            let bankAccount = {
                associatedId: this.formData.associatedPersonId,
                name: this.formData.retreatUnitAccount,
                account: this.formData.accountNumber,
                openingBank: this.formData.openingBank,
            }
            cashReturnBankAccount(bankAccount).then(res => {
                this.$message.success(res.message)
            })
        },
        handleClick() {},
        onChange(value) {
            this.$forceUpdate()
        },
        dateChange (date) {
            if(new Date(date).getTime() < new Date(this.formData.dateValue).getTime()) {
                this.$message.warning("结息日期不能小于起息日期!!!")
                this.formData.interestSettlementDate = ""
            } else {
                if(this.formData.isRate === '1'){
                    let differ = util.timeDifc(this.formData.dateValue, date)
                    let ben = this.formData.matEndowment
                    let rate = this.formData.interestRate
                    let nowMonthDay = util.mGetDate(date)
                    let interestTem = 0
                    switch(this.formData.interestAccrualManner){
                        case '1197335230566318080':
                            // 利息=本金*日利率*天数
                            interestTem = parseFloat(ben)*parseFloat(rate)*(differ.d + differ.m * 30 + differ.y * 365) / 100
                            break
                        case '1197334487260151808':
                            // 利息=本金*月利率*月数+本金*（月利率/当月天数）*天数
                            // interestTem = (parseFloat(ben)*parseFloat(rate)*(differ.y*12+differ.m) + parseFloat(ben)*(parseFloat(rate)/nowMonthDay)*differ.d) / 100
                            interestTem = (parseFloat(ben)*parseFloat(rate)*(differ.y*12+differ.m) + parseFloat(ben)*(parseFloat(rate)/30)*differ.d) / 100
                            break
                        case '1197317410252005376':
                            // 利息=本金*年利率*年数+本金*（年利率/12/当月天数）*天数
                            // interestTem = (parseFloat(ben) * (parseFloat(rate)*differ.y + (parseFloat(rate)/12/30)*differ.d)) / 100
                            interestTem = (parseFloat(ben)*(parseFloat(rate)*differ.y+(parseFloat(rate)/12)*differ.m + (parseFloat(rate)/12/30)*differ.d)) / 100
                            break
                        default:
                            break
                    }
                    this.formData.interest = parseFloat(interestTem).toFixed(2)
                }
            }
        },
        backDirection (dir) {
            this.backUnit = dir === '1' ? false : true
        },
        changeMoney(value){
            this.formData.surrenderPool = value
            this.formData.surrenderValue = 
                parseFloat(this.surrenderValueTem === '' ? '0' : this.surrenderValueTem) - 
                parseFloat(this.formData.surrenderPool === "" ? '0' : this.formData.surrenderPool) + ''
        },
        changeMoney1(value){
            let m = parseFloat(value === '' ? '0' : value)
            let n = parseFloat(this.formData.surrenderPool === '' ? '0' : this.formData.surrenderPool)

            if( (m+n) !== parseFloat(this.surrenderValueTem)){
                this.formData.surrenderValue = '0'
                this.$message.warning("退还到联营人资金池总金额加退还联营人账户金额要等于退还的金额!!!", {time: 3000})
            } else {
                this.formData.surrenderValue = value
            }
        },
        label3Data (data) {
            this.label3Money = 0
            if(data){
                data.forEach(item => {
                    this.label3Money += Number(item.money)
                })
                this.label3 = '扣除金额: ' + util.moneyTransform(this.label3Money) +'元'
            }
            this.calculateMoney()
        },
        calculateMoney () {
            this.surrenderValueTem = Number(this.bankData.gatheringamount) - Number(this.label3Money) - Number(this.formData.matEndowment)
            this.label4= '退还联营人金额: '+ util.moneyTransform(this.surrenderValueTem) + '元'
            this.formData.surrenderPool = this.formData.surrenderPool === '' || this.formData.surrenderPool === undefined ? '0' : this.formData.surrenderPool
            this.formData.surrenderValue = Number(this.surrenderValueTem) - Number(this.formData.surrenderPool) + ''
        },
        setData() {
            this.formData = {
                interestSettlementDate: '',
                interest: '',
                direction: '0',
                retreatUnitAccount: '',
                openingBank: '',
                accountNumber: '',
                surrenderValue: '',
                returnTheTime: '',
                postscript: '',
                remark: '',
                accountFundId: '',
                
            },
            this.advancePayment = {
                companyName: '',
                departmentName: '',
                createName: '',
                createTime: ''
            }
            this.advancePayment.companyName = this.$route.params.cashInfo.companyName
            this.advancePayment.departmentName = this.$route.params.cashInfo.departmentName
            this.advancePayment.createName = this.$route.params.cashInfo.createName
            this.advancePayment.createTime = this.$route.params.cashInfo.createTime

            this.showAccrual = this.$route.params.cashInfo.isRate === '0' ? false : true
            this.formData.projectName = this.$route.params.cashInfo.projectName
            this.formData.id = this.$route.params.cashInfo.id
            this.formData.itemNumber = this.$route.params.cashInfo.itemNumber
            this.formData.section = util.jointData(this.$route.params.cashInfo.section, ',')
            this.formData.marginId = this.$route.params.cashInfo.marginId
            this.formData.marginType = this.$route.params.cashInfo.marginType
            this.formData.marginCode = this.$route.params.cashInfo.marginCode
            this.formData.associatedPerson = this.$route.params.cashInfo.associatedPerson
            this.formData.associatedPersonId = this.$route.params.cashInfo.associatedPersonId
            this.formData.phone = this.$route.params.cashInfo.phone

            this.formData.matEndowment = this.$route.params.cashInfo.matEndowment
            this.label2 = '公司垫付资金: ' + util.moneyTransform(this.$route.params.cashInfo.matEndowment) + '元'
            this.formData.amountInWords = util.convertCurrency(this.$route.params.cashInfo.matEndowment)
            this.formData.isRate = this.$route.params.cashInfo.isRate
            this.formData.interestAccrualManner = this.$route.params.cashInfo.interestAccrualManner
            switch(this.$route.params.cashInfo.interestAccrualManner){
                case '1197335230566318080':
                    this.formData.interestAccrualMannerName = '日息'
                    break
                case '1197334487260151808':
                    this.formData.interestAccrualMannerName = '月息'
                    break
                case '1197317410252005376':
                    this.formData.interestAccrualMannerName = '年息'
                    break
            }
            this.formData.interestRate = this.$route.params.cashInfo.interestRate
            this.formData.dateValue = this.$route.params.cashInfo.dateValue
            if(this.formData.isPay === '1'){
                this.formData.interest = Number(this.formData.matEndowment) * Number(this.formData.interestRate) / 100
            }
            this.dataInfo = []
            this.isShowDetails = false
            this.label3Data(this.$route.params.cashInfo.withholdList)
        },
        selectAccount(data) {
            this.collectUnitAccount.forEach(item => {
                if(item.name === data){
                    this.formData.openingBank = item.openingBank
                    this.formData.accountNumber = item.account
                }
            })
        },
        getBankInfo(){
            if(this.isShowDetails){
                this.$message.info("详情时不能更改!!!")
            }else{
                this.dialogVisible = true
            }
        },
        closeDialog(){
            this.dialogVisible = false
        },
        getDialogData(data){
            if(data !== null){
                this.closeDialog()
                this.bankData.retreatUnitAccount = data.payaccount
                this.bankData.openingBank = data.paybank
                this.bankData.accountNumber = data.paynum
                this.bankData.gatheringamount = data.gatheringamount
                this.bankData.createTime = data.createTime

                this.formData.accountFundId = data.id
                this.calculateMoney()
            }
        },
        upLoadFileCallBack (data) {
            this.fileList = data
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
        subForm(){
            if(Number(this.surrenderValueTem) < 0){
                this.$message.warning('退还金额不能为负!!!')
            }else {
                let firmlyBelieve = this.$refs.firmlyBelieve.getData()
                let surrender = this.$refs.surrender.getData()
                this.$refs['formData'].validate((valid) => {
                    if(valid && firmlyBelieve && surrender) {
                        this.marginReturn =  this.formData
                        this.marginReturn.fileList = this.fileList
                        this.marginReturn['withholdList'] = this.$refs.shouldPay.getData()
                        let url = this.$route.params.isAdd == ' ' ? editRefundData : addRefundData
                        this.$route.params.isAdd == ' ' ? delete this.proId : this.marginReturn.projectId = this.proId
                        url ({ 
                            'marginReturn': this.marginReturn, 
                            'advancePayment': this.advancePayment, 
                            'firmlyBelieve': firmlyBelieve, 
                            'surrender': surrender,
                        }).then( res => {
                            this.$message.success(res.message)
                            this.closeTab()
                        })
                    } else {
                        this.$message.warning("退还信息未补充完整,请确认!!!")
                    }
                })
            }
        },
        subFlow () {
            if(Number(this.surrenderValueTem) < 0){
                this.$message.warning('退还金额不能为负!!!')
            }else {
                let firmlyBelieve = this.$refs.firmlyBelieve.getData()
                let surrender = this.$refs.surrender.getData()
                this.$refs.formData.validate((valid) =>{
                    if (valid && firmlyBelieve && surrender) {
                        this.formData.projectId = this.proId
                        this.formData.withholdList = this.$refs.shouldPay.getData()
                        this.subValue = this.formData
                        this.subValue.fileList = this.fileList
                        this.firmlyBelieve = firmlyBelieve
                        this.surrender = surrender
                        this.processModuleId = 'cashReturn'
                        this.prossValue.title = '保证退还申请, 金额:[' + util.moneyTransform(this.surrenderValueTem) + '元]'
                        this.processVisible = true
                    } else {
                        this.$message.warning('退还信息未补充完整,请确认!!!')
                    }
                })
            }
        },
        selectDataFun(data){
            this.subValue.completeTask = data
            if (this.isSendBack) {
                if(this.subValue.direction === '0'){
                    this.subValue.companyPayList = this.$refs.accountant.getData()
                }
                this.subValue.completeTask.taskId = this.taskId
                this.subValue.flag = '1'
                this.subValue.procInstId = this.procInstId
                marginReturnOperation(this.subValue).then(res => {
                    if (res.success) {
                        this.$message.success('重新提交成功~~~')
                        this.closeTab()
                    }
                })
            } else {
                sumbitRefundData({
                    'marginReturn': this.subValue, 
                    'firmlyBelieve': this.firmlyBelieve, 
                    'advancePayment': this.advancePayment, 
                    'surrender': this.surrender
                }).then(res => {
                        this.processVisible = false
                        this.$message.success(res.message)
                        this.closeTab()
                })
            }
        },
        closeFun(){
            this.processVisible = false
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        printTemplate () {
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': this.formData.id }).then(res => {
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                let res = this.formData
                // res.marginReturn = this.formData
                // res.advancePayment = this.advancePayment
                // res.firmlyBelieve = this.firmlyBelieve
                // res.deduct = this.deduct
                // res.surrender = this.surrender
                if(res.direction === '0'){
                    res.companyPayList = this.$refs.accountant.getData()
                }
                res['completeTask'] = item
                res.flag= '1'
                res.procInstId = this.procInstId
                marginReturnOperation(res).then(res => {
                    if (item.type == '1') {
                        this.$refs.voucher.CNEdit();
                    }
                    if (res.code === 200) {
                        this.$message.success ("同意成功")
                        this.closeTab()
                    }
                })
            }
        },
        consentFun () {
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        anewSubmitBtn () {
            let firmlyBelieve = this.$refs.firmlyBelieve.getData()
            let surrender = this.$refs.surrender.getData()
            this.$refs.formData.validate((valid) =>{
                if(valid && firmlyBelieve && surrender) {
                    this.formData.projectId = this.proId
                    this.subValue = this.formData
                    this.subValue.fileList = this.fileList
                    this.subValue.withholdList = this.$refs.shouldPay.getData()
                    this.subValue.firmlyBelieve = firmlyBelieve
                    this.subValue.surrender = surrender

                    this.processModuleId = 'cashReturn'
                    this.prossValue.title = '保证退还申请, 金额:[' + util.moneyTransform(this.surrenderValueTem) + '元]'
                    this.prossValue.pdfId = this.pushData.procDefId
                    this.prossValue.degree = this.pushData.processVariables.degree
                    this.processVisible = true
                }
            })
        },
        turnToFun () {
            this.isShow = true
        },
        clearUserPage (item) {
            if (item.length > 0) {
                this.isShow = !this.isShow
                let data = [];
                for (let i = 0; i < item.length; i++) {
                    let str = item[i].id
                    data.push(str)
                }
                const h = this.$createElement
                this.$prompt('请输入转办理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    cancelButtonClass: "btn-custom-cancel",
                    inputPattern: /^\S/,
                    inputErrorMessage: '请输入转办理由'
                }).then(({ value }) => {
                    let jsonData = {
                        message:value,
                        candidateIds: data
                    }
                    careOf(this.taskId,jsonData).then(res=>{
                        if (res.success) {
                            this.$message.success('转办成功')
                            this.closeTab()
                        }
                    })
                }).catch(() => {
                    this.$message.info('取消输入');
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        returnBtn () {
            this.rejectShow = true
        },
        rejectCancel () {
            this.rejectShow = false
        },
        rejectOk () {
            this.$refs.formData.validate((valid) => {
                if (valid) {
                    let tem = this.formData
                    tem.flag = '2'
                    tem.completeTask = {
                        "taskId":this.taskId,
                        activityId: this.form.rejectVal,
                        msg: this.form.paymessage
                    }
                    if(this.$refs.accountant){
                        tem.companyPayList = this.$refs.accountant.getData()
                    }
                    marginReturnOperation(tem).then(res => {
                        this.$message.success("驳回成功")
                        this.closeTab()
                    })
                }
            })
        },
        invalidBtn () {
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                let tem = this.formData
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value
                }
                if(this.$refs.accountant){
                    tem.companyPayList = this.$refs.accountant.getData()
                }
                marginReturnOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        processGetInfo () {
            this.taskId = this.pushData.taskId
            this.procInstId = this.pushData.procInstId
            this.pdfId = this.pushData.procDefId
            this.tabShow = true
            if (this.pushData.activityId) {
                getDetails(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                    this.btnList = util.isDef(res.operation) ? res.operation : ''
                    this.form.rejectVal = res.sendBackNode
                    this.msg = res.msg
                })
                if(this.pushData.pathName === 'backlog'){
                    findReverseRoute(this.pushData.procDefId + '/' +this.pushData.activityId).then(res=>{
                        this.returnList = res
                    })
                }
            }
            getRefundById({id:this.pushData.processVariables.relevancyId}).then(res => {
                let marginReturn = this.formData = res.marginReturn
                switch(this.formData.interestAccrualManner){
                    case '1197335230566318080':
                        this.formData.interestAccrualMannerName = '日息'
                        break
                    case '1197334487260151808':
                        this.formData.interestAccrualMannerName = '月息'
                        break
                    case '1197317410252005376':
                        this.formData.interestAccrualMannerName = '年息'
                        break
                }
                this.advancePayment = res.advancePayment
                this.firmlyBelieve = res.firmlyBelieve
                this.surrender = res.surrender
                marginReturn.surrenderPool = marginReturn.surrenderPool + '';
                marginReturn.surrenderValue = marginReturn.surrenderValue + '';
                marginReturn.matEndowment = parseFloat(marginReturn.matEndowment).toFixed(2);
                this.getBacKBank(marginReturn.associatedPersonId)
                this.getDialogData(marginReturn.accountFund)
                this.transform.isShowDetails = true
                // res.marginReturn.surrenderPool = res.marginReturn.surrenderPool + ''
                // res.marginReturn.surrenderValue = res.marginReturn.surrenderValue + ''
                // res.marginReturn.matEndowment = parseFloat(res.marginReturn.matEndowment).toFixed(2)
                // this.getBacKBank(res.marginReturn.associatedPersonId)
                // this.marginReturn = res.marginReturn
                // this.getDialogData(res.marginReturn.accountFund)
                this.cloneData = JSON.parse(JSON.stringify(res))
                this.cloneData.id = this.cloneData.voucherId;
                this.dataInfo = marginReturn.withholdList
                this.label3Data(marginReturn.withholdList)
                this.label2 = '公司垫付资金: ' + util.moneyTransform(marginReturn.matEndowment) + '元'
                this.accDataInfo = util.isArray(marginReturn.companyPayList) ? marginReturn.companyPayList : []
                this.showAccrual = marginReturn.isRate === '0' ? false : true
                if(util.isArray(marginReturn.companyPayList)){
                    this.accDataInfo = marginReturn.companyPayList
                }
                this.showCompany = marginReturn.direction === '1' ? false : true
                this.accIsShowDetails = true
                
                this.fileList = this.formData.fileList
                this.setFile(this.formData.fileList)
            })
        },
        getBacKBank (id) {
            getByAccountByAssociatedId({ associatedId: id }).then(res => {
                this.collectUnitAccount = res
            })
        }
    },
    created () {
        getProjectAllOptions().then(option => {
            this.costType = option.costType
        })
    },
    async mounted () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('proID').value()
        let pushObj = this.$route.params.detailData
        if(pushObj){
            this.isShowDetails = true
            this.fromProcess = true
            this.pushData = JSON.parse(this.$route.params.detailData)
            this.processGetInfo()
            switch(this.pushData.pathName){
                case "backlog":
                    this.backlog = true
                    this.isSendBack = false
                    this.showCompany = true
                    break
                case "sendBack":
                    this.isSendBack = true
                    this.backlog = false
                    this.showCompany = false
                    this.isShowDetails = false
                    break
                case "examine":
                    if(this.pushData.processVariables.processState === '6'){
                        this.isSendBack = true
                        this.isShowDetails = false
                        this.backlog = false
                        this.showCompany = false
                        break
                    }
                default:
                    this.backlog = false
                    this.isSendBack = false
                    break
            }
        }else{
            if(this.$route.params.isAdd){
                this.setData()
                this.$nextTick (() => { this.$refs.formData.clearValidate()})
                this.getBacKBank(this.$route.params.cashInfo.associatedPersonId)
            }else{
                let returnInfo = this.$route.params.returnInfo
                this.marginReturn = returnInfo.marginReturn
                this.firmlyBelieve = returnInfo.firmlyBelieve
                this.advancePayment = returnInfo.advancePayment
                this.surrender = returnInfo.surrender

                this.showAccrual = this.marginReturn.isRate === '0' ? false : true
                this.marginReturn.surrenderPool = this.marginReturn.surrenderPool + ''
                this.marginReturn.surrenderValue = this.marginReturn.surrenderValue + ''
                this.transform.isShowDetails = this.isShowDetails = this.$route.params.isDetail
                this.marginReturn.matEndowment = parseFloat(this.marginReturn.matEndowment).toFixed(2)
                switch(this.marginReturn.interestAccrualManner){
                    case '1197335230566318080':
                        this.marginReturn.interestAccrualMannerName = '日息'
                        break
                    case '1197334487260151808':
                        this.marginReturn.interestAccrualMannerName = '月息'
                        break
                    case '1197317410252005376':
                        this.marginReturn.interestAccrualMannerName = '年息'
                        break
                }
                this.formData = this.marginReturn
                this.backUnit = this.marginReturn.direction === '1' ? false : true
                this.getDialogData(this.marginReturn.accountFund)
                this.getBacKBank(this.marginReturn.associatedPersonId)
                this.marginReturn.withholdList.forEach ( item => {
                    item.money = item.money + ''
                })
                this.dataInfo = this.marginReturn.withholdList
                
                this.fileList = this.formData.fileList
                this.setFile(this.formData.fileList)

                this.label3Data(this.marginReturn.withholdList)
                this.label2 = '公司垫付资金: ' + util.moneyTransform(this.marginReturn.matEndowment) + '元'
                
                if(util.isString(this.marginReturn.procInstId) && this.marginReturn.procInstId !== ''){
                    this.fromProcess = this.$route.params.isDetail
                    this.backlog = false
                    this.isSendBack = false
                    this.tabShow = true
                    this.taskId = this.marginReturn.taskId
                    this.procInstId = this.marginReturn.procInstId
                    this.pdfId = this.marginReturn.procDefId
                    this.showCompany = this.marginReturn.direction === '1' ? false : true
                    this.backUnit = this.marginReturn.direction === '1' ? false : true
                    this.accDataInfo = util.isArray(this.marginReturn.companyPayList) ? this.marginReturn.companyPayList : []
                } else if (this.marginReturn.procState === '1') {
                    this.fromProcess = false
                }
            }
        }
    }
}
</script>
<style lang="scss">
.drawer-btn{
    text-align: center;
}
.open-tender{
    .el-divider__text.is-center{
        left: 80px;
        padding-left: 25px;
    }
    .el-divider__text.is-center:before{
        content: '';
        width: 3px;
        height: 17px;
        background: #346fff;
        position: absolute;
        left: 13px;
        top: 2px;
    }
    .cash-return{
        .el-card__body{
            .project-base-info{
                .el-form-item{
                    margin-bottom: 10px;
                }
            }
            .retuern-content{
                padding: 20px;
                background-color: #F4F9FF;
                .el-tabs__item{
                    padding: 0px 30px;
                    height: 50px;
                    line-height: 50px;
                    font-weight: bold;
                    background-color: #FFF;
                }
                .el-tabs__item.is-active{
                    background-color: #409EFF;
                    color: #FFF;
                }
                // .label1-content{
                //     cursor: pointer;
                //     padding: 10px;
                //     border: 1px solid #56A7FE;
                //     .el-form-item{
                //         margin-bottom: 10px;
                //     }
                // }
                .label2-content{
                    .el-form-item{
                        margin-bottom: 10px;
                    }
                }
            }
            .el-input--medium{
                .el-input__inner{
                    border-radius: 0px;
                }
            }
            .el-select--medium{
                width: 100%;
            }

        }
        .remark{
            padding: 0px 20px;
        }
    }
    .btn-group{
        text-align: center;
        margin: 20px 0px;
        display: block;
    }
}
</style>
