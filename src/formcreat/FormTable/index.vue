<template>
    <div class="form-table" :class="{'is-disabled': disabled}">
        <el-table
            :data="tableData"
            :show-summary="isShowSummary"
            :summary-method="getSummaries"
            row-key="id"
            border
        >
            <el-table-column
                label="序号"
                fixed
                width="50">
                <template slot-scope="scope">
                    <div :class="{'scope-index': transform.isShowDetails !== true}">
                        <span>{{scope.$index + 1}}</span>
                    </div>
                    <div class="scope-action" v-if="!transform.isShowDetails">
                        <el-button @click="handleRemove(scope.$index)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="columns.length==0"></el-table-column>
            <template v-else>
                <el-table-column
                    v-for="column in columns"
                    :key="column.key"
                    :label="column.name"
                    :width="column.options.width || 0"
                    :label-class-name="column.options.required ? 'required' : ''"
                >
                    <template slot-scope="scope"  >
                        <el-form-item
                            :prop="`${name}.${scope.$index}.${column.model}`"
                            :rules="rules[`${name}.${column.model}`]"
                        >
                            <GenerateElementItem
                                :edit="!disabled"
                                :blanks="blanks"
                                :is-table="true"
                                :widget="column"
                                v-model="scope.row[column.model]"
                                :models.sync="tableData[scope.$index]"
                                :remote-option="remoteOption"
                                @btnClick="emitTableColumn ($event, scope.$index, column.model, column.name)"
                                @input="onTableChange (column.model, scope.row[column.model], scope.$index)"
                                :transform="transform"
                                :remote="remote">
                                <template v-slot:[blank.name]="blankScope" v-for="blank in blanks" >
                                    <slot :name="blank.name" :model="scope.row"></slot>
                                </template>
                            </GenerateElementItem>
                        </el-form-item>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <el-button icon="el-icon-plus" type="text" @click="handleAddRow" v-if="!transform.isShowDetails">添加</el-button>
    </div>
</template>

<script>

export default {
    
    components: {
        GenerateElementItem: () => import('../GenerateElementItem.vue')
    },
    
    props: ['columns', 'value', 'models', 'remote', 'blanks', 'disabled', 'rules', 'name', 'remoteOption', 'transform', 'isShowSummary'],
    
    data () {
        return {
            tableData: this.value,
            param: {}
        }
    },

    methods: {
        
        handleAddRow () {
            let item = {}

            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i].type === 'blank') {
                    item[this.columns[i].model] = this.columns[i].options.defaultType == 'String' ? '' : (this.columns[i].options.defaultType == 'Object' ? {} : [])
                } else {
                    item[this.columns[i].model] = this.columns[i].options.defaultValue
                }
            }
            this.tableData.push(item)
        },

        getSummaries (param) {
            if (param) this.param = param
            const { columns, data } = param || this.param
            const sums = []
            let num = -1
            if (!columns) return
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                num = this.columns.findIndex (r => r.model === column.property)
                if (num === -1) {
                    return
                }
                if (this.columns[num] && this.columns[num]['isOpenSummary'] === true) {
                    const values = this.iterativelyCollateData (data, column)
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] = sums[index].toFixed(2)
                        sums[index] += ' 元';
                    } else {
                        sums[index] = '';
                    }
                }
            });
            return sums;
        },

        handleRemove (index) {
            this.tableData.splice(index, 1)
        },

        emitTableColumn (field, index, model, label) {
            this.$emit ('btnTableClick', this.name, index, this.tableData, field, model, label)
        },

        onTableChange (field, value, index) {
            this.$emit ('inputTableChange', field, value, index)
        }
    },

    watch: {
        transform: {
            deep: true,
            handler (val) {
                if (!val.isShowDetails && this.tableData.length === 0) {
                    this.handleAddRow ()
                }
            }
        },
        value: {
            deep: true,
            handler (val) {
                this.tableData = val
            }
        },
    },

    created () {
        if (!this.transform.isShowDetails && this.tableData.length === 0) {
            this.handleAddRow ()
        }
    }
}
</script>

<style lang="scss">
    .form-table{
        position: relative;

        .el-table th.required>div::before{
            content: '*';
            color: #f56c6c;
            margin-right: 4px;
            background: transparent;
            vertical-align: top;
        }

        .el-table td{
            padding-bottom: 0;
        }

        .el-table__header-wrapper{
            background: #f5f7fa;

            div,th{
            background: #f5f7fa;
            }
        }

        .el-table__fixed-header-wrapper{
            div,th{
            background: #f5f7fa;
            }
        }

        &.is-disabled{
            background-color: #F5F7FA;
            &::after{
            display: block;
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            cursor: no-drop;
            }
        }

        .el-table__empty-block{
            display: none;
        }

        .scope-action{
            display: none;
            margin-bottom: 18px;
        }

        .scope-index{
            display: block;
            margin-bottom: 18px;
        }

        .hover-row{
            .scope-action{
                display: block;
                .el-button{
                    padding: 3px;
                }
            }

            .scope-index{
                display: none;
            }
        }
    }
</style>
