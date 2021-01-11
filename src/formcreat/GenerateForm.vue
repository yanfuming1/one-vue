<template>
    <div>
        <el-form ref="generateForm"
            :class="{
                [data.config && data.config.customClass]: data.config && data.config.customClass ? true : false,
            }"
            label-suffix=":"
            :size="data.config && data.config.size"
            :model="models"
            :rules="rules"
            :disabled="!edit"
            :label-position="data.config && data.config.labelPosition"
            :label-width="data.config && data.config.labelWidth + 'px'">

            <template v-for="item in data.list">
                <generate-col-item
                    v-if="item.type == 'grid'"
                    :key="item.key"
                    :model.sync="models"
                    :rules="rules"
                    :element="item"
                    :remote="remote"
                    :blanks="blanks"
                    :display="displayFields"
                    :transform="transform"
                    :edit="edit"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btn-click="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-col-item>

                <generate-tab-item
                    v-else-if="item.type == 'tabs'"
                    :key="item.key"
                    :model.sync="models"
                    :rules="rules"
                    :element="item"
                    :remote="remote"
                    :blanks="blanks"
                    :display="displayFields"
                    :edit="edit"
                    :transform="transform"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btn-click="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-tab-item>

                <generate-form-item
                    v-else
                    :key="item.key"
                    :models.sync="models"
                    :rules="rules"
                    :widget="item"
                    :remote="remote"
                    :blanks="blanks"
                    :display="displayFields"
                    :transform="transform"
                    :edit="edit"
                    :remote-option="remoteOption"
                    @input-change="onInputChange"
                    @btn-click="btnClick"
                    @inputBlur="inputBlur"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </generate-form-item>
            </template>
        </el-form>
    </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem'
import GenerateColItem from './GenerateColItem'
import GenerateTabItem from './GenerateTabItem'
import _ from 'lodash'

