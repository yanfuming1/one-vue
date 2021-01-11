  <template>
    <d2-container class="schedule-plan" type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <!-- <el-row> <project-info></project-info></el-row> -->
                <span class="qqt-container-full-header-operation___left">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="planAddFun('0')">新增顶级任务</el-button>
					<!-- <el-button type="primary" class="qqt-container-full-header-top___button" @click="">编辑</el-button> -->
					<!-- <el-button type="primary" class="qqt-container-full-header-top___button" @click="">删除</el-button> -->
					<el-button type="warning" class="qqt-container-full-header-top___button" @click="upOrDownGrade('up')">升级</el-button>
					<el-button type="warning" class="qqt-container-full-header-top___button" @click="upOrDownGrade('down')">降级</el-button>
					<el-button type="success" class="qqt-container-full-header-top___button" @click="upOrDownGrade('moveUp')">上移</el-button>
					<el-button type="success" class="qqt-container-full-header-top___button" @click="upOrDownGrade('moveDown')">下移</el-button>
                </span>
				<span class="qqt-container-full-header-operation___left">
					<span>时间刻度：</span>
					<el-select v-model="value" size="mini" placeholder="请选择" @change="timeChange">
						<el-option v-for="item in timeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</span>
            </div>
        </template>
        <div class="qqt-container-full___center self-safty">
		  <el-button type="text" class="closeBtn" @click="closePageTag"><i class="el-icon-close"></i></el-button>
			<div class="schedule-plan-title">
				<span class="left-item">进度计划编制</span>
				<el-button type="success" size="mini" v-if="showFromSegregationBtn" @click="fromProjectSegregation">从项目划分导入</el-button>
				<el-button type="warning" size="mini" @click="packageSubmit">打包提交</el-button>
				<el-button type="primary" size="mini" @click="upOrDownGrade('showSubInfo')">审批信息</el-button>
				<el-button type="primary" size="mini" @click="upOrDownGrade('showSubMap')">流程图</el-button>
			</div>
			<div class="schedule-plan-con">
				<split-pane split="vertical" @resize="resize">
					<template slot="paneL">
						<div class="plan-table">
							<gantt-table :taskData="taskData" :gradeColor="colors" @addChild="planAddFun" @delChild="delChild" @handleSelectionChange="handleSelectionChange"
								@showDetail="barClick" @editPlan="editPlan" ></gantt-table>
						</div>
					</template>
					<template slot="paneR">
						<div class="gantt-target"></div>
					</template>
				</split-pane>
			</div>	
        </div>
		<schedule-plan-add ref="form" :isChildren="isChildren" :taskData='taskData' :dialogVisible='planAddShow' :edit="edit" :planDetail='planDetail' :overallId='overallId'
			 :projectCode='projectCode' :title='planTitle' :transform='planTransform' @close="closeAdd"></schedule-plan-add>
		<up-down-grade :upDownShow='upDownShow' :parentList="parentList" @cancelShow="downGradeFun"></up-down-grade>
		<plan-sub-map :procInstId="procInstId" :dialogVisible="showMap" @cancel="showMap = false"></plan-sub-map>
		<show-sub-info :procInstId="procInstId" :dialogVisible="showInfo" @cancel="showInfo = false"></show-sub-info>
    </d2-container>
</template>
<script>
import { selfSchedulePlanList, selfSchedulePlanAllList, selfSchedulePlanQueryDetail, schedulePlanEditDrag, selfSchedulePlanOrderedList,
	schedulePlanUpgrade, schedulePlanDeleteBatch, schedulePlanListDemotion, schedulePlanDownGrade, schedulePlanShiftUp, schedulePlanShiftDown,
	schedulePlanInit,isChildren } from '@/api/selfProject/scheduleManagement/schedulePlan/index';
