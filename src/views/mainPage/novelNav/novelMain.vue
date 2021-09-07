<template>
    <div>
        <div class="hotListDiv">
            <div class="modelDiv hotModelDiv">
                <div class="novelModelDiv" v-for="hotNovel in hotNovelList">
                    <div class="novelLeftImg" @click="jumpNovel(hotNovel.id,hotNovel.novelTitle)">
                        <el-image
                                style="width: 100px; height: 140px"
                                :src="hotNovel.novelImg?'/img/'+hotNovel.novelImg:require('@/assets/img/moimg.gif')"
                                fit="fit"></el-image>
                    </div>
                    <div class="novelRightInfo">
                        <div class="novelRightTitle">
                            <a href="javaScript:void(0);" @click="jumpNovel(hotNovel.id,hotNovel.novelTitle)">{{hotNovel.novelTitle}}</a><span>{{hotNovel.novelAuthor}}</span>
                        </div>
                        <div class="novelRightIntro">
                            {{hotNovel.novelIntroduce?hotNovel.novelIntroduce:'暂无简介'}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modelDiv noticeDiv">
                <h2 class="titleH2">公告</h2>
                <ul class="titleUl">
                    <li v-for="(notice,index) in noticeList" class="titleLi">
                        <span style="padding: 0 5px;float: left">[公告]</span>
                        <span class="sc"><a class="notica" :title="notice.title" @click="openNotice(notice)">{{notice.title}}</a></span>
                        <span style="float: right">{{getDate(notice.createTime)}}</span>
                    </li>
                </ul>
                <h2 class="titleH2">问题反馈</h2>
                <div style="margin: 10px;border: 1px dashed gray;height: 45px;line-height: 20px;padding-top: 25px;position:relative;">
                    <el-link href="javaScript:void(0);">意见投稿</el-link>
                    &nbsp;&nbsp;&nbsp;
                    <el-link href="javaScript:void(0);">Bug反馈</el-link>
                </div>
            </div>
        </div>
        <div class="allTypeDiv">
            <div v-if="key!=='typeDict'" v-for="(value, key,index) in hotNovelObject" :key="key" class="typeListDiv">
                <p class="typeHeaderP">{{getTypeName(key,hotNovelObject['typeDict'])}}</p>
                <div class="oneTypeDiv" v-for="(obj,index) in value">
                    <div v-if="index===0" class="firstTypeDiv">
                        <div class="firstTypeImgDiv">
                            <el-image
                                    style="width: 67px; height: 82px"
                                    :src="obj.novelImg?'/img/'+obj.novelImg:require('@/assets/img/moimg.gif')"
                                    fit="fit">
                            </el-image>
                        </div>
                        <div class="firstTypeInfoDiv">
                            <a href="javaScript:void(0);" @click="jumpNovel(obj.id,obj.novelTitle)" :title="obj.novelTitle">{{obj.novelTitle}}</a>
                            <div class="firstTypeTextDiv">{{obj.novelIntroduce?obj.novelIntroduce:'暂无简介'}}</div>
                        </div>
                    </div>
                    <div v-if="index!==0" class="typeInfoDiv">
                        <a href="javaScript:void(0);" @click="jumpNovel(obj.id,obj.novelTitle)" :title="obj.novelTitle">{{obj.novelTitle}}</a>
                        <span style="color: #B3B3B3;font-size: 12px">/{{obj.novelAuthor}}</span>
                        <div style="float: right;max-width: 30%">
                            <i class="el-icon-view"></i>
                            <span style="color: #B3B3B3;font-size: 12px">{{obj.novelClick}}</span>
                            &nbsp;
                            <i class="el-icon-my-export"></i>
                            <span style="color: #B3B3B3;font-size: 12px">{{obj.novelHot}}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="recommendListDiv modelDiv">
            <h2 style="height: 30px;line-height: 30px;font-size: 14px">推荐小说列表</h2>
            <div style="padding: 10px">
                <div v-for="(novel,index) in recommendList" class="novelTypeInfoDiv">
                    <span style="width: 30%;text-align: left;">
                        《
                        <el-link :underline="false" style="font-size: 12px;" href="javaScript:void(0);" @click.native="jumpNovel(novel.id,novel.novelTitle)">
                            {{novel.novelTitle}}
                        </el-link>
                        》
                    </span>
                    <span style="width: 20%;text-align: left;color: #B3B3B3;">
                        {{novel.novelAuthor}}
                    </span>
                    <span style="width: 20%;text-align: left;color: #B3B3B3;">
                        {{novel.novelType}}
                    </span>
                    <span style="width: 15%;text-align: left;color: #B3B3B3;">
                        {{getTotalNum(novel.novelWordNum)}}
                    </span>
                    <span style="width: 5%;text-align: left;color: #B3B3B3;">
                        <i class="el-icon-my-export"></i>
                        {{novel.novelHot}}
                    </span>
                    <span style="width: 10%;text-align: right;color: #B3B3B3;">
                        <el-link :underline="false" style="font-size: 12px;" href="javaScript:void(0);" @click.native="addCollection(novel.id)">
                            收藏
                        </el-link>
                    </span>
                </div>
            </div>
        </div>
        <NoticeDialog :openDialog="openDialog" :type=0 :notice="noticeObj" @closeFrom=closeNoticeForm></NoticeDialog>
    </div>

</template>

<script>
    import NoticeDialog from '../../../components/admin/noticeDialog'
    export default {
        name: "novelMain",
        components:{
            NoticeDialog
        },
        data(){
            return{
                hotNovelList:[],
                hotNovelObject:[],
                noticeList:[],
                openDialog:false,
                noticeObj:{},
                recommendList:[]
            }
        },
        methods:{
            //按照热度排序
            getHotNovelList(){
                let param={
                    pageType:0, //首页：0
                    sortType:0,  //热度排序
                    pageSize:4
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code === 200){
                        this.hotNovelList=res.data.records
                    }
                })
            },
            getAllTypeList(){
                //这里要拿之前取到的数据去遍历
                this.$apiMethods.novelApi.getHotTypeNovel().then(res=>{
                    if(res.code===200){
                        this.hotNovelObject=res.data
                    }
                })
            },
            getNoticeList(){
                let param={
                    pageNum: 1,
                    pageSize: 5,
                    pageType: 0
                }
                this.$apiMethods.dataApi.getSysNoticeList(param).then(res=>{
                    if(res.code===200){
                        this.noticeList=res.data.records
                    }
                })
            },
            getRecommendList(){
                let param={
                    pageType:0, //首页：0
                    sortType:0,  //热度排序
                    pageSize:20
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code === 200){
                        this.recommendList=res.data.records
                    }
                })
            },
            init(){
                this.getHotNovelList();
                this.getAllTypeList();
                this.getNoticeList();
                this.getRecommendList();
            },
            jumpNovel(id,title){
                this.$router.push({
                    path:'/novel/novelInfo',
                    query:{
                        novelId:id,
                        novelName:title
                    }
                });
            },
            openNotice(val){
                this.openDialog=true
                this.noticeObj=val
            },
            closeNoticeForm(val){
                this.openDialog=val
            },
            addCollection(id){
                let params={
                    novelId:id
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

        },
        created() {
           this.init()
        },
        computed:{
            getTypeName(){
                return (value,map) => {
                    for(let item of map) {
                        if(item.dictKey===value){
                            return item.dictValue
                        }
                    }
                    return value
                }
            },
            getDate(){
                return (val) =>{
                    var time = new Date(val)
                    return time.getFullYear()+"-"+time.getMonth()+"-"+time.getDay()
                }
            },
            getTotalNum(){
                return (num) =>{
                    let str=num
                    if(num>=1000&&num<10000){
                        str=parseInt(num/1000)+"千字"
                    }else if(num>=10000&&num<100000000){
                        str=parseInt(num/10000)+"万字"
                    }else if(num>=100000000){
                        str=parseInt(num/100000000)+"亿字"
                    }
                    return str
                }
            },
        }
    }
