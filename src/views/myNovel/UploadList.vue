<template>
    <div>
        <div v-if="pageType===0" class="novelCatalogDiv">
            <div class="historyHeaderDiv">
                <div style="width: 30%">
                    <h2 style="text-align: left;margin: 0">上传列表</h2>
                </div>
                <div style="width: 50%;text-align: right">
                    <el-input
                            style="width: 80%;margin-right: 15px;"
                            size="small"
                            placeholder="请输入小说名"
                            v-model="seachNovel">
                        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="getUploadList()" @keyup.enter="getUploadList()"></i>
                    </el-input>
                </div>
            </div>
            <hr style="margin: 0;margin-bottom: 10px"/>
            <div class="novelCatalogOperation">
                <div class="leftOperationBtn"></div>
                <div class="rightOperationBtn">
                    <el-button type="primary" size="small" @click="clickUploadBtn">我要上传</el-button>
                </div>
            </div>
            <div class="novelCatalogView" v-if="list.length>0">
                <div class="uploadNovelDiv" v-for="(item,index) in list">
                    <div class="uploadNovelImd" @click="jumpNovel(item.id,item.novelTitle)">
                        <el-image
                                style="width: 100px; height: 100px;cursor: pointer"
                                :src="item.novelImg?'/img/'+item.novelImg:require('@/assets/img/moimg.gif')"
                                fit="fit"></el-image>
                    </div>
                    <div class="uploadNovelInfoDiv">
                        <div @click="jumpNovel(item.id,item.novelTitle)" style="cursor: pointer;text-align: left;font-size: 18px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="item.novelTitle">小说名：{{item.novelTitle}}</div>
                        <div style="text-align: left;color: gray;font-size: 14px">作者：{{item.novelAuthor}}</div>
                        <div style="text-align: left;color: gray;font-size: 14px">上传时间：{{item.createTime}}</div>
                    </div>
                    <div class="uploadNovelOperationDiv">
                        <div class="btnDiv">
                            <div>
                                <el-button v-if="item.isCollection===0" type="primary" size="mini" @click="addOrDeleteCollection(item.id,1)" plain>加入收藏</el-button>
                                <el-button v-if="item.isCollection===1" type="danger" size="mini" @click="addOrDeleteCollection(item.id,0)" plain>取消收藏</el-button>
                            </div>
                        </div>
                        <div class="btnDiv">
                            <div v-if="item.novelStatus===0">
                                <el-button type="success" size="mini" plain @click="publicNovel(item.id)">发布</el-button>
                            </div>
                            <div v-if="item.novelStatus===1" style="line-height: 30px" class="waitDiv">
                                <el-button class="waitBtn" type="warning" size="mini" plain @click="publicNovel(item.id)">待审核</el-button>
                                <el-button class="cancelBtn" size="mini" plain @click="cancelPublic(item.id)">取消发布</el-button>
                            </div>
                            <div v-if="item.novelStatus===2">
                                <el-button type="success" size="mini" plain @click="cancelPublic(item.id)">已发布</el-button>
                            </div>
                            <div v-if="item.novelStatus===3" style="line-height: 30px" class="waitDiv">
                                <el-button class="waitBtn" type="danger" size="mini" plain >审核失败</el-button>
                                <el-button class="cancelBtn" type="success" size="mini" plain @click="publicNovel(item.id)">重新发布</el-button>
                            </div>
                            <div v-if="item.novelStatus===4">
                                <el-button type="info" size="mini" disabled plain @click="publicNovel(item.id)">被禁用</el-button>
                            </div>
                        </div>
                        <div class="btnDiv">
                            <div style="line-height: 30px">
                                <el-dropdown size="small" :hide-on-click='false'>
                                    <el-button size="mini" plain>
                                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown" >
                                        <el-dropdown-item @click.native="jumpPageType(1,item)">查看</el-dropdown-item>
                                        <el-dropdown-item @click.native="jumpPageType(2,item)">编辑</el-dropdown-item>
                                        <el-dropdown-item @click.native="deleteNovel(item.id)">删除</el-dropdown-item>
<!--                                        <el-dropdown-item>分享</el-dropdown-item>-->
                                        <el-dropdown-item @click.native="downloadNovel(item.id)">下载</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
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
            <div class="novelCatalogView" v-if="isNotContext">
                <h2 style="text-align: center;width: 100%;font-weight: unset">暂无上传记录，点击右上角进行上传</h2>
            </div>
        </div>
        <div v-if="pageType===1">
            <h2 style="text-align: left;margin: 10px 0 10px 30px">小说信息</h2>
            <hr style="margin: 0 0 10px 0;"/>
            <div class="novel-info-btn-div">
                <div>
                    <el-button type="primary" size="small" icon="el-icon-back" @click="returnList">返回列表</el-button>
