import http from "../utils/http";

const dataApi = {
    getDictByClass: (params) => {
        return http.get('/rest/sysDict/list',params)
    },
    getMainNovelType:(params)=>{
        return http.get('/rest/sysDict/novelType',params)
    },
    getSysNoticeList:(params)=>{
        return http.get('/sysNotice/list',params)
    },
    addNotice:(params)=>{
        return http.post('/sysNotice/notice',params)
    },
    deleteNotice:(params)=>{
        return http.Delete('/sysNotice/notice',params)
    },
    openOrCloseNotice:(params)=>{
        return http.post('/sysNotice/openOrClose',params)
    }
}

export default dataApi