/*


$(document).ready(function(){

  $('#infiniteCarousel').trueinfinite({time:6000});

});

*/

(function( $ ){
		  
	// Constants	  
	var $wrapper,
		$slider,
		$items,
		$single,
		singleWidth,
		visible = 1,
		currentPage,
		pages,
		dir = -1,
		timer,
		settings = {
		  time : 3000
		};
		
	
	function log() {
		if (window.console && window.console.log)
			window.console.log('[trueinfinite] ' + Array.prototype.join.call(arguments,' '));
	};
		  
	var methods = {
	  init : function( options ) {  

		if ( options ) { 
        	settings = $.extend( settings, options );
      	}	
		
		$wrapper = $('> div', this).css('overflow', 'visible');
		$slider = $wrapper.find('> ul');
		$items = $slider.find('> li');
		$single = $items.filter(':first');
			
		singleWidth = $single.outerWidth();
		visible = 1;
		pages = Math.ceil($items.length);  
		
		methods.start();
		
	  },
	  slide : function(options) {  
	  			
			$($slider.find('> li:first:not(:animated)').clone()).appendTo($slider);
			$($slider.find('> li:last')).userHover();
			
			$slider.find('> li:first').filter(':not(:animated)').animate({
				marginLeft : '+=' + dir*singleWidth
			}, 500, function () {
				$(this).remove();
			});                
			
			return false;
			
	  },
	  start : function(){
			timer = setInterval(methods.slide, settings.time);
	  },
	  stop : function(){
			clearInterval(timer);
	  }
	  
	};


	$.fn.trueinfinite = function (method) {
		 
		// Method calling logic
		if ( methods[method] ) {
			
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		  
		} else if ( typeof method === 'object' || ! method ) {
			
		  return methods.init.apply( this, arguments );
		  
		} else {
			
		  log( 'Method ' +  method + ' does not exist on jQuery.trueinfinite' );
		  
		}    
		
	};

})( jQuery );







