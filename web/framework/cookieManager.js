    define([], function () {


    /**
     * @namespace cookieManager
     * @classdesc Reads and writes a cookie
     */
    return {

        /**
         * @description Reads a Cookie
         * @memberof cookieManager
         * @param strName {String} Name of the cookie to retrieve
         * @returns Value of the cookie
         */
        read: function (strName) {
            var strCookie = '; ' + document.cookie + '; ',
                intBegin = strCookie.indexOf('; ' + strName + '='),
                valBegin = (intBegin * -1 - strName.length - 3) * -1,
                qsVal = strCookie.substring(valBegin, strCookie.indexOf('; ', valBegin));

            return (intBegin !== -1 && qsVal !== '') ?
                decodeURI(qsVal.replace(/\+/g, ' ')) : '';
        },

        /**
         * @description Creates a New Cookie
         * @memberof cookieManager
         * @param strName {String} Name of the cookie
         * @param strValue {String} Value of the cookie
         * @param intMinutes {Number} Expires in Minutes
         */
        create: function (strName, strValue, intMinutes) {
            var expires,
                date = new Date();
            if (intMinutes) {
                date.setTime(date.getTime() + (intMinutes * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            } else {
                expires = '';
            }

            document.cookie = strName + '=' + strValue + expires + '; path=/';
        }
    };
});
