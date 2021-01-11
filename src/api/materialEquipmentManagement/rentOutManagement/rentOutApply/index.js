import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  供应商列表
export const listSupplier = data => get ('/supplier/supplier/listSupplier', data)

//  材料分类列表
export const materialGroupList = data => get ('/material/material/group/list', data)

//  物资设备 - 出租管理 - 出租申请-通过id查询
export const rentalQueryById = data => get ('/material/rental/rentalApplication/queryById', data)

//  物资设备 - 出租管理 - 出租申请-添加
export const rentalAdd = data => post ('/material/rental/rentalApplication/add', data)

//  物资设备 - 出租管理 - 出租申请-编辑
export const rentalEdit = data => putData ('/material/rental/rentalApplication/edit', data)

//  物资设备 - 出租管理 - 出租申请-分页搜索
export const rentalSearchPageList = data => get ('/material/rental/rentalApplication/searchPageList', data)

//  物资设备 - 出租管理 - 出租申请-批量删除
export const rentalDeleteBatch = data => deleteData ('/material/rental/rentalApplication/deleteBatch', data)

//  物资设备 - 出租管理 - 出租申请-提交流程接口
export const rentalSubmit = data => post ('/material/rental/rentalApplication/submit', data)

//  物资设备 - 采购申请-重新提交
export const rentalResubmit = data => post ('/material/rental/rentalApplication/resubmit', data)

//  物资设备 - 出租管理 - 出租申请-审批 , 驳回 , 作废
export const rentalProOperation = data => post ('/material/rental/rentalApplication/approveOrRejectOrCancelled', data)

//  物资设备 - 出租管理 - 出租申请-审核和反审核
export const rentalCheckOrAgainst = data => get ('/material/rental/rentalApplication/checkOrAgainst', data)

//  获取领用申请单的列表 
export const useApplicationList = data => get ('/materialcollaruse/materialUseApplication/listBySpot', data)