export default {

    name: 'fm-generate-form',

    components: {
        GenerateFormItem,
        GenerateColItem,
        GenerateTabItem
    },

    props: {
        data: {
            type: Object,
            default: () => {
                return {
                    'list': [],
                    'config': {
                        'labelWidth': 100,
                        'labelPosition': 'right',
                        'size': 'small',
                        'customClass': ''
                    }
                }
            }
        },

        transform: {
            type: Object,
            default: () => {
                return {
                    isShowDetails: false
                }
            }
        },

        remote: {
            type: Object,
            default: () => ({})
        },

        value: {
            type: Object,
            default: () => ({})
        },

        edit: {
            type: Boolean,
            default: true
        },

        isCreated: {
            type: Boolean,
            default: false
        },

        remoteOption: {
            type: Object,
            default: () => ({})
        }
    },
    
    data () {
        return {
            models: {},
            rules: {},
            blanks: [],
            resetModels: {},
            displayFields: {},
            dataBindFields: [],
            generateShow: true,
            formKey: new Date().getTime()
        }
    },

    created () {
        this.initLoadResource ()
    },

    methods: {
        generateModel (genList) {
            for (let i = 0; i < genList.length; i++) {
                if (genList[i].type === 'grid') {
                    this.displayFields[genList[i].model] = !genList[i].options.hidden

                    genList[i].columns.forEach(item => {
                        this.generateModel(item.list)
                    })
                } else if (genList[i].type === 'tabs') {
                    genList[i].tabs.forEach(item => {
                        this.generateModel(item.list)
                    })

                    this.displayFields[genList[i].model] = !genList[i].options.hidden
                } else {
                    if (Object.keys(this.value).indexOf(genList[i].model) >= 0) {
                        // 处理老版本没有dataBind值的情况，默认绑定数据
                        if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                            this.models[genList[i].model] = this.value[genList[i].model]
                            this.dataBindFields.push(genList[i].model)
                        }
                        
                        this.displayFields[genList[i].model] = !genList[i].options.hidden

                        if (genList[i].type === 'blank') {
                            this.blanks.push({
                            name: genList[i].model
                            })
                        }

                    } else {
                        if (genList[i].type === 'blank') {
                            // bound the default value
                            if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                                this.models[genList[i].model] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : [])
                                this.dataBindFields.push(genList[i].model)
                            }
                            this.displayFields[genList[i].model] = !genList[i].options.hidden

                            this.blanks.push({
                                name: genList[i].model
                            })
                        } else {
                            if (Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) {
                                this.models[genList[i].model] = genList[i].type == 'table' ? [] : genList[i].options.defaultValue
                                this.dataBindFields.push(genList[i].model)
                            }
                            this.displayFields[genList[i].model] = !genList[i].options.hidden
                        }
                    }


                    genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
                        if (item.type === 'blank') {
                            this.blanks.push({
                                name: item.model
                            })
                        }

                        // 处理 rules
                        if (this.rules[`${genList[i].model}.${item.model}`]) {
                            this.rules[`${genList[i].model}.${item.model}`] = [
                                ...this.rules[`${genList[i].model}.${item.model}`],
                                ...item.rules.map(im => {
                                    if (im.pattern) {
                                        return {...im, pattern: eval(im.pattern)}
                                    } else {
                                        return {...im}
                                    }
                                })
                            ]
                        } else {
                            this.rules[`${genList[i].model}.${item.model}`] = [
                                ...item.rules.map(im => {
                                    if (im.pattern) {
                                        return {...im, pattern: eval(im.pattern)}
                                    } else {
                                        return {...im}
                                    }
                                })
                            ]
                        }
                    })
            

                    if (this.rules[genList[i].model]) {
                        
                        this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
                            if (item.pattern) {
                                return {...item, pattern: eval(item.pattern)}
                            } else {
                                return {...item}
                            }
                        })]
                    } else {
                        
                        this.rules[genList[i].model] = [...genList[i].rules.map(item => {
                            if (item.pattern) {
                                return {...item, pattern: eval(item.pattern)}
                            } else {
                                return {...item}
                            }
                        })]
                    }
                }
            }
        },

        _setDisabled (genList, fields ,disabled) {
            for (let i = 0; i < genList.length; i++) {
                if (genList[i].type === 'grid') {
                    genList[i].columns.forEach(item => {
                        this._setDisabled(item.list, fields, disabled)
                    })
                } else if (genList[i].type === 'tabs') {
                    genList[i].tabs.forEach(item => {
                        this._setDisabled(item.list, fields, disabled)
                    })
                } else {
                    if (fields.indexOf(genList[i].model) >= 0) {
                        this.$set(genList[i].options, 'disabled', disabled)
                    }
                }
            }
        },

        getData () {
            return new Promise((resolve, reject) => {
                this.$refs.generateForm.validate(valid => {
                    if (valid) {
                        this.getEnumerableAttribute (resolve)
                    } else {
                        reject(false)
                    }
                })
            })
        },

        getDataNotValidate () {
            return new Promise((resolve, reject) => {
                this.getEnumerableAttribute (resolve)
            })
        },

        getDataNotPromise () {
            let item = {}
            this.$refs.generateForm.validate(valid => {
                if (valid) {
                    item = this.neatenEnumerableData ()
                } else {
                    item = false
                }
            })
            return item
        },

        getDataNotValidateAndPromise () {
            return this.neatenEnumerableData ()
        },

        getEnumerableAttribute (resolve) {
            resolve(JSON.parse(JSON.stringify(this.neatenEnumerableData ())))
        },

        neatenEnumerableData () {
            const resData = {}
            Object.keys(this.models).forEach(key => {
                if (this.displayFields[key]) {
                    resData[key] = this.models[key]
                }
            })
            return resData
        },

        reset () {
            this.$refs.generateForm.resetFields()
            // this.setData(_.cloneDeep(this.resetModels))
            // this.formKey = new Date().getTime()
        },

        onInputChange (value, field, widget) {
            if (widget && widget.type == 'cascader') this.clearValidate (field)
            let data = { field, value, models: this.models }
            this.$emit('on-change', field, value, this.models)
            this.$emit(`on-${field}-change`, value)
            this.$emit ('on-object-change', data)
        },

        inputTableChange (field, value, index, parentField) {
            this.$emit('input-table-change', field, value, index, parentField)
        },

        inputBlur (field, value) {
            this.$emit ('inputBlur', field, value, this.models)
        },

        clearValidate (field) {
            this.$refs.generateForm.clearValidate (field)
        },

        display (fields) {
            Object.keys(this.displayFields).forEach(key => {
                if (fields.indexOf(key) >= 0) {
                    this.$set(this.displayFields, key, true)
                }
            })
            this.displayFields = {...this.displayFields}
        },

        hide (fields) {
            Object.keys(this.displayFields).forEach(key => {
                if (fields.indexOf(key) >= 0) {
                    this.$set(this.displayFields, key, false)
                }
            })
            this.displayFields = {...this.displayFields}
        },

        btnClick (value, field, label) {
            this.$emit('btn-click', value, field, this.models, label)
        },

        btnTableClick (field, index, list, model, label) {
            this.$emit('btnTableClick', field, index, list, model, label)
        },

        disabled (fields, disabled) {
            this._setDisabled(this.data.list, fields, disabled)
        },

        setData (value) {
            this.models = {...this.models, ...value}
        },

        initLoadResource () {
            if (Object.keys(this.data).length) {
                this.generateModel(this.data.list)
            } else {
                this.generateModel([])
            }

            this.resetModels = _.cloneDeep(this.models)
        }
    },

    watch: {
        value: {
            deep: true,
            handler (val) {
              // console.log(JSON.stringify(val))
                this.models = {...this.models, ...val}
            }
        },

        data: {
            deep: true,
            handler (val) {
                this.initLoadResource ()
            }
        }
    }
}
</script>

<style lang="scss">
</style>
