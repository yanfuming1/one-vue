import Vue from 'vue'
import util from '../../libs/util';
import router from '@/router'
import store from '@/store'
import { Notification } from 'element-ui'

const webSocket = {}

const CONNECT =      1 	 // 第一次(或重连)初始化连接
const CHAT =         2   // 聊天消息
const SIGNED =       3	 // 消息签收
const KEEPALIVE =    4 	 // 客户端保持心跳
const PULL_FRIEND =  5	 // 重新拉取好友
const PUSH_MSG =     6   // "向用户推送消息"
const PUSH_SING_IN = 7

let interval = {}
let vm = new Vue()

/**
 * 和后端的 ChatMsg 聊天模型对象保持一致
 * @param {Object} senderId
 * @param {Object} receiverId
 * @param {Object} msg
 * @param {Object} msgId
 */
function ChatMsg (senderId, receiverId, msg, msgId){
    this.sendId = senderId;
    this.receiverId = receiverId;
    this.msg = msg;
    this.msgId = msgId;
    
    return this.ChatMsg
}

/**
 * 构建消息 DataContent 模型对象
 * @param {Object} action
 * @param {Object} chatMsg
 * @param {Object} extand
 */
function DataContent (action, chatMsg, extand, pushMsg){
    this.action = action;
    this.chatMassage = chatMsg;
    this.extend = extand;
    this.pushMsg = pushMsg
}

//向后台发送消息
window.WS = {

    socket : null,
    init: function() {
        if (window.WebSocket) {
            
            if (WS.socket != null && WS.socket.readyState == WebSocket.OPEN && WS.socket !=undefined) {
                return false;
            }
            let url = `ws://${process.env.NODE_ENV !== 'development' ? store.state.d2admin.config.ws : process.env.VUE_APP_WS}/hello`
            WS.socket = new WebSocket(url);
            WS.socket.onopen = WS.wsopen;
            WS.socket.onclose = WS.wscolse;
            WS.socket.onerror= WS.wserror;
            WS.socket.onmessage = WS.wsmessage;
        }
    },

    send: function(msg) {
        //如果已经连接 直接发送
        if (WS.socket != null && WS.socket != undefined && WS.socket.readyState === WebSocket.OPEN ) {
            WS.socket.send (msg);
        } else {
            // console.log ('重新连接')
            // WS.init ()
            // setTimeout ("WS.againSend('" + msg + "')", "25000");
            clearInterval (interval)
        }
    },
  
    againSend: function(msg) {
        WS.send(msg);
    },

    wsopen: function() {
        console.log("连接已将建立。。。。")
        //构建一个 ChatMsg
        var chatMsg = new ChatMsg (util.cookies.get('uuid'), null, null, null)
        // 构建一个 DataContent
        var dataContent = new DataContent (CONNECT, chatMsg, null, null)
        //发送
        WS.send (JSON.stringify (dataContent));
    },

    wscolse: function() {
        console.log ("关闭连接");
    },

    wserror: function() {
        console.log ("发生错误。。。。。");
    },

    wsmessage: function(v) {
        //调用页面回显消息
        var dataContent = JSON.parse (v.data);
        messageType (dataContent)
    },

    keepalive: function() {
        console.log ('维持心跳')
        // 构建对象
        var dataContent = new DataContent (KEEPALIVE, null, null, null);
        // 发送心跳
        WS.send (JSON.stringify(dataContent));
    }
    
}

function messageType (dataContent) {
    switch (dataContent.action) {
        case 6:
            remindTypeFiltrate (dataContent.pushMsg)
            // 构建一个 DataContent
            var dataContent = new DataContent (PUSH_SING_IN, null, dataContent.pushMsg.id, null)
            // 收到消息就 签收
            WS.send (JSON.stringify (dataContent));
            break
    }
}

function remindTypeFiltrate (data) {
    switch (data.remindType) {
        case '1':
            notification (data)
            break
        case '2':
            messageBounced (data, 'warning')
            break
        case '3':
            messageBounced (data, 'danger')
            break
    }
}

function notification (data) {
    let h = vm.$createElement;
    let notify = Notification({
        duration:10000, //
        title: '消息',
        message: h ('a', {
            on: {
                click: () => {
                    notify.close ()
                    route (data)
                }
            }
        }, data.message)
    })
}

function messageBounced (data, type) {
    vm.$confirm(data.message, `${data.remindType == '2' ? '重要' : '紧急'}通知`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type,
        customClass:`${type}Message`
    }).then(() => {
        route (data)
    });
}

function route (data) {
    let pathArr = '', nameArr = ''
    pathArr = data.path.split('?')
    nameArr = pathArr[0].split('/')
    router.push({
        path: pathArr[0],
        name:nameArr.length === 4 ? nameArr[nameArr.length-2] : nameArr[nameArr.length-1] ,
        params: { detailData: pathArr.length > 1 ?  pathArr[1].split ('=')[1] : '' }
    })
}

/**
 * 
 * 连接websocket
 */
webSocket.init = function () {
    WS.init();
}

/**
 * 
 * 关闭连接
 */
webSocket.close = function () {
    clearInterval (interval)
}

/**
 * 
 * 定时任务保持心跳
 */
webSocket.keepalive = function () {
    if (util.cookies.get('isLogined')) interval = setInterval ("WS.keepalive ()" , 30000)
}

export default webSocket