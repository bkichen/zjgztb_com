// left tree

var column="";

(function(win, $) {
	
	$("#003004").find("a").attr("href","javaScript:void(0)");
	
	$("#003004").on("click",function(){
		addVisitCount("政府采购");
		window.open("http://czju.suzhou.gov.cn/zfcg/html/main/index.shtml");
	})
	
    $('.wb-tree').on('click', '.wb-tree-node', function(event) {
		var $this = $(this).parent();
		if($this.attr("id")=="003004"){
			return;
		}
		if ($this.hasClass('haschild')) { 
                if($this.hasClass('current')){
					
				}else{
					$('.wb-tree-items').removeClass('current');
				}
           
        }
		if ($this.hasClass('haschild')) { 
                $this.toggleClass('current'); 
        }
    });
    
    $.each($(".wb-tree-items"), function(i,item) {
    	var mycatnum=$(item).attr("id");
    	//console.log(mycatnum);
    	if(mycatnum=="003001"||mycatnum=="003002"||mycatnum=="003003"||mycatnum=="003004"||mycatnum=="003005"||mycatnum=="003006"||mycatnum=="003007"||mycatnum=="003025"||mycatnum=="003026"){
    		$(item).attr("style","display: block;");
    	}
    	$("#003002006").attr("style","display: none;");
    	$("#003003005").attr("style","display: none;");
    	$("#003003006").attr("style","display: none;");
    	$("#003004008").attr("style","display: none;");
    	$("#003004009").attr("style","display: none;");
    	
    	$("#003001011").attr("style","display: none;");
                     $("#003001012").attr("style","display: none;");
                        $("#003001013").attr("style","display: none;");
                        $("#003001014").attr("style","display: none;");
                        $("#003001015").attr("style","display: none;");
                        $("#003001016").attr("style","display: none;");
                        $("#003001017").attr("style","display: none;");
                        
                         //水利工程
                         $("#003003007").attr("style","display: none;");
                          $("#003003008").attr("style","display: none;");
                           $("#003003009").attr("style","display: none;");
                           //$("#003003010").attr("style","display: none;");
                           $("#003003011").attr("style","display: none;");
                           $("#003003012").attr("style","display: none;");
                           
                           //政府采购
    	                   $("#003004010").attr("style","display: none;");
                           $("#003004011").attr("style","display: none;");
                           
                           
                            $("#003001018").attr("style","display: none;");
                            
                            
                             //土地工程
    	                   $("#003005003").attr("style","display: none;");
                           $("#003005005").attr("style","display: none;");
                            $("#003005006").attr("style","display: none;");
                           
//                         $("#003004").on("click",function(e){
//                         	e.preventDefault();
//                         })
    });

    // 搜索
    // $('#ewb-search-all').on('click', function() {
        // $('#ewb-search-hide').show();
    // });
    // $('#ewb-search-cancel').on('click', function() {
        // $('#ewb-search-hide').hide();
    // });

// 多选
    // $('#ewb-still-more').on('click',function(){
        // $('.ewb-still-txt').toggleClass('hidden');
        // $('.ewb-area-right').toggleClass('hidden');
        // $('.ewb-multi').toggleClass('hidden');
		// getCity2();
    // })
	
    // $('#ewb-cancel').on('click',function(){
        // $('.ewb-still-txt').toggleClass('hidden');
        // $('.ewb-area-right').toggleClass('hidden');
        // $('.ewb-multi').toggleClass('hidden');
		// document.location.reload();
    // });
    
    $(".wb-tree-items").each(function(i,item) {
    	if($(item).hasClass("current")){   		
    		console.log($($(item).find(".column")).val());
    		column=$($(item).find(".column")).val();
    		addVisitCount(column);
    	}
    });
    
    
}(this, jQuery));



function addVisitCount(column){
    var $pager=$("#pager");
    $.ajax({
        type:"post",
        url:siteInfo.projectName+"/visitCount.action?cmd=addVisitCount",
        dataType:'json',
        data:{
            "type":"list",
            "column":column           
        },
        success:function(msg){
           // console.log(msg);
        }
           
   });
}