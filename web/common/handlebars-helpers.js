define([
    'jquery',
    'handlebars',
    'templates/hbs'
], function ($,
    Handlebars,
    HBS) {


    Handlebars.registerHelper('concat', function () {
        return [].concat.apply([], arguments).slice(0, -1).join('');
    });

    Handlebars.registerHelper('meta', function (data) {
        return JSON.stringify(data);
    });

    Handlebars.registerHelper('ifequal', function (param, value, options) {
        return param === value ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('switch', function (value, options) {
        this._switch_value_ = value;
        var html = options.fn(this); // Process the body of the switch block
        delete this._switch_value_;
        return html;
    });

    Handlebars.registerHelper('case', function (value, options) {
        if (value == this._switch_value_) {
            return options.fn(this);
        }
    });

    return HBS;
});