<template>
    <d2-container class="address-book open-tender">
    <el-dialog
        v-dialogDrag
        title="提示"
        :visible.sync="hint"
        width="30%"
        :close-on-click-modal="false"
        :before-close="hintClose">
        <div style="text-align:center;">
            <img src="../components/img/mark.png">
            <p style="color:red;text-align:center;font-size:18px;">此项目尚未进行标书制作！</p>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;padding-left:40px;display:block;">
            <el-button size="mini" style="margin-right:20px;" @click="hintClose">留在此页面</el-button>
            <el-button size="mini" type="primary" @click="hintEnter">去标书制作</el-button>
        </span>
    </el-dialog>
    <el-card class="box-card">
        <div v-if="fromProcess">
             <qqt-flow-tabs v-if="tabShow" :procInstId="procInstId" :isProcessInstance='isProcessInstance' :pdfId="pdfId">
                <template slot="content">
                    <fm-generate-form
                        :data="jsonData"
                        :remote="remoteFuncs"
                        :value="values"
                        :transform="transform"
                        @on-change="valueChange"
                        ref="generateForm"/>
                        <div class="tender-form" v-if="isBid">
                            <el-form ref="tenderForm" :label-position="'right'" size="medium" label-width="120px" :rules="tenderFormRules" :model="tenderForm">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="公示中标时间:" required>
                                            <el-date-picker v-if="!transform.isShowDetails" size="medium" v-model="tenderForm.theWinningTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                                            <el-date-picker disabled v-if="transform.isShowDetails" size="medium" v-model="tenderForm.theWinningTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="公示中标价格:" required>
                                            <el-input v-model="tenderForm.tenderPrice" @input="calculateFee" size="medium" v-if="!transform.isShowDetails">
                                                <template slot="append">元</template>
                                            </el-input>
                                             <el-input v-model="tenderForm.tenderPrice" size="medium" v-if="transform.isShowDetails" type='text' disabled>
                                                <template slot="append">元</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="公示投标工期:" required>
                                            <calcu-date :day="biddingPeriod" :startTime="tenderForm.theWinningTime" ref="calcuDate" :isWrite='transform.isShowDetails'></calcu-date>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="管理费用比例:" required>
                                            <el-input v-model="tenderForm.managementRatio" size="medium" v-if="!transform.isShowDetails" type='number' @input="calculateFee">
                                                <template slot="append">%</template>
                                            </el-input>
                                            <el-input v-model="tenderForm.managementRatio" size="medium" v-if="transform.isShowDetails" type='number' disabled>
                                                <template slot="append">%</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="管理费金额:">
                                            <el-input v-model="tenderForm.administrativeFee" readonly size="medium" v-if="!transform.isShowDetails">
                                                <template slot="append">元</template>
                                            </el-input>
                                            <el-input v-model="tenderForm.administrativeFee" disabled size="medium" v-if="transform.isShowDetails">
                                                <template slot="append">元</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="大写:">
                                            <el-input v-model="tenderForm.bigWriteCharge" readonly size="medium" v-if="!transform.isShowDetails"></el-input>
                                            <el-input v-model="tenderForm.bigWriteCharge" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24">
                                        <el-form-item label="主要建设内容:" required prop="principalConstructionContent">
                                            <el-input v-model="tenderForm.principalConstructionContent" size="medium" v-if="!transform.isShowDetails" type="textarea"></el-input>
                                            <el-input v-model="tenderForm.principalConstructionContent" size="medium" disabled v-if="transform.isShowDetails" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="商务标编制:" required prop="commercialBid">
                                            <el-select filterable v-model="tenderForm.commercialBid" style="width: 100%;" v-if="!transform.isShowDetails" @change="valueChange ('commercialBid', $event)">
                                                <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="commercialBidText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作单位:" required prop="commercialUnitId">
                                            <el-select v-model="tenderForm.commercialUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('commercialUnitId', $event)">
                                                <el-option v-for="item in commercialCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作部门:" required prop="commercialDepartmentId">
                                            <el-select v-model="tenderForm.commercialDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('commercialDepartmentId', $event)">
                                                <el-option v-for="item in commercialDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="开标负责人:" required prop="bidOpeningPrincipal">
                                            <el-select v-model="tenderForm.bidOpeningPrincipal" placeholder="请选择" style="width: 100%;" v-if="!transform.isShowDetails"  @change="valueChange ('bidOpeningPrincipal', $event)">
                                                <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="bidOpeningPrincipalText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作单位:" required prop="bidOpeningPrincipalUnitId">
                                            <el-select v-model="tenderForm.bidOpeningPrincipalUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('bidOpeningPrincipalUnitId', $event)">
                                                <el-option v-for="item in bidOpeningPrincipalCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作部门:" required prop="bidOpeningPrincipalDepartmentId">
                                            <el-select v-model="tenderForm.bidOpeningPrincipalDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('bidOpeningPrincipalDepartmentId', $event)">
                                                <el-option v-for="item in bidOpeningPrincipalDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="技术标编制:" required prop="technicalProposal">
                                            <el-select v-model="tenderForm.technicalProposal" v-if="!transform.isShowDetails" style="width: 100%;" @change="valueChange ('technicalProposal', $event)">
                                                <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="technicalProposalText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作单位:" required prop="technicalProposalUnitId">
                                            <el-select v-model="tenderForm.technicalProposalUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('technicalProposalUnitId', $event)">
                                                <el-option v-for="item in technicalProposalCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作部门:" required prop="technicalProposalDepartmentId">
                                            <el-select v-model="tenderForm.technicalProposalDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('technicalProposalDepartmentId', $event)">
                                                <el-option v-for="item in technicalProposalDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="预算编制:" required prop="budgeting">
                                            <el-select v-model="tenderForm.budgeting" placeholder="请选择" style="width: 100%;" v-if="!transform.isShowDetails" @change="valueChange ('budgeting', $event)">
                                                <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="budgetingText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作单位:" required prop="budgetingUnitId">
                                            <el-select v-model="tenderForm.budgetingUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('budgetingUnitId', $event)">
                                                <el-option v-for="item in budgetingCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="工作部门:" required prop="budgetingDepartmentId">
                                            <el-select v-model="tenderForm.budgetingDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('budgetingDepartmentId', $event)">
                                                <el-option v-for="item in budgetingDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    <el-divider></el-divider>
                    <el-tabs v-model="activeName" >
                        <el-tab-pane label="项目部组成人员" name="first">
                            <qqt-project-member ref="memberRef" :isShowDetails="isShowDetails" :dataInfo="memberData"/>
                        </el-tab-pane>
                        <el-tab-pane label="其他投标公司及报价" name="second">
                            <other-com-price ref="priceAddLine" :isShowDetails="transform.isShowDetails" :dataInfo="priceLineData"></other-com-price>
                        </el-tab-pane>
                        <el-tab-pane label="应收联营人费用明细及金额" name="third">
                            <money-add-line ref="moneyAddLine" :isShowDetails="transform.isShowDetails" :dataInfo="addLineData"></money-add-line>
                        </el-tab-pane>
                    </el-tabs>
                    <el-divider>附件</el-divider>
                    <up-load :isShowUpload="!isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
                    <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
                    <el-row>
                        <el-col :span="24" style="text-align:center" class="d2-mt-20">
                            <el-button size="small" type="primary" v-if="backlog"  @click="consentFun">同意</el-button>
                            <el-button size="small" type="primary" v-if="isSendBack" @click="anewSubmitBtn">重新提交</el-button>
                            <el-button size="small" type="warning" v-if="btnList.indexOf('1') != -1 && backlog" @click="turnToFun">转办</el-button>
                            <el-button size="small" type="success" v-if="btnList.indexOf('2') != -1 && backlog" plain @click="returnBtn">驳回</el-button>
                            <el-button size="small" type="info" v-if="btnList.indexOf('3') != -1 && backlog" @click="invalidBtn">作废</el-button>
                            <el-button size="small" type="info" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                            <el-button size="small" type="primary" v-if="backlog" plain @click="closeTab">取消</el-button>
                            <el-button size="small" type="primary" v-if="!backlog" @click="closeTab">关闭</el-button>
                        </el-col>
                    </el-row>
                </template>
            </qqt-flow-tabs>
            <el-dialog v-dialogDrag title="驳回" :visible.sync="rejectShow" width="30%">
                <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                    <el-form-item label="驳回节点：" prop="rejectVal">
                        <el-select v-model="form.rejectVal"  placeholder="" >
                            <el-option v-for="item in returnList" :key="item.activityId" :label="item.name" :value="item.activityId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="驳回理由：" prop="paymessage">
                        <el-input type="textarea" :rows="2" placeholder="请输入驳回理由" v-model="form.paymessage"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="rejectOk">确 定</el-button>
                    <el-button @click="rejectCancel">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        <div v-if="!fromProcess">
            <fm-generate-form
                :data="jsonData"
                :remote="remoteFuncs"
                :value="values"
                :transform="transform"
                @on-change="valueChange"
                ref="generateForm"/>
                <div class="tender-form" v-if="isBid">
                    <el-form ref="tenderForm" :label-position="'right'" size="medium" label-width="120px" :rules="tenderFormRules" :model="tenderForm">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="公示中标时间:" required prop="theWinningTime">
                                    <el-date-picker v-if="!transform.isShowDetails" size="medium" v-model="tenderForm.theWinningTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                                    <el-date-picker disabled v-if="transform.isShowDetails" size="medium" v-model="tenderForm.theWinningTime" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="公示中标价格:" required prop="tenderPrice">
                                    <el-input v-model="tenderForm.tenderPrice" size="medium" @input="calculateFee" v-if="!transform.isShowDetails">
                                        <template slot="append">元</template>
                                    </el-input>
                                    <el-input v-model="tenderForm.tenderPrice" size="medium" disabled v-if="transform.isShowDetails">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="公示投标工期:" >
                                    <calcu-date :day="biddingPeriod" :startTime="tenderForm.theWinningTime" ref="calcuDate" :isWrite='transform.isShowDetails'></calcu-date>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="管理费用比例:" required prop="managementRatio">
                                    <el-input v-model="tenderForm.managementRatio" size="medium" v-if="!transform.isShowDetails" type='number' @input="calculateFee">
                                        <template slot="append">%</template>
                                    </el-input>
                                    <el-input v-model="tenderForm.managementRatio" size="medium" v-if="transform.isShowDetails" type='number' disabled>
                                        <template slot="append">%</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="管理费金额:">
                                    <el-input v-model="tenderForm.administrativeFee" readonly size="medium" v-if="!transform.isShowDetails">
                                        <template slot="append">元</template>
                                    </el-input>
                                    <el-input v-model="tenderForm.administrativeFee" disabled size="medium" v-if="transform.isShowDetails">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="大写:">
                                    <el-input v-model="tenderForm.bigWriteCharge" readonly size="medium" v-if="!transform.isShowDetails"></el-input>
                                    <el-input v-model="tenderForm.bigWriteCharge" disabled size="medium" v-if="transform.isShowDetails"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="主要建设内容:" required prop="principalConstructionContent">
                                    <el-input v-model="tenderForm.principalConstructionContent" size="medium" v-if="!transform.isShowDetails" type="textarea"></el-input>
                                    <el-input v-model="tenderForm.principalConstructionContent" size="medium" disabled v-if="transform.isShowDetails" type="textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="商务标编制:" required prop="commercialBid">
                                    <el-select filterable v-model="tenderForm.commercialBid" style="width: 100%;" v-if="!transform.isShowDetails" @change="valueChange ('commercialBid', $event)">
                                        <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="commercialBidText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作单位:" required prop="commercialUnitId">
                                    <el-select v-model="tenderForm.commercialUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('commercialUnitId', $event)">
                                        <el-option v-for="item in commercialCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作部门:" required prop="commercialDepartmentId">
                                    <el-select v-model="tenderForm.commercialDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('commercialDepartmentId', $event)">
                                        <el-option v-for="item in commercialDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="开标负责人:" required prop="bidOpeningPrincipal">
                                    <el-select filterable v-model="tenderForm.bidOpeningPrincipal" placeholder="请选择" style="width: 100%;" v-if="!transform.isShowDetails"  @change="valueChange ('bidOpeningPrincipal', $event)">
                                        <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="bidOpeningPrincipalText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作单位:" required prop="bidOpeningPrincipalUnitId">
                                    <el-select v-model="tenderForm.bidOpeningPrincipalUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('bidOpeningPrincipalUnitId', $event)">
                                        <el-option v-for="item in bidOpeningPrincipalCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作部门:" required prop="bidOpeningPrincipalDepartmentId">
                                    <el-select v-model="tenderForm.bidOpeningPrincipalDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('bidOpeningPrincipalDepartmentId', $event)">
                                        <el-option v-for="item in bidOpeningPrincipalDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                             <el-col :span="8">
                                <el-form-item label="技术标编制:" required prop="technicalProposal">
                                    <el-select filterable v-model="tenderForm.technicalProposal" v-if="!transform.isShowDetails" style="width: 100%;" @change="valueChange ('technicalProposal', $event)">
                                        <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="technicalProposalText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作单位:" required prop="technicalProposalUnitId">
                                    <el-select v-model="tenderForm.technicalProposalUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('technicalProposalUnitId', $event)">
                                        <el-option v-for="item in technicalProposalCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作部门:" required prop="technicalProposalDepartmentId">
                                    <el-select v-model="tenderForm.technicalProposalDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('technicalProposalDepartmentId', $event)">
                                        <el-option v-for="item in technicalProposalDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="预算编制:" required prop="budgeting">
                                    <el-select filterable v-model="tenderForm.budgeting" placeholder="请选择" style="width: 100%;" v-if="!transform.isShowDetails" @change="valueChange ('budgeting', $event)">
                                        <el-option v-for="item in projectComposition" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-input v-model="budgetingText" size="medium" disabled v-if="transform.isShowDetails"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作单位:" required prop="budgetingUnitId">
                                    <el-select v-model="tenderForm.budgetingUnitId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('budgetingUnitId', $event)">
                                        <el-option v-for="item in budgetingCompanyList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="工作部门:" required prop="budgetingDepartmentId">
                                    <el-select v-model="tenderForm.budgetingDepartmentId" placeholder="请选择" style="width: 100%;" :disabled="transform.isShowDetails" @change="valueChange ('budgetingDepartmentId', $event)">
                                        <el-option v-for="item in budgetingDepartmentList" :key="item.id" :label="item.name" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            <el-divider></el-divider>
            <el-tabs v-model="activeName" >
                <el-tab-pane label="项目部组成人员" name="first">
                    <qqt-project-member ref="memberRef" :isShowDetails="isShowDetails" :dataInfo="memberData"/>
                </el-tab-pane>
                <el-tab-pane label="其他投标公司及报价" name="second">
                    <other-com-price ref="priceAddLine" :isShowDetails="transform.isShowDetails" :dataInfo="priceLineData"></other-com-price>
                </el-tab-pane>
                <el-tab-pane label="应收联营人费用明细及金额" name="third">
                    <money-add-line ref="moneyAddLine" :isShowDetails="transform.isShowDetails" :dataInfo="addLineData"></money-add-line>
                </el-tab-pane>
            </el-tabs>
            <el-divider>附件</el-divider>
            <up-load :isShowUpload="!isShowDetails" @upLoadFileCallBack="upLoadFileCallBack" :propList="upLoadFileDefaultList" ref="upload"/>
            <bottomInformation :values="values" :isGrid="false" :isShowAccessory="false" :transform="transform" ref="bottomInformation"></bottomInformation>
            <div v-if="canSub">
                <div class="drawer-btn" v-if="transform.isShowDetails && $has('joint:open:edit')">
                    <el-button type="info" size="small" v-if="transform.isShowDetails" @click="printTemplate">打印</el-button>
                    <el-button type="primary" size="small" @click="editInfo">编辑</el-button>
                </div>
                <div class="drawer-btn" v-if="!transform.isShowDetails">
                    <el-button type="primary" size="small" @click="subNewPro">保存</el-button>
                    <el-button type="warning" size="small" v-if="$has('joint:open:submit')" @click="subProcess">提交</el-button>
                    <el-button size="small" @click="cancel">取消</el-button>
                </div>
            </div>
            <div v-if="!canSub" class="drawer-btn">
                <el-button size="small" type="primary" @click="closeTab">关闭</el-button>
            </div>
        </div>
    </el-card>
    <print-template-by-html v-show="false" :code="code" ref="printTemp" />
    <user-modules :showDialog="isShow" :userIds="user" :department="department" @clearUserPage="clearUserPage" @closeFun="isShow = false"></user-modules>
    <qqt-send-process :isSendBack='isSendBack' :dialogVisible="dialogVisible" :prossValue="prossValue" :processModuleId="processModuleId" @close="closeFun" @selectData="selectDataFun"></qqt-send-process>
    <qqt-consent :dialogVisible="visible" :msg="msg" :title="title" :taskId="taskId || ''" :type="consent['flag']" :isTurnManage="isTurnManage" :isReject="isReject" @close="consentBorrowingApply" />
    </d2-container>
</template>

<script>
import { qqtFlowDiagram,qqtFlowTabs, upload, qqtSendProcess, qqtConsent} from '../../../../components/qqt-subassembly'
import { formGetJson } from '../../../../api/system/fromManagement/index'
import { getProOpenById, getProOpenEdit, tenderOpenOperation,jointContactListById,tenderOpenSubmit, getProjectAllOptions } from '../../../../api/jointProject/index'
import { PORJECT_INFO, PROJECT_GETINFOID } from '../../../../enum/PROJECT'
import { BASICSCODE } from '@/enum/PRINTTEMPLATE'
import { getPrintTemplateInfoByCodeAndBusiness } from '@/api/system/printTemplate'
import printTemplateByHtml from '@/views/systemManagement/printTemplate/components/printTemplateByHtml'
import bottomInformation from '../../selfSupportProjectDetail/businessBidding/components/bottomInformation'
import QqtProjectMember from "../../../../components/qqt-subassembly/qqt-projet-member/qqt-project-member"
import userModules from '../../../systemManagement/processDefinition/processModules/userModules'
import calcuDate from '../projectCostCompositionCivision/components/calcuDate'
import moneyAddLine from '../components/moneyAddLine'
import otherComPrice from './components/otherComPrice'
import { getOrganizationByCompanyId, getCompanyByUserId } from '@/api/system/depart/depart'
import { getDetails, findReverseRoute, careOf} from '../../../../api/approval/common'
import { staffStaffDictionary } from '../../../../api/system/staff/staff'
import { CITYJSON } from '../../../../enum/CTIYS'
import util from '../../../../libs/util'
import { mapActions } from 'vuex'
let that = this
export default {
    name: "index",
    components: {
        QqtProjectMember,
        'up-load' : upload,
        calcuDate,
        qqtFlowDiagram,
        qqtFlowTabs,
        qqtSendProcess,
        userModules,
        qqtConsent,
        bottomInformation,
        'money-add-line': moneyAddLine,
        'other-com-price': otherComPrice,
        'print-template-by-html': printTemplateByHtml
    },
    data () {
        return {
            priceLineData: [{}],
            addLineData: {
                tableData: [{}],
                charge: '',
                bigWriteCharge: ''
            },
            //提示
            hint: false,
            canSub: true,
            jsonData: {},
            activeName: 'first',
            proId: '',
            contactInfos: [],
            remoteOption: {},
            commercialBidText: '',
            technicalProposalText: '',
            budgetingText: '',
            bidOpeningPrincipalText: '',
            remoteFuncs: {},
            values: {
                section: [],
                projectLocation: [],
                projectType: [],
            },
            values2: {
                otherCompanyLine: [{}],
            },
            values3: {
                costBreakdownLine: [{}],
            },
            temValue: {},
            transform: {
                isShowDetails: true
            },
            isShowDetails: true,
            memberData: [],
            valuesMember: {},
            jsonPrice: {},
            remoteFuncs2: {},
            valuesPrice: {},
            remoteFuncs3: {},
            isBid: false,
            upLoadFileDefaultList: [],
            urlData: [],
            costBreakdownId: '',
            memberId: '',
            otherCompanyId: '',
            fromProcess: false,
            tenderFormRules: {
                theWinningTime: [
                    { required: true, message: '中标时间不能为空', trigger: ['change','blur'] },
                ],
                tenderPrice: [
                    { required: true, message: '公示中标价格不能为空', trigger: ['change','blur'] }
                ],
                managementRatio: [
                    { required: true, message: '管理费用比例不能为空', trigger: ['change','blur'] },
                    { pattern: /^\d+(\.\d+)?$/, message: '管理费用比例不能为负数', trigger: ['change','blur'] }
                ],
                commercialBid: [
                    { required: true, message: '商务标编制不能为空', trigger: ['change','blur'] }
                ],
                commercialUnitId: [
                    { required: true, message: '工作单位必须填写', trigger: ['change','blur'] }
                ],
                bidOpeningPrincipalUnitId: [
                    { required: true, message: '工作单位必须填写', trigger: ['change','blur'] }
                ],
                technicalProposalUnitId: [
                    { required: true, message: '工作单位必须填写', trigger: ['change','blur'] }
                ],
                budgetingUnitId: [
                    { required: true, message: '工作单位必须填写', trigger: ['change','blur'] }
                ],
                commercialDepartmentId: [
                    { required: true, message: '工作部门必须填写', trigger: ['change','blur'] }
                ],
                bidOpeningPrincipalDepartmentId: [
                    { required: true, message: '工作部门必须填写', trigger: ['change','blur'] }
                ],
                technicalProposalDepartmentId: [
                    { required: true, message: '工作部门必须填写', trigger: ['change','blur'] }
                ],
                budgetingDepartmentId: [
                    { required: true, message: '工作部门必须填写', trigger: ['change','blur'] }
                ],
                technicalProposal: [
                    { required: true, message: '技术标编制不能为空', trigger: ['change','blur'] }
                ],
                budgeting: [
                    { required: true, message: '预算编制不能为空', trigger: ['change','blur'] }
                ],
                bidOpeningPrincipal: [
                    { required: true, message: '开标负责人不能为空', trigger: ['change','blur'] }
                ],
                principalConstructionContent: [
                    { required: true, message: '主要建设内容不能为空', trigger: ['change','blur'] }
                ]
            },
            tenderForm: {
                theWinningTime: '',
                tenderPrice: '',
                managementRatio: '',
                administrativeFee: '',
                bigWriteCharge: '',
                principalConstructionContent: '',
                commercialBid: '',
                technicalProposal: '',
                budgeting: '',
                bidOpeningPrincipal: '',
            },
            bidOpeningTime: '',
            biddingPeriod: 0,
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
            rejectVal: [
                    { required: true, message: '请选择驳回节点', trigger: ['change','blur'] }
                ],
                paymessage: [
                    { required: true, message: '请选择驳回理由', trigger:  ['change','blur']  }
                ],
            },
            form: {
                rejectVal: '',
                paymessage: ''
            },
            rejectShow: false,
            isProcessInstance: '',
            topTemData: {},
            // 新组件
            isTurnManage: false,
            consent: {},
            visible: false,
            isReject: false,
            title: '',
            msg: '',
            code: BASICSCODE.JOINT_PROJECTOPEN,
            projectComposition: [],
            bidOpeningPrincipalDepartmentList: [],
            technicalProposalDepartmentList: [],
            commercialDepartmentList: [],
            budgetingDepartmentList: [],
            budgetingCompanyList: [],
            commercialCompanyList: [],
            technicalProposalCompanyList: [],
            bidOpeningPrincipalCompanyList: []
        }
    },
    created () {
        this.getStaffStaffDictionary ()
    },
    methods: {
        ...mapActions('d2admin/page', [
            'close',
            'open'
        ]),
        ...mapActions('d2admin/db', [
            'database',
        ]),
        //提示信息
        hintClose(){
            this.hint = false;
        },
        //跳转到报名
        hintEnter(){
            this.$router.push({
                path:'/projectManagement/jontProjectDetail/tenderBookMake',
                name:'tenderBookMake'
            })
        },
        calculateFee(){
            this.tenderForm.administrativeFee = Number(this.tenderForm.tenderPrice) * Number(this.tenderForm.managementRatio) / 100
            this.tenderForm.bigWriteCharge = util.convertCurrency(this.tenderForm.administrativeFee)
        },
        valueChange(field, value, data) {
            let item = {}
            switch (field) {
                case 'isBid':
                    this.isBid = value === '是' ? true : false
                    this.tenderForm = value === '是' ? this.tenderForm : {}
                    this.biddingPeriod = value === '是' ? this.biddingPeriod : 0
                    break
                case 'associatedPersonIds':
                    this.tenderForm.associatedPersonIds = value
                    this.contactInfos.forEach(item => {
                        if(item.id === value){
                            data.phones = item.contactcell
                        }
                    })
                    this.values = data
                    break
                case 'commercialBid':
                    this.tenderForm.commercialBid = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.tenderForm.commercialUnitId = this.tenderForm.commercialDepartmentId = ''
                    this.tenderForm.commercialUnitName = this.tenderForm.commercialDepartmentName = ''
                    if (item) {
                        this.tenderForm['commercialName'] = item.name
                        this.getPositionDepartment (value, 1)
                    }
                    break
                case 'commercialUnitId':
                    this.tenderForm.commercialUnitBid = value
                    item = this.commercialCompanyList.find (f => f.id == value)
                    this.tenderForm.commercialDepartmentBid = this.tenderForm.commercialDepartmentName = ''
                    if (item) {
                        this.tenderForm['commercialUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.tenderForm.commercialBid, 1)
                    }
                    break
                case 'commercialDepartmentId':
                    this.tenderForm.commercialDepartmentBid = value
                    item = this.commercialDepartmentList.find (f => f.id == value)
                    if (item) this.tenderForm['commercialDepartmentName'] = item.name
                    break
                case 'technicalProposal':
                    this.tenderForm.technicalProposal = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.tenderForm.technicalProposalUnitId = this.tenderForm.technicalProposalDepartmentId = ''
                    this.tenderForm.technicalProposalUnitName = this.tenderForm.technicalProposalDepartmentName = ''
                    if (item) {
                        this.values['technicalProposalName'] = item.name
                        this.getPositionDepartment (value, 2)
                    }
                    break
                case 'technicalProposalUnitId':
                    this.tenderForm.technicalProposalUnitId = value
                    item = this.technicalProposalCompanyList.find (f => f.id == value)
                    this.tenderForm.technicalProposalDepartmentId = this.tenderForm.technicalProposalDepartmentName = ''
                    if (item) 
                        this.tenderForm['technicalProposalUnitName'] = item.name,
                        this.getDepIdByCompanyIdList (value, this.tenderForm.technicalProposal, 2)
                    break
                case 'technicalProposalDepartmentId':
                    this.tenderForm.technicalProposalDepartmentId = value
                    item = this.technicalProposalDepartmentList.find (f => f.id == value)
                    if (item) this.tenderForm['technicalProposalDepartmentName'] = item.name
                    break
                case 'budgeting':
                    this.tenderForm.budgeting = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.tenderForm.budgetingUnitId = this.tenderForm.budgetingDepartmentId = ''
                    this.tenderForm.budgetingUnitName = this.tenderForm.budgetingDepartmentName = ''
                    if (item)
                        this.tenderForm['budgetingName'] = item.name
                        this.getPositionDepartment (value, 3)
                    break
                case 'budgetingUnitId':
                    this.tenderForm.budgetingUnitId = value
                    item = this.budgetingCompanyList.find (f => f.id == value)
                    this.tenderForm.budgetingDepartmentId = this.tenderForm.budgetingDepartmentName = ''
                    if (item)
                        this.tenderForm['budgetingUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.tenderForm.budgeting, 3)
                    break
                case 'budgetingDepartmentId':
                    this.tenderForm.budgetingDepartmentId = value
                    item = this.budgetingDepartmentList.find (f => f.id == value)
                    if (item) this.tenderForm['budgetingDepartmentName'] = item.name
                    break
                case 'bidOpeningPrincipal':
                    this.tenderForm.bidOpeningPrincipal = value
                    item = this.projectComposition.find (f => f.id == value)
                    this.tenderForm.bidOpeningPrincipalUnitId = this.tenderForm.bidOpeningPrincipalDepartmentId = ''
                    this.tenderForm.bidOpeningPrincipalUnitName = this.tenderForm.bidOpeningPrincipalDepartmentName = ''
                    if (item)
                        this.tenderForm['bidOpeningPrincipalName'] = item.name
                        this.getPositionDepartment (value, 4)
                    break
                case 'bidOpeningPrincipalUnitId':
                    this.tenderForm.bidOpeningPrincipalUnitId = value
                    item = this.bidOpeningPrincipalCompanyList.find (f => f.id == value)
                    this.tenderForm.bidOpeningPrincipalDepartmentId = this.tenderForm.bidOpeningPrincipalDepartmentName = ''
                    if (item)
                        this.tenderForm['bidOpeningPrincipalUnitName'] = item.name
                        this.getDepIdByCompanyIdList (value, this.tenderForm.bidOpeningPrincipal, 4)
                    break
                case 'bidOpeningPrincipalDepartmentId':
                    this.tenderForm.bidOpeningPrincipalDepartmentId = value
                    item = this.bidOpeningPrincipalDepartmentList.find (f => f.id == value)
                    if (item) this.tenderForm['bidOpeningPrincipalDepartmentName'] = item.name
                    break
                default:
                    break
                this.tenderForm[field] = value
            }
            this.values[field] = value
        },
        valueChange2 (field, value, data) {},
        upLoadFileCallBack(data){
            this.urlData = data
        },
        editInfo() {
            this.transform.isShowDetails = false
            this.isShowDetails = false
        },
        async printTemplate () {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            getPrintTemplateInfoByCodeAndBusiness ({'id': this.code, 'businessId': db.get('proID').value()}).then(res => {
                // console.log(res);
                    res.sectionDic = res.section
                    console.log(res);
                if (res) this.$refs.printTemp.printTemplate (res)
            })
        },
        cancel() {
            this.values = this.temValue
            this.transform.isShowDetails = true
            this.isShowDetails = true
        },
        formatSubData(res){
            if(this.isBid){
                Object.assign (res, this.tenderForm)
            }
            if(res.isBid === '是' || res.isBid === '否'){
                res.isBid = res.isBid === '是' ? '1' : '0'
            }
            res.id = this.proId
            res.memberLine = that.$refs.memberRef.getData()
            this.memberData = that.$refs.memberRef.getData()
            res.fileList = this.urlData
            if(util.isArray(res.qualificationRequirement)) {
                res.qualificationRequirement = util.jointData(res.qualificationRequirement, ',')
            }
            this.remoteOption.customer.forEach(item => {
                if(res.associatedPersonId === item.id){
                    res.associatedPerson = item.cusName
                }
            })
            this.contactInfos.forEach(item => {
                if(res.associatedPersonIds === item.id){
                    res.associatedPersons = item.contact
                }
            })
            if(util.isArray(res.projectLocation)) {
                res.projectLocation = util.jointData(res.projectLocation, '/')
            }
            if(util.isArray(res.section)) {
                res.section = util.jointData(res.section, ',')
            }
            if(util.isArray(res.projectType)) {
                res.projectType = util.jointData(res.projectType, ',')
            }

            this.remoteOption.company.forEach(item => {
                if(res.biddingCompanyId === item.id){
                    res.biddingCompanyName = item.organiname
                }
            })
            res.costBreakdownId = this.costBreakdownId
            res.memberId = this.memberId
            res.otherCompanyId = this.otherCompanyId
            return res
        },
        subNewPro () {
            let bottomInformation = this.$refs.bottomInformation.getData ()
            that.$refs.generateForm.getData().then(res => {
                if (res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    res.otherCompanyLine = this.$refs.priceAddLine.getData()
                    res.costBreakdownLine = this.$refs.moneyAddLine.getData().tableData
                    res = this.formatSubData(res)
                    let tem = {
                        id: that.proId,
                        jointProjectOpen: res
                    }
                    let canSubOperation = true
                    let message = ''
                    res.memberLine.forEach((item, index) => {
                        if(index < 5){
                            if(item.line2 === '' || item.line3 === ''){
                                canSubOperation = false
                                message = "项目组成人员信息未填写完全!!!"
                            }
                        }
                    })
                    if(this.isBid){
                        this.$refs.tenderForm.validate((valid) => {
                            if(!valid){
                                canSubOperation = false
                                message = "开标信息未填写完全!!!"
                            }
                        })
                    }
                    tem.jointProjectOpen.biddingPeriod = this.$refs.calcuDate.returnData()
                    // console.log(this.biddingPeriod);
                    // console.log(this.$refs.calcuDate.returnData());
                    // console.log(tem);
                    // return
                    if (canSubOperation) {
                        if (tem.jointProjectOpen.isBid == '0') {
                            tem.jointProjectOpen.theWinningTime = tem.jointProjectOpen.managementRatio =
                            tem.jointProjectOpen.administrativeFee = tem.jointProjectOpen.bigWriteCharge = tem.jointProjectOpen.principalConstructionContent = 
                            tem.jointProjectOpen.commercialBid = tem.jointProjectOpen.technicalProposal = tem.jointProjectOpen.budgeting = tem.jointProjectOpen.bidOpeningPrincipal = '',
                            tem.jointProjectOpen.tenderPrice = tem.jointProjectOpen.administrativeFee = 0.00;
                            tem.jointProjectOpen.biddingPeriod = 0
                        }
                        
                        getProOpenEdit(tem).then(response => {
                            that.$message.success("编辑成功~~")
                            that.transform.isShowDetails = true
                            that.isShowDetails = true
                            
                            this.projectComposition.forEach(item => {
                                if(this.tenderForm.commercialBid === item.id){
                                    this.commercialBidText = item.name
                                }
                                if(this.tenderForm.technicalProposal === item.id){
                                    this.technicalProposalText = item.name
                                }
                                if(this.tenderForm.budgeting === item.id){
                                    this.budgetingText = item.name
                                }
                                if(this.tenderForm.bidOpeningPrincipal === item.id){
                                    this.bidOpeningPrincipalText = item.name
                                }
                            })

                            // this.resetData(tem.jointProjectOpen)
                            // this.commercialBidText = item.name
                            // this.technicalProposalText = item.name
                            // this.budgetingText = item.name
                            // this.bidOpeningPrincipalText = item.name
                        })
                    } else {
                        this.$message.warning(message)
                    }
                }
            })
        },
        setTenderForm(res){
            this.biddingPeriod = Number(res.biddingPeriod)
            this.tenderForm = res
            this.tenderForm.bigWriteCharge = util.convertCurrency(res.administrativeFee)
            this.projectComposition.forEach(item => {
                if(this.tenderForm.commercialBid === item.id){
                    this.commercialBidText = item.name
                }
                if(this.tenderForm.technicalProposal === item.id){
                    this.technicalProposalText = item.name
                }
                if(this.tenderForm.budgeting === item.id){
                    this.budgetingText = item.name
                }
                if(this.tenderForm.bidOpeningPrincipal === item.id){
                    this.bidOpeningPrincipalText = item.name
                }
            })
        },
        async getProInfo() {
            const db = await this.$store.dispatch('d2admin/db/database', {user: true})
            this.proId = db.get('proID').value()
            getProOpenById({
                id: db.get('proID').value()
            }).then(res => {
                this.resetData(res)
                this.urlData = res.fileList;
                this.hint = res.untitled === '10' ? true : false;
                this.canSub = res.procState === '1' ? true : false
                if(util.isString(res.procInstId) && res.procInstId !== ''){
                    this.fromProcess = true
                    this.backlog = false
                    this.isSendBack = false
                    this.tabShow = true
                    this.isShowDetails = true

                    this.taskId = res.taskId
                    this.procInstId = res.procInstId
                    this.pdfId = res.procDefId
                } else if(res.procState === '1'){
                    this.fromProcess = false
                    this.subValue = true
                    this.transform.isShowDetails = false
                    this.isShowDetails = false
                }
            }).finally(res => {
                this.getJSON()
            })
        },
        resetData(res){
            res.bigWriteCharge1 = util.convertCurrency(res.administrativeFee)
            res.isBid = res.isBid === '1' ? '是' : '否'
            this.isBid = res.isBid === '是' ? true : false
            this.proId = res.id
            if(util.isString(res.qualificationRequirement)){
                res.qualificationRequirement = util.splitData(res.qualificationRequirement, ',')
            }
            res.section = util.isArray(res.section) ? res.section : []
            res.qualificationRequirement = util.isArray(res.qualificationRequirement) ? res.qualificationRequirement : []
            res.projectType = util.isArray(res.projectType) ? res.projectType : []
            this.setTenderForm(res)

            this.costBreakdownId = res.costBreakdownId
            this.memberId = res.memberId
            this.otherCompanyId = res.otherCompanyId
            this.setFile(res.fileList)

            if (res.budgeting) this.getPositionDepartment (res.budgeting, 3)
            if (res.commercialBid) this.getPositionDepartment (res.commercialBid, 1)
            if (res.technicalProposal) this.getPositionDepartment (res.technicalProposal, 2)
            if (res.bidOpeningPrincipal) this.getPositionDepartment (res.bidOpeningPrincipal, 4)
            if (res.budgetingUnitId) this.getDepIdByCompanyIdList (res.budgetingUnitId, res.budgeting, 3)
            if (res.commercialUnitId) this.getDepIdByCompanyIdList (res.commercialUnitId, res.commercialBid, 1)
            if (res.technicalProposalUnitId) this.getDepIdByCompanyIdList (res.technicalProposalUnitId, res.technicalProposal, 2)
            if (res.bidOpeningPrincipalUnitId) this.getDepIdByCompanyIdList (res.bidOpeningPrincipalUnitId, res.bidOpeningPrincipal, 4)

            this.memberData = util.isArray(res.memberLine) ? res.memberLine : []
            this.priceAddLine = util.isArray(res.otherCompanyLine) ? res.otherCompanyLine : [{}]
            this.addLineData.tableData = util.isArray(res.costBreakdownLine) ? res.costBreakdownLine : [{}]
            this.priceLineData = util.isArray(res.otherCompanyLine) ? res.otherCompanyLine : [{}]
            if(util.isArray(res.costBreakdownLine)){
                let num = 0
                res.costBreakdownLine.forEach(item => {
                    num += Number(item.line2)
                })
                this.values3.charge = num + ''
                this.values3.bigWriteCharge1 = util.convertCurrency(num)
            }
            this.values = res
            this.temValue = res
        },
        getJSON(){
            jointContactListById({
                id: this.temValue.associatedPersonId
            }).then(res => {
                this.contactInfos = res.contactInfos
            }).finally(res => {
                this.setJson(PORJECT_INFO.OPENTENDER, 'type1')
                this.setJson(PORJECT_INFO.OTHERCOMPANYPRICE, 'type3')
            })
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
        setJson(code, type){
            formGetJson({
                code: code
            }).then(res => {
                switch (type) {
                    case 'type1':
                        this.jsonData = JSON.parse(res)
                        break
                    case 'type3':
                        this.jsonPrice = JSON.parse(res)
                        break
                    default:
                        break
                }
            })
        },
        anewSubmitBtn(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    res.otherCompanyLine = this.$refs.priceAddLine.getData()
                    res.costBreakdownLine = res.costBreakdownLine = this.$refs.moneyAddLine.getData().tableData
                    this.subValue = this.formatSubData(res)
                    this.prossValue.pdfId = this.pushData.procDefId
                    this.prossValue.degree = this.pushData.processVariables.degree
                    this.prossValue.title = '开标登记审批'
                    this.processModuleId = 'openTender'
                    this.dialogVisible = true
                }
            })
        },
        subProcess(){
            let bottomInformation = this.$refs.bottomInformation.getData ()
            this.$refs.generateForm.getData().then(res => {
                if(res && bottomInformation) {
                    res = Object.assign({}, res, bottomInformation)
                    res.otherCompanyLine = this.$refs.priceAddLine.getData()
                    res.costBreakdownLine = res.costBreakdownLine = this.$refs.moneyAddLine.getData().tableData
                    this.subValue = this.formatSubData(res)
                    this.subValue.biddingPeriod = this.$refs.calcuDate.returnData()
                    let canSubOperation = true
                    let message = ''
                    this.subValue.memberLine.forEach((item, index) => {
                        if(index < 5){
                            if(item.line2 === '' || item.line3 === ''){
                                canSubOperation = false
                                message = "项目组成人员信息未填写完全!!!"
                            }
                        }
                    })
                    if(this.isBid){
                        this.$refs.tenderForm.validate((valid) => {
                            if(!valid){
                                canSubOperation = false
                                message = "开标信息未填写完全!!!"
                            }
                        })
                    }
                    if (canSubOperation) {
                        this.processModuleId = 'openTender'
                        this.prossValue.title = '开标登记审批'
                        this.dialogVisible = true
                    } else {
                        this.$message.warning(message)
                    }
                }
            })
        },
        closeFun(){
            this.dialogVisible = false
        },
        selectDataFun(data){
            if (this.isSendBack) {
                // let tem = this.temValue
                let tem = this.subValue
                // tem = this.formatSubData(tem)
                tem.completeTask = data
                tem.completeTask.taskId = this.taskId
                tem.flag = '4'
                tem.procInstId = this.procInstId
                
                
                tenderOpenOperation(tem).then(res => {
                    this.$message.success("重新提交成功")
                    this.closeTab()
                })
            } else {
                this.subValue.completeTask = data
                let tem = {
                    id: this.subValue.id,
                    jpo: this.subValue
                }
                tem.jpo['accessoryId'] = this.temValue ? this.temValue.accessoryId : '';
                // tem.jpo['fileList'] = this.temValue ? this.temValue.fileList : [];
                tenderOpenSubmit(tem).then(res => {
                    this.$message.success("提交成功")
                    this.transform.isShowDetails = true
                    this.isShowDetails = true
                    this.dialogVisible = false
                    this.closeTab()
                })
            }
        },
        consentBorrowingApply(item = '', boolean = false){
            this.visible = this.isTurnManage = this.isReject = false
            if (boolean) {
                this.closeTab ()
                return
            }
            if (item) {
                let tem =  this.formatSubData(this.temValue)
                tem['completeTask'] = item
                tem.flag= '1'
                tem.procInstId = this.procInstId
                tenderOpenOperation (tem).then (res => {
                    if (res.code === 200) {
                        this.$message.success ("同意成功");
                        let tagName = this.$route.path;
                        this.close ({ tagName });
                        this.$router.go(-1);
                    }
                })
            }
        },
        consentFun(){
            this.visible = true
            this.title = '审批'
            this.consent['flag'] = '1'
        },
        turnToFun() {
            this.isShow = true
        },
        clearUserPage(item){
            if (item.length > 0) {
                this.isShow = !this.isShow
                let data = [];
                for (let i = 0; i < item.length; i++) {
                    let str = item[i].id
                    data.push(str)
                }
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
                    this.$message.info('取消输入')
                });
            } else {
                this.$message.error('请选择要转办的部门或人员')
            }
        },
        closeTab () {
            this.$router.go(-1)
            let tagName = this.$route.path
            this.close ({ tagName })
        },
        returnBtn() {
            this.rejectShow = true
        },
        invalidBtn() {
            this.$prompt('此操作将作废该条数据，是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: "btn-custom-cancel",
                inputPattern: /^\S/,
                inputErrorMessage: '请输入作废理由'
            }).then(({ value }) => {
                let tem = this.temValue
                tem = this.formatSubData(tem)
                tem.flag = '3'
                tem.completeTask = {
                    "taskId":this.taskId,
                    "msg":value,
                    "type": '3'
                }
                tenderOpenOperation(tem).then(res => {
                    this.$message.success("作废成功")
                    this.closeTab()
                })
            })
        },
        rejectCancel(){
            this.rejectShow = false
        },
        rejectOk(){
            let tem = this.temValue
            tem = this.formatSubData(tem)
            this.$refs['form'].validate((valid) => {
                tem.flag = '2'
                tem.completeTask = {
                    "taskId":this.taskId,
                    activityId: this.form.rejectVal,
                    msg: this.form.paymessage,
                    type: '2'
                }
                tenderOpenOperation(tem).then(res => {
                    this.$message.success("驳回成功")
                    this.closeTab()
                })
            })
        },
        processGetInfo(){
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
            getProOpenById({id:this.pushData.processVariables.relevancyId}).then(res => {
                this.resetData(res)
            }).finally(res => {
                this.getJSON()
            })
        },
        setRemote (option) {
            this.remoteFuncs = {
                getAssociatedPerson (resolve) {resolve(option.customer)},
                getPlace (resolve) {resolve(CITYJSON)},
                getSection(resolve) {resolve(option.section)},
                getProjectType(resolve) {resolve(option.projectType)},
                getBiddingCompany(resolve){resolve(option.company)},
                getRequirement(resolve) {resolve(option.aptitude)},
                getContactPerson(resolve){ resolve(that.contactInfos)},
                getIsBid(resolve){
                    const options = [
                        {value: '是',label: '是'},
                        {value: '否',label: '否'}
                    ]
                    resolve(options)
                }
            }
        },

        getStaffStaffDictionary () {
            staffStaffDictionary ().then(res => {
                if (res && res.length > 0) {
                    this.projectComposition = res
                }
            })
        },
        // 根据人员查询工作单位
        getPositionDepartment (id, key) {
            getCompanyByUserId ({'userId': id}).then(res => {
                if (res && res.length > 0) {
                    switch (key) {
                        case 1:
                            this.commercialCompanyList = res
                            break
                        case 2:
                            this.technicalProposalCompanyList = res
                            break
                        case 3:
                            this.budgetingCompanyList = res
                            break
                        case 4:
                            this.bidOpeningPrincipalCompanyList = res
                            break
                    }
                }
                if (res.length == 1) {
                    switch (key) {
                        case 1:
                            this.tenderForm.commercialUnitId = res[0]['id']
                            this.tenderForm['commercialUnitName'] = res[0]['name']
                            break
                        case 2:
                            this.tenderForm.technicalProposalUnitId = res[0]['id']
                            this.tenderForm['technicalProposalUnitName'] = res[0]['name']
                            break
                        case 3:
                            this.tenderForm.budgetingUnitId = res[0]['id']
                            this.tenderForm['budgetingUnitName'] = res[0]['name']
                            break
                        case 4:
                            this.tenderForm.bidOpeningPrincipalUnitId = res[0]['id']
                            this.tenderForm['bidOpeningPrincipalUnitName'] = res[0]['name']
                            break
                    }
                    this.getDepIdByCompanyIdList (res[0]['id'], id, key)
                } else {
                    switch (key) {
                        case 1:
                            this.commercialDepartmentList.splice(0,this.commercialDepartmentList.length);
                            break
                        case 2:
                            this.technicalProposalDepartmentList.splice(0,this.technicalProposalDepartmentList.length);
                            break
                        case 3:
                            this.budgetingDepartmentList.splice(0,this.budgetingDepartmentList.length);
                            break
                        case 4:
                            this.bidOpeningPrincipalDepartmentList.splice(0,this.bidOpeningPrincipalDepartmentList.length);
                            break
                    }
                }
                if (!res || res.length == 0) {
                    switch (key) {
                        case 1:
                            this.commercialCompanyList.splice(0,this.commercialCompanyList.length);
                            break
                        case 2:
                            this.technicalProposalCompanyList.splice(0,this.technicalProposalCompanyList.length);
                            break
                        case 3:
                            this.budgetingCompanyList.splice(0,this.budgetingCompanyList.length);
                            break
                        case 4:
                            this.bidOpeningPrincipalCompanyList.splice(0,this.bidOpeningPrincipalCompanyList.length);
                            break
                    }
                }
            })
        },

        getDepIdByCompanyIdList (id, userId, key) {
             getOrganizationByCompanyId({'id': id, 'userId': userId}).then(res => {
                if (res && res.length > 0) {
                    switch (key) {
                        case 1:
                            this.commercialDepartmentList = res
                            break
                        case 2:
                            this.technicalProposalDepartmentList = res
                            break
                        case 3:
                            this.budgetingDepartmentList = res
                            break
                        case 4:
                            this.bidOpeningPrincipalDepartmentList = res
                            break
                    }
                }
                if (res && res.length == 1) {
                    switch (key) {
                        case 1:
                            this.tenderForm.commercialDepartmentId = res[0]['id']
                            this.tenderForm['commercialDepartmentName'] = res[0]['name']
                            break
                        case 2:
                            this.tenderForm.technicalProposalDepartmentId = res[0]['id']
                            this.tenderForm['technicalProposalDepartmentName'] = res[0]['name']
                            break
                        case 3:
                            this.tenderForm.budgetingDepartmentId = res[0]['id']
                            this.tenderForm['budgetingDepartmentName'] = res[0]['name']
                            break
                        case 4:
                            this.tenderForm.bidOpeningPrincipalDepartmentId = res[0]['id']
                            this.tenderForm['bidOpeningPrincipalDepartmentName'] = res[0]['name']
                            break
                    }
                }
                if (!res || res.length == 0) {
                    switch (key) {
                        case 1:
                            this.commercialDepartmentList.splice(0,this.commercialDepartmentList.length);
                            break
                        case 2:
                            this.technicalProposalDepartmentList.splice(0,this.technicalProposalDepartmentList.length);
                            break
                        case 3:
                            this.budgetingDepartmentList.splice(0,this.budgetingDepartmentList.length);
                            break
                        case 4:
                            this.bidOpeningPrincipalDepartmentList.splice(0,this.bidOpeningPrincipalDepartmentList.length);
                            break
                    }
                }
            })
        }
    },
    mounted() {
        getProjectAllOptions().then(options => {
            this.remoteOption = options
            this.setRemote(options)
        }).finally(() => {
            that = this
            let pushObj = this.$route.params.detailData
            if(pushObj){
                this.fromProcess = true
                this.pushData = JSON.parse(this.$route.params.detailData)
                this.processGetInfo()
                switch(this.pushData.pathName){
                    case "backlog":
                        this.backlog = true
                        this.isSendBack = false
                        this.transform.isShowDetails = true
                        break
                    case "sendBack":
                        this.isSendBack = true
                        this.backlog = false
                        this.transform.isShowDetails = false
                        this.isShowDetails = false
                        break
                    case "examine":
                        if(this.pushData.processVariables.processState === '6'){
                            this.isSendBack = false
                            this.backlog = false
                            this.transform.isShowDetails = false
                            this.isShowDetails = false
                            break
                        }
                    default:
                        this.backlog = false
                        this.isSendBack = false
                        this.transform.isShowDetails = true
                        break
                }
            }else{
                this.getProInfo()
            }
        })
    }
}
</script>

<style lang="scss">
.drawer-btn{
    text-align: center;
    margin-top: 20px;
}
.open-tender{
    .el-divider__text.is-center{
        left: 60px;
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
}
.tender-form{
    .el-input__inner, .el-input-group__append{
        border-radius: 0px;
    }
    .is-disabled{
        .el-input__inner{
            border: none;
        }
        .el-input-group__append{
            border: none;
        }
        .el-input__prefix{
            border: none;
        }
        .el-textarea__inner{
            border: none;
        }
    }
}
</style>
