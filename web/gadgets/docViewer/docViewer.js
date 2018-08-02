define([
    'framework/framework',
    'css!gadgets/docViewer/docViewer'
], function (
    framework
) {
    return $.widget('zaz.docViewer', framework.baseGadget, {

        //this is where we will store some data
        data: null,

        _create: function () {
            //this will call baseGadget's super method in turn  call widget factory's super method
            this._super();

            //in this custom method we will load HTML handlebars template 
            this._renderLayout();

            //in this method we will bind events to DOM elements in this gadget
            this._bindListeners();

            this._loadData();
        },

        //stub for method
        _renderLayout: function () {
            var strTemplate = HBS['gadgets/docViewer/docViewer']();

            this.element.html(strTemplate);
            this.$iframe = this.element.find('iframe');
        },

        //stub for method
        _bindListeners: function () {},

        _loadData: function () {
            var context = this;

            function success(response) {
                response = (typeof response === 'string') ? JSON.parse(response) : response;
                context.data = (response && response.data) ? response.data : [];
                context._renderData();
            }

            function error(response) {
                //handle errors here
            }

            framework.serviceManager.exec({
                service: 'docViewer.get',
                success: success,
                error: error
            });
        },

        //let's load values from data into DOM elements
        _renderData: function () {
            var strFilePath = this.data[0].fileName;
            this.$iframe.attr('src', strFilePath);
        }
    });
});