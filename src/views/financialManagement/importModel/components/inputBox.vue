<template>
    <div class="inputBoxModel">
      <div class="bankBtn" v-for="(item,index) in bankList" :key="index"    @click.stop="change(index,item)" :class='{ active:index === activeClass}'>
        <el-row style="height:40px">
          <el-col :span="24" v-if="isEdit && index === editIndex" class="inputBox">
            <el-input :ref="`input${index}`" v-model="editInput" @focus.stop="focusFun" @blur="blurFun(item,index)"></el-input>
          </el-col>
          <el-col style="padding: 0 10px" :span="17" v-else>{{item.bank}} &nbsp;</el-col>
          <el-col  v-if="!isEdit" :span="7" class="showBox" style="text-align:right"><span><i class="el-icon-edit d2-mr-10" v-if="$has ('finance:financeBank:edit')" @click="editFun(item,index)"></i><i class="el-icon-document-copy d2-mr-10"  v-if="$has ('finance:financeBank:copy')" @click.stop="copyFun(item,index)"></i><i class="el-icon-close" v-if="$has ('finance:financeBank:delete')" @click="deleteFun(item,index)"></i></span></el-col>
          <!-- <el-col :span="8" class="showBox" style="text-align:right"><span><i class="el-icon-circle-check d2-mr-10" @click="editOk(item,index)" v-if="isEdit && index === editIndex"></i><i v-else class="el-icon-edit d2-mr-10" @click="editFun(item,index)"></i><i class="el-icon-document-copy d2-mr-10" @click.stop="copyFun(item,index)"></i><i class="el-icon-close" @click.stop="deleteFun(item,index)"></i></span></el-col> -->
        </el-row>
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      bankList: {
        type: Array,
        default: []
      },
      editFlag: {
        type: Boolean,
        default: false
      },
      defaultIndex: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        activeClass: 0,
        isEdit: false,
        editInput: '',
        editIndex: 0
      }
    },
    methods: {
      change (index,item) {  
          this.activeClass = index;  
          this.$emit('clickRow',item,index);
      },
      editFun (item,index) {
          this.editIndex = index;
          this.isEdit = true;
          this.$nextTick(res=>{
            this.$refs['input'+index][0].focus()
          })
          this.editInput = item.bank;
          this.$emit('clickEdit',item,index)
      },
      editOk (item,index) {
        this.isEdit = false;
        item.bank = this.editInput;
        this.$emit('editOk',item,index);
      },
      copyFun (item,index) {
        this.$emit('copyData',item,index)
      },
      deleteFun (item,index) {
          this.$emit('deleteFun',item,index)
      },
      focusFun () {
      },
      blurFun (item,index) {
        this.isEdit = false;
        if (this.editInput) {
          let flag = false;
          for (let i = 0; i < this.bankList.length; i++) {
            if (i != index){
              if (this.bankList[i].bank === this.editInput) {
                flag = true;
              }
            }
          }
          if (flag) {
            this.isEdit = true;
            this.$nextTick(res=>{
              this.$refs['input'+index][0].focus()
            })
            this.$message.error(`${this.editInput} 模板已存在，请更换模板名称`);
          } else {
            item.bank = this.editInput;
            this.$emit('editOk',item,index);   
          }
        } else {
          this.$message.error('银行卡名称不能为空');
          this.isEdit = true;
          this.$nextTick(res=>{
            this.$refs['input'+index][0].focus();
          })
        }
      }
    },
    watch: {
      editFlag(newValue) {
        if (newValue) {
          this.editIndex = 0;
          this.isEdit = true;
          this.$nextTick(res=>{
            this.editInput = this.bankList[0].bank ? this.bankList[0].bank : "默认模板";
            this.$refs['input0'][0].focus();
          })
        }
      },
      defaultIndex (value) {
        this.activeClass = value;
      }
    },
  }
</script>
<style lang="scss" >
.inputBoxModel{
  .bankBtn{
    .inputBox{
      .el-input{
        height: 38px;
        line-height: 38px;
      }
      input{
          padding: 0 10px;
          border-radius: 0;
          vertical-align: text-bottom;
          height: 38px;
          line-height: 38px;
          font-size: 16px;
          border: 0;
          background-color: #fff;
          color: #000;
          border: 1px solid #409EFF;
        }
      }
  }
}
</style>
<style lang="scss" scoped>
.bankBtn{
  .showBox{
    display: none;
    padding-right:5px;
  }
  
  height: 40px;
  font-size: 16px;
  border: 1px solid rgb(228,228,228);
  line-height: 40px;
  text-align: left;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    border: 1px solid #badfff;
    background-color: #f6faff;
    .showBox{
      display: block
    }
  }
}
.active{
    border: 1px solid #57B1FF;
    background-color: #D6E8FF;
}

</style>