import { data } from "jquery";
import {get,post,putData,deleteData} from "../../../plugin/axios";

// 项目创建-分页搜索
export const selfProjectPageList = data=> get ('/self/previous/projectCreate/searchPageList',data)

// 项目创建-添加
export const selfProjectAdd = data=> post ('/self/previous/projectCreate/add',data)

// 项目创建-编辑
export const selfProjectEdit = data=> putData ('/self/previous/projectCreate/edit/' + data.projectCode,data)

// 项目创建-通过id删除
export const selfProjectDelete = data=> deleteData ('/self/previous/projectCreate/delete',data)

// 获取全部自营项目字典项
export const getAllProjectDic = data=> get ('/self/previous/projectCreate/getAllProjectDic',data)

// 项目创建-通过项目id查询
export const selfProjectQueryById = data=> get ('/self/previous/projectCreate/queryById',data)

// 项目创建-提交流程接口
export const selfProjectSub = data=> post ('/self/previous/projectCreate/submit',data)

// 重新提交
export const selfProjectReSub = data=> post ('/self/previous/projectCreate/resubmit',data)

// 项目创建-审批 , 驳回 , 作废
export const selfProjectOperation = data=> post ('/self/previous/projectCreate/approveOrRejectOrCancelled',data)

// 自营项目 — 前期跟踪 — 项目创建-通过项目编码查询项目基本信息
export const selfQueryBaseMsgByCode = data=> get ('/self/previous/projectCreate/queryBaseMsgByCode',data)

// 财务获取自营项目的关联列表
export const getSelfProjectTofinancial = () => get ('self/approval/approval/getUnifyProject')

// 获取项目的基本信息
export const getSelfProjectHighestVersion = code => get ('/self/previous/projectCreate/getHighestVersion', code)

// 自营项目 — 前期跟踪 — 项目创建-关注/取消关注
export const updataSelfProjectAttention = data => get (`/self/previous/projectCreate/attention`, data)

// 	自营项目 — 前期跟踪 — 我的项目 — 我关注的
export const getSelfProjectAttentionList = data => get ('/self/previous/projectCreate/listByAttention', data)

// 	自营项目 — 前期跟踪 — 我的项目 — 我创建的
export const getSelfProjectCreateList = data => get ('/self/previous/projectCreate/listByCreate', data)

// 	自营项目 — 前期跟踪 — 我的项目 — 我负责的
export const getSelfProjectPrincipalList = data => get ('/self/previous/projectCreate/listByPrincipal', data)

//  自营项目 — 前期跟踪 — 我的项目 — 我参与的
export const getSelfProjectParticipantList = data => get ('/self/previous/projectCreate/listByParticipant', data)