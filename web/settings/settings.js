define([
    'settings/globals',
    'settings/messages',
    'settings/services',
    'settings/preferences',
    'settings/layouts',
    'settings/gadgets',
    'settings/languages'
], function (
    globals,
    messages,
    services,
    preferences,
    layouts,
    gadgets,
    languages
) {
    var settings = {
        globals: globals,
        messages: messages,
        services: services,
        preferences: preferences,
        layouts: layouts,
        gadgets: gadgets,
        languages: languages
    };

    if (window.CONFIG.debug) {
        window.settings = settings;
    }

    return settings;
});