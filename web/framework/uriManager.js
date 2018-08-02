define([], function () {
    var urlManager = {
        /*
         get: function (name) {
         name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
         var regexS = '[\\?&]' + name + '=([^&#]*)';
         var regex = new RegExp(regexS);
         var results = regex.exec(window.location.href);
         if (results === null) {
         return '';
         }
         return results[1];
         },
         */

        getUrlObject: function () {
            var location = window.location,
                search = decodeURIComponent(location.search),
                hash = decodeURIComponent(location.hash),
                i, l, v, params = {};

            search = search.replace('?', '').split('&');
            hash = hash.replace('#', '').split(';');

            for (i = 0, l = search.length; i < l; i++) {
                v = search[i].split('=');
                if (v[0]) {
                    params[v[0]] = v[1];
                }
            }

            for (i = 0, l = hash.length; i < l; i++) {
                v = hash[i].split('=');
                if (v[0]) {
                    params[v[0]] = v[1];
                }
            }

            return params;
        },

        get: function (param) {
            var params = this.getUrlObject();
            if (param) {
                return params[param];
            }
            else {
                return params;
            }
        },

        getParamValueFromString: function (param, urlString) {
            var match = new RegExp('[\?\&\#\;]' + param + '=([^\&\;]*)').exec(urlString);
            return (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || '';
        },

        getHash: function () {
            var hash = window.location.hash;
            if (hash.length) {
                hash = hash.substring(1);
            }
            if (hash.length) {
                return hash;
            }
            return '';
        },

        removeHash: function (key) {
            var hash = decodeURIComponent(window.location.hash),
                i, res = '';

            if (!key) {
                window.location.hash = '';
                return false;
            }

            hash = hash.replace('#', '').split(';');

            for (i = 0; i < hash.length; i++) {
                if (hash[i] && hash[i].split('=')[0] !== key) {
                    res = res + hash[i] + ';';
                }
            }
            window.location.hash = res;
        }
    };

    if (window.CONFIG.debug) {
        window.urlManager = urlManager;
    }

    return urlManager;
});
