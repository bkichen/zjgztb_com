var milliseconds = new Date().getTime();
var data1="";
var data2="";
var data3="";
var data4="";
(function(win,$){
	
	var type= new ServiceUtil().RequestString("type");
 
	 //切换js调用
	    $("#xztype").each(function (index, el) {
            new TabView({
				activeIndex:parseInt(type)-1,
                dom: el,
                activeCls: 'cur'
            });
         });    
	geturl(0,15,1,"gglist");
	geturl(0,15,2,"gslist");
	geturl(0,15,3,"kblist");
	geturl(0,15,4,"pblist");
	 
}(this,jQuery));

function geturl(pageindex,pagesize,type,divid)
{
	//第一页
	var url =siteInfo.projectName + "/YwDjAction.action?cmd=getJRJYDeatil";
	if(pageindex==0)
	{
		url ="/tjjson/tjyinfo"+type+"/1.json";
	}
	pdJson(url,pageindex,pagesize,type,divid);
}
function pdJson(url,pageindex,pagesize,type,divid)
	{
	 $.ajax({
                url: url,
                type: 'HEAD', 
                error: function () {
                     //文件不存在，请求接口生成文件
					 url =siteInfo.projectName + "/YwDjAction.action?cmd=getJRJYDeatil";
                     getinfolistdt(url,pageindex,pagesize,type,divid);
                },
                success: function () {
                    //文件存在,验证是否有效,两个小时
                    validategetinfolistjson(url,pageindex,pagesize,type,divid,72000);

                }
            });
	}
 //验证有效json
    function  validategetinfolistjson(url,pageindex,pagesize,type,divid,time){
                $.ajax({
                            url:url,
                            type:"get",
                            dataType:"json",
                            async:false,
							cache:false,
                            success:function(msg){
                                if(msg != null && msg != ""){
                                    var expireTime = msg.expiretime;
                                    if(milliseconds-expireTime<time){ 
                                        getinfolistjt(url,pageindex,pagesize,type,divid);
                                    }else{
										 url =siteInfo.projectName + "/YwDjAction.action?cmd=getJRJYDeatil";
                                        getinfolistdt(url,pageindex,pagesize,type,divid);
                                    }
                                }
                            },
                            error:function(e){
                                console.log(e);
                            }
                    });
    }; 
//调用静态json
   function getinfolistjt(url,pageindex,pagesize,type,divid){ 
	 $.ajax({
            url: url, 
            type: "GET",
            dataType: "json", 
            success: function(data) {
				 data = $.parseJSON(data.data); 
				 dataRand(data,pageindex,pagesize,type,divid);
			},
            error: function(error) {
                console.log(error);
            }
        });
   }
function getinfolistdt(url,pageindex,pagesize,type,divid){
	
	 var opt = {};
	 opt.type = type;
	 opt.pagesize = pagesize;
	 opt.pageindex=pageindex+1; 
	 $.ajax({
            url: url, 
            type: "post",
            dataType: "json",
            data:opt,
            success: function(data) {
				data = $.parseJSON(data.custom);   
				 dataRand(data,pageindex,pagesize,type,divid);
            },
            error: function(error) {
                console.log(error);
            }
        });
}

function dataRand(data,pageindex,pagesize,type,divid)
{
	 var M = Mustache,
	 $showList = $("#"+divid+""),
	 $showListTmpl = $("#"+divid+"-tmpl").html(),
	 $pager=$(".pager"+type+"");
				   //置空
				  $showList.html("");
                  if(data.InfoTotalCount>0)
				  {
				   
				  // 添加序号
                  $.each(data.WZInfoRowLst, function(index, val) { 
                      val.xuhao = index + 1+ pageindex*pagesize; 
                  });
				  //判断使用模版
				  $showList.append(M.render($showListTmpl,data));
				  
				  //处理时间
				  $showList.find("tr").each(function(){
					  var date = $(this).find(".dates").html().split(" ")[0];
					  $(this).find(".dates").html(date);
				  })
				  
				   if ($pager.pagination()) {
                       $pager.pagination('destroy');
                   }  
			 
				  //分页初始化 
                      $pager.pagination({
                            pageIndex: pageindex,
                            pageSize: pagesize,
                            total: data.InfoTotalCount,
                            debug: true,
                            showInfo: true,
                            showJump: true,
                            showPageSizes: true,
                             pageElementSort: ['$page', '$jump']
                        });					  
			    //分页按钮点击事件
                   $pager.on("pageClicked", function (event, data) {  
					   geturl(data.pageIndex,pagesize,type,divid);
		            }).on('jumpClicked', function (event, data) {
                        geturl(data.pageIndex,pagesize,type,divid);
                     }); 
				  }
}	