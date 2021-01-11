<template>
    <div class="qqt-Relate-table">
        <el-form :model="details" ref="ruleForms">
            <div class="table">
                <el-table
                    :data="details.list"
                    :border="true"
                    ref="table"
                    :row-key="rowKey"
                    @select="handleSelect"
                    @select-all="handleSelectAll"
                >
                    <el-table-column
                        type="selection"
                        v-if="isShowSelection"
                        width="60">
                    </el-table-column>
                    <el-table-column
                        type="index"
                        width="55px"
                        align="center"
                        label="序号"
                        :index="indexMethod">
                        <template slot-scope="scope" >
                            <div v-if="(!isShowDetails ? scope.row.isShowDetails ? false : true : false) && isShowDelete">
                                <span class="numClass">{{scope.$index + 1}}</span>
                                <span class="removeClass">
                                    <i class="el-icon-remove" @click="handleDelete(scope.$index)" ></i>
                                </span>
                            </div>
                            <div v-else>
                                <span >{{scope.$index + 1}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <template v-for="(col, index) in rowHeader">
                        <table-column v-if="col.children && col.children.length" :key="index" :isShowDetails="isShowDetails" :rules="rules" :coloumn-header="col" @btnClick="btnClick" @blur="blur" @focus="focus" @selectChange="selectChange" @getChangeData="getChangeData"></table-column>
                        <el-table-column v-else-if="col.isShow" :label="col.label" :key="index" :prop="col.prop" :width="col.width" :align="col.align">
                            <template slot="header">
                                <div v-if="col.required" class="table-header">
                                    <i class="table-header-required">*</i>
                                    <span>{{ col.label }}</span>
                                </div>
                                <span v-else>{{ col.label }}</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                    :prop="'list.' + scope.$index + '.'+ col.prop"
                                    :rules="col.required ? rules[col.prop] ? rules[col.prop] : col.rule ? col.rule : [{ required: true, message: `${col.label}不能为空`, trigger: 'change' }] : []"
                                >
                                    <qqt-input v-if="col.type === 'text'" :readonly="col.readonly ? true : false" :placeholder="col.placeholder" :isShowElement="detailsCompulsoryShow ? col.isShowDetails ? false : !scope.row.isShowDetails ? true : false : col.isShowDetails ? false : isShowDetails ? false : true" v-model="scope.row[col.prop]" :btnTitle="col.btnTitle" @btnClick="btnClick (scope.row, col.prop, scope.$index)" @input="getChangeData (scope.row, col.prop, $event, scope.$index)" @focus="focus (scope.row, col.prop, scope.$index, $event)" @blur="blur (scope.row, col.prop, $event)"/>
                                    <qqt-input v-if="col.type === 'money'" :isShowElement="detailsCompulsoryShow ? col.isShowDetails ? false : !scope.row.isShowDetails ? true : false : col.isShowDetails ? false : isShowDetails ? false : true" :isMoneyType="true" :btnTitle="col.btnTitle" @btnClick="btnClick (scope.row, col.prop, scope.$index)" v-model="scope.row[col.prop]" @input="getChangeData (scope.row, col.prop, $event)" @blur="blur (scope.row, col.prop, $event)"/>
                                    <qqt-input v-if="col.type === 'total'" :isShowElement="detailsCompulsoryShow ? col.isShowDetails ? false : !scope.row.isShowDetails ? true : false : col.isShowDetails ? false : isShowDetails ? false : true" :isMoneyType="col.isMoneyType" :btnTitle="col.btnTitle" v-model="scope.row[col.prop]" @input="getChangeData (scope.row, col.prop, $event)" @blur="blur (scope.row, col.prop, $event)"/>
                                    <qqt-input v-if="col.type === 'capital'" :isShowElement="false" v-model="scope.row[col.prop]" :btnTitle="col.btnTitle" />
                                    <qqt-input v-if="col.type === 'disabled'" :isShowElement="false" v-model="scope.row[col.prop]" :btnTitle="col.btnTitle" />
                                    <el-date-picker v-if="col.type === 'date'" value-format="yyyy-MM-dd" :class="{'isShowDetails': detailsCompulsoryShow ? col.isShowDetails ? true : !scope.row.isShowDetails ? false : true : col.isShowDetails ? true : isShowDetails ? true : false}" :disabled="detailsCompulsoryShow ? col.isShowDetails ? true : !scope.row.isShowDetails ? false : true : col.isShowDetails ? true : isShowDetails ? true : false" v-model="scope.row[col.prop]" type="date" placeholder="选择日期" />
                                    <el-date-picker v-if="col.type === 'datetime'" value-format="yyyy-MM-dd hh:mm:ss" :class="{'isShowDetails': detailsCompulsoryShow ? col.isShowDetails ? true : !scope.row.isShowDetails ? false : true : col.isShowDetails ? true : isShowDetails ? true : false}" :disabled="detailsCompulsoryShow ? col.isShowDetails ? true : !scope.row.isShowDetails ? false : true : col.isShowDetails ? true : isShowDetails ? true : false" v-model="scope.row[col.prop]" type="datetime" placeholder="选择日期" />
                                    <el-date-picker v-if="col.type === 'daterange'" :unlink-panels="true" value-format="yyyy-MM-dd" :class="{'isShowDetails': detailsCompulsoryShow ? col.isShowDetails ? true : !scope.row.isShowDetails ? false : true : col.isShowDetails ? true : isShowDetails ? true : false}" :disabled="detailsCompulsoryShow ? col.isShowDetails ? true : !scope.row.isShowDetails ? false : true : col.isShowDetails ? true : isShowDetails ? true : false" v-model="scope.row[col.prop]" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
                                    <qqt-select v-if="col.type === 'select'"                                                                                                                                                        
                                        v-model="scope.row[col.prop]"
                                        :options="col.options"
                                        :isShowElement="detailsCompulsoryShow ? col.isShowDetails ? false : !scope.row.isShowDetails ? true : false : col.isShowDetails ? false : isShowDetails ? false : true"
                                        :defaultProp="col.defaultProp"
                                        :filterable="col.filterable"
                                        :allow-create="col.allowCreate"
                                        @select="scope.row[col.prop] = $event, selectChange (scope.row, col.prop, $event,scope.$index)" />
                                    <qqt-select v-if="col.type === 'selectNew'"
                                        v-model="scope.row[col.prop]"
                                        :options="scope.row.options"
                                        :isShowElement="detailsCompulsoryShow ? col.isShowDetails ? false : !scope.row.isShowDetails ? true : false : col.isShowDetails ? false : isShowDetails ? false : true"
                                        :defaultProp="col.defaultProp"
                                        :filterable="col.filterable"
                                        :allow-create="col.allowCreate"
                                        @select="scope.row[col.prop] = $event, selectChange (scope.row, col.prop, $event,scope.$index)" />
                                    <i v-if="transform.isShowElementIcon && transform.prop[`${col.prop}${scope.row.id}`] == scope.row.id && transform.prop[`${col.prop}${scope.row.id}`]" @click="btnClick (scope.row, col.prop, scope.$index, col.label)" class="el-icon-paperclip fm-form-table-icon"></i>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </el-form>
        <slot name="content"></slot> 
        <div class="bottom">
            <el-button-group v-if="(!isShowDetails && isShowAdd) || detailsCompulsoryShow">
                <el-button type="text" icon="el-icon-plus" size="mini" @click="handleAdd (true)">添加</el-button>
            </el-button-group>
        </div>
    </div>
</template>

<script>

    import util from '@/libs/util.js'
    import qqtSelect from '../qqt-select/qqt-select'
    import qqtInput from '../qqt-input/qqt-input'
    import tableColumn from './tableColumn'
    export default {
        props: {
            rowHeader: Array,
            data: Array,
            rowKey: {
                type: String,
                default: () => 'id'
            },
            isShowDetails: {
                type: Boolean,
                default: false
            },
            isShowAdd: {
                type: Boolean,
                default: true
            },
            isShowDelete: {
                type: Boolean,
                default: true
            },
            isDefaultShowRow: {
                type: Boolean,
                default: true
            },
            isShowSelection: {
                type: Boolean,
                default: false
            },
            detailsCompulsoryShow: {
                type: Boolean,
                default: false
            },
            replaceRules: {
                type: Object,
                default: () => {}
            },
            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowElementIcon: false,
                        prop: {}
                    }
                }
            },
            defaultObject: {
                type: Object,
                default: () => {
                    return {
                        line1: '',
                        line2: '',
                        line3: '',
                        line4: '',
                        line5: '',
                        line6: '',
                        line7: '',
                        line8: '',
                        line9: '',
                        line10: ''
                    }
                }
            }
        },

        components: {
            'table-column': tableColumn,
            'qqt-select': qqtSelect,
            'qqt-input': qqtInput
        },

        data() {
            return {
                details: {
                    list: [],
                },
                multipleSelection: [],
                deleteIds: [],
                isAddRow: true,
                currentIndex: null,
                rules: {}
            }
        },

        methods: {

            handleAdd (boolean = false) {
                if (this.details.list.length > 0) {
                    let required = this.verify ()
                    if (!required) {
                        return
                    }
                }
                if (this.isDefaultShowRow && boolean) this.details.list.push(JSON.parse(JSON.stringify(this.defaultObject)));
                this.$emit('relateTable', this.details.list)
            },
            
            verify () {
                let required = this.isAddRow = false
                if (this.details.list.length == 0 && this.isShowDetails == false) {
                    this.handleAdd (true)
                    this.$message.warning ('添加行数据不能为空')
                    return
                } 
                if (this.$refs && this.$refs.ruleForms) {
                    this.$refs.ruleForms.validate(valid => {
                        if (!valid) {
                            required = false
                        } else {
                            required = JSON.parse (JSON.stringify (this.details.list))
                        }
                    })
                }
                return required
            },

            getNotVerify () {
                return JSON.parse (JSON.stringify (this.details.list))
            },

            handleDelete (index) {
                this.details.list.splice(index, 1)
                this.$emit ('delete', index)
            },

            indexMethod (index) {
                return index + 1 ;
            },

            getChangeData (data, prop, value, index) {
                data[prop] = value
                this.turnCapital (data, prop, value)
                this.$emit ('change', data, prop, value, index)
            },

            turnCapital (data, prop, value) {
                let list = this.filterData ()
                let element = this.filterDataCapital ()
                if (list && list.length > 0) {
                    list.forEach (item => {
                        let nan = (this.neatenControlRow (data, item.controlRow)).toFixed (item.fixed || item.fixed == 0 ? item.fixed : 2)
                        data[item.prop] = isNaN (nan) == true ? '0.00' : nan
                    })
                }
                if (element && element.capital) {
                    data[element.prop] = util.convertCurrency (data[element.capital])
                }
                
            },

            delayCalculation (data, prop, value) {
                let notGreater = this.filterPropertyAndField ('notGreaterThan', prop)
                let nonnegativeNumber = this.filterPropertyAndField ('isNonnegativeNumber', prop)

                if (nonnegativeNumber) {
                    Number.parseFloat (value) < 0 ? (data[nonnegativeNumber.prop] = '1', this.turnCapital (data, nonnegativeNumber.prop, data[nonnegativeNumber.prop])) : ''
                }
                if (notGreater && notGreater.notGreaterThan) {
                    let num = (this.neatenControlRow (data, notGreater.notGreaterThan)).toFixed (notGreater.fixed || notGreater.fixed == 0 ? notGreater.fixed : 2)
                    Number.parseFloat (value) > Number.parseFloat (num) ? (this.$message.warning (notGreater.msg), data[notGreater.prop] = num, this.turnCapital (data, notGreater.prop, data[notGreater.prop])) : ''
                }
            },

            neatenControlRow (data, controlRow) {
                let list = ''
                let row = ''
                const expArr=['+', '-', '/', '*'];
                expArr.forEach (res => {
                    row = JSON.parse (JSON.stringify (controlRow.replace(/\s+/g, "")))
                    const p = res
                    const reg = new RegExp('(\\w+)['+ p +'](\\w+)')
                    while (reg.test(row)) {
                        row = row.replace(reg, function (m, p1, p2) {
                            if (list === '') {
                                list += (isNaN (parseFloat(data[p1])) ? isNaN (parseFloat(p1)) ? 0 : parseFloat(p1) : parseFloat(data[p1])) + p + (isNaN (parseFloat(data[p2])) ? isNaN (parseFloat(p2)) ? 0 : parseFloat(p2) : parseFloat(data[p2]))
                            } else {
                                list = '(' + list + ')' + p + (isNaN (parseFloat(data[p2])) ? isNaN (parseFloat(p2)) ? 0 : parseFloat(p2) : parseFloat(data[p2]))
                            }
                        })
                    }
                })
                return eval(list)
            },

            neatenData (boolean = false) {
                if (this.replaceRules) Object.assign (this.rules, this.replaceRules)
                this.details.list = JSON.parse (JSON.stringify (this.data))
                if (this.details.list && this.details.list.length > 0) {
                    this.details.list.forEach ( res => { this.turnCapital (res) })
                }
                if (boolean && this.isAddRow) {
                    this.handleAdd (this.details.list.length == 0 ? true : false)
                }
            },

            toggleSelection (rows) {
                if (rows) {
                    this.$refs.table.toggleAllSelection();
                } else {
                    this.$refs.table.clearSelection();
                }
            },

            btnClick (data, prop, index, label) {
                this.$emit ('btnClick', data, prop, index, label)
            },

            blur (data, prop, value) {
                let header = this.rowHeader.find (f => f.prop == prop)
                if (header && header.type == 'money') data[prop] = Number (value).toFixed (2)
                this.delayCalculation (data, prop, value)
                this.$emit ('blur', data, prop, value)
            },

            focus (data, prop, index, value) {
                this.$emit ('focus', data, prop, value, index, this.details.list)
            },

            selectChange (data, prop, value, index) {
                this.$emit ('select', data, prop, value, index, this.details.list)
            },

            handleSelect (val) {
                this.$emit('selection', val)
            },

            handleSelectAll (val) {
                this.$emit('selection', val)
            },

            filterData () {
                return this.rowHeader.filter (f => f.type === 'total')
            },

            filterDataCapital () {
                return this.rowHeader.find (f => f.type === 'capital')
            },

            filterPropertyAndField (property, prop) {
                return this.rowHeader.find (f => f[property] && f.prop === prop)
            }
        },

        created () {
            this.neatenData (true)
        },

        watch: {
            data (val) {
                this.neatenData (!this.isShowDetails)
            },

            rowHeader (val) {
                let item = val.find (f => f.isInverseCalculation)
                if (item) this.details.list = JSON.parse ( JSON.stringify (this.details.list) ), this.details.list.forEach ( res => { this.turnCapital (res) })
            }
        }
    }
</script>

<style lang="scss" scope>
    .qqt-Relate-table {
        padding-top: 20px;
        .bottom {
            button {
                font-size: 14px;
            }
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: rgba(245, 247, 250, 0.616) !important;
            .numClass{
                display: none;
            }
            .removeClass{
                display: block;
                .el-icon-error{
                cursor: not-allowed;
                }
            }
        }
        .el-table--enable-row-hover .el-table__body{
            .removeClass {
                display: none;
                i {
                    font-size: 25px;
                    color: #F56C6C;
                }
            }
        }
        .table-header {
            .table-header-required {
                color: $forbidden;
                font-size: 23px;
                position: relative;
                top: 7px;
                right: 5px;
            }
        }
        .el-table td {
            padding: 12px 0 0 0 !important
        }
        .el-table th {
            padding: 0 !important
        }
        .el-form-item {
            margin-bottom: 22px !important
        }
        .el-input__inner {
            border-radius: 0px !important;
        }
        .el-input-group__append, .el-input-group__prepend {
            border-radius: 0px !important;
        }
        .fm-form-table-icon {
            position: absolute;
            line-height: 23px;
            margin-right: -6px;
            font-size: 20px;
            color: $color-primary;
            width: 108%;
            text-align: right;
        }
    }
</style>
