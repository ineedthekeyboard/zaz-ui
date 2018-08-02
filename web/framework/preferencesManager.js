define([
    'jquery.plugins',
    'settings/globals',
    'settings/preferences',
    'framework/cookieManager',
    'framework/serviceManager',
    'framework/storageManager',
    'framework/messageManager'
], function ($,
    globals,
    preferences,
    cookieManager,
    serviceManager,
    storageManager,
    messageManager) {

    /**
     * Return a boolean.
     * @param key {String} a string
     * @returns {*}
     */
    function isValid(key) {
        if (!preferences[key]) {
            console.error('Preference key: "' + key + '" is not documented in common/preferences.js');
            return false;
        }
        return true;
    }

    /**
     * Manages Getting/Setting of preferences.
     * @namespace preferencesManager
     */

    var preferencesManager = {
        /**
         * @description Retrieves a preference from server
         * @memberof preferencesManager
         * @param params {Object} an object with two properties: preferenceKey and preferenceType
         * @returns {Promise} a jQuery promise with preference object
         */
        get: function (params) {
            var deferred = new $.Deferred(),
            preferences;

            if (!isValid(params.key)) {
                return deferred.reject();
            }

            params.type = globals.NAMESPACE.toLowerCase();
            params.userId = window.USERID;

            if (window.CONFIG.mock) {
                preferences = storageManager.getStorageItem(globals.NAMESPACE + '-preferences-' + window.USERID);
                preferences = JSON.parse(preferences);
                deferred.resolve(preferences || []);
            } else {
                serviceManager.exec({
                    service: 'preferences.get.data',
                    success: deferred.resolve,
                    error: deferred.reject,
                    params: params
                });
            }
            return deferred.promise();
        },

        /**
         * @description Saves preference(s) to server
         * @memberof preferencesManager
         * @param params {Object} an object with two properties: preferenceKey and preferenceType
         * @returns {Promise} a jQuery promise with preference object
         */
        set: function (params) {
            var deferred = new $.Deferred(), 
            preferences;

            if (window.CONFIG.mock) {
                preferences = storageManager.getStorageItem(globals.NAMESPACE + '-preferences-' + window.USERID);
                preferences = JSON.parse(preferences) || [];
            }

            if (!(params instanceof Array)) {
                params = [params];
            }

            $(params).each(function (i, row) {
                var blnMatch = false;

                if (!isValid(row.key)) {
                    return deferred.reject();
                }
                row.userid = window.USERID;
                row.type = globals.NAMESPACE.toLowerCase();

                if (window.CONFIG.mock) {
                    $(preferences).each(function (i, preference) {
                        if (row.key === preference.key) {
                            blnMatch = true;
                            preferences[i] = row;
                            return false;
                        }
                    });

                    if (!blnMatch) {
                        preferences.push(row);
                    }
                }
            });
            if (window.CONFIG.mock) {
                params = preferences;
            }

            function success() {
                messageManager.send({
                    action: 'MESSAGE-preference-changed'
                });
                deferred.resolve();
            }

            function error(response, textStatus, errorThrown) {
                console.log(errorThrown);
                deferred.reject();
            }

            if (window.CONFIG.mock) {
                storageManager.setStorageItem(globals.NAMESPACE + '-preferences-'+ window.USERID, params);
                deferred.resolve();
            } else {
                serviceManager.exec({
                    service: 'preferences.post',
                    type: 'POST',
                    data: JSON.stringify(params),
                    success: success,
                    error: error
                });
            }
            return deferred.promise();
        },

        /**
         * @description Deletes preference(s) from server
         * @memberof preferencesManager
         * @param params {Object} an object with two properties: preferenceKey and preferenceType
         * @returns {Promise} a jQuery promise with preference object
         */
        remove: function (params) {
            var deferred = new $.Deferred();

            if (!(params instanceof Array)) {
                params = [params];
            }

            $(params).each(function (i, row) {
                if (!isValid(row.key)) {
                    return deferred.reject();
                }
                row.userid = window.USERID;
                row.type = globals.NAMESPACE.toLowerCase();
            });

            serviceManager.exec({
                service: 'preferences.delete',
                type: 'DELETE',
                data: JSON.stringify(params),
                success: deferred.resolve,
                error: deferred.reject
            });

            return deferred.promise();
        }
    };

    if (window.CONFIG.debug) {
        window.preferencesManager = preferencesManager;
    }

    return preferencesManager;
});