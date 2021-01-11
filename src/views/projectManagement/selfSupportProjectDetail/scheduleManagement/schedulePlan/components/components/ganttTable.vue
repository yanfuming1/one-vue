<template>
    <!-- <el-table class="tb-edit" ref="multipleTable" highlight-current-row border :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange"> -->
    <el-table class="tb-edit" ref="multipleTable" border :data="tableData" tooltip-effect="dark" @row-dblclick="rowDblClick" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" v-if="!subPage"></el-table-column>
        <el-table-column prop="number" label="序号" width="150">
            <template slot-scope="scope">
                <div :style="'padding-left:' + (scope.row.rankNumber-1)*10 + 'px'" v-if="!subPage">
                    <span :style="'color:' + gradeColor[scope.row.rankNumber-1]">{{scope.row.number}}</span>
                </div>
                <div v-else>{{scope.row.number}}</div>
            </template>
            </el-table-column>
        <el-table-column prop="name" label="名称" width="241">
            <template slot-scope="scope">
                <div class="name-div">
                    <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
                        <span class="name-text" :style="'color:' + gradeColor[scope.row.rankNumber-1]">{{scope.row.name}}</span>
                    </el-tooltip>
                    <span class="operation-btn" v-if="!subPage">
                        <el-button icon="el-icon-edit" type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
                        <el-button icon="el-icon-plus" type="primary" plain size="mini" @click="handleAdd(scope.$index, scope.row)"></el-button>
                        <el-button icon="el-icon-delete" type="danger" plain size="mini" @click="handleDel(scope.$index, scope.row)"></el-button>
                    </span>
                    <span class="operation-btn" v-if="isEdit">
                        <el-button icon="el-icon-edit" type="primary" plain size="mini" @click="handleEdit(scope.$index, scope.row)"></el-button>
                    </span>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="前置任务" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.prepositionTaskName}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="计划开工日期" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.planStartDate}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="计划完工日期" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.planEndDate}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="计划工期" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.planLimit}} 天</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="任务负责人" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.taskPrincipal}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="审批状态" v-if="!subPage" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.procState}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="待办人" v-if="!subPage" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.agent}}</span>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="审核状态" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.address}}</span>
            </template>
        </el-table-column> -->
        <el-table-column prop="address" label="编制人" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.createName}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="上报时间" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="备注" width="250" show-overflow-tooltip>
            <template slot-scope="scope">
                <span>{{scope.row.remark}}</span>
            </template>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    props: {
        taskData: {
            type: Array,
            default: () => { return [] }
        },
        gradeColor: {
            type: Array,
            default: () => { return [] }
        },
        subPage: {
            type: Boolean,
            default: false
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableData: []
        }
    },
    methods: {
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },

        handleAdd (index, row) {
            this.$emit('addChild', row.id)
        },

        handleEdit (index, row) {
            this.$emit('editPlan', row.id)
        },

        handleDel (index, row) {
            this.$emit('delChild', row)
        },

        handleSelectionChange(val) {
            this.$emit('handleSelectionChange', val)
        },

        rowDblClick (row, column, event) {
            // this.$emit('editPlan', row.id)
        }

    },
    watch: {
        taskData: {
            deep: true,
            immediate: true,
            handler (val) {
                this.tableData = val
            }
        }
    }
}
</script>
<style lang="scss">
.tb-edit {
    height: 100%;
    .name-div{ 
        position: relative;
        display: flex;
        .name-text {
            display: inline-block;
            width: 175px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .el-table__header-wrapper thead tr { height: 47px; th { border-bottom: 2px solid #EBEEF5; box-sizing: border-box; } }
    .el-table__body-wrapper{
        height: calc(100% - 50px);
        .operation-btn { 
            position: absolute; 
            right: 0px; 
            display: none;
            padding-top: 2px;
            .el-button{ padding: 3px; }
            .el-button+.el-button{ margin-left: 5px; }
        }
        tbody .el-table__row:hover .operation-btn { display: inline-flex; }
        tbody .el-table__row:first-child { height: 43px; }
        .el-table__row {
            height: 45px;
            td { padding: 6px 0px; }
        }
    }
}
</style>