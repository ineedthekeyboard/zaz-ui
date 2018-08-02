define(['jquery',
    'vendor/moment/moment.min'
], function ($, moment) {
    /**
     * @namespace formatter
     * @static
     * @global
     * @classdesc Provides Formatting Utilties
     */
    var formatter = {};

    /**
     * Tests if the date object is valid.
     * @param date  Date object.
     *
     */
    function isDate(date) {
        return (typeof date === 'object' && date instanceof Date && date.toString() !== 'Invalid Date');
    }

    //handle a string, millis, or already a date
    //this needs double-checked against IE, which doesn't seem to support all
    //Date constructors properly
    function parseDate(date) {
        var d;
        if (typeof date === 'string') {
            //gets millis
            date = Date.parse(date);
        } else if (isDate(date)) {
            return date;
        }
        // create date
        d = new Date(date);
        // check if it's actually date
        if (!isDate(d)) {
            return null;
        }
        //ctor should handle existing or millis
        return d;
    }

    /**
     * @description Formates HTML
     * @memberof formatter
     */
    formatter.mimeTypeMap = {
        'application/pdf': 'pdf'
    };

    formatter.htmlFormat = {
        encode: function (string) {
            return string.replace(/./g, function (chr) {
                return chr.match(/[\w\d]/) ? chr : '&#' + chr.charCodeAt(0) + ';';
            });
        },
        decode: function (string) {
            return string.replace(/&#[0-9]+;/g, function (text) {
                return String.fromCharCode(text.match(/[0-9]+/)[0]);
            });
        }
    };

    formatter.formatString = function () {
        var args = arguments;

        return args[0].replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] === 'undefined' ? match : args[number];
        });
    };

    /**
     * @description Formats Dates
     * @memberof formatter
     */
    formatter.dateFormat = {
        arrMonths: function (date) {
            return typeof date !== 'number' ? moment(new Date(date))
                .format('MMMM') : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                    'September', 'October', 'November', 'December'
                ];
        },
        arrDays: function (date) {
            return typeof date !== 'number' ? moment(new Date(date))
                .format('dddd') : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        },
        toHMSTime: function () {
            return moment().format('h:mm:ss a');
        },
        fromISODate: function (s, strFormat) {
            return this.formatDate(s, /^(\d\d\d\d)-(\d\d)-(\d\d).*$/, '$1-$2-$3', strFormat);
        },
        /**
         * Strips out milliseconds since the backend doesn't support periods in the date
         * @param date
         * @returns {string}
         */
        noteModifiedDate: function (date) {
            var d = parseDate(date);
            return d.toISOString().replace(/\.\d{3}/gi, '');
        },
        datetimeISO8601: function (date) {
            var d = parseDate(date);
            return moment(d).format('YYYY-MM-DDTHH:MM:mm') + 'Z';
        },
        today: function () {
            return moment(new Date()).format('MM/DD/YYYY');
        },
        getDayIndex: function (strDay) {
            var i;

            for (i = 0; i < formatter.dateFormat.arrDays.length; i += 1) {
                if (this.dateFormat.arrDays[i] === strDay) {
                    return i;
                }
            }
        },
        /*test*/
        getDay: function (strDate) {
            var currentDate = new Date(strDate);
            return currentDate.getDay();
        },
        nextDay: function (strDate) {
            return moment(new Date(strDate), 'MM/DD/YYYY').add(1, 'days').format('MM/DD/YYYY');
        },
        prevDay: function (strDate) {
            return moment(new Date(strDate), 'MM/DD/YYYY').subtract(1, 'days').format('MM/DD/YYYY');
        },
        nextWeek: function (strDate) {
            return moment(new Date(strDate), 'MM/DD/YYYY').add(7, 'days').format('MM/DD/YYYY');
        },
        prevWeek: function (strDate) {
            return moment(new Date(strDate), 'MM/DD/YYYY').subtract(7, 'days').format('MM/DD/YYYY');
        },
        getDayOffset: function (strDate, intOffset) {
            return moment(new Date(strDate), 'MM/DD/YYYY').add(intOffset, 'days').format('MM/DD/YYYY');
        },
        formatDate: function (date, strFormat) {
            strFormat = (strFormat) ? strFormat : 'MM/DD/YYYY';
            return moment(new Date(date)).format(strFormat);
        },
        formatDateWithTZ: function (date, strFormat, intTz) {
            strFormat = (strFormat) ? strFormat : 'MM/DD/YYYY';
            return moment(new Date(date)).utcOffset(intTz).format(strFormat);
        },
        dateDisplay: function (date, defaultDisplay) {

            return this.formatDate(date, defaultDisplay);
        },
        //Passes the date, but not time values to formatString
        format: function (currentDate, strFormat) {

            if (typeof currentDate !== 'object') {
                currentDate = this.formatDate(currentDate, 'MM/DD/YYYY');
                currentDate = new Date(currentDate);
            }
            if (!currentDate || currentDate.toString() === 'Invalid Date') {
                return currentDate;
            }
            currentDate = this.formatString(currentDate, strFormat);
            return moment(new Date(currentDate)).format(strFormat);
            /*return currentDate;*/
        },
        //Passes the time and date to formatString
        localizedFormat: function (currentDate, strFormat) {
            return moment(new Date(currentDate)).format(strFormat);

        },
        //Called by format and localizedFormat to format the time and/or date string
        formatString: function (currentDate, strFormat) {
            strFormat = (strFormat) ? strFormat : 'MM/DD/YYYY';
            return moment(new Date(currentDate)).format(strFormat);
        },
        /**
         * Returns a value which depends on the given date relative to now:
         *   if the given date is within "today" then only the time portion will be returned.
         *   if the given date is within the current year then only the month and day will be returned.
         *   in all other cases, a date with the format of MM/dd/yyyy will be returned.
         * @param date The date value to be converted
         * @param undefinedValue Comparison value to determine if the date is set
         * @returns {*|string}
         */
        smartTimeDisplay: function (date, undefinedValue) {
            var val = undefinedValue || '',
                dateObj,
                now = new Date();

            if (date) {
                dateObj = new Date(date);
                if (dateObj.getFullYear() === now.getFullYear()) {
                    if (dateObj.getMonth() === now.getMonth() && dateObj.getDate() === now.getDate()) {
                        val = formatter.dateFormat.format(dateObj, 'hh:mm A');
                    } else {
                        val = formatter.dateFormat.format(dateObj, 'MMM d');
                    }
                } else {
                    val = formatter.dateFormat.format(dateObj, 'MM/DD/YYYY');
                }
            }

            return val;
        },
        timeDisplay: function (date, undefinedValue) {
            var d;
            if (date) {
                d = new Date(date);
                return formatter.dateFormat.format(d, 'hh:mm:ss A');
            }
            return undefinedValue || '';
        },
        /**
         * Parse a time zone abbreviation from a date string.
         * @memberof PTO/formatters
         * @param now A date time string in the format of those returned by Date.toString
         * @return {String} the abbreviated time zone
         */
        getLocalTimeZoneAbbreviation: function (now) {
            now = now || (new Date()).toString();
            //if there is a parenthesis, time zone information is enclosed
            var timeZone = now.indexOf('(') > -1 ?
                now.match(/\([^\)]+\)/)[0].match(/[A-Z]/g).join('') :
                now.match(/[A-Z]{3,4}/)[0];

            //If there is just GMT offset information
            if (timeZone === 'GMT' && /(GMT\W*\d{4})/.test(now)) {
                //get it
                timeZone = RegExp.$1;
            }

            return timeZone;
        }

    };

    /**
     * @description Formats Names
     * @memberof formatter
     */
    formatter.nameFormat = {
        /**
         * Formats the given user object with a first initial and last name, capitalized. e.g. "J. SMITH"
         * @param  {object} user User object, containing fields such as firstName and lastName
         * @return {string} A string containing the first initial and last name, such as "J. SMITH"
         */
        initialName: function (user) {
            var firstInitial = formatter.nameFormat.firstInitial(user),
                lastName = user.lastName || '',
                middleName = user.middleName || '',
                ret = firstInitial + (firstInitial ? '. ' : '') + middleName.charAt(0) + (middleName ? '. ' : '') + lastName.charAt(0) + (lastName ? '.' : '');
            return ret.trim().toUpperCase();
        },
        /**
         * Simply returns the first initial of the first name. Private mini helper
         * @param  {object} user
         * @return {string} Just the first initial if there is a first name, otherwise empty string.
         */
        firstInitial: function (user) {
            return (user && user.firstName) ? user.firstName.substring(0, 1) : '';
        },
        /**
         * Returns last and first name separated by comma, capitalized. e.g. "STANFORD, CHRISTOPHER"
         * @param  {object} user
         * @return {string} Just the first initial if there is a first name, otherwise empty string.
         */
        lastFirstName: function (user) {
            var first, formatted, last;
            formatted = '';
            if (user && user.firstName && user.lastName) {
                first = user.firstName.substr(0, 1).toUpperCase() + user.firstName.substr(1);
                last = user.lastName.toUpperCase();
                formatted = last + ', ' + first;
            }
            return formatted;
        },

        lastFirstMiddle: function (user) {
            var formatted = '';
            formatted += user.lastName || '';
            formatted += (user.lastName && (user.firstName || user.middleName)) ? ', ' : '';
            formatted += user.firstName || '';
            formatted += (user.firstName && user.middleName) ? ' ' : '';
            formatted += user.middleName || '';
            return formatted;
        },

        firstMiddleLast: function (user) {
            var formatted = '';
            formatted += user.firstName || '';
            formatted += (user.firstName && user.middleName) ? ' ' : '';
            formatted += user.middleName || '';
            formatted += (user.lastName && (user.firstName || user.middleName)) ? ', ' : '';
            formatted += user.lastName || '';
            return formatted;
        },

        fullName: function (user) {
            var formatted = '';
            formatted += user.firstName || '';
            formatted += (user.firstName && user.middleName) ? ' ' : '';
            formatted += user.middleName || '';
            formatted += (user.lastName && (user.firstName || user.middleName)) ? ' ' : '';
            formatted += user.lastName || '';
            return formatted;
        },

        userInfo: function (userObject) {
            var artUnit, first, formatted, last;
            formatted = '';
            if (userObject && userObject.firstName && userObject.lastName) {
                first = userObject.firstName.substr(0, 1).toUpperCase() + userObject.firstName.substr(1);
                last = userObject.lastName.substr(0, 1).toUpperCase() + userObject.lastName.substr(1);
                artUnit = userObject.artUnit;
                formatted = last + ', ' + first + (artUnit ? ' (' + artUnit + ')' : '');
            }
            return formatted;
        },

        lastFirstUpperCase: function (lastName, firstName) {
            var formattedLastName;
            if (!lastName) {
                return '';
            }
            if (lastName.indexOf('et al') > 0) {
                formattedLastName = lastName.split(' ');
                formattedLastName[0] = formattedLastName[0].toUpperCase();
                formattedLastName = formattedLastName.join(' ');
                return formattedLastName;
            } else {
                return lastName.toUpperCase() + ', ' + firstName.toUpperCase();
            }
        }
    };

    /**
     * @description Breaks text by row or character limits either breaking or non breaking words
     * @memberof formatter
     */
    formatter.breakText = {
        /**
         * @description Break text without breaking words based on character limit
         * @param {string} str
         * @param {integer} charLimit
         * @param {boolean} brk (true if breaking words)
         * @returns {object} newStr & contStr (text uptil character limit and the rest of the text)
         */
        textCharLimit: function (str, charLimit, brk) {
            var numChars = str.length,
                indxBrk = numChars;
            if (charLimit < numChars) {
                indxBrk = (brk || (/\s/).test(str[charLimit])) ? charLimit : str.substr(0, charLimit).lastIndexOf(' ');
            }
            return {
                newStr: str.substr(0, indxBrk),
                contStr: str.substr(indxBrk, str.length)
            };
        },

        /**
         * @description Break text based on row limit
         * @param {object} input
         * @param {integer} rowLimit
         * @param {boolean} brk (true if breaking words)
         * @returns {object} newStr & contStr (text uptil row limit and the rest of the text)
         */
        textRowLimit: function (input, rowLimit, brk) {
            var $this = input,
                contArr = [],
                contText,
                heightLimit,
                valueForElement = input.text(),
                numChars,
                lineHeight,
                words,
                numWords,
                k;

            $this.html('&nbsp');
            lineHeight = $this.height();
            $this.html(valueForElement);

            heightLimit = rowLimit * lineHeight;

            words = valueForElement.split(' ');
            numWords = words.length;

            // remove words at end until height becomes desired height
            for (k = 0; k < numWords; k += 1) {
                if (input.height() > heightLimit) {
                    valueForElement = input.text()
                        .substring(0, input.text().length - (words[numWords - 1 - k].length + 1));
                    contArr.push(input.text()
                        .substring(input.text().length - (words[numWords - 1 - k].length + 1), input.text().length));
                    input.text(valueForElement);
                } else {
                    break;
                }
            }
            contText = contArr.reverse().join('');
            numChars = contText.length;
            if (brk) {
                // add characters until height reached
                for (k = 0; k < numChars; k += 1) {
                    if (input.height() <= heightLimit) {
                        valueForElement += contText.substring(0, 1);
                        contText = contText.substring(1, contText.length);
                        input.text(valueForElement);
                    } else {
                        valueForElement = input.text().substring(0, input.text().length - 1);
                        contText = input.text().substring(input.text().length - 1, input.text().length) + contText;
                        break;
                    }
                }
            }
            return {
                newStr: valueForElement,
                contStr: contText
            };
        }
    };


    /**
     * @description Formats Money
     * @memberof formatter
     */
    formatter.formatMoney = function (n, c, blnUseParens) {
        var d = '.',
            diff = n.toFixed(2),
            i,
            j,
            m,
            t = ',';

        if (!c) {
            c = 2;
        }

        n = Math.abs(n).toFixed(c);
        i = parseInt(n) + '';
        j = ((j = i.length) > 3) ? j % 3 : 0;
        m = (j ? i.substr(0, j) + t : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
            (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');

        if (diff >= 0) {
            m = '$' + m;
        } else if (diff < 0) {
            if (blnUseParens) {
                m = '$(' + m + ')';
            } else {
                m = '-$' + m;
            }
        }
        return m;
    };

    /**
     * @description Formats Numbers
     * @memberof formatter
     */
    formatter.formatNumber = function (n, c) {
        var d = '.',
            i,
            j,
            num,
            sign,
            t = ',';

        if (!c) {
            c = 2;
        }

        sign = (n < 0) ? '-' : '';
        n = Math.abs(n).toFixed(c);
        i = parseInt(n) + '';
        j = ((j = i.length) > 3) ? j % 3 : 0;
        num = sign + (j ? i.substr(0, j) + t : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) +
            (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
        return num;
    };

    /**
     * Given a number, return a string representation of that number with commas (or equivalent per locale)
     *     For example, given 7000 will return "7,000" in US
     * @param  {number} num The number. May also be a simple string such as "7000".
     * @return {string} String formatting of the number. ex: "123,456,789"
     */
    formatter.formatNumberWithCommas = function (num) {
        if (typeof num !== 'number') {
            num = parseInt(num);
        }
        num = num || 0;
        var ret = num.toLocaleString();
        return ret;
    };

    /**
     * @description Formats Phone Numbers xxx-xxx-xxxx
     * @memberof formatter
     */
    formatter.formatPhone = function (s) {
        return s.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    };

    /**
     * @description Formats Phone Numbers (xxx)xxx-xxxx
     * @memberof formatter
     */
    formatter.formatPhoneWithParenthesis = function (s) {
        return (typeof s === 'string') ? s.replace(/(\d{3})(\d{3})(\d{4})/, '($1)$2-$3') : '';
    };
    /**
     * @description Removes all chars except alphabets and numbers
     * @memberof formatter
     */
    formatter.formatAlphaNum = function (s) {
        return s.replace(/[^a-zA-Z0-9]/g, '');
    };

    /**
     * @memberof PTO/formatters
     * @param {Date} date
     * @param {String} [format]
     * @return {String}
     */
    formatter.cdmDateDisplay = function (date, format) {
        var formatPattern;

        if (date) {
            formatPattern = (format && !$.isNumeric(format)) ? format.toLocaleLowerCase() : 'YYYY-MM-DD';
            return formatter.dateFormat.format(date, formatPattern);
        }
    };

    /**
     * Formats a displaySizeObject, which has a 'units' member and a 'value' member
     * Example output: "23 page(s)" or "4 file(s)" or "1.4 GB"
     * @memberof PTO/formatters
     */
    formatter.displaySize = function (displaySizeObject) {
        var retVal = '';
        if (displaySizeObject) {
            if (!displaySizeObject.units || displaySizeObject.units.match('byte')) {
                //handle special case where the value is in bytes
                retVal = formatter.fileSize(displaySizeObject.value);
            } else {
                //handle common case where we display "{value} {units}"
                retVal = displaySizeObject.value + ' ' + displaySizeObject.units;
            }
        }
        return retVal;
    };

    /**
     * This produces a friendly byte-size display, according to the following rules:
     * 1) Base 1000 for "easy math" reading instead of 1024
     * 2) Values from 1 to <1000 before moving up to next category (byte, kb, mb, gb)
     * 3) Round for 3 significant digits, but dropping trailing 0s
     * (see US5187 acceptance criteria for the documentation of these requirements)
     * @memberof PTO/formatters
     */
    formatter.fileSize = function (bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        var thresh = 1000,
            units = ['KB', 'MB', 'GB', 'TB', 'PB'],
            exp = -1;

        if (bytes < thresh) {
            return bytes + ' byte' + (bytes !== 1 ? 's' : '');
        }

        do {
            bytes /= thresh;
            exp += 1;
        } while (bytes >= thresh);

        //parse float will drop trailing zeros for easier readability
        return parseFloat(bytes.toPrecision(3)) + ' ' + units[exp];
    };

    formatter.fitfDisplay = function (application) {
        var result = '-';
        if (application.fitf === true || application.fitfType === 'AIA') {
            result = 'Yes';
        } else if (application.fitfType === 'PRE_AIA') {
            result = 'No';
        }
        return result;
    };

    /**
     * Formats the application and document data to send via mail (Application Contents contextmenu -> Report Problem Image)
     * @memberof PTO/formatters
     * @param {object} application object.
     * @param {object} document object.
     * @return {String} body to display in the mail.
     */
    formatter.mailTo = function (application, document) {
        var publicationDate = document.publicationDate || document.receivedDate || 'N/A',
            body = 'Application Serial Number (ASN): ${applicationId}%0D%0A' +
            'Status: ${statusCode}%0D%0A' +
            'Document Type: ${documentCode}%0D%0A' +
            'Number of Pages: ${numberOfPages}%0D%0A' +
            'Date: ${date}';
        if (publicationDate !== 'N/A') {
            publicationDate = formatter.dateFormat.format(publicationDate, 'MM/DD/YYYY');
        }
        body = body.replace('${applicationId}', application.caseNumber);
        body = body.replace('${statusCode}', application.status.code);
        body = body.replace('${documentCode}', document.documentCode);
        body = body.replace('${numberOfPages}', (document.displaySize) ? formatter.displaySize(document.displaySize) : document.pageCount);
        body = body.replace('${date}', publicationDate);
        return body;
    };

    /**
     * Formatter that can accept an array and join all the items.
     * @memberof PTO/formatters
     * @param {String[]|String} [values] the array of strings to be formatted.
     * @return {String} of the value(s) passed in with ", " seperating them.
     */
    formatter.joinWithComma = function (values) {
        return values.join(', ');
    };

    /**
     * Wraps any string value in a hyperlink string.
     * @memberof PTO/formatters
     * @param {String} innerHTML The HTML string to be wrapped in a hyperlink.
     * @return {String} string representation of hyperlink node
     */
    formatter.displayLink = function (innerHTML) {
        if (!innerHTML || !innerHTML.charAt) {
            return '';
        }
        return '<a href="#">' + innerHTML + '</a>';
    };

    /**
     * Wraps a string value or a group of string values in a hyperlink string.
     * @memberof PTO/formatters
     * @param {String|String[]} values The HTML string(s) to be wrapped in a hyperlink.
     * @return {String} string representation of hyperlink node(s)
     */
    formatter.getLinks = function (values) {
        if (!values || !values.join) {
            values = [values];
        }

        return values.map(function (innerHTML) {
            return formatter.displayLink(innerHTML);
        }).join(', ');
    };
    /**
     * Wraps a hyperlink around each string value in an array or object.
     * @memberof PTO/formatters
     * @param {String[]|Object} [obj] the HTML string(s) to be wrapped in a hyperlink.
     * @return {String} string representation of hyperlink node(s)
     */
    formatter.getObjectLinks = function (obj) {
        var param,
            linksString = '';
        if (!obj) {
            return linksString;
        }
        if (obj.length) {
            return formatter.getLinks(obj);
        }
        //For each property in the object, create a labeled list of values.
        for (param in obj) {
            if (obj.hasOwnProperty(param)) {
                linksString += param + ': ' + formatter.getLinks(obj[param]) + '<br/>';
            }
        }
        //Remove the extra "<br>" at the end of the string.
        return linksString.slice(0, -5);
    };

    /**
     * Displays reference document info
     * @memberof PTO/formatters
     * @param {Object} document
     * @return {String}
     */
    formatter.referenceDocument = function (document) {
        if (!document || !document.size) {
            return '';
        }
        return formatter.mimeType(document.type || document.contentType) +
            ' (' + formatter.fileSize(document.size) + ') uploaded on ' +
            formatter.dateFormat.dateDisplay(document.renditionModifiedDate || document.createDate);
    };

    /**
     * Formats the given mime type
     * @memberof PTO/formatters
     * @param {String} type The mime type
     * @return {String}
     */
    formatter.mimeType = function (type) {
        type = type && type.toLowerCase ? type : '';
        var mapped = formatter.mimeTypeMap[type.toLowerCase()];
        return mapped ? mapped.toUpperCase() : '';
    };


    formatter.rgb2hex = function (rgb) {
        var hexDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var arrrgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
        }

        return "#" + hex(arrrgb[1]) + hex(arrrgb[2]) + hex(arrrgb[3]);
    };

    formatter.hex2rgb = function (hex) {
        var c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
        }
        throw new Error('Bad Hex');
    }

    return formatter;
});