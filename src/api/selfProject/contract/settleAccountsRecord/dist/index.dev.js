"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAgainstJointSettleAccountsRecord = exports.getJointSettleAccountsRecordPageList = exports.deleteBatchJointSettleAccountsRecord = exports.resetSubmitJointSettleAccountsRecord = exports.submitJointSettleAccountsRecord = exports.completeJointSettleAccountsRecord = exports.getJointSettleAccountsRecordById = exports.editJointSettleAccountsRecord = exports.addJointSettleAccountsRecord = exports.checkAgainstSettleAccountsRecord = exports.getSettleAccountsRecordPageList = exports.deleteBatchSettleAccountsRecord = exports.resetSubmitSettleAccountsRecord = exports.submitSettleAccountsRecord = exports.completeSettleAccountsRecord = exports.getSettleAccountsRecordById = exports.editSettleAccountsRecord = exports.addSettleAccountsRecord = exports.checkAgainstSelfSettleAccountsRecord = exports.getSelfSettleAccountsRecordPageList = exports.deleteBatchSelfSettleAccountsRecord = exports.resetSubmitSelfSettleAccountsRecord = exports.submitSelfSettleAccountsRecord = exports.completeSelfSettleAccountsRecord = exports.getSelfSettleAccountsRecordById = exports.editSelfSettleAccountsRecord = exports.addSelfSettleAccountsRecord = void 0;

var _axios = require("../../../../plugin/axios");

// 自营项目 — 合同结算记录 — 添加 
var addSelfSettleAccountsRecord = function addSelfSettleAccountsRecord(data) {
  return (0, _axios.post)("/self/contractSettle/add/".concat(data.projectCode), data);
}; // 自营项目 — 合同结算记录 — 编辑 


exports.addSelfSettleAccountsRecord = addSelfSettleAccountsRecord;

var editSelfSettleAccountsRecord = function editSelfSettleAccountsRecord(data) {
  return (0, _axios.putData)("/self/contractSettle/edit/".concat(data.projectCode), data);
}; // 自营项目 — 合同结算记录 — 通过id查询


exports.editSelfSettleAccountsRecord = editSelfSettleAccountsRecord;

var getSelfSettleAccountsRecordById = function getSelfSettleAccountsRecordById(id) {
  return (0, _axios.get)('/self/contractSettle/queryById', id);
}; // 自营项目 — 合同结算记录 — 审批 , 驳回 , 作废


exports.getSelfSettleAccountsRecordById = getSelfSettleAccountsRecordById;

var completeSelfSettleAccountsRecord = function completeSelfSettleAccountsRecord(data) {
  return (0, _axios.post)('/self/contractSettle/approveOrRejectOrCancelled', data);
}; // 自营项目 — 合同结算记录 — 提交流程接口


exports.completeSelfSettleAccountsRecord = completeSelfSettleAccountsRecord;

var submitSelfSettleAccountsRecord = function submitSelfSettleAccountsRecord(data) {
  return (0, _axios.post)("/self/contractSettle/submit/".concat(data.projectCode), data);
}; // 自营项目 — 合同结算记录 — 重新提交流程接口


exports.submitSelfSettleAccountsRecord = submitSelfSettleAccountsRecord;

var resetSubmitSelfSettleAccountsRecord = function resetSubmitSelfSettleAccountsRecord(data) {
  return (0, _axios.post)('/self/contractSettle/resubmit', data);
}; // 自营项目 — 合同结算记录 — 批量删除


exports.resetSubmitSelfSettleAccountsRecord = resetSubmitSelfSettleAccountsRecord;

var deleteBatchSelfSettleAccountsRecord = function deleteBatchSelfSettleAccountsRecord(data) {
  return (0, _axios.deleteData)("/self/contractSettle/deleteBatch/".concat(data.projectCode), data);
}; // 自营项目 — 合同结算记录 — 分页搜索


exports.deleteBatchSelfSettleAccountsRecord = deleteBatchSelfSettleAccountsRecord;

var getSelfSettleAccountsRecordPageList = function getSelfSettleAccountsRecordPageList(id) {
  return (0, _axios.get)('/self/contractSettle/searchPageList', id);
}; // 自营项目 — 合同结算记录 — 审核和反审核


exports.getSelfSettleAccountsRecordPageList = getSelfSettleAccountsRecordPageList;

var checkAgainstSelfSettleAccountsRecord = function checkAgainstSelfSettleAccountsRecord(data) {
  return (0, _axios.get)('/self/contractSettle/checkOrAgainst', data);
};
/**----------------------------------------------------导航------------------------------------------------------- */
// 合同结算记录 — 添加 


exports.checkAgainstSelfSettleAccountsRecord = checkAgainstSelfSettleAccountsRecord;

var addSettleAccountsRecord = function addSettleAccountsRecord(data) {
  return (0, _axios.post)("/bargain/contractSettle/add", data);
}; // 合同结算记录 — 编辑 


exports.addSettleAccountsRecord = addSettleAccountsRecord;

var editSettleAccountsRecord = function editSettleAccountsRecord(data) {
  return (0, _axios.putData)("/bargain/contractSettle/edit", data);
}; // 合同结算记录 — 通过id查询


exports.editSettleAccountsRecord = editSettleAccountsRecord;

var getSettleAccountsRecordById = function getSettleAccountsRecordById(id) {
  return (0, _axios.get)('/bargain/contractSettle/queryById', id);
}; // 合同结算记录 — 审批 , 驳回 , 作废


exports.getSettleAccountsRecordById = getSettleAccountsRecordById;

var completeSettleAccountsRecord = function completeSettleAccountsRecord(data) {
  return (0, _axios.post)('/bargain/contractSettle/approveOrRejectOrCancelled', data);
}; // 合同结算记录 — 提交流程接口


exports.completeSettleAccountsRecord = completeSettleAccountsRecord;

var submitSettleAccountsRecord = function submitSettleAccountsRecord(data) {
  return (0, _axios.post)("/bargain/contractSettle/submit", data);
}; // 合同结算记录 — 重新提交流程接口


exports.submitSettleAccountsRecord = submitSettleAccountsRecord;

var resetSubmitSettleAccountsRecord = function resetSubmitSettleAccountsRecord(data) {
  return (0, _axios.post)('/bargain/contractSettle/resubmit', data);
}; // 合同结算记录 — 批量删除


exports.resetSubmitSettleAccountsRecord = resetSubmitSettleAccountsRecord;

var deleteBatchSettleAccountsRecord = function deleteBatchSettleAccountsRecord(ids) {
  return (0, _axios.deleteData)('/bargain/contractSettle/deleteBatch', ids);
}; // 合同结算记录 — 分页搜索


exports.deleteBatchSettleAccountsRecord = deleteBatchSettleAccountsRecord;

var getSettleAccountsRecordPageList = function getSettleAccountsRecordPageList(id) {
  return (0, _axios.get)('/bargain/contractSettle/searchPageList', id);
}; // 合同结算记录 — 审核和反审核


exports.getSettleAccountsRecordPageList = getSettleAccountsRecordPageList;

var checkAgainstSettleAccountsRecord = function checkAgainstSettleAccountsRecord(data) {
  return (0, _axios.get)('/bargain/contractSettle/checkOrAgainst', data);
};
/**--------------------------------------------------联营项目------------------------------------------------------ */
// 联营项目 — 合同结算记录 — 添加 


exports.checkAgainstSettleAccountsRecord = checkAgainstSettleAccountsRecord;

var addJointSettleAccountsRecord = function addJointSettleAccountsRecord(data) {
  return (0, _axios.post)("/joint/contractSettle/add/".concat(data.projectId), data);
}; // 联营项目 — 合同结算记录 — 编辑 


exports.addJointSettleAccountsRecord = addJointSettleAccountsRecord;

var editJointSettleAccountsRecord = function editJointSettleAccountsRecord(data) {
  return (0, _axios.putData)("/joint/contractSettle/edit/".concat(data.projectId), data);
}; // 联营项目 — 合同结算记录 — 通过id查询


exports.editJointSettleAccountsRecord = editJointSettleAccountsRecord;

var getJointSettleAccountsRecordById = function getJointSettleAccountsRecordById(id) {
  return (0, _axios.get)('/joint/contractSettle/queryById', id);
}; // 联营项目 — 合同结算记录 — 审批 , 驳回 , 作废


exports.getJointSettleAccountsRecordById = getJointSettleAccountsRecordById;

var completeJointSettleAccountsRecord = function completeJointSettleAccountsRecord(data) {
  return (0, _axios.post)('/joint/contractSettle/approveOrRejectOrCancelled', data);
}; // 联营项目 — 合同结算记录 — 提交流程接口


exports.completeJointSettleAccountsRecord = completeJointSettleAccountsRecord;

var submitJointSettleAccountsRecord = function submitJointSettleAccountsRecord(data) {
  return (0, _axios.post)("/joint/contractSettle/submit/".concat(data.projectId), data);
}; // 联营项目 — 合同结算记录 — 重新提交流程接口


exports.submitJointSettleAccountsRecord = submitJointSettleAccountsRecord;

var resetSubmitJointSettleAccountsRecord = function resetSubmitJointSettleAccountsRecord(data) {
  return (0, _axios.post)('/joint/contractSettle/resubmit', data);
}; // 联营项目 — 合同结算记录 — 批量删除


exports.resetSubmitJointSettleAccountsRecord = resetSubmitJointSettleAccountsRecord;

var deleteBatchJointSettleAccountsRecord = function deleteBatchJointSettleAccountsRecord(data) {
  return (0, _axios.deleteData)("/joint/contractSettle/deleteBatch/".concat(data.projectId), data);
}; // 联营项目 — 合同结算记录 — 分页搜索


exports.deleteBatchJointSettleAccountsRecord = deleteBatchJointSettleAccountsRecord;

var getJointSettleAccountsRecordPageList = function getJointSettleAccountsRecordPageList(id) {
  return (0, _axios.get)('/joint/contractSettle/searchPageList', id);
}; // 联营项目 — 合同结算记录 — 审核和反审核


exports.getJointSettleAccountsRecordPageList = getJointSettleAccountsRecordPageList;

var checkAgainstJointSettleAccountsRecord = function checkAgainstJointSettleAccountsRecord(data) {
  return (0, _axios.get)('/joint/contractSettle/checkOrAgainst', data);
};

exports.checkAgainstJointSettleAccountsRecord = checkAgainstJointSettleAccountsRecord;