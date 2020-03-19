// =============================================================================
// globals

// global handle for the control window
var control_window = -1;

// global handle for the export map window
var export_map_window = -1;

// global handle for the import map window
var import_map_window = -1;
// =============================================================================
// Build the html for and open the control window.
// Among other buttons/controls, the control window will have the following:
// - button for opening the import/export map window
// - button for filling the map with the current tile
// - button for filling a complete map row with the current tile. This will be
//   a line in the following format:
//   FILL MAP ROW [ ] WITH CURRENT TILE <GO>
// =============================================================================
function build_and_open_control_window() {
	
	// build the html for the control window
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
	html += 'border-radius: 10px;';
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
	html += '</style>';
	html += '</head>';
	html += '<body>';
	html += '<table align="center">';
	html += '<tr><td style="text-align: center;">';
	html += '<strong>CONTROLS</strong></td></tr>';
	html += '</table>';
	
	// open windows menu
	html += '<table align="center" style="border: 2px solid aqua; ';
	html += 'border-radius: 10px;">';
	html += '<tr><td colspan="3" style="text-align: center;">';
	html += 'OPEN WINDOW(S)</td></tr>';
	html += '<tr>';
	html += '<td>';
	html += '<select id="open_window_dropdown_menu">';
	html += '<option value="all">all</option>';
	html += '<option value="tiles">tiles</option>';
	html += '<option value="enemies">enemies</option>';
	html += '</select>';
	html += '</td>';
	html += '<td style="width: 5px;"></td>';	// spacer cell
	html += '<td><button id="open_window_button">OPEN</button></td>';
	html += '</tr>';
	html += '</table>';
	
	// spacer table
	html += '<table>';
	html += '<tr><td style="height: 1px;"></td></tr>';
	html += '</table>';

	// editing mode dropdown menu
	html += '<table align="center" style="border: 2px solid aqua; ';
	html += 'border-radius: 10px;">';
	html += '<tr>';
	html += '<td>EDITING MODE</td>';
	html += '<td style="width: 5px;"></td>';	// spacer cell
	html += '<td>';
	html += '<select id="editing_mode_dropdown_menu">';
	html += '<option value="place_tiles">place tiles</option>';
	html += '<option value="place_enemies">place enemies</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';

	// spacer table
	html += '<table>';
	html += '<tr><td style="height: 1px;"></td></tr>';
	html += '</table>';

	// import/export map buttons
	html += '<table align="center" style="border: 2px solid aqua; ';
	html += 'border-radius: 10px;">';
	html += '<tr>';
	html += '<td>';
	html += '<button id="open_import_map_window_button">IMPORT MAP</button>';
	html += '</td>';
	html += '<td>';
	html += '<button id="open_export_map_window_button">EXPORT MAP</button>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	
	// spacer table
	html += '<table>';
	html += '<tr><td style="height: 1px;"></td></tr>';
	html += '</table>';
	
	// table to hold the CLEAR MAP and FILL MAP WITH CURRENT TILE
	// buttons
	html += '<table align="center" style="border: 2px solid aqua; ';
	html += 'border-radius: 10px;">';
	html += '<tr><td align="center">';
	html += '<button id="clear_map_button">CLEAR MAP</button>';
	html += '</td></tr>';
	html += '<tr><td align="center">';
	html += '<button id="fill_map_with_current_tile_button">';
	html += 'FILL MAP WITH CURRENT TILE</button>';
	html += '</td></tr>';
	html += '</table>';
	
	// spacer table
	html += '<table>';
	html += '<tr><td style="height: 1px;"></td></tr>';
	html += '</table>';

	// start of table containing three sub-tables
	html += '<table align="center" style="border: 2px solid aqua;';
	html += 'border-radius: 10px;">';
	html += '<tr><td>';
	// start of first sub-table
	html += '<table align="center">';
	html += '<tr>';
	html += '<td>FILL REGION WITH CURRENT TILE</td>';
	html += '</tr>';
	html += '</table>';
	// end of first sub-table
	// start of second sub-table
	html += '<table align="center">';
	html += '<tr>';
	html += '<td>X1</td>';
	html += '<td><input id="tile_region_input_x1"></td>';
	html += '<td style="width: 10px;"></td>';
	html += '<td>Y1</td>';
	html += '<td><input id="tile_region_input_y1"></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>X2</td>';
	html += '<td><input id="tile_region_input_x2"></td>';
	html += '<td style="width: 10px;"></td>';
	html += '<td>Y2</td>';
	html += '<td><input id="tile_region_input_y2"></td>';
	html += '</tr>';
	html += '</table>';
	// end of second sub-table
	// start of third sub-table
	html += '<table align="center">';
	html += '<tr>';
	html += '<td><button id="fill_map_range_with_current_tile_button">';
	html += 'GO</button></td>';
	html += '</tr>';
	html += '</table>';
	// end of third sub-table
	html += '</td></tr>';
	html += '</table>';
	// end of table containing three sub-tables
	html += '</body>';
	html += '</html>';
	
	// open the control window and stick the html in it
	control_window = window.open("", "", "width=300,height=360");
	control_window.document.open();
	control_window.document.write(html);
	control_window.document.close();
	
	// attach eventlistener to the OPEN WINDOW button
	var open_window_button = control_window.document.getElementById(
										"open_window_button");
	open_window_button.addEventListener("click", 
									open_window_button_has_been_pressed);
	
	// attach eventlistener to the OPEN IMPORT MAP WINDOW BUTTON
	var import_map_button = control_window.document.getElementById(
										"open_import_map_window_button");
	import_map_button.addEventListener("click", open_import_map_window);

	// attach eventlistener to the OPEN EXPORT MAP WINDOW BUTTON
	var export_map_button = control_window.document.getElementById(
										"open_export_map_window_button");
	export_map_button.addEventListener("click", open_export_map_window);

	// attach eventlistener to the FILL MAP WITH CURRENT TILE BUTTON
	var fill_map_button = control_window.document.getElementById(
										"fill_map_with_current_tile_button");
	fill_map_button.addEventListener("click", fill_map_with_current_tile);
	
	// attach eventlistener to the FILL REGION WITH CURRENT TILE BUTTON
	// CODE HERE
	var fill_region_button = control_window.document.getElementById(
								"fill_map_range_with_current_tile_button");
	fill_region_button.addEventListener("click", fill_region_with_current_tile);
	
	// add eventlistener to the CLEAR MAP button
	var clear_map_button = control_window.document.getElementById(
														"clear_map_button");
	clear_map_button.addEventListener("click", clear_map);

	return;
}
// =============================================================================
// Called when the CLEAR MAP button is pressed on the control window.
// =============================================================================
function clear_map() {

	// get current map width
	var map_width = map[0].length;
	
	// clear out the global array
	map = [];
	
	// build a row of empty tiles
	var row_of_empty_tiles = [];
	for (var i = 0; i < map_width; ++i) {
		row_of_empty_tiles.push(-1);
	}
	
	// stick 15 rows of the current tile in the map
	for (var i = 0; i < 15; ++i) {
		map.push(JSON.parse(JSON.stringify(row_of_empty_tiles)));
	}

	// redraw the map canvas
	redraw_map_canvas();

	return;
}
// =============================================================================
// Called when the IMPORT MAP button is clicked in the control window.
// Build and open the import map window.
// It will consist of:
// 1. a textarea for the user to paste the map data into
// 2. an IMPORT MAP button
// =============================================================================
function open_import_map_window() {
	
	// build the html for the import map window
	var html = build_html_template_for_new_window();
	
	// build html for import map textarea style
	var style_html = '#import_map_data_textarea{';
	style_html += 'height: 100px;';
	style_html += 'width: 240px;';
	style_html += '}';
	
	// stick the style html in the html
	html = html.replace('/* additional styles go here */', style_html);
	
	// build the html for the body of the window
	var body_html = '<table align="center">';
	body_html += '<tr>';
	body_html += '<td style="text-align:center; text-decoration: underline;">';
	body_html += '<strong>IMPORT MAP</strong></td></tr>';
	body_html += '<tr><td style="text-align: center;">DATA FORMAT';
	body_html += '</td></tr>';
	body_html += '<tr><td align="center">';
	body_html += '<select id="import_data_format_dropdown_menu">';
	body_html += '<option value="json">JSON</option>';
	body_html += '</select>';
	body_html += '</td></tr>';
	body_html += '<tr><td style="text-align: center;">PASTE MAP DATA HERE';
	body_html += '</td></tr>';
	body_html += '<tr><td align="center">';
	body_html += '<textarea id="import_map_data_textarea">';
	body_html += '</textarea></td></tr>';
	body_html += '<tr><td align="center"><button id="import_map_button">';
	body_html += 'IMPORT MAP</button></td></tr>';
	body_html += '</table>';
	
	// stick the body_html in the html
	html = html.replace('<!-- body html goes here -->', body_html);
	
	// open the import map window
	import_map_window = window.open("", "", "width=300,height=250");
	import_map_window.document.open();
	import_map_window.document.write(html);
	import_map_window.document.close();
	
	// attach an eventlistener to the import map button
	var import_map_button = import_map_window.document.getElementById(
														"import_map_button");
	import_map_button.addEventListener("click", import_map);

	return;
}
// =============================================================================
// Called when the IMPORT MAP button is clicked on the IMPORT MAP WINDOW.
// =============================================================================
function import_map() {

	// get the data from the import_map_data_textarea
	var textarea = import_map_window.document.getElementById(
											"import_map_data_textarea");
	var text = textarea.value.trim();
	
	var map_data = JSON.parse(text);
	
	// get and set map name
	map_name = map_data["map_name"];
	
	// get and set map description
	map_description = map_data["map_description"];
	
	// get and set tiles
	tiles = map_data["tiles"];
	
	// get and set map
	map = map_data["map_layout"];
	
	// redraw tile selection canvas
	redraw_tile_selection_canvas();
	
	// reset the map canvas to the beginning of the map
	map_window_current_x = 0;
	
	// redraw map canvas
	redraw_map_canvas();

	// tell the user that the map has been successfully imported
	window.alert("Map imported!");

	return;
}
// =============================================================================
// Called when the EXPORT MAP button is clicked in the control window.
// Build and open the export map window. It will consist of:
// 1. an input element for the user to enter a map name
// 2. a textarea for the user to enter a description of the map
// 3. a dropdown menu from which the user can select an output format for the
//    exported map
// 4. an EXPORT MAP button
// 5. a textarea into which the text for the exported map data can be placed
// =============================================================================
function open_export_map_window() {
	
	// build the html for the export map window
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
	html += 'button:hover{';
	html += 'border: 2px dashed red;';
	html += '}';
	html += '#map_name_input {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += 'width: 200px;';
	html += 'text-align: center;';
	html += '}';
	html += '#map_description_textarea {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += 'height: 50px;';
	html += 'width: 240px;';
	html += '}';
	html += '#map_export_format_dropdown_menu {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += '}';
	html += '#export_map_data_textarea {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += 'height: 100px;';
	html += 'width: 240px;';
	html += '}';
	html += '</style>';
	html += '</head>';
	html += '<body>';	
	html += '<table align="center">';
	html += '<tr><td style="text-align: center; text-decoration: underline;">';
	html += '<strong>EXPORT MAP';
	html += '</strong></td></tr>';
	html += '<tr><td style="text-align: center;">MAP NAME</td></tr>';
	html += '<tr><td align="center"><input id="map_name_input">';
	html += '</td></tr>';
	html += '<tr><td style="text-align: center;">MAP DESCRIPTION</td></tr>';
	html += '<tr><td><textarea id="map_description_textarea">';
	html += '</textarea>';
	html += '</td></tr>';
	html += '<tr><td style="text-align:center;">EXPORT FORMAT</td></tr>';
	html += '<tr>';
	html += '<td align="center">';
	html += '<select id="map_export_format_dropdown_menu">';
	html += '<option value="json">JSON</option>';
	// TO DO: ADD A "C++ EXPORT" OPTION HERE LATER
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr><td align="center"><button id="export_map_button">';
	html += 'EXPORT MAP</button>';
	html += '</td></tr>';
	html += '<tr><td style="text-align: center;"><strong>';
	html += 'EXPORTED MAP DATA</strong></td></tr>';
	html += '<tr><td align="center"><textarea id="export_map_data_textarea">';
	html += '</textarea></td></tr>';
	html += '</table>';
	html += '</body>';
	html += '</html>';

	// open the export map window and stick the html in it
	export_map_window = window.open("", "", "width=300,height=400");
	export_map_window.document.open();
	export_map_window.document.write(html);
	export_map_window.document.close();

	// attach eventlistener to the EXPORT MAP button
	var export_map_button = export_map_window.document.getElementById(
														"export_map_button");
	export_map_button.addEventListener("click", export_map);
	
	return;
}
// =============================================================================
// Called when the EXPORT MAP button is pressed on the EXPORT MAP WINDOW.
// =============================================================================
function export_map() {
	
	// get map name
	var map_name_input = export_map_window.document.getElementById(
														"map_name_input");
	var map_name = map_name_input.value.trim();
	cl("map_name = " + map_name);
	
	// get map description
	var map_description_textarea = export_map_window.document.getElementById(
													"map_description_textarea");
	var map_description = map_description_textarea.value.trim();
	cl("map_description:");
	cl(map_description);
	
	// get output format
	// map_export_format_dropdown_menu
	var dropdown_menu = export_map_window.document.getElementById(
											"map_export_format_dropdown_menu");
	var export_format = dropdown_menu.value;
	cl("export_format = " + export_format);
	
	// build map data, depending on what export format the user has selected
	var exported_map_data;
	if (export_format == "json") {
		exported_map_data = build_exported_json_map_data(map_name,
															map_description);
	}
	// TO DO: ADD A "C++ EXPORT" OPTION HERE LATER
	
	// stick the map data in the export_map_data_textarea in the
	// export map window
	var textarea = export_map_window.document.getElementById(
												"export_map_data_textarea");
	textarea.value = exported_map_data;

	return;
}
// =============================================================================
// Build map export data in json format and return it. The map data will be
// represented by a json object in the format:
//
// {
//	"map_name"			: "Michael's first map",
//	"map_description"	: "The first level in the game."
//	"tiles"				: <tiles in the map, JSON.stringified>,
//	"map_layout"		: <the layout of the entire map, JSON.stringified>
// }
//
// =============================================================================
function build_exported_json_map_data(map_name, map_description) {
	
	var export_data = {
				"map_name"			: map_name,
				"map_description"	: map_description,
				"tiles"				: tiles,
				"map_layout"		: map
						};

	var stringified_export_data = JSON.stringify(export_data);

	return stringified_export_data;
}
// =============================================================================
// Called when the FILL MAP WITH CURRENT TILE button is clicked in the control
// window.
// =============================================================================
function fill_map_with_current_tile() {
	
	// build a row of tiles, the entire map wide
	var map_width = map[0].length;
	var row_of_tiles = [];
	for (var i = 0; i < map_width; ++i) {
		row_of_tiles.push(current_tile_index);
	}
	
	// clear the map
	map = [];
	
	// rebuild the map using the row of tiles built above, 15 times
	for (var i = 0; i < 15; ++i) {
		map.push(row_of_tiles);
	}
	
	redraw_map_canvas();

	return;
}
// =============================================================================
// Called when the GO button in the FILL REGION WITH CURRENT TILE area in the
// control window is clicked.
// =============================================================================
function fill_region_with_current_tile() {
	
	// get the coordinates for the top left tile and bottom right tiles in the
	// region the user has specified
	var x1_input = control_window.document.getElementById(
													"tile_region_input_x1");
	var x1 = x1_input.value;
	cl("x1 = " + x1);
	var y1_input = control_window.document.getElementById(
													"tile_region_input_y1");
	var y1 = y1_input.value;
	cl("y1 = " + y1);
	var x2_input = control_window.document.getElementById(
													"tile_region_input_x2");
	var x2 = x2_input.value;
	cl("x2 = " + x2);
	var y2_input = control_window.document.getElementById(
													"tile_region_input_y2");
	var y2 = y2_input.value;
	cl("y2 = " + y2);
	
	// set start_x, end_x, start_y and end_y by ordering (x1 and x2)
	// and (y1 and y2)
	var start_x;
	var end_x;
	var start_y;
	var end_y;
	if (x1 < x2) {
		start_x = x1;
		end_x = x2;
	} else {
		start_x = x2;
		end_x = x1;
	}
	if (y1 < y2) {
		start_y = y1;
		end_y = y2;
	} else {
		start_y = y2;
		end_y = y1;
	}
	
	// stick the tiles in the map
	for (var row = start_y; row <= end_y; ++row) {
		for (var col = start_x; col <= end_x; ++col) {
			map[row][col] = current_tile_index;
		}
	}

	redraw_map_canvas();
	
	return;
}
// =============================================================================
// Called when the OPEN WINDOW button at the top of the CONTROLS WINDOW is
// clicked. Opens whatever window(s) have been selected in the
// OPEN WINDOW DROPDOWN MENU.
// =============================================================================
function open_window_button_has_been_pressed() {
	
	var dd_menu = control_window.document.getElementById(
											"open_window_dropdown_menu");
	var window_option = dd_menu.options[dd_menu.selectedIndex].value;
	
	if (window_option == "all") {
		build_and_open_tile_selection_window();
		redraw_tile_selection_canvas();
		build_enemies_window();
	}
	if (window_option == "tiles") {
		build_and_open_tile_selection_window();
		redraw_tile_selection_canvas();
	}
	if (window_option == "enemies") {
		build_enemies_window();
	}

	return;
}