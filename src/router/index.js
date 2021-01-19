import Vue from "vue"
import Router from "vue-router";
import Main from "../views/Main";
import Login from "../views/Login.vue";
import Wecome from "../views/Wecome";
import Users from "../views/user/Users";
import shiyan from "../views/user/shiyan";
import Rights from "../views/power/Rights";
import Roles from "../views/power/Roles";

import Cat from "../views/goods/Cat";
Vue.use(Router)
const router= new Router({
  mode:'history',
  routes: [{
    path: "/login",
    name:"login",
    component:Login,
  },
    {path:"/shiyan/:name",name:"shiyan",component:shiyan, props: true,},
    {
    path: "/main",
    name:"main",
    component:Main,
    redirect: "/wecome",
    children:[
      {path:"/wecome",name:"wecome",component:Wecome},
      {path: "/users",name:"users",component: Users},
      {path:"/rights" ,component: Rights},
      {path:"/roles" ,component: Roles},
      {path:"/categories",component: Cat}
    ]
  },
    {path:"/",redirect:"/login"},
  ]

})
//挂载一个漏油导航守卫..跳转前执行  、、afterEach为跳转后执行
router.beforeEach((to,from,next)=>{
//to表示将要访问的路径，from表示从哪个路径而来，next表示放行
  if(to.path==="/login") return next();
  const tokenstr=window.sessionStorage.getItem("token")
  if(!tokenstr) return next("/login")
  next()
})
export default router
