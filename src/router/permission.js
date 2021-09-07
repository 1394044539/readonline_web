import router from './index'

router.beforeEach((to,from,next) => {
    if(to.matched.some(recode=>recode.meta.requireAuth)){
        let token=localStorage.getItem("authorization")
        if(token){
            next()
        }else{
            next("/novel/list")
        }
    }else {
        next()
    }
})