<template>
    <div>
        <h2>账号安全管理</h2>
        <el-divider></el-divider>
        <div v-if="pageType===0&&!checkPhoneType" class="safe-info-div">
            <el-divider></el-divider>
            <div class="info-div">
                <div style="width: 40%">
                    设置密码
                </div>
                <div style="width: 40%;font-size: 12px;color: gray">
                    <i class="el-icon-success" style="color:green;font-size: 14px"></i>已设置
                </div>
                <div style="width: 20%" >
                    <el-link type="primary" @click="jumpTabs(1)">修改密码</el-link>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="info-div">
                <div style="width: 40%">
                    设置手机号
                </div>
                <div style="width: 40%;font-size: 12px;color: gray">
                    <i class="el-icon-success" style="color:green;font-size: 14px"></i>{{userInfo.phone}}
                </div>
                <div style="width: 20%" >
                    <el-link type="primary" @click="jumpTabs(2,'',true)">修改手机号</el-link>
                </div>
            </div>
            <el-divider></el-divider>
            <div class="info-div">
                <div style="width: 40%">
                    设置邮箱
                </div>
                <div v-if="userInfo.email" style="width: 40%;font-size: 12px;color: gray">
                    <i  class="el-icon-success" style="color:green;font-size: 14px"></i>{{userInfo.email}}
                </div>
                <div v-if="!userInfo.email" style="width: 40%;font-size: 12px;color: gray">
                    <i  class="el-icon-circle-close"></i>未设置
                </div>
                <div v-if="userInfo.email" style="width: 20%" >
                    <el-link type="primary" @click="jumpTabs(3)">修改邮箱</el-link>
                </div>
                <div v-if="!userInfo.email" style="width: 20%" >
                    <el-link type="primary" @click="jumpTabs(3)">设置邮箱</el-link>
                </div>
            </div>
