define(['settings/languages'], function (languages) {

    /**
     * @namespace languageManager
     * @classdesc Manages language/translations.
     */
    var languageManager;

    languageManager = {
        /**
         * @description Retrieves all CODES in set language
         * @memberof languageManager
         * @returns Object of all CODE in set language
         */
        translations: function () {
            var strDefault = 'en';

            var strLanguage = window.language || strDefault;
            var objLanguage = languages[strLanguage] || languages[strDefault];

            return objLanguage;
        },
        /**
         * @description Translate a CODE into set language
         * @memberof languageManager
         * @param strCode {String} Name of the CODE to convert
         * @returns Value of CODE in set language
         */
        translate: function (strCode) {
            var strDefault = 'en';
            var strDefaultValue = '';

            strDefaultValue = strCode.toLowerCase().replace(/[-]/g, ' ');
            var strLanguage = window.language || strDefault;
            var objLanguage = languages[strLanguage] || languages[strDefault];
            var strValue = objLanguage[strCode] || strCode;

            return strValue;
        }
    };

    if (window.CONFIG.debug) {
        window.languageManager = languageManager;
    }
    return languageManager;
});