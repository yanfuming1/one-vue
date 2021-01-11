import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出售合同-分页搜索
export const sellContractPageList = data => get ('/materialsell/materialSellContract/searchPageList', data)

//  物资设备 - 出售合同-批量删除
export const sellContractDel = data => deleteData ('/materialsell/materialSellContract/deleteBatch', data)

//  物资设备 - 出售合同-添加
export const sellContractAdd = data => post ('/materialsell/materialSellContract/add', data)

//  物资设备 - 出售合同-编辑
export const sellContractEdit = data => putData ('/materialsell/materialSellContract/edit', data)

//  物资设备 - 出售合同-通过id查询
export const sellContractQueryById = data => get ('/materialsell/materialSellContract/queryById', data)

//  物资设备 - 出售合同-提交流程接口
export const sellContractSub = data => post ('/materialsell/materialSellContract/submit', data)

//  物资设备 - 出售合同-重新提交
export const sellContractReSub = data => post ('/materialsell/materialSellContract/resubmit', data)

//  物资设备 - 出售合同-审批 , 驳回 , 作废
export const sellContractProOperation = data => post ('/materialsell/materialSellContract/approveOrRejectOrCancelled', data)

//  查询未被使用的出售申请单
export const sellApplyQueryIsStatus = data => get ('/materialsell/materialSellApply/queryIsStatus', data)


