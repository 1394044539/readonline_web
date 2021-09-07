<template>
    <div style="margin: 0;height: 100%;padding: 20px 20%">
        <div class="readAllDiv">
            <div class="readHeaderDiv">
                <div class="headerLeft">
                    <el-page-header @back="goBack"/>
                    <span style="font-size: 18px;color: #303133;cursor: pointer" @click="jumpNovel">{{this.novelName}}</span>
                </div>
                <div>观看醇享版</div>
            </div>
            <div class="titleDiv" >
                <h2>{{this.chapterName}}</h2>
            </div>
            <div class="contentDiv">
                <p v-for="(context,index) in contextList">{{context}}</p>
            </div>
            <div class="readOprDiv">
                <el-button v-if='lastChapterId' @click="jumpChapterContext(lastChapterId)" type="primary" icon="el-icon-arrow-left">上一章</el-button>
                <el-button v-if='nextChapterId' @click="jumpChapterContext(nextChapterId)" type="primary">下一章<i class="el-icon-arrow-right"></i></el-button>
            </div>
        </div>
        <SuspensionFrame :icon="'el-icon-top'" :bottom="400" :left="winWidth" title="回到顶部" @click.native="goToTop(0)"></SuspensionFrame>
        <SuspensionFrame :icon="'el-icon-arrow-up'" :bottom="340" :left="winWidth" title="上一章" @click.native="jumpChapterContext(lastChapterId)"></SuspensionFrame>
        <SuspensionFrame :icon="'el-icon-arrow-down'" :bottom="280" :left="winWidth" title="下一章" @click.native="jumpChapterContext(nextChapterId)"></SuspensionFrame>
        <SuspensionFrame :icon="'el-icon-bottom'" :bottom="220" :left="winWidth" title="移动到最下方" @click.native="goToTop(1)"></SuspensionFrame>
        <SuspensionFrame :icon="'el-icon-s-unfold'" :bottom="400+openHeight" title="打开目录" @click.native="isOpenTree=true"></SuspensionFrame>
        <SuspensionFrame v-if="!this.$store.getters.isAdmin" :icon="'el-icon-s-management'" :bottom="340+openHeight" title="加入书架" @click.native="addCollection"></SuspensionFrame>
        <SuspensionFrame v-if="!this.$store.getters.isAdmin" :icon="'el-icon-collection-tag'" :bottom="280+openHeight" title="添加书签" @click.native="saveBookMark"></SuspensionFrame>
        <SuspensionFrame v-if="!this.$store.getters.isAdmin" :icon="'el-icon-chat-dot-round'" :bottom="220+openHeight" title="打开聊天室" @click.native="openChat"></SuspensionFrame>

        <ChapterTree :isOpenTree="isOpenTree" @closeTree="closeTree" :novelId="novelId"/>

        <ChatWebSocket v-if="showChat" :chatOpen="chatOpen" :novelId="novelId" :chapterId="chapterId" @closeChat="closeChat"></ChatWebSocket>
    </div>
</template>

