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
    
    $.removeCookie = function(cookieName) {
		$.cookie( cookieName, null );
	};
	
	$.fn.autoCookie = function() {
		
		var cookiePrefix = "auto-cookie-",
			selector = "input:text, input:checkbox, select, textarea";
		
		function _dataName() {
			var className,
				$this = this,
				dataName = $this.data("cookie");
			
			//If no data attribute consider looking the className
			if( dataName === undefined ) {
				className = $this.attr("class");
				if(className) {
					$.each( className.split(" "), function( index, _class ) {
						if( _class.substring(0, 11) == "data-cookie" ) {
							dataName = _class.substring( 12, _class.length - 1 );
							return false;
						}
					});
				}
			}
		return dataName;
		};
		
		function _setInputVal( $input, val ) {
			if( $input.attr("type") === "checkbox" ) {
				$input.prop( "checked", eval(val) );
			} else {
				$input.val(val);
			}
		};
		
		function _getInputVal($input) {
			var ret;
			
			if( $input.attr("type") === "checkbox" ) {
				ret = $input.prop("checked").toString();
			} else {
				ret = $input.val();
			}
		return ret;
		};
		
		$( selector, this ).each(function( index, domElement ) {
			var val,
				$this = $(this),
				dataName = _dataName.apply( $this, arguments );
			
			if(dataName) {
				val = $.cookie( cookiePrefix + dataName );
				if( val !== null ) {
					_setInputVal( $this, val );
				}
			}
		});
		
		$(this).on( "blur change", selector, function(e) {
			var $this = $(this),
				dataName = _dataName.apply( $this, arguments );
			
			if(dataName) {
				$.cookie( cookiePrefix + dataName, _getInputVal($this) );
			}
		});
	};
})(jQuery);
