// left tree

(function(win, $) {
    $('.wb-tree').on('click', '.wb-tree-node', function(event) {
		var $this = $(this).parent();
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

    		$(item).attr("style","display: block;");
    	
    
    });

  
}(this, jQuery));