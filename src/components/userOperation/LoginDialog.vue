<template>
    <el-dialog title="账号密码登录"
               :visible.sync="dialogFormLogin"
               :modal-append-to-body="true"
               :close-on-click-modal="false"
               @closed="closeFrom('accountForm')"
               width="25%"
               center>
        <el-form :model="accountForm" ref="accountForm" :rules="rules">
            <el-form-item prop="account">
                <el-input v-model="accountForm.account" autocomplete="off" placeholder="账号/手机号"/>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="accountForm.password" autocomplete="off"  placeholder="密码"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width: 100%" @keyup.enter.native="accountLogin('accountForm')" @click="accountLogin('accountForm')">登  录</el-button>
            </el-form-item>
            <div style="line-height: 20px"><el-link type="primary">忘记密码?</el-link></div>
        </el-form>
        <div class="dialog-footer">
            <hr/>
            <div style="display: inline-block;text-align: left;width: 50%;line-height: 30px;padding-top: 10px">
                <a @click="toReg" class="bottomOpr">立即注册</a>
            </div>
<!--            <div style="display: inline-block;text-align: right;width: 50%;line-height: 30px;padding-top: 10px">-->
<!--                <a class="bottomOpr">手机验证码登录</a>-->
<!--            </div>-->
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            isOpenFormLogin:{
                type: Boolean,
                default: false
            },
        },
        name: "LoginDialog",
        data() {
            return {
                dialogFormLogin: true,
                accountForm: {
                    account: '',
                    password: '',
                },
                rules: {
                    account:[
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
            }
        },
        computed:{

        },
        methods: {
            closeFrom(formName){
                if(this.$refs[formName]){
                    this.$refs[formName].resetFields();
                }
                this.$emit('closeLoginFrom',false)
            },
            accountLogin(formName){
                this.$refs[formName].validate((valid) => {
                    if(!valid){
                        return false;
                    }
                    let params = {
                        accountName: this.accountForm.account,
                        password: this.accountForm.password,
                        checkType: 1
                    }
                    this.$apiMethods.userApi.userLogin(params).then(res => {
                        if (res.code === -100) {
                            this.$utils.error2(res.msg, 1000)
                        } else if (res.code === 200) {
                            this.$utils.success2("登录成功！")
                            //存储localStorage
                            this.$store.commit('SET_USERINFO', res.data)
                            this.$store.commit('SET_USERNAME', res.data.username)
                            this.$store.commit('SET_TOKEN', res.data.token)
                            this.$store.commit('SET_LOGIN',true)
                            this.closeFrom(formName)
                            location.reload();
                        }
                    })
                })
            },
            toReg(){
                this.closeFrom()
                this.$router.push('/reg')
            },
            keyupSubmit(){
                document.onkeydown=e=>{
                    let _key=window.event.keyCode;
                    if(_key===13){
                        this.accountLogin('accountForm')
                    }
                }
            },
        },
        created(){
            this.keyupSubmit()
        },
        watch:{

        }
    }
</script>

<style scoped>
    .dialog-footer{
        padding-top: 20px;
        line-height: 30px;
    }

    .bottomOpr{
        cursor: pointer;
        text-decoration: unset;
    }

    .bottomOpr:hover{
        color: #409EFF;
        text-decoration: underline;
    }

</style>