/**!
 * 全文检索
 * author: chengang;
 * Date:2016-8-17;
 */
var param = {"token":"",//权限参数，索引中的userguid字段值，通过des加密
		  "pn":0,//起始行
		  "rn":"",//记录数
		  "sdt":"",//开始时间（yyyy-MM-dd HH:mm:ss），搜索日期默认为infodate
		  "edt":"",//结束时间（yyyy-MM-dd HH:mm:ss）搜索日期默认为infodate
		  "wd":"",//关键词（以空格分隔代表全包含）
		  "inc_wd":"",//包含任意关键词
		  "exc_wd":"",//不包含关键词
		  "fields":"title;content",//全文检索范围（需要搜索的字段，以";"分隔，不传则搜索无效，返回空）
		  "cnum":"",//分类号（以";"分隔，不传默认返回后台配置的所有分类下的数据）
		  "sort":"",//排序规则（hashmap，key:字段，value：0：降序，1：升序）例：{"infodate":"0"}
		  "ssort":"title",//匹配度排序（将匹配度最高的字段置顶），此字段传字段名称，如：title
		  "cl":500,//返回内容长度
		  "terminal":"",//终端类别（0:pc,1:移动端,2:其他）
		  "condition":null,//查询条件，所有字段之间都是并且关系，例子如下
		  //"condition":'[{"equal":"bid_shandong","equalList":null,"fieldName":"categorynum","notEqual":null,"notEqualList":null}]',
		  "time":null,//时间范围（字段名称，开始时间，结束时间）,时间格式yyyy-MM-dd HH:mm:ss
		  //"time":'[{"fieldName":"infodate","startTime":"1991-01-01","endTime":"1992-01-01"},{},{}]',
		  "highlights":"title;content",//需要高亮的字段（以";"分隔，不传则默认将fields字段高亮）
		  "statistics":null,//统计，默认按照后台索引分类统计，可以指定一个字段统计（这个字段不能有分词）
		  "unionCondition":null,//查询条件（所有字段之间都是或者关系）,例子同condition
		  "accuracy":"",//查询内容精确度（0~100整数)，此参数默认为空，关键词匹配方式为and，如果传入1~100的数字，则匹配方式为or
		  "noParticiple":"0",//查询关键词不要分词（设置为1则启用，否则不启用）
		  "searchRange":null//范围查询，比如某个字段值为10，要查0~20之间的索引，例子如下：
		  //"searchRange":''[{"fieldName":"status","start":"0","end":"10"},{},{}]'
		  };
		  
(function($) {
	//自定义分类
	if (global.customcategorys && global.customcategorys.length>0) {
         var cnum = "";
		 for(var i=0;i<global.customcategorys.length;i++){
			 cnum += global.customcategorys[i]+";";
		 }
		 param.cnum=cnum;
    }
	
    $.extend(Date.prototype, {
        Format: function(fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份        
                "d+": this.getDate(), //日        
                "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时        
                "H+": this.getHours(), //小时        
                "m+": this.getMinutes(), //分        
                "s+": this.getSeconds(), //秒        
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度        
                "S": this.getMilliseconds() //毫秒        
            };
            var week = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }

    });

    if (!window.Util) {
        window.Util = {};
    }
    $.extend(Util, {
        getUrlParams: function(prop) {
            var params = {},
                query = location.search.substring(1),
                arr = query.split('&'),
                rt;

            $.each(arr, function(i, item) {
                var tmp = item.split('='),
                    key = tmp[0],
                    val = tmp[1];

                if (typeof params[key] == 'undefined') {
                    params[key] = val;
                } else if (typeof params[key] == 'string') {
                    params[key] = [params[key], val];
                } else {
                    params[key].push(val);
                }
            });
            rt = prop ? params[prop] : params;
            return rt;
        },

        regTrim: function(s) {
            var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/g;
            var imp_c = {};
            imp_c["^"] = "\\^";
            imp_c["."] = "\\.";
            imp_c["\\"] = "\\\\";
            imp_c["|"] = "\\|";
            imp_c["("] = "\\(";
            imp_c[")"] = "\\)";
            imp_c["*"] = "\\*";
            imp_c["+"] = "\\+";
            imp_c["-"] = "\\-";
            imp_c["$"] = "\$";
            imp_c["["] = "\\[";
            imp_c["]"] = "\\]";
            imp_c["?"] = "\\?";
            s = s.replace(imp, function(o) {
                return imp_c[o];
            });
            return s;
        },
        /*
         * 高亮关键字
         * string：字符串
         * key：关键字
         * cls：rgb颜色（#ff0000）或者class名
         */
        highLightKeyWords: function(string, key, cls) {
            var keys = key.split(" "),
                str = string.replace(/<!--(?:.*)\-->/g, ""), // 删除注释
                tags = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g, // HTML标签
                a = str.match(tags);

            var styleStr = "";

            if (!cls) {
                cls = "#ff0000";
            }
            if (cls.indexOf("#") > -1) {
                styleStr = "style='color:" + cls + "'";
            } else {
                styleStr = "class='" + cls + "'";
            }

            $.each(a, function(i, c) {
                if (!/<(?:.|\s)*?>/.test(c)) { // 非标签
                    // 开始执行替换
                    $.each(keys, function(index, con) {
                        if (con === "") {
                            return;
                        }
                        var reg = new RegExp(Util.regTrim(con), "g");
                        if (reg.test(c)) {
                            // 正则替换
                            c = c.replace(reg, "♂" + con + "♀");
                        }
                    });
                    c = c.replace(/♂/g, "<span rel='mark' " + styleStr + ">")
                        .replace(/♀/g, "</span>");
                    a[i] = c;
                }
            });
            return a.join("");
        }
    });
}(jQuery));


