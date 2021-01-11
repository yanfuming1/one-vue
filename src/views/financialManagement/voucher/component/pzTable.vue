<template>
    <div style="padding:10px 20px 20px 20px;" class="voucher">
		<h2 style="text-align:center">记账凭证</h2>
		<el-row  style="width:960px;margin: 0 auto" v-if="$route.name == 'voucherQuery'">
			<el-col :span="24" style="text-align:right">
				<el-button type="primary" size="small" @click="printDataFun">打印</el-button>
			</el-col>
		</el-row>
		<el-row style="width:960px;margin: 20px auto 10px;height:45px;line-height:45px">
			<el-col :span="8" style="font-size:16px;">
				<span style="display:block;width:100%;text-overflow: ellipsis;white-space: nowrap;overflow:heiiden;text-align: left;">单位: {{unit}}</span>
			</el-col>
			<el-col :span="6" style="font-size:16px">
				凭证编号: {{accounting}}
			</el-col>
			<el-col :span="5" style="text-align: right;">
				<span style="font-size:16px">日期：</span>
					<el-date-picker
					style="width:150px"
					v-model="inputtime"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择日期">
					</el-date-picker>
			</el-col>
			<el-col :span="5" style="text-align: right;">
				<span style="font-size:16px">附单据：</span>
				<el-input-number v-model="doc" :min="0" :precision="0" :step="1" :max="9999"  style="width:70px;" :controls="false"></el-input-number>
				<span style="font-size:16px;margin-left:5px">张</span>
			</el-col>
		</el-row>
        <table class="table"  cellspacing="0" cellpadding="0">
            <thead>
                <tr style="height:30px;line-height:30px;background-color: #ebf1f6;">
                    <th rowspan="2" style="width: 50px">序号</th>
                    <th rowspan="2" style="width: 250px">摘要</th>
                    <th rowspan="2" style="width: 250px">会计科目</th>
                    <th colspan="11" style="width: 200px">借方金额</th>
                    <th colspan="11" style="width: 200px">贷方金额</th>
                </tr>
                <tr  style="height:30px;line-height:30px;background-color: #ebf1f6;" class="unitTr">
                    <th>亿</th>
                    <th>千</th>
                    <th>百</th>
                    <th>十</th>
                    <th>万</th>
                    <th>千</th>
                    <th>百</th>
                    <th>十</th>
                    <th>元</th>
                    <th>角</th>
                    <th>分</th>
                    <th>亿</th>
                    <th>千</th>
                    <th>百</th>
                    <th>十</th>
                    <th>万</th>
                    <th>千</th>
                    <th>百</th>
                    <th>十</th>
                    <th>元</th>
                    <th>角</th>
                    <th>分</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in dataList" :key="index">
                    <td>
                        <span class="numClass">{{index + 1}}</span>
                        <span  class="removeClass" >
                            <i
                                style="color:#4CBDFF"
                                class="el-icon-circle-plus"
                                @click="addRow(item, index)"
                            ></i>
                        </span>
                        <span class="removeClass"  v-if="index != 0 && index != 1">
                            <i
                                class="el-icon-remove"
                                @click="handleDelete(item, index)"
                            ></i>
                        </span>
                    </td>
                    <td>
                        <div
                            :class="[
                                !item.line1Edit ? 'displayBlock' : 'displayNone'
                            ]"
                            style="height:60px;line-height:20px;overflow:hidden; text-align: left;width:250px;word-wrap:break-word;overflow:hidden; "
                            @click="line1BoxClick(item, index)"
                            >
                            <span style="height:60px;font-size:14px;padding:5px">
                                {{item.line1}}
                            </span>
                        </div>
                            <!-- :class="[
                            item.line2Edit ? 'displayBlock' : 'displayNone'
                        ]" -->
                        <el-input
                            :class="[
                                item.line1Edit ? 'displayBlock' : 'displayNone'
                            ]"
							@change="line1Change($event,item,index)"
							@input="line1Input($event,item,index)"
                            ref="line1Input"
                            type="textarea"
                            class="textarea"
                            @blur="line1Blur(item, index)"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="item.line1">
                        </el-input>
                    </td>
                    <td class="selectClass" style="padding:0;vertical-align: top">
                        <div @click="line2BoxClick(item, index)" :class="[item.line2Edit ? 'boxShadow': '']">
                            <div style="height:35px;text-align:left;padding: 0 5px;" :class="[
                                !item.line2Edit ? 'displayBlock' : 'displayNone'
                            ]">
                                <!-- <span>{{item.line2}}</span> -->
                                <span>{{item.line2Value ? item.line2Value.split('/')[1] : item.line2Value}}</span>
                            </div>
                            <div :class="[
                            item.line2Edit ? 'displayBlock' : 'displayNone'
                            ]">
                                <el-select @visible-change="visibleChange($event,item,index)"  ref="line2Input" @blur="line2Blur(item, index)" filterable v-model="item.line2Value" placeholder="请选择">
                                    <el-option
                                    v-for="option in cities"
                                    :key="option.id"
                                    :label="option.subjectcode+'/'+option.subjectname"
                                    :value="option.subjectcode+'/'+option.subjectname">
                                    <span style="float: left">{{ option.subjectcode }} &nbsp;&nbsp;</span> 
                                    <span style="float: left">{{ option.subjectname }} </span>
                                    </el-option>
                                </el-select>
                            </div>
                            <div  style="height:25px;text-align:left;line-heiht:25px;font-size: 14px;padding: 0 5px;">
                                <!-- <span v-if="item.line3" :class="[
                                    item.line3Value > 0 ? 'colorBlue' : 'colorRed'
                                ]">余额：{{item.line3Value.toString().split('-').join('')}}</span> -->
                            </div>
                        </div>
                    </td>
                    <td colspan="11" class="inputCol">
                        <div
                            :class="[
                                !item.isEdit ? 'displayBlock' : 'displayNone'
                            ]"
                            @click="editBoxClick(item, index)"
                        >
                            <span :class="[
                                item.line3Value > 0 ? '' : 'colorRed'
                            ]">
                                {{ item.line3 === 0 ? "" : item.line3 }}
                            </span>
                        </div>
                        <el-input
                            :class="[
                                item.isEdit ? 'displayBlock' : 'displayNone'
                            ]"
                            ref="inputData"
                            v-model="item.line3"
                            @focus="focus($event,item)"
                            @blur="inputBlur(item, index)"
                            @input="line3Change($event, item, index)"
                            @keyup.native="
                                item.line3 = item.line3.replace(
                                    item.line3,
                                    RestrictedMoney(item.line3)
                                )
                            "
                        >
                        </el-input>
                    </td>
                    <td colspan="11" class="inputCol">
                        <div
                            :class="[
                                !item.isEdit2 ? 'displayBlock2' : 'displayNone2'
                            ]"
                            @click="editBox2Click(item, index)"
                        >
                            <span :class="[
                                item.line4Value > 0 ? '' : 'colorRed'
                            ]">
                                {{ item.line4 === 0 ? "" : item.line4 }}
                            </span>
                        </div>
                        <!-- :class="[item.isEdit2?'displayBlock2':'displayNone2']"  -->
                        <el-input
                            ref="input2Data"
                            :class="[
                                item.isEdit2 ? 'displayBlock2' : 'displayNone2'
                            ]"
                            @focus="focus2($event,item)"
                            v-model="item.line4"
                            @blur="input2Blur(item, index)"
                            @input="line4Change($event, item, index)"
                            @keyup.native="
                                item.line4 = item.line4.replace(
                                    item.line4,
                                    RestrictedMoney(item.line4)
                                )
                            "
                        >
                        </el-input>
                    </td>
                </tr>
                <tr style="height:60px;line-height:60px;background-color: #ebf1f6;">
                    <td colspan="3" style="text-align:left;padding-left:20px">合计: <span v-if="total == total2">{{moneyCapital(totalValue)}}</span></td>
                    <td colspan="11" class="inputCol"><div><span  :class="[totalValue > 0 ? '' : 'colorRed']">{{total}}</span></div></td>
                    <td colspan="11" class="inputCol"><div><span  :class="[total2Value > 0 ? '' : 'colorRed']">{{total2}}</span></div></td>
                </tr>
            </tbody>
        </table>
        <el-row :gutter="20" class="bomBox" style="margin: 20px auto">
            <el-col :span="6">
                <div class="colBox">
                    <span>记账：</span>
                    <el-input readonly v-model="fnancemanager"></el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div  class="colBox">
                    <span>审核：</span>
                    <el-input readonly v-model="bookkeeping"></el-input>
                </div>
            </el-col>
            <el-col :span="6">
                <div  class="colBox">
                    <span>出纳：</span>
                    <el-input readonly v-model="review"></el-input>
                </div>
            </el-col>
            <el-col :span="6" >
                <div  class="colBox">
                    <span>制单：</span>
                    <el-input readonly v-model="dobill"></el-input>
                </div>
            </el-col>
        </el-row>
		<print-pz v-if="printShow" :infoMessage="infoMessage" :printModelShow="printShow" @printSetCancel="printSetCancel" ref="printSetShow" :printData="printData"></print-pz>
    </div>
</template>

<script>
import {listSubject,goAdd,confGetById} from '../../../../api/financialManagement/voucher/index';
import printPz from './printPz';
import util from '@/libs/util.js'
export default {
	props: {
		pzRowData: {
			type: Object,
		},
	},
	components: {
		printPz,
	},
	data() {
		return {
			printShow: false,
			unit:'',
			doc:'',
			dobill: '',
			accounting: '',
			inputtime: '',
			fnancemanager: '',
			bookkeeping: '',
			review: '',
			cities: [],
			value: '',
			ceshiVaule: "",
			total: '',
			total2: '',
			totalValue: '',
			total2Value: '',
			dataList: [
				{
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
				},
				{
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
				},
			],
			reastDataList: [
				{
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
				},
				{
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
				}
			],
			infoMessage:{
				dobill: '',
				accounting: '',
				inputtime: '',
				fnancemanager: '',
				bookkeeping: '',
				review: '',
				doc: '',
				unit: ''
			}
		};
    },
    mounted () {
		this.getSelectList();
		// confGetById ({id:'1196963121869107200'}).then(res=> {
		// 	this.unit = res.value;
		// })
		// 
		// this.getCode();
		// this.inputtime = new Date().format('yyyy-MM-dd');
    },
	methods: {
		printSetCancel () {
			this.printShow = false;
		},
		printSetConfirm () {
			this.$refs['ruleForm'].validate((valid) => {
				if (valid) {
					
				}
			});
		},
		printDataFun () {
			this.printShow = true;
			this.printData = Object.assign([],this.dataList);
			// print(this.$refs.printTable)
			// console.log(this)
		},
		moneyCapital (total) {
		 	return util.convertCurrency(total)
		},
		line1Input (value,item,index) {
			// this.$set(this.dataList,index,this.dataList[index])	
		},
		line1Change (value,item,index) {
			// this.$set(this.dataList,index,this.dataList[index])	
		},
		 getCode () {
            goAdd().then(res=>{
                this.accounting = res;
            })
        },
		reastData () {
			for (let i = 0; i < this.dataList.length; i++) {
					this.dataList[i] = {
						line1: "",
						line2: "",
						line3: "",
						line4: "",
						line3Value: "",
						line4Value: "",
						line1Edit: false,
						line2Edit: false,
						isEdit: false,
						isEdit2: false
					}	
					if (i == 0) {
						this.dataList[i].line1Edit = true
					}	
			}
			this.getTotal()
			// this.dataList = this.reastDataList;
		},
		getData() {
			return new Promise((resolve, reject) => {
				for (let i = 0; i < this.dataList.length; i++) {
					if (this.dataList[i].line1 === '') {
						this.$message.error(`第${i+1}行摘要不能为空！`)
						this.line1BoxClick(this.dataList[i],i)
						reject(false)
							return
					}
					if (this.dataList[i].line2Value === '') {
						this.$message.error(`第${i+1}行会计科目不能为空!`)
						this.line2BoxClick(this.dataList[i],i)
						reject(false)
						return
					}
				}
				for (let i = 0; i < this.dataList.length; i++) {
					if (this.dataList[i].line3Value === '' && this.dataList[i].line4Value === '') {
						this.$message.error(`第${i+1}行借贷金额不能为空！`)
						this.editBoxClick(this.dataList[i],i)
						reject(false)
						return
					}
				}
			
				if (this.total != this.total2) {
					this.$message.error('录入借贷不平，请仔细核对金额合计');
					reject(false)
					return
				}
				let listData = [];
				this.dataList.forEach(element => {
					let obj = {
						singleson: element.line1,
						relationname: element.line2Value.split('/')[1],
						number: element.line2Value.split('/')[0],
						lendermoney: element.line3Value,
						debitmoney: element.line4Value,
					}
					listData.push(obj)
				});
				
				let jsonData = {
					unit: this.unit,
					doc: this.doc,
					children:listData,
					fnancemanager: this.fnancemanager,
					bookkeeping: this.bookkeeping,
					review: this.review,
					dobill: this.dobill,
					accounting: this.accounting,
                    inputtime: this.inputtime,
				}
				resolve(jsonData)
            })
		},
        getSelectList () {
           listSubject().then(res => {
                this.cities = res;
           }) 
        },
		// 摘要
		line1BoxClick (item,index) {
			item.line1Edit = true;
			this.$nextTick(() => {
				this.$refs.line1Input[index].focus();
			});
		},
		line2BoxClick (item,index) {
			item.line2Edit = true;
			this.$nextTick(() => {
				this.$refs.line2Input[index].focus();
				this.$refs.line2Input[index].focus();
			});
		},
		line1Blur (item,index) {
			item.line1Edit = false;
		},
		line2Blur (item,index) {
			item.line2Edit = false;
		},
		visibleChange (flag,item,index) {
			if (!flag) {
				item.line2Edit = false;
			}
		},
		// 键盘弹起处理 用于限制input 输入显示
		RestrictedMoney(values) {
			return this.plusOrMinus(values.toString());
		},
		// 输入框限制
		plusOrMinus(values) {
			let newValue;
			if (!/[^0-9.-]/g.test(values)) {
				newValue = values
					.replace(/[^\-\d.]/g, "")
					.replace(/\b(0+){2,}/g, "0")
					.replace(/\-{2,}/g, "-")
					.replace(/^\./g, "")
					.replace(/\.{2,}/g, ".")
					.replace(".", "$#$")
					.replace(/\./g, "")
					.replace("$#$", ".");
				if (
					newValue.toString().indexOf(".") > 0 &&
					Number(newValue.toString().split(".")[1].length) > 2
				) {
					newValue = parseInt(parseFloat(newValue) * 100) / 100;
				}
				if (newValue.toString().split("-").length - 1 > 1) {
					newValue = parseFloat(newValue) || "";
				}
				if (
					newValue.toString().split("-").length > 1 &&
					newValue.toString().split("-")[0].length > 0
				) {
					newValue = parseFloat(newValue) || "";
				}
				if (
					newValue.toString().length > 1 &&
					(newValue.toString().charAt(0) === "0" ||
						(newValue.toString().length > 2 &&
							newValue.toString().charAt(0) === "-" &&
							newValue.toString().charAt(1) === "0" &&
							newValue.toString().charAt(2) !== ".")) &&
					newValue.toString().indexOf(".") < 1
				) {
					newValue = parseFloat(newValue) || "";
				}
				// 判断整数位最多为9位
				if (
					newValue.toString().indexOf(".") > 0 &&
					Number(newValue.toString().split(".")[0].length) > 9
				) {
					newValue =
						newValue.toString().substring(0, 9) +
						"." +
						newValue.toString().split(".")[1];
				} else if (
					newValue.toString().indexOf(".") < 0 &&
					Number(newValue.toString().split(".")[0].length) > 9
				) {
					newValue = newValue.toString().substring(0, 9);
				}
			} else {
				newValue = values.replace(/[^0-9.-]/g, "");
			}
			return newValue;
		},
		// 删除行
		handleDelete(item, index) {
			this.dataList.splice(index, 1);
			this.getTotal()
		},
		// 添加行
		addRow (item, index) {
			for (let i = 0; i < this.dataList.length; i++) {
				if (this.dataList[i].line1 === '') {
					this.$message.error(`第${i+1}行摘要不能为空！`)
					this.line1BoxClick(this.dataList[i],i)
					return
				}
				if (this.dataList[i].line2Value === '') {
					this.$message.error(`第${i+1}行会计科目不能为空!`)
					this.line2BoxClick(this.dataList[i],i)
					return
				}
			}
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
			
			this.dataList.splice(index+1, 0, obj)
		},
		// 点击显示input
		editBoxClick(item, index) {
			item.isEdit = true;
			this.$nextTick(() => {
				this.$refs.inputData[index].focus();
			});
		},
		// 获取焦点
		focus(event,item) {
			item.line3= item.line3Value;
			event.currentTarget.select();
		},
		// 获取焦点
		focus2(event,item) {
			item.line4 = item.line4Value;
			event.currentTarget.select();
		},
		//当借方 值发生改变时 贷方值清空 同时改变合计 
		line3Change($event, item, index) {
			item.line4 = "";
			item.line4Value = "";
			item.line3Value = this.RestrictedMoney(item.line3).toString();
			if (item.line3Value === '-') {
				this.total = '';
			} else {
				item.line3 = item.line3Value;
				this.getTotal()
			}
		},
		//当贷方 值发生改变时 借方值清空 同时改变合计 
		line4Change($event, item, index) {
			item.line3 = "";
			item.line3Value = "";
			item.line4Value = this.RestrictedMoney(item.line4).toString();
			if (item.line4Value === '-') {
				this.total2 = '';
			} else {
				item.line4 = item.line4Value;
				this.getTotal()
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
			this.infoMessage.total = this.total;
			this.infoMessage.total2 = this.total;
			this.infoMessage.totalValue = this.totalValue;
			this.infoMessage.total2Value = this.total2Value;

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
		// 借方input 失去交代处理
		inputBlur(item, index) {
			item.line3Value = item.line3;
			if (item.line3) {
				if (item.line3.toString().indexOf(".") !== -1) {
					if (item.line3.toString().indexOf("-") !== -1) {
						item.line3 = this.accMul(item.line3,100);
						item.line3 = item.line3.toString().split('-').join('');
					} else {
						item.line3 = this.accMul(item.line3,100);
					}
				}else if (item.line3.toString().indexOf("-") !== -1) {
					item.line3 = item.line3.toString().split('-').join('');
					if (item.line3.length > 0) {
						item.line3 = item.line3 + '00';
					} else {
						item.line3 = '';
					}
				} else {
					if (Number(item.line3) > 0) {
						item.line3 = item.line3 + '00';
					} else {
						item.line3 = '';
					}
				}
			}
			item.isEdit = false;
		},
		reastLineValue (value) {
			let text ;
			if (value.toString().indexOf(".") !== -1) {
				if (value.toString().indexOf("-") !== -1) {
					text = this.accMul(value,100);
					text = value.toString().split('-').join('');
				} else {
					text = this.accMul(value,100);
				}
			}else if (value.toString().indexOf("-") !== -1) {
				text = value.toString().split('-').join('');
				if (value.length > 0) {
					text = value + '00';
				} else {
					text = '';
				}
			} else {
				if (Number(value) > 0) {
					text = value + '00';
				} else {
					text = '';
				}
			}
			return text;
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
		// 点击贷方 div 显示输入框
		editBox2Click(item, index) {
			item.isEdit2 = true;
			this.$nextTick(() => {
				this.$refs.input2Data[index].focus();
			});
		},
		// 贷方input 失去焦点处理
		input2Blur(item, index) {
			item.line4Value = item.line4;
			if (item.line4) {
				if (item.line4.toString().indexOf(".") !== -1) {
					if (item.line4.toString().indexOf("-") !== -1) {
						item.line4 = this.accMul(item.line4,100);
						item.line4 = item.line4.toString().split('-').join('');
					} else {
						item.line4 = this.accMul(item.line4,100);
					}
				} else if (item.line4.toString().indexOf("-") !== -1) {
					item.line4 = item.line4.toString().split('-').join('');
					if (item.line4.length > 0) {
						item.line4 = item.line4 + '00';
					} else {
						item.line4 = '';
					}
				} else {
					if (Number(item.line4) > 0) {
						item.line4 = item.line4 + '00';
					} else {
						item.line4 = '';
					}
				}
			}
			item.isEdit2 = false;
		},
	},
	watch: {
		pzRowData:{
			deep: true,
			immediate:true,
			handler (value) {
				// this.dataList = value.children || this.reastDataList;
				this.dobill = value.dobill,
				this.accounting =  value.accounting;
				this.inputtime =  value.inputtime;
				this.fnancemanager =  value.fnancemanager;
				this.bookkeeping =  value.bookkeeping;
				this.review =  value.review;
				this.doc =  value.doc;
				this.unit =  value.unit;
				this.infoMessage = {
						dobill:value.dobill,
						accounting:value.accounting,
						inputtime:value.inputtime,
						fnancemanager:value.fnancemanager,
						bookkeeping:value.bookkeeping,
						review:value.review,
						doc:value.doc,
						unit:value.unit
				}
				if (value.hasOwnProperty('children')) {
					if (value.children.length > 0) {
						let childList = [];
						for (let i = 0; i < value.children.length; i++) {
							let obj = {
								line1: value.children[i].singleson,
								line2: value.children[i].number + '/' + value.children[i].relationname,
								line3: value.children[i].lendermoney ? this.reastLineValue(value.children[i].lendermoney) : '',
								line4: value.children[i].debitmoney ? this.reastLineValue(value.children[i].debitmoney) : '',
								line2Value: value.children[i].number + '/' + value.children[i].relationname,
								line3Value: value.children[i].lendermoney || '',
								line4Value: value.children[i].debitmoney || '',
								line1Edit: false,
								line2Edit: false,
								isEdit: false,
								isEdit2: false
							}
							childList.push(obj)
						}
						this.dataList = childList;
						this.getTotal();
					}

				}
			}
		}
	},
};
</script>
<style lang="scss">

.table {
	.el-popper{
		margin-top: 25px !important;
	}
	.selectClass{
		height: 100%;
		input{
			height: 35px;
			line-height: 35px;
			border: 0;
		}
		.el-select{
			width:100%;
			background-color: transparent;
		}
		.el-input__inner{
			background-color: transparent;
			padding: 0 5px;
			font-size: 16px;
		}
	}
	
	.el-textarea__inner{
		height: 60px !important;
		border: 0px;
	}
	.inputCol {
		div {
			height: 100%;
			width: 100%;
			text-align: right;
		}
		span {
			display: inline-block;
			letter-spacing: 11.5px;
			text-align: right;
			margin-right: -9px;
			font-weight: bold;
			padding: 0;
			white-space: nowrap;
		}
		background: url("./img/account.png") no-repeat center;
		background-size: 100% 100%;
		overflow: hidden;
		.el-input__inner {
			padding: 0px;
			text-align: right;
			border-radius: 0;
			height: 60px;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 60px;
		}
	}
}
.voucher {
	.el-input-number.is-without-controls .el-input__inner{
		padding: 0 10px
	}
    .bomBox{
        height: 45px;
        width: 980px;
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
}
</style>
<style lang="scss" scoped>

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
			width: 19px;
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
	width: 960px;
	margin:  0 auto;
	text-align: center;
}
</style>
