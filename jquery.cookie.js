/*jshint eqnull:true */
/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
/*
 * fork by ihipop @ 15:56 2012-07-10 
 * Add for human friendly units of expires days
 * now these methods are accessable
 *  jQuery.cookie('test',123,{expires:'0s'})
 * "test=123; expires=Tue, 10 Jul 2012 08:00:01 GMT"
 *  jQuery.cookie('test',123,{expires:'1m'})
 * "test=123; expires=Tue, 10 Jul 2012 08:01:08 GMT"
 *  jQuery.cookie('test',123,{expires:'1h'})
 * "test=123; expires=Tue, 10 Jul 2012 09:00:14 GMT"
 *  jQuery.cookie('test',123,{expires:'1d'})
 * "test=123; expires=Wed, 11 Jul 2012 08:00:17 GMT"
 *  jQuery.cookie('test',123,{expires:'1'})
 * TypeError: Object 1 has no method 'toUTCString'
 *  jQuery.cookie('test',123,{expires:1})
 * "test=123; expires=Wed, 11 Jul 2012 08:00:50 GMT"
 */
(function($, document) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value == null)) {
            options = $.extend({}, $.cookie.defaults, options);

            if (value == null) {
                options.expires = -1;
            }
            
            if (typeof options.expires !=='undefined' && typeof options.expires !== 'number') {
                if ($.inArray(options.expires.substr(-1),options.vailidUnits) > -1 ){
                    options.expiresUnit = options.expires.substr(-1);
                    options.expires = parseInt(options.expires);
                }
            }
            
            if (typeof options.expires === 'number') {
                var expires = options.expires, t = options.expires = new Date();
                // 'undefined'
                switch(options.expiresUnit){
                    case 's':
                        t.setSeconds(t.getSeconds() + expires);
                        break;
                    case 'm':
                        t.setMinutes(t.getMinutes() + expires);
                        break;
                    case 'h':
                        t.setHours(t.getHours() + expires);
                        break;
                    case 'd':
                    case 'undefined':
                    default :
                        t.setDate(t.getDate() + expires);                    
                }
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
        options = value || $.cookie.defaults || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var cookies = document.cookie.split('; ');
        for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
            if (decode(parts.shift()) === key) {
                return decode(parts.join('='));
            }
        }
        return null;
    };

    $.cookie.defaults = {vailidUnits:['s','m','h','d'],expiresUnit:'d'};

})(jQuery, document);