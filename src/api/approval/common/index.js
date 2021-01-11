import {get,post,putData,deleteData} from "../../../plugin/axios";

// 
export const getProcessPage = data => get ('/activiti/process/page', data)

// 流程模型分类 不传参
export const getModelList = data => get ('/flow/modelGroup/list', data);

// 流程模型分类 不传参
export const getDetails = data => get ('/flow/nodeInfo/details/'+ data);

// 查询当前节点可驳回的节点
export const findReverseRoute = data => get ('/flow/nodeInfo/findReverseRoute/'+ data);

// 查询当前节点可转办的节点
export const careOf = (data,data2 )=> post ('/activiti/task/careOf/'+ data,data2);

// 财务模块撤销
export const repeal = data=> putData ('/finance/employeeBorrow/repeal',data);

// 财务模块撤回
export const withdraw = data=> get ('/finance/employeeBorrow/withdraw',data);

// 查询当前节点可转办的节点
export const hasten = data => get ('/activiti/task/hasten/'+ data);

// 通过taskId 查询当条数据
export const findByTaskId = data => get ('/activiti/process/findByTaskId/'+ data);

// 查询角标
export const pendingCount = data => get ('/activiti/process/pendingCount', data);

