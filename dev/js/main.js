//globals
// var navCounter = 0;
var direction;
var lastScroll = 0;
var winHeight = $(window).height();
var docHeight = $(document).height();
var countDown = 0;
var countDownNum = ['5', '4', '3', '2', '1'];
var timer;

$(document).ready(function() {

    $('#menu-button[href="#"]').click(function(e) {
        e.preventDefault();
        // navCounter += 1;

        $('#bar-nav').toggleClass('open');
        $('.opacity-overlay').toggleClass('active');

        if($('.open').hasClass('open')){
            $('#menu-button span').text('[—]');
        }
        else{
            $('#menu-button span').text('[+]');
            // navCounter += 1;
        }

        // if(navCounter >= 3){
        //     navCounter = 1;
        //     $('#bar-nav').removeClass('open');
        //     $('.opacity-overlay').removeClass('active');
        // }
        // else{
        //     $('#bar-nav').addClass('open');
        //     $('.opacity-overlay').addClass('active');
        // }
    });

    $('.filter-mobile-button a[href="#"]').click(function(e) {
        e.preventDefault();
        $('.filter-nav').toggleClass('open');

        if($('.filter-nav').hasClass('open')){
            $(this).text('Filter [—]');
        }
        else{
            $(this).text('Filter [+]');
            // navCounter += 1;
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
        var currPos;
        var infoBarHeight = $('#top-info-bar').outerHeight();
        var filterNavHeight = $('#filter-container').outerHeight();

        currPos = $(window).scrollTop();
        getScrollDirection();

        if(direction == 'up' && currPos >= (infoBarHeight + filterNavHeight)){
            $("#top-info-bar").addClass('in-view');
        }
        else if(direction == 'down' && currPos >= (infoBarHeight + filterNavHeight)){
            $("#top-info-bar").removeClass('in-view');
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
