import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 仓库管理 - 锁定库存-分页搜索
export const searchlockInventoryList = data => get ('/material/warehouse/lock/page', data)

// 物资设备 - 仓库管理 - 锁定库存-编辑
export const editLockInventoryList = data => putData ('/material/warehouse/lock/edit', data)

// 物资设备 - 仓库管理 - 锁定库存-添加
export const addLockInventoryList = data => post ('/material/warehouse/lock/add', data)

// 物资设备 - 仓库管理 - 锁定库存-提交流程接口
export const submitLockInventoryList = data => post ('/material/warehouse/lock/submit', data)

// 物资设备 - 仓库管理 - 锁定库存-通过id查询
export const queryByIdLockInventoryList = data => get ('/material/warehouse/lock/queryById', data)

// 物资设备 - 采购申请-重新提交
export const resubmitLockInventoryList = data => post ('/material/warehouse/lock/resubmit', data)

// 物资设备 - 仓库管理 - 锁定库存-审批 , 驳回 , 作废
export const operationLockInventoryList = data => post ('/material/warehouse/lock/approveOrRejectOrCancelled', data)

// 物资设备 - 仓库管理 - 锁定库存-通过id删除
export const delLockInventory = data => deleteData ('/material/warehouse/lock/delete', data)

// 物资设备 - 仓库管理 - 锁定库存-批量删除
export const deleteBatchLockInventory = data => deleteData ('/material/warehouse/lock/deleteBatch', data)

// 	物资设备 - 仓库管理 - 锁定库存-审核和反审核
export const auditLockLibrary = data => get ('/material/warehouse/lock/checkOrAgainst', data)

// 物资设备 - 仓库管理 - 锁定库存-释放库存
export const releaseInventory = data => get ('/material/warehouse/lock/releaseById', data)

