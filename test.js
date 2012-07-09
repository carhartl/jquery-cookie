var before = {
    setup: function () {
        cookies = document.cookie.split('; ')
        for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
        }

        $.cookie.defaults = {};
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

test('simple value with expires', 1, function () {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 5);
    document.cookie = 'c=testcookie; expires=' + tomorrow.toUTCString();
    equal($.cookie('c'), 'testcookie', 'should return value');
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
    equal($.cookie('c'), '1234', 'should write value');
});

test('with expires 7 days from now', 1, function() {
  var seven_days_from_now = new Date();
  seven_days_from_now.setDate(seven_days_from_now.getDate() + 7);
  equal($.cookie('c', 'v', {expires:7}), 'c=v; expires='+seven_days_from_now.toUTCString(), 'should return the cookie string with expires');
});

test('with expires yesterday', 2, function() {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  equal($.cookie('c', 'v', {expires:-1}), 'c=v; expires='+yesterday.toUTCString(), 'should return the cookie string with expires');
  equal(document.cookie, '', 'should not save expired cookie');
});

test('return value', 1, function () {
    equal($.cookie('c', 'v'), 'c=v', 'should return written cookie string');
});

test('raw: true', 1, function () {
    equal($.cookie('c', ' v', { raw: true }).split('=')[1],
        ' v', 'should not encode');
});

test('defaults', 1, function () {
    $.cookie.defaults.raw = true;
    equal($.cookie('c', ' v').split('=')[1], ' v', 'should use raw from defaults');
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
