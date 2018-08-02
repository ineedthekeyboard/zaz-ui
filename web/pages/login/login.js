define([
    'jquery.plugins',
    'framework/cookieManager',
    'settings/settings',
    'handlebars-helpers',
    'widgets/zazGrid/zazGrid',
    'framework/serviceManager',
    'framework/themeManager',
    'intro',
    'css!pages/login/login'
], function ($,
    cookieManager,
    settings,
    HBS,
    zazGrid,
    serviceManager,
    themeManager,
    introJs) {

    var login = {};

    login.data = [];

    login.config = [{
            "id": "userId",
            "name": "Employee #",
            "visible": true,
            "sortable": true,
            "sort": "asc",
            "width": 120
        },
        {
            "id": "lastName",
            "name": "Last Name",
            "visible": true,
            "sortable": true,
            "width": 240
        },
        {
            "id": "firstName",
            "name": "First Name",
            "visible": true,
            "sortable": true,
            "width": 240
        },
        {
            "id": "role",
            "name": "Role",
            "visible": true,
            "sortable": true,
            "width": 100
        }
    ];

    login.init = function () {
        themeManager.setStyles('00, 44, 88');
        login.renderLayout();
        login.loadData().done(function () {
            login.renderGrid();
        });
        login.bindListeners();

        introJs().addHints();
        window.name = '';
    };

    login.tileFormatter = function (data) {
        var strHtml = HBS['pages/login/login']({ 
            tile: true,
            data: data
        });
        return strHtml;
    };

    login.bindListeners = function () {
        var $grid = $('.gadget .grid'),
            $searchText = $('.gadget .controls .search .text'),
            $controls = $('.gadget .controls');

        $searchText.off('keyup');
        $searchText.on('keyup', function (e) {
            var data = login.search($(this).val());

            if (e.keyCode === 13) {
                $grid.find('tbody tr:first').trigger('click');
            } else {
                login.renderGrid(data);
            }
        });

        $controls.off('click', '.search .clear');
        $controls.on('click', '.search .clear', function (e) {
            $('.gadget .controls .search .text').val('').focus();
            login.renderGrid();
        });
    };

    login.renderLayout = function () {
        var strHtml = HBS['pages/login/login']({ main: true});
        $('.__login').append(strHtml);
        login.$controls = $('.controls');

        if (window.isOldIE) {
            $('.gadget').css('width', 600);
        }
    };

    login.loadData = function () {
        var deferred = $.Deferred();
        login.getData().done(function () {
            deferred.resolve();
        });
        return deferred.promise();
    };

    login.search = function (searchVal) {
        var parts = searchVal.toLowerCase().split(' ');

        return $.grep(login.data, function (row) {
            var searchedColumns = [],
                matches = 0;

            $.each(parts, function (i, part) {
                $.each(login.config, function (i, col) {
                    if (searchedColumns.indexOf(col.id) === -1 && row[col.id].toString().toLowerCase().indexOf(part) > -1) {
                        matches = matches + 1;
                        searchedColumns.push(col.id);
                        return false;
                    }
                });
            });
            return matches === parts.length;
        });
    };

    login.renderGrid = function (data) {
        var $grid = $('.grid'),
            searchParts = $('.controls .search .text').val().toLowerCase().split(' ');

        data = data || login.data;

        if ($grid.zazGrid('instance')) {
            $grid.zazGrid('setData', data);
        } else {
            $grid.zazGrid({
                data: data,
                columns: login.config,
                pages: {
                    enabled: false,
                    size: 10
                },
                mode: 'tile',
                view: {
                    tile: {
                        height: 80,
                        itemsPerRow: 'auto',
                        minWidth: 130,
                        cssClass: '#role# zaz-effect zaz-effect-bar-bottom',
                        formatter: login.tileFormatter
                    }
                },
                'on-rowclick': this.handleRowClick.bind(this)
            });
        }

        $.each(searchParts, function (i, part) {
            $grid.find('tbody').highlight(part);
        });
    };

    login.handleRowClick = function (e, data) {
        var strUserId = '',
            row = data.row;
        if (row && row.userId) {
            strUserId = row.userId;
            cookieManager.create('userId', strUserId, 10080);
            window.name = settings.globals.CONSOLE + '_0_' + strUserId;
            top.location = 'index.html';
        }
    };

    login.getData = function () {
        return serviceManager.exec({
            service: 'users.get.data',
            success: function (response) {
                login.data = response;
                $.each(login.data, function (i, row) {
                    row.id = row.userId;
                });
            },
            error: function () {
                $('.grid').html('<div class="message error">There was an Error. Please try refreshing again in a few minutes...</div>');
            }
        });
    };

    return login;
});