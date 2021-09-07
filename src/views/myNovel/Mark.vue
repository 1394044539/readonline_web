<template>
    <div>
        <div class="historyHeaderDiv">
            <div style="width: 30%">
                <h2 style="text-align: left;margin: 0">书签列表</h2>
            </div>
            <div style="width: 50%;display: flex">
                <el-input
                        style="width: 60%;margin-right: 15px"
                        size="small"
                        placeholder="请输入书签名"
                        v-model="seachMark">
                    <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getMarkList(1)" @keyup.enter="getMarkList(1)"></i>
                </el-input>
                <el-button type="danger" round size="mini" @click="removeAllMark">清空书签</el-button>
            </div>
        </div>

        <hr style="margin: 0"/>
        <div class="historyListDiv" v-if="markList.length>0">
            <div class="uploadNovelDiv" v-for="(itme,index) in markList">
                <div class="uploadNovelImd" @click="jumpChapter(itme.novel.id,itme.novelChapter.id,itme.readPosition)">
                    <el-image
                            style="width: 100px; height: 100px;cursor: pointer"
                            :src="itme.novel.novelImg?'/img/'+itme.novel.novelImg:require('@/assets/img/moimg.gif')"
                            fit="fit"></el-image>
                </div>
                <div class="uploadNovelInfoDiv">
                    <div style="text-align: left;font-size: 18px;cursor: pointer" @click="jumpChapter(itme.novel.id,itme.novelChapter.id,itme.readPosition)">
                        {{itme.bookMarkName}}
                        <p>{{itme.novel.novelTitle}}</p>
                        <p style="font-size: 12px">{{itme.novelChapter.chapterName}}</p>
                    </div>
                    <div style="text-align: left;color: gray;font-size: 14px">
                        <div style="float: left">
                            <i class="el-icon-reading"></i> &nbsp;看到：{{itme.percentage===0?'未开始':getPec(itme.percentage)+'%'}}
                        </div>
                        <div style="float: right">
                            <div style="text-align: left;color: gray;font-size: 14px">{{getNowTime(itme.updateTime)}}</div>
                        </div>
                    </div>
                </div>
                <div class="uploadNovelOperationDiv">
                    <div class="btnDiv">
                        <div>
                            <el-button type="primary" icon="el-icon-edit" circle @click="updateMarkBtn(itme.id,itme.bookMarkName)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteMarkBtn(itme.id)"></el-button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pageInfoDiv">
                <el-pagination
                        background
                        :page-size='8'
                        layout="total,prev, pager, next,jumper"
                        :pager-count='5'
                        @current-change="handleCurrentChange"
                        :total="this.total">
                </el-pagination>
            </div>
        </div>

        <div class="historyListDiv" v-if="isNotContext">
            <h2 style="text-align: center;width: 100%;font-weight: unset">暂无书签，欢迎观看小说</h2>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Mark",
        data(){
            return{
                markList:[],
                pageNum:1,
                pageSize:10,
                seachMark:'',
                total: 0,
                nowPage:1,
                isNotContext:false
            }
        },
        methods:{
            getMarkList(val){
                let param={
                    type:1,//1代表书签记录
                    pageNum: this.pageNum,
                    pageSize:this.pageSize,
                    markName: val?this.seachMark:''
                }
                this.$apiMethods.novelApi.getHistoryList(param).then(res=>{
                    if(res.code===200){
                        this.total=res.data.total
                        this.nowPage=res.data.current
                        this.markList=res.data.records;
                        if(this.markList.length===0){
                            this.isNotContext=true
                        }
                    }
                })
            },
            handleCurrentChange(val){
                this.pageNum =val
                this.getMarkList(this.seachMark)
            },
            keyupSubmit(){
                document.onkeydown=e=>{
                    let _key=window.event.keyCode;
                    if(_key===13){
                        this.getMarkList(1)
                    }
                }
            },
            deleteMarkBtn(val){
                this.$confirm('确认要删除书签吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param={
                        ids:[val].toLocaleString(),
                        deleteType:0 //0代表走的是勾选删除
                    }
                    this.$apiMethods.novelApi.deleteHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功");
                            this.getMarkList()
                        }
                    })
                })
            },
            removeAllMark(){
                this.$confirm('确认要清空书签吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param={
                        deleteType:1, //1表示当前用户清空记录
                        type:1 //1代表书签
                    }
                    this.$apiMethods.novelApi.deleteHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("清空成功");
                            this.getMarkList()
                        }
                    })
                })
            },
            updateMarkBtn(id,name){
                this.$prompt('请输入修改后的书签名', '修改书签名', {
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    inputValue:name
                }).then(({ value }) => {
                    let param={
                        id:id,
                        type:1,
                        markName:value
                    }
                    this.$apiMethods.novelApi.saveHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("修改成功");
                            this.getMarkList()
                        }
                    })
                })
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
            }
        },
        created() {
            this.getMarkList()
            this.keyupSubmit()
        },
        computed:{
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
            getPec(){
                return (value) => {
                    let num=value*100
                    num=num.toFixed(1)
                    return num
                }
            }
        },
        destroyed() {
            document.onkeydown = ''
        }
    }
</script>

<style scoped>
    .historyListDiv{
        border: 1px solid #e4e7ed;
        min-height: 300px;
        margin: 20px 5%;
        background-color: #FCFCFA;
        display: flex;
        /* justify-content: space-between; */
        flex-wrap: wrap;
    }

    .uploadNovelDiv{
        display: flex;
        width: 100%;
        padding: 5px;
        border-bottom: 1px dashed rgb(136, 198, 229);
        max-height: 110px;
    }

    .uploadNovelInfoDiv{
        padding: 5px;
        display: flex;
        flex-direction: column;
        justify-content:space-between;
        width: 65%;
    }

    .uploadNovelInfoDiv p{
        margin: 0;
        font-size: 14px;
        color: gray;
        margin-top: 3px;
        cursor: pointer;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .uploadNovelOperationDiv{
        height: 100%;
        flex: 1;
        line-height: 100px;
        justify-content: space-between;
        display: flex;
        text-align: center;
    }

    .btnDiv{
        justify-content: center;
        display: flex;
        text-align: center;
        flex-direction: column;
    }

    .pageInfoDiv{
        width: 100%;
        margin: 10px 0;
        text-align: center;
    }

    .historyHeaderDiv{
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>