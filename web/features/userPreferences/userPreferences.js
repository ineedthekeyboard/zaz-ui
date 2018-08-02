define([
    'jquery.plugins',
    'handlebars-helpers',
    'common/formatter',
    'settings/globals',
    'framework/framework',
    'features/userPreferences/userSettings',
    'widgets/zazOverlay/zazOverlay',
    'css!features/userPreferences/userPreferences'
], function (
    $,
    HBS,
    formatter,
    globals,
    framework,
    userSettings,
    zazOverlay
) {

    var KEYS = framework.KEYS;

    var userPreferences = {

        defaults: {
            'PREFERENCE-user-view': {
                layout: 'default'
            },
            'PREFERENCE-user-name': {
                nameFormat: 'L, F'
            },
            'PREFERENCE-user-language': {
                language: 'en'
            },
            'PREFERENCE-user-font': {
                family: 'Verdana',
                size: '10',
                weight: false,
                color: '#000000',
                style: false
            },
            'PREFERENCE-user-layout': {
                tab: true,
                toolbar: true
            },
            'PREFERENCE-user-toolbar': {
                toolbar: 'left'
            },
            'PREFERENCE-user-tab': {
                tab: 'default'
            },
            'PREFERENCE-user-mode': {
                mode: 'town'
            },
            'PREFERENCE-user-theme': {
                theme: 'default',
                themeColor: '#004488',
                layout: {
                    tab: 1,
                    toolbar: 1
                },
                toolbar: 'left',
                tab: 'default',
                mode: 'town',
                font: {
                    family: 'Arial',
                    size: '10',
                    weight: false,
                    style: false,
                    color: '#000000'
                }
            }
        },

        settings: {},

        lastState: {},

        Changed: false,

        show: function () {
            if (window.name.indexOf(globals.CONSOLE + '_0') < 0) {
                framework.windowManager.focusViewer(globals.CONSOLE + '_0_' + window.USERID);
                return true;
            }

            this.renderLayout();
            this.loadPreferences();

            this.$overlay.zazOverlay({
                'title': 'Preferences',
                'color': {
                    'opacity': 0
                },
                'button-click': this.handleButtonClick.bind(this)
            });
            this.bindListeners();

            this.$overlay.find('.items .item:first').click();
        },

        handleButtonClick: function (e, data) {
            var strAction = data.action;
            switch (strAction) {
                case 'defaults':
                    this.resetToDefaults();
                    break;
                case 'reset':
                    this.reset();
                    break;
                case 'cancel':
                    this.close();
                    break;
                case 'apply':
                    this.apply();
                    break;
                default:
                    break;
            }
        },

        renderLayout: function () {
            $('.userpreferences-overlay').remove();
            var $overlay = $(HBS['features/userPreferences/userPreferences']({
                main: true,
                settings: userSettings,
                items: framework.languageManager.translations()
            }));
            $overlay.appendTo('body');
            this.$overlay = $overlay;
            this.$left = $overlay.find('.zaz-overlay-content .left');
            this.$right = $overlay.find('.zaz-overlay-content .right');
        },

        bindListeners: function () {
            var context = this,
                $overlay = context.$overlay;

            $overlay.off('keyup', '.left .item');
            $overlay.on('keyup', '.left .item', function (e) {
                switch (e.keyCode) {
                    case KEYS.ENTER:
                    case KEYS.SPACE:
                        $(this).click();
                        break;
                    case KEYS.RIGHT:
                    case KEYS.DOWN:
                        $(this).next().click();
                        break;
                    case KEYS.LEFT:
                    case KEYS.UP:
                        $(this).prev('.item').click();
                        break;
                    default:
                        break;
                }
            });

            $overlay.off('click', '.left .item');
            $overlay.on('click', '.left .item', function () {
                context.handleItemClick($(this));
            });

            $overlay.off('change', '.family');
            $overlay.on('change', '.family', function () {
                var value = $(this).val();
                $overlay.find('.fontPreview div').css('font-family', value);
            });

            $overlay.off('change', '.size');
            $overlay.on('change', '.size', function () {
                var value = $(this).val();
                $overlay.find('.fontPreview div').css('font-size', value);
            });

            $overlay.off('change', '.color');
            $overlay.on('change', '.color', function () {
                var value = $(this).val();
                $overlay.find('.wheelFontColor').wheelColorPicker('setValue', value);
                $overlay.find('.fontPreview div').css('color', value);
            });

            $overlay.off('change', '.weight');
            $overlay.on('change', '.weight', function () {
                if ($(this).is(":checked")) {
                    $overlay.find('.fontPreview div').css('font-weight', "bold");
                } else {
                    $overlay.find('.fontPreview div').css('font-weight', "normal");
                }
            });

            $overlay.off('change', '.style');
            $overlay.on('change', '.style', function () {
                if ($(this).is(":checked")) {
                    $overlay.find('.fontPreview div').css('font-style', "italic");
                } else {
                    $overlay.find('.fontPreview div').css('font-style', "normal");
                }
            });

            $overlay.off('change', '.instantApply');
            $overlay.on('change', '.instantApply', function () {
                if ($(this).is(":checked")) {
                    context.save();
                }
            });

            $overlay.off('slidermove', '.wheelThemeColor');
            $overlay.on('slidermove', '.wheelThemeColor', function () {
                var strColor = $(this).val();
                $overlay.find('.themeColor').val(strColor).trigger('change');
            });

            $overlay.off('change', '.themeColor');
            $overlay.on('change', '.themeColor', function () {
                var strColor = $(this).val();
                strColor = formatter.hex2rgb(strColor);
                $overlay.find('.wheelThemeColor').wheelColorPicker('setValue', strColor);
            });

            $overlay.off('slidermove', '.wheelFontColor');
            $overlay.on('slidermove', '.wheelFontColor', function () {
                var strColor = $(this).val();
                $overlay.find('.color').val(strColor).trigger('change');
            });

            $overlay.off('click', '.flag');
            $overlay.on('click', '.flag', function () {
                var strLang = $(this).attr('data-lang');
                $overlay.find('[data-key="language"]').val(strLang).trigger('change');
            });

            $overlay.off('change', '.theme');
            $overlay.on('change', '.theme', function () {
                var strColor = $(this).find('option:selected').attr('data-themecolor');
                $overlay.find('.themeColor').val(strColor).trigger('change');
            });

            $overlay.off('change', '[data-key]');
            $overlay.on('change', '[data-key]', function () {
                var $element = $(this),
                    strKey = $element.attr('data-key'),
                    strType,
                    strPane = $element.closest('.pane').attr('data-pane');

                context.settings['PREFERENCE-user-' + strPane].dirty = true;
                if (strKey === 'theme') {
                    context.themeChanged = true;
                }

                if ($element.is(':checkbox')) {
                    strType = 'checkbox';
                }
                if ($element.is(':text')) {
                    strType = 'text';
                }
                if ($element.is(':radio')) {
                    strType = 'radio';
                }
                if ($element.is('select')) {
                    strType = 'select';
                }
                if ($element.attr('type') === 'color') {
                    strType = 'color';
                }

                switch (strType) {
                    case 'checkbox':
                        context.settings['PREFERENCE-user-' + strPane][strKey] = $element.is(':checked');
                        break;
                    case 'radio':
                        context.settings[strKey] = this.$overlay.find('[data-key="' + strKey + '"]:checked').val();
                        break;
                    case 'select':
                    case 'text':
                    case 'color':
                        context.settings['PREFERENCE-user-' + strPane][strKey] = $element.val();
                        break;
                    default:
                        break;
                }

                if (context.$overlay.find('.instantApply').is(':checked')) {
                    context.save();
                }
            });
        },

        setValues: function (blnApply) {
            var context = this,
                $elements = this.$overlay && this.$overlay.find('[data-key]'),
                $body = $('body'),
                themeColor;

            $.each($elements, function (i, element) {
                var $element = $(element),
                    strKey = $element.attr('data-key'),
                    strType,
                    strPane = $element.closest('.pane').attr('data-pane');

                if ($element.is(':checkbox')) {
                    strType = 'checkbox';
                } else if ($element.is(':text')) {
                    strType = 'text';
                } else if ($element.is(':radio')) {
                    strType = 'radio';
                } else if ($element.is('select')) {
                    strType = 'select';
                } else if ($element.attr('type') === 'color') {
                    strType = 'color';
                }

                switch (strType) {
                    case 'checkbox':
                        $element.prop('checked', context.settings['PREFERENCE-user-' + strPane][strKey]);
                        break;
                    case 'text':
                    case 'select':
                        $element.val(context.settings['PREFERENCE-user-' + strPane][strKey]);
                        break;
                    case 'color':
                        $element.val(context.settings['PREFERENCE-user-' + strPane][strKey]);
                        break;
                    case 'radio':
                        $element.prop('checked', context.settings['PREFERENCE-user-' + strPane][strKey]);
                        break;
                    default:
                        break;
                }
            });

            if (blnApply || context.$overlay.find('.instantApply').is(':checked')) {
                context.applyTheme();
                if (window.name.indexOf(globals.CONSOLE + '_0') > -1) {
                    framework.messageManager.send({
                        action: 'MESSAGE-theme-changed'
                    });
                }
            }
        },

        applyTheme: function () {
            var context = this,
                $body = $('body');

            context.loadPreferences();

            if (window.preferences['PREFERENCE-user-font']) {
                $body.css({
                    'font-family': context.settings['PREFERENCE-user-font'].family,
                    'font-size': context.settings['PREFERENCE-user-font'].size + 'pt',
                    'color': context.settings['PREFERENCE-user-font'].color,
                    'font-weight': (context.settings['PREFERENCE-user-font'].weight) ? 'bold' : 'normal',
                    'font-style': (context.settings['PREFERENCE-user-font'].style) ? 'italic' : 'normal'
                });
            }

            if (window.preferences['PREFERENCE-user-layout']) {
                if (context.settings['PREFERENCE-user-layout'].tab) {
                    $body.removeClass('no-tab');
                } else {
                    $body.addClass('no-tab');
                }
                if (context.settings['PREFERENCE-user-layout'].toolbar) {
                    $body.removeClass('no-toolbar');
                } else {
                    $body.addClass('no-toolbar');
                }
            }
            if (context.settings['PREFERENCE-user-toolbar'].toolbar) {
                $body.attr('data-toolbar', context.settings['PREFERENCE-user-toolbar'].toolbar || 'left');
            }
            if (context.settings['PREFERENCE-user-mode'].mode) {
                $body.attr('data-mode', context.settings['PREFERENCE-user-mode'].mode || 'town');
            }
            if (window.preferences['PREFERENCE-user-tab']) {
                $body.attr('data-tab', context.settings['PREFERENCE-user-tab'].tab || 'default');
            }
            if (window.preferences['PREFERENCE-user-theme']) {
                themeColor = formatter.hex2rgb(context.settings['PREFERENCE-user-theme'].themeColor);
                framework.themeManager.setStyles(themeColor);
                $body.attr('data-theme', context.settings['PREFERENCE-user-theme'].theme || 'default');
                context.applyUserTheme();
            }
            if (window.preferences['PREFERENCE-user-name']) {
                context.displayUserName();
            }
        },

        nextTheme: function () {
            var strCurrentTheme = this.settings['PREFERENCE-user-theme'].theme;
            var arrThemes = userSettings.themes;
            var intNextTheme = 0;
            $.each(userSettings.themes, function (i, theme) {
                if (theme.value === strCurrentTheme) {
                    if (i < arrThemes.length - 1) {
                        intNextTheme = i + 1;
                    } else {
                        intNextTheme = 0;
                    }
                    return false;
                }
            });
            this.settings['PREFERENCE-user-theme'].theme = userSettings.themes[intNextTheme].value;
            this.settings['PREFERENCE-user-theme'].themeColor = userSettings.themes[intNextTheme].themecolor;
            this.settings['PREFERENCE-user-theme'].dirty = true;
            this.themeChanged = true;
            this.save();
        },

        applyUserTheme: function () {
            var context = this,
                strTheme = this.settings['PREFERENCE-user-theme'].theme || 'default',
                $body = $('body');

            if (strTheme === 'default' && !context.themeChanged) {
                return;
            }
            context.themeChanged = false;

            $.each(userSettings.themes, function (i, theme) {
                if (strTheme === theme.value) {
                    //theme font 
                    $body.css({
                        'font-family': theme.font.family,
                        'font-size': theme.font.size + 'pt',
                        'font-weight': (theme.font.weight) ? 'bold' : 'normal',
                        'font-style': (theme.font.style) ? 'italic' : 'normal',
                        'color': theme.font.color
                    });
                    context.settings['PREFERENCE-user-font']['family'] = theme.font.family;
                    context.settings['PREFERENCE-user-font']['size'] = theme.font.size;
                    context.settings['PREFERENCE-user-font']['weight'] = theme.font.weight;
                    context.settings['PREFERENCE-user-font']['style'] = theme.font.style;
                    context.settings['PREFERENCE-user-font']['color'] = theme.font.color;

                    //theme.toolbar
                    $body.attr('data-toolbar', theme.toolbar);
                    context.settings['PREFERENCE-user-toolbar']['toolbar'] = theme.toolbar;
                    //theme.tab
                    $body.attr('data-tab', theme.tab);
                    context.settings['PREFERENCE-user-tab']['tab'] = theme.tab;
                    //theme.mode
                    $body.attr('data-mode', theme.mode);
                    context.settings['PREFERENCE-user-mode']['mode'] = theme.mode;

                    if (theme.layout.tab) {
                        $body.removeClass('no-tab');
                    } else {
                        $body.addClass('no-tab');
                    }
                    context.settings['PREFERENCE-user-layout']['tab'] = (theme.layout.tab) ? 1 : 0;
                    if (theme.layout.toolbar) {
                        $body.removeClass('no-toolbar');
                    } else {
                        $body.addClass('no-toolbar');
                    }
                    context.settings['PREFERENCE-user-layout']['toolbar'] = (theme.layout.toolbar) ? 1 : 0;
                }
            });
        },

        handleItemClick: function ($item) {
            var strPane = $item.attr('data-pane'),
                options = {},
                strPaneHtml = '';

            this.$left.find('.item').attr('tabindex', '-1');
            this.$left.find('.item.active').removeClass('active');
            $item.attr('tabindex', '0');
            $item.addClass("active");
            $item.focus();

            //load content for pane dynamically
            options[strPane] = true;
            options.settings = userSettings;
            strPaneHtml = HBS['features/userPreferences/userPreferences'](options);
            this.$right.empty();
            this.$right.html(strPaneHtml);

            if (strPane === "theme") {
                this.$overlay.find('.wheelThemeColor').wheelColorPicker();
                this.$overlay.find('.wheelThemeColor').wheelColorPicker('setValue', this.settings['PREFERENCE-user-theme'].themeColor);
            }
            if (strPane === "font") {
                this.$overlay.find('.wheelFontColor').wheelColorPicker();
                this.$overlay.find('.wheelFontColor').wheelColorPicker('setValue', this.settings['PREFERENCE-user-font'].color);
            }
            this.setValues();
        },

        close: function () {
            this.$overlay.zazOverlay('instance').close();
        },

        apply: function () {
            this.save();
            this.close();
        },

        save: function () {
            var context = this,
                params = [],
                row;

            for (row in this.settings) {
                if (this.settings[row] && this.settings[row].dirty) {
                    delete this.settings[row].dirty;
                    params.push({
                        'key': row,
                        'value': JSON.stringify(this.settings[row])
                    });
                }
            }

            framework.preferencesManager.set(params).done(function () {
                framework.windowManager.getWindow().preferences = context.settings;
                context.setValues(true);
            });
        },

        loadPreferences: function () {
            this.settings = $.extend({}, this.defaults, framework.windowManager.getWindow().preferences);
            this.lastState = $.extend({}, this.settings);
        },

        reset: function () {
            var row;

            this.settings = $.extend({}, this.lastState);
            for (row in this.settings) {
                if (this.settings.hasOwnProperty(row)) {
                    this.settings[row].dirty = true;
                }
            }
            this.setValues();
            if (this.$overlay.find('.instantApply').is(':checked')) {
                this.save();
            }
        },

        resetToDefaults: function () {
            var row;

            this.settings = $.extend({}, this.defaults);
            for (row in this.settings) {
                if (this.settings.hasOwnProperty(row)) {
                    this.settings[row].dirty = true;
                }
            }
            this.setValues();
            if (this.$overlay.find('.instantApply').is(':checked')) {
                this.save();
            }
        },

        displayUserName: function () {
            var strLanguage = framework.languageManager.translate('HELLO'),
                strHtml,
                strUserName,
                preferences = window.preferences["PREFERENCE-user-name"];

            switch (preferences.nameFormat) {
                case 'F M. L':
                    strUserName = formatter.nameFormat.firstMiddleLast(window.user);
                    break
                case 'F':
                    strUserName = window.user.firstName;
                    break
                case 'L, F':
                default:
                    strUserName = formatter.nameFormat.lastFirstName(window.user);
                    break;
            }
            strHtml = strLanguage + ' ' + strUserName;

            $('.__header .user').attr('aria-label', strUserName);
            $('.__header .user').attr('title', strHtml);
            $('.__toolbar .user').attr('title', strHtml);

        },

        init: function () {
            var context = this;
            $(window).on(globals.NAMESPACE + '-message', function (e) {
                var message = e.message,
                    action = message && message.action,
                    options = message && message.options;

                switch (action) {
                    case 'MESSAGE-theme-changed':
                        context.applyTheme();
                        break;
                    case 'MESSAGE-hotkey-pressed':
                        if (options && options.key === 'alt+P') {
                            context.show();
                        }
                        if (options && options.key === 'alt+T') {
                            context.nextTheme();
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    };

    userPreferences.init();

    if (window.CONFIG.debug) {
        window.userPreferences = userPreferences;
    }

    return userPreferences;
});