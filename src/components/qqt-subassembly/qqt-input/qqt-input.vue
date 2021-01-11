<template>
    <div class="qqt-input">
        <el-input
            :type="type"
            v-model="data"
            :placeholder="placeholder"
            :name="name"
            @input="changeInput"
            :size="size"
            :rows="rows"
            :readonly="readonly"
            :disabled="!isShowElement"
            :class="{ 'btnTitle': readonly, 'isShowDetails': !isShowElement }"
            @focus="focus"
            @blur="blur"
        >
            <template slot="append" v-if="btnTitle" class="btnTitle">
                <div @click="$emit('btnClick')">{{ btnTitle }}</div>
            </template>
            <template slot="append" v-if="btnIcon">
                <el-button @click="$emit('btnClick')" class="iconTitle" :icon="btnIcon"></el-button>
            </template>
            <template slot="append" v-if="select">
                <qqt-select :value="select.value" :isShowElement="isShowElement" :defaultProp="select.defaultProp" :options="select.options" @select="$emit ('inputSelect', $event)" />
            </template>
        </el-input>
        <div v-if="error" class="invalid-feedback">
            {{ error }}
        </div>
    </div>
</template>

<script>
    import qqtSelect from '../qqt-select/qqt-select'
    import qqtP from '../qqt-p/qqt-p'
    import util from '@/libs/util'
    export default {
        name: 'qqt-input',
        props: {
            value: String,
            placeholder: String,
            name: String,
            btnTitle: String,
            disable: Boolean,
            error: String,
            pBtnTitle: String,
            btnIcon: String,
            size: String,
            select: Object,
            type: {
                type: String,
                default: 'text'
            },
            rows: {
                type: String,
                default: '2'
            },
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            readonly: {
                type: Boolean,
                default: () => false
            },
            isMoneyType: {
                type: Boolean,
                default: () => false
            },
            isQuantityType: {
                type: Boolean,
                default: () => false
            }
        },

        data () {
            return {
                data: '',
                isCalculate: false
            }
        },

        components: {
            'qqt-p': qqtP,
            'qqt-select': qqtSelect
        },

        watch: {
            value () {
                this.data = this.value
                if (!this.isCalculate) {
                    this.filtrate ()
                }
            }
        },

        created () {
            this.data = this.value
            if (!this.isCalculate) {
                this.filtrate ()
            }
        },

        methods: {

            checkInput (value) {
                value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : '';
                let formattedValue = '';
                if (value !== 0 && value !== '')
                    formattedValue = Number(value)
                            .toFixed(2)
                            .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
                else
                    formattedValue = value;
                    
                return formattedValue;
            },

            focus ({target}) {
                this.formattedData (target.value)
                this.$emit('focus')
            },

            blur ({target}) {
                this.formattedData (target.value)
                this.$emit('blur', target.value)
            },

            formattedData (data) {
                if (this.isMoneyType) {
                    this.data = this.checkInput (data)
                }
            },

            filtrate () {
                if (this.isMoneyType) {
                    this.data = this.checkInput (this.value)
                } else {
                    this.data = this.value
                }
            },

            changeInput (data) {
                this.isCalculate = true
                if (this.isMoneyType) {
                    this.$emit ('input', data.replace(/[^0-9._-]/g, ''))
                } else if(this.isQuantityType){
                    let regu = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
                    if(!regu.test(data)) { this.data = '' }
                    this.$emit ('input', !regu.test(data) ? '' : data)
                } else {
                    this.$emit ('input', data)
                }
            },

            reset () {
                this.data = ''
            },
        }
    }
</script>

<style lang="scss">
    .qqt-input{
        .btnTitle{
            cursor: pointer;
        }
        .iconTitle{
            margin-right: 0px;
            background-color: #FFF !important;
        }
        .el-input-group__append {
            padding: 0px;
            div {
                width: 50px;
                height: 34px;
                line-height: 34px;
                text-align: center;
            }
        }
        .el-input--medium{
            .el-button{
                border-radius: 0px;
            }
        }
    }
</style>

