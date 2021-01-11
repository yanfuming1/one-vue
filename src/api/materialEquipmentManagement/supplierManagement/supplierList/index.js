import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 供应商-添加 
export const addSupplier = data => post ('/supplier/supplier/add', data)

// 供应商-批量删除
export const deleteBatchSupplier = ids => deleteData ('/supplier/supplier/deleteBatch', ids)

// 供应商-编辑 
export const editSupplier = data => putData ('/supplier/supplier/edit', data)

// 物资设配 - 供应商 - 材料 - 分页搜索
export const getSupplierPageList = data => get ('/supplier/supplier/searchPageList', data)

// 物资设配 - 供应商 - 所有
export const getSupplierPageAllList = () => get ('/supplier/supplier/listSupplier')

// 供应商-通过id查询
export const getSupplierById = id => get ('/supplier/supplier/queryById', id)