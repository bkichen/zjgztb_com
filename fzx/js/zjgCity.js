(function (win, $) {

    // slide公共配置
    var slideConfig = {
        effect: "leftLoop",
        autoPlay: true
    };
 
    // 图片轮播
    $(".ewb-scroll").slide(
        $.extend(slideConfig, {
            titCell: ".ewb-scroll-hd li",
            mainCell: ".ewb-scroll-bd ul"
        })
    );
     // tab
    $('.ewb-notice').slide({
        autoPlay: false,
        titCell: ".ewb-notice-hd li",
        mainCell: ".ewb-notice-bd",
        startFun: function (i) {

        }
    });
    
})(this, jQuery);