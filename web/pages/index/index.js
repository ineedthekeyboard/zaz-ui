define([
    'jquery.plugins',
    'handlebars-helpers',
    'framework/framework',
    'widgets/zazMenu/zazMenu',
    'settings/settings',
    'features/userPreferences/userPreferences',
    'features/about/about',
    'intro',
    'css!vendor/intro/introjs.min',
    'css!pages/index/index'
], function ($,
    HBS,
    framework,
    zazMenu,
    settings,
    userPreferences,
    about,
    introJs
) {
    var index = {};

    //init method must return a promise
    index.init = function () {
        var deferred = $.Deferred();

        index.renderLayout();
        index.bindListeners();

        index.loadData();

        deferred.resolve();
        return deferred.promise();
    };

    index.renderLayout = function () {
        var strHtml;

        $('body').attr('data-lang', window.language || 'en');

        strHtml = HBS['pages/index/index']({
            language: window.language || 'en',
            items: framework.languageManager.translations(),
            demo: window.CONFIG.demo,
            mainbar: true
        });
        $('body').find('.__header').append(strHtml);

        strHtml = HBS['pages/index/index']({
            language: window.language || 'en',
            items: framework.languageManager.translations(),
            demo: window.CONFIG.demo,
            toolbar: true
        });
        $('body').find('.__toolbar').append(strHtml);
    };

    index.renderGadgets = function () {
        var gadgets = framework.pageManager.getGadgets();

        framework.gadgetManager.open(gadgets);

        //this is set so that saveUserGadgets is not called perpetually when loading page
        window.setTimeout(function () {
            window.pageLoaded = true;
            window.pageUnloading = false;
        }, 2000);
    };

    index.loadData = function () {
        index.renderUser();
        index.renderGadgets();
    };

    index.bindListeners = function () {
        var context = this;
        var $toolbar = $('.__toolbar');
        var $mainbar = $('.__mainbar');

        $(window).on(settings.globals.NAMESPACE + '-message', function (e) {
            var message = e.message,
                action = message && message.action,
                options = message && message.options;

            switch (action) {
                case 'MESSAGE-hotkey-pressed':
                    if (options && options.key === 'alt+L') {
                        top.location = 'login.html';
                    }
                    if (options && options.key === 'alt+M') {
                        framework.pageManager.toggleMode();
                    }
                    break;
                case 'MESSAGE-focus-console':
                    if (window.name === framework.windowManager.getWindow().name) {
                        window.confirm('Console is already open'); 
                    }
                    break;
                default:
                    break;
            }
        });

        $mainbar.find('.user').off('click keyup');
        $mainbar.find('.user').on('click keyup', function (e) {
            if (e.type === 'click' || e.keyCode === framework.KEYS.ENTER || e.keyCode === framework.KEYS.SPACE) {
                context.showUserMenu();
            }
        });

        $toolbar.off('click keyup', '.knob');
        $toolbar.on('click keyup', '.knob', function (e) {
            var strType = $(this).attr('data-type'),
                strAction,
                strGadget;

            if (e.type === 'click' || e.keyCode === framework.KEYS.ENTER || e.keyCode === framework.KEYS.SPACE) {
                if (strType === 'action') {
                    strAction = $(this).attr('data-action');
                    switch (strAction) {
                        case 'mobile':
                            framework.pageManager.setMode('mobile');
                            break;
                        case 'desktop':
                            framework.pageManager.setMode('desktop');
                            break;
                        case 'gadgets':
                            framework.gadgetManager.showUserGadgets($(this));
                            break;
                        case 'preferences':
                            userPreferences.show();
                            break;
                        case 'about':
                            about.show();
                            break;
                        case 'viewintro':
                            $('.tab:first').attr('data-intro', "This is a gadget tab")
                            $('.tab:first').attr('data-step', "6");
                            $('.tab:first').attr('data-position', "right");
                            introJs().start();
                            break;
                        default:
                            break;
                    }
                }

                if (strType === 'gadget') {
                    strGadget = $(this).attr('data-gadget');
                    framework.gadgetManager.showGadgetOpener(strGadget, {});
                }
            }
        });
    };

    index.showUserMenu = function () {
        var strHtml;

        strHtml = HBS['pages/index/index']({
            language: window.language || 'en',
            items: framework.languageManager.translations(),
            viewerMode: (framework.layoutManager.pageMode === 'viewer'),
            switchUser: !window.CONFIG.sso,
            demo: window.CONFIG.demo,
            usermenu: true
        });
        $('body').append(strHtml);

        $('.usermenu').zazMenu({
            'selector': $('.__header .user'),
            useOffset: true,
            'item-click': function (e, data) {
                var strAction = data.action;
                switch (strAction) {
                    case 'switchuser':
                        top.location = 'login.html';
                        break;
                    case 'preferences':
                        userPreferences.show();
                        break;
                    default:
                        break;
                }
            }
        });
    };

    index.renderUser = function () {
        userPreferences.displayUserName();
    };

    return index;
});