</script>

<style scoped>
    .hotListDiv{
        justify-content: space-between;
        padding-top: 20px;
        display: flex;
        flex-wrap: wrap;
    }

    .modelDiv{
        background-color: #FFF;
        border: 3px solid #C3DFEA;
        min-height: 200px;
    }

    .hotModelDiv{
        width: 70%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 5px;
    }

    .noticeDiv{
        width: 25%;
    }

    .titleH2{
        line-height: 30px;
        margin: 0;
        background-color: #E1ECED;
        font-size: 14px;
    }

    .titleUl{
        margin: 0;
        list-style: none;
        text-align: left;
        padding: 10px !important;
    }

    .titleLi{
        border-bottom: 1px solid #DDDDDD;
        line-height: 27px;
        overflow: hidden;
    }

    .titleLi span{
        font-size: 12px;
    }

    .sc{
        float: left;
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .notica{
        color: #6F78A7;
        width: 100%;
        cursor:pointer;
        /*text-decoration: underline;*/
    }

    .notica:hover{
        text-decoration: underline;
    }

    .novelModelDiv{
        width: 300px;
        height: 150px;
        display: flex;
        margin-bottom: 3px;
    }

    .novelLeftImg{
        cursor: pointer;
        padding: 5px;
        border: 1px solid rgb(221, 221, 221);
    }

    .novelRightInfo{
        flex:1;
        padding-left: 10px;
        height: 100%
    }

    .novelRightTitle{
        height:25px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dotted rgb(166, 211, 232);
    }

    .novelRightTitle a{
        text-decoration: none;
        font-size: 14px;
        max-width: 120px;
        margin: 0;
        color: rgb(111, 120, 167);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        font-weight:bold
    }

    .novelRightTitle a:hover{
        text-decoration: underline;
    }

    .novelRightTitle span{
        color: rgb(179, 179, 179);
        font-size: 14px;
        max-width: 45px;
        margin: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
    }

    .novelRightIntro{
        font-size: 12px;
        width: 100%;
        max-height: 120px;
        text-align: left;
        text-indent: 2em;
        padding-top: 10px;
        line-height: 20px;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
    }

    .allTypeDiv{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        background-color: #FFF;
        border: 3px solid #C3DFEA;
    }

    .typeListDiv{
        width: 32%;
        border: dotted 1px #A6D3E8;
        padding: 3px;
        min-height: 150px;
    }

    .typeHeaderP{
        margin: 0;
        border-bottom: solid 1px #A6D3E8;
        background-color: #F6F8FE;
        font-size: 14px;
        font-weight: bold;
        height: 25px;
        line-height: 25px;
    }

    .oneTypeDiv{

    }

    .firstTypeDiv{
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #DDDDDD;
    }

    .firstTypeImgDiv{
        padding: 10px 0 0 5px;
    }

    .firstTypeInfoDiv{
        width: 210px;
        text-align: left;
        padding-top: 10px;
    }

    .firstTypeInfoDiv a{
        color: #6F78A7;
        text-decoration: none;
        font-weight: bold;
        font-size: 12px;
    }

    .firstTypeInfoDiv a:hover{
        text-decoration: underline;
    }

    .firstTypeTextDiv{
        line-height: 20px;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        max-width: 100%;
        height: 60px;
        text-indent: 2em;
        text-align: left;
        font-size: 12px;
        color: #555555;
    }

    .typeInfoDiv{
        border-bottom: solid 1px #DDDDDD;
        padding-left: 5px;
        text-align: left;
    }

    .typeInfoDiv a{
        color: #6F78A7;
        text-decoration: none;
        font-size: 12px;
    }

    .typeInfoDiv a:hover{
        text-decoration: underline;
    }

    .el-icon-my-export{
        background: url(../../../assets/img/hot.png) center no-repeat;
        width: 16px;
        height: 15px;
        background-size: cover;
    }
    .el-icon-my-export:before{
        content: "\e611";
    }

    .recommendListDiv{
        margin-top: 20px;
    }

    .recommendListDiv h2{
        background-color: #F6F8FE;
        /*background-color: rgb(166, 211, 232);*/
        margin: 0;
    }

    .novelTypeInfoDiv{
        border-bottom: 1px solid rgb(221, 221, 221);
        font-size: 12px;
        display: flex;
        line-height: 25px;
    }
</style>