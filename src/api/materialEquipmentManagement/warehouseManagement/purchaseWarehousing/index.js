import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 仓库管理 - 入库单 - 分页搜索
export const searchPurchaseWarehousingList = data => get ('/material/warehouse/warrant/page', data)

// 物资设备 - 仓库管理- 采购入库 - 分页搜索
export const getpurchaseWarehousingPageList = data => get ('/material/warehouse/warrant/procurementPage', data)

// 物资设备 - 仓库管理 - 入库单-通过id查询
export const getPurchaseWarehousingById = data => get ('/material/warehouse/warrant/queryById', data)

// 	物资设备 - 仓库管理 - 入库单-添加
export const addStorage = data => post ('/material/warehouse/warrant/add', data)

//	物资设备 - 仓库管理 - 入库单-通过id删除
export const deleteWarehousingByID = data => deleteData ('/material/warehouse/warrant/delete', data)

//	物资设备 - 仓库管理 - 入库单-批量删除
export const deleteBatchWarehousing = data => deleteData ('/material/warehouse/warrant/deleteBatch', data)

// 物资设备 - 仓库管理 - 入库单-编辑
export const editWarehousing = data => putData ('/material/warehouse/warrant/edit', data)

// 物资设备 - 仓库管理 - 入库单 - 提交
export const submitWarehousing = data =>post ('/material/warehouse/warrant/submit', data)

// 物资设备 - 仓库管理 - 采购入库 - 中止入库
export const purchaseWarehousingSuspend = data => get ('/material/warehouse/warrant/discontinueByProcurement', data)

// 物资设备 - 入库来源（入库类型）
export const purchaseStorageTypeOtherWarehouses = data => get ('/material/warehouse/warrant/taskList', data)

//  物资设备 - 入库单确认 - 分页搜索
export const purchasePageByCategoryList = data => get ('/material/warehouse/warrant/pageByCategory', data)

//  物资设备 - 入库单确认 - 确认入库
export const purchaseReturnAffirm = data => get ('/material/warehouse/warrant/returnAffirm', data)