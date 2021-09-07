<template>
    <div>
        <h2>测试web</h2>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button @click="sendMessage">默认按钮</el-button>
        <div v-for="data in datas">{{data}}</div>
    </div>
</template>

<script>
    export default {
        name: "TestWebSocket",
        data() {
            return {
                websock: null,
                input:'',
                datas:[]
            }
        },
        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {
            sendMessage(){
                this.websocketsend(this.input)
            },
            initWebSocket(){ //初始化weosocket
                const wsuri = "ws://localhost:8092/novel/chat/123";
                this.websock = new WebSocket(wsuri);
                this.websock.onopen = this.websocketonopen;
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                let actions = {"test":"12345"};
                this.websocketsend(JSON.stringify(actions));
            },
            websocketonerror(e){//连接建立失败重连
                this.initWebSocket();
            },
            websocketonmessage(e){ //数据接收
                // const redata = JSON.parse(e.data);
                this.datas.push(e.data)
                console.log(this.datas)
            },
            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            websocketclose(e){  //关闭
                console.log('断开连接',e);
            },
        },
    }
</script>

<style scoped>

</style>