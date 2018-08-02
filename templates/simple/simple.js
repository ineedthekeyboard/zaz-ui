define([
    'framework/framework',
    'css!gadgets/{gadgetName}/{gadgetName}'
], function (
    framework
) {
    return $.widget('zaz.{gadgetName}', framework.baseGadget, {
        //declare local data stores
        data: null,

        _create: function () {
            //call baseGadget's super method in turn call widget factory's super method
            this._super();

            //custom method to load HTML handlebars template 
            this._renderLayout();

            //bind events to DOM elements in this gadget
            this._bindListeners();

            //start loading data call services etc.
            this._loadData();
        },

        //stub for method
        _renderLayout: function () {
            //load handlebars template
            var strTemplate = HBS['gadgets/{gadgetName}/{gadgetName}']();

            //apply template markup to gadget
            this.element.html(strTemplate);
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

            //call service to get data
            framework.serviceManager.exec({
                service: '{gadgetName}.get.data',
                success: success,
                error: error
            });
        },

        //let's load values from data into DOM elements
        _renderData: function () {
            var $address = this.element.find('.content .address');
            $address.find('.fname').html(this.data.fname);
            $address.find('.lname').html(this.data.lname);
            $address.find('.city').html(this.data.city);
        }
    });
});