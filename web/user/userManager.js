define([
    'jquery',
    'framework/cookieManager',
    'framework/serviceManager',
    'framework/preferencesManager',
    'features/userPreferences/userPreferences'
], function (
    $,
    cookieManager,
    serviceManager,
    preferencesManager,
    userPreferences
) {
    //sample
    // {
    //     "userId": "100",
    //     "lastName": "First",
    //     "firstName": "Last",
    //     "role": "user"
    // }
      
    var usersManager = {
        fetchUser: function () {
            var context = this,
                deferred = new $.Deferred(),
                userId = cookieManager.read('userId');

            if (!userId) {
                error();
                return deferred.promise();
            }

            function success(response) {
                var data;
                if (response && response.length) {
                    data = response[0];
                    window.user = data;
                    window.USERID = data.userId + '';
                    context.fetchPreferences().always(function () {
                        deferred.resolve();
                    });
                } else {
                    error();
                }
            }

            function error() {
                deferred.reject();
            }

            serviceManager.exec({
                service: 'users.get.me',
                success: success,
                error: error,
                params: {
                    userId: userId
                }
            });

            return deferred.promise();
        },

        fetchPreferences: function () {
            var deferred = new $.Deferred();

            preferencesManager.get({
                key: ''
            }).always(function (response) {
                var data = (response.length) ? response : [],
                    preferences = {};

                if (data) {
                    $(data).each(function (i, row) {
                        preferences[row.key] = JSON.parse(row.value);
                    });
                    window.preferences = $.extend({}, userPreferences.defaults, preferences);
                    window.language = window.preferences['PREFERENCE-user-language'].language || 'en';
                    userPreferences.applyTheme();
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise();
        }
    };

    if (window.CONFIG.debug) {
        window.usersManager = usersManager;
    }

    return usersManager;
});