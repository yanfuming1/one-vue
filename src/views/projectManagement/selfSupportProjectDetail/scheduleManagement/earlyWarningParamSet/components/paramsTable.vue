<template>
    <div style="margin-bottom:20px;padding:0px 20px;">
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column :label="lableTile">
                <template slot-scope="scope">
                    <el-input :disabled="!isShowElement" type="text" clearable size="mini" v-model="scope.row.lagDay" 
                        @input="val => changeData(val, scope.$index)"><template slot="append">天</template></el-input>
                </template>
            </el-table-column>
            <el-table-column label="预警级别" prop="level"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    components: {
        // 'qqt-input': qqtInput
    },
    props: {
        listData: {
            type: Array,
            default: []
        },
        isShowElement: {
            type: Boolean,
            default: false
        },
        lableTile: {
            type: String,
            default: () => { return '实际开工时间比计划开工时间滞后' }
        }
    },
    data () {
        return {
            tableData: [],
        }
    },
    methods: {
        changeData (val, index) {
            let zz = /^[0-9]*[0-9][0-9]*$/
            this.$set(this.tableData[index], 'lagDay', zz.test(val) ? val : '')
        },
        getData () {
            return this.tableData
        }
    },
    mounted () {

    },
    watch: {
        listData: {
            deep: true,
            handler (val, oldVal) {
                val.forEach(item => {
                    switch (item.warningRank) {
                        case '1':
                            item.level = 'Ⅰ级'
                            break
                        case '2':
                            item.level = 'Ⅱ级'
                            break
                        case '3':
                            item.level = 'Ⅲ级'
                            break
                        case '4':
                            item.level = 'Ⅳ级'
                            break
                        case '5':
                            item.level = 'Ⅴ级'
                            break
                    }
                })
                this.tableData = val
            }
        }
    }
}
</script>