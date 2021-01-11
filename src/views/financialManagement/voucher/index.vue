<template>
    <d2-container class="voucher">
        <div  style="background-color:#ffffff;height:100%;padding-top:30px">
            <!-- <h2 style="text-align:center">凭证录入</h2>
            <el-row style="width:960px;margin: 0 auto;height:45px;line-height:45px">
                <el-col :span="12" style="font-size:16px">
                    凭证编号: {{accounting}}
                </el-col>
                <el-col :span="12" style="text-align: right;">
                    <span style="font-size:16px">日期：</span>
                        <el-date-picker
                        style="width:200px"
                        v-model="inputtime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                        </el-date-picker>
                </el-col>
            </el-row> -->
            <pz-table :pzRowData="pzRowData" ref="pzTable"></pz-table>
            <el-row>
                <el-col :span="12" :offset="6" style="text-align:center">
                    <el-button type="primary" :disabled="btnDis" @click="addFun">保存</el-button>
                    <!-- <el-button @click="addedFun">保存并新增</el-button> -->
                </el-col>
            </el-row>
        </div>
    </d2-container>
</template>

<script>
import pzTable from './component/pzTable.vue';
import util from '@/libs/util.js'
import {goAdd,add,confGetById} from '../../../api/financialManagement/voucher/index';
export default {
    components: {
        pzTable,
    },
	data() {
		return {
            pzRowData:{
                dobill: '',
                inputtime: '',
                accounting: ''
            },
            defaultData: new Date().format('yyyy-MM-dd'),
            accounting: '', // 编号
            inputtime: '', // 日期
            btnDis: false
		};
    },
    mounted () {
        this.getCode();
    },
	methods: {
        getCode () {
       
            goAdd().then(res=>{
                confGetById ({id:'1196963121869107200'}).then(data=> {
                    this.pzRowData = {
                        dobill: util.cookies.get ('username'),
                        fnancemanager: util.cookies.get ('username'),
                        inputtime: new Date().format('yyyy-MM-dd'),
                        accounting: res,
                        unit: data.value,
                        doc: 1
                    }
                })
            })
        },
        saveData (data) {
            add (data).then(res => {
                this.btnDis = true;
                this.$message.success(res.message)
            })
        },
        addFun () {
            this.$refs.pzTable.getData().then(res => {
                let jsonData = {
                    ...res,
                  
                }
                this.saveData(jsonData)
            })
        },
        addedFun () {
            this.$refs.pzTable.reastData();
            //   goAdd().then(res=>{
            //     this.pzRowData = {
            //         dobill: util.cookies.get ('username'),
            //         inputtime: new Date().format('yyyy-MM-dd'),
            //         accounting: res,
            //     }
            // })
        },
	}
};
</script>
