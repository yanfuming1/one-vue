<template>
  <div class="chat_box">
    <ul ref="wrapper">
        <li v-for="(item,index) in list" :key="index" :class="{wrapper_box:item.fromTo==1}">
           <div v-show="index==0">
             <span>{{item.createTime|createTime}}</span>
           </div>
           <div v-show="item.close">
             <span>{{item.messageContent}}</span>
           </div>
           <div v-show="!item.close">
             <img v-if="item.fromTo==1" width="100%" src="@/assets/image/01.png" alt="头像">
             <img v-else width="100%" src="@/assets/image/04.png" alt="头像">
           </div>
           <template  v-show="!item.close">
              <div v-if="!item.path">
                {{item.messageContent}}
              </div>
              <div v-else>
                  <a :href="item.path" target="_blank">{{item.messageContent}}</a>
              </div>
           </template>
        </li>
    </ul>
    <div class="wrapper_input_b">
      <span></span>
      <div class="w_wrapper_box">
        <div contenteditable="true" ref="wrapper_input_i" @input="inputText($event)" @blur="scrollTo()" @click="scrollT()"></div>
      </div>
      <el-button type="primary" @click="sendnew()">发送</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToChat',
  data () {
    return {
      list:[],
      userNew:{},
      ws:'',
      size:20
    }
  },
  filters:{
    createTime(val){
      var time = new Date(val);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d);
    }
  },
  created() {
    this.userNew=this.$route.params.data;//接收路由传值
    // this.newWebSocketFun();
    console.log(this.userNew,'1111')
    const _url='ws://192.168.2.150/qqtoi/websocket/44';
    this.ws = new WebSocket(_url);
    // 接收服务端数据时触发事件
    this.ws.onopen = (evt) => {
    };
    // 接收服务端数据时触发事件
    this.ws.onmessage = (evt) => {
      if (evt.data === '连接成功') {
        this.list.push({messageContent:'连接成功'});
      } else {
        console.log(evt.data,'发送的数据')
        if (evt.data.indexOf('messageContent')=='-1') {
          let returnMsg = evt.data.split(',');
          let path = returnMsg.pop();
          this.list.push({
            messageContent:returnMsg.join(),
            fromTo:0,
            path:path
          });
        } else {
          this.list.push(JSON.parse(evt.data));
        }
      }
    };
    // 用于指定报错时的回调函数
    this.ws.onerror = function(event) {
      // handle error event
      console.log(event);
    };
  },
  destroyed() {
    let sendBody={};  //发送内容的请求体
    // sendBody['residentId']=this.userNew.residentId;
    // sendBody['workNum']=this.userNew.workNum;
    sendBody['fromTo']=1;
    sendBody['close']=true;
    this.ws.send(sendBody);
    this.ws.close();
    this.ws.onclose = function () {
	  }
  },
  mounted() {
    this.$refs.wrapper.scrollTo(0, document.body.clientHeight);
  },
  methods: {
    scrollT(){ //解决ios软键盘会遮住输入框的问题
      setTimeout(function(){
        document.body.scrollTop = document.body.scrollHeight;  
      },300);
    },
    scrollTo(){ // * 解决苹果软键盘弹出的影响
      window.scrollTo(0, document.body.clientHeight)  
    },
    inputText(e){  //发送消息框的判定
      e.path[0].innerText=e.path[0].innerText.slice(0,300);
      if(e.path[0].innerText.length>=300){
        // Toast({
          this.$message.error('最多只可输入300个字符')
        //   message: '最多只可输入300个字符',
        // });
      }
      this.keepLastIndex(e.path[0]);
    },
    sendnew(){   // 使用 send() 方法发送数据
      if(this.$refs.wrapper_input_i.innerText){
        let sendBody={};  //发送内容的请求体
        // sendBody['residentId']=this.userNew.residentId;
        // sendBody['workNum']=this.userNew.workNum;
        sendBody['fromTo']=1;
        sendBody['messageContent']=this.$refs.wrapper_input_i.innerText;
        this.ws.send(JSON.stringify(sendBody));
        this.$refs.wrapper_input_i.innerText='';
        let timer = setInterval(()=>{
          if (this.ws.bufferedAmount === 0) {
            // 发送完毕
            clearInterval(timer);
            this.size++;
            console.log(this.list)
          } else {
            // 发送还没结束
          }
        },100);
      }else{
        // Toast({
        //   message: '请输入要说的话',
        // });
        this.$message.error('请输入要说的话')
      }
    },
    keepLastIndex(obj) {   //解决div的contenteditable，光标不能聚集最后的情况
      if (window.getSelection) {//ie11 10 9 ff safari
          obj.focus(); //解决ff不获取焦点无法定位问题
          var range = window.getSelection();//创建range
          range.selectAllChildren(obj);//range 选择obj下所有子内容
          range.collapseToEnd();//光标移至最后
      }
      else if (document.selection) {//ie10 9 8 7 6 5
          var range = document.selection.createRange();//创建选择对象
          //var range = document.body.createTextRange();
          range.moveToElementText(obj);//range定位到obj
          range.collapse(false);//光标移至最后
          range.select();
      }
    },
    // newWebSocketFun(current=1,size=10){   //初始化一个 WebSocket 对象
    //   //本地用8005 线上用demo记得切换
    //   const _url=this.webSurl+"/chatServer?current="+current+"&size="+size+"&residentId="+this.userNew.residentId+"&workNum="+this.userNew.workNum;
    //   let ws = new WebSocket(_url);
    //   // 建立 web socket 连接成功触发事件
    //   ws.onopen = () => {
    //     // 使用 send() 方法发送数据
    //     ws.send("发送数据");
    //     this.sendnew();
    //   };
    //   // 接收服务端数据时触发事件
    //   ws.onmessage = (evt) => {
    //     this.list.push(JSON.parse(evt.data));
    //   };
    //   // 断开 web socket 连接成功触发事件
    //   ws.onclose = () => {
    //   };
    // }
  },
  // beforeRouteEnter (to, from, next) {   //从聊天列表跳转到聊天页首先抓取数据
  //   //传递过来的参数
  //   var data = to.params.data;
  //   next(vm => {
        
  //   })
  // }
}
</script>

