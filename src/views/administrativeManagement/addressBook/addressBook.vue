<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <el-form :inline="true" ref="form" size="mini" @submit.native.prevent>
                    <el-form-item label prop="name">
                        <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            @keyup.enter.native="searchModelSynopsis"
                            style="width: 200px;"
                            v-model="filterText" />
                    </el-form-item>
                     <!-- <el-form-item>
                        <el-date-picker
                            size="mini"
                            v-model="createDate"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至" 
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :default-time="['08:00:00', '18:00:00']"
                            @change="searchModelSynopsis()" 
                            align="right">
                        </el-date-picker>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="searchModelSynopsis">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="resetModelSynopsis">重置</el-button>
                    </el-form-item>
                    <el-form-item label="是否在职:">
                        <div class="qqt-container-full-header-state___select">
                            <qqt-select :value="isJob" :options="options" :size="'mini'" :placeholder="'请选择'" @select="page.current = 1, page.size = 10, isJob = $event, searchModelSynopsis()"></qqt-select>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button-group>
                            <el-button size="mini" class="button-group" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                            <el-button size="mini" class="button-group" icon="el-icon-printer" @click="printTable()">打印</el-button>
                        </el-button-group>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        <div class="qqt-container-full___center">
            <qqt-table :data="tableData" ref="table" :exportData="tableData.records" :dynamicHeader="dynamicHeader" @selectionChange="selectChange" :rowHeader="rowHeader" :option="tableOption" @page="handlePaginationChange"></qqt-table>
        </div>
        <exhibition-addressBook v-if="dialogVisible" :dialogVisible="dialogVisible" :data="addressBookData" @close="closeDialog"/>
    </d2-container>
</template>

<script>
import { getAddressBookList } from '../../../api/administrativeManagement/addressBook'
import { qqtTable, qqtSelect } from '../../../components/qqt-subassembly'

import exhibitionAddressBook from './exhibitionAddressBook'
export default {
    data () {
        return {
            filterText: '',
            isJob: '',
            // 时间搜索
            // createDate: [],
            // pickerOptions: {
            //     shortcuts: [
            //         {
            //             text: '最近一周',
            //             onClick (picker) {
            //                 const end = new Date();
            //                 const start = new Date();
            //                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            //                 picker.$emit('pick', [start, end]);
            //             }
            //         }, 
            //         {
            //             text: '最近一个月',
            //             onClick(picker) {
            //                 const end = new Date();
            //                 const start = new Date();
            //                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            //                 picker.$emit('pick', [start, end]);
            //             }
            //         }, 
            //         {
            //             text: '最近三个月',
            //             onClick(picker) {
            //                 const end = new Date();
            //                 const start = new Date();
            //                 start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            //                 picker.$emit('pick', [start, end]);
            //             }
            //         }
            //     ]
            // },
            dialogVisible: true,
            tableData: {},
            addressBookData: {},
            dynamicHeader: {
                tableId: 'T_1572407935',
                isSave: false
            },
            options: [
                {
                    value: '0',
                    label: '否'
                },
                {
                    value: '1',
                    label: '是'
                }
            ],
            rowHeader: [
                {
                    prop: 'name',
                    label: '姓名',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {
                            on: { click: () => {  } }
                        }, [
                           h ('div', {
                                class: {
                                    'typefaceColor': true, 
                                },
                                on: {
                                    click: () => {
                                        this.dialogVisible = true
                                        this.addressBookData =  parms.row
                                    }
                                }
                           }, parms.row.name)
                        ], )
                    }
                },
                {
                    prop: 'companyId',
                    label: '工作单位',
                    isShow: true
                },
                {
                    prop: 'untitled',
                    label: '工作部门',
                    isShow: true
                },
                // 插入组件或标签内容（例：进度条组件）
                {
                    prop: 'posiId',
                    label: '职务/岗位',
                    isShow: true,
                },
                {
                    prop: 'isJobName',
                    label: '是否在职',
                    isShow: true,
                    render: (h, parms) => {
                        return h('div', {},
                           parms.row.isJobName = parms.row.isJob === '0' ? '否' : '是' 
                        )
                    }
                },
                {
                    prop: 'phone',
                    label: '个人电话',
                    isShow: true
                },
                {
                    prop: 'companyPhone',
                    label: '工作电话',
                    isShow: true
                },
                {
                    prop: 'email',
                    label: '个人邮箱',
                    isShow: true
                },
                {
                    prop: 'wechat',
                    label: '个人微信',
                    isShow: true
                },
                {
                    prop: 'qq',
                    label: '个人QQ',
                    isShow: true
                },
            ],
            tableOption: {
                border: true
            },
            page: {
                current: 1,
                size: 10,
                total: 0
            },
            selectTableData: []
        }
    },

    methods: {

        selectChange (list) {
            this.selectTableData = list
        },

        searchModelSynopsis (boolean = true) {
            if (boolean) this.resetPage ()
            this.getAddressBook({
                'keywords': this.filterText ? this.filterText : null, 'isJob': this.isJob ? this.isJob : null,
                // 'createTime': this.createDate ? this.createDate[0] : null,
                // 'updateTime':this.createDate ? this.createDate[1] : null
            })
        },

        getAddressBook (item) {
            console.log(">>>>>")
            console.log({...item})
            getAddressBookList ({
                ...item,
                'pageNo': this.page.current,
                'pageSize': this.page.size
                }).then(res => {
                if (res) {
                    this.tableData = res
                  console.log("-----")
                  console.log(res)
                }
            })
        },

        // 分页变化改动
        handlePaginationChange(val) {
            this.page = val
            //dom出来后执行回调
            this.$nextTick(() => {
                this.searchModelSynopsis(false)
            });
        },

        resetModelSynopsis () {
            this.resetPage ()
            this.filterText = this.isJob = '',
            // this.createDate = []
            this.getAddressBook ()
        },

        closeDialog () {
            this.dialogVisible = false
        },

        exportExcel () { 
            this.$refs.table.getExportExcel ()
        },

        printTable () {
            this.$refs.table.printTable (this.selectTableData)
        },

        resetPage () {
            this.page = {
                current: 1,
                size: 10,
                total: 0
            }
        }
    },

    created () {
        this.resetPage ()
        this.getAddressBook ()

    },

    components: {
        'qqt-table': qqtTable,
        'qqtSelect': qqtSelect,
        'exhibition-addressBook': exhibitionAddressBook
    }
}
</script>

<style lang="scss" scoped>
    .qqt-container-full-header___top {
        margin-bottom: -15px;
        .button-group {
            position: relative;
            top: 3px
        }
    }
</style>
