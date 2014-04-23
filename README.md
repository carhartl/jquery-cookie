# jquery.cookie [![Build Status](https://travis-ci.org/carhartl/jquery-cookie.png?branch=master)](https://travis-ci.org/carhartl/jquery-cookie) [![Code Climate](https://codeclimate.com/github/carhartl/jquery-cookie.png)](https://codeclimate.com/github/carhartl/jquery-cookie)

A simple, lightweight jQuery plugin for reading, writing and deleting cookies.

**If you're viewing this at https://github.com/carhartl/jquery-cookie, you're reading the documentation for the master branch.
[View documentation for the latest release (1.4.0).](https://github.com/carhartl/jquery-cookie/tree/v1.4.0)**

## Build Status Matrix

[![Selenium Test Status](https://saucelabs.com/browser-matrix/jquery-cookie.svg)](https://saucelabs.com/u/jquery-cookie)

## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/jquery.cookie.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).** The file is being served as text/plain and as such being blocked
in Internet Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom line: GitHub is not a CDN.

The plugin can also be loaded as AMD or CommonJS module.

## Usage

Create session cookie:

```javascript
$.cookie('the_cookie', 'the_value');
```

Create expiring cookie, 7 days from then:

```javascript
$.cookie('the_cookie', 'the_value', { expires: 7 });
```

Create expiring cookie, valid across entire site:

```javascript
$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
```

Read cookie:

```javascript
$.cookie('the_cookie'); // => "the_value"
$.cookie('not_existing'); // => undefined
```

Read all available cookies:

```javascript
$.cookie(); // => { "the_cookie": "the_value", "...remaining": "cookies" }
```

Delete cookie:

```javascript
// Returns true when cookie was found, false when no cookie was found...
$.removeCookie('the_cookie');

// Same path as when the cookie was written...
$.removeCookie('the_cookie', { path: '/' });
```

*Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie, unless you're relying on the default options that is.*

## JSON

Objects and arrays are transparently converted to/from JSON. This consistent with the jQuery `.data()` function:

- *Read:* cookies starting with `{` or `[` will be parsed with `JSON.parse()` and returned as an object or array
- *Write:* cookies that are native objects (`foo.constructor === Object`) or arrays (`foo.constructor === Array`) will be encoded as JSON with `JSON.stringify()` and stored as strings

The cookie string must follow [valid JSON syntax](http://en.wikipedia.org/wiki/JSON#Data_types.2C_syntax_and_example) including quoted property names. If the cookie isn't parseable for any reason, it is returned as a string.

Strings that are similar to JSON, such as `[test me]` are not parseable, and will be returned as strings.

Storing an array or object in a cookie:

```javascript
$.cookie('the_cookie1', [1, 2, 3]); // Automatically convert the array to JSON.
$.cookie('the_cookie2', {foo: 'bar'}); // Automatically converts the object to JSON.
```

Retrieving an object or array stored as a JSON cookie:

```javascript
var cookie1 = $.cookie('the_cookie1'); // [1, 2, 3]
var cookie2 = $.cookie('the_cookie2'); // {foo: 'bar'}
```

**Note about backwards compatibility**

The `json` configuration setting has been removed and no longer has any effect. Since JSON parsing happens transparently now, most code will require no changes. But be aware: if a cookie cannot be parsed, the `$.cookie()` will return the raw string version will now be returned, whereas previously it would return `undefined`.

Because `$.cookie()` may now return an object or array, if you were previously storing JSON in a cookie and passing it to `JSON.parse()` manually, you may now end up passing an object or array into `JSON.parse()`, causing an exception.

## Configuration

### raw

By default the cookie value is encoded/decoded when writing/reading, using `encodeURIComponent`/`decodeURIComponent`. Bypass this by setting raw to true:

```javascript
$.cookie.raw = true;
```

## Cookie options

Cookie attributes can be set globally by setting properties of the `$.cookie.defaults` object or individually for each call to `$.cookie()` by passing a plain object to the options argument. Per-call options override the default options.

### expires

    expires: 365

Define lifetime of the cookie. Value can be a `Number` which will be interpreted as days from time of creation or a `Date` object. If omitted, the cookie becomes a session cookie.

### path

    path: '/'

Define the path where the cookie is valid. *By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior).* If you want to make it available for instance across the entire domain use `path: '/'`. Default: path of page where the cookie was created.

**Note regarding Internet Explorer:**

> Due to an obscure bug in the underlying WinINET InternetGetCookie implementation, IE’s document.cookie will not return a cookie if it was set with a path attribute containing a filename.

(From [Internet Explorer Cookie Internals (FAQ)](http://blogs.msdn.com/b/ieinternals/archive/2009/08/20/wininet-ie-cookie-internals-faq.aspx))

This means one cannot set a path using `path: window.location.pathname` in case such pathname contains a filename like so: `/check.html` (or at least, such cookie cannot be read correctly).

### domain

    domain: 'example.com'

Define the domain where the cookie is valid. Default: domain of page where the cookie was created.

### secure

    secure: true

If true, the cookie transmission requires a secure protocol (https). Default: `false`.

## Converters

Provide a conversion function as optional last argument for reading, in order to change the cookie's value
to a different representation on the fly.

Example for parsing a value into a number:

```javascript
$.cookie('foo', '42');
$.cookie('foo', Number); // => 42
```

Dealing with cookies that have been encoded using `escape` (3rd party cookies):

```javascript
$.cookie.raw = true;
$.cookie('foo', unescape);
```

You can pass an arbitrary conversion function.

## Contributing

Check out the [Contributing Guidelines](CONTRIBUTING.md)

## Authors

[Klaus Hartl](https://github.com/carhartl)
