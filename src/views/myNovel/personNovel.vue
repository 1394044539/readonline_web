<template>
    <div style="margin: 0;height: 100%;padding: 20px 20%;display: flex">
        <div class="myNovelDiv">
            <div class="myLeftNovelDiv">
                <el-menu :default-active="$route.path" :router=true class="el-menu-vertical-demo" mode="vertical">
                    <el-menu-item index="/novel/person" class="personNovelMenu">我的书架</el-menu-item>
                    <el-menu-item index="/novel/person/uploadList" class="personNovelMenu">我的上传</el-menu-item>
                    <el-menu-item index="/novel/person/mark" class="personNovelMenu">我的书签</el-menu-item>
                    <el-menu-item index="/novel/person/history" class="personNovelMenu">阅读历史</el-menu-item>
                </el-menu>
            </div>
            <div class="myRightNovelDiv">
                <router-view/>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "personNovel",
        data(){
            return {
                activeIndex: '1',
                mode:'vertical'
            }
        },
        computed:{
        },
        methods:{
            // handleSelect(key, keyPath){
            //     if(key==='myBook'){
            //         this.$router.push('/novel/person');
            //     }else if(key === 'myUpload'){
            //         this.$router.push('/novel/person/uploadList');
            //     }else if(key === 'myMark'){
            //         this.$router.push('/novel/person/mark');
            //     }else if(key === 'myHistory'){
            //         this.$router.push('/novel/person/history');
            //     }
            // }
        }
    }
</script>

<style scoped>
    .myNovelDiv{
        width: 100%;
        display: flex;
        height: auto;
        min-height: 500px;
    }

    .myLeftNovelDiv{
        border: 1px solid #e4e7ed;
        width: 20%;
        background-color: #FFFFFF;
    }

    .personNovelMenu{
        border: 1px solid #e4e7ed;
        height: 50px !important;
        line-height: 50px !important;
    }

    .myRightNovelDiv{
        width: 77%;
        background-color: #FFFFFF;
    }
</style>