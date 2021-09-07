<template>
    <div>
        <h2>用户收藏管理界面</h2>
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
                            <el-form-item prop="createTime" label="收藏时间：">
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
                <el-row>
                    <el-col :span="8">
                        <div class="label-search-input">
                            <el-form-item prop="collectChannel" label="是否个人：">
                                <el-select style="width: 100%" size="small" clearable v-model="searchParam.collectChannel" placeholder="请选择类型">
                                    <el-option size="small" key="0" label="个人" value="0"></el-option>
                                    <el-option size="small" key="1" label="非个人" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div class="label-search-btn">
                <el-button type="primary" size="small" @click="getCollectionList">搜索</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="tableBtnDiv">
            <el-button size="small" class="tableBtnDelChose" icon="el-icon-delete" type="danger" @click="deleteCollection(1)">删除选中</el-button>
        </div>
        <div class="tableDiv">
            <el-table
                    :data="tableData"
                    style="width: 100%;"
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
                        :show-overflow-tooltip='true'>
                    <template slot-scope="scope">
                        <span v-if="scope.row.novel">
                            <el-link style="font-size: 12px;" href="javaScript:void(0);" @click.native="jumpNovel(scope.row.novel.id,scope.row.novel.novelTitle)">{{scope.row.novel.novelTitle}}</el-link>
                        </span>
                        <span v-if="!scope.row.novel" style="color: red">该小说已被原作者删除</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="收藏用户"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="catalogName"
                        label="目录"
                        :show-overflow-tooltip='true'
                        width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.catalogName">{{scope.row.catalogName}}</span>
                        <span v-else style="color: gray;font-weight: bold">无目录</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="collectChannel"
                        label="是否是自己小说"
                        :show-overflow-tooltip='true'
                        width="120">
                    <template slot-scope="scope">
                        {{scope.row.collectChannel===0?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="收藏时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        prop="opr"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-button @click="deleteCollection(2,scope.row)" type="text" size="small">删除</el-button>
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
</template>

<script>
    export default {
        name: "AdminCollection",
        data(){
            return{
                tableData:[],
                pageNum:1,
                pageSize:10,
                total:0,
                asc:false,
                multipleSelection: [],
                searchParam:{
                    novelTitle: '',
                    username: '',
                    createTime: '',
                    collectChannel: '',
                }
            }
        },
        methods:{
            resetForm(){
                this.$refs.searchFrom.resetFields();
                this.asc=false
                this.pageNum=1
                this.getCollectionList()
            },
            getCollectionList(){
                let param = {
                    ...this.searchParam,
                    asc:this.asc,
                    pageNum : this.pageNum,
                    pageSize : this.pageSize,
                }
                if(this.searchParam.createTime){
                    param.startTime=this.searchParam.createTime[0]
                    param.endTime=this.searchParam.createTime[1]
                }
                delete param.createTime
                this.$apiMethods.novelApi.getAllList(param).then(res=>{
                    if(res.code===200){
                        this.pageNum=res.data.current
                        this.total=res.data.total
                        this.tableData=res.data.records
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val){
                this.pageNum=val
                this.getCollectionList()
            },
            handleSizeChange(val){
                this.pageSize=val
                this.getCollectionList()
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
            deleteCollection(type,row){
                let ids=new Array();
                let message;
                if(type===1){
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择收藏")
                        return;
                    }
                    message="是否确认要删除选中收藏？"
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
                    }
                    this.$apiMethods.novelApi.cancelCollection(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            this.getCollectionList();
                        }
                    })
                }).catch((err)=>{})
            }
        },
        created() {
            this.getCollectionList()
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

    .tableBtnUpload{
        float: left;
    }
    .tableDiv{
        padding: 0 2%;
        margin-bottom: 20px;
    }

    .tablePageDiv{
        margin-top: 5px;
    }
</style>