<style scoped lang="scss">
.chat_box {
  background-color: #F8F8F8;
  position: relative;
  -webkit-overflow-scrolling: touch;//* 增加该属性，可以增加弹性，是滑动更加顺畅 */
  ul{
    box-sizing: border-box;
    padding: 34px;
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 120px;
    overflow-y: auto;
    z-index: -10;
    list-style: none;
    li{
      div{
        word-wrap: break-word;
      }
      div:nth-child(3){
        width: 113px;
        display: inline-block;
        vertical-align: top;
        img{
          border-radius: 50%;
        }
      }
      div:nth-child(4){
        box-sizing: border-box;
        padding: 25px;
        max-width: 420px;
        border-radius: 10px;
        margin-left: 40px;
        display: inline-block;
        vertical-align: top;
        background-color: #fff;
        position: relative;
        margin-bottom: 20px;
        box-shadow: 1px 1px 1px 1px #ececec;
      }
      div:nth-child(4)::before{
        content: '';
        position: absolute;
        top: 20px;
        left: -25px;
        width:0;
        height:0;
        border-left:30px solid transparent;
        border-top:30px solid #fff;
      }
      div:nth-child(1){
        text-align: center;
        margin-bottom: 20px;
        span{
          color: #8e8e8e;
          font-size: 12px;
          background-color: #E5E5E5;
          display: inline-block;
          padding: 5px 20px;
          border-radius: 10px;
        }
      }
      div:nth-child(2){
        text-align: center;
        margin-bottom: 20px;
        span{
          color: #8e8e8e;
          font-size: 12px;
          background-color: #E5E5E5;
          display: inline-block;
          padding: 5px 20px;
          border-radius: 10px;
        }
      }
    }
    .wrapper_box{
      position: relative;
      div:nth-child(3){
        float: right;
        margin-left: 40px;
      }
      div:nth-child(4){
        word-wrap: break-word;
        float: right;
        background-color: #9fe65a;
      }
      div:nth-child(4)::before{
        content: '';
        border-right:0px solid transparent;
        border-top:0px solid transparent;
      }
      div:nth-child(4)::after{
        content: '';
        position: absolute;
        top: 20px;
        right: -25px;
        width:0;
        height:0;
        border-right:30px solid transparent;
        border-top:30px solid #9fe65a;
      }
      div:nth-child(1){
        text-align: center;
      }
    }
    .wrapper_box::after{
      display:block;clear:both;content:"";visibility:hidden;height:0;
    }
  }
  // .wrapper_input_b /deep/
  .wrapper_input_b{
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2000;
    width: 100%;
    min-height: 120px;
    background-color: #fff;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 20px 0;
    span{
      display: inline-block;
      width: 0%;
      height: 80px;
      background: url('../../../assets/image/07.png') no-repeat;
      background-position: center center;
    }
    .w_wrapper_box{
      margin-left: 2%;
      width: 78%;
      height: auto;
      border: 1px solid #F3F3F3;
      padding: 20px 0;
      background-color: #F3F3F3;
      border-radius: 20px;
      div{
        width: 100%;
        min-height: 40px;
        max-height: 120px;
        overflow-y: scroll;
        line-height: 40px;
        font-size: 30px;
        box-sizing: border-box;
        padding: 0px 20px;
        margin-right: 2%;
        resize:none;
        outline: none;
        -webkit-user-select:text
      }
    }
    button{
      width: 18%;
      background-color: #26a2ff;
      padding: 0 20px;
      height: 80px;
      line-height: 80px;
      margin: 0 2%;
    }
  }
}
</style>