import {get,post,putData,deleteData} from "../../../plugin/axios";

// 获取个人信息
export const getPersonalDetailsFindById = () => get ('/system/staff/findById')

// 更改更人信息
export const updataPersonalCenterEditor = data => post ('/system/staff/PersonalCenterEditor', data)

// 修改密码
export const updataPassword = id => get ('/system/user/updatePassword', id)

// 个人中心银行账户
export const personalCenterAdd = data => post ('/system/bankAccount/personalCenterAdd', data)

// 生成验证码
export const getAuthenticationCode = data => get ('/createCode', data)

// /verify
export const verificationPhone = data => get('/verify', data)

// Summary	账号登录信息-更改用户头像
export const changeUserAvatar = data => get ('/system/user/changeHandImg',data)

//  获取logo和公司名字
export const getCompanyInfo = data => get ('/system/configuration/queryById',data)