<template>
    <div>
        <h2>个人信息中心</h2>
        <el-divider></el-divider>
        <div class="userInfoDiv">
            <div v-if="!isEdit">
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
                    <el-form-item>
                        <el-button icon="el-icon-edit" size="small" type="primary" @click="isEdit=true">编辑信息</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="isEdit">
                <el-form :label-position="'left'" ref="form" :model="form" label-width="80px">
                    <el-form-item label="账号">
                        <el-input style="width: 60%" disabled v-model="form.accountName"></el-input>
                        <div class="formSpan">* 账号不可更改</div>
                    </el-form-item>
                    <el-form-item label="用户名" style="margin-bottom: 22px">
                        <el-input maxlength="11"
                                  show-word-limit
                                  style="width: 60%"
                                  v-model="form.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="头像">
                        <el-upload
                                class="upload-photo"
                                action=""
                                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                                :auto-upload="false"
                                :on-change="addPhoto"
                                :show-file-list="false">
                            <div class="avatar" v-if="imageUrl"
                                 :style="{backgroundImage:'url('+imageUrl+')'}">
                                <div class="img-icon-div">
                                    <div>
                                        <i @click.stop="handlePictureCardPreview" class="el-icon-zoom-in img-icon"></i>
                                        <i @click.stop="handleRemove" style="margin-left: 10px" class="el-icon-delete img-icon"></i>
                                    </div>
                                </div>
                            </div>
                            <i v-if="!imageUrl" class="el-icon-plus upload-photo-icon"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="imageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-edit" size="small" type="primary" @click="editUserInfo">确认修改</el-button>
                        <el-button size="small" @click="removeForm">返回</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserInfo",
        data(){
            return{
                userInfo:{},
                form:{
                    accountName:'',
                    userName:'',
                    file:null
                },
                isEdit:false,
                imageUrl:'',
                deletePhoto:false,
                dialogImageUrl: '',
                dialogVisible: false,
            }
        },
        methods:{
            removeForm(){
                this.isEdit=false
                this.form.file=null
                this.form.userName=this.userInfo.userName
                this.imageUrl = this.userInfo.photo?'/img/'+this.userInfo.photo:''
            },
            addPhoto(file,fileList){
                this.form.file=file.raw
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            //预览
            handlePictureCardPreview() {
                this.dialogVisible = true;
            },
            //移除
            handleRemove(){
                this.form.file=null
                this.imageUrl = ''
            },
            getUserInfo(){
                this.$apiMethods.userApi.getUserInfo().then(res=>{
                    if(res.code===200){
                        this.userInfo = {...res.data}
                        this.form = {...res.data}
                        if(this.userInfo.photo){
                            this.imageUrl='/img/'+this.userInfo.photo
                        }
                    }
                })
            },
            editUserInfo(){
                if(this.form.userName.length>11){
                    return
                }
                this.$utils.confirmInfo("是否确认更改用户信息").then(()=>{
                    let formData=new FormData();
                    formData.append('userName',this.form.userName)
                    if(this.form.file){
                        formData.append('filePhoto',this.form.file)
                    }
                    this.$apiMethods.userApi.updateUser(formData).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("修改成功！")
                            this.removeForm()
                            this.$store.state.userInfo.username=this.form.userName
                            //重新给缓存赋值
                            localStorage.removeItem("userInfo")
                            localStorage.setItem("userInfo",JSON.stringify(this.$store.state.userInfo))
                            this.getUserInfo()
                        }
                    })
                }).catch((err)=>{})
            }
        },
        created() {
            this.getUserInfo()
        }
    }
</script>

<style scoped lang="less">
    .userInfoDiv{
        padding: 0 15%;
        text-align: left;
    }

    .formSpan{
        color: gray;
        font-size: 10px;
        margin: 0;
        padding: 0;
        line-height: 20px;
    }

    .upload-photo{
         position: relative;
         overflow: hidden;
     }
    .upload-photo-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;

        background-repeat: no-repeat;
        background-size: 178px 178px;
    }

    .img-icon-div{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content:center;
        background-color: rgba(0,0,0,.5);
        opacity: 0;

        &:hover{
            transition: opacity .3s;
            opacity: 1;
            .img-icon{
                display: unset;
            }
        }
    }

    .img-icon{
        font-size: 20px;
        display: none;
        color: #FFFFFF;
    }

    .el-form-item{
        margin-bottom: unset;
    }
</style>