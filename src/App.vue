<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import '@/mixins/index.less'
</script>
<style>
  body {
    padding: 0;
    margin: 0;
    background-color: #f7f6f2;
  }
  .el-container{
    padding: 0;
    margin: 0;
  }
  #app{
    min-height: 100%;
  }
</style>

<script>
  import Main from './views/Main'
  import Header from './components/header/Header';
  import Footer from './components/Footer'
  export default {
    components: {Header,Footer,Main},
    methods:{
      initNovelType(){
        let param={
          dictClass:'NOVEL_TYPE'
        }
        this.$apiMethods.dataApi.getDictByClass(param).then(res=>{
          if(res.code===200){
            this.$store.commit('SET_NOVEL_TYPE',res.data)
          }
        })
      }
    },
    created() {
      this.initNovelType()
    }
  }
</script>
