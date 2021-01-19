
	var opt; 
	var diqu = ""; 
	var categorynumall ='003';
	var pagesize=15; 
	var lj="";
	var urlqt="";
	var catedq="";
	var myurl=location.href.split("/");
	//console.log(location.href);
	var catenum=myurl[myurl.length-2];
	//console.log(catenum);
$(document).ready(function() { 
   catedq=$("#catenum").val();
   getdq(catedq.substring(0,3)); 
	//初始化
	getLeftTree();
	getZsType();
	getXiaQu();
	getZblx();
    getRl(); 
	//展示搜索条件
	xstj(categorynumall);
     //初始交易信息“003”
 
		   $("#jsgc").hide();
		   $("#nojsgc").show();
		   $("#titletxt2").val();
		   $("#infodatefrom2").val();
		   $("#infodateto2").val();
		   $("#xiaqutxt2").val(diqu);
		   $("#xiaqutxt2_chosen .chosen-single span").html(diqu);
		   BindGrid3(categorynumall,'0')
	   
	   
	  
});

 //初始化左侧树
function getLeftTree(){ 
	$.ajax({ 
		url:siteInfo.projectName + "/JyxxSearchAction.action?cmd=getLeftTree",
		type:"get",
		data:"categorynum="+categorynumall,
		dataType: "json",
		cache:false,
		success:function(msg){
			if(msg != null && msg != ""){
				msg = msg.custom;
				var str="";
				if(catenum!="035006"&&catenum!="031006"){
					str="<li class='wb-tree-items haschild'>"+
						"<h3 class='wb-tree-node'>"+
                        "<i class='wb-tree-iconr'></i>"+
                        "<span class='wb-tree-tt-bg'>"+
                        "<a href='"+urlqt+"' target=_blank class='wb-tree-tt'>其他公告</a>"+
                        "</span>"+
                        "</h3></li>";
				}
				 
//				if(catedq=="031006")	
//					  str="<li class='wb-tree-items haschild'>"+
//						"<h3 class='wb-tree-node'>"+
//                      "<i class='wb-tree-iconr'></i>"+
//                      "<span class='wb-tree-tt-bg'>"+
//                      "<a href='"+urlqt+"' target=_blank class='wb-tree-tt'>其他工程</a>"+
//                      "</span>"+
//                      "</h3></li>";
//				msg +=str;
				$("#secondcategory").html(msg);
				
				$('.wb-tree-items').each(function() {
        var _this = $(this);
        if (_this.find(".wb-tree-subs").length > 0) {
            _this.addClass('hasChild');
            if (_this.hasClass("current")) {
                _this.data("navtag", "1");
            } else {
                _this.data("navtag", "0");
            }

        }
    });
    $('.wb-tree-node').on('click', function(e) {
        e.preventDefault();
        var _this = $(this);
        if (_this.next().length > 0) {
            var curTag = _this.parent().data('navtag');
            if (curTag == "1") {
                _this.parent().toggleClass('current');
            } else {
                $('.wb-tree-items.hasChild').removeClass('current');
                _this.parent().addClass('current');
                $('.wb-tree-items.hasChild').data('navtag', '0');
                _this.parent().data('navtag', '1');
            }
        } else {
            //window.location.href = _this.children("a").attr("href");
        }

    });
    

    $('.wb-tree-item').each(function() {
        var _this = $(this);
        if (_this.find(".wb-four-subs").length > 0) {
            _this.addClass('hasChild');
            if (_this.hasClass("current")) {
                _this.data("navtag", "1");
            } else {
                _this.data("navtag", "0");
            }

        }
    });
    $('.wb-three-node').on('click', function(e) {
        e.preventDefault();
        var _this = $(this);
        if (_this.next().length > 0) {    
            var curTag = _this.parent().data('navtag');
            if (curTag == "1") {
                _this.parent().toggleClass('current');
            } else {
                $('.wb-tree-item.hasChild').removeClass('current');
                _this.parent().addClass('current');
                $('.wb-tree-item.hasChild').data('navtag', '0');
                _this.parent().data('navtag', '1');
                $('.wb-tree-item').each(function() {
        var _this = $(this);
        if (_this.hasClass("hasChild")) {
            
        }else{
        	_this.removeClass("current");
        }
    });

                
            }
        } else {
            //window.location.href = _this.children("a").attr("href");
        }
        
        
    });
				
				
				
				//张家港分中心
				if(catenum=="031006"){
    	            $.each($(".wb-tree-items"), function(i,item) {
    	                var mycatnum=$(item).attr("id");
    	                //console.log(mycatnum);
    	                if(mycatnum=="003001"||mycatnum=="003003"||mycatnum=="003004"||mycatnum=="003005"||mycatnum=="003006"||mycatnum=="003011"||mycatnum=="003021"){
    		                $(item).attr("style","display: block;");
    	                }
    	                $("#003003002").parent().parent().attr("style","display: none;");
    	                $("#003002006").parent().parent().attr("style","display: none;");
    	                $("#003003005").parent().parent().attr("style","display: none;");
    	                $("#003003006").parent().parent().attr("style","display: none;");
    	                $("#003004008").parent().parent().attr("style","display: none;");
    	                $("#003004009").parent().parent().attr("style","display: none;");
    	                $("#003004005").parent().parent().attr("style","display: none;");
    	                
    	                $("#003001011").parent().parent().attr("style","display: none;");
                        $("#003001012").parent().parent().attr("style","display: none;");
                        $("#003001013").parent().parent().attr("style","display: none;");
                        $("#003001014").parent().parent().attr("style","display: none;");
                        $("#003001015").parent().parent().attr("style","display: none;");
                        $("#003001016").parent().parent().attr("style","display: none;");
                        $("#003001017").parent().parent().attr("style","display: none;");
                        
                        //水利工程
                         $("#003003007").parent().parent().attr("style","display: none;");
                          $("#003003008").parent().parent().attr("style","display: none;");
                           $("#003003009").parent().parent().attr("style","display: none;");
                           $("#003003010").parent().parent().attr("style","display: none;");
                           $("#003003011").parent().parent().attr("style","display: none;");
                           $("#003003012").parent().parent().attr("style","display: none;");
                           $("#003003013").parent().parent().attr("style","display: none;");
                           
                           //政府采购
    	                   $("#003004010").parent().parent().attr("style","display: none;");
                           $("#003004011").parent().parent().attr("style","display: none;");
                    
    	             $("#003001018").parent().parent().attr("style","display: none;");
    	            $($("#003021").find(".wb-tree-tt")).html("其他工程");
    	            
    	             $("#003001003").parent().parent().attr("style","display: none;");
    	            $("#003001010").parent().parent().attr("style","display: none;");
    	             	            
    	            });
                }
				//吴江分中心
				if(catenum=="035006"){
    	            $.each($(".wb-tree-items"), function(i,item) {
    	                var mycatnum=$(item).attr("id");
    	                //console.log(mycatnum);
    	                if(mycatnum=="003001"||mycatnum=="003002"||mycatnum=="003003"||mycatnum=="003004"||mycatnum=="003010"||mycatnum=="003022"||mycatnum=="003023"){
    		                $(item).attr("style","display: block;");
    	                }
//  	                $("#003003002").parent().parent().attr("style","display: none;");
    	                $("#003002006").parent().parent().attr("style","display: none;");
    	                $("#003003005").parent().parent().attr("style","display: none;");
    	                $("#003003006").parent().parent().attr("style","display: none;");
    	                $("#003004008").parent().parent().attr("style","display: none;");
    	                //$("#003004009").parent().parent().attr("style","display: none;");
    	                
    	                 $("#003001011").parent().parent().attr("style","display: none;");
                        $("#003001012").parent().parent().attr("style","display: none;");
                        $("#003001013").parent().parent().attr("style","display: none;");
                        $("#003001014").parent().parent().attr("style","display: none;");
                        $("#003001015").parent().parent().attr("style","display: none;");
                        $("#003001016").parent().parent().attr("style","display: none;");
                        $("#003001017").parent().parent().attr("style","display: none;");
                        
                        //水利工程
                         $("#003003007").parent().parent().attr("style","display: none;");
                          $("#003003008").parent().parent().attr("style","display: none;");
                           $("#003003009").parent().parent().attr("style","display: none;");
                           $("#003003010").parent().parent().attr("style","display: none;");
                           $("#003003011").parent().parent().attr("style","display: none;");
                           $("#003003012").parent().parent().attr("style","display: none;");  
                           $("#003003013").parent().parent().attr("style","display: none;");
                    });
                    
                   $($("#003022").find(".wb-tree-tt")).html("土地交易");
                   $($("#003023").find(".wb-tree-tt")).html("资源交易");
                   $("#003001001").html("招标公告");
                   $("#003001008").html("中标结果公告");
                    $("#003001003").parent().parent().attr("style","display: none;");
//                   $("#003001009").parent().parent().attr("style","display: none;");
                      $("#003001010").parent().parent().attr("style","display: none;");
                      $("#003004001").parent().parent().attr("style","display: none;");
                       $("#003004005").parent().parent().attr("style","display: none;");
                       
                        $("#003002002").parent().parent().attr("style","display: none;");
                        $("#003002005").parent().parent().attr("style","display: none;");
                        
                         $("#003004004").parent().parent().attr("style","display: none;");
                           $("#003004010").parent().parent().attr("style","display: none;");
                   
                }
			    //太仓分中心
			    if(catenum=="033006"){
    	            $.each($(".wb-tree-items"), function(i,item) {
    	                var mycatnum=$(item).attr("id");
    	                //console.log(mycatnum);
    	                if(mycatnum=="003001"||mycatnum=="003002"||mycatnum=="003003"||mycatnum=="003004"||mycatnum=="003006"||mycatnum=="003012"||mycatnum=="003013"||mycatnum=="003019"||mycatnum=="003027"){
    		                $(item).attr("style","display: block;");
    	                }
    	                $("#003003002").parent().parent().attr("style","display: none;");
    	                $("#003002006").parent().parent().attr("style","display: none;");
    	                $("#003003005").parent().parent().attr("style","display: none;");
    	                $("#003003006").parent().parent().attr("style","display: none;");
    	                $("#003004008").parent().parent().attr("style","display: none;");
    	                $("#003004009").parent().parent().attr("style","display: none;");
    	                
    	                 $("#003001011").parent().parent().attr("style","display: none;");
                        $("#003001012").parent().parent().attr("style","display: none;");
                        $("#003001013").parent().parent().attr("style","display: none;");
                        $("#003001014").parent().parent().attr("style","display: none;");
                        $("#003001015").parent().parent().attr("style","display: none;");
                        $("#003001016").parent().parent().attr("style","display: none;");
                        $("#003001017").parent().parent().attr("style","display: none;");
                        
                     //水利工程
                         $("#003003007").parent().parent().attr("style","display: none;");
                          $("#003003008").parent().parent().attr("style","display: none;");
                           $("#003003009").parent().parent().attr("style","display: none;");
                           $("#003003010").parent().parent().attr("style","display: none;");
                           $("#003003011").parent().parent().attr("style","display: none;");
                           $("#003003012").parent().parent().attr("style","display: none;");
                           $("#003003013").parent().parent().attr("style","display: none;");
                           
                           //政府采购
    	                   $("#003004010").parent().parent().attr("style","display: none;");
                           $("#003004011").parent().parent().attr("style","display: none;");
                    
    	             $("#003001018").parent().parent().attr("style","display: none;");
    	              $("#003001010").parent().parent().attr("style","display: none;");
    	            });
                }
			    //常熟分中心
			    if(catenum=="032006"){
    	            $.each($(".wb-tree-items"), function(i,item) {
    	                var mycatnum=$(item).attr("id");
    	                //console.log(mycatnum);
    	                if(mycatnum=="003001"||mycatnum=="003002"||mycatnum=="003003"||mycatnum=="003004"||mycatnum=="003006"||mycatnum=="003014"||mycatnum=="003015"||mycatnum=="003016"||mycatnum=="003017"||mycatnum=="003018"||mycatnum=="003024"){
    		                $(item).attr("style","display: block;");
    	                }
                    });
                    $("#003003002").parent().parent().attr("style","display: none;");
                    $("#003001003").parent().parent().attr("style","display: none;");
                    $("#003001010").parent().parent().attr("style","display: none;");
                    $("#003002002").parent().parent().attr("style","display: none;");
                    $("#003002005").parent().parent().attr("style","display: none;");
                     $("#003004001").parent().parent().attr("style","display: none;");
                      $("#003004004").parent().parent().attr("style","display: none;");
                       $("#003004005").parent().parent().attr("style","display: none;");
                        $("#003004008").parent().parent().attr("style","display: none;");
                        
                        $("#003001011").parent().parent().attr("style","display: none;");
                        $("#003001012").parent().parent().attr("style","display: none;");
                        $("#003001013").parent().parent().attr("style","display: none;");
                        $("#003001014").parent().parent().attr("style","display: none;");
                        $("#003001015").parent().parent().attr("style","display: none;");
                        $("#003001016").parent().parent().attr("style","display: none;");
                        $("#003001017").parent().parent().attr("style","display: none;");
                      //水利工程
                         $("#003003007").parent().parent().attr("style","display: none;");
                          $("#003003008").parent().parent().attr("style","display: none;");
                           $("#003003009").parent().parent().attr("style","display: none;");
                           $("#003003010").parent().parent().attr("style","display: none;");
                           $("#003003011").parent().parent().attr("style","display: none;");
                           $("#003003012").parent().parent().attr("style","display: none;");
                           $("#003003013").parent().parent().attr("style","display: none;");
                           
                           //政府采购
    	                   $("#003004010").parent().parent().attr("style","display: none;");
                           $("#003004011").parent().parent().attr("style","display: none;");
                                                                       
                            $("#003001018").parent().parent().attr("style","display: none;"); 
                }
			    //昆山分中心
			     if(catenum=="034006"){
    	            $.each($(".wb-tree-items"), function(i,item) {
    	                var mycatnum=$(item).attr("id");
    	                //console.log(mycatnum);
    	                if(mycatnum=="003001"||mycatnum=="003002"||mycatnum=="003003"||mycatnum=="003004"||mycatnum=="003005"||mycatnum=="003006"||mycatnum=="003020"||mycatnum=="003028"){
    		                $(item).attr("style","display: block;");
    	                }
                    });
                   // $("#003003002").parent().parent().attr("style","display: none;");
                    $("#003002006").parent().parent().attr("style","display: none;");
                    $("#003003009").parent().parent().attr("style","display: none;");
    	                $("#003003005").parent().parent().attr("style","display: none;");
    	                $("#003003006").parent().parent().attr("style","display: none;");
    	                $("#003004008").parent().parent().attr("style","display: none;");
    	                $("#003004009").parent().parent().attr("style","display: none;");
    	                 $("#003001010").parent().parent().attr("style","display: none;");
    	                 
    	                 //水利工程
                         $("#003003008").parent().parent().attr("style","display: none;");
                          $("#003003012").parent().parent().attr("style","display: none;");
                           $("#003003011").parent().parent().attr("style","display: none;");
                           $("#003003013").parent().parent().attr("style","display: none;");
                           
                           //政府采购
    	                   $("#003004010").parent().parent().attr("style","display: none;");
                           $("#003004011").parent().parent().attr("style","display: none;");
                            $("#003004001").parent().parent().attr("style","display: none;");
                             $("#003004004").parent().parent().attr("style","display: none;");
                              $("#003004005").parent().parent().attr("style","display: none;");
                               $("#003004007").parent().parent().attr("style","display: none;");
                           
                           $("#003001003").parent().parent().attr("style","display: none;");
    	               
    	                 $("#003001018").parent().parent().attr("style","display: none;");
    	                 
    	                 $("#003002001").parent().parent().attr("style","display: none;");
    	                 $("#003002002").parent().parent().attr("style","display: none;");
    	                 $("#003002003").parent().parent().attr("style","display: none;");
    	                 $("#003002004").parent().parent().attr("style","display: none;");
    	                 $("#003002005").parent().parent().attr("style","display: none;");
    	               
    	               //名称自定义
    	                 $("#003001001").html("招标公告");
    	                $("#003004006").html("中标（成交）公告");
    	                $("#003004007").html("合同公示");
    	                $("#003001006").html("资格审查及未入围公示");
    	                $("#003001005").html("招标控制价公示");
    	                 $("#003001008").html("中标人公告");
    	                 
    	                  //国企采购栏目
    	                  $("#003020").find("a").attr("onclick","window.open('http://180.97.207.32/TPFrontnew/gycq/')");
                           //$("#003020").find("a").attr("href","http://180.97.207.32/TPFront/gycq/");
    	                
                }
			}
		}
	});
}

