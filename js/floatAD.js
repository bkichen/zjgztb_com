/**
 *  浮动飘窗广告js
 *  author:zhangzj;     
 *  v 1.0.1
 *  2015-12-29
 *
 */

(function(win, $) {
    var defaultSettings = {
        // 浮动元素dom
        dom: null,
        // 元素宽度
        width: 100,
        //元素高度
        height: 100,
        // 步长
        step: 1,
        // 延时
        delay: 30
    };
    win.FloatAd = function(opts) {

        this.cfg = $.extend({}, defaultSettings, opts);
        // 定义元素初始偏移量
        this.yPos = 0;
        this.xPos = 0;

        // 定义元素初始方向
        this.xin = true;
        this.yin = true;

        // 初始化函数
        this._initEvent();
    };

    $.extend(FloatAd.prototype, {
        _initEvent: function() {
            var c = this.cfg;
            var t = this;
            var itl = setInterval(function() {
                t._changePos(c);
            }, c.delay);
            $(c.dom).mouseover(function() {
                clearInterval(itl);
            });
            $(c.dom).mouseout(function() {
                itl = setInterval(function() {
                    t._changePos(c);
                }, c.delay);
            });

            $(c.dom).find('.close').on('click',function(){
                $(this).parent().addClass('hidden');
            });
        },
        _changePos: function(c) {

            // 获得元素大小
            var mw = c.width,
                mh = c.height;

            // 获得当前对象
            var self = this;

            // 可视区域窗口大小
            var w = $(window).width(),
                h = $(window).height();

            // 获得纵向偏移量
            var sh = $(window).scrollTop();

            // 进行浮动,判断是否在边界位置 
            self.xPos = self.xPos + c.step * (self.xin ? 1 : -1);
            if (self.xPos >= (w - mw)) {
                self.xin = false;
                self.xPos = w - mw;
            } else if (self.xPos <= 0) {
                self.xin = true;
                self.xPos = 0;
            }

            self.yPos = self.yPos + c.step * (self.yin ? 1 : -1);
            if (self.yPos >= (h - mh)) {
                self.yin = false;
                self.yPos = h - mh;
            } else if (self.yPos <= 0) {
                self.yin = true;
                self.yPos = 0;
            }

            // 设置偏移量
            $(c.dom).css({
                'top': self.yPos + sh,
                'left': self.xPos
            });
        }
    });
}(this, jQuery));
