define([
    'jquery.plugins',
    'handlebars-helpers',
    'common/formatter',
    'framework/framework',
    'highcharts',
    'highcharts-3d',
    'highcharts-drag3d',
    'css!gadgets/sampleChart/sampleChart'
], function ($,
    HBS,
    formatter,
    framework,
    Highcharts) {


    return $.widget('zaz.sampleChart', framework.baseGadget, {
        data: null,
        view: 'columns',

        _resize: function () {
            if (this.chart) {
                this.chart.setSize(null, null);
            }
        },

        _create: function () {
            this._super();
            this._renderLayout();
            this._loadData();
            this._bindListeners();
            this._resize();
        },

        _bindListeners: function () {
            var context = this;

            this.element.off('click', '.knob');
            this.element.on('click', '.knob', function () {
                var strView = $(this).attr('data-view');

                if ($(this).hasClass('active')) {
                    return true;
                }
                context.view = strView;
                context._setView();
                context._renderData();
            });
        },

        _renderLayout: function () {
            var strHtml = HBS['gadgets/sampleChart/sampleChart']({
                items: framework.languageManager.translations()
            });
            this.element.append(strHtml);

            this.$chart = this.element.find('.chart');
            this._applyPreferences();
        },

        _loadData: function () {
            var context = this,
                strView = 'columns';

            this.showLoader();

            this.view = this.view || strView;
            context._renderData();

            this.hideLoader();
        },

        _renderData: function () {
            var columns = {
                    chart: {
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            viewDistance: 40,
                            depth: 45,
                            drag: {
                                enabled: true,
                                flipAxes: true,
                                snap: 15,
                                animateSnap: true
                            },
                        }
                    },
                    title: {
                        text: 'Total fruit consumtion, grouped by gender'
                    },

                    xAxis: {
                        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                    },

                    yAxis: {
                        allowDecimals: false,
                        min: 0,
                        title: {
                            text: 'Number of fruits'
                        }
                    },

                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.x + '</b><br/>' +
                                this.series.name + ': ' + this.y + '<br/>' +
                                'Total: ' + this.point.stackTotal;
                        }
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal',
                            depth: 40
                        }
                    },
                    series: [{
                        name: 'John',
                        data: [5, 3, 4, 7, 2],
                        stack: 'male'
                    }, {
                        name: 'Joe',
                        data: [3, 4, 4, 2, 5],
                        stack: 'male'
                    }, {
                        name: 'Jane',
                        data: [2, 5, 6, 2, 1],
                        stack: 'female'
                    }, {
                        name: 'Janet',
                        data: [3, 0, 4, 4, 3],
                        stack: 'female'
                    }]
                },
                pie = {
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0,
                            drag: {
                                enabled: true,
                                flipAxes: true,
                                snap: 15,
                                animateSnap: true
                            },
                        }
                    },
                    title: {
                        text: 'Total fruit consumtion'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                          allowPointSelect: true,
                          cursor: 'pointer',
                          dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                          }
                        }
                    },
                    series: [{
                        name: 'Fruits',
                        colorByPoint: true,
                        data: [{
                          name: 'Apples',
                          y: 13,
                          sliced: true,
                          selected: true
                        }, {
                          name: 'Oranges',
                          y: 12
                        }, {
                          name: 'Pears',
                          y: 18
                        }, {
                          name: 'Grapes',
                          y: 15
                        }, {
                          name: 'Bananas',
                          y: 11
                        }]
                    }]
                };

            this.element.find('.knobs .knob').removeClass('active');
            this.element.find('.knobs .knob[data-view="' + this.view + '"]').addClass('active');

            Highcharts.theme = {
                colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
                    '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
                ],
                chart: {
                    backgroundColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 1,
                            y2: 1
                        },
                        stops: [
                            [0, '#2a2a2b'],
                            [1, '#3e3e40']
                        ]
                    },
                    style: {
                        fontFamily: '\'Unica One\', sans-serif'
                    },
                    plotBorderColor: '#606063'
                },
                title: {
                    style: {
                        color: '#E0E0E3',
                        textTransform: 'uppercase',
                        fontSize: '12pt'
                    }
                },
                subtitle: {
                    style: {
                        color: '#E0E0E3',
                        textTransform: 'uppercase'
                    }
                },
                xAxis: {
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    title: {
                        style: {
                            color: '#A0A0A3'

                        }
                    }
                },
                yAxis: {
                    gridLineColor: '#707073',
                    labels: {
                        style: {
                            color: '#E0E0E3'
                        }
                    },
                    lineColor: '#707073',
                    minorGridLineColor: '#505053',
                    tickColor: '#707073',
                    tickWidth: 1,
                    title: {
                        style: {
                            color: '#A0A0A3'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    style: {
                        color: '#F0F0F0'
                    }
                },

            };

            // Apply the theme
            Highcharts.setOptions(Highcharts.theme);
            this.chart = Highcharts.chart($('.chart')[0], this.view === 'columns' ? columns : pie);
        },

        _setView: function () {
            this.element.find('.knobs .knob').removeClass('active');
            this.element.find('.knobs .knob[data-view="' + this.view + '"]').addClass('active');

            this.preferences.view = this.view;
            this.setPreferences();
        },

        _applyPreferences: function () {
            var strView = this.preferences.view || this.view;

            this.view = strView;
            this.element.find('.knobs .knob').removeClass('active');
            this.element.find('.knobs .knob[data-view="' + this.view + '"]').addClass('active');
        }
    });
});