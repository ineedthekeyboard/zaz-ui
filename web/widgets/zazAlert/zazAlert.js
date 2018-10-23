define([
    'jquery',
    'settings/settings',
    'framework/framework',
    'widgets/zazOverlay/zazOverlay',
    'handlebars-helpers',
    'css!widgets/zazAlert/zazAlert'
], function ($,
    settings,
    framework,
    zazOverlay,
    HBS) {

    /**
     * @namespace zazAlert
     * @classdesc A simple alert widget based on zazOverlay widget.
     */

    return {
        _alert: null,
        show: function (returnElement, title, content) {
            var $overlay = $('.zaz-alert-overlay');

            if (!$overlay.length) {
                $overlay = $(HBS['widgets/zazAlert/zazAlert']({
                    items: framework.languageManager.translations()
                }));
                $(document.body).append($overlay);
            }

            $overlay.find('.zaz-overlay-header-title').html(title);
            $overlay.find('.zaz-overlay-content').html(content);

            //instantiate overlay with options
            $overlay.zazOverlay({
                'returnElement': returnElement,
                'button-click': this.buttonClickHandler.bind(this)
            });
            this._alert = $overlay.zazOverlay('instance');
        },
        buttonClickHandler: function (e, action) {
            if (action === 'ok') {
                this._alert.close();
            }
        }
    };
});