const dateUtil = {}

let now = new Date(); // 当前日期
let nowDayOfWeek = now.getDay(); // 今天本周的第几天
let nowDay = now.getDate(); // 当前日
let nowMonth = now.getMonth(); // 当前月
let nowYear = now.getYear(); // 当前年

dateUtil.getYMDTime = function (time) {


}

dateUtil.formatDate = function(date) {
    date=new Date(date)
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return myyear + "-" + mymonth + "-" + myweekday;
}


export default dateUtil