// =============================================================================
// Super Mario Bros 1 Style Level Editor
// by Michael McLarnon (bigbadmick2000@hotmail.com)
// Begun Thursday 20th February 2020
// =============================================================================
// globals variables

// current tile x position for the leftmost tiles in the map window
// (when map_window_current_x == 0, the map canvas is displaying the
// leftmost part of the map)
var map_window_current_x = 0;

// global variable to hold the map
var map = [];

// global handle for tile selection window
var tile_selection_window = -1;

// index of the first tile currently displayed in the tile selection canvas
// in the tile selection window
var tile_selection_canvas_current_first_tile = 0;

// index of the currently selected tile; -1 for empty tile
var current_tile_index = -1;

// the name of the map
var map_name = '';

// description of the map
var map_description = '';
// =============================================================================
// Called when the page first loads.
// =============================================================================
function initialise_page() {

	// build initial random map
	build_initial_random_map();
	
	// set the map zoom level to 2
	var map_zoom_menu = gebi("map_zoom_dropdown_menu");
	map_zoom_menu.value = "2";
	map_zoom_dropdown_has_changed();

	// open the tile selection window
	// build_and_open_tile_selection_window();

	// redraw_tile_selection_canvas();

	build_and_open_control_window();
	
	redraw_map_position_canvas();
	
	// build_enemies_window();

	// draw all the tiles to the hidden tile canvas in 5 seconds
	setTimeout(draw_all_tiles_to_hidden_tile_canvas, 5000);

	// redraw the map canvas in 5 seconds
	setTimeout(redraw_map_canvas, 5000);

	return;
}
// =============================================================================
// Build the initial random map. Empty tiles are represented by the value -1
// =============================================================================
function build_initial_random_map() {
	
	var TOTAL_SCREENS_WIDTH = 24;
	var initial_map_width_in_tiles = TOTAL_SCREENS_WIDTH * 16;
	
	// clear the map (global array)
	map = [];
	
	// build a row of tiles the entire level wide; make every tile aqua blue
	var level_wide_row_of_tiles = [];
	for (var i = 0; i < initial_map_width_in_tiles; ++i) {
		level_wide_row_of_tiles.push(1);
	}
	
	// stick the level wide row of tiles in the map 15 times (for the 15 rows
	// of initial sky tiles in the level)
	for (var i = 0; i < 15; ++i) {
		map.push(JSON.parse(JSON.stringify(level_wide_row_of_tiles)));
	}

	// stick in some tiles at the start of the level
	for (var x = 0; x < initial_map_width_in_tiles; ++x) {
		map[13][x] = 0;
		map[14][x] = 0;
	}
	
	// stick some spaces for the user to leap over with the greatest of
	// aplomb
	var x = 10;
	while (x < initial_map_width_in_tiles) {
		map[13][x - 2] = 1;
		map[14][x - 2] = 1;
		map[13][x - 1] = 1;
		map[14][x - 1] = 1;
		map[13][x] = 1;
		map[14][x] = 1;
		x += 10;
	}
	
	// build some randomly spaced platforms
	var platform_start_x = randint(0, 10);
	var platform_y = randint(6, 11);
	var platform_width = randint(5, 10);
	
	while (platform_start_x < initial_map_width_in_tiles - 10) {
		// stick platform in level
		var start_x = platform_start_x;
		var end_x = platform_start_x + platform_width - 1;
		for (var x = start_x; x <= end_x; ++x) {
			map[platform_y][x] = 5;
		}
		// stick a ladder from the ground up to the platform (1 in 2 chance;
		// only if there is ground to set the bottom of the ladder on)
		if (randint(1, 2) == 1) {
			// select a random x position for the ladder
			var ladder_x = randint(start_x + 1, end_x - 1);
			// if there's ground beneath the proposed ladder position, stick
			// the ladder in the map
			if (map[14][ladder_x] == 0) {
				for (var ladder_y = platform_y; ladder_y < 13; ++ladder_y) {
					if (ladder_y == platform_y) {
						map[ladder_y][ladder_x] = 12;
					} else {
						map[ladder_y][ladder_x] = 11;
					}
				}
			}
		}
		// next platform start x is end of previous platform + randint(3, 6)
		platform_start_x = (
			(platform_start_x + platform_width - 1) + randint(3, 6)
							);
		// next platform y is randint(6, 11)
		platform_y = randint(6, 11);
		// next platform width is randint(5, 10)
		platform_width = randint(5, 10);
	}
	
	// draw a left moving platform at a random height at the start of the level
	var random_y = randint(2, 6);
	var start_x = randint(2, 4);
	var end_x = randint(7, 10);
	for (var x = start_x; x <= end_x; ++x) {
		map[random_y][x] = 15;
	}

	return;
}
// =============================================================================
// Get the value in the map zoom dropdown menu and alter the size of the map
// canvas accordingly
// =============================================================================
function map_zoom_dropdown_has_changed() {
	
	// get zoom level the user has selected
	var zoom_dropdown_menu = gebi("map_zoom_dropdown_menu");
	var zoom_level = parseInt(zoom_dropdown_menu.value);
	
	// build the strings for the width and height
	var width_string = "" + (zoom_level * 256) + "px";
	var height_string = "" + (zoom_level * 240) + "px";
	
	// set the map canvas size
	var map_canvas = gebi("map_canvas");
	map_canvas.style.width = width_string;
	map_canvas.style.height = height_string;
	
	return;
}
// =============================================================================
// Called when the mouse is over the map canvas.
// =============================================================================
function mouse_is_over_map_canvas(event) {
		
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// redraw the tile over which the user is hovering, plus the eight tiles
	// around it, in a pattern like this:
	//
	// ###
	// #X#  <- X is the tile over which the user is hovering
	// ###  <- # are the tiles around the tile over which the user is hovering
	//
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// get the coordinates of the mouse pointer on the map_canvas
	var map_canvas = gebi("map_canvas");
	var ctx = map_canvas.getContext("2d");
	
	// get hidden tile canvas
	var hidden_tile_canvas = gebi("hidden_tile_canvas");

	// get current zoom level
	var zoom_dropdown_menu = gebi("map_zoom_dropdown_menu");
	var zoom_level = parseInt(zoom_dropdown_menu.value);
	
	// get the coordinates of the mouse on the map canvas
	var rect = map_canvas.getBoundingClientRect();
	var mouse_x = event.clientX;
	var mouse_y = event.clientY;
	var x = Math.floor((mouse_x - rect.left) / zoom_level);
	var y = Math.floor((mouse_y - rect.top) / zoom_level);

	// work out what tile the user is hovering over on the map canvas
	var tile_x = Math.floor(x / 16);
	var tile_y = Math.floor(y / 16);

	// display the current tile row and column in the current_tile_row_input
	// and current_tile_col_input above the map canvas
	var current_tile_row_input = gebi("current_tile_row_input");
	current_tile_row_input.value = tile_y;
	var current_tile_col_input = gebi("current_tile_col_input");
	current_tile_col_input.value = tile_x + map_window_current_x;

	// loop through all the tiles that we need to draw and draw them on the
	// map canvas
	var min_tile_x = tile_x - 1;
	if (min_tile_x < 0) {
		min_tile_x = 0;
	}
	var max_tile_x = tile_x + 1;
	if (max_tile_x > 15) {
		max_tile_x = 15;
	}
	var min_tile_y = tile_y - 1;
	if (min_tile_y < 0) {
		min_tile_y = 0;
	}
	var max_tile_y = tile_y + 1;
	if (max_tile_y > 14) {
		max_tile_y = 14;
	}
	
	// test print
	// cl("+++++++++++++++++++++++++++++");
	// cl('tile_x = ' + tile_x);
	// cl('tile_y = ' + tile_y);
	// cl('min_tile_x = ' + min_tile_x);
	// cl('max_tile_x = ' + max_tile_x);
	// cl('min_tile_y = ' + min_tile_y);
	// cl('max_tile_y = ' + max_tile_y);
	
	for (var current_tile_y = min_tile_y; current_tile_y <= max_tile_y;
															++current_tile_y) {
		for (var current_tile_x = min_tile_x; current_tile_x <= max_tile_x;
															++current_tile_x) {
			// look up the index of the tile in the global array maps
			var tile_index = map[current_tile_y][current_tile_x + map_window_current_x];
			// draw the tile from the hidden tile canvas onto the map canvas
			var hidden_tile_canvas_x = tile_index * 16;
			ctx.drawImage(	hidden_tile_canvas,
							hidden_tile_canvas_x,
							0,
							16,
							16,
							current_tile_x * 16,
							current_tile_y * 16,
							16,
							16
							);
		}
	}
	
	// work out the coordinates of the top left pixel of the tile over which
	// the user is hovering
	var tile_top_left_x = tile_x * 16;
	var tile_top_left_y = tile_y * 16;
	
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// draw a 16 x 16 cursor at the mouse position, like this:
	//
	//   A  B        C  D
	//   ****        ****
	// E *              * F
	//   *              *
	// G *              * H
	//
	//
	//
	//
	//
	//
	//
	//
	// I *              * J
	//   *              *
	// K *              * L
	//   ****        ****
	//   M  N        O  P
	//
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var CURSOR_COLOUR = "white";
	ctx.fillStyle = CURSOR_COLOUR;
	// AB
	ctx.fillRect(tile_top_left_x, tile_top_left_y, 4, 1);
	// EG
	ctx.fillRect(tile_top_left_x, tile_top_left_y + 1, 1, 3);
	// CD
	ctx.fillRect(tile_top_left_x + 12, tile_top_left_y, 4, 1);
	// FH
	ctx.fillRect(tile_top_left_x + 15, tile_top_left_y + 1, 1, 3);
	// IK
	ctx.fillRect(tile_top_left_x, tile_top_left_y + 12, 1, 4);
	// MN
	ctx.fillRect(tile_top_left_x, tile_top_left_y + 15, 4, 1);
	// JL
	ctx.fillRect(tile_top_left_x + 15, tile_top_left_y + 12, 1, 4);
	// OP
	ctx.fillRect(tile_top_left_x + 12, tile_top_left_y + 15, 4, 1);

	return;
}
// =============================================================================
// Build and open the tile selection window.
// =============================================================================
function build_and_open_tile_selection_window() {
	
	// build the html for the tile selection window
	var html = '<!DOCTYPE html>';
	html += '<html>';
	html += '<head>';
	html += '<style>';
	html += 'body{';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += '}';
	html += '#current_tile_canvas {';
	html += 'border: 2px solid red;';
	html += 'height: 48px;';
	html += 'width: 48px;';
	html += 'image-rendering: -moz-crisp-edges;';
	html += 'image-rendering: -webkit-crisp-edges;';
	html += 'image-rendering: pixelated;';
	html += 'image-rendering: crisp-edges;';
	html += '}';
	html += '#tile_selection_canvas {';
	html += 'border: 2px solid red;';
	html += 'height: 720px;';
	html += 'width: 240px;';
	html += 'image-rendering: -moz-crisp-edges;';
	html += 'image-rendering: -webkit-crisp-edges;';
	html += 'image-rendering: pixelated;';
	html += 'image-rendering: crisp-edges;';
	html += '}';
	html += 'button {';
	html += 'background-color: black;';
	html += 'color: yellow;';
	html += 'font: 10pt arial;';
	html += 'border: 2px solid red;';
	html += 'border-radius: 10px;';
	html += '}';
	html += '</style>';
	html += '</head>';
	html += '<body>';
	// table containing CURRENT TILE canvas and buttons for navigating among
	// tiles
	html += '<table align="center">';
	html += '<tr><td style="text-align: center;">CURRENT<br>TILE</td>';
	html += '<td align="center">';
	html += '<canvas id="current_tile_canvas" width="16" height="16"></canvas>';
	html += '</td>';
	html += '<td>';
	html += '<button id="tile_page_up_button">PAGE UP</button>';
	html += '</td>';
	html += '<td>';
	html += '<button id="tile_page_down_button">PAGE DOWN</button>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	// table to hold the tile selection canvas
	html += '<table align="center">';
	html += '<tr><td style="text-align: center;">SELECT A TILE</td></tr>';
	html += '<tr><td align="center;">';
	html += '<canvas id="tile_selection_canvas" width="80" height="240">';
	html += '</canvas></td></tr>';
	html += '</table>';
	html += '</body>';
	html += '</html>';
	
	// open the tile selection window and stick the html in it
	tile_selection_window = window.open("", "", "width=300,height=900");
	tile_selection_window.document.open();
	tile_selection_window.document.write(html);
	tile_selection_window.document.close();
	
	// add eventlistener to the PAGE UP button
	var page_up_button = tile_selection_window.document.getElementById(
														"tile_page_up_button");
	page_up_button.addEventListener("click", 
									tile_page_up_button_has_been_pressed);
	
	// add eventlistener to the PAGE DOWN button
	var page_down_button = tile_selection_window.document.getElementById(
														"tile_page_down_button");
	page_down_button.addEventListener("click", 
									tile_page_down_button_has_been_pressed);
	
	// add eventlistener for user hovering over the tile selection canvas
	var tile_selection_canvas = tile_selection_window.document.getElementById(
													"tile_selection_canvas");
	tile_selection_canvas.addEventListener("mousemove",
					mouse_is_hovering_over_tile_selection_canvas);
	
	// add eventlistener for user clicking the tile selection canvas
	tile_selection_canvas.addEventListener("click",
							tile_selection_canvas_has_been_clicked);
	
	return;
}
// =============================================================================
// Called when the mouse hovers over the tile selection canvas.
// =============================================================================
function mouse_is_hovering_over_tile_selection_canvas(event) {
	
	var tile_selection_canvas = tile_selection_window.document.getElementById(
													"tile_selection_canvas");
	var ctx = tile_selection_canvas.getContext("2d");
	
	// redraw the tile selection canvas
	// redraw_tile_selection_canvas();

	// get the coordinates of the mouse on the tile selection canvas
	var rect = tile_selection_canvas.getBoundingClientRect();
	var mouse_x = event.clientX;
	var mouse_y = event.clientY;
	var x = Math.floor((mouse_x - rect.left) / 3);
	var y = Math.floor((mouse_y - rect.top) / 3);

	// work out what tile the user is hovering over on the tile selection canvas
	var tile_x = Math.floor(x / 16);
	var tile_y = Math.floor(y / 16);
	
	// work out the coordinates of the top left pixel of the tile over which
	// the user is hovering
	var tile_top_left_x = tile_x * 16;
	var tile_top_left_y = tile_y * 16;
	
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// redraw the tile over which the user is hovering, plus the eight tiles
	// around it, in a pattern like this:
	//
	// ###
	// #X#  <- X is the tile over which the user is hovering
	// ###  <- # are the tiles around the tile over which the user is hovering
	//
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// get hidden tile canvas
	var hidden_tile_canvas = gebi("hidden_tile_canvas");
	// loop through all the tiles that we need to draw and draw them on the
	// tile selection canvas
	var min_tile_x = tile_x - 1;
	if (min_tile_x < 0) {
		min_tile_x = 0;
	}
	var max_tile_x = tile_x + 1;
	if (max_tile_x > 4) {
		max_tile_x = 4;
	}
	var min_tile_y = tile_y - 1;
	if (min_tile_y < 0) {
		min_tile_y = 0;
	}
	var max_tile_y = tile_y + 1;
	if (max_tile_y > 14) {
		max_tile_y = 14;
	}
	for (var current_tile_y = min_tile_y; current_tile_y <= max_tile_y;
														++current_tile_y) {
		for (var current_tile_x = min_tile_x; current_tile_x <= max_tile_x;
															++current_tile_x) {
			// work out the index of the tile in the tile selection canvas
			var canvas_tile_index = (current_tile_y * 5) + current_tile_x;
			// use the global tile_selection_canvas_current_first_tile
			// to adjust the index of the tile in the tile selection
			// canvas to get the index of the tile in the global array tiles
			var tile_index = (
				canvas_tile_index - tile_selection_canvas_current_first_tile
							);
			// if the tile index doesn't lie within the range
			// [0, tiles[0].length - 1], draw a black rectangle representing
			// an empty tile, otherwise draw the tile
			if ((tile_index < 0) || (tile_index >= tiles.length)) {
				// draw black square
				ctx.fillStyle = "black";
				ctx.fillRect(	current_tile_x * 16,
								current_tile_y * 16,
								16,
								16
							);
			} else {
				// draw tile from the hidden tile canvas
				var hidden_tile_canvas_x = tile_index * 16;
				ctx.drawImage(	hidden_tile_canvas,
								hidden_tile_canvas_x,
								0,
								16,
								16,
								current_tile_x * 16,
								current_tile_y * 16,
								16,
								16
								);				
			}
		}
	}

	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// draw a 16 x 16 cursor at the mouse position, like this:
	//
	//   A  B        C  D
	//   ****        ****
	// E *              * F
	//   *              *
	// G *              * H
	//
	//
	//
	//
	//
	//
	//
	//
	// I *              * J
	//   *              *
	// K *              * L
	//   ****        ****
	//   M  N        O  P
	//
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var CURSOR_COLOUR = "yellow";
	ctx.fillStyle = CURSOR_COLOUR;
	// AB
	ctx.fillRect(tile_top_left_x, tile_top_left_y, 4, 1);
	// EG
	ctx.fillRect(tile_top_left_x, tile_top_left_y + 1, 1, 3);
	// CD
	ctx.fillRect(tile_top_left_x + 12, tile_top_left_y, 4, 1);
	// FH
	ctx.fillRect(tile_top_left_x + 15, tile_top_left_y + 1, 1, 3);
	// IK
	ctx.fillRect(tile_top_left_x, tile_top_left_y + 12, 1, 4);
	// MN
	ctx.fillRect(tile_top_left_x, tile_top_left_y + 15, 4, 1);
	// JL
	ctx.fillRect(tile_top_left_x + 15, tile_top_left_y + 12, 1, 4);
	// OP
	ctx.fillRect(tile_top_left_x + 12, tile_top_left_y + 15, 4, 1);
	
	return;
}
// =============================================================================
// Called when the PAGE UP button is pressed on the tile selection window.
// =============================================================================
function tile_page_up_button_has_been_pressed() {
	
	cl("tile_page up button_has_been_pressed");
	
	// CODE HERE
	
	return;
}
// =============================================================================
// =============================================================================
function tile_page_down_button_has_been_pressed() {
	
	cl("tile_page down button_has_been_pressed");
	
	// CODE HERE
	
	return;
}
// =============================================================================
// Redraw the tiles in the tile selection canvas in the tile selection window.
// =============================================================================
function redraw_tile_selection_canvas() {
	
	// get the tile selection canvas in the tile selection window
	var tile_selection_canvas = tile_selection_window.document.getElementById(
													"tile_selection_canvas");
	var ctx = tile_selection_canvas.getContext("2d");	
	
	// draw a big black rectangle to blank out the tile selection canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, tile_selection_canvas.width,
								tile_selection_canvas.height);
	
	// work out the index of the first and last tile currently displayed in the
	// tile selection canvas
	var first_tile_index = tile_selection_canvas_current_first_tile;
	var last_tile_index = tile_selection_canvas_current_first_tile + 74;
	if (last_tile_index > tiles.length - 1) {
		last_tile_index = tiles.length - 1;
	}
	
	// loop through tiles from
	// <first tile currently displayed in tile selection canvas>
	// to
	// <last tile currently displayed in tile selection canvas>
	// and draw them all in the tile selection canvas
	for (var i = first_tile_index; i <= last_tile_index; ++i) {
		// work out the index of the current tile within the
		// tile selection canvas
		var canvas_index = i - first_tile_index;
		// work out the row and column of the current tile in the
		// tile selection canvas
		var row = Math.floor(canvas_index / 5);
		var col = canvas_index % 5;
		// work out the coordinates of the top left pixel of the tile in the
		// tile selection canvas
		var top_left_x = col * 16;
		var top_left_y = row * 16;
		// draw the tile in the tile selection canvas
		draw_tile_in_tile_selection_canvas(tile_selection_canvas,
											i, top_left_x, top_left_y);
	}

	return;
}
// =============================================================================
// Draw the tile with index tile_index at (top_left_x, top_left_y) in the
// tile selection canvas in the tile selection window.
// =============================================================================
function draw_tile_in_tile_selection_canvas(tile_selection_canvas,
									tile_index, top_left_x, top_left_y) {

	var tile = tiles[tile_index];
	var ctx = tile_selection_canvas.getContext("2d");

	// draw the tile
	for (var row = 0; row < 16; ++row) {
		for (var col = 0; col < 16; ++col) {
			// look up the pixel colour index in the tile
			var colour_index = tile["pixels"][row].substring(col, col + 1);
			colour_index = parseInt(colour_index);
			// look up the rgb array for the colour in the tile
			var rgb_array = tile["colours"][colour_index];
			// build rgb string from rgb array
			var rgb_string = "rgb(" + rgb_array[0] + "," + rgb_array[1] + ",";
			rgb_string += rgb_array[2] + ")";
			// set the current colour
			ctx.fillStyle = rgb_string;
			// work out the coordinates of the current pixel
			var x = top_left_x + col;
			var y = top_left_y + row;
			// draw the current pixel
			ctx.fillRect(x, y, 1, 1);
		}
	}

	return;
}
// =============================================================================
// Called when the tile selection canvas is clicked.
// =============================================================================
function tile_selection_canvas_has_been_clicked(event) {
	
	var tile_selection_canvas = tile_selection_window.document.getElementById(
													"tile_selection_canvas");
	var ctx = tile_selection_canvas.getContext("2d");

	// get the coordinates of the mouse on the tile selection canvas
	var rect = tile_selection_canvas.getBoundingClientRect();
	var mouse_x = event.clientX;
	var mouse_y = event.clientY;
	var x = Math.floor((mouse_x - rect.left) / 3);
	var y = Math.floor((mouse_y - rect.top) / 3);

	// work out what tile the user is hovering over on the map canvas
	var tile_row = Math.floor(y / 16);
	var tile_col = Math.floor(x / 16);
	
	// work out the index of the tile IN THE TILE SELECTION CANVAS
	var canvas_tile_index = (tile_row * 5) + tile_col;
	
	// use tile_selection_canvas_current_first_tile to adjust canvas_tile_index
	// to work out the actual index of the tile the user has just clicked.
	// Set the global value for current_tile_index.
	current_tile_index = (
		canvas_tile_index - tile_selection_canvas_current_first_tile
						);
	
	// draw the current tile in the current_tile_canvas in the tile selection
	// window
	redraw_current_tile();

	return;
}
// =============================================================================
// Redraw the current tile in the current tile canvas in the tile selection
// window.
// =============================================================================
function redraw_current_tile() {
		
	// get the current tile canvas in the tile selection window
	var current_tile_canvas = tile_selection_window.document.getElementById(
														"current_tile_canvas");
	var ctx = current_tile_canvas.getContext("2d");
	
	// sanity test; if current tile index is set to -1 (empty tile):
	// 1. draw a black square in the current tile canvas
	// 2. return without doing anything else
	if (current_tile_index == -1) {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, current_tile_canvas.width,
										current_tile_canvas.height);
	}
	
	// If we've fallen through, there's a tile to draw, so draw it(!)
	var tile = tiles[current_tile_index];
	
	// draw the tile
	for (var row = 0; row < 16; ++row) {
		for (var col = 0; col < 16; ++col) {
			// look up the pixel colour index in the tile
			var colour_index = tile["pixels"][row].substring(col, col + 1);
			colour_index = parseInt(colour_index);
			// look up the rgb array for the colour in the tile
			var rgb_array = tile["colours"][colour_index];
			// build rgb string from rgb array
			var rgb_string = "rgb(" + rgb_array[0] + "," + rgb_array[1] + ",";
			rgb_string += rgb_array[2] + ")";
			// set the current colour
			ctx.fillStyle = rgb_string;
			// draw the current pixel
			ctx.fillRect(col, row, 1, 1);
		}
	}
	
	return;
}
// =============================================================================
// Redraw the map canvas.
// The map canvas is 16 tiles wide by 15 tiles tall.
// =============================================================================
function redraw_map_canvas() {
	
	// get map canvas and context
	var canvas = gebi("map_canvas");
	var ctx = canvas.getContext("2d");
	
	// get hidden tile canvas
	var hidden_tile_canvas = gebi("hidden_tile_canvas");
	
	// work out start column and end column for map canvas
	var start_column = map_window_current_x;
	var end_column = start_column + 15;

	// loop through all the map tiles in the map canvas and draw them all
	for (var map_canvas_row = 0; map_canvas_row < 15; ++map_canvas_row) {
		var row_of_tiles = map[map_canvas_row];
		for (var map_canvas_col = 0; map_canvas_col < 16; ++map_canvas_col) {
			// ^-- above changed 21/2/20 at 1131
			// look up the index of the current tile
			var current_tile_index = row_of_tiles[start_column + map_canvas_col];
			// if the current tile is an empty tile (-1), draw a black square,
			// otherwise draw the tile by looking it up in the hidden_tile_canvas
			if (current_tile_index == -1) {
				ctx.fillStyle = "black";
				ctx.fillRect(	map_canvas_col * 16,
								map_canvas_row * 16,
								16,
								16
							);
			} else {
				var source_top_left_x = current_tile_index * 16;
				var source_top_left_y = 0;
				var destination_top_left_x = map_canvas_col * 16;
				var destination_top_left_y = map_canvas_row * 16;
				ctx.drawImage(	hidden_tile_canvas,
								source_top_left_x,
								source_top_left_y,
								16,
								16,
								destination_top_left_x,
								destination_top_left_y,
								16,
								16
							);				
			}
		}
	}
	
	return;
}
// =============================================================================
// Draw the tile with tile index current_tile_index (in the global array tiles)
// on the map canvas. The pixel coordinates of the top left pixel of the tile
// on the map canvas will be (x, y).
// =============================================================================
function draw_tile_on_map_canvas(x, y, current_tile_index) {
	
	var canvas = gebi("map_canvas");
	var ctx = canvas.getContext("2d");
	
	// get tile from global array
	var tile = tiles[current_tile_index];

	// loop through tile pixels and draw them all
	for (var row = 0; row < 16; ++row) {
		var row_of_pixels = tile["pixels"][row];
		for (var col = 0; col < 16; ++col) {
			// get current colour index
			var colour_index = parseInt(row_of_pixels.substring(col, col + 1));
			// build rgb string from rgb array
			var rgb_array = tile["colours"][colour_index];
			var rgb_string = "rgb(" + rgb_array[0] + "," + rgb_array[1] + ",";
			rgb_string += rgb_array[2] + ")";
			// set current colour
			ctx.fillStyle = rgb_string;
			// draw pixel
			ctx.fillRect(x + col, y + row, 1, 1);
		}
	}

	return;
}
// =============================================================================
// =============================================================================
function draw_all_tiles_to_hidden_tile_canvas() {
	
	// loop through all the tiles and draw them to the hidden tile canvas
	for (var i = 0; i < tiles.length; ++i) {
		draw_tile_to_hidden_tile_canvas(i);
	}

	return;
}
// =============================================================================
// Draw the tile with index tile_index in the global array tiles to the
// hidden tile canvas.
// =============================================================================
function draw_tile_to_hidden_tile_canvas(tile_index) {
	
	var tile = tiles[tile_index];
	
	var top_left_x = tile_index * 16;
	var top_left_y = 0;
	
	var canvas = gebi("hidden_tile_canvas");
	var ctx = canvas.getContext("2d");
	
	// draw the tile by looping through all the pixels
	for (var row = 0; row < 16; ++row) {
		var row_of_pixels = tile["pixels"][row];
		for (var col = 0; col < 16; ++col) {
			// look up the colour index
			var colour_index = parseInt(row_of_pixels.substring(col, col + 1));
			// look up the rgb array
			var rgb_array = tile["colours"][colour_index];
			// build an rgb string
			var rgb_string = "rgb(" + rgb_array[0] + "," + rgb_array[1] + ",";
			rgb_string += rgb_array[2] + ")";
			// set the colour for the pixel
			ctx.fillStyle = rgb_string;
			// draw the pixel
			ctx.fillRect(top_left_x + col, top_left_y + row, 1, 1);
		}
	}

	return;
}
// =============================================================================
// Move the map horizontally by x_tile_increment tiles to the right.
// =============================================================================
function move_map_horizontally(x_tile_increment) {
	
	map_window_current_x += x_tile_increment;
	
	// if map_window_current_x is too large, adjust it downwards
	// (since the map canvas is 15 tiles wide, the maximum that
	// map_window_current_x can be is map_width - 15)
	var map_width = map[0].length;
	if (map_window_current_x > map_width - 15) {
		map_window_current_x = map_width - 15;
	}

	// if map_window_current_y is less than zero, set it to zero
	if (map_window_current_x < 0) {
		map_window_current_x = 0;
	}
	
	redraw_map_canvas();
	
	redraw_map_position_canvas();

	return;
}
// =============================================================================
// Called when the START button is pressed, above the map canvas.
// Moves to the start of the map.
// =============================================================================
function move_to_start_of_map() {

	map_window_current_x = 0;
	
	redraw_map_canvas();
	
	redraw_map_position_canvas();

	return;
}
// =============================================================================
// Called when the END button is pressed, above the map canvas.
// Moves to the start of the map.
// =============================================================================
function move_to_end_of_map() {

	map_window_current_x = map[0].length - 15;
	
	redraw_map_canvas();
	
	redraw_map_position_canvas();

	return;
}
// =============================================================================
// Called when the map canvas is clicked.
// =============================================================================
function map_canvas_has_been_clicked() {
	
	// get the coordinates of the mouse pointer on the map_canvas
	var map_canvas = gebi("map_canvas");
	var ctx = map_canvas.getContext("2d");
	
	// get hidden tile canvas
	var hidden_tile_canvas = gebi("hidden_tile_canvas");

	// get current zoom level
	var zoom_dropdown_menu = gebi("map_zoom_dropdown_menu");
	var zoom_level = parseInt(zoom_dropdown_menu.value);
	
	// get the coordinates of the mouse on the map canvas
	var rect = map_canvas.getBoundingClientRect();
	var mouse_x = event.clientX;
	var mouse_y = event.clientY;
	var x = Math.floor((mouse_x - rect.left) / zoom_level);
	var y = Math.floor((mouse_y - rect.top) / zoom_level);

	// work out what tile the user is hovering over on the map canvas
	var tile_x = Math.floor(x / 16);
	var tile_y = Math.floor(y / 16);
	
	// stick the tile in the map
	var row_of_tiles = JSON.parse(
				JSON.stringify(map[tile_y])
								);		
	row_of_tiles[tile_x + map_window_current_x] = current_tile_index;
	map[tile_y] = row_of_tiles;

	// redraw the tile at the clicked position; if the current tile is an empty
	// tile (-1) then draw a black square, otherwise draw the appropriate tile
	// from the hidden tile canvas
	if (current_tile_index == -1) {
		ctx.fillStyle = "black";
		ctx.fillRect(	tile_x * 16,
						tile_y * 16,
						16,
						16
					);
	} else {		
		var source_top_left_x = current_tile_index * 16;
		var source_top_left_y = 0;
		var destination_top_left_x = tile_x * 16;
		var destination_top_left_y = tile_y * 16;
		ctx.drawImage(	hidden_tile_canvas,
						source_top_left_x,
						source_top_left_y,
						16,
						16,
						destination_top_left_x,
						destination_top_left_y,
						16,
						16
					);
	}

	return;
}
// =============================================================================
// Redraw the little green rectangle in the map position canvas to indicate what
// part of the map the user is at.
// =============================================================================
function redraw_map_position_canvas() {
	
	var map_position_canvas = gebi("map_position_canvas");
	var ctx = map_position_canvas.getContext("2d");
	
	// clear the map position canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, map_position_canvas.width, map_position_canvas.height);
	
	// draw a green rectangle to indicate where in the map we're at
	ctx.fillStyle = "chartreuse";
	ctx.fillRect(map_window_current_x, 0, 16, 15);
	
	return;
}
// =============================================================================