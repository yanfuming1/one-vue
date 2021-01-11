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
            <el-table-column label="公司名称" width="300" align="center">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.line1" :isShowElement="!isShowDetails" :value="scope.row.line1" ></qqt-input>
                </template>
            </el-table-column>
            <el-table-column  label="投标报价" align="center" width="200">
                <template slot-scope="scope">
                    <qqt-input :size="size" v-model="scope.row.line2" :isShowElement="!isShowDetails" :isMoneyType="isMoney" :value="scope.row.line2" :btnTitle="'元'"></qqt-input>
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
</div>
</template>
<script>
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../../libs/util'
export default {
    name: 'shouldPay',
    components: {
        qqtInput
    },
    props: {
            dataInfo: {
                type: Array,
                default: () => {
                    return [{}]
                }
            },
            isShowDetails: {
                type: Boolean,
                default: true
            }
        },
    data() {
        return {
            tableData: [{
                line1: '',
                line2: '',
            }],
            size: 'medium',
            isMoney: true,
            isShowElement: false,
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
        },
        addRow(){
            var list = {
                line1: this.line1,
                line2: this.line2,
            }
            this.tableData.push(list)
        },
        getData(){
            return this.tableData
        },
        setData(data){
            this.tableData = data ? data: [{}]
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
