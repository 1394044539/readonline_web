<template>
    <div style="margin: 0;height: 100%;padding: 20px 20%">
        <div class="infoHeader">
            <div class="reBackDiv">
                <el-page-header @back="goBack" :content="novelName?novelName:'详情页面'" >
                </el-page-header>
            </div>
            <div class="novelInfoDiv">
                <div class="novelImgDiv">
                    <el-image
                          style="width: 100%; height: 100%;"
                          :src="novelImg"
                          fit="contain"></el-image>
                </div>
                <div class="novelDataDiv">
                    <h1 style="margin: 10px;text-align: left;font-size: 28px;">{{novelInfo.novelTitle}}</h1>
                    <div class="dataDiv1">
                        <div class="dataP" style="width: 40%">
                            <p>作者：{{novelInfo.novelAuthor}}</p>
                        </div>
                        <div class="dataP">
                            <p>发布时间：{{novelInfo.novelPublicDate}}</p>
                        </div>
                        <div class="dataP" style="width: 40%">
                            <p>总字数：{{novelInfo.novelWordNum}}</p>
                        </div>
                        <div class="dataP" >
                            <p>最后更新时间：{{novelInfo.updateTime}}</p>
                        </div>
                    </div>
                    <div class="dataDiv1" style="padding-left: 10px">
                        类型：
                        <el-tag effect="plain" size="small"
                                v-for="item in getTypeList(novelInfo.novelTypeDict)"
                                :key="item.label"
                                :type="item.type">
                            {{ item.label }}
                        </el-tag>
                    </div>
                    <div class="dataDiv1" style="padding-left: 10px">
                        <span class="div1span">热度:{{novelInfo.novelHot}}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span class="div1span">点击:{{novelInfo.novelClick}}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span class="div1span">点赞:{{novelInfo.novelUp}}</span>
                        <el-divider direction="vertical"></el-divider>
                        <span class="div1span">评论:{{novelInfo.novelComment}}</span>
                        <el-divider direction="vertical"></el-divider>
                    </div>
                    <hr align="center" width="100%" style= "border:1px dashed #88C6E5;" />
                    <div v-if="this.$store.getters.getLogin && !this.$store.getters.isAdmin" class="oprDiv">
                        <el-button v-if="!isHistory" type="success" @click="startRead">开始阅读</el-button>
                        <el-button v-if="isHistory" @click="startRead">重头阅读</el-button>
                        <el-button v-if="isHistory" type="warning" @click="continueRead">继续阅读</el-button>
                        <el-button v-if="!isCollection" type="primary" @click="addCollection">加入收藏</el-button>
                        <el-button v-if="isCollection" type="danger" @click="cancelCollection">取消收藏</el-button>
                    </div>
                    <div v-if="!this.$store.getters.getLogin || this.$store.getters.isAdmin" class="oprDiv">
                        <el-button type="success" @click="startRead">开始阅读</el-button>
                    </div>
                </div>
            </div>
            <el-divider content-position="center" class="hrE">下面是简介哦</el-divider>
            <div style="padding: 0 10%;margin-bottom: 20px">
                <p :class="introducePcss">{{novelInfo.novelIntroduce}}</p>
            </div>
        </div>
        <div class="novelChapterDiv">
            <div class="reBackDiv" style="line-height: 30px">
                <h2 style="margin: 0">章节列表</h2>
            </div>
            <div  class="chapterListDiv">
                <div class="chapterInfo" v-for="(chapter,index) in novelChapter">
                    <a href="javascript:void(0);" @click="jumpChapter(chapter.id,index)">{{chapter.chapterName?chapter.chapterName:'第'+(index+1)+'章'}}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "NovelInfo",
        data(){
            return {
                novelId:'',
                novelName:'',
                novelInfo:{},
                novelChapter:[],
                novelImg:require('@/assets/img/moimg.gif'),
                introducePcss:"introducePCss1",
                //是否展示展开按钮
                showBtn: false,
                //当前状态是不是展开
                isOpenBtn: false,
                isHistory:false,
                historyChapter:{},
                isCollection:false
            }
        },
        methods:{
            goBack() {
                this.$router.go(-1);
            },
            initNovelInfo(){
                this.novelId=this.$route.query.novelId
                this.novelName=this.$route.query.novelName
                let params={
                    id:this.novelId,
                    isClick:true
                }
                this.$apiMethods.novelApi.getNovelInfo(params).then(res=>{
                    if(res.code===200){
                        let result=res.data
                        this.novelInfo=result
                        if(result.novelImg){
                            this.novelImg='/img/'+result.novelImg
                        }
                        // this.novelImg = result.novelImg?'/img/'+result.novelImg:require('@/assets/img/moimg.gif')
                        if(!result.novelPublicDate){
                            this.novelInfo.novelPublicDate='未知'
                        }
                        if(!result.novelAuthor){
                            this.novelInfo.novelAuthor='未知'
                        }
                        if(!result.novelType){
                            this.novelInfo.novelType='其他'
                        }
                        if(!result.novelIntroduce){
                            this.novelInfo.novelIntroduce='暂无简介'
                        }
                        if(!result.novelWordNum){
                            this.novelInfo.novelWordNum='未知'
                        }
                        this.novelChapter=result.chapterList
                    }
                })
                this.getHistory()
                this.getCollection()
            },
            initNovelChapter(){
                let param={
                    id:this.novelId
                }
                this.$apiMethods.novelApi.getNovelChapterInfo(param).then(res=>{
                    if(res.code===200){
                        this.novelChapter=res.data
                    }
                })
            },
            jumpChapter(chapterId,index){
                this.$router.push({
                    path:'/novel/novelRead',
                    query:{
                        chapterId:chapterId,
                        novelId:this.novelId,
                    }
                })
            },
            getHistory(){
                let param={
                    novelId:this.novelId,
                }
                this.$apiMethods.novelApi.getHistory(param).then(res=>{
                    if(res.code===200&&res.data){
                        this.isHistory=true
                        this.historyChapter=res.data
                    }
                })
            },
            getCollection(){
                let param={
                    novelId:this.novelId
                }
                this.$apiMethods.novelApi.getCollection(param).then(res=>{
                    if(res.code===200&&res.data){
                        this.isCollection=true
                    }
                })
            },
            addCollection(){
                this.$utils.confirmWarning("是否加入收藏?").then(res=>{
                    let params={
                        novelId:this.novelId
                    }
                    //加入收藏
                    this.$apiMethods.novelApi.addCollection(params).then(res=>{
                        if(res.code===200){
                            this.$utils.success2('加入成功')
                            this.initNovelInfo()
                        }
                    })
                }).catch(res=>{})
            },
            //继续阅读
            continueRead(){
                this.jumpChapter(this.historyChapter.lastChapterId,0)
            },
            //开始阅读或从头阅读
            startRead(){
                if(this.novelChapter){
                    this.jumpChapter(this.novelChapter[0].id,0)
                }else {
                    this.$utils.warning2("暂无资源！")
                }
            },
            //取消收藏
            cancelCollection(){
                let params={
                    novelId:this.novelId
                }
                this.$confirm('确认要取消收藏?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$apiMethods.novelApi.cancelCollection(params).then(res=>{
                        if(res.code===200){
                            this.$utils.success2('取消成功')
                            this.initNovelInfo()
                        }
                    })
                })
            }

        },
        computed:{
            getTypeList(){
                return (objList)=>{
                    let returnList=[]
                    if(objList){
                        objList.forEach((type, index) => {
                            let obj={
                                label: type.dictValue
                            }
                            let yushu=index%5
                            switch (yushu) {
                                case 0:
                                    obj.type=''
                                    break;
                                case 1:
                                    obj.type='success'
                                    break;
                                case 2:
                                    obj.type='info'
                                    break;
                                case 3:
                                    obj.type='danger'
                                    break;
                                case 4:
                                    obj.type='warning'
                                    break;
                            }
                            returnList.push(obj)
                        })
                    }
                    return returnList
                }
            }
        },
        created() {
            this.initNovelInfo()
        }
    }
