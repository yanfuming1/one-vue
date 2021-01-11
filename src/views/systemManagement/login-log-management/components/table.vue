<template>
    <div class="qqt-table" :class="{'qqt-table_moving': dragState.dragging}">
        <div class="setting">
            <el-dropdown trigger="click" :hide-on-click="false">
                <span>
                    <i class="el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(col, index) in dropCol" :key="index">
                        <el-checkbox v-model="col.isShow"></el-checkbox>
                        {{col.label}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-table :data="data"
            :border="option.border"
            :height="option.height"
            :max-height="option.maxHeight"
            :style="{ width: parseInt(option.width)+'px' }"
            :cell-class-name="cellClassName"
            :row-class-name="tableRowClassName"
            :header-cell-class-name="headerCellClassName"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                :label="'序号'"
                type="index"
                width="80px"
                :index="indexMethod">
            </el-table-column>
            <el-table-column v-for="(col, index) in dropCol" v-if="col.isShow"
                isShow:true
                :show-overflow-tooltip="true"
                :key="index"
                :prop="col.prop"
                :label="col.label"
                :column-key="index.toString()"
                :render-header="renderHeader">
                <template slot-scope="scope">
                    <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                    <span v-else>
                    {{ scope.row[col.prop] }}
                </span>
                </template>
            </el-table-column>
        </el-table>
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

export default {
    name: 'qqt-table',
    props: {
        data: Array,
        rowHeader: Array,
        option: {
            default: function () {
                return {}
            },
            type: Object
        }
    },
    data () {
        return {
            dropCol: this.rowHeader,
            dragState: {
                start: -9, // 起始元素的 index
                end: -9, // 移动鼠标时所覆盖的元素 index
                dragging: false, // 是否正在拖动
                direction: undefined // 拖动方向
            }
        }
    },
    methods: {
        renderHeader (createElement, {column}) {
            return createElement(
                'div', {
                    'class': ['thead-cell'],
                    on: {
                        mousedown: ($event) => { this.handleMouseDown($event, column) },
                        mousemove: ($event) => { this.handleMouseMove($event, column) }
                    }
                }, [
                    // 添加 <a> 用于显示表头 label
                    createElement('a', column.label),
                    // 添加一个空标签用于显示拖动动画
                    createElement('span', {
                        'class': ['virtual']
                    })
                ]
            )
        },
        // 按下鼠标开始拖动
        handleMouseDown (e, column) {
            this.dragState.dragging = true
            this.dragState.start = parseInt(column.columnKey)
            // 给拖动时的虚拟容器添加宽高
            let table = document.getElementsByClassName('qqt-table')[0]
            let virtual = document.getElementsByClassName('virtual')
            for (let item of virtual) {
                item.style.height = table.clientHeight - 1 + 'px'
                item.style.width = item.parentElement.parentElement.clientWidth + 'px'
            }
            document.addEventListener('mouseup', this.handleMouseUp);
        },
        // 鼠标放开结束拖动
        handleMouseUp () {
            this.dragColumn(this.dragState)
            // 初始化拖动状态
            this.dragState = {
                start: -9,
                end: -9,
                dragging: false,
                direction: undefined
            }
            document.removeEventListener('mouseup', this.handleMouseUp);
        },
        // 拖动中
        handleMouseMove (e, column) {
            if (this.dragState.dragging) {
                // 记录起始列
                let index = parseInt(column.columnKey)
                if (index - this.dragState.start !== 0) {
                    this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
                    this.dragState.end = parseInt(column.columnKey)
                } else {
                    this.dragState.direction = undefined
                }
            } else {
                return false
            }
        },

        // 拖动易位
        dragColumn ( { start, end, direction } ) {
            let tempData = []
            if (direction == null) return
            let left = direction === 'left'
            let min = left ? end : start - 1
            let max = left ? start + 1 : end
            for (let i = 0; i < this.dropCol.length; i++) {
                if (i === end) {
                    tempData.push(this.dropCol[start])
                } else if (i > min && i < max) {
                    tempData.push(this.dropCol[ left ? i - 1 : i + 1 ])
                } else {
                    tempData.push(this.dropCol[i])
                }
            }
            this.dropCol = tempData
        },

        headerCellClassName ({column, columnIndex}) {
            let active = columnIndex - 2 === this.dragState.end ? `darg_active_${this.dragState.direction}` : ''
            let start = columnIndex - 2 === this.dragState.start ? `darg_start` : ''
            return `${active} ${start}`
        },

        cellClassName ({column, columnIndex}) {
            return (columnIndex - 2 === this.dragState.start ? `darg_start` : '')
        },

        tableRowClassName ({row, rowIndex}) {
            rowIndex += 1
            if (rowIndex % 2 === 0) {
                return 'select-row'
            }
        },

        // 获取选中的数据
        handleSelectionChange (val) {
            this.$emit('selectionChange', val)
        },

        indexMethod(index) {
            return index + 1 ;
        }
    },
    components: {
        exSlot
    },
    watch: {
        rowHeader (val, oldVal) {
            this.dropCol = val
        }
    }
}
</script>

<style lang="scss">
    .qqt-table {
        .el-table .darg_start {
            background-color: $color-bg2;
        }
        .el-table th {
            padding: 0;
            .virtual{
                position: fixed;
                display: block;
                width: 0;
                height: 0;
                margin-left: -10px;
                background: none;
                border: none;
            }
            &.darg_active_left {
                .virtual {
                    border-left: 2px dotted $color-straight-line;
                    z-index: 99;
                }
            }
            &.darg_active_right {
                .virtual {
                    border-right: 2px dotted $color-straight-line;
                    z-index: 99;
                }
            }
        }
        .thead-cell {
            padding: 0;
            display: inline-flex;
            flex-direction: column;
            /*align-items: left;*/
            cursor: pointer;
            overflow: initial;
            &:before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
        }
        &.qqt-table_moving {
            .el-table th .cell .thead-cell{
                cursor: move !important;
            }
            .el-table__fixed {
                cursor: not-allowed;
            }
        }

        .el-table .select-row {
            background: $color-table-stripe;
        }

        .el-table tr td {
            padding: 0 0;
        }
        .setting {
            position: absolute;
            right: 0px;
            .el-icon-setting:before {
                position: absolute;
                right: 20px;
                z-index: 99;
                font-size: 20px;
            }
            .setting-left {
                padding-right: 10px;
            }
        }

        .el-popper[x-placement^=bottom] {
            margin-top: 23px;
        }

        .el-popper[x-placement^=bottom] .popper__arrow {
            top: -5px;
            left: 45% !important;
            margin-right: 3px;
            border-top-width: 0;
            border-bottom-color: $color-border-3;
        }
        .el-dropdown-link{
            color: $color-button-typeface1;
            padding-left: 20px;
            cursor: pointer;
        }
        .el-button+.el-button {
            margin-left: 20px !important;
        }
        .typefaceColor {
            color: $color-button-typeface1;
        }
    }
</style>
