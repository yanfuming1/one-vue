<template>
  <div class="moduleTabs">
    <el-form :model="form" ref="form" label-width="350px" style="width:1000px">
        <div v-for="(itemData,idx) in data" :key="itemData.id">
          <el-row class="rowClass " v-if="itemData.id==='1197689663909875712'">
            <el-col :span="15">
              <el-form-item label="拥有审核和反审核功能的角色:" >
                  <el-select :disabled="showEdit" v-model="itemData.value"  style="width:100%" @change="change(itemData)">
                    <el-option v-for="item in roleData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="rowClass " v-if="itemData.id==='1197690003220680704'">
            <el-col :span="15">
              <el-form-item label="拥有指定下一节点和下一节点办理人权限的角色:" >
                  <el-select :disabled="showEdit" v-model="itemData.value"  style="width:100%" @change="change(itemData)">
                    <el-option v-for="item in roleData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
    </el-form>
    <btn-list @editFun="editFun"  :saveData="data"></btn-list>
  </div>
</template>

<script>
  import {GetAllRoleList} from '../../../../api/system/role/role';
  import {addList,editList} from '../../../../api/configuration/index';
  import btnList from './btnSave';
  export default {
    props: {
      childrenData: {
        type: Array,
        default: () =>{
          return [];
        }
      },
    },
    components: {
      btnList,
    },
    data() {
      return {
        roleData: [],
        data: [],
        form: {

        },
        showEdit: true
      }
    },
    methods: {
      change(row) {
        editList (row).then(res => {
          this.$message.success('修改成功')
        })
      },
      editFun () {
        this.showEdit = !this.showEdit;
      }
    },
    mounted () {
      GetAllRoleList().then(res =>{
        this.roleData = res;
      })
    },
    watch: {
      childrenData:{
        immediate: true,
        handler (value) {
          this.data = value;
        }
      }
    },
  }
</script>

<style lang="scss" >
.moduleTabs{
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
  padding-top: 20px;
  .paddingLeft{
    padding-left: 60px;
  } 
  .el-form-item{
    padding-bottom: 0px;
    margin-bottom: 0px;
  }
  .colSpan{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 10px;
  }
  .rowClass{
    height: 50px;
    line-height: 50px;
    padding-top: 5px;
    cursor: pointer;
    label{
      cursor: pointer;
    }
  }
  .el-input-number {
    .el-input__inner {
      text-align: left;
    }
  }
}
.activeColor {
  background-color: #eaebff;
}
</style>