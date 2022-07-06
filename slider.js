;(function($) {
    'use strict';
    $.fn.slider = function(options) {
        return this.each(function() {
            
            var el = $(this);
            
            var settings = $.extend({
                interval: 0,
            }, options, el.data());
            
            var slidesWrapper = el.find('.slider-slides');
            var slides = el.find('.slider-slide');
            var btnPrev = el.find('.slider-btn-prev');
            var btnNext = el.find('.slider-btn-next');
            var anchors = el.find('.slider-link');
            var thumbnails = el.find('.slider-thumbnail');
            
            var numSlides = slides.length;
            var slideWidth = Math.floor(slides.outerWidth());
            var current = 0;
            
            // When a button is clicked, the on scroll event must not modify the active elements
            // otherwise the active state jumps around. For example, clicking the 4th anchor
            // when the 1st is active would activate the 4th and then jump back through the
            // 2nd and 3rd as the slider scrolls.
            var freezeScroll = false;
            
            var interval;
            
            // As soon as a user interacts with the slider the animation must cease.
            var stopped = false;
            
            if (settings.interval) {
                startInterval();
                
                el.hover(function() {
                    clearInterval(interval);
                }, function() {
                    if (!stopped) {
                        startInterval();
                    }
                });
            }
            
            slides.on('wheel touchstart', function() {
                stopInterval();
                slides.off('wheel touchstart');
            });
            
            btnPrev.on('click', function() {
                stopInterval();
                current = current <= 0 ? numSlides - 1 : current - 1;
                setActiveElements(true);
            });
            
            btnNext.on('click', function() {
                stopInterval();
                current = current >= numSlides - 1 ? 0 : current + 1;
                setActiveElements(true);
            });
            
            slides.find('img').on('click', function() {
                stopInterval();
                current = current >= numSlides - 1 ? 0 : current + 1;
                setActiveElements(true);
            });
            
            // Apply click events to anchors
            anchors.each(function(key) {
                let anchor = $(this);
                anchor.on('click', function(e) {
                    e.preventDefault();
                    stopInterval();
                    current = key;
                    setActiveElements(true);
                });
            });
            
            // Apply click events to thumbnails
            thumbnails.each(function(key) {
                let thumbnail = $(this);
                thumbnail.on('click', function(e) {
                    e.preventDefault();
                    stopInterval();
                    current = key;
                    setActiveElements(true);
                });
            });
            
            // Update the active anchor as the user scrolls
            slidesWrapper.on('scroll', function() {
                var left = slidesWrapper.scrollLeft();
                var num = Math.floor(left / slideWidth);
                if (!freezeScroll) {
                    current = num;
                    setActiveElements();
                } else if (current === num) {
                    freezeScroll = false;
                }
            });
            
            function setActiveElements(doScroll) {
                anchors.removeClass('active');
                anchors.eq(current).addClass('active');
                
                thumbnails.removeClass('active');
                thumbnails.eq(current).addClass('active');
                
                if (doScroll) {
                    freezeScroll = true;
                    
                    var left = current * slideWidth;
                    slidesWrapper.scrollLeft(left);
                }
            }
            
            function startInterval() {
                if (settings.interval) {
                    interval = setInterval(function() {
                        current = current >= numSlides - 1 ? 0 : current + 1;
                        setActiveElements(true);
                    }, settings.interval);
                }
            }
            
            function stopInterval() {
                stopped = true;
                clearInterval(interval);
            }
        });
    };
})(jQuery);