<template>
    <div>
        <h2>小说审核界面</h2>
        <el-divider></el-divider>
        <div class="tabsDiv">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="待审核" name="wait">
                </el-tab-pane>
                <el-tab-pane label="审核失败" name="fail">
                </el-tab-pane>
                <el-tab-pane label="审核成功" name="success">
                </el-tab-pane>
                <el-tab-pane label="已禁用" name="disable">
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="tabsDiv">
            <div class="tableBtnDiv" v-if="activeName==='wait'">
                <el-button class="tableBtnDelChose" icon="el-icon-circle-close" size="small" type="danger" @click="batchFail()">批量驳回</el-button>
                <el-button style="margin-right: 5px" class="tableBtnDelChose" icon="el-icon-circle-check" size="small" type="primary" @click="batchSuccess()">批量通过</el-button>
            </div>
            <div class="tableBtnDiv" v-if="activeName==='success'">
                <el-button class="tableBtnDelChose" icon="el-icon-circle-close" size="small" type="warning" @click="cancelPublic()">批量取消</el-button>
            </div>
            <div class="tableBtnDiv" v-if="activeName==='fail'">
                <el-button class="tableBtnDelChose" icon="el-icon-circle-check" size="small" type="primary" @click="batchPublic()">批量发布</el-button>
            </div>
            <div class="tableBtnDiv" v-if="activeName==='disable'">
                <el-button class="tableBtnDelChose" icon="el-icon-circle-close" size="small" type="warning" @click="cancelDisable()">批量取消</el-button>
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
                            prop="createTime"
                            label="上传时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName==='disable'"
                            prop="novelUploadType"
                            label="是否已发布"
                            width="80">
                        <template slot-scope="scope" v-if="activeName==='disable'">
                            {{scope.row.novelUploadType===1?'否':'是'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="activeName==='disable'||activeName==='fail'"
                            prop="errorMsg"
                            :label="activeName==='disable'?'禁用理由':'驳回理由'"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            label="操作时间"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            v-if="activeName==='wait'"
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="120">
                        <template slot-scope="scope" v-if="activeName==='wait'">
                            <el-button @click="batchSuccess(scope.row)" type="text" size="small">通过</el-button>
                            <el-button @click="batchFail(scope.row)" type="text" size="small" style="color: #f56c6c;">驳回</el-button>
                            <el-button @click="batchDisable(scope.row)" type="text" size="small" style="color: #909399;;">禁用</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="activeName==='fail'"
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="120">
                        <template slot-scope="scope" v-if="activeName==='fail'">
                            <el-button @click="batchPublic(scope.row)" type="text" size="small">直接发布</el-button>
                            <el-button @click="batchDisable(scope.row)" type="text" size="small" style="color: #909399;;">禁用</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="activeName==='success'"
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="120">
                        <template slot-scope="scope" v-if="activeName==='success'">
                            <el-button @click="cancelPublic(scope.row)" type="text" size="small">取消发布</el-button>
                            <el-button @click="batchDisable(scope.row)" type="text" size="small" style="color: #909399;;">禁用</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="activeName==='disable'"
                            fixed="right"
                            prop="opr"
                            label="操作"
                            width="120">
                        <template slot-scope="scope" v-if="activeName==='disable'">
                            <el-button @click="cancelDisable(scope.row)" type="text" size="small">取消禁用</el-button>
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
    </div>
</template>

<script>
    export default {
        name: "AdminExamine",
        computed:{
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
                activeName:'wait',
                pageNum:1,
                pageSize:10,
                total:0,
                multipleSelection:[],
                tableData:[],
            }
        },
        methods:{
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
            //多选
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //清空数据
            removeDate(){
                this.pageNum=1,
                this.pageSize=10,
                this.total=0,
                this.multipleSelection=[]
            },
            //切换tabs
            handleClick(tab, event) {
                this.$utils.openLoading()
                this.removeDate()
                this.activeName=tab.name
                this.getList()
            },
            //页数
            handleCurrentChange(val){
                this.pageNum=val
                this.getList()
            },
            //页面大小
            handleSizeChange(val){
                this.pageSize=val
                this.getList()
            },
            batchSuccess(obj){
                let param={
                    novelStatus:2
                }
                if(obj){
                    param.id=obj.id
                }else {
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                }
                let that=this
                this.$utils.confirmWarning("是否通过审批？").then(res => {
                    that.$apiMethods.novelApi.auditNovel(param).then(res=>{
                        if(res.code===200){
                            that.$utils.success2("审核成功！")
                            that.getList()
                        }
                    })
                }).catch((err) => {})
            },
            batchFail(obj){
                let param={
                    novelStatus:3
                }
                if(obj){
                    param.id=obj.id
                }else {
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                }
                let that=this
                this.$prompt('请输入驳回理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    param.errorMsg=value
                    that.$utils.confirmWarning("是否驳回审批？").then(res => {
                        that.$apiMethods.novelApi.auditNovel(param).then(res=>{
                            if(res.code===200){
                                that.$utils.success2("驳回成功！")
                                that.getList()
                            }
                        })
                    }).catch((err) => {})
                }).catch(() => {});
            },
            batchDisable(obj){
                let param={
                    novelStatus:4
                }
                if(obj){
                    param.id=obj.id
                }else {
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                }
                let that=this
                this.$prompt('请输入禁用理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    param.errorMsg=value
                    that.$utils.confirmWarning("是否禁用小说？").then(res => {
                        that.$apiMethods.novelApi.auditNovel(param).then(res=>{
                            if(res.code===200){
                                that.$utils.success2("禁用成功")
                                that.getList()
                            }
                        })
                    }).catch((err) => {})
                }).catch((err) => {});
            },
            cancelDisable(obj){
                let param={
                    novelStatus:0
                }
                if(obj){
                    param.id=obj.id
                }else {
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                }
                let that=this
                this.$utils.confirmWarning("是否取消禁用？(取消禁用后的小说会变成个人所有，发布需重新经过审批流程)").then(res => {
                    that.$apiMethods.novelApi.auditNovel(param).then(res=>{
                        if(res.code===200){
                            that.$utils.success2("取消成功！")
                            that.getList()
                        }
                    })
                }).catch((err) => {})
            },
            batchPublic(obj){
                let param={}
                if(obj){
                    param.id=obj.id
                }else {
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                }
                let that=this
                this.$utils.confirmWarning("是否发布小说？").then(res => {
                    that.$apiMethods.novelApi.publicNovel(param).then(res=>{
                        if(res.code===200){
                            that.$utils.success2("发布成功！")
                            that.getList()
                        }
                    })
                }).catch((err) => {})
            },
            cancelPublic(obj){
                let param={}
                if(obj){
                    param.id=obj.id
                }else {
                    if(this.multipleSelection.length===0){
                        this.$utils.warning2("请选择小说")
                        return;
                    }
                    param.ids=[]
                    for(let item of this.multipleSelection) {
                        param.ids.push(item.id)
                    }
                }
                this.$utils.confirmWarning("是否取消发布小说？").then(res => {
                    this.$apiMethods.novelApi.cancelPublic(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("取消成功！")
                            this.getList()
                        }
                    })
                }).catch((err) => {})
            },
            getList(){
                let status=1
                switch (this.activeName) {
                    case 'wait':
                        status=1
                        break;
                    case 'success':
                        status=2
                        break;
                    case 'fail':
                        status=3
                        break;
                    case 'disable':
                        status=4
                        break;
                }
                let param={
                    novelStatus:status,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    pageType: 2 //管理员页面
                }
                this.$apiMethods.novelApi.getNovelList(param).then(res=>{
                    if(res.code===200){
                        this.total=res.data.total
                        this.pageNum=res.data.current
                        this.tableData=res.data.records
                        this.$utils.closeLoading()
                    }
                })
            }
        },
        created() {
            this.getList()
        }
    }
</script>

<style scoped>
    .tabsDiv{
        padding: 0 2%;
    }

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
</style>