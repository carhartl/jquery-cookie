var lifecycle = {
	teardown: function () {
		$.cookie.defaults = {};
		delete $.cookie.raw;
		delete $.cookie.json;
		$.each($.cookie(), $.removeCookie);
	}
};


module('read', lifecycle);

test('simple value', function () {
	expect(1);
	document.cookie = 'c=v';
	equal($.cookie('c'), 'v', 'should return value');
});

test('empty value', function () {
	expect(1);
	// IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, which
	// resulted in a bug while reading such a cookie.
	$.cookie('c', '');
	equal($.cookie('c'), '', 'should return value');
});

test('not existing', function () {
	expect(1);
	strictEqual($.cookie('whatever'), undefined, 'return undefined');
});

test('RFC 2068 quoted string', function () {
	expect(1);
	document.cookie = 'c="v@address.com\\"\\\\\\""';
	equal($.cookie('c'), 'v@address.com"\\"', 'should decode RFC 2068 quoted string');
});

test('decode', function () {
	expect(1);
	document.cookie = encodeURIComponent(' c') + '=' + encodeURIComponent(' v');
	equal($.cookie(' c'), ' v', 'should decode key and value');
});

test('decode pluses to space for server side written cookie', function () {
	expect(1);
	document.cookie = 'c=foo+bar';
	equal($.cookie('c'), 'foo bar', 'should convert pluses back to space');
});

test('raw = true', function () {
	expect(2);
	$.cookie.raw = true;

	document.cookie = 'c=%20v';
	equal($.cookie('c'), '%20v', 'should not decode value');

	// see https://github.com/carhartl/jquery-cookie/issues/50
	$.cookie('c', 'foo=bar');
	equal($.cookie('c'), 'foo=bar', 'should include the entire value');
});

test('json = true', function () {
	expect(1);
	$.cookie.json = true;

	if ('JSON' in window) {
		$.cookie('c', { foo: 'bar' });
		deepEqual($.cookie('c'), { foo: 'bar'}, 'should parse JSON');
	} else {
		ok(true);
	}
});

test('not existing with json = true', function () {
	expect(1);
	$.cookie.json = true;

	if ('JSON' in window) {
		equal($.cookie('whatever'), null, 'should return null');
	} else {
		ok(true);
	}
});

asyncTest('malformed cookie value in IE (#88, #117)', function() {
	expect(1);
	// Sandbox in an iframe so that we can poke around with document.cookie.
	var iframe = $('<iframe src="sandbox.html"></iframe>')[0];
	$(iframe).on('load', function() {
		start();
		if (iframe.contentWindow.ok) {
			equal(iframe.contentWindow.testValue, 'two', 'reads all cookie values, skipping duplicate occurences of "; "');
		} else {
			// Skip the test where we can't stub document.cookie using
			// Object.defineProperty. Seems to work fine in
			// Chrome, Firefox and IE 8+.
			ok(true, 'N/A');
		}
	});
	document.body.appendChild(iframe);
});

test('return all cookies', function() {
	$.cookie('c', 'v');
	$.cookie('foo', 'bar');
	deepEqual($.cookie(), {
		c: 'v',
		foo: 'bar'
	}, 'should return all cookies');
	$.each($.cookie(), $.removeCookie);
	
	$.cookie.json = true;
	$.cookie('c', { foo: 'bar' });
	deepEqual($.cookie(), {
		c: { foo: 'bar' }
	}, 'should return all cookies with JSON parsed');
});


module('write', lifecycle);

test('String primitive', function () {
	expect(1);
	$.cookie('c', 'v');
	equal($.cookie('c'), 'v', 'should write value');
});

test('String object', function () {
	expect(1);
	$.cookie('c', new String('v'));
	equal($.cookie('c'), 'v', 'should write value');
});

test('value "[object Object]"', function () {
	expect(1);
	$.cookie('c', '[object Object]');
	equal($.cookie('c'), '[object Object]', 'should write value');
});

test('number', function () {
	expect(1);
	$.cookie('c', 1234);
	equal($.cookie('c'), '1234', 'should write value');
});

test('expires option as days from now', function() {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	equal($.cookie('c', 'v', { expires: 7 }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('expires option as Date instance', function() {
	expect(1);
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	equal($.cookie('c', 'v', { expires: sevenDaysFromNow }), 'c=v; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('invalid expires option (in the past)', function() {
	expect(1);
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	$.cookie('c', 'v', { expires: yesterday });
	equal($.cookie('c'), null, 'should not save already expired cookie');
});

test('return value', function () {
	expect(1);
	equal($.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

test('defaults', function () {
	expect(2);
	$.cookie.defaults.path = '/foo';
	ok($.cookie('c', 'v').match(/path=\/foo/), 'should use options from defaults');
	ok($.cookie('c', 'v', { path: '/bar' }).match(/path=\/bar/), 'options argument has precedence');
});

test('raw = true', function () {
	expect(1);
	$.cookie.raw = true;
	equal($.cookie('c', ' v').split('=')[1], ' v', 'should not encode');
});

test('json = true', function () {
	expect(1);
	$.cookie.json = true;

	if ('JSON' in window) {
		$.cookie('c', { foo: 'bar' });
		equal(document.cookie, 'c=' + encodeURIComponent(JSON.stringify({ foo: 'bar' })), 'should stringify JSON');
	} else {
		ok(true);
	}
});


module('removeCookie', lifecycle);

test('deletion', function() {
	expect(1);
	$.cookie('c', 'v');
	$.removeCookie('c');
	equal(document.cookie, '', 'should delete the cookie');
});

test('return', function() {
	expect(2);
	strictEqual($.removeCookie('c'), false, "return false if the cookie wasn't found");

	$.cookie('c', 'v');
	strictEqual($.removeCookie('c'), true, 'return true if the cookie was found');
});

test('with options', function() {
	expect(3);
	var originalCookie = $.cookie;
	var callCount = 0;

	$.cookie = function() {
		callCount++;
		if (callCount === 1)  {
			// see https://github.com/carhartl/jquery-cookie/issues/99
			equal(arguments.length, 1, 'look up cookie instead of accidently writing a new');
			return 'cookie'; // act as if a cookie was found...
		}
		if (callCount === 2) {
			equal(arguments[2].foo, 'bar', 'pass along options when deleting cookie');
		}
	};

	document.cookie = 'c=v';
	$.removeCookie('c', { foo: 'bar' });
	equal(callCount, 2);

	$.cookie = originalCookie;
});
