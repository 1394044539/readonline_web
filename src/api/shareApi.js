import http from "../utils/http";

const shareApi = {
    addOrEditShare:(params)=>{
        return http.post('/share/addOrEdit',params)
    },
    checkNeedPwd:(params)=>{
        return http.post('/share/checkNeedPwd',params)
    },
    checkPwd:(params)=>{
        return http.post('share/checkPwd',params)
    },
    getShareFileList:(params)=>{
        return http.get('/share/fileList',params)
    }
}

export default shareApi