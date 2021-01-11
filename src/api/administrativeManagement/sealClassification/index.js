import { get, post, putData, deleteData} from "../../../plugin/axios";

// 印章分类-添加
export const addManagementSignetTree = data => post ('/administer/adminSealgroup/add', data)

// 印章分类-批量删除
export const deleteManagementSignetTree = id => deleteData ('/administer/adminSealgroup/delete', id)

// 印章分类-编辑
export const editManagementSignetTree = data => putData ('/administer/adminSealgroup/edit', data)

// 印章分类-查询所有印章分类
export const getManagementSignetTree = () => get ('/administer/adminSealgroup/list')

// 印章分类-通过id查询
export const getManagementSignetTreeById = id => get ('/administer/adminSealgroup/queryById', id)
