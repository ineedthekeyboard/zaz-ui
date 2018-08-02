define([
    'jquery.plugins',
    'settings/settings',
    'framework/messageManager',
    'framework/storageManager'
], function (
    $,
    settings,
    messageManager,
    storageManager
) {

    /**
     * @namespace pageManager
     * @classdesc Initializes starting html pages.
     */
    var pageManager = {
        /**
         * @description Initializes page 
         * @memberof pageManager
         * @param strPage {String} name of the page without html extension
         */
        init: function (strPage) {
            this.bindListeners();

            require([strPage], function (page) {
                page.init();
            });
        },

        setMode: function (strMode) {
            var currentMode = storageManager.getStorageItem(settings.globals.NAMESPACE + '-mode');
            if (strMode !== currentMode) {
                storageManager.setStorageItem(settings.globals.NAMESPACE + '-mode', strMode);
                location.reload();
            }
        },

        toggleMode: function () {
            var strMmode,
                currentMode = storageManager.getStorageItem(settings.globals.NAMESPACE + '-mode');

            strMode = (currentMode === 'mobile') ? 'desktop' : 'mobile';
            storageManager.setStorageItem(settings.globals.NAMESPACE + '-mode', strMode);
            location.reload();
        },

        bindListeners: function () {
            // bind hotkeys
            $('body').off('keyup.hotkey');
            $('body').on('keyup.hotkey', function (e) {
                var altStr = e.altKey ? 'alt' : null,
                    ctrlStr = e.ctrlKey ? 'ctrl' : null,
                    shiftStr = e.shiftKey ? 'shift' : null,
                    keyStr = String.fromCharCode(e.keyCode),
                    result = [altStr, ctrlStr, shiftStr, keyStr].filter(function (item) {
                        return item;
                    }).join('+');

                e.preventDefault();
                switch (result) {
                    case 'alt+A': //about
                    case 'alt+G': //show viewer gadgets
                    case 'alt+L': //logout
                    case 'alt+M': //mobile/desktop
                    case 'alt+P': //preferences
                    case 'alt+T': //theme
                        messageManager.send({
                            action: 'MESSAGE-hotkey-pressed',
                            options: {
                                key: result
                            }
                        });
                        break;
                    default:
                        break;
                }
            });
        },

        getGadgets: function () {
            var gadgets = [];

            switch (window.user.role) {
                case 'admin':
                    gadgets = [{
                            script: 'dataGrid',
                            zone: 'main-left',
                            active: false,
                            window: window.name
                        },
                        {
                            script: 'sampleChart',
                            zone: 'main-right',
                            active: true,
                            window: window.name
                        }
                    ];
                    break;
                case 'user':
                default:
                    gadgets = [{
                            script: 'dataGrid',
                            zone: 'main-left',
                            active: false,
                            window: window.name
                        },
                        {
                            script: 'docViewer',
                            zone: 'main-left',
                            active: false,
                            window: window.name
                        },
                        {
                            script: 'sampleChart',
                            zone: 'main-right',
                            active: true,
                            window: window.name
                        },
                        {
                            script: 'news',
                            zone: 'main-right-bottom',
                            active: true,
                            window: window.name
                        },
                        {
                            script: 'mapData',
                            zone: 'main-right-bottom',
                            active: false,
                            window: window.name
                        }
                    ];
                    break;
            }
            return gadgets;
        }
    };

    if (window.CONFIG.debug) {
        window.pageManager = pageManager;
    }

    return pageManager;
});