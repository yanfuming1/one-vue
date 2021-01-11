<template>
    <div id="data-view">
        <dv-full-screen-container>
			<div class="center-title">{{ this.selfSupportProject.projectName }}</div>
            <div id="top-header">
                <dv-decoration-8 class="header-left-decoration" />
                <dv-decoration-5 class="header-center-decoration"> </dv-decoration-5>
                <dv-decoration-8 class="header-right-decoration" :reverse="true" />
                <el-button type="primary" size="mini" @click="closePageTag">返回</el-button>
            </div>

            <dv-border-box-1 class="main-container">
                <div class="left-chart-container">
                    <div class="data_conent_left_one">
						<p>合同造价</p>
						<div class="total_contract">
							<dv-digital-flop :config="totalContract"/>
						</div>
						<p>结算总价</p>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="settlementRice"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="contractRate"/>
							</div>
						</div>
					</div>

					<div class="data_conent_left_one">
						<p>总收入</p>
						<div class="total_contract">
							<dv-digital-flop :config="generalIncome" />
						</div>
						<p>已收</p>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="received"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="receivedProportion"/>
							</div>
						</div>
                        <p>待收</p>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="dueIn"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="proportionCollected"/>
							</div>
						</div>
					</div>
					<div class="data_conent_left_one">
						<p>工程款收入</p>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="projectRevenue"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="ProportionprojectRevenue"/>
							</div>
						</div>
						<p>已收</p>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="projectReceived"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="projectReceivedProportion"/>
							</div>
						</div>
                        <p>待收</p>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="projectDueIn"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="projectProportionCollected"/>
							</div>
						</div>
					</div>
                </div>
                
                <div class="right-main-container">
                    <dv-border-box-12 class="rmctc-left-container">
                         <dv-charts :option="option" />
                    </dv-border-box-12>

                    <div class="rmc-bottom-container">
						<div class="rmc_bottom_container_top">
							<div class="data_conent_top">
								<p>品牌利润</p>
								<div class="earned_profit">
									<dv-digital-flop :config="operateProfit"/>
								</div>
								<div class="earned_profit_cost_con">
									<div class="earned_profit_cost">
										<dv-digital-flop :config="percentOperateProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentOperateProfitClose"/>
									</div>
								</div>
							</div>
							<div class="data_conent_top">
								<p>结算利润</p>
								<div class="earned_profit">
									<dv-digital-flop :config="closeProfit"/>
								</div>
								<div class="earned_profit_cost_con">
									<div class="earned_profit_cost">
										<dv-digital-flop :config="percentCloseProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentCloseProfitClose"/>
									</div>
								</div>
							</div>
						</div>

						<div class="rmc_bottom_container_top">
							<div class="data_conent_top">
								<p>管理利润</p>
								<div class="earned_profit">
									<dv-digital-flop :config="manageProfit"/>
								</div>
								<div class="earned_profit_cost_con">
									<div class="earned_profit_cost">
										<dv-digital-flop :config="percentManageProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentManageProfitClose"/>
									</div>
								</div>
							</div>
							<div class="data_conent_top">
								<p>总利润</p>
								<div class="earned_profit">
									<dv-digital-flop :config="sumProfit"/>
								</div>
								<div class="earned_profit_cost_con">
									<div class="earned_profit_cost">
										<dv-digital-flop :config="percentSumProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentSumProfitClose"/>
									</div>
								</div>
							</div>
						</div>

						<div class="rmc_bottom_container_top">
							<div class="data_conent_top">
								<p>可支配利润</p>
								<div class="earned_profit">
									<dv-digital-flop :config="governableProfit"/>
								</div>
								<div class="earned_profit_cost_con">
									<div class="earned_profit_cost">
										<dv-digital-flop :config="percentGovernableProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentGovernableProfitClose"/>
									</div>
								</div>
							</div>
							<div class="data_conent_top">
								<p>可支配资金</p>
								<div class="earned_profit">
									<dv-digital-flop :config="governableFund"/>
								</div>
								<div class="earned_profit_cost_con">
									<div class="earned_profit_cost">
										<dv-digital-flop/>
									</div>
									<div class="proportion">
										<dv-digital-flop/>
									</div>
								</div>
							</div>
						</div>

						<!-- <div class="rmc_bottom_container_bottom"> -->
							<!-- <div class="data_conent_bottom">
								<p>管理利润</p>
								<div class="management_profit">
									<dv-digital-flop :config="manageProfit"/>
								</div>
								<div class="management_profit-con">
									<div>
										<dv-digital-flop :config="percentManageProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentManageProfitClose"/>
									</div>
								</div>
							</div> -->
							<!-- <div class="data_conent_bottom">
								<p>总利润</p>
								<div class="management_profit">
									<dv-digital-flop :config="sumProfit"/>
								</div>
								<div class="management_profit-con">
									<div>
										<dv-digital-flop :config="percentSumProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentSumProfitClose"/>
									</div>
								</div>
							</div> -->
							<!-- <div class="data_conent_bottom">
								<p>可支配利润</p>
								<div class="management_profit">
									<dv-digital-flop :config="governableProfit"/>
								</div>
								<div class="management_profit-con">
									<div>
										<dv-digital-flop :config="percentGovernableProfitContract"/>
									</div>
									<div class="proportion">
										<dv-digital-flop :config="percentGovernableProfitClose"/>
									</div>
								</div>
							</div>
						</div> -->
                    </div>
                </div>

                <div class="rmctc-right-container">
                    <div class="data_conent_left_one">
						<p>责任成本</p>
						<div class="total_contract">
							<dv-digital-flop :config="responsibility"/>
						</div>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="responsibilityCost"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="totalLiability"/>
							</div>
						</div>
					</div>
					<div class="data_conent_left_one">
						<p>目标成本</p>
						<div class="total_contract">
							<dv-digital-flop :config="target"/>
						</div>
						<div class="settlement_rice">
							<div>
								<dv-digital-flop :config="targetCost"/>
							</div>
							<div class="proportion">
								<dv-digital-flop :config="totalTargetCost"/>
							</div>
						</div>
					</div>
					<div class="data_conent_left_one">
						<div class="data_conent_left_one">
							<p>实际成本</p>
							<div class="total_contract">
								<dv-digital-flop :config="actual" />
							</div>
							<div class="settlement_rice">
								<div>
									<dv-digital-flop :config="actualCost"/>
								</div>
								<div class="proportion">
									<dv-digital-flop :config="totalActualCost"/>
								</div>
							</div>
							<p>已支付</p>
							<div class="settlement_rice">
								<div>
									<dv-digital-flop :config="havePaid"/>
								</div>
								<div class="proportion">
									<dv-digital-flop :config="paidProportion"/>
								</div>
							</div>
							<p>待支付</p>
							<div class="settlement_rice">
								<div>
									<dv-digital-flop :config="unpaid"/>
								</div>
								<div class="proportion">
									<dv-digital-flop :config="unpaidProportion"/>
								</div>
							</div>
						</div>
					</div>
					<div class="data_conent_left_one">
						<div class="whether_profit">
							<p> 经济核算结果： </p>
							<h3 :class="{'resultColor': isProfit,  'resultColorRed': !isProfit, }"> {{ isProfit ? '盈利' : '亏损' }} {{ calculationResults }} 元</h3>
						</div>
					</div>
                </div>
            </dv-border-box-1>
        </dv-full-screen-container>
    </div>
