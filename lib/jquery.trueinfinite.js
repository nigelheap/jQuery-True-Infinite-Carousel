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
 * 		direction :        "forward" 	
 * 		time :             3000, - Time between slides
 * 		speed :            500, - Speed of transition 
 * 		timeout :          3000, - Pause time before the first move
 * 		direction :        "foward", - Direction of slides 
 * 		setStyle :         true - Is the js setting the style?
 * 		itemHeight:        100, - Item height default px or eg: '2em' : css ! set &  setStyle:true
 * 		itemWidth :        100, - Item width default px or eg: '2em' : css ! set &  setStyle:true
 * 		wrapperElement :   'div', - HTML element inside the called box
 * 		sliderElement :    'ul', - Item conatiner normally a ul or ol
 * 		itemElement :      'li' - Item element
 *		pauseOnHover :		false - pause animation on hover
 *		before : 			function(current, next){} this = nextItem
 *		after :             function(current, next){} this = nextItem
 *		start :             function(items, settings){} this = firstItem
 * 	}	
 * 	
 * 	--USAGE--
 *
 *	<div id="infiniteCarousel">
 *		<div class="wrapper">
 *			<ul>
 *				<li><a href=""><img src="path/to/img/image.png" /></a></li>
 *				<li><a href=""><img src="path/to/img/image1.png" /></a></li>
 *				<li><a href=""><img src="path/to/img/image2.png" /></a></li>
 *				<li><a href=""><img src="path/to/img/image4.png" /></a></li>
 *			</ul>
 *		</div>
 *	</div>
 * 	
 * 	$(document).ready(function(){
 * 	
 * 	  $('#infiniteCarousel').trueInfinite([settings]);
 * 	  
 * 	}); 
 * 
 
TODO:
	adding next & prev options
	
 
************************/

(function( $ ){
		  
	// Constants	  
	var $wrapper,
		$slider,
		$items,
		$nextItem,
		$currentItem,
		singleWidth,
		currentPage,
		pages,
		timer,
		dir = -1,
		totalWidth = 0,
		maxWidth = 0,
		minWidth = 9000,
		totalItems = 0,
		settings = {
		  time :            3000,
		  speed :           500,
		  timeout :         0,
		  direction :       "forward",
		  setStyle :        true,
		  setDimensions :   false,
		  itemHeight :      100,
		  itemWidth :       100,
		  wrapperElement :  'div',
		  sliderElement :   'ul',
		  itemElement :     'li',
		  pauseOnHover :	false,
		  before :          null,
		  after :           null,
		  start :           null	  
		};	
	
	function log() {
		if (window.console && window.console.log)
			window.console.log('[trueInfinite] ' + Array.prototype.join.call(arguments,' '));
	};
		  
	methods = {
	  init : function( options ) {  

		if ( options ) { 
        	settings = $.extend( settings , options );
		}	
		// need to set these as objects for later functions
		settings.before = settings.before ? [settings.before] : [];
		settings.after = settings.after ? [settings.after] : [];
		settings.start = settings.start ? [settings.start] : [];
		
		// Setting up elements
		$outer = $(this);
		$wrapper = $('> '+settings.wrapperElement, this);
		$slider = $wrapper.find('> '+settings.sliderElement);
		$items = $slider.find('> '+settings.itemElement);
		$single = $items.filter(":first");
		totalItems = $items.size();
		singleWidth = $single.outerWidth();
		pages = Math.ceil($items.length);

		// run the start callbacks
		if (settings.start.length)
			$.each(settings.start, function(i,o) {
				o.apply($single, [$items, settings]);
			}); 		
		
		//Set Styling if the mood is right 
		if(settings.setStyle)
			methods.setStyle();
		
		if(settings.timeout > 0)
			setTimeout('methods.start()',settings.timeout);
		else if(settings.time > 0) {
			methods.slide();
			methods.start();
		} 
			
		if(settings.pauseOnHover){
			$outer.hover(function(){
				methods.stop();
			}, function(){
				methods.start();
			});
		}
	  },
	  slide : function(options) {
	  		
	  		$currentItem = $slider.find('> li:first:not(:animated)');
	  		
	  		$nextItem = $currentItem.next();
	  		
	  		// run the before callbacks
			if (settings.before.length)
				$.each(settings.before, function(i,o) {
					o.apply($nextItem, [$currentItem, $nextItem, $items, settings]);
				}); 
	  	
	  		curentSingleWidth = $currentItem.width();
	  
			$($currentItem.clone()).appendTo($slider);
							
			$currentItem.animate({
				marginLeft : '+=' + dir*curentSingleWidth
			}, settings.speed, function () {
				$(this).remove();
				
				$currentItem = $slider.find('> li:first:not(:animated)');
				$nextItem = $currentItem.next();
				
				// run the after callbacks
				if (settings.after.length)
					$.each(settings.after, function(i,o) {			
						o.apply($nextItem, [$currentItem, $nextItem, $items, settings]);
					}); 
					
			});  
			   			
			return false;
			
	  },
	  start : function(){
			timer = setInterval(methods.slide, settings.time);
	  },
	  stop : function(){
			clearInterval(timer);
	  },
	  next : function(){
	  		methods.slide();
	  },
	  prev : function(){
	  		$itemToMove = $slider.find('> li:last:not(:animated)');
	  		var itemWidth = $itemToMove.width();
	  		$($itemToMove.clone()).prependTo($slider);
	  		$newItem = $slider.find('> li:first:not(:animated)');
	  		$newItem.css({
	  			marginLeft:(-1)*itemWidth
	  		});
	  		$itemToMove.remove();
	  		
			$newItem.animate({
				marginLeft : 0
			}, settings.speed, function () {

				$itemToMove.remove();
					
			});  
	  		
	  		return false;

	  },
	  setStyle : function(){
	  
	  		$slider.css({
	  			margin : 0,
	  			padding : 0
	  		});
	  
	  		// Get widths of things
	  		$items.each(function(){
	  			itWidth = $(this).width();
	  			totalWidth += itWidth;
	  			maxWidth = Math.max(itWidth, maxWidth);
	  			minWidth = Math.min(itWidth, minWidth);
	  		});
	
	  		$outer.css({
	  			position : "relative",
	  			overflow : "hidden"
	  		});
	  
	  		$wrapper.css({
	  			position : 'absolute',
	  			overflow : 'visible',
	  			width : totalWidth+maxWidth
	  		});
	  		
	  		if(settings.direction == "reverse"){
	  			$items.css({float:'right'});
	  			$wrapper.css({
	  				right : 0,
	  				marginLeft : (-1)*((totalWidth+maxWidth)-(minWidth*totalItems))
	  			});
	  		} else {
	  			$items.css({float:'left'});
	  			$wrapper.css({left : 0});
	  		}
	  		
	  		if(settings.setDimensions){
	  		
		  		iHeight = $single.height();
		  		iWidth = $single.width();
		  		
		  		iWidth = iWidth > 0 ? iWidth : settings.itemWidth;
		  		iHeight = iHeight > 0 ? iHeight : settings.itemWidth;
	
				$items.css({
		  			height:	iHeight,
		  			width: iWidth
		  		});
		  		
		  	}
	
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
