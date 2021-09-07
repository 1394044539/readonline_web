<template>
    <div>
        <div class="historyHeaderDiv">
            <div style="width: 30%">
                <h2 style="text-align: left;margin: 0">书架列表</h2>
            </div>
            <div style="width: 50%"></div>
        </div>
        <hr style="margin: 0"/>
        <div class="novelCatalogDiv">
            <div class="novelCatalogOperation">
                <div class="leftOperationBtn">
                    <el-button type="primary" size="small" @click="createCatalog">新建文件夹</el-button>
                    <el-button type="primary" size="small" @click="downloadAllNovel">下载全部</el-button>
                </div>
                <div class="rightOperationBtn">
                    <el-button type="primary" size="small" @click="clickUploadBtn">我要上传</el-button>
                </div>
            </div>
            <div class="novelCatalogViewHeader">
                <div class="viewHeaderIcon">
                    <div><i style="cursor: pointer" @click="rebackParent" class="el-icon-back"></i></div>
                    <div><i style="cursor: pointer" @click="getCollectList" class="el-icon-refresh"></i></div>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="viewHeaderBread">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item style="cursor: pointer" @click.native="jumpBread(bread.index,bread.id,bread.name)" v-for="(bread,index) in breadList">{{bread.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="viewHeaderChoice">
                    <el-dropdown size="mini" trigger="click" @command="choiceType">
                        <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon--right"></i>{{listType}}
                        </span>
                        <template #dropdown  >
                            <el-dropdown-menu>
                                <el-dropdown-item command="all">全部</el-dropdown-item>
                                <el-dropdown-item command="collect">平台收藏</el-dropdown-item>
                                <el-dropdown-item command="upload">自主上传</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <el-divider direction="vertical"></el-divider>
                <div class="viewHeaderSearch">
                    <el-input v-model="searchNovel" style="height: 100% !important;line-height: 100% !important;" placeholder="请输入小说" >
                        <i style="line-height: unset;cursor: pointer" @click="getCollectList" slot="suffix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
            </div>
            <div class="novelCatalogView" v-if="list.length>0" v-loading="myloading">
                <div @contextmenu.prevent="rightClick(novel,$event)"
                     v-for="(novel,index) in list"
                     @click="novel.type===0?intoCatalog(novel.id,novel.name):(novel.id?jumpNovel(novel.novelId,novel.name):cancelCollection(novel.id,2))"
                     class="novelInfo" >
                    <div v-if="novel.type===1" class="novelImg">
                        <el-image
                            style="width: 100%; height: 100%"
                            :src="novel.novelImg?'/img/'+novel.novelImg:require('@/assets/img/moimg.gif')"
                            fit="fill">
                        </el-image>
                    </div>
                    <div v-if="novel.type===0" class="novelImg" style="border: unset">
                        <el-image
                                  style="width: 100%; height: 100%"
                                  :src="require('@/assets/img/catalog.png')"
                                  fit="contain">
                        </el-image>
                    </div>
                    <div><a class="novelImga">{{novel.type===1?(novel.name?novel.name:'资源不存在'):novel.name}}</a></div>
                </div>
            </div>
            <div v-if="isNotContext" class="novelCatalogView" >
                <h2 v-if="breadList.length===1" style="text-align: center;width: 100%;font-weight: unset">书架中暂无小说，欢迎收藏或自主上传</h2>
            </div>
        </div>

<!--        右键菜单-->
        <div v-show="menuVisible">
            <ul v-show="choseNovel.type===1" id="menu1" class="menu">
                <li class="menu__item" @click="jumpNovel(choseNovel.novelId,choseNovel.name)">观看</li>
                <li class="menu__item" @click="openTree=true;showTree=true">移动到</li>
                <li class="menu__item" @click="cancelCollection(choseNovel.id,1)">取消收藏</li>
<!--                <li class="menu__item" @click="share">分享</li>-->
                <li class="menu__item" @click="downloadNovel">下载</li>
            </ul>
            <ul v-show="choseNovel.type===0" id="menu2" class="menu">
                <li class="menu__item" @click="intoCatalog(choseNovel.id,choseNovel.name)">进入</li>
                <li class="menu__item" @click="openTree=true;showTree=true">移动到</li>
<!--                <li class="menu__item" @click="share">分享</li>-->
                <li class="menu__item" @click="updateCatalog(choseNovel.id,choseNovel.name)">重命名</li>
                <li class="menu__item" @click="deleteCatalog(choseNovel.id)">删除</li>
                <li class="menu__item" @click="downloadNovel">下载</li>
            </ul>
        </div>

<!--        移动-->
        <el-dialog :close-on-click-modal=false
                   title="移动到"
                   width="30%"
                   :visible.sync="openTree"
                   @closed="closeTree">
            <div class="treeDiv">
                <el-tree
                        v-if="showTree"
                        :load="getChildCatalog"
                         :props="defaultProps"
                         lazy
                         ref="tree"
                ></el-tree>
            </div>
            <div style="margin-top: 10px">
                <el-button size="small" @click="closeTree">取消</el-button>
                <el-button type="primary" size="small" @click="moveNovel">确定</el-button>
            </div>
        </el-dialog>

<!--        分享页面-->
        <ShareDialog :isOpen="isOpen" :shareList="shareList" @reback="reback"></ShareDialog>
    </div>

</template>

<script>
    import ShareDialog from '../../components/novel/ShareDialog'

    export default {
        name: "personList",
        components:{ShareDialog},
        data(){
            return {
                myloading:false,
                defaultProps:{
                    children: 'children',
                    label: 'name',
                },
                listType:'全部',
                collectChannel:'',
                pageNum : 1,
                pageSize : 10,
                list:[],
                searchNovel:'',
                menuVisible:false,
                choseNovel:{},
                parentId:'',
                nowParentId:'',
                breadList:[{
                    index:0,
                    id:'',
                    name:'我的书架'
                }],
                catalogList:[],
                catalogId:'',
                openTree:false,
                showTree:false,
                shareList:[],
                isOpen:false,
                isNotContext:false
            }
        },
        methods:{
            reback(val){
                this.isOpen=val
            },
            share(){
                this.shareList=[]
                let obj={
                    id:this.choseNovel.type===0?this.choseNovel.id:this.choseNovel.novelId,
                    name:this.choseNovel.name,
                    type:this.choseNovel.type
                }
                this.shareList.push(obj)
                this.isOpen=true
            },
            closeTree(val){
                this.openTree=false
                this.showTree=false
            },
            getChildCatalog(node, resolve){
                if(!node.data){
                    let obj=[{
                        id:"",
                        novelId:null,
                        name:"我的书架",
                        type:0,
                        novelImg:null,
                        parentId:"",
                        children:[],
                        collectChannel:null
                    }]
                    return resolve(obj);
                }

                let param = {
                    parentId:node.data?node.data.id:'',
                    type:0 //0代表目录
                }
                this.$apiMethods.novelApi.getTreeCollection(param).then(res=>{
                    if(res.code===200){
                        resolve(res.data);
                    }
                })
            },
            downloadAllNovel(){
                this.$utils.confirmWarning("是否要下载全部小说?(因为开发水平不够，需要等待一段时间且空文件无法下载)","下载").then(res=>{
                    let obj={
                        list:[{
                            id:'',
                            type:0
                        }]
                    }
                    window.location.href = "http://localhost:8092/novel/download?params="+encodeURIComponent(JSON.stringify(obj),"utf-8")+"&authorization="+localStorage.getItem("authorization");
                }).catch((err)=>{})
            },
            downloadNovel(){
                let obj={
                    list:[{
                        id:this.choseNovel.type===0?this.choseNovel.id:this.choseNovel.novelId,
                        type:this.choseNovel.type
                    }]
                }
                const params={
                    params:encodeURIComponent(JSON.stringify(obj),"utf-8")
                }
                this.$dowloadAxios.downloadFile('/novel/download',params)
            },
            //移动小说
            moveNovel(){
                //1、判断是否没有选择
                let data=this.$refs.tree.getCurrentNode()
                if(!data){
                    this.$utils.warning2("请选择目录")
                }else{
                    if(this.choseNovel.type===1){
                        //小说
                        this.$utils.confirmWarning("是否要将小说移动到"+data.name+"中？").then(res=>{
                            let param={
                                choseId:this.choseNovel.id,
                                targetId:data.id,
                                copyOrMove:0 //移动
                            }
                            this.$apiMethods.novelApi.moveOrCopyNovel(param).then(res=>{
                                if(res.code===200){
                                    this.$utils.success2("移动成功！")
                                    this.closeTree()
                                    this.getCollectList()
                                }
                            })
                        }).catch((err)=>{})
                    }else if(this.choseNovel.type===0){
                        //文件夹
                        this.$utils.confirmWarning("是否要将文件夹移动到"+data.name+"中？").then(res=>{
                            let param={
                                choseId:this.choseNovel.id,
                                targetId:data.id,
                                copyOrMove:0 //移动
                            }
                            this.$apiMethods.novelApi.moveOrCopyCatalog(param).then(res=>{
                                if(res.code===200){
                                    this.$utils.success2("移动成功！")
                                    this.closeTree()
                                    this.getCollectList()
                                }
                            })
                        }).catch((err)=>{})
                    }
                }
            },
            rebackParent(){
                if(this.breadList.length===1){
                    this.$utils.warning2("已在最上层")
                }else{
                    //拿到上一次目录
                    this.subBread()
                }
            },
            subBread(){
                this.searchNovel=''
                //1、获取上一层的id和name
                let length=this.breadList.length
                let obj=this.breadList[length-2]
                this.parentId=obj.id
                //2、要修改breadList
                let newList=[]
                for(let obj of this.breadList){
                    if(obj.index<=length-2){
                        newList.push(obj)
                    }
                }
                this.breadList=newList
                this.getCollectList()
            },
            //跳转面包屑
            jumpBread(index,id,name){
                this.searchNovel=''
                let newList=[]
                for(let obj of this.breadList){
                    if(obj.index<=index){
                        newList.push(obj)
                    }
                    if(obj.index===index){
                        this.parentId=obj.id
                    }
                }
                this.breadList=newList
                this.getCollectList()
            },
            addBread(id,name){
                let length=this.breadList.length
                let obj={
                    index:length,
                    id:id,
                    name:name
                }
                this.breadList.push(obj)
            },
            deleteCatalog(id){
                this.$utils.confirmWarning("是否删除文件夹(文件夹下收藏的小说会一并删除)").then(res=>{
                    let param={
                        ids: id.toLocaleString()
                    }
                    this.$apiMethods.novelApi.deleteCatalog(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("删除成功")
                            this.getCollectList()
                        }
                    })
                }).catch(err=>{})
            },
            updateCatalog(id,name){
                this.$prompt('请输入文件夹名', '修改文件名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputValue:name
                }).then(({ value }) => {
                    let param={
                        choseId:id,
                        catalogName:value
                    }
                    this.$apiMethods.novelApi.updateCatalog(param).then(res=>{
                        if(res.code===200){
                            this.$utils.success2("修改成功");
                            this.getCollectList()
                        }
                    })
                })
            },
            intoCatalog(id,name){
                this.searchNovel=''
                this.parentId=id
                this.addBread(id,name)
                this.getCollectList()
            },
            jumpNovel(id,name){
                this.$router.push({
                    path:'/novel/novelInfo',
                    query:{
                        novelId:id,
                        novelName:name
                    }
                });
            },
            getCollectList(){
                this.myloading=true
                this.isNotContext=false
                let param = {
                    name: this.searchNovel,
                    collectChannel : this.collectChannel,
                    parentId:this.parentId,
                    type:2 //2代表全部都要
                }
                this.$apiMethods.novelApi.getTreeCollection(param).then(res=>{
                    if(res.code===200){
                        this.list=res.data
                        this.myloading=false
                        if(this.list.length===0){
                            this.isNotContext=true
                        }
                    }
                })
            },
            getCatalogList(){
                let param = {
                    parentId:this.catalogId,
                    type:0 //0代表只要文件夹
                }
                this.$apiMethods.novelApi.getTreeCollection(param).then(res=>{
                    if(res.code===200){
                        this.catalogList=res.data
                    }
                })
            },
            //选择筛选模式
            choiceType(command){
                if(command==='all'){
                    this.listType='全部'
                    this.collectChannel = ''
                }else if(command==='collect'){
                    this.listType='平台收藏'
                    this.collectChannel = 1
                }else if(command==='upload'){
                    this.listType='自主上传'
                    this.collectChannel = 0
                }
                this.getCollectList()
            },
            clickUploadBtn(){
                this.$router.push('/novel/person/upload');
            },
            createCatalog(){
                this.$prompt('请输入文件夹名', '创建文件夹', {
                    confirmButtonText: '创建',
                    cancelButtonText: '取消',
                    closeOnClickModal:false,
                    inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]{1,16}$/,
                    inputErrorMessage: '请输入1~16个字的中文或英文名字'
                }).then(({ value }) => {
                    let param = {
                        catalogName: value,
                        parentId: this.parentId
                    }
                    this.$apiMethods.novelApi.createCatalog(param).then(res => {
                        if (res.code === 200) {
                            this.$utils.success2("创建成功")
                            this.getCollectList()
                        }
                    })
                })
            },
            cancelCollection(id,type){
                //type:1是正常取消，2是异常取消
                let message;
                if(type===1){
                    message="是否取消收藏"
                }else if(type===2){
                    message="该小说已被原上传者删除，是否取消收藏?"
                }else{
                    return
                }
                this.$confirm(message, '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    let params={
                        id:id
                    }
                    this.$apiMethods.novelApi.cancelCollection(params).then(res=>{
                        if(res.code===200){
                            this.$utils.success2('取消成功')
                            this.getCollectList()
                        }
                    })
                })
            },
            rightClick(row, event) {
                this.choseNovel=row
                this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
                this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
                var menu
                if(row.type===1){
                    menu=document.querySelector('#menu1');
                }else if(row.type===0){
                    menu=document.querySelector('#menu2');
                }
                this.styleMenu(menu);
            },
            foo() {
                // 取消鼠标监听事件 菜单栏
                this.menuVisible = false;
                document.removeEventListener('click', this.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
            },
            styleMenu(menu) {
                if (event.clientX > 1800) {
                    menu.style.left = event.clientX - 100 + 'px';
                } else {
                    menu.style.left = event.clientX + 1 + 'px';
                }
                document.addEventListener('click', this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
                if (event.clientY > 700) {
                    menu.style.top = event.clientY - 30 + 'px';
                } else {
                    menu.style.top = event.clientY - 10 + 'px';
                }
            },
            keyupSubmit(){
                document.onkeydown=e=>{
                    let _key=window.event.keyCode;
                    if(_key===13){
                        this.getCollectList()
                    }
                }
            },
        },
        created() {
            this.getCollectList()
            this.keyupSubmit()
        },
        destroyed(){
            document.onkeydown = ''
        }
    }
