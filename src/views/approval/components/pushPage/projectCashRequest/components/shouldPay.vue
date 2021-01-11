<template>
    <div>
        <el-table
                border
                class="member-table"
                :row-class-name="tableRowClassName"
                :data="tableData"
                style="width: 100%">
            <el-table-column label="" width="50" align="center">
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
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.name" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="金额" align="center" width="200">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <qqt-input :size="size" v-model="scope.row.money" :isMoneyType="isMoney" :value="scope.row.money" :btnTitle="'元'" @input="getMoney"></qqt-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.moneyText }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column  label="扣款说明" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.remark" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.remark }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="经办人" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.createName" :disabled="true" placeholder="自动生成" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.createName }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="经办时间" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.createTime" :disabled="true" placeholder="自动生成" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.createTime }}</span>
                    </div>
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
</template>
<script>
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../../../libs/util'
export default {
    name: 'shouldPay',
    components: {
        qqtInput
    },
    props: {
            dataInfo: {
                type: Array,
                default: []
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
                name: '',
                money: '',
                remark: ''
            }],
            size: 'medium',
            isMoney: true,
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            return 'hover-row';
        },
        handleDelete(index, row) {
            this.tableData.splice(index, 1);
            this.getMoney()

        },
        addRow(){
            var list = {
                name: this.name,
                money: this.money,
                remark: this.remark,
            }
            this.tableData.push(list)
        },
        getData(){
            return this.tableData
        },
        getMoney() {
            this.$emit('change', this.tableData)
        }
    },
    mounted() {
        if(this.dataInfo && this.dataInfo.length > 0){
            this.tableData = this.dataInfo
            this.tableData.forEach(item => {
                item.moneyText = util.moneyTransform(item.money)
                this.costType.forEach(it => {
                    if(item.typeId === it.id){
                        item.type = it.name
                    }
                })
            })
        }
    },
    watch: {
        dataInfo(newVal, old){
            if(newVal && newVal.length > 0){
                this.tableData = newVal
                this.tableData.forEach(item => {
                    item.moneyText = util.moneyTransform(item.money)
                    this.costType.forEach(it => {
                        if(item.typeId === it.id){
                            item.type = it.name
                        }
                    })
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
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
</style>
