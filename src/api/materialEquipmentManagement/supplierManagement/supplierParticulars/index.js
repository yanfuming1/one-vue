import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 供应商供应物品-添加 
export const addSupplierParticulars = data => post ('/material/supplier/goods/add', data)

// 供应商供应物品-批量删除
export const deleteBatchSupplierParticulars = ids => deleteData ('/material/supplier/goods/deleteBatch', ids)

// 供应商供应物品-编辑 
export const editSupplierParticulars = data => putData ('/material/supplier/goods/edit', data)

// 物资设配 - 供应商供应物品 - 材料 - 分页搜索
export const getSupplierParticularsPageList = data => get ('/material/supplier/goods/goodsList', data)

// 供应商供应物品-通过id查询
export const getSupplierParticularsById = id => get ('/material/supplier/goods/queryById', id)