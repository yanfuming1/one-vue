<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!--    角色列表-->
      <el-table :data="rolelist" border stripe>
        <!--      展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['vcenter','bdbottom',i===0 ? 'bdtop':'']" v-for="(item,i) in scope.row.children" :key="item.id">
              <!--            渲染一级-->
              <el-col :span="6">
                <el-tag  closable @close="removerightid(scope.row,item.id)" style="margin: 7px">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>

              </el-col>
              <!--         渲染二级     -->
              <el-col :span="18">
                <el-row :class="['vcenter',i2!==0 ? 'bdtop':'']" v-for="(item2,i2) in item.children" :key="item2.id">
                  <el-col :span="8">
                    <el-tag type="success" closable @close="removerightid(scope.row,item2.id)" style="margin: 7px">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag closable v-for="item3 in item2.children" @close="removerightid(scope.row,item3.id)" type="warning" style="margin: 7px" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>


            <pre>

            </pre>
          </template>
        </el-table-column>
        <!--      普通列-->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" @click="showsetright(scope.row)" icon="el-icon-seeting">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>


<!--分配权限-->
    <el-dialog
      title="分配权限"
      :visible.sync="setrightlog"
      width="50%"
      >
     <!-- 树形框-->
      <el-tree :data="rightslist" :props="treeProps"  :default-checked-keys="defkeys" show-checkbox node-key="id"  ref="treeref" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setrightlog = false">取 消</el-button>
    <el-button type="primary" @click="allotreghtd">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",

  data() {
    return {
      roleid:"",
      rolelist: [],
      setrightlog:false,
      rightslist:[],
      treeProps:{
        label:"authName",
        children:"children",
      },
      defkeys:[],//"默认选择的节点"
    }
  },
  created() {
    this.getroleslist()
  },
  methods: {
    getroleslist() {
      this.$http.get("roles").then(res => {
        res = res.data
        if (res.meta.status !== 200) {
          return this.$message.error("加载列表数据失败")
        }
        this.rolelist = res.data
       // console.log(this.rolelist)
      })
    },
    removerightid(row,id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       this.$http.delete('roles/'+row.id+'/rights/'+id).then(res=>{
         if(res.data.meta.status!==200){
           return this.$message.error("删除失败")
         }
         //直接复制，不进行更新
         row.children=res.data.data
         //this.getroleslist()
       //  console.log(res)
       })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //展示分配权限
    showsetright(row){
      this.roleid=row.id
      this.defkeys=[]
      //获取所有权限数据
      this.$http.get("rights/tree").then(res=>{
        res=res.data
        if(res.meta.status!==200){
          return this.$message.error("获取权限列表失败")
        }
        this.rightslist=res.data
        console.log(this.rightslist)
        //获取角色全部的三级id

        this.getleadkeys(row,this.defkeys)
      })
      this.setrightlog=true
    },
    getleadkeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>
        this.getleadkeys(item,arr)
      )
    },
    //点击分配角色确定
    allotreghtd(){
      const keys=[...this.$refs.treeref.getCheckedKeys(),...this.$refs.treeref.getHalfCheckedKeys()]
      const keystr=keys.join(",")
      this.$http.post('roles/'+this.roleid+"/rights",{rids:keystr}).then(res=>{
        res=res.data
        if(res.meta.status!==200){return this.$message.error("分配权限失败")}
        this.$message.success("分配权限成功")
        this.getroleslist()
        this.setrightlog=false
      })
    }

  }
}
</script>

<style scoped>
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}
/*纵向居中对齐*/
.vcenter{
  display: flex;
  align-items: center;
}
</style>
