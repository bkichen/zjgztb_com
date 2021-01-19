// left tree

var column="";
var infoid="";
var infotitle="";
var secondcolumn="";
(function(win, $) {
	
	$.each($(".middleCate"), function(i,item) {
		if(i==1){
		secondcolumn=$(item).find("a").html();
		}
	});
	
	var index=$("#viewGuid").attr("value");
	infoid=index.split("_")[2];
	column=$("#viewGuid").html();
	infotitle=$(".article-info").find("h1").html();
	//console.log(column+"----"+infoid+"====="+infotitle);
	addVisitCount(column,infoid);
	//console.log($($($("#viewGuid").parent()).prev()).find("a").html());
}(this, jQuery));



function addVisitCount(column,infoid){
    var $pager=$("#pager");
    $.ajax({
        type:"post",
        url:siteInfo.projectName+"/visitCount.action?cmd=addVisitCount",
        dataType:'json',
        data:{
            "type":"detail",
            "column":column,
            "infoid":infoid,
            "secondcolumn":secondcolumn
        },
        success:function(msg){
           // console.log(msg);
        }
           
   });
}