import { projectSegregationGetTree, projectModelList } from '@/api/selfProject/projectSegregation'
import { Gantt } from '@/assets/frappe-gantt/frappe-gantt.min';
import '@/assets/frappe-gantt/frappe-gantt.css';
import planSubMap from './components/planSubMap';
import showSubInfo from './components/showSubInfo';
import schedulePlanAdd from "./components/schedulePlanAdd";
import upDownGrade from './components/upDownGrade';
import projectInfo from '../../../components/commenInfo/projectInfo';
import ganttTable from './components/ganttTable';
import { mapState } from 'vuex';
import util from '@/libs/util.js';
import splitPane from 'vue-splitpane';
import Vue from 'vue';
let that = this
export default {
	components: {
		'project-info': projectInfo,
		'gantt-table': ganttTable,
		'schedule-plan-add': schedulePlanAdd,
		'up-down-grade': upDownGrade,
		'plan-sub-map': planSubMap,
		'show-sub-info': showSubInfo,
		splitPane,
    },
    data () {
        return {
			colors: [ '#8d43ad', '#42a1ff', '#2898b0', '#37373D', '#73C991', '#6B96AD' ],
			dynamicStyle: {},
            dialogVisible: false,
            addVisible: false,
            lastId: 17,
			isAdd: false,
			value: 'Month',
			timeOptions: [
				{ label: '天', value: 'Day' },
				{ label: '周', value: 'Week' },
				{ label: '月', value: 'Month' },
				{ label: '年', value: 'Year' },
			],
			num: 0,
			options: {
				on_click: function (task) {
					that.barClick(task)
				},
				on_date_change: function(task, start, end) {
					that.dateChange(task, start, end);
				},
				on_progress_change: function(task, progress) {
					that.progressChange(task, progress)
				},
				on_view_change: function(mode) {
					// console.log(mode)
				},
				on_dbl_click (task) {
					that.barClick(task)
				},
				bar_height: 30,
				header_height: 40,
				padding: 15,
				bar_corner_radius: 5,
				date_format: 'YYYY-MM-DD',
				view_mode: 'Day',
				language: 'zh'
			},
			tasks: [
				{
					start: '2020-5-01',
					end: '2020-5-01',
					name: 'Redesign website',
					id: "Task 0",
					progress: 0,
					color: {
						fill: '#8d43ad',
						enableAlpha: false,
					}
				}
			],
			gantt: {},
			planAddShow: false,
			planTitle: '新增计划',
			planTransform: {
				isShowDetails: false
			},
			overallId: '',
			projectCode: '',
			taskData: [],
			planDetail: {},
			edit: false,
			selectItem: [],
			upDownShow: false,
			parentList: [],
			showFromSegregationBtn: true,
			procInstId: '',
			showMap: false,
			showInfo: false,
			isChildren:false,
        }
    },

    methods: {
		closePageTag () {
			this.$router.go(-1)
		},
		upOrDownGrade(type) {
			if(this.selectItem.length !== 1) {
				this.$message.warning('选择一个任务进行操作!!!')
				return
			}
			if(this.selectItem[0].parentId === '0' && type === 'up') {
				this.$message.warning('选择的任务已经是顶级任务!!!')
				return
			}
			switch(type) {
				case 'up':
					this.upGrade ()
					break
				case 'down':
					this.downGrade ()
					break
				case 'showSubInfo':
					this.showSubInfo ()
					break
				case 'showSubMap':
					this.showSubMap ()
					break
				case 'moveUp':
				case 'moveDown':
					let url = type === 'moveUp' ? schedulePlanShiftUp : schedulePlanShiftDown
					url({ 'id': this.selectItem[0].id, 'projectCode': this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode }).then(res => {
						this.$message.success("操作成功!!!")
						this.getList ()
						this.updateTasks();
					})
					break
			}
		},
		upGrade () {
			schedulePlanUpgrade({
				'id': this.selectItem[0].id,
				'projectCode': this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode
			}).then(res => {
				this.$message.success('升级成功!!!')
				this.getList()
			})
		},
		downGrade () {
			schedulePlanListDemotion({id: this.selectItem[0].id}).then(res => {
				if (res.length === 0) { this.$message.warning('此任务没有同级别的任务，不能降级!!!'); return }
				this.parentList = res
				this.upDownShow = true
			})
		},
		downGradeFun (item) {
			if (item) {
				schedulePlanDownGrade({
					...item, 
					'id': this.selectItem[0].id,
					'projectCode': this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode
				}).then(res => {
					this.$message.success('操作成功!!!')
					this.getList ()
				})
			}
			this.upDownShow = false
		},

		showSubInfo () {
			if (this.selectItem[0].schedulePlanFlow.procState === '1') {
				this.$message.warning("该任务未提交，没有审批信息!!!")
				return 
			}
			this.procInstId = this.selectItem[0].schedulePlanFlow.procInstId
			this.showInfo = true
		},

		showSubMap () {
			if (this.selectItem[0].schedulePlanFlow.procState === '1') {
				this.$message.warning("该任务未提交，不能查看流程图!!!")
				return 
			}
			this.procInstId = this.selectItem[0].schedulePlanFlow.procInstId
			this.showMap = true
		},

		delChild (item) {
			if(item.procState !== '初始化') {
				this.$message.warning('已经提交流程的不可删除!!!')
				return
			}
			let hasChild = false
			this.taskData.forEach(temData => {
				if(temData.parentId === item.id) { hasChild = true }
			})
			if(hasChild){
				this.$message.warning('含有子任务的不可删除!!!')
				return
			}
			util.confirm('确定删除这项任务吗？').then(valid => {
				if (valid) {
					this.deletFun(item.id)
				}
			})
		},

		packageSubmit() {
			if(this.selectItem.length === 0) {
				this.$message.warning('选择一个任务进行提交!!!')
				return
			}
			this.$router.push ({
                path: 'subSchedulePlanList',
                name: 'subSchedulePlanList',
                params: {
					add: true,
					planList: this.selectItem,
					projectCode: this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode
                }
            })
            this.$store.commit ('d2admin/page/titleSet', '提交任务计划')
		},

		deletFun (ids) {
			schedulePlanDeleteBatch({
				'ids': ids,
				'projectCode': this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode
			}).then(res => {
				this.$message.success('删除成功!!!')
				this.getList()
			})
		},

		fromProjectSegregation () {
			if(this.tasks.length > 0) {
				this.$message.warning("已经含有其他任务,不能从项目划分导入!!!")
				return
			}
			schedulePlanInit ({ 'overallId' : this.overallId}).then(res => {
				this.getList ()
			})
		},

		planAddFun (parentId) {
			this.planTitle = '新增计划'
			this.$refs.form.values.planStartDate = '';
			this.$refs.form.values.planEndDate = '';
			this.planDetail.planStartDate = '';
			this.planDetail.planEndDate = '';
			this.planDetail = {parentId: parentId};
			this.planAddShow = true
			this.edit = false
			this.isChildren = true;
			this.planTransform.isShowDetails = false
		},

		closeAdd () {
			this.planDetail = {};
			this.planAddShow = false
			this.getList ()
		},

		resize() {
			// console.log('resize')
		},

		timeChange (value) {
			this.gantt.change_view_mode(value)
		},

		barClick (task) {
			selfSchedulePlanQueryDetail({'id': task}).then(res => {
				this.planDetail = res
				this.planTitle = "计划详情"
				this.planAddShow = true
				this.planTransform.isShowDetails = true
			})
		},

		editPlan (task) {
			selfSchedulePlanQueryDetail({'id': task}).then(res => {
				this.planDetail = res
				this.planTitle = "编辑计划"
				this.edit = true
				this.planTransform.isShowDetails = false
				this.planAddShow = true
			})
			isChildren ({'id':task}).then(res=>{
				this.isChildren = res;
			})
		},

		handleSelectionChange (val) {
			this.selectItem = val
		},

		progressChange (task, progress) {
			console.log(progress)
		},

		dateChange (task, start, end) {
			let startTem = new Date(start).format('yyyy-MM-dd')
			let endTem = new Date(end).format('yyyy-MM-dd')
			let planLimitTem = util.dateDiff(endTem, startTem)
			schedulePlanEditDrag ({ 
				'id': task.id,
				'planEndDate': endTem,
				'planStartDate': startTem,
				'planLimit': planLimitTem,
				'projectCode': this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode
			}).then(res => {
				if(res) { this.getList() }
			})
		},

        updateTasks () {
            this.gantt.refresh(this.tasks);
		},
		
		transDataToTask (data) {
			let taskList = []
			data.forEach(item => {
				let tem = {
					start: item.planStartDate,
					end: item.planEndDate,
					name: item.name,
					id: item.id,
					progress: item.donePercent ? parseInt(item.donePercent) : 0,
					color: {
						fill: this.colors[parseInt(item.rankNumber-1)],
						enableAlpha: false,
					}
				}
				taskList.push(tem)
			})
			this.tasks = taskList
		},

        getList() {
			selfSchedulePlanOrderedList({ 'overallId': this.overallId }).then(res => {
				if(res.length > 0) { this.showFromSegregationBtn = false }
				res.forEach(item => {
					item.procState = item.schedulePlanFlow ? util.handleState(item.schedulePlanFlow.procState) : '无'
					item.agent = item.schedulePlanFlow ? item.schedulePlanFlow.agent : '无'
				});
				this.taskData = res
				this.transDataToTask(JSON.parse(JSON.stringify(res)))
			})
		},
    },

    mounted () {
		this.gantt = new Gantt(".gantt-target", this.tasks, this.options);
		this.getList()
	
    },

    created () {
		that = this
		this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
		this.overallId = this.$route.params.relevancyId
		this.projectCode = this.$store.state.d2admin.selfSupportProject.selfSupportProject.projectCode;
    },
    
    watch: {
        selfSupportProject () { 
			this.getList ()
		 },
        tasks (val) {
			if (val.length !== 0) {
            	this.updateTasks();
			} 
        }
    },

    computed: {
        ...mapState ('d2admin/selfSupportProject', [
            'selfSupportProject'
        ])
    },
}
</script>
<style lang="scss">
.self-safty{
    height: 100% !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
.schedule-plan {
	.qqt-container-full__header { padding: 10px 10px 0px !important; }
	.qqt-container-full__body{
		padding: 10px !important;
	}
	.self-project{
		margin-bottom: 10px !important;
	}
	.schedule-plan-title{
		height: 50px;
		background: #FAFBFF;
		border-bottom: 1px dashed #DDD;
		padding-top: 15px;
		padding-left: 30px;
		.left-item{
			margin-right: 25px;
			position: relative;
			color: #409EFF;  
			&::before{
				content: "";
				width: 2px;
				height: 100%;
				background: #409EFF;
				position: absolute;
				left: -8px;
				top: 0px;
			}
		}
		.el-button{
			padding: 3px 6px;
		}
	}
	.schedule-plan-con{
		height: calc(100% - 50px);
		.gantt-target{}
		.gantt-container{ height: 100%; }
		// .plan-table {
			// height: 100%;
		// }
	}
	.closeBtn{
        position: absolute;
        right: 10px;
        padding: 7px 7px 13px 13px !important;
        font-size: 20px;
        color: #505050;
        border-radius: 0;
        background-color: rgba(14,144,254,.17);
        border-bottom-left-radius: 90%;
        z-index: 9999999;
    }
}
</style>
