
<template>
    <div style="padding:10px 20px 20px 20px;" class="voucher" v-show="false">
		<div ref="printTable" style="width:18cm;margin: 0 auto;">
            <div v-for="(itemList,listIndex) in realList" :key="listIndex" style="page-break-after:always">
                <el-row style="margin-top:25px">
                    <el-col :span="24">
                        <el-col :span="8" style="height:30px" :offset="8"><h2 style="text-align:center;margin:0">记账凭证</h2></el-col>
                        <el-col :span="8"  style="height:30px">
                            <div style="display:inline-block;float:right;font-size:14px;height:30px;line-height:45px">
                                附单据数：{{doc}}
                            </div>
                        </el-col>
                    </el-col>
                </el-row>
				
                <el-row  style="margin: 15px auto 0;height:35px;line-height:35px">
                    <el-col :span="10" style="font-size:14px;">
                        <span style="display:block;width:100%;text-overflow: ellipsis;white-space: nowrap;overflow:heiiden;text-align: left;overflow: hidden;">单位: <span style="font-weight:700">{{infoMessageData.unit}}</span></span>
                    </el-col>
                    <el-col :span="6" style="text-align: left;font-size:14px;">
                        日期：{{infoMessageData.inputtime}}
                    </el-col>
                    <el-col :span="8" style="font-size:14px;text-align: right;">
                        凭证编号: {{infoMessageData.accounting}}
                    </el-col>
                </el-row>
                <table class="table"  cellspacing="0" cellpadding="0" style="width:100%">
                    <thead>
                        <tr style="height:45px;line-height:45px;background-color: #ebf1f6;">
                            <th style="width:30%">摘要</th>
                            <th style="width:30%">会计科目</th>
                            <th style="width:20%">借方金额</th>
                            <th style="width:20%">贷方金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr  v-for="(item, index) in itemList" :key="index">
                            <td style="height:45px;line-height:45px;">
                                <div :style="{'line-height':item.line1.length > 15 ? '18px' : '45px'}" style="width:100%;height:100%;font-size:13px;text-align:left;padding-left:5px">
									{{item.line1}}
								</div>
                            </td>
                            <td style="height:45px;line-height:45px;;text-align:left;padding-left:5px" class="selectClass">
                                {{item.line2}}
                            </td>
                            <td style="height:45px;line-height:45px;text-align:right;padding-right:5px"  class="inputCol">
                                {{moneyTransform(item.line3Value)}}
                            </td>
                            <td style="height:45px;line-height:45px;text-align:right;padding-right:5px"  class="inputCol">
                                {{moneyTransform(item.line4Value)}}
                            </td>
                        </tr>

                        <tr style="height:41px;line-height:41px;background-color: #ebf1f6;border-bottom:1px solid #474747">
                            <td colspan="2" style="text-align:left;padding-left:20px">合计: <span >{{moneyCapital(infoMessageData.totalValue)}}</span></td>
                            <td style="text-align:right;"><div style="padding-right:5px">{{moneyTransform(infoMessageData.totalValue)}}</div></td>
                            <td style="text-align:right;"><div style="padding-right:5px">{{moneyTransform(infoMessageData.total2Value)}}</div></td>
                        </tr>
                    </tbody>
                </table>
                <el-row  style="margin-top:20px">
                    <el-col :span="5" style="padding-right:5px">
                        <div class="colBox">
                            <span>记账：</span>
                            {{infoMessageData.fnancemanager}}
                        </div>
                    </el-col>
                    <el-col :span="6" style="padding-right:5px">
                        <div  class="colBox">
                            <span>审核：</span>
                            {{infoMessageData.bookkeeping}}
                        </div>
                    </el-col>
                    <el-col :span="6" style="padding-right:5px">
                        <div  class="colBox">
                            <span>出纳：</span>
                            {{infoMessageData.review}}
                        </div>
                    </el-col>
                    <el-col :span="5" >
                        <div  class="colBox">
                            <span>制单：</span>
                            {{infoMessageData.dobill}}
                        </div>
                    </el-col>
                    <el-col :span="2" >
                        <div class="colBox">
                            {{listIndex + 1}} / {{realList.length}}
                        </div>
                    </el-col>
                </el-row>
            </div>
		</div>
		<el-dialog title="打印设置" :append-to-body="true" :visible.sync="printSetShow" width="400px">
			<el-form :rules="rules" ref="ruleForm" :model="printForm">
				<el-form-item label="打印模板" label-width="100">
					<el-select v-model="printForm.size"  prop="size">
						<el-option
							v-for="item in printParam"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="$emit('printSetCancel')">取 消</el-button>
				<el-button type="primary" @click="printSetConfirm">确 定</el-button>
			</div>
		</el-dialog>
        <!-- <el-button type="primary" size="small" @click="printData">打印</el-button> -->
    </div>
