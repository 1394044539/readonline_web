<template>
    <div>
        <div style="text-align: left;padding:5px 20px;background-color: #FCFCFA;max-height: 30px">
            <el-page-header @back="goBack">
            </el-page-header>
        </div>
        <hr style="margin: 0"/>
        <h2>上传小说</h2>
        <div>
            <el-form ref="novelForm" :model="form" label-width="80px" size="mini" :rules="novelRules">
                <div class="uploadFormDiv">
                    <el-form-item label="小说文件" prop="fileRule">
                        <el-upload
                                class="upload-demo"
                                action=""
                                accept=".txt,.epub,TXT,.EPUB"
                                :auto-upload="false"
                                :on-change="uploadNovelChange"
                                :http-request="novelFileUpload"
                                :limit="1"
                                :on-exceed="handleExceed"
                                :file-list="novelList"
                        >
                            <el-button size="mini" type="primary">点击上传</el-button>
                            <template #tip>
                                <div class="el-upload__tip">本系统目前只允许上传txt和epub文件</div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <el-form-item v-if="!isAdmin" label="自动收藏">
                        <el-switch v-model="form.delivery"></el-switch>
                        <div><span style="color: gray;font-size: 10px;">勾选后会自动加入书架列表</span></div>
                    </el-form-item>
                    <el-form-item v-if="!isAdmin" label="直接发布">
                        <el-switch v-model="form.collection"></el-switch>
                        <div><span style="color: gray;font-size: 10px;">勾选后可以发布到平台共享阅读，但需要管理员审核</span></div>
                    </el-form-item>
                </div>
                <el-collapse style="margin: 0 10% 30px 10%" v-model="activeNames">
                    <el-collapse-item title="点击此处填写更多小说信息(*可不填写，我们会尽量去文件中获取相关信息)" name="1">
                        <div style="padding: 0 20% 0 10%;">
                            <el-form-item label="小说名称" prop="name" >
                                <el-input v-model="form.name" placeholder="请输入小说名称" maxlength="30"></el-input>
                                <span class="formSpan">* 可不填，不填写则取文件名</span>
                            </el-form-item>
                            <el-form-item label="小说作者" prop="author">
                                <el-input v-model="form.author" placeholder="请输入作者"></el-input>
                                <span class="formSpan">* 可不填，epub格式会尝试在文件中匹配</span>
                            </el-form-item>
                            <el-form-item label="发布时间">
                                <el-date-picker
                                        type="date"
                                        size="mini"
                                        :picker-options="pickerOptions"
                                        placeholder="请选择发布日期"
                                        v-model="form.publicDate"
                                        value-format="yyyy-MM-dd"
                                        style="width: 100%;">
                                </el-date-picker>
                                <span class="formSpan">* 可不填，epub格式会尝试在文件中匹配</span>
                            </el-form-item>
                            <el-form-item label="小说类型">
                                <el-select style="width: 100%" v-model="form.type" :multiple='true' placeholder="请选择">
                                    <el-option
                                            v-for="item in novelTypeList"
                                            :key="item.dictKey"
                                            :label="item.dictValue"
                                            :value="item.dictKey">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="小说封面">
                                <el-upload
                                        action=""
                                        ref="uploadImgForm"
                                        list-type="picture-card"
                                        accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                                        :auto-upload="false"
                                        :on-change="uploadImgChange"
                                        :limit="limit"
                                        :file-list="fileList"
                                        :class="uploadDisabled">
                                    <template #default>
                                        <i class="el-icon-plus"></i>
                                    </template>
                                    <template #file="{file}">
                                        <div>
                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                            <span class="el-upload-list__item-actions">
                                  <span
                                          class="el-upload-list__item-delete"
                                          @click="handleRemove(file)"
                                  >
                                    <i class="el-icon-delete"></i>
                                  </span>
                                </span>
                                        </div>
                                    </template>
                                </el-upload>
                                <span class="formSpan">* 可以不上传，上传epub文件时会去文件中获取</span>
                            </el-form-item>
                            <el-form-item label="小说简介">
                                <el-input type="textarea" v-model="form.introduce" :rows="5" placeholder="请输入小说简介"></el-input>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div class="uploadFormDiv">
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立刻上传</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "novelUpload",
        data(){
            var validateFile = (rule, value, callback) => {
                callback();
            };
          return {
              pickerOptions: {
                  disabledDate(time) {
                      return time.getTime() > Date.now()
                  }
              },
              form:{
                  name:'',
                  author:'',
                  publicDate:'',
                  type:[],
                  introduce:'',
                  delivery:true,
                  isAdmin:false,
                  collection:false
              },
              fileList:[],
              novelList:[],
              novelTypeList:[],
              limit:1,
              uploadDisabled:'',
              novelRules:{
                  fileRule:[
                      { required: true, validator: validateFile, trigger: 'blur' }
                  ]
              },
              activeNames:[]
          }
        },
        methods:{
            goBack() {
                this.$router.go(-1);
            },
            onSubmit(){
                var formData=new FormData();
                this.$refs['novelForm'].validate((valid)=>{
                    if(valid){
                        if(!this.novelList[0]){
                            this.$utils.warning2('请上传小说文件')
                            return;
                        }else{
                            this.novelList.map(element => {
                                formData.append("novelFiles", element.raw);
                            });
                        }
                        const loading = this.$loading({
                            lock: true,
                            text: '小说上传中，请等待，这可能需要一段时间',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        if(this.fileList[0]){
                            formData.append('imgFile',this.fileList[0].raw)
                        }
                        formData.append('novelTitle',this.form.name)
                        formData.append('novelIntroduce',this.form.introduce)
                        formData.append('novelAuthor',this.form.author)
                        if(this.form.publicDate){
                            formData.append('novelPublicDate',this.form.publicDate)
                        }
                        formData.append('novelTypes',this.form.type)
                        formData.append('isCollect',this.isAdmin?false:this.form.delivery)
                        formData.append('isPublic',this.isAdmin?false:this.form.collection)
                        this.$apiMethods.fileApi.uploadNovel(formData).then(res=>{
                            if(res.code===200){
                                loading.close()
                                this.$confirm('上传成功！', '提示', {
                                    confirmButtonText: this.isAdmin?'跳转到小说管理':'跳转到我的书架',
                                    cancelButtonText: '继续上传',
                                    type: 'success'
                                }).then(() => {
                                    if(this.isAdmin){
                                        this.$router.push('/novel/admin/novel')
                                    }else{
                                        this.$router.push('/novel/person')
                                    }
                                }).catch(() => {
                                    location.reload();
                                });
                            }
                        })
                    }

                });
            },
            handleRemove(file) {
                this.$refs.uploadImgForm.clearFiles();
                this.fileList=[]
                this.uploadDisabled=''
            },
            uploadImgChange(file){
                this.fileList.push(file)
                if(this.fileList.length >= 1){
                    this.uploadDisabled='disabled'
                }
            },
            uploadNovelChange(file){
                this.novelList.push(file)
            },
            handleExceed(files, fileList) {
                this.$utils.warning2("只允许上传一个文件")
            },
            novelFileUpload(file){
            },
            initNovelType(){
                let params={
                    dictClass:'NOVEL_TYPE'
                }
                this.$apiMethods.dataApi.getDictByClass(params).then(res=>{
                    if(res.code===200){
                        this.novelTypeList=res.data
                    }
                })
            },
            checkAdmin(){
                let path=this.$route.path;
                if(path==='/novel/admin/upload'){
                    this.isAdmin=true
                }else if(path==='/novel/person/upload'){
                    this.isAdmin=false
                }
            },


        },
        created() {
            this.initNovelType()
            this.checkAdmin()
        }
    }
</script>

<style scoped>
    .uploadFormDiv{
        padding: 0 30% 0 20%;
    }

    .formSpan{
        color: gray;
        font-size: 10px;
        float: left;
        margin-bottom: -18px;
    }
</style>
<style>
    .disabled .el-upload--picture-card {
        display: none;
    }
</style>