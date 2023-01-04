import request from './request.js'

const api = {}

// ====================相关====================

//getIndex 就是在页面中调用的函数，request.globalRequest就是request里面进行网络请求的函数

api.getIndex = params => request.globalRequest(`/min/get-index-info/`, 'post', params)

export default api