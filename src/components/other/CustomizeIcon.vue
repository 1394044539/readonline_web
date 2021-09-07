<template>
    <div style="display: flex">
        <el-image
                :style="imgSize"
                :src="require('@/assets/img/'+imgPath)"
                fit="fill">
        </el-image>
        <span :style="spanSize" v-if="beforeName||beforeName==='0'||beforeName===0">{{beforeName}}</span>
    </div>
</template>

<script>
    export default {
        name: "CustomizeIcon",
        props:{
            imgPath:String,
            beforeName:String,
            imgWidth:{
                type:Number,
                default:14
            },
            imgHeight:{
                type:Number,
                default:14
            },
            nameMargin:{
                type:Number,
                default:8
            },
            fontSize:{
                type:Number,
                default:12
            }
        },
        data(){
            return{
                imgSize:{
                    width:this.imgWidth + 'px',
                    height:this.imgHeight + 'px',
                },
                spanSize:{
                    marginLeft:this.nameMargin + 'px',
                    fontSize:this.fontSize + 'px',

                }
            }
        },
        created() {

        }

    }
</script>

<style scoped>
    .icon-before-name{

    }
</style>