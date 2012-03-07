# jquery.cookie

A simple, lightweight jQuery plugin for reading, writing and deleting cookies.

## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

    <script src="/path/to/jquery.cookie.js"></script>

## Usage

Create session cookie:

    $.cookie('the_cookie', 'the_value');

Create expiring cookie, 7 days from then:

    $.cookie('the_cookie', 'the_value', { expires: 7 });

Create expiring cookie, valid across entire page:

    $.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
	
Read cookie:

    $.cookie('the_cookie'); // => 'the_value'
    $.cookie('not_existing'); // => null

Delete cookie by passing null as value:

    $.cookie('the_cookie', null);

*Note: when deleting a cookie, you must pass the exact same path, domain and secure options that were used to set the cookie.*

## Options

### expires

Define lifetime of the cookie. If omitted, the cookie is a session cookie.

Value can be a `Number` (which will be interpreted as days from time of creation).

    expires: 365

It can also be a `Date` object.

	var date = new Date();
	date.setDay(date.getDay() + 7);
	
    $.cookie('the_cookie', 'the_value', { 
		expires: date
	});

It can also be a custom object that will indicate how far from now the cookie should expire. 

    $.cookie('the_cookie', 'the_value', { 
		expires: {
			days: 7
		}		
	});

That is equivalent to the previous example, but you can specify any combination of `seconds`, `minutes`, `days`, `months`, `years`. Right now months are just considered to be 30 days and a year is considered to be 365 days.

Another more complex exmaple: 

    $.cookie('the_cookie', 'the_value', { 
		expires: {
			seconds: 15,
			days: 7,
			months: 3
		}		
	});

### path

    path: '/'

Default: path of page where the cookie was created.

Define the path where cookie is valid. *By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior).* If you want to make it available for instance across the entire page use `path: '/'`.

### domain

    domain: 'example.com'

Default: domain of page where the cookie was created.

### secure

    secure: true

Default: `false`. If true, the cookie transmission requires a secure protocol (https).

### raw

    raw: true

Default: `false`.

By default the cookie is encoded/decoded when creating/reading, using `encodeURIComponent`/`decodeURIComponent`. Turn off by setting `raw: true`.

## Changelog

## Development

- Source hosted at [GitHub](https://github.com/carhartl/jquery-cookie)
- Report issues, questions, feature requests on [GitHub Issues](https://github.com/carhartl/jquery-cookie/issues)

Pull requests are very welcome! Make sure your patches are well tested. Please create a topic branch for every separate change you make.

## Authors

[Klaus Hartl](https://github.com/carhartl)
