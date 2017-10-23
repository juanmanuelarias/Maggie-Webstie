scrollHeader();
cardToggle();

function cardToggle() {
    $(window).load(function() {
        $('.post-module').hover(function() {
            $(this).find('.description').stop().animate({
                height: "toggle",
                opacity: "toggle"
            }, 300);
        });
    });
}

function scrollHeader() {
    $(document).on("scroll", function() {
        if ($(document).scrollTop() > 100) {
            $("header").addClass("header-shrink");
            $(".logo").addClass("logo-small");
            $(".navbar-brand").addClass("navbar-brand-small");
        }
        else {
            $("header").removeClass("header-shrink");
            $(".logo").removeClass("logo-small");
            $(".navbar-brand").removeClass("navbar-brand-small");
        }
    });
}
