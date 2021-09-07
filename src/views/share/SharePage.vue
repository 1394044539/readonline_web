<template>
    <div style="margin: 0;height: 100%;padding: 20px 20%;display: flex;">
        <div class="shareDiv">
            <h2>分享页面</h2>
            <el-divider></el-divider>
            <div>
                <div v-if="errorOpen">
                    <h1 style="color: red">{{}}</h1>
                </div>
                <div v-if="pwdOpen">
                    <h2>请输入密码</h2>
                    <div><el-input  style="width: 300px" v-model="sharePwd" placeholder="请输入密码"></el-input></div>
                    <div style="margin-top: 20px"><el-button size="medium" type="primary" @click="checkPwd">确定</el-button></div>
                </div>
                <div v-if="listOpen">
                    <div v-for="(file,index) in fileList">
                        {{file.type}}{{file.name}}{{file.novelId}}{{file.novelImg}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SharePage",
        data(){
            return{
                shareId:this.$route.query.sharePath,
                sharePwd:'',
                shareStatus:1,
                errorOpen:false,
                errorMessage:'',
                pwdOpen:false,
                listOpen:false,
                parentId:'',
                fileList:[]
            }
        },
        methods:{
            getList(){
                let param={
                    parentId: this.parentId,
                    id:this.shareId
                }
                this.$apiMethods.shareApi.getShareFileList(param).then(res=>{
                    if(res.code===200){
                        this.fileList=res.data
                    }
                })
            },
            checkPwd(){
                if(!this.sharePwd){
                    return this.$utils.warning2("请输入密码")
                }
                let param={
                    id:this.shareId,
                    sharePwd:this.sharePwd
                }
                this.$apiMethods.shareApi.checkPwd(param).then(res=>{
                    if(res.code===200){
                        if(res.data===1){
                            return this.$utils.warning2("密码错误")
                        }
                        if(res.data===0){
                            this.pwdOpen=false
                            this.listOpen=true
                            this.getList()
                        }
                    }
                })
            },
            initShare(){
                let param={
                    id:this.shareId
                }
                this.$apiMethods.shareApi.checkNeedPwd(param).then(res=>{
                    if(res.code===200){
                        //判断各种状态
                        switch (res.data) {
                            case -4:
                                this.errorMessage="该分享不存在"
                                this.errorOpen=true
                                break;
                            case -3:
                                this.errorOpen=true
                                this.errorMessage="该分享已经过期"
                                break;
                            case -2:
                                this.errorOpen=true
                                this.errorMessage="该分享已被禁用"
                                break;
                            case -1:
                                this.errorOpen=true
                                this.errorMessage="该分享已被删除"
                                break;
                            case 0:
                                //分享类型：0：随意进入;1:纯密码进入;2：指定用户分享;3:指定用户密码分享
                                this.listOpen=true
                                this.getList()
                                break;
                            case 1:
                                this.pwdOpen=true
                                break;
                            case 2:
                                break;
                            case 3:
                                break
                        }
                    }
                })
            }
        },
        created() {
            this.initShare()
        }
    }
</script>

<style scoped>
    .shareDiv{
        width: 100%;
        /*display: flex;*/
        height: auto;
        min-height: 500px;
        background-color: #FFFFFF;
        border: 1px solid #e4e7ed;
        text-align: center;
    }
</style>