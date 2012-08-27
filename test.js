var before = {
	setup: function () {
		cookies = document.cookie.split('; ')
		for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
			document.cookie = c + '=; expires=' + new Date(0).toUTCString();
		}

		$.cookie.defaults = {};
	}
};

//Uncomment to simulate older browsers
//JSON = undefined;

//When JSON exists, it will store the values JSON encoded.
//When testing against the output of $.cookie set,
//the value needs to be transformed.
//Maybe we should be always testing against $.cookie get ?
function transform(value, raw) {
	if(JSON !== undefined) value = JSON.stringify(value);
	if(raw === undefined) raw = false;
	if(!raw) value = encodeURIComponent(value);
	return value;
}



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

test('raw: true', 1, function () {
	document.cookie = 'c=%20v';
	equal($.cookie('c', { raw: true }), '%20v', 'should not decode value');
});

test('[] used in name', 1, function () {
	document.cookie = 'c[999]=foo';
	equal($.cookie('c[999]'), 'foo', 'should return value');
});

test('embedded equals', 1, function () {
	$.cookie('c', 'foo=bar', { raw: true });
	equal($.cookie('c', { raw: true }), 'foo=bar', 'should include the entire value');
});

test('defaults', 1, function () {
	document.cookie = 'c=%20v';
	$.cookie.defaults.raw = true;
	equal($.cookie('c'), '%20v', 'should use raw from defaults');
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
	//Note: JSON can store as int. So, == will pass and === will fail.
	equal($.cookie('c'), '1234', 'should write value');
});

test('expires option as days from now', 1, function() {
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	equal($.cookie('c', 'v', { expires: 7 }), 'c='+transform('v')+'; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('expires option as Date instance', 1, function() {
	var sevenDaysFromNow = new Date();
	sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
	equal($.cookie('c', 'v', { expires: sevenDaysFromNow }), 'c='+transform('v')+'; expires=' + sevenDaysFromNow.toUTCString(),
		'should write the cookie string with expires');
});

test('invalid expires option (in the past)', 1, function() {
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	$.cookie('c', 'v', { expires: yesterday });
	equal($.cookie('c'), null, 'should not save already expired cookie');
});

test('return value', 1, function () {
	equal($.cookie('c', 'v'), 'c='+transform('v'), 'should return written cookie string');
});

test('raw option set to true', 1, function () {
	equal($.cookie('c', ' v', { raw: true }).split('=')[1], transform(' v', true), 'should not encode');
});

test('defaults', 1, function () {
	$.cookie.defaults.raw = true;
	equal($.cookie('c', ' v').split('=')[1], transform(' v', true), 'should use raw from defaults');
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

test('passing options', 2, function() {
	var oldCookie = $.cookie;

	$.cookie = function(arg0, arg1, arg2) {
		if (arg1 === null) {
			equal(arg2.test, 'options', 'The options should be passed');
		} else {
			equal(arg1.test, 'options', 'The options should be passed');
		}
	};

	document.cookie = 'c=v';
	$.removeCookie('c', { test: 'options' });

	$.cookie = oldCookie;
});
