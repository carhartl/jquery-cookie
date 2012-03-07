/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            } else if (typeof options.expires === 'object') {
				var defaultExpiration = {
					seconds: 0,
					minutes: 0,
					hours: 0,
					days: 0,
					months: 0,
					years: 0
				};
				var expiration = $.extend({}, defaultExpiration, options.expires);
				
				var now = new Date();
				var fromNow = now.getTime() +
					expiration.seconds                       * 1000 + 
					expiration.minutes                  * 60 * 1000 +
					expiration.hours               * 60 * 60 * 1000 +
					expiration.days           * 24 * 60 * 60 * 1000 +
					expiration.months    * 30 * 24 * 60 * 60 * 1000 + // yeah, approximately
					expiration.years    * 365 * 24 * 60 * 60 * 1000;  // yeah, approximately
				now.setTime(fromNow);
				options.expires = now;
			}

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);