<script>
    import ChapterTree from '../../../components/novel/ChapterTree'
    import SuspensionFrame from '../../../components/other/SuspensionFrame'
    import ChatWebSocket from "../../../components/novel/ChatWebSocket";

    export default {
        data(){
          return{
              novelName:'',
              novelId: this.$route.query.novelId,
              chapterId: this.$route.query.chapterId,
              lastChapterId: '',
              nextChapterId: '',
              chapterName:'',
              contextList:[],
              rebackTop:true,
              winWidth:document.body.clientWidth-80,
              isOpenTree: false,
              yPosition: 0,
              isHistory:false,
              chatOpen:false,
              showChat:false,
              reOpen:false,
              openHeight:0
          }
        },
        name: "NovelRead",
        methods:{
            closeChat(){
                this.showChat=false
                this.chatOpen=false
                this.reOpen=false
                this.openHeight=0
            },
            openChat(){
                if(this.$global.mixin.methods.checkAndOpenLogin()){
                    this.showChat=true
                    this.chatOpen=true
                    this.openHeight=220
                    this.reOpen=true
                }
            },
            goToTop(val){
                if(val===0){
                    window.scrollTo({
                        left:0,
                        top: 0,
                        behavior: "smooth"
                    });
                }else if(val===1){
                    window.scrollTo({
                        left:0,
                        top: document.body.scrollHeight,
                        behavior: "smooth"
                    });
                }
            },
            closeTree(val){
                this.isOpenTree=false
            },
            goBack() {
                this.$router.go(-1);
            },
            jumpChapterContext(id){
                if(this.reOpen){
                    this.showChat=false
                    this.chatOpen=false
                }
                this.$router.push({
                    path: this.$route.path,
                    query:{
                        novelId: this.$route.query.novelId,
                        chapterId: id
                    }
                })
            },
            getChapterContext(){
                let param={
                    chapterId: this.$route.query.chapterId
                }
                this.$apiMethods.novelApi.getNovelChapterContext(param).then(res=>{
                    if(res.code===200){
                        this.novelName=res.data.novelTitle
                        this.chapterName=res.data.chapterName
                        this.contextList=res.data.list
                        this.lastChapterId=res.data.lastChapterId
                        this.nextChapterId=res.data.nextChapterId
                    }
                })
            },
            jumpNovel(){
                this.$router.push({
                    path:'/novel/novelInfo',
                    query:{
                        novelId:this.novelId,
                        novelName:this.novelName
                    }
                });
            },
            saveReadHistory(y){
                let param={
                    novelId:this.novelId,
                    novelChaperId:this.chapterId,
                    position: y?parseInt(y):0,
                    userType:this.$store.state.isLogin?0:1,
                    type:0 //0代表历史记录
                }
                if(!y){
                    param.allPosition=parseInt(document.body.scrollHeight)
                }
                this.$apiMethods.novelApi.saveHistory(param)
            },
            getReadHistory(){
                let param={
                    novelId:this.novelId,
                    novelChaperId:this.chapterId,
                }
                this.$apiMethods.novelApi.getHistory(param).then(res=>{
                    if(res.code===200){
                        if(res.data){
                            this.isHistory=true
                            this.yPosition=res.data.readPosition
                        }else{
                            this.isHistory=false
                            this.yPosition=0
                            this.saveReadHistory()
                        }
                        this.getChapterContext()
                    }
                })
            },
            jumpY(){
                let y=this.$route.query.positionY
                if(y){
                    this.saveReadHistory(y)
                    this.yPosition=y
                    this.getChapterContext()
                }else{
                    //保存历史
                    this.getReadHistory()
                }
            },
            addCollection(){
                let params={
                    novelId:this.novelId
                }
                this.$apiMethods.novelApi.addCollection(params).then(res=>{
                    if(res.code===200){
                        if(res.data){
                            this.$utils.warning2("该小说已收藏")
                        }else {
                            this.$utils.success2("收藏成功！")
                        }
                    }
                })
            },
            saveBookMark(){
                if(this.$global.mixin.methods.checkAndOpenLogin()){
                    this.$prompt('请输入书签名(可不输入)', '是否添加书签', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then(({ value }) => {
                        let param={
                            novelId:this.novelId,
                            novelChaperId:this.chapterId,
                            position: parseInt(window.pageYOffset),
                            allPosition: parseInt(document.body.scrollHeight),
                            markName: value,
                            type:1 //1代表书签
                        }
                        this.$apiMethods.novelApi.saveHistory(param).then(res=>{
                            if(res.code===200){
                                this.$utils.success2("添加书签成功");
                            }
                        })
                    })
                }
            },
        },
        created() {
            //如果没有历史记录，则存一下历史记录
            this.jumpY()
        },
        watch: {
            $route(){
                this.chapterId= this.$route.query.chapterId
            },
            chapterId() {
                //如果没有历史记录，则存一下历史记录
                this.jumpY()
            },
            contextList: function() {
                this.$nextTick(() => {
                    if(this.rebackTop){
                        window.scrollTo({
                            left:0,
                            top: this.yPosition,
                            behavior: "smooth"
                        });
                    }
                    if(this.reOpen){
                        this.showChat=true
                        this.chatOpen = true
                        this.reOpen=false
                    }
                });
            }
        },
        components: {ChatWebSocket, ChapterTree,SuspensionFrame},
        mounted(){
            //添加监听事件
            window.addEventListener('beforeunload', e => this.saveReadHistory(window.pageYOffset))
        },
        beforeRouteLeave (to, from, next) {
            this.saveReadHistory(window.pageYOffset)
            next()
        },
        destroyed() {
            window.removeEventListener('beforeunload', e => this.saveReadHistory(window.pageYOffset))
        }
    }
</script>

<style scoped>
    .readAllDiv{
        border: 2px solid #88C6E5;
        background-color: #E9FAFF;
        min-height: 400px;
    }

    .readHeaderDiv{
        background-color: #E1ECED;
        border-bottom: #88C6E5 1px solid;
        padding: 5px 20px;
        display: flex;
        justify-content: space-between;
    }

    .headerLeft{
        display: flex;
    }

    .titleDiv{
        border-bottom: 1px dashed #88C6E5;
        min-height: 50px;
    }

    .contentDiv{
        padding: 20px 5%;
    }

    .contentDiv p{
        text-align: left;
        text-indent:2em
    }

    .readOprDiv{
        border-top: 1px dashed #88C6E5;
        padding: 30px;
    }


</style>