<!--                    <el-button type="primary" size="small">主要按钮</el-button>-->
                </div>
                <div>
                    <el-button type="warning" size="small" icon="el-icon-edit" @click="jumpPageType(2,novelObj)">编辑小说</el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteNovel(novelObj.id)">删除小说</el-button>
                </div>
            </div>
            <div class="novel-info-div">
                <div class="novel-info-left-div">
                    <el-image
                            style="width: 200px; height: 260px"
                            :src="novelObj.novelImg?'/img/'+novelObj.novelImg:require('@/assets/img/moimg.gif')"
                            fit="fit"></el-image>
                </div>
                <div class="novel-info-right-div">
                    <h1 class="novel-info-right-div-h1" @click="jumpNovel(novelObj.id,novelObj.novelTitle)">{{novelObj.novelTitle}}</h1>
                    <div>
                        <el-tag v-for="(typeDict,index) in novelObj.novelTypeDict" size="small" effect="plain" style="margin-right: 5px">{{typeDict.dictValue || '其他'}}</el-tag>
                        <el-tag v-if="!novelObj.novelTypeDict" size="small" effect="plain" style="margin-right: 5px">其他</el-tag>
                    </div>
                    <div style="display: flex;justify-content: space-between">
                        <span><span style="font-size: 14px;margin-right:5px">作者：</span>{{novelObj.novelAuthor}}</span>
                        <span><span style="font-size: 14px;margin-right:5px">字数:</span>{{$myGlobal.method.getTotalNum(novelObj.novelWordNum,'字')}}</span>
                    </div>
                    <div>
                        <span><span style="font-size: 14px;margin-right:5px">发布时间：</span>{{novelObj.novelPublicDate}}</span>
                    </div>
                    <div style="margin-bottom: 0">
                        <el-row class="novel-info-right-tag">
                            <el-col :span="8"><span><span>热度:</span>{{novelObj.novelHot}}</span></el-col>
                            <el-col :span="8"><span><span>点击:</span>{{novelObj.novelClick}}</span></el-col>
                            <el-col :span="8"><span><span>点赞:</span>{{novelObj.novelUp}}</span></el-col>
                        </el-row>
                        <el-row class="novel-info-right-tag">
                            <el-col :span="8"><span><span>收藏:</span>{{novelObj.novelHot}}</span></el-col>
                            <el-col :span="8"><span><span>评论:</span>{{novelObj.novelComment}}</span></el-col>
                        </el-row>
                    </div>
                    <div style="font-size: 14px">
                        简介：
                        <div style="text-indent: 2em;">{{novelObj.novelIntroduce || '暂无简介'}}</div>
                    </div>
                </div>
            </div>
