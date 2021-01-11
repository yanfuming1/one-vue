<template>
    <div class="address-book open-tender project-common">
        <el-card class="box-card">
            <el-form ref="form" :model="data" label-width="100px">
                <el-divider content-position="left">项目基本信息</el-divider>
                <el-row class="pro-info">
                    <el-col :span="6">
                        <p><i class="el-icon-star-off"></i>项目名称: {{ data.projectName }}</p>
                    </el-col>
                    <el-col :span="6">
                        <p>项目编码: {{ data.itemNumber }}</p>
                    </el-col>
                    <el-col :span="6">
                        <p>标段: {{ data.section }}</p>
                    </el-col>
                    <el-col :span="6">
                        <p v-if="fromDeduct">该项目可用资金: {{ data.balance }} 元</p>
                    </el-col>
                </el-row>
                <el-row class="pro-info">
                    <el-col :span="6" class="associated">
                        <p>联营人: {{ data.associatedPerson }}</p>
                    </el-col>
                    <el-col :span="6">
                        <p>联系电话: {{ data.phone }}</p>
                    </el-col>
                    <el-col :span="6">
                        <p v-if="!fromDeduct">中标价格: {{ data.tenderPrice }} 元</p>
                    </el-col>
                    <el-col :span="6">
                        <p v-if="!fromDeduct">中标时间: {{ data.theWinningTime }} </p>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
    </div>
</template>
<script>
import { getProById } from '../../../../api/jointProject/index'
import { mapActions } from 'vuex'
import util from '../../../../libs/util'
export default {
    name: "projectCommon",
    props:{
        fromDeduct: {
            type: Boolean,
            default: false
        },
        fromArrive: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            data: {},
            proId: ''
        }
    },
    methods: {
        ...mapActions('d2admin/db', [
            'database',
        ]),
        getInfo () {
            getProById({
                id :  this.proId
            }).then(res => {
                res.projectTotalMoney = util.moneyTransform(res.projectTotalMoney)
                res.projectBalance = util.moneyTransform(res.projectBalance)
                res.balance = util.moneyTransform(res.balance)
                res.untitled4 = util.moneyTransform(res.untitled4)
                res.tenderPrice = util.moneyTransform(res.tenderPrice)
                res.theWinningTime = res.theWinningTime ? res.theWinningTime : '无'
                res.section = res.section ? res.section : '无'
                this.data = res
            })
        }
    },
    async mounted () {
        const db = await this.$store.dispatch('d2admin/db/database', {user: true})
        this.proId = db.get('proID').value()
        this.getInfo()
    }
}
</script>
<style lang='scss'>
.open-tender.project-common{
    padding-bottom: 15px;
    .el-card__body{
        padding: 20px;
    }
    .pro-info{
        color: #333333;
        height: 40px; 
        line-height: 40px;
        font-size: 16px;
        .el-col{
            padding-left: 20px;
            i{
                margin-right: 15px;
            }
        }
        .associated{
            p{
                padding-left: 30px;
            }
        }
        .last-col{
            p{
                text-align: right;
            }
        }
    }
    .el-card__body{
        padding: 0px 10px;
        // background: url('./img/pro-bg.png') center no-repeat;
        background: #FFF;
        background-size: 100% 100%;
        .el-form-item{
            margin-bottom: 0px;
        }
    }
}
</style>