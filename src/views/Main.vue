<template>
    <el-container direction="vertical">
        <Header/>
        <el-main>
            <router-view/>
        </el-main>
        <Footer/>
    </el-container>

</template>

<style>
    .el-main {
        height: 100%;
        color: #333;
        flex: 1;
        text-align: center;
        padding: 0!important;
        margin-bottom: 40px;
    }
</style>

<script>
    import Header from '../components/header/Header';
    import Footer from '../components/Footer'
    export default {
        name: 'Main',
        components: {Header,Footer}
    }
</script>
