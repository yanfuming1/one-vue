import { get, post, putData, deleteData} from "../../../../plugin/axios";

//  供应商评审-通过id查询
export const getSupplierEvaluateById = id => get ('/material/supplier/appraisal/queryById', id)

// 供应商评审-列表
export const getSupplierEvaluatePageList = data => get ('/material/supplier/appraisal/supplierList', data)

// 供应商评审-添加
export const addSupplierParticulars = data => post ('/material/supplier/appraisal/add', data)