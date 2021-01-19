
var DanWeiType = "13";
var $pager = $("#pager");
var pageIndex = 0;
var pageSize = 15;
var DanWeiName = "";
$(function(){

    getData(DanWeiName,DanWeiType,pageIndex,pageSize);

});

$("#searchbtn").on("click",function(){
    var danweiname = $("#titletxt2").val();
    getData(danweiname,DanWeiType,pageIndex,pageSize);
})

$(".wb-tree-sub a").on("click",function(){
    $("#titletxt2").val("");
    $(".wb-tree-sub").find("li").removeClass("current");
    $(this).parent().addClass("current");
    DanWeiType = $(this).attr("id");
    getData(DanWeiName,DanWeiType,pageIndex,pageSize);

});

function getData(danweiName,DanWeiType,pageindex,pagesize){
    var $pager=$("#pager");
    $.ajax({
        type:"post",
        url:siteInfo.projectName+"/cssearchinfoaction.action?cmd=getTcInfo",
        dataType:'json',
        data:{
            "DanWeiType":DanWeiType,
            "pageindex":pageindex,
            "pagesize":pagesize,
            "DanWeiName":danweiName
        },
        success:function(msg){
            //console.log(msg);
            var mydata=msg.custom.data;
             //console.log(mydata);
             for(var i=0;i<mydata.length;i++){
             	var myurl=mydata[i].Url;
             	myurl=myurl.replace(/&amp;/g,"&");
             	mydata[i].Url=myurl;
             }
             
            $("#xxList").html(Mustache.render($("#info-template").html(), { Table: msg.custom.data }));

           renderPager(pageindex,pagesize,msg.custom.total,DanWeiType,danweiName)
        }
           
   });
}

 // 渲染页码
 var renderPager = function (pageindex, pagesize, total,DanWeiType,DanWeiName) {
    if ($pager.pagination()) {
        $pager.pagination('destroy');
    }
    if (!total) {
        return;
    }
    var pagerConfig = {
        pageIndex: pageindex,
        pageSize: pagesize,
        total: total,
        showJump: true,
        jumpBtnText: 'Go',
        pageBtnCount: 10,
        showFirstLastBtn: true,
        showInfo: true,
        infoFormat: '共 {total} 条'
    }
    $pager.pagination(pagerConfig);
   
   $("#pager").on("pageClicked", function(event, data) {
    //分页按钮点击事件
    //console.log(data);
        getData(DanWeiName,DanWeiType,data.pageIndex, data.pageSize);
    });
    $("#pager").on("jumpClicked", function(event, data) {
        //分页按钮点击事件
        //console.log(data);
        getData(DanWeiName,DanWeiType,data.pageIndex, data.pageSize);
     });
}