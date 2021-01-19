/* 页面交互效果 */

(function (win, $) {


    // tab切换
    $(".tab-view").each(function (index, el) {
        new TabView({
            dom: el,
            activeCls: 'current',
            triggerEvent: 'click',
            itemClick: function (index) {}
        });
    });

    // 美化滚动条
    $(".beauty-scroll").niceScroll({
        cursorcolor: "#c7daf0", // 改变滚动条颜色，使用16进制颜色值
        cursorwidth: "8px", // 滚动条的宽度，单位：便素
        autohidemode: false,
        cursorborderradius: "8px" // 滚动条圆角（像素）
    });


    var startlay = laydate.render({
        elem: '#date-init', //指定元素
        mark: {
            // '2019-09-21': '',
            // '2019-09-01': '',
            // '2019-09-15': '',
        },
        theme: '#0d6ecd',
        showBottom: false,
        position: 'static',
        done: function (value, dates) {
            // console.log(value, dates);
            // startlay.config.mark = {
            //     '2019-10-21':'',
            //     '2019-10-26':'',
            //     '2019-10-01':''
            // };
            // console.log($(this)[0].mark);
            // var markArry = $(this)[0].mark;
            // for(var key in markArry){
            //     // console.log(key);   
            //     // console.log(value);
            //     if(value===key){
            //         window.open("/kbdetail.html?JinRiDate="+value);
            //     }
               
            // }

            window.open("/kbdetail.html?JinRiDate="+value);

        }
    });
}(this, jQuery));