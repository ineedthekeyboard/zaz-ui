define([
    'jquery'
], function (
    $
) {
    "use strict";

    $.fn.hasAttr = function (attr) {
        var hasAttr = false;
        if ($.type(this.attr(attr)) !== "undefined" && this.attr !== false) {
            hasAttr = true;
        }
        return hasAttr;
    };
    
    return $.fn.hasAttr;
});