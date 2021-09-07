<template>
    <div style="max-width: 250px">
        <div v-if="this.$store.state.isLogin" class="myUser">
            <div v-if="!this.$store.getters.isAdmin" class="mostMenu">
                <span class="headerWin">
                    <el-dropdown placement="bottom" size="medium" @visible-change="getDynamic">
                    <span class="el-dropdown-link headerWin" style="font-size: 16px;width: 100%" @click="getMoreDynamic">
                        动态
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div style="max-height: 400px;overflow-y:auto">
                            <div v-if="dynamicList.length!==0" style="width: 300px">
                                <el-dropdown-item v-for="(dynamic,index) in dynamicList">
                                    <div class="header-dynamic-div" @click="openDynamic(dynamic,index)">
                                        <div v-if="dynamic.isRead===0">
                                            <el-badge is-dot></el-badge>
                                            <a style="font-size: 14px;font-weight: bold">{{dynamic.dynamicTitle}}</a>
                                        </div>
                                        <div v-if="dynamic.isRead===1">
                                            <a style="color: gray;font-size: 14px;font-weight: bold">{{dynamic.dynamicTitle}}</a>
                                        </div>
                                        <div class="header-dynamic-content">{{dynamic.dynamicContent}}</div>
                                        <div style="color: #999;font-size: 12px;">{{dynamic.createTime}}</div>
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <div class="lookMore">
                                        <span @click="getMoreDynamic">查看更多</span>
                                    </div>
                                </el-dropdown-item>
                            </div>
                            <div style="width: 300px;text-align: center" v-if="dynamicList.length===0">
                                <p>暂无动态</p>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
                </span>
                <el-divider direction="vertical"></el-divider>
                <span class="headerWin">
                    <el-dropdown placement="bottom" size="medium" @visible-change="getHistory">
                    <span class="el-dropdown-link headerWin" style="font-size: 16px;width: 100%" @click="getMore">
                        历史
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div style="max-height: 400px;overflow-y:auto">
                            <div v-if="historyList.length!==0">
                                <el-dropdown-item v-for="(history,index) in historyList" @click.native="jumpChapter(history.novel.id,history.novelChapter.id,history.readPosition)">
                                    <div class="historyHeaderDiv">
                                        <div class="historyImgDiv">
                                            <el-image
                                                    style="width: 80px; height: 90px"
                                                    :src="history.novel.novelImg?'/img/'+history.novel.novelImg:require('@/assets/img/moimg.gif')" fit="fit"></el-image>
                                        </div>
                                        <div class="historyContextDiv">
                                            <div style="height: 72px;line-height: 21px">
                                                <div style="font-weight: bold;font-size: 14px">{{history.novel.novelTitle}}</div>
                                                <div style="font-size: 12px">{{history.novelChapter.chapterName}}</div>
                                            </div>
                                            <div style="height: 18px;display: flex;justify-content: space-between;width: 200px">
                                                <div><i class="el-icon-reading"></i>{{history.percentage===0?'未开始':getPec(history.percentage)+'%'}}</div>
                                                <div style="font-size: 10px">{{getNowTime(history.updateTime)}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <div class="lookMore">
                                        <span @click="getMore">查看更多</span>
                                    </div>
                                </el-dropdown-item>
                            </div>
                            <div style="width: 300px;text-align: center" v-if="historyList.length===0">
                                <p>暂无历史记录</p>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
                </span>
            </div>
            <div style="margin-left: 20px;min-width: 70px;max-height: 120px;" @click="()=>{this.$store.getters.isAdmin ? $router.push('/novel/admin'):$router.push('/user/index')}">
                <el-dropdown placement="bottom" size="medium" @command="handleCommand" >
                    <span class="el-dropdown-link" style="display: flex">
                        <dd style="max-width:100px;overflow:hidden;margin: 0;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;">
                            {{this.$store.state.username}}
                        </dd>
                        <i class="el-icon-arrow-down el-icon--right" style="line-height: 70px"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-if="!this.$store.getters.isAdmin" icon="el-icon-user" command="info">个人信息</el-dropdown-item>
                        <el-dropdown-item v-if="!this.$store.getters.isAdmin" icon="el-icon-time" command="history">历史记录</el-dropdown-item>
                        <el-dropdown-item v-if="!this.$store.getters.isAdmin" icon="el-icon-s-comment" command="dynamic">动态</el-dropdown-item>
                        <el-dropdown-item v-if="this.$store.getters.isAdmin" icon="el-icon-s-custom" command="manager">管理界面</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button" command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div v-if="!this.$store.state.isLogin" class="noLogin">
            <span class="headerWin">
                    <el-dropdown placement="bottom" size="medium" @visible-change="getHistory">
                    <span class="el-dropdown-link headerWin" style="font-size: 16px;width: 100%">
                        历史
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <div style="max-height: 400px;overflow-y:auto">
                            <div v-if="historyList.length!==0">
                                <el-dropdown-item v-for="(history,index) in historyList" @click.native="jumpChapter(history.novel.id,history.novelChapter.id,history.readPosition)">
                                    <div class="historyHeaderDiv">
                                        <div class="historyImgDiv">
                                            <el-image
                                                    style="width: 80px; height: 90px"
                                                    :src="history.novel.novelImg?'/img/'+history.novel.novelImg:require('@/assets/img/moimg.gif')" fit="fit"></el-image>
                                        </div>
                                        <div class="historyContextDiv">
                                            <div style="height: 72px;line-height: 21px">
                                                <div style="font-weight: bold;font-size: 14px">{{history.novel.novelTitle}}</div>
                                                <div style="font-size: 12px">{{history.novelChapter.chapterName}}</div>
                                            </div>
                                            <div style="height: 18px;display: flex;justify-content: space-between;width: 200px">
                                                <div><i class="el-icon-reading"></i>{{history.percentage===0?'未开始':getPec(history.percentage)+'%'}}</div>
                                                <div style="font-size: 10px">{{getNowTime(history.updateTime)}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <div class="lookMore">
                                        <span @click="getMore">查看更多</span>
                                    </div>
                                </el-dropdown-item>
                            </div>
                            <div style="width: 300px;text-align: center" v-if="historyList.length===0">
                                <p>暂无历史记录</p>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
                </span>
            <el-divider direction="vertical"></el-divider>
            <span class="headerWin" @click="show">登录</span>
            <el-divider direction="vertical"></el-divider>
            <span class="headerWin" @click="reg">注册</span>
        </div>
        <Login v-if="isOpenFormLogin" @closeLoginFrom="closeFrom"></Login>
        <DynamicDialog style="line-height: 20px" :openDialog="openDynamicDialog" :dynamic="dynamicObj" :type="0" @closeFrom="dialogReturn"></DynamicDialog>
    </div>
</template>

<script>
    import Login from '../userOperation/LoginDialog'
    import DynamicDialog from '../person/DynamicDialog'
    export default {
        name: "HeaderUser",
        components:{
            Login,
            DynamicDialog
        },
        computed:{
            getPec(){
                return (value) => {
                    let num=value*100
                    num=num.toFixed(1)
                    return num
                }
            },
            getNowTime(){
                return (value) => {
                    var updateTime = new Date(value)
                    var nowDate = new Date()
                    if(updateTime.getFullYear()===nowDate.getFullYear()
                        &&updateTime.getMonth()===nowDate.getMonth()){
                        let min=updateTime.getMinutes()>=10?updateTime.getMinutes():"0"+updateTime.getMinutes()
                        let sec=updateTime.getSeconds()>=10?updateTime.getSeconds():"0"+updateTime.getSeconds()
                        if(updateTime.getDay()===nowDate.getDay()){
                            return '今天 '+updateTime.getHours()+':'+min+':'+sec
                        }
                        if(updateTime.getDay()===nowDate.getDay()-1){
                            return '昨天 '+updateTime.getHours()+':'+min+':'+sec
                        }
                    }
                    return value
                }
            },
            getNeedOpen(){
                return this.$store.state.needOpen.show
            }
        },
        data () {
            return {
                noImgUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                username: this.$store.state.isLogin?this.$store.state.userInfo.username:"用户未登录",
                isOpenFormLogin: false,
                historyList:[],
                dynamicList:[],
                openDynamicDialog:false,
                dynamicObj:{}
            }
        },
        methods: {
            show(){
                this.isOpenFormLogin = true
            },
            closeFrom(val){
                this.isOpenFormLogin = false
                this.username= this.$store.state.isLogin?this.$store.state.userInfo.username:"用户未登录"
            },
            handleCommand(command){
                if(command==="info"){
                    this.$router.push('/user/index')
                }else if(command==="history"){
                    this.getMore()
                }else if(command==="dynamic"){
                    this.$router.push('/user/dynamic')
                }else if(command==="logout"){
                    this.logout()
                }else if(command==="manager"){
                    this.$router.push('/novel/admin')
                }
            },
            logout(){
                this.$confirm('是否退出登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$apiMethods.userApi.userLogout().then(res => {
                        if(res.code === 200){
                            this.$store.commit('REMOVE_INFO')
                            this.$store.state.isLogin = false
                            this.$utils.success2("退出成功！",1000)
                            this.$router.push('/novel/list')
                        }
                    })
                })
            },
            reg(path){
                if(path){

                }
                this.$router.push('/reg')
            },
            getHistory(val){
                if(val){
                    let param={
                        pageNum:1,
                        pageSize:5,
                        type:0,
                        userType:this.$store.state.isLogin?0:1,
                    }
                    this.$apiMethods.novelApi.getHistoryList(param).then(res=>{
                        if(res.code===200){
                            this.historyList=res.data.records
                        }
                    })
                }
            },
            getDynamic(val){
                if(val){
                    let param={
                        pageNum:1,
                        pageSize:5,
                    }
                    this.$apiMethods.userApi.getDynamicList(param).then(res=>{
                        if(res.code===200){
                            this.dynamicList=res.data.records
                        }
                    })
                }
            },
            jumpChapter(novelId,chapterId,readPosition){
                this.$router.push({
                    path:'/novel/novelRead',
                    query:{
                        chapterId:chapterId,
                        novelId:novelId,
                        positionY:readPosition
                    }
                })
            },
            getMore(){
                if(this.$store.state.isLogin){
                    this.$router.push('/novel/person/history');
                }else {
                    this.show()
                }
            },
            openDynamic(obj,index){
                if(obj.isRead===0){
                    let param={
                        id:obj.id
                    }
                    this.$apiMethods.userApi.alreadDynamic(param).then(res=>{
                        if(res.code===200){
                            this.getDynamic(true)
                        }
                    })
                }
                this.openDynamicDialog=true
                this.dynamicObj=obj
            },
            dialogReturn(){
                this.openDynamicDialog=false
            },
            getMoreDynamic(){
                this.$router.push('/user/dynamic')
            }
        },
        created() {
            this.getHistory()
        },
        watch:{
            getNeedOpen(newV,oldV){
                if(newV){
                    this.isOpenFormLogin=true
                    this.$store.state.needOpen.show=false
                }
            }
        }
    }
