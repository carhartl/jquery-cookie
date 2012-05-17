module('autoCookie (data-cookie)', {
    setup: function () {
        var cookies = document.cookie.split('; '),
        	$cont;
        for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
        }
        
        $cont = $("<div id='container'></div>").appendTo("body");
        $("<input type='text' id='text' data-cookie='textInput' value='textValue' />").appendTo($cont);
    	$("<input type='checkbox' id='checkbox' data-cookie='checkboxInput' value='checkboxValue' />").appendTo($cont);
    	$("<input type='radio' id='radio' data-cookie='radioInput' value='radioValue' />").appendTo($cont);
    	$("<select id='select' data-cookie='selectInput' ><option value=''>...</option><option value='selectValue' selected=''></option></select>").appendTo($cont);
    	$("<textarea id='textarea' data-cookie='textareaInput'>textareaValue</textarea>").appendTo($cont);
    },
    
    teardown: function() {
    	$("#container").remove();
    }
});
test("cookie value", function() {
	var $inputs = $("#container input, #container select, #container textarea");
	
	$("#container").autoCookie();
	
	$("#text").val("textValue").trigger("blur");
	$("#checkbox").val("checkboxValue").trigger("change");
	$("#radio").val("radioValue").trigger("change");
	$("#select").val("selectValue").trigger("change");
	$("#textarea").val("textareaValue").trigger("blur");
	
	expect($inputs.length);
	$inputs.each(function(index, el) {
		deepEqual($.cookie("auto-cookie-" + el.id + "Input"), el.id + "Value", "The cookie is correct");
	});
});
test("input value", function() {
	var $inputs = $("#container input, #container select, #container textarea");
	
	$("#container").autoCookie();
	
	$("#text").trigger("blur");
	$("#checkbox").trigger("change");
	$("#radio").trigger("change");
	$("#select").trigger("change");
	$("#textarea").trigger("blur");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	expect($inputs.length);
	$inputs.each(function(index, el) {
		deepEqual(el.value, el.id + "Value", "The input value is correct");
	});
});
test("input empty value", function() {
	var $inputs = $("#container input, #container select, #container textarea");
	
	$("#container").autoCookie();
	
	$("#text").val("").trigger("blur");
	$("#checkbox").val("").trigger("change");
	$("#radio").val("").trigger("change");
	$("#select").val("").trigger("change");
	$("#textarea").val("").trigger("blur");
	
	$("#text").val("textValue");
	$("#checkbox").val("checkboxValue");
	$("#radio").val("radioValue");
	$("#select").val("selectValue");
	$("#textarea").val("textareaValue");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	expect($inputs.length);
	$inputs.each(function(index, el) {
		deepEqual(el.value, "", "The input value is empty");
	});
});

module('autoCookie (class="data-cookie[]")', {
    setup: function () {
        var cookies = document.cookie.split('; '),
        	$cont;
        for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
        }
        
        $cont = $("<div id='container'></div>").appendTo("body");
        $("<input type='text' id='text' class='data-cookie[textInput]' value='textValue' />").appendTo($cont);
    	$("<input type='checkbox' id='checkbox' class='data-cookie[checkboxInput]' value='checkboxValue' />").appendTo($cont);
    	$("<input type='radio' id='radio' class='data-cookie[radioInput]' value='radioValue' />").appendTo($cont);
    	$("<select id='select' class='data-cookie[selectInput]' ><option value=''>...</option><option value='selectValue' selected=''></option></select>").appendTo($cont);
    	$("<textarea id='textarea' class='data-cookie[textareaInput]'>textareaValue</textarea>").appendTo($cont);
    },
    
    teardown: function() {
    	$("#container").remove();
    }
});
test("cookie value", function() {
	var $inputs = $("#container input, #container select, #container textarea");
	
	$("#container").autoCookie();
	
	$("#text").val("textValue").trigger("blur");
	$("#checkbox").val("checkboxValue").trigger("change");
	$("#radio").val("radioValue").trigger("change");
	$("#select").val("selectValue").trigger("change");
	$("#textarea").val("textareaValue").trigger("blur");
	
	expect($inputs.length);
	$inputs.each(function(index, el) {
		deepEqual($.cookie("auto-cookie-" + el.id + "Input"), el.id + "Value", "The cookie is correct");
	});
});
test("input value", function() {
	var $inputs = $("#container input, #container select, #container textarea");
	
	$("#container").autoCookie();
	
	$("#text").trigger("blur");
	$("#checkbox").trigger("change");
	$("#radio").trigger("change");
	$("#select").trigger("change");
	$("#textarea").trigger("blur");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	expect($inputs.length);
	$inputs.each(function(index, el) {
		deepEqual(el.value, el.id + "Value", "The input value is correct");
	});
});
test("input empty value", function() {
	var $inputs = $("#container input, #container select, #container textarea");
	
	$("#container").autoCookie();
	
	$("#text").val("").trigger("blur");
	$("#checkbox").val("").trigger("change");
	$("#radio").val("").trigger("change");
	$("#select").val("").trigger("change");
	$("#textarea").val("").trigger("blur");
	
	$("#text").val("textValue");
	$("#checkbox").val("checkboxValue");
	$("#radio").val("radioValue");
	$("#select").val("selectValue");
	$("#textarea").val("textareaValue");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	expect($inputs.length);
	$inputs.each(function(index, el) {
		deepEqual(el.value, "", "The input value is empty");
	});
});
test("trigger scope", function() {
	$("<input id='otherText' data-cookie='otherTextInput' value='otherTextValue'/>").appendTo("body");
	
	$("#container").autoCookie();
	$("#otherText").trigger("blur");
	
	deepEqual($.cookie("auto-cookie-otherTextInput"), null, "Should trigger the cookie events only inside the selector");
	
	$("#otherText").remove();
});