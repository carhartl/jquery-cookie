var setup = {
    setup: function () {
        var cookies = document.cookie.split('; '),
        	$cont;
        for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
        }
        
        $("<div id='container'></div>").appendTo( document.body );
    },
    
    teardown: function() {
    	$("#container").remove();
    }
};

module('autoCookie (data-cookie)', setup);
test("cookie value", function() {
	$("<input type='text' id='text' data-cookie='textInput' />").appendTo("#container");
	$("<textarea id='textarea' data-cookie='textareaInput'></textarea>").appendTo("#container");
	$("<input type='checkbox' id='checkbox' data-cookie='checkboxInput' />").appendTo("#container");
	$("<select id='select' data-cookie='selectInput'><option value=''>...</option><option value='selectValue'>.....</option></select>").appendTo("#container");
	
	$("#container").autoCookie();
	$("#text").val("textValue").trigger("blur");
	$("#textarea").val("textareaValue").trigger("blur");
	$("#checkbox").prop("checked", true).trigger("change");
	$("#select").val("selectValue").trigger("change");
	
	deepEqual($.cookie("auto-cookie-textInput"), "textValue", "The cookie value is correct");
	deepEqual($.cookie("auto-cookie-textareaInput"), "textareaValue", "The cookie value is correct");
	deepEqual($.cookie("auto-cookie-checkboxInput"), "true", "The cookie value is correct");
	deepEqual($.cookie("auto-cookie-selectInput"), "selectValue", "The cookie value is correct");
});
test("input value", function() {
	$("<input type='text' id='text' data-cookie='textInput' />").appendTo("#container");
	$("<textarea id='textarea' data-cookie='textareaInput'></textarea>").appendTo("#container");
	$("<input type='checkbox' id='checkbox' data-cookie='checkboxInput' />").appendTo("#container");
	$("<select id='select' data-cookie='selectInput'><option value=''>...</option><option value='selectValue'>.....</option></select>").appendTo("#container");
	
	$("#container").autoCookie();
	$("#text").val("textValue").trigger("blur").val("");
	$("#textarea").val("textareaValue").trigger("blur").val("");
	$("#checkbox").prop("checked", true).trigger("change").prop("checked", false);
	$("#select").val("selectValue").trigger("change").val("");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	deepEqual($("#text").val(), "textValue", "The input value is correct");
	deepEqual($("#textarea").val(), "textareaValue", "The input value is correct");
	deepEqual($("#checkbox").prop("checked"), true, "The input value is correct");
	deepEqual($("#select").val(), "selectValue", "The input value is correct");
});
test("input empty value", function() {
	$("<input type='text' id='text' data-cookie='textInput' />").appendTo("#container");
	$("<textarea id='textarea' data-cookie='textareaInput'></textarea>").appendTo("#container");
	$("<select id='select' data-cookie='selectInput'><option value=''>...</option><option value='selectValue'>.....</option></select>").appendTo("#container");
	
	$("#container").autoCookie();
	$("#text").val("").trigger("blur").val("textValue");
	$("#textarea").val("").trigger("blur").val("textareaValue");
	$("#select").val("").trigger("change").val("selectValue");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	deepEqual($("#text").val(), "", "The input value is correct");
	deepEqual($("#textarea").val(), "", "The input value is correct");
	deepEqual($("#select").val(), "", "The input value is correct");
});
test("checkbox empty", function() {
	$("<input type='checkbox' id='checkbox' data-cookie='checkboxInput' />").appendTo("#container");
	
	$("#container").autoCookie();
	$("#checkbox").prop("checked", false).trigger("change").prop("checked", true);
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	deepEqual($("#checkbox").prop("checked"), false, "The input value is correct");
});

module('autoCookie (class="data-cookie[]")', setup);
test("cookie value", function() {
	$("<input type='text' id='text' class='data-cookie[textInput]' />").appendTo("#container");
	$("<textarea id='textarea' class='data-cookie[textareaInput]'></textarea>").appendTo("#container");
	$("<input type='checkbox' id='checkbox' class='data-cookie[checkboxInput]' />").appendTo("#container");
	$("<select id='select' class='data-cookie[selectInput]'><option value=''>...</option><option value='selectValue'>.....</option></select>").appendTo("#container");
	
	$("#container").autoCookie();
	$("#text").val("textValue").trigger("blur");
	$("#textarea").val("textareaValue").trigger("blur");
	$("#checkbox").prop("checked", true).trigger("change");
	$("#select").val("selectValue").trigger("change");
	
	deepEqual($.cookie("auto-cookie-textInput"), "textValue", "The cookie value is correct");
	deepEqual($.cookie("auto-cookie-textareaInput"), "textareaValue", "The cookie value is correct");
	deepEqual($.cookie("auto-cookie-checkboxInput"), "true", "The cookie value is correct");
	deepEqual($.cookie("auto-cookie-selectInput"), "selectValue", "The cookie value is correct");
});
test("input value", function() {
	$("<input type='text' id='text' class='data-cookie[textInput]' />").appendTo("#container");
	$("<textarea id='textarea' class='data-cookie[textareaInput]'></textarea>").appendTo("#container");
	$("<input type='checkbox' id='checkbox' class='data-cookie[checkboxInput]' />").appendTo("#container");
	$("<select id='select' class='data-cookie[selectInput]'><option value=''>...</option><option value='selectValue'>.....</option></select>").appendTo("#container");
	
	$("#container").autoCookie();
	$("#text").val("textValue").trigger("blur").val("");
	$("#textarea").val("textareaValue").trigger("blur").val("");
	$("#checkbox").prop("checked", true).trigger("change").prop("checked", false);
	$("#select").val("selectValue").trigger("change").val("");
	
	$("#container").off("blur change");
	$("#container").autoCookie();
	
	deepEqual($("#text").val(), "textValue", "The input value is correct");
	deepEqual($("#textarea").val(), "textareaValue", "The input value is correct");
	deepEqual($("#checkbox").prop("checked"), true, "The input value is correct");
	deepEqual($("#select").val(), "selectValue", "The input value is correct");
});
test("Invalid cookie value on checkbox", function() {
	$("<input type='checkbox' id='checkbox' class='data-cookie[checkboxInput]' />").appendTo("#container");
	
	$.cookie("auto-cookie-checkboxInput", "hfhfd");
	$("#container").autoCookie();
	
	deepEqual($("#checkbox").prop("checked"), false, "The input value is correct");
});