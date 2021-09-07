<template>
    <div style="margin: 0;height: 100%;padding: 0 20%">
        <div style="line-height: 80px">
            <el-page-header @back="goBack"/>
        </div>
        <div>
            <h2>账号注册</h2>
        </div>
        <div style="text-align: center;padding: 0 30%">
            <el-form :model="userReg"
                     :rules="rules"
                     ref="userReg"
                     label-width="80px"
                     class="demo-ruleForm"
                     :label-position="labelPosition"
                     :status-icon="true">
                <div class="">
                    <el-form-item label="账号" prop="accountName">
                        <el-input v-model="userReg.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="userReg.password" :show-password="true"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input v-model="userReg.confirmPassword" :show-password="true"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="userReg.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code" style="text-align: left">
                        <el-input v-model="userReg.code" style="width: 50%;" ></el-input>
                        <el-button style="margin-left: 5%;width: 45%" type="primary" :disabled="codeBtnDisable" @click="getCode('userReg')">{{getCodeBtn}}</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('userReg')">注    册</el-button>
                        <el-button @click="resetForm('userReg')">重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Reg",
        data(){
            var checkAccount = (rule, value, callback) =>{
                let regEn = /^(\w){6,18}$/
                if(!regEn.test(value)){
                    callback(new Error('账号必须为字母数字下划线组成的6-18位字符'));
                }else{
                    //调用后端接口
                    let params={accountName:value}
                    this.$apiMethods.userApi.checkAccountName(params).then(res=>{
                        if(res.data){
                            callback(new Error('该账号已被注册'));
                        }else{
                            callback();
                        }
                    })
                }
            };
            var checkPassword1 = (rule, value, callback) =>{
                let regEn = /^[a-zA-Z]\S{5,18}$/
                if(!regEn.test(value)){
                    callback(new Error('密码必须是以字母开头的6-18位字符'));
                }else{
                    callback();
                }
            };
            var checkPassword2 = (rule, value, callback) =>{
                this.$refs['userReg'].clearValidate('confirmPassword');
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                }else if (value !== this.userReg.password) {
                    callback(new Error('两次输入密码不一致!'));
                }else{
                    callback();
                }
            };
            var checkPhone = (rule, value, callback) =>{
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
            return{
                active:0,
                labelPosition:'left',
                userReg:{
                    accountName:'',
                    password:'',
                    confirmPassword:'',
                    phone:'',
                    code:'',
                },
                rules:{
                    accountName:[
                        {required: true,validator: checkAccount, trigger: 'blur'}
                    ],
                    password:[
                        {required: true,validator: checkPassword1, trigger: 'blur'}
                    ],
                    confirmPassword:[
                        {required: true, validator: checkPassword2, trigger:[ 'blur','change']}
                    ],
                    phone:[
                        {required: true,validator: checkPhone, trigger: 'blur'}
                    ],
                    code:[
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                },
                getCodeBtn:'获取验证码',
                codeBtnDisable:false,
                time : 0
            }
        },
        methods:{
            goBack() {
                this.$router.go(-1);
            },
            //获取验证码
            getCode(formName){
                //正则校验
                let phoneReg = /^[1][3,5,7,8][0-9]{9}$/;
                if(!phoneReg.test(this.userReg.phone)){    //发请求时先正则检验下手机号
                    return;
                }
                //调用接口
                let param={
                    phone:this.userReg.phone
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
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        let param={
                            accountName:this.userReg.accountName,
                            phone:this.userReg.phone,
                            verifyCode:this.userReg.code,
                            password:this.userReg.password,
                            checkType:0
                        }
                        this.$apiMethods.userApi.userReg(param).then(res=>{
                            if(res.code===200){
                                this.$utils.success2("注册成功！")
                                //跳转到首页去，并且打开登录弹窗
                                this.$store.state.needOpen.show=true
                                this.$router.push('/novel/list');
                            }
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>