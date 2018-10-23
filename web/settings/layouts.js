define([], function () {
    var layouts = {
        maxZoneDepth: 3,
        minZoneSize: 200,
        hash: {
            h50: {
                orientation: 'h',
                size: '50'
            },
            h50v50: {
                orientation: 'h',
                size: '50',
                next: {
                    orientation: 'v',
                    size: '50'
                }
            }
        },
        getUserLayout: function () {
            //configure layouts based on user roles
            var state = {};
            switch (window.user.role) {
                case 'admin':
                    state = this.hash.h50;
                    break;
                case 'user':
                default:
                    state = this.hash.h50v50;
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