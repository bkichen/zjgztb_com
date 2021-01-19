(function(win, $) {
	
	//格式化日期：yyyy-MM-dd
    function formatDate(date) {
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }

var now=new Date();

   var nowDayOfWeek = now.getDay(); //今天本周的第几天
      var nowDay = now.getDate(); //当前日
     var  nowMonth = now.getMonth(); //当前月
       var nowYear = now.getFullYear(); //当前年
    
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1);
    var  weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
    
    var startDate=formatDate(weekStartDate);
    var endDate=formatDate(weekEndDate);
      console.log(startDate+"----"+endDate);
    
    $.ajax({
        type:"post",
        url:siteInfo.projectName+"/cskbinfoaction.action?cmd=getZjgKbInfo",
        dataType:'json',
        data:{
            "startDate":startDate,
              "endDate":endDate
        },
        success:function(msg){
          //console.log(msg.custom.zjgkbInfo);
           var data=msg.custom.zjgkbInfo;
		   
           data=$.parseJSON(data);
           console.log(data);
           data = data.EpointDataBody.KBplaninfo
           var week1 = [];
           var week2 = [];
           var week3 = [];
           var week4 = [];
           var week5 = [];
           var week6 = [];
           var week7 = [];
           
           for(var i in data){
           	var kbdate = new Date(data[i].kbdate);
           	 switch (kbdate.getDay()) {
                   case 1:
                       week1.push(data[i])
                       break;
                    case 2:
                       week2.push(data[i])
                       break;
                    case 3:
                       week3.push(data[i])
                       break;
                    case 4:
                       week4.push(data[i])
                       break;
                    case 5:
                       week5.push(data[i])
                       break;
                    case 6:
                       week6.push(data[i])
                       break;
                    case 0:
                       week7.push(data[i])
                       break;
               
                   default:
                       break;
               }
           }

//         data.forEach(element => {
//             var kbdate = new Date(element.kbdate);
//             switch (kbdate.getDay()) {
//                 case 1:
//                     week1.push(element)
//                     break;
//                  case 2:
//                     week2.push(element)
//                     break;
//                  case 3:
//                     week3.push(element)
//                     break;
//                  case 4:
//                     week4.push(element)
//                     break;
//                  case 5:
//                     week5.push(element)
//                     break;
//                  case 6:
//                     week6.push(element)
//                     break;
//                  case 7:
//                     week7.push(element)
//                     break;
//             
//                 default:
//                     break;
//             }
//
//         });
           
           week1 = {"day":"周一","index":"1","date":startDate,"weekinfo":week1};
           week2 = {"day":"周二","index":"2","date":formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+2)),"weekinfo":week2};
           week3 = {"day":"周三","index":"3","date":formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+3)),"weekinfo":week3};
           week4 = {"day":"周四","index":"4","date":formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+4)),"weekinfo":week4};
           week5 = {"day":"周五","index":"5","date":formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+5)),"weekinfo":week5};
           week6 = {"day":"周六","index":"6","date":formatDate(new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+6)),"weekinfo":week6};
           week7 = {"day":"周日","index":"7","date":endDate,"weekinfo":week7};

           var weekdate = {"startdate":startDate,"enddate":endDate};
           data = {"data":[week1,week2,week3,week4,week5,week6,week7],"weekdate":weekdate};
          
           $("#week").html(Mustache.render($('#info-weekTemplate').html(),data));

           var nowdate = formatDate(now);
           
           for(var i in data.data){
           	if(data.data[i].date==nowdate){
                   $(".week"+data.data[i].index).attr("bgcolor","#FFCC99")
               }
           }
        }
   });



   
}(this, jQuery));