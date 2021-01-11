<template>
    <div class="select">
        <el-select
            v-model="data"
            clearable
            :placeholder="placeholder"
            :disabled="!isShowElement"
            :multiple="multiple"
            :filterable="filterable"
            :allow-create="allowCreate"
            :collapse-tags="collapseTags"
            :class="{ 'isShowDetails': !isShowElement }"
            @blur="$emit('blur')"
            @focus="$emit('focus')"
            :size='size'
            @change="updateData()"	style="width: 100%; height: 36px">
            <el-option
                v-for="item in options"
                :key="item[defaultProp.value]"
                :label="item[defaultProp.label]"
                :value="item[defaultProp.value]">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import QqtP from "../qqt-p/qqt-p";
    export default {
        name: "qqt-select",
        components: {QqtP},
        props: {
            options: Array,
            placeholder: String,
            value: String,
            valueArray: Array,
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            disable: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            filterable: {
                type: Boolean,
                default: false
            },
            allowCreate: {
                type: Boolean,
                default: false
            },
            isClearable: {
                type: Boolean,
                default: true
            },
            collapseTags: {
                type: Boolean,
                default: false
            },
            size: String,
            defaultProp: {
                type: Object,
                default: () => {
                   return {
                        value: 'value',
                        label: 'label'
                   }
                }
            }

        },
        data () {
            return {
                compileText: '',
                data: this.value,
                defaultParams: this.defaultProp
            }
        },
        methods: {
            updateData (data) {
                let index = ''
                let strName = ''
                if (this.data == null || this.data === '') {
                    this.$emit('select', this.data)
                    return
                }
                if (this.options && this.options.length > 0) {
                    this.options.forEach(res => {
                        if (typeof this.data == 'string') {
                            if (res[this.defaultProp.value] === this.data) {
                                this.compileText = res[this.defaultParams.label]
                            }
                        } else if (typeof this.data == 'array') {
                            index = this.data.findIndex(i => i === res[this.defaultProp.value])
                            if (index !== -1) {
                                strName += res[this.defaultParams.label] + ','
                            }
                        }
                    })
                }

                if (strName && strName.length > 0) {
                    this.compileText = strName.substring(0, strName.length - 1)
                }
                if (data !== true) {
                    this.$emit('select', this.data)
                }
            }
        },
        mounted () {
            this.data = this.value
        },
        watch: {
            value () {
                this.data = this.value
                this.updateData(true)
            },
            valueArray () {
                this.data = this.valueArray
                this.updateData(true)
            }
        }
    }
</script>

<style lang="scss">
.select {
    .el-input--medium .el-input__inner {
        height: 36px !important;
    }
}
</style>
