<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('material:warehouse:synopsis:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addEntrepot">新增仓库</el-button>
                </span>
                <span class="qqt-container-full-header___search">
                    <el-input
                        placeholder="请输入内容"
                        prefix-icon="el-icon-search"
                        v-model="filterText" size="mini">
                    </el-input>
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="selectChangeData">搜索</el-button>
                    <el-button type="info" class="qqt-container-full-header-top___button" @click="resetModelSynopsis">重置</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right" v-if="$has ('material:warehouse:synopsis:delete')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="deleteBatchEntrepotData">批量删除</el-button>
                </span>
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <entrepot-table ref="entrepot" :filterText="filterText" />
    </d2-container>
</template>

<script>
    import entrepotTable from './entrepotTable'
    export default {

        components: {
            'entrepot-table': entrepotTable
        },

        data () {
            return {
                filterText: '',
            }
        },
        
        methods: {

            addEntrepot () {
                this.$refs.entrepot.addEntrepot ()
            },

            selectChangeData () {
                this.$refs.entrepot.selectChangeData ()
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.$refs.entrepot.resetModelSynopsis ()
            },

            exportExcel () {
                this.$refs.entrepot.exportExcel ()
            },

            printTable () {
                this.$refs.entrepot.printTable ()
            },

            deleteBatchEntrepotData () {
                this.$refs.entrepot.deleteBatchEntrepotData ()
            }
        }
    }
</script>
