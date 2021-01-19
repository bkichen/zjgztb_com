/**!
 * 首页
 * author: gaojian;
 * date: 2019-07-01
 */
var stype="3";//年度
var milliseconds = new Date().getTime();
(function (win, $) {

    $(".ewb-data-select").chosen({
        disable_search_threshold: 16,
        inherit_select_classes: true
    });

    $('.ewb-info-bd li:even').addClass('even');
    // 地图调用
    var $mapimg = $('#ewb-map-main'); //地图图片id 
    $mapimg.mapster({
        fillColor: 'fef466', //填充颜色设置
        fillOpacity: 1, //不透明度，值为0-1。
        stroke: false, //轮廓描边，当鼠标悬停或显示高亮时给所在区域描边。
        strokeColor: '666666', //廓的描边颜色。
        strokeWidth: 1, //轮廓描边的宽度。
        singleSelect: true,
        highlight: true,
        mapKey: 'name', //保持高亮
        onClick: function (data) {
            var regionName = $(this).attr('data-region');
			window.location.href = $(this).attr('href');
            // switch (regionName) {
                // case "zjg":
                    // window.location.href = 'zhangjiagang.html'
                    // break;
                // case "cs":
                    // window.location.href = 'changshu.html'
                    // break;
                // case "tc":
                    // window.location.href = 'taicang.html'
                    // break;
                // case "ks":
                    // window.location.href = 'kunshan.html'
                    // break;
                // case "gyyq":
                    // window.location.href = 'gongyeyuanqu.html'
                    // break;
                // case "sz":
                    // window.location.href = 'suzhou.html'
                    // break;
                // case "wj":
                    // window.location.href = 'wujiang.html'
                    // break;
            // }
        }

    });


function geturl(code)
{
	//判断是否存在文件
   var jsonpath = "/tjjson/tjycountxq/"+code+"/"+stype+"tjcount.json";
        $.ajax({
                url: jsonpath,
                type: 'HEAD', 
                error: function () {
                     //文件不存在，请求接口生成文件
                     getTj(code);
                },
                success: function () {
                    //文件存在,验证是否有效,半小时
                    getjson(jsonpath,1800000);

                }
            });
}

//动态获取并生成静态json文件
	function getTj(code)
	{ 
		code= $("#area").val();
	     var url=siteInfo.projectName + "/YwDjAction.action?cmd=GetTransactionNumTongji";
		 var obj={}; 
	obj.sjType = stype;
	obj.xiaqucode =code; 
		 $.ajax({
                type: "get",
                url: url, 
                dataType: "json", 
				data:obj,
                success: function(data) { 
				   var data =$.parseJSON(data.custom); 
                   rand(data);
                },
                error: function(data) { 
				}
            });
	}
//读取json文件，判断有效后渲染
	function getjson(jsonpath,time)
	{  
		 $.ajax({
                type: "get",
                url: jsonpath, 
                dataType: "json",  
                success: function(data) {
				      var expireTime = data.expiretime;
                        if(milliseconds-expireTime<time){  
                               var data =$.parseJSON(data.data);  
							   rand(data);
                             
                        }else{
                             getTj(stype);
                        } 
                },
                error: function(data) { 
				       getTj(stype);
				}
            });
	}

//渲染
function rand(data){
	$("#gctjnums").html(data.gctjnum);
	$("#jttjnums").html(data.jttjnum);
	$("#sltjnums").html(data.sltjnum);
	$("#cgtjnums").html(data.cgtjnum);
	$("#cqswtjnums").html(data.cqswtjnum);
	$("#kyqtjnums").html(data.kyqtjnum);
	$("#gttjnums").html(data.gttjnum);
	$("#ypcgtjnums").html(data.ypcgtjnum);
	$("#jdsbtjnums").html(data.jdsbtjnum);
	
}	
	
geturl("");	
$("#area").on('change',function(){
	var xiaqucode = $("#area").val();
	geturl(xiaqucode);
})
	})(this, jQuery);