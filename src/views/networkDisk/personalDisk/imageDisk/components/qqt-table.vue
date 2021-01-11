<template>
    <div class="table">
        <div class="qqt-table" :class="{'qqt-table_moving': dragState.dragging}">
            <div class="setting" v-if="isShowGroup">
                <el-dropdown trigger="click" :hide-on-click="false" @visible-change="visibleChange">
                    <span>
                         <i class="icon iconfont iconshaixuan"></i>
                        <!-- <i class="el-icon-setting"></i> -->
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(col, index) in dropCol" :key="index">
                            <el-checkbox v-model="col.isShow"></el-checkbox>
                            {{col.label}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
                <!-- :height="option.height ? option.height :610" -->
            <el-form :model="details" ref="ruleForms">
            <el-table
                :data="tableData"
                :border="false"
                :height="tableData && tableData.length > 0  ? (option.height ? option.height :605) : 300"
                :show-summary="option.isOpenSummary"
                :highlight-current-row="option.highlight"
                :max-height="option.maxHeight"
                :style="{ width: parseInt(option.width)+'px' }"
                :cell-class-name="cellClassName"
                :row-class-name="tableRowClassName"
                :header-cell-class-name="headerCellClassName"
                :summary-method="getSummaries"
                :tree-props="{children: option.children}"
                row-key="id"
                @current-change="currentChange"
                @row-dblclick="rowDblclick"
                @row-contextmenu="rowContextClick"
                ref="table"
                @selection-change="handleSelectionChange">
                <el-table-column
                    type="selection"
                    v-if="isShowSelection"
                    width="60">
                </el-table-column>
                <!-- <el-table-column
                    :label="'序号'"
                    type="index"
                    v-if="isShowIndex"
                    width="60px"
                    :index="indexMethod">
                </el-table-column> -->
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
                        <div class="thead-cell"  v-if="isDrag" @mousedown="handleMouseDown($event, (scope.$index - clickIndex))" @mousemove="handleMouseMove($event, (scope.$index - clickIndex))">
                            <span>{{ col.label }}</span>
                            <span class="virtual"></span>
                        </div>
                        <div v-else> {{ col.label }} </div>
                    </template>
                    <template slot-scope="scope">
                        <div v-if="col.type === 'name'">
                            <div v-if="scope.row.newFolder">
                                <el-form-item style="margin-bottom:0px;">  
                                    <el-input  placeholder="请输入文件夹名称" size="mini" @input="changeFolder" v-model="scope.row[col.prop]" style="width:150px;margin-right:10px;"></el-input>
                                    <el-button size="mini" type="primary" icon="el-icon-check" @click="newFolder" circle></el-button>
                                    <el-button size="mini" type="info" icon="el-icon-close" @click="cancelNewFolder" circle style="margin-left:10px;"></el-button>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <div v-if="scope.row.reName">
                                    <el-input v-model="scope.row[col.prop]" size="mini" style="width:150px;margin-right:10px;"></el-input>
                                    <el-button size="mini" type="primary" icon="el-icon-check" @click="reName(scope.row, scope.$index)" circle></el-button>
                                    <el-button size="mini" type="info" icon="el-icon-close" @click="cancelReName(scope.row)" circle style="margin-left:10px;"></el-button>
                                </div>
                                <ex-slot v-else :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                            </div>
                        </div>
                        <div v-else>
                            <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
                            <span v-else > {{ scope.row[col.prop] }} </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            </el-form>
        </div>
        <div v-if="pageShow">
            <page-footer :current="data.current" :size="data.size" :total="data.total" @change="$emit('page', $event)"></page-footer>
        </div>
        <d2-contextmenu
          :visible.sync="contextmenuFlag"
          :x="contentmenuX"
          :y="contentmenuY">
          <d2-contextmenu-list
            :menulist="contextmenuList"
            @rowClick="contextmenuClick"/>
        </d2-contextmenu>
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
            },
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

    import pageFooter from '../../../../../layout/header-aside/components/footer'
    import { addDynamicHeader, getDynamicHeader, deleteDynamicHeader } from '../../../../../api/system/dynamicHeader'
    import { resourceReName } from '../../../../../api/disk/personalImage'
    import util from '../../../../../libs/util'
    import ExportJsonExcel from 'js-export-excel';
    import Sortable from 'sortablejs';
    export default {
        name: 'qqt-table',
        props: {
            // 从网盘模块使用
            fromDisk: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => {
                    return {
                        records: [],
                        current: 1,
                        pages: 1,
                        size: 0,
                        total: 0,
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
                        height: 600
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
                        isSave: false
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
            isRowDrag: {
                type: Boolean,
                default: false
            },
            rowHeader: Array,
            identification: {
                type: String,
                default: ''
            }
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
                clickIndex: 0,
                name : '',
                // 选择的数据
                selectList: [],
                selectItem: {},
                // 右键的内容
                contextmenuFlag: false,
                contentmenuX: 0,
                contentmenuY: 0,
                contextmenuList: [
                    // { icon: 'gears', title: '权限设置', value: 'limits' },
                    // { icon: 'share-alt', title: '分享', value: 'share' },
                    // { icon: 'cloud-download', title: '下载', value: 'download' },
                    // { icon: 'files-o', title: '复制到', value: 'copy' },
                    // { icon: 'refresh', title: '重命名', value: 'rename' },
                    // { icon: 'exchange', title: '移动到', value: 'moveto' },
                    // { icon: 'trash-o', title: '删除', value: 'delete' },
                ],
                details: {
                    list: []
                },
                folderName: ''
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
                // 初始化拖动状态
                this.resetState ()
                document.removeEventListener('mouseup', this.handleMouseUp);
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
                this.selectList = val
                this.$emit('selectionChange', val)
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
                                    item['isShow'] = this.rowHeader[index].isShow
                                }
                            })
                            this.dropCol = header
                        } else {
                            let data = this.dropCol
                            let item = {
                                json: JSON.stringify(data),
                                tableId: this.dynamicHeader.tableId
                            }
                            this.addDynamicHeaderJson(item, true)
                        }
                    })
                } else {
                    if (this.dynamicHeader && this.dynamicHeader.tableId) {
                        deleteDynamicHeader ({'table': this.dynamicHeader.tableId}).then (res => {
                        })
                    }
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
                if (!this.dynamicHeader.isSave) { return }
                if (!item) {
                    let data = JSON.parse(JSON.stringify(this.dropCol))
                    this.neatenSaveData (data)
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

            // 表格右键
            rowContextClick (row, column, event) {
                this.selectItem = row
                event.preventDefault()
                if(this.fromDisk){
                    this.contentmenuX = event.clientX
                    this.contentmenuY = event.clientY
                    this.contextmenuFlag = true
                }
            },
            contextmenuClick (command) {
                this.handleControlItemClick(command)
            },
            // 网盘右键的方法
            handleControlItemClick (command) {
                this.$emit("rowOperation", command, this.selectItem)
                this.contextmenuFlag = false
            },

            newFolder(){
                if(this.folderName === ""){
                    this.$message.warning("请输入文件夹的名称!!!")
                } else {
                    this.$emit("createFolder", this.folderName)
                }
            },
            cancelNewFolder(){ 
                this.$emit("cancelCreateFolder")
            },
            changeFolder(value){
                this.folderName = value
            },

            // 重命名
            setRenameItem (row) {
                this.tableData.forEach((item,index) => {
                    if(item.id === row.id){
                        this.$set(this.tableData[index],'reName', true)
                    }
                })
            },
            // 重命名
            reName (row, index) {
                if(row.resourcetype === '1') {
                    // 文件夹直接重命名
                    this.reNameMethods(row)
                } else {
                    if(row.name.lastIndexOf('.') === -1){
                        util.confirm('修改了文件扩展名，可能会导致文件不可用，确定要修改吗？').then(res => {
                            if(res) { this.reNameMethods(row) } 
                            else { this.cancelReName() }
                        })
                    } else {
                        this.reNameMethods(row)
                    }
                }
            },
            cancelReName (row) {
                this.$message.warning("取消重命名")
                this.$emit('refreshData')
            },
            // 调用重命名方法
            reNameMethods (row) {
                resourceReName(row).then(data => {
                    if(data.code === 200){
                        this.$message.success("重命名成功~~~")
                        this.$emit('refreshData')
                    }
                })
            },
            setRightMenu (type) {
                this.contextmenuList = [
                    { icon: 'share-alt', title: '分享', value: 'share' },
                    { icon: 'files-o', title: '复制到', value: 'copy' },
                    { icon: 'refresh', title: '重命名', value: 'rename' },
                    { icon: 'exchange', title: '移动到', value: 'moveto' },
                ]
                if (type === '0') {
                    // 公司网盘有按钮权限限制
                    if (this.$has('resmanage:resourceManage:fuzhi')) {
                        this.contextmenuList.push({ icon: 'cloud-download', title: '下载', value: 'download' })
                    }
                    if (this.$has('resmanage:resourceManage:deleteBatch')) {
                        this.contextmenuList.push({ icon: 'trash-o', title: '删除', value: 'delete' })
                    }
                    if (this.$has('resmanage:respermission:queryByResId')) {
                        this.contextmenuList.push({ icon: 'gears', title: '权限设置', value: 'limits' })
                    }
                } else {
                    this.contextmenuList = this.contextmenuList.concat( [
                        { icon: 'cloud-download', title: '下载', value: 'download' },
                        { icon: 'trash-o', title: '删除', value: 'delete' },
                        { icon: 'gears', title: '权限设置', value: 'limits' },
                    ])
                }
            }
        },

        components: {
            'ex-slot': exSlot,
            'page-footer': pageFooter,
            D2Contextmenu: () => import('../../../../../layout/header-aside/components/contextmenu'),
            D2ContextmenuList: () => import('../../../../../layout/header-aside/components/contextmenu/components/contentmenuList')
        },

        watch: {
            rowHeader (val, oldVal) {
                this.dropCol = val
            },
            data:{
                deep: true,
                immediate: true,
                handler (value) {
                    this.tableData = JSON.parse(JSON.stringify(value.records))
                }
            },
            identification (val, oldVal) {
                this.setRightMenu (val)
            }
        },

        created () {
            this.clickIndex = this.isShowIndex ? 1 : 0
            this.clickIndex += this.isShowSelection ? 1 : 0
            this.getDynamicHeaderList ()
            this.setRightMenu(this.identification)
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
            .el-button+.el-button {
                margin-left: 20px !important;
            }
            .typefaceColor {
                color: $color-button-typeface1;
                cursor: pointer;
                display: inline-block;
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
        }
        .el-table__footer-wrapper, .el-table__header-wrapper {
            background: $color-head-bg
        }
    }
</style>
