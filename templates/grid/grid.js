define([
    'jquery.plugins',
    'handlebars-helpers',
    'framework/framework',
    'widgets/zazGrid/zazGrid',
    'css!gadgets/{gadgetName}/{gadgetName}'
], function ($,
    HBS,
    framework) {

    return $.widget('zaz.{gadgetName}', framework.baseGadget, {
        //declare local data stores
        mode: 'grid',
        template: false,
        pageSize: 10,
        defaultConfig: null,

        _create: function () {
            //call baseGadget's super method in turn call widget factory's super method
            this._super();

            //custom method to load HTML handlebars template 
            this._renderLayout();

            //bind events to DOM elements in this gadget
            this._bindListeners();

            //start loading data call services etc.
            this._loadData();
        },

        _bindListeners: function () {
            var context = this;

            $(this.element).find('.knobs.mode .knob').on('click keyup', function (e) {
                var strMode = $(this).attr('data-mode');
                if (e.type === 'click' || e.keyCode === framework.KEYS.ENTER || e.keyCode === framework.KEYS.SPACE) {
                    if ($(this).hasClass('active')) {
                        return true;
                    }
                    context.mode = strMode;
                    context._setMode();
                }
            });

            $(this.element).find('.knobs.template .knob').on('click keyup', function (e) {
                var blnTemplate;
                if (e.type === 'click' || e.keyCode === framework.KEYS.ENTER || e.keyCode === framework.KEYS.SPACE) {
                    $(this).toggleClass('active');
                    blnTemplate = $(this).hasClass('active');

                    context.template = blnTemplate;
                    context._setTemplate();
                }
            });
        },

        _renderLayout: function () {
            //load handlebars template
            var strTemplate = HBS['gadgets/{gadgetName}/{gadgetName}']({
                main: true
            });

            //apply template markup to gadget
            this.element.html(strTemplate);

            //store grid element in store
            this.$grid = this.element.find('.grid');
        },

        _loadData: function () {
            var context = this;

            //show the loading message
            this.showLoader();

            //call get to make service calls to get data
            this._getConfig().done(function () {
                //apply preferences
                context._applyPreferences();

                //modify data formatting 
                context._modifyConfig();

                //get data
                context._getData().done(function () {
                    context.hideLoader();
                });
            });
        },

        _modifyConfig: function () {
            $.each(this.options.config, function (i, column) {
                switch (column.id) {
                    case 'color':
                        column.formatter = function (data) {
                            var width = (data.cost / 60000) * 100;
                            return '<div style="min-width: 50px;background-color:' + data.color + '; width: ' + width + 'px;">&nbsp;</div>';
                        };
                        break;
                    case 'cost':
                        column.formatter = function (data) {
                            return formatter.formatMoney(data.cost, 0, true);
                        };
                        break;
                    default:
                        break;
                }
            });
        },

        _getConfig: function () {
            var context = this;

            function errorConfigResponse(response, textStatus) {
                context.$grid.html('<div class="message error">' + textStatus + '</div>');
            }

            function getConfigResponse(response) {
                context.defaultConfig = response;
            }

            return framework.serviceManager.exec({
                service: '{gadgetName}.get.config',
                success: getConfigResponse,
                error: errorConfigResponse
            }).always(function () {
                context.hideLoader();
            });
        },

        _getData: function () {
            var context = this;

            function errorDataResponse(response, textStatus) {
                context.$grid.html('<div class="message error">' + textStatus + '</div>');
            }

            function getDataResponse(response) {
                context.data = response;
                context._renderData();
            }

            //show the loading message
            context.showLoader();

            //return a promise 
            return framework.serviceManager.exec({
                service: '{gadgetName}.get.data',
                success: getDataResponse,
                error: errorDataResponse
            }).always(function () {
                context.hideLoader();
            });
        },

        _renderData: function () {
            var context = this;

            if (this._grid) {
                this._grid.setData(this.options.data);
            } else {
                context.$grid.zazGrid({
                    data: this.data,
                    columns: this.config,
                    defaultColumns: this.defaultConfig,
                    pages: {
                        enabled: true,
                        position: 'top',
                        page: 1,
                        size: this.pageSize || 20,
                        sizes: [5, 10, 20, 50]
                    },
                    mode: this.mode || 'grid',
                    virtual: false,
                    view: {
                        grid: {
                            height: 35
                        },
                        tile: {
                            height: 145,
                            minWidth: 200,
                            itemsPerRow: 'auto'
                        }
                    },  
                    'on-rowclick': function (e, data) {
                        context._rowClick(data);
                    },
                    'on-renderrow': function (e, data) {
                        context._renderRow(data);
                    },
                    'on-rendercell': function (e, data) {
                        context._renderCell(data);
                    }
                });
                this._grid = context.$grid.zazGrid('instance');
            }
        },

        _renderCell: function (data) {
            // console.log(data)
        },

        _renderRow: function (data) {
            // console.log(data)
        },

        _rowClick: function (data) {
            // console.log(data)
        },

        _setMode: function () {
            this.element.find('.knobs.mode .knob').removeClass('active');
            this.element.find('.knobs.mode .knob[data-mode="' + this.mode + '"]').addClass('active');

            this.preferences.mode = this.mode;
            this._grid.setMode(this.mode);
            this.setPreferences();
        },

        _setConfig: function (data) {
            this.preferences.config = data.columns;
            this.setPreferences();
        },

        _setPageSize: function (data) {
            this.preferences.pageSize = data.pageSize;
            this.setPreferences();
        },

        _applyPreferences: function () {
            var strMode = this.preferences.mode || this.mode;
            var intPageSize = this.preferences.pageSize || this.pageSize;
            var config = this.preferences.config || this.defaultConfig;

            this.mode = strMode;
            this.pageSize = intPageSize;
            this.config = config;

            this.element.find('.knobs.mode .knob').removeClass('active');
            this.element.find('.knobs.mode .knob[data-mode="' + this.mode + '"]').addClass('active');
        },

        _setTemplate: function () {

            this.preferences.template = this.template;
            this.setPreferences();
            this.$grid.remove();
            this._grid = null;
            this._create();
        }
    });
});