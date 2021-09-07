<template>
    <div style="margin: 0;height: 100%;padding: 20px 20%;display: flex">
        <div class="adminDiv">
            <div class="adminLeftNavDiv">
                <div class="adminLeftNavTopDiv">
                    <el-menu :default-active="$route.path"
                             :default-openeds="['1','2']"
                             class="el-menu-demo"
                             :router="true">
                        <el-submenu class="subStyle" style="" index="1">
                            <template slot="title">个人中心</template>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/user/info">个人信息</el-menu-item>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/user/dynamic">个人动态</el-menu-item>
                        </el-submenu>
                        <el-submenu class="subStyle" index="2">
                            <template slot="title">安全管理</template>
<!--                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/novel">密码管理</el-menu-item>-->
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/user/safe">安全管理</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
                <div class="tipsToMyBook">小说管理请<span style="text-decoration: underline;color: #409EFF;cursor: pointer" @click="jumpMyBook">点击此处</span>转至我的图书</div>
            </div>
            <div class="adminRightDiv">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "UserIndex",
        methods:{
            jumpMyBook(){
                this.$router.push('/novel/person')
            }
        }
    }
</script>

<style scoped>
    .adminDiv{
        width: 100%;
        display: flex;
        height: auto;
        margin: 0;
    }

    .adminLeftNavDiv{
        width: 160px;
        max-width: 160px;
        text-align: left;

    }

    .adminLeftNavTopDiv{
        border: 1px solid #e4e7ed;
        background-color: #FFFFFF;
    }

    .adminRightDiv{
        border: 1px solid #e4e7ed;
        background-color: #FFFFFF;
        min-height: 600px;
        width: 750px;
    }

    .subStyle{
        border-bottom: 1px solid #e4e7ed;
    }

    .tipsToMyBook{
        margin-top: 10px;
        font-size: 10px;
        padding: 0 10px;
    }
</style>