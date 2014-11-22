//globals
var navCounter = 0;

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

    // $(window).resize(function(){
    //     var title = $('#title').offset().left;
    //     console.log(title);
    // });
});
