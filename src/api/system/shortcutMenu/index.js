import {get, post} from "../../../plugin/axios";

export const getShortcutMenuAllPer = () => get('/system/homeCustomization/queryAllPer')

export const getShortcutMenuByUserId = () => get ('/system/homeCustomization/queryById')

export const addShortcutMenu = data => post ('/system/homeCustomization/add', data)