import {get, post, deleteData, putData} from "../../plugin/axios";

// 网盘查询
export const diskSearch = data => get('/resmanage/resourceManage/searchPageList', data)

// 查询父级
export const getParentById = data => get('/resmanage/resourceManage/findById', data)

// 新建文件夹
export const resourceManageAdd = data => post('/resmanage/resourceManage/add', data)

// 批量删除
export const resourceDelete = data => deleteData('/resmanage/resourceManage/deleteBatch', data)

// 获取树结构
export const resourceQueryTree = data => get('/resmanage/resourceManage/queryTree', data)

// 重命名
export const resourceReName = data => putData('/resmanage/resourceManage/rename', data)

// 获取文件的权限
export const getPerList = data => get('/resmanage/respermission/list', data)

// 获取文件的权限 
export const getPerListByFileId = data => get('/resmanage/respermission/queryByResId', data)

// 复制文件到
export const resourCopy = data => get('/resmanage/resourceManage/fuzhi', data)

// 文件权限添加
export const resourPerAdd = data => post('/resmanage/respermission/add', data)

// 获取提取码 
export const resourGetLink = data => get('/resmanage/resourShare/getLink', data)

// 根据id查询文件 
export const resourQueryByResId = data => get('/resmanage/resourShare/queryByResId', data)