<template>
  <d2-container class="importModelClass">
      <div class="cardBox">
          <el-card  class="leftCard">
            <div slot="header" >
              <el-row>
                  <el-col :span="12"><i class="leftLine"></i> <h2>开户行管理</h2></el-col>
                  <el-col :span="12" style="text-align:right" v-if="$has ('finance:financeBank:add')">
                    <el-button type="primary" icon="el-icon-bank-card" @click="addData" size="mini" :disabled="editFlag || clickEditFlag">添加</el-button>
                  </el-col>
                </el-row>
            </div>
            <input-box :defaultIndex="defaultIndex" :editFlag="editFlag" :bankList="bankList" @copyData="copyData" @clickRow="clickRow" @editOk="editOk" @deleteFun="deleteFun" @clickEdit="clickEdit"></input-box>
          </el-card>
          <el-card  class="rightCard">
            <div slot="header" >
              <h2>{{rightTitle}}</h2>
            </div>
            <bank-model :bankData="bankData" @saveData="saveData"></bank-model>
          </el-card>
      </div>
  </d2-container>
</template>

<script>
  import {getBanks,queryList,setEdit,queryByName,deleteAjx, addAjx} from '../../../api/financialManagement/importModel';
  import bankModel from './components/bankModel.vue';
  import inputBox from './components/inputBox.vue';
  import util from '@/libs/util.js';
  export default {
    components: {
      bankModel,
      inputBox
    },
    data() {
      return {
        editFlag: false,
        clickEditFlag: false,
        bankList: [],
        rightTitle: '',
        bankData: {},
        clickRowData: {},
        defaultIndex: 0
      }
    },
    methods: {
      // 获取银行信息
      getBank() {
        queryList().then(res => {
          this.bankList = res;
          if (res.length > 0) {
            this.rightTitle = res[0].bank;
            this.clickRowData = res[0];
            this.queryByNameFun (res[0]);
          } else {
            this.rightTitle = '';
            this.clickRowData = {};
          }
        })
      },
      load () {

      },
      // 通过银行姓名查询模板信息
      queryByNameFun (row) {
        queryByName ({name:row.bank}).then(res =>{
          this.bankData = res;
        })
      },
      clickEdit () {
        this.clickEditFlag = true;
      },
      // s删除
      deleteFun (row, index) {
        util.confirm('此操作将永久删除该银行模板信息, 是否继续?').then(res => {
          if (res) {
            deleteAjx({id: row.id}).then(res => {
              if (res.success) {
                this.$message.success('删除成功');
                this.getBank();
                this.defaultIndex = 0;
              } 
            })
          } else {
            this.$message.info('取消删除');
          }
        })
      },
      //修改保存
      editOk (row,index) {
        if (row.id) {
          setEdit (row).then(res=>{
            if (res) {
              this.$message.success('保存成功');
            
            }
          })
        } else {
          if (row.bank) {
            addAjx (row).then(res => {
              if (res) {
                this.bankList.splice(0,1,res)
                this.$message.success('添加成功');
                this.clickRowData = res;
              }
            })
          } else {
            this.$message.error('银行卡姓名不能为空');
          }
        }
        this.editFlag = false;
        this.clickEditFlag = false;
      },
      // 点击行数据
      clickRow (row,index) {
        if (!this.editFlag) {
          this.queryByNameFun (row);
          this.clickRowData = row;
          this.rightTitle = row.bank;
          this.defaultIndex = index
        }
      },
      // 保存
      saveData(data) {
        data.bank = this.rightTitle;
        data.id = this.clickRowData.id;
        setEdit (data).then(res=>{
          if (res.success) {
            this.$message.success('保存成功');
          }
        })
      },
      copyData (item,index) {
        let jsonData = JSON.parse(JSON.stringify(item));
        jsonData.id = '';
        queryByName ({name:jsonData.bank}).then(res =>{
          this.bankData = res;
        })
        jsonData.bank = jsonData.bank + ' 复制';
        this.defaultIndex = 0;
        this.bankList.unshift(jsonData);
        this.rightTitle = jsonData.bank;
        this.editFlag = true;
        this.clickEditFlag = true;
      },
      addData () {
        this.defaultIndex = 0;
        let jsonData = {bank: '',id: ''};
        this.bankList.unshift(jsonData);
        this.rightTitle = "默认模板";
        this.editFlag = true;
        this.clickEditFlag = true;
        this.bankData = {};
      }
    },
    mounted () {
      this.getBank();
    },
  }
</script>
<style scoped>
  .leftLine {
    border-left: 3px solid #346fff;
    padding-right: 15px;
    vertical-align: text-bottom;
  }
</style>
<style lang="scss" >
  .importModelClass {
    .cardBox {
      height: 100%;
      display: flex ;
      .leftCard  {
        overflow:auto;
        overflow:overlay;
        flex: 3;
        margin-right: 20px;
        height: 100%;
        &::-webkit-scrollbar {
            display: none;
        }
        h2{
          display: inline-block;
          font-size: 20px!important;
        }
        .el-card__header{
          position: absolute;
          height: 64px;
          width: 30%;
          background-color: #fff;
          top: 21px;
          z-index: 999;
        }
        .el-card__body {
          padding-top: 70px;
        }
      }
      .rightCard  {
        height: 100%;
        flex: 6;
         h2{
          font-size: 20px!important;
        }
      }
    }
  }
</style>