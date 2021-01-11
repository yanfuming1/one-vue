<template>
  <div class="drawerOff">
    <el-drawer
      title="到账资金认定"
      :visible.sync="showDrawer"
      :direction="direction"
      size="40%"
      :before-close="handleClose">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" >
        <el-form-item label="资金类型:" prop="affirmmode">
          <el-select v-model="ruleForm.affirmmode" placeholder="请选择资金类型" multiple style="width:100%">
                <el-option v-for="item in typeList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="认定联营人:" prop="associated">
          <el-input placeholder="请选择认定联营人" disabled v-model="ruleForm.associated" >
            <el-button slot="append" icon="el-icon-search" @click="searchFun"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="关联项目:" prop="itemid">
          <!-- <el-input v-model="ruleForm.itemid"></el-input> -->
          <el-select v-model="ruleForm.itemid" filterable clearable style="width:100%">
            <el-option v-for="item in itemnameList"
              :key="item.id"
              :label="item.projectName"
              :value="item.id">
            </el-option>
          </el-select>
          
        </el-form-item>
      </el-form>
      <el-row>
          <el-col :span="24" style="text-align:center">
              <el-button size="small" type="primary" @click="submitBtn">确定</el-button>
              <el-button size="small" type="primary" plain @click="cancelBtn">取消</el-button>
          </el-col>
        </el-row>
    </el-drawer>
    <el-dialog
      v-dialogDrag
      title="选择联营人"
      :visible.sync="dialogShow"
      v-if="dialogShow"
      :before-close="beforeClose"
      width="40%"
      top="5vh"
      class="drawerDialog"
      @close="dialogClose">
      <el-form :inline="true" class="demo-form-inline " :model="page"  ref="form" size="mini" label-width="100px">
          <el-form-item prop="cusName">
            <el-input v-model="page.cusName"  @clear="resetFun" placeholder="请输入客户名称"  :clearable="true"/>
          </el-form-item>
          <el-form-item >
              <el-button type="primary" @click="dataSearch()">搜索</el-button>
          </el-form-item>
          <el-form-item>
              <el-button type="info" @click="resetFun">重置</el-button>
          </el-form-item>
      </el-form>
      <qqt-table :data="tableData" 
        :rowHeader="rowHeader" 
        :option="tableOption" 
        :isShowSelection="false"          
        @page="pageChange"
        @selectionChange="selectChange"
        @currentChange="currentChange"
        @rowDblclick="rowDblclick"     
        ref="tableRef"
        >
      </qqt-table>
      <span slot="footer">
        <el-button type="primary" @click="dialogOk">确 定</el-button>
        <el-button @click="dialogClose">取 消</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
  import { queryAccount,goAffirm,affraimFun,associatedProjects } from '../../../../api/financialManagement/financeFundFetermination';
  import qqtTable from '../../../../components/qqt-subassembly/qqt-table/qqt-table';
  import { qqtSelect} from '../../../../components/qqt-subassembly'
  export default {
    components: {
      qqtSelect,
      qqtTable,
    },
    props: {
      showDrawer: {
        type: Boolean,
        default: false
      },
      drawerData: {
        type: Object,
        default: () => {}
      },
    },
    data() {
      return {
        dialogShow: false,
        tableData: {},
        clickRow:'',
        itemnameList: [],
        rowHeader: [
            {
                prop: 'cusName',
                label: '客户名称',
                isShow: true
            },
            {
                prop: 'customerNumber',
                label: '客户编码',
                isShow: true
            },
            {
                prop: 'cusPhone',
                label: '客户电话',
                isShow: true
            },
        ],
        tableOption: {
            border: false,
            highlight: true,
        },
        direction: 'rtl',
        ruleForm:{
          affirmmode: [],
          itemid:'',
          itemname:'',
          associated:'',
          associatedid:'',
        },
        page: {
          pageNo: 1,
          pageSize: 10,
          cusName: ''
        },
        rules:{
          affirmmode: [
            { required: true, message: '请选择资金类型', trigger: ['change',] }
          ],
           associated: [
            { required: true, message: '请输入认定联营人', trigger: ['change','blur'] }
          ],
        },
        typeList:[ ]
      };
    },
    methods: {
      dataSearch () {
        this.page.pageNo = '1'
        this.getTableData();
      },
      resetFun () {
        this.page.cusName = '';
        this.getTableData();
      },
      handleClose(done) {
        this.$refs['ruleForm'].resetFields()
        this.$emit('change');
      },
      getTableData () {
        goAffirm(this.page).then(res=>{
          this.tableData = res;
        })
      },
      // 分页
      pageChange (value) {
        this.page.pageNo = value.current;
        this.page.pageSize = value.size;
        goAffirm(this.page).then(res=>{
          this.tableData = res;
        })
      },
      // 表格选中项
      selectChange () {

      },
      currentChange (row) {
        this.clickRow = row;
      },
      submitBtn () {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              let jsonData = JSON.parse(JSON.stringify(this.drawerData));
              let formData = JSON.parse(JSON.stringify(this.ruleForm));
              formData.affirmmode = formData.affirmmode.join(',');
              jsonData['account'] = JSON.parse(JSON.stringify(formData));
              if (jsonData.account.itemid ){
                jsonData.account.itemname = this.itemnameList.find(item => item.id === jsonData.account.itemid).projectName;
              }
              affraimFun(jsonData).then(res=>{
                // console.log(res)
                this.cancelBtn();
              })
            }
          })
      },
      cancelBtn () {
        this.$emit('change');
        this.$refs['ruleForm'].resetFields()
      },
      searchFun () {
        this.page.cusName = '';
        this.page.pageNo = 1;
        this.getTableData();
        this.dialogShow = true;
      },
      beforeClose () {
        this.clickRow = '';
        this.dialogShow = false;
      },
      // 关闭模态框
      dialogClose () {
        this.clickRow = '';
        this.dialogShow = false;
      },
      // 确定模态框
      dialogOk () {
        if (this.clickRow) {
          this.ruleForm.associated = this.clickRow.cusName;
          this.ruleForm.associatedid = this.clickRow.id;
          this.drawerData.customerCapitalPool = this.clickRow;
          this.getItemName(this.clickRow.id);
          this.clickRow = '';
          this.dialogShow = false;

        } else {
          this.$message.error('请点击你要选择的联营人');
        }
      },
      rowDblclick(row){
        this.ruleForm.associated = row.cusName;
        this.ruleForm.associatedid = row.id;
        this.drawerData.customerCapitalPool = row;
        this.clickRow = '';
        this.dialogShow = false;
        this.getItemName(row.id)
      },
      getItemName(data){
        associatedProjects (data).then(res=>{
          if (res.length > 0) {
            this.itemnameList = res;
            this.ruleForm.itemid = '';
          } else {
            this.itemnameList = [];
            this.ruleForm.itemid = '';
          }
        })
      }
    },
    mounted () {
      // this.$refs['ruleForm'].resetFields();
      queryAccount().then(res=>{
        this.typeList = res;
      });
    },
  }
</script>

<style lang="scss" scoped>
.drawerOff .demo-ruleForm{
  padding-top: 20px;
}
</style>