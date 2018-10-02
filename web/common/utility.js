define([
    'jquery'
], function ($) {
    return {
        //enable keyboard right left up and down key loop on given child controls for a parent control
        setKeyLoop: function ($parent, $child, blnTabIndex) {
            $parent.off('keyup');
            $parent.on('keyup', function (e) {
                var items = $parent.find($child),
                    item = $parent.find(':focus'),
                    pos;

                switch (e.keyCode) {
                    case $.ui.keyCode.LEFT:
                        e.preventDefault();

                        pos = items.index(item) - 1;
                        if (pos > -1) {
                            if (blnTabIndex) {
                                $(items[pos]).attr('tabindex', 0);
                            }
                            $(items[pos]).focus();
                        } else {
                            if (blnTabIndex) {
                                items.last().attr('tabindex', 0);
                            }
                            items.last().focus();
                        }
                        break;
                    case $.ui.keyCode.RIGHT:
                        e.preventDefault();

                        pos = items.index(item) + 1;
                        if (pos < items.length) {
                            if (blnTabIndex) {
                                $(items[pos]).attr('tabindex', 0);
                            }
                            $(items[pos]).focus();
                        } else {
                            if (blnTabIndex) {
                                items.first().attr('tabindex', 0);
                            }
                            items.first().focus();
                        }
                        break;
                    default:
                        break;

                }
            });
        }
    };


});