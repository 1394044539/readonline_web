import Vue from 'vue'
import VueRouter from 'vue-router'
import Reg from '../components/userOperation/Reg'
import Main from '../views/Main'
import AdminPage from '../views/admin/AdminPage'
import Index from '../views/mainPage/index'
import NovelMain from '../views/mainPage/novelNav/novelMain'
import PersonNovel from '../views/myNovel/personNovel'
import PersonList from '../views/myNovel/personList'
import NovelUpload from '../views/myNovel/novelUpload'
import Mark from '../views/myNovel/Mark'
import ReadHistory from '../views/myNovel/ReadHistory'
import UploadList from '../views/myNovel/UploadList'
import NovelInfo from '../views/novelInfo/NovelInfo'
import ReadPage from '../views/ReadPage'
import NovelRead from '../views/mainPage/novelNav/NovelRead'
import NovelType from '../views/mainPage/novelNav/NovelType'
import NovelRank from '../views/mainPage/novelNav/NovelRank'
import NovelAll from '../views/mainPage/novelNav/NovelAll'
import AdminNovel from '../views/admin/novel/AdminNovel'
import AdminUser from '../views/admin/user/AdminUser'
import AdminCollection from '../views/admin/novel/AdminCollection'
import AdminHistory from '../views/admin/novel/AdminHistory'
import AdminExamine from '../views/admin/novel/AdminExamine'
import AdminDict from '../views/admin/system/AdminDict'
import AdminNotice from '../views/admin/system/AdminNotice'
import AdminSetting from '../views/admin/system/AdminSetting'
import PageManager from '../views/admin/system/PageManage'
import UserIndex from '../views/userPage/UserIndex'
import UserInfo from '../views/userPage/UserInfo'
import UserSafeInfo from  '../views/userPage/UserSafeInfo'
import SharePage from '../views/share/SharePage'
import WebSocketPage from '../views/TestWebSocket'
import UserDynamic from '../views/userPage/UserDynamic'
import AdminDynamic from '../views/admin/user/AdminDynamic'
import NovelSearch from '../views/mainPage/novelNav/NovelSearch'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { path: '/novel/list' }
  },
  {
    path: '/novel/list',
    name: 'Main',
    component: Main,
    children:[
      {
        path:'/reg',
        name:'Reg',
        component:Reg
      },
      {
        path:'/novel/list',
        name:'Index',
        component:Index,
        children:[
          {
            path:'/novel/list',
            name:'NovelMain',
            component:NovelMain
          },
          {
            path:'/novel/typeNovel/:type',
            mame:'NovelType',
            component: NovelType
          },
          {
            path:'/novel/rank',
            name:'NovelRank',
            component: NovelRank
          },
          {
            path:'/novel/all',
            name:'NovelAll',
            component: NovelAll
          },
          {
            path:'/novel/search',
            name:'NovelSearch',
            component: NovelSearch
          }
        ]
      },
      {
        path:'/novel/person',
        name:'PersonNovel',
        component:PersonNovel,
        meta:{
          requireAuth:true
        },
        children:[
          {
            path:'/novel/person',
            name:'PersonList',
            component:PersonList
          },
          {
            path:'/novel/person/upload',
            name:'NovelUpload',
            component:NovelUpload
          },
          {
            path:'/novel/person/uploadList',
            name:'UploadList',
            component:UploadList
          },
          {
            path:'/novel/person/mark',
            name:'Mark',
            component:Mark
          },
          {
            path:'/novel/person/history',
            name:'ReadHistory',
            component:ReadHistory
          }
        ]
      },
      {
        path:'/novel/novelInfo',
        name:'NovelInfo',
        component:NovelInfo
      },
      {
        path:'/novel/novelRead',
        name:'NovelRead',
        component:NovelRead
      },
      {
        path: '/novel/admin',
        name: 'AdminPage',
        component: AdminPage,
        meta:{
          requireAuth:true
        },
        redirect: { path: '/novel/admin/user' },
        children:[
          {
            path:'/novel/admin/upload',
            name:'AdminUpload',
            component:NovelUpload
          },
          {
            path: '/novel/admin/user',
            name: 'AdminUser',
            component: AdminUser,
          },
          {
            path: '/novel/admin/novel',
            name: 'AdminNovel',
            component: AdminNovel,
          },
          {
            path: '/novel/admin/collection',
            name: 'AdminCollection',
            component: AdminCollection,
          },
          {
            path: '/novel/admin/examine',
            name: 'AdminExamine',
            component: AdminExamine,
          },
          {
            path: '/novel/admin/history',
            name: 'AdminHistory',
            component: AdminHistory,
          },
          {
            path: '/novel/admin/dict',
            name: 'AdminDict',
            component: AdminDict,
          },
          {
            path: '/novel/admin/notice',
            name: 'AdminNotice',
            component: AdminNotice,
          },
          {
            path: '/novel/admin/setting',
            name: 'AdminSetting',
            component: AdminSetting,
          },
          {
            path: '/novel/admin/pageManager',
            name: 'PageManager',
            component: PageManager,
          },
          {
            path: '/novel/admin/dynamic',
            name: 'AdminDynamic',
            component: AdminDynamic
          }
        ]
      },
      {
        path:'/user/index',
        name:'UserIndex',
        component:UserIndex,
        meta:{
          requireAuth:true
        },
        redirect:{ path: '/user/info' },
        children:[
          {
            path:'/user/info',
            name:'UserInfo',
            component:UserInfo
          },
          {
            path:'/user/dynamic',
            name: 'UserDynamic',
            component:UserDynamic
          },
          {
            path:'/user/safe',
            name:'UserSafeInfo',
            component:UserSafeInfo
          },
        ]
      },
      {
        path:'/share/page',
        name:'SharePage',
        component: SharePage
      }
    ]
  },
  {
    path: '/novel/read',
    name: 'ReadPage',
    component: ReadPage,
  },
  {
    path: '/test/websocket',
    name: 'WebSocketPage',
    component: WebSocketPage,
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
