<template>
    <div class="material-list-box">
        <el-divider content-position="left">领用材料明细</el-divider>
        <div class="lead-button-div" v-if="!isShowDetails">
            <el-button size="mini" type="primary" v-if="receiveApply" @click="leadFromHouse" plain round>从仓库导入</el-button>
            <el-button size="mini" type="primary" @click="leadFromStore" plain round>{{ leadTitle }}</el-button>
        </div>
        <div class="material-con">
            <el-table border :row-class-name="tableRowClassName" :data="tableData" style="width: 100%">
                <el-table-column label="序号" width="50" align="center">
                    <template slot-scope="scope">   
                        <div class="scope-index">
                            <span>{{scope.$index + 1}}</span>
                        </div>
                        <div class="scope-action" v-if="!isShowDetails">
                            <el-button @click="handleDelete(scope.$index, scope.row)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="材料编码" width="200" align="center">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="showDetail" :size="'medium'" v-model="scope.row.code"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column  label="名称" align="center" width="200">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="showDetail" :size="'medium'" v-model="scope.row.name"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column  label="品牌" align="center" width="200">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="showDetail" :size="'medium'" v-model="scope.row.brandName"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column  label="规格型号" align="center" width="200">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="showDetail" :size="'medium'" v-model="scope.row.specificationName"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column  label="计量单位" align="center" width="120">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="showDetail" :size="'medium'" v-model="scope.row.unit"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column :label="numberLabel" v-if="!backRegister && !showSupplier" align="center" width="120">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="!isShowDetails && !showSupplier" :size="'medium'" :type="numberType" :value="scope.row.number1" v-model="scope.row.number1" @input="data => numberChange(data, scope.$index, 'number')"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column label="累计出库数量" v-if="showSupplier" align="center" width="120">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="false" :size="'medium'" :type="numberType" v-model="scope.row.number4"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column label="累计入库数量" v-if="backRegister" align="center" width="120">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="false" :size="'medium'" :type="numberType" v-model="scope.row.number5"></qqt-input>
                    </template>
                </el-table-column>

                <!-- <el-table-column label="累计登记数量" v-if="showSupplier" align="center" width="120">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="false" :size="'medium'" :type="numberType" v-model="scope.row.number2"></qqt-input>
                    </template>
                </el-table-column>
                <el-table-column label="累计归还数量" v-if="backRegister" align="center" width="120">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="false" :size="'medium'" :type="numberType" v-model="scope.row.number3"></qqt-input>
                    </template>
                </el-table-column> -->

                <el-table-column :label="backTitle" v-if="showSupplier || backRegister" align="center" width="120">
                    <template slot-scope="scope">
                        <!-- <qqt-input :isShowElement="!isShowDetails" :size="'medium'" :type="numberType" v-model="scope.row.useorbacknumber" @input="data => numberChange1(data, scope.$index)"></qqt-input> -->
                        <qqt-input :isShowElement="!isShowDetails" :size="'medium'" :type="numberType" v-model="scope.row.useorbacknumber"></qqt-input>
                    </template>
                </el-table-column>
                
                <el-table-column  label="供应商" v-if="showSupplier || backRegister" align="center" width="200">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.supplierId" :disabled="isShowDetails" @change="data => supplierChange(data, scope.$index)">
                            <el-option v-for="item in supplierList" :key="item.id" :label="item.nameSupplier" :value="item.id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column  label="是否消耗品" align="center" width="150">
                    <template slot-scope="scope">
                        <!-- <qqt-input :isShowElement="!isShowDetails" :size="'medium'" v-model="scope.row.isConsumables"></qqt-input> -->
                        <el-select v-model="scope.row.consumables" :disabled="!showDetail">
                            <el-option v-for="item in isConsumablesOptions" :key="item.id" :label="item.value" :value="item.id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <!-- <el-table-column  label="单价(元)" v-if="!backRegister && !showSupplier" align="center" width="200"> -->
                <el-table-column label="单价(元)" v-if="noShow" align="center" width="200">
                    <template slot-scope="scope">
                        <qqt-input :isMoneyType='isMoneyType' :isShowElement="!isShowDetails && !showSupplier" :btnTitle="btnTitle" :size="'medium'":value="scope.row.money1" @input="data => numberChange(data, scope.$index, 'price')" v-model="scope.row.money1"></qqt-input>
                    </template>
                </el-table-column>

                <!-- <el-table-column  label="总价(元)" v-if="!backRegister && !showSupplier" align="center" width="200"> -->
                <el-table-column label="总价(元)" v-if="noShow" align="center" width="200">
                    <template slot-scope="scope">
                        <qqt-input :isMoneyType='isMoneyType' :isShowElement="!isShowDetails && !showSupplier" :value="scope.row.money2" v-model="scope.row.money2" :btnTitle="btnTitle" :size="'medium'"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column label="使用时间" align="center" width="200">
                    <template slot-scope="scope">
                        <!-- <qqt-input :isShowElement="!isShowDetails" :btnTitle="btnTitle" :size="'medium'":value="scope.row.string4" v-model="scope.row.money4"></qqt-input> -->
                        <el-date-picker :disabled="isShowDetails" :size="'medium'" value-format="yyyy-MM-dd" v-model="scope.row.string3" type="date"></el-date-picker>
                    </template>
                </el-table-column>

                <el-table-column label="使用地点" align="center" width="200">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="!isShowDetails" :size="'medium'" :value="scope.row.string4" v-model="scope.row.string4"></qqt-input>
                    </template>
                </el-table-column>

                <el-table-column  label="备注" align="center" width="300">
                    <template slot-scope="scope">
                        <qqt-input :isShowElement="!isShowDetails" :size="'medium'" v-model="scope.row.remark"></qqt-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <popout-material-depot :dialogVisible="popoutVisible" @close="popoutData"></popout-material-depot>
        <register-pop-up :dialogVisible="upVisible" :tableInfo="upTableInfo" @closeDialog="closeDialog"></register-pop-up>
        <from-warehouse :dialogVisible="showWarehouse" :depositoryId='depositoryId' @closeDialog='closeDialog'></from-warehouse>
    </div>
