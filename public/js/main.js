/* ================================================
---------- Ona - OnepageTemplate Template ------- */
$(function() {
	"use strict";

	// Check for mobile
	var mobile;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mobile = true;
	} else {
		mobile = false;
	}

	// Ona Loader hide on window load
	$('#ona-loader').delay(700).fadeOut(800, function () {
		$(this).remove();
	});

	//Scroll Spy
	$('body').scrollspy({
		target: '.navbar-container'
	});

	var offsetDefined = false;
	// because of fixed header add dynamic offset for scroll spy
	// to prevent multiple call when scroll use offsetDefined
	function fixSpyOffset() {
		if ($(window).width() >= 768 && $(window).scrollTop() > 100) {
			if (offsetDefined) 
				return;

			var $body = $('body'), 
				data = $body.data('bs.scrollspy');

			data.options.offset = 81;
			$body.data('bs.scrollspy', data);
			$body.scrollspy('refresh');
			offsetDefined = true;
		}
	}

	// on scroll offsetDefined is not true
	$(window).on('scroll load', function () {
		// do not even call if offsetDefined = true
		if (!offsetDefined) {
			fixSpyOffset();
		}
	});

	// Side navigation menu scrollspy
	var sideNavSpyEl = '';
	$('body').on('activate.bs.scrollspy', function () {
		if (sideNavSpyEl != '') {
			sideNavSpyEl.removeClass('active');
		}

		var activeElHref = $('.navbar-nav').find('li.active').find('a').attr('href');
			sideNavSpyEl = $('.side-nav')
							.find('a[href="' + activeElHref + '"]')
							.closest('li')
							.addClass('active');
	});
	// Trigger event if window width > 767 px -- side elem's are hidden in smaller screens
	if($('.side-nav').length && Modernizr.mq('(min-width: 768px)')) {
		$('body').trigger('activate.bs.scrollspy');
	}

	// Menu hover
	if (Modernizr.mq('only all and (min-width: 992px)') && !Modernizr.touchevents && $.fn.hoverIntent) {
		$('.navbar-nav').hoverIntent({
			over: function() {
				var  $this = $(this);
				if($this.find('ul, div').length) {
					$this.addClass('open');
					$this.find('.dropdown-toggle').addClass('disabled');
				}
			},
			out: function() {
				var  $this = $(this);
				if($this.hasClass('open')) {
					$this.removeClass('open');
					$this.find('.dropdown-toggle').removeClass('disabled');
				}
			},
			selector: 'li',
			timeout: 145,
			interval: 55
		});
	}

	// Fix fore mobile
	if (Modernizr.mq('only all and (max-width: 991px)') || Modernizr.touchevents) {
		$('.navbar-nav').find('.dropdown-toggle').on('click', function (e) {
			var parent = $(this).closest('li');
            // close all the siblings and their children
            parent.siblings().removeClass('open').find('li').removeClass('open');
            // open which one is clicked
            parent.toggleClass('open');
            // prevent
            e.preventDefault();
            e.stopPropagation();
		});
	}

	// Menu smooth scroll animation if target elem is exists
	$('.navbar-nav, .side-nav, .footer-menu').find('a').on('click', function (e) {
		var target = $(this).attr('href');
		if ( target.indexOf('#') === -1 || !$(target).length ) {
			return;
		} else {
			var targetPos = $(target).offset().top,
				winWidth =  $(window).width();

			if (winWidth >= 768) {
				// add edge offset if edges are visible
				targetPos -= 80;
			} 

			if (winWidth <= 991) {
				$('.navbar-container').removeClass('nav-open');
			}

			fixSpyOffset();

			$('html, body').animate({
				'scrollTop': targetPos
			}, 1200, 'easeInOutCubic');

			e.preventDefault();
		}
	});

	// Mobile navigation menu display
	$('#mobile-nav-btn, #mobile-nav-close').on('click', function (e) {
		$('.navbar-container').toggleClass('nav-open');
		e.preventDefault();
	});

	// Scroll Top
	$(window).on('load scroll', function () {
		var windowTop = $(window).scrollTop(),
            scrollTop = $('#scroll-top');

        if (windowTop >= 300) {
            scrollTop.addClass('fixed');
        } else {
            scrollTop.removeClass('fixed');
        }
	});

	$('#scroll-top').on('click', function (e) {
        $('html, body').animate({
	            'scrollTop': 0
        }, 1200, 'easeInOutCubic');
		e.preventDefault();
	});

	// Scroll To Element
	$('.scrollto').on('click', function (e) {
		var targetId = $(this).attr('href'),
			targetEl = $(targetId),
			targetOfset = $(this).data('scroll-offset'),
			targetElPos;

		if (targetEl.length) {
			targetElPos = targetOfset ? ( targetEl.offset().top - targetOfset ): targetEl.offset().top ;
			
			if ($(window).width() < 768) {
				targetElPos += 56; // Fix for mobile (we delete page edges so new calculation for offset)
			}

            $('html, body').animate({
		            'scrollTop': targetElPos
	        }, 1200, 'easeInOutCubic');

			e.preventDefault();
		}
	});

	// Tooltip Trigger
	$('[data-toggle="tooltip"]').tooltip();

	// Wow animation plugin init
	new WOW().init();

	// Progress Bars 
	$('.progress-animate').waypoint(function () {
		var $this = $(this),
			progressVal = $(this).data('width'),
			progressText = $this.find('.progress-tooltip');

		$this.css({ 'width' : progressVal + '%'}, 400);

		setTimeout(function() {
			progressText.fadeIn(400, function () {
				$this.removeClass('progress-animate');
			});
		}, 100);
	}, {
		offset: function() {
			return ( $(window).height() - 100);
		}
	});

	// Gallery Isotope
	if($.fn.isotope) {
		var galleryContainer = $('#gallery-item-container'),
			filterContainer = $('#gallery-filter'),
			layoutMode = galleryContainer.data('layoutmode');

		// Wait for images
		galleryContainer.waitForImages(function () {
			// Layout init	
			galleryContainer.isotope({
	        	itemSelector: '.gallery-item',
	        	layoutMode: (layoutMode) ? layoutMode : 'masonry'
	    	});
			// Filter init
	    	filterContainer.find('a').on('click', function(e) {
				var $this = $(this),
					selector = $this.attr('data-filter');

				filterContainer.find('.active').removeClass('active');

				// And filter now
				galleryContainer.isotope({
					filter: selector,
					transitionDuration: '0.8s'
				});
				
				$this.closest('li').addClass('active');
				e.preventDefault();
			});

    	});
	}

	// Parallax - waitforimages
	if ( !mobile ) {
		$('body').waitForImages(function () {
			skrollr.init({
				forceHeight: false,
				easing: "outCubic"
			});
		});
	}

	// Date Time Picker
	// Include jquery.bootstrap-datetimepicker.min.min.js file

	if ($.fn.datetimepicker) {
		// Date picker
		$('.form-date').datetimepicker({
	        weekStart: 1,
	        todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1
	    });
	}


	// gallery Carousel
	$('.owl-carousel.related-gallery-carousel').owlCarousel({
        loop:true,
		margin:0,
		responsiveClass:true,
		nav:true,
		navText: ['<i class="ion-ios-arrow-left">', '<i class="ion-ios-arrow-right">'],
		dots: false,
		autoplay: true,
		autoplayTimeout: 10000,
		smartSpeed:800,
		responsive:{
			0: {
				items:1
			},
			480: {
				items:2
			},
			768: {
				items:3
			},
			992: {
				items:4
			},
			1500: {
				items:5
			}
		}
    });

	// Testimonials Carousel
    $('.owl-carousel.testimonials-carousel').owlCarousel({
        loop:true,
		margin:0,
		responsiveClass:true,
		nav:true,
		navText: ['<i class="ion-ios-arrow-left">', '<i class="ion-ios-arrow-right">'],
		dots: false,
		autoplay: true,
		autoplayTimeout: 13000,
		items:1
    });

    // lightbox
	$('.popup-gallery').magnificPopup({
		delegate: '.popup-item',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-fade',
		image: {
			verticalFit: true,
			titleSrc: function(item) {
				return item.el.attr('title');
			}
		},
		gallery: {
			enabled: true
		}
	});

	/* Twitter feed for user*/
	if ($.fn.tweet && $('.twitter-feed-widget').length) {
	    $('.twitter-feed-widget').tweet({
	        modpath: './js/twitter/',
	        avatar_size: '',
			count: 3,
			query: 'wrapbootstrap', // write your username here
			loading_text:  'searching twitter...',
	        join_text: '',
	        retweets: false,
	        template: '<div class="twitter-icon"><i class="ion-social-twitter"></i></div><div class="tweet-content">{text}{time}</div>'
	        /* etc... */
	    });
	}

	// Instagram feed
    if ( $.fn.spectragram && $('#instafeed').length) {
		jQuery.fn.spectragram.accessData = {
		    accessToken: '3541242226.88da395.ed646898a9414de8afc1c025be14b590',
		    clientID: '88da3951141a4ef5b9fcfa5c19291f2e'
		};

		jQuery('#instafeed').spectragram('getUserFeed',{
		    query: 'onetemplate',
		    max: 10,
		    size: 'medium',
		    wrapEachWith: '',
		    complete: function() {

		    	$('#instafeed.owl-carousel').owlCarousel({
		            loop:true,
					margin:0,
					responsiveClass:true,
					nav:false,
					dots: false,
					autoplay: true,
					autoplayTimeout: 15000,
					smartSpeed:800,
					responsive:{
						0: {
							items:2
						},
						480: {
							items:3
						},
						768: {
							items:4
						},
						992: {
							items:5
						},
						1200: {
							items:6
						},
						1500: {
							items:7
						},
						1900: {
							items:8
						}
					}
		        });
		    }
		});
    }

    /* Media element plugin for video and audio */
    if($.fn.mediaelementplayer) {
		$('video, audio').mediaelementplayer();
    }

    // Google Map api v3
    if (document.getElementById("map") && typeof google === "object") {
        var locations = [
            ['<address><strong>Address:</strong> Marylebone, London W1U, UK <br> <strong>Phone:</strong> +10 0 (333) 839 25 55</address>', 51.521107, -0.157002, 9]
        ];

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: new google.maps.LatLng(51.521107, -0.157002),
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();


        var marker, i;

        for (i = 0; i < locations.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: 'assets/pin.png',
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
    }

});