<!--            <hr style="border-bottom: #a6a6a6"/>-->
            <div class="novel-chapter-div">
                <div style="margin:10px 0;padding:10px 0;border-top: 1px solid #666;border-bottom:1px solid #666;display: flex;justify-content: flex-start">
                    <h1 style="margin:0 28px">目录信息</h1>
                </div>
                <div class="novel-chapter-list-div">
                    <div class="novel-one-chapter-div" v-for="(chapter,index) in novelObj.chapterList">
                        <a class="novel-one-chapter-a" @click="$myGlobal.method.jumpChapter(chapter.novelId,chapter.id)">{{chapter.chapterName}}</a>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="pageType===2">
            <h2 style="text-align: left;margin: 10px 0 10px 30px">编辑小说</h2>
            <hr style="margin: 0 0 10px 0;"/>
            <div class="novel-edit-div">
                <el-form ref="form" :model="form" label-width="80px" size="mini">
                    <el-form-item label="小说名称" prop="name" >
                        <el-input v-model="form.name" placeholder="请输入小说名称" maxlength="30"></el-input>
                    </el-form-item>
                    <el-form-item label="小说作者" prop="author">
                        <el-input v-model="form.author" placeholder="请输入作者"></el-input>
                    </el-form-item>
                    <el-form-item label="发布时间">
                        <el-date-picker
                                type="date"
                                size="mini"
                                placeholder="请选择发布日期"
                                v-model="form.publicDate"
                                style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="小说类型">
                        <el-select style="width: 100%" v-model="form.type" :multiple='true' placeholder="请选择">
                            <el-option
                                    v-for="item in novelTypeList"
                                    :key="item.dictKey"
                                    :label="item.dictValue"
                                    :value="item.dictKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="小说封面">
                        <el-upload
                                action=""
                                ref="uploadImgForm"
                                list-type="picture-card"
                                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                                :auto-upload="false"
                                :on-change="uploadImgChange"
                                :limit="1"
                                :file-list="fileList"
                                :class="uploadDisabled">
                            <template #default>
                                <el-image
                                        style="width: 148px; height: 148px"
                                        :src="'/img/'+novelObj.novelImg"
                                        :fit="'fit'"></el-image>
                            </template>
                            <template #file="{file}">
                                <div>
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                    <span class="el-upload-list__item-actions">
                                  <span
                                          class="el-upload-list__item-delete"
                                          @click="handleRemove(file)"
                                  >
                                    <i class="el-icon-delete"></i>
                                  </span>
                                </span>
                                </div>
                            </template>
                        </el-upload>
                        <span class="formSpan" style="float: unset">* 点击替换封面</span>
                    </el-form-item>
                    <el-form-item label="小说文件">
                        <el-input v-model="form.name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="小说简介">
                        <el-input type="textarea" v-model="form.introduce" :rows="5" placeholder="请输入小说简介"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立刻修改</el-button>
                        <el-button @click="returnList">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "UploadList",
        data(){
            return{
                pageNum: 1,
                pageSize: 8,
                list: [],
                total: 0,
                seachNovel:'',
                isNotContext:false,
                novelObj:{},
                pageType: 0,
                lastPageType: '',
                form:{
                    name:'',
                    author:'',
                    publicDate:'',
                    type:[],
                    introduce:'',
                },
                fileList:[],
                uploadDisabled:'',
            }
        },
        computed:mapState({
            novelTypeList: state =>state.novelTypeMap,
        }),
        methods:{
            handleRemove(file) {
                this.$refs.uploadImgForm.clearFiles();
                this.fileList=[]
                this.uploadDisabled=''
            },
            uploadImgChange(file){
                this.fileList.push(file)
                if(this.fileList.length >= 1){
                    this.uploadDisabled='disabled'
                }
            },
            onSubmit(){
                var formData=new FormData();
                formData.append('id',this.novelObj.id)
                //如果有新的封面就用
                if(this.fileList[0]){
                    formData.append('imgFile',this.fileList[0].raw)
                }
                formData.append('novelTitle',this.form.name)
                formData.append('novelIntroduce',this.form.introduce)
                formData.append('novelAuthor',this.form.author)
                if(this.form.publicDate){
                    formData.append('novelPublicDate',this.form.publicDate)
                }
                formData.append('novelTypes',this.form.type)
                this.$apiMethods.fileApi.updateNovel(formData).then(res=>{
                    if(res.code===200){
                        // loading.close()
                        this.$alert( '修改成功', {
                            confirmButtonText: '确定',
                            callback: action => {
                                let newObj=this.novelObj
                                this.novelObj={}
                                this.jumpPageType(1,newObj)
                            }
                        });
                    }
                })
            },
            jumpPageType(val,obj){
                this.lastPageType=this.pageType
                this.pageType=val
                if(Object.keys(this.novelObj).length===0){
                    let params={
                        id:obj.id,
                        isClick:false
                    }
                    this.$apiMethods.novelApi.getNovelInfo(params).then(res=>{
                        if(res.code===200){
                            this.novelObj=res.data
                            if(this.pageType===2){
                                this.form.name=this.novelObj.novelTitle
                                this.form.author=this.novelObj.novelAuthor
                                this.form.introduce=this.novelObj.novelIntroduce
                                this.form.publicDate=this.novelObj.novelPublicDate
                                if(this.novelObj.novelTypeDict) {
                                    for (let typeDict of this.novelObj.novelTypeDict) {
                                        this.form.type.push(typeDict.dictKey)
                                    }
                                }
                            }
                        }
                    })
                }else if(this.pageType===2){
                    this.form.name=this.novelObj.novelTitle
                    this.form.author=this.novelObj.novelAuthor
                    this.form.introduce=this.novelObj.novelIntroduce
                    this.form.publicDate=this.novelObj.novelPublicDate
                    if(this.novelObj.novelTypeDict){
                        for(let typeDict of this.novelObj.novelTypeDict){
                            this.form.type.push(typeDict.dictKey)
                        }
                    }
                }
            },
            clickUploadBtn(){
                this.$router.push('/novel/person/upload');
            },
            getUploadList(){
                this.list=[]
                let param = {
                    pageNum : this.pageNum,
                    pageSize : this.pageSize,
                    pageType: 1,
                    novelTitle: this.seachNovel
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code === 200){
                        this.list=res.data.records
                        this.total=res.data.total
                        if(this.list.length===0){
                            this.isNotContext=true
                        }
                    }
                })
            },
            handleCurrentChange(val){
                this.pageNum =val
                this.getUploadList()
            },
            addOrDeleteCollection(id,type){
                let params={
                    novelId:id
                }
                //加入收藏
                if(type===1){
                    this.$apiMethods.novelApi.addCollection(params).then(res=>{
                        if(res.code===200){
                            this.$utils.success2('加入成功')
                            this.getUploadList()
                        }
                    })
                }
                //取消收藏
                if(type===0){
                    this.$confirm('确认要取消收藏?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$apiMethods.novelApi.cancelCollection(params).then(res=>{
                            if(res.code===200){
                                this.$utils.success2('取消成功')
                                this.getUploadList()
                            }
                        })
                    })
                }
            },
            deleteNovel(id){
                this.$confirm('确认要删除已上传的小说?该操作不可回退，请确认', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={
                        id:id.toLocaleString()
                    }
                    this.$apiMethods.novelApi.deleteNovel(params).then(res=>{
                        if(res.code===200){
                            this.$utils.success2('删除成功')
                            this.pageType=0
                            this.lastPageType=0
                            this.getUploadList()
                        }
                    })
                })
            },
            returnList(){
                this.pageType=this.lastPageType
                this.novelObj={}
                this.getUploadList()
            },
            keyupSubmit(){
                document.onkeydown=e=>{
                    let _key=window.event.keyCode;
                    if(_key===13){
                        this.getUploadList()
                    }
                }
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
            publicNovel(id){
                this.$utils.confirmWarning("是否要发布至平台？(需要等待管理员审核)").then(res=>{
                    let param={
                        id:id
                    }
                    this.$apiMethods.novelApi.publicNovel(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("发布成功！")
                            this.getUploadList()
                        }
                    })
                }).catch(res=>{})
            },
            cancelPublic(id){
                this.$utils.confirmWarning("是否取消发布？").then(res=>{
                    let param={
                        id:id
                    }
                    this.$apiMethods.novelApi.cancelPublic(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("取消成功！")
                            this.getUploadList()
                        }
                    })
                }).catch(res=>{})
            },
            downloadNovel(id){
                let obj={
                    list:[{
                        id:id,
                        type:1
                    }]
                }
                const params={
                    params:encodeURIComponent(JSON.stringify(obj),"utf-8")
                }
                this.$dowloadAxios.downloadFile('/novel/download',params)
            }
        },
        created() {
            this.getUploadList()
            this.keyupSubmit()
        },
        watch:{

        },
        destroyed() {
            document.onkeydown = ''
        }
    }
