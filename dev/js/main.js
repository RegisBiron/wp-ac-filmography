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
pageIndex = 2,
nextPage;

if(navigator.userAgent.match(/(android|iphone|ipad|blackberry|symbian|symbianos|symbos|netfront|model-orange|javaplatform|iemobile|windows phone|samsung|htc|opera mobile|opera mobi|opera mini|presto|huawei|blazer|bolt|doris|fennec|gobrowser|iris|maemo browser|mib|cldc|minimo|semc-browser|skyfire|teashark|teleca|uzard|uzardweb|meego|nokia|bb10|playbook)/gi)){
    isMobile = true;
}

$(document).ready(function() {

    nextPage = $('.vid-list').data('next-page');
    checkPageBottom();

    $('#menu-button[href="#"]').click(function(e) {
        e.preventDefault();
        navCounter += 1;

        //navigation logic is based on an index because firefox cancels the menu transition when overflow:hidden is added to the body element
        if(navCounter >= 3){
            navCounter = 1;
            $('#bar-nav').removeClass('open');
            $('.opacity-overlay').removeClass('active');
            $('#menu-button span').text('[+]');
            setTimeout( function() {
                $('body').removeAttr('style');
            }, 400);
            $('#bar-nav').removeClass('open');
            document.ontouchmove = function(e){ return true; }
        }
        else{
            $('#bar-nav').addClass('open');
            $('.opacity-overlay').addClass('active');
            $('#menu-button span').text('[—]');
            setTimeout( function() {
                $('body').css('overflow', 'hidden');
            }, 400);
            document.ontouchmove = function(e){ e.preventDefault(); }
            navCounter += 1;
        }
    });

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


        $(document).scroll(function () {

            winHeight = $(window).height();
            docHeight = $(document).height();

            var infoBarHeight = $('#top-info-bar').outerHeight();
            var filterNavHeight = $('#filter-container').outerHeight();

            currPos = $(window).scrollTop();
            getScrollDirection();

            if(!isMobile){
                if(direction == 'up' && currPos >= (infoBarHeight + filterNavHeight)){
                    $("#top-info-bar").addClass('in-view');
                }
                else if(direction == 'down' && currPos >= (infoBarHeight + filterNavHeight)){
                    $("#top-info-bar").removeClass('in-view');
                }

                if(currPos === 0){
                    $("#top-info-bar").addClass('in-view');
                }
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


    function checkPageBottom(){
        var checkPageInterval = setInterval(function(){

            if(nextPage){
                if(currPos >= (docHeight - winHeight)){
                    infiniteScroll();
                }
            }

            if(!nextPage){
                clearInterval(checkPageInterval);
            }
        },100);
    }

    function infiniteScroll(){

        // console.log('bottom');

        $.ajax('http://0.0.0.0:9000/page-' + pageIndex + '.html', {
            dataType: 'html',
            success: function(data) {

                var $newContent,
                    $pageValid;

                $newContent = $(data).find('.vid-iso-grid');

                //data is set to a boolean on the containing isotope element in the ajaxed page
                $pageValid = $(data).find('.vid-list').data('next-page');

                //the isotope append method
                $container.append($newContent).isotope( 'appended', $newContent, afterLoad());

                function afterLoad(){

                    //this is for safari
                    setTimeout( function() {
                        $container.isotope('layout');
                    }, 100);
                }

                nextPage = $pageValid;
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
