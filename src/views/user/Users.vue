<template>
  <div>
 <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- -->
    <el-card class="box-card">
      <div slot="header" >
        <!-- gutter 间距-->
        <el-row :gutter="20">

          <el-col :span="10" >
          <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" @clear="getusers">
            <el-button slot="append" icon="el-icon-search" @click="getusers" ></el-button>
          </el-input>
          </el-col>
          <el-col :span="10" > <el-button type="primary" @click="addlogvible = true">添加用户</el-button></el-col>
        </el-row>
      </div>
      <!--用户列表区-->
      <el-table
        :data="userlist"
        height="250"
        border
        stripe
        style="width: 100%">
        <el-table-column prop="username" label="姓名" width="100"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="150"></el-table-column>
        <el-table-column  label="状态" width="100">
          <!--插槽 {{scope.row}}表示这一样的数据-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userstate(scope.row)"></el-switch>
          </template>

        </el-table-column>

        <el-table-column  label="操作" width="300">
          <template slot-scope="scope">
            <!--修改，删除分配角色-->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="tiaozhuan(scope.row.id)"></el-button>
            <el-button size="mini" type="primary" @click="showdata(scope.row)" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delect(scope.row.id)"></el-button>
            <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="right-start">
              <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域  current-page：所在页数
       page-sizes： 分页的下拉菜单
       :page-size：每页的条数
       layout： 展示的组件
      -->
      <div class="block">
        <br>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totle">
        </el-pagination>
      </div>
    </el-card>

    <!--对话框
    visible.sync: 绑定布尔值（是否显示）
    @close: 关闭时触发函数
    ref: 绑定一个表单属性
    -->
    <el-dialog
      title="添加用户"
      :visible.sync="addlogvible"
      width="50%"
      @close="addclose"
     >
      <el-form :model="addfrom" :rules="addrules" ref="addruleForm" label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addfrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addfrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input  type="email" v-model="addfrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input  v-model="addfrom.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!--按钮区-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addlogvible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 修改区-->
    <el-dialog
      title="修改用户信息"
      :visible.sync="xiugaibutton"
      width="50%"
      @close="editclose"
      >
      <el-form ref="updataform" :model="updata" label-width="80px" :rules="addrules">
        <el-form-item label="用户名" ><el-input v-model="updata.username" disabled></el-input></el-form-item>
        <el-form-item label="邮箱" type="password" prop="email"><el-input v-model="updata.email" ></el-input></el-form-item>
        <el-form-item label="手机" prop="mobile"><el-input v-model="updata.mobile" ></el-input></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="xiugaibutton = false">取 消</el-button>
    <el-button type="primary" @click="updatabutton">确 定</el-button>
  </span>
    </el-dialog>

  </div>

</template>

<script>
export default {
  name: "Users",
  data(){
    var checkemail=(rule, value, callback)=>{
      const emailyan=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (emailyan.test(value)){
        return callback()
      }
      callback(new Error("请输入合法的邮箱"))
    };
    var checkmobil=(rule, value, callback)=>{
      const mobilyan=/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (mobilyan.test(value)){
        return callback()
      }
      callback(new Error("请输入合法的手机"))
    };
    return{
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5,
      },
      userlist:[],
      totle:0,
      addlogvible:false,
      xiugaibutton:false,
      addfrom:{
       username:'别删我',
        password: "111111",
        email:"22@qq.com",
        mobile:"15903753119",
      },
      updata:{

      },
      //添加表单规则
      addrules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '密码长度在 6 到 15个字符', trigger: 'blur'}],

        email: [{required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator:checkemail,trigger: "blur"}],
        mobile: [{required: true, message: '请收入手机号码', trigger: 'blur'},
          {validator:checkmobil,trigger: "blur"}
          ],
      },

    //自定义验证email
    };

  },
  created() {
    this.getusers()
  },
  methods:{
    async getusers() {

     const {data:res}=await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.status!==200) {return this.$message.error(this.meta.msg);}
      this.userlist=res.data.users
      this.totle=res.data.total
     console.log(this.userlist)
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize=val;
      this.getusers()
      this.queryInfo.pagenum=1
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum=val;
      this.getusers()
    },
    //监听状态switch
     userstate(data) {
      //const {data: res} = await this.$http.put('users/'+data.id+'/state/'+data.mg_state)
      //console.log(res)

      this.$http.put('users/'+data.id+'/state/'+data.mg_state).then((res)=>{
        console.log(res)
        if (res.data.meta.status!==200) {
          //错误的话讲滑块回复。。
          data.mg_state=!data.mg_state
          return this.$message.error(res.meta.mesg);
        }
        this.$message .success(res.data.meta.msg)
      })

    },

    addclose(){
      this.$refs.addruleForm.resetFields()
    },
    adduser(){
      this.$refs.addruleForm.validate(async va=>{
        if(!va){
          return this.$message.error("验证未通过")
        }
       const {data:res}=await this.$http.post('users',this.addfrom)
        if(res.meta.status!==201){
          return this.$message.error("添加用户失败")
        }
        this.$message.success("添加用户成功")
        this.addlogvible=false
         this.getusers()

      })
    },
    //修改用户对话框
    showdata(data){
      this.xiugaibutton=true
      this.updata=data
      console.log(this.updata)
    },
    //监听修改对话框改变
    editclose(){
      this.$refs.updataform.resetFields()
    },
    //修改并验证
    updatabutton(){
      this.$refs.updataform.validate(async valid =>{
          if(!valid){return this.$message.error("校验不通过")}
          const {data:res}=await this.$http.put("/users/"+this.updata.id,{email:this.updata.email,mobile:this.updata.mobile})

        if(res.meta.status!==200){return this.$message.error("更新失败")}
        this.xiugaibutton=false
        this.getusers()
        this.$message.success("更新用户信息成功")
      })
    },
    //根据id删除用户
    async delect(data){
     await this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        const {data:res}=await this.$http.delete("users/"+data)
       if(res.meta.status===200) {  this.getusers(); this.$message.success("删除成功")
      }
       else{
         return this.$message.error("删除失败")
       }

      }).catch((err) => { //捕获所有错误，，点击取消为报错
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    tiaozhuan(id){
      this.$router.push("/shiyan/"+id)
    }


  }
}
</script>

<style scoped>

</style>
