<template>
    <div class="address-book accountant-kj">
        <el-divider>电话咨询登记</el-divider>
        <el-table
            border
            :data="tableData"
            style="width: 100%">
            <el-table-column width="250">
                <template slot="header"><p>被咨询单位<span style="color:red;font-size:16px;">*</span></p></template>
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.line1" size="medium" v-if="scope.$index === 0" placeholder="请输入业主方"></el-input>
                        <el-input v-model="scope.row.line1" size="medium" v-if="scope.$index === 1" placeholder="请输入管理方"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.line1 }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="150">
                <template slot="header"><p>被咨询人<span style="color:red;font-size:16px;">*</span></p></template>
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.line2" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.line2 }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="200">
                <template slot="header"><p>联系电话<span style="color:red;font-size:16px;">*</span></p></template>
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.line3" @blur="verifyPhone(scope.$index)" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.line3 }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="咨询情况" align="center">
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.line4" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.line4 }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="200">
                <template slot="header"><p>咨询人<span style="color:red;font-size:16px;">*</span></p></template>
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-input v-model="scope.row.line6" size="medium"></el-input>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{ scope.row.line6 }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column width="240">
                <template slot="header"><p>登记时间<span style="color:red;font-size:16px;">*</span></p></template>
                <template slot-scope="scope">
                    <div v-if="!isShowDetails">
                        <el-date-picker v-model="scope.row.line7" type="datetime" value-format="yyyy-MM-dd hh:mm:ss" placeholder="选择日期"></el-date-picker>
                    </div>
                    <div v-if="isShowDetails">
                        <span>{{scope.row.line7 }}</span>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <!-- <div class="button" v-if="!isShowDetails">
            <p><el-button
                    class="el-icon-plus"
                    type="text"
                    @click.prevent="addRow()">
                添加
            </el-button></p>
        </div> -->
    </div>
</template>
<script>
import { getByAccountTypeListAll } from '../../../../../../api/financialManagement/staffLoan/index'
export default {
    name: 'advisoryList',
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
                    line3: '',
                    line4: '',
                    line6: '',
                    line7: ''
                },{
                    line1: '',
                    line2: '',
                    line3: '',
                    line4: '',
                    line6: '',
                    line7: ''
                }
                ],
                nameOptions: [],
            }
        },
        methods: {
            getData(){
                return this.tableData
            },
            verifyPhone (index) {
                this.$nextTick(() => {
                    if(this.tableData[index].line3 !== null){
                        let phone = this.tableData[index].line3
                        const reg = /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57][0-9]{8})|([0-9]{4}|[0-9]{3})(-| ))?([0-9]{7,8})?$/;
                        // /^1[3456789]\d{9}$/
                        // /^1(3|4|5|6|7|8|9)\d{9}$/
                        if (!reg.test(phone)) {
                            this.$message.warning("请输入正确的手机号!!!")
                            this.tableData[index].line3 = ''
                        }
                    }
                })
            }
        },
        mounted() {
            if(this.dataInfo instanceof Array && this.dataInfo.length > 0){
                this.tableData = this.dataInfo
            }
        },
        watch: {
            dataInfo(newVal, old){
                if(newVal instanceof Array && newVal.length > 0){
                    this.tableData = newVal
                }
            },
            isShowDetails (newVal) {
                console.log(newVal)
            }
        }
}
</script>
<style lang="scss">
.accountant-kj{
    padding: 20px;
    position: relative;
    border-top: 1px solid #DDD;
    .el-tabs__item{
        padding: 0px 30px;
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        background-color: #FFF;
    }
    .el-tabs__item.is-active{
        background-color: #409EFF;
        color: #FFF;
    }
}
</style>