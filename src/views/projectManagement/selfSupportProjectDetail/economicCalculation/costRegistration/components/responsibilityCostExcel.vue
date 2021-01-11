<template>
  <div>
        <el-form :model="table" :rules="rules" ref="rulesForm">
            <el-table 
                :data="table.tableData" border highlight-current-row >
                <el-table-column prop="numberOrder" label="序号" width="120px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.numberOrder'" :rules='rules.numberOrder'>
                            <qqt-input v-model="scope.row.numberOrder" :isShowElement="scope.row.isShowElement"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="项目编码" width="180px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.code'" :rules='rules.code'>
                            <qqt-input v-model="scope.row.code" :isShowElement="scope.row.isShowElement"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="项目名称" width="200px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.name'" :rules='rules.name'>
                            <qqt-input v-model="scope.row.name" :isShowElement="scope.row.isShowElement"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column> 
                <el-table-column prop="feature" label="项目特征" width="120px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.feature'" :rules='rules.feature'>
                            <qqt-input v-model="scope.row.feature" :isShowElement="scope.row.isShowElement"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="unit" label="计量单位" width="80px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.unit'" :rules='rules.unit'>
                            <qqt-input v-model="scope.row.unit" :isShowElement="scope.row.isShowElement"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="num" label="投标数量" width="100px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.num'" :rules='rules.num'>
                            <qqt-input v-model="scope.row.num" :isShowElement="scope.row.isShowElement" @input="numPrice(scope.$index, scope.row, 'num')"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="unitPrice" label="投标单价（元）" width="120px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.unitPrice'" :rules='rules.unitPrice'>
                            <qqt-input v-model="scope.row.unitPrice" :isShowElement="scope.row.isShowElement" :isMoneyType="true" @input="numPrice(scope.$index, scope.row, 'num')"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="投标合价（元）" width="120px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.totalPrice'" :rules='rules.totalPrice'>
                            <qqt-input v-model="scope.row.totalPrice" :isShowElement="false" :isMoneyType="true"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="adjustNumber" label="核算数量" width="100px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.adjustNumber'" :rules='rules.adjustNumber'>
                            <qqt-input v-model="scope.row.adjustNumber" :isShowElement="scope.row.isShowElement" @input="numPrice(scope.$index, scope.row, 'adjustNumber')"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="adjustUnitPrice" label="核算单价（元）" width="120px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.adjustUnitPrice'" :rules='rules.adjustUnitPrice'>
                            <qqt-input v-model="scope.row.adjustUnitPrice" :isShowElement="scope.row.isShowElement" :isMoneyType="true" @input="numPrice(scope.$index, scope.row, 'adjustNumber')"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="adjustTotalPrice" label="核算合价（元）" width="120px">
                    <template slot-scope="scope">
                        <el-form-item :prop="'tableData.' + scope.$index + '.adjustTotalPrice'" :rules='rules.adjustTotalPrice'>
                            <qqt-input v-model="scope.row.adjustTotalPrice" :isShowElement="false" :isMoneyType="true"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="200px">
                    <template slot-scope="scope">
                        <el-form-item >
                            <qqt-input v-model="scope.row.remark" :isShowElement="scope.row.isShowElement"></qqt-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="125px" label="操作">
                    <template slot-scope="scope" >
                        <el-button size="mini" type="text" :disabled="!scope.row.isShowElement" icon="el-icon-plus" @click="handleAdd(scope.$index, scope.row)"> 添加 </el-button>
                        <el-button size="small" type="text" :disabled="!scope.row.isShowElement" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        
  </div>
</template>

<script>
import { qqtInput } from '@/components/qqt-subassembly'
export default {
    props:{
        tableExcel: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            rules: {
                numberOrder: [{ required: true, message: "请输入序号", trigger: ["blur",'change'] }],
                code: [{ required: true, message: "请输入项目编码", trigger: ["blur",'change'] }],
                name: [{ required: true, message: "请输入项目名称", trigger: ["blur",'change'] }],
                feature: [{ required: true, message: "请输入项目特征", trigger: ["blur",'change'] }],
                unit: [{ required: true, message: "请输入计量单位", trigger: ["blur",'change'] }],
                num: [{ required: true, pattern: /^[0-9]+$/, message: "请输入投标数量", trigger: ["blur",'change'] }],
                adjustNumber: [{ required: true, pattern: /^[0-9]+$/, message: "请输入核算数量", trigger: ["blur",'change'] }],
                unitPrice: [{ required: true, message: "请输入投标单价（元）", trigger: ["blur",'change'] }],
                adjustUnitPrice: [{ required: true, message: "请输入核算单价（元）", trigger: ["blur",'change'] }],
                totalPrice: [{ required: true, message: "请输入投标合价（元）", trigger: ["blur",'change'] }],
                adjustTotalPrice: [{ required: true, message: "请输入核算合价（元）", trigger: ["blur",'change'] }],
            },
            table:{
                tableData: [],
            },
        }
    },
    methods: {
        // 添加行
        handleAdd(index, row) {
            let data = {
                numberOrder: '',
                code: '',
                name: '',
                feature: '',
                unit: '',
                num: '',
                adjustNumber: '',
                unitPrice: '',
                adjustUnitPrice: '',
                totalPrice: '',
                adjustTotalPrice: '',
                remark: '',
                isShowElement: true
            }
            this.table.tableData.splice(index+1, 0, data) 
        },
        // 编辑
        // handleEdit(index, row) {  
        //     row.isShowElement = !row.isShowElement 
        // },
        
        numPrice (index, row, state) {
            switch(state) {
                case 'adjustNumber':
                    row.adjustTotalPrice = (Number(row.adjustNumber) * Number(row.adjustUnitPrice)).toFixed(2)
                    this.totalPrice (this.table.tableData)
                    break
                case 'num':
                    row.totalPrice = (Number(row.num) * Number(row.unitPrice)).toFixed(2)
                    this.totalPrice (this.table.tableData)
                    break
            } 
        },

        // 删除行
        handleDelete(index, row) {
            if (this.table.tableData.length != 1)this.table.tableData.splice(index, 1)
            this.totalPrice (this.table.tableData)
        },
        
        updateIsShowElement (boolean) {
            this.table.tableData.forEach (res => {
                res.isShowElement = boolean
            })
        },

        totalPrice (list) {
            // 计算核算合计
            let num1 = 0, total1 = 0, num2 = 0, total2 = 0
            list.forEach (res => {
                num1 = (Number (res.num) * Number (res.unitPrice)), total1 += num1
                num2 = (Number (res.adjustNumber) * Number (res.adjustUnitPrice)), total2 += num2
            })
            this.$emit ("updateTotalPrice", total1.toFixed (2), total2.toFixed (2)) 
        },

        getResponsibilityCostExcel () {
            let required = []
            this.$refs.rulesForm.validate((valid) => {
               if (valid) {
                   required = this.table.tableData
               } else {
                   required = false
               }
            })
            return required
        }
    },
    created () {
        if (this.tableExcel.length == 0) {
            this.handleAdd (-1)
        }
    },
    components: {
        'qqt-input': qqtInput
    },
    watch: {
        tableExcel(val) {
            this.totalPrice (val)
            this.table.tableData = JSON.parse (JSON.stringify (val))
        }
    }
};
</script>
