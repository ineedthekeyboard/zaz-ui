define([
    'settings/globals'
], function (globals) {
    var services = {
        //##template
        users: {
            get: {
                data: {
                    url: (window.CONFIG.mock) ? 'user/users.data.json': globals.REST + '/users'
                },
                me: {
                    url: (window.CONFIG.mock) ? 'user/#userId#.data.json': globals.REST + '/users/#userId#'
                }
            }
        },
        preferences: {
            get: {
                data: {
                    url: globals.REST + '/preferences/#type#/#key#?userId=#userId#'
                }
            },
            post: {
                url: globals.REST + '/preferences'
            },
            delete: {
                url: globals.REST + '/preferences'
            }
        },
        docViewer: {
            get: {
                url: 'gadgets/docViewer/docViewer.data.json'
            }
        },
        news: {
            get: {
                data: {
                    url: (window.CONFIG.mock) ? 'gadgets/news/news.data.json': globals.REST + '/news'
                }
            }
        },
        dataGrid: {
            get: {
                config: {
                    url: 'gadgets/dataGrid/dataGrid.config.json'
                },
                data: {
                    url: 'gadgets/dataGrid/dataGrid.data.json'
                }
            }
        }
    };

    if (window.CONFIG.debug) {
        window.services = services;
    }

    return services;
});