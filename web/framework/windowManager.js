define([
    'jquery.plugins',
    'settings/globals',
    'framework/storageManager'
], function (
    $,
    globals,
    storageManager
) {
    var windowManager = {

        getWindow: function () {
            return window;
        },

        init: function () {
            var context = this;

            window.name = globals.CONSOLE + '_0_' + window.USERID;

            this.addIndex();

            $(window).on('resize', $.debounce(250, function () {
                $(window).trigger('resized');
            }));

            $(window).on('unload', function () {
                context.removeIndex();
            });
        },

        addIndex: function () {
            storageManager.setStateItem(globals.NAMESPACE + '-windows', window.name, {});

            function updateTimeStamp() {
                var time = new Date().getTime();
                storageManager.setStorageItem(globals.NAMESPACE + '-opened', {
                    expiredSeconds: time,
                    windowName: window.name
                });
            }

            if (window.name === globals.CONSOLE + '_0_' + window.USERID) {
                window.clearInterval(window.expiredInterval);
                updateTimeStamp();
                window.expiredInterval = setInterval(updateTimeStamp, 1000);
            }
        },

        removeIndex: function () {
            storageManager.removeStateItem(globals.NAMESPACE + '-windows', window.name);
            if (window.name === globals.CONSOLE + '_0_' + window.USERID) {
                storageManager.removeStorageItem(globals.NAMESPACE + '-opened');
            }
        }
    };

    if (window.CONFIG.debug) {
        window.windowManager = windowManager;
    }

    return windowManager;
});