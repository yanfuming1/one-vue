import {get,post,putData,deleteData} from "../../../plugin/axios";

export const goAdd = data => get ('/administrativeManagement/meetingManage/goAdd', data)