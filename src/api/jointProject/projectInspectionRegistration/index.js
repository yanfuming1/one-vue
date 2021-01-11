import {get, post, deleteData, putData} from "../../../plugin/axios";

// 联营 巡查记录-分页列表查询
export const jointInspectionRecord = data => get('/joint/engineeringInspectionRecords/list',data)

// 联营项目-通过id查询项目的基本信息 名称 编码 标段 ....
export const basicInformationQueryItem = data => get ('/joint/jointProject/queryBaseById', data)

// 联营 巡查记录-添加
export const saveInformation = data => post ('/joint/engineeringInspectionRecords/add', data)

// Summary	联营 巡查记录-编辑
export const patrolRecordEdit = data => putData ('/joint/engineeringInspectionRecords/edit',data)

// 联营 巡查记录-通过id查询
export const queryPatrolRecordByID = data => get ('/joint/engineeringInspectionRecords/queryById', data)

// 联营 巡查记录-通过id删除
export const deletePatrolRecordByID = data => deleteData ('/joint/engineeringInspectionRecords/delete', data)

// 联营 巡查记录-批量删除
export const batchDeletePatrolRecord = data => deleteData ('/joint/engineeringInspectionRecords/deleteBatch', data)