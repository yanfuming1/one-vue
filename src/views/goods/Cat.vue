<template>
<div>
  <!--面包屑导航区 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片视图-->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary">添加分类</el-button>
      </el-col>
<!--      表格站位-->
      <el-table>

      </el-table>
<!--      分页去-->
    </el-row>
  </el-card>
</div>
</template>

<script>
export default {
  name: "Cat",
  data(){

    return{
      //查询条件数据
      querInfo:{type:3,
      pagenum:1,
        pagesize:5
      },
      catelist:[],//商品分类数据
    }
  },
  created(){
    this.getdata()
  },
  methods:{
    getdata(){
      this.$http.get("/categories",{params:this.querInfo}).then(res=>{
              let data=res.data

      })
    }
  }
}
</script>

<style scoped>

</style>
