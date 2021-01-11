import {get,post,putData,deleteData} from "../../plugin/axios";

// 财务模块发送短信通知
export const sendNoteMessage = data=> get ('/sendNoteMessage',data)
// 短信通知验证手机号
export const verification = data=> get ('/verification',data)
