import http from "../utils/http";

const userApi = {
    userLogin: (params) => {
        return http.post('/sysUser/login',params)
    },
    userLogout: () => {
        return http.post('/sysUser/logout')
    },
    checkAccountName:(params) =>{
        return http.post('/sysUser/checkAccount',params)
    },
    checkPhone:(params) =>{
        return http.post('/sysUser/checkPhone',params)
    },
    getUserList:(params)=> {
        return http.get('/sysUser/list',params)
    },
    deleteUser:(params)=>{
        return http.Delete('/sysUser/user',params)
    },
    disableUser:(params)=>{
        return http.post('/sysUser/disable',params)
    },
    getUserInfo:(params)=>{
        return http.get('/sysUser/user',params)
    },
    updateUser:(params)=>{
        return http.post('/sysUser/user',params)
    },
    getVerifyCode:(params)=>{
        return http.get('/rest/sysUser/getVerifyCode',params)
    },
    userReg:(params)=>{
        return http.put('/rest/sysUser/reg',params)
    },
    getDynamicList:(params)=>{
        return http.get('/dynamic/list',params)
    },
    alreadDynamic:(params)=>{
        return http.post('/dynamic/alread',params)
    },
    deleteDynamic:(params)=> {
        return http.Delete('/dynamic/delete',params)
    },
    updatePassword:(params)=>{
        return http.post('/sysUser/password',params)
    },
    initAdminPwd:(params)=>{
        return http.post('/sysUser/initAdminPwd',params)
    },
    addAdmin:(params)=>{
        return http.post('/sysUser/addAdmin',params)
    },
    getVerifyCodeLogin:(params)=>{
        return http.get('/sysUser/getVerifyCode',params)
    },
    checkVerifyCode:(params)=>{
        return http.get('/sysUser/checkVerifyCode',params)
    },
    updatePhone:(params)=>{
        return http.post('/sysUser/updatePhone',params)
    }
}

export default userApi