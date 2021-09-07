import store from '../store/index'
import router from '../router/index'
import {
    Message,
    MessageBox
} from 'element-ui'
import css from './index.less'

let mixin = {
    data(){
        return{
        }
    },
    computed:{
    },
    methods:{
        checkAndOpenLogin(){
            if(!store.state.isLogin){
                store.state.needOpen.show=true
                Message({message:'您未登录，请先登录!',type:'warning',customClass:'zZindex',showClose:true,duration:3000});
                return false
            }
            return true
        },
    }
}

export default {mixin}