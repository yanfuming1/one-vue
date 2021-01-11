import {get,post,putData,deleteData} from "../../../plugin/axios";

// 甲方客户账户修改记录-查询这个甲方客户的账号修改记录
export const getCustomesAccountModificationRecord = id => get ('/customers/customesAccountModificationRecord/page', id)

// 甲方客户信息表-修改账号信息
export const updataFirstPartyAccountModificationRecord = data => putData ('/customers/customers/editAccount', data)