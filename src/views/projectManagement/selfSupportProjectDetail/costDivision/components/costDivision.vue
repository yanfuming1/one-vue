<template>
	<d2-container type="fulls" class="cost_division">
		<el-card class="box-card closeHeader">
			<div class="qqt-container-full-center___top">
				<qqt-flow-tabs :procInstId="procInstId">
					<template slot="content">
						<project-information-basic :transform="transform" :values="values" @projectCode="getProjectCode" />
						<div class="cost_division_table">
                            <add-table
                                :selectData="selectData"
                                :data="values.costOthers"
								:isShowElement="isShowElement"
                                ref="formDom"
                            ></add-table>
                        </div>
					</template>
				</qqt-flow-tabs>
			</div>
			<div class="qqt-container-full-content___button">
				<el-button
					type="warning"
					v-if="!transform.isShowDetails && procInstId !== ''"
					@click="isSendBack = true, values['flag'] = '1', submitCostDivisionData ()"
				>重新提交</el-button>
				<el-button
					type="primary"
					v-if="stutas == 'backlog'"
					@click="visible = true, values['flag'] = '1', title = '审批意见'"
				>同意</el-button>
				<el-button
					type="warning"
					v-if="stutas == 'backlog' && nodeData.operation.indexOf ('1') !== -1"
					@click="visible = isTurnManage = true, values['flag'] = '0', title = '转办意见'"
				>转办</el-button>
				<el-button
					type="success"
					v-if="stutas == 'backlog' && nodeData.operation.indexOf('2') != -1"
					@click="visible = isReject = true, values['flag'] = '2', title = '驳回意见'"
				>驳回</el-button>
				<el-button
					type="info"
					v-if="stutas == 'backlog' && nodeData.operation.indexOf('3') != -1"
					@click="visible = true, values['flag'] = '3', title = '作废意见'"
				>作废</el-button>
				<el-button
					type="warning"
					v-if="!transform.isShowDetails && procInstId === '' && isShowElement"
					@click="saveCostDivision"
				>保存</el-button>
				<el-button type="primary" v-if="!transform.isShowDetails && procInstId === '' && isShowElement" @click="values['flag'] = '1', submitCostDivisionData ()">提交</el-button>
				<el-button @click="closePageTag" v-if="!transform.isShowDetails && procInstId === ''">{{ isShowElement ? '关闭' : '编辑' }}</el-button>
			</div>
		</el-card>
		<qqt-send-process
			v-if="dialogVisible"
			:dialogVisible="dialogVisible"
			:processModuleId="processModuleId"
			:isSendBack="isSendBack"
			:prossValue="prossValue"
			@close="dialogVisible = false"
			@selectData="updataCostDivision"
		/>
		<qqt-consent
			:dialogVisible="visible"
			:msg="nodeData.msg"
			:taskId="$route.params.taskId || ''"
			:type="values['flag']"
			:isReject="isReject"
			:isTurnManage="isTurnManage"
			@close="consentCostDivision"
		/>
	</d2-container>
</template>

<script>
import {
	getCostDivisionById,
	editCostDivision,
	addCostDivision,
	submitCostDivision,
	completeCostDivision,
} from "@/api/selfProject/costDivision";
import {
	qqtSendProcess,
	qqtFlowTabs,
	qqtConsent,
	qqtRelateTable
} from "@/components/qqt-subassembly";
import { formGetJson } from "@/api/system/fromManagement/index";
import { getUserDepartById } from "@/api/system/depart/depart";
import { queryDicById} from '@/api/jointProject/index'
import { PROPRIETARYPROJECT } from "@/enum/FORMCODE";
import { getDetails } from "@/api/approval/common";
import { mapActions } from "vuex";

