<template>
<!--    <div v-if="thisOpen&&heightOpen">-->
        <div class="chatWin">
            <div class="oprHeader">
                <div style="width: 60%;padding-left: 12px;text-align: left">聊天室</div>
                <div class="iconDiv">
                    <div style="margin-right: 7px;cursor: pointer" @click="closeWin"><i class="el-icon-close"></i></div>
                    <div style="margin-right: 7px;cursor: pointer" @click="minimizeWin"><i class="el-icon-minus"></i></div>
                </div>
            </div>
            <div id="chatDiv" class="chatContext">
                <div v-for="message in messageList">
                    <div v-if="message.msgType===1" class="chatMessageDiv" style="text-align: left">
                        <div class="chatUserDiv">{{message.accountName}}:</div>
                        <div class="chatMessageContextDiv">
                            {{message.message}}
                        </div>
                    </div>
                    <div v-if="message.msgType===2" class="chatMessageDiv" style="text-align: right">
                        <div class="chatUserSelfDiv">{{message.accountName}}:</div>
                        <div class="chatMessageUserSelfContextDiv">
                            {{message.message}}
                        </div>
                    </div>
                    <div v-if="message.msgType===0" class="chatMessageDiv">
                        <div class="messageNotic">{{message.message}}</div>
                    </div>
                </div>
            </div>
            <div class="oprDiv">
                <div style="width:180px;text-align: left;padding-left: 5px">
                    <span style="font-size: 10px;color: gray">当前在线人数:{{ononlineNum}}</span>
                </div>
                <div style="width:40px;text-align: right;padding:1px 5px 1px 0;">
                    <el-button style="height: 20px;line-height: 10px" size="mini" @click="sendInput">发送</el-button>
                </div>
            </div>
            <div class="messageDiv">
                <el-input
                        resize="none"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="textarea">
                </el-input>
            </div>
        </div>
<!--    </div>-->
</template>

<script>
    export default {
        name: "ChatWebSocket",
        props:{
            chatOpen:{
                type: Boolean,
                default:false
            },
            novelId:{
                type: String,
                default: ""
            },
            chapterId:{
                type: String,
                default:''
            }
        },
        data(){
            return{
                thisOpen:false,
                heightOpen:false,
                textarea:'',
                messageList:[],
                ononlineNum:0
            }
        },
        methods:{
            scrollToTop() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop>=200){
                    this.heightOpen=true
                }else {
                    this.heightOpen=false
                }
            },
            closeWin(){
                this.thisOpen=false
                this.$emit('closeChat',false)
            },
            minimizeWin(){

            },
            sendInput(){
                this.sendMessage(this.textarea)
                this.textarea=''
            },
            sendMessage(val){
                this.websocketsend(val)
            },
            initWebSocket(){ //初始化weosocket
                let userInfo=JSON.parse(localStorage.getItem("userInfo"))
                const wsuri = "ws://localhost:8092/novel/chat/"+userInfo.accountName+"/"+this.novelId+"/"+this.chapterId;
                this.websock = new WebSocket(wsuri);
                this.websock.onopen = this.websocketonopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数
                // this.websocketsend(JSON.stringify(actions));
            },
            websocketonerror(e){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                console.log(redata)
                if(redata.msgType===3){
                    this.ononlineNum=redata.message
                }else {
                    //一次只展示30个条记录
                    if(this.messageList.length>=30){
                        this.messageList.shift()
                    }
                    this.messageList.push(redata)
                }

            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                console.log('断开连接',e);
            },
        },
        mounted () {
            var that =this
            window.addEventListener('scroll', this.scrollToTop)
            document.getElementsByClassName('el-textarea__inner')[0].addEventListener('keydown', function (e) {
                if ( e.ctrlKey && e.keyCode == 13){
                    e.preventDefault();
                    that.sendInput()
                }

            });
        },
        watch:{
            chatOpen(){
                this.thisOpen=this.chatOpen
            },
            messageList: function() {
                this.$nextTick(() => {
                    let htl=document.getElementById("chatDiv")
                    htl.scrollTo(0,htl.scrollHeight);
                });
            }
        },
        created() {
            this.initWebSocket()
        },
        beforeRouteLeave(to, form, next){
            window.removeEventListener('scroll',this.scrollToTop);
            next();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
    }
</script>

<style scoped>
    .chatWin{
        background-color: #FFF;
        height: 340px;
        width: 240px;
        position: fixed;
        left:40px;
        bottom:60px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px
    }

    .oprHeader{
        border-bottom: 1px solid #ebeef5;
        background-color: #fffbf0;
        line-height: 30px;
        /*font-size: 18px;*/
        display: flex;
        /*flex-direction: row-reverse;*/
    }

    .iconDiv{
        width: 40%;
        font-size: 18px;
        display: flex;
        flex-direction: row-reverse;
    }

    .chatContext{
        width: 100%;
        height: 230px;
        overflow-y:auto;
        overflow-x: hidden;
    }

    .oprDiv{
        width: 100%;
        height: 20px;
        background-color: #F6F8FE;
        margin-bottom: 2px;
        border-top: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        display: flex;
    }

    .messageDiv{
        width: 100%;
        height: 60px;
    }

    .chatMessageDiv{
        margin-top: 5px;
    }

    .chatUserDiv{
        text-align: left;
        padding-left: 10px;
        font-size: 10px;
        color: gray;
    }

    .chatMessageContextDiv{
        line-height: 20px;
        font-size: 14px;
        /*width: 220px;*/
        word-break:break-all;
        text-align: left;
        padding-left: 10px;
    }

    .chatUserSelfDiv{
        text-align: right;
        padding-right: 10px;
        font-size: 10px;
        color: gray;
    }

    .chatMessageUserSelfContextDiv{
        line-height: 20px;
        font-size: 14px;
        /*width: 220px;*/
        word-break:break-all;
        text-align: right;
        padding-right: 10px;
    }

    .messageNotic{
        text-align: center;
        font-size: 10px;
        color: #E4E49C;
    }
</style>