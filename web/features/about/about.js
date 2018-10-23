define([
    'jquery.plugins',
    'handlebars-helpers',
    'settings/settings',
    'framework/framework',
    'widgets/zazOverlay/zazOverlay',
    'css!features/about/about'
], function (
    $,
    HBS,
    settings,
    framework,
    zazOverlay
) {

    var about = {

        show: function () {
            if (window.name.indexOf(settings.globals.CONSOLE + '_0') < 0) {
                framework.windowManager.focusViewer(settings.globals.CONSOLE + '_0_' + window.USERID);
                return true;
            }

            this.renderLayout();

            this.$overlay.zazOverlay({
                'title': 'About Zaz UI Community Edition',
                'opacity': 0,
                'button-click': this.handleButtonClick.bind(this)
            });

            this.$overlay.find('.version').html(window.version);
        },

        handleButtonClick: function (e, data) {
            var strAction = data.action;
            if (strAction === 'ok') {
                this.close();
            }
        },

        renderLayout: function () {
            $('.about-overlay').remove();
            var $overlay = $(HBS['features/about/about']({
                items: framework.languageManager.translations()
            }));
            $overlay.appendTo('body');
            this.$overlay = $overlay;
        },

        close: function () {
            this.$overlay.zazOverlay('instance').close();
        },

        init: function () {
            var context = this;
            $(window).on(settings.globals.NAMESPACE + '-message', function (e) {
                var message = e.message,
                    action = message && message.action,
                    options = message && message.options;

                if (action === 'MESSAGE-hotkey-pressed') {
                    if (options && options.key === 'alt+A') {
                        context.show();
                    }
                }
            });
        }
    };

    about.init();

    if (window.CONFIG.debug) {
        window.about = about;
    }

    return about;
});