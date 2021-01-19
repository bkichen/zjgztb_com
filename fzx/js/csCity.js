var nowdate="";
(function (win, $) {

    // slide公共配置
    var slideConfig = {
        effect: "leftLoop",
        autoPlay: true
    };
 
    // 图片轮播
    $(".ewb-scroll").slide(
        $.extend(slideConfig, {
            titCell: ".ewb-scroll-hd li",
            mainCell: ".ewb-scroll-bd ul"
        })
    );
    // tab
    $('.ewb-notice').slide({
        autoPlay: false,
        titCell: ".ewb-notice-hd li",
        mainCell: ".ewb-notice-bd",
        startFun: function (i) {

        }
    });
   getNowFormatDate();
	var url = "http://222.92.204.18/changshuFront/Template/Default/kbdetail.aspx?date="+nowdate;
	$("#jrkburl").attr("href",url);
	
})(this, jQuery);

function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        nowdate = year + seperator1 + month + seperator1 + strDate; 
    }