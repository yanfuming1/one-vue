<template>
 <div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>权限管理</el-breadcrumb-item>
     <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>
<!--   卡片视图-->
   <el-card>
     <el-table :data="rightlist" border stripe>
       <el-table-column type="index" label="序号"></el-table-column>
       <el-table-column label="权限名称" prop="authName"></el-table-column>
       <el-table-column label="路径" prop="path"></el-table-column>
       <el-table-column label="权限等级" >
         <template slot-scope="scope">
           <el-tag v-if="scope.row.level==='0'">一级</el-tag>
           <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
           <el-tag type="warning" v-else-if="scope.row.level==='2'">三级</el-tag>
         </template>
       </el-table-column>
     </el-table>
   </el-card>
 </div>
</template>

<script>
export default {
  name: "Rights",
  data(){
    return{
      rightlist:[]
    }
  },
  created() {
    this.getrightlist()
  },
  methods:{
    getrightlist(){

      this.$http.get("rights/list").then((res)=>{
        console.log(res)
        if(res.data.meta.status!==200){
          return this.$message.error("获取权限列表失败")
        }
        this.rightlist=res.data.data
      })
    }
  }
}
</script>

<style  scoped>

</style>
