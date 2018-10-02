define([
    'jquery.plugins',
    'widgets/zazMenu/zazMenu',
    'settings/globals',
    'settings/gadgets',
    'handlebars-helpers',
    'framework/keys',
    'framework/storageManager',
    'framework/messageManager',
    'framework/layoutManager',
    'framework/windowManager',
    'framework/languageManager'
], function ($,
    zazMenu,
    globals,
    gadgets,
    HBS,
    KEYS,
    storageManager,
    messageManager,
    layoutManager,
    windowManager,
    languageManager) {

    var gadgetManager = {};

    function getComponent(strType, strScript) {
        var $element = $('.' + strType + '.' + strScript);
        return $element;
    }

    gadgetManager.meta = gadgets.hash;

    gadgetManager.open = function (gadgets) {
        var gadget0;

        if (!(gadgets instanceof Array)) {
            gadgets = [gadgets];
        }

        if (window.mobile) {
            gadget0 = gadgets[0];
            gadget0.zone = 'main';
            gadgets = [gadget0];
        }

        if (gadgets.length && gadgets[0].window === window.name) {
            //same window - call add directly
            gadgetManager.add(gadgets);
        } else {
            messageManager.send({
                'action': 'MESSAGE-gadget-open',
                'options': gadgets
            });
        }
    };

    gadgetManager.validateGadgets = function (gadgets) {
        var gadgetsByZone = {};

        //verify gadget is configured in gadgets.js, remove otherwise
        $(gadgets).each(function (i, gadget) {
            var gadgetMeta = gadgetManager.meta[gadget.script];
            if (!gadgetMeta) {
                console.warn('Gadget : "' + gadget.script + '" is not documented in framework/gadgets.js and is disallowed.');
                gadgets.splice(i, 1);
            }
        });

        // group gadgets by zone
        $.each(gadgets, function (i, gadget) {
            if (!gadgetsByZone[gadget.zone]) {
                gadgetsByZone[gadget.zone] = [gadget];
            } else {
                gadgetsByZone[gadget.zone].push(gadget);
            }
        });

        // if there is no active gadget set for the zone - activate the first one
        $.each(gadgetsByZone, function (zone, gadgets) {
            var activeFound = false;
            $.each(gadgets, function (i, gadget) {
                //if true - keep track and do not allow othher to be true
                if (!activeFound && gadget.active === true) {
                    activeFound = true;
                } else {
                    gadget.active = false;
                }
            });
            if (!activeFound) {
                gadgets[0].active = true;
            }
        });
    };

    gadgetManager.add = function (gadgets) {
        if (!(gadgets instanceof Array)) {
            gadgets = [gadgets];
        }

        /* defaults */
        var defaults = {
                zone: 'main',
                script: '',
                active: false,
                persistable: false,
                window: '',
                icon: 'extension',
                iconClass: '',
                autoFocus: true,
                showCount: false,
                data: {}
            },
            gadgetCount = gadgets.length;

        //make one gadget active per zone;
        gadgetManager.validateGadgets(gadgets);

        $.each(gadgets, function (i, row) {
            var $zone;
            if (row && row.window && row.window === window.name) {
                row.zone = layoutManager.getDeepestZone(row.zone);
                $zone = layoutManager.$layout.find('.zone[data-zone="' + row.zone + '"]');
                if (gadgetCount === 1 && $zone.find('.tab').length === 0) {
                    row.active = true;
                }
                addGadget(row, (i === gadgets.length - 1));
            }
        });

        function addGadget(gadget, blnLastGadget) {
            var blnAdded, options, metaOptions, strTitle;

            /* extend merged options with defaults, settings and metadata */
            options = $.extend(true, {}, defaults, gadget, gadgetManager.meta[gadget.script]);

            metaOptions = gadgetManager.meta[gadget.script];
            /* reset persistable from defaults */
            options.persistable = (metaOptions.persistable && metaOptions.persistable === true) ? true : false;

            /* override title from settings if one was provided */
            strTitle = languageManager.translate(options.title);
            options.title = strTitle || options.title;

            /* check if this specific gadget is already added */
            blnAdded = gadgetManager.isAdded(options);
            if (blnAdded) {
                options = gadgetManager.getGadgetOptions(options.script);

                messageManager.send({
                    'action': 'MESSAGE-gadget-activate',
                    'options': options
                });
                return;
            }

            gadgetManager.addPanel(options.zone);
            gadgetManager.addTab(options, blnLastGadget);

            if (options.active || options.persistable) {
                gadgetManager.addContainer(options);
            }
        }
    };

    gadgetManager.addPanel = function (strZone) {
        /* get zone */
        var $zone = layoutManager.$layout.find('.zone[data-zone="' + strZone + '"]');

        /* check if zone has panel*/
        if ($zone.find('.panel').length === 0) {
            $zone.append(HBS['framework/gadgetManager']({
                panelControls: true,
                items: languageManager.translations()
            }));
        }
    };

    gadgetManager.focusOrActivateTab = function (options) {
        var $tab = gadgetManager.getTab(options.script, options.data);

        if ($tab.length) {
            $tab.click();
            gadgetManager.shakeTab($tab);
        }
    };

    gadgetManager.shakeTab = function ($tab) {
        $tab.addClass('shake');
        setTimeout(function () {
            $tab.removeClass('shake');
        }, 500);
    };

    gadgetManager.addGadgetToStorage = function (options) {
        var strGadget = globals.NAMESPACE + '-gadget_' + options.script;
        storageManager.setStateItem(globals.NAMESPACE + '-gadgets', strGadget, options);
    };

    gadgetManager.updateGadgetInStorage = function (options) {
        /* does the same as adding gadget to storage - just a friendly name for inferring update action */
        gadgetManager.addGadgetToStorage(options);
    };

    gadgetManager.removeGadgetFromStorage = function (options) {
        var strGadget = globals.NAMESPACE + '-gadget_' + options.script;

        storageManager.removeStateItem(globals.NAMESPACE + '-gadgets', strGadget);
        messageManager.send({
            'action': 'MESSAGE-gadget-closed',
            'options': options
        });
    };

    gadgetManager.addTab = function (options, blnLastGadget) {
        var $tab,
            $zone = layoutManager.$layout.find('.zone[data-zone="' + options.zone + '"]'),
            $tabs = layoutManager.$layout.find('.zone[data-zone="' + options.zone + '"] > .panel > .tabcontrols .tabs'),
            $targetTab = $zone.find('.tab[data-position]'),
            strPosition = $targetTab.attr('data-position');

        $tab = $(HBS['framework/gadgetManager']({
            gadgetTab: true,
            items: languageManager.translations()
        }));

        if (options.pinnable) {
            $tab.find('.tab-pin').addClass('show');
            if (options.pinned) {
                $tab.find('.tab-pin').addClass('pinned');
                $tab.find('.tab-pin i').text('lock');
            }
        }

        if ($targetTab && $targetTab.length) {
            if (strPosition === 'targetright') {
                $tab.insertAfter($targetTab);
            } else {
                $tab.insertBefore($targetTab);
            }
            if (blnLastGadget) {
                $targetTab.removeAttr('data-position');
            }
        } else {
            $tabs.append($tab);
        }
        if (options.showCount) {
            $tab.find('.tab-count').addClass('show');
        }

        if (options.icon) {
            $tab.find('.tab-icon i').text(options.icon).addClass('icon-class ' + options.iconClass);
        }

        $tab.addClass(options.script);
        $tab.data('options', options);

        if (options.data && options.data.title) {
            $tab.attr('data-title', options.title);
            $tab.attr('title', options.data.title);
            $tab.find('.tab-title').html(options.data.title);
        } else {
            options.title = (options.title) ? options.title : options.script;
            $tab.attr('data-title', options.title);
            $tab.attr('title', options.title);
            $tab.find('.tab-title').html(options.title);
            $tab.attr('aria-label', options.title);
        }

        if (options.active) {
            gadgetManager.setTabState(options);
        }

        gadgetManager.addGadgetToStorage(options);

        messageManager.send({
            'action': 'MESSAGE-gadget-opened',
            'options': options
        });

    };

    gadgetManager.setTabState = function (options) {
        var $tab = gadgetManager.getTab(options.script, options.data),
            $tabs = layoutManager.$layout.find('.zone[data-zone="' + options.zone + '"] > .panel > .tabcontrols .tabs'),
            strState,
            $activeTab,
            tabOptions,
            currentActiveGadget;

        $activeTab = $tabs.find('.tab.active');

        if ($activeTab.length) {
            /*first check if there is an active but non-persistable gadget - destroy it */
            tabOptions = $activeTab.data('options');
            if (!tabOptions.persistable) {
                currentActiveGadget = gadgetManager.getGadget(tabOptions.script, tabOptions.data);
                currentActiveGadget.remove();
            }

            /* update aria-selected to false for current active tab */
            $activeTab.attr('aria-selected', 'false');
            /* now remove the active class */
            $activeTab.removeClass('active');

            tabOptions = $activeTab.data('options');
            tabOptions.active = false;
            $activeTab.data('options', tabOptions);
            gadgetManager.updateGadgetInStorage(tabOptions);
        }

        $tab.addClass('active');

        $tab.attr('aria-selected', 'true');

        tabOptions = $tab.data('options');
        tabOptions.active = true;
        $tab.data('options', tabOptions);

        strState = (options.pinned) ? ' Pinned' : '';
        $tab.attr('title', $tab.attr('data-title') + strState);
        $tab.attr('aria-label', $tab.attr('data-title') + strState);
    };

    gadgetManager.addContainer = function (options) {
        var $gadget,
            $gadgetContainer,
            strScript,
            blnLoaded;

        /* check if the gadget had been rendered */
        strScript = options.script;
        $gadget = this.getGadget(strScript, options.data);

        blnLoaded = $gadget.hasAttr('data-loaded');
        $gadgetContainer = layoutManager.$layout.find('.zone[data-zone="' + options.zone + '"] > .panel > .content');

        if (!blnLoaded) {
            $gadget = $('<div class="gadget ' + options.script + '" role="region"></div>');
            $gadgetContainer.append($gadget);
        }

        if (options.active) {
            $gadgetContainer.find('.gadget').hide();
            $gadget.show();
        }

        if (!blnLoaded || !options.persistable) {
            $gadget.attr('data-loaded', true);
            gadgetManager.loadAssets(options);
        }
    };

    gadgetManager.loadAssets = function (options) {
        var strScript = options.script,
            strJScript = 'gadgets/' + strScript + '/' + strScript;

        require([strJScript], function () {
            var $gadget;
            $gadget = gadgetManager.getGadget(strScript, options.data);

            $gadget[strScript](options);

            options.loaded = true;
            gadgetManager.updateGadgetInStorage(options);
            messageManager.send({
                'action': 'MESSAGE-gadget-loaded',
                'options': options
            });
        });
    };

    gadgetManager.activate = function (optionsCurrent, optionsNew) {
        var $gadget;

        if (optionsCurrent) {
            $gadget = this.getGadget(optionsCurrent.script, optionsCurrent.data);
            $gadget.hide();
            if (!optionsCurrent.persistable) {
                $gadget.remove();
            }
            /* update gadget state in storage */
            gadgetManager.updateGadgetInStorage(optionsCurrent);
        }

        /* update gadget state in storage */
        if (optionsNew) {
            gadgetManager.updateGadgetInStorage(optionsNew);
        }

        gadgetManager.addContainer(optionsNew);

        messageManager.send({
            'action': 'MESSAGE-gadget-activated',
            'options': optionsNew
        });
    };

    gadgetManager.remove = function (gadgets) {
        if (!(gadgets instanceof Array)) {
            gadgets = [gadgets];
        }

        $.each(gadgets, function (i, options) {
            var $tab = gadgetManager.getTab(options.script),
                $gadget = gadgetManager.getGadget(options.script),
                $panel = $tab.closest('.panel'),
                $zone = $tab.closest('.zone'),
                strZone = $zone.attr('data-zone');

            if (options.window !== window.name) {
                return;
            }

            if ($gadget && $gadget.length) {
                $gadget.remove();
            }
            $tab.remove();

            /* now activate another gadget if available or remove panel */
            if ($panel.find('.tab').length === 0) {
                $panel.remove();
                if (strZone === 'main') {
                    //layoutManager.closeZone(strZone);
                    layoutManager.$layout.find('.zone-help, .zone-logo').show();
                }
            }
            if ($panel.find('.tab.active').length === 0) {
                $panel.find('.tab:eq(0)').click();
            }

            options.loaded = false;
            gadgetManager.removeGadgetFromStorage(options);

            messageManager.send({
                'action': 'MESSAGE-gadget-closed',
                'options': options
            });
        });
    };

    gadgetManager.init = function () {
        gadgetManager.bindListeners();
    };

    gadgetManager.renderGadgetListMenu = function () {
        var gadgetMenuHtml;

        gadgetMenuHtml = HBS['framework/gadgetManager']({
            gadgetListMenu: true,
            items: languageManager.translations()
        });
        $(document.body).append(gadgetMenuHtml);
    };

    gadgetManager.bindListeners = function () {
        var context = this,
            $layout = layoutManager.$layout;

        $(window).on(globals.NAMESPACE + '-message', function (e) {
            var message = e.message,
                action = message && message.action,
                options = message && message.options;

            switch (action) {
                case 'MESSAGE-gadget-open':
                    gadgetManager.add(options);
                    break;
                case 'MESSAGE-gadget-activate':
                    gadgetManager.focusOrActivateTab(options);
                    break;
                case 'MESSAGE-hotkey-pressed':
                    if (options && options.key === 'alt+G') {
                        context.showUserGadgets();
                    }
                    break;
                default:
                    break;
            }
        });

        $(window).on('unload', function () {
            /* this is to prevent saving userGadgets preference when unloading page */
            window.pageUnloading = true;
        });

        $layout
            .off('click', '.panel .tab')
            .on('click', '.panel .tab', function (e, autoFocus) {
                autoFocus = (autoFocus === false) ? autoFocus : true;

                /* find the zone */
                var $zone = $(this).closest('.zone'),
                    optionsCurrent,
                    optionsNew,
                    strState,
                    intLeft,
                    $tabs,
                    $activeTab = $zone.find('.tab.active'),
                    $clickedTab = $(this);

                /* get tab's options */
                optionsNew = $clickedTab.data('options');
                /* get tab's options */
                optionsCurrent = $activeTab.data('options');

                intLeft = $clickedTab.position().left;
                $tabs = $clickedTab.closest('.tabs');
                $tabs.animate({
                    scrollLeft: intLeft
                });

                if (optionsNew.active) {
                    return;
                }

                if ($activeTab.length > 0) {
                    /* get options of this active tab */
                    optionsCurrent = $activeTab.data('options');

                    /* set active state to false */
                    optionsCurrent.active = false;
                    /* and set this tab to inactive by removing active class */
                    $activeTab.removeClass('active');
                    /* update the options for tab */
                    $activeTab.data('options', optionsCurrent);

                    /* update aria-selected to false */
                    $activeTab.attr('aria-selected', 'false');

                    /* update the title of tab */
                    strState = (optionsCurrent.pinned) ? ' Pinned' : '';
                    $activeTab.attr('title', $activeTab.attr('data-title') + ' Pinned');
                    $activeTab.attr('aria-label', $activeTab.attr('data-title') + strState);
                }

                /* set state to active */
                optionsNew.active = true;
                $clickedTab.addClass('active');
                $clickedTab.attr('aria-selected', 'true');

                strState = (optionsNew.pinned) ? ' Pinned' : '';
                $clickedTab.attr('title', $clickedTab.attr('data-title') + strState);
                $clickedTab.attr('aria-label', $clickedTab.attr('data-title') + strState);

                gadgetManager.activate(optionsCurrent, optionsNew);
                if (autoFocus) {
                    $clickedTab.find('.title').focus();
                }
            });

        $layout
            .off('keyup', '.panel .tab .tab-title')
            .on('keyup', '.panel .tab .tab-title', function (e) {
                var $panel = $(this).closest('.panel'),
                    $tab = $panel.find('.tab.active'),
                    blnAction = false;
                switch (e.keyCode) {
                    case $.ui.keyCode.SPACE:
                    case $.ui.keyCode.ENTER:
                        blnAction = true;
                        /* check if it was the close button; if so switch the tab element to that */
                        if ($(this).hasClass('tab-close')) {
                            $tab = $(this);
                        }
                        break;
                    case $.ui.keyCode.LEFT:
                        blnAction = true;
                        if ($tab.prev().length) {
                            $tab = $tab.prev();
                        } else {
                            $tab = $tab.siblings().last();
                        }
                        break;
                    case $.ui.keyCode.RIGHT:
                        blnAction = true;
                        if ($tab.next().length) {
                            $tab = $tab.next();
                        } else {
                            $tab = $tab.siblings().first();
                        }
                        break;
                    default:
                        break;
                }
                if (blnAction) {
                    $tab.trigger('click');
                }
            });

        $layout
            .off('click keyup', '.panel .gadgetlist')
            .on('click keyup', '.panel .gadgetlist', function (e) {
                e.stopPropagation();
                if (e.type === 'click' || e.keyCode === KEYS.ENTER || e.keyCode === KEYS.SPACE) {
                    gadgetManager.renderGadgetListMenu();
                    gadgetManager.showListMenu($(this));
                }
            });
    };

    gadgetManager.showListMenu = function (element) {
        var $zone = $(element).closest('.zone'),
            strZone = $zone.data('zone'),
            /* build the menu items from list of gadgets on this panel */
            $tabs = layoutManager.$layout.find('.zone[data-zone="' + strZone + '"] > .panel > .tabcontrols .tab'),
            options,
            strScript,
            strTitle,
            strHtml,
            strIcon,
            strIconClass,
            activeIndicator;

        $tabs.each(function (i, tab) {
            activeIndicator = $(tab).hasClass('active') ? 'active' : '';
            options = $(tab).data('options');
            strScript = options.script;
            strTitle = $(tab).find('.tab-title').html();
            strIcon = options.icon;
            strIconClass = options.iconClass;
            strHtml = '<div class="item ' + activeIndicator + '" role="menuitem" data-type="gadget" ' +
                'data-script="' + strScript + '" tabindex="0">' +
                '<i class="material-icons md-light icon-class ' + strIconClass + '">' + strIcon + '</i>' +
                '<div class="item-title">' + strTitle + '<div></div>';
            $('.gadgetlistmenu .items').append(strHtml);

        });

        $('.gadgetlistmenu').zazMenu({
            'selector': element,
            'useOffset': true,
            'item-click': function (e, data) {
                var strScript = data.script;
                gadgetManager.showGadgetOpener(strScript);
            }
        });

    };

    gadgetManager.isAdded = function (strScript) {
        var gadgets = gadgetManager.getLoadedGadgetsArray(),
            blnAdded = false;

        gadgets.some(function (gadget) {
            if (gadget.script === strScript) {
                blnAdded = true;
                return true;
            }
        });
        return blnAdded;
    };

    gadgetManager.getTab = function (strScript) {
        return getComponent('tab', strScript);
    };

    gadgetManager.getGadget = function (strScript) {
        return getComponent('gadget', strScript);
    };

    gadgetManager.getAllUserGadgets = function () {
        var arrGadgets = [];

        $.each(gadgets, function (key, gadget) {
            if (gadget.roles.indexOf(window.user.role) > -1) {
                arrGadgets.push({
                    script: key,
                    zone: gadget.zone,
                    title: gadget.title,
                    desc: gadget.desc || '',
                    icon: gadget.icon || 'extension',
                    iconClass: gadget.iconClass || 'icon-class'
                });
            }
        });
        return arrGadgets;
    };

    gadgetManager.getLoadedGadgets = function () {
        return windowManager.getWindow().state[globals.NAMESPACE + '-gadgets'];
    };

    gadgetManager.getGadgetOptions = function (strScript) {
        var options = null,
            keys = gadgetManager.getAllUserGadgets();

        $.each(keys, function (i, gadget) {
            if (gadget.script === strScript) {
                options = gadget;
            }
        });

        return options;
    };

    gadgetManager.getLoadedGadgetsArray = function () {
        var options = null,
            arrGadgets = [],
            keys = gadgetManager.getLoadedGadgets();

        $.each(keys, function (key, value) {
            options = JSON.parse(value);
            arrGadgets.push(options);
        });

        return arrGadgets;
    };

    gadgetManager.showGadgetOpener = function (strScript) {
        //if mobile just open the gadget directly on main zone
        if (window.mobile) {
            gadgetManager.open([{
                zone: 'main',
                window: window.name,
                script: strScript,
                active: true
            }]);
            return false;
        }

        messageManager.send({
            'action': 'MESSAGE-gadget-activate',
            'options': {
                script: strScript
            }
        });
    };

    gadgetManager.renderGadgetsOverlay = function () {
        $('.gadgets-overlay').remove();
        var $gadgetsOverlay = $(HBS['framework/gadgetManager']({
            gadgetsOverlay: true,
            items: languageManager.translations()
        }));
        $gadgetsOverlay.appendTo('body');
        this.$gadgetsOverlay = $gadgetsOverlay;
    };

    gadgetManager.showUserGadgets = function () {
        var context = this,
            arrGadgets,
            $gadgets,
            strScript,
            strIcon,
            strIconClass,
            strTitle,
            strDesc,
            $gadget;

        gadgetManager.renderGadgetsOverlay();
        $gadgets = this.$gadgetsOverlay.find('.gadgets');

        arrGadgets = gadgetManager.getAllUserGadgets();
        $.each(arrGadgets, function (i, gadget) {
            strScript = gadget.script;
            strIcon = gadget.icon;
            strIconClass = gadget.iconClass || 'icon-class';
            strTitle = languageManager.translate(gadget.title);
            strDesc = gadget.desc;

            $gadget = $(HBS['framework/gadgetManager']({
                gadgetsOverlayItem: true,
                script: strScript,
                icon: strIcon,
                iconClass: strIconClass,
                title: strTitle,
                desc: strDesc,
                items: languageManager.translations()
            }));

            $gadgets.append($gadget);
        });

        this.$gadgetsOverlay.zazOverlay({
            'title': 'Open Gadgets',
            'opacity': 0,
            'button-click': function (e, data) {
                var strAction = data.action;
                if (strAction === 'close') {
                    context.$gadgetsOverlay.zazOverlay('instance').close();
                }
            }
        });

        $gadgets.off('click keyup', '.item');
        $gadgets.on('click keyup', '.item', function (e) {
            var $item = $(this),
                strScript = $item.attr('data-gadget'),
                strScriptId = $item.attr('data-gadgetid');

            if (e.type === 'click' || e.keyCode === KEYS.ENTER || e.keyCode === KEYS.SPACE) {
                context.$gadgetsOverlay.zazOverlay('instance').close();
                gadgetManager.showGadgetOpener(strScript, {
                    gadgetid: strScriptId
                });
            }
        })

    };

    if (window.CONFIG.debug) {
        window.gadgetManager = gadgetManager;
    }
    return gadgetManager;
});