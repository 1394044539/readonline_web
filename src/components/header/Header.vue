<template>
    <el-header>
        <div class="myHeader">
                <HeaderMenu />
<!--            </div>-->
                <HeaderUser />
        </div>
    </el-header>
</template>

<script>
    import HeaderMenu from '../header/HeaderMenu'
    import HeaderUser from '../header/HeaderUser'
    export default {
        name: "Header",
        components: {
            HeaderMenu,
            HeaderUser
        },
        computed:{
        },
        data () {
            return {
            }
        },
        methods: {
        },
        created(){
        },
        watch:{
        }

    }
</script>

<style scoped>
    .el-header {
        width: 100%;
        color: #333;
        flex: 1;
        text-align: center;
        line-height: 70px;
        padding: 0 !important;
        height: 70px !important;
        /*background: #545c64;*/
    }

    .myHeader {
        background-color: #545c64;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 20%;
        height: 70px;
    }
</style>