define([
    'jquery.plugins',
    'handlebars-helpers',
    'framework/framework',
    'common/formatter',
    'widgets/zazGrid/zazGrid',
    'css!gadgets/dataGrid/dataGrid'
], function ($,
    HBS,
    framework,
    formatter) {


    return $.widget('zaz.dataGrid', framework.baseGadget, {
        _create: function () {
            this._super();
            this._renderLayout();
            this._loadData();
            this._bindListeners();
        },

        _bindListeners: function () {
            var context = this;

            this.element.off('click', '.filter');
            this.element.on('click', '.filter', function () {
                $(this).toggleClass('active');
                context._renderData();
            });

            this.element.off('change', '.filters-selector');
            this.element.on('change', '.filters-selector', function () {
                context._renderFilters();
                context._renderData();
            });
        },

        _renderLayout: function () {

            var strHtml = HBS['gadgets/dataGrid/dataGrid']({
                items: framework.languageManager.translations(),
                main: true
            });
            this.element.append(strHtml);

            this.$controls = this.element.find('.controls');
            this.$grid = this.element.find('.grid');
        },

        _loadData: function () {
            var context = this;

            this.showLoader();

            this._getConfig().done(function () {
                context._modifyConfig();
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
                context.options.config = response;
            }

            return framework.serviceManager.exec({
                service: 'dataGrid.get.config',
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
                context._renderColumns();
                context._renderFilters();
                context._renderData();
            }

            return framework.serviceManager.exec({
                service: 'dataGrid.get.data',
                success: getDataResponse,
                error: errorDataResponse
            }).always(function () {
                context.hideLoader();
            });
        },

        _renderColumns: function () {
            var context = this,
                data = $.extend({}, context.data[0]);

            delete data.id;

            //render filters
            var strHtml = HBS['gadgets/dataGrid/dataGrid']({
                blnColumns: true,
                columns: data
            });
            context.element.find('.filters-selector').html(strHtml);
        },

        _renderFilters: function () {
            var context = this,
                strField = context.element.find('.filters-selector select').val();

            //create filters
            context.filters = {};
            $.each(context.data, function (i, row) {
                context.filters[row[strField]] = context.filters[row[strField]] || [];
                context.filters[row[strField]].push(row);
            });
            context.filter = Object.keys(context.filters)[0];

            //render filters
            var strHtml = HBS['gadgets/dataGrid/dataGrid']({
                blnFilters: true,
                filters: context.filters
            });
            context.element.find('.filters').html(strHtml);
        },

        _renderData: function () {
            var context = this,
                filters,
                data = [];

            filters = this.element.find('.filter.active').map(function () {
                return $(this).attr('data-filter')
            });

            $.each(filters, function (i, filter) {
                data = data.concat(context.filters[filter]);
            });

            if (this._grid) {
                this._grid.setData(data);
            } else {
                context.$grid.zazGrid({
                    data: data,
                    columns: this.options.config,
                    defaultColumns: null,
                    pages: {
                        enabled: true,
                        position: 'both',
                        page: 1,
                        size: 10
                    },
                    columnPicker: true,
                    search: {
                        enabled: true,
                        position: 'top',
                        filter: true
                    },
                    summary: {
                        enabled: true,
                        position: 'bottom'
                    },
                    mode: 'grid',
                    view: {
                        grid: {
                            height: 35
                        },
                        tile: {
                            height: 145,
                            minWidth: 200,
                            itemsPerRow: 'auto'
                        }   
                    }
                });
                this._grid = context.$grid.zazGrid('instance');
            }
        },

        _rowClicked: function (row) {
            // console.log(row);
        }
    });
});