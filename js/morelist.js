var lj = "";
var cNum = $("#catenum").val();
//右侧信息分页列表
var opt;
var lanmu = new ServiceUtil().RequestString("lanmu");
var starttime = new ServiceUtil().RequestString("starttime");
var endtime = new ServiceUtil().RequestString("endtime");
var keyword = new ServiceUtil().RequestString("keyword");
var pagesize = 10;
$(document).ready(function() {

    //获取路径
    lj = $("#page").attr("value");

    //静态部分的序号
    // $("#jt").find(".ewb-trade-tr").each(function() {
    // 	var index = $(this).find("span").html();
    // 	var indexpage = 1;
    // 	indexpage = $("#jt").find(".m-pagination-page .active").find("a").html();
    // 	if(indexpage==undefined)
    // 		indexpage = 1;
    // 	var num = Number(index)+Number((indexpage-1)*10); 
    // 	$(this).find("span").html(num);
    // });

    //处理100页以后信息
    var pageindexcz = new ServiceUtil().RequestString("pageIndex"); //100页以后传页码
    if (pageindexcz > 1) {
        $("#jt").attr('style', 'display:none');
        $("#dt").attr('style', 'display:default');
        $("#xxList").html("");
        BindGrid100(cNum, pageindexcz)
    } else {
        if (lanmu) {
            cNum = lanmu;
        }
        if (keyword) {
            $("#infoContent").val(keyword);
        }
        if (lanmu) {
            $("#jt").attr('style', 'display:none');
            $("#dt").attr('style', 'display:default');
            BindGrid(cNum, '0');
        }
    }


    //通知公告栏目控制显示new
    $(".newInfo").each(function(i, item) {
        var infodate = $(item).find("img").attr("date-value");
        var infoDate = new Date(infodate);
        var now = new Date();
        var restTimes = now.getTime() - infoDate.getTime();
        if (restTimes > 1000 * 60 * 60 * 24 * 3) {
            $(item).find("img").remove();
        }
    })
});
//动态分页列表加载
function getdata(obj, indexpage, categorynum) {
    var $pager = $("#pager");
    var url = siteInfo.projectName + "/XyxxSearchAction.action?cmd=getList";
    var htmltep = $('#info-template').html();
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: obj,
        success: function(msg) {
            //console.log(msg);
            var data = $.parseJSON(msg.custom);
            $("#xxList").html("");
            $.each(data.Table, function(indexs, el) {
                var index = indexs + 1;
                el.index = index + indexpage * pagesize;
            });
            //判断使用模版 
            $("#xxList").append(Mustache.render(htmltep, { Table: data.Table }));
 //通知公告栏目控制显示new
    $(".newInfo").each(function(i, item) {
        var infodate = $(item).find("img").attr("date-value");
        var infoDate = new Date(infodate);
        var now = new Date();
        var restTimes = now.getTime() - infoDate.getTime();
        if (restTimes > 1000 * 60 * 60 * 24 * 3) {
            $(item).find("img").remove();
        }
    })
            //销毁分页  
            if ($pager.pagination()) {
                $pager.pagination('destroy');
            }

            //分页初始化 
            $pager.pagination({
                pageIndex: indexpage,
                pageSize: pagesize,
                total: data.TotalCount,
                debug: true,
                showInfo: true,
                showJump: true,
                showPageSizes: true,
                pageElementSort: ['$page', '$jump']
            });
            //分页按钮点击事件
            $pager.on("pageClicked", function(event, data) {
                BindGrid(categorynum, data.pageIndex);

            }).on('jumpClicked', function(event, data) {
                BindGrid(categorynum, data.pageIndex);
            });


        },
        error: function(msg) {
            alert("没有信息内容！");
            if ($pager.pagination()) {
                $pager.pagination('destroy');
            }
        }
    });
}

//100分页列表加载
function getdata100(obj, indexpage, categorynum) {
    indexpage = indexpage - 1;
    var $pager = $("#pager");
    var url = siteInfo.projectName + "/XyxxSearchAction.action?cmd=getList";
    var htmltep = $('#info-template').html();
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        data: obj,
        success: function(msg) {

            var data = $.parseJSON(msg.custom);
            $("#xxList").html("");
            $.each(data.Table, function(indexs, el) {
                var index = indexs + 1;
                el.index = index + indexpage * pagesize;
            });
            //判断使用模版 
            $("#xxList").append(Mustache.render(htmltep, { Table: data.Table }));

            //销毁分页  
            if ($pager.pagination()) {
                $pager.pagination('destroy');
            }

            //分页初始化 
            $pager.pagination({
                pageIndex: indexpage,
                pageSize: pagesize,
                total: data.TotalCount,
                debug: true,
                showInfo: true,
                showJump: true,
                showPageSizes: true,
                pageElementSort: ['$page', '$jump']
            });
            //分页按钮点击事件
            $pager.on("pageClicked", function(event, data) {
                BindGrid100(categorynum, data.pageIndex);

            }).on('jumpClicked', function(event, data) {
                BindGrid100(categorynum, data.pageIndex);
            });


        },
        error: function(msg) {
            alert("没有信息内容！");
            if ($pager.pagination()) {
                $pager.pagination('destroy');
            }
        }
    });
}

function BindGrid(categorynum, indexpage) {
    var title = $("#infoContent").val();
    var obj = {};
    obj.categoryNum = cNum;
    obj.title = title;
    obj.starttime = starttime;
    obj.endtime = endtime;
    obj.pageIndex = indexpage;
    obj.pageSize = pagesize;
    getdata(obj, indexpage, categorynum)
}

//100页以后调用
function BindGrid100(categorynum, indexpage) {
    if (indexpage == 0) {
        window.location.href = "" + lj + "/moreinfo.html";
    } else if (indexpage < 2) {
        window.location.href = "" + lj + "/" + (indexpage + 1) + ".html";
    } else {
        var obj = {};
        obj.categoryNum = categorynum;
        obj.title = "";
        obj.starttime = "";
        obj.endtime = "";
        obj.pageIndex = indexpage;
        obj.pageSize = pagesize;
        getdata100(obj, indexpage, categorynum)
    }
}

function onClickSelect(categoryNum, obj) {
    $("#jt").attr('style', 'display:none');
    $("#dt").attr('style', 'display:default');

    BindGrid(categoryNum, '0');
}