import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 仓库管理 - 期末盘点-分页搜索
export const searchFinalInventoryList = data => get ('/material/warehouse/check/page', data)

// 物资设备 - 仓库管理 - 期末盘点-添加
export const addFinalInventory = data => post ('/material/warehouse/check/add', data)

// Summary	物资设备 - 仓库管理 - 期末盘点 - 通过id删除
export const deleteFinalInventory = data => deleteData ('/material/warehouse/check/delete', data)

// 物资设备 - 仓库管理 - 期末盘点-批量删除
export const deleteBatchFinalInventory = data => deleteData ('/material/warehouse/check/deleteBatch', data)

// 物资设备 - 仓库管理 - 期末盘点-提交流程接口
export const submitFinalInventory = data => post ('/material/warehouse/check/submit', data)

// 物资设备 - 仓库管理 - 期末盘点-编辑
export const editFinalInventory = data => putData ('/material/warehouse/check/edit', data)

// 物资设备 - 仓库管理 - 期末盘点-通过id查询
export const queryByIdFinalInventory = data => get ('/material/warehouse/check/queryById', data)

// 物资设备 - 仓库管理 - 期末盘点-审核和反审核
export const toExamineOperation = data => get ('/material/warehouse/check/checkOrAgainst', data)
