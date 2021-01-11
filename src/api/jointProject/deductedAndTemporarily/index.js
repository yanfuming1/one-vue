import {get, post, deleteData, putData} from "../../../plugin/axios";

// /joint/withhold/deductSearch  应扣-分页搜索
export const withHoldDeductSearch = data => get('/joint/withhold/deductSearch',data)

// /joint/withhold/deleteBatch  应扣暂押-批量删除
export const withHoldDel = data => deleteData('/joint/withhold/deleteBatch',data)

// /joint/withhold/pledgeSearch  暂押-分页搜索
export const withHoldPledgeSearch = data => get('/joint/withhold/pledgeSearch',data)

// 	/joint/withhold/release  应扣暂押-暂押金额释放方法
export const withHoldRelease = data => get('/joint/withhold/release',data)

// /joint/withhold/lookDetainRecord  应扣暂押-暂押金额查看释放记录
export const lookDetainRecord = data => get('/joint/withhold/lookDetainRecord',data)
