define([], function () {
    var layouts = {
        maxZoneDepth: 3,
        minZoneSize: 200,
        getUserLayout: function () {
            //configure layouts based on user roles
            var state = {};
            switch (window.user.role) {
                case 'admin':
                    state = {
                        orientation: 'h',
                        size: '50'
                    };
                    break;
                case 'user':
                default:
                    state = {
                        orientation: 'h',
                        size: '50',
                        next: {
                            orientation: 'v',
                            size: '50'
                        }
                    };
                    break;
            }
            return state;
        }
    };

    if (window.CONFIG.debug) {
        window.layouts = layouts;
    }

    return layouts;
});