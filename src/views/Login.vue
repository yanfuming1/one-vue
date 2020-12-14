<template>
  <div class="quan">
  <el-row class="tac" >
    <el-col :span="7" >
      <br>
    </el-col>
    <el-col :span="5" >
      <div style="height: 200px"></div>
      <div id="dengbei">
        <div class="tupiandaxiao">
        <img src="../assets/img/1.jpg">
        </div>

        <div style="height: 90px"></div>
        <el-row>
          <el-col :spam="1">

        <el-form :model="from" :rules="rules" ref="longform11"  label-width="80px">
          <div style="width: 400px;height: 130px">
          <el-form-item prop="user" label="用户名" >

            <el-input v-model="from.user" prefix-icon="el-icon-coordinate" ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码"  >
            <el-input v-model="from.password" type="password" prefix-icon="el-icon-check"></el-input>
          </el-form-item>
         </div>
          <el-form-item >
            <div style="width: 300px;height: 50px" align="center">
            <el-button type="primary" @click="denglu">登录</el-button>
              &nbsp;&nbsp;&nbsp;
              &nbsp;
            <el-button type="info" @click="longform" id="chong">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
     return{
       from:{
          user:"admin",
         password:"123456",
       },
       rules:{
         //验证用户名和密码是否合法
         user:[ { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' },
           { required: true, message: '请输入用户名', trigger: 'blur' },
         ],
         password: [ { required: true, message: '请输入密码', trigger: 'blur' },
           { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
         ],
       }
    }
  },
  methods:{
    longform:function (){
      this.$refs.longform11.resetFields()//在from标签中写入ref属性，点击重置按钮后，执行函数找到ref的属性进行清空表单
    },
    denglu:function (){
      this.$refs.longform11.validate(async valid=>{//当表单验证通过valid为ture，否则为flue
        if(!valid) {
          return ;}
        else {
          var shuju=null;
          //只能在Promis对象上使用asyns和await
          const {data:res} = await this.$http.post('login', {username:this.from.user,password:this.from.password});
          if(res.meta.status!==200) {
            this.$message({
              showClose: true,
              message: '登录失败',
              type: 'error'
            });
          }
          else {
            this.$message.success("登录成功")
            window.sessionStorage.setItem("token",res.data.token)
            this.$router.push("/main")
          }


         /* this.axios({
            method:"get",
            url:"http://timemeetyou.com:8889/api/private/v1/login",
            params:{username:this.from.user,password:this.from.password}//post请求参数 Headers:{"a":"asd"} data:{code:"123"}
          }).then(function (reponse){
            console.log(reponse.data["data"])
          })*/
        }
      })
    }
  }

}
</script>

<style scoped>
.quan{
  background-color: darkcyan;
  height: 100%;

}
#dengbei{
  width: 450px;
  height: 300px;
  background-color: aliceblue;
  border-radius: 3px;
}
.tupiandaxiao{
  height: 130px;
  width: 150px;
  border: 2px solid #eee;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translate(-60%,-40%);
  background-color: #fff;
}
img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
</style>
