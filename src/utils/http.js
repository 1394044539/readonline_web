import axios from 'axios'
import store from '../store'
import router from '../router'
import { util } from '../utils'

const instance = axios.create({})

/**
 * 基础配置
 * @type {string|string}
 */
instance.defaults.baseURL = "/api"
instance.defaults.timeout = 20000

/**
 * 请求拦截器
 */
instance.interceptors.request.use(config => {
    if(config.url === '/novel/upload'){
        config.timeout=60000
    }
    config.headers.authorization = localStorage.getItem('authorization') ? localStorage.getItem('authorization') : ''
    return config
})

/**
 * 响应拦截
 */
instance.interceptors.response.use(response => {
    const res = response.data;
    if(res.code === -10000){
        //未登录
        util.error(res.msg)
        store.commit('logout')
    }else if(res.code === 200 || res.code === -100){//请求成功
        return res;
    } else { //其余错误
        util.error(res.msg)
    }
},error => {
    const res=error.response
    if(res && res.status === 500){

    } else if (res && res.status === 404){
        util.error("404啦！")
    }else if (error.toString().search('timeout')){
        util.error('请求超时')
    } else {
        util.error('建议联系管理员')
    }
    return Promise.reject(error)
})

/**
 * post请求
 * @param url 地址
 * @param data 数据
 * @param loading 可能要加的loding
 * @returns {Promise<any>}
 */
const post = function (url, data, loading) {
    return new Promise((resolve,reject)=>{
        instance.post(url,data)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

/**
 * get请求
 * @param url
 * @param params
 * @param loading
 * @returns {Promise<any>}
 */
const get = function (url, params, loading) {
    if(loading){
        util.openLoading()
    }
    return new Promise((resolve,reject)=>{
        instance.get(url,{
            params: params
        }).then(res=>{
            util.closeLoading()
            resolve(res)
        }).catch(err=>{
            util.closeLoading()
            reject(err)
        })
    })
}

/**
 * put请求
 * @param url
 * @param params
 * @param loading
 * @returns {Promise<any>}
 */
const put = function (url, params, loading) {
    return new Promise((resolve,reject)=>{
        instance.put(url,params)
            .then(res=>{
                resolve(res)
            })
            .catch(err=>{
                reject(err)
            })
    })
}

/**
 * delete请求
 * @param url
 * @param params
 * @param loading
 * @returns {Promise<any>}
 * @constructor
 */
const Delete = function (url, params, loading) {
    return new Promise((resolve,reject)=>{
        instance.delete(url,{
            params: params
        }).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}

export default { post, get, put, Delete }