</script>

<style scoped>
    .infoHeader{
        width: 100%;
        min-height: 200px;
        background: #FFFFFF;
        border: #88C6E5 1px solid;
    }

    .reBackDiv{
        background-color: #E1ECED;
        max-height: 40px;
        padding: 10px 10px;
    }

    .novelInfoDiv{
        width: 100%;
        max-height: 300px;
        display: flex;
        justify-content: space-between;
    }

    .novelImgDiv{
        /*height: 100%;*/
        width: 30%;
        padding-top: 10px;
        max-height: 300px;
    }

    .novelDataDiv{
        height: 100%;
        width: 70%;
    }

    .dataDiv1{
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;
        text-align: left;
        min-height: 30px;
    }

    .div1span{
        font-size: 14px;
        color: gray;
    }

    .dataP{
        width: 50%;
        min-height: 35px;
        max-width: 50%;
    }

    .dataP P{
        margin: 0;
        margin-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .introducePCss1{
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        max-width: 100%;
        text-indent: 2em;
        text-align: left;
        margin: 0;
    }

    .introducePCss2{
        text-indent: 2em;
        text-align: left
    }

    .hrE{
        margin: 14px 20px!important;
        width: unset;
    }

    .oprDiv{
        text-align: left;
        padding-left: 10px;
    }

    .novelChapterDiv{
        width: 100%;
        min-height: 200px;
        background: #FFFFFF;
        border: #88C6E5 1px solid;
        margin-top: 30px;
    }

    .chapterListDiv{
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;
    }

    .chapterInfo{
        width: 33.3%;
        border-bottom: 1px dashed #CCC;
        text-align: left;
        line-height: 30px;
    }

    .chapterInfo a{
        font-size: 12px;
        color: #444;
        margin-left: 10px;
        cursor: pointer;
        text-decoration: unset;
    }

    .chapterInfo a:hover{
        text-decoration: underline;
    }
</style>