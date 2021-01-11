import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 材料库-添加 
export const addMaterialDepot = data => post ('/material/material/model/add', data)

// 材料库-批量删除
export const deleteBatchMaterialDepot = ids => deleteData ('/material/material/model/deleteBatch', ids)

// 材料库-编辑 
export const editMaterialDepot = data => putData ('/material/material/model/edit', data)

// 物资设配 - 材料库 - 材料 - 分页搜索
export const getMaterialDepotPageList = data => get ('/material/material/model/page', data)

// 物资设配 - 材料库 - 材料 - 无搜索
export const getMaterialDepotAllList = data => get ('/material/material/model/list', data)

// 材料库-通过id查询
export const getMaterialDepotById = id => get ('/material/material/model/queryById', id)

// 材料库-更改材料状态
export const updateMaterialDepotActivateById = id => putData ('/material/material/model/activate?id=' + id, id)

// 材料库-查询当前模块的可用的材料
export const getMaterialDepotByModuleId = id => get ('/material/addlines/list', id)

// tree
// 材料库-添加
export const addMaterialDepotTree = data => post ('	/material/material/group/add', data)

// 材料库-批量删除
export const deleteMaterialDepotTree = id => deleteData ('/material/material/group/delete', id)

// 材料库-编辑
export const editMaterialDepotTree = data => putData ('/material/material/group/edit', data)

// 材料库-查询所有
export const getMaterialDepotTree = data => get ('/material/material/group/treeAndAmount', data)

// 材料库-通过id查询
export const getMaterialDepotTreeById = id => get ('/material/material/group/queryById', id)