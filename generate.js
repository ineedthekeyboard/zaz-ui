var prompt = require('prompt');
var gadget = require('./templates/gadget');

var schema = {
    properties: {
        name: {
            pattern: /^[a-zA-Z]+$/,
            message: 'Name must be letters only',
            required: true
        },
        type: {
            pattern: /^[simple|grid]+$/,
            message: 'Type must be one of these \'simple\', \'grid\'',
            required: true
        }
    }
};

prompt.start();

prompt.get(schema, function (err, result) {
    console.log('Command-line input received:');
    console.log('  name: ' + result.name);
    console.log('  type: ' + result.type);

    gadget(result);
});