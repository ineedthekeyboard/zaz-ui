define([
    'jquery.plugins',
    'framework/keys',
    'common/utility',
    'widgets/zazMenu/zazMenu',
    'css!widgets/zazGrid/zazGrid'
], function ($,
    keys,
    utility,
    zazMenu) {

    /**
     * @namespace zazGrid  
     * @classdesc A grid widget based on table tag with high acceissiblity compliance
     * */

    return $.widget('zaz.zazGrid', {
        options: {
            label: {
                default: 'Zaz Grid',
                noData: 'No records matched'
            },
            data: null,
            columns: null,
            defaultColumns: null,
            pages: {
                enabled: true,
                position: 'top',
                page: 1,
                size: 25,
                sizes: [5, 10, 25, 50, 100]
            },
            mode: 'grid',
            view: {
                grid: {
                    height: 25,
                    styleFormat: '',
                    cssClass: ''
                },
                tile: {
                    styleFormat: '',
                    cssClass: '',
                    height: 200,
                    minWidth: 300,
                    itemsPerRow: 1, //'auto'
                    formatter: null
                },
                minWidth: 500
            },
            header: true
        },

        _create: function () {
            this._renderZazGrid();
        },

        _renderZazGrid: function () {
            this._setDefaults();
            this._renderControls();
            this._renderGrid();
            this._bindListeners();
        },

        //#region exposed methods
        setData: function (data, mode) {
            this._setData(data, mode);
        },
        setPage: function (page) {
            this._setPage(page);
        },
        setSize: function (size) {
            this._setSize(size);
        },
        setMode: function (mode) {
            this._setMode(mode);
        },
        //#endregion

        //#region defaults
        _setStyles: function () {
            this.element.addClass('zaz-grid').attr('data-mode', this.options.mode);
        },

        _setIds: function () {
            var hasId = false,
                firstRow = this.options.data && this.options.data[0];

            //ensure data has an id as well
            $.each(firstRow, function (column) {
                if (column === 'id') {
                    hasId = true;
                    return true;
                }
            });

            //no id column found, generate one for each row of data
            if (!hasId) {
                $(this.options.data).each(function (i, row) {
                    row.id = i;
                });
            }
        },

        _setColumns: function () {
            var context = this,
                firstDataRow = this.options.data && this.options.data[0];

            if (!this.options.columns) {
                this.options.columns = [];
                $.each(firstDataRow, function (column) {
                    context.options.columns.push({
                        'cssClass': 'left',
                        'id': column,
                        'name': column,
                        'width': 100,
                        'fixed': false,
                        'visible': true,
                        'sortable': true,
                        'sort': '',
                    });
                });
            } else {
                $.each(this.options.columns, function (i, column) {
                    column.name = column.name || column.id;
                    column.width = column.width || 45;
                    column.fixed = column.fixed || false;
                    column.visible = (column.visible === undefined) ? true : column.visible;
                    column.sortable = (column.sortable === undefined) ? true : column.sortable;
                    column.sort = column.sort || '';
                    column.cssClass = column.cssClass || 'left';
                });
            }
        },

        _setDefaultColumns: function () {
            this.options.defaultColumns = this.options.defaultColumns || this.options.columns.map(function (obj) {
                return $.extend({}, obj);
            });
        },

        _setModeDefaults: function () {
            if (window.mobile) {
                this.options.mode = 'tile';
            }
            this.options.originalMode = this.options.mode;
        },

        _setTouchDefaults: function () {
            if (window.mobile) {
                this.options.pages.position = 'top'
            }
        },

        _setSorts: function () {
            var columns = this.options.columns,
                sorts = $.map(columns, function (row, i) {
                    if (row.sort && row.visible) {
                        return {
                            id: row.id,
                            sort: row.sort,
                            key: row.key || row.id,
                            sortOrder: row.sortOrder
                        };
                    }
                });

            sorts = sorts.sort(function (a, b) {
                return a.sortOrder > b.sortOrder;
            });

            $.each(sorts, function (i, sort) {
                sort.sortOrder = i + 1;
            });

            $.each(this.options.columns, function (i, col) {
                $.each(sorts, function (i, sort) {
                    if (col.id === sort.id) {
                        col.sortOrder = sort.sortOrder;
                    }
                });
            });

            this.options.sorts = sorts;
        },

        _setViewData: function () {
            //make a copy of data for performing scoped sorting, search
            this.options.viewData = this.options.data.slice();
        },
        //#endregion

        _setDefaults: function () {
            this._setModeDefaults();
            this._setTouchDefaults();
            this._setStyles();
            this._setIds();
            this._setColumns();
            this._setDefaultColumns();
            this._setSorts();
            this._setViewData();
        },

        //#region internal map for exposed methods
        _setData: function (data) {
            this.options.data = data;
            this._setViewData();

            //reset to page 1
            this.options.pages.page = 1;
            //sort the searched/filtered data;
            this._sortData();
            //now render the data
            this._renderData();
        },

        _setPage: function (numPage) {
            var total = this.options.viewData.length,
                size = this.options.pages.size,
                page = this.options.pages.page,
                pages = Math.ceil(total / size);

            //if not page < 1 and page not more than pages return
            if (!(numPage > 0 && numPage <= pages)) {
                return;
            }

            //check page number has changed
            if (page !== numPage) {
                //set to new page
                this.options.pages.page = numPage;
                //now render the data
                this._renderData();
            }
        },

        _setSize: function (size) {
            //check page size has changed
            if (this.options.pages.size !== size) {
                //reset to page 1
                this.options.pages.page = 1;
                //set to new size
                this.options.pages.size = size;
                //now render the data
                this._renderData();
            }
        },

        _setMode: function (mode) {
            this.options.mode = mode;
            this._renderZazGrid();
        },
        //#endregion

        //#region table markup
        _renderControls: function () {
            var arrHtml = [],
                strHtml;

            if (this.options.pages.enabled) {
                if (this.options.mode === 'grid') {
                    arrHtml.push('<div class="zaz-grid-display">Displaying <span class="start">1</span> to <span class="end">10</span> of <span class="total">50</span> items</div>');
                } else {
                    arrHtml.push('<div class="zaz-grid-display"><span class="start">1</span> to <span class="end">10</span> of <span class="total">50</span></div>');
                }
                arrHtml.push('<div class="zaz-grid-page">');
                arrHtml.push('<select class="page-sizes" title="Items per page">');
                $.each(this.options.pages.sizes, function (i, size) {
                    arrHtml.push('  <option value="' + size + '">' + size + '</option>');
                })
                arrHtml.push('</select>');
                arrHtml.push('<button class="action" data-action="page-first" title="Go to First page"><i class="material-icons md-light">arrow_back</i></button>');
                arrHtml.push('<button class="action" data-action="page-prev" title="Go to Previous page"><i class="material-icons md-light">keyboard_arrow_left</i></button>');
                arrHtml.push('<button class="page-current" title="Current page">&nbsp;</button>');
                arrHtml.push('<button class="action" data-action="page-next" title="Go to Next page"><i class="material-icons md-light">keyboard_arrow_right</i></button>');
                arrHtml.push('<button class="action" data-action="page-last" title="Go to Last page"><i class="material-icons md-light">arrow_forward</i></button>');
                arrHtml.push('</div>');
                strHtml = arrHtml.join('');

                switch (this.options.pages.position) {
                    case 'bottom':
                        this.$controls2 = $('<div class="zaz-grid-controls bottom"></div>');
                        this.element.html(this.$controls2);
                        break;
                    case 'both':
                        this.$controls1 = $('<div class="zaz-grid-controls top"></div>');
                        this.element.html(this.$controls1);
                        this.$controls2 = $('<div class="zaz-grid-controls bottom"></div>');
                        this.element.append(this.$controls2);
                        break;
                    case 'top':
                    default:
                        this.$controls1 = $('<div class="zaz-grid-controls top"></div>');
                        this.element.html(this.$controls1);
                        break;
                }
                if (this.$controls1) {
                    this.$controls1.html(strHtml);
                    utility.setKeyLoop(this.$controls1, this.$controls1.find('button'));
                }
                if (this.$controls2) {
                    this.$controls2.html(strHtml);
                    utility.setKeyLoop(this.$controls2, this.$controls2.find('button'));
                }
            }
        },

        _renderTable: function () {
            //remove if table already exists
            this.element.find('table').remove();

            this.$table = $('<table class="zaz-grid-table" role="grid"></table>');
            this.$body = $('<tbody></tbody>');
            this.$table.append(this.$body);

            if (this.options.pages.enabled) {
                if (this.options.pages.position === 'top' || this.options.pages.position === 'both') {
                    this.$controls1.after(this.$table);
                } else {
                    this.element.prepend(this.$table);
                }
            } else {
                this.element.html(this.$table);
            }
        },

        _renderHeader: function () {
            var strHtml = '',
                prevColumn;

            if (!this.options.header || this.options.mode !== 'grid') {
                return true;
            }

            this.$header = $('<thead role="row"></thead>');
            $.each(this.options.columns, function (i, col) {
                var id = col.id || '',
                    cssClass = col.cssClass || '',
                    name = col.name || '',
                    sort = col.sort || '',
                    sortable = col.sortable || '',
                    isSortable = sortable ? ' sortable' : '';

                if (!col.visible || col.hidden) {
                    return true;
                }

                strHtml += '<th role="columnheader" data-column="' + id + '"';

                if (sort) {
                    strHtml += 'data-sort="' + sort + '" ' + 'aria-sort="' + (sort === 'asc' ? 'ascending' : 'descending') + '"';
                }
                strHtml += sortable ? 'data-sortable="' + sortable + '">' : '>';
                strHtml += '<div class="cell ' + cssClass + '" style="width:' + (col.width ? col.width + 'px' : 'auto') + ';" tabindex="0">';
                strHtml += '<div class="label"';
                strHtml += (col.label ? ' aria-label="' + col.label + isSortable + '"' : '') + '>' + name;
                strHtml += '</div>';
                strHtml += '<div class="sort-seq"></div>';
                strHtml += '<div class="sort-icon"></div>';
                strHtml += '</div>';
                strHtml += '</th>';
                prevColumn = col;
            });

            this.$header.append('<tr>' + strHtml + '</tr>');
            this.$body.before(this.$header);
        },

        //#endregion

        _renderGrid: function () {
            var context = this;

            //apply table markup
            this._renderTable();
            this._renderHeader();

            //update display of sort icon/sequence on header
            this._renderSorts();

            //sort the searched/filtered data;
            this._sortData();

            //finally render the data after search/filter
            this._renderData();

            //ensure sizes are good for non-compliant browsers
            this._resize(false);
            this._bindGridListeners();
        },

        //#region render data 
        _renderGridRows: function () {
            var context = this,
                columns = this.options.columns,
                rowHeight = this.options.view.grid.height,
                strHeightStyle = 'height:' + rowHeight + 'px;',
                cssClass = this.options.view.grid.cssClass,
                strClassStyle = cssClass,
                $tr,
                data,
                totalRows = this.dataSet.length;

            data = this.dataSet;

            $.each(data, function (r, row) {
                if (cssClass && cssClass.indexOf('#') > -1) {
                    for (key in row) {
                        if (row.hasOwnProperty(key) && cssClass.indexOf('#' + key + '#') > -1) {
                            strClassStyle = cssClass.replace('#' + key + '#', row[key]);
                        }
                    }
                }

                $tr = $('<tr role="row" class="row ' + strClassStyle + '" style="' + strHeightStyle + '" data-id="' + row.id + '"></tr>');
                $.each(columns, function (c, column) {
                    if (!column.visible || column.hidden) {
                        return true;
                    }
                    var $cell = context._renderCell(row, column);
                    $tr.append($cell);
                });
                context.$body.append($tr);
                context._trigger('on-renderrow', null, {
                    element: $tr,
                    row: row
                });
            });
        },

        _renderCell: function (row, column) {
            var cellHtml,
                rowHeight = this.options.view.grid.height,
                styleFormat = this.options.view.grid.styleFormat,
                strFormatStyle = styleFormat,
                strWidthStyle = 'width:' + column.width + 'px;',
                key;

            if (styleFormat && styleFormat.indexOf('#') > -1) {
                for (key in row) {
                    if (row.hasOwnProperty(key) && styleFormat.indexOf('#' + key + '#') > -1) {
                        strFormatStyle = styleFormat.replace('#' + key + '#', row[key]);
                    }
                }
            }

            cellHtml = '<td data-column="' + column.id + '" role="gridcell">';
            cellHtml = cellHtml + '<div class="cell" style="' + strFormatStyle + strWidthStyle + '">';
            cellHtml = cellHtml + this._formatCell(row, column);
            cellHtml = cellHtml + '</div>';
            cellHtml = cellHtml + '</td>';
            return $(cellHtml);
        },

        _renderTileRows: function () {
            var context = this,
                columns = this.options.columns,
                tileHeight = this.options.view.tile.height,
                strHeightStyle = 'height:' + tileHeight + 'px;',
                styleFormat = this.options.view.tile.styleFormat,
                strFormatStyle = styleFormat,
                cssClass = this.options.view.tile.cssClass,
                strClassStyle = cssClass,
                strWidthStyle = 'min-width:' + this.options.view.tile.minWidth + 'px;',
                data,
                totalRows = this.dataSet.length;

            data = this.dataSet;

            $.each(data, function (r, row) {
                var $tr = '',
                    $cell;

                $tr = $('<tr role="row" class="row" style="' + strHeightStyle + '"></tr>');
                context.$body.append($tr);
                $.each(row, function (i, rowItem) {
                    var key;
                    if (styleFormat && styleFormat.indexOf('#') > -1) {
                        for (key in rowItem) {
                            if (rowItem.hasOwnProperty(key) && styleFormat.indexOf('#' + key + '#') > -1) {
                                strFormatStyle = styleFormat.replace('#' + key + '#', rowItem[key]);
                            }
                        }
                    }
                    if (cssClass && cssClass.indexOf('#') > -1) {
                        for (key in rowItem) {
                            if (rowItem.hasOwnProperty(key) && cssClass.indexOf('#' + key + '#') > -1) {
                                strClassStyle = cssClass.replace('#' + key + '#', rowItem[key]);
                            }
                        }
                    }
                    $td = $('<td role="gridcell"><div class="cell ' + strClassStyle + '" data-id="' + rowItem.id + '" tabindex="0" style="' + strWidthStyle + strFormatStyle + '"></div></td>');
                    $cell = context._renderTileCell(rowItem);
                    $td.find('.cell').append($cell);
                    $tr.append($td);
                    context._trigger('on-rendercell', null, {
                        element: $td.find('.cell'),
                        row: rowItem
                    });
                });
            });
            window.setTimeout(function() {
                var maxWidth = context.$body.find('tr.row:first td:first').width();
                context.$body.find('tr.row:last td').css('max-width', maxWidth);
            }, 100);
        },

        _renderTileCell: function (row) {
            var formatter = this.options.view.tile.formatter,
                cellHtml = '',
                context = this;

            switch (typeof formatter) {
                case 'function':
                    cellHtml = formatter(row);
                    break;
                case 'string':
                    cellHtml = formatter;
                    break;
                default:
                    $.each(this.options.columns, function (i, column) {
                        if (!column.visible || column.hidden) {
                            return true;
                        }
                        cellHtml = cellHtml + '<div data-column="' + column.id + '">';
                        cellHtml = cellHtml + '<div class="name">' + column.name + '</div>';
                        cellHtml = cellHtml + '<div class="value">' + context._formatCell(row, column) + '</div>';
                        cellHtml = cellHtml + '</div>';
                    });
                    break;
            }

            return $(cellHtml);
        },

        _formatCell: function (row, column) {
            var cellHtml;

            if (column.formatter && typeof column.formatter === 'function') {
                cellHtml = column.formatter(row) || '';
            } else {
                cellHtml = row[column.id] || '';
            }
            return cellHtml;
        },

        _setLabel: function () {
            if (this.options.viewData.length) {
                this.$table.attr({
                    'aria-label': this.options.label.default
                });
                this.$table.removeClass('no-data');
            } else {
                this.$table.attr({
                    'aria-label': this.options.label.noData
                });
                this.$table.addClass('no-data');
                this.$body.html('<tr rol="row" class="row"><td><div class="cell nodata">' + this.options.label.noData + '</div></td></tr>');
            }
        },
        //#endregion

        _renderData: function () {
            var context = this,
                page, pageSize, start, end, data;

            page = this.options.pages.page;
            pageSize = this.options.pages.enabled ? this.options.pages.size : this.options.data.length;
            start = (page - 1) * pageSize;
            end = start + pageSize;
            data = this.options.viewData.slice(start, end || this.options.viewData.length);

            this._updateDataSet(data);
            this._renderRows();

            //set label
            this._setLabel();
            this._trigger('on-renderdata', null, {});
        },

        _updateDataSet: function (data) {
            var context = this,
                viewHeight = 0,
                totalRows = 0,
                rowHeight = 0,
                totalHeight = 0,
                padding = 0;

            this.dataSet = data;

            function setTilesPerRow() {
                var tile = context.options.view.tile,
                    cellWidth = tile.minWidth,
                    bodyWidth = context.$body.width() - 20;

                context.tilesPerRow = Math.floor(bodyWidth / cellWidth) - 1 || 1;
                context.tilesPerRow = tile.itemsPerRow === 'auto' ? context.tilesPerRow : tile.itemsPerRow || 1;
            }

            function chunkArray(arr, n) {
                return arr.slice(0, (arr.length + n - 1) / n | 0).
                map(function (c, i) {
                    return arr.slice(n * i, n * i + n);
                });
            }

            if (this.options.mode === 'tile') {
                setTilesPerRow();
                this.dataSet = chunkArray(this.dataSet, this.tilesPerRow);
            }
        },

        _renderRows: function () {
            var context = this,
                data = this.dataSet,
                intScroll;

            // only remove data rows
            this.$body.find('tr.row').remove();

            if (context.options.mode === 'grid') {
                context._renderGridRows();
            } else {
                context._renderTileRows();
            };

            // intScroll = this.scrollSign ? this.scrollSign * this.$body.height() : 0;
            // this.$body.scrollTop(intScroll);

            this._updateControls();
        },

        _renderSorts: function () {
            var context = this,
                sortCount = context.options.sorts.length;

            if (!this.options.header || this.options.mode !== 'grid') {
                return true;
            }

            context.$header.find('th').removeAttr('data-sort');
            context.$header.find('th').removeAttr('aria-sort');
            context.$header.find('th .sort-seq').html('');

            $.each(this.options.columns, function (i, col) {
                var id = col.id,
                    sort = col.sort,
                    sortOrder = col.sortOrder,
                    $header = context.$header.find('th[data-column="' + id + '"]'),
                    sortText;

                if (sort) {
                    $header.attr('data-sort', sort);

                    sortText = (sort === 'asc') ? 'ascending' : 'descending';
                    $header.attr('aria-sort', sortText);
                    if (sortCount > 1) {
                        $header.find('.sort-seq').text(sortOrder);
                    }
                }
            });
        },

        _updateControls: function () {
            var context = this;

            setPagedData = function ($control) {
                var page = context.options.pages.page,
                    size = context.options.pages.size,
                    total = context.options.viewData.length,
                    start = (page - 1) * size + 1,
                    end = Math.min(start + size - 1, total);

                $control.find('.start').html(start);
                $control.find('.end').html(end);
                $control.find('.total').html(total);
                $control.find('.page-sizes').val(size);
                $control.find('.page-current').html(page);
            }

            update = function ($control) {
                setPagedData($control);
            }
            if (this.$controls1) {
                update(this.$controls1);
            }
            if (this.$controls2) {
                update(this.$controls2);
            }
        },

        _handleSort: function ($elem) {
            var context = this,
                id = $elem.attr('data-column'),
                columns = context.options.columns,
                oldSort,
                newSort;

            $.each(columns, function (i, col) {
                if (col.id === id) {
                    oldSort = col.sort;
                }
                delete col.sort;
            });

            $.each(columns, function (i, col) {
                if (col.id === id) {
                    newSort = (oldSort === 'asc') ? 'desc' : 'asc';
                    col.sort = newSort;
                    return true;
                }
                if (!col.sort) {
                    return true;
                }
            });

            this.options.pages.page = 1;

            //update sort data
            this._setSorts();
            //update sort icons/sequence on grid
            this._renderSorts();
            //perform sort on the data
            this._sortData();
            //now render the data
            this._renderData();
        },

        _sortData: function () {
            var context = this;

            function compareFunction(dataRow1, dataRow2) {
                var i, l, sign, field, value1, value2, result, cols = context.options.sorts;
                for (i = 0, l = cols.length; i < l; i++) {
                    field = cols[i].key || cols[i].id;
                    sign = cols[i].sort === 'asc' ? 1 : -1;
                    value1 = dataRow1[field];
                    value2 = dataRow2[field];
                    result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                    if (result !== 0) {
                        return result;
                    }
                }
                return 0;
            }
            this.options.viewData.sort(compareFunction);
        },

        _getRowData: function (rowId) {
            //hashmap would result in performance here - consider changing this
            var dataRow = null;
            $(this.options.viewData).each(function (i, row) {
                if (row.id === rowId) {
                    dataRow = row;
                    return false;
                }
            });
            return dataRow;
        },

        _resize: function (blnLoadData) {
            var intTop = 0,
                intBottom = 0,
                intControlsTop = 0;

            //get heights of all headers and footers
            //if (!window.isChrome) {
            this.$table.find('thead').each(function (i, thead) {
                intTop = intTop + $(thead).outerHeight();
            });

            this.$body.css({
                'top': intTop,
                'bottom': intBottom
            });

            if (blnLoadData) {
                this._renderData();
            }
            //}
        },

        _handlePage: function (strAction) {
            var total = this.options.viewData.length,
                size = this.options.pages.size,
                page = this.options.pages.page,
                pages = Math.ceil(total / size);

            switch (strAction) {
                case 'page-first':
                    page = 1;
                    break;
                case 'page-prev':
                    page = page - 1;
                    break;
                case 'page-next':
                    page = page + 1;
                    break;
                case 'page-last':
                    page = pages;
                    break;
                default:
                    break;
            }
            this._setPage(page);
        },

        _handleRowClick: function (rowId) {
            var row = this._getRowData(rowId);
            this._trigger('on-rowclick', null, {
                row: row
            });
        },

        _bindListeners: function () {
            var context = this,
                lastScrollTop = 0;

            $(window).on('resized', function () {
                context._resize(true);
            });

            if (this.options.pages.enabled) {
                this.element.off('change', '.zaz-grid-page .page-sizes');
                this.element.on('change', '.zaz-grid-page .page-sizes', function (e) {
                    e.stopPropagation();
                    var size = parseInt($(this).val());
                    context._setSize(size);
                });

                this.element.off('click', '.zaz-grid-page button.action');
                this.element.on('click', '.zaz-grid-page button.action', function (e) {
                    e.stopPropagation();
                    var strAction = $(this).attr('data-action');
                    context._handlePage(strAction);
                });

                this.element.off('keyup', '.zaz-grid-page button.page-current');
                this.element.on('keyup', '.zaz-grid-page button.page-current', function (e) {
                    e.stopPropagation();

                    switch (e.keyCode) {
                        case keys.UP:
                            context._handlePage('page-prev');
                            break;
                        case keys.DOWN:
                        case keys.ENTER:
                        case keys.SPACE:
                            context._handlePage('page-next');
                        default:
                            break;
                    }
                });
            }
        },

        _bindGridListeners: function () {
            var context = this;

            //scroll event cannot be delegated
            this.$body.off('scroll');
            this.$body.on('scroll', function () {
                if (context.options.mode === 'grid') {
                    if (context.options.header) {
                        context.$header.css({
                            'margin-left': -this.scrollLeft
                        });
                    }
                }
            });

            if (this.options.mode === 'grid') {
                this.$body.off('click', 'tr');
                this.$body.on('click', 'tr', function () {
                    var rowId = $(this).attr('data-id');
                    if (rowId) {
                        // rowId = parseInt(rowId);
                        context._handleRowClick(rowId);
                    }
                });
            }

            if (this.options.mode === 'tile') {
                this.$body.off('click', '.cell');
                this.$body.on('click', '.cell', function () {
                    var rowId = $(this).attr('data-id');
                    if (rowId) {
                        // rowId = parseInt(rowId);
                        context._handleRowClick(rowId);
                    }
                });
            }

            if (this.options.header && this.options.mode === 'grid') {
                this.$header.off('keyup', 'th');
                this.$header.on('keyup', 'th', function (e) {
                    var $elem = $(this),
                        $nextElem = e.shiftKey ? $elem.prev() : $elem.next();

                    if (e.keyCode === keys.TAB && $nextElem.length) {
                        context.columnOffsetLeft = $nextElem.offset().left;
                    }
                });

                this.$header.off('focus', 'th');
                this.$header.on('focus', 'th', function () {
                    var offsetLeft = context.columnOffsetLeft - context.element.offset().left,
                        direction = offsetLeft < 0 ? -1 : 1,
                        delta = offsetLeft < 0 ? offsetLeft : context.element.width() - offsetLeft - $(this).outerWidth();

                    if (delta < 0) {
                        context.element[0].scrollLeft = 0;
                        context.$body[0].scrollLeft = context.$body[0].scrollLeft - delta * direction;
                    }

                    delete context.columnOffsetLeft;
                });

                this.$header.off('keyup', 'th[data-sortable="true"]');
                this.$header.on('keyup', 'th[data-sortable="true"]', function (e) {
                    if (e.which === keys.ENTER || e.which === keys.SPACE) {
                        context._handleSort($(this));
                    }
                });

                this.$header.off('click', 'th[data-sortable="true"]');
                this.$header.on('click', 'th[data-sortable="true"]', function (e) {
                    $(this).focus();
                    context._handleSort($(this));
                });
            }
        }
    });
});