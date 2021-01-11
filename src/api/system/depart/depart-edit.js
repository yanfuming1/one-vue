import {get,post,deleteData, putData} from "../../../plugin/axios";

export const DepartEdit = data => putData('/system/department/edit', data)

export const DepartAdd = data => post('/system/department/add', data)

export const DepartDel = data => deleteData('/system/department/delete', data)
