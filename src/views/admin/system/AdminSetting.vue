<template>
    <div>
        <h2>管理员设置界面</h2>
        <el-divider></el-divider>
        <div class="admin-set-div">
            <div class="admin-set-table-div">
                <h4>管理员列表</h4>
                <div style="text-align: left;padding-left: 100px;margin-bottom: 20px">
                    <el-button size="small" type="primary" @click="addAdmin">添加管理员</el-button>
                </div>
                <div style="padding: 0 100px">
                    <el-table
                            :data="adminList"
                            style="width: 100%;"
                            min-height="200"
                            max-heigth="400"
                            size="small">
                        <el-table-column
                                prop="accountName"
                                label="账号"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="userName"
                                label="账号名"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="createBy"
                                label="创建人"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="createTime"
                                label="创建时间"
                                width="150">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                prop="opr"
                                label="操作"
                                width="50">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.accountName!==$store.state.userInfo.accountName" @click="deleteAdmin(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="table-page-div">
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
            <div class="pwd-set-div">
                <el-divider></el-divider>
                <h4>密码设置</h4>
                <div style="padding: 0 20%">
                    <p style="text-align: left">当前登录管理员账号：<span style="font-weight: bold">{{this.$store.state.userInfo.accountName}}</span></p>
                    <p style="text-align: left">当前登录管理员账号名：
                        <span v-if="!openEditUsername" style="font-weight: bold">{{adminUserNameShow}}</span>
                        <span v-else><el-input @blur="checkBlur($event)" style="width: 150px"  size="small" v-model="adminUserName"></el-input></span>
                        <i style="margin-left: 10px;cursor: pointer;" class="el-icon-edit" @mousedown="updateUserName"></i>
                    </p>
                    <el-form ref="adminForm" :label-position="'left'" :model="adminForm" :rules="adminRules" label-width="100px">
                        <el-form-item label="输入旧密码" prop="oldPwd">
                            <el-input show-password v-model="adminForm.oldPwd"></el-input>
                        </el-form-item>
                        <el-form-item label="输入新密码" prop="newPwd">
                            <el-input show-password v-model="adminForm.newPwd"></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="confirmPwd">
                            <el-input show-password v-model="adminForm.confirmPwd"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="updatePwd">修改密码</el-button>
                            <el-button size="small" @click="resetForm">重置</el-button>
                            <el-button size="small" type="warning" @click="resetPwd">重置为初始密码</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <AddAdminDialog :openDialog="openAddDialog" @closeFrom="closeFrom"></AddAdminDialog>
    </div>
</template>

<script>
    import AddAdminDialog from '@/components/admin/AddAdminDialog'
    export default {
        name: "AdminSetting",
        data(){
            var checkPassword1 = (rule, value, callback) =>{
                let regEn = /^[a-zA-Z]\S{5,18}$/
                if(!regEn.test(value)){
                    callback(new Error('密码必须是以字母开头的6-18位字符'));
                }else{
                    callback();
                }
            };
            var checkPassword2 = (rule, value, callback) =>{
                this.$refs['adminForm'].clearValidate('newPwd');
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                }else if (value !== this.adminForm.newPwd) {
                    callback(new Error('两次输入密码不一致!'));
                }else{
                    callback();
                }
            };
            return{
                openAddDialog:false,
                adminList:[],
                pageNum:1,
                pageSize:10,
                total:0,
                adminForm:{
                    oldPwd:'',
                    newPwd:'',
                    confirmPwd:''
                },
                adminRules: {
                    oldPwd: [
                        {required: true,message: '请填写原密码', trigger: 'change'}
                    ],
                    newPwd: [
                        {required: true, validator: checkPassword1, trigger: 'blur'}
                    ],
                    confirmPwd: [
                        {required: true, validator: checkPassword2, trigger: ['blur', 'change']}
                    ],
                },
                adminUserNameShow:this.$store.state.username || '',
                adminUserName:this.$store.state.username || '',
                openEditUsername:false
            }
        },
        created(){
            this.getAdminList()
        },
        components:{AddAdminDialog},
        methods:{
            closeFrom(){
                this.openAddDialog=false
                this.getAdminList()
                this.resetForm()
            },
            getAdminList(){
                let param={
                    roleType: 0,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                }
                this.$apiMethods.userApi.getUserList(param).then(res=>{
                    if(res.code===200){
                        this.adminList=res.data.records
                        this.total=res.data.total
                    }
                })
            },
            handleCurrentChange(val){
                this.pageNum=val
                this.getAdminList()
            },
            handleSizeChange(val){
                this.pageSize=val
                this.getAdminList()
            },
            resetForm(){
                this.$refs.adminForm.resetFields();
            },
            resetPwd(){
                this.$utils.confirmWarning('是否重置为初始密码？').then(res=>{
                        this.$apiMethods.userApi.initAdminPwd().then(res=>{
                            if(res.code===200){
                                this.$utils.success2("密码重置成功")
                                this.resetForm()
                                this.getAdminList()
                            }
                        })
                }).catch(err=>{})
            },
            updatePwd(){
                this.$refs['adminForm'].validate((valid) => {
                    if(valid){
                        let param={
                            oldPassword:this.adminForm.oldPwd,
                            password:this.adminForm.newPwd
                        }
                        this.$apiMethods.userApi.updatePassword(param).then(res=>{
                            if(res.code===200){
                                this.$utils.success2("密码修改成功")
                                this.resetForm()
                                this.getAdminList()
                            }else if(res.code===-100){
                                this.$utils.error2("原密码错误！")
                            }
                        })
                    }

                })
            },
            deleteAdmin(obj){
                this.$utils.confirmWarning('是否删除管理员用户(该操作很危险)？').then(res=>{
                    let param={
                        ids: obj.id.toLocaleString()
                    }
                    this.$apiMethods.userApi.deleteUser(param).then(res=>{
                        this.$utils.success2("删除成功！")
                        this.resetForm()
                        this.getAdminList()
                    })
                })
            },
            addAdmin(){
                this.openAddDialog=true
            },
            updateUserName(){
                if(this.openEditUsername){
                    //当前打开，关闭就直接更新
                    this.updateUser()
                }else{
                    //把展示的值放到input中去
                    this.adminUserName=this.adminUserNameShow
                }
                this.openEditUsername=!this.openEditUsername
            },
            updateUser(){
                if(this.adminUserName && this.adminUserName!==this.adminUserNameShow){
                    let formData=new FormData();
                    formData.append('userName',this.adminUserName)
                    this.$apiMethods.userApi.updateUser(formData).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("修改成功")
                            this.$store.commit('SET_USERNAME', this.adminUserName)
                            this.adminUserNameShow=this.adminUserName
                        }
                    })
                }
            },
            checkBlur(){
                //移开不作操作
                this.openEditUsername=false
            }
        }
    }
</script>

<style scoped lang="less">
    .admin-set-div{
        padding: 0 10%;


    }

    .pwd-set-div{

    }

    .admin-set-table-div{
        min-height: 400px;
    }
    .table-page-div{
        margin-top: 5px;
    }
</style>