import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 报废申请-分页搜索
export const searchScrapRequestList = data => get ('/materialscrap/materialScrapApply/searchPageList', data)

// 物资设备 - 报废申请-添加
export const addScrapRequest = data => post ('/materialscrap/materialScrapApply/add', data)

// 物资设备 - 报废申请-编辑
export const editScrapRequest = data => putData ('/materialscrap/materialScrapApply/edit', data)

// 物资设备 - 报废申请-提交流程接口
export const submitScrapRequest = data => post ('/materialscrap/materialScrapApply/submit', data)

// 物资设备 - 报废申请-通过id查询
export const queryByIdScrapRequest = data => get ('/materialscrap/materialScrapApply/queryById', data)

// 物资设备 - 报废申请-审批 , 驳回 , 作废
export const operationScrapRequest = data => post ('/materialscrap/materialScrapApply/approveOrRejectOrCancelled', data)

// 物资设备 - 报废申请-重新提交
export const resubmitScrapRequest = data => post ('/materialscrap/materialScrapApply/resubmit', data)

// 物资设备 - 报废申请-审核和反审核
export const auditScrapRequest = data => get ('/materialscrap/materialScrapApply/checkOrAgainst', data)

// 物资设备 - 报废申请-通过id删除
export const delScrapRequest = data => deleteData ('/materialscrap/materialScrapApply/delete', data)

// 物资设备 - 报废申请-批量删除
export const deleteBatchScrapRequest = data => deleteData ('/materialscrap/materialScrapApply/deleteBatch', data)

// 物资设备 - 报废申请-物品使用年限
export const serviceLifeArticles = data => get ('/materialscrap/materialScrapApply/queryLife', data)

// 领用申请
export const applyForOrder = data => get ('/materialcollaruse/materialUseApplication/listBySpot', data)

