define([
    'jquery',
    'framework/storageManager',
    'settings/globals',
    'common/formatter',
    'css!pages/config/config'
], function ($,
    storageManager,
    globals,
    formatter) {
    var configManager = {

        config: {
            debug: false,
            mock: false,
            demo: false,
            sso: false
        },

        log: function (strMessage, strType) {
            var arrHtml = [];
            var strTime = formatter.dateFormat.toHMSTime();
            var strClass = (strType && strType.toLowerCase() === 'error') ? 'error' : '';
            arrHtml[arrHtml.length] = '<tr class="' + strClass + '"><td>' + strTime + '</td><td>' + strMessage + '</td></tr>';

            $('.config table').prepend(arrHtml.join(''));
        },

        exportToCSV: function () {
            var $rows = $('.config table').find('tr:has(td)'),

                // Temporary delimiter characters unlikely to be typed by keyboard
                // This is to avoid accidentally splitting the actual contents
                // vertical tab character
                tmpColDelim = String.fromCharCode(11),
                // null character
                tmpRowDelim = String.fromCharCode(0),

                // actual delimiter characters for CSV format
                colDelim = '","',
                rowDelim = '"\r\n"',

                // Grab text from table into CSV formatted string
                csv = '"' + $rows.map(function (i, row) {
                    var $row = $(row),
                        $cols = $row.find('td');

                    return $cols.map(function (j, col) {
                        var $col = $(col),
                            text = $col.text();

                        // escape double quotes
                        return text.replace(/"/g, '""');

                    }).get().join(tmpColDelim);

                }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

                // Data URI
                csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv),
                csvFile = 'export-' + new Date().getTime() + '.csv';

            $('.config .export').attr({
                'download': csvFile,
                'href': csvData,
                'target': '_blank'
            });
        },

        loadConfig: function () {
            var config = storageManager.getStorageItem(globals.NAMESPACE + '-config');
            if (config) {
                config = JSON.parse(config);
            }
            configManager.config = $.extend(configManager.config, config);

            $.each(configManager.config, function (strKey, value) {
                var $button = $('.config .button[data-key="' + strKey + '"]');
                var strKeyUpperCase = strKey.toUpperCase();
                $button.attr('data-mode', configManager.config[strKey]);
                $button.attr('title', strKeyUpperCase + ' mode is ' + (value) ? 'ON' : 'OFF');
            });
        },

        setConfig: function (strKey) {
            var $button = $('.config .button[data-key="' + strKey + '"]');
            var strKeyUpperCase = strKey.toUpperCase();

            configManager.config[strKey] = !configManager.config[strKey];
            $button.attr('data-mode', configManager.config[strKey]);
            $button.attr('title', strKeyUpperCase + ' mode is ' + ((configManager.config[strKey]) ? 'ON' : 'OFF'));
            storageManager.setStorageItem(globals.NAMESPACE + '-config', configManager.config);
        },

        bindListeners: function () {
            $('.config .button[data-key]').on('click', function () {
                var $button = $(this);
                var strKey = $button.attr('data-key');
                configManager.setConfig(strKey);
            });
        },

        init: function () {
            configManager.loadConfig();
            configManager.bindListeners();

            $('.config').css({opacity: 1});
        }
    };

    return configManager;
});