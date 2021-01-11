import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出租管理 - 出租订单-分页搜索
export const rentalOrderPageList = data => get ('/material/rental/rentalOrder/searchPageList', data)

//  物资设备 - 出租管理 - 出租订单-添加
export const rentalOrderAdd = data => post ('/material/rental/rentalOrder/add', data)

//  物资设备 - 出租管理 - 出租订单-编辑
export const rentalOrderEdit = data => putData ('/material/rental/rentalOrder/edit', data)

//  物资设备 - 出租管理 - 出租订单-非工作流提交
export const rentalOrderSaveSubmit = data => post ('/material/rental/rentalOrder/saveSubmit', data)

//  物资设备 - 出租管理 - 出租订单-批量删除
export const rentalOrderDel = data => deleteData ('/material/rental/rentalOrder/deleteBatch', data)

//  物资设备 - 出租管理 - 出租订单-通过id查询
export const rentalOrderQueryById = data => get ('/material/rental/rentalOrder/queryById', data)

//  物资设备 - 出租管理 - 出租订单-分页列表查询
export const rentalOrderList = data => get ('/material/rental/rentalOrder/list', data)