</template>

<script>
import {listSubject,goAdd,confGetById} from '../../../../api/financialManagement/voucher/index';
import util from '@/libs/util.js'
export default {
	props: {
		printData: {
			type: Array,
		},
		infoMessage: {
			type: Object,
		},
		printModelShow: {
			type: Boolean,
		},
	},
	data() {
		return {
			printForm: {
				size: '120,210',
			},
			printShow: false,
			printSetShow: false,
			printParam: [
				{
					value: '297,210',
          			label: 'A4宽白纸(297mm×210mm)'
				},
				{
					value: '148,210',
          			label: 'A5宽白纸(148mm×210mm)'
				},
				{
					value: '120,210',
          			label: '专业凭证纸(120mm×210mm)'
				},
			],
			rules: {
				size: [
					{ required: true, message: '请选择打印的纸张尺寸', trigger: ['change','blur'] }
				],
			},
			unit:'',
			doc:'5',
			dobill: '',
			accounting: '',
			inputtime: '2020-03-26',
			fnancemanager: '',
			bookkeeping: '',
			review: '',
			total: '',
			total2: '',
			totalValue: '',
			total2Value: '',
			dataList: [],
			infoMessageData: {}
		};
    },
    mounted () {
		// this.getSelectList();
		// confGetById ({id:'1196963121869107200'}).then(res=> {
		// 	this.unit = res.value;
		// })
		// 
		// this.getCode();
		// this.inputtime = new Date().format('yyyy-MM-dd');
    },
    computed: {
        realList () {
            let realList = [];
            let sliceData = this.dataList.splice(0,5);
            while (sliceData.length > 0) {
                realList.push(sliceData);
                sliceData = this.dataList.splice(0,5);
            }
            for (let i = 0; i < realList.length; i++) {
                while (realList[i].length < 5) {
                    let obj = {
                        line1: "",
                        line2: "",
                        line3: "",
                        line4: "",
                        line2Value: "",
                        line3Value: "",
                        line4Value: "",
                        line1Edit: false,
                        line2Edit: false,
                        isEdit: false,
                        isEdit2: false
                    }
                    realList[i].push(obj);
                }
            }
            return realList;
        }
    },
	methods: {
		printSetConfirm () {
			this.$refs['ruleForm'].validate((valid) => {
				if (valid) {
					this.$print(this.$refs.printTable) 
					this.$emit('printSetCancel');
			        // this.printSetShow = false;
				}
			});
		},
		printSetShowFun () {
			this.printSetShow = true;
        },
        moneyCapital (total) {
		 	return util.convertCurrency(total)
		},
        moneyTransform (money) {
			if (money) {
				return util.moneyTransform(money)
			} else {
				return ''
			}
		},
        // 合计
		getTotal () {
			let data = JSON.parse(JSON.stringify(this.dataList));
			let totalReast = 0;
			let totalReast2 = 0;
			for (let i = 0; i < data.length; i++) {
				totalReast = this.addNum(totalReast,data[i].line3Value)
				totalReast2 = this.addNum(totalReast2,data[i].line4Value)
			}
			this.totalValue = totalReast;
			this.total2Value = totalReast2;
	
			if (totalReast.toString().indexOf('.') != -1) {
				if (totalReast.toString().indexOf("-") !== -1) {
					totalReast = this.accMul(totalReast,100);
					totalReast = totalReast.toString().split('-').join('');
				} else {
					totalReast = this.accMul(totalReast,100);
				}
			} else if (totalReast.toString().indexOf("-") !== -1){
				totalReast = this.accMul(totalReast,100);
				totalReast = totalReast.toString().split('-').join('');
			} else {
				totalReast = this.accMul(totalReast,100);
			}
			if (totalReast2.toString().indexOf('.') != -1) {
				if (totalReast2.toString().indexOf("-") !== -1) {
					totalReast2 = this.accMul(totalReast2,100);
					totalReast2 = totalReast2.toString().split('-').join('');
				} else {
					totalReast2 = this.accMul(totalReast2,100);
				}
			} else if (totalReast2.toString().indexOf("-") !== -1) {
					totalReast2 = this.accMul(totalReast2,100);
					totalReast2 = totalReast2.toString().split('-').join('');
			} else {
					totalReast2 = this.accMul(totalReast2,100)
			}
			this.total = totalReast ? totalReast : '';
			this.total2 = totalReast2 ? totalReast2 : '';
		},
		//自定义加法运算
		addNum (num1, num2) {
			var sq1,sq2,m;
			try {
				sq1 = num1.toString().split(".")[1].length;
			}
			catch (e) {
				sq1 = 0;
			}
			try {
				sq2 = num2.toString().split(".")[1].length;
			}
			catch (e) {
				sq2 = 0;
			}
			m = Math.pow(10,Math.max(sq1, sq2));
			return (num1 * m + num2 * m) / m;
        },
        	// 乘法
		accMul(arg1, arg2) {
			var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length;
			}
			catch (e) {
			}
			try {
				m += s2.split(".")[1].length;
			}
			catch (e) {
			}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		},
	},
	watch: {
		printData: {
            deep: true,
            immediate: true,
            handler(data) {
                this.dataList = data;
            }
        },
		printModelShow: {
            deep: true,
            immediate: true,
            handler(data) {
              this.printSetShow = data;
            }
        },
		infoMessage: {
            deep: true,
            immediate: true,
            handler(data) {
              this.infoMessageData = data;
            }
        },
	},
};
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
 .bomBox{
        height: 45px;
        .colBox{
            border: 1px solid #E9E9E9;
            span{
                display: inline-block;
                width: 30%;
                height: 45px;
                line-height: 45px;
                text-align: center;
                background-color: #FBFBFB;
                border-right:  1px solid #E9E9E9;
            }
            .el-input{
                width: 70%;
                .el-input__inner{
                    border:0px;
                    height: 45px;
                    line-height: 45px;
                }
            }
        }
    }
.table tbody tr td {
	border-left: 1px solid #474747;
	border-top: 1px solid #474747;
	padding: 0;
	border-spacing: 0;
}
.boxShadow{
	box-shadow: 0 0 15px rgba(0,0,0, 0.5);
}
.colorRed {
	color: red;
}
.colorBlue{
	color: #409EFF;
}
.displayNone {
	display: none;
}
.displayBlock {
	display: block;
}
.displayNone2 {
	display: none;
}
.displayBlock2 {
	display: block;
}
.table {
	border-right: 1px solid #474747;
	border-bottom: 1px solid #474747;

	.unitTr {
		th {
			width: 2%;
		}
	}
	.removeClass {
		height: 30px;
		line-height: 30px;
		i {
			color: red;
			font-size: 20px;
			cursor: pointer;
		}
		display: none;
	}
	tbody tr:hover > td {
		background-color: #f5f7fa !important;
		.numClass {
			display: none;
		}
		.removeClass {
			display: block;
		}
	}
}
.table thead tr th {
	border-left: 1px solid #474747;
	border-top: 1px solid #474747;
	padding: 0;
	border-spacing: 0;
}
.table {
    font-size: 14px;
	// width: 960px;
	margin:  0 auto;
	text-align: center;
}
</style>