// Window resize event
$(window).on('resize', function () {
	// Refrest scrollspy on window resize
	$('[data-spy="scroll"]').each(function () {
		var $spy = $(this).scrollspy('refresh')
	});
});


/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);

/*
 * jQuery Easing v1.3.2 - http://gsgd.co.uk/sandbox/jquery/easing/
 * Open source under the BSD License.
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/gdsmith/jquery-easing/master/LICENSE
*/
(function(h){h.easing.jswing=h.easing.swing;h.extend(h.easing,{def:"easeOutQuad",swing:function(e,a,c,b,d){return h.easing[h.easing.def](e,a,c,b,d)},easeInQuad:function(e,a,c,b,d){return b*(a/=d)*a+c},easeOutQuad:function(e,a,c,b,d){return-b*(a/=d)*(a-2)+c},easeInOutQuad:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a+c:-b/2*(--a*(a-2)-1)+c},easeInCubic:function(e,a,c,b,d){return b*(a/=d)*a*a+c},easeOutCubic:function(e,a,c,b,d){return b*((a=a/d-1)*a*a+1)+c},easeInOutCubic:function(e,a,c,b,d){return 1>
(a/=d/2)?b/2*a*a*a+c:b/2*((a-=2)*a*a+2)+c},easeInQuart:function(e,a,c,b,d){return b*(a/=d)*a*a*a+c},easeOutQuart:function(e,a,c,b,d){return-b*((a=a/d-1)*a*a*a-1)+c},easeInOutQuart:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a*a*a+c:-b/2*((a-=2)*a*a*a-2)+c},easeInQuint:function(e,a,c,b,d){return b*(a/=d)*a*a*a*a+c},easeOutQuint:function(e,a,c,b,d){return b*((a=a/d-1)*a*a*a*a+1)+c},easeInOutQuint:function(e,a,c,b,d){return 1>(a/=d/2)?b/2*a*a*a*a*a+c:b/2*((a-=2)*a*a*a*a+2)+c},easeInSine:function(e,a,
c,b,d){return-b*Math.cos(a/d*(Math.PI/2))+b+c},easeOutSine:function(e,a,c,b,d){return b*Math.sin(a/d*(Math.PI/2))+c},easeInOutSine:function(e,a,c,b,d){return-b/2*(Math.cos(Math.PI*a/d)-1)+c},easeInExpo:function(e,a,c,b,d){return 0==a?c:b*Math.pow(2,10*(a/d-1))+c},easeOutExpo:function(e,a,c,b,d){return a==d?c+b:b*(-Math.pow(2,-10*a/d)+1)+c},easeInOutExpo:function(e,a,c,b,d){return 0==a?c:a==d?c+b:1>(a/=d/2)?b/2*Math.pow(2,10*(a-1))+c:b/2*(-Math.pow(2,-10*--a)+2)+c},easeInCirc:function(e,a,c,b,d){return-b*
(Math.sqrt(1-(a/=d)*a)-1)+c},easeOutCirc:function(e,a,c,b,d){return b*Math.sqrt(1-(a=a/d-1)*a)+c},easeInOutCirc:function(e,a,c,b,d){return 1>(a/=d/2)?-b/2*(Math.sqrt(1-a*a)-1)+c:b/2*(Math.sqrt(1-(a-=2)*a)+1)+c},easeInElastic:function(e,a,c,b,d){e=1.70158;var f=0,g=b;if(0==a)return c;if(1==(a/=d))return c+b;f||(f=.3*d);g<Math.abs(b)?(g=b,e=f/4):e=f/(2*Math.PI)*Math.asin(b/g);return-(g*Math.pow(2,10*--a)*Math.sin(2*(a*d-e)*Math.PI/f))+c},easeOutElastic:function(e,a,c,b,d){e=1.70158;var f=0,g=b;if(0==
a)return c;if(1==(a/=d))return c+b;f||(f=.3*d);g<Math.abs(b)?(g=b,e=f/4):e=f/(2*Math.PI)*Math.asin(b/g);return g*Math.pow(2,-10*a)*Math.sin(2*(a*d-e)*Math.PI/f)+b+c},easeInOutElastic:function(e,a,c,b,d){e=1.70158;var f=0,g=b;if(0==a)return c;if(2==(a/=d/2))return c+b;f||(f=.3*d*1.5);g<Math.abs(b)?(g=b,e=f/4):e=f/(2*Math.PI)*Math.asin(b/g);return 1>a?-.5*g*Math.pow(2,10*--a)*Math.sin(2*(a*d-e)*Math.PI/f)+c:g*Math.pow(2,-10*--a)*Math.sin(2*(a*d-e)*Math.PI/f)*.5+b+c},easeInBack:function(e,a,c,b,d,f){void 0==
f&&(f=1.70158);return b*(a/=d)*a*((f+1)*a-f)+c},easeOutBack:function(e,a,c,b,d,f){void 0==f&&(f=1.70158);return b*((a=a/d-1)*a*((f+1)*a+f)+1)+c},easeInOutBack:function(e,a,c,b,d,f){void 0==f&&(f=1.70158);return 1>(a/=d/2)?b/2*a*a*(((f*=1.525)+1)*a-f)+c:b/2*((a-=2)*a*(((f*=1.525)+1)*a+f)+2)+c},easeInBounce:function(e,a,c,b,d){return b-h.easing.easeOutBounce(e,d-a,0,b,d)+c},easeOutBounce:function(e,a,c,b,d){return(a/=d)<1/2.75?7.5625*b*a*a+c:a<2/2.75?b*(7.5625*(a-=1.5/2.75)*a+.75)+c:a<2.5/2.75?b*(7.5625*
(a-=2.25/2.75)*a+.9375)+c:b*(7.5625*(a-=2.625/2.75)*a+.984375)+c},easeInOutBounce:function(e,a,c,b,d){return a<d/2?.5*h.easing.easeInBounce(e,2*a,0,b,d)+c:.5*h.easing.easeOutBounce(e,2*a-d,0,b,d)+.5*b+c}})})(jQuery);