</template>

<script>
import { mapState,mapActions } from 'vuex'
import { projectKanBan, histogramKanBan } from '@/api/selfProject/economicCalculation/profitCalculation'
import util from '../../../../../../libs/util'
export default {
	data () {
		let that = this;
		return {
			calculationResults: '',
			isProfit: '',
			totalContract: {
				content: '{nt}',
				style: {
					fontSize: 56,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			settlementRice: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#7747ff'
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			contractRate: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200',
				},
				toFixed: 1
			},
			generalIncome: {
				content: '{nt}',
				style: {
					fontSize: 56,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			received: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#7747ff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			receivedProportion: {
				content: '占总收入：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			dueIn: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#ff4c76',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(res)
				}
			},
			proportionCollected: {
				content: '占总收入：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			projectRevenue: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			ProportionprojectRevenue: {
				content: '占总收入：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			projectReceived: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#ff4c76',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			projectReceivedProportion: {
				content: '占：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			projectDueIn: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#ff4c76',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			projectProportionCollected: {
				content: '占：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			responsibility: {
				content: '{nt}',
				style: {
					fontSize: 56,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			responsibilityCost: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#7747ff'
				},
				toFixed: 1
			},
			totalLiability: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ff4c76'
				},
				toFixed: 1
			},
			target: {
				content: '{nt}',
				style: {
					fontSize: 56,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			targetCost: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ff4c76'
				},
				toFixed: 1
			},
			totalTargetCost: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#7747ff'
				},
				toFixed: 1
			},
			actual: {
				content: '{nt}',
				style: {
					fontSize: 56,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			actualCost: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#7747ff'
				},
				toFixed: 1
			},
			totalActualCost: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ff4c76'
				},
				toFixed: 1
			},
			havePaid: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#ffa200',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			paidProportion: {
				content: '占：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			unpaid: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#ffa200',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			unpaidProportion:{
				content: '占：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			operateProfit: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			percentOperateProfitContract:{
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			percentOperateProfitClose: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			closeProfit: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			percentCloseProfitContract: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			percentCloseProfitClose: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			manageProfit: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			percentManageProfitContract: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			percentManageProfitClose: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			sumProfit: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			percentSumProfitContract: {
				content: '占合同造价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			percentSumProfitClose: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			governableProfit: {
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			percentGovernableProfitContract: {
				content: '占合同总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			percentGovernableProfitClose: {
				content: '占结算总价：{nt}%',
				style: {
					fontSize: 20,
					fill: '#ffa200'
				},
				toFixed: 1
			},
			governableFund:{
				content: '{nt}',
				style: {
					fontSize: 32,
					fill: '#00ccff',
				},
				toFixed: 2,
				formatter:(res)=>{
					return util.moneySepFormat(Number(res))
				}
			},
			option: {
				title: {
					text: '利润核算',
					style: {
						fontSize: 26,
						fill: '#fff'
					}
				},
				xAxis: {
					name: '名称',
					data: ['合同造价', '结算总价', '总收入',  "	已收", "待收	", '工程款收入', "	已收", "待收	", '责任成本',  "	目标成本	", '实际成本',   "已支付", "待支付	", '品牌利润', '管理利润', '结算利润', "	可支配利润	", "	可支配资金	", '总利润'],
					nameTextStyle: {
						fill: '#65c6e7',
						fontSize: 16
					},
					axisLine: {
						style: {
							stroke: '#00ccff',
							lineWidth: 1
						}
					},
					axisLabel: {
						style: {
							fill: '#00ccff',
							fontSize: 14,
							rotate: 36,
							textAlign: 'left',
							textBaseline: 'top'
						}
					},
					axisTick: {
						style: {
							stroke: '#00ccff',
							lineWidth: 1
						}
					},
					splitLine: {
						style: {
							stroke: '#00ccff',
							lineWidth: 100
						}
					}
				},
				yAxis: {
					name: '(万元)',
					data: 'value',
					nameTextStyle: {
						fill: '#65c6e7',
						fontSize: 12
					},
					axisLine: {
						style: {
							stroke: '#00ccff',
							lineWidth: 1
						}
					},
					axisLabel: {
						style: {
							fill: '#00ccff',
							fontSize: 10,
							rotate: 0
						}
					},
					axisTick: {
						style: {
							stroke: '#00ccff',
							lineWidth: 1
						}
					}
				},
				series: [
					{
						data: [],
						type: 'bar',
						independentColor: {
							color: ['#14c6ca', '#B558F6', '#3F70EA', '#E3B105', '#DA6D75', '#000','#37a2da', '#67e0e3', '#000', '#000']
						}
					}
				],
				
			}
		}
  	},

    methods: {
		formatter () {},

        closePageTag () {
            let tagName = this.$route.path
            let path = ``
            this.stutas ? path = `/approval/${this.stutas}` : path = this.$router.go(-1)
            this.close ({ tagName, path })
        },

        ...mapActions('d2admin/page', [
            'close',
        ]),
		
		getProjectKanBanData () {
			projectKanBan ({ 'projectCode': this.selfSupportProject.projectCode }).then (res => {
				// this.$set("改变的对象"，"改变的对象属性"，"值")
				// 合同造价
				this.$set(this.totalContract,'number',[res.contractTotal])
				// this.totalContract.formatter(res.contractTotal)

				this.$set(this.settlementRice,'number',[res.closeTotal])
				this.$set(this.contractRate,'number',[res.percentCloseTotal])

				// 收入
				this.$set(this.generalIncome,'number',[res.incomeTotal])
				this.$set(this.received,'number',[res.incomeAlready])
				this.$set(this.receivedProportion,'number',[res.percentIncomeAlready])
				this.$set(this.dueIn,'number',[res.incomeAwait])
				this.$set(this.proportionCollected,'number',[res.percentIncomeAwait])

				// 工程款收入
				this.$set(this.projectRevenue,'number',[res.projectFundsTotal])
				this.$set(this.ProportionprojectRevenue,'number',[res.percentProjectFundsTotal])
				this.$set(this.projectReceived,'number',[res.projectFundsReceived])
				this.$set(this.projectReceivedProportion,'number',[res.percentProjectFundsReceived])
				this.$set(this.projectDueIn,'number',[res.projectFundsAwait])
				this.$set(this.projectProportionCollected,'number',[res.percentProjectFundsAwait])

				// 责任成本
				this.$set(this.responsibility,'number',[res.dutyCost])
				this.$set(this.responsibilityCost,'number',[res.percentDutyCostContract])
				this.$set(this.totalLiability,'number',[res.percentDutyCostClose])

				// 目标成本
				this.$set(this.target,'number',[res.targetCost])
				this.$set(this.targetCost,'number',[res.percentTargetCostContract])
				this.$set(this.totalTargetCost,'number',[res.percentTargetCostClose])

				// 实际成本
				this.$set(this.actual,'number',[res.realityTotal])
				this.$set(this.actualCost,'number',[res.percentRealityTotalContract])
				this.$set(this.totalActualCost,'number',[res.percentRealityTotalClose])

				// 已支付
				this.$set(this.havePaid,'number',[res.realityAlready])
				this.$set(this.paidProportion,'number',[res.percentRealityAlready])

				// 待支付
				this.$set(this.unpaid,'number',[res.realityAwait])
				this.$set(this.unpaidProportion,'number',[res.percentRealityAwait])

				// 经营利润
				this.$set(this.operateProfit,'number',[res.operateProfit])
				this.$set(this.percentOperateProfitContract,'number',[res.percentOperateProfitContract])
				this.$set(this.percentOperateProfitClose,'number',[res.percentOperateProfitClose])

				// 结算利润
				this.$set(this.closeProfit,'number',[res.closeProfit])
				this.$set(this.percentCloseProfitContract,'number',[res.percentCloseProfitContract])
				this.$set(this.percentCloseProfitClose,'number',[res.percentCloseProfitClose])
				
				// 管理利润
				this.$set(this.manageProfit,'number',[res.manageProfit])
				this.$set(this.percentManageProfitContract,'number',[res.percentManageProfitContract])
				this.$set(this.percentManageProfitClose,'number',[res.percentManageProfitClose])

				// 总利润
				this.$set(this.sumProfit,'number',[res.sumProfit])
				this.$set(this.percentSumProfitContract,'number',[res.percentSumProfitContract])
				this.$set(this.percentSumProfitClose,'number',[res.percentSumProfitClose])

				// 可支付利润
				this.$set(this.governableProfit,'number',[res.governableProfit])
				this.$set(this.percentGovernableProfitContract,'number',[res.percentGovernableProfitContract])
				this.$set(this.percentGovernableProfitClose,'number',[res.percentGovernableProfitClose])

				this.$set(this.governableFund,'number',[res.governableFund])

				// 柱状图
				// '合同造价', '结算总价', '总收入', '工程款收入', '责任成本', '实际成本', '经营利润', '管理利润', '结算利润', '总利润'
				// console.log(res, '柱状图数据')
				// ['合同造价', '结算总价', '总收入',  "	已收", "待收	", '工程款收入', "	已收", "待收	", '责任成本',  "	目标成本	", '实际成本',   "	已收", "待收	", '经营利润', '管理利润', '结算利润', "	可支配利润	", "	可支配资金	", '总利润'
				this.option.series[0].data = [ res.contractTotal, res.closeTotal, res.incomeTotal, res.incomeAlready, res.incomeAwait,
					res.projectFundsTotal, res.projectFundsReceived, res.projectFundsAwait, res.dutyCost, res.targetCost, 
						res.realityTotal, res.realityAlready, res.realityAwait, res.operateProfit, res.manageProfit, res.closeProfit, res.governableProfit, 
						// 缺少可支配资金
						res.governableFund, res.sumProfit ]
				this.option = { ...this.option }

				// 经济核算结果
				this.isProfit = res.sumProfit >= 0 ?  true : false

				this.calculationResults = util.moneySepFormat(Math.abs(res.sumProfit))
			})
		},

		// getHistogramKanBan () {
		// 	histogramKanBan({ 'projectCode': this.selfSupportProject.projectCode }).then( res => {
		// 		console.log(res, '自营项目 - 利润核算-金额历史变动柱状图')
		// 	})
		// }
	},
	
	created() {
		this.$store.dispatch ('d2admin/selfSupportProject/selfSupportProjectInformationLoad')
	},

	computed: {
		...mapState ('d2admin/selfSupportProject', [
			'selfSupportProject'
		])
	},

	watch: {
		selfSupportProject () {
				this.getProjectKanBanData ()
				// this.getHistogramKanBan ()
			}
		},
}
</script>

