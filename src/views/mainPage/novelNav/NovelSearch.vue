<template>
    <div>
        <div class="tips-div">
            <el-alert
                    title="提示"
                    type="warning"
                    style="background-color: #E9FAFF;"
                    :description="this.typeName?'当前为【'+this.typeName+'】的搜索结果':'搜索结果如下'"
                    :closable="false"
                    center>
            </el-alert>
        </div>
        <div class="search-novel-div">
            <div>
                <div v-for="(novel,index) in novelList" class="novel-info-div">
                    <div class="novel-info-left-div" @click="$myGlobal.method.jumpNovel(novel.id,novel.novelTitle)">
                        <el-image
                                style="width: 100px; height: 130px"
                                :src="novel.novelImg?'/img/'+novel.novelImg:require('@/assets/img/moimg.gif')"
                                fit="fill">
                        </el-image>
                    </div>
                    <div class="novel-info-right-div">
                        <div style="margin-bottom: 8px;text-align: left"><a @click="$myGlobal.method.jumpNovel(novel.id,novel.novelTitle)">{{novel.novelTitle}}</a><span class="novel-title-author">{{novel.novelAuthor}}</span></div>
                        <div class="novel-type-div">
                            <CustomizeIcon :imgPath="'novelType.png'"/>
                            <span style="margin-left: 8px">{{novel.novelType?novel.novelType:'其他'}}</span>
                        </div>
                        <div class="novel-introduce-div" :title="novel.novelIntroduce">
                            {{novel.novelIntroduce?novel.novelIntroduce:'暂无简介'}}
                        </div>
                        <div class="novel-num-div">
                            <CustomizeIcon title="热度" :imgPath="'hot.png'" :beforeName="$myGlobal.method.getTotalNum(novel.novelHot)" />
                            <CustomizeIcon style="margin-left: 15px" title="点击数" :imgPath="'click.png'" :beforeName="$myGlobal.method.getTotalNum(novel.novelClick)" />
                            <CustomizeIcon style="margin-left: 15px" title="点赞数" :imgPath="'up.png'" :beforeName="$myGlobal.method.getTotalNum(novel.novelUp)" />
                            <CustomizeIcon style="margin-left: 15px" title="上传时间" :imgPath="'time.png'" :beforeName="$dateUtils.formatDate(novel.createTime)" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="pageDiv">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="pageNum"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import CustomizeIcon from '@/components/other/CustomizeIcon'

    export default {
        name: "NovelSearch",
        data(){
            return{
                searchInput:'',
                type:'',
                typeName:'',
                novelList:[],
                pageNum:0,
                pageSize:10,
                total:0
            }
        },
        components:{ CustomizeIcon },
        computed:{
            // getTotalNum(){
            //     return (num) =>{
            //         let str=num
            //         if(num>=1000&&num<10000){
            //             str=parseInt(num/1000)+"千字"
            //         }else if(num>=10000&&num<100000000){
            //             str=parseInt(num/10000)+"万字"
            //         }else if(num>=100000000){
            //             str=parseInt(num/100000000)+"亿字"
            //         }
            //         return str
            //     }
            // },
        },
        methods:{
            getNovelList(){
                let param={
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    pageType: 0, //首页类型
                    novelTitle: this.searchInput,
                    novelType: this.type
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code===200){
                        this.novelList=res.data.records
                        this.total=res.data.total
                    }
                })
            },
            handleCurrentChange(val){
                this.pageNum=val
                this.getNovelList()
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

        },
        watch:{
            $route:{
                handler(){
                    this.searchInput=this.$route.query.searchInput
                    this.type=this.$route.query.type
                    this.typeName=this.$route.query.typeName
                    this.pageSize=10
                    this.pageNum=0
                    this.total=0
                    this.getNovelList()
                },
                immediate: true,
                deep:true
            }



        }
    }
</script>

<style scoped>
    .tips-div{
        margin-top: 10px;
        text-align: center;
        padding: 0 20%;
    }

    .search-novel-div{
        border-top: #e5e9ef 1px solid;
    }

    .novel-info-div{
        border-bottom: #e5e9ef 1px solid;
        padding: 20px 0 20px 0;
        display: flex;
        background-color: #FFFFFF;
    }

    .novel-info-left-div{
        /*margin-left: 20px;*/
        width: 150px;
        min-width: 150px;
        cursor: pointer;
    }

    .novel-info-right-div{

    }


    .novel-info-right-div a{
        color: #262626;
        font-size: 18px;
        cursor: pointer;
    }

    .novel-info-right-div a:hover{
        color: #bf2c24;;
    }

    .novel-title-author{
        border-radius: 12px;
        padding: 0 10px;
        border: 1px solid #e5e9ef;
        color: #6d757a;
        text-align: center;
        margin-left: 10px;
        font-size: 12px;
    }

    .novel-type-div{
        text-align: left;
        font-size: 12px;
        color: #a6a6a6;
        line-height: 16px;
        margin-bottom: 8px;
        display: flex;
    }

    .novel-introduce-div{
        text-align: left;
        margin-bottom: 8px;
        color: #666;
        height: 45px;
        font-size: 14px;
        line-height: 24px;
        padding-right: 40px;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .novel-num-div{
        display: flex;
        color: #99a2aa;
    }
</style>