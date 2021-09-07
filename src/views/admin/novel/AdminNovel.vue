<template>
    <div style="margin-bottom: 30px">
        <div v-if="view==='list'">
            <h2>小说管理界面</h2>
            <el-divider></el-divider>
            <div class="table-search-div">
                <el-form ref="searchFrom" :model="searchParam" label-width="80px" size="small">
                    <el-row>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="novelTitle" label="小说名：">
                                    <el-input placeholder="请输入小说名" clearable v-model="searchParam.novelTitle"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="novelAuthor" label="作者：">
                                    <el-input placeholder="请输入作者名" clearable v-model="searchParam.novelAuthor"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="novelType" label="小说类型">
                                    <el-select style="width: 100%" size="small" :multiple='true' clearable v-model="searchParam.novelType" placeholder="请选择小说类型">
                                        <el-option
                                                v-for="item in novelTypeList"
                                                :key="item.dictKey"
                                                :label="item.dictValue"
                                                :value="item.dictKey">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="novelUploadType" label="是否发布">
                                    <el-select style="width: 100%" size="small" clearable v-model="searchParam.novelUploadType" placeholder="请选择">
                                        <el-option size="small" key="0" label="是" value="0"></el-option>
                                        <el-option size="small" key="1" label="否" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="createBy" label="上传用户：">
                                    <el-input placeholder="请输入用户名" clearable v-model="searchParam.createBy"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="createTime" label="上传时间：">
                                    <el-date-picker
                                            clearable
                                            style="width: 100%"
                                            size="small"
                                            v-model="searchParam.createTime"
                                            type="daterange"
                                            value-format="yyyy-MM-dd"
                                            range-separator="-"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="label-search-btn">
                    <el-button type="primary" size="small" @click="getNovelList">搜索</el-button>
                    <el-button size="small" @click="resetForm">重置</el-button>
                </div>
            </div>
            <div class="tableBtnDiv">
                <el-button class="tableBtnUpload" icon="el-icon-upload2" size="small" type="primary" @click="clickUploadBtn">上传小说</el-button>
                <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteNovel(1)">删除选中</el-button>
            </div>
            <div class="tableDiv">
                <el-table
                        :data="tableData"
                        style="width: 96%;"
                        min-height="200px"
                        max-height="400px"
                        border
                        size="small"
                        tooltip-effect="light"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            fixed
                            type="selection"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="novelTitle"
                            label="小说名"
                            :show-overflow-tooltip='true'
                            width="150">
                        <template slot-scope="scope">
                            <div style="width: 100%">
                                <el-link style="font-size: 12px;" href="javaScript:void(0);" @click.native="jumpNovel(scope.row.id,scope.row.novelTitle)">{{scope.row.novelTitle}}</el-link>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelAuthor"
                            label="作者"
                            width="120">
                        <template slot-scope="scope">
                            {{scope.row.novelAuthor?scope.row.novelAuthor:'未知'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelImg"
                            label="封面"
                            width="120">
                        <template slot-scope="scope">
                            <el-image
                                    v-if="scope.row.novelImg"
                                    style="width: 50px; height: 50px"
                                    :src="'/img/'+scope.row.novelImg"
                                    :preview-src-list="getImg(scope.row.novelImg)"
                                    :fit="'fit'"></el-image>
                            <span v-if="!scope.row.novelImg">暂无图片</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelIntroduce"
                            label="简介"
                            :show-overflow-tooltip='true'
                            width="200">
                        <template slot-scope="scope">
                            {{scope.row.novelIntroduce?scope.row.novelIntroduce:'暂无简介'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelPublicDate"
                            label="发布时间"
                            :show-overflow-tooltip='true'
                            width="100">
                        <template slot-scope="scope">
                            {{scope.row.novelPublicDate?scope.row.novelPublicDate:'未知'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelType"
                            label="小说类型"
                            width="120">
                        <template slot-scope="scope">
                            {{scope.row.novelType?scope.row.novelType:'其他'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelWordNum"
                            label="总字数"
                            width="80">
                        <template slot-scope="scope">
                            {{getTotalNum(scope.row.novelWordNum)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="novelUploadType"
                            label="是否已发布"
                            width="100">
                        <template slot-scope="scope">
                            {{scope.row.novelUploadType===1?'否':'是'}}
                            <el-button v-if="scope.row.novelUploadType===1" type="primary" size="mini" round @click="novelPublic(scope.row)">发布</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="uploadUsername"
                            :show-overflow-tooltip='true'
                            label="上传用户"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="上传时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="novelHot"
                            label="热度"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="novelClick"
                            label="点击数"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="novelCollection"
                            label="收藏数"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="novelShare"
                            label="分享数"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="novelUp"
                            label="点赞数"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="160">
                        <template slot-scope="scope">
                            <el-button @click="lookNovelInfo(scope.row,scope.$index)" type="text" size="small">查看</el-button>
                            <el-button @click="download(scope.row)" type="text" size="small">下载</el-button>
                            <el-button @click="editNovel(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="deleteNovel(2,scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="tablePageDiv">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageNum"
                            :page-sizes="[10, 20, 50, 80]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-if="view==='info'">
            <h2>小说详情界面</h2>
            <el-divider></el-divider>
            <div class="tableBtnDiv">
                <el-button class="tableBtnUpload" icon="el-icon-back" size="small" type="primary" @click="rebackList">回到列表</el-button>
                <el-button class="tableBtnUpload" icon="el-icon-arrow-up" size="small" type="primary" @click="jumpNovel(novel.id,novel.novelTitle)">打开观看页面</el-button>
                <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteNovel(2,novel)">删除小说</el-button>
                <el-button class="tableBtnDelChose" icon="el-icon-edit-outline" size="small" type="warning" @click="editNovel(novel)">编辑小说</el-button>
            </div>
            <div class="adminNovelInfoDiv">
                <div>
                    <div>
                        <el-image
                                style="width: 200px; height: 280px"
                                :src="'/img/'+novel.novelImg"
                                :preview-src-list="getImg(novel.novelImg)"
                                :fit="'fit'"></el-image>
                    </div>
                    <div style="font-size: 12px;color: gray">
                        <div style="display: flex;justify-content:space-around;">
                            <span>热度:{{novel.novelHot}}</span>
                            <span>点击数:{{novel.novelClick}}</span>
                            <span>点赞数:{{novel.novelUp}}</span>
                        </div>
                        <div style="display: flex;justify-content:space-around;">
                            <span>收藏数:{{novel.novelHot}}</span>
                            <span>评论数:{{novel.novelComment}}</span>
                        </div>
                    </div>
                </div>
                <div style="margin-left: 20px;text-align: left;line-height: 30px">
                    <div><span style="color: gray">标题：</span><span>{{novel.novelTitle}}</span></div>
                    <div><span style="color: gray">作者：</span><span>{{novel.novelAuthor}}</span></div>
                    <div><span style="color: gray">总字数：</span><span style="font-size: 12px">{{getTotalNum(novel.novelWordNum)}}</span></div>
                    <div><span style="color: gray">类型：</span><span>{{novel.novelType?novel.novelType:'其他'}}</span></div>
                    <div><span style="color: gray">发布日期：</span><span style="font-size: 12px">{{novel.novelPublicDate}}</span></div>
                    <div><span style="color: gray">上传日期：</span><span style="font-size: 12px">{{novel.createTime}}</span></div>
                    <div>
                        <span style="color: gray">简介：</span>
                        <span style="font-size: 12px;
                                line-height: 20px;
                                word-break: break-all;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-line-clamp: 5;
                                -webkit-box-orient: vertical;">
                            {{novel.novelIntroduce}}</span>
                    </div>
                </div>
            </div>
            <el-divider></el-divider>
<!--            <div class="uploadUserInfoDiv">-->
<!--                <h4>其他信息以及操作</h4>-->
<!--                <div style="text-align: left;line-height: 40px">-->
<!--                    <div>-->
<!--                        <span style="color: gray;">上传用户：</span>{{novel.uploadUsername}}-->
<!--                        <el-button size="mini" type="danger" @click="disableUser(novel.uploadUserId)">禁用用户</el-button>-->
<!--                    </div>-->
<!--                    <div><span style="color: gray">是否发布到系统：</span>{{novel.novelUploadType===0?'是':'否'}}</div>-->
<!--                </div>-->
<!--            </div>-->
        </div>
        <div v-if="view==='edit'">
            <h2>小说编辑界面</h2>
            <el-divider></el-divider>
            <div class="tableBtnDiv">
                <el-button class="tableBtnUpload" icon="el-icon-back" size="small" type="primary" @click="rebackList">回到列表</el-button>
                <el-button class="tableBtnUpload" icon="el-icon-back" size="small" type="primary" @click="lookNovelInfo(novel,0)">回到详情</el-button>
                <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteNovel(2,novel)">删除小说</el-button>
            </div>
            <div class="editFormDiv">
                <el-form ref="novelForm" :model="form" label-width="80px" size="mini">
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
                                :picker-options="pickerOptions"
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
                                :limit="limit"
                                :file-list="fileList"
                                :class="uploadDisabled">
                            <template #default>
                                <el-image
                                        style="width: 148px; height: 148px"
                                        :src="'/img/'+novel.novelImg"
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
                        <el-button @click="lookNovelInfo(novel,0)">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminNovel",
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
            getImg(){
                return (img)=>{
                    let imgs=new Array
                    imgs.push('/img/'+img)
                    return imgs
                }
            },
        },
        data(){
            return{
                tableData:[],
                pageNum:1,
                pageSize:10,
                total:0,
                multipleSelection: [],
                view:'list',
                asc: false,
                novel:{},
                searchParam:{
                    novelTitle:'',
                    novelAuthor:'',
                    novelType:[],
                    novelUploadType:null,
                    status:'',
                    createBy:'',
                    createTime:''
                },
                form:{
                    name:'',
                    author:'',
                    publicDate:'',
                    type:[],
                    introduce:'',
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now()
                    }
                },
                fileList:[],
                novelList:[],
                novelTypeList:this.$store.getters.getNovelType,
                limit:1,
                uploadDisabled:'',
            }
        },
        methods:{
            disableUser(userId){

            },
            resetForm(){
                this.$refs.searchFrom.resetFields();
                this.asc=false
                this.pageNum=1
                this.getNovelList()
            },
            getNovelList(){
                let param={
                    ...this.searchParam,
                    asc:this.asc,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    pageType: 2 //管理员页面
                }
                if(this.searchParam.novelType){
                    param.novelTypes=this.searchParam.novelType.toLocaleString()
                    delete param.novelType
                }
                if(this.searchParam.createTime){
                    param.startTime=this.searchParam.createTime[0]
                    param.endTime=this.searchParam.createTime[1]
                }
                delete param.createTime
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code===200){
                        this.total=res.data.total
                        this.pageNum=res.data.current
                        this.tableData=res.data.records
                    }
                })
            },
            handleCurrentChange(val){
                this.pageNum=val
                this.getNovelList()
            },
            handleSizeChange(val){
                this.pageSize=val
                this.getNovelList()
            },
            lookNovelInfo( row,index){
                this.novel=row
                this.view='info'
            },
            editNovel(novel){
                this.novel=novel
                this.view='edit'
                //这里所有的表单参数都要设置
                this.form.name=novel.novelTitle
                this.form.author=novel.novelAuthor
                this.form.introduce=novel.novelIntroduce
                this.form.publicDate=novel.novelPublicDate
                this.form.type=[]
                for(let typeDict of novel.novelTypes){
                    this.form.type.push(typeDict.dictKey)
                }
            },
            download(novel){
                let obj={
                    list:[{
                        id:novel.id,
                        type:1
                    }]
                }
                const params={
                    params:encodeURIComponent(JSON.stringify(obj),"utf-8")
                }
                this.$dowloadAxios.downloadFile('/novel/download',params)
            },
            rebackList(){
                this.view='list'
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteNovel(type,row){
                let ids=new Array();
                let message;
                if(type===1){
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    message="是否确认要删除选中小说？"
                    for(let item of this.multipleSelection) {
                        ids.push(item.id)
                    }
                }else if(type===2){
                    //单个删除
                    message="是否要删除"+row.novelTitle+"小说？(删除无法恢复)"
                    ids.push(row.id)
                }else {
                    return
                }
                this.$utils.confirmWarning(message).then(() => {
                    let param={
                        ids: ids.toLocaleString()
                    }
                    this.$apiMethods.novelApi.deleteNovel(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            this.getNovelList();
                        }
                    })
                }).catch((err)=>{})
            },
            jumpNovel(id,name){
                let routeUrl = this.$router.resolve({
                    path:'/novel/novelInfo',
                    query:{
                        novelId:id,
                        novelName:name
                    }
                });
                window.open(routeUrl.href, '_blank');
            },
            clickUploadBtn(){
                this.$router.push('/novel/admin/upload');
            },
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
            uploadNovelChange(file){
                this.novelList.push(file)
            },
            handleExceed(files, fileList) {
                this.$utils.warning2("只允许上传一个文件")
            },
            novelFileUpload(file){
            },
            onSubmit(){
                var formData=new FormData();
                // const loading = this.$loading({
                //     lock: true,
                //     text: '小说上传中，请等待，这可能需要一段时间',
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(0, 0, 0, 0.7)'
                // });
                formData.append('id',this.novel.id)
                // //如果有文件就发到后端去
                // if(this.novelList[0]){
                //     this.novelList.map(element => {
                //         formData.append("novelFiles", element.raw);
                //     });
                // }
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
                                this.view='list'
                                this.getNovelList();
                            }
                        });
                    }
                })
            },
            novelPublic(obj){
                let param={
                    id:obj.id
                }
                this.$utils.confirmWarning("是否发布小说？").then(res => {
                    this.$apiMethods.novelApi.publicNovel(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("发布成功！")
                            this.getNovelList()
                        }
                    })
                }).catch((err) => {})
            }
        },
        created() {
            this.getNovelList()
        }
    }
</script>

<style lang="css">
    .el-tooltip__popper{
        font-size: 12px;
        max-width:400px ;
    }

    .el-table th.gutter{
        display: table-cell!important;
    }
</style>

<style scoped lang="css">
    .tableBtnDiv{
        height: 40px;
        line-height: 40px;
        padding: 0 2%;
        margin-bottom: 10px;
    }

    .tableBtnDelChose{
        float: right;
    }

    .tableBtnUpload{
        float: left;
    }
    .tableDiv{
        width: 100%;
        padding: 0 2%;
    }

    .tablePageDiv{
        margin-top: 5px;
    }

    .adminNovelInfoDiv{
        width: 96%;
        padding: 0 2%;
        display: flex;
    }

    .uploadUserInfoDiv{
        width: 80%;
        padding: 0 10%;
    }

    .editFormDiv{
        width: 50%;
        padding: 5px 30% 0 20%;
    }

    .formSpan{
        color: gray;
        font-size: 10px;
        float: left;
        margin-bottom: -18px;
    }

</style>
<style>
    .disabled .el-upload--picture-card {
        display: none;
    }
</style>