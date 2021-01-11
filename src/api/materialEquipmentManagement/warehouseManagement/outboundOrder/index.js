import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 物资设备 - 仓库管理 - 生成出库单 - 分页搜索
export const searchOutboundOrderList = data => get ('/material/warehouse/delivered/taskPage', data)

// 物资设备 - 出库类型相关数据
// export const outboundTypeAssociatedData = data => get ('/material/addlines/list', data)

// 物资设备 - 仓库管理 - 出库单 - 查询详情
export const outboundOrderListData = data => get ('/material/warehouse/delivered/getTaskBySourceId', data)

// 物资设备 - 仓库管理 - 入库单 - 提交
export const submitOutboundOrderData = data => post ('/material/warehouse/delivered/submit', data)

// 物资设备 - 出库单 - 出库记录
export const outgoingRecordList = data => get ('/material/warehouse/delivered/page', data)

// 物资设备 - 仓库管理 - 生成出库单 - 中止出库
export const suspensionOfExport = data => get ('/material/warehouse/delivered/discontinue', data)

// 物资设备 - 仓库管理 - 出库单-通过id查询
export const outgoingRecordQueryById = data => get ('/material/warehouse/delivered/queryById', data)

// 物资设备 - 出库单确认 - 分页搜索
export const deliveryOrderConfirmation = data => get ('/material/warehouse/delivered/pageByCategory', data)

// 物资设备 - 出库单确认 - 确认出库
export const confirmOutStock = data => get ('/material/warehouse/delivered/receiveAffirm', data)



