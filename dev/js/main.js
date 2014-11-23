//globals
var navCounter = 0;
var direction;
var lastScroll = 0;
var winHeight = $(window).height();
var docHeight = $(document).height();

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
        }
        else{
            $('#bar-nav').addClass('open');
        }
    });

    function getScrollDirection(){
        var currentScroll = window.pageYOffset;
        if(currentScroll > lastScroll && currentScroll >= 1){
            // console.log('down');
        }
        else if(currentScroll < lastScroll && currentScroll <= (docHeight - winHeight) - 1){
            // console.log('up');
        }

        lastScroll = currentScroll;
    }

    // $(document).scroll(function () {
    //     getScrollDirection();
    // });

    // $(window).resize(function(){
    //     var title = $('#title').offset().left;
    //     console.log(title);
    // });
});
