<template>
    <div>
        <el-table class="member-table" border ref="addTable" :row-class-name="tableRowClassName" :data="tableData" style="width: 100%">
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">   
                    <div class="scope-index">
                        <span>{{scope.$index + 1}}</span>
                    </div>
                    <div class="scope-action" v-if="!temShowDetail && scope.row.canDel">
                        <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="title.line1" width="300" align="center">
                <template slot-scope="scope">
                    <div v-if="!temShowDetail && scope.row.canDel">
                        <el-input v-model="scope.row.name" size="medium" placeholder="请输入"></el-input>
                    </div>
                    <div v-else>
                        <span>{{ scope.row.name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column :label="title.line2" align="center" width="200">
                <template slot-scope="scope">
                    <div v-if="!temShowDetail && scope.row.canDel">
                        <qqt-input :isMoneyType='isMoneyType' :ref="'input' + scope.$index" :placeholder="placeholder" :size="'medium'" v-model="scope.row.money" :btnTitle="btnTitle" @input="(data) => changeMoney(data, scope.$index)"></qqt-input>
                    </div>
                    <div v-else>
                        <span>{{ scope.row.money }}</span>
                    </div> 
                </template>
            </el-table-column>
            <el-table-column :label="title.line3" align="center">
                <template slot-scope="scope">
                    <div v-if="!temShowDetail && scope.row.canDel">
                        <el-input v-model="scope.row.remark" size="medium" placeholder="请输入"></el-input>
                    </div>
                    <div v-else>
                        <span>{{ scope.row.remark }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="登记人" v-if="showAddName" width="120" align="center">
                <template slot-scope="scope">
                    <div><span>{{ scope.row.createName }}</span></div>
                </template>
            </el-table-column>
            <el-table-column label="登记时间" v-if="showAddName" width="180" align="center">
                <template slot-scope="scope">
                    <div><span>{{ scope.row.createTime }}</span></div>
                </template>
            </el-table-column>
            <el-table-column v-if="showReject && canBack" label="驳回" align="center">
                <template slot-scope="scope">
                    <el-switch v-if="scope.row.isProcess" v-model="scope.row.isCount" @change="changeMoney"></el-switch>
                    <el-switch v-if="!scope.row.isProcess" v-model="scope.row.isCount" @change="changeMoney" disabled></el-switch>
                </template>
            </el-table-column>
            <el-table-column v-if="showReject && canBack" label="驳回原因" align="center">
                <template slot-scope="scope">
                     <div v-if="scope.row.isProcess">
                        <el-input v-model="scope.row.rejectCause" size="medium" placeholder="请输入"></el-input>
                    </div>
                    <div v-if="!scope.row.isProcess">
                        <span>{{ scope.row.rejectCause }}</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="button" v-if="!temShowDetail">
            <p><el-button
                    class="el-icon-plus"
                    type="text"
                    @click.prevent="addRow()">
                添加
            </el-button></p>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { projectPaymenDelete } from '@/api/jointProject/projectPayment/index'
import { qqtInput } from '@/components/qqt-subassembly'
import util from '../../../../../../libs/util'
import { format } from 'path'
export default {
    name: 'shouldPay',
    components:{
        qqtInput
    },
    props: {
        dataInfo: { 
            type: Array,
            default: [{}]
        },
        isShowDetails: {
            type: Boolean,
            default: true
        },
        showReject: {
            type: Boolean,
            default: false
        },
        isProcess: {
            type: Boolean,
            default: false
        },
        showAddName: {
            type: Boolean,
            default: false
        },
        costType: {
            type: Array,
            default: () => {
                return []
            }
        },
        isSendBack: {
            // 是否从驳回跳转
            type: Boolean,
            default: false
        },
        title: {
            type: Object,
            default: () => {
                return {
                    line1: '费用名称',
                    line2: '费用金额',
                    line3: '费用说明'
                }
            }
        }
    },
    data() {
        return {
            tableData: [],
            temShowDetail: true,
            isMoneyType: true,
            btnTitle: '元',
            placeholder: '请输入',
            canBack: false,
            uuid: util.cookies.get('uuid')
        }
    },
    computed: {
        ...mapState('d2admin/user', [
            'info'
        ])
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            return 'hover-row';
        },
        handleDelete (index, row) {
            if(row.id) {
                // projectPaymenDelete({id: row.id}).then(res => {
                //     console.log(JSON.parse(JSON.stringify(res)))
                // })
            }
            this.tableData.splice(index, 1)
            this.$emit('change', this.tableData)
        },
        addRow () {
            let list = {
                canDel: true,
                name: '',
                money: '',
                remark: '',
                isCount: '1',
                typeId: '',
                createName: this.info.name,
                createTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
                rejectCause: '',
                isProcess: false,
            }
            this.tableData.push(list)
        },
        getData () {
            let tem = JSON.parse(JSON.stringify(this.tableData))
            if (tem.length > 0) {
                tem.forEach((item, index) => {
                    item.money = Number(item.money).toFixed(2)
                    console.log(item);
                    if(item.money === "" || item.money === "undefined" && item.name === ""){
                        tem.splice(index, 1)
                    }else {
                        item.isCount = item.isCount ? '0' : '1'
                        item.rejectCause = item.rejectCause === undefined || item.rejectCause === '' ? '' : item.rejectCause
                        item.money = item.money === "undefined" ? "" : item.money
                        this.costType.forEach(it => {
                            if(item.typeId === it.id){
                                item.type = it.name
                            }
                        })
                    }
                })
            }
            return tem
        },
        changeMoney(data, index) {
            this.$emit('change', JSON.parse (JSON.stringify (this.tableData)), index)
        },
        getMoney () {
            if(this.tableData.length > 0){
                this.tableData.forEach(item => {
                    item.isCount = item.isCount ? '0' : '1'
                })
            }
            this.$emit('change', this.tableData)
        },
        doLayout () {
            this.$refs.addTable.doLayout()
        },
        setData (data) {
            if(data.length > 0){
                data.forEach((item, index) => {
                    item.money = item.money + ''
                    item.isCount = item.isCount === '0' ? true : false 
                    item.rejectCause = item.rejectCause === undefined || item.rejectCause === '' ? '' : item.rejectCause
                    item.isProcess = !item.isProcess ? false : true
                    if(item.createBy){
                        item.canDel = this.isSendBack && this.isProcess ? this.uuid === item.createBy ? true : false : item.canDel
                    }
                    if (this.$refs['input' + index] && item.money == '') this.$refs['input' + index].reset () 
                    item.createName = item.createName ? item.createName : this.info.name
                    item.createTime = item.createTime ? item.createTime : new Date().format('yyyy-MM-dd hh:mm:ss')
                })
                this.tableData = data
            } else {
                this.tableData = []
            }
        }
    },
    mounted() {
        // this.setData(this.dataInfo)
        this.temShowDetail = this.isProcess ? false : this.isShowDetails
    },
    watch: {
        dataInfo: {
            handler:function(newVal,oldval){
                this.setData(newVal)
            },
            deep:true,
            immediate: true,
        },
        isProcess(newVal, old) {
            this.temShowDetail = newVal ? false : this.isShowDetails
        },
        isShowDetails(newValm, old) {
            this.temShowDetail = this.isProcess ? false : newValm
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