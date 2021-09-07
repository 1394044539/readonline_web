import http from "../utils/http";

const novelApi = {
    getNovelList: (params) => {
        return http.get('/novel/list',params)
    },
    getAllList:(params) => {
        return http.get('/userCollection/list',params)
    },
    getNovelInfo: (params)=>{
        return http.get('/novel/novelInfo',params)
    },
    getNovelChapterInfo:(params)=>{
        return http.get('/novelChapter/list',params)
    },
    getNovelChapterContext:(params)=>{
        return http.get('/novelChapter/content',params)
    },
    addCollection:(params)=>{
        return http.put('/userCollection/collection',params)
    },
    cancelCollection:(params)=>{
        return http.Delete('/userCollection/collection',params)
    },
    getCollection:(params)=>{
        return http.get('/userCollection/collection',params)
    },
    deleteNovel:(params)=>{
        return http.Delete('/novel/deleteNovel',params)
    },
    saveHistory:(params)=>{
        return http.post('/readHistory/history',params)
    },
    getHistory:(params)=>{
        return http.get('/readHistory/history',params)
    },
    getHistoryList:(params,loading=false)=>{
        return http.get('readHistory/list',params,loading)
    },
    deleteHistory:(params)=>{
        return http.Delete('/readHistory/history',params)
    },
    getHotTypeNovel:(params)=>{
        return http.get('/rest/novel/getHotNovelData',params)
    },
    getTreeCollection:(params)=>{
        return http.get('/userCollection/treeList',params)
    },
    createCatalog:(params)=>{
        return http.post('/catalog/create',params)
    },
    deleteCatalog:(params)=>{
        return http.Delete('/catalog/delete',params)
    },
    updateCatalog:(params)=>{
        return http.post('/catalog/update',params)
    },
    downloadNovel:(params)=>{
        return http.get('/novel/download',params)
    },
    moveOrCopyNovel:(params)=>{
        return http.post('/catalog/moveOrCopyNovel',params)
    },
    moveOrCopyCatalog:(params)=>{
        return http.post('/catalog/moveOrCopyCatalog',params)
    },
    publicNovel:(params)=>{
        return http.post('/novel/public',params)
    },
    cancelPublic:(params)=>{
        return http.post('/novel/cancelPublic',params)
    },
    auditNovel:(params)=>{
        return http.post('/novel/audit',params)
    }

}

export default novelApi