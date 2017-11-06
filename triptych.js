
    var externalTriptych = (function(w, $) {

        var config;

        function loadTriptych() {

            config = triptych.vars;

            console.log(config)

            //pDoc.body.className += ' parallax-initialised';

            //createCenterSlot();

        }


        function createCenterSlot() {

            if(!initialised) {

                /**
                 * Get the current page type
                 */
                var pageType = pWindow.ipcTags.type,
                    elements;

                /**
                 * Check to see the page type
                 */
                if(pageType === 'homepage' ||  pageType === 'staticpage') {

                    elements = $('.container-fluid section:not(".subsection")');

                } else if(pageType === 'article' ||  pageType === 'review' ||  pageType === 'core_review'  ||  pageType === 'roundup') {

                    elements = $('.post-main .articleBody > *');

                }else if( pageType === 'landingpage' && $('.archive-list').hasClass('showcase') ) {

                    elements = $('.archive-list .gallery-entry');

                }else if( pageType === 'landingpage' && !$('.archive-list').hasClass('showcase') ) {

                    elements = $('.archive-list section:not(".subsection")');

                }

                /**
                 * - Get the number of elements
                 * - Get the middle point
                 * - Get the element in the middle
                 * - Get the section directly after the middle element
                 */
                var elementsLength = elements.length,
                    half = Math.round(elementsLength / 2),
                    insertElement = elements.eq(half),
                    nextElement = insertElement.next();

                /**
                 * - If the next element is a sidebar widget, move to the next element
                 */
                if(pageType === 'homepage' && nextElement.hasClass('keystone-premium-sidebar-widget')) {

                    insertElement = insertElement.prev();

                }

                /**
                 * - Insert the middle Triptych element directly before the chosen element
                 */
                if($('.parallax-wrapper--middle').length == 0) {
                    
                    $( '<div class="parallax-wrapper parallax-wrapper--middle col-xs-jumbo ad-anchor"></div>' ).insertBefore( insertElement );

                }

                pWindow.stickyBlocks.getAnchorPoints();

                initialised = true;

                injectContent();

            }

        }

        function injectContent() {

            $(slotClass).each(function(index) {

                var name = pConfig['slots'][index]['name'],
                    image = pConfig['slots'][index]['image'],
                    link = pConfig['slots'][index]['link'],
                    backgroundColor = pConfig['slots'][index]['background-color'],
                    video = pConfig['video']['videoMP4'];

                var parallaxHTML = '<a href="' + link + '" target="_blank" data-slot="'+name+'" class="parallax-link" style="background-image:url(' + image + ')"></a>';

                if(index === 1 && video !== '') {

                    var videoMP4 = pConfig['video']['videoMP4'],
                        videoOGG = pConfig['video']['videoOGG'],
                        videoImage = pConfig['video']['cover-image'],
                        videoSound = pConfig['video']['sound'],
                        videoFullscreen = pConfig['video']['fullscreen'],
                        videoClass = 'parallax-video';

                    if(videoFullscreen === 'Yes') {
                        videoClass += ' parallax-video--fullscreen';
                    }

                    parallaxHTML = '<a href="' + link + '" target="_blank" data-slot="'+name+'" class="parallax-link" style="background-image:url(' + image + ')" class="parallax-video">';
                        parallaxHTML += '<div class="' + videoClass + '">';
                            parallaxHTML += '<video class="parallax-video__element" width="600" height="338" controls muted="'+videoSound+'" poster="'+videoImage+'">';
                                parallaxHTML += '<source src="'+videoMP4+'" type="video/mp4" />';
                                parallaxHTML += '<source src="'+videoOGG+'" type="video/ogg" />';
                            parallaxHTML += '</video>';
                        parallaxHTML += '</div>';
                    parallaxHTML += '</a>';

                }

                $(this).html(parallaxHTML).css('background-color',backgroundColor);

            });

            setTrackingListener();

        }

        function setTrackingListener() {

            var playing = false;

            // Load
            trackEvent('Premium Triptych', pConfig.campaign ,'Loaded');

            // Links
            $('body').on('click', '.parallax-link', function(e){

              // Removed JavaScript method of launching link to enable new tab without the browser blocking it.
              // e.preventDefault(); 

                var slotName = $(this).attr('data-slot'),
                    slotLink = $(this).attr('href');

                trackEvent('Premium Triptych', pConfig.campaign ,'Image Click Through - ' + slotName + ' slot');

            });

            // Video paused
            $('.parallax-video__element').bind('stop pause', function(e) {

                trackEvent('Premium Triptych', pConfig.campaign ,'Video - Paused');

            });

            $(pWindow).on('scroll', function(){

                if($('.parallax-video__element').length) {

                    if ( checkVisible($('.parallax-video__element')) && playing === false ) {

                        $('.parallax-video__element')[0].play();

                        trackEvent('Premium Triptych', pConfig.campaign ,'Video - Played');

                        playing = true;

                    } else if ( !checkVisible($('.parallax-video__element')) && playing === true ) {

                    
                        $('.parallax-video__element')[0].pause();

                        trackEvent('Premium Triptych', pConfig.campaign ,'Video - Paused');

                        playing = false;

                    }

                }

            });

            $(pWindow).on('resize', function(){

                var windothWidth = $(pWindow).width();

                if(windothWidth < 620) {

                    $('.parallax-video__element')[0].pause();

                }

            });

        }



        function checkVisible( elm, evalType ) {
            evalType = evalType || "visible";

            var vpH = $(pWindow).height(),
                st = $(pWindow).scrollTop(),
                y = $(elm).offset().top,
                elementHeight = $(elm).height();

            if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
            if (evalType === "above") return ((y < (vpH + st)));
        }



        function trackEvent(name, event, label) {

            if (typeof pWindow.ipc === 'object' && typeof pWindow.ipc.analytics === 'object') {
        
                pWindow.ipc.analytics.trackEvent({'category': name, 'action': event, 'label': label});
      
            } else if (typeof pWindow.ipc === 'object' && typeof pWindow.ipc.utils === 'object') {
                
                pWindow.ipc.utils.trackEvent(name, event, label);
        
            } else {
            
                return false;
            }

        }

        

        function init() {

            if (pWindow.jQuery) {
                $ = pWindow.jQuery;
                return loadTriptych();
            }

            setTimeout(init, 100);

        }

        setTimeout(init, 100);

     })(this, jQuery);

    externalTriptych.init();

