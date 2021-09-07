<template>
    <div>
        <div class="tipsDiv">
            <el-alert
                    title="提示"
                    type="warning"
                    description="该模块包含本站所有的小说，如您想看的小说不在此列表中，欢迎自行上传"
                    :closable="false"
                    center>
            </el-alert>
        </div>
        <div class="allNovelDiv">
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
    export default {
        name: "NovelAll",
        data(){
            return{
                pageNum:1,
                pageSize:50,
                total:0,
                novelList:[]
            }
        },
        methods:{
            getAllNovelList(){
                let param={
                  pageNum: this.pageNum,
                  pageSize: this.pageSize,
                  pageType: 0
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                  if(res.code===200){
                      this.total=res.data.total
                      this.novelList=res.data.records
                  }
                })
            },
            handleCurrentChange(val){
                this.pageNum=val
                this.getUserList()
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
            jumpNovel(id,title){
                this.$router.push({
                    path:'/novel/novelInfo',
                    query:{
                        novelId:id,
                        novelName:title
                    }
                });
            },
        },
        created() {
            this.getAllNovelList()
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
        }
    }
</script>

<style scoped>
    .tipsDiv{
        margin-top: 10px;
        text-align: center;
        padding: 0 20%;
    }

    .allNovelDiv{
        margin: 10px 0 30px 0;
        text-align: center;
        background-color: #E9FAFF;
    }

    .allNovelDiv h2{
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