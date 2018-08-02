define([
    'jquery',
    'settings/globals'
], function (
    $,
    globals
) {
    /**
     * @namespace storageManager
     * @classdesc Manages state objects on Window State and Storage.
     */
    var storageManager = {

        /**
         * @description Gets console window 
         * @memberof storageManager
         * @method getWindow
         */
        getWindow: function () {
            var win = window;
            try {
                if (window.opener && window.opener.name.indexOf(globals.CONSOLE + '_0') > -1) {
                    win = window.opener;
                }
            } catch (e) {
                //do nothing
            }
            return win;
        },

        /**
         * @description Stores a Key/Value on Window State
         * @memberof storageManager
         * @method setStateItem
         * @param strType {String} Type - NAMESPACE-window or NAMESPACE-gadgets
         * @param strKey {String} Name of the Key
         * @param objValue {Object} Value (as object or string)
         */
        setStateItem: function (strType, strKey, objValue) {
            var strValue = objValue,
                consoleWindow = storageManager.getWindow();

            if (typeof objValue === 'object') {
                strValue = JSON.stringify(objValue);
            }

            consoleWindow.state = consoleWindow.state || {};
            consoleWindow.state[strType] = consoleWindow.state[strType] || {};
            consoleWindow.state[strType][strKey] = strValue;
        },

        /**
         * @description Stores a Key/Value on Storage
         * @memberof storageManager
         * @method setStorageItem
         * @param strKey {String} Name of the Key
         * @param objValue {Object} Value (as object or string)
         */
        setStorageItem: function (strKey, objValue) {
            var strValue = objValue;

            if (typeof objValue === 'object') {
                strValue = JSON.stringify(objValue);
            }

            localStorage.setItem(strKey, strValue);
        },

        /**
         * @description Retrieves Value of given Key from Window State
         * @memberof storageManager
         * @method getStateItem
         * @param strType {String} Type - NAMESPACE-window or NAMESPACE-gadgets
         * @param strKey {String} Name of the Key
         */
        getStateItem: function (strType, strKey) {
            var consoleWindow = storageManager.getWindow();
            return consoleWindow.state[strType][strKey];
        },

        /**
         * @description Retrieves Value of given Key from Storage
         * @memberof storageManager
         * @method getStorageItem
         * @param strKey {String} Name of the Key
         */
        getStorageItem: function (strKey) {
            return localStorage.getItem(strKey);
        },

        /**
         * @description Removes a Key from Window State
         * @memberof storageManager
         * @method removeStateItem
         * @param strType {String} Type - NAMESPACE-window or NAMESPACE-gadgets
         * @param strKey {String} Name of the Key
         */
        removeStateItem: function (strType, strKey) {
            var consoleWindow = storageManager.getWindow();
            delete consoleWindow.state[strType][strKey];
        },

        /**
         * @description Removes a Key from Storage
         * @memberof storageManager
         * @method removeStorageItem
         * @param strKey {String} Name of the Key
         */
        removeStorageItem: function (strKey) {
            localStorage.removeItem(strKey);
        },

        /**
         * @description Returns the set of keys that matches your string, regex, or filter function.
         * @memberof storageManager
         * @method getStateKeys
         * @param strType {String} Type - NAMESPACE-window or NAMESPACE-gadgets
         * @param {String|RegExp} match - filter the keys in Window State
         * @return {String[]}
         */
        getStateKeys: function (strType, match) {
            var arrKeys = [],
                consoleWindow = storageManager.getWindow();

            arrKeys = Object.keys(consoleWindow.state[strType]);
            arrKeys = arrKeys.filter(function (key) {
                return key.match(match);
            });

            return arrKeys;
        },

        /**
         * @description Returns the set of keys that matches your string, regex, or filter function.
         * @memberof storageManager
         * @param {String|RegExp} match - filter the keys in Storage.
         * @return {String[]}
         */
        getStorageKeys: function (match) {
            var arrKeys = [];

            arrKeys = Object.keys(localStorage);
            arrKeys = arrKeys.filter(function (key) {
                return key.match(match);
            });

            return arrKeys;
        },

        /**
         * Handler for listening to the dom for storage events.
         * @param {Event} e - The event thrown in the DOM.
         */
        listener: function (e) {
            var originalEvent = e.originalEvent || {},
                val = originalEvent.newValue,
                objMessage = {};

            try {
                objMessage = JSON.parse(val);
            } catch (e) {
                objMessage = val;
            } finally {
                $.event.trigger({
                    'type': originalEvent.key,
                    'message': objMessage,
                    'originalEvent': originalEvent,
                    'time': new Date().getTime()
                });
            }
        }

    };

    $(window).on('storage', storageManager.listener.bind(storageManager));

    if (window.CONFIG.debug) {
        window.storageManager = storageManager;
    }

    return storageManager;
});