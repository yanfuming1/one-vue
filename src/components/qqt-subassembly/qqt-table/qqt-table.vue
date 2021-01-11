<template>
    <div class="table">
        <div class="qqt-table" :class="{'qqt-table_moving': dragState.dragging}">
            <div class="setting" v-if="isShowGroup">
                <el-dropdown trigger="hover" :hide-on-click="false" @visible-change="visibleChange">
                    <span>
                         <i class="icon iconfont iconshaixuan"></i>
                        <!-- <i class="el-icon-setting"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(col, index) in dropCol" :key="index">
                            <div v-if="col.prop">
                                <el-checkbox v-model="col.isShow"></el-checkbox>
                                {{col.label}}
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
                <!-- :height="option.height ? option.height :610" -->
            <el-table
                :data="tableData"
                :border="true"
                :default-expand-all="option.expand"
                :show-summary="option.isOpenSummary"
                :highlight-current-row="option.highlight"
                :max-height="option.maxHeight ? option.maxHeight : screenWidth"
                :style="{ width: parseInt(option.width)+'px' }"
                :cell-class-name="cellClassName"
                :row-class-name="tableRowClassName"
                :header-cell-class-name="headerCellClassName"
                :summary-method="getSummaries"
                :tree-props="{children: option.children}"
                row-key="id"
                @current-change="currentChange"
                @row-dblclick="rowDblclick"
                ref="table"
                @select="handleSelect"
                @select-all="handleSelectAll"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    v-if="isShowSelection"
                    :reserve-selection="isReserveSelection"
                    width="60">
                </el-table-column>
                <el-table-column
                    v-if="isShowRadio"
                    width="60">
                    <template slot-scope="scope">
                        <el-radio v-model="radio" :label="scope.row.id" @change.native="getCurrentRow(scope.row)" />
        　　　　　　</template>
                </el-table-column>
                <el-table-column
                    :label="'序号'"
                    type="index"
                    v-if="isShowIndex"
                    width="60px"
                    :index="indexMethod">
                </el-table-column>
                <el-table-column
                    v-for="(col, index) in dropCol"
                    v-if="col.isShow"
                    :show-overflow-tooltip='true'
                    :key="index"
                    :prop="col.prop"
                    :label="col.label"
                    :width="col.width"
                    :minWidth="col.minWidth"
                    :fixed="col.fixed"
                    :align="col.align"
                    :sortable="col.sortable"
                    :column-key="index.toString()">
                    <template slot="header" slot-scope="scope">
                        <div class="thead-cell"  v-if="isDrag && col.prop" @mousedown="handleMouseDown($event, (scope.$index - clickIndex))" @mousemove="handleMouseMove($event, (scope.$index - clickIndex))">
                            <span>{{ col.label }}</span>
                            <span class="virtual"></span>
                        </div>
                        <div v-else> {{ col.label }} </div>
                    </template>
                    <template slot-scope="scope">
                        <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                        <span v-else>
                            <span v-if="col.isMoney">{{ checkInput (scope.row[col.prop]) }}</span>
                            <span v-else > {{ scope.row[col.prop] }} </span>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="pageShow">
            <page-footer :current="data.current" :size="data.size" :total="data.total" @change="$emit('page', $event)"></page-footer>
        </div>
        <print-template-by-html v-if="isPrint" v-show="false" :printHeader="employPrintHeader" :code="tebleCode" ref="printTemp" />
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
    import { addDynamicHeader, getDynamicHeader, deleteDynamicHeader } from '../../../api/system/dynamicHeader'
    import { BASICSCODE } from '@/enum/PRINTTEMPLATE.js'

    import util from '../../../libs/util'
    import printTemplateByHtml from '../../../views/systemManagement/printTemplate/components/printTemplateByHtml'
    import ExportJsonExcel from 'js-export-excel';
    import Sortable from 'sortablejs';
    export default {

        name: 'qqt-table',

        props: {
            data: {
                type: Object,
                default: () => {
                    return {
                        records: [],
                        current: 1,
                        pages: 1,
                        size: 0,
                        total: 0
                    }
                }
            },
            option: {
                type: Object,
                default: function () {
                    return {
                        children: 'children',
                        isOpenSummary: false,
                        border: true,
                        key: 'id',
                        height: 600,
                        expand: false,
                        ignoreHeight: 0
                    }
                }
            },
            exportData: {
                type: Array,
                default: () => {
                    return []
                }
            },
            dynamicHeader: {
                type: Object,
                default: () => {
                    return {
                        tableId: '',
                        isSave: false,
                        isRemove: false,
                    }
                }
            },
            pageShow: {
                type: Boolean,
                default: true
            },
            isShowIndex: {
                type: Boolean,
                default: true
            },
            isShowSelection: {
                type: Boolean,
                default: true
            },
            isShowGroup: {
                type: Boolean,
                default: true
            },
            isDrag: {
                type: Boolean,
                default: true
            },
            isPrint: {
                type: Boolean,
                default: true
            },
            isRowDrag: {
                type: Boolean,
                default: false
            },
            isShowRadio: {
                type: Boolean,
                default: false
            },
            isReserveSelection: {
                type: Boolean,
                default: false
            },
            rowHeader: Array,
            selectable: Array
        },

        data () {
            return {
                tableData: this.data.records,
                dropCol: this.rowHeader,
                dragState: {
                    start: -9, // 起始元素的 index
                    end: -9, // 移动鼠标时所覆盖的元素 index
                    dragging: false, // 是否正在拖动
                    direction: undefined // 拖动方向
                },
                employPrintHeader: {},
                tebleCode: BASICSCODE.TABLE_PRINT,
                clickIndex: 0,
                name : '',
                screenWidth: null,
                radio: false
            }
        },

        methods: {

            // element ui 不推荐直接创建dom元素 弃用
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

            /**
             * 按下鼠标开始拖动
             * {e} 当前点击的dom元素
             * {column} 点击 header 头部的下标
             */
            handleMouseDown (e, column) {
                this.dragState.dragging = true
                this.dragState.start = parseInt(column)
                // 给拖动时的虚拟容器添加宽高
                let table = document.getElementsByClassName('qqt-table')[0]
                let virtual = document.getElementsByClassName('virtual')
                for (let item of virtual) {
                    item.style.height = table.clientHeight - 1 + 'px'
                    item.style.width = item.parentElement.parentElement.clientWidth + 'px'
                }
                // 添加事件
                document.addEventListener('mouseup', this.handleMouseUp);
            },

            // 鼠标放开结束拖动
            handleMouseUp () {
                this.dragColumn(this.dragState)
                document.removeEventListener('mouseup', this.handleMouseUp)
                // 初始化拖动状态
                this.resetState ()
            },

            // 拖动中
            handleMouseMove (e, column) {
                if (this.dragState.dragging) {
                    // 记录起始列
                    let index = parseInt(column)
                    if (index - this.dragState.start !== 0) {
                        this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
                        this.dragState.end = parseInt(column)
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
                let show = []
                let noShow = []
                if (direction == null) return
                let left = direction === 'left'
                let min = left ? end : start - 1
                let max = left ? start + 1 : end
                this.dropCol.filter (item => {
                    if (item.isShow) {
                        show.push (item)
                    } else {
                        noShow.push (item)
                    }
                })
                show.filter ((item, index) => {
                    if (index === end) {
                        tempData.push(show[start])
                    } else if (index > min && index < max) {
                        tempData.push(show[ left ? index - 1 : index + 1 ])
                    } else {
                        tempData.push(show[index])
                    }
                })
                tempData.push.apply(tempData, noShow)
                this.dropCol = tempData
                this.initUploadData ()
                this.neatenSaveData (JSON.parse(JSON.stringify(tempData)))
            },

            headerCellClassName ({column, columnIndex}) {
                let active = columnIndex - this.clickIndex === this.dragState.end ? `darg_active_${this.dragState.direction}` : ''
                let start = columnIndex - this.clickIndex === this.dragState.start ? `darg_start` : ''
                return `${active} ${start}`
            },

            // columnIndex - 2 是因为table渲染的数据之前存在 复选框和序号 两个el-table-column
            cellClassName ({column, columnIndex}) {
                return (columnIndex - this.clickIndex === this.dragState.start ? `darg_start` : '')
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

            handleSelect (val) {
                this.$emit('selection', val)
            },

            handleSelectAll (val) {
                this.$emit('selectionAll', val)
            },

            currentChange (currentRow, oldCurrentRow) {
                this.$emit('currentChange', currentRow, oldCurrentRow)
            },
            rowDblclick (row, column, event) {
                this.$emit('rowDblclick', row, column, event)
            },
            indexMethod(index) {
                return index + 1 ;
            },

            getDynamicHeaderList () {
                if (this.dynamicHeader.isSave) {
                    getDynamicHeader ({'tableId': this.dynamicHeader.tableId}).then (res => {
                        if (res && res.json) {
                            let header = JSON.parse(res.json)
                            let index = -1
                            header.forEach(item => {
                                index = this.rowHeader.findIndex(i => i.prop === item.prop)
                                if (index !== -1) {
                                    item['render'] = this.rowHeader[index].render
                                    item['isShow'] = item['isShow'] ? this.rowHeader[index].isShow : false
                                }
                            })
                            this.dropCol = header
                            this.resetState ()
                        } else {
                            let data = this.dropCol
                            let item = {
                                json: JSON.stringify(data),
                                tableId: this.dynamicHeader.tableId
                            }
                            this.addDynamicHeaderJson(item, true)
                        }
                    })
                    this.initUploadData ()
                } else {
                    if (this.dynamicHeader && this.dynamicHeader.isRemove && this.dynamicHeader.tableId) {
                        deleteDynamicHeader ({'table': this.dynamicHeader.tableId}).then (res => {
                        })
                    }
                    this.initUploadData ()
                }
            },

            addDynamicHeaderJson (item, isLoader) {
                if (!this.dynamicHeader.isSave || this.dynamicHeader.tableId === '') {
                    return
                }
                this.$store.commit ('d2admin/loading/noAllowShow')
                addDynamicHeader (item).then(res => {
                    if (res.code === 200) {
                        this.resetState ()
                    }
                })
            },

            neatenSaveData (data) {
                let item = {
                    json: JSON.stringify(data),
                    tableId: this.dynamicHeader.tableId,
                    userId: util.cookies.get ('uuid')
                }
                this.addDynamicHeaderJson (item, false)
            },

            visibleChange (item) {
                if (!item) {
                    this.initUploadData ()
                    if (!this.dynamicHeader.isSave) { return }
                    this.neatenSaveData (JSON.stringify(this.dropCol))
                }
            },

            getSummaries (param) {
                const { columns, data } = param
                const sums = []
                let num = -1
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    num = this.dropCol.findIndex (r => r.prop === column.property)
                    if (num === -1) {
                        return
                    }
                    if (this.dropCol[num] && this.dropCol[num]['isOpenSummary'] === true && this.dropCol[num]['isShow'] === true ) {
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

            iterativelyCollateData (data, column) {
                let list = []
                data.map(item => {
                    list.push (Number(item[column.property] === null ? undefined : item[column.property]))
                    if (item[this.option.children] && item[this.option.children].length > 0) {
                        this.iterativelyCollateData (item[this.option.children], column, list)
                    }
                });
                return list
            },

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

            resetState () {
                this.dragState = {
                    start: -9,
                    end: -9,
                    dragging: false,
                    direction: undefined
                }
                this.$nextTick (() => { 
                    if (this.$refs.table) {
                        this.$refs.table.doLayout ()
                    }
                }) 
            },

            getExportExcel () {
                if (this.exportData.length === 0) {
                    this.$message.error('暂无支持导出的数据');
                    return 
                }
                let title = this.$route.meta.title;
                let option = {};
                option.fileName = title + new Date().getTime();
                let sheetFilterData = [];
                let sheetHeaderData = [];
                this.dropCol.forEach((item,index) => {
                    if (item.label !== '操作' && item.isShow) {
                        sheetFilterData.push(item.prop)
                        sheetHeaderData.push(item.label)
                    }
                });
                // sheetFilterData.unshift('index')
                // sheetHeaderData.unshift('序号')
                option.datas = [{
                    sheetData: this.exportData,
                    sheetName: 'sheet',
                    sheetFilter: sheetFilterData,
                    sheetHeader: sheetHeaderData //中文
                }
                ];
                let toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
                this.$message.success('导出成功');
            },

            toggleSelection(rows) {
                if (rows) {
                    this.$refs.table.toggleAllSelection();
                } else {
                    this.$refs.table.clearSelection();
                }
            },

            

            initUploadData () {
                if (!this.isPrint) return
                let header = [ { title: '序号', fixed: false, align: 'center', checked: true, columnId: 'index' } ], 
                    staticValue = [ { title: '序号', field: 'index', align: 'center', checked: true, fixed: false } ],
                    data = {key: 'defaultModule.table', value: [], staticValue: []}
                this.dropCol.forEach((item) => {
                    if (item.label !== '操作' && item.isShow) {
                        header.push (
                            {
                                title: item.label,
                                fixed: false,
                                align: "center",
                                checked: true,
						        columnId: item.prop
                            }
                        )
                        staticValue.push (
                            {
                                title: item.label,
                                field: item.prop,
                                align: 'center',
                                checked: true,
                                fixed: false
                            }
                        )
                    }
                })
                data.value.push (header)
                data.staticValue.push (staticValue)
                this.employPrintHeader = data
            },

            printTable (data, field = 'createTime') {
                let item = {}, num = 1
                if (this.tableData && this.tableData.length == 0) return
                if (data && data.length > 0) {
                    data.forEach (res => { res['index'] = num++ })
                    item['tableConter'] = data
                    item['time'] = data[0][field] ? `${data[0][field]} - ${data[data.length - 1][field]}` : ''
                } else {
                    this.tableData.forEach (res => { res['index'] = num++ })
                    item['tableConter'] = this.tableData
                    item['time'] = this.tableData[0][field] ? `${this.tableData[0][field]} - ${this.tableData[this.tableData.length - 1][field]}` : ''
                }
                console.log('777777777777777777');
                let time = new Date()
                item['name'] = util.cookies.get('companyName') + this.$route.meta.title
                item['user'] = util.cookies.get('username')
                item['printTime'] = time.toLocaleString()
                this.$refs.printTemp.printTemplate (item)
            },

            getCurrentRow (data) {
                this.radio = data.id
                this.$emit ('radioChange', data)
            },

            updataMaxHeight () {

                let height = '', ignoreHeight = 0
                ignoreHeight = this.option.ignoreHeight || 0
                if (document.getElementsByClassName('qqt-container-full__header').length > 0) {
                    height = document.getElementsByClassName('qqt-container-full__header')[0].clientHeight
                } else if (document.getElementsByClassName('d2-container-full__header').length > 0) {
                    height = document.getElementsByClassName('d2-container-full__header')[0].clientHeight
                }

                this.screenWidth = document.body.clientHeight - height - 250 - ignoreHeight + "px"
            }
        },

        components: {
            'ex-slot': exSlot,
            'page-footer': pageFooter,
            'print-template-by-html': printTemplateByHtml
        },

        watch: {
            rowHeader (val, oldVal) {
                this.dropCol = val
                this.initUploadData ()
                this.updataMaxHeight ()
            },
            data:{
                deep: true,
                handler (value) {
                    this.tableData = value.records;
                }
            },
        },

        created () {
            this.clickIndex = this.isShowIndex ? 1 : 0
            this.clickIndex += this.isShowSelection ? 1 : 0
            this.clickIndex += this.isShowRadio ? 1 : 0
            this.getDynamicHeaderList ()
        },

        mounted() {
            if (this.isRowDrag) {
                const table = document.querySelector('.el-table__body-wrapper tbody')
                const _this = this
                Sortable.create(table, {
                    onEnd({ newIndex, oldIndex }) {
                        const targetRow = _this.data.records.splice(oldIndex, 1)[0]
                        _this.data.records.splice(newIndex, 0, targetRow)
                    }
                })
                this.tableData = this.data.records
            }

            this.updataMaxHeight ()
            window.onresize = () => {
                this.updataMaxHeight ()
            }
        }
    }
</script>

<style lang="scss">
    .table {
        position: relative;
        .qqt-table {
            height: 100%;
            .el-table {
                overflow: visible !important;
            }
            .el-table .select-row {
                background-color: $color-bg4
            }
            .el-table .darg_start {
                background-color: $color-bg2;
            }
            .el-table__body tr.current-row > td {
                background-color: $color-table__body-bg;
            }
            .el-table th {
                padding: 0;
                background-color: $color-head-bg;
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
                cursor: pointer;
                overflow: initial;
                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                }
            }
            .el-table .cell {
                div {
                    text-overflow: ellipsis;
                    overflow: hidden;
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

            .el-table tr td {
                padding: 0 0;
            }
            .setting {
                position: absolute;
                right: 15px;
                .iconshaixuan:before {
                    position: absolute;
                    right: 5px;
                    z-index: 99;
                    font-size: 15px;
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
            .typefaceColor {
                color: $color-button-typeface1;
                cursor: pointer;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .forbidden {
                border-radius: 50%;
                width: 7px;
                height: 7px;
                background: $forbidden;
                position: relative;
                top: -1px;
                right: 5px;
                display: inline-block
            }
            .startusing {
                border-radius: 50%;
                width: 7px;
                height: 7px;
                background: $startusing;
                position: relative;
                top: -1px;
                right: 5px;
                display: inline-block
            }
            .off {
                padding-right: 10px;
                float: left;
                color: #999
            }
            .on {
                padding-right: 10px;
                color: #409EFF;
                float: left;
            }

            .danger-Color {
                color: $color-danger;
                display: inline-block;
            }
            
            .warning-Color {
                color: $color-warning;
                display: inline-block;
            }

            .success-Color {
                color: $color-success;
                display: inline-block;
            }
        }
        .el-radio__label {
            display: none;
        }
        .isDisplay {
            display: none;
        }
        .el-table__footer-wrapper, .el-table__header-wrapper {
            background: $color-head-bg
        }
        .operation-btn { 
            position: absolute; 
            right: 0px; 
            display: none;
            .el-button{ padding: 3px; }
            .el-button+.el-button { margin-left: 5px; }
        }
        tbody .el-table__row:hover .operation-btn { display: inline-flex; }
    }
</style>
