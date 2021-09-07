<template>
    <div>
<!--        <div v-if="type===1">-->
<!--            <el-dialog-->
<!--                    title="编辑动态"-->
<!--                    :visible.sync="openDialog"-->
<!--                    width="40%"-->
<!--                    center-->
<!--                    :close-on-click-modal="false"-->
<!--                    @closed="closeFrom">-->
<!--                <div class="noticeDiv">-->
<!--                    <div class="rowDiv">-->
<!--                        <h3>标题</h3>-->
<!--                        <el-input-->
<!--                                placeholder="请输入标题"-->
<!--                                v-model="title"-->
<!--                                maxlength="30"-->
<!--                                show-word-limit-->
<!--                                clearable>-->
<!--                        </el-input>-->
<!--                    </div>-->
<!--                    <div class="rowDiv">-->
<!--                        <h3>公告内容</h3>-->
<!--                        <el-input-->
<!--                                type="textarea"-->
<!--                                :rows="7"-->
<!--                                placeholder="请输入公告内容"-->
<!--                                maxlength="300"-->
<!--                                show-word-limit-->
<!--                                v-model="textarea">-->
<!--                        </el-input>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                        <span>是否默认首页打开：</span>-->
<!--                        <el-switch-->
<!--                                v-model="openSwitch">-->
<!--                        </el-switch>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="openDialog=false">取 消</el-button>-->
<!--                <el-button type="primary" @click="addNotice">确 定</el-button>-->
<!--            </span>-->
<!--            </el-dialog>-->
<!--        </div>-->
        <div v-if="type===0">
            <el-dialog
                    title="动态信息"
                    :visible.sync="show"
                    width="40%"
                    center
                    :close-on-click-modal="false"
                    @closed="closeFrom">
                <div class="dynamic-dialog-div">
                    <div class="dynamic-dialog-header">
                        <h2>{{dynamic.dynamicTitle}}</h2>
                        <span style="font-size: 12px;">{{dynamic.createTime}}</span>
                    </div>
                    <div class="dynamic-dialog-context">
                        <p style="text-indent:2em">{{dynamic.dynamicContent}}</p>
                    </div>
                </div>
                <span slot="footer">
                <el-button type="primary" @click="show=false">确认</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DynamicDialog",
        data(){
            return{
                show:false
            }
        },
        props:{
            openDialog:{
                type:Boolean,
                default:false
            },
            type:{
                type:Number,
                default: 0
            },
            dynamic:{
                type:Object,
                default:{}
            }
        },
        methods:{
            closeFrom(){
                this.show=false
                this.$emit('closeFrom',this.show)
            }
        },
        watch:{
            openDialog(newV,oldV){
                this.show=newV
            }
        },
    }
</script>

<style scoped>
    .dynamic-dialog-div{
        text-align: center;
    }

    .dynamic-dialog-header{
        margin-bottom: 20px;
    }

    .dynamic-dialog-header h2{
        margin: 0;
    }

    .dynamic-dialog-context{
        border: 1px gray dashed;
        border-radius: 25px;
        height: 200px;
        padding: 0 8px;
        text-align: left;
        overflow-y:auto;
        line-height: 20px;
    }
</style>