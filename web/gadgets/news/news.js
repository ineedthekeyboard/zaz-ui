define([
    'jquery.plugins',
    'handlebars-helpers',
    'framework/framework',
    'css!gadgets/news/news'
], function ($,
    HBS,
    framework) {

    return $.widget('zaz.news', framework.baseGadget, {
        options: {
            data: []
        },
        mode: 'gallery',

        _create: function () {
            this._super();
            this._renderLayout();
            this._loadData();
            this._bindListeners();
        },

        _bindListeners: function () {
            var context = this;

            $(this.element).find('.knobs .knob').on('click keyup', function (e) {
                var strMode = $(this).attr('data-mode');
                if (e.type === 'click' || e.keyCode === framework.KEYS.ENTER || e.keyCode === framework.KEYS.SPACE) {

                if ($(this).hasClass('active')) {
                    return true;
                }
                context.mode = strMode;
                context._setMode();
            }
            });
        },

        _renderLayout: function () {
            var strHtml = HBS['gadgets/news/news']({
                items: framework.languageManager.translations()
            });

            this.element.append(strHtml);
            this.$content = this.element.find('.content');
        },

        _loadData: function () {
            var context = this;

            this.showLoader();

            context._getData().done(function () {
                context._renderData();
            });
        },

        _getData: function () {
            var context = this;

            function error(response, textStatus) {
                context.element.find('.chart').html('<div class="message error">' + textStatus + '</div>');
            }

            function success(response) {
                response = (typeof response === 'string') ? JSON.parse(response) : response;
                context.data = (response && response.articles) ? response.articles : [];
            }

            return framework.serviceManager.exec({
                service: 'news.get.data',
                success: success,
                error: error
            }).always(function () {
                context.hideLoader();
            });
        },

        _setMode: function () {
            this.element.find('.knobs .knob').removeClass('active');
            this.element.find('.knobs .knob[data-mode="' + this.mode + '"]').addClass('active');

            this.$content.attr('data-mode', this.mode);

            this.preferences.mode = this.mode;
            this.setPreferences();
        },

        _applyPreferences: function () {
            var strMode = this.preferences.mode || this.mode;

            this.mode = strMode;
            this.element.find('.knobs .knob').removeClass('active');
            this.element.find('.knobs .knob[data-mode="' + this.mode + '"]').addClass('active');

            this.$content.attr('data-mode', this.mode);
        },

        _renderData: function () {
            var strHtml = HBS['gadgets/news/newsContent']({
                data: this.data,
                items: framework.languageManager.translations()
            });

            this._applyPreferences();
            this.$content.html(strHtml);
        }
    });
});