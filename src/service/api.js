import { baseUrl } from '../config'
import { HTTP_STATUS } from '../constant/status'
import { logError } from '../utils/error.js'
import interceptors from './interceptors.js'
import Taro from '@tarojs/taro'
export default {
    baseOption(params,method='GET'){
        let { url, data } = params
        let contentType = 'application/json'
        contentType = params.contentType || contentType
        data = { ...data }
        const option = {
            url: baseUrl + url,
            data: data,
            method: method,
            header: {
                'content-type': contentType,
                'Authorization': Taro.getStorageSync('access_token')
            },
            success(res) {
                console.log(res.data)
                
                if (res.data.status === HTTP_STATUS.NOT_FOUND) {
                    return logError('api', '请求资源不存在')
                } 
                else if (res.data.status === HTTP_STATUS.BAD_GATEWAY) {
                    return logError('api', '服务端出现了问题')
                } 
                else if (res.data.status === HTTP_STATUS.FORBIDDEN) {
                    return logError('api', '没有权限访问')
                } 
                else if (res.data.status === HTTP_STATUS.SERVER_ERROR) {
                    return logError('api', '服务器出错')
                } 
                else if (res.data.status === HTTP_STATUS.AUTHENTICATE) {
                    // 清除过期token和所有身份信息
                    Taro.clearStorage()
                    Taro.navigateTo({
                        url: '../pages/market/market'
                    })
                    // Taro.request({
                    //     url:baseUrl + ''
                    // })
                    return logError('api', 'token过期')
                } 
                else if (res.data.status === HTTP_STATUS.SUCCESS) {
                    return res.data
                }
            },
            error(e) {
                logError('api', '请求接口出现问题', e)
            }
        }
        console.log(option)
        return Taro.request(option)
    },
    get(url, data) {
        let option = { url, data }
        return this.baseOption(option)
    },
    post: function (url, data, contentType) {
        let params = { url, data, contentType }
        return this.baseOption(params, 'POST')
    },
    put(url, data) {
        let option = { url, data }
        return this.baseOption(option, 'PUT')
    },
    delete(url, data , contentType) {
        let option = { url, data,contentType }
        return this.baseOption(option, 'DELETE')
    }
}