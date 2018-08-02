/* global define: true */
define([], function () {

    var _;
    var KEYS = _ = {
        A: 65,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Z: 90,
        ESCAPE: 27,
        SPACE: 32,
        ENTER: 13,
        BACKSPACE: 8,
        COMMA: 188,
        DASH: 189,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        TAB: 9,
        UP: 38,
        SHIFT: 16,
        CONTROL: 17,
        ALT: 18,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_7: 103,
        NUMPAD_9: 105,
        NUMPAD_DASH: 109,
        NUMPAD_ASTERISK: 106,
        NUM_0: 48,
        NUM_1: 49,
        NUM_2: 50,
        NUM_3: 51,
        NUM_4: 52,
        NUM_5: 53,
        NUM_6: 54,
        NUM_7: 55,
        NUM_8: 56,
        NUM_9: 57,
        F1: 112,
        F9: 120,
        F10: 121,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_8: 104
    };

    KEYS.isNumber = function (code) {
        return code >= _.NUM_0 && code <= _.NUM_9 || code >= _.NUMPAD_0 && code <= _.NUMPAD_9;
    };

    KEYS.isTab = function (code) {
        return code === _.TAB;
    };

    KEYS.isZero = function (code) {
        return code === _.NUM_0 || code === _.NUMPAD_0;
    };

    KEYS.isOne = function (code) {
        return code === _.NUM_1 || code === _.NUMPAD_1;
    };

    KEYS.isTwo = function (code) {
        return code === _.NUM_2 || code === _.NUMPAD_2;
    };

    KEYS.isDelete = function (code) {
        return code === _.DELETE || code === _.BACKSPACE;
    };

    KEYS.isUnderscore = function (code, e) {
        return code === _.DASH && e.shiftKey;
    };

    KEYS.isArrow = function (code) {
        return code === _.UP || code === _.RIGHT || code === _.LEFT || code === _.DOWN;
    };

    KEYS.isDash = function (code) {
        return code === _.DASH || code === _.NUMPAD_DASH;
    };

    return KEYS;
});
