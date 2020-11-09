define(function () {
    return {
        NAMESPACE: 'zaz',
        CONSOLE: 'zazconsole',
        REST: (window.location.hostname === 'localhost') ? '/api': '///'
    };
});