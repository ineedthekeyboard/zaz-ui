define([
    'framework/keys',
    'framework/cookieManager',
    'framework/uriManager',
    'framework/serviceManager',
    'framework/storageManager',
    'framework/messageManager',
    'framework/windowManager',
    'framework/layoutManager',
    'framework/gadgetManager',
    'framework/preferencesManager',
    'framework/languageManager',
    'framework/themeManager',
    'framework/pageManager',
    'framework/baseGadget'
], function (
    KEYS,
    cookieManager,
    uriManager,
    serviceManager,
    storageManager,
    messageManager,
    windowManager,
    layoutManager,
    gadgetManager,
    preferencesManager,
    languageManager,
    themeManager,
    pageManager,
    baseGadget
) {
    var framework = {
        KEYS: KEYS,
        cookieManager: cookieManager,
        uriManager: uriManager,
        serviceManager: serviceManager,
        storageManager: storageManager,
        messageManager: messageManager,
        windowManager: windowManager,
        layoutManager: layoutManager,
        gadgetManager: gadgetManager,
        preferencesManager: preferencesManager,
        languageManager: languageManager,
        themeManager: themeManager,
        pageManager: pageManager,
        baseGadget: baseGadget
    };

    if (window.CONFIG.debug) {
        window.framework = framework;
    }

    return framework;
});