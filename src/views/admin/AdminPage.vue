<template>
    <div style="margin: 0;height: 100%;padding: 20px 150px;display: flex">
        <div class="adminDiv">
            <div class="adminLeftNavDiv">
                <div class="adminLeftNavTopDiv">
                    <el-menu :default-active="$route.path"
                             :default-openeds="['1','2','3','4']"
                             class="el-menu-demo"
                             :router="true">
                        <el-submenu class="subStyle" style="" index="1">
                            <template slot="title">用户管理</template>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/user">用户管理</el-menu-item>
<!--                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="1-2">角色管理</el-menu-item>-->
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/dynamic">动态管理</el-menu-item>
                        </el-submenu>
                        <el-submenu class="subStyle" index="2">
                            <template slot="title">小说管理</template>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/novel">小说管理</el-menu-item>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/examine">小说审核</el-menu-item>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/history">书签管理</el-menu-item>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/collection">收藏管理</el-menu-item>
                        </el-submenu>
                        <el-submenu class="subStyle" index="3">
                            <template slot="title">系统管理</template>
<!--                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/pageManager">排版管理</el-menu-item>-->
<!--                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/dict">字典管理</el-menu-item>-->
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/setting">管理员设置</el-menu-item>
                            <el-menu-item style="min-width: unset;height: 40px;line-height: 40px" index="/novel/admin/notice">公告管理</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </div>
            </div>
            <div class="adminRightDiv">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AdminPage"
    }
</script>

<style scoped>
    .adminDiv{
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: auto;
        margin: 0;
    }

    .adminLeftNavDiv{
        width: 200px;
        max-width: 200px;
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
        width: 100%;
        overflow-x: hidden;
    }

    .subStyle{
        border-bottom: 1px solid #e4e7ed;
    }
</style>