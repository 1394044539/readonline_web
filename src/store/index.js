import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    authorization: localStorage.getItem("authorization"),
    userInfo: JSON.parse(localStorage.getItem("userInfo")),
    username: localStorage.getItem("username"),
    // menus: [], //菜单
    menus:[
        {
            menuName: '全部书架',
            id:'1',
            menuUrl:'/novel/list',
            menuIcon:'el-icon-s-management',
            role:'ALL_USER',
            needLogin:false
        },
        {
            menuName: '我的图书',
            id:'2',
            menuUrl:'/novel/person',
            menuIcon:'el-icon-reading',
            role:'ORDINARY_USER',
            needLogin:true
        },
        {
            menuName: '管理界面',
            id:'3',
            menuUrl:'/novel/admin',
            menuIcon:'el-icon-s-custom',
            role:'ADMIN_ROLE',
            needLogin:true
        }
    ],
    isLogin: false,
    //是否打开登录窗口
    needOpen:{
        show:false,
        message:''
    },
    menuDefaultIndex:'1',
    novelTypeMap:[]
}

const mutations = {
    //类似于后端的set
    SET_TOKEN (state, token)  {
        state.authorization=token
        localStorage.setItem("authorization",token)
        state.authorization= ""
    },
    SET_USERINFO (state, userInfo) {
        state.userInfo=userInfo
        localStorage.setItem("userInfo",JSON.stringify(userInfo))
    },
    SET_USERNAME (state, username) {
        state.username=username
        localStorage.setItem("username",username)
    },
    REMOVE_INFO (state)  {
        state.authorization=''
        state.userInfo= {}
        state.isLogin = false
        localStorage.setItem("authorization",'')
        localStorage.setItem("userInfo",JSON.stringify(''))
    },
    SET_MENUS (state,menus) {
        state.menus = menus;
    },
    SET_LOGIN(state,login){
        state.isLogin=login;
    },
    SET_NOVEL_TYPE(state,type){
        state.novelTypeMap=type
    }
}

const getters={
    //类似于后端的get
    getUserInfo (state) {
        return state.userInfo
    },
    getToken (state) {
        return state.authorization
    },
    getLogin (state) {
        return state.isLogin
    },
    isAdmin(state){
        //判断是不是管理员
        if(state.userInfo.roleType===0){
            return true
        }
        return false
    },
    getNovelType(state){
        return state.novelTypeMap
    }
}

const actions = {
    getMenu(){
        return state.menus;
    }
}

const modules = {

}

if(localStorage.getItem("authorization")){
    state.isLogin = true
}



export default new Vuex.Store({state,actions,mutations,getters,modules})
