import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 仓库管理 - 退换货管理 - 分页搜索
export const searchReturnedGoodsList = data => get ('/material/warehouse/alteration/page', data)

// 采购订单
export const selectPurchaseOrder = data => get ('/material/procurement/indent/list', data)

// 物品类型 （材料类型）
export const materialType = data => get ('/material/material/group/list', data)

// 物资设备 - 仓库管理 - 退换货管理-添加
export const addReturnedGoods = data => post ('/material/warehouse/alteration/add', data)

// 物资设备 - 仓库管理 - 退换货管理-编辑
export const editReturnedGoods = data => putData ('/material/warehouse/alteration/edit', data)

// 物资设备 - 仓库管理 - 退换货管理-提交流程接口
export const submitReturnedGoods = data => post ('/material/warehouse/alteration/submit', data)

// 物资设备 - 仓库管理 - 退换货管理-通过id查询
export const queryByIdReturnedGoods = data => get ('/material/warehouse/alteration/queryById', data)

// 物资设备 - 采购申请-重新提交
export const resubmitReturnedGoods = data => post ('/material/warehouse/alteration/resubmit', data)

// 物资设备 - 仓库管理 - 退换货管理-审批 , 驳回 , 作废
export const operationReturnedGoods = data => post ('/material/warehouse/alteration/approveOrRejectOrCancelled', data)

// 物资设备 - 仓库管理 - 退换货管理-通过id删除
export const delReturnedGoods = data => deleteData ('/material/warehouse/alteration/delete', data)



