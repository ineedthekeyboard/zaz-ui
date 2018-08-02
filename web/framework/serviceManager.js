define([
    'jquery',
    'framework/logManager',
    'settings/services'
], function ($, logManager, services) {

    var timeout = 60000;

    function _getServiceObject(options) {
        var objService,
            path = options.service;

        $.each(path.split('.'), function (index, elem) {
            if (index === 0) {
                objService = services[elem] || null;
            } else {
                objService = objService ? objService[elem] : null;
            }
        });
        return objService;
    }

    function _replaceParams(options) {
        var key,
            params = options.params;

        for (key in params) {
            if (params.hasOwnProperty(key)) {
                options.url = options.url.replace('#' + key + '#', params[key]);
            }
        }
    }

    function _buildServiceUrl(options) {
        var service = _getServiceObject(options),
            url = service.url,
            cache = service.cache;

        //if cache object is found, update to url to include cache props
        if (cache && url.indexOf('?') === -1) {
            url = url.concat('?');
            options.params = options.params || {};
        }
        if (cache && cache.age) {
            url = url.concat('cacheage=#cacheage#');
            options.cache = true;
            options.params['cacheage'] = cache.age;
        }
        if (cache && cache.control) {
            url = url.concat('&cachecontrol=#cachecontrol#');
            options.params['cachecontrol'] = cache.control;
        }

        //set timeout if any
        options.timeout = service.timeout || timeout; 

        //initialize options.url from service
        options.url = url;

        if (options.params && options.url) {
            _replaceParams(options);
        }
    }

    function _logXHRError(response, textStatus) {
        console.error(textStatus);
    }

    /**
     * @namespace serviceManager
     * @classdesc Executes REST service calls
     */
    var serviceManager = {
        /**
         * @description Initializes page 
         * @memberof serviceManager
         * @param options {Object} various options like method, cache as hashmap
         * @returns {Promise} a jQuery promise
         */
        exec: function (options) {
            var defaults = {
                    type: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    async: true,
                    cache: false,
                    service: '',
                    params: {},
                    data: {},
                    headers: {
                        'Accept': 'application/json; charset=utf-8',
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                };

            if (!options.service || options.service === '') {
                console.error('No "{ service: \'item.subitem\' }" pattern was provided', options);
            }

            //generate url from params object
            _buildServiceUrl(options);

            if (!options.url || options.url === '') {
                console.error('Ensure service pattern is correct in services.js', options);
            }

            //extend default with options
            options = $.extend(true, {}, defaults, options);

            logManager.log(options.service + ' - ' + options.url);

            return $.ajax({
                timeout: options.timeout || timeout,
                type: options.type,
                dataType: options.dataType,
                success: options.success || null,
                error: options.error || _logXHRError,
                headers: options.headers,
                contentType: options.contentType,
                async: options.async,
                enctype: options.enctype,
                cache: options.cache,
                url: options.url,
                data: options.data
                // xhrFields: {
                //     withCredentials: true
                // }
            });
        }
    };

    if (window.CONFIG.debug) {
        window.serviceManager = serviceManager;
    }

    return serviceManager;
});