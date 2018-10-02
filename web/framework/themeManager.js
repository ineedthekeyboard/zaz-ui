define([
    'jquery.plugins'
], function ($) {

    /**
     * @namespace themeManager
     * @classdesc Write styles to DOM as style tag with class="theme_001"
     * @description This is meant for browsers that do not support CSS Variable
     */
    var themeManager = {

        /**
         * @description Injects style tag into DOM
         * @memberof themeManager
         * @param themeColor {String} 
         */
        setStyles: function (themeColor) {
            var $themeStyles,
                arrStyles = [],
                colorStyles,
                colorStyles08,
                rgbStyles,
                borderStyles,
                rgbaBorderStyles04,
                rgbaStyles02,
                rgbaStyles04,
                rgbaStyles06,
                rgbaStyles08;

            document.body.style.setProperty('--theme-color', themeColor);

            if (!window.isOldIE) {
                return true;
            }

            if (!$('style[class=theme_001]').length) {
                $('head').append('<style class="theme_001"></style>');
            }
            $themeStyles = $('style[class=theme_001]');

            colorStyles = [
                '.__header .__mainbar .title span.ui',
                '.__layout .zone .panel .tabcontrols .tabs .tab.active i',
                '.gadget .controls .message',
                '.gadget .controls .controls-bar > .knobs .knob i'
            ];

            colorStyles08 = [
                '.knobs .knob:hover i', 
                '.knobs .knob:focus i',
                '.knobs .knob.active i'
            ];

            rgbStyles = [
                '.__header',
                '.gadget .controls .filters .filter.active',
                '.gadgetmenu .items .area .area-container .highlight:hover',
                '.gadgetmenu .items .area .area-container .highlight:focus',
                '.zone .zone-meta .meta-gadgets .meta-gadget',
                '.compare .content .content-item .content-title',
                '.zaz-overlay .zaz-overlay-header',
                '.__layout .zone .zone-close i'
            ];

            borderStyles = [
                '.__layout[data-tab="flat"] .zone .panel .container'
            ];

            rgbaBorderStyles04 = [
            ];

            rgbaStyles02 = [
                '.__layout',
                '.gadgetmenu .items .area .area-container .highlight',
                '.zaz-grid tbody tr:nth-child(even)',
                '.zaz-grid tbody td.moving .cell',
                '[data-mobile="yes"] .zaz-grid .zaz-grid-table tbody tr:nth-child(even) .cell',
                '.zaz-menu .items .item'
            ];

            rgbaStyles04 = [
                '.zaz-grid .zaz-grid-controls',
                '.zaz-overlay.userpreferences-overlay .zaz-overlay-content .left .items .item.active',
                '.gadget .controls .controls-bar > .knobs .knob:hover',
                '.gadget .controls .controls-bar > .knobs .knob:focus'
            ];

            rgbaStyles06 = [
            ];

            rgbaStyles08 = [
                '.__toolbar',
                '.__layout .zone .panel .tabcontrols .tabs .tab',
                '.__layout .zone .panel .tabcontrols .controls',
                '.news .content .content-item .content-title',
                '.zaz-grid thead th.moving',
                '.zaz-menu .items .item:hover',
                '.zaz-menu .items .item:focus',
                '.gadget .controls .controls-bar > .knobs .knob.active'
            ];

            $.each(colorStyles, function (i, strStyle) {
                arrStyles.push(strStyle + ' { color: RGB(' + themeColor + ') !important; }');
            });

            $.each(colorStyles08, function (i, strStyle) {
                arrStyles.push(strStyle + ' { color: RGBA(' + themeColor + ', 0.8) !important; }');
            });

            $.each(rgbStyles, function (i, strStyle) {
                arrStyles.push(strStyle + ' { background-color: RGB(' + themeColor + ') !important; }');
            });

            $.each(borderStyles, function (i, strStyle) {
                arrStyles.push(strStyle + ' { border-color: RGB(' + themeColor + ') !important; }');
            });

            $.each(rgbaBorderStyles04, function (i, strStyle) {
                arrStyles.push(strStyle + ' { border-color: RGBA(' + themeColor + ', 0.4) !important; }');
            });

            $.each(rgbaStyles02, function (i, strStyle) {
                arrStyles.push(strStyle + ' { background-color: RGBA(' + themeColor + ', 0.2) !important; }');
            });

            $.each(rgbaStyles04, function (i, strStyle) {
                arrStyles.push(strStyle + ' { background-color: RGBA(' + themeColor + ', 0.4) !important; }');
            });

            $.each(rgbaStyles06, function (i, strStyle) {
                arrStyles.push(strStyle + ' { background-color: RGBA(' + themeColor + ', 0.6) !important; }');
            });

            $.each(rgbaStyles08, function (i, strStyle) {
                arrStyles.push(strStyle + ' { background-color: RGBA(' + themeColor + ', 0.8) !important; }');
            });

            $themeStyles.html(arrStyles.join(''));
        },
    };

    return themeManager;
});