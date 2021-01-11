<template>
    <div>
        <el-table
                border
                class="member-table"
                :data="tableData"
                :row-class-name="tableRowClassName"
                style="width: 100%">
            <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">   
                    <div class="scope-index">
                        <span>{{scope.$index + 1}}</span>
                    </div>
                    <div class="scope-action" v-if="!isShowDetails">
                        <el-button @click="handleDelete(scope.$index)" type="danger" icon="el-icon-minus" size="mini" circle></el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="职务" width="200" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.line1" placeholder="请选择" @change="selectDuty(scope.row.line1, scope.$index, scope.row)" :disabled="isShowDetails">
                        <el-option
                            v-for="item in roleOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="证书类别或名称" width="300" align="center">
                <template slot-scope="scope">
                    <qqt-cascader
                        v-model="scope.row.line6"
                        :options="certificateType"
                        :isShowElement="!isShowDetails"
                        :defaultParams="defaultParams"
                        :filterable="true"
                        placeholder="请选择"
                        @cascaded="scope.row.line6 = $event, scope.row.line3 = $event[$event.length - 1], selectCertificateType (scope.row.line3, scope.$index, scope.row, $event)"
                    >
                    </qqt-cascader>
                </template>
            </el-table-column>
            <el-table-column  label="持证人" align="center" width="120">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.line2" @change="scope.row.line2 = $event, selectChange1(scope.row.line2, scope.$index, scope.row)" :disabled="isShowDetails">
                        <el-option v-for="item in scope.row.option" :key="item.id" :label="item.possessor" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column  label="身份证号" align="center" width="250">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.line7" :disabled="isShowDetails"></el-input>
                </template>
            </el-table-column>

            <el-table-column  label="备注" align="center">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.line4" :disabled="isShowDetails"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div class="button" v-if="!isShowDetails">
            <p><el-button
                    class="el-icon-plus"
                    type="text"
                    @click.prevent="addRow()">
                添加
            </el-button></p>
        </div>
    </div>
</template>

