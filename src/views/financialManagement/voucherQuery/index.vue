<template>
	<d2-container class="voucherQuery">
		<template slot="header" style="padding-bottom:0">
			<div class="customer-list-header">
                <el-form :inline="true" class="demo-form-inline " :model="form" ref="form" size="mini">
                  <el-form-item label prop="keywords">
                    <el-input v-model="page.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch(true)">搜索</el-button>
                  </el-form-item>
                  <el-form-item>日期:</el-form-item>
                  <el-form-item label prop="time">
                        <el-date-picker
                          v-model="dateTime"
                          style="width:300px"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          value-format="yyyy-MM-dd"
                          @change="dateChange"
                          end-placeholder="结束日期">
                        </el-date-picker>
                  </el-form-item>
              </el-form>
            </div>
		</template>
		<template>
			<div class="fina_applica_center">
				<qqt-table
					ref="table"
					:exportData="exportData"
					:data="tableData"
					:rowHeader="rowHeader"
					:option="tableOption"
					@page="pageChange"
					@selectionChange="selectChange"
				></qqt-table>
			</div>
		</template>
        <el-dialog
            title="记账凭证"
            :visible.sync="centerDialogVisible"
            width="70%"
            @close="closeDialog">
            <pz-table ref="pzTable" :pzRowData="pzDataList"></pz-table>
            <span slot="footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogComfirm">确 定</el-button>
            </span>
        </el-dialog>
	</d2-container>
</template>

<script>
let that = this;
import qqtTable from "../../../components/qqt-subassembly/qqt-table/qqt-table";
import {queryList,edit,deleteFun} from '../../../api/financialManagement/voucher/index';
import pzTable from '../voucher/component/pzTable';
export default {
	components: {
        qqtTable,
        pzTable
	},
	data() {
		return {
            centerDialogVisible: false,
			form: {
				keywords: "",
				bstatus: "1"
			},
			tableData: {
            },
            dateTime: null,
			pzDataList: {},
			exportData: [],
			rowHeader: [
				{
					prop: "accounting",
					label: "凭证编码",
                    isShow: true,
                    render: (h,params) =>{
                        let text = params.row.accounting;
                        return h('span',{
                            class: {
                                'typefaceColor': true, 
                            },
                            on: {
                                click: () => {
                                    this.pzDataList = params.row;
                                    this.centerDialogVisible = true;
                                }
                            }
                        },text)
                    }
				},
				{
					prop: "singleson",
					label: "摘要",
					isShow: true
				},
				{
					prop: "relationname",
					label: "会计科目",
					isShow: true
				},
				{
					prop: "lendermoney",
					label: "借方金额",
                    isShow: true,
				},
				{
					prop: "debitmoney",
					label: "贷方金额",
                    isShow: true,
				},
				{
					prop: "inputtime",
					label: "日期",
					isShow: true
				},
				{
					prop: "dobill",
					label: "制单人",
					isShow: true
                },
                  {
                    prop: '',
                    label: '操作',
                    isShow: true,
                    fixed: 'right',
                    width: '150',
                    render: (createElement, params) => {
                        if (params.row.hasOwnProperty('children')) {
                            return createElement('div',
                                [   
                                    createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                      
                                        on: {
                                            click: () => {
                                                this.pzDataList = params.row;
                                                this.centerDialogVisible = true;
                                            }
                                        }
                                    }, '编辑'),
                                    createElement('el-button', {
                                        attrs: {
                                            type: 'text',
                                        },
                                        style:{
                                            color: 'red',
                                        },
                                        on: {
                                            click: () => {
                                                this.deleteRow(params.row,params.index);
                                            }
                                        }
                                    },  '删除')
                                ]
                            )
                        }
                    }
                }
			],
			tableOption: {
                border: false,
                children: 'children',
                expand: true
			},
			page: {
				pageNo: 1,
				pageSize: 10,
				time: '',
				keywords: '',
			}
		};
	},
	methods: {
        deleteRow (item, index) {
             this.$confirm('是否删除该行数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFun ({id:item.id}).then(res => {
                    this.getTableData();
                    this.$message.success('删除成功')
                }).catch(err => {
                    console.log(err);
                });
            })
        },
        saveData (data) {
            edit (data).then(res => {
                this.$message.success('保存成功')
                this.centerDialogVisible = false
            })
        },
        closeDialog () {
            this.centerDialogVisible = false
        },
        dialogComfirm () {
             this.$refs.pzTable.getData().then(res => {
                let jsonData = {
                    ...res,
                    id: this.pzDataList.id
                }
                this.saveData(jsonData)
            })
        },
		// 添加
		addAccountBtn() {},
		// 搜索
		dataSearch() {
			this.getTableData();
        },
        dateChange (date) {
            if (date) {
                let time = date[0] + ',' + date[1];
                this.page.time = time;
            } else {
                this.page.time = '';
            }
            this.getTableData();
        },
		// 获取table数据
		getTableData() {
			queryList(this.page)
				.then(res => {
                    this.tableData = res;
				})
				.catch(err => {
					console.log(err);
				});
		},
		pageChange(data) {
			this.page.pageNo = data.current;
			this.page.pageSize = data.size;
			this.dataSearch();
		},
		selectChange(val) {
			console.log(val);
		},
		auditClick(type) {
			console.log(type);
		},
		//
		typeChange(val) {
			this.page.projectType = val;
			this.getTableData();
		}
	},
	mounted() {
		this.getTableData();
	}
};
</script>

<style lang="scss" scoped>
.voucherQuery {
	.leftLine {
		border-left: 3px solid #84b7fa;
		padding-right: 15px;
	}
}
</style>
<style lang="scss">
.voucherQuery{
    .d2-container-full__header {
        padding-bottom: 0px !important;
    }
    .el-date-editor .el-range-separator{
        padding: 0;
    }
} 
</style>
