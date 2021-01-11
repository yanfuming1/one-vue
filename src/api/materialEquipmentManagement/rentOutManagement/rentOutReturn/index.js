import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出租管理 - 出租归还登记-通过id查询
export const rentalReturnQueryById = data => get ('/material/rental/returnRegistration/queryById', data)

//  物资设备 - 出租管理 - 出租归还登记-批量删除
export const rentalReturnDel = data => get ('/material/rental/returnRegistration/deleteBatch', data)

//  物资设备 - 出租管理 - 出租归还登记-分页搜索
export const rentalReturnPageList = data => get ('/material/rental/returnRegistration/searchPageList', data)

//  物资设备 - 出租管理 - 出租归还登记-添加
export const rentalReturnAdd = data => post ('/material/rental/returnRegistration/add', data)

//  物资设备 - 出租管理 - 出租归还登记-编辑
export const rentalReturnEdit = data => putData ('/material/rental/returnRegistration/edit', data)

//  物资设备 - 出租管理 - 出租归还登记-非工作流提交
export const rentalReturnSaveSubmit = data => post ('/material/rental/returnRegistration/saveSubmit', data)