(function(win, $) {
    var $head = $("#head"), $wd = $("#wd", $head),               //头部搜索栏
        $advpanel = $("#advpanel"), $idx_cgy = $("select[name='idx_cgy']", $advpanel),   //高级搜索面板
        $awd = $("input[name='wd']", $advpanel), $inc_wd = $("input[name='inc_wd']", $advpanel), $exc_wd = $("input[name='exc_wd']", $advpanel),
        $conditionbar = $("#conditionbar"), $dtlbl = $(".dtlbl", $conditionbar), $cgylbl = $(".cgylbl", $conditionbar), //搜索条件栏,
        $categorylist = $("#categorylist"), //索引分类
        $btncustom = $("#btncustom"),       //自定义时间
        $content = $("#content"),           //内容区域
        $record = $("#record", $content),   //数据区域
        $pager = $(".pager", $content),     //翻页
        $loading = $("#loading"),
        $gotop = $("#gotop");               //返回顶部

    var recordTmpl = $("#recordTmpl").html(),   //数据模板
        norecordTmpl = $("#norecordTmpl").html();   //无数据
    var $paramipt = $(".param"), $paramArr = {};
    $paramipt.each(function(i, e) {
        $paramArr[e.name] = $(this);
    });

    $(window).resize(function() {
        $(".datepicker").datepicker("hide").blur();
    });

    //滚动事件
    var setScrollEvent = function() {

        var didScroll,
            lastScrollTop = 0,
            delta = 10;

        $(window).scroll(function(event) {
            didScroll = true;
            $(".datepicker").datepicker("hide").blur();
        });

        setInterval(function() {
            if (didScroll) {
                hasScrolled();
                didScroll = false;
            }
        }, 250);

        function hasScrolled() {
            var st = $(this).scrollTop();
            st > 100 ? $gotop.show() : $gotop.hide();
            if (st < 10) {
                $conditionbar.removeClass("fix");
                $content.removeClass("fix");
                $head.removeClass("down");
                lastScrollTop = st;
                return;
            }
            if (Math.abs(lastScrollTop - st) <= delta)
                return;
            $conditionbar.addClass("fix");
            $content.addClass("fix");
            if (st >= lastScrollTop) {
                $head.addClass("down");
                $conditionbar.addClass("up");
            } else {
                $head.removeClass("down");
                $conditionbar.removeClass("up");
            }
            lastScrollTop = st;
        }
    };

    //setScrollEvent();



    //返回顶部
    $gotop.on("click", function() {
        $('body,html').animate({ scrollTop: 0 }, 200);
    });


    $advpanel.on("click", ".adv-switch,.close", function() {
        $advpanel.hide();                       //隐藏高级搜索
    });

    $conditionbar.on("click", ".adv-switch", function() {
        $awd.val($wd.val());
        $advpanel.slideDown(200);               //显示高级搜索
    }).on("click", ".filter-lbl", function() {       //搜索下拉
        var $this = $(this);
        var $panel = $this.next(".filter-panel");
        $panel.show();
    }).on("mouseover", ".filter-item", function() {
        $(document).off("filter");
    }).on("mouseout", ".filter-item", function() {
        $(document).off("filter").on("mousedown", function(e) {
            if ($(e.target).closest("ul").hasClass("filter-drop") || $(e.target).closest(".ui-datepicker").length > 0) {
                return;
            }
            $(".filter-panel").hide();
        });
    });

    //选中搜索条件
    $conditionbar.on("click", ".filter-drop li", function(e) {
        var $this = $(this);
        if ($this.hasClass("time-custom")) {
            return;
        }
        var $lbl = $this.closest(".filter-item").find(".filter-lbl"),
            $panel = $this.closest(".filter-panel");
        var tar_name = $(".filter-drop", $panel).data("target");
        var v = $this.data("val");
         //时间搜索条件个性化
        var conditionList = new Array();
         var timeList = new Array();
         var conditionDate = {};
        if (tar_name == "dt") {
            var edt = new Date(),
                sdt = new Date(edt.getTime() - (v - 0) * 24 * 60 * 60 * 1000);
            if (v == "") {
                edt = "";
                sdt = "";
            } else {
                edt = edt.Format("yyyy-MM-dd HH:mm:ss");
                sdt = sdt.Format("yyyy-MM-dd HH:mm:ss");
            }
          //时间搜索条件个性化 
	conditionDate["fieldName"]='webdate';
	conditionDate["startTime"]=sdt;
	conditionDate["endTime"]=edt;
	timeList.push(conditionDate);
	$paramArr["time"]=timeList;
            $paramArr["edt"].val("");
            $paramArr["sdt"].val("");
        } else {
            $paramArr[tar_name].val(v);
        }
        $(this).addClass("active").siblings().removeClass("active");

        $lbl.html($this.text());
        $panel.hide();
		param.edt = "";
		param.sdt = "";
		param.condition=conditionList;
		param.time=timeList;
        win.Search(0, param.rn, param,false);
    });

    var getdatedesc = function(sdt, edt) {
        var date_des = "";
        if (!sdt) {
            date_des = edt.Format("yyyy-M-d") + "以前";
        } else if (!edt) {
            date_des = sdt.Format("yyyy-M-d") + "以后";
        } else {
            date_des = sdt.Format("yyyy-M-d") + "至" + edt.Format("yyyy-M-d");
        }
        return date_des;
    };

    //自定义时间
    $btncustom.on("click", function() {
        var $panel = $(this).closest(".filter-panel"),
            $time = $panel.find(".datepicker");
        var sdt = $time.eq(0).datepicker('getDate'),
            edt = $time.eq(1).datepicker('getDate');
      //时间搜索条件个性化
         var conditionList = new Array();
         var timeList = new Array();
         var conditionDate = {};
        if (sdt && edt) {
            if (sdt > edt) {
                alert("开始日期要在截止日期之前!");
                return false;
            }
        }
        else if (!sdt && !edt) {
            alert("请选择一个日期!");
            return;
        }
        if (sdt) {
            $paramArr["sdt"].val(sdt.Format("yyyy-MM-dd HH:mm:ss"));
        } else {
            $paramArr["sdt"].val("");
        }
        if (edt) {
            $paramArr["edt"].val(edt.Format("yyyy-MM-dd HH:mm:ss"));
        } else {
            $paramArr["edt"].val("");
        }


        $panel.find("li").removeClass("active");
        $dtlbl.html(getdatedesc(sdt, edt));
        $panel.hide();
        var sday=new Date(sdt);
		var eday=new Date(edt);
		var stime=sday.getFullYear()+"-"+(sday.getMonth()+1)+"-"+sday.getDate()+" "+" 00:00:00";
		var etime=eday.getFullYear()+"-"+(eday.getMonth()+1)+"-"+eday.getDate()+" "+" 23:59:59";
		//时间搜索条件个性化
		conditionDate["fieldName"]='webdate';
	    conditionDate["startTime"]=stime;
	    conditionDate["endTime"]=etime;
	    timeList.push(conditionDate);
		param.edt = "";
		param.sdt ="";
		param.condition=conditionList;
		param.time=timeList;
        win.Search(0, param.rn, param,false);
    });


    //索引分类
    $categorylist.on("click", "li", function(event) {
		if(event.stopPropagation ){
			event.stopPropagation ();
		}else{
			event.canceBubble = false;
		}
        if ($(this).hasClass("more")) {
            return;
        }
        $paramArr["idx_cgy"].val($(this).data("val"));
        $("li", $categorylist).removeClass("active");

        $(this).addClass("active").siblings().removeClass("active");
        $(this).parent().parent("li").addClass("active");
        param.cnum = $(this).data("val");
		var clickValue = $(this).text();
		if(clickValue == "全部"){
			win.Search(0, param.rn, param,false);
		}else{
			win.Search(0, param.rn, param,true);
		}
        
    });

    //排序，相关程度、最新发布
    $("#sortbar").on("click", ".sorttype", function() {
		//var wd = $search_input.val();
        var sort = $(this).data("sort");
        if (sort == "relate") {
            $paramArr["sort"].val("");
            if ($(this).hasClass("active")) {
                return;
            } else {
                $(this).addClass("active").siblings(".sorttype").removeClass("active");
                //win.Search(0, null, param);
            }
			param.sort = "";
			win.Search(0, param.rn, param,true);
        } else {//最新发布是0，最早发布是1
            var val = $(this).data("val");
            if ($(this).hasClass("active")) {
                if (val == 0) {
                    $(this).text("最早发布").data("val", 1);
                    $paramArr["sort"].val("1");
					param.sort = '{"infodate":1}';
                } else {
                    $(this).text("最新发布").data("val", 0);
                    $paramArr["sort"].val("0");
					param.sort = '{"infodate":0}';
                }
            } else {
                if (val == 0) {
                    $paramArr["sort"].val("0");
					param.sort = '{"infodate":0}';
                } else {
                    $paramArr["sort"].val("1");
					param.sort = '{"infodate":1}';
                }
            }
            $(this).addClass("active").removeClass("desc asc").siblings(".sorttype").removeClass("active");

            $(this).addClass($(this).data("val") == 0 ? "desc" : "asc");
            win.Search(0, param.rn, param,true);
        }
    });


	//高级搜索按钮
    $("#btn_advsearch").on("click", function() {
        var $sdt = $(".datepicker", $advpanel).eq(0),
            $edt = $(".datepicker", $advpanel).eq(1),
            $dtrdo = $(":radio[name='adv_time']:checked", $advpanel),
            $srch_cgy = $("select[name='srch_cgy']", $advpanel);
        var wd = $.trim($awd.val()),
            tv = $dtrdo.val(),
            sdt = $sdt.datepicker('getDate'),
            edt = $edt.datepicker('getDate');
		var inc_wd = $("input[name='inc_wd']").val(),
			exc_wd = $("input[name='exc_wd']").val();
        //关键字
        if (wd == "") {
			wd = inc_wd;
			inc_wd = "";
			$("input[name='inc_wd']").val('');
        }
		
		if(wd == ""){
			window.location.href = location.href.split("?")[0];
            return false;
		}
        //时间
        //时间搜索条件个性化
         var conditionList = new Array();
         var timeList = new Array();
         var conditionDate = {};
        if (tv == "c") {
            if (sdt && edt) {
                if (sdt > edt) {
                    alert("开始日期要在截止日期之前!");
                    return false;
                }
            }
            else if (!sdt && !edt) {
                alert("请选择一个日期!");
                return;
            }
            if (sdt) {
                $paramArr["sdt"].val(sdt.Format("yyyyMMddHHmmss"));
            } else {
                $paramArr["sdt"].val("");
            }
            if (edt) {
                $paramArr["edt"].val(edt.Format("yyyyMMddHHmmss"));
            } else {
                $paramArr["edt"].val("");
            }

            var $dropdt = $("ul[data-target='dt']"),
                $datepicker = $(".datepicker", $dropdt);
            $("li", $dropdt).removeClass("active");
            $datepicker.eq(0).val(sdt.Format("yyyy-MM-dd"));
            $datepicker.eq(1).val(edt.Format("yyyy-MM-dd"));
            $dtlbl.html(getdatedesc(sdt, edt));
              sdt=sdt.Format("yyyy-MM-dd")+" 00:00:00";
            edt=edt.Format("yyyy-MM-dd")+" 23:59:59";
        } else {
            edt = new Date();
            sdt = new Date(edt.getTime() - (tv - 0) * 24 * 60 * 60 * 1000);
            if (tv == "") {
                edt = "";
                sdt = "";
            } else {
                edt = edt.Format("yyyy-MM-dd HH:mm:ss");
                sdt = sdt.Format("yyyy-MM-dd HH:mm:ss");
            }
            $paramArr["edt"].val(edt);
            $paramArr["sdt"].val(sdt);         
            $dtlbl.html($dtrdo.next("label").text());
            $("ul[data-target='dt'] li[ data-val=" + tv + "]").addClass("active").siblings().removeClass("active");
        }
        $wd.val(wd);
         //时间搜索条件个性化
		conditionDate["fieldName"]='webdate';
	    conditionDate["startTime"]=sdt;
	    conditionDate["endTime"]=edt;
	    timeList.push(conditionDate);
		param.edt = "";
		param.sdt ="";
		param.condition=conditionList;
		param.time=timeList;
		param.cnum=$idx_cgy.val();
		param.wd = wd;
		param.inc_wd = inc_wd;
		param.exc_wd = exc_wd;
//		param.edt = edt;
//		param.sdt = sdt;
//		
        //win.Search(0, param.rn, param,($idx_cgy.val() == ""));
        var pattern = new RegExp("[%!@#$^*()=|{}':;',\\[\\].<>/~！@#￥……*（）;—|{}【】‘；：”“'。，、&]");
					if ( pattern.test($.trim(wd)))
					{
						alert("请您不要在参数中输入特殊字符！");
					}else{
						win.Search(0, param.rn, param,false);
					}
		
        $advpanel.hide();
		//alert(sdt);
    });

    win.Search = function(pageindex, pagesize,param,byfolder) {
		//IE9中ajax请求兼容性问题处理
		jQuery.support.cors=true;
		
		param.rn = pagesize || 10;
		param.pn = pageindex*pagesize;
		var mywd=param.wd;
		
		var pattern = new RegExp("[%!@#$^*()=|{}':;',\\[\\].<>/~！@#￥……*（）;—|{}【】‘；：”“'。，、&]");
					if ( pattern.test($.trim(mywd)))
					{
						alert("请您不要在参数中输入特殊字符！");
					}else{
						$.ajax({
		  url: global.getfulltextdataurl,
		  type: 'post',
		  dataType: 'json',
		  cache:false,
		  data: JSON.stringify({"token":param.token,
			  "pn":param.pn,
			  "rn":pagesize,
			  "sdt":param.sdt,
			  "edt":param.edt,
			  "wd":encodeURIComponent(param.wd),
			  "inc_wd":encodeURIComponent(param.inc_wd),
			  "exc_wd":encodeURIComponent(param.exc_wd),
			  "fields":param.fields,
			  "cnum":param.cnum,
			  "sort":param.sort,//字段升序降序排序
			  "ssort":param.ssort,//字段匹配度排序
			  "cl":param.cl,
			  "terminal":param.terminal,
			  "condition":param.condition,
			  "time":param.time,
			  "highlights":param.highlights,
			  "statistics":param.statistics,
			  "unionCondition":param.unionCondition,
			  "accuracy":param.accuracy,
			  "noParticiple":param.noParticiple,
			  "searchRange":param.searchRange
		  }),
		  beforeSend: function() {
                $loading.show();
          },
		  success: function(msg) {
			  var data = checkJson(msg.result);
			  var del = [];//存放所有要删除的子分类
			  
			  if(data.categorys != null && data.categorys.length > 0){
				  for(var a = 0;a<data.categorys.length;a++){
				    data.categorys[a].subcategory=[];
				  }
				  //返回数据，结构改造，适应子分类
			  //console.log("老版改造中……");
			  //console.log(data);
			  //对数据进行循环操作，当里面没有3位以上分类号不是子分类时，停止循环
			  //如果只有6位子分类，而没有对应的3位子分类，此时不进行归类
			  for(var i = 0;i<data.categorys.length;i++){
				  //当分类号长度大于3时，作为子分类
				  if(data.categorys[i].categorynum.length > 3){
					  var tmp = data.categorys[i].categorynum.substring(0,3);
					  //console.log(data.categorys[i]);
					  //当存在对应的父分类时，添加子分类数组
					  for(var j = 0;j<data.categorys.length;j++){
						  if(data.categorys[j].categorynum == tmp){
							 
							  data.categorys[j].subcategory.push({
								  "categoryname": data.categorys[i].categoryname,
								  "categorynum":data.categorys[i].categorynum,
								  "count":data.categorys[i].count
							  });
							  del.push(data.categorys[i]);
							  break;
						  }
						  
					  }
				  }
				  
			  }
			  //删除已归类的分类
			  if(del != null && del.length > 0){
				  for(var m = 0;m<del.length;m++){
					removeByValue(data.categorys, del[m]);
				  }
			  }
			  }
			  
			  
				renderResult(data,byfolder);
                renderPager(pageindex, param.rn, data.totalcount,param);
                //setScrollEvent();
                $('body,html').scrollTop(0);
                $loading.hide();
		  },
		  error:function(msg){
			  alert("请求失败");
		  }
		})
					}
		//console.log(param);
		//alert(global.getfulltextdataurl);
		
    };
	
	//删除数组指定元素
	function removeByValue(arr, val) {
	  for(var i=0; i<arr.length; i++) {
		if(arr[i] == val) {
		  arr.splice(i, 1);
		  break;
		}
	  }
	}

   
	var renderResult = function(data,byfolder) {
        if (data.records && data.records.length > 0) {
            $record.html(Mustache.render(recordTmpl, data));
        } else {
            $record.html(norecordTmpl);
        }

        if (!byfolder && (!data.categorys || data.categorys.length == 0)) {
            if (global.customcategorys && global.customcategorys.length>0) {
				 var cnum = "";
				 for(var i=0;i<global.customcategorys.length;i++){
					 cnum += global.customcategorys[i]+";";
				 }
				 $categorylist.empty().html("<li class='active' data-val=" + cnum + ">全部</li>");
			}else{
				$categorylist.empty().html("<li class='active'>全部</li>");
			}

        }
        if (!byfolder) {
            if (global.customcategorys && global.customcategorys.length>0) {
				 var cnum = "";
				 for(var i=0;i<global.customcategorys.length;i++){
					 cnum += global.customcategorys[i]+";";
				 }
				 $categorylist.empty().html("<li class='active' data-val=" + cnum + ">全部</li>");
			}else{
				$categorylist.empty().html("<li class='active'>全部</li>");
			}
            if (!data.categorys || data.categorys.length == 0) {
                return;
            }
            $idx_cgy.empty().html("<option value=''>不限索引</option>");

            $.each(data.categorys, function(i, e) {
                if (global.customcategorys && global.customcategorys.length && $.inArray(e.categorynum, global.customcategorys) == -1) {
                    return true;
                };
                var $option = $("<option value=" + e.categorynum + ">" + e.categoryname + "</option>");
                $idx_cgy.append($option);

                if (e.subcategory && e.subcategory.length > 0) {
                    $option.addClass("group-result clickable")
                    $.each(e.subcategory, function(j, f) {
                        $idx_cgy.append("<option  class='group-option' value=" + f.categorynum + ">" + f.categoryname + "</option>");
                    });
                }
                if ($categorylist.width() > 600) {
                    var $more = $(".more-category", $categorylist);
                    if (!$more.length) {
                        $more = $("<li class='more'>更多<ul class='more-category'></ul></li>");
                        $categorylist.append($more);
                        $more = $("ul", $more);
                    }
                    $more.append("<li data-val=" + e.categorynum + ">" + e.categoryname + "</li>");
                } else {
                    var $category = $("<li data-val=" + e.categorynum + ">" + e.categoryname + "</li>");
                    if (e.subcategory && e.subcategory.length > 0) {
                        $category.addClass("sub").append("<ul class='sub-category'></ul>");
                        $.each(e.subcategory, function(j, f) {
                            $("ul", $category).append("<li data-val=" + f.categorynum + ">" + f.categoryname + "</li>");

                        });
                    }
                    $categorylist.append($category);
                }
            });
            $idx_cgy.trigger("chosen:updated");
        }
    };

    //渲染分页
    var renderPager = function(pageindex, pagesize, total,param) {
        if ($pager.pagination()) {
            $pager.pagination('destroy');
        }
        if (!total) {
            return;
        }
        $pager.pagination({
            pageIndex: pageindex,
            pageSize: pagesize,
            total: total,
            showJump: true,
            jumpBtnText: 'Go',
            showPageSizes: true
        });
        $pager.on("pageClicked", function(event, data) {
            win.Search(data.pageIndex, data.pageSize, param,true);
        }).on('jumpClicked', function(event, data) {
            win.Search(data.pageIndex, data.pageSize, param,true);
        }).on('pageSizeChanged', function(event, data) {
            win.Search(data.pageIndex, data.pageSize, param,true);
        });
    };


    //初始化页面
    $(".datepicker", $advpanel).datepicker({
        maxDate: +0,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd"
    }).val(new Date().Format("yyyy-MM-dd"));

    $(".datepicker", $conditionbar).datepicker({
        maxDate: +0,
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        dateFormat: "yy-mm-dd",
        beforeShow: function(input, inst) {
            var rect = input.getBoundingClientRect();
            setTimeout(function() {
                inst.dpDiv.css({ top: rect.top, left: rect.left + 88 });
            }, 0);
        }
    }).val(new Date().Format("yyyy-MM-dd"));


    setTimeout(function() {
        $("input[type='text']:not(.datepicker)").val("");
        $("input[type='hidden']").val("");
        $(":radio[name='adv_time']", $advpanel).eq(0).prop('checked', 'checked');
        $("select option:eq(1)").prop('selected', 'selected');
        $("input").placeholder();
        $("select", $advpanel).chosen({
            width: "440px",
            disable_search: true
        });
        var qwd = Util.getUrlParams("wd");
		var qtoken = Util.getUrlParams("token");
		var qpn = Util.getUrlParams("pn");
		var qrn = Util.getUrlParams("rn");
		var qsdt = Util.getUrlParams("sdt");
		var qedt = Util.getUrlParams("edt");
		var qinc_wd = Util.getUrlParams("inc_wd");
		var qexc_wd = Util.getUrlParams("exc_wd");
		var qfields = Util.getUrlParams("fields");
		var qcnum = Util.getUrlParams("cnum");
		var qsort = Util.getUrlParams("sort");
		var qssort = Util.getUrlParams("ssort");
		var qcl = Util.getUrlParams("cl");
		var qcondition = Util.getUrlParams("condition");
		var qterminal = Util.getUrlParams("terminal");
		var qtime = Util.getUrlParams("time");
		var qhighlights = Util.getUrlParams("highlights");
		var qstatistics = Util.getUrlParams("statistics");
		var qunionCondition = Util.getUrlParams("unionCondition");
		var qaccuracy = Util.getUrlParams("accuracy");
		var qnoParticiple = Util.getUrlParams("noParticiple");
		var qsearchRange = Util.getUrlParams("searchRange");
		
        if (qwd) {
            qwd = decodeURI(qwd);
            $wd.val(qwd);
			param.wd = qwd;
        }
		
		if (qtoken) {
			param.token = qtoken;
        }
		
		if (qpn) {
			param.pn = qpn;
        }
		
		if (qrn) {
			param.rn = qrn;
        }
		
		if (qsdt) {
			param.sdt = qsdt;
        }
		
		if (qedt) {
			param.edt = qedt;
        }
		
		if (qinc_wd) {
			qinc_wd = decodeURI(qinc_wd);
			param.inc_wd = qinc_wd;
        }
		
		if (qexc_wd) {
			qexc_wd = decodeURI(qexc_wd);
			param.exc_wd = qexc_wd;
        }
		
		if (qfields) {
			param.fields = qfields;
        }
		
		if (qcnum) {
			param.cnum = qcnum;
        }
		
		if (qsort) {
			param.sort = qsort;
        }
		
		if (qssort) {
			param.ssort = qssort;
        }
		
		if (qcl) {
			param.cl = qcl;
        }
		
		if (qcondition) {
			param.condition = qcondition;
        }
		
		if (qterminal) {
			param.terminal = qterminal;
        }
		
		if (qtime) {
			param.time = qtime;
        }
		
		if (qhighlights) {
			param.highlights = qhighlights;
        }
		
		if (qstatistics) {
			param.statistics = qstatistics;
        }
		
		if (qunionCondition) {
			param.unionCondition = qunionCondition;
        }
		
		if (qaccuracy) {
			param.accuracy = qaccuracy;
        }
		
		if (qnoParticiple) {
			param.noParticiple = qnoParticiple;
        }
		
		if (qsearchRange) {
			param.searchRange = qsearchRange;
        }
		if(qwd){
			win.Search(0,param.rn,param,false);
		}
    }, 0);
    $content.css("min-height", $(win).height() - $head.height() - $conditionbar.height());
}(this, jQuery));

