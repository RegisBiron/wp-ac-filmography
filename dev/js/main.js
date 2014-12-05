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

    if(navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)){
        isMobile = true;
    }

    //set baseURL for now, remove in wp
    $('#title').attr('href', baseUrl + '/');

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
        if(!isMobile){
            $('.opacity-overlay').css('z-index', '40');
            setTimeout(function() {$('.opacity-overlay').toggleClass('active');}, 100)
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
            $(this).removeClass('active');
            setTimeout(function() {$(this).removeAttr('style');}, 100);

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
        if($('.is-overlay').length){
            return;
        }
        else{
            isMobile ? unFreezeContent() : setTimeout(function() {$('body').removeAttr('style');}, 400);
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
        },500);
    }

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

    var freezeTop;

    if(isMobile && ($('.is-overlay').length || $('.-overlay-default').length)){
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
    }

    var History;
    var ajaxLink;
    // var currentTitle;
    var homeTitle = $('#page').data('home-title');

    if($('.-overlay-default').length){
        $('body').css('overflow', 'hidden');
        $('#top-info-bar').addClass('in-view');
    }

    $(document).on('click','.vid-content a', function(e){
        e.preventDefault();
        // currentTitle = document.title;
        // console.log(currentTitle);
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
        if($('.is-overlay').length || $('.-overlay-default').length){
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
                $('#top-info-bar').css('background', 'none');
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

    function closeOverlay(){
        $('#top-info-bar').removeAttr('style');
        $('.film-overlay-content').transition({
            opacity: 0,
            duration: 400,
            complete: function() {
                $('html').removeClass('is-overlay');
                $('.film-ajax-container').removeAttr('style');
                $('.film-ajax-container').removeClass('-overlay-active');
                removeVideo();
                if($('.-overlay-default').length){
                    $('#page').removeClass('-overlay-default');
                }
                setTimeout( function() {
                    $('body').removeAttr('style');
                }, 200);
                if(isMobile){
                    unFreezeContent();
                }
            }
        });
    }

    //load video overlay
    History = window.History;

    function loadVideo(url){
        History.pushState({_index: History.getCurrentIndex()},'', url.attr('href'));

        String.prototype.decodeHTML = function() {
            return $("<div>", {html: '' + this}).html();
        }

        $('.film-ajax-container').load(url.attr('href') + ' .film-overlay-wrapper', function(response) {
            document.title = response.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML();
            $('.film-overlay-content').transition({ opacity: 1 }, 400, 'easeInOutQuint');
            $('html').removeClass('loading');
        });
    }

    function removeVideo(){
        History.pushState({_index: History.getCurrentIndex()},'', '/');
        $('.film-overlay-wrapper').remove();
        // document.title = currentTitle;
        document.title = homeTitle;
    }

    //history
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        //prevents statechange from immediately running after a popstate event
        var currentIndex = History.getCurrentIndex();
        var internalLink = (History.getState().data._index == (currentIndex - 1));
        if (!internalLink) {
            console.log(State);
            $(document).find('a[href$="' + State.url + '"]').trigger('click');
        }
    });

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
