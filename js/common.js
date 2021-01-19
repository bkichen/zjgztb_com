/* 页面交互公共效果 */

(function (win, $) {
    if (!window.Util) {
        window.Util = {};
    }
    $.extend(Util, {
        /**
         * 获取数组中的最大值
         * @arr Array 数据源
         * @key String 获取数据的key
         */
        getMax: function (arr, key) {
            var max = 0,
                len = arr.length;
            for (var i = 0; i < len; i++) {
                var item = arr[i][key];
                if (max < item) max = item;
            }
            return max;
        }
    }); 
	 $("title").html("苏州市公共资源交易平台"); 
}(this, jQuery));

// 加载头尾代码片段
(function (win, $) {

    var Include = function (cfg) {
        this.cfg = cfg;

        this._init();
    };

    Include.prototype = {
        constructor: Include,

        _init: function () {
            var c = this.cfg;

            if (c.async !== false) c.async = true;

            this.$container = $('#' + c.id);
        },

        fetch: function () {
            var c = this.cfg,
                self = this;

            return $.ajax({
                url: c.src,
                type: 'GET',
                dataType: 'html',
                async: c.async,
                success: function (html) {
                    self.$container.html(html);

                    c.onload && c.onload(html);
                }
            });
        }
    };

    var chosenConfig = {
        disable_search_threshold: 10
    }

    // 需要引入的代码片段 ★头尾是js加载的，头尾的js要写在回调函数里★
    var includes = [{
        id: 'header',
        src: '/header.inc.html',
        onload: function () {
			
			//导航高亮 
			 var x=window.location.href; 
	            var s=x.split("/")[3];
	            if(s.length!=0){
					if(s.indexOf("html")<0)
		                $("."+s).addClass("current"); 
            	}else{
		           $(".all").addClass("current"); 
	            }
				
            // 市悬停，显示对应县
            $(".ewb-city-items a").hover(function () {
                $(".ewb-county-items[data-name=" + $(this).data("name") + "]").show().siblings().hide();
            });
            // 高级搜索
            $('#ewb-search-all').on('click', function () {
                $('#ewb-search-hide').show();
            });
            $('#ewb-search-cancel').on('click', function () {
                $('#ewb-search-hide').hide();
            });
            // 自定义下拉菜单
            $(".ewb-search-sel").chosen($.extend(chosenConfig, {
                width: "312px"
            }));
            // 日期选择
            laydate.render({
                elem: '#startdate', //开始日期
                theme: '#4683db',
                done: function (value, date, endDate) { //选择完毕回调

                }
            });
            laydate.render({
                elem: '#enddate', //结束日期
                theme: '#4683db',
                done: function (value, date, endDate) { //选择完毕回调

                }
            });
			//高级搜索选择
	$("#lanmu").change(function (event) {
		var lanmu = document.getElementById("lanmu").value;
		if (lanmu != "003" && lanmu != "") {
			$("#xmlx option:first").prop("selected", true);
			$("#diqu option:first").prop("selected", true);
			if (lanmu) {
				$("#diqu").prop("disabled",true);
			    $("#diqu").trigger("chosen:updated"); 
				$("#xmlx").prop("disabled",true);
			    $("#xmlx").trigger("chosen:updated"); 
			} 
		} else {
			$("#diqu").prop("disabled",false);
			$("#diqu").trigger("chosen:updated"); 
			$("#xmlx").prop("disabled",false);
			$("#xmlx").trigger("chosen:updated"); 
		}
	});	
	
	//搜索
$(".ewb-input-btn").click(function(){
	var title = $("#key").val();
	if(title){
		var pattern = new RegExp("[%!@#$^*()=|{}':;',\\[\\].<>/~！@#￥……*（）;—|{}【】‘；：”“'。，、&]");
					if ( pattern.test($.trim(title)))
					{
						alert("请您不要在参数中输入特殊字符！");
					}else{
						window.open("/search/fullsearch.html?wd="+title+"");
					}
		
	}else{
		alert("关键词不能为空！");
	}
});
//高级搜索


$(".ewb-btn-ok").click(function(){
	var lanmu = document.getElementById("lanmu").value;
	var diqu =document.getElementById("diqu").value;
	var xmlx = document.getElementById("xmlx").value;
	var keyword = document.getElementById("key2").value;
	var starttime = document.getElementById("startdate").value;
	var endtime = document.getElementById("enddate").value;

	var starttime2 = starttime.replace(new RegExp("-", "gm"), "/");
	var endtime2 = endtime.replace(new RegExp("-", "gm"), "/");
 

	if (starttime) {
		starttime += "00:00:00";
	}
	if (endtime) {
		endtime += "23:59:59";
	}

	var starttimeHaoMiao = (new Date(starttime2)).getTime();
	var endtimeHaoMiao = (new Date(endtime2)).getTime();
	var nowtimeHaoMiao = new Date().getTime();
	if (starttimeHaoMiao > nowtimeHaoMiao || endtimeHaoMiao > nowtimeHaoMiao) {
		alert("开始或结束时间不能大于当前时间！");
	}
	else if (starttimeHaoMiao > endtimeHaoMiao) {
		alert("开始时间不能大于结束时间！");
	} 
	else 
	{
		if (xmlx) {
			lanmu = xmlx;
		} 
		    tiaojian = "?wd=" + keyword + "&lanmu=" + lanmu + "&diqu=" + diqu + "&sdt=" + starttime + "&edt=" + endtime;
		    window.open("/search/fullsearch.html" + tiaojian);
	 
	}
});
            // placeholder
            var inputTips = new inputPlaceholder({
                dom: '.input-tips' //input直接父元素
            });
            // 回到顶部
            $("#back-to-top").click(function() {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
        }
    }, {
        id: 'footer',
        src: '/footer.inc.html',
        onload: function () {
            // 自定义下拉菜单-友情链接
            $(".ewb-fl-sel").chosen($.extend(chosenConfig, {
                width: "100%"
            }));
        }
    }];

    $.each(includes, function (i, cfg) {
        if ($('#' + cfg.id).length) {
            new Include(cfg).fetch();
        }
    });
}(this, jQuery));
function OpenSelect(item) { 
            var optionStr = item.options[item.selectedIndex].value; 
            item.selectedIndex = 0; 
            if (optionStr != "") { 
                if(optionStr.indexOf("http")>-1) 
                   window.open(optionStr, '_blank') 
			   else
			      return;
            } 
        } 
		  