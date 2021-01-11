import {get, post, deleteData, putData, fileGet} from "../../../plugin/axios";

// /file/upload  文件上传
export const fileUpload = data => post('/file/upload', data)
// /file/upload  文件上传
export const multiUpload = data => post('/file/multiUpload', data)

// /file/uploadPerson  个人网盘上传文件
export const filePersonUpload = data => post('/file/uploadPerson', data)
// 追加附件
export const fileUploadAdd = data => post('/file/additionalFile', data)

// /file/upload  文件上传
export const getFileName = data => get('/file/getRawFileName', data)

// /file/upload  文件上传
export const fastDFSDelete = data => get('/file/fastDFSDelete', data)

// /file/fastDFSDownload 文件下载
export const fastDFSDownload = data => get('/file/download', data)

// 文件下载 -- 新
export const newFastDFSDownload = data => fileGet('/file/fastDFSDownload', data)

// 文件删除 -- 新
export const newFastDFSDel = data => get('/file/fastDFSDelete', data)

// /wopi/preview  文件预览
export const docPreview = data => get('/wopi/preview', data)
