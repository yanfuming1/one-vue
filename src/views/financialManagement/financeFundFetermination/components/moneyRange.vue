<template>
    <div class="moneyRange">
        <InputNumber :max="money1Max" :min="money1Min" @on-change="money1Change" v-model="money1"></InputNumber>
        <span style="margin: 0 10px">至</span>
        <InputNumber :max="money2Max" :min="money2Min" @on-change="money2Change" v-model="money2"></InputNumber>
    </div>
</template>

<script>
    import {InputNumber} from 'iview';
    export default {
        components: {
            InputNumber,
        },
        data() {
            return {
                money1: 0,
                money2: 0,
                money1Max: 999999999,
                money2Max: 999999999,
                money1Min: 0,
                money2Min: 0,
            }
        },
        methods: {
            money1Change (value) {
                if (!value) {
                    this.money1 = 0;
                    this.money2Min = 0;
                } else {
                    this.money2Min = value;
                }
            },
            money2Change (value) {
                if (!value) {
                    this.money2 = 0;
                    this.money1Max = 0;
                } else {
                    this.money1Max = value;
                }
            },
            getMoney () {
                let data = {
                    money1: this.money1,
                    money2: this.money2,
                }
                return data
            }
        },
    }
</script>

<style lang="scss" >
.moneyRange{
    .ivu-input-number{
        .ivu-input-number-input-wrap{
            height: 30px;
        }
        .ivu-input-number-input{
            height: 30px;
            line-height: 30px;
            color: #606266;
        }
    }
}
</style>