<template>
    <div>
        <el-dialog
                title="添加管理员"
                :visible.sync="openDialog"
                width="35%"
                center
                :close-on-click-modal="false"
                @closed="closeFrom">
            <div class="add-admin-div">
                <el-form ref="adminForm" :label-position="'left'" :model="adminForm" :rules="adminRules" label-width="100px">
                    <el-form-item label="账号" prop="accountName">
                        <el-input v-model="adminForm.accountName"></el-input>
                    </el-form-item>
                    <el-form-item label="账号名" prop="userName">
                        <el-input v-model="adminForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input show-password v-model="adminForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input show-password v-model="adminForm.confirmPassword"></el-input>
                    </el-form-item>
                    <el-form-item style="text-align: center;margin-left: -100px">
                        <el-button size="small" type="primary" @click="confirmAdd">确认添加</el-button>
                        <el-button size="small" @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "AddAdminDialog",
        props:{
            openDialog:{
                type:Boolean,
                default:false
            },
        },
        data(){
            var checkAccount = (rule, value, callback) =>{
                if(!value){
                    return callback(new Error('账号不能为空'));
                }
                //调用后端接口
                let params={accountName:value}
                this.$apiMethods.userApi.checkAccountName(params).then(res=>{
                    if(res.data){
                        callback(new Error('该账号已被注册'));
                    }else{
                        callback();
                    }
                })
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
                this.$refs['adminForm'].clearValidate('password');
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                }else if (value !== this.adminForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                }else{
                    callback();
                }
            };
            return{
                adminForm:{
                    accountName:'',
                    userName:'',
                    password:'',
                    confirmPassword:'',
                },
                adminRules:{
                    accountName: [
                        {required: true,validator: checkAccount, trigger: 'change'}
                    ],
                    userName: [
                        {required: true, message: '请填写账号名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, validator: checkPassword1, trigger: ['blur', 'change']}
                    ],
                    confirmPassword: [
                        {required: true, validator: checkPassword2, trigger: ['blur', 'change']}
                    ],
                }
            }
        },
        methods:{
            closeFrom(){
                this.resetForm()
                this.openDialog=false
                this.$emit('closeFrom',this.openDialog)
            },
            resetForm(){
                this.$refs.adminForm.resetFields();
            },
            confirmAdd(){
                this.$refs['adminForm'].validate((valid) => {
                    if(valid){
                        this.$utils.confirmWarning('是否添加新的管理员？').then(res=>{
                            let param={
                                accountName:this.adminForm.accountName,
                                password:this.adminForm.password,
                                userName:this.adminForm.userName
                            }
                            this.$apiMethods.userApi.addAdmin(param).then(res=>{
                                if(res.code===200){
                                    this.$utils.success2("添加管理员成功")
                                    this.closeFrom()
                                }
                            })
                        }).catch(err=>{})
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .add-admin-div{
        padding: 0 15%;
    }
</style>