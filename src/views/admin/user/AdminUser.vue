<template>
    <div>
        <h2>用户管理界面</h2>
        <el-divider></el-divider>
        <div v-if="pageType===0">
            <div class="table-search-div">
                <el-form ref="searchFrom" :model="searchParam" label-width="80px" size="small">
                    <el-row>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="userName" label="用户名：">
                                    <el-input placeholder="请输入用户名" clearable v-model="searchParam.userName"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="accountName" label="账号：">
                                    <el-input placeholder="请输入账号" clearable v-model="searchParam.accountName"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="roleType" label="用户角色">
                                    <el-select style="width: 100%" size="small" clearable v-model="searchParam.roleType" placeholder="请选择">
                                        <el-option size="small" key="0" label="管理员" value="0"></el-option>
                                        <el-option size="small" key="1" label="普通用户" value="1"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="status" label="用户状态：">
                                    <el-select style="width: 100%" size="small" clearable v-model="searchParam.status" placeholder="请选择">
                                        <el-option size="small" key="0" label="正常" value="0"></el-option>
                                        <el-option size="small" key="2" label="禁用" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="label-search-input">
                                <el-form-item prop="createTime" label="注册时间：">
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
                    <el-button type="primary" size="small" @click="getUserList">搜索</el-button>
                    <el-button size="small" @click="resetForm">重置</el-button>
                </div>
            </div>
            <div class="tableBtnDiv">
                <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteUser(1)">删除选中</el-button>
            </div>
            <div class="tableDiv" >
                <el-table
                        :data="tableData"
                        style="width: 96%;"
                        @sort-change="userOrderBy"
                        min-height="200"
                        max-heigth="400"
                        border
                        size="small"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            fixed
                            type="selection"
                            width="50">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            label="用户名"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="accountName"
                            label="账号"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="photo"
                            label="头像"
                            width="120">
                        <template slot-scope="scope">
                            <el-image
                                    v-if="scope.row.photo"
                                    style="width: 50px; height: 50px"
                                    :src="'/img/'+scope.row.photo"
                                    :preview-src-list="getImg(scope.row.photo)"
                                    :fit="'fit'"></el-image>
                            <span v-if="!scope.row.photo">暂无头像</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="email"
                            label="邮箱"
                            width="120">
                        <template slot-scope="scope">
                            {{scope.row.email?scope.row.email:'暂无邮箱'}}
                        </template>
                    </el-table-column>
                    <!--                <el-table-column-->
                    <!--                        prop="identityCard"-->
                    <!--                        label="身份证"-->
                    <!--                        width="120">-->
                    <!--                    <template slot-scope="scope">-->
                    <!--                        {{scope.row.identityCard?scope.row.identityCard:'未认证'}}-->
                    <!--                    </template>-->
                    <!--                </el-table-column>-->
                    <!--                <el-table-column-->
                    <!--                        prop="trueName"-->
                    <!--                        label="真实姓名"-->
                    <!--                        width="120">-->
                    <!--                    <template slot-scope="scope">-->
                    <!--                        {{scope.row.trueName?scope.row.trueName:'未认证'}}-->
                    <!--                    </template>-->
                    <!--                </el-table-column>-->
                    <el-table-column
                            prop="roleType"
                            label="用户角色"
                            width="120">
                        <template slot-scope="scope">
                            {{scope.row.roleType===1?'普通用户':'管理员'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="用户状态"
                            width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.status===0" >
                                正常
                            </div>
                            <div v-if="scope.row.status===2" style="color:red">
                                被禁用
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :sortable="'custom'"
                            prop="createTime"
                            label="注册时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="120">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row,scope.$index)" type="text" size="small">查看</el-button>
                            <el-button @click="disableUser(scope.row,2)" v-if="scope.row.status===0&&scope.row.roleType!==0" small="small" type="text" style="font-size: 12px;color: #f56c6c;">禁用</el-button>
                            <el-button @click="disableUser(scope.row,0)" v-if="scope.row.status===2" small="small" type="text" style="font-size: 12px">解除</el-button>
                            <el-button @click="deleteUser(2,scope.row)" v-if="scope.row.roleType!==0" type="text" size="small">删除</el-button>
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
        <div v-if="pageType===1" class="user-info-div">
            <el-form :label-position="'left'" ref="infoForm" :model="userInfo" label-width="80px">
                <el-form-item label="账号">
                    {{userInfo.accountName}}
                </el-form-item>
                <el-form-item label="用户名">
                    {{userInfo.userName}}
                </el-form-item>
                <el-form-item label="头像">
                    <el-image
                            style="width: 178px; height: 178px"
                            :src="userInfo.photo?'/img/'+userInfo.photo:require('@/assets/img/noPhoto.png')"
                            :fit="'fit'"></el-image>
                </el-form-item>
                <el-form-item label="手机号">
                    {{userInfo.phone}}
                </el-form-item>
                <el-form-item label="邮箱">
                    {{userInfo.email}}
                </el-form-item>
                <el-form-item label="角色">
                    {{userInfo.roleType===0?'管理员':'普通用户'}}
                </el-form-item>
                <el-form-item label="用户状态">
                    <div :style="userInfo.status===2?{color:'red'}:{}">
                        {{userInfo.status===0?'正常':'被禁用'}}
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="pageType=0">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminUser",
        data(){
            return{
                pageType:0,
                tableData:[],
                userInfo:{},
                pageNum:1,
                pageSize:10,
                total:0,
                multipleSelection: [],
                searchParam:{
                    accountName:'',
                    userName:'',
                    roleType:'',
                    status:'',
                    createTime:''
                },
                asc:false,
            }
        },
        computed:{
            getImg(){
                return (img)=>{
                    let imgs=new Array
                    imgs.push('/img/'+img)
                    return imgs
                }
            },
        },
        methods:{
            userOrderBy(column, prop, order){
                if(column.order==='descending'){
                    this.asc=false
                }else if(column.order==='ascending'){
                    this.asc=true
                }
                this.getUserList()
            },
            getUserList(){
                let param={
                    ...this.searchParam,
                    asc:this.asc,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }
                if(this.searchParam.createTime){
                    param.startTime=this.searchParam.createTime[0]
                    param.endTime=this.searchParam.createTime[1]
                }
                delete param.createTime


                this.$apiMethods.userApi.getUserList(param).then(res=>{
                    if(res.code===200){
                        this.pageNum=res.data.current
                        this.total=res.data.total
                        this.tableData=res.data.records
                    }
                })
            },
            resetForm(){
                this.$refs.searchFrom.resetFields();
                this.asc=false
                this.pageNum=1
                this.getUserList()
            },
            handleCurrentChange(val){
                this.pageNum=val
                this.getUserList()
            },
            handleSizeChange(val){
                this.pageSize=val
                this.getUserList()
            },
            handleClick(row,index){
                this.userInfo=row
                this.pageType=1
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            deleteUser(type,row){
                let ids=new Array();
                let message;
                if(type===1){
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择用户")
                        return;
                    }
                    message="是否确认要删除选中用户？(该操作很危险且无法恢复)"
                    for(let item of this.multipleSelection) {
                        ids.push(item.id)
                    }
                }else if(type===2){
                    //单个删除
                    message="是否要删除"+row.userName+"用户？(删除无法恢复)"
                    ids.push(row.id)
                }else {
                    return
                }
                this.$utils.confirmWarning(message).then(() => {
                    let param={
                        ids: ids.toLocaleString()
                    }
                    this.$apiMethods.userApi.deleteUser(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            this.getUserList();
                        }
                    })
                }).catch((err)=>{})
            },
            disableUser(row,type){
                let message=''
                if(type===0){
                    message='是否要解除禁用该用户'
                }else if(type===2){
                    message='是否要禁用该用户'
                }
                this.$utils.confirmWarning(message).then(() => {
                    let param={
                        id: row.id,
                        status:type
                    }
                    this.$apiMethods.userApi.disableUser(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("禁用成功")
                            this.multipleSelection=[]
                            this.getUserList();
                        }
                    })
                }).catch((err)=>{})
            }
        },
        created() {
            this.getUserList()
        }
    }
</script>

<style scoped lang="less">
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
        /*width: 100%;*/
        padding: 0 2%;
    }

    .tablePageDiv{
        margin-top: 5px;
    }

    .user-info-div{
        padding: 0 15%;
        text-align: left;
    }


</style>