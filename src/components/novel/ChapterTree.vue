<template>
    <el-drawer
            title="章节列表"
            :visible.sync="drawer"
            direction="ltr"
            size='20%'
            :before-close="handleClose">
        <div id="treeListDiv" style="padding: 5%;max-height: 600px;overflow-y:auto;">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>

    </el-drawer>
</template>

<script>
    export default {
        name: "ChapterTree",
        props: {
            isOpenTree: {
                type: Boolean,
                default: false
            },
            novelId:{
                type: String,
                default: ''
            }
        },
        data(){
            return{
                drawer:false,
                treeData:[],
                defaultProps:{
                    children: 'children',
                    label: 'chapterName'
                }
            }
        },
        methods:{
            initTree(){
                this.$utils.openLoading('打开目录')
                let param={
                    id:this.novelId
                }
                this.$apiMethods.novelApi.getNovelChapterInfo(param).then(res=>{
                    if(res.code===200){
                        this.treeData=res.data
                    }
                    this.$utils.closeLoading()
                })
            },
            handleClose(){
                this.drawer=false;
                this.treeData=[]
                this.$emit('closeTree',false)
            },
            handleNodeClick(data){
                this.$router.push({
                    path:'/novel/novelRead',
                    query:{
                        chapterId:data.id,
                        novelId:this.novelId,
                    }
                })
                this.handleClose()
            }
        },
        watch:{
            // 监听改变
            isOpenTree(){
                this.drawer = this.isOpenTree
                if(this.drawer===true){
                    this.initTree()
                }
            },
        }
    }
</script>

<style scoped>

</style>