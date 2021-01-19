// left tree

(function(win, $) {
//  $('.wb-tree').on('click', '.wb-tree-node', function(event) {
//		var $this = $(this).parent();
//		if ($this.hasClass('haschild')) { 
//              if($this.hasClass('current')){
//					
//				}else{
//					$('.wb-tree-items').removeClass('current');
//				}
//         
//      }
//		if ($this.hasClass('haschild')) { 
//              $this.toggleClass('current'); 
//      }
//  });

$('.wb-tree-items').each(function() {
        var _this = $(this);
        if (_this.find(".wb-tree-subs").length > 0) {
            _this.addClass('hasChild');
            if (_this.hasClass("current")) {
                _this.data("navtag", "1");
            } else {
                _this.data("navtag", "0");
            }

        }
    });
    $('.wb-tree-node').on('click', function(e) {
        e.preventDefault();
        var _this = $(this);
        if (_this.next().length > 0) {
            var curTag = _this.parent().data('navtag');
            if (curTag == "1") {
                _this.parent().toggleClass('current');
            } else {
                $('.wb-tree-items.hasChild').removeClass('current');
                _this.parent().addClass('current');
                $('.wb-tree-items.hasChild').data('navtag', '0');
                _this.parent().data('navtag', '1');
            }
        } else {
            window.location.href = _this.children("a").attr("href");
        }

    });
    

    $('.wb-tree-item').each(function() {
        var _this = $(this);
        if (_this.find(".wb-four-subs").length > 0) {
            _this.addClass('hasChild');
            if (_this.hasClass("current")) {
                _this.data("navtag", "1");
            } else {
                _this.data("navtag", "0");
            }

        }
    });
    $('.wb-three-node').on('click', function(e) {
        e.preventDefault();
        var _this = $(this);
        if (_this.next().length > 0) {
            var curTag = _this.parent().data('navtag');
            if (curTag == "1") {
                _this.parent().toggleClass('current');
            } else {
                $('.wb-tree-item.hasChild').removeClass('current');
                _this.parent().addClass('current');
                $('.wb-tree-item.hasChild').data('navtag', '0');
                _this.parent().data('navtag', '1');
            }
        } else {
            window.location.href = _this.children("a").attr("href");
        }

    });
}(this, jQuery));