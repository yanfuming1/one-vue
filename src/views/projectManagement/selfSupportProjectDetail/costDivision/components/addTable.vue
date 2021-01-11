<template>
	<div class="qqtaddTable">
		<el-form :rules="formData.rules" :model="formData" ref="formDom" class="demo-ruleForm d2-mt-20">
			<el-table :data="formData.tableData" border style="width: 100%">
				<el-table-column align="center" width="50" label="序号">
					<template slot-scope="scope">
						<span class="numClass">{{scope.$index + 1}}</span>
						<span class="removeClass">
							<i class="el-icon-error" v-if="scope.$index === 0 || scope.$index === 1"></i>
							<i class="el-icon-remove" v-else @click="handleDelete(scope.$index)"></i>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="line1" label="成本类别">
					<template slot-scope="scope">
						<el-form-item
							:prop="'tableData.' + scope.$index + '.line1'"
							:rules="formData.rules.required"
						>
							<el-select
								v-model="scope.row.line1"
								:disabled="scope.$index=== 0 || scope.$index=== 1 || !isShowElement"
								style="width:100%"
								filterable
								placeholder="成本类别"
							>
								<el-option
									v-for="item in getType"
									:key="item.id"
									:disabled="(scope.$index!= 0 || scope.$index!= 1) && item.id === '1187989893288439808'"
									:label="item.name"
									:value="item.id"
								></el-option>
							</el-select>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column prop="line2" label="成本名称">
					<template slot-scope="scope">
						<el-form-item
							:prop="'tableData.' + scope.$index + '.line2'"
							:rules="formData.rules.required"
						>
							<el-select
								v-model="scope.row.line2"
								:disabled="scope.$index=== 0 || scope.$index=== 1 || !isShowElement"
								style="width:100%"
								filterable
								placeholder="成本名称"
							>
								<el-option v-for="item in getName" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="单位">
					<template slot-scope="scope">
						<el-form-item :prop="'tableData.' + scope.$index + '.line3'" :rules="formData.rules.required">
							<el-select
								allow-create
								v-model="scope.row.line3"
								:disabled="scope.$index=== 0 || scope.$index=== 1 || !isShowElement"
								style="width:100%"
								filterable
								placeholder="单位"
							>
								<el-option v-for="item in unitArr" :key="item.id" :label="item.name" :value="item.name"></el-option>
							</el-select>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="总价（元）">
					<template prop="line4" slot-scope="scope">
						<el-form-item
							:prop="'tableData.' + scope.$index + '.line4'"
							:rules="formData.rules.required"
						>
							<el-input
								type="number"
								min="0"
								:disabled="!isShowElement"
								placeholder="请输入合价"
								v-model="scope.row.line4"
							>
								<template slot="append">元</template>
							</el-input>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column label="备注">
					<template slot-scope="scope">
						<el-form-item>
							<el-input :disabled="!isShowElement" v-model="scope.row.line5"></el-input>
						</el-form-item>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
		<el-button type="text" @click="addLine" v-if="isShowElement" icon="el-icon-plus">添加</el-button>
	</div>
