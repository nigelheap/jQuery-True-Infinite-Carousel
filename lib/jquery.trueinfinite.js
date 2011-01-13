/************************
 * 
 * jQuery True Infinite v0.2
 * http://nigelheap.com/labs/true-infinite
 *
 * Copyright 2011, Nigel Heap
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Sat Jan 08 09:34:00 2011 +1000
 *  
 * 
 *  --PUBLIC SETTINGS--
 * 	
 * 	{
 * 		direction :        "foward" 	
 * 		time :             3000, - Time between slides
 * 		speed :            500, - Speed of transition 
 * 		timeout :          3000, - Pause time before the first move
 * 		direction :        "foward", - Direction of slides 
 * 		setStyle :         true - Is the js setting the style?
 * 		itemHeight:        100, - Item height default px other wise eg: '2em'
 * 		itemWidth :        100, - Item width default px other wise eg: '2em'
 * 		wrapperElement :   'div', - HTML element inside the called box
 * 		sliderElement :    'ul', - Item conatiner normally a ul or ol
 * 		itemElement :      'li' - Item element
 * 	}	
 * 	
 * 	--USAGE--
 
 	<div id="infiniteCarousel">
 		<div class="wrapper">
 			<ul>
 				<li><a href=""><img src="path/to/img/image.png" /></a></li>
 				<li><a href=""><img src="path/to/img/image1.png" /></a></li>
 				<li><a href=""><img src="path/to/img/image2.png" /></a></li>
 				<li><a href=""><img src="path/to/img/image4.png" /></a></li>
 			</ul>
 		</div>
 	</div>
 * 	
 * 	$(document).ready(function(){
 * 	
 * 	  $('#infiniteCarousel').trueInfinite([settings]);
 * 	  
 * 	});
 * 
 ************************/


(function( $ ){
		  
	// Constants	  
	var $wrapper,
		$slider,
		$items,
		singleWidth,
		currentPage,
		pages,
		timer,
		dir = -1,
		settings = {
		  time :            3000,
		  speed :           500,
		  timeout :         0,
		  direction :       "foward",
		  setStyle :        true,
		  itemHeight :      100,
		  itemWidth :       100,
		  wrapperElement :  'div',
		  sliderElement :   'ul',
		  itemElement :     'li'		  
		};	
	
	function log() {
		if (window.console && window.console.log)
			window.console.log('[trueInfinite] ' + Array.prototype.join.call(arguments,' '));
	};
		  
	var methods = {
	  init : function( options ) {  

		if ( options ) { 
        	settings = $.extend( settings, options );
      	}	
		
		// Setting up elements
		$wrapper = $('> '+settings.wrapperElement, this);
		$slider = $wrapper.find('> '+settings.sliderElement);
		$items = $slider.find('> '+settings.itemElement);
		$single = $items.filter(":first");
		singleWidth = $single.outerWidth();
		pages = Math.ceil($items.length);
		
		
		//Set Styling if the mood is right 
		if(settings.setStyle)
			methods.setStyle();
		
		methods.setDirection();
		
		if(settings.timeout > 0)
			setTimeout(methods.start(),settings.timeout);
		else
			methods.start();
		
				
	  },
	  slide : function(options) { 
	  
	  		if(settings.direction == "reverse"){
	  		
				$($slider.find('> li:last:not(:animated)').clone()).prependTo($slider);
				
				$slider.find('> li:last').filter(':not(:animated)').animate({
					marginRight : '+=' + dir*singleWidth
				}, settings.speed, function () {
					$(this).remove();
				});       
				  		
	  		
	  		} else { 
	  			
				$($slider.find('> li:first:not(:animated)').clone()).appendTo($slider);
				
				$slider.find('> li:first').filter(':not(:animated)').animate({
					marginLeft : '+=' + dir*singleWidth
				}, settings.speed, function () {
					$(this).remove();
				});       
			
			}         
			
			return false;
			
	  },
	  start : function(){
			timer = setInterval(methods.slide, settings.time);
	  },
	  stop : function(){
			clearInterval(timer);
	  },
	  setDirection : function (){
	  		if(settings.direction == "reverse"){
				dir = 1;
			} 
	  },
	  setStyle : function(){
	  
	  		$wrapper.parent().css({overflow:'hidden'});
	  		$wrapper.css('overflow', 'visible');
	  		
	  		if(settings.direction == "reverse"){
	  			$items.css({float:'right'});
	  		} else {
	  			$items.css({float:'left'});
	  		}
	  		
	  		iHeight = $single.height();
	  		iWidth = $single.width();
	  		
	  		iWidth = iWidth > 0 ? iWidth : settings.itemWidth;
	  		iHeight = iHeight > 0 ? iHeight : settings.itemWidth;

			$items.css({
	  			height:	iHeight,
	  			width: iWidth
	  		});
	
	  }
	};

	$.fn.trueInfinite = function (method) {
		 
		// Method calling logic
		if ( methods[method] ) {
			
		  return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		  
		} else if ( typeof method === 'object' || ! method ) {
			
		  return methods.init.apply( this, arguments );
		  
		} else {
			
		  log( 'Method ' +  method + ' does not exist on jQuery.infiniteCarousel' );
		  
		}    
		
	};

})( jQuery );

