<template>
	<div class="personal-banking-form">
		<div class="qqtaddTable">
			<template>
				<div>
					<el-form :rules="formData.rules" :model="formData"  ref="formDom" class="demo-ruleForm d2-mt-20">
					<el-table
					:data="formData.tableData"
					border
					style="width: 100%">
						<el-table-column align="center"  width="80px" label="序号">
						<template slot-scope="scope" >
							<div>
							<span class="numClass">{{scope.$index + 1}}</span>
							<span class="removeClass">
								<i class="el-icon-remove" @click="handleDelete(scope.$index)" ></i>
							</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="户名" width="260px">
						<template slot-scope="scope">
							<el-form-item :prop="'tableData.' + scope.$index + '.name'" :rules='formData.rules.name'>
								<el-input :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.name"  placeholder="请输入户名"></el-input>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="openingBank" label="开户行" width="260px">
						<template slot-scope="scope">
							<el-form-item :prop="'tableData.' + scope.$index + '.openingBank'" :rules='formData.rules.openingBank'>
								<el-input :disabled="isShowDetails" v-model="scope.row.openingBank"  placeholder="请输入开户行"></el-input>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="account" label="银行卡号" width="260px">
						<template slot-scope="scope">
							<el-form-item :prop="'tableData.' + scope.$index + '.account'" :rules='formData.rules.bankCardNumber'>
								<el-input :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" v-model="scope.row.account"  placeholder="请输入银行卡号"></el-input>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="备注">
						<template slot-scope="scope">
							<el-form-item :prop="'tableData.' + scope.$index + '.remark'" >
								<el-input :class="{'isShowDetails':isShowDetails}" :disabled="isShowDetails" size="small" v-model="scope.row.remark" :min="0"  label="备注说明" >
								</el-input>
							</el-form-item>
						</template>
					</el-table-column>
					</el-table>
				</el-form>
				<el-button type="text" :class="{'isShowDetails':isShowDetails}"  v-if="!isShowDetails" @click="addLine"  icon="el-icon-plus"> 添加</el-button>
				</div>
				
			</template>
  		</div>
		<div class="change-button">
			<div v-if="isShowEdit">
				<el-button type="primary" size="small" @click="editPersonalBank">编辑</el-button>
			</div>
			<div v-else>
				<el-button type="primary" size="small" @click="personalCenterAddList">保存</el-button>
				<el-button size="small" @click="cancelSeve">取消</el-button>
			</div>
		</div>
	</div>
    
</template>
<script>
import util from '@/libs/util.js';
import { personalCenterAdd } from '../../../api/personal-information/personal-data'
import * as elValudateBank from "../../systemManagement/bankAccountSettings/components/bankNumber" 
// import { qqtExpandableRowsTable, qqtTable, qqtRelateTable } from '../../../components/qqt-subassembly'
import { getBackAccountList } 
from "../../../api/system/bankAccountSettings/CompanyEmployeeAccount";
export default {
    name:'addTable',
    props: {
		data: {
			type: Array,
			default: ()=>{
				return []
			}
		}
    },
    data() {
        return {
            formData:{
                rules:{
                    name:{ 
                        required:true,
                        message:"请输入户名",
                        trigger: ["blur","change"]
					},
					openingBank:{ 
                        required:true,
                        message:"请输入开户行",
                        trigger: ["blur","change"]
					},
					bankCardNumber:{ 
						required:true,
						validator:elValudateBank.bankNumbers,
                        message:"请输入正确的银行账号",
                        trigger: ["blur","change"]
					},
					
                  },
                tableData:[
					{
						name: '',
						openingBank: '',
						account: '',
						remark:''
					}
                ]
			},
			isShowDetails: true,
			isShowEdit: true
        }
    },
    methods:{

		getCompanyEmployeeAccount () {
			getBackAccountList({
			}).then( res => {
				let newArr = [
					{
						name: '',
						openingBank: '',
						account: '',
						remark:''
					}
				]
				this.formData.tableData = res || newArr;
			})
		},
        addLine(){ //添加行数
            this.$refs.formDom.validate(valid => {
				if (valid) {
					var newValue = {
						name: '',
						openingBank: '',
						account: '',
						remark:''
					};
					//添加新的行数
					this.formData.tableData.push(newValue);
				}
            })
		},
		
		editPersonalBank () {
			this.isShowDetails = false
			this.isShowEdit = !this.isShowEdit
		},
		
		cancelSeve () {
			this.isShowDetails = true
			this.isShowEdit = !this.isShowEdit
		},
		personalCenterAddList(){  //保存
                this.$refs.formDom.validate(valid => {
                    if (valid) {
						personalCenterAdd(this.formData.tableData).then(res => {
							if (res.code === 200) {
								this.$message.success(res.message)
								this.isShowDetails = true
								this.isShowEdit = true
							}
						})
                    }
                })
        },
        handleDelete(index){ //删除行数
          this.formData.tableData.splice(index, 1)
        },
    },
    watch:{
      data:{
        immediate:true,
        handler (value) {
          let data = [
             {
                name: '',
				openingBank: '',
				account: '',
				remark:''
              }
		  ]
          if (value.length > 0) {
            this.formData.tableData = JSON.parse(JSON.stringify(value));
            let total = 0;
            let data = this.formData.tableData;
            for (let i = 0; i < data.length; i++) {
                total += Number(data[i].line5)  
                data[i].line4 = Number(data[i].line4).toFixed(2);
            }
          } else {
            this.formData.tableData = data;
          }
        }
      },
	},
	created() {
		this.getCompanyEmployeeAccount ()
	}
 
}
</script>

<style lang="scss" scoped>
	.qqtaddTable{
		height: 350px;
		overflow-y: scroll;
		.el-form-item__content{
			.el-input-number{
				span {
					display: none;
				}
				.el-input__inner{
					text-align: left
				}
			}
			.ivu-input-number{
				height: 40px;
				line-height: 40px;
				.ivu-input-number-handler-wrap{
					display: none
				}
				.ivu-input-number-input-wrap{
					height: 40px;
					input{
						height: 40px;
						padding: 0 15px;
						line-height: 40px;
						font-size: 14px;
					}
				}
				.ivu-input-number-disabled .ivu-input-number-input{
					background-color: #F5F7FA;
				}
			}
		}
	.el-form-item {
		margin-bottom: 22px;
	}
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none;
		}
		input[type="number"]{
			-moz-appearance: textfield;
		}
		.el-table--enable-row-hover .el-table__body tr:hover > td {
			background-color: #F5F7FA !important;
			.numClass{
				display: none;
			}
			.removeClass{
				display: block;
				.el-icon-error{
					cursor: not-allowed;
				}
			}
		}
		.el-table--enable-row-hover .el-table__body{
			.removeClass {
				display: none;
				i{
					font-size: 25px;
					color: #F56C6C;
				}
			}
		}
		.ivu-input-number-disabled .ivu-input-number-input{
				color: #000;
		}

	}
	.change-button {
		text-align: center
	}
</style>