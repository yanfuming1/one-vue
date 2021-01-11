import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import util from '@/libs/util'
import router from '@/router'

// 创建一个错误
function errorCreate (msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

// 记录和显示错误
function errorLog (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 0.5 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 120000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    store.commit ('d2admin/loading/show')
    // 在请求发送之前做一些处理
    const token = util.cookies.get('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = token
    return config
  },
  error => {
    // 发送失败
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    const { code } = dataAxios
    store.commit ('d2admin/loading/close')
    store.commit ('d2admin/loading/allowShow')
    // 根据 code 进行判断
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口 比如可能是 D2Admin 请求最新版本
      return dataAxios
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
        case 200:
          // [ 示例 ] code === 200 代表没有错误
		      return dataAxios.result == null ? dataAxios : dataAxios.result
        case 205:
          // 返回码为205时也没错
          return dataAxios.result || dataAxios
        case 202:
          dataAxios.result['isNew'] = true
          dataAxios.result['page'] = true
          return dataAxios.result || dataAxios
        case 204:
          dataAxios.result['isNew'] = true
          dataAxios.result['page'] = false
          return dataAxios.result || dataAxios
        default:
          // 不是正确的 code
          process.env.NODE_ENV == 'development' ? errorCreate(`${dataAxios.message}: ${response.config.url}`) : errorCreate(`${dataAxios.message}`)
          break
      }
    }
  },
  error => {
    store.commit ('d2admin/loading/close')
    store.commit ('d2admin/loading/allowShow')
    if (error && error.response) {
      if (error.response && error.response.data && error.response.data.code === 503) {
        store.dispatch ('d2admin/account/logout')
        return
      }
      switch (error.response.status) {
        case 400: error.message = '请求错误'; break
        case 401: store.dispatch ('d2admin/account/logout'); break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
  store.commit ('d2admin/loading/noAllowShow')
  return new Promise((resolve, reject) =>{
    service({
      url: url,
      method: 'get',
      params:params
    }) .then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.data)
    })
  });
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function fileGet(url, params){
  store.commit ('d2admin/loading/noAllowShow')
  return new Promise((resolve, reject) =>{
    service({
      url: url,
      method: 'get',
      params:params,
      responseType: 'blob',
    }) .then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.data)
    })
  });
}


/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service({
      url: url,
      method: 'post',
      data: params
    }) .then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.data)
    })
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function deleteData(url, params) {
  return new Promise((resolve, reject) =>{
    service({
      url: url,
      method: 'delete',
      params:params
    }) .then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.data)
    })
  });
}

/**
 * put方法，对应put请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function putData(url, params) {
  return new Promise((resolve, reject) =>{
    service({
      url: url,
      method: 'put',
      data:params
    }) .then(res => {
      resolve(res);
    }).catch(err => {
      reject(err.data)
    })
  });
}
