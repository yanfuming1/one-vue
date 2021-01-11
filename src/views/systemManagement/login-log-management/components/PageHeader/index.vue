<template>
	<el-form slot="header" :inline="true" :model="form" ref="form" size="mini" >
		<el-form-item label="" prop="name">
			<el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入需搜索的内容" @keyup.enter.native="handleFormSubmit" style="width: 200px;" :clearable="true"/>
		</el-form-item>
		<el-form-item label="" prop="status">
			<el-select v-model="form.status" placeholder="请选择要搜索的状态" style="width: 160px;" clearable @change.native="statusData" value="">
				<el-option label="成功" value="1"/>
				<el-option label="失败" value="0"/>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="info" @click="handleFormReset">
				重置
			</el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" :disabled="loading" @click="handleFormSubmit(true)"> 搜索 </el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" v-if="$has('sys:loginLog:del')" @click="deleteAll"> 批量删除 </el-button>
		</el-form-item>
  	</el-form>
</div>

</template>

<script>
    import {loginLog} from "../../../../../api/system/loginLog/loginLog";
    import moduleNameemployeeAccounts from '../../../../../api/system/bankAccountSettings/CompanyEmployeeAccount';
    import { log } from 'util';

    export default {
	props: {
		loading: {
		default: false
	},
	catData: {
		default: () => []
	}
	},
	data() {
		return {
			catId: [],
			form: {
				keywords: '',
				status: '',
			},
			multipleSelection:[],
			catProps: {
				value: 'goods_category_id',
				label: 'name',
				children: 'children',
				checkStrictly: true
			}
		}
	},
	methods: {
		handleFormSubmit(isRestore = false) {
			const length = this.catId.length
			this.form.goods_category_id = length > 0 ? this.catId[length - 1] : null
			this.$emit('submit', this.form, isRestore)
		},
		handleFormReset(isRestore = false) {
			this.form.keywords = ''
			this.form.status = ''
			this.$emit('submit', this.form, isRestore)
		},
		deleteAll () {
			this.$emit('deleteAll')
		}
	}
}
</script>
<style lang="scss" scoped>

</style>
