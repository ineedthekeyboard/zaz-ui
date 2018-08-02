(function ($) {
    $.maxZIndex = function () {
        var maxZ = Math.max.apply(null, $.map($('*'), function (e) {
            var $e = $(e),
                position = $e.css('position');
            if (position === 'absolute' || position === 'fixed') {
                return parseInt($e.css('z-index')) || 1;
            }
        }));
        return (maxZ === -Infinity) ? 1000 : (maxZ + 1);
    };
})(jQuery);