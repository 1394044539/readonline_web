<template>
    <div style="margin: 0;height: 100%;padding: 0 20%;padding-bottom: 20px">
        <div class="searchHeader">
            <el-input style="width:500px" size="200" v-model="input" clearable placeholder="请输入搜索内容"></el-input>
            <el-button style="margin:0 20px"type="primary" @click="searchNovel">搜索</el-button>
        </div>
        <div class="">
            <el-menu :default-active="getRouterIndex" class="typeMenu el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="main" class="typeMenu">首页</el-menu-item>
                <el-menu-item v-for="(type,index) in novelTypeList" :index="type.dictKey" class="typeMenu">{{getValue(type.dictValue)}}</el-menu-item>
<!--                <el-menu-item index="rank" class="typeMenu">排行榜</el-menu-item>-->
                <el-menu-item index="all" class="typeMenu">全部</el-menu-item>
            </el-menu>
        </div>
        <div>
            <router-view v-if="isRouterAlive"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
            return {
                reload: this.reload
            }
        },
        data(){
            return{
                input: '',
                pageType:'',
                pageTypeName:'',
                activeIndex:'1',
                novelTypeList:[],
                isRouterAlive: true
            }
        },
        methods:{
            handleSelect(key,keyPath){
                this.pageType=''
                this.input=''
                if(key === 'main'){
                    this.$router.push("/novel/list")
                }else if(key === 'all'){
                    this.$router.push("/novel/all")
                }else if(key === 'rank'){
                    this.$router.push("/novel/rank")
                }else{
                    this.$router.push({path: "/novel/typeNovel/"+key})
                    this.pageType=key
                }
            },
            initData(){
                this.$apiMethods.dataApi.getMainNovelType().then(res=>{
                    if(res.code===200){
                        this.novelTypeList=res.data
                    }
                })
            },
            reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                })
            },
            searchNovel(){
                if(!this.input.length){
                    this.$router.push('/novel/list')
                }else {
                    this.$router.push({
                        path:'/novel/search',
                        query:{
                            searchInput:this.input,
                            type:this.pageType,
                            typeName:this.getTypeName(this.pageType)
                        }
                    })
                }
            },
            getTypeName(type){
                for(let typeObj of this.novelTypeList){
                    if(typeObj.dictKey===type){
                        return typeObj.dictValue
                    }
                }
            }
        },
        created() {
            this.initData()
        },
        computed:{
            getValue(){
                return (value) =>{
                    if(!value.endsWith("小说")){
                        value+="小说"
                    }
                    return value
                }
            },
            getRouterIndex(){
                let path=this.$route.path
                if(path==='/novel/list'){
                    return 'main'
                }
                if(path==='/novel/all'){
                    return 'all'
                }
                if(path==='/novel/rank'){
                    return 'rank'
                }
                return path.substring(path.lastIndexOf('/')+1)

            }
        }
    }
</script>

<style scoped>
    .searchHeader{
        justify-content: center;
        display: flex;
        margin: 20px 50px
    }

    .typeMenu{
        height: 50px !important;
        line-height: 50px !important
    }
</style>