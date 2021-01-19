// author: wuzhou
(function (win, $) {
    var defaultSettings = {
        // 默认选中的tab项，为false时 取消指定
        activeIndex: 0,
        // 容器dom对象
        dom: null,
        // 触发tab切换的事件：click|mouseover
        triggerEvent: 'mouseover',
        // 高亮时的样式名
        activeCls: '',
        // 无障碍
        barrierFree:false,
        //切换速度
        speed: 500,
        // 回调函数
        itemClick: null
    };

    win.TabView = function (opts) {
        this.cfg = $.extend({}, defaultSettings, opts);
        this._initView();
        this._initEvent();

    };

    $.extend(TabView.prototype, {
        _initView: function () {
            var c = this.cfg;

            var $widget = $(c.dom),

                $widgetHd = $widget.find('> [data-role="head"]'),
                $widgetBd = $widget.find('> [data-role="body"]'),

                $tabs = $widgetHd.find('[data-role="tab"]'),
                $tabCons = $widgetBd.find('> [data-role="tab-content"]');
            $tabMores = $widgetHd.find('[data-role="more"]');

            $.extend(this, {
                $widgetHd: $widgetHd,
                $tabs: $tabs,
                $tabCons: $tabCons,
                $tabMores: $tabMores
            });

            // 响应式tab切换，移动设备禁止跳转的解决方案
            var is_iPd = navigator.userAgent.match(/(iPad|iPod|iPhone)/i) !== null;
            var is_mobi = navigator.userAgent.toLowerCase().match(/(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|win ce)/i) !== null;
            if (is_iPd || is_mobi) {
                $tabs.find("a").on('click', function (e) {
                    e.preventDefault();
                });
                $("a[data-role=tab]").on('click', function (e) {
                    e.preventDefault();
                });
            }

        },

        _initEvent: function () {
            var c = this.cfg,
                $widget = $(c.dom),
                triggerEvent = c.triggerEvent,

                $widgetHd = this.$widgetHd,
                self = this;

            // 用于mouseover触发时的延时
            var overTimer = 0;

            if (triggerEvent == 'click') {
                $widgetHd.on('click', '[data-role="tab"]', function (event) {
                    event.preventDefault();
                    
                    $.proxy(self._activeTab, self, $(this))();

                });

            } else if (triggerEvent == 'mouseover') {
                $widgetHd.on('mouseover', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);

                    overTimer = setTimeout($.proxy(self._activeTab, self, $(this)), c.speed);

                }).on('mouseout', '[data-role="tab"]', function () {
                    overTimer && clearTimeout(overTimer);
                });
            }
            // 无障碍 
            $widgetHd.on('focus', '[data-role="tab"]', function (event) {
                event.preventDefault();

                $.proxy(self._activeTab, self, $(this))();
            });
            if(!!c.barrierFree){
                var tabeleselector = "a:visible,button:visible,input:visible,textarea:visible,select:visible";
                var tabtargetI = 0;
                setTimeout(function () {
                    $("[data-target]").each(function () {
                        var $this = $(this);
                        var $target = getTarget($this);
                        bindTabTarget($this, $target.find(tabeleselector).first());
                        bindReTabTarget($target.find(tabeleselector).first(), $this);
                        if (typeof ($this.attr("tabtarget")) == "undefined") {
                            var $ul = $this.closest('ul:not(.dropdown-menu)');
                            var $lis = $ul.find("li");
                            if ($lis.length > 1) {
                                for (var i = 0; i < $lis.length - 1; i++) {
                                    var _target = getTarget($lis.eq(i).find("a,input,button"));
                                    bindTabTarget(_target.find(tabeleselector).last(), $lis.eq(i + 1).find("a,input,button"));
                                }
                                for (var i = 1; i < $lis.length; i++) {
                                    var $targetA = $lis.eq(i - 1).find("a,input,button");
                                    var _target = getTarget($targetA);
                                    bindReTabTarget($lis.eq(i).find("a,input,button"), _target.find(tabeleselector).last(), $targetA);
                                }
                            }
                        }
                    });

                    
                    $("[totabtarget],[toretabtarget]").bind("keydown", function (e) {
                        var e = window.event ? window.event : e;
                        var keyCode = e.which ? e.which : e.keyCode;
                        var $focus = null;
                        if (keyCode == 9) {
                            if (!e.shiftKey)
                                $focus = $("[tabtarget='" + $(this).attr("totabtarget") + "']");
                            else {
                                $focus = $("[retabtarget='" + $(this).attr("toretabtarget") + "']");
                                if ($focus.length > 0) {
                                    var _retargetA = $("[retargetA='" + $(this).attr("toretabtarget") + "']");
                                    if (_retargetA.length > 0) {
                                        event.preventDefault();
                                        $.proxy(self._activeTab, self, $(this))();
                                    }
                                }
                            }

                            console.log($focus);
                            if ($focus.length > 0) {
                                $focus[0].focus();
                                return false;
                            }
                        }
                    });
                }, 500);
            }
            if (c.activeIndex !== false &&c.barrierFree===false) {
                self.activeTabByIndex(c.activeIndex); //显示第指定tab的数据
            }

            function getTarget($this) {
                var selector = $this.data('target');
                if (!selector) {
                    selector = $this.attr('data-target');
                    selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
                }
                try {
                    return $("[data-role='tab-content'][data-id=" + selector + "]");
                } catch (ex) {
                    return $(undefined);
                }
            }

            function bindTabTarget($this, $target) {
                tabtargetI++;
                $this.attr("totabtarget", tabtargetI);
                $target.attr("tabtarget", tabtargetI);
            }

            function bindReTabTarget($this, $target, $targetA) {
                tabtargetI++;
                $this.attr("toretabtarget", tabtargetI);
                $target.attr("retabtarget", tabtargetI);
                if ($targetA)
                    $targetA.attr("retargetA", tabtargetI);
            }
        },

        _activeTab: function ($tab) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs;

            var targetId = $tab.data('target');

            $tabs.removeClass(activeCls);
            $tab.addClass(activeCls);

            this._activeTabContent(targetId);
        },

        // 通过index激活对应tab
        activeTabByIndex: function (index) {
            var c = this.cfg,
                activeCls = c.activeCls;

            var $tabs = this.$tabs,

                $activeTab = null,
                targetId = '';

            // 若index合法
            if (index >= 0 && index < $tabs.length) {
                $activeTab = $tabs.removeClass(activeCls).eq(index).addClass(activeCls);

                targetId = $activeTab.data('target');

                this._activeTabContent(targetId);
            }
        },

        _activeTabContent: function (targetId) {
            var $tabCons = this.$tabCons,
                $tabs = this.$tabs,
                c = this.cfg;
            $tabMores = this.$tabMores;
 
            $tabCons.addClass('hidden')
                .filter('[data-id="' + targetId + '"]')
                .removeClass('hidden');
            // 栏目更多
            $tabMores.addClass('hidden')
                .filter('[data-id="' + targetId + '"]')
                .removeClass('hidden');
            if (c.itemClick) {
                c.itemClick($tabCons.filter('[data-id="' + targetId + '"]').index());
            }
        }
    });
}(this, jQuery));