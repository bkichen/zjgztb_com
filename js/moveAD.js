/**
 * 两侧广告js
 *  author:zhangzj;     
 *  v 1.0.1
 *  2015-12-29
 *
 */

(function(win, $) {
    var defaultSettings = {
        // 浮动元素dom
        dom: null,
        // 广告宽度
        width: 100,
        // 广告高度
        height: 100,
        // 初始距顶部的高度
        sTop: 25,
        // 关闭按钮
        closeDom: '.close'
    };
    win.MoveAd = function(opts) {
        // 参数整合
        this.cfg = $.extend({}, defaultSettings, opts);
        // 初始化函数
        this._initEvent();
    };

    $.extend(MoveAd.prototype, {
        _initEvent: function() {
            var c = this.cfg;
            var self = $(c.dom);
            var sh = $(window).scrollTop();
            self.find('.move-item').each(function(index) {
				$(this).height(c.height);
                if(index==0 || index%2==0) {
                    $(this).addClass('pl');
                    var h = sh + c.sTop+(c.sTop + c.height)*(parseInt((index+1)/2));
                    $(this).offset({top:h});
                }else {
                    $(this).addClass('pr');
                    var h = sh + c.sTop+(c.sTop + c.height)*(parseInt((index+1)/2)-1);
                    $(this).offset({top:h});
                }
                $(this).find(c.closeDom).on("click",function(){
                    $(this).parent().addClass('hidden');
                    for (var j = 2 ; index + j < self.find('.move-item').length; j += 2)
                    {
                        var n = self.find('.move-item').eq(index + j);
                        var nsh = $(window).scrollTop();
                        var nh = n.offset().top - (c.sTop+c.height+nsh);
                        n.animate({top:nh},1000);
                    }
                });
            });
        }
    });
}(this, jQuery));