</script>

<style scoped lang="less">
    .novelCatalogDiv{
        margin-top: 10px;
    }

    .novelCatalogOperation{
        display: flex;
        justify-content: space-between
        /*height: 70px;*/
    }

    .rightOperationBtn{
        padding-right: 5%;
    }

    .novelCatalogView{
        border: 1px solid #e4e7ed;
        min-height: 300px;
        margin: 20px 5%;
        background-color: #FCFCFA;
        display: flex;
        /*justify-content: space-between;*/
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
        width: 300px;
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

    .waitDiv {
        &:hover {
            .cancelBtn {
                display: inline-block;
            }

            .waitBtn {
                display: none;
            }
        }

        .cancelBtn {
            display: none;
            margin: 0;
        }
    }

    .novel-info-btn-div{
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        margin-bottom: 10px;
    }

    .novel-info-div{
        padding: 15px 30px;
        display: flex;
    }

    .novel-info-left-div{

    }

    .novel-info-right-div{
        /*flex: 1;*/
        text-align: left;
        margin-left: 20px;
        .novel-info-right-tag{
            margin-bottom: 0;
            span{
                font-size: 14px;
                width: 30px;
                span{
                    margin-right:5px;
                    color:rgba(0,0,0,0.5)
                }

            }
        }
    }

    .novel-info-right-div-h1{
        margin: 0 0 8px 0;
        cursor: pointer;
        &:hover{
            color: #bf2c24;
        }
    }

    .novel-info-right-div div{
        margin-bottom: 8px
    }

    .novel-chapter-div{

    }

    .novel-chapter-list-div{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .novel-one-chapter-div{
        width: 33.3%;
        font-size: 12px;
        padding: 5px 0;
        text-align: left;
        border-bottom: 1px dashed #a6a6a6;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        .novel-one-chapter-a{
            margin-left: 20px;
            margin-right: 20px;
            cursor: pointer
        }
        &:hover{
            color:red;
        }
    }

    .novel-edit-div{
        padding: 0 150px;
    }

</style>