<style lang="scss">
#data-view {
	width: 100%;
	height: 100%;
	background-color: #030409;
	color: #fff;

	.center-title {
		color: #00ccff;
		font-size: 22px;
		font-weight: 600;
		text-align: center;
		margin: 22px 0 -32px -110px;
	}

    #dv-full-screen-container {
        background-image: url('../../../../../../assets/image/profitCalculationBg.png');
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
    }
    #top-header {
        position: relative;
        width: 100%;
        height: 76px;
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;

        .header-center-decoration {
            width: 40%;
            height: 60px;
            margin-top: 30px;
        }

        .header-left-decoration, .header-right-decoration {
            width: 25%;
            height: 60px;
        }

        

        .el-button--primary {
            height: 36px;
            margin: 12px;
            width: 56px;
        }
    }

    .main-container {

        .border-box-content {
            padding: 16px 0;
            box-sizing: border-box;
            display: flex;
        }
    }

		.left-chart-container {
			width: 23%;
			padding: 0 16px;
			margin: 0 16px;
			background-color: rgba(34, 40, 74, 0.56);
			
			.data_conent_left_one {
				border-bottom:1px dashed #00ccff;
				margin-top: 22px;
				p {
					font-size: 20px;
					color: #d5d6d8;
					text-align: left;
				}
				.total_contract {
					height: 130px;
					margin-top: -55px;
				}
				.settlement_rice {
					display: flex;
					height: 76px;
					.proportion {
						margin-top: -10px;
					}
				}
				.general_income {
					height: 125px;
					margin-top: -55px;
				}
			}
			.dv-scroll-ranking-board {
				flex: 1;
			}
		}

		.right-main-container {
			
			width: 50%;
			padding-left: 5px;
			box-sizing: border-box;
			
			.dv-border-box-12 {
				height: 52%;
			}
		}

	.rmctc-right-container {
		width: 23%;
		padding: 0 16px;
		margin: 0 16px;
		background-color: rgba(34, 40, 74, 0.56);
		.data_conent_left_one {
			border-bottom:1px dashed #00ccff;
			margin-top: 22px;
		}
		p {
			font-size: 20px;
			color: #d5d6d8;
			text-align: left;
		}
		h2 {
			font-size: 56px;
			color: #00ccff;
		}
		.total_contract {
			height: 110px;
			margin-top: -55px;
		}
		.settlement_rice {
			display: flex;
			height: 72px;
			margin-top: -12px;
			.proportion {
				margin-top: -10px;
			}
		}
		.general_income {
			height: 125px;
			margin-top: -55px;
		}
		.whether_profit {
			width: 410px;
			height: 220px;
			background-color: rgba(0, 204, 205, 0.16);
			padding: 22px 0 22px 22px;
			border-radius: 12px;
			p {
				font-size: 20px;
				font-weight: 600;
				color: #ffffff;
			}
			h2 {
				text-align: center;
				line-height: 160px;
				font-size: 32px;
			}
			h3 {
				text-align: center;
				line-height: 160px;
				font-size: 32px;
			}
			.resultColor {
				color: #00ccff
			}
			.resultColorRed {
				color: #EB2704
			}
		}
	}
	.rmc-bottom-container {
		height: 45%;
		margin-top: 12px; 
		padding: 16px 0 0 16px;
		background-color: rgba(13, 25, 57, 0.54);
		border-radius: 6px;
		p {
			font-size: 20px;
			text-align: center;
		}
		.rmc_bottom_container_top {
			display: flex;
			margin-bottom: -22px;
			.data_conent_top {
				.earned_profit {
					height: 89px;
    				margin-top: -89px;
				}
				.earned_profit_cost_con {
					display: flex;
				}
			}   
		}
		// .rmc_bottom_container_bottom {
		// 	display: flex;
		// 	margin-top: -12px;
		// }
		// .data_conent_bottom {
		// 	.management_profit {
		// 		height: 86px;
		// 		margin: -46px 0 0 -36px;
		// 	}
		// 	.management_profit-con {
		// 		display: flex;
		// 	}
		// }
    }
}
</style>