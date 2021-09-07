<template>
    <div>
        <div class="hotListDiv">
            <div class="modelDiv hotModelDiv">
                <div class="novelModelDiv" v-for="hotNovel in typeHotNovelList">
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
        </div>
        <div class="typeNovelListDiv modelDiv">
            <h2 style="height: 30px;line-height: 30px;font-size: 14px">全部列表</h2>
            <div style="padding: 10px">
                <div v-for="(novel,index) in novelList" class="novelTypeInfoDiv">
                    <span style="width: 30%;text-align: left">
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
                        {{getTotalNum(novel.novelWordNum)}}
                    </span>
                    <span style="width: 10%;text-align: left;color: #B3B3B3;">
                        {{getNowTime(novel.updateTime)}}
                    </span>
                    <span style="width: 10%;text-align: right;color: #B3B3B3;">
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
            <div class="pageDiv">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="this.pageNum"
                        :page-size="this.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="this.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        inject:['reload'],
        name: "NovelType",
        data(){
            return{
                type:this.$route.params.type,
                search: this.$route.query.searchInput,
                typeHotNovelList:[],
                novelList:[],
                pageNum:1,
                pageSize: 10,
                total:0
            }
        },
        methods:{
            init(){
                if(this.search){
                    console.log(this.search)
                }else {
                    this.getRankList()
                    this.getAllList()
                }
            },
            getRankList(){
                let param={
                    types:[this.type].toLocaleString()
                }
                //这里要拿之前取到的数据去遍历
                this.$apiMethods.novelApi.getHotTypeNovel(param).then(res=>{
                    if(res.code===200){
                        this.typeHotNovelList = res.data[this.type]
                    }
                })
            },
            getAllList(){
                let param={
                    pageType:0, //首页：0
                    sortType:0,  //热度排序
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    novelType:this.type
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code === 200){
                        this.novelList=res.data.records
                        this.total=res.data.total
                    }
                })
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
            handleCurrentChange(val){
                this.pageNum=val
                this.getAllList()
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
        created(){
            this.init()
        },
        watch:{
            $route(){
                this.reload();
            },
        },
        computed:{
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
            getNowTime(){
                return (value) => {
                    var updateTime = new Date(value)
                    var nowDate = new Date()
                    if(updateTime.getFullYear()===nowDate.getFullYear()
                        &&updateTime.getMonth()===nowDate.getMonth()){
                        let min=updateTime.getMinutes()>=10?updateTime.getMinutes():"0"+updateTime.getMinutes()
                        let sec=updateTime.getSeconds()>=10?updateTime.getSeconds():"0"+updateTime.getSeconds()
                        if(updateTime.getDay()===nowDate.getDay()){
                            return '今天 '
                        }
                        if(updateTime.getDay()===nowDate.getDay()-1){
                            return '昨天 '
                        }
                    }
                    return updateTime.getFullYear()+"-"+updateTime.getMonth()+"-"+updateTime.getDay()
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
        background-color: #E9FAFF;;
        border: 3px solid #C3DFEA;
        min-height: 200px;
    }

    .hotModelDiv{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 5px;
    }

    .novelModelDiv{
        width: 290px;
        max-width: 300px;
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

    .typeNovelListDiv{
        margin-top: 20px;
    }

    .typeNovelListDiv h2{
        background-color: rgb(166, 211, 232);
        margin: 0;
    }

    .novelTypeInfoDiv{
        border-bottom: 1px solid rgb(221, 221, 221);
        font-size: 12px;
        display: flex;
        line-height: 25px;
    }

    .el-icon-my-export{
        background: url(../../../assets/img/hot.png) center no-repeat;
        width: 16px;
        height: 13px;
        background-size: cover;
    }

    .pageDiv{
        padding: 10px
    }
</style>