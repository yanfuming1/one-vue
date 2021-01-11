<template>
    <d2-container type="fulls">
        <div class="entrepot-particulars">
            <div class="entrepot-particulars-header">
                <div class="entrepot-particulars___left">
                    <div class="entrepot-particulars-left___header">
                        <span class="entrepot-particulars-left___title">
                            <i class="iconfont iconwuxing"></i>
                            {{ values.name }}
                        </span>
                        <span class="entrepot-particulars-left-header___operation">
                            <el-button class="entrepot-particulars-button" disabled size="mini">管理员: {{ values.adminName }}</el-button>
                        </span>
                    </div>
                    <div class="entrepot-particulars-left___address">
                        仓库地址: {{ values.address }} {{ values.detailedAddress }}
                    </div>
                </div>
                <div class="entrepot-particulars___right">
                    <div class="entrepot-particulars-right___longString">
                        <div class="entrepot-particulars-right___particulars">
                            <span class="left">物品种类合计:</span>
                            <span class="right">{{ values.amount }}种</span>
                        </div>
                        <div class="entrepot-particulars-right___particulars">
                            <span class="left">创建时间:</span>
                            <span class="right">{{ values.createTime }}</span>
                        </div>
                        <div class="entrepot-particulars-right-particulars___line"></div>
                        <div class="entrepot-particulars-right___particulars" style="margin-top:5px">
                            <el-button size="mini" type="warning" @click="proceedLockingInventory">锁定库存</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="entrepot-particulars-details">
                <material-depot-table :isConcealAllOperation="true" :isShowCheckbox="false" :warehouseId="warehouseId" ref="materialDepot" />
            </div>
        </div>
    </d2-container>
</template>

<script>
    import materialDepotTable from '../../materialDepot/components/materialDepotTable'
    import { getEntrepotById } from '../../../../../api/materialEquipmentManagement/basicInformation/entrepot'
    export default {
        
        components: {
            'material-depot-table': materialDepotTable
        },

        data () {
            return {
                warehouseId: '',
                values: '',
                transform: {
                    isShowDetails: false
                }
            }
        },

        methods: {
            
            proceedLockingInventory () {
                let list = this.$refs.materialDepot.getSelectData ()
                this.values['materialList'] = list
                this.routerLink ()
            },

            getEntrepotData (id) {
                getEntrepotById ({id: id}).then (res => {
                    if (res) res.createTime = res.createTime.split (' ')[0], this.values = res
                })
            },

            routerLink () {
                this.$router.push ({
                    path: 'lockInventoryInformation',
                    name: 'lockInventoryInformation',
                    params: {
                        data: this.values,
                        transform: this.transform,
                        iseLockingInventory: true
                    }
                })
            }
        },

        created () {
            this.warehouseId = this.$route.params.relevancyId
            this.getEntrepotData (this.$route.params.relevancyId)
        }
    }
</script>

<style lang='scss'>
    .entrepot-particulars {
        padding: 10px;
        .entrepot-particulars-header {
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            height: 15%;
            min-height: 117px;
            background: $color-bg3;
            .entrepot-particulars___left {
                padding: 20px;
                display: inline-block;
                .entrepot-particulars-left___header {
                    .entrepot-particulars-left___title {
                        font-size: 14px;
                        padding-left: 10px;
                        color: $color-text-normal;
                    }
                    .el-icon-star-on {
                        font-size: 16px;
                    }
                    .iconfont {
                        position: relative;
                        top: 1px
                    }
                    .entrepot-particulars-left-header___operation {
                        padding-left: 20px;
                        .customer-details-center_header___replacement {
                            background: $color-button-reset !important;
                        }
                        .entrepot-particulars-button {
                            color: #fff !important;
                        }
                    }
                }
                .entrepot-particulars-left___address {
                    position: relative;
                    left: 28px;
                    top: 35px;
                }
            }
            .entrepot-particulars___right {
                float: right;
                .entrepot-particulars-right___longString {
                    display: inline-block;
                    border-left: 1px solid $color-straight-line2;
                    padding: 5px 0px;
                    width: 210px;
                    text-align: center;
                    .entrepot-particulars-right___particulars {
                        font-size: 12px;
                        padding: 0 15px;
                        height: 30px;
                        line-height: 30px;
                        .left {
                            float: left;
                        }
                        .right {
                            float: right;
                        }
                        .el-button:focus, .el-button:hover {
                            background: $color-button-lock
                        }
                        .el-button {
                            background: $color-button-lock;
                            color: #fff
                        }
                    }
                    .entrepot-particulars-right-particulars___line {
                        font-size: 12px;
                        padding: 6px 0;
                        border-bottom: 1px dashed transparent;
                        background: linear-gradient(white,white) padding-box,
                        repeating-linear-gradient(-45deg, $color-straight-line3 0, $color-straight-line3 0.4em,white 0,white 0.7em);
                    }
                }
            }
        }
        .entrepot-particulars-details {
            margin-top: 20px
        }
        .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
            color: #5e5e5f !important;
            cursor: auto !important;
            background-color: $color-primary !important
        }
    }
</style>
