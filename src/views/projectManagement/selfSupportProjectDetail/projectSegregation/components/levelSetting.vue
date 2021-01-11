<template>
    <div>
        <el-dialog
            title="项目划分-级别设置"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
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
                <el-table-column label="级别等级" align="center">
                    <template slot-scope="scope">
                        <qqt-input :size="size" v-model="scope.row.rank" :isShowElement="noInput" :value="scope.row.rank" ></qqt-input>
                    </template>
                </el-table-column>
                <el-table-column label="级别名称" align="center">
                    <template slot-scope="scope">
                        <qqt-input :size="size" v-model="scope.row.name" :isShowElement="!isShowDetails" :value="scope.row.name" ></qqt-input>
                    </template>
                </el-table-column>
                <el-table-column  label="标注底色" align="center">
                    <template slot-scope="scope">
                        <div style="display: flex;">
                            <p :style="{background: scope.row.bgColor}" class="color-p"></p>
                            <el-color-picker v-model="scope.row.bgColor" ></el-color-picker>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <qqt-input :size="size" v-model="scope.row.remark" :isShowElement="!isShowDetails" :value="scope.row.remark"></qqt-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="button" v-if="!isShowDetails">
                <p><el-button class="el-icon-plus" type="text" size="medium" @click.prevent="addRow()"> 添加 </el-button></p>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="saveBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { qqtInput } from '@/components/qqt-subassembly'
export default {
    components: {
        qqtInput
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        propData: {
            type: Array,
            default: () => {
                return []
            }
        },
    },
    data () {
        return {
            size: 'medium',
            isShowDetails: false,
            noInput: false,
            tableData: [{
                rank: '一级',
                name: '',
                bgColor: '#FFF',
                remark: '',
            }],
            arrNumber: ['一', '二', '三', '四', '五', '六']
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if(this.isShowDetails){
                return ''
            }
            return 'hover-row';
        },

        handleClose () {
            this.$emit('closeSetting')
        },

        saveBtn () {
            this.$emit('closeSetting', this.tableData)
        },

        handleDelete(index, row) {
            this.tableData.splice(index, 1);
            this.formatData()
        },

        addRow () {
            if (this.tableData.length === 6) {
                this.$message.warning('最大到六级，不能添加!!!')
                return false
            }
            var list = {
                rank: this.arrNumber[this.tableData.length]+'级',
                name: '',
                bgColor: '',
                remark: '',
            }
            this.tableData.push(list)
            this.formatData()
        },
        
        formatData () {
            this.tableData.forEach((item, index) => {
                item.number = index + 1
                item.rank = this.arrNumber[index] + '级'
            })
        }
    },
    mounted () {
        this.tableData = JSON.parse(JSON.stringify(this.propData))
    },
    watch: {
        propData: {
            deep: true,
            handler (newVal, oldVal) {
                this.tableData = JSON.parse(JSON.stringify(newVal))
            }
        }
    }
}
</script>
<style lang="scss">
.member-table{
    .color-p{ width: 100px; }
    .el-table__empty-block{ display: none; }
    .scope-action{ display: none; }
    .scope-index{ display: block; }
    .hover-row:hover{
        .scope-action{
            display: block;
            .el-button{ padding: 3px; }
        }
        .scope-index{ display: none; }
    }
}
</style>