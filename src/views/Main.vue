<template>
  <el-container style="height: 100%">

    <el-header style="background-color: #2B2B2B">
      <div>
        <span>后台管理</span>
      </div>
      <el-button type="info" @click="logout" >退出</el-button>
    </el-header>

    <el-container>
      <!-- 折叠前的宽度和折叠后的宽度-->
      <el-aside :width="zhedie ? '70px' :'200px'" style="background-color: #2B2B2B">
        <div class="toububeijing" @click="quanbuzhankai">|||</div>
        <!-- collapse是否折叠
             unique-opened： 是否只有一个子菜单展开
             default-active: 高量，当刷新后选中的连接
        -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#2B2B2B"
          text-color="#fff"
          active-text-color="#1068F2"
          unique-opened
          :collapse="zhedie"
          :router="true"
          :default-active="gaoliang"
        >
          <!-- 一个下拉列表 -->
          <el-submenu :index="item.id+''" v-for="(item,index1) in menlist" :key="item.id">
            <template slot="title">
              <i :class="iconsobj[index1]"></i>
              <span style="margin-left: 20px">{{item.authName}}</span>
            </template>
            <!--  一组-->


            <el-menu-item  @click="savezhuangtai('/'+shuju.path)" v-for="(shuju,index2) in item.children" :index="'/'+shuju.path" :key="index1+'-'+index2">
              <i class="el-icon-menu"></i>
              <span style="margin-left: 10px">{{shuju.authName}}</span>
            </el-menu-item>



          </el-submenu>
          <!--  一个元素-->

        </el-menu>
      </el-aside>

      <el-main style="background-color: #D8DCDF">
        <router-view></router-view>
      </el-main>
    </el-container >
  </el-container>

</template>

<script>
export default {
  data(){
    return {
      menlist:[],
      iconsobj:{
        0:'el-icon-s-custom',
        1:'el-icon-user-solid',
        2:'el-icon-s-grid',
        3:'el-icon-position',
        4:'el-icon-s-data',
      },
      gaoliang:'/wecome',
      //导航栏是否折叠
      zhedie:false,
    }
  },
  name: "Main",
  created() {
    this.getMenlist()
    this.gaoliang=window.sessionStorage.getItem('lianjie')

    if(this.gaoliang!==this.$route.path) {
      //this.$router.push(this.gaoliang)
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push("/login")
    },
     async getMenlist() {

       const {data:res} = await this.$http.get("menus")

       if(res.meta.status!==200) return this.$message.error(res.meta.msg);
       this.menlist=res.data
       console.log(this.menlist)
     },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //点击按钮，切换折叠与展开
    quanbuzhankai(){
       this.zhedie=!this.zhedie

    },
    //保存连接的激活状态
    savezhuangtai(lianjie1){
      window.sessionStorage.setItem("lianjie",lianjie1)
      this.gaoliang=lianjie1
    }

  }
}
</script>

<style  scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}
.el-header>div {
  display: flex;
  align-items: center;
}


.el-header>div> span{
      margin-left: 40px;
    }
.el-icon-menu{

}
.toububeijing{
  background-color: #8D8D8D;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;


}

</style>