</template>
<script>
import popoutMaterialDepot from '../../basicInformation/materialDepot/components/popoutMaterialDepot'
import registerPopUp from './registerPopUp'
import fromWarehouse from './fromWarehouse'
import { allSupplierList, canRegisterList, materialWarehousePage, } from '@/api/materialEquipmentManagement/receiveManagement/receiveApply/index'
import { qqtInput } from '@/components/qqt-subassembly'
export default {
    name: 'materialList',
    components: {
        qqtInput,
        'popout-material-depot' : popoutMaterialDepot,
        'register-pop-up': registerPopUp,
        'from-warehouse': fromWarehouse
    },
    props: {
        dataInfo: {
            type: Array,
            default: () => {
                return []
            },
        },
        isShowDetails: {
            type: Boolean,
            default: false
        },
        // 表示是登记
        showSupplier: {
            type: Boolean,
            default: false
        },
        numberLabel: {
            type: String,
            default: () => {
                return '领用数量'
            }
        },
        // 归还
        backRegister: {
            type: Boolean,
            default: false,
        },
        mianId: {
            type: String,
            default: ''
        },
        backTitle: {
            type: String,
            default: '此次登记数量'
        },
        depositoryId: {
            type: String,
            default: ''
        },
        receiveApply: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isMoneyType: true,
            btnTitle: '元',
            tableData: [{}],
            isConsumablesOptions: [
                { id: '1', value: '是'},
                { id: '0', value: '否'},
            ],
            showDetail: false,
            numberType: 'number',
            popoutVisible: false,
            supplierList: [],
            leadTitle: '从材料库导入',
            upTableInfo: [],
            upVisible: false,
            noShow: false,
            showWarehouse: false,
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            return 'hover-row';
        },
        handleDelete(index, row) {
            this.tableData.splice(index, 1);
        },
        // 从材料库导入
        leadFromStore () {
            if(this.showSupplier) {
                // 登记
                this.showStore ('number4', 'number2')
            } else if (this.backRegister) {
                // 从归还
                this.showStore ('number5', 'number3')
            } else {
                this.popoutVisible = true
            }
        },
        // 从仓库导入
        leadFromHouse () {
            if(this.depositoryId === '') {
                this.$message.warning("请先选择仓库!!!")
            } else {
                this.showWarehouse = true
            }
        },
        showStore (amount, selected) {
            canRegisterList({
                mainId: this.mianId,
                amount: amount,
                selected: selected,
            }).then(res => {
                this.upTableInfo = res
                this.upVisible = true
            })
        },
     
        // 供应商
        supplierChange  (val , index) {
            let choseItem = this.supplierList.find(item => item.id === val)
            this.tableData[index].supplierName = choseItem.nameSupplier
        },

        getData () {
            this.tableData.forEach(item => {
                item.money2 = '0'
                item.money1 = '0'
            })
            return this.tableData
        },

        numberChange (data, index, type) {
            if (parseFloat(data) < 0) {
                let tem = Object.assign({}, this.tableData[index])
                switch (type) {
                    case 'number':
                        tem.number1 = '0'
                        this.$set(this.tableData, index, tem)
                        break
                    case 'price':
                        tem.money1 = '0'
                        this.$set(this.tableData, index, tem)
                        break
                }
            }
            let number = this.tableData[index].number1 === '' || this.tableData[index].number1 === null || this.tableData[index].number1 === undefined ? '0' : this.tableData[index].number1
            let price = this.tableData[index].money1 === '' || this.tableData[index].money1 === null || this.tableData[index].money1 === 'undefined' ? '0' : this.tableData[index].money1  
            this.tableData[index].money2 = parseFloat(number) * parseFloat(price) + ''

            this.$set(this.tableData,index,this.tableData[index])
            this.calculateTotal()
        },
        calculateTotal () {
            let account = '0'
            this.tableData.forEach(item => {
                account = parseFloat(account) + parseFloat(item.money2 === '' || item.money2 === null || item.money2 === 'undefined' ? '0' : item.money2)
            })
            this.$emit("calculateTotal", account + '')
        },
        numberChange1 (data, index) {
            // number1 总数量   number2 累计登记数量    number3 累计归还数量  number4 累计出口数量  累计入库数量
            if(this.showSupplier) {
                // 登记：本次领用 + 累计登记 <= 累计出库数量
                let account = parseFloat(data === '' ? '0' : data) + parseFloat(this.tableData[index].number2 === null ? '0' : this.tableData[index].number2)
                if (account > parseFloat(this.tableData[index].number4)) {
                    this.$message.warning("已超出出库的数量!!!")
                    this.tableData[index].useorbacknumber = ''
                }
            } else if(this.backRegister) {
                // 归还：本次 + 累计归还 <= 累计入库数量
                let account = parseFloat(data === '' ? '0' : data) + parseFloat(this.tableData[index].number3 === null ? '0' : this.tableData[index].number3)
                if (account > parseFloat(this.tableData[index].number5)) {
                    this.$message.warning("已超出入库的数量!!!")
                    this.tableData[index].useorbacknumber = ''
                }
            }
        },
        closeDialog(data) {
            this.upVisible = false
            this.showWarehouse = false
            if (data) {
                this.tableData = this.formateData(data)
            }
        },
        popoutData (data) {
            if (data) {
                data.forEach(item => {
                    let findItem = this.tableData.find(el => el.code === item.code)
                    if (findItem) {} else {
                        let newItem = {
                            code: item.code,
                            name: item.name,
                            brandId: item.brandId,
                            brandName: item.brandName,
                            specificationId: item.specificationId,
                            specificationName: item.specificationName,
                            unit: item.unit,
                            useorbacknumber: '0',
                            consumables: item.consumables,
                            alias: item.alias,
                            groupId: item.groupId,
                            materialId: item.id,
                            money2: '',
                        }
                        this.tableData.push(newItem)
                    }
                })
            }
            this.popoutVisible = false
        },
        formateData (data) {
            data.forEach(item => {
                item.number1 = item.number1 ? item.number1 + '' : '0'
                item.number2 = item.number2 + ''
                item.number3 = item.number3 + ''
                item.number4 = item.number4 + ''
                item.number5 = item.number5 + ''
                item.money1 = '0'
                item.money2 = '0'
                item.useorbacknumber = '0'
            })
            return data
        }
    },
    mounted () {
        this.tableData = this.formateData(this.dataInfo)
        if(this.showSupplier || this.backRegister){
            this.leadTitle = '从申请单选择'
        }
    },
    watch: {
        dataInfo: {
            deep: true,
            handler (val) {
                this.tableData = this.formateData(val)
            }
        }
    },
    beforeCreate () { 
        allSupplierList().then(res => {
            // console.log(res)
            this.supplierList = res
        })
    }
}
</script>
<style lang="scss">
.material-list-box{
    .el-divider__text{
        display: inline-block;
        position: relative;
        padding-left: 27px;
        &::before{
            content: "";
            width: 3px;
            height: 15px;
            background-color: #346fff;
            position: absolute;
            top: 10px;
            left: 17px;
        }
    }
    .lead-button-div{
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 5px;
        padding: 0px 5px;
        background: #FFF;
    }
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