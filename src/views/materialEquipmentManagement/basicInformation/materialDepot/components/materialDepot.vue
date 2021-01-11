<template>
    <d2-container type="fulls">
        <template slot="header">
            <div class="qqt-container-full-header___top">
                <span class="qqt-container-full-header-operation___left" v-if="$has ('material:material:model:add')">
                    <el-button type="primary" class="qqt-container-full-header-top___button" @click="addMaterialDepot">添加</el-button>
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
                <span class="qqt-container-full-header-operation___right">
                    <el-button-group>
                        <el-button size="mini" @click="exportExcel" icon="el-icon-upload2">导出</el-button>
                        <el-button size="mini" icon="el-icon-printer" @click="printTable()">打印</el-button>
                    </el-button-group>
                </span>
            </div>
        </template>
        <material-depot-table ref="material" :filterText="filterText" />
    </d2-container>
</template>

<script>
    import materialDepotTable from './materialDepotTable'
    import util from '@/libs/util.js'
    export default {

        data () {
            return {
                filterText: '',
            }
        },
        methods: {

            exportExcel () { 
                this.$refs.material.getExportExcel ()
            },

            resetModelSynopsis () {
                this.filterText = ''
                this.$refs.material.resetModelSynopsis ()
            },

            addMaterialDepot () {
                this.$refs.material.setShowCondition (false)
                this.$refs.material.routerLink ('添加材料库材料')
            },

            selectChangeData () {
                this.$refs.material.selectChangeData ()
            },

            printTable () {
                this.$refs.material.printTable ()
            }
        },

        components: {
            'material-depot-table': materialDepotTable
        }
    }
</script>
