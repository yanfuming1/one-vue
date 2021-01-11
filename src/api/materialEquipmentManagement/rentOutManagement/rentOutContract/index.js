import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  物资设备 - 出租管理 - 出租合同-分页搜索
export const rentalContractList = data => get ('/material/rental/rentalContract/searchPageList', data)

//  物资设备 - 出租管理 - 出租合同-批量删除
export const rentalContractDel = data => deleteData ('/material/rental/rentalContract/deleteBatch', data)

//  物资设备 - 出租管理 - 出租合同-添加
export const rentalContractAdd = data => post ('/material/rental/rentalContract/add', data)

//  物资设备 - 出租管理 - 出租合同-编辑
export const rentalContractEdit = data => putData ('/material/rental/rentalContract/edit', data)

//  物资设备 - 出租管理 - 出租合同-提交流程接口
export const rentalContractSubmit = data => post ('/material/rental/rentalContract/submit', data)

//  物资设备 - 采购申请-重新提交
export const rentalContractResubmit = data => post ('/material/rental/rentalContract/resubmit', data)

//  物资设备 - 出租管理 - 出租合同-审批 , 驳回 , 作废
export const contractProOperation = data => post ('/material/rental/rentalContract/approveOrRejectOrCancelled', data)

//  物资设备 - 出租管理 - 出租合同-通过id查询
export const rentalContractQueryById = data => get ('/material/rental/rentalContract/queryById', data)

//  物资设备 - 出租管理 - 出租合同-审核和反审核
export const rentalContractCheck = data => get ('/material/rental/rentalContract/checkOrAgainst', data)

//  物资设备 - 出租管理 - 出租申请-查询流程完结并且未使用的出租申请
export const rentalNoContract = data => get ('/material/rental/rentalApplication/rentalApplicationList', data)