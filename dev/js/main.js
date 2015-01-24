//globals
// var navCounter = 0,
var isMobile = false,
$container = $('.vid-iso-container'),
pageTotal = $('.vid-list').data('page-total'),
isSafari = false,
direction,
lastScroll = 0,
winHeight,
winWidth,
docHeight,
currPos,
countDown = 0,
countDownNum = ['5', '4', '3', '2', '1'],
timer,
baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname,
pageIndex = 2;

//if the page is scrolled on refresh this resets the page for the intro animation
$(window).on('beforeunload', function(){
    if(!$('.is-overlay').length && !isMobile){
        $(window).scrollTop(0);
    }
});

$(document).ready(function() {

    if(navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)){
        isMobile = true;
        $('html').addClass('is-mobile');
    }

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf('android') > -1;
    if(isAndroid) {
        $('body').addClass('is-android');
    }

    if($('.intro').length && !isMobile && Modernizr.history){

        $('#top-info-bar').removeClass('in-view');
        $('#bar-nav').css('margin-left', $(this).width() * -1);
        $('#content-wrapper').css('padding-top', $(window).height());
        $('body').css('overflow', 'hidden');

        var $number = $('.number');
        var $intro = $('.intro');

        //film countdown animation
        $(function() {
            filmCountDown();
            function filmCountDown(){
                //console.log(countDownNum[countDown]);
                $number.text(countDownNum[countDown]);
                $intro.toggleClass('black', countDown % 2 === 0);
                timer = setTimeout(function(){
                    if(countDown <= countDownNum.length - 2){
                        countDown++;
                        filmCountDown();
                    }
                    else{
                        $intro.transition({opacity: 0}, 800, 'easeInQuad', function() {
                            $intro.remove();
                            $('#bar-nav').transition({margin: 0}, 800, 'easeInOutExpo', function(){
                                $(this).removeAttr('style');
                                $('#content-wrapper').transition({padding: 0}, 600, 'easeInOutQuart', function(){
                                    $(this).removeAttr('style');
                                    $('#top-info-bar').addClass('in-view');
                                    $('body').removeAttr('style');
                                });
                            });
                        });
                    }
                }, 800);
            }
        });
    }
    else{
        $('.intro').hide();
    }

    function digitalClapBoardClock(){
        var d = new Date();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        var milliseconds = d.getMilliseconds();

        milliseconds = Math.floor(milliseconds * .1);

        if(milliseconds < 10){
            milliseconds = '0' + milliseconds;
        }

        if(seconds < 10){
            seconds = '0' + seconds;
        }

        if(minutes < 10){
            minutes = '0' + minutes;
        }

        if(hours === 0){
            hours = 12;
        }

        if(hours > 12) {
            hours = hours - 12;
        }

        if(hours < 10){
            hours = '0' + hours;
        }

        var $time = $('.time');

        $time.html(hours + ':' + minutes + ':' + seconds + ':' + milliseconds);
    }

    //setInterval(digitalClapBoardClock, 1);
    digitalClapBoardClock();

    $.ajaxSetup ({
        dataType: 'html',
        cache: false
    });

    $('#menu-button[href="#"]').click(function(e) {
        e.preventDefault();
        // navCounter += 1;
        //
        // if(navCounter >= 3){
        //     closeMenu();
        // }
        // else{
        //     openMenu();
        // }

        $('#bar-nav').toggleClass('open');
        if($(window).width() > 768 - 1 && $('#bar-nav').hasClass('open')){
            $('.opacity-overlay').css('display', 'block');
            setTimeout(function() {$('.opacity-overlay').css('opacity', '0.8');}, 200);
            setTimeout(function() {$('.opacity-overlay').toggleClass('active');}, 100);
        }
        else{
            $('.opacity-overlay').removeClass('active');
            $('.opacity-overlay').css('opacity', '0');
            setTimeout(function() {$('.opacity-overlay').css('display', 'none');}, 200);
        }

        if($('.open').length){
            openMenu();
        }
        else{
            closeMenu();
        }

        $('.opacity-overlay').click(function() {
            closeMenu();
            $('#bar-nav').removeClass('open');
            $('.opacity-overlay').css('opacity', '0');
            setTimeout(function() {$('.opacity-overlay').css('display', 'none');}, 200);
            $(this).removeClass('active');
        });
    });

    function openMenu(){
        $('#menu-button span').text('[-]');
        isMobile ? freezeContent() : setTimeout( function() {$('body').css('overflow', 'hidden');}, 400);
        // document.ontouchmove = function(e){ e.preventDefault(); };
    }

    function closeMenu(){
        $('#menu-button span').text('[+]');
        setTimeout(function() {$('.opacity-overlay').removeAttr('style');}, 100);
        if($('.is-overlay, .is-about').length){
            return;
        }
        else{
            if(Modernizr.history && !$('.-overlay-active').length && !$('.-about-active').length){
                isMobile ? unFreezeContent() : setTimeout(function() {$('body').removeAttr('style');}, 400);
            }
        }
        // document.ontouchmove = function(e){ return true; };
    }

    // function openMenu(){
    //     $('#bar-nav').addClass('open');
    //     $('.opacity-overlay').addClass('active');
    //     $('#menu-button span').text('[—]');
    //     setTimeout( function() {
    //         $('body').css('overflow', 'hidden');
    //     }, 400);
    //     document.ontouchmove = function(e){ e.preventDefault(); };
    //     navCounter += 1;
    // }
    //
    // function closeMenu(){
    //     $('#bar-nav').removeClass('open');
    //     $('.opacity-overlay').removeClass('active');
    //     $('#menu-button span').text('[+]');
    //     setTimeout( function() {
    //         $('body').removeAttr('style');
    //     }, 400);
    //     $('#bar-nav').removeClass('open');
    //     document.ontouchmove = function(e){ return true; };
    //     navCounter = 1;
    // }

    $('.filter-mobile-button a[href="#"]').click(function(e) {
        e.preventDefault();
        $('.filter-nav').toggleClass('open');

        if($('.filter-nav').hasClass('open')){
            $(this).text('Filter [—]');
        }
        else{
            $(this).text('Filter [+]');
        }
    });

    function getScrollDirection(){
        var currentScroll = window.pageYOffset;
        if(currentScroll > lastScroll && currentScroll >= 1){
            // console.log('down');
            direction = 'down';
        }
        else if(currentScroll < lastScroll && currentScroll <= (docHeight - winHeight) - 1){
            // console.log('up');
            direction = 'up';
        }

        lastScroll = currentScroll;
        return direction;
    }

    if($('#content-wrapper').length && isMobile){
        var $loadIndicator = $('<div class=\"load-more\"><a href=\"#\">Load More Videos</a></div>');
        $('#content-wrapper').append($loadIndicator);
    }

    $(document).on('click','.load-more a[href="#"]', function(e){
        e.preventDefault();
        infiniteScroll();
        pageIndex++;
    });

    //prevents hover effects on film images while scrolling
    if(!isMobile && !$('.-overlay-active').length && !$('.-about-active').length){
        $(window).scroll($.debounce(250, true, function(){
            $('body').addClass('no-hover');
        }));
        $(window).scroll($.debounce(250, function(){
            $('body').removeClass('no-hover');
        }));
    }

    $(document).scroll(function () {

        winHeight = $(window).height();
        docHeight = $(document).height();

        var infoBarHeight = $('#top-info-bar').outerHeight();
        var filterNavHeight = $('#filter-container').outerHeight();

        currPos = $(window).scrollTop();
        getScrollDirection();

        if(!isMobile && !$('.is-overlay').length){
            if(direction == 'up' && currPos >= (infoBarHeight + filterNavHeight)){
                $('#top-info-bar').addClass('in-view');
            }
            else if(direction == 'down' && currPos >= (infoBarHeight + filterNavHeight)){
                $('#top-info-bar').removeClass('in-view');
            }

            if(currPos === 0){
                $('#top-info-bar').addClass('in-view');
            }
        }

        if(!isMobile && pageIndex <= pageTotal){
            if(currPos == (docHeight - winHeight)){
                if(pageIndex > pageTotal){
                    return false;
                }
                else{
                    infiniteScroll();
                }
                pageIndex++;
            }
        }

    });

    //isotope filtering
    $('.filter-nav ul li a').on( 'click', function(e) {
        e.preventDefault();
        var $currentLink = $(this);
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });

        $('.filter-nav ul li a').not($currentLink).removeClass('active');
        $currentLink.addClass('active');

        if($currentLink.data('filter') == '*'){
            $('.filter-nav ul li a[data-filter="*"]').addClass('active');
        }

        if(!$(filterValue).length){
            getInfiniteElements();
        }
    });

    function getInfiniteElements(){
        var checkPageInterval = setInterval(function(){
            if(pageIndex <= pageTotal){
                infiniteScroll();
            }
            else if(pageIndex === pageTotal){
                clearInterval(checkPageInterval);
                $container.isotope('layout');
            }
            pageIndex++;
        },500);
    }

    var vidHeight,
        vidWidth,
        vidAspect,
        $reelContainer;

    function resizeVideo(){
        $reelContainer = $('.reel-video-container');
        vidHeight = $('.reel-video-container video').height();
        vidWidth = $('.reel-video-container video').width();

        $reelContainer.css({
            'width' : vidWidth / vidHeight * $(window).height(),
            'height' : $(window).height()
        });

        if($reelContainer.width() < $(window).width() * 0.8){
            $reelContainer.css({
                'width' : $(window).width(),
                'height' : vidHeight / vidWidth * $(window).width()
            });
        }
    }

    if($('.-about-default').length){
        resizeVideo();
    }

    $(window).resize(function(){
        resizeVideo();
    });

    // function checkPageBottom(){
    //     var checkPageInterval = setInterval(function(){
    //
    //         if(nextPage){
    //             if(currPos >= (docHeight - winHeight)){
    //                 infiniteScroll();
    //             }
    //         }
    //
    //         if(!nextPage){
    //             clearInterval(checkPageInterval);
    //         }
    //     },100);
    // }

    //infinite scroll

    function infiniteScroll(){

        $('.infinite-scroll-loader').addClass('-loading-active');

        $.ajax({
            url: baseUrl + '/' + 'page-' + pageIndex + '.html',
            dataType: 'html',
            success: function(data) {

                var $newContent;
                $newContent = $(data).find('.vid-iso-grid');

                //the isotope append method
                $container.append($newContent).isotope( 'appended', $newContent, afterLoad());

                function afterLoad(){
                    //relayout isotope
                    setTimeout( function() {
                        $container.isotope('layout');
                    }, 300);

                    setTimeout( function() {
                        $container.isotope('layout');
                    }, 1000);

                    setTimeout( function() {
                        $('.infinite-scroll-loader').removeClass('-loading-active');
                    }, 800);
                }

                if(isMobile){
                    if(pageIndex > pageTotal){
                        $('.load-more').remove();
                    }
                }

            },
            error: function() {
                console.log('infiniteScroll ajax error');
            }
        });
    }

    //film overlay

    var freezeTop;

    if(isMobile && ($('.is-overlay').length || $('.-overlay-default').length || $('.is-about').length || $('.-about-default').length)){
        freezeContent();
    }

    function freezeContent(){
        freezeTop = $(window).scrollTop();

        var contentTop = $('#content-wrapper').offset().top;
        var contentLeft = $('#content-wrapper').offset().left;

        $('#content-wrapper').css({
            'position' : 'fixed',
            'top' : contentTop - freezeTop,
            'left' : contentLeft
        });
    }

    function unFreezeContent(){
        $('#content-wrapper').removeAttr('style');
        $(document).scrollTop(freezeTop);
        $container.isotope('layout');
        $('body').removeAttr('style');
    }

    var History;
    var ajaxLink;
    // var currentTitle;
    var homeTitle = $('#page').data('home-title');
    var addEntry = false;

    if($('.-overlay-default, .-about-default').length){
        $('body').css('overflow', 'hidden');
        $('#top-info-bar').addClass('in-view');
    }

    if(Modernizr.history){

        /*
        * Video Overlay Section
        */

        $(document).on('click','.vid-content a', function(e){
            e.preventDefault();
            if(e.originalEvent !== undefined){
                addEntry = true;
            }
            // currentTitle = document.title;
            // console.log(currentTitle);
            ajaxLink = $(this);
            $('html').addClass('loading');
            if(isMobile){
                $('body').addClass('-loading-icon');
            }
            openOverlay();
        });

        //next prev navigation
        $(document).on('click','.next-prev a', function(e){
            e.preventDefault();
            ajaxLink = $(this);
            if(e.originalEvent !== undefined){
                addEntry = true;
            }
            $('html').addClass('loading');
            if(isMobile){
                $('body').addClass('-loading-icon');
            }
            $('.film-overlay-content').transition({
                opacity: 0,
                duration: 200,
                complete: function() {
                    loadVideo(ajaxLink);
                }
            });
        });

        var homeLink;

        //overlay close
        $(document).on('click', '#overlay-close, #overlay-close-mobile', function(e){
            e.preventDefault();
            homeLink = $(this);
            closeOverlay(homeLink);
            if(e.originalEvent !== undefined){
                addEntry = true;
            }
        });

        function openOverlay(){
            $('html').addClass('is-overlay');
            $('.film-ajax-container').addClass('-overlay-active');
            $('.film-ajax-container').transition({
                scale: 1,
                complete: function() {
                    loadVideo(ajaxLink);
                }
            });
            $('#top-info-bar').addClass('in-view');
            setTimeout( function() {
                $('body').css('overflow', 'hidden');
            }, 600);
            if(isMobile && ($('.is-overlay').length || $('.-overlay-default').length)){
                freezeContent();
            }
        }

        function closeOverlay(url){
            $('#top-info-bar').removeAttr('style');
            $('.film-overlay-content').transition({
                opacity: 0,
                duration: 200,
                complete: function() {

                    if(!$('.is-about').length){
                        removeVideo(url);
                    }
                    else{
                        $('.hide-scroll-outer').remove();
                    }

                    $('#overlay-close').transition({ top: -30}, 250, 'ease-out', function() {
                        $('html').removeClass('is-overlay');
                        $('#overlay-close').removeAttr('style');
                        $('.film-ajax-container').removeAttr('style');
                        if($('.-overlay-default').length){
                            $('#page').removeClass('-overlay-default');
                        }
                        if($('.is-about').length){
                            $('.about-container').addClass('-about-active');
                        }
                        setTimeout( function() {
                            $('body').removeAttr('style');
                        }, 200);
                        if(isMobile){
                            unFreezeContent();
                        }
                        $('.film-ajax-container').removeClass('-overlay-active');
                        setTimeout( function() {
                            if($('.is-about').length){
                                openAbout(ajaxLink);
                            }
                        }, 250);
                    });
                }
            });
        }

        /*
        * About Section
        */

        $(document).on('click', '#main-menu #about', function(e){
            e.preventDefault();
            if(!$('.is-about').length){
                ajaxLink = $(this);
                if(e.originalEvent !== undefined){
                    addEntry = true;
                }

                $('html').addClass('is-about');
                $('html').addClass('loading');
                if(isMobile){
                    $('body').addClass('-loading-icon');
                }

                //close the menu
                closeMenu();
                $('#bar-nav').removeClass('open');
                $('.opacity-overlay').css('opacity', '0');
                setTimeout(function() {$('.opacity-overlay').css('display', 'none');}, 200);
                $('.opacity-overlay').removeClass('active');

                setTimeout(function() {

                    //if overlay film is active
                    if($('.is-overlay').length || $('.-overlay-default').length){
                        closeOverlay();
                    }
                    else{
                        openAbout(ajaxLink);
                    }
                }, 400);
                if(isMobile && ($('.is-about').length || $('.-about-default').length)){
                    freezeContent();
                }
            }
        });

        function openAbout(url){
            $('.about-container').addClass('-about-active');
            $('.about-container').transition({
                bottom: 0,
                duration: 600,
                easing: 'easeOutExpo',
                complete: function() {

                    loadAbout(url);

                    $('body').css('overflow', 'hidden');
                    $(this).addClass('-about-active');

                    if(isMobile){
                        unFreezeContent();
                    }

                    if(!$('#top-info-bar').hasClass('in-view')){
                        $('#top-info-bar').addClass('in-view');
                    }
                }
            });
        }

        function closeAbout(url){
            $('.reel-content').transition({
                opacity: 0,
                duration: 600,
                easing: 'easeOutExpo',
                complete: function() {
                    $('.about-container').transition({
                        bottom: '-100%',
                        duration: 600,
                        easing: 'easeOutExpo',
                        complete: function() {
                            if(addEntry){
                                History.pushState({_index: History.getCurrentIndex()}, homeTitle, url.attr('href'));
                            }
                            $('.reel-content').remove();
                            $('html').removeClass('is-about');
                            $('body').removeAttr('style');
                            $('.about-container').removeClass('-about-active');
                            addEntry = false;
                        }
                    });
                }
            });
        }

        /*
         * Home Title Close
        */

        $('#title').on('click', function(e){
            e.preventDefault();
            homeLink = $(this);
            if(e.originalEvent !== undefined){
                addEntry = true;
            }
            if($('.is-overlay').length || $('.-overlay-default').length){
                closeOverlay(homeLink);
            }
            else if($('.is-about').length || $('.-about-default').length){
                closeAbout(homeLink);
            }
        });

        /*
        * Load Events
        */

        History = window.History;

        function loadVideo(url){

            $('.film-ajax-container').load(url.attr('href') + ' .hide-scroll-outer', function(response) {
                String.prototype.decodeHTML = function() {
                    return $("<div>", {html: '' + this}).html();
                }

                var newTitle = response.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML().replace(/&amp;/g, '&');

                if(addEntry){
                    History.pushState({_index: History.getCurrentIndex()}, newTitle, url.attr('href'));
                }

                $('.film-overlay-content').transition({
                    opacity: 1,
                    duration: 600,
                    easing: 'easeInQuint',
                    complete: function() {
                        if(isMobile){
                            $('body').removeClass('-loading-icon');
                        }
                        $('.hide-scroll-inner').css('overflow-y', 'scroll');
                        $('html').removeClass('loading');
                    }
                });

                addEntry = false;
            });
        }

        function removeVideo(url){
            if(addEntry && !$('.is-about').length){
                History.pushState({_index: History.getCurrentIndex()}, homeTitle, url.attr('href'));
            }
            $('.hide-scroll-outer').remove();
            addEntry = false;
            //document.title = currentTitle;
            //document.title = homeTitle;
        }

        //load about content
        function loadAbout(url){
            $('.about-container').load(url.attr('href') + ' .reel-content', function(response) {
                String.prototype.decodeHTML = function() {
                    return $("<div>", {html: '' + this}).html();
                }

                var newTitle = response.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML();

                if(addEntry){
                    History.pushState({_index: History.getCurrentIndex()}, newTitle, url.attr('href'));
                }

                if(!isMobile){
                    resizeVideo();
                }
                else{
                    $('html').find('video').remove();
                }

                //wait until the video loads to fade in the content
                var checkReadyState = setInterval(function(){
                    if(document.getElementById('reel-video').readyState === 4){
                        clearInterval(checkReadyState);
                        $('.reel-content').transition({
                            opacity: 1,
                            duration: 600,
                            easing: 'easeInQuint',
                            complete: function() {
                                if(isMobile){
                                    $('body').removeClass('-loading-icon');
                                }
                                $('html').removeClass('loading');
                            }
                        });
                    }
                    else{
                        return;
                    }
                },500);

                addEntry = false;
            });
        }

        //history
        History.Adapter.bind(window,'statechange',function(){
            var State = History.getState();

            //prevents statechange from immediately running after a popstate event
            var currentIndex = History.getCurrentIndex();
            var internalLink = (History.getState().data._index == (currentIndex - 1));
            if (!internalLink) {
                console.log(State.url);
                if($('.is-overlay').length){
                    $(document).find('.film-ajax-container a[href$="' + State.url + '"]').trigger('click');
                }
                else{
                    $(document).find('a[href$="' + State.url + '"]').trigger('click');
                }
            }
        });

    }//end of Modernizr.History
});

$(window).load(function() {
    //isotope
    $container.isotope({
        itemSelector: '.vid-iso-grid',
        transitionDuration: '0.2s',
        masonry: {
            columnWidth: '.vid-iso-grid'
        }
    });
});
