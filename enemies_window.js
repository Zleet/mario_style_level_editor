// =============================================================================
// global handle for the enemies window
var enemies_window = -1;

// global array to hold all the enemies
var enemies = [];
// =============================================================================
// Build the enemies window. It will consist of:
// 1. a dropdown menu from which the user can select a type of enemy to place
//    types of enemy are:
//    (1) horizontal walkers
//    (2) vertical bouncers
//    more here...
// 2. a speed (in pixels per second)
// 3. initial movement direction (up, down, left or right)
// 4. a movement type:
//    (1) moves in one direction only
//    (2) oscillates (moves between two points)
// 5. a section to enter the tile coordinates for the enemy's movement endpoints
//    movement range endpoint #1:   X [  ]   Y [  ]
//    movement range endpoint #2:   X [  ]   Y [  ]
// =============================================================================
// =============================================================================
function build_enemies_window() {

	var html = build_html_template_for_new_window();
	
	// build html for additional styles
	var style_html = '';
	
	// stick the additional styles in the enemies window html
	html = html.replace('/* additional styles go here */', style_html);
	
	// build the html for the body of the enemies window
	var body_html = '<table align="center">';
	body_html += '<tr><td style="text-align: center; ';
	body_html += 'text-decoration: underline;">';
	body_html += '<strong>ENEMIES</strong></td></tr>';
	body_html += '<tr><td style="text-align: center;">ENEMY TYPE</td></tr>';
	body_html += '<tr><td align="center">';
	body_html += '<select id="enemy_type_dropdown_menu">';
	body_html += '<option value="spikey_walker">Spikey Walker</option>';
	body_html += '<option value="vertical_bouncer">Vertical Bouncer</option>';
	body_html += '</select>';
	body_html += '</td></tr>';
	body_html += '</table>';
	
	body_html += '<table align="center">';
	body_html += '<tr>';
	body_html += '<td>SPEED</td>';
	body_html += '<td style="width: 5px;"></td>';	// spacer cell
	body_html += '<td><input type="text" id="enemy_speed_input"></td>';
	body_html += '<td style="width: 5px;"></td>';	// spacer cell
	body_html += '<td><i>PIXELS PER SECOND</i></td>';
	body_html += '</tr>';
	body_html += '</table>';
	
	body_html += '<table align="center">';
	body_html += '<tr><td>INITIAL MOVEMENT DIRECTION</td></tr>';
	body_html += '<tr><td align="center">';
	body_html += '<select id="initial_movement_direction_dropdown_menu">';
	body_html += '<option value="up">up</option>';
	body_html += '<option value="down">down</option>';
	body_html += '<option value="left">left</option>';
	body_html += '<option value="right">right</option>';
	body_html += '</select>';
	body_html += '</td></tr>';
	body_html += '<tr><td style="text-align: center;">MOVEMENT TYPE</td></tr>';
	body_html += '<tr><td align="center">';
	body_html += '<select id="movement_type_dropdown_menu">';
	body_html += '<option value="single_direction">single direction</option>';
	body_html += '<option value="back_and_forth">back and forth</option>';
	body_html += '</select></td></tr>';
	body_html += '</table>';
	
	body_html += '<table align="center">';
	body_html += '<tr><td style="text-align: center;">MOVEMENT ENDPOINTS';
	body_html += '</td></tr>';
	body_html += '</table>';

	body_html += '<table align="center">';
	body_html += '<tr>';
	body_html += '<td>ENDPOINT #1:</td>';
	body_html += '<td style="width: 5px;"></td>';	// spacer cell
	body_html += '<td>ROW</td>';
	body_html += '<td><input id="endpoint_1_row_input"></td>';
	body_html += '<td style="width: 5px;"></td>';	// spacer cell
	body_html += '<td>COL</td>';
	body_html += '<td><input id="endpoint_1_col_input"></td>';
	body_html += '</tr>';
	body_html += '<tr>';
	body_html += '<td>ENDPOINT #2:</td>';
	body_html += '<td style="width: 5px;"></td>';	// spacer cell
	body_html += '<td>ROW</td>';
	body_html += '<td><input id="endpoint_2_row_input"></td>';
	body_html += '<td style="width: 5px;"></td>';	// spacer cell
	body_html += '<td>COL</td>';
	body_html += '<td><input id="endpoint_2_col_input"></td>';
	body_html += '</tr>';
	body_html += '</table>';
	
	body_html += '<table align="center">';
	body_html += '<tr><td><button id="place_enemy_button">PLACE ENEMY</button>';
	body_html += '</td></tr>';
	body_html += '</table>';

	// stick the body html in the enemies window html
	html = html.replace('<!-- body html goes here -->', body_html);

	// open the enemies window and stick the html in it
	enemies_window = window.open("", "", "width=300,height=340");
	enemies_window.document.open();
	enemies_window.document.write(html);
	enemies_window.document.close();

	// add event listener to the PLACE ENEMY button
	var place_enemy_button = enemies_window.document.getElementById(
														"place_enemy_button");
	place_enemy_button.addEventListener("click",
									place_enemy_button_has_been_clicked);

	return;
}
// =============================================================================
// Called when the PLACE ENEMY button is clicked in the enemies window.
// =============================================================================
function place_enemy_button_has_been_clicked() {
	
	// get enemy type
	var enemy_type_dropdown_menu = enemies_window.document.getElementById(
													"enemy_type_dropdown_menu");
	var enemy_type = enemy_type_dropdown_menu.value;
	
	// get speed in pixels per second
	// enemy_speed_input
	var enemy_speed_input = enemies_window.document.getElementById(
														"enemy_speed_input");
	var enemy_speed_string = enemy_speed_input.value.trim();
	
	// sanity test - if no speed in pixels per second has been entered,
	// alert the user and return without doing anything else
	if (enemy_speed_string.length === 0) {
		alert("Please enter an enemy speed.");
		return;
	}
	
	// sanity test - check that the speed in pixels per second consists solely
	// of digits
	if (!string_consists_of_digits_only(enemy_speed_string)) {
		alert("Enemy speed should consist of digits only.");
		return;
	}
	
	var enemy_speed = parseInt(enemy_speed_string);

	// get initial movement direction
	var initial_movement_direction_dropdown_menu = enemies_window.document.getElementById("initial_movement_direction_dropdown_menu");
	var initial_movement_direction = initial_movement_direction_dropdown_menu.value;

	// get movement type
	var movement_type_dropdown_menu = enemies_window.document.getElementById(
												"movement_type_dropdown_menu");
	var movement_type = movement_type_dropdown_menu.value;
		
	// get all the row and col coordinates for the movement endpoints
	var input_widget;
	input_widget = enemies_window.document.getElementById(
											"endpoint_1_row_input");
	var endpoint_1_row = input_widget.value.trim();
	input_widget = enemies_window.document.getElementById(
											"endpoint_1_col_input");
	var endpoint_1_col = input_widget.value.trim();
	input_widget = enemies_window.document.getElementById(
											"endpoint_2_row_input");
	var endpoint_2_row = input_widget.value.trim();
	input_widget = enemies_window.document.getElementById(
											"endpoint_2_col_input");
	var endpoint_2_col = input_widget.value.trim();
	
	// sanity test - if any of the row/col values for the movement endpoints
	// are missing, alert the user then return without doing anything else
	if (endpoint_1_row.length === 0) {
		alert("Please enter a value for endpoint #1 row");
		return;
	}
	if (endpoint_1_col.length === 0) {
		alert("Please enter a value for endpoint #1 col");
		return;
	}
	if (endpoint_2_row.length === 0) {
		alert("Please enter a value for endpoint #2 row");
		return;
	}
	if (endpoint_2_col.length === 0) {
		alert("Please enter a value for endpoint #2 col");
		return;
	}

	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// sanity test - for either vertical movement or horizontal movement,
	// either:
	// 1. row values for both movement endpoints must be equal, or
	// 2. column values for both movement endpoints must be equal
	// If both of these conditions are not true, alert the user, then return
	// without doing anything else
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	if ((endpoint_1_row != endpoint_2_row)
			&& (endpoint_1_col != endpoint_2_col)) {
		alert("Endpoint rows and columns don't match.");
		return;
	}

	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// if we've fallen through, all of the conditions are ok for placing an
	// enemy, so:
	// 1. create a new enemy object
	// 2. push the new enemy object onto the global array enemies
	// 3. redraw the map canvas
	// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var enemy_object = {
		"enemy_type"					: enemy_type,
		"speed"							: enemy_speed,
		"initial_movement_direction"	: initial_movement_direction,
		"movement_type"					: movement_type,
		"movement_endpoint_1_row"		: endpoint_1_row,
		"movement_endpoint_1_col"		: endpoint_1_col,
		"movement_endpoint_2_row"		: endpoint_2_row,
		"movement_endpoint_2_col"		: endpoint_2_col
						};
	enemies.push(enemy_object);
	
	redraw_map_canvas();
	
	redraw_enemies();

	return;
}
// =============================================================================
// Redraw all the enemies that lie within the portion of the map displayed
// inside the map canvas.
// =============================================================================
function redraw_enemies() {
	
	for (var i = 0; i < enemies.length; ++i) {
		var enemy = enemies[i];
		// work out if any of the enemy's movement range lies within the
		// map canvas. If so, draw whatever part of the movement range
		// lies within the map canvas
		if (enemy_movement_range_lies_within_map_canvas(enemy)) {
			// code here
		} else {
			continue;
		}
	}
	
	return;
}
// =============================================================================
// Work out if any of an enemy's movement range lies within the map canvas.
// If so, return 1, otherwise return 0.
// =============================================================================
function enemy_movement_range_lies_within_map_canvas(enemy) {

	// build an array containing all the blocks for the enemy movement range
	var movement_range_blocks = [];
	
	// if the range is horizontal, create a horizontal range
	// CODE HERE
	// bookmark (25/2/20 at 2301)
	
	
	// if the range is vertical, create a vertical range
	
	
	
	
	
	
	return;
}
// =============================================================================
