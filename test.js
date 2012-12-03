var before = {
	setup: function () {
		cookies = document.cookie.split('; ')
		for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
			document.cookie = c + '=; expires=' + new Date(0).toUTCString();
		}

		$.cookie.defaults = {};
		delete $.cookie.raw;
		delete $.cookie.json;
	}
};


module('read', before);

test('simple value', 1, function () {
	document.cookie = 'c=v';
	equal($.cookie('c'), 'v', 'should return value');
});

test('empty value', 1, function () {
	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
	// resulted in a bug while reading such a cookie.
	$.cookie('c', '');
	equal($.cookie('c'), '', 'should return value');
});

test('not existing', 1, function () {
	equal($.cookie('whatever'), null, 'should return null');
});

test('decode', 1, function () {
	document.cookie = encodeURIComponent(' c') + '=' + encodeURIComponent(' v');
	equal($.cookie(' c'), ' v', 'should decode key and value');
});

test('decode pluses to space for server side written cookie', 1, function () {
	document.cookie = 'c=foo+bar'
	equal($.cookie('c'), 'foo bar', 'should convert pluses back to space');
});

test('[] used in name', 1, function () {
	document.cookie = 'c[999]=foo';
	equal($.cookie('c[999]'), 'foo', 'should return value');
});

test('raw: true', 2, function () {
	$.cookie.raw = true;

	document.cookie = 'c=%20v';
	equal($.cookie('c'), '%20v', 'should not decode value');

	// see https://github.com/carhartl/jquery-cookie/issues/50
	$.cookie('c', 'foo=bar');
	equal($.cookie('c'), 'foo=bar', 'should include the entire value');
});

test('json: true', 1, function () {
	$.cookie.json = true;

	if ('JSON' in window) {
		document.cookie = 'c=' + JSON.stringify({ foo: 'bar' });
		deepEqual($.cookie('c'), { foo: 'bar'}, 'should parse JSON');
	} else {
		ok(true);
	}
});

asyncTest('malformed cookie value in IE (#88, #117)', 1, function() {
	// Sandbox in an iframe so that we can poke around with document.cookie.
	var iframe = document.createElement('iframe');
	iframe.onload = function() {
		start();
		if (iframe.contentWindow.ok) {
			equal(iframe.contentWindow.testValue, 'two', 'reads all cookie values, skipping duplicate occurences of "; "');
		} else {
			// Skip the test where we can't stub document.cookie using
			// Object.defineProperty. Seems to work fine in
			// Chrome, Firefox and IE 8+.
			ok(true, 'N/A');
		}
	};
	iframe.src = 'sandbox.html';
	document.body.appendChild(iframe);
});


module('write', before);

test('String primitive', 1, function () {
	$.cookie('c', 'v');
	equal($.cookie('c'), 'v', 'should write value');
});

test('String object', 1, function () {
	$.cookie('c', new String('v'));
	equal($.cookie('c'), 'v', 'should write value');
});

test('value "[object Object]"', 1, function () {
	$.cookie('c', '[object Object]');
	equal($.cookie('c'), '[object Object]', 'should write value');
});

test('number', 1, function () {
	$.cookie('c', 1234);
	equal($.cookie('c'), '1234', 'should write value');
});

test('expires option as days from now', 1, function() {
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	equal($.cookie('c', 'v', { expires: 7 }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('expires option as Date instance', 1, function() {
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	equal($.cookie('c', 'v', { expires: sevenDaysFromNow }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('invalid expires option (in the past)', 1, function() {
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	$.cookie('c', 'v', { expires: yesterday });
	equal($.cookie('c'), null, 'should not save already expired cookie');
});

test('return value', 1, function () {
	equal($.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

test('defaults', 2, function () {
	$.cookie.defaults.path = '/';
	ok($.cookie('c', 'v').match(/path=\//), 'should use options from defaults');
	ok($.cookie('c', 'v', { path: '/foo' }).match(/path=\/foo/), 'options argument has precedence');
});

test('raw: true', 1, function () {
	$.cookie.raw = true;
	equal($.cookie('c', ' v').split('=')[1], ' v', 'should not encode');
});

test('json: true', 1, function () {
	$.cookie.json = true;

	if ('JSON' in window) {
		$.cookie('c', { foo: 'bar' });
		equal(document.cookie, 'c=' + encodeURIComponent(JSON.stringify({ foo: 'bar' })), 'should stringify JSON');
	} else {
		ok(true);
	}
});


module('delete', before);

test('delete (deprecated)', 1, function () {
	document.cookie = 'c=v';
	$.cookie('c', null);
	equal(document.cookie, '', 'should delete the cookie');
});


module('removeCookie', before);

test('delete', 1, function() {
	document.cookie = 'c=v';
	$.removeCookie('c');
	equal(document.cookie, '', 'should delete the cookie');
});

test('return', 2, function() {
	equal($.removeCookie('c'), false, "should return false if a cookie wasn't found");

	document.cookie = 'c=v';
	equal($.removeCookie('c'), true, 'should return true if the cookie was found');
});

test('with options', 2, function() {
	var oldCookie = $.cookie;

	$.cookie = function(arg0, arg1, arg2) {
		if (arg1 === null) {
			equal(arg2.foo, 'bar', 'should pass options when deleting cookie');
		} else {
			// see https://github.com/carhartl/jquery-cookie/issues/99
			equal(arguments.length, 1, "should look up cookie instead of writing a new");
		}
	};

	document.cookie = 'c=v';
	$.removeCookie('c', { foo: 'bar' });

	$.cookie = oldCookie;
});

module('list', before);

test('empty', 2, function () {
	document.cookie = '';
	
	var keys = $.cookie();
	ok($.isArray(keys), 'must be array');
	ok(keys.length, 'must be empty array');
});

test('one', 3, function () {
	document.cookie = '';
	$.cookie('c', 'v');
	var keys = $.cookie();
	ok($.isArray(keys), 'must be array');
	equal(keys.length, 1, 'must have 1 element');
	equal(keys.join(','), 'c', 'elements must equal');
});

test('two', 3, function () {
	$.cookie('c', 'v');
	$.cookie('a', 'b');
	var keys = $.cookie();
	ok($.isArray(keys), 'must be array');
	equal(keys.length, 2, 'must have 2 elements');
	equal(keys.join(','), 'c,a', 'elements must equal');
});