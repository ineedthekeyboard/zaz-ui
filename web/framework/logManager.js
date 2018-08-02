define([
    'jquery.plugins',
    'framework/keys',
    'framework/storageManager',
    'framework/languageManager',
    'common/formatter',
    'settings/globals',
    'handlebars-helpers'
], function ($,
    KEYS,
    storageManager,
    languageManager,
    formatter,
    globals,
    HBS) {

    /**
     * @namespace logManager
     * @classdesc Logs messages to a config Window (accessed by pressing CTRL + ALT + L).
     */
    var logManager = {};

    /**
     * @description Logs a message to LogManager
     * @memberof logManager
     * @param strMessage {String} Message string to display in log
     * @param strType {String} Type = 'error' if display and error message in log
     */
    logManager.log = function (strMessage, strType) {
        if (!window.CONFIG.debug) {
            return;
        }
        var arrHtml = [];
        var strTime = formatter.dateFormat.toHMSTime();
        var strClass = (strType && strType.toLowerCase() === 'error') ? 'error' : '';
        arrHtml[arrHtml.length] = '<tr class="' + strClass + '"><td>' + strTime + '</td><td>' + strMessage + '</td></tr>';

        $('.log table').prepend(arrHtml.join(''));
    };

    /**
     * @description Hides log
     * @memberof logManager
     */
    logManager.hide = function () {
        $('.log').hide('fast');
    };

    /**
     * @description Displays log
     * @memberof logManager
     */
    logManager.display = function () {
        var inMaxZIndex = $.maxZIndex();
        $('.log').css('z-index', inMaxZIndex);
        $('.log').css('position', 'fixed');
        $('.log').show('fast');

        if (!window.CONFIG.debug) {
            $('.log .title').append(' - Enable DEBUG mode on Configuration first.')
        }
    };

    /**
     * @description Initializes log HTML Markup on DOM
     * @memberof logManager
     */
    logManager.init = function () {
        if ($('.log').length === 0) {
            var strHtml = HBS['framework/logManager']({
                items: languageManager.translations()
            });
            $(document.body).append(strHtml);
            $('.log .close').on('click', function () {
                $('.log').hide('fast');
            });
            $('.log .clear').on('click', function () {
                $('.log table').empty();
            });

            $(document).keyup(function (e) {
                if (e.ctrlKey && e.altKey && e.keyCode === KEYS.L) {
                    logManager.display();
                }

                if (e.keyCode === KEYS.ESCAPE) {
                    //$().koverlay.hide(true)
                    logManager.hide();
                }
            });
        }

        $(window).on(globals.NAMESPACE + '-config', function (event) {
            var defaultConfig = {
                    debug: false,
                    mock: false,
                    demo: false,
                    sso: false
                },
                config = event.message;

            config = $.extend(defaultConfig, config);
            window.CONFIG = config;
        });
    };

    /**
     * @memberof logManager
     * @description kick off log manager
     * @returns null
     */
    logManager.init();

    if (window.CONFIG.debug) {
        window.logManager = logManager;
    }

    return logManager;
});