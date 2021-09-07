<template>
    <div>
        <el-dialog :close-on-click-modal=false
                   title="分享"
                   width="30%"
                   :visible.sync="thisOpen"
                   @closed="closeDialog">
            <div class="shareDiv">
                <el-form ref="form" :model="shareForm" label-width="100px" size="small ">
                    <el-form-item required label="分享名称">
                        <el-input v-model="shareForm.name"></el-input>
                    </el-form-item>
                    <el-form-item :inline="true" label="分享密码">
                        <div style="display: flex">
                            <el-input v-model="shareForm.pwd" disabled clearable>
                                <el-button slot="append" @click="shareForm.pwd=''">×</el-button>
                            </el-input>
                            <el-button type="primary" @click="getPwd">生成密码</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item label="失效时间">
                        <el-date-picker :default-value="initTime"	value-format="yyyy-MM-dd" :picker-options="pickerOptions" align="center" size="small" type="date" placeholder="选择日期" v-model="shareForm.date" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="fileListDiv">
                    <p style="font-weight: bold">分享以下内容</p>
                    <div>
                        <div style="display: flex;justify-content: space-between" v-for="(file,index) in shareList">
                            <div style="margin-left: 10%">
                                {{file.name}}
                            </div>
                            <div >
                                ({{file.type===0?'文件夹':'小说'}})
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 10px">
                <el-button size="small" @click="closeDialog">取消</el-button>
                <el-button type="primary" size="small" @click="addShare">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :close-on-click-modal=false
                   title="分享成功"
                   width="30%"
                   :visible.sync="tipsOpen"
                   @closed="closeTips">
            <div class="shareDiv">
                <div style="display: flex">
                    <div style="width: 20%">路径：</div>
                    <div style="width: 80%;text-align: left"><a :href="shareObj.sharePath" target="_blank">{{shareObj.sharePath}}</a></div>
                </div>
                <div style="display: flex" v-if="shareObj.sharePwd">
                    <div style="width: 20%">密码：</div>
                    <div style="width: 80%;text-align: left">{{shareObj.sharePwd}}</div>
                </div>
            </div>
            <div style="margin-top: 10px">
                <el-button type="primary" size="small" @click="closeTips">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "ShareDialog",
        computed:{
            getRandomString(){
                return (e) => {
                    e = e || 32;
                    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
                        a = t.length,
                        n = "";
                    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
                    return n
                }
            },
        },
        props:{
            isOpen:{
                type:Boolean,
                default:false
            },
            shareList:{
                type:Array,
                default: []
            }
        },
        data(){
            return{
                shareForm:{
                    name:'',
                    date:'',
                    pwd:''
                },
                thisOpen:false,
                pickerOptions: {
                    disabledDate(time) {
                        let curDate = (new Date()).getTime();
                        let three = 90 * 24 * 3600 * 1000;
                        let threeMonths = curDate + three;
                        return time.getTime() < Date.now() || time.getTime() > threeMonths;
                    }
                },
                tipsOpen:false,
                shareObj:{}
            }
        },
        methods:{
            initTime(){
                const nowD = new Date()
                nowD.setTime(nowD.getTime() + 30 * 3600 * 1000 * 24)
                this.shareForm.date= nowD
            },
            closeTips(){
                this.tipsOpen=false
            },
            getPwd(){
                this.shareForm.pwd=this.randomString(4)
            },
            randomString(e) {
                e = e || 32;
                var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
                    a = t.length,
                    n = "";
                for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
                return n
            },
            closeDialog(){
                this.thisOpen=false
                this.$emit('reback',false)
            },
            addShare(){
                if(this.shareForm.name===''){
                    this.$utils.warning2("分享名字不能为空")
                    return
                }
                this.$utils.confirmWarning("是否确定分享?").then(res=>{
                    let files=new Array()
                    for (let shareFile of this.shareList) {
                        let obj={
                            fileType: shareFile.type,
                            fileId: shareFile.id
                        }
                        files.push(obj)
                    }
                    let param={
                        invalidTime:this.shareForm.date,
                        shareName:this.shareForm.name,
                        shareFileList:files,
                        sharePath:'http://localhost:8080/share/page',
                        sharePwd:this.shareForm.pwd
                    }
                    this.$apiMethods.shareApi.addOrEditShare(param).then(res=>{
                        if(res.code===200){
                            this.tipsOpen=true
                            this.shareObj=res.data
                            this.closeDialog()
                        }
                    })
                }).catch(err=>{})
            },
            addDate(strInterval, Number) {
                var dtTmp = new Date();
                switch (strInterval) {
                    case 's' :
                        return new Date(Date.parse(dtTmp) + (1000 * Number));
                    case 'n' :
                        return new Date(Date.parse(dtTmp) + (60000 * Number));
                    case 'h' :
                        return new Date(Date.parse(dtTmp) + (3600000 * Number));
                    case 'd' :
                        return new Date(Date.parse(dtTmp) + (86400000 * Number));
                    case 'w' :
                        return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
                    case 'q' :
                        return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                    case 'm' :
                        return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                    case 'y' :
                        return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                }
            }
        },
        created(){
            this.initTime()
        },
        watch:{
            isOpen(){
                this.thisOpen=this.isOpen
            }
        }
    }
</script>

<style scoped>
    .shareDiv{
        margin: 0 15% 0 10%;
    }

    .fileListDiv{

    }
</style>