</script>

<style scoped>
    .el-divider{
        height: auto;
        margin: 25px 15px;
    }

    .myUser,.noLogin{
        margin-left: auto;
        margin-right: 5px;
        /*padding: 2px 0;*/
        display: flex;
    }
    .mostMenu{
        display: flex;
        width: 100px;
    }

    .headerWin{
        color: #FFFFFF;
        cursor:pointer;
    }

    .headerWin:hover {
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
    .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: rgb(255, 255, 255);
        /*display: flex;*/
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
    .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .historyHeaderDiv{
        display: flex;
        width: 300px;
        height: 90px;
        padding: 5px 0;

    }

    .historyImgDiv{

    }

    .historyContextDiv{
        margin-left: 5px;
        /*line-height: 20px;*/
    }

    .lookMore{
        height: 30px;
        width:100%;
        background-color: #F4F4F4;
        text-align: center;
        font-size: 12px;
        line-height: 30px;
    }

    .lookMore span:hover{
        cursor: pointer;
    }

    .header-dynamic-div{
        line-height: 25px;
        border-bottom: 1px solid #e5e9ef;
    }

    .header-dynamic-content{
        cursor: pointer;
        font-size: 14px;
        color: #222;
        display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
        -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
        overflow: hidden; /*超出的文本隐藏*/
        text-overflow: ellipsis; /* 溢出用省略号*/
        -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
    }
</style>