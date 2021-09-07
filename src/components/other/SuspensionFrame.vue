<template>
    <div v-if="isShow" class="xuanfuDiv" v-bind:style="mapStyle">
        <i v-if="icon" :class="icon"></i>
    </div>
</template>

<script>
    export default {
        name: "SuspensionFrame",
        props:{
            left:{
                type:Number,
                default:40
            },
            bottom:{
                type:Number,
                default:40
            },
            width:{
                type:Number,
                default:40
            },
            height:{
                type:Number,
                default:40
            },
            icon:{
                type:String,
                default:''
            },
            showHeight:{
                type:Number,
                default:200
            }
        },
        methods:{
            scrollToTop() {
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop>=this.showHeight){
                    this.isShow=true
                }else {
                    this.isShow=false
                }
            }
        },
        mounted () {
            window.addEventListener('scroll', this.scrollToTop)
        },
        data(){
            return{
                isShow:false,
                mapStyle:{
                    left:this.left+'px',
                    bottom:this.bottom+'px',
                }
            }
        },
        watch:{
            bottom(){
                this.mapStyle.bottom=this.bottom+"px"
            }
        },
        beforeRouteLeave(to, form, next){
            window.removeEventListener('scroll',this.scrollToTop);
            next();
        },
    }
</script>

<style scoped>
    .xuanfuDiv{
        width: 40px;
        height: 40px;
        position: fixed;
        /*left:10px ;*/
        /*top: 150px;*/
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
    }

    .xuanfuDiv:hover{
        cursor: pointer;
    }


</style>