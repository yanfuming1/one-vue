<template>
<div>
    <div class="add-line-div">
        <el-table
                border
                class="member-table"
                :row-class-name="tableRowClassName"
                :data="tableData"
                style="width: 100%">
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope" >
                    <div class="scope-index">
                        <span>{{scope.$index + 1}}</span>
                    </div>
                    <div class="scope-action" v-if="!isShowDetails">
                        <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="费用名称" width="300" align="center">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.line1" :isShowElement="!isShowDetails" :value="scope.row.line1" ></qqt-input>
                </template>
            </el-table-column>
            <!-- <el-table-column label="费用类别" align="medium" width="200">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-select v-model="scope.row.typeId" size="medium" placeholder="请选择">
                            <el-option v-for="item in costType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.type }}</span>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column  label="金额" align="center" width="200">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.line2" :isShowElement="!isShowDetails" :isMoneyType="isMoney" :value="scope.row.line2" :btnTitle="'元'" @blur="scope.row.line2 = $event, getMoney()"></qqt-input>
                </template>
            </el-table-column>
            <el-table-column  label="备注" align="center">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.line3" :isShowElement="!isShowDetails" :value="scope.row.line3" ></qqt-input>
                </template>
            </el-table-column>
        </el-table>
        <div class="button" v-if="!isShowDetails">
            <p><el-button
                    class="el-icon-plus"
                    type="text"
                    size="medium"
                    @click.prevent="addRow()">
                添加
            </el-button></p>
        </div>
    </div>
        <el-form ref="form" class="add-form" :model="form" label-width="100px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label-width="100px" label="合计:">
                        <qqt-input :size="size" v-model="form.charge" :isShowElement="isShowElement" :isMoneyType="isMoney" :value="form.charge" :btnTitle="'元'"></qqt-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label-width="100px" label="大写:">
                        <el-input v-model="form.bigWriteCharge" size="medium" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
</div>
</template>
<script>
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../libs/util'
export default {
    name: 'shouldPay',
    components: {
        qqtInput
    },
    props: {
            dataInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            isShowDetails: {
                type: Boolean,
                default: true
            },
            costType:{
                type: Array,
                default: () => {
                    return []
                }
            }
        },
    data() {
        return {
            tableData: [{
                line1: '',
                line2: '',
                line3: ''
            }],
            size: 'medium',
            isMoney: true,
            isShowElement: false,
            form: {
                charge: 0,
                bigWriteCharge: '',
            }
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if(this.isShowDetails){
                return ''
            }
            return 'hover-row';
        },
        handleDelete(index, row) {
            this.tableData.splice(index, 1);
            this.getMoney()
        },
        addRow(){
            var list = {
                line1: this.line1,
                line2: this.line2,
                line3: this.line3,
            }
            this.tableData.push(list)
        },
        getData(){
            return {
                tableData: this.tableData,
                charge: this.form.charge,
                bigWriteCharge: this.form.bigWriteCharge
            }
        },
        getMoney() {
            let m = 0
            if(this.tableData.length > 0){
                this.tableData.forEach(item => {
                    m = parseFloat(m === '' || m === undefined ? '0' : m) + parseFloat(item.line2 === "" || item.line2 === undefined ? '0' : item.line2)
                })
            }
            this.form.charge = m.toFixed (2)
            this.form.bigWriteCharge = util.convertCurrency(m.toFixed (2))
        },
        setData(data){
            this.tableData = data.tableData ? data.tableData : this.tableData
            this.getMoney()
        }
    },
    mounted() {
        this.setData(this.dataInfo)
    },
    watch: {
        dataInfo:{
            deep: true,
            immediate: true,
            handler(newVal, old){
                this.setData(newVal)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.add-line-div{
    background: #7db5d61f;
    padding: 10px;
    .member-table{
        .el-table__empty-block{
            display: none;
        }
        .scope-action{
            display: none;
        }
        .scope-index{
            display: block;
        }
        .hover-row:hover{
            .scope-action{
                display: block;
                .el-button{
                    padding: 3px;
                }
            }
            .scope-index{
                display: none;
            }
        }
    }
}
.add-form{
    margin-top: 10px;
}
</style>
