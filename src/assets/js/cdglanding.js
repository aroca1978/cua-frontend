$(document).ready(function() {
    "use strict";


    /**********************\
    // Loader template
    /************************/
    $(window).on('load', function() {
        $('#loader').fadeOut('fast', function() {
            $(this).remove();
        });
    });


    function isValidEmailAddress(emailAddress) {
        var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(emailAddress);
    };

    /**********************\
     // nice select init
    /************************/
    $('select').niceSelect();


    /**********************\
    // form validator  
    /************************/
    $('form').validator();

    /**********************\
    // Theme scripts  
    /************************/
    $('.main-nav .nav-link').on('click', function() {
        $('.navbar-collapse').removeClass("show");
    });


    /**********************\
    // Smooth Scrolling
    /************************/
    $('.scrolling').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 75
        }, 1000);
        event.preventDefault();
    });


    /**********************\
    /// Fix nav top 
    /************************/
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 5) {
            $('.site-header').addClass('navbar-fixed-top');
        } else {
            $('.site-header').removeClass('navbar-fixed-top');
        }
    });



    /**********************\
    /// Scroll to top
    /************************/
    $(window).scroll(function() {

        if ($(this).scrollTop() > (($('#features').offset().top - 300) + ($('#features').outerHeight()) - ($(window).height()))) {

            $('.scroll-top').addClass('active');

        } else {
            $('.scroll-top').removeClass('active');
        }

    });
    $('.scroll-top').on('click', function() {
        $("html, body").animate({
            scrollTop: 0
        }, 600);
        return false;
    });



    /**********************\
    // parallax init
    /************************/
    $('.parallax-bg, #page-intro').parallax("50%", 0.5);





    /**********************\
    // wow init
    /************************/
    new WOW().init();



    /**********************\
    // screenshots-gallery
    /************************/
    $('.screenshots-gallery').magnificPopup({
        delegate: 'a',
        type: 'image',
        closeOnContentClick: false,
        closeBtnInside: false,
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        gallery: {
            enabled: true
        },
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
                return element.find('img');
            }
        }

    });

    $('.popup-video').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false,
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
                return element.find('img');
            }
        }
    });






});


function init_plugins() {
    $(function() {
        "use strict";
        $(function() {
            $('#loader').fadeOut('fast', function() {
                $(this).remove();
            });
        });
    });
}