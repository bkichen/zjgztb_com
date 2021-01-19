/**!
 * 首页
 * author: gaojian;
 * date: 2019-06-30
 */
var milliseconds = new Date().getTime();
(function(win, $) {

    // slide公共配置
    var slideConfig = {
        effect: "leftLoop",
        autoPlay: true
    };

    // 图片轮播
    $("#slideBox").slide(
        $.extend(slideConfig, {
            titCell: ".slideBox-hd li",
            mainCell: ".slideBox-bd ul"
        })
    );
    $('.ewb-notice').slide({
        autoPlay: false,
        titCell: ".ewb-notice-hd li",
        mainCell: ".ewb-notice-bd",
        startFun: function(i) {

        }
    });
    $(".ewb-banner").slide(
        $.extend(slideConfig, {
            mainCell: ".ewb-banner-item"
        })
    );
    // sel下拉框
    var chosenConfig = {
        disable_search_threshold: 10
    }

    $(".ewb-year-sel").chosen($.extend(chosenConfig, {
        width: "100%"
    }));


    /********今日交易**两小时更新一次*******/
    var jsonpath = "/tjjson/tjycount/tjycount.json";
    $.ajax({
        url: jsonpath,
        type: 'HEAD',
        error: function() {
            //文件不存在，请求接口生成文件
            //getTodayJy();
        },
        success: function() {
            //文件存在,验证是否有效,两个小时
            //validateTodayJyjson(jsonpath,72000);                    
        }
    });
    //验证有效json
    function validateTodayJyjson(jsonpath, time) {
        $.ajax({
            url: jsonpath,
            type: "get",
            dataType: "json",
            async: false,
            cache: false,
            success: function(msg) {
                if (msg != null && msg != "") {
                    var expireTime = msg.expiretime;
                    if (milliseconds - expireTime < time) {
                        getTodayJyjson(jsonpath);
                    } else {
                        getTodayJy();
                    }
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    };
    //调用静态文件
    function getTodayJyjson(path) {
        $.ajax({
            url: path,
            type: "GET",
            dataType: "json",
            success: function(data) {
                data = $.parseJSON(data.data);
                dataRand(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
    //调用动态
    function getTodayJy() {
        $.ajax({
            url: siteInfo.projectName + "/YwDjAction.action?cmd=getJRJYCount",
            type: "post",
            dataType: "json",
            success: function(data) {
                data = $.parseJSON(data.custom);
                dataRand(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    //获取工程开标数
    function getGckbCount() {
        var opt = {};
        opt.type = "3";
        $.ajax({
            url: siteInfo.projectName + "/YwDjAction.action?cmd=getGggsCount",
            type: "post",
            dataType: "json",
            data: opt,
            success: function(data) {
                data = $.parseJSON(data.custom);
                var CountKB = data.CountKB;
                $("#KB").html(CountKB);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    //获取采购开标数
    function getCgkbCount() {
        var opt = {};
        opt.type = "4";
        $.ajax({
            url: siteInfo.projectName + "/YwDjAction.action?cmd=getGggsCount",
            type: "post",
            dataType: "json",
            data: opt,
            success: function(data) {
                data = $.parseJSON(data.custom);
                var CountPB = data.CountPB;
                $("#PB").html(CountPB);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    //获取公告公示的数量  type=1：公告 type=2:公示
    function getGgCount() {
        var opt = {};
        opt.type = "1";
        $.ajax({
            url: siteInfo.projectName + "/YwDjAction.action?cmd=getGggsCount",
            type: "post",
            dataType: "json",
            data: opt,
            success: function(data) {
                data = $.parseJSON(data.custom);
                var CountGGs = data.CountGG;
                $("#GG").html(CountGGs);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }


    function getGsCount() {
        var opt = {};
        opt.type = "2";
        $.ajax({
            url: siteInfo.projectName + "/YwDjAction.action?cmd=getGggsCount",
            type: "post",
            dataType: "json",
            data: opt,
            success: function(data) {
                data = $.parseJSON(data.custom);
                var countGSs = data.CountGS;
                $("#GS").html(countGSs);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    getGgCount();
    getGsCount();
    getCgkbCount();
    getGckbCount();

    //渲染数据	
    function dataRand(data) {
        var CountGGs = data.CountGG;
        var countGSs = data.CountGS;
        var CountKBs = data.CountKB;
        var countPBs = data.CountPB;
        // $("#GG").html(CountGGs);
        //$("#GS").html(countGSs);
        $("#KB").html(CountKBs);
        $("#PB").html(countPBs);
    }




    //通知公告栏目控制显示new
    $("#newUl li").each(function(i, item) {
        var infodate = $(item).find("a").attr("date-value");
        var infoDate = new Date(infodate);
        var now = new Date();
        var restTimes = now.getTime() - infoDate.getTime();
        if (restTimes > 1000 * 60 * 60 * 24 * 3) {
            $(item).find("img").remove();
        }
    })


})(this, jQuery);