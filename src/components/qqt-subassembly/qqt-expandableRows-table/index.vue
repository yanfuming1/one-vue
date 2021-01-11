<template>
    <div class="expandableRowsTable">
        <div class="table">
            <el-table
                :data="tableData"
                :border="option.border"
                :height="option.height"
                :max-height="option.maxHeight"
                :style="{ width: parseInt(option.width)+'px' }"
                :tree-props="{children: option.children}"
                :row-key="option.key"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    align="center"
                    width="55">
                </el-table-column>
                <el-table-column
                    type="index"
                    width="100px"
                    align="center"
                    label="序号"
                    :index="indexMethod">
                </el-table-column>
                <el-table-column
                    v-for="(col, index) in rowHeader"
                    :key="index"
                    :align="col.align"
                    :label="col.label"
                    :prop="col.prop">
                    <template slot-scope="scope">
                        <span v-if="col.type != null">
                            <qqt-input 
                                v-if="col.type === 'text'" 
                                :class="{'borderInput': !scope.row[('isShow' + col.prop)]}" 
                                :readonly="!scope.row[('isShow' + col.prop)]"
                                ref="qqtInput"
                                @focus="focus (scope.row, col.prop)" 
                                @blur="scope.row[('isShow' + col.prop)] = false" 
                                @input="getChangeData (scope.row, col.prop, $event)"
                                :value="scope.row[col.prop]"
                                :isMoneyType="true"
                            ></qqt-input>
                            <qqt-select
                                v-if="col.type === 'select'"
                                :options="defaultOption"
                                :value="scope.row[col.prop]"
                                :class="{'select': !scope.row[('isShow' + col.prop)]}"
                                @focus="scope.row[('isShow' + col.prop)] = true" 
                                @blur="scope.row[('isShow' + col.prop)] = false"
                                @select="getSelectChangeData (scope.row, col.prop, $event)" 
                            ></qqt-select>
                        </span>
                        <span v-if="col.type == null">
                            {{ scope.row[col.prop] }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import { qqtInput, qqtSelect } from '../../../components/qqt-subassembly'
    export default {
        props: {
            rowHeader: Array,
            data: Array,
            option: {
                type: Object,
                default: function () {
                    return {
                        children: 'children',
                        isOpenSummary: false,
                        border: false,
                        key: 'id'
                    }
                }
            },
            isShowElement: {
                type: Boolean,
                default: true
            },
            defaultOption: {
                type: Array,
                default: []
            },
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
        data() {
            return {
                multipleSelection: [],
                tableData: [],
                totalRow: {}
            }
        },

        methods: {

            loadData(oid) {
                
            },

            handleSelectionChange (val) {
                this.multipleSelection = val;
            },

            indexMethod (index) {
                return index + 1 ;
            },

            iterativeArrangementData (data, parentId) {
                data.filter ( item => {
                    item['currentState'] = ''
                    item['controlLine'] = ''
                    this.rowHeader.filter ( r => {
                        item [('isShow' + r.prop)] = false
                        item ['parentId'] = parentId
                    })
                    if (item[this.option.children] && item[this.option.children].length > 0) {
                        this.iterativeArrangementData (item[this.option.children], item[this.option.key])
                    }
                })
                this.tableData = JSON.parse (JSON.stringify (data))
            },

            focus (data, prop) {
                let item = this.filterData (data)
                if (item && item.astrictLine && item.astrictLine.length > 0) {
                    if (item.astrictLine.indexOf (prop) === -1) {
                        data[('isShow' + prop)] = true
                    }
                }
            },

            getChangeData (data, prop, value) {
                data[prop] = value
                let item = this.filterData (data)
                if (item && item.controlRow) {
                    this.neatenControlRow (data, item.controlRow)
                }

                if (this.totalRow['controlLine'] === prop) {
                    setTimeout(() => {
                        this.calculateTotalRow (this.totalRow)
                    }, 1000);
                }
            },

            getSelectChangeData (data, prop, value) {
                data[prop] = data['currentState'] = value
                let item = this.filterData (data)
                this.replacement (data)
                if (item && item.controlLine) {
                    data['controlLine'] = item.controlLine
                    this.calculateTotalRow (data, item)
                }
            },

            calculateTotalRow (item) {
                let id = ''
                let controlLine = {}
                let map = new Map()
                this.totalRow = JSON.parse (JSON.stringify (item))
                controlLine = this.neatenControlLine (this.tableData, map, id, item.controlLine)
                console.log (controlLine)
                this.neatenControlLineIterativeAssignment (this.tableData, controlLine)
            },

            filterData (data) {
                return this.defaultOption.find (f => f[this.defaultProp.value] === data['currentState'])
            },

            neatenControlRow (data, controlRow) {
                let list = ''
                let row = ''
                const expArr=['+', '-', '*', '/'];
                expArr.forEach (res => {
                    row = JSON.parse (JSON.stringify (controlRow.replace(/\s+/g, "")))
                    const p = res
                    const reg = new RegExp('(\\w+)['+ p +'](\\w+)')
                    while (reg.test(row)) {
                        row = row.replace(reg, function (m, p1, p2) {
                            if (list === '') {
                                list += parseFloat(data[p1]) + p + parseFloat(data[p2])
                            } else {
                                list = '(' + list + ')' + p + parseFloat(data[p2])
                            }
                        })
                        console.log (list)
                    }
                })
                let num = eval(list)
                console.log (num)
            },

            neatenControlLine (data, map, id, controlLine) {
                data.filter ((item, index) => {
                    
                    if (item['parentId'] === '0') {
                        id = ''
                    }
                    
                    if (item['controlLine']) {
                        id += id === '' ? item[this.option.key] : ',' + item[this.option.key]
                    }

                    if (id.indexOf (item[this.option.key]) === -1) {
                        map.set (id + ',' + item[this.option.key], item[controlLine])
                    }

                    if (item[this.option.children] && item[this.option.children].length > 0) {
                        this.neatenControlLine (item[this.option.children], map, id, controlLine)
                    }
                })
                return map
            },

            neatenControlLineIterativeAssignment (data, map) {
                data.filter (item => {
                    if (item[this.option.children] && item[this.option.children].length > 0) {
                        if (item['controlLine']) {
                            let number = 0
                            map.forEach ((value, key) => {
                                if (key.indexOf (item[this.option.key]) !== -1) {
                                    if (value !== '') {
                                        number += parseFloat (value)
                                    }
                                }
                            })
                            item[item['controlLine']] = this.$refs.qqtInput[0].checkInput (number)
                            this.neatenControlLineIterativeAssignment (item[this.option.children], map)
                        }
                    }
                })
            },

            replacement (data) {
                this.rowHeader.forEach (item => {
                    if (item.type === 'text') {
                        data[item.prop] = ''
                    }
                })
            }
        },

        created () {
            this.iterativeArrangementData (this.data, '0')
        },

        watch: {
            data () {
                this.iterativeArrangementData (this.data, '0')
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect
        }
    }
</script>

<style lang="scss">
    .expandableRowsTable {
        padding-top: 20px;
        .el-table--enable-row-hover .el-table__body tr:hover>td{
            background-color: #ffffff !important;
        }
        .bottom{
            padding: 20px 0
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
            padding: 0 !important
        }
        .el-table th {
            padding: 0 !important
        }
        .border .el-date-editor.el-input, .el-date-editor.el-input__inner{
            border: 1px solid transparent !important;
        }
        .borderInput .el-input__inner {
            border: 1px solid transparent !important;
        }
        .el-input__inner {
            border-radius: 0px !important;
            text-align: right
        }
        .el-select .el-input__inner {
            text-align: left;
        }
        .select .el-select .el-input .el-select__caret {
            color: #ffffff !important; 
        }
        .select .el-input__inner {
            border: 1px solid transparent !important;
        }
    }
</style>
