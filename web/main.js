window.version = '5.18.0719o';

//return time stamp upto hour
function getTimestamp() {
    var tempDate = new Date();
    // return tempDate.getTime();
    return tempDate.getFullYear() + '' + (tempDate.getMonth() + 1) + '' + tempDate.getDate() + '' + tempDate.getHours();
}

function getVersion() {
    var version = window.version;
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        version = getTimestamp();
    }
    return version;
}

/* global require: true */
require.config({
    baseUrl: localStorage.codeBase || '',
    urlArgs: 'v=' + getVersion(),
    map: {
        '*': {
            'css': 'vendor/require/css.min',
            'text': 'vendor/require/text'
        }
    },
    paths: {
        'jquery.plugins': 'vendor/jquery.plugins/jquery.plugins',

        // AMD exposed modules
        'jquery': 'vendor/jquery/jquery.min',
        'jqueryui': 'vendor/jquery-ui/jquery-ui.min',
        'highcharts': 'vendor/highcharts/highcharts',
        'highcharts-3d': 'vendor/highcharts/highcharts-3d',
        'highcharts-drag3d': 'vendor/highcharts/draggable-3d',

        'maps': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCTgZam5u_HCShth9iss3QLGrrZ_HfMR8g',
        'handlebars': 'vendor/handlebars/handlebars.runtime.min',
        'handlebars-helpers': 'common/handlebars-helpers',

        // Compiled handlebars templates
        'handlebars-compiled': 'templates/hbs',

        // Plugins that need to be shimmed
        'modernizr': 'vendor/modernizr/modernizr',
        'pgwbrowser': 'vendor/pgwbrowser/pgwbrowser',

        'maxZIndex': 'vendor/jquery.maxZIndex/jquery.maxZIndex',
        'hasAttr': 'vendor/jquery.hasAttr/jquery.hasAttr',
        'highlight': 'vendor/jquery.highlight/jquery.highlight',
        'throttle-debounce': 'vendor/jquery.throttle-debounce/jquery.ba-throttle-debounce',
        'socket.io': 'vendor/socket.io/socket.io.min',
        'dmp': 'vendor/diff_match_patch/diff_match_patch',
        'intro': 'vendor/intro/intro.min',
        'wheelcolorpicker': 'vendor/jquery.wheelcolorpicker/jquery.wheelcolorpicker.min'
    },
    shim: {
        'barCode': {
            deps: ['jquery']
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'pgwbrowser': {
            exports: '$.pgwBrowser',
            deps: ['jquery']
        },
        'maxZIndex': {
            exports: '$.maxZIndex',
            deps: ['jquery']
        },
        'hasAttr': {
            exports: '$.fn.hasAttr',
            deps: ['jquery']
        },
        'throttle-debounce': {
            deps: ['jquery']
        },
        'highlight': {
            deps: ['jquery']
        },
        'highcharts': {
            exports: 'Highcharts'
        },
        'highcharts-3d': {
            deps: ['highcharts']
        },
        'highcharts-drag3d': {
            deps: ['highcharts', 'highcharts-3d']
        },
        'dmp': {
            exports: 'diff_match_patch'
        },
        'intro': {
            exports: 'introJs'
        },
        'wheelcolorpicker': {
            deps: ['jquery']
        }
    },
    waitSeconds: 0,
    wrapShim: true
});

require([
    'modernizr',
    'jquery.plugins',
    'settings/globals'
], function (
    Modernizr,
    $,
    globals) {

    var defaultConfig = {
            debug: false,
            mock: false,
            demo: false,
            sso: false
        },
        config = localStorage.getItem(globals.NAMESPACE + '-config'),
        mode = localStorage.getItem(globals.NAMESPACE + '-mode'),
        url = window.location.pathname,
        strViewer = url.substring(url.lastIndexOf('/') + 1).replace('.html', ''),
        browser = $.pgwBrowser().browser;

    if (config) {
        config = JSON.parse(config);
    }
    config = $.extend(defaultConfig, config);

    localStorage.setItem(globals.NAMESPACE + '-config', JSON.stringify(config), true);
    window.CONFIG = config;
    window.isOldIE = (browser.name.toLowerCase() === 'internet explorer' && browser.majorVersion <= 11);
    window.isIE = (browser.name.toLowerCase() === 'internet explorer');
    window.isChrome = (browser.name.toLowerCase() === 'chrome');
    window.isFirefox = (browser.name.toLowerCase() === 'firefox');
    window.majorVersion = browser.majorVersion;
    window.hasTouch = (Modernizr.touchevents);
    //set mode to mobile if touch is available
    window.mobile =  window.hasTouch;
    //in case mode is explicitly to desktop then disable mobile mode 
    if(mode === 'desktop') {
        window.mobile = false;
    }
    //in case mode is explicitly to mobile then enable mobile mode 
    if(mode === 'mobile') {
        window.mobile = true;
    }

    if (window.mobile) {
        $('body').attr('data-mobile', 'yes');
    }

    function _openPage(strViewer) {
        var strViewerScript = ['pages', strViewer, strViewer].join('/');

        require([
            strViewerScript,
            'css!framework/styles/normalize',
            'css!vendor/intro/introjs.min',
            'css!framework/styles/material',
            'css!framework/styles/effects',
            'css!framework/styles/globals',
            'css!framework/styles/flags',
            'css!framework/styles/header',
            'css!framework/styles/toolbar',
            'css!framework/styles/gadget',
            'css!framework/styles/layout',
            'css!framework/styles/tabs',
            'css!framework/styles/log',
            'css!styles/style'
        ], function (page) {
            page.init();
        });
    }

    if (/login|access|config|harness/.test(strViewer)) {
        _openPage(strViewer);
    } else {
        require(['bootstrap'], function (bootstrap) {
            bootstrap.init();
        });
    }
});