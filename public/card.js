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
        }
        else {
            $("header").removeClass("header-shrink");
        }
    });
}
