<template>
    <div class="archiveRegistrationTable">
        <el-form :model="details" ref="ruleForms">
            <div class="table">
                <el-table
                    :data="details.list"
                    :border="option.border"
                    :height="option.height"
                    :max-height="option.maxHeight"
                    :style="{ width: parseInt(option.width)+'px' }">
                    <el-table-column
                        v-for="(col, index) in rowHeader"
                        :key="index"
                         v-if="col.isShow"
                        :align="col.align"
                        :prop="col.prop"
                        :label="col.label"
                        :width="col.width">
                        <template slot-scope="scope">
                            <el-form-item
                                v-if="col.children == null"
                                :prop="'list.' + scope.$index + '.'+ col.prop"
                                :rules="col.required ? rules[col.prop] : {}">
                                <qqt-input
                                    v-if="col.type === 'text'"
                                    :size="'mini'"
                                    :class="{'borderInput': !scope.row[('isShow' + col.prop)]}" 
                                    :readonly="!scope.row[('isShow' + col.prop)]"
                                    :value="scope.row[col.prop]"
                                    ref="qqtInput"
                                    @focus="focus (scope.row, col.prop)" 
                                    @blur="blur (scope.row, col.prop)" 
                                    @input="scope.row[col.prop] = $event"
                                ></qqt-input>
                                 <qqt-select
                                    v-if="col.type === 'select'"
                                    :options="col.options"
                                    :value="scope.row[col.prop]"
                                    :isClearable="false"
                                    :class="{'select': !scope.row[('isShow' + col.prop)]}"
                                    @focus="focus (scope.row, col.prop)" 
                                    @blur="blur (scope.row, col.prop)" 
                                    @select="scope.row[col.prop] = $event,selectChange(scope.row, col.prop)" 
                                ></qqt-select>
                            </el-form-item>
                            <el-form-item
                                v-else
                                :class="{'fromItem': col.children.length > 0}"
                                v-for="(item, index) in col.children" :key="index"
                                :prop="'list.' + scope.$index + '.'+ item.value"
                                :rules="item.required ? rules[item.value] : {}">
                                    <qqt-input
                                        class="storage"
                                        :style="{width: col.width ? col.width + 'px' : '100%'}"
                                        :size="'mini'"
                                        :btnTitle="item.label"
                                        :class="{'borderInput': !scope.row[('isShow' + item.value)]}" 
                                        :readonly="!scope.row[('isShow' + item.value)]"
                                        :value="scope.row[item.value]"
                                        ref="qqtInput"
                                        @focus="focus (scope.row, item.value)" 
                                        @blur="blur (scope.row, item.value)" 
                                        @input="scope.row[item.value] = $event"
                                    ></qqt-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
    </div>
</template>

<script>

    import { qqtInput, qqtSelect } from '../../../../../components/qqt-subassembly'
    export default {

        props: {
            rowHeader: Array,
            data: Array,
            option: {
                type: Object,
                default: function () {
                    return {
                        border: true,
                    }
                }
            },
            transform: {
                type: Object,
                default: () => {
                    return {
                        isShowDetails: true
                    }
                }
            }
        },

        components: {
            'qqt-input': qqtInput,
            'qqt-select': qqtSelect
        },

        data() {
            return {
                details: {
                    list: this.data,
                },
                multipleSelection: [],
                deleteIds: [],
                currentIndex: null,
                rules: {
                    'oencoding': [
                        { required: true, pattern: /^\w+$/, message: '不能为中文', trigger: 'blur' }
                    ],
                    'oshare': [
                        { required: true, pattern: /^[0-9]*$/, message: '只能为数字', trigger: 'blur' }
                    ],
                    'onumber': [
                        { required: true, pattern: /^[0-9]*$/, message: '只能为数字', trigger: 'blur' }
                    ],
                    'o1': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'o2': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'o3': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'o4': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'cencoding': [
                        { required: true, pattern: /^\w+$/, message: '不能为中文', trigger: 'blur' }
                    ],
                    'cshare': [
                        { required: true, pattern: /^[0-9]*$/, message: '只能为数字', trigger: 'blur' }
                    ],
                    'cnumber': [
                        { required: true, pattern: /^[0-9]*$/, message: '只能为数字', trigger: 'blur' }
                    ],
                    'c1': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'c2': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'c3': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'c4': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    'dencoding': [
                        { required: true, pattern: /^\w+$/, message: '不能为中文', trigger: 'blur' }
                    ],
                    'dshare': [
                        { required: true, pattern: /^[0-9]*$/, message: '只能为数字', trigger: 'blur' }
                    ],
                    'documentType': [
                        { required: true, message: '不能为空', trigger: 'change' }
                    ],
                    'storagepath': [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {

            indexMethod (index) {
                return index + 1 ;
            },

            verify (item) {
                let required = false
                if (this.$refs && this.$refs.ruleForms) {
                    this.$refs.ruleForms.validate(valid => {
                        if (!valid) {
                            required = false
                        } else {
                            required = this.details.list[0]
                        }
                    })
                }
                return required
            },

            archiveRegistrationTable (data) {
                data.filter ( item => {
                    this.rowHeader.filter ( r => {
                        item [('isShow' + r.prop)] = false
                    })
                })
                this.details.list = JSON.parse (JSON.stringify (data))
            },

            focus (data, prop) {
                if (!this.transform.isShowDetails) {
                    data[('isShow' + prop)] = true
                }
            },

            blur (data, prop) {
                data[('isShow' + prop)] = false
                this.$emit ('returnData', this.details.list[0])
            },
            selectChange (data) {
                this.$emit ('returnData',data)
            }
        },

        created() {
            this.archiveRegistrationTable (this.data)
        },

        watch: {
            data () {
                this.archiveRegistrationTable (this.data)
            }
        },
    }
</script>

<style lang="scss">
    .archiveRegistrationTable {
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
            padding: 0 0 0 0 !important
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
            padding: 0 5px
        }
        .el-form-item {
            margin-bottom: 0px;
        }
        .el-table .cell {
            padding-left: 0px !important;
            padding-right: 0px
        }
        .el-input-group__append, .el-input-group__prepend {
            border-radius: 0px;
            padding: 3px 0px;
            border: 1px solid transparent
        }
        .fromItem {
            float: left;
            width: 24.99%;
        }
        .storage {
            position: relative;
            top: 0px;
            right: 0px;
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
        .el-form-item__error {
            position: absolute !important;
            width: 160px;
            top: 33px;
            text-align: left;
        }
        .el-input--mini .el-input__inner {
            height: 50px !important;
            line-height: 50px !important;
        }
    }
</style>
