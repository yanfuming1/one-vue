import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出租管理 - 租金收取-分页搜索
export const rentalChargePageList = data => get ('/material/rental/collect/page', data)

//  物资设备 - 出租管理 - 租金收取-批量删除
export const rentalChargeDeleteBatch = data => get ('/material/rental/collect/deleteBatch', data)

//  物资设备 - 出租管理 - 租金收取-通过id查询
export const getNewChargeById = data => get ('/material/rental/collect/queryById', data)

//  物资设备 - 出租管理 - 租金收取-添加
export const addNewCharge = data => post ('/material/rental/collect/add', data)

//  物资设备 - 出租管理 - 租金收取-编辑
export const editNewCharge = data => putData ('/material/rental/collect/edit', data)

//  物资设备 - 出租管理 - 租金收取-提交流程接口
export const submitNewCharge = data => post ('/material/rental/collect/submit', data)

//  物资设备 - 出租管理 - 租金收取-列表查询
export const getChargeList = data => get ('/material/rental/collect/list', data)