//搜索框
(function(win, $) {
    var settings = {
        url: global.gethotwordurl,
        history_l: 8,
        suggest_l: 5
    };
    var self = $("#searchbar"), //搜索栏
        $search_input = $(".search_input", self),   //输入框
        $search_del = $(".search_delete", self),    //删除
        $search_btn = $(".search-btn", self),       //搜索按钮
        $search_drop = $(".search_drop", self),     //搜索建议下拉
        $search_history = $(".search_history", self),   //搜索历史
        $search_suggest = $(".search_suggest", self),   //搜索建议
        $search_split = $(".split", self),              //分隔线
        xhr = null, isEnter = false, searchTimer = null;

    var historyTmpl = $("#historyTmpl").html(),
        suggestTmpl = $("#suggestTmpl").html();

    //从Cookie中获取历史查询
    function getHistory(key) {
        key = $.trim(key);
        var historyData = $.cookie("EpAutoComplete");
        if (historyData) {
            historyData = JSON.parse(historyData);
            if (key) {
                var reg = new RegExp(Util.regTrim(key), "g");
                return $.map(historyData, function(e, i) {
                    if (e && key != e && reg.test(e) && i < settings.history_l) {
                        return e;
                    }
                });
            } else {
                return $.map(historyData, function(e, i) {
                    if (e && i < settings.history_l) {
                        return e;
                    }
                });
            }
        }
        else { return []; }
    }

    //Cookie中添加搜索历史
    function addHistory(text) {
        text = $.trim(text);
        if (!text) return;
        var historyData = $.cookie("EpAutoComplete"), newHistory = [];
        if (historyData) {
            newHistory = JSON.parse(historyData);
        }
        newHistory = $.map(newHistory, function(e, i) {
            if (e != text) {
                return e;
            }

        });
        newHistory.unshift(text);
        $.cookie("EpAutoComplete", JSON.stringify(newHistory), { expires: 7 });
    }

    //从Cookie移除搜索历史
    function removeHistory(text) {
        var historyData = JSON.parse($.cookie("EpAutoComplete"));
        text = $.trim(text);
        var newHistory = $.map(historyData, function(e, i) {
            if (e != text) {
                return e;
            }
        });
        $.cookie("EpAutoComplete", JSON.stringify(newHistory));
    }

    //渲染搜索建议
    function renderSuggest(key) {
        var params = { 'wd': key, 'format': "json", "limit": settings.suggest_l };
		if (global.customcategorys && global.customcategorys.length>0) {
			 var cnum = "";
			 for(var i=0;i<global.customcategorys.length;i++){
				 cnum += global.customcategorys[i]+";";
			 }
			 params.categorynums=cnum;
		}
        jQuery.support.cors=true;
		$.ajax({
		  url: global.gethotwordurl,
		  type: 'post',
		  dataType: 'json',
		  data: JSON.stringify({"wd":params.wd,
			  "limit":10,
			  "categorynums":''
		  }),
		  success: function(msg) {
			  var result = checkJson(msg.result);
				if (isEnter) {
                    return;
                }
                if (!$.trim($search_input.val())) {
                    $search_suggest.empty().hide();
                    return;
                }
                $search_suggest.empty();
                if (!result || result.length == 0) {
                    result = [];
                }
                var data = $.map(result, function(e, i) {
                    return {
                        text: e,
                        lable: Util.highLightKeyWords(e, key, "hightlight-bold")
                    };
                });
                if (data.length) {
                    var html = Mustache.render(suggestTmpl, {
                        data: data
                    });
                    $search_suggest.html(html);

                    $search_suggest.show();
                    $search_drop.show();
                }

                if ($("li", $search_drop).length == 0) {
                    $search_drop.hide();
                }
                else if ($search_history.children().length && $search_suggest.children().length) {
                    $search_split.show();
                }
		  }
		})
		
        /*xhr = $.ajax({
            url: settings.url,
            data: params,
            type: "GET",
            dataType: "json",
            success: function(result) {
                if (isEnter) {
                    return;
                }
                if (!$.trim($search_input.val())) {
                    $search_suggest.empty().hide();
                    return;
                }
                $search_suggest.empty();
                if (!result || result.length == 0) {
                    result = [];
                }
                var data = $.map(result, function(e, i) {
                    return {
                        text: e,
                        lable: Util.highLightKeyWords(e, key, "hightlight-bold")
                    };
                });
                if (data.length) {
                    var html = Mustache.render(suggestTmpl, {
                        data: data
                    });
                    $search_suggest.html(html);

                    $search_suggest.show();
                    $search_drop.show();
                }

                if ($("li", $search_drop).length == 0) {
                    $search_drop.hide();
                }
                else if ($search_history.children().length && $search_suggest.children().length) {
                    $search_split.show();
                }
            },
            error: function() {
                console.log("请求失败");
            }
        });*/
    }

    //渲染搜索下拉
    function renderDropDown() {
        var key = $.trim($search_input.val());
        $search_input.data("w_val", key);
        var historyData = getHistory(key); //获取搜索历史
        if (!key) {     //无输入的时候
            $search_del.hide();
            historyData = $.map(historyData, function(e, i) {
                return {
                    text: e,
                    lable: e
                };
            });
        } else {        //有输入
            historyData = $.map(historyData, function(e, i) {
                return {
                    text: e,
                    lable: Util.highLightKeyWords(e, key, "hightlight-bold")
                };
            });
            $search_del.show();
        }
        $search_history.empty();
        if (historyData.length) {   //有搜索历史
            var html = Mustache.render(historyTmpl, {
                data: historyData
            });
            $search_history.html(html);
            $search_drop.show();
        }
        $search_split.hide();   //分割线
        //搜索建议
        if (key) {
            if (xhr) {
                xhr.abort();
            }
            renderSuggest(key); //搜索建议
        } else {
            $search_suggest.empty().hide();
        }
    }

    //重置
    function resetDropDown() {
        $search_del.hide();
        $search_drop.hide();
        $search_split.hide();
        $search_input.val("");
    }

    //键盘上下键
    function keyboardEvent(keyCode) {
        var $his_items = $search_history.children(),
               $sug_items = $search_suggest.children(),
                h_l = $his_items.length,
                s_l = $sug_items.length;
        //if (h_l == 0 && s_l == 0) return;
        var h_idx = $his_items.filter(".active").index(),
            s_idx = $sug_items.filter(".active").index();

        $his_items.removeClass("active");
        $sug_items.removeClass("active");
        if (keyCode == 38 || keyCode == 40) {
            if (h_l == 0 && s_l == 0) return;
        }
        var w_val = $.trim($search_input.data("w_val"));
        switch (keyCode) {
            case 38: {
                if (h_idx > -1) {
                    if (h_idx == 0) {
                        if (w_val) {
                            $search_input.val(w_val);
                        }
                        else if (s_l > 0) {
                            $sug_items.eq(s_l - 1).addClass("active");
                        } else if (s_l == 0) {
                            $his_items.eq(h_l - 1).addClass("active");
                        }
                    }
                    else {
                        $his_items.eq(h_idx - 1).addClass("active");
                    }
                } else if (s_idx > -1) {
                    if (s_idx == 0) {
                        if (h_l > 0) {
                            $his_items.eq(h_l - 1).addClass("active");
                        } else if (w_val) {
                            $search_input.val(w_val);
                        } else {
                            $sug_items.eq(s_l - 1).addClass("active");
                        }
                    } else {
                        $sug_items.eq(s_idx - 1).addClass("active");
                    }
                } else {
                    if (s_l > 0) {
                        $sug_items.eq(s_l - 1).addClass("active");
                    } else if (h_l > 0) {
                        $his_items.eq(h_l - 1).addClass("active");
                    }
                }
                break;
            }
            case 40: {
                if (h_idx > -1) {
                    if (h_idx == h_l - 1) {
                        if (s_l > 0) {
                            $sug_items.eq(0).addClass("active");
                        } else if (s_l == 0) {
                            if (w_val) {
                                $search_input.val(w_val);
                            } else {
                                $his_items.eq(0).addClass("active");
                            }
                        }
                    }
                    else {
                        $his_items.eq(h_idx + 1).addClass("active");
                    }
                } else if (s_idx > -1) {
                    if (s_idx == s_l - 1) {
                        if (w_val) {
                            $search_input.val(w_val);
                        } else if (h_l > 0) {
                            $his_items.eq(0).addClass("active");
                        } else {
                            $sug_items.eq(0).addClass("active");
                        }
                    } else {
                        $sug_items.eq(s_idx + 1).addClass("active");
                    }
                } else {
                    if (h_l > 0) {
                        $his_items.eq(0).addClass("active");
                    } else if (s_l > 0) {
                        $sug_items.eq(0).addClass("active");
                    }
                }
                break;
            }
            case 13: {//回车
                var $curr_li = $search_drop.find("li.active"), text;
                if ($curr_li.length != 0 && !$search_input.is(":focus")) {
                    text = $curr_li.data("key");
                } else {
                    text = $search_input.val();
                }
                if ($.trim(text) == "") {
                    return;
                }
                addHistory(text);
                $search_input.blur();
                $search_drop.hide();
				param.wd = text;
                win.Search(0,param.rn,param,false);
                break;
            }
            default:
        }
        if (keyCode == 38 || keyCode == 40) {
            var a_li = $search_drop.find("li.active");
            if (a_li.length) {
                $search_input.val(a_li.data("key"));
            }
        }
    }

    //延迟查询请求
    function delaySearch() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() { renderDropDown(); },
            300);
    }

    //输入框焦点、键事件
    $search_input.on("focus", function() {
        delaySearch();
        isEnter = false;
    }).on("keydown", function(event) {
        isEnter = false;
        if ($.inArray(event.which, [37, 38, 39, 40, 13]) != -1) {
            keyboardEvent(event.which);
            if (event.which == 13) {
                isEnter = true;
            }
            return;
        }
        delaySearch();
    }).on("keypress", function(event) {
        isEnter = false;
        if ($.inArray(event.which, [37, 38, 39, 40, 13]) != -1) {
            keyboardEvent(event.which);
            if (event.which == 13) {
                isEnter = true;
            }
            return;
        }
    }).on("input", function(event) {
        delaySearch();
    }).hover(function() {
        $(document).off("EpAutoComplete");
    }, function() {
        $(document).off("EpAutoComplete").on("mousedown EpAutoComplete", function(e) {
            if ($.contains($search_drop[0], e.target) || e.target == $search_input[0]) {
                return;
            }
            $search_drop.hide();
        });
    });

    //搜索建议事件
    $search_suggest.on("click", "li", function(e) {
        var text = $(this).data("key");
        addHistory(text);
        $search_drop.hide();
        $search_input.val(text);
		param.wd = text;
        win.Search(0,param.rn,param,false);
    }).on("mouseenter", "li", function() {
        $(this).siblings().removeClass("active").end().addClass("active");
    }).on("mouseleave", "li", function() {
        $(this).removeClass("active");
    });

    //搜索历史事件
    $search_history.on("click", ".remove", function(e) {
        var text = $(this).closest("li").data("key");
        removeHistory(text);
        $(this).closest("li").remove();
        e.stopPropagation();
        if ($("li", $search_history).length == 0) {
            $search_split.hide();
        }
        if ($("li", $search_drop).length == 0) {
            $search_drop.hide();
        }
    }).on("click", "li", function(e) {
        var text = $(this).data("key");
        addHistory(text);
        $search_drop.hide();
        $search_input.val(text);
        win.Search();
    }).on("mouseenter", "li", function() {
        $(this).siblings().removeClass("active").end().addClass("active");
    }).on("mouseleave", "li", function() {
        $(this).removeClass("active");
    });
	//普通搜索
    $search_btn.on("click", function() {
		
		var wd = $search_input.val();
        if (!$.trim(wd)) {
            window.location.href = location.href.split("?")[0];
            return;
        }
		param.wd = wd;
		var pattern = new RegExp("[%!@#$^*()=|{}':;',\\[\\].<>/~！@#￥……*（）;—|{}【】‘；：”“'。，、&]");
					if ( pattern.test($.trim(wd)))
					{
						alert("请您不要在参数中输入特殊字符！");
					}else{
						 win.Search(0,param.rn,param,false);
					}
       
       // addHistory(wd);
    });

    $search_del.on("click", function() {
        resetDropDown();
    });
}(this, jQuery));

function checkJson(custom) {
    if (custom != "") {
        if (typeof custom == 'string') {
            backData = $.parseJSON(custom);
        } else {
            backData = custom;
        }
    }
    else
        backData = $.parseJSON("{}");
    return backData;
}
//'[{"equal":"bid_shandong","equalList":null,"fieldName":"categorynum","notEqual":null,"notEqualList":null}]'
//[{"startTime":"2010-01-01","endTime":"2011-01-01","fieldName":"pubdate"}]