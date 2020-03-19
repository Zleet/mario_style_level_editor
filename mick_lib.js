// =============================================================================
// mick_lib.js
//
// A selection of javascript functions that I use in every project.
// =============================================================================
// Wrapper for console.log
// =============================================================================
function cl(message) {
	
	console.log(message);
	
	return;
}
// =============================================================================
// Wrapper for document.getElementById(). Returns the DOM element with id
// element_id.
// =============================================================================
function gebi(element_id) {
	
	var dom_element = document.getElementById(element_id);
	
	return dom_element;
}
// =============================================================================
// Display the element with element id element_id
// =============================================================================
function hola(element_id) {
	
	var element = document.getElementById(element_id);
	element.style.display = "block";
	
	return;
}
// =============================================================================
// Hide the element with id element_id
// =============================================================================
function adios(element_id) {
	
	var element = document.getElementById(element_id);
	element.style.display = "none";

	return;
}
// =============================================================================
// Return a random integer between min and max (both inclusive).
// =============================================================================
function randint(min, max) {
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// =============================================================================
// Stick message in the debug textarea
// =============================================================================
function debug(message) {
    
    var debug_textarea = gebi("debug_textarea");
    
    debug_textarea.value = message;
    
    return;
}
// =============================================================================
// 1. find sentinel_string within big_string and remove everything before it
//    (if sentinel string is an empty string, skip this step)
// 2. extract the substring between start_string and end_string and return it
//    (without including start_string and end_string)
// =============================================================================
function extract_substring(big_string, sentinel_string, start_string,
                                                                end_string) {
    
    // search variables
    var loc;
    var start;
    var end;
    
    // if sentinel_string is not an empty string AND sentinel_string is in
    // big_string, locate it and remove everything before it
    if ((sentinel_string.length > 0)
        && (big_string.indexOf(sentinel_string) != -1)) {
        loc = big_string.indexOf(sentinel_string);
        big_string = big_string.substring(loc);
    }
    
    // find start_string and remove everything before it (also remove
    // start_string)
    loc = big_string.indexOf(start_string) + start_string.length;
    big_string = big_string.substring(loc);
    
    // find end_string and remove it and everything after it
    loc = big_string.indexOf(end_string);
    var extracted_substring = big_string.substring(0, loc);
    
    return extracted_substring;
}
// ============================================================================
// Build a html template for a new window and return it. The template will
// contain placeholder strings, which can be replaced by the calling function,
// for:
// 1. additional styles
// 2. the body html
// ============================================================================
function build_html_template_for_new_window() {
	
	var html = '<!DOCTYPE html>';
	html += '<html>';
	html += '<head>';
	html += '<style>';
	html += 'body{';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += '}';
	html += 'button {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += '}';
	html += 'button:hover {';
	html += 'border: 2px dashed red;';
	html += '}';
	html += 'select {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius : 10px;';
	html += '}';
	html += 'input {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius : 10px;';
	html += 'width: 40px;';
	html += 'text-align : center;';
	html += '}';
	html += 'textarea {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius : 10px;';
	html += '}';
	html += '/* additional styles go here */';
	html += '</style>';
	html += '</head>';
	html += '<body>';
	html += '<!-- body html goes here -->';
	html += '</body>';
	html += '</html>';
	
	return html;
}
// ============================================================================
// Test whether a string consists solely of the digits 0 to 9.
// If so, return 1, otherwise return 0.
// ============================================================================
function string_consists_of_digits_only(the_string) {
	
	var digits = "0123456789";
	
	for (var i = 0; i < the_string.length; ++i) {
		var current_character = the_string.substring(i, i + 1);
		if (digits.indexOf(current_character) == -1) {
			return 0;
		}
	}
	
	// if we've fallen through, all of the characters in the_string are digits
	return 1;
}
// ============================================================================