<!--            <el-divider></el-divider>-->
<!--            <div class="info-div">-->
<!--                <div style="width: 40%">-->
<!--                    实名认证-->
<!--                </div>-->
<!--                <div v-if="userInfo.trueName" style="width: 40%;font-size: 12px;color: gray">-->
<!--                    <i class="el-icon-success" style="color:green;font-size: 14px"></i>已认证-->
<!--                </div>-->
<!--                <div v-if="!userInfo.trueName" style="width: 40%;font-size: 12px;color: gray">-->
<!--                    <i class="el-icon-circle-close"></i>未认证-->
<!--                </div>-->
<!--                <div v-if="userInfo.trueName" style="width: 20%" >-->
<!--                    <el-link type="primary">查看详情</el-link>-->
<!--                </div>-->
<!--                <div v-if="!userInfo.trueName" style="width: 20%" >-->
<!--                    <el-link type="primary">实名认证</el-link>-->
<!--                </div>-->
<!--            </div>-->
<!--            <el-divider></el-divider>-->
<!--            <div class="info-div">-->
<!--                <div style="width: 40%">-->
<!--                    密保绑定-->
<!--                </div>-->
<!--                <div style="width: 40%;font-size: 12px;color: gray">-->
<!--                    <i class="el-icon-success" style="color:green;font-size: 14px"></i>已设置-->
<!--                </div>-->
<!--                <div style="width: 20%" >-->
<!--                    <el-link type="primary">更换密保</el-link>-->
<!--                </div>-->
<!--            </div>-->
        </div>
        <div v-if="pageType===1&&!checkPhoneType" class="update-pwd-div">
            <h3>密码修改</h3>
            <el-form ref="passwordForm" :rules="passwordRules" :model="passwordForm" label-width="80px">
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input show-password v-model="passwordForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input show-password v-model="passwordForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input show-password v-model="passwordForm.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="confirmUpdatePassword">确认修改</el-button>
                    <el-button @click="returnPage('passwordForm')">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="pageType===2&&!checkPhoneType" class="update-pwd-div">
            <h3>修改手机号</h3>
            <el-form ref="phoneForm" :rules="phoneRules" :model="phoneForm" label-width="80px">
                <el-form-item label="新手机" prop="phone" style="text-align: left">
                    <el-input v-model="phoneForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code" style="text-align: left">
                    <el-input v-model="phoneForm.code" style="width: 60%;" ></el-input>
                    <el-button style="margin-left: 5%;width: 35%" type="primary" :disabled="codeBtnDisable" @click="getPhoneCode()">{{getCodeBtn}}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="updatePhone()">确定</el-button>
                    <el-button size="small" @click="returnPage('phoneForm')">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="pageType===3&&!checkPhoneType" class="update-pwd-div">
            <h3>修改邮箱</h3>
            <el-form ref="emailForm" :rules="emailRules" :model="emailForm" label-width="80px">
                <el-form-item label="邮箱" prop="email" style="text-align: left">
                    <el-input v-model="emailForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="updateEmail()">确定</el-button>
                    <el-button size="small" @click="returnPage('emailForm')">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-if="checkPhoneType" class="update-pwd-div">
            <h3>验证手机号</h3>
            <div style="text-align: left;margin-bottom: 2px;font-size: 12px;color: gray;margin-left: 80px">向手机号{{userInfo.phone}}发送验证码</div>
            <el-form ref="checkPhoneForm" :rules="checkPhoneRules" :model="checkPhoneForm" label-width="80px">
                <el-form-item label="验证码" prop="phoneCode" style="text-align: left">
                    <el-input v-model="checkPhoneForm.phoneCode" style="width: 60%;" ></el-input>
                    <el-button style="margin-left: 5%;width: 35%" type="primary" :disabled="codeBtnDisable" @click="getCode()">{{getCodeBtn}}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="checkCode()">确定</el-button>
                    <el-button size="small" @click="returnPage('checkPhoneForm')">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserSafeInfo",
        data(){
            let checkPassword1 = (rule, value, callback) =>{
                let regEn = /^[a-zA-Z]\S{5,18}$/
                if(this.passwordForm.oldPassword===this.passwordForm.newPassword){
                    callback(new Error('新密码不能和原密码一致'));
                }else if(!regEn.test(value)){
                    callback(new Error('密码必须是以字母开头的6-18位字符'));
                }else{
                    callback();
                }
            };
            let checkPassword2 = (rule, value, callback) =>{
                this.$refs['passwordForm'].clearValidate('confirmPassword');
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                }else if (value !== this.passwordForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                }else{
                    callback();
                }
            };
            var checkPhone1 = (rule, value, callback) =>{
                let regEn = /^1[3456789]\d{9}$/
                if(!regEn.test(value)){
                    callback(new Error('手机号格式有误'));
                }
            };
            var checkPhone2 = (rule, value, callback) =>{
                let regEn = /^1[3456789]\d{9}$/
                if(!regEn.test(value)){
                    callback(new Error('手机号格式有误'));
                }else{
                    //调用后端接口
                    let params={phone:value}
                    this.$apiMethods.userApi.checkPhone(params).then(res=>{
                        if(res.data){
                            return callback(new Error('该手机号已被注册'));
                        }else{
                            callback();
                        }
                    })
                }
            };
            var checkEmail=(rule, value, callback) =>{
                let regEn = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
                if(!regEn.test(value)){
                    return callback(new Error('邮箱格式有误'));
                }
                callback();
            };
            return{
                pageType:0,
                lastPageType:0,
                userInfo:{},
                //设置密码
                passwordForm:{
                    oldPassword:'',
                    newPassword:'',
                    confirmPassword:''
                },
                passwordRules:{
                    oldPassword:[
                        {required: true ,message: '请输入旧密码'}
                    ],
                    newPassword:[
                        {required: true,validator: checkPassword1, trigger: 'blur'}
                    ],
                    confirmPassword:[
                        {required: true, validator: checkPassword2, trigger:['blur','change']}
                    ],
                },
                //校验手机号
                checkPhoneRules:{
                    phoneCode:[
                        {required:true,message:'请输入验证码',trigger: 'blur'}
                    ]
                },
                checkPhoneForm:{
                    phoneCode:''
                },
                //设置手机号
                phoneForm:{
                    phone:'',
                    code:''
                },
                phoneRules:{
                    phone:[
                        {required: true,validator: checkPhone2,trigger: 'blur'}
                    ],
                    code:[
                        {required:true,message:'请输入验证码'}
                    ]
                },
                //设置邮箱
                emailForm:{
                    email:''
                },
                emailRules:{
                    email:[
                        {required:true,validator: checkEmail,trigger: 'blur'}
                    ]
                },
                codeBtnDisable:false,
                getCodeBtn:'获取验证码',
                checkPhoneType:false
            }
        },
        methods:{
            //获取用户信息
            getUserInfo(){
                this.$apiMethods.userApi.getUserInfo().then(res=>{
                    if(res.code===200){
                        this.userInfo=res.data
                    }
                })
            },
            confirmUpdatePassword(){
                this.$utils.confirmWarning("是否修改密码？").then(res=>{
                    this.$refs['passwordForm'].validate((valid) => {
                        if(valid){
                            let param={
                                updatePwdType:1,
                                oldPassword:this.passwordForm.oldPassword,
                                password:this.passwordForm.newPassword
                            }
                            this.$apiMethods.userApi.updatePassword(param).then(res=>{
                                if(res.code===200){
                                    this.$utils.success2("密码修改成功！")
                                    this.jumpTabs(0,'passwordForm')
                                    this.getUserInfo()
                                }else if(res.code===-100){
                                    this.$utils.error2("原密码错误！")
                                }
                            })
                        }
                    })
                }).catch(err=>{})
            },
            jumpTabs(page,formName,openPhone){
                //保存上一次的页面
                this.lastPageType=this.pageType
                this.pageType=page
                if(openPhone){
                    this.checkPhoneType=true
                }
            },
            returnPage(formName){
                //清空表单
                if(formName&&this.$refs[formName]){
                    this.$refs[formName].resetFields();
                }
                this.pageType=this.lastPageType
                this.checkPhoneType=false

            },
            //获取验证码
            getCode(){
                this.$apiMethods.userApi.getVerifyCodeLogin().then(res=>{
                    if(res.code===200){
                        this.$utils.success2("验证码发送成功！")
                    }
                })
                //禁止重复点击
                this.codeBtnDisable = true;  //禁用按钮，防止多次触发
                this.time = 60;  //60秒后能继续按按钮
                this.timer1();
            },
            timer1(){   //验证码60s内不能继续点击的函数
                if(this.time > 0) {
                    this.time--;
                    this.getCodeBtn = this.time + "s后重新获取"
                    this.timer = setTimeout(this.timer1,1000)
                }else{
                    this.time = 0;
                    this.getCodeBtn = "获取验证码";
                    this.codeBtnDisable = false;
                    clearTimeout(this.timer);
                }
            },
            checkCode(){
                if(this.checkPhoneForm.phoneCode){
                    let param={
                        verifyCode:this.checkPhoneForm.phoneCode
                    }
                    this.$apiMethods.userApi.checkVerifyCode(param).then(res=>{
                        if(res.code===200){
                            if(res.data){
                                this.$utils.success2("校验成功！");
                                this.checkPhoneType=false
                                //可以直接获取验证码
                                this.codeBtnDisable = false;
                                this.time = 0;
                                this.timer1();
                                //这个表单清空
                                this.$refs['checkPhoneForm'].resetFields();
                            }else{
                                this.$utils.warning2("验证码错误！")
                            }
                        }
                    })
                }
            },
            getPhoneCode(){
                if(this.phoneForm.phone){
                    //调用接口
                    let param={
                        phone:this.phoneForm.phone
                    }
                    this.$apiMethods.userApi.getVerifyCode(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("验证码发送成功！")
                        }
                    })
                    //禁止重复点击
                    this.codeBtnDisable = true;  //禁用按钮，防止多次触发
                    this.time = 60;  //60秒后能继续按按钮
                    this.timer1();
                }
            },
            updatePhone(){
                this.$refs['phoneForm'].validate((valid) => {
                    if(valid){
                        let param={
                            phone:this.phoneForm.phone,
                            verifyCode:this.phoneForm.code
                        }
                        this.$apiMethods.userApi.updatePhone(param).then(res=>{
                            if(res.code===200){
                                this.$utils.success2('修改手机号成功')
                                this.jumpTabs(0,'phoneForm')
                                this.getUserInfo()
                                //可以直接获取验证码
                                this.codeBtnDisable = false;
                                this.time = 0;
                                this.timer1();
                            }
                        })
                    }
                })
            },
            updateEmail(){
                this.$refs['emailForm'].validate((valid) => {
                    if(valid){
                        let formData=new FormData();
                        formData.append('email',this.emailForm.email)
                        this.$apiMethods.userApi.updateUser(formData).then(res=>{
                            if(res.code===200){
                                this.$utils.success2('修改邮箱成功')
                                this.jumpTabs(0,'emailForm')
                                this.getUserInfo()
                            }
                        })
                    }
                })
            }
        },
        created() {
            this.getUserInfo()
        },
        watch:{
            pageType(newV,oldV){
                if(newV===1){
                    //清除表单
                }
            }
        }
    }
</script>

<style scoped>
    .safe-info-div{
        padding: 0 10%;
    }

    .info-div{
        display: flex;
        text-align: left;
    }
    
    .update-pwd-div{
        padding: 0 20%;
    }
</style>