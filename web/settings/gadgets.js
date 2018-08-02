'use strict';
define([
    'settings/globals'
], function (
    globals
) {
    var gadgets = {
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
    };

    if (window.CONFIG.debug) {
        window.gadgets = gadgets;
    }

    return gadgets;
});