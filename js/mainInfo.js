var pagesize=10;
var $pager=$("#page"); 
var cNum = $("#catenum").val(); 
var ztxxtype="";//招标类别
var url="";//接口地址
var biglb="";//大类别:1:招标代理
     //传参
	var ztlx = new ServiceUtil().RequestString("ztlx");  
	var keyword= decodeURIComponent(new ServiceUtil().RequestString("wd"));
	
$(document).ready(function(){ 
  if(ztlx){
	  	 cNum = ztlx;
	} 
	if(keyword)
	{
		$("#projectName").val(keyword);
	}
	gettype(cNum);
　　getLeftTree(); 
    onClickSelect(cNum,'0');
});

function gettype(cNum)
{
	switch (cNum)
	{
		case "004001001":
		   ztxxtype="18";//招标代理
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getDanWeiinfo";
		   biglb="1";
		   pagesize="6";
		   $("#zbdl").show();
		   $("#tbxx").hide();
		   $("#cyry").hide();
		   $("#zyry").hide();
		   break;
		case "004001002":
		   ztxxtype="13";//施工企业
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getTbdwinfo";
		   biglb="2";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").show();
		   $("#cyry").hide();
		   $("#zyry").hide();
		   break;  
		case "004001003":
		   ztxxtype="15";//勘察企业
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getTbdwinfo";
		   biglb="2";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").show();
		   $("#cyry").hide();
		   $("#zyry").hide();
		   break; 
		case "004001004":
		   ztxxtype="14";//监理企业
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getTbdwinfo";
		   biglb="2";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").show();
		   $("#cyry").hide();
		   $("#zyry").hide();
		   break; 
		case "004001005":
		   ztxxtype="16";//设计企业
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getTbdwinfo";
		   biglb="2";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").show();
		   $("#cyry").hide();
		   $("#zyry").hide();
		   break; 
		case "004001006":
		   ztxxtype="17";//供应商
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getTbdwinfo";
		   biglb="2";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").show();
		   $("#cyry").hide();
		   $("#zyry").hide();
		   break;
        case "004002001":
		   ztxxtype="18";//代理从业人员
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getDaiLiPeopleinfo";
		   biglb="3";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").hide();
		   $("#cyry").show(); 
		   $("#zyry").hide();
		   break; 
        case "004002002":
		   ztxxtype="13";//项目经理
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getRenyuaninfo";
		   biglb="4";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").hide();
		   $("#cyry").hide(); 
		   $("#zyry").show();
		   break; 
        case "004002003":
		   ztxxtype="14";//项目总监
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getRenyuaninfo";
		   biglb="4";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").hide();
		   $("#cyry").hide(); 
		   $("#zyry").show();
		   break;
        case "004002004":
		   ztxxtype="15";//勘查工程师
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getRenyuaninfo";
		   biglb="4";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").hide();
		   $("#cyry").hide(); 
		   $("#zyry").show();
		   break; 
        case "004002005":
		   ztxxtype="16";//设计工程师
		   url="/EpointSuZhouWebService/rest/infoToWangzhanaction/getRenyuaninfo";
		   biglb="4";
		   pagesize="15";
		   $("#zbdl").hide();
		   $("#tbxx").hide();
		   $("#cyry").hide(); 
		   $("#zyry").show();
		   break;   		   
	}
}	
//左侧树
function getLeftTree(){
	var obj={}; 
	obj.categorynum=cNum;
	obj.siteguid=siteInfo.siteGuid;
	$.ajax({
		 url:siteInfo.projectName + "/ZtxxSearchAction.action?cmd=getLeftTree",
		 type: 'get',
         dataType: 'json',
		 data:obj,
		 success: function (msg) { // 返回数据后处理
                            if(msg != null && msg != ""){
                             	msg =msg.custom;
				                $("#secondcategory").html(msg); 
								$(".wb-tree li:first-child").addClass("current"); 
								if(ztlx)
								{
									var nums =ztlx.substring(ztlx.length-1); 
									$(".wb-tree-sub li:nth-child("+nums+") a").attr('style','color:#fff;font-weight: bold;background: url(/images/trade_ico_hover.png) no-repeat;');
								}
								else
								{
								//$(".wb-tree-sub li:first-child a").attr('style','color:#fff;font-weight: bold;background: url(/images/trade_ico_hover.png) no-repeat;');
								$("#004001001").attr('style','color:#fff;font-weight: bold;background: url(/images/trade_ico_hover.png) no-repeat;');
								}
                            }
         }
	});
}
   
//调用接口
function getdata(indexpage)
	{
		var htmltep=""; 
		if(biglb=="1")
		{
			var danweiname = encodeURI($("#danweiname").val());
			var zizhilevel = encodeURI($("#dlzz").val());
		    url =url+"?type="+ztxxtype+"&danweiname="+danweiname+"&zizhilevel="+zizhilevel+"&first="+indexpage+"&pagesize="+pagesize+"";
			htmltep=$('#info-template-001').html();
		}
		else if(biglb=="2")//投标单位信息
		{
			var danweiname = encodeURI($("#danweiname2").val()); 
		    url =url+"?type="+ztxxtype+"&danweiname="+danweiname+"&first="+indexpage+"&pagesize="+pagesize+"";
			htmltep=$('#info-template-002').html();
		}
		else if(biglb=="3")//从业人员
		{
			var danweiname = encodeURI($("#danweiname3").val()); 
			var dailipeo = encodeURI($("#dailipeo").val()); 
			var zyzg = encodeURI($("#zyzg").val()); 
		    url =url+"?type="+ztxxtype+"&danweiname="+danweiname+"&zyzg="+zyzg+"&dailipeo="+dailipeo+"&first="+indexpage+"&pagesize="+pagesize+"";
			htmltep=$('#info-template-003').html();
		}
		else if(biglb=="4")//执业人员
		{
			var danweiname = encodeURI($("#danweiname4").val()); 
			var renyuanname = encodeURI($("#renyuanname").val()); 
			var level = encodeURI($("#level").val()); 
		    url =url+"?type="+ztxxtype+"&danweiname="+danweiname+"&level="+level+"&renyuanname="+renyuanname+"&first="+indexpage+"&pagesize="+pagesize+"";
			htmltep=$('#info-template-004').html();
		}
		$.ajax({
			  url:url, 
              type: "get",
              dataType: "json",  
			  success: function(msg) {
				 
				  // var data =$.parseJSON(msg.custom); 
				  var list1 = msg.info;
                 $("#infoList").html("");
                  $.each(list1,function(indexs, el) {
                      var index = indexs + 1;
                      el.index = index + indexpage*pagesize;
                   }); 
				  //判断使用模版 
				   $("#infoList").append(Mustache.render(htmltep, {info:list1}));
				 
				  //销毁分页  
			          if ($pager.pagination()) {
                            $pager.pagination('destroy');
                         } 
				  
				  //分页初始化 
         $pager.pagination({
           pageIndex: indexpage,
            pageSize: pagesize,
            total: msg.infocnt,
            debug: true,
            showInfo: true,
            showJump: true,
            showPageSizes: true,
            pageElementSort: ['$page', '$jump']
         });					  
			    //分页按钮点击事件
               $("#page").on("pageClicked", function (event, data) {
	                 onClickSelect(cNum,data.pageIndex); 
		            }).on('jumpClicked', function (event, data) {
                      onClickSelect(cNum,data.pageIndex); 
                     }); 	
				 
				  				
			  },
			  error:function(msg){
				  alert("没有信息内容！");
				    if ($pager.pagination()) {
                            $pager.pagination('destroy');
                         } 
			  }
			});
	} 
 function onClickSelect(categoryNum,indexpage){
              
				catu2 = "#"+cNum;
				$(catu2).attr('style','');
				if(cNum.length==3)
				{
					categoryNum ="004001001";  
				}
                if(categoryNum){
                    cNum = categoryNum;
					catu = "#"+categoryNum;
					$(catu).attr('style','color:#fff;font-weight: bold;background: url(/images/trade_ico_hover.png) no-repeat;');
                } 
				else
				{
					catu = "#"+cNum;
					$(catu).attr('style','color:#fff;font-weight: bold;background: url(/images/trade_ico_hover.png) no-repeat;');
				}
				  gettype(cNum);
                getdata(indexpage); 
 }
     