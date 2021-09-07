<template>
    <div>
        <h2>用户动态管理界面</h2>
        <el-divider></el-divider>
        <div>
            <div class="table-search-div">
                <el-form ref="searchFrom" :model="searchParam" label-width="80px" size="small">
                    <el-row>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="dynamicTitle" label="标题：">
                                    <el-input placeholder="请输入标题" clearable v-model="searchParam.dynamicTitle"></el-input>
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
                                <el-form-item prop="accountName" label="用户账号：">
                                    <el-input placeholder="请输入用户账号" clearable v-model="searchParam.accountName"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="isRead" label="是否阅读：">
                                    <el-select style="width: 100%" size="small" clearable v-model="searchParam.isRead" placeholder="请选择">
                                        <el-option size="small" key="1" label="是" value="1"></el-option>
                                        <el-option size="small" key="0" label="否" value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="createTime" label="创建时间：">
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
                    <el-button type="primary" size="small" @click="getDynamicList">搜索</el-button>
                    <el-button size="small" @click="resetForm">重置</el-button>
                </div>
            </div>
            <div class="admin-table-btn-div">
                <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteDynamic()">删除选中</el-button>
            </div>
            <div class="admin-table-div">
                <el-table
                        :data="dynamicTableData"
                        style="width: 96%;"
                        @sort-change="userOrderBy"
                        min-height="200"
                        max-heigth="400"
                        size="small"
                        @selection-change="dynamicTableSelection">
                    <el-table-column
                            fixed
                            type="selection"
                            width="45">
                    </el-table-column>
                    <el-table-column
                            fixed
                            width="30"
                            type="expand">
                        <template slot-scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="动态标题">
                                    <span>{{ props.row.dynamicTitle }}</span>
                                </el-form-item>
                                <el-form-item label="动态内容">
                                    <span>{{ props.row.dynamicContent }}</span>
                                </el-form-item>
                                <el-form-item label="是否已读">
                                    <span>{{ props.row.isRead===1?'是':'否' }}</span>
                                </el-form-item>
                                <el-form-item label="动态类型">
                                    <span>{{ getDynamicType(props.row.dynamicType)}}</span>
                                </el-form-item>
                                <el-form-item label="用户名">
                                    <span>{{ props.row.username }}</span>
                                </el-form-item>
                                <el-form-item label="创建时间">
                                    <span>{{ props.row.createTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="dynamicTitle"
                            label="标题"
                            :show-overflow-tooltip='true'
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="dynamicContent"
                            label="内容"
                            :show-overflow-tooltip='true'
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="isRead"
                            label="是否阅读"
                            width="80">
                        <template slot-scope="scope">
                            {{scope.row.isRead===1?'是':'否'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="用户名"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="accountName"
                            label="用户账号"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="dynamicType"
                            label="动态类型"
                            width="80">
                        <template slot-scope="scope">
                            {{getDynamicType(scope.row.dynamicType)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createUsername"
                            label="创建人"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            :sortable="'custom'"
                            prop="createTime"
                            label="创建时间"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="50">
                        <template slot-scope="scope">
<!--                            <el-button @click="lookNovelInfo(scope.row,scope.$index)" type="text" size="small">编辑</el-button>-->
                            <el-button @click="deleteDynamic(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="admin-dynamic-table-page">
                    <el-pagination
                        @size-change="dynamicHandleSizeChange"
                        @current-change="dynamicHandleCurrentChange"
                        :current-page="pageNum"
                        :page-sizes="[10, 20, 50, 80]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminDynamic",
        data(){
            return{
                pageNum:1,
                pageSize:10,
                total:0,
                dynamicTableData:[],
                multipleSelection:[],
                searchParam:{
                    dynamicTitle: '',
                    username: '',
                    accountName: '',
                    isRead: '',
                    createTime: ''
                },
                asc:false,
            }
        },
        mounted(){
            this.getDynamicList()
        },
        computed:{
            getDynamicType(){
                return (type) => {
                    //动态类型：0：小说审核；1：用户审核
                    switch (type) {
                        case 0:
                            return '小说审核'
                        case 1:
                            return '用户审核'
                        default:
                            return '未知'
                    }
                }
            }
        },
        methods:{
            userOrderBy(column, prop, order){
                if(column.order==='descending'){
                    this.asc=false
                }else if(column.order==='ascending'){
                    this.asc=true
                }
                this.getDynamicList()
            },
            resetForm(){
                this.$refs.searchFrom.resetFields();
                this.asc=false
                this.pageNum=1
                this.getDynamicList()
            },
            //选择
            dynamicTableSelection(val){
                this.multipleSelection=val
            },
            //切换页面大小
            dynamicHandleSizeChange(val){
                this.pageSize=val
                this.getDynamicList()
            },
            //切换页数
            dynamicHandleCurrentChange(val){
                this.pageNum=val
                this.getDynamicList()
            },
            getDynamicList(){
                let param={
                    ...this.searchParam,
                    asc:this.asc,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    isAdmin: true
                }
                if(this.searchParam.createTime){
                    param.startTime=this.searchParam.createTime[0]
                    param.endTime=this.searchParam.createTime[1]
                }
                delete param.createTime

                this.$apiMethods.userApi.getDynamicList(param).then(res=>{
                    if(res.code===200){
                        this.dynamicTableData=res.data.records
                        this.total=res.data.total
                    }
                })
            },
            deleteDynamic(row){
                let msg=""
                let param={
                    isAdmin: true
                }
                if(row){
                    msg="是否删除该条动态"
                    param.id=row.id
                }else {
                    msg="是否删除选中动态"
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择动态")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                    param.ids=param.ids.toLocaleString()
                }
                this.$utils.confirmWarning(msg).then(res=>{
                    this.$apiMethods.userApi.deleteDynamic(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功！")
                            this.getDynamicList()
                        }
                    })
                }).catch((res)=>{})
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="less">
    .admin-table-btn-div{
        height: 40px;
        line-height: 40px;
        padding: 0 2%;
        margin-bottom: 10px;
        text-align: right;
    }

    .admin-table-div{
        padding: 0 2%;
    }

    .admin-dynamic-table-page{

    }

    .el-form-item{
        margin-bottom: 0 !important;
    }


</style>

<style>
    .demo-table-expand {
        font-size: 0;
        margin-left: 30px;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
</style>