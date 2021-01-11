import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出售申请-分页搜索
export const sellApplyPageList = data => get ('/materialsell/materialSellApply/searchPageList', data)

//  物资设备 - 出售申请-批量删除
export const sellApplyDel = data => deleteData ('/materialsell/materialSellApply/deleteBatch', data)

//  物资设备 - 出售申请-通过id查询
export const sellApplyQueryById = data => get ('/materialsell/materialSellApply/queryById', data)

//  物资设备 - 出售申请-添加
export const sellApplyAdd = data => post ('/materialsell/materialSellApply/add', data)

// 物资设备 - 出售申请-编辑
export const sellApplyEdit = data => putData ('/materialsell/materialSellApply/edit', data)

// 	物资设备 - 出售申请-提交流程接口
export const sellApplySub = data => post ('/materialsell/materialSellApply/submit', data)

//  物资设备 - 出售申请-重新提交
export const sellApplyReSub = data => post ('/materialsell/materialSellApply/resubmit', data)

//  物资设备 - 出售申请-审核和反审核
export const sellApplyOperation = data => post ('/materialsell/materialSellApply/approveOrRejectOrCancelled', data)

//  物资设备 - 出售申请-审核和反审核
export const sellApplyCheckOrAgainst = data => get ('/materialsell/materialSellApply/checkOrAgainst', data)

//  物资设备 - 出售申请-出售申请未使用的数据集合 
export const sellStatusApplyQueryById = data => get ('/materialsell/materialSellApply/queryIsStatus', data)