<script>
import { getCertificateClassification } from '@api/officalDocument/classificationPersonalCertificates'
import { getProjectPositionAll  } from '@/api/system/positionManagement'
import { cerGetAllByType } from '../../../api/officalDocument/index'
import { qqtCascader } from '../../../components/qqt-subassembly'
import util from '../../../libs/util'
export default {
    name: "qqt-project-member",
    props: {
        dataInfo: {
            type: Array,
            default: []
        },
        isShowDetails: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            tableData: [],
            roleOptions: [],
            certificateType: [],
            defaultParams: {
                value: 'id',
                label: 'credentialName',
                children: 'children'
            }
        }
    },
    created(){
        this.getCertificateClassificationList ()
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if(!this.isShowDetails){
                return 'hover-row';
            }
        },

        handleDelete(index, row) {
            this.tableData.splice(index, 1);
        },

        selectDuty (value, index, row) {
            if(util.isArray(this.roleOptions)){
                this.roleOptions.forEach(item => {
                    if(item.id === value){
                        row.line8 = item.name
                    }
                })
                this.tableData[index] = row
                this.tableData = [ ...this.tableData ]
            }
        },

        selectChange1(value, index, row){
            if(util.isArray(row.option)){
                row.option.forEach(item => {
                    if(item.id === value){
                        row.line7 = item.possessorid
                        row.line5 = item.possessor
                    }
                })
                this.tableData[index] = row
                this.tableData = [ ...this.tableData ]
            }
        },

        selectCertificateType (value, index, row, list) {
            let str = ''
            row.line7 = row.line5 = row.line2 = ''
            this.updataCertificateTypeName (this.certificateType, list, 0, str)
            row.line9 = str.substring (0, str.length - 1)
            this.getCerAllByType (value, index, row)
        },

        updataCertificateTypeName (list, value, num, str) {
            list.forEach (res => {
                if (res.id == value[num]) {
                    str += res.name + '/'
                    if (res.children && res.children.length > 0) {
                        this.updataCertificateTypeName (res.children, value, ++num, str)
                    }
                }
            })
        },

        addRow(){
            var list = {
                line1: '',
                line2: '',
                line3: '',
                line4: '',
                line5: '',
                line6: [],
                line7: '',
                line8: '',
                option: [],
                isMust: false
            }
            this.tableData.push(list)
        },

        getData(){
            this.tableData.forEach (res => {
                if (res.line6 && util.isArray(res.line6)) res.line6 = JSON.stringify (res.line6)
            })
            return this.tableData
        },

        getProjectPositionList (list = []) {
            getProjectPositionAll ().then (res => { 
                if (res) {
                    console.log('职务数据');
                    console.log(res);
                    this.roleOptions = res
                    if (list.length > 0) this.resetData (list)
                }
             })
        },
        
        getCerAllByType (value, index, row) {
            cerGetAllByType({ type : value }).then(res => {
                if (util.isArray(res)) {
                    row.option = res
                    this.tableData[index] = row
                    this.tableData = [ ...this.tableData ]
                }
            })
        },

        getCertificateClassificationList () {
            getCertificateClassification ({ affiliationType: '0' }).then (res => {
                if (res) this.certificateType = res
            })
        },

        // dataShowDetail () {
        //     this.tableData.forEach((item, index) => {
        //         this.roleOptions.forEach(it => {
        //             if(it.id === item.line1){
        //                 item.line1Name = it.name
        //                 item.line1 = it.name
        //                 item.line5 = it.name

        //             }
        //         })
        //         if(util.isArray(item.option)){
        //             item.option.forEach(tem => {
        //                 if(tem.id === item.line2){
        //                     item.line2Name = tem.possessor
        //                     item.line5 = tem.possessor
        //                 }
        //             })
        //         }
        //     })
        // },

        // 数据回显
        async resetData(list) {
            this.tableData = []
            if(util.isArray(list) && list.length > 0){
                for (let index = 0; index < list.length; index++) {
                    const item = list[index];
                    if(util.isArray(this.roleOptions) && this.roleOptions.length > 0){
                        let res = await cerGetAllByType({ type : item.line3 })
                        if(util.isArray(res) && res.length > 0){
                            item.option = res
                            res.forEach(it => {
                                if(item.line2 === it.id){
                                    item.line5 = it.possessor
                                }
                            })   
                        }
                        this.roleOptions.forEach(it => {
                            if(it.id === item.line1){
                                item.line8 = it.name
                            }
                        })
                        if (item.line6 && item.line6.indexOf (',') != -1) item.line6 = JSON.parse (item.line6)
                        this.tableData.push (item)
                    }
                }
                // list.forEach(async (item, index) => {
                //     console.log(item);
                //     console.log(66666666666);
                //     if(util.isArray(this.roleOptions) && this.roleOptions.length > 0){
                //         let res = await cerGetAllByType({ type : item.line3 })
                //         console.log(item);
                //         console.log(777);
                //         // console.log(res);
                //         // cerGetAllByType({
                //         //     type : item.line3
                //         // }).then(res => {
                //             if(util.isArray(res) && res.length > 0){
                //                 item.option = res
                //                 res.forEach(it => {
                //                     if(item.line2 === it.id){
                //                         item.line5 = it.possessor
                //                     }
                //                 })
                //             }
                //             this.roleOptions.forEach(it => {
                //                 if(it.id === item.line1){
                //                     item.line8 = it.name
                //                 }
                //             })
                //             if (item.line6 && item.line6.indexOf (',') != -1) item.line6 = JSON.parse (item.line6)
                //             this.tableData.push (item)
                //             console.log(this.tableData);
                //         // })

                //     }
                // })
            }
        },
    },
    mounted() {
        if (this.dataInfo) {
            let list = JSON.parse (JSON.stringify (this.dataInfo))
            this.getProjectPositionList(list)
        } else { 
            this.getProjectPositionList()
        }
    },
    watch: {
        dataInfo: {
            deep: true,
            handler (newVal) {
                let list = JSON.parse (JSON.stringify (this.dataInfo))
                this.getProjectPositionList(list)
            }
        }
    },

    components: {
        'qqt-cascader': qqtCascader
    }
}
</script>

<style scoped lang="scss">
.member-table{
     .el-table__empty-block{
        display: none;
    }
    .scope-action{
        display: none;
    }
    .scope-index{
        display: block;
    }
    .hover-row:hover{
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
