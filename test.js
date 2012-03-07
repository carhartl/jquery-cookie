var before = {
    setup: function () {
        cookies = document.cookie.split('; ')
        for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
        }
    }
};

module('read', before);

test('simple value', 2, function () {
    document.cookie = 'c=v';
    equal($.cookie('c'), 'v', 'should return value');
	equal($.cookie('c'), 'v', 'value should be persistent');
});

test('empty value', 1, function () {
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

test('raw: true', 1, function () {
    document.cookie = 'c=%20v';
    equal($.cookie('c', { raw: true }), '%20v', 'should not decode');
});


module('write', before);

test('String primitive', 1, function () {
	$.cookie('c', 'v');
    equal(document.cookie, 'c=v', 'should write value');
});

test('String object', 1, function () {
    $.cookie('c', new String('v'));
    equal(document.cookie, 'c=v', 'should write value');
});

test('value "[object Object]"', 1, function() {
    $.cookie('c', '[object Object]');
    equal($.cookie('c'), '[object Object]', 'should write value');
});

test('number', 1, function() {
    $.cookie('c', 1234);
    equal($.cookie('c'), '1234', 'should write value');
});

test('return value', 1, function () {
    equal($.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

test('raw: true', 1, function () {
    equal($.cookie('c', ' v', { raw: true }).split('=')[1],
        ' v', 'should not encode');
});


module('delete', before);

test('delete', 2, function () {
    document.cookie = 'c=v';
    $.cookie('c', null);
    equal(document.cookie, '', 'should delete with null as value');

    document.cookie = 'c=v';
    $.cookie('c', undefined);
    equal(document.cookie, '', 'should delete with undefined as value');
});

//sadly, expiration times can not be checked natively on cookies once set, so we can't have tests for those
module('expires option', before);

test('can be called with a configuration object', 1, function() {
	$.cookie('c', 'v', { 
		expires: {
			seconds: 0,
			minutes: 0,
			hours: 1,
			days: 0,
			months: 0,
			years: 0
		}
	});
	ok(true);
});

test('setting past values', 1, function() {
	$.cookie('c', 'v', { 
		expires: {
			seconds: 0,
			minutes: 0,
			hours: -1,
			days: 0,
			months: 0,
			years: 0
		}
	});
	equal(document.cookie, '', 'should be deleted from the browser');
});

test('setting big values', 2, function() {
	$.cookie('c', 'v', { 
		expires: {
			seconds: 0,
			minutes: 0,
			hours: 0,
			days: 0,
			months: 0,
			years: 1000
		}
	});
	ok(true, 'should not break anything');
	equal(document.cookie, 'c=v', 'should persist');
});

test('missing values', 1, function() {
	$.cookie('c', 'v', { 
		expires: {
			minutes: 5
		}
	});
	ok(true, 'should not break anything');
});

