/**!
 * 地图
 * author: fxyue;
 * date: 2020-04-10
 */

(function (win, $) {

    // 地图调用
    var $mapimg = $('#ewb-map-main'); //地图图片id
    $mapimg.mapster({
        fillColor: 'f9b420', //填充颜色设置
        fillOpacity: 1, //不透明度，值为0-1。
        stroke: false, //轮廓描边，当鼠标悬停或显示高亮时给所在区域描边。
        singleSelect: true,
        highlight: true,
        mapKey: 'name', //保持高亮
        onClick: function (data) {
            var regionName = $(this).attr('data-region');
            switch (regionName) {
                case "zjg":
                    window.location.href = '/nccq.html'
                    break;
                case "cs":
                    window.location.href = '/nccq.html'
                    break;
                case "tc":
                    window.location.href = '/nccq.html'
                    break;
                case "ks":
                    window.location.href = '/nccq.html'
                    break;
                case "gyyq":
                    window.location.href = '/nccq.html'
                    break;
                case "sz":
                    window.location.href = '/nccq.html'
                    break;
                case "wj":
                    window.location.href = '/nccq.html'
                    break;
            }
        },
    });

     //地图悬停出现动画
     $('area').mousemove(function(event) { 
        var regionName = $(this).attr('data-region'); //获取当前悬停的地名
        $(".ewb-area-name.cur").removeClass("cur");
        $("#" + regionName).addClass("cur");
    });

    //鼠标移出地图
    $('area').mouseout(function(event) {
        $(".ewb-area-name.cur").removeClass("cur");
    });
})(this, jQuery);