import router from '../router/index'

let method={
    getTotalNum(num,before){
        let str=num
        if(num>=1000&&num<10000){
            str=parseInt(num/1000)+"千"
        }else if(num>=10000&&num<100000000){
            str=parseInt(num/10000)+"万"
        }else if(num>=100000000){
            str=parseInt(num/100000000)+"亿"
        }
        str=(before?str+before:str).toString()
        return str
    },
    jumpNovel(id, title) {
        router.push({
            path:'/novel/novelInfo',
            query:{
                novelId:id,
                novelName:title
            }
        });
    },
    jumpChapter(novelId, chapterId, readPosition) {
        router.push({
            path:'/novel/novelRead',
            query:{
                chapterId:chapterId,
                novelId:novelId,
                positionY:readPosition
            }
        })
    }
}

export default { method }