<template>
    <div>
        <h2>书签和历史记录管理页面</h2>
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
                            <el-form-item prop="username" label="用户名：">
                                <el-input placeholder="请输入用户名" clearable v-model="searchParam.username"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="label-search-input">
                            <el-form-item prop="ip" label="ip地址：">
                                <el-input placeholder="请输入用户名" clearable v-model="searchParam.ip"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <div class="label-search-input">
                            <el-form-item prop="createTime" label="记录时间：">
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
                    <el-col v-if="activeName==='mark'" :span="8">
                        <div class="label-search-input">
                            <el-form-item prop="bookMarkName" label="书签名：">
                                <el-input placeholder="请输入书签名" clearable v-model="searchParam.bookMarkName"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div class="label-search-btn">
                <el-button type="primary" size="small" @click="searchBtn">搜索</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="tabsDiv">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="书签管理" name="mark">
                    <div class="tableBtnDiv">
                        <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteMark(1)">删除选中</el-button>
                        <el-button style="margin-right: 5px" class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteAll(1)">清空全部</el-button>
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
                                    prop="bookMarkName"
                                    label="书签名"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="novel.novelTitle"
                                    label="小说名"
                                    :show-overflow-tooltip='true'
                                    width="150">
                                <template slot-scope="scope">
                                    <div style="width: 100%">
                                        <el-link style="font-size: 12px;" href="javaScript:void(0);" @click.native="jumpNovel(scope.row.novel.id,scope.row.novel.novelTitle)">{{scope.row.novel.novelTitle}}</el-link>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="novel.novelAuthor"
                                    label="作者"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="novelChapter.chapterName"
                                    label="章节名"
                                    :show-overflow-tooltip='true'
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="percentage"
                                    label="观看进度"
                                    :show-overflow-tooltip='true'
                                    width="100">
                                <template slot-scope="scope">
                                    {{scope.row.percentage*100+'%'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="createTime"
                                    label="创建时间"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="username"
                                    label="观看用户"
                                    width="100">
                            </el-table-column>
                            <el-table-column
                                    prop="ip"
                                    label="观看ip"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    prop="opr"
                                    label="操作"
                                    width="150">
                                <template slot-scope="scope">
                                    <el-button @click="jumpChapter(scope.row.novel.id,scope.row.novelChapter.id,scope.row.readPosition)" type="text" size="small">按进度查看</el-button>
                                    <el-button @click="editMark(scope.row.id,scope.row.bookMarkName)" style="margin-left: 5px" type="text" size="small">编辑</el-button>
                                    <el-button style="margin-left: 5px" @click="deleteMark(2,scope.row)" type="text" size="small">删除</el-button>
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
                </el-tab-pane>
                <el-tab-pane label="历史记录" name="history">
                    <div class="tableBtnDiv">
                        <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteHistory(1)">删除选中</el-button>
                        <el-button style="margin-right: 5px" class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteAll(0)">清空全部</el-button>
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
                                    prop="novel.novelTitle"
                                    label="小说名"
                                    :show-overflow-tooltip='true'
                                    width="150">
                            </el-table-column>
                            <el-table-column
                                    prop="novel.novelAuthor"
                                    label="作者"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="novelChapter.chapterName"
                                    label="章节名"
                                    :show-overflow-tooltip='true'
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="percentage"
                                    label="观看进度"
                                    :show-overflow-tooltip='true'
                                    width="100">
                                <template slot-scope="scope">
                                    {{scope.row.percentage*100+'%'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="updateTime"
                                    label="观看时间"
                                    width="120">
                            </el-table-column>
                            <el-table-column
                                    prop="username"
                                    label="观看用户"
                                    width="100">
                            </el-table-column>
                            <el-table-column
                                    prop="ip"
                                    label="观看ip"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    prop="userType"
                                    label="用户类型"
                                    width="80">
                                <template slot-scope="scope">
                                    {{scope.row.userType===0?'登录用户':'游客'}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    fixed="right"
                                    prop="opr"
                                    label="操作"
                                    width="120">
                                <template slot-scope="scope">
                                    <el-button @click="jumpChapter(scope.row.novel.id,scope.row.novelChapter.id,scope.row.readPosition)" type="text" size="small">按进度查看</el-button>
                                    <el-button style="margin-left: 5px" @click="deleteHistory(2,scope.row)" type="text" size="small">删除</el-button>
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
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminHistory",
        data(){
            return{
                activeName:'mark',
                recodeActive:'mark',
                tableData:[],
                pageNum:1,
                pageSize:10,
                total:0,
                asc:false,
                multipleSelection: [],
                searchParam:{
                    novelTitle: '',
                    username: '',
                    ip: '',
                    createTime: '',
                    bookMarkName: '',
                }
            }
        },
        methods:{
            getList(val){
                let param={
                    ...this.searchParam,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                }
                if(this.searchParam.createTime){
                    param.startTime=this.searchParam.createTime[0]
                    param.endTime=this.searchParam.createTime[1]
                }
                delete param.createTime
                if(val===1){
                    param.type=0
                }else if(val===2){
                    param.type=1
                }
                this.$apiMethods.novelApi.getHistoryList(param).then(res=>{
                    if(res.code===200){
                        this.pageNum=res.data.current
                        this.total=res.data.total
                        this.tableData=res.data.records
                    }
                    this.$utils.closeLoading()
                })
            },
            resetForm(){
                this.$refs.searchFrom.resetFields();
                this.asc=false
                this.pageNum=1
                this.searchBtn()
            },
            searchBtn(){
                if(this.activeName==='mark'){
                    this.recodeActive='mark'
                    this.getList(2)
                }else if(this.activeName==='history'){
                    this.recodeActive='history'
                    this.getList(1)
                }
            },
            handleClick(tab, event) {
                this.$utils.openLoading()
                this.removeDate()
                if(tab.name==='mark'){
                    this.recodeActive='mark'
                    this.getList(2)
                }else if(tab.name==='history'){
                    this.recodeActive='history'
                    this.getList(1)
                }
            },
            removeDate(){
                this.pageNum=1,
                this.pageSize=10,
                this.total=0,
                this.multipleSelection=[]
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val){
                this.pageNum=val
                if(this.recodeActive==='mark'){
                    this.getList(2)
                }else if(this.recodeActive==='history'){
                    this.getList(1)
                }
            },
            handleSizeChange(val){
                this.pageSize=val
                if(this.recodeActive==='mark'){
                    this.getList(2)
                }else if(this.recodeActive==='history'){
                    this.getList(1)
                }
            },
            deleteMark(type,row){
                let ids=new Array();
                let message;
                if(type===1){
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择一栏")
                        return;
                    }
                    message="是否确认要删除选中一栏？"
                    for(let item of this.multipleSelection) {
                        ids.push(item.id)
                    }
                }else if(type===2){
                    //单个删除
                    message="是否要删除这一栏"
                    ids.push(row.id)
                }else {
                    return
                }
                this.$utils.confirmWarning(message).then(() => {
                    let param={
                        ids:ids.toLocaleString(),
                        deleteType:0 //0代表走的是勾选删除
                    }
                    this.$apiMethods.novelApi.deleteHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            this.getList(2);
                        }
                    })
                }).catch((err)=>{})
            },
            deleteHistory(type,row){
                let ids=new Array();
                let message;
                if(type===1){
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择一栏")
                        return;
                    }
                    message="是否确认要删除选中一栏？"
                    for(let item of this.multipleSelection) {
                        ids.push(item.id)
                    }
                }else if(type===2){
                    //单个删除
                    message="是否要删除这一栏"
                    ids.push(row.id)
                }else {
                    return
                }
                this.$utils.confirmWarning(message).then(() => {
                    let param={
                        ids:ids.toLocaleString(),
                        deleteType:0 //0代表走的是勾选删除
                    }
                    this.$apiMethods.novelApi.deleteHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            this.getList(1);
                        }
                    })
                }).catch((err)=>{})
            },
            deleteAll(type){
                this.$utils.confirmWarning("是否要清空全部？").then(() => {
                    let param={
                        type:type,
                        deleteType:3 //0代表走的是勾选删除
                    }
                    this.$apiMethods.novelApi.deleteHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            if(this.recodeActive==='mark'){
                                this.getList(2);
                            }else if(this.recodeActive==='history'){
                                this.getList(1);
                            }
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
            jumpChapter(novelId,chapterId,readPosition){
                let routeUrl = this.$router.resolve({
                    path:'/novel/novelRead',
                    query:{
                        chapterId:chapterId,
                        novelId:novelId,
                        positionY:readPosition
                    }
                });
                window.open(routeUrl.href, '_blank');
            },
            editMark(id,title){
                this.$prompt('请输入修改后的书签名', '修改书签名', {
                    confirmButtonText: '修改',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    inputValue:title
                }).then(({ value }) => {
                    let param={
                        id:id,
                        type:1,
                        markName:value
                    }
                    this.$apiMethods.novelApi.saveHistory(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("修改成功");
                            this.getList(2)
                        }
                    })
                })
            }

        },
        created() {
            this.getList(2)
        }
    }
</script>

<style scoped>
    .tableBtnDiv{
        height: 40px;
        line-height: 40px;
        padding: 0 2%;
        margin-bottom: 10px;
    }

    .tableBtnDelChose{
        float: right;
    }

    .tableDiv{
        width: 100%;
        padding: 0 2%;
    }

    .tablePageDiv{
        margin-top: 5px;
    }

    .tabsDiv{
        padding: 0 2%;
    }
</style>