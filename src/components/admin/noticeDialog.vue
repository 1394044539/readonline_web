<template>
    <div>
        <div v-if="type===2">
            <el-dialog
                    title="添加公告"
                    :visible.sync="openDialog"
                    width="40%"
                    center
                    :close-on-click-modal="false"
                    @closed="closeFrom">
                <div class="noticeDiv">
                    <div class="rowDiv">
                        <h3>标题</h3>
                        <el-input
                                placeholder="请输入标题"
                                v-model="title"
                                maxlength="30"
                                show-word-limit
                                clearable>
                        </el-input>
                    </div>
                    <div class="rowDiv">
                        <h3>公告内容</h3>
                        <el-input
                                type="textarea"
                                :rows="7"
                                placeholder="请输入公告内容"
                                maxlength="300"
                                show-word-limit
                                v-model="textarea">
                        </el-input>
                    </div>
                    <div>
                        <span>是否默认首页打开：</span>
                        <el-switch
                                v-model="openSwitch">
                        </el-switch>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="openDialog=false">取 消</el-button>
                <el-button type="primary" @click="addNotice">确 定</el-button>
            </span>
            </el-dialog>
        </div>
        <div v-if="type===1">
            <el-dialog
                    title="编辑公告"
                    :visible.sync="openDialog"
                    width="40%"
                    center
                    :close-on-click-modal="false"
                    @closed="closeFrom">
                <div class="noticeDiv">
                    <div class="rowDiv">
                        <h3>标题</h3>
                        <el-input
                                placeholder="请输入标题"
                                v-model="title"
                                maxlength="30"
                                show-word-limit
                                clearable>
                        </el-input>
                    </div>
                    <div class="rowDiv">
                        <h3>公告内容</h3>
                        <el-input
                                type="textarea"
                                :rows="7"
                                placeholder="请输入公告内容"
                                maxlength="300"
                                show-word-limit
                                v-model="textarea">
                        </el-input>
                    </div>
                    <div>
                        <span>是否默认首页打开：</span>
                        <el-switch
                                v-model="openSwitch">
                        </el-switch>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="openDialog=false">取 消</el-button>
                <el-button type="primary" @click="addNotice">确 定</el-button>
            </span>
            </el-dialog>
        </div>
        <div v-if="type===0">
            <el-dialog
                    title="公告"
                    :visible.sync="openDialog"
                    width="40%"
                    center
                    :close-on-click-modal="false"
                    @closed="closeFrom">
                <div class="noticeDiv">
                    <div class="rowDiv">
                        <h2>{{notice.title}}</h2>
                        <span style="font-size: 12px;">{{notice.createTime}}</span>
                    </div>
                    <div class="rowDiv contentDiv">
                        <p style="text-indent:2em">{{notice.content}}</p>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="openDialog=false">已观看</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "noticeDialog",
        props:{
            openDialog:{
                type:Boolean,
                default:false
            },
            type:{
                type:Number,
                default: 0
            },
            notice:{
                type:Object,
                default:{}
            }
        },
        data(){
            return{
                title:'',
                textarea:'',
                openSwitch: true
            }
        },
        methods:{
            closeFrom(){
                this.openDialog=false
                this.title=''
                this.textarea=''
                this.openSwitch=true
                this.$emit('closeFrom',this.openDialog)

            },
            addNotice(){
                if(this.title.length===0 ){
                    this.$utils.warning2("公告标题不能为空")
                }else if(this.title.textarea===0){
                    this.$utils.warning2("公告内容不能为空")
                }else{
                    this.$utils.confirmWarning("是否发布公告？").then(() => {
                        let param={
                            title: this.title,
                            content: this.textarea,
                            isOpen: this.openSwitch,
                            id: this.type===1?this.notice.id:''
                        }
                        this.$apiMethods.dataApi.addNotice(param).then(res=>{
                            if(res.code===200){
                                this.$utils.success2("发布成功！")
                                this.closeFrom()
                            }
                        })
                    }).catch((err)=>{})
                }
            },
            checkType(){
                if(this.type===1&&this.openDialog){
                    this.title=this.notice.title
                    this.textarea=this.notice.content
                    this.openSwitch=this.notice.isOpen
                }
            }
        },
        watch:{
            openDialog(){
                this.checkType()
            },
        },
        created() {
        }
    }
</script>

<style scoped>
    .noticeDiv{
        text-align: center;
        padding: 0 5%;
    }
    .rowDiv{
        margin-bottom: 20px;
    }

    .rowDiv h3,h2{
        padding: 0;
        margin: 0 0 10px 0;
    }

    .contentDiv{
        border: 1px gray dashed;
        border-radius: 25px;
        height: 280px;
        padding: 0 8px;
        text-align: left;
        overflow-y:auto;
        line-height: 20px;
    }
</style>