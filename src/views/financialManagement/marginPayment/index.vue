<template>
     <d2-container class="fina_applica">
        <template  slot="header" style="padding-bottom:0">
            <div class="customer-list-header">
              <el-form :inline="true" class="demo-form-inline " :model="form" ref="form" size="mini">
                  <el-form-item label prop="keywords">
                    <el-input v-model="form.keywords" prefix-icon="el-icon-search" placeholder="请输入内容" style="width: 200px;" :clearable="true"/>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="dataSearch(true)">搜索</el-button>
                  </el-form-item>
                  <el-form-item>项目类型:</el-form-item>
                  <el-form-item label prop="bstatus">
                      <el-select v-model="form.bstatus" placeholder="请选择要搜索的项目类型" style="width: 160px;" clearable  value="">
                          <el-option label="联营项目" value="1" />
                          <el-option label="自营项目" value="0" />
                      </el-select>
                  </el-form-item>
                  <el-button-group>
                    <el-button size="mini" icon="el-icon-upload2">导出</el-button>
                    <el-button size="mini" icon="el-icon-printer">打印</el-button>
                  </el-button-group>
              </el-form>
              <el-row>
                <el-col :span="12">
                  <i class="leftLine"></i> 审核状态
                  <el-button size="small" style="margin-left:15px">全部</el-button>
                  <el-button size="small">未审核</el-button>
                  <el-button size="small">已审核</el-button>
                </el-col>
                <el-col :span="12">
                  <i class="leftLine"></i> 退还状态
                  <el-button size="small" style="margin-left:15px" @click="btnclickFun('全部')">全部</el-button>
                  <el-button size="small" @click="btnclickFun('未退还')">未退还</el-button>
                  <el-button size="small" @click="btnclickFun('已退还')">已退还</el-button>
                </el-col>
              </el-row>
            </div>
        </template>
        <template>
            <qqt-table :data="tableData" :rowHeader="rowHeader" :option="tableOption" @page="pageChange" @selectionChange="selectChange"></qqt-table>
            <!-- @selectionChange="selectChange" -->
        </template>
     </d2-container>
</template>

<script>
let that = this;
export default {
  components: {
      qqtTable: () => import("../../../components/qqt-subassembly/qqt-table/qqt-table"),
  },
  data() {
    return {
      form: {
          keywords: '',
          bstatus: '1'
      },
      tableData: {},
      rowHeader: [
          {
              prop: 'companyId',
              label: '支付编号',
              isShow: true
          },
          {
              prop: 'untitled',
              label: '项目名称',
              isShow: true
          },
          {
              prop: 'posiId',
              label: '收款单位名称',
              isShow: true,
          },
          {
              prop: 'posiId',
              label: '项目类型',
              isShow: true
          },
          {
              prop: 'phone',
              label: '保证金类型',
              isShow: true
          },
          {
              prop: 'companyPhone',
              label: '流程状态',
              isShow: true
          },
          {
            prop: '',
            label: '操作',
            isShow: true,
            render: function (createElement, params) {
                return createElement('div',
                    [
                        createElement('el-button', {
                            attrs: {
                                type: 'text',
                            },
                            on: {
                                click: () => {
                                    that.$message.success("你点击了退还认定")
                                }
                            }
                        }, '退还认定'),
                    ]
                )
            }
          }
      ],
      tableOption: {
          border: false,
      },
      page: {
          current: 1,
          size: 10,
          total: 0
      },
    }
  },
  methods: {
    // 添加
    addAccountBtn () {

    },
    // 搜索
    dataSearch () {

    },
    btnclickFun () {

    },
    pageChange (data) {
      this.pageInfo.pageNo = data.current;
      this.pageInfo.pageSize = data.size;
      this.dataSearch();
    },
    selectChange (val) {
      console.log(val)
    },
  },
  mounted () {
   
  },
}
</script>

<style lang='scss' scoped>
  .fina_applica {
    .leftLine {
      border-left: 3px solid #84b7fa;
      padding-right: 15px;
    }
   
  }
 
</style>
<style >
 .fina_applica .d2-container-full__header{
    padding-bottom: 0px !important;
  }
</style>