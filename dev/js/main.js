//globals
var navCounter = 0;
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
        navCounter += 1;

        if(!$('.open').length){
            $('#menu-button span').text('[—]');
        }
        else{
            $('#menu-button span').text('[+]');
            navCounter += 1;
        }

        if(navCounter >= 3){
            navCounter = 1;
            $('#bar-nav').removeClass('open');
            $('.opacity-overlay').removeClass('active');
        }
        else{
            $('#bar-nav').addClass('open');
            $('.opacity-overlay').addClass('active');
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
        currPos = $(window).scrollTop();
        getScrollDirection();
        if(direction == 'up' && currPos >= 60){
            $("#top-info-bar").addClass('in-view');
        }
        else if(direction == 'down' && currPos >= 60){
            $("#top-info-bar").removeClass('in-view');
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
