import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 仓库管理 - 入库单 - 分页搜索
export const getOtherWarehousesPageList = data => get ('/material/warehouse/warrant/page', data)

// 物资设备 - 仓库管理 - 入库单 - 不分页
export const getOtherWareHousesList = data => get ('/material/warehouse/warrant/list', data)

// 物资设备 - 入库来源（入库类型）
export const storageTypeOtherWarehouses = data => get ('/material/warehouse/warrant/taskList', data)

// 物资设备 - 仓库管理 - 入库单 - 提交
export const sumbitOtherWarehouses = data => post ('/material/warehouse/warrant/submit', data)

// 物资设备 - 仓库管理 - 入库单-通过id查询
export const queryByIdOtherWarehouses = data => get ('/material/warehouse/warrant/queryById', data)

//	物资设备 - 仓库管理 - 入库单-批量删除
export const deleteBatchWarehousing = data => deleteData ('/material/warehouse/warrant/deleteBatch', data)

// 物资设备 - 仓库管理 - 入库单 - 中止入库
export const purchaseOtherWarehousesSuspend = data => get ('/material/warehouse/warrant/discontinue', data)

// 物资设备 - 仓库管理 - 入库单
export const getWarehousingConfirmPageList = data => get ('/material/warehouse/warrant/pageByCategory', data)

// 物资设备 - 仓库管理 - 入库单 - 确认入库
export const executeWarehousingConfirm = id => get ('/material/warehouse/warrant/returnAffirm', id)