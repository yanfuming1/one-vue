import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 分页搜索
export const receivePageList = data => get ('/materialcollaruse/materialUseApplication/searchPageList', data)

// 物资设备 - 仓库信息 - 列表全部查询
export const synopsisList = data => get ('/material/warehouse/synopsis/list', data)

// 物资设备 - 领用申请-添加
export const receiveAdd = data => post ('/materialcollaruse/materialUseApplication/add', data)

// 物资设备 - 领用申请-批量删除
export const receiveDelBatch = data => deleteData ('/materialcollaruse/materialUseApplication/deleteBatch', data)

// 物资设备 - 领用申请-通过id查询
export const receiveQueryById = data => get ('/materialcollaruse/materialUseApplication/queryById', data)

// 	物资设备 - 领用申请-编辑
export const receiveEdit = data => putData ('/materialcollaruse/materialUseApplication/edit', data)

// 物资设备 - 领用申请-提交流程接口
export const submitReceiveAdd = data => post ('/materialcollaruse/materialUseApplication/submit', data)

// 物资设备 - 领用申请-审批 , 驳回 , 作废
export const receiveProOperation = data => post ('	/materialcollaruse/materialUseApplication/approveOrRejectOrCancelled', data)

// 物资设备 - 领用申请-重新提交
export const reSubmitReceiveAdd = data => post ('/materialcollaruse/materialUseApplication/resubmit', data)


// 	物资设备 - 领用登记-分页搜索
export const receiveRegisterList = data => get ('/materialcollaruse/materialUseRegister/searchPageList', data)

//  物资设备 - 领用登记-批量删除
export const registerDelBatch = data => deleteData ('/materialcollaruse/materialUseRegister/deleteBatch', data)

//  物资设备 - 领用登记-添加
export const registerAdd = data => post ('/materialcollaruse/materialUseRegister/add', data)

//  物资设备 - 领用登记-通过id查询
export const registerQueryById = data => get ('/materialcollaruse/materialUseRegister/queryById', data)

//  物资设备 - 领用登记-编辑
export const registerEdit = data => putData ('/materialcollaruse/materialUseRegister/edit', data)

//  物资设备 - 领用申请-审核和反审核
export const registerCheckOrAgainst = data => get ('	/materialcollaruse/materialUseApplication/checkOrAgainst', data)


// 	物资设备 - 归还登记-添加
export const returnAdd = data => post ('/materialcollaruse/materialUseReturnregister/add', data)

//  物资设备 - 归还登记-分页列表查询
export const returnList = data => get ('/materialcollaruse/materialUseReturnregister/searchPageList', data)

//  物资设备 - 归还登记-通过id查询
export const returnQueryById = data => get ('/materialcollaruse/materialUseReturnregister/queryById', data)

//  物资设备 - 归还登记-批量删除    
export const returnDelBatch = data => deleteData ('/materialcollaruse/materialUseReturnregister/deleteBatch', data)


// 	物资设备-供应商-查询所有供应商
export const allSupplierList = data => get ('/supplier/supplier/listSupplier', data)

//  获取可领用的材料
export const canRegisterList = data => get ('/material/addlines/list', data)

//  从仓库导入 
export const materialWarehousePage = data => get ('/material/warehouse/inventory/page', data)

//  从申请单查找材料
export const materialAddlinePage = data => get ('/material/addlines/page', data)