'use strict';

define([], function () {
    return {
        '': 'Special Case',

        //standard feature preferences - follow format PREFERENCE-featureName-key;
        'PREFERENCE-user-view': 'PREFERENCE for user named layout',
        'PREFERENCE-user-name': 'PREFERENCE for user name display',
        'PREFERENCE-user-font': 'PREFERENCE for application wide fonts name, color & size',
        'PREFERENCE-user-theme': 'PREFERENCE for application wide color theme',
        'PREFERENCE-user-language': 'PREFERENCE for language',
        'PREFERENCE-user-layout': 'PREFERENCE for layout controls',
        'PREFERENCE-user-toolbar': 'PREFERENCE for toolbar controls',
        'PREFERENCE-user-tab': 'PREFERENCE for tab controls',
        'PREFERENCE-user-mode': 'PREFERENCE for view mode of layout',

        //standard gadget preferences - follow format PREFERENCE-gadgetName-key;
        //##template
        'PREFERENCE-news-settings': 'PREFERENCE for news gadget',
        'PREFERENCE-sampleChart-settings': 'PREFERENCE app chart gadget',
        'PREFERENCE-mapData-settings': 'PREFERENCE for map gadget',
    };
});