</template>
<script>
import { InputNumber } from "iview";
export default {
	components: {
		InputNumber
	},
	name: "qqtaddTable",
	props: {
		selectData: {
			type: Object,
			default: () => {
				return {};
			}
		},
		data: {
			type: Array,
			default: () => {
				return [];
			}
		},
		tenderPrice: {
			type: Number,
			default: 0
		},
		isShowElement: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		return {
			formData: {
				rules: {
					required: {
						required: true,
						message: "必填字段",
						trigger: ["blur", "change"]
					},
					isNumber: {
						type: "number",
						required: true,
						message: "册数必须为数字值",
						trigger: "change"
					}
				},
				tableData: [
					{
						line1: "1187989893288439808",
						line2: "1187990736322572288",
						line3: "项",
						line4: 0,
						line5: ''
					},
					{
						line1: "1187989893288439808",
						line2: "1195914152144928768",
						line3: "项",
						line4: 0,
						line5: ''
					}
				]
			},
			getName: [],
			getType: [],
			unitArr: [],
			total: 0,
			tenderPriceTotal: 0
		};
	},
	methods: {
		addLine() {
			//添加行数
			var newValue = {
				line1: "",
				line2: "",
				line3: "",
				line4: 0,
				line5: '',
			};
			//添加新的行数
			this.formData.tableData.push(newValue);
		},
		getData() {
			//保存
			return new Promise((resolve, reject) => {
				this.$refs.formDom.validate(valid => {
					if (valid) {
						resolve(JSON.parse(JSON.stringify(this.formData.tableData)));
					} else {
						reject(new Error("表单数据校验失败").message);
					}
				});
			});
		},
		handleDelete(index) {
			//删除行数
			this.formData.tableData.splice(index, 1);
		},
		// 数量num
		numChange(value, index) {
			if (Number(this.tenderPriceTotal) === 0) {
				this.formData.tableData[index].num = 0;
				this.$message.error("中标价为0，不支持输入");
				console.log(this.formData.tableData[index].num);
				return;
			}
			let combinedPriceTotal = 0;
			let isWrite = 0;
			let rideTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				if (i != index) {
					combinedPriceTotal += Number(
						this.formData.tableData[i].combinedPrice
					);
				}
			}
			isWrite = this.tenderPriceTotal - combinedPriceTotal;
			if (Number(this.formData.tableData[index].unitPrice) > 0) {
				rideTotal =
					this.formData.tableData[index].num *
					this.formData.tableData[index].unitPrice;
				if (isWrite > rideTotal) {
					this.formData.tableData[index].combinedPrice = rideTotal.toFixed(2);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
				} else {
					this.formData.tableData[index].combinedPrice = isWrite.toFixed(2);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
					this.formData.tableData[index].unitPrice = (
						(isWrite * 1000000) /
						this.formData.tableData[index].num /
						1000000
					).toFixed(2);
					if (Number(this.formData.tableData[index].unitPrice) === 0) {
						this.formData.tableData[index].unitPrice = 1;
						this.formData.tableData[index].num = isWrite;
					}
				}
			}
			let combinTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				combinTotal += Number(this.formData.tableData[i].combinedPrice);
			}
			this.total = combinTotal.toFixed(2);
			// let percentTotal = 0;
			// for (let i = 0; i < this.formData.tableData.length; i++) {
			//   if (i != index) {
			//     percentTotal += Number(this.formData.tableData[i].percent);
			//   }
			// }
			// if (percentTotal != 100) {
			//   if (Number(this.formData.tableData[index].combinedPrice) > 0) {
			//     this.formData.tableData[index].unitPrice = Number(((this.formData.tableData[index].combinedPrice * 1000000 / this.formData.tableData[index].num)/ 1000000).toFixed(2)) === Infinity ? 0 : Number(((this.formData.tableData[index].combinedPrice * 1000000 / this.formData.tableData[index].num)/ 1000000).toFixed(2));
			//   } else {
			//     this.formData.tableData[index].combinedPrice = (this.formData.tableData[index].unitPrice * this.formData.tableData[index].num).toFixed(2)
			//   }
			// }
			// let combinedPriceTotal = 0;
			// for (let i = 0; i < this.formData.tableData.length; i++) {
			//     combinedPriceTotal += Number(this.formData.tableData[i].combinedPrice);
			// }
			// this.total = combinedPriceTotal.toFixed(2);
		},
		// 单价unitPrice
		unitPriceChange(value, index) {
			let combinedPriceTotal = 0;
			let isWrite = 0;
			let rideTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				if (i != index) {
					combinedPriceTotal += Number(
						this.formData.tableData[i].combinedPrice
					);
				}
			}
			isWrite = this.tenderPriceTotal - combinedPriceTotal;
			if (Number(this.formData.tableData[index].num) > 0) {
				rideTotal =
					this.formData.tableData[index].unitPrice *
					this.formData.tableData[index].num;
				if (isWrite > rideTotal) {
					this.formData.tableData[index].combinedPrice = rideTotal.toFixed(2);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
				} else {
					this.formData.tableData[index].combinedPrice = isWrite.toFixed(2);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
					this.formData.tableData[index].num = (
						(isWrite * 1000000) /
						this.formData.tableData[index].unitPrice /
						1000000
					).toFixed(2);
					if (Number(this.formData.tableData[index].num) === 0) {
						this.formData.tableData[index].num = 1;
						this.formData.tableData[index].unitPrice = isWrite;
					}
				}
			}
			let combinTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				combinTotal += Number(this.formData.tableData[i].combinedPrice);
			}
			this.total = combinTotal.toFixed(2);
			// let percentTotal = 0;
			// for (let i = 0; i < this.formData.tableData.length; i++) {
			//   if (i != index) {
			//     percentTotal += Number(this.formData.tableData[i].percent);
			//   }
			// }
			// if (percentTotal != 100) {
			//   if (Number(this.formData.tableData[index].combinedPrice) > 0) {
			//     this.formData.tableData[index].num = Number(((this.formData.tableData[index].combinedPrice * 1000000 / this.formData.tableData[index].unitPrice)/ 1000000).toFixed(2)) === Infinity ? 0 : Number(((this.formData.tableData[index].combinedPrice * 1000000 / this.formData.tableData[index].unitPrice)/ 1000000).toFixed(2));
			//   } else {
			//     this.formData.tableData[index].combinedPrice = (this.formData.tableData[index].num * this.formData.tableData[index].unitPrice).toFixed(2)
			//   }
			// }
			// let combinedPriceTotal = 0;
			// for (let i = 0; i < this.formData.tableData.length; i++) {
			//     combinedPriceTotal += Number(this.formData.tableData[i].combinedPrice);
			// }
			// this.total = combinedPriceTotal.toFixed(2);
		},
		// 合价combinedPrice
		combinedPriceChange(value, index) {
			let combinedPriceTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				if (i != index) {
					combinedPriceTotal += Number(
						this.formData.tableData[i].combinedPrice
					);
				}
			}
			if (combinedPriceTotal == 0) {
				if (value > this.tenderPriceTotal) {
					this.formData.tableData[index].combinedPrice = this.tenderPriceTotal;
					this.formData.tableData[index].percent = 100;
				} else {
					this.formData.tableData[index].combinedPrice = Number(value);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
				}
			} else {
				let newValue = this.tenderPriceTotal - combinedPriceTotal - value;
				if (newValue > 0) {
					this.formData.tableData[index].combinedPrice = Number(value);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
				} else {
					this.formData.tableData[index].combinedPrice = Number(
						this.tenderPriceTotal - combinedPriceTotal
					);
					this.formData.tableData[index].percent = (
						(this.formData.tableData[index].combinedPrice * 1000000) /
						this.tenderPriceTotal /
						10000
					).toFixed(2);
				}
			}
			this.formData.tableData[index].num = 1;
			this.formData.tableData[index].unitPrice = this.formData.tableData[
				index
			].combinedPrice;
			let totalVal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				totalVal += Number(this.formData.tableData[i].combinedPrice);
			}
			this.total = totalVal.toFixed(2);
		},
		// 占合同价percent
		percentChange(value, index) {
			let percentTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				if (i != index) {
					percentTotal += Number(this.formData.tableData[i].percent);
				}
			}

			if (percentTotal == 0) {
				if (value > 100) {
					this.formData.tableData[index].percent = 100;
				} else {
					this.formData.tableData[index].percent = Number(value);
				}
			} else {
				let newValue = 100 - percentTotal - value;
				if (newValue > 0) {
					this.formData.tableData[index].percent = Number(value);
				} else {
					this.formData.tableData[index].percent = Number(100 - percentTotal);
				}
			}
			if (this.formData.tableData[index].categoryId === "1187989893288439808") {
				this.formData.tableData[index].combinedPrice = (
					(this.tenderPriceTotal * this.formData.tableData[index].percent) /
					100
				).toFixed(2);
				this.formData.tableData[index].unitPrice =
					this.formData.tableData[index].combinedPrice - 0;
				this.formData.tableData.splice(
					index,
					1,
					this.formData.tableData[index]
				);
			} else {
				this.formData.tableData[index].combinedPrice = (
					(this.tenderPriceTotal * this.formData.tableData[index].percent) /
					100
				).toFixed(2);
				this.formData.tableData[index].num = 1;
				this.formData.tableData[index].unitPrice =
					this.formData.tableData[index].combinedPrice /
					this.formData.tableData[index].num;
				this.formData.tableData.splice(
					index,
					1,
					this.formData.tableData[index]
				);
			}
			let combinedPriceTotal = 0;
			for (let i = 0; i < this.formData.tableData.length; i++) {
				combinedPriceTotal += Number(this.formData.tableData[i].combinedPrice);
			}
			this.total = combinedPriceTotal.toFixed(2);
		}
	},
	watch: {
		selectData: {
			deep: true,
			handler(value) {
				this.getName = this.selectData["getName"];
				this.getType = this.selectData["getType"];
				this.unitArr = this.selectData["unitArr"];
			}
		},
		data: {
			deep: true,
			handler(value) {
				this.formData.tableData = value || [];
				// total
				// let combinedPriceTotal = 0;
				// for (let i = 0; i < this.formData.tableData.length; i++) {
				// 	this.formData.tableData[i].num = Number(
				// 		this.formData.tableData[i].num
				// 	);
				// 	this.formData.tableData[i].unitPrice = Number(
				// 		this.formData.tableData[i].unitPrice
				// 	);
				// 	this.formData.tableData[i].combinedPrice = Number(
				// 		this.formData.tableData[i].combinedPrice
				// 	);
				// 	this.formData.tableData[i].percent = Number(
				// 		this.formData.tableData[i].percent
				// 	);

				// 	combinedPriceTotal += Number(
				// 		this.formData.tableData[i].combinedPrice
				// 	);
				// }
				// this.total = combinedPriceTotal.toFixed(2);
			}
		},
		tenderPrice: {
			deep: true,
			handler(value) {
				this.tenderPriceTotal = value;
			}
		}
	},
	mounted() {
		InputNumber.computed.precisionValue = function() {
			let arr = (this.currentValue + "").split(".");
			if (this.precision && arr[1] && this.precision < arr[1].length) {
				return this.currentValue.toFixed(this.precision);
			}
			return this.currentValue;
		};
	}
};
</script>

<style lang="scss">
.qqtaddTable {
	.el-form-item__content {
		.el-input-number {
			span {
				display: none;
			}
			.el-input__inner {
				text-align: left;
			}
		}
		.ivu-input-number {
			height: 40px;
			line-height: 40px;
			.ivu-input-number-handler-wrap {
				display: none;
			}
			.ivu-input-number-input-wrap {
				height: 40px;
				input {
					height: 40px;
					padding: 0 15px;
					line-height: 40px;
					font-size: 14px;
				}
			}
			.ivu-input-number-disabled .ivu-input-number-input {
				background-color: #f5f7fa;
			}
		}
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
	input[type="number"] {
		-moz-appearance: textfield;
	}
	.el-table--enable-row-hover .el-table__body tr:hover > td {
		background-color: #f5f7fa !important;
		.numClass {
			display: none;
		}
		.removeClass {
			display: block;
			.el-icon-error {
				cursor: not-allowed;
			}
		}
	}
	.el-table--enable-row-hover .el-table__body {
		.removeClass {
			display: none;
			i {
				font-size: 25px;
				color: #f56c6c;
			}
		}
	}
	.ivu-input-number-disabled .ivu-input-number-input {
		color: #000;
	}
}
</style>