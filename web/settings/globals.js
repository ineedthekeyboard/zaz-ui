define(function () {
    return {
        NAMESPACE: 'zaz',
        CONSOLE: 'zazconsole',
        REST: (window.location.hostname === 'localhost') ? '/api': 'http://zaz-ui-rest.zazvata.com/api'
    };
});