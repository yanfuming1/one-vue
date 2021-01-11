import {get, post, deleteData, putData} from "@/plugin/axios";
import { data } from "jquery";

// 行政-证书分类-添加
export const addCertificateClassification = data => post('/administer/credential/category/add',data)

// 行政-证书分类-层级列表全部查询
export const getCertificateClassification = data => get('/administer/credential/category/tree', data)

// 行政管理-证书分类-编辑
export const editCertificateClassification = data => putData('/administer/credential/category/edit', data)

// 行政管理-证书分类-通过id删除
export const delCertificateClassification = data => deleteData('/administer/credential/category/delete', data)