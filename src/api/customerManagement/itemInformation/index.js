import {get,post,putData,deleteData} from "../../../plugin/axios";

// 联营项目-分页列表查询某个联营人的
export const jointVentureInformation = data => get ('/joint/jointProject/associatedList/'+ data.associatedPersonId + '/' +data.state);