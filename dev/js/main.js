//globals
var navCounter = 0,
isMobile = false,
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

    $.ajaxSetup ({
        dataType: 'html',
        cache: false
    });

    $('#menu-button[href="#"]').click(function(e) {
        e.preventDefault();
        navCounter += 1;

        //navigation logic is based on an index because firefox cancels the menu transition when overflow:hidden is added to the body element
        if(navCounter >= 3){
            closeMenu();
        }
        else{
            openMenu();
        }

        $('.opacity-overlay').click(function() {
            closeMenu();
            navCounter = 1;
        });
    });

    function openMenu(){
        $('#bar-nav').addClass('open');
        $('.opacity-overlay').addClass('active');
        $('#menu-button span').text('[—]');
        setTimeout( function() {
            $('body').css('overflow', 'hidden');
        }, 400);
        document.ontouchmove = function(e){ e.preventDefault(); };
        navCounter += 1;
    }

    function closeMenu(){
        $('#bar-nav').removeClass('open');
        $('.opacity-overlay').removeClass('active');
        $('#menu-button span').text('[+]');
        setTimeout( function() {
            $('body').removeAttr('style');
        }, 400);
        $('#bar-nav').removeClass('open');
        document.ontouchmove = function(e){ return true; };
        navCounter = 1;
    }

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

        if(!isMobile){
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
