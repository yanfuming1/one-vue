import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 利润核算-项目看板
export const projectKanBan = data => get ('/self/profit/check/billboard', data) 

// 自营项目 - 利润核算-金额历史变动柱状图
export const histogramKanBan = data => get ('/self/profit/check/histogram', data) 