</script>

<style scoped>
    .el-divider--vertical {
        height: 100% !important;
    }

    .historyHeaderDiv{
        display: flex;
        justify-content: space-around;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .novelCatalogDiv{
        margin-top: 10px;
    }

    .novelCatalogOperation{
        display: flex;
        justify-content: space-between
        /*height: 70px;*/
    }

    .leftOperationBtn{
        padding-left: 5%;
    }

    .rightOperationBtn{
        padding-right: 5%;
    }

    .novelCatalogView{
        border: 1px solid #e4e7ed;
        min-height: 300px;
        margin: 0 5% 30px 5%;
        background-color: #FCFCFA;
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;
        max-height: 550px;
        overflow-y: scroll;
    }

    .novelInfo{
        height: 180px;
        width: 24%;
        text-align: center;
        margin-top: 10px;
        cursor: pointer;
    }

    .novelInfo:hover{
        background-color: #cdf5ff;
    }

    .novelImg{
        border: 1px sienna solid;
        height: 70%;
        margin: 5px 20%;
        width: 60%;
    }

    .novelImga{
        margin: 0 10%;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 14px;
        color: #6F78A7;
    }

    .novelImga:hover{
        text-decoration: underline;
    }

    .novelCatalogViewHeader{
        height: 30px;
        line-height: 30px;
        text-align: left;
        margin: 10px 5% 0 5%;
        background-color: #E1ECED;
        border: 1px solid #e4e7ed;
        display: flex;
    }

    .viewHeaderIcon{
        width: 10%;
        display: flex;
        justify-content: space-around;
    }

    .viewHeaderBread{
        width: 60%;
        overflow-x: auto;
    }

    .el-breadcrumb{
        font-size: 10px;
        line-height: unset;
    }

    .viewHeaderChoice{
        width: 15%;
        text-align: right;
    }

    .viewHeaderSearch{
        width: 20%;
    }

    .viewHeaderSearch >>> .el-input__inner {
        height: 100%;
        /*line-height: 100%;*/
        /*margin-bottom: 1px;*/
    }

    .menu__item {
        display: block;
        line-height: 20px;
        text-align: center;
        width: 60px;
        margin:10px;
        cursor: default;
    }
    .menu__item:hover{
        color: #66b1ff;
    }

    .menu {
        height: auto;
        width: auto;
        position: absolute;
        font-size: 14px;
        text-align: center;
        border-radius: 10px;
        border: 1px solid #c1c1c1;
        background-color: #ffffff;
        padding: 0;
    }

    li:hover {
        background-color: #ecf5ff;
        color: white;
        cursor: pointer;
    }

    .treeDiv{
        margin: 0 10%;
        border: #ffe8c0 1px solid;
        border-radius: 5%;
        min-height: 300px;
        background-color: #d9f5ff;
    }
</style>