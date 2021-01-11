<template>
    <div class="material-list-box">
        <div class="material-con">
            <el-table border :row-class-name="tableRowClassName" :data="tableData" style="width: 100%">
                <el-table-column label="序号" width="50" align="center">
                    <template slot-scope="scope">   
                        <div class="scope-index">
                            <span>{{scope.$index + 1}}</span>
                        </div>
                        <div class="scope-action" v-if="!showDetail">
                            <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="次数" width="150" align="center">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="!showDetail" :size="'medium'" :type="numberType" v-model="scope.row.number4"></qqt-input>
                    </template>
                </el-table-column>
                <el-table-column label="付款比例(%)" width="150" align="center">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="noInput" :size="'medium'" :type="numberType" v-model="scope.row.money1"></qqt-input>
                    </template>
                </el-table-column>
                <el-table-column label="付款金额(元)" align="center">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="!showDetail" :size="'medium'" :isMoneyType='isMoneyType' @blur="data => changeData(scope.$index, data)" v-model="scope.row.money3"></qqt-input>
                    </template>
                </el-table-column>
                <el-table-column label="日期" align="center">
                    <template slot-scope="scope">
                        <el-date-picker value-format='yyyy-MM-dd' size="medium" v-model="scope.row.datetime1" type="date" :disabled="showDetail"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="责任人" align="center">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="!showDetail" :size="'medium'" v-model="scope.row.string1"></qqt-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="button" v-if="!showDetail">
                <p><el-button class="el-icon-plus" type="text" @click.prevent="addRow()">添加</el-button></p>
            </div>
        </div>
    </div>
</template>
<script>
import { qqtInput } from '../../../../../components/qqt-subassembly'
export default {
    components: {
        qqtInput,
    },
    props: {
        showDetail: {
            type: Boolean,
            default: false
        },
        info: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    data () {
        return {
            numberType: 'number',
            isMoneyType: true,
            tableData: [],
            noInput: false,
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            return 'hover-row';
        },
        addRow() {
            let newItem = {
                number4: '',
                money1: '',
                money3: '',
                datetime1: '',
                string1: '',
            }
            this.tableData.push(newItem)
        },
        handleDelete (index, item) {
            this.tableData.splice(index, 1)
        },
        getData () {
            return this.tableData
        },
        resetData (data) {
            data.forEach(item => {
                item.number4 += ''
                item.money1 += ''
                item.money3 += ''
            })
            this.tableData = data
        },
        changeData (index, data) {
            this.$emit('changeData', this.tableData, index)
        }
    },
    mounted () {
        this.resetData(this.info)
    },
    watch: {
        info: {
            deep: true,
            immediate: true,
            handler(val) {
                this.resetData(val)
            }
        }
    }
}
</script>
<style lang="scss">
.material-list-box{
    .material-con{
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
</style>