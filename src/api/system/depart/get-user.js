import {get} from "../../../plugin/axios";

export const GetUser = data => get('/system/staff/queryStaffDictionary', data)
