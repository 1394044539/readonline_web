import http from "../utils/http";

const fileApi = {
    uploadNovel: (params) => {
        return http.post('/novel/upload',params)
    },
    updateNovel:(params) =>{
        return http.post('/novel/updateNovel',params)
    }
}

export default fileApi