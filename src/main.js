import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from  "./router"
//import "./assets/fonts/demo.css"
import "./assets/css/global.css"
import "./assets/js/jquery-3.5.1.js"
//import "./assets/js/layer/layer.js"

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.use(router);
//Vue.use(VueAxios, axios)
//配置请求的根路径

axios.defaults.baseURL="http://timemeetyou.com:8889/api/private/v1/"

//
axios.interceptors.request.use(config=>{
  console.log(config)
  config.headers.Authorization=window.sessionStorage.getItem("token")
  //必须returnconfing

  return config
})
Vue.prototype.$http=axios
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
