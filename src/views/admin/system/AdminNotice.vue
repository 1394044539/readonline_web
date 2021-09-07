<template>
    <div>
        <h2>公告管理</h2>
        <el-divider></el-divider>
        <div class="table-search-div">
            <el-form ref="searchParam" :model="searchParam" label-width="80px" size="small">
                <el-row>
                    <el-col :span="8">
                        <div class="label-search-input">
                            <el-form-item prop="title" label="公告名：">
                                <el-input placeholder="请输入公告名" clearable v-model="searchParam.title"></el-input>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="label-search-input">
                            <el-form-item prop="createTime" label="发布时间：">
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
                <el-button type="primary" size="small" @click="getNoticeList">搜索</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
            </div>
        </div>
        <div class="tableBtnDiv">
            <el-button class="tableBtnUpload" icon="el-icon-edit" size="small" type="primary" @click="addNotice">发布公告</el-button>
            <el-button class="tableBtnDelChose" icon="el-icon-delete" size="small" type="danger" @click="deleteNotice('all')">删除选中</el-button>
        </div>
        <div class="tableDiv">
            <el-table
                    :data="tableData"
                    style="width: 96%;"
                    min-height="200"
                    max-heigth="400"
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
                        prop="title"
                        label="公告标题"
                        :show-overflow-tooltip='true'
                        width="150">
                    <template slot-scope="scope">
                        <el-link @click.native="openDialogLook(scope.row)" href="javaScript:void(0);" :title="scope.row.title">{{scope.row.title}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="公告内容"
                        :show-overflow-tooltip='true'
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="createBy"
                        label="创建人"
                        :show-overflow-tooltip='true'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="updateBy"
                        label="修改人"
                        :show-overflow-tooltip='true'
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="修改时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        prop="is_open"
                        label="是否打开公告"
                        width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.isOpen?'是':'否'}}</span>
                        <el-button @click="closeNotice(scope.row.id)" v-if="scope.row.isOpen" size="mini" style="margin-left: 5px;padding: 5px" type="danger">关闭</el-button>
                        <el-button @click="openNotice(scope.row.id)" v-if="!scope.row.isOpen" size="mini" style="margin-left: 5px;padding: 5px" type="primary">打开</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        prop="opr"
                        label="操作"
                        width="80">
                    <template slot-scope="scope">
                        <el-button @click="editNotice(scope.row)" type="text" size="mini">编辑</el-button>
                        <el-button style="margin-left: 5px" @click="deleteNotice(scope.row.id)" type="text" size="mini">删除</el-button>
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
        <NoticeDialog :openDialog="openDialog" :type=type :notice="noticeObj" @closeFrom=closeNoticeForm></NoticeDialog>
    </div>
</template>

<script>
    import NoticeDialog from '../../../components/admin/noticeDialog'
    export default {
        name: "AdminNotice",
        components:{
            NoticeDialog
        },
        data(){
            return{
                tableData:[],
                pageNum:1,
                pageSize:10,
                total:0,
                asc:false,
                multipleSelection: [],
                searchParam:{
                    createTime:'',
                    title:'',
                },
                openDialog: false,
                noticeObj:{},
                type:0
            }
        },
        methods:{
            handleCurrentChange(val){
                this.pageNum =val
                this.getNoticeList()
            },
            handleSizeChange(val){
                this.pageSize=val
                this.getNoticeList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            resetForm(){
                this.$refs.searchParam.resetFields();
                this.asc=false
                this.pageNum=1
                this.getNoticeList()
            },
            getNoticeList(){
                let param={
                    ...this.searchParam,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    pageType: 2 //管理员页面
                }
                if(this.searchParam.createTime){
                    param.startTime=this.searchParam.createTime[0]
                    param.endTime=this.searchParam.createTime[1]
                }
                delete param.createTime
                this.$apiMethods.dataApi.getSysNoticeList(param).then(res=>{
                    if(res.code===200){
                        this.pageNum=res.data.current
                        this.total=res.data.total
                        this.tableData=res.data.records
                    }
                })
            },
            addNotice(){
                this.type=2
                this.openDialog=true
            },
            deleteNotice(val){
                let ids=new Array();
                let message;
                if(val!=='all'){
                    //选中删除
                    ids.push(val)
                    message="是否要删除该公告?"
                }else{
                    //批量删除
                    //选择批量删除
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择公告")
                        return;
                    }
                    message="是否确认要删除选中公告？"
                    for(let item of this.multipleSelection) {
                        ids.push(item.id)
                    }
                }
                this.$utils.confirmWarning(message).then(() => {
                    let param={
                        ids: ids.toLocaleString()
                    }
                    this.$apiMethods.dataApi.deleteNotice(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.multipleSelection=[]
                            this.getNoticeList();
                        }
                    })
                }).catch((err)=>{})
            },
            closeNoticeForm(val){
                this.openDialog=val
                this.getNoticeList()
            },
            openNotice(id){
                this.$utils.confirmWarning('是否需要打开此公告(一次只能打开一个公告)').then(() => {
                    let param={
                        id: id,
                        isOpen: true
                    }
                    this.$apiMethods.dataApi.openOrCloseNotice(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("操作成功")
                            this.getNoticeList();
                        }
                    })
                }).catch((err)=>{})
            },
            closeNotice(id){
                this.$utils.confirmWarning('是否需要关闭此公告').then(() => {
                    let param={
                        id: id,
                        isOpen: false
                    }
                    this.$apiMethods.dataApi.openOrCloseNotice(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("操作成功")
                            this.getNoticeList();
                        }
                    })
                }).catch((err)=>{})
            },
            openDialogLook(val){
                this.noticeObj=val
                this.type=0
                this.openDialog=true
            },
            editNotice(val){
                this.noticeObj=val
                this.type=1
                this.openDialog=true
            }

        },
        created() {
            this.getNoticeList()
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
        width: 100%;
        padding: 0 2%;
    }

    .tablePageDiv{
        margin-top: 5px;
    }
</style>