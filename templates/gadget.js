module.exports = function (options) {
    var replace = require("replace");
    var grunt = require("grunt");
    var gadgetName = options.name;
    var gadgetType = options.type || 'simple';
    var gadgetDesc = options.desc || 'Generated ' + gadgetName + ' from template';

    if (!gadgetName || gadgetName.length < 3) {
        console.log('Please provide name of gadget! (at least 3 chars) [grunt gadget --name testGadget]');
        return;
    }
    console.log('Generating new gadget "' + gadgetName + '"');
    console.log('Creating folder "/web/gadgets/' + gadgetName + '"');

    grunt.file.mkdir('./web/gadgets/' + gadgetName);
    grunt.file.expand({
        cwd: 'templates/' + gadgetType,
    }, '**/*').forEach(function (fileName) {
        var strSourceFile = './templates/' + gadgetType + '/' + fileName;
        fileName = fileName.replace('' + gadgetType, gadgetName);

        var strTargetFile = './web/gadgets/' + gadgetName + '/' + fileName;
        console.log('Creating file "' + strTargetFile + '"');

        grunt.file.copy(strSourceFile, strTargetFile);

        console.log('Updating file "' + strTargetFile + '"');
        replace({
            regex: "{gadgetName}",
            replacement: gadgetName,
            paths: [strTargetFile],
            recursive: true,
            silent: true
        });
    });

    var strGadgetMeta = gadgetName + ': { title: \'' + gadgetName + '\', desc: \'' + gadgetDesc + '\', icon: \'extension\', iconClass: \'icon-class-extension\', viewers: [globals.CONSOLE], roles: [\'user\']},';
    replace({
        regex: "//##template",
        replacement: '//##template\n\t\t' + strGadgetMeta,
        paths: ['./web/settings/gadgets.js'],
        recursive: true,
        silent: true
    });

    var strServiceMeta = gadgetName + ': { get: { data: { url: \'gadgets/' + gadgetName + '/' + gadgetName + '.data.json\'}}},';
    if (gadgetType === 'grid') {
        strServiceMeta = gadgetName + ': { get: { config: { url: \'gadgets/' + gadgetName + '/' + gadgetName + '.config.json\'}, data: { url: \'gadgets/' + gadgetName + '/' + gadgetName + '.data.json\'}}},';
    }
    replace({
        regex: "//##template",
        replacement: '//##template\n\t\t' + strServiceMeta,
        paths: ['./web/settings/services.js'],
        recursive: true,
        silent: true
    });

    var strMessageMeta = '\'MESSAGE-' + gadgetName + '-data\': \'Message sent by ' + gadgetName + ' Gadget\',';
    replace({
        regex: "//##template",
        replacement: '//##template\n\t\t' + strMessageMeta,
        paths: ['./web/settings/messages.js'],
        recursive: true,
        silent: true
    });

    var strPreferencesMeta = '\'PREFERENCE-' + gadgetName + '-settings\': \'PREFERENCE for ' + gadgetName + ' Gadget\',';
    replace({
        regex: "//##template",
        replacement: '//##template\n\t\t' + strPreferencesMeta,
        paths: ['./web/settings/preferences.js'],
        recursive: true,
        silent: true
    });
};