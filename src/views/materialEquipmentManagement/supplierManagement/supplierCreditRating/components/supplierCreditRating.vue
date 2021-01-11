<template>
    <d2-container type="fulls">
        <div class="supplier-particulars">
            <div class="supplier-particulars-header">
                <div class="supplier-particulars___left">
                    <div class="supplier-particulars-left___header">
                        <span class="supplier-particulars-left___title">
                            <i class="iconfont iconwuxing"></i>
                            {{ values.nameSupplier }}
                        </span>
                        <span class="supplier-particulars-left-header___operation">
                            <el-button class="supplier-particulars-button" disabled size="mini">{{ values.credit ? values.credit : '暂无数据' }}</el-button>
                            <el-button class="supplier-particulars_header___replacement" disabled size="mini">供应商</el-button>
                        </span>
                    </div>
                    <div class="supplier-particulars-left___address">
                        仓库地址: {{ values.unitAddress }}{{ values.unitAddresss }}
                    </div>
                </div>
                <div class="supplier-particulars___right">
                    <div class="supplier-particulars-right___longString">
                        <div class="supplier-particulars-right___particulars">
                            <span class="left">物品种类合计:</span>
                            <span class="right">100种</span>
                        </div>
                        <div class="supplier-particulars-right___particulars">
                            <span class="left">信用等级:</span>
                            <span class="right">{{ values.credit ? values.credit : '暂无数据' }}</span>
                        </div>
                        <div class="supplier-particulars-right___particulars">
                            <span class="left">所在地:</span>
                            <span class="right">{{ values.location }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="supplier-particulars-details">
                <div class="supplier-particulars-details-title">
                    <div class="supplier-particulars-details-title___longString">
                        <p>信誉评价</p>
                    </div>
                </div>
                <div class="supplier-particulars-details-title___bottomLine"></div>
                <div class="supplier-particulars-details-center">
                    <div v-for="(item, index) of listData" :key="index">
                        <div class="supplier-particulars-details-center-header">
                            <div class="supplier-particulars-details-center-header-left">
                                <div class="supplier-particulars-details-center-header-left-head-portrait">
                                    <el-avatar v-if="item.str" :size="100" :src="item.str"></el-avatar>
                                    <div v-else class="head-portrait"></div>
                                </div>
                                <p>{{ item.createName }}</p>
                            </div>
                            <div  class="supplier-particulars-details-center-header-middle">
                                <el-rate v-model="item.credibilityStar" disabled show-score :colors="colors" :text-color="textColor" :max="max" />
                                <p>{{ item.evaluationContent }}</p>
                            </div>
                            <div class="supplier-particulars-details-center-header-right">
                                <p>信誉评价：{{ item.credit ? item.credit : '暂无数据' }}</p>
                            </div>
                        </div>
                        <div class="supplier-particulars-details-center-bottom">
                            <div class="supplier-particulars-details-center-bottom-left">
                                浏览次数 {{ item.seetime }} 次 
                            </div>
                            <div class="supplier-particulars-details-center-bottom-right">
                                {{ item.createTime }}
                            </div>
                        </div>
                    </div>
                    <div v-if="listData.length == 0" style="text-align: center; padding-top: 20px;">
                        暂无数据
                    </div>
                </div>
                <div class="supplier-particulars-details-button" v-if="$has ('material:supplier:appraisal:add')">
                    <el-button type="primary" plain @click="drawer = true">添加信用评价</el-button>
                </div>
                <div class="supplier-particulars-details-close">
                    <el-button type="primary" plain @click="closePageTag">取消</el-button>
                </div>
            </div>
        </div>
        <add-supplier-creditRating v-if="drawer" :dialogVisible="drawer" :data="values" @close="reloadSupplierEvaluate"/>
    </d2-container>
</template>

<script>
    import { getSupplierEvaluatePageList } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierCreditRating'
    import { getSupplierById, editSupplier } from '../../../../../api/materialEquipmentManagement/supplierManagement/supplierList'
    import { mapActions } from 'vuex'

    import addSupplierCreditRating from './addSupplierCreditRating'
    import util from '@/libs/util.js'
    export default {

        components: {
            'add-supplier-creditRating': addSupplierCreditRating
        },

        data () {
            return {
                filterText: '',
                values: {},
                textColor:'#3ba5ff',
                colors: ['#d1d1d1', '#3ba5ff', '#3ba5ff'],
                drawer: false,
                max: 5,
                listData: []
            }
        },

        methods: {

            ...mapActions('d2admin/page', [
                'close',
            ]),

            getSupplierEvaluateData (id) {
                getSupplierById ({id: id}).then (res => {
                    if (res) res['credit'] = this.convertCurrency (res.credibilityStar), this.values = res
                })
            },

            getSupplierEvaluatePage (id, boolean = false) {
                getSupplierEvaluatePageList ({'supplierId': id}).then (res => {
                    if (res && res.length > 0) {
                        res.forEach (item => {
                            item['credit'] = this.convertCurrency (item.credibilityStar)
                        })
                        this.listData = res
                    }
                    if (boolean) this.neatenData (res)
                })
            },

            reloadSupplierEvaluate (boolean) {
                this.drawer = false
                this.getSupplierEvaluatePage (this.$route.params.relevancyId, boolean)
            },

            editSupplierData (data) {
                editSupplier (data).then (res => {
                    if (res.code === 200)  this.getSupplierEvaluateData (this.$route.params.relevancyId)
                })
            },

            neatenData (list) {
                let afterSalesService = 0, integrityDegree = 0, qualityProducts = 0, credibilityStar = 0, goodsPrice = 0, deliverySpeed = 0, item = {}, technicalSupport = ''
                list.forEach(element => {
                    afterSalesService += Number (element.afterSalesService) || 0
                    integrityDegree += Number (element.integrityDegree) || 0
                    qualityProducts += Number (element.qualityProducts) || 0
                    goodsPrice += Number (element.goodsPrice) || 0
                    deliverySpeed += Number (element.deliverySpeed) || 0
                    credibilityStar += element.credibilityStar || 0
                });
                afterSalesService = (afterSalesService / list.length).toFixed (0)
                integrityDegree = (integrityDegree / list.length).toFixed (0)
                qualityProducts = (qualityProducts / list.length).toFixed (0)
                goodsPrice = (goodsPrice / list.length).toFixed (0)
                deliverySpeed = (deliverySpeed / list.length).toFixed (0)
                credibilityStar = Number ((credibilityStar / list.length).toFixed (0))
                technicalSupport = list[0].technicalSupport
                item = { afterSalesService, integrityDegree, qualityProducts, credibilityStar, technicalSupport, goodsPrice, deliverySpeed }
                Object.assign (this.values, item)
                this.editSupplierData (this.values)
            },

            starLevelToChinese (data) {
                let str = ''
                switch (data.toFixed (0)) {
                    case 5:
                        str = '优秀'
                        break;
                    case 4:
                        str = '良好'
                        break;
                    case 3:
                        str = '一般'
                        break;
                    case 2:
                        str = '差'
                        break;
                    case 1:
                        str = '极差'
                        break;
                }
                return str
            },
            
            convertCurrency (data) {
                let str = ''
                switch (data) {
                    case 5:
                        str = '五星'
                        break;
                    case 4:
                        str = '四星'
                        break;
                    case 3:
                        str = '三星'
                        break;
                    case 2:
                        str = '二星'
                        break;
                    default :
                        str = '一星'
                        break;
                    
                }
                return str
            },

            closePageTag () {
                let tagName = this.$route.path
                let path = `/materialEquipmentManagement/supplierManagement/supplierEvaluate`
                this.close ({ tagName, path })
            },
        },

        created () {
            if (this.$route.params && this.$route.params.relevancyId) {
                this.getSupplierEvaluatePage (this.$route.params.relevancyId)
                this.getSupplierEvaluateData (this.$route.params.relevancyId)
            }
        }
    }
</script>

<style lang='scss'>
    .supplier-particulars {
        padding: 10px;
        .supplier-particulars-header {
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            height: 15%;
            min-height: 117px;
            background: $color-bg3;
            .supplier-particulars___left {
                padding: 20px;
                display: inline-block;
                .supplier-particulars-left___header {
                    .supplier-particulars-left___title {
                        font-size: 14px;
                        padding-left: 10px;
                        color: $color-text-normal;
                    }
                    .el-icon-star-on {
                        font-size: 16px;
                    }
                    .iconfont {
                        position: relative;
                        margin-right: 5px;
                        top: 1px
                    }
                    .supplier-particulars-left-header___operation {
                        padding-left: 20px;
                        .supplier-particulars_header___replacement {
                            background: $color-button-reset !important;
                        }
                        .supplier-particulars-button {
                            color: #fff !important;
                        }
                    }
                }
                .supplier-particulars-left___address {
                    position: relative;
                    left: 35px;
                    top: 35px;
                }
            }
            .supplier-particulars___right {
                float: right;
                .supplier-particulars-right___longString {
                    border-left: 1px solid $color-straight-line2;
                    padding: 5px 0px;
                    width: 210px;
                    text-align: center;
                    float: right;
                    .supplier-particulars-right___particulars {
                        font-size: 12px;
                        padding: 0 15px;
                        height: 36px;
                        line-height: 36px;
                        .left {
                            float: left;
                        }
                        .right {
                            float: right;
                        }
                    }
                }
            }
        }
        .supplier-particulars-details {
            margin-top: 24px;
            height: 640px;
            background: $color-bg3;
            box-shadow: 0 2px 12px 0 $color-border-shadow;
            .supplier-particulars-details-title {
                padding: 30px 32px 10px;
                .supplier-particulars-details-title___longString {
                    border-left: 3px solid $color-text-title;
                    p {
                        color:  $color-text-title;
                        display: inline-block;
                        margin: 0px;
                        margin-left: 10px;
                        font-size: 14px;
                    }
                }
            }
            .supplier-particulars-details-title___bottomLine {
                top: -5px;
                border-top: solid $color-straight-line3 1px;
                right: -20px;
            }
            .supplier-particulars-details-center {
                background: $color-bg4;
                height: 400px;
                overflow-x: hidden;
                border-bottom: 1px solid $color-straight-line2;
                .supplier-particulars-details-center-header{
                    border-bottom: 1px dashed transparent;
                    background: linear-gradient(#fafbff,#fafbff) padding-box,
                    repeating-linear-gradient(-45deg, $color-straight-line3 0, $color-straight-line3 0.4em,white 0,white 0.7em);
                    padding: 30px 50px;
                    height: 170px;
                    margin: 0 30px;
                    .supplier-particulars-details-center-header-left{
                        float: left;
                        .supplier-particulars-details-center-header-left-head-portrait{
                            height: 85px;
                            border: $color-straight-line3 2px solid;
                            border-radius: 50%;
                            position: relative;
                            top: -5px;
                            .el-avatar {
                                height: 80px !important;
                                width: 80px !important;
                                line-height: 80px !important
                            }
                        }
                        p {
                            margin-top: 5px;
                            text-align: center;
                        }

                    }
                    .supplier-particulars-details-center-header-middle{
                        float: left;
                        font-size: 15px;
                        position: relative;
                        left: 200px;
                        .el-rate__text{
                            font-size: 16px;
                            font-weight: bold;
                            position: relative;
                            left: 50px;
                            top: 3px;
                        }
                        .el-rate__item {
                            i {
                                font-size: 28px;
                            }
                        }
                        p {
                            padding-top: 60px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            width: 800px;
                        }
                    }
                    .supplier-particulars-details-center-header-right{
                        float: right;
                        p{
                            color: #3ba5ff;
                            font-size: 15px
                        }
                    }
                }
                .supplier-particulars-details-center-bottom {
                    padding: 0px 55px 0 65px;
                    justify-content: space-between;
                    display: flex;
                    border-bottom: 1px solid $color-border-1;
                    .supplier-particulars-details-center-bottom-left{
                        font-size: 14px;
                        padding: 20px;
                        text-align: left;
                        height: 50px;
                    }
                    .supplier-particulars-details-center-bottom-right{
                        font-size: 14px;
                        padding: 20px;
                        text-align: right;
                        height: 50px;
                    }
                }
            }
            .supplier-particulars-details-button {
                text-align: right;
                width: 100%;
                padding: 20px 40px 0;
            }
            .supplier-particulars-details-close {
                text-align: center
            }
            button {
                height: 30px;
                padding: 6px 10px;
            }
        }
        .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
            color: #5e5e5f !important;
            cursor: auto !important;
            background-color: $color-primary !important
        }
    }
</style>
