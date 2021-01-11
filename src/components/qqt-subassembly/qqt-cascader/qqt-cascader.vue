<template>
    <span>
        <el-cascader
            :options="options"
            :disabled="!isShowElement"
            :props="defaultParams"
            :collapse-tags="collapseTags"
            v-model="compileList"
            style="width: 100%"
            ref="cascadedAddr"
            :clearable="clearable"
            :filterable="filterable"
            :class="{ 'isShowDetails': !isShowElement}"
            @change="getSuperiorName"
        >
        </el-cascader>
    </span>
</template>

<script>
    import QqtP from "../qqt-p/qqt-p";
    import util from '@/libs/util.js'
    import { Message } from 'element-ui'
    export default {
        name: "qqt-cascader",
        components: {QqtP},
        props: {
            options: Array,
            defaultParams: Object,
            value: [String, Array],
            isShowElement: {
                type: Boolean,
                default: () => true
            },
            collapseTags: {
                type: Boolean,
                default: () => false
            },
            filterable: {
                type: Boolean,
                default: () => false
            },
            clearable: {
                type: Boolean,
                default: () => false
            },
            superiorName: String,
            id: String
        },
        data () {
            return {
                compileList: [],
                optionsList: '',
                historyData: '',
                superior: ''
            }
        },
        methods: {

            updateData () {
            },

            getSuperiorName (item) {
                if (this.defaultParams && this.defaultParams.checkStrictly) {
                    this.toggleDropDownVisible (false)
                }
                if (item == null || item === '') {
                    return
                }
                if (item[item.length - 1] === this.id || item[0] === this.id) {
                    this.compileList = this.value
                    return
                }
                let superiorNameString = ''
                if (this.$refs['cascadedAddr'].getCheckedNodes().length > 0 
                        && this.$refs['cascadedAddr'].getCheckedNodes()[0] && this.$refs['cascadedAddr'].getCheckedNodes()[0].pathLabels
                        && this.$refs['cascadedAddr'].getCheckedNodes()[0].pathLabels.length > 0) {
                    this.$refs['cascadedAddr'].getCheckedNodes()[0].pathLabels.forEach(res => {
                        if (superiorNameString.indexOf(res) === -1) {
                            superiorNameString += res + '/'
                        }
                    })
                    this.superior = JSON.parse(JSON.stringify(superiorNameString.substring(0, superiorNameString.length - 1)))
                }
                if (item && item.length > 0) {
                    this.$emit('cascaded', item)
                }
            },

            ehcoData (data) {
                if (data.length > 0 && this.compileList && this.compileList.length > 0) {
                    data.forEach(res => {
                        this.compileList.forEach(element => {
                            if (res[this.defaultParams.value] === element) {
                                this.superior += res[this.defaultParams.label] + '/'
                            }
                        })
                        if (res[this.defaultParams.children] && res[this.defaultParams.children].length > 0) {
                            this.ehcoData (res[this.defaultParams.children])
                        }
                    })
                }
                if (!this.superior) {
                    this.superior = '无,'
                }
            },

            clearSubset (data) {
                data.forEach (res => {
                    if (res[this.defaultParams.children] && res[this.defaultParams.children].length > 0) {
                        this.clearSubset (res[this.defaultParams.children])
                    } else {
                        res[this.defaultParams.children] = null
                    }
                })
            },

            toggleDropDownVisible(visible) {
                const { cascadedAddr } = this.$refs
                cascadedAddr.$refs.popper.style.display = 'none'
                cascadedAddr.$refs.input.$refs.input.click ()
            }
        },

        watch: {

            options: {
                deep: true,
                handler (value) {
                    this.clearSubset (value)
                }
            },

            value () {
                if (this.value && this.value.indexOf (',') != -1) {
                    this.compileList = JSON.parse (this.value)
                } else {
                    this.compileList = this.value || []
                }
                this.superior = ''
                if (this.compileList && util.isArray(this.compileList)) this.ehcoData (this.options)
            }
        },

        mounted () {
            this.compileList = this.value || []
            if (this.options && this.options.length > 0) this.clearSubset (this.options)
        }
    }
</script>

<style lang="scss">

</style>
