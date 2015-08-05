/*---LEFT BAR ACCORDION----*/

$('.tooltips').tooltip();

var Script = function () {



// widget tools

    $('.panel .tools .fa-chevron-down').click(function () {
        var el = jQuery(this).parents(".panel").children(".panel-body");
        if (jQuery(this).hasClass("fa-chevron-down")) {
            jQuery(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
            el.slideUp(200);
        } else {
            jQuery(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
            el.slideDown(200);
        }
    });

    $('.panel .tools .fa-times').click(function () {
        jQuery(this).parents(".panel").parent().remove();
    });




}();