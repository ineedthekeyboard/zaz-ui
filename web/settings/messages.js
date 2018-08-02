'use strict';
define([], function () {
    return {
        //user gadget framework messages - follow format MESSAGE-gadget-action
        //##template
        'MESSAGE-grid-data': 'Message sent by Grid Gadget',

        //standard gadget framework messages - follow format MESSAGE-gadget-action
        'MESSAGE-gadget-open': 'Message sent before a gadget is opened',
        'MESSAGE-gadget-opened': 'Message sent when a gadget is opened',
        'MESSAGE-gadget-closed': 'Message sent when a gadget is closed',
        'MESSAGE-gadget-remove': 'Message sent when a gadget is removed',
        'MESSAGE-gadget-dropped': 'Message set after gadget is dropped into a new Zone or Window',
        'MESSAGE-gadget-activate': 'Message sent to activate a tab/gadget',
        'MESSAGE-gadget-activated': 'Message sent when a tab/gadget is activated',
        'MESSAGE-gadget-pinned': 'Message sent when a gadget is pinned',
        'MESSAGE-gadget-loaded': 'Message sent after gadget is loaded',
        'MESSAGE-gadget-touched': 'Message sent after gadget is flipped/moved in DOM',
        'MESSAGE-window-closed': 'Message sent to window manager when window is closed',
        'MESSAGE-window-openviewer': 'Message sent to console to open a viewer\'s extended viewer',
        'MESSAGE-overlay-close': 'Message sent out to close any opened overlay in the application.',
        'MESSAGE-focus-console': 'Message sent to focus main console',
        'MESSAGE-server-message': 'Messages received from server and passed through',

        //feature messages - follow format MESSAGE-gadget-action
        'MESSAGE-preference-changed': 'MESSAGE when a preference is saved',
        'MESSAGE-theme-changed': 'MESSAGE when a theme is changed',
        'MESSAGE-hotkey-pressed': 'MESSAGE when a hotkey is pressed'
    };
});