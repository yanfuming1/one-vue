import { get, post, putData, deleteData} from "../../../plugin/axios";

//  查询领用对应的出库记录
export const receiveOutList = data => get ('/material/warehouse/delivered/pageByCategory', data)

//  确认出库
export const receiveOutAffirm = data => get ('/material/warehouse/delivered/receiveAffirm', data)