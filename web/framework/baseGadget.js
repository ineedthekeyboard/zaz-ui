define([
    'jquery.plugins',
    'settings/settings',
    'framework/gadgetManager',
    'framework/windowManager',
    'framework/messageManager',
    'framework/preferencesManager',
    'framework/languageManager',
    'handlebars-helpers'
], function ($,
    settings,
    gadgetManager,
    windowManager,
    messageManager,
    preferencesManager,
    languageManager,
    HBS) {


    /**
     * @namespace baseGadget
     * @classdesc This is the base gadget, all the gadgets in application may or may not be inherited from this base class
     */
    return $.widget('zaz.gadget', {

        _gadgetName: '',

        preferences: {},

        _create: function () {
            this._lastPanelHeight = 0;
            this._lastPanelWidth = 0;
            this._panelElement = this.element.closest('.panel');
            this._createLoader();
            this._setGadgetName();
            this.bindListeners();
            this.getPreferences();
        },

        _setGadgetName: function () {
            this._gadgetName = this.widgetName;
        },

        _setOptions: function (options) {
            var $tab = gadgetManager.getTab(this.widgetName),
                tabOptions = $tab.data('options') || {};

            this._super(options);
            tabOptions = $.extend(true, {}, tabOptions, this.options);
            $tab.data('options', tabOptions);
        },

        _resizeGadget: function () {
            if (this._resize && this.options.active && (this._panelElement.width() !== this._lastPanelWidth || this._panelElement.height() !== this._lastPanelHeight)) {
                this._updateLastPanelDimensions();
                this._resize();
            }
        },

        _updateLastPanelDimensions: function () {
            this._lastPanelWidth = this._panelElement.width();
            this._lastPanelHeight = this._panelElement.height();
        },

        _destroy: function () {
            this.element.empty();
            this.options = null;
            this._receiveMessage = null;
            this._resize = null;
            this._super();
            // this.widget().destroy();
        },

        _createLoader: function () {
            this.element.append(HBS['framework/baseGadget']({
                message: languageManager.translate('LOADING') + '...'
            }));
        },

        bindListeners: function () {
            var context = this;

            $(window).on(settings.globals.NAMESPACE + '-message', function (e) {
                if (context._receiveMessage) {
                    context._receiveMessage(e);
                }
            });

            $(window).on('resized', function () {
                context._resizeGadget();
            });
        },

        /**
         * @description Check if a Gadget Tab is pinned
         * @memberof baseGadget
         * @param action {String} message
         * @param options {object} additional payload to send with action
         */
        sendMessage: function (action, options) {
            messageManager.send({
                action: action,
                options: options || {}
            });
        },

        /**
         * @description Blocks the gadget while loading Gadget
         * @memberof baseGadget
         */
        showLoader: function () {
            this.element.find('.gadget-message').css('display', 'flex');
            this.element.find('.gadget-loading').show();
        },

        /**
         * @description Unblocks the gadget after loading Gadget
         * @memberof baseGadget
         */
        hideLoader: function () {
            this.element.find('.gadget-message').css('display', 'none');
            this.element.find('.gadget-loading').hide();
        },

        /**
         * @description Retrieves preferences for the Gadget
         * @memberof baseGadget
         * @returns preferences {object}
         */
        getPreferences: function () {
            var strKey = 'PREFERENCE-' + this._gadgetName + '-settings';
            this.preferences = windowManager.getWindow().preferences && windowManager.getWindow().preferences[strKey] || {};
            return this.preferences;
        },

        /**
         * @description Saves preferences for the Gadget
         * @memberof baseGadget
         */
        setPreferences: function () {
            var context = this;
            var strKey = 'PREFERENCE-' + this._gadgetName + '-settings';

            preferencesManager.set({
                'key': strKey,
                'value': JSON.stringify(this.preferences)
            }).done(function () {
                windowManager.getWindow().preferences[strKey] = context.preferences;
            });
        }
    });
});