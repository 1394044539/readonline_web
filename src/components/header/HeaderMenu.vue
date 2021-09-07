<template>
    <div style="display: flex;flex-direction: row">
        <div id="myLogo" @click="jumpMain">
            <a style="color: #FFFFFF;font-size: 22px">小书屋
            </a>
        </div>
        <div id="myMenu">
            <el-menu
                    class="el-menu-demo"
                    mode="horizontal"
                    background-color="#545c64"
                    :default-active="defaultRouter"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                <template v-for="menu in menus">
                    <el-menu-item :index="menu.id" @click="menuJump(menu.menuUrl,menu.needLogin,menu.id)"><i :class="menu.menuIcon"></i>{{menu.menuName}}</el-menu-item>
                </template>
            </el-menu>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeaderMenu",
        computed:{
            menus(){
                let menus=this.$store.state.menus
                let returnData=new Array()
                let isLogin=this.$store.state.isLogin
                let userInfo=JSON.parse(localStorage.getItem("userInfo"))
                for(let menu of menus) {
                    let isPass=false
                    //0：管理员；1：普通用户
                    switch (menu.role) {
                        case "ALL_USER":
                            //全部用户，都给放过去
                            isPass=true
                            break;
                        case "ADMIN_ROLE":
                            //判断当前登录的人是不是管理员，如果登录且是管理员，则展示
                            if(isLogin && userInfo && userInfo.roleType===0){
                                isPass=true
                            }
                            break;
                        case "ORDINARY_USER":
                            //这里就判断非管理就行
                            if(!(isLogin && userInfo && userInfo.roleType===0)){
                                isPass=true
                            }
                            break;
                        default:
                    }
                    if(isPass){
                        returnData.push(menu)
                    }
                }
                return returnData
            },
            defaultRouter(){
                //根据路由规则，判断第第二个路由
                let path=this.$route.path
                if(this.$route.matched.length>=2){
                    path=this.$route.matched[1].path
                }
                if(path==='/novel/list'){
                    return '1'
                }
                if(path==='/novel/person'){
                    return '2'
                }
                if(path==='/novel/admin'){
                    return '3'
                }
                return ''
            }
        },
        data(){
            return {
            }
        },
        created(){
        },
        methods:{
            menuJump(url,needLogin,index){
                if(!needLogin) {
                    //不需要登录直接跳转
                    this.$router.push(url)
                }else if(this.$global.mixin.methods.checkAndOpenLogin()){
                    //需要登录且验证通过之后再跳转
                    this.$router.push(url)
                }
            },
            jumpMain(){
                this.$router.push("/novel/list")
            }
        },
        watch:{
            //监听一下默认的index
            defaultRouter(newV,oldV){}
        }
    }
</script>

<style scoped>
    #myLogo {
        background: url("../../assets/img/logo.png")left/60px no-repeat;
        padding: 0 0 0 70px;
        height: 100%;
        margin: 0 50px 0 0;
        cursor: pointer;
    }

    /*#myMenu {*/
    /*    margin: 0 30% 0 0;*/
    /*}*/

    .el-menu{
        border-bottom: unset!important;
        height: 70px !important;
    }
    .el-menu-item {
        height: 70px !important;
        line-height: 70px !important;
        font-size: 16px !important;
    }
    .el-dropdown-menu {
        width: 150px;
        font-size: 16px !important;
        margin-top: 5px !important;
    }
</style>

<style>
    .zZindex {
        z-index:9000 !important;
    }
</style>