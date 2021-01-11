<template>
    <div class="qqt-table-tree">
        <el-table
            :data="data"
            :border="option.border"
            :height="option.height"
            :max-height="option.maxHeight"
            :style="{ width: parseInt(option.width)+'px' }"
            :row-key="option.key"
            @selection-change="handleSelectionChange">
            <el-table-column type="expand" v-if="option.children">
                <template slot-scope="props">
                    <qqt-table-tree :data="props.row[sonProp]" :rowHeader="sonRowHeader" :option="sonOption" />
                </template>
            </el-table-column>
            <el-table-column
                v-if="isShowSelection"
                type="selection"
                align="center"
                width="55">
            </el-table-column>
            <el-table-column
                v-if="isShowIndex"
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
                :width="col.width"
                :prop="col.prop"
            >
                <template slot-scope="scope">
                    <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                    <span v-else>
                        <span v-if="col.isMoney">{{ checkInput (scope.row[col.prop]) }}</span>
                        <span v-else > {{ scope.row[col.prop] }} </span>
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <page-footer v-if="isPageShow" :current="page.current" :size="page.size" :total="page.total" @change="$emit('page', $event)"></page-footer>
    </div>
</template>

<script>

    let exSlot = {
        functional: true,
        props: {
            row: Object,
            render: Function,
            index: Number,
            column: {
                type: Object,
                default: null
            }
        },
        render: (h, data) => {
            const params = {
                row: data.props.row,
                index: data.props.index
            };
            if (data.props.column) params.column = data.props.column;
            return data.props.render(h, params)
        }
    };


    import pageFooter from '../../../layout/header-aside/components/footer'
    export default {
        name: 'qqt-table-tree',

        props: {
            sonProp: String,
            rowHeader: Array,
            data: Array,
            sonData: Array,
            sonRowHeader: Array,
            isPageShow: {
                type: Boolean,
                default: false
            },
            sonOption: {
                type: Object,
                default: function () {
                    return {
                        children: false,
                        border: false,
                        key: 'id',
                        isLazy: true
                    }
                }
            },
            option: {
                type: Object,
                default: function () {
                    return {
                        children: 'children',
                        isOpenSummary: false,
                        border: false,
                        isLazy: false,
                        key: 'id'
                    }
                }
            },
            page: {
                type: Object,
                default: () => {
                    return {
                        current: 1,
                        pages: 1,
                        size: 0,
                        total: 0
                    }
                }
            },
            isShowIndex: {
                type: Boolean,
                default: false
            },
            isShowSelection: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
            }
        },

        methods: {

            handleSelectionChange () {

            },

            indexMethod (index) {
                return index + 1 ;
            }

        },

        components: {
            'page-footer': pageFooter,
            'ex-slot': exSlot
        },
    }
</script>

<style lang='scss'>
    .qqt-table-tree {
        .el-table__expanded-cell[class*=cell] {
            padding: 0 0 0 50px !important
        }
        .typefaceColor {
            color: $color-button-typeface1;
            cursor: pointer;
        }
    }
</style>
