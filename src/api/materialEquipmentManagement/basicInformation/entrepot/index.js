import { get, post, putData, deleteData} from "../../../../plugin/axios";

// 仓库设置-添加 
export const addEntrepot = data => post ('/material/warehouse/synopsis/add', data)

// 仓库设置-批量删除
export const deleteBatchEntrepot = ids => deleteData ('/material/warehouse/synopsis/deleteBatch', ids)

// 仓库设置-编辑 
export const editEntrepot = data => putData ('/material/warehouse/synopsis/edit', data)

// 仓库设置-模糊
export const getEntrepotPageList = id => get ('/material/warehouse/synopsis/page', id)

// 仓库设置-通过id查询
export const getEntrepotById = id => get ('/material/warehouse/synopsis/queryById', id)

// 物资设备 - 仓库信息 - 更换管理员
export const updateEntrepotAdmin = data => putData ('/material/warehouse/synopsis/updateAdmin', data)

// 物资设备 - 仓库信息 - 仓库材料 - 分页搜索
export const getWarehouseInventoryPageList = id => get ('/material/warehouse/inventory/page', id)

// 获取出库单仓库信息
export const getOutboundWarehouseData = data => get ('/material/warehouse/inventory/list', data)

// 获取仓库管理员 所管理的仓库
export const getEntrepotAdminManageEntrepot = data => get ('/material/warehouse/synopsis/pageByAdmin', data)

// 获取仓库管理员 所管理的仓库 - 不分页
export const getEntrepotAdminManageEntrepotNotPage = data => get ('/material/warehouse/synopsis/listByAdmin', data)

// tree
// 仓库设置-添加
export const addEntrepotTree = data => post ('/material/warehouse/group/add', data)

// 仓库设置-删除
export const deleteEntrepotTree = id => deleteData ('/material/warehouse/group/delete', id)

// 仓库设置-编辑
export const editEntrepotTree = data => putData ('/material/warehouse/group/edit', data)

// 仓库设置-查询所有
export const getEntrepotTree = () => get ('/material/warehouse/group/treeAndAmount')

// 仓库设置-通过id查询
export const getEntrepotTreeById = id => get ('/material/warehouse/group/queryById', id)

// 仓库设置 修改仓库状态
export const updateEntrepotDepotActivateById = id => putData ('/material/warehouse/synopsis/updateStatus?id=' + id)