import axios from 'axios'
import store from '../store'
import router from '../router'
import { util } from '../utils'

const instance = axios.create({})

instance.defaults.baseURL = "/api"
instance.defaults.timeout = 20000

axios.interceptors.request.use(config => {
    config.headers.authorization = localStorage.getItem("authorization")
    return config
})

axios.interceptors.response.use(response => {
    const res = response.data;
    if(res.code === -10000){
        //未登录
        util.error(res.msg)
        store.commit('logout')
        return Promise.reject(res.msg);
    }
    if(res.code === 200){
        return res;
    }
    return response;
})


const downloadFile = function (url,params,fileName) {
    axios.get(instance.defaults.baseURL+url,{
        params:params,
        responseType: 'blob'
    }).then(res=> {
        var eleLink = document.createElement('a');
        eleLink.style.display = 'none';
        eleLink.download = decodeURIComponent(res.headers["filename"]);
        let arr = []
        arr.push(res.data)
        var blob = new Blob(arr);
        eleLink.href = window.URL.createObjectURL(blob);
        // 自动触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }).catch(er=>{
        console.log(er);
    })
}



export default { downloadFile }