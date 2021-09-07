<template>
    <div>
        <h2>个人动态界面</h2>
        <el-divider></el-divider>
        <div class="user-dynamic-div">
            <div class="dynamic-header-div">
                <el-button v-if="checkList.length>0" style="margin-right: 5px" size="small" icon="el-icon-delete" @click="batchDeleteDynamic(1)">批量删除</el-button>
                <el-button style="margin-right: 5px" size="small" icon="el-icon-delete" @click="batchDeleteDynamic(2)">清空全部</el-button>
                <el-badge is-dot class="item" v-if="getNeedRed">
                    <el-button size="small" icon="el-icon-reading" @click="allRead">一键已读</el-button>
                </el-badge>
                <el-button v-if="!getNeedRed" size="small" icon="el-icon-reading">一键已读</el-button>
            </div>
            <div class="dynamic-list-div" v-infinite-scroll="loadDynamic" style="overflow:auto">
                <el-checkbox-group v-model="checkList">
                    <div class="dynamic-div" v-for="(dynamic,index) in dynamicList">
                        <div class="dynamic-title-header">
                            <div style="display: flex">
                                <el-badge v-if="dynamic.isRead===0" is-dot class="item"></el-badge>
                                <div class="dynamic-title" @click="readDynamic(dynamic,index)">
                                    <a v-if="dynamic.isRead===0">{{dynamic.dynamicTitle}}</a>
                                    <a v-if="dynamic.isRead===1" style="color: gray;">{{dynamic.dynamicTitle}}</a>
                                </div>
                            </div>
                            <div class="right:0">
                                <el-checkbox :label="dynamic.id"><br></el-checkbox>
                            </div>
                        </div>
                        <div class="dynamic-context" @click="readDynamic(dynamic,index)">
                            {{dynamic.dynamicContent}}
                        </div>
                        <div class="dynamic-opr">
                            <a>{{dynamic.createTime}}</a>
                            <span v-if="dynamic.isRead===0" class="dynamic-read-btn" @click="alread(dynamic.id,index)"><i class="el-icon-reading"></i>标记已读</span>
                            <span class="dynamic-delete-btn" @click="deleteDynamic(dynamic.id,index)"><i class="el-icon-delete"></i>删除动态</span>
                        </div>
                    </div>
                </el-checkbox-group>
            </div>
            <div class="ynamic-list-div" v-if="dynamicList.length===0">
                <h3 style="color: gray">暂无动态</h3>
            </div>
        </div>

        <DynamicDialog :openDialog="openDialog" :dynamic="dynamicObj" :type="0" @closeFrom="dialogReturn"></DynamicDialog>
    </div>
</template>

<script>
    import DynamicDialog from '../../components/person/DynamicDialog'
    export default {
        name: "UserDynamic",
        components:{ DynamicDialog },
        data(){
            return{
                checkList:[],
                dynamicList:[],
                pageNum:1,
                pageSize:10,
                total:0,
                openDialog:false,
                dynamicObj:{}
            }
        },
        mounted(){
        },
        computed:{
            getNeedRed(){
                for(let item of this.dynamicList){
                    if(item.isRead===0){
                        return true
                    }
                }
                return false
            },
        },
        methods:{
            //初始化
            getList(){
                let param={
                    pageNum:this.pageNum,
                    pageSize: this.pageSize
                }
                this.$apiMethods.userApi.getDynamicList(param).then(res=>{
                    if(res.code===200){
                        this.dynamicList=res.data.records
                        this.total=res.data.total
                    }
                })
            },
            //懒加载
            loadDynamic(){
                if(this.dynamicList.length>=10){
                    this.pageNum+=1
                    let param={
                        pageNum:this.pageNum,
                        pageSize: this.pageSize
                    }
                    this.$apiMethods.userApi.getDynamicList(param).then(res=>{
                        if(res.code===200){
                            this.dynamicList.push(res.data.records)
                        }
                    })
                }
            },
            //阅读动态
            readDynamic(obj,index){
                this.alread(obj.id,index)
                this.dynamicObj=obj
                this.openDialog=true
            },
            dialogReturn(){
                this.openDialog=false
            },
            //删除动态
            deleteDynamic(id,index){
                this.$utils.confirmWarning("是否要删除此动态？").then(res=>{
                    let param={
                        id:id
                    }
                    this.$apiMethods.userApi.deleteDynamic(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功！")
                            this.dynamicList.splice(index,1)
                        }
                    })
                }).catch((res)=>{})
            },
            batchDeleteDynamic(type){
                let param={}
                let msg=""
                //1:删除选中;2:情况全部
                if(type===1){
                    msg="是否要删除选中？";
                    param.ids=this.checkList.toLocaleString()
                }
                if(type===2){
                    msg="是否要清空全部？";
                }
                this.$utils.confirmWarning(msg).then(res=>{
                    this.$apiMethods.userApi.deleteDynamic(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功！")
                            this.getList()
                        }
                    })
                }).catch(res=>{})
            },
            //标记已读
            alread(id,index){
                let param={
                    id:id
                }
                this.$apiMethods.userApi.alreadDynamic(param).then(res=>{
                    if(res.code===200){
                        //这里避免调用接口，直接修改参数就行了
                        this.dynamicList[index].isRead=1
                    }
                })
            },
            allRead(){
                let param={}
                this.$apiMethods.userApi.alreadDynamic(param).then(res=>{
                    if(res.code===200){
                        this.getList()
                    }
                })
            }
        },
        created() {
            this.getList()
        },
        watch:{
        }
    }
</script>

<style scoped lang="less">
    .user-dynamic-div{

    }

    .dynamic-header-div{
        text-align: right;
        padding:0 20px;
    }

    .dynamic-list-div{

    }

    .dynamic-div{
        text-align: left;
        padding: 20px;
        border-bottom: 1px solid #e5e9ef;

        &:hover{
            .dynamic-delete-btn{
                display: block;
            }
        }
    }

    .dynamic-title-header{
        width: 100%;
        display: flex;
        margin-bottom: 5px;
        justify-content: space-between;
    }

    .item{
        padding-left: 0;
    }

    .dynamic-title{
    }

    .dynamic-title:hover{
        cursor: pointer;
    }


    .dynamic-title a{
        font-size: 14px;
        font-weight: bold;
    }

    .dynamic-context{
        cursor: pointer;
        font-size: 14px;
        color: #222;
        /*padding-left: 20px;*/
        text-indent: 2em;
        line-height: 25px;
        margin-bottom: 5px;
        display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
        -webkit-line-clamp: 2; /*显示的行数；如果要设置2行加...则设置为2*/
        overflow: hidden; /*超出的文本隐藏*/
        text-overflow: ellipsis; /* 溢出用省略号*/
        -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
    }

    .dynamic-opr{
        display: flex;
    }

    .dynamic-opr a{
        color: #999;
        font-size: 12px;
        margin-left: 5px;
    }

    .dynamic-read-btn{
        color: #999;
        margin-left: 20px;
        font-size: 12px;
    }

    .dynamic-read-btn:hover{
        cursor: pointer;
    }

    .dynamic-delete-btn{
        color: #999;
        margin-left: 20px;
        display: none;
        font-size: 12px;
    }

    .dynamic-delete-btn:hover{
        cursor: pointer;
    }
</style>