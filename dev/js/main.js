//globals
// var navCounter = 0,
var isMobile = false,
direction,
lastScroll = 0,
winHeight,
docHeight,
currPos,
countDown = 0,
countDownNum = ['5', '4', '3', '2', '1'],
timer,
baseUrl = window.location.protocol + '//' + window.location.host,
pageIndex = 2;

$(document).ready(function() {

    $('.test').transition({ height: 0 }, 250, "easeInOutCubic", function(){

    });

    if(navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)){
        isMobile = true;
    }

    var easeInOut = "ease-in-out";
    if(!Modernizr.csstransitions)
        {
            $.fn.transition = $.fn.animate;
            easeInOut = "easeInOutQuint";
        }

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
        $('.opacity-overlay').toggleClass('active');

        if($('.open').length){
            openMenu();
        }
        else{
            closeMenu();
        }

        $('.opacity-overlay').click(function() {
            closeMenu();
            $('#bar-nav').removeClass('open');
            $('.opacity-overlay').removeClass('active');
        });
    });

    function openMenu(){
        $('#menu-button span').text('[-]');
        setTimeout( function() {
            $('body').css('overflow', 'hidden');
        }, 400);
        document.ontouchmove = function(e){ e.preventDefault(); };
    }

    function closeMenu(){
        $('#menu-button span').text('[+]');
        if($('.is-overlay').length){
            return;
        }
        else{
            setTimeout( function() {
                $('body').removeAttr('style');
            }, 400);
        }
        document.ontouchmove = function(e){ return true; };
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
        var $loadIndicator = $('<div class=\"load-indicator\"><p>&uarr; Pull Up To Load More</p></div>');
        $('#content-wrapper').append($loadIndicator);
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

        if(pageIndex <= pageTotal){
            if(currPos == (docHeight - winHeight)){
                infiniteScroll();
            }
        }
        else{
            if($('.load-indicator').length){
                $('.load-indicator').remove();
            }
            return;
        }

    });

    //isotope
    var $container = $('.vid-iso-container').isotope({
        itemSelector: '.vid-iso-grid',
        transitionDuration: '0.2s',
        masonry: {
            columnWidth: '.vid-iso-grid'
        }
        // getSortData: {
        //     category: '[data-category]'
        // }
    });

    //isotope filtering
    $('.filter-nav ul li a').on( 'click', function(e) {
        e.preventDefault();
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
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
    var pageTotal = $('.vid-list').data('page-total');

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
                    }, 100);

                    setTimeout( function() {
                        $('.infinite-scroll-loader').removeClass('-loading-active');
                    }, 500);
                }

                pageIndex++;

            },
            error: function() {
                console.log('infiniteScroll ajax error');
            }
        });
    }

    //film overlay
    var ajaxLink;
    var currentTitle;

    $(document).on('click','.vid-content a', function(e){
        e.preventDefault();
        currentTitle = document.title;
        ajaxLink = $(this);
        $('html').addClass('loading');
        openOverlay();
    });

    $('#overlay-close').on('click', function(e){
        e.preventDefault();
        closeOverlay();
    });

    $('#title').on('click', function(e){
        e.preventDefault();
        if($('.is-overlay').length){
            closeOverlay();
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
    }

    function closeOverlay(){
        $('.film-overlay-content').transition({
            opacity: 0,
            duration: 400,
            complete: function() {
                $('html').removeClass('is-overlay');
                $('.film-ajax-container').removeAttr('style');
                $('.film-ajax-container').removeClass('-overlay-active');
                removeVideo();
                setTimeout( function() {
                    $('body').removeAttr('style');
                }, 200);
            }
        });
    }

    //load video overlay
    var History;

    if (history.pushState) {
        History = window.History;

        function loadVideo(url){
            History.pushState('','', url.attr('href'));

            String.prototype.decodeHTML = function() {
                return $("<div>", {html: '' + this}).html();
            }

            $('.film-ajax-container').load(url.attr('href') + ' .film-overlay-content', function(response) {
                document.title = response.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML();
                $('.film-overlay-content').transition({ opacity: 1 }, 400, "easeInOutQuint");
                $('html').removeClass('loading');
            });
        }

        function removeVideo(){
            History.pushState('','', '/');
            $('.film-overlay-content').remove();
            document.title = currentTitle;
        }
    }

    //history
    if (history.pushState) {
        History.Adapter.bind(window,'statechange',function(){
            var State = History.getState();
            $(document).find('a[href$="' + State.url + '"]').trigger('click');
        });
    }

    //film countdown animation
    // $(function() {
    //     filmCountDown();
    //     function filmCountDown(){
    //         console.log(countDownNum[countDown]);
    //             timer = setTimeout(function() {
    //             if(countDown <= countDownNum.length - 2){
    //                 countDown++;
    //                 filmCountDown();
    //             }
    //         }, 1000);
    //     }
    // });

    // $(window).resize(function(){
    //     var title = $('#title').offset().left;
    //     console.log(title);
    // });
});