import addTable from "./addTable";
import util from "@/libs/util.js";
import projectInformationBasic from '../../operatingReserve/components/projectInformationBasic'
let than = this;
export default {
	data() {
		return {
			title: "",
			stutas: "",
			procInstId: "",
			remote: {},
			values: {
                costOthers: []
            },
			jsonData: {},
			nodeData: {
				operation: "",
				msg: ""
			},
			transform: {
				isShowDetails: false
			},
			prossValue: {
				title: ""
			},
			visible: false,
			isReject: false,
			isSendBack: false,
			isTurnManage: false,
			isShowElement: false,
			dialogVisible: false,
			processModuleId: PROPRIETARYPROJECT.COSTDIVISION,
			upLoadFileDefaultList: [],
			departmentList: [],
			selectData: {
				getName: [],
				getType: [],
				unitArr: []
			}
		};
	},

	methods: {
		...mapActions("d2admin/page", ["close"]),

		getFormByJson() {
			formGetJson({ code: this.processModuleId }).then(res => {
				if (res) this.jsonData = JSON.parse(res);
			});
		},

		getCostDivision(code) {
			getCostDivisionById({ 'projectCode': code }).then(res => {
				if (res) {
					Object.assign(this.values, res);
					this.prossValue.title = `自营项目成本发票占比分类:【 ${this.values.projectCode} 】`;
					this.fileDefaultNeaten(res);
				}
			});
		},

		saveCostDivision() {
			let url = "",
				boolean = {};
            this.$refs.formDom.getData().then(data => {
				if (data) {
					this.values.costOthers = data
					this.values.id == null
						? (url = addCostDivision)
						: (url = editCostDivision);
					url(this.values).then(res => {
						if (res.code === 200) {
							this.$message.success("保存成功");
							this.getCostDivision(this.values.projectCode);
						}
					});
				}
			});
		},

		submitCostDivisionData() {
			this.$refs.formDom.getData().then(data => {
				if (data) {
					this.values.costOthers = data
					this.dialogVisible = true;
					this.prossValue = {
						title: this.$route.params.title || `自营项目成本发票占比分类:【 ${this.values.projectCode} 】`,
						pdfId: this.$route.params.procDefId || "",
						degree: this.$route.params.degree || "",
						msg: ""
					};
				}
			});
		},

		updataCostDivision(item, boolean) {
			let url = "";
			this.dialogVisible = this.isSendBack = false;
			item["taskId"] = this.$route.params.taskId || "";
			this.values["completeTask"] = item;
			boolean ? (url = resetSubmitCostDivision) : (url = submitCostDivision);
			url(this.values).then(res => {
				if (res.code === 200) {
					this.$message.success(res.message);
					this.closePageTag();
				}
			});
		},

		consentCostDivision(item = "", boolean = false) {
			this.visible = this.isTurnManage = this.isReject = false;
			if (boolean) {
				this.closePageTag();
				return;
			}
			if (item) {
				this.values["completeTask"] = item;
				completeCostDivision(this.values).then(res => {
					if (res.code === 200) {
						this.$message.success(res.message);
						this.closePageTag();
					}
				});
			}
		},

		getSelect () {
			// 成本名称
			queryDicById({ id: "1187990620010328064" }).then(res => {
				this.getName = res;
				this.selectData["getName"] = res;
			});
			// 成本类别
			queryDicById({ id: "1187989758953271296" }).then(res => {
				this.getType = res;
				this.selectData["getType"] = res;
			});
			queryDicById({ id: "1188702706350960640" })
				.then(res => {
					this.unitArr = res;
					this.selectData["unitArr"] = res;
				})
		},

		getDetailsList(taskId) {
			getDetails(taskId).then(res => {
				if (res) this.nodeData = res;
			});
		},

        getProjectCode (projectCode) {
            this.values['projectCode'] = projectCode
            this.getCostDivision(projectCode);
        },

		upLoadFileCallBack(item) {
			this.values.fileList = item;
		},

		closePageTag () { this.isShowElement = !this.isShowElement },

		fileDefaultNeaten(res) {
			if (res.fileList && res.fileList.length > 0) {
				res.fileList.forEach(item => {
					let m = {
						status: "finished",
						response: {
							url: item.url,
							size: item.size,
							name: item.name
						}
					};
					this.upLoadFileDefaultList.push(m);
				});
			}
		},

		updataRouter() {
			if (this.$route.params) {
				this.transform = this.$route.params.transform || {};
				this.stutas = this.$route.params.pathName || "";
				this.procInstId = this.$route.params.procInstId || "";
			}
			if (this.$route.params && this.$route.params.taskId) {
				this.getDetailsList(this.$route.params.taskId);
			}
			if (this.$route.params && this.$route.params.relevancyId) {
				this.getCostDivision(this.$route.params.relevancyId);
			}
		}
	},

	created() {
        this.getSelect ()
	},

	mounted() {
		than = this;
	},

	components: {
        'project-information-basic': projectInformationBasic,
		"qqt-send-process": qqtSendProcess,
		"qqt-flow-tabs": qqtFlowTabs,
		"qqt-consent": qqtConsent,
		"add-table": addTable
	}
};
</script>
<style lang="scss">
    .cost_division {
        .cost_division_table {
            background: $color-head-bg;
            margin-left: 30px;
            padding: 10px;
        }
    }
</style>