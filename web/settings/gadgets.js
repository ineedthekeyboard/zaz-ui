'use strict';
define([
    'settings/globals'
], function (
    globals
) {
    var gadgets = {
        hash: {
            //##template
            docViewer: {
                title: 'PDF Viewer',
                desc: 'Simple PDF Viewer using IFRAME',
                icon: 'picture_as_pdf',
                iconClass: 'icon-class-pdf',
                viewers: [globals.CONSOLE],
                roles: ['user']
            },
            sampleChart: {
                title: 'Sample Chart',
                desc: 'Sample chart',
                icon: 'insert_chart',
                iconClass: 'icon-class-chart',
                cloneable: true,
                pinnable: true,
                viewers: [globals.CONSOLE],
                roles: ['user', 'admin']
            },
            dataGrid: {
                title: 'DATAGRID',
                desc: 'Demonstrates zaz-grid widget features',
                icon: 'grid_on',
                iconClass: 'icon-class-grid',
                viewers: [globals.CONSOLE],
                roles: ['user']
            },
            mapData: {
                title: 'MAP',
                desc: 'Demonstrates Google Maps API integration',
                icon: 'location_on',
                iconClass: 'icon-class-map',
                viewers: [globals.CONSOLE],
                roles: ['user']
            },
            news: {
                title: 'NEWS',
                desc: 'Demonstrates live feed using Google News API',
                icon: 'view_array',
                iconClass: 'icon-class-news',
                viewers: [globals.CONSOLE],
                persistable: true,
                roles: ['user']
            }
        },
        getUserGadgets: function () {
            //configure gadgets based on user roles
            var gadgets = [];

            switch (window.user.role) {
                case 'admin':
                    gadgets = [{
                            script: 'dataGrid',
                            zone: 'main-left',
                            active: false,
                            window: window.name
                        },
                        {
                            script: 'sampleChart',
                            zone: 'main-right',
                            active: true,
                            window: window.name
                        }
                    ];
                    break;
                case 'user':
                default:
                    gadgets = [{
                            script: 'dataGrid',
                            zone: 'main-left',
                            active: false,
                            window: window.name
                        },
                        {
                            script: 'docViewer',
                            zone: 'main-left',
                            active: false,
                            window: window.name
                        },
                        {
                            script: 'sampleChart',
                            zone: 'main-right',
                            active: true,
                            window: window.name
                        },
                        {
                            script: 'news',
                            zone: 'main-right-bottom',
                            active: true,
                            window: window.name
                        },
                        {
                            script: 'mapData',
                            zone: 'main-right-bottom',
                            active: false,
                            window: window.name
                        }
                    ];
                    break;
            }
            return gadgets;
        }
    };

    if (window.CONFIG.debug) {
        window.gadgets = gadgets;
    }

    return gadgets;
});