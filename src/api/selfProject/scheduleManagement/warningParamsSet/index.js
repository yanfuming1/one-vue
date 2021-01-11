import {get,post,putData,deleteData} from "../../../../plugin/axios";

// 自营项目 - 进度管理 - 预警参数设置-列表全部查询
export const warningParameterList = data=> get ('/self/schedule/warningParameter/list', data)

// 自营项目 - 进度管理 - 预警参数设置-查询一个项目的预警参数设置信息
export const warningParameterListByProCode = data=> get ('/self/schedule/warningParameter/listByProjectCode', data)

// 自营项目 - 进度管理 - 预警参数设置-更新参数设置
export const warningParameterListUpdate = data=> post ('/self/schedule/warningParameter/saveList/' + data.projectCode, data)
