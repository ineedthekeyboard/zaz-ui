define([
    'jquery',
    'framework/uriManager',
    'framework/storageManager',
    'framework/messageManager',
    'settings/globals',
    'user/userManager'
], function ($,
    uriManager,
    storageManager,
    messageManager,
    globals,
    userManager) {
    return {
        init: function () {
            var context = this;

            userManager.fetchUser().done(function () {
                context._fethUserSuccess();
            }).fail(function () {
                context._fetchUserError();
            });
        },

        _fethUserSuccess: function () {
            var url = window.location.pathname,
                strViewer = url.substring(url.lastIndexOf('/') + 1).replace('.html', ''),
                expiredSeconds = storageManager.getStorageItem(globals.NAMESPACE + '-opened') ? Date.now() - JSON.parse(storageManager.getStorageItem(globals.NAMESPACE + '-opened')).expiredSeconds : 3500;

            // Check if expired seconds is less than 3 seconds; expired seconds should always be about 2 seconds but it checks for 3 seconds just to count for any browser delays
            if (expiredSeconds < 3000 && uriManager.get('extended') !== '1') {
                $('body')
                    .html('<h3 style="padding:0 0 0 20px; color:#ac2b37">Console is already open, this window will attempt to close in 10 seconds. If this window does not close, please close it.</h3>');

                messageManager.send({
                    action: 'MESSAGE-focus-console'
                });
                window.close();
                return;
            }

            if (!strViewer) {
                window.location.pathname = 'index.html';
                return;
            }

            this._openViewer(strViewer);
        },

        _fetchUserError: function () {
            top.location = 'access.html';
        },

        _openViewer: function (strViewer) {
            var strViewerScript = ['pages', strViewer, strViewer].join('/');

            require([
                    'framework/logManager',
                    'framework/windowManager',
                    'framework/layoutManager',
                    'framework/gadgetManager',
                    'framework/pageManager',
                    'css!framework/styles/normalize',
                    'css!vendor/jquery-ui/themes/smoothness/jquery-ui.min',
                    'css!vendor/tree.jquery/jqtree',
                    'css!vendor/intro/introjs.min',
                    'css!vendor/jquery.wheelcolorpicker/wheelcolorpicker',
                    'css!framework/styles/material',
                    'css!framework/styles/effects',
                    'css!framework/styles/globals',
                    'css!framework/styles/flags',
                    'css!framework/styles/header',
                    'css!framework/styles/toolbar',
                    'css!framework/styles/gadget',
                    'css!framework/styles/layout',
                    'css!framework/styles/tabs',
                    'css!framework/styles/log',
                    'css!styles/style',
                    'css!styles/theme'
                ],
                function (
                    logManager,
                    windowManager,
                    layoutManager,
                    gadgetManager,
                    pageManager
                ) {
                    logManager.init();
                    windowManager.init();
                    layoutManager.init();
                    gadgetManager.init();
                    pageManager.init(strViewerScript);
                }
            );
        }
    };
});