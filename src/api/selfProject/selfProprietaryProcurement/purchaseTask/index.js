import {get,post,putData,deleteData} from "@/plugin/axios";
import { getPrototypeOf } from "core-js/fn/object";

// 自营项目 - 采购任务-中止任务
export const selfPurchaseSuspendTask = data=> get ('/self/procurement/purchaseTask/discontinueTask/' + data.projectCode,data)

// 	自营项目 - 采购任务-任务分解
export const selfPurchaseTaskDecomposition = data=> post ('/self/procurement/purchaseTask/disintegrateTask/' + data.projectCode,data)

// 自营项目 - 采购任务-完成任务
export const selfPurchasePerform = data=> get ('/self/procurement/purchaseTask/performTask/' + data.projectCode,data)