//获取当前所在地区
function getdq(catedq)
{
	switch (catedq)
	{
		case "031":
	          diqu = "张家港";
			  urlqt ="http://58.211.227.179/ggzyweb/";
			  break;
		case "032":
	          diqu = "常熟市";
			  urlqt ="http://222.92.204.18/changshuFront/jyxx/";
			  break;	
        case "033":
	          diqu = "太仓市";
			  urlqt ="http://49.73.235.219:8090/TPFront/jyxx/";
			  break;
        case "034":
	          diqu = "昆山市";
			  urlqt ="http://180.97.207.32/TPFront/";
			  break;
        case "035":
	          diqu = "吴江区";
			  urlqt ="http://58.211.231.163:7090/wjggzy/ggzyjy/010001/";
			  break;			  
	}
}

//显示搜索条件
function xstj(categorynum)
{
		var len=categorynum.length;
	   if(len>3 && categorynum.substring(0,6)=="003001")
	   {
		   $("#nojsgc").hide();
		   $("#jsgc").show();
	   }
	     else
	     {
	       $("#jsgc").hide();
		   $("#nojsgc").show();
		 }
}
//初始化资审类别
function getZsType()
{
	$("#zslxtxt").append("<option value=' '>所有</option>");
	$("#zslxtxt").append("<option value='1'>资格预审</option>");
	$("#zslxtxt").append("<option value='2'>资格后审</option>");
	       //chosen下拉框
           	$("#zslxtxt").chosen({
			disable_search_threshold: 10
			});
}

