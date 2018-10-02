define([
    'jquery.plugins',
    'framework/uriManager',
    'handlebars-helpers',
    'css!pages/harness/harness',
], function ($,
    uriManager, 
    HBS) {

    var harness = {

        init: function () {
            this.renderLayout();

            this.loadGadget();
            this.bindListeners();
        },

        renderLayout: function () {
            var strHtml = HBS['pages/harness/harness']();

            this.$harness = $('.__harness');

            this.$harness.append(strHtml);
        },

        loadGadget: function () {
            var $gadget,
                strScript = uriManager.getHash('gadget');

            this.unloadGadget();
            $gadget = this.$harness.find('.gadget');

            if (strScript) {
                this.loadAssets(strScript);
            } else {
                $gadget.html('<div class="message">No gadget provided in the URL</div>');
                $gadget.show();
            }
        },

        unloadGadget: function () {
            var $gadget = this.$harness.find('.gadget');
            if ($gadget.length) {
                $gadget.remove();
            }
            $gadget = $('<div class="gadget"></div>');
            this.$harness.find('.content').append($gadget);
        },

        loadAssets: function (strScript) {
            var $gadget = this.$harness.find('.gadget'),
                strJScript = 'gadgets/' + strScript + '/' + strScript;


            $gadget.addClass(strScript);

            require([strJScript], function () {
                $gadget[strScript]();
                $gadget.show();
            }, function (err) {
                $gadget.html('No such ' + strScript + ' gadget found');
                $gadget.show();
            });
        },

        bindListeners: function () {
            var context = this;
            $(window).on('hashchange', function () {
                context.loadGadget();
            });
        }
    }
    return harness;
});