//初始化地区
function getXiaQu()
{
	 $("#xiaqutxt").append("<option value='"+diqu+"'>"+diqu+"</option>");
	  //chosen下拉框
           	$("#xiaqutxt").chosen({
			disable_search_threshold: 10
			});	
	 $("#xiaqutxt2").append("<option value='"+diqu+"'>"+diqu+"</option>");
	  //chosen下拉框
           	$("#xiaqutxt2").chosen({
			disable_search_threshold: 10
			});		
}

//初始化招标类型
function getZblx()
{
	var list=["施工招标","监理招标","专业招标","货物招标","设计招标","勘察招标","检测招标","其他招标"]
	$("#zblxtxt").append("<option value=' '>所有</option>");
	$.each(list,function(index,value){ 
	  $("#zblxtxt").append("<option value='"+value+"'>"+value+"</option>");
    }); 
	  //chosen下拉框
           	$("#zblxtxt").chosen({
			disable_search_threshold: 10
			});	
}

//加载时间
function getRl()
{
	// 日期选择
            laydate.render({
                elem: '#infodatefrom', //开始日期
                theme: '#4683db',
                done: function (value, date, endDate) { //选择完毕回调

                }
            });
            laydate.render({
                elem: '#infodateto', //结束日期
                theme: '#4683db',
                done: function (value, date, endDate) { //选择完毕回调

                }
            });
	 
	     laydate.render({
                elem: '#infodatefrom2', //开始日期
                theme: '#4683db',
                done: function (value, date, endDate) { //选择完毕回调

                }
            });
            laydate.render({
                elem: '#infodateto2', //结束日期
                theme: '#4683db',
                done: function (value, date, endDate) { //选择完毕回调

                }
            }); 
	   
  } 
  
	
//动态搜索分页列表加载
function getdata2(obj,indexpage,types,categorynum) { 
    var $pager=$("#pager");
	var url=siteInfo.projectName + "/JyxxSearchAction.action?cmd=getList1";
	var htmltep=$('#info-template').html();
	$.ajax({
			  url:url, 
              type: "get",
              dataType: "json",
              data:obj,			  
			  success: function(msg) {
				 
				  var data =$.parseJSON(msg.custom);  
                 $("#xxList").html("");
                  $.each(data.Table,function(indexs, el) {
                      var index = indexs + 1;
                      el.index = index + indexpage*pagesize;
                   }); 
				  //判断使用模版 
				   $("#xxList").append(Mustache.render(htmltep, {Table:data.Table}));
				 
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
                   $pager.on("pageClicked", function (event, data) {
					   if(types==2)
	                       BindGrid2(categorynum,data.pageIndex); 
					   if(types==3)
	                       BindGrid3(categorynum,data.pageIndex);  
		            }).on('jumpClicked', function (event, data) {
                        if(types==2)
	                       BindGrid2(categorynum,data.pageIndex); 
					    if(types==3)
	                       BindGrid3(categorynum,data.pageIndex);  
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
								
//条件查询
function search2(categorynum){  
	if(categorynum == ''){
		categorynum = categorynumall;
	}  
	var len=categorynum.length;
	
	if(len==9&&$("#"+categorynum).parent().next().length==0){		
		$(".wb-tree-item").removeClass("current");
		$("#"+categorynum).parent().parent().addClass("current");
	}else{
		
	}
	
	if(len==6){
		$(".wb-tree-item").removeClass("current");
		$(".wb-tree-items").removeClass("current");
		$("#"+categorynum).addClass("current");
	}
	
	if(len>3 && categorynum.substring(0,6)=="003001")
	{
		   $("#nojsgc").hide();
		   $("#jsgc").show();
		   BindGrid2(categorynum,'0');
	}
    else
	{
		$("#jsgc").hide();
		$("#nojsgc").show();
        BindGrid3(categorynum,'0');	
	}		
}

 
 //建设工程
function BindGrid2(categorynum,indexpage) {
	var xmmc=$("#titletxt").val().trim(); 
	var zstype=$("#zslxtxt").val().trim();  
	var zblx=$("#zblxtxt").val().trim();
	var starttime = $("#infodatefrom").val();
	var endtime = $("#infodateto").val();
	categorynumall = categorynum; 
    var obj={};
	obj.categorynum=categorynum;
	obj.diqu=diqu;
	obj.xmmc=xmmc;
	obj.zstype=zstype;
	obj.zblx=zblx;
	obj.starttime=starttime;
	obj.endtime=endtime;
	obj.siteguid=siteInfo.siteGuid;
	obj.pageIndex=indexpage;
	obj.pageSize=pagesize;
    getdata2(obj,indexpage,2,categorynum); 
}
//非建设工程
function BindGrid3(categorynum,indexpage) {
	var xmmc=$("#titletxt2").val().trim(); 
	var zstype=""; 
	var zblx="";
	var starttime = $("#infodatefrom2").val();
	var endtime = $("#infodateto2").val();
	categorynumall = categorynum; 
    var obj={};
	obj.categorynum=categorynum;
	obj.diqu=diqu;
	obj.xmmc=xmmc;
	obj.zstype=zstype;
	obj.zblx=zblx;
	obj.starttime=starttime;
	obj.endtime=endtime;
	obj.siteguid=siteInfo.siteGuid;
	obj.pageIndex=indexpage;
	obj.pageSize=pagesize;
    getdata2(obj,indexpage,3,categorynum); 
}






