
var Controls = {
	"Windows": {
		"parameters_preconfig": {},
	},
	"Widgets": {
		"standard_input": {
		},
		"select_input": {
		},
		"color_picker": {
		},
		"canvas_position": {
		}
	}
};


function updateSliderHorizontalValue( value, target, send ) {

	var message = target.getAttribute("msg");
	var moblabel =  target.getAttribute("moblabel");
	var msg = sliderMessages[message]["osc"];
	var divisor = sliderMessages[message]["divisor"];
	var min = target.getAttribute("min");
	var max = target.getAttribute("max");

	if (send==undefined) send = false;
	var rect = target.getBoundingClientRect();
	x = rect.left;
	y = rect.top;
	w = rect.right - rect.left;
	h = rect.bottom - rect.top;

	target.setAttribute("style","background-position: -"+( w - value*w/(max-min) )+"px 0px;");
	target.setAttribute("value",value);
	target.value = value;
	if (send) {
		if (moblabel) {
			msg = msg.replace( /moblabel/g , moblabel );
			msg = msg.replace( /msgvalue/g , value/divisor );
			if (config.log.full) console.log("msg:",msg);
			OscMoldeoSend( JSON.parse( msg ) );
		}

	}
};

function updateSliderVerticalValue( value, target, send ) {

	var message = target.getAttribute("msg");
	var moblabel =  target.getAttribute("moblabel");
	var msg = sliderMessages[message]["osc"];
	var divisor = sliderMessages[message]["divisor"];
	var min = target.getAttribute("min");
	var max = target.getAttribute("max");

	if (send==undefined) send = false;
	var rect = target.getBoundingClientRect();
	x = rect.left;
	y = rect.top;
	w = rect.right - rect.left;
	h = rect.bottom - rect.top;

	target.setAttribute("style","background-position: -"+( h - value*h/(max-min) )+"px 0px;");
	target.setAttribute("value",value);
	target.value = value;

	if (send) {
		if (moblabel) {
			msg = msg.replace( /moblabel/g , moblabel );
			msg = msg.replace( /msgvalue/g , value/divisor );
			if (config.log.full) console.log("msg:",msg);
			OscMoldeoSend( JSON.parse( msg ) );
		}

	}

};



/**
*	selectEffect
*
*	select the effect mapped by selkey
*
*	@param selkey key is keyboard ( "A", "W", ... )
*
*/
function selectEffect( selkey ) {

	if (config.log.full) console.log("selectEffect > selkey: ",selkey);

	var dSEL = document.getElementById("button_"+selkey);
	var MOB_label = "";

	if (moCI.mapSelectionsObjects && moCI.mapSelectionsObjects[selkey]) {
		MOB_label = moCI.mapSelectionsObjects[selkey];
	} else return console.error("selectEffect > NO MAPPING for this OBJECT > mapSelectionsObjects[" + selkey +"] > " + moCI.mapSelectionsObjects[selkey] );

	Control.ObjectSelected = MOB_label;

	if (Control.PreconfigsSelected[Control.ObjectSelected]==undefined)
		Control.PreconfigsSelected[Control.ObjectSelected] = 0;
	//unselect all
	for( var mkey in moCI.mapSelectionsObjects) {
		var dkey = document.getElementById("button_"+mkey);
		if (dkey) deactivateClass( dkey, "fxselected" );
	}

	//show correct preconfig selected
	/**
	UnselectButtonsCircle(Control.ObjectSelected);
	var dc = document.getElementById("button_"+(Control.PreconfigsSelected[Control.ObjectSelected]+1)+"_");
	if (dc) activateClass( dc, "circle_selected" );
	*/
	Control.Functions.selectControlPreconfig(Control.ObjectSelected, Control.PreconfigsSelected[Control.ObjectSelected]);

	//set sliders
	if (moCI.Project.MapObjects[MOB_label].classname.indexOf("Effect")>0) {
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectgetstate', 'val1': MOB_label } );
	} else OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectgetstate', 'val1': MOB_label } );

	if (dSEL) activateClass( dSEL, "fxselected" );
}

function selectEditorEffect( selkey ) {

	Editor.ObjectSelected = moCI.mapSelectionsObjects[selkey];
	var dSEL = document.getElementById("buttonED_"+selkey);

	//unselect all
	for( var mkey in moCI.mapSelectionsObjects) {
		var dED = document.getElementById("buttonED_"+mkey);
		if (dED) deactivateClass( dED, "fxediting" );
	}

	if (dSEL) activateClass( dSEL, "fxediting" );
}

function selectEditorEffectByLabel( MOBlabel ) {
	if (config.log.full) console.log("UpdateEditor > selectEditorEffectByLabel");

	Editor.ObjectSelected = MOBlabel;
	selkey = moCI.mapSelectionsObjectsByLabel[MOBlabel];

	var dED = document.getElementById("buttonED_"+selkey);

	//unselect all
	for( var mkey in moCI.mapSelectionsObjects) {
		var dd = document.getElementById("buttonED_"+mkey);
		if (dd) deactivateClass( dd, "fxediting" );
	}

	if (dED) activateClass( dED, "fxediting" );
}


function UnselectButtonsCircle( MOBlabel ) {
	for(var i = 1; i<=Options["MAX_N_PRECONFIGS"]; i++) {
		var PreI = document.getElementById("button_"+i+"_");
		if (PreI) deactivateClass( PreI, "circle_selected" );
		//if (i<Control.Objects[MOBlabel])
	}
	var diA = document.getElementById("button_ALL" );
	if (diA) deactivateClass( diA, "circle_selected" );
	$("#button_ALL").html("N");

}





var editor_active = true;

function activateEditor() {
	if (config.log.full) console.log("activateEditor");
	var editor = document.getElementById("editor_panel");
	if (editor && editor_active) {
		deactivateClass( editor, "editor_inactive");
	} else if (editor) {
		activateClass( editor, "editor_inactive");
	}
}

function toggleEditor() {
	if (config.log.full) console.log("editor_button_go_back click!");

	var editor_panel = document.getElementById("editor_panel");
	var editor_button = document.getElementById("editor_button");

	if (!classActivated( editor_panel,"editor_opened")) {
		if (config.log.full) console.log("editor opening");
		activateClass( editor_panel, "editor_opened");

		activateClass( editor_button, "editor_button_close");
	} else {
		if (config.log.full) console.log("editor closing");
		deactivateClass( editor_button, "editor_button_close");
		deactivateClass( editor_panel, "editor_opened");

	}
}

function shiftSelected() {
	var shift_el = document.getElementById("button_SHIFT");
	return classActivated( shift_el, "shiftEnabled" );
}

function ctrlSelected() {
	var ctrl_el = document.getElementById("button_CTRL");
	return classActivated( ctrl_el, "ctrlEnabled" );
}

var canvaspalette;
var ctxpalette;
var paletteImg;


/****************************** CONTROL BUTTONS ************************************************




CONTROL BUTTONS





****************************** CONTROL BUTTONS ************************************************/

/** SCENE SLIDE CONTROLS: ALPHA , TEMPO */
function RegisterSceneCursorSliders() {

	var sH = document.getElementById("scene_slide_VERTICAL_channel_alpha");

	if (sH) {
		sH.updateValue = updateSliderVerticalValue;
		sH.addEventListener( "change",
			function(event) {
				if (config.log.full) console.log("scene_slide_VERTICAL_channel_alpha", event.target.value );
				event.target.updateValue( event.target.value, event.target, true );
			}
		);
		sH.disabled = false;
		sH.updateValue( 0 , sH );
	} else console.error("RegisterSceneCursorSliders > no  scene_slide_VERTICAL_channel_alpha");

	var sV = document.getElementById("scene_slide_VERTICAL_channel_tempo");

	if (sV) {
		sV.updateValue = updateSliderVerticalValue;
		sV.addEventListener( "change",
			function(event) {
				if (config.log.full) console.log("scene_slide_VERTICAL_channel_tempo",event.target.value );
				event.target.updateValue( event.target.value, event.target, true );
			}
		);
		sV.disabled = false;
		sV.updateValue( 0 , sV );
	} else console.error("RegisterSceneCursorSliders > no  scene_slide_VERTICAL_channel_tempo");

}


/** left = 37, up = 38, right = 39, down = 40 */
function startSend( tkey ) {

	var dataCommand = Control.mapCursorStateMod[ tkey ]["command"];

	OscMoldeoSend( dataCommand );

	if (Control.mapCursorStateMod[ tkey ]["pressed"] == true ) {
		setTimeout( function() { startSend( tkey ); } , 40 );
	}
}

var keycount = 0;
var elevent;
function RegisterKeyboardControl() {

	if (config.log.full) console.log("RegisterKeyboardControl");

	document.onkeydown = function(evt) {

		evt = evt || window.event;

		elevent = evt;
		if (evt.target) if (classActivated(evt.target,"param_input")) return;

		var control_focus = true;

		var render_input = document.getElementById("render_video_info_name");
		if (render_input) {
			if ($(render_input).is(":focus")) {
				control_focus = false;
			}
		}

		if (control_focus) {
			if (evt.ctrlKey && evt.keyCode == 90) {

				alert("Ctr+Z");

			} else {

				if (config.log.full) console.log(evt.charCode);

				if ( 37<=evt.keyCode && evt.keyCode<=40 ) {

					if ( keycount==0 ) {

						if (config.log.full) console.log("Key down arrow");
						if (evt.keyCode==37) mkey  = "LEFT";
						if (evt.keyCode==38) mkey  = "UP";
						if (evt.keyCode==39) mkey  = "RIGHT";
						if (evt.keyCode==40) mkey  = "DOWN";
						if (mkey && control_focus ) {
							Control.mapCursorStateMod[mkey]["pressed"] = true;
							Control.mapCursorStateMod[mkey]["command"] = { 'msg': '/moldeo',
																		'val0': 'effectsetstate',
																		 'val1': Control.ObjectSelected,
																		 'val2': Control.mapCursorStateMod[mkey]["member"],
																		 'val3': Control.mapCursorStateMod[mkey]["value"] };

							startSend( 	mkey );
							keycount+= 1;
						}

					}
				}
			}

			if (evt.shiftKey) {
				activateClass( document.getElementById("button_SHIFT"), "shiftEnabled" );
			}
			if (evt.ctrlKey) {
				activateClass( document.getElementById("button_CTRL"), "ctrlEnabled" );
			}
			if (evt.altKey) {
				activateClass( document.getElementById("button_ALT"), "altEnabled" );
			}
		}
	};

	document.onkeyup = function(evt) {
		evt = evt || window.event;
		elevent = evt;

		if (evt.target) if (classActivated(evt.target,"param_input")) return;

		var control_focus = true;

		var render_input = document.getElementById("render_video_info_name");
		if (render_input) {
			if ($(render_input).is(":focus")) {
				control_focus = false;
			}
		}

		key = String.fromCharCode(evt.keyCode);
		if (config.log.full) console.log("Simulate a click please! key: ", key);
		keyU = key.toUpperCase();

		if (control_focus) {
			//mapped keys trigger click in buttons (button_W,button_S,etc...)
			if (moCI.mapSelectionsObjects[keyU]) {
				document.getElementById("button_"+keyU ).click();
			}
			if (!isNaN(Number(key))) {
				//show all preconfigs window selector
				if (Number(key)>=2) Control.Functions.showAllPreconfigs();
				if (document.getElementById("button_"+keyU+"_" ))
					document.getElementById("button_"+keyU+"_" ).click();
			}

			if (evt.altKey && keyU == "E" ) {
				toggleEditor();
			}
			if (evt.altKey && keyU == "O" ) {
				moCI.Browser.Open();
			}


			if (evt.keyIdentifier.indexOf("F")==0) {
				document.getElementById("button_"+evt.keyIdentifier ).click();
			}


			var mkey = undefined;
			if (evt.keyCode==37) mkey  = "LEFT";
			if (evt.keyCode==38) mkey  = "UP";
			if (evt.keyCode==39) mkey  = "RIGHT";
			if (evt.keyCode==40) mkey  = "DOWN";

			if (mkey) {
				if (config.log.full) console.log("Keyup arrow! mkey: ", key);



				if (control_focus) {
					keycount = 0;
					Control.mapCursorStateMod[mkey]["pressed"] = false;
				}
			}

			if (!evt.shiftKey) {
				deactivateClass( document.getElementById("button_SHIFT"), "shiftEnabled" );
			}
			if (!evt.ctrlKey) {
				deactivateClass( document.getElementById("button_CTRL"), "ctrlEnabled" );
			}
			if (!evt.altKey) {
				deactivateClass( document.getElementById("button_ALT"), "altEnabled" );
			}
		}
	};

}



/****************************** EDITOR BUTTONS ************************************************




EDITOR BUTTONS





****************************** EDITOR BUTTONS ************************************************/

var ctx;
var elcanvas;
var lastevent;
var mdown = false;

function ExecuteCanvasPositionInspector(event) {

	if (config.log.full) console.log("ExecuteCanvasPositionInspector > ");
	//check position and draw cross for object position...
	lastevent = event;
	if (event.type=="mousedown") mdown = true;
	if (event.type=="mouseup") mdown = false;
	if (event.type="mousemove" && !mdown) return;

	elcanvas = event.target;
	ctx = elcanvas.getContext('2d');

	var x;
	var y;
	var fx = 1;
	var fy = 1;
	var rect = elcanvas.getBoundingClientRect();

	x = (event.clientX - rect.left)*fx;
	y = (event.clientY - rect.top) *fy;

	elcanvas.width = rect.width;
	elcanvas.height = rect.height;

	ctx.lineWidth = 1;
	ctx.strokeStyle = '#FFFFFF';

	ctx.beginPath();
    ctx.moveTo(x-4,y);
    ctx.lineTo(x+4,y);
    ctx.stroke();

	ctx.beginPath();
    ctx.moveTo(x,y-4);
    ctx.lineTo(x,y+4);
    ctx.stroke();

	var Inspector = GetSliderInspector( event.target );
	if (Inspector==undefined) {
		console.error("ExecuteCanvasPositionInspector > parent Inspector not found for target:", event.target );
		return;
	}

	var group = Inspector.getAttribute("group");
	var moblabel = Inspector.getAttribute("moblabel");
	var preconfig = Inspector.getAttribute("preconfig");

	var selector = event.target.parentNode.getAttribute("selector");

	SetInspectorMode( group , selector, moblabel );

	if (selector=="translatexy") {
		ExecuteStandardSlider( "POSITION", moblabel, "translatex", preconfig, (x-elcanvas.width*0.5)/(0.5*elcanvas.width) );
		ExecuteStandardSlider( "POSITION", moblabel, "translatey", preconfig, -(y-elcanvas.height*0.5)/(0.5*elcanvas.height) );
	} else if (selector=="translatezy") {
		ExecuteStandardSlider( "POSITION", moblabel, "translatez", preconfig, (x-elcanvas.width*0.5)/(0.5*elcanvas.width) );
		ExecuteStandardSlider( "POSITION", moblabel, "translatey", preconfig, -(y-elcanvas.height*0.5)/(0.5*elcanvas.height) );
	}
}

function RegisterInspectorButtons() {

/*INSPECTORS*/

	try {
		if (config.log.full) console.log("RegisterInspectorButtons");


		for(var groupName in Editor.CustomInspectors) {

			//CUSTOMSELECTORS > define special events! (like a canvas por 2d position)
			for(var paramName in Editor.CustomSelectors[groupName]) {
				var selector = document.getElementById("selector_"+groupName+"_"+paramName );
				if (selector) {
					var events = Editor.CustomSelectors["POSITION"][paramName]["events"];
					if (events)
						for( var eventname in events) {
							selector.addEventListener( eventname, events[eventname] );
						}
				}
			}

			//EACH GROUP SELECTOR calls > on click > ActivateInspectorSelector(...)
			for(var paramName in Editor.CustomInspectors[groupName]) {
				var selector = document.getElementById("selector_"+groupName+"_"+paramName );
				if (selector && Editor.CustomSelectors[groupName] ) {
					if (Editor.CustomSelectors[groupName][paramName]==undefined) {
						selector.addEventListener("click", ActivateInspectorSelector );
					}
				}
			}

			if (document.getElementById(groupName+"_slide"))
				document.getElementById(groupName+"_slide").addEventListener("change", ExecuteSliderInspector );
		}

	} catch(err) {
		console.error( "RegisterInspectorButtons > ", err);
		alert(err);
	}
}

function RegisterEditorColorButtons() {
		/*OBJECT COLOR*/
		if (config.log.full) console.log("RegisterEditorColorButtons");

		canvaspalette = document.getElementById("object_color_palette");
		ctxpalette = canvaspalette.getContext("2d");

		paletteImg = new Image();
		paletteImg.src = "buttons/color_palette_bn.png";

		paletteImg.onload = function() {
			ctxpalette.drawImage(	paletteImg,
								0,
								0,
								canvaspalette.width,
								canvaspalette.height);
		};

		//canvaspalette.addEventListener("click", Editor.Buttons["object_color_palette"]["click"]);
}

function RegisterEditorLabelObject() {
	if (config.log.full) console.log("RegisterEditorLabelObject");
	document.getElementById('object_label_text').innerHTML = Editor.ObjectSelected;
}

function RegisterAllButtonActions() {

	if (config.log.full) console.log("RegisterAllButtonActions");

	Control.Register();
	Connectors.Register();


	/*EDITORS*/
	if (editor_active) {

		activateEditor();

		Editor.Register();

	}

}






function UnselectSelectorPositions( parent ) {
	var buttonsPos = parent.getElementsByTagName("button");
	for( var i=0; i<buttonsPos.length; i++) {
		var targbutton = buttonsPos[i];
		deactivateClass( targbutton, "selected");
	}

}

function UpdateControl( MOB_label ) {

	var objectstate = Editor.States[MOB_label];

	if (objectstate) {
		if (objectstate["tempo"]) {
			var alphav = objectstate["alpha"]*100;

			if (config.log.full) console.log("alpha:",alphav);

			var sH = document.getElementById("slide_HORIZONTAL_channel_alpha");
			if (sH) {
				sH.disabled = false;
				sH.setAttribute("moblabel", MOB_label);
				sH.updateValue( alphav, sH );
			}

			var sV  = document.getElementById("slide_VERTICAL_channel_tempo");

			if (sV) {
				sV.disabled = false;
				sV.setAttribute("moblabel", MOB_label);
				sV.updateValue( objectstate["tempo"]["delta"]*50, sV );
			}
		}
	}
}

function valueMemorize( moblabel, param, preconf, value ) {
	try {
		Editor.Parameters[moblabel][param]["pvals"][preconf] = value;
	} catch(err) {
		console.error(err);
	}
}

function valuegetResponse( moblabel, param, preconf, value ) {
	if (config.log.full) console.log("valuegetResponse > mob: ",moblabel," param:",param," preconf:",preconf," value:",value);

	/** TODO: update full interface using getByClassName( moblabel+" "+param+" "+preconf ) and updating with value*/
	try {
	//search all inspectors??? maybe it's better to just subscribe inspectors as active!!!
	UpdateValue( moblabel, param, preconf, value );

	//SELECT the InspectorTab!! and click it
	if (Editor.InspectorTabSelected[moblabel]) {

		if (Editor.InspectorTabSelected[moblabel][preconf]) {

			InspectorTab = Editor.InspectorTabSelected[moblabel][preconf];
			if (config.log.full) console.log("valuegetResponse > Editor.InspectorTab" );
			var labelelem = InspectorTab.getElementsByTagName("label");
			if (labelelem) if (labelelem[0]) labelelem[0].click();

		}

	}
	} catch(err) {
		alert(err);
		console.error("valuegetResponse > ",moblabel, param, preconf, value , err);
	}

}

function UpdateValue( moblabel, param, preconf, value ) {
	//Memorize Value!!!
	valueMemorize( moblabel, param, preconf, value );

	//REACTIVATE ACTIVE INSPECTOR SO VALUES ARE UPDATED
	if (param=="texture") {
		if (value[0] && value[0]["v"])
			UpdateImage( moblabel, param, preconf, value[0]["v"] );
		//ImportMovie( moblabel, param, preconf, value );
	}
	if (param=="movies") {
		if (value[0] && value[0]["v"])
			UpdateMovie( moblabel, param, preconf, value[0]["v"] );
		//ImportMovie( moblabel, param, preconf, value );
	}
	if (param=="sound") {
		if (value[0] && value[0]["v"])
			UpdateSound( moblabel, param, preconf, value[0]["v"] );
	}
	if (param=="color") {
		if (value[0] && value[0]["v"])
			UpdateColor( moblabel, param, preconf, value[0]["v"] );
	}
}

function UpdateSceneStateInfo( MOB_label, NewIndex ) {

	if (config.log.full) console.log("UpdateSceneStateInfo > ", MOB_label );

	var dNumber = document.getElementById("scene_state_number");
	var dText = document.getElementById("sequence_state_indicator_input");
	var dNextText = document.getElementById("sequence_state_indicator_input_next");

// scene_state_number
	if (NewIndex!=undefined)
		Editor.PreconfigsSelected[ MOB_label ] = NewIndex;
	else
		NewIndex = Editor.PreconfigsSelected[ MOB_label ];

	NextIndex = NewIndex + 1;
	//TODO: esto debe actualizarse por un feedback del moldeoplayer (effectgetstate)
	var ValueP = Editor.Parameters[MOB_label]["scene_states"]["pvals"][NewIndex];

	if (dText && ValueP) {
		dText.value = ValueP[0].value;
		dText.setAttribute("title", dText.value );

		ValueNext = Editor.Parameters[MOB_label]["scene_states"]["pvals"][NextIndex];

		if (ValueNext) {
			dNextText.value = ValueNext[0].value;
			dNextText.setAttribute("title", dNextText.value );
		} else {
			dNextText.value = "---";
			dNextText.setAttribute("title", dNextText.value );
		}
	}

	if (dNumber)
		dNumber.innerHTML = NewIndex;

}

function UpdateSceneSliders( MOB_label ) {

	var objectstate = Editor.States[MOB_label];

	if (objectstate) {
		if (objectstate["tempo"]) {
			var alphav = objectstate["alpha"]*100;
			if (config.log.full) console.log("alpha:",alphav);

			var sH = document.getElementById("scene_slide_VERTICAL_channel_alpha");
			if (sH) {
				sH.disabled = false;
				sH.setAttribute("moblabel", MOB_label);
				sH.updateValue( alphav, sH );
			} else console.error("UpdateSceneSliders > no scene_slide_VERTICAL_channel_alpha");

			var sV  = document.getElementById("scene_slide_VERTICAL_channel_tempo");

			if (sV) {
				sV.disabled = false;
				sV.setAttribute("moblabel", MOB_label);
				sV.updateValue( objectstate["tempo"]["delta"]*50, sV );
			} else console.error("UpdateSceneSliders > no scene_slide_VERTICAL_channel_tempo");
		}
	}
}

function UpdateScene( MOB_label ) {

	var Object = Editor.Objects[MOB_label];
	if (Object) {
		ObjectName = Object["object"]["objectdefinition"]["name"];
		if (ObjectName=="scene") {
			var SceneParams = Editor.Parameters[MOB_label];
			if (SceneParams) {
				Scenes.ScenePreEffects[MOB_label] = SceneParams["preeffect"];
				Scenes.SceneEffects[MOB_label] = SceneParams["effect"];
				Scenes.ScenePostEffects[MOB_label] = SceneParams["posteffect"];
				Scenes.SceneStates[MOB_label] = SceneParams["scene_states"];

				if (config.log.full) console.log( "UpdateScene(",MOB_label," ok.");

				UpdateSceneStateInfo( MOB_label );
				UpdateSceneSliders( MOB_label );

				SelectScene( MOB_label );
			}
		}
	}

}

function SelectScene( MOB_label ) {
	Scenes.ObjectSelected = MOB_label;
}

var param_groups;
var gsel;

function selectEditorParameter( preconfig_index ) {

	try {
		if (config.log.full) console.log("SelectEditorParameter > reselect or select a parameter group");

		//perform click() on parameter group...
		var parameters_side_winID = "parameters_side_"+Editor.ObjectSelected+"_";
		var win_parameters_Preconfig = document.getElementById( parameters_side_winID+preconfig_index+"_" );
		if (!win_parameters_Preconfig) return console.error("SelectEditorParameter > no " + parameters_side_winID);

		var group_selected = win_parameters_Preconfig.getElementsByClassName("group_selected");

		if (config.log.full) console.log("SelectEditorParameter > group_selected: " );

		if (group_selected)
			if (config.log.full) console.log("SelectEditorParameter > group_selected.length: ", group_selected.length );

		if ( group_selected && group_selected.length>0 ) {

			if (config.log.full) console.log("SelectEditorParameter > Parameter group already selected: " );

			var gsel = group_selected[0]
			var item_group_selected = group_selected[0];
			if (item_group_selected) {
				var item_group_label = item_group_selected.getElementsByTagName("label");

				if (item_group_label && item_group_label.length>0) {

					var item_group_label_selected = item_group_label[0];
					if (config.log.full) console.log("SelectEditorParameter > item_group_label_selected.click() ");
					item_group_label_selected.click();
					return;
				}
			}
		} else {

			if (config.log.full) console.log("SelectEditorParameter > NO SELECTION!, inducing click and selection on first parameter (published) group for: ", Editor.ObjectSelected );

			param_groups = win_parameters_Preconfig.getElementsByClassName("parameter_group");

			for( var i=0; i<param_groups.length; i++) {
				var item_group = param_groups[i];
				if ( item_group.getAttribute("group")!=undefined
					|| classActivated( item_group, "parameter_is_published") ) {
					if (config.log.full) console.log("SelectEditorParameter > found: " );
					var item_group_label = item_group.getElementsByTagName("label");
					if (item_group_label.length>0) {
						var item_group_label_selected = item_group_label[0];
						item_group_label_selected.click();
						return;
					}
				}
			}

		}
	} catch(err) {
		console.error("selectEditorParameter > ",err);
		alert("selectEditorParameter > " + err );
	}
}

function unselectEditorObjects( preconfig_index ) {

	if (config.log.full) console.log("unselectEditorObjects > ", preconfig_index);
	var object_edition = document.getElementById("object_edition");
	if (object_edition) activateClass( object_edition, "object_edition_collapsed");

	var audio_edition = document.getElementById("audio_edition");
	if (audio_edition) activateClass( audio_edition, "object_edition_collapsed");

	var video_edition = document.getElementById("video_edition");
	if (video_edition) activateClass( video_edition, "object_edition_collapsed");

}

function fetchMovie( moblabel, param_name, preconfig, remote ) {
	try {
		if (remote==true) return fetchMovieRemote( moblabel, param_name, preconfig );

		var ParamValue = fetchValue( moblabel, param_name, preconfig );
		if (ParamValue==false)  {
			console.error("fetchImage > no values for "+preconfig );
			return false;
		}

		var EM = Editor.Movies; if (EM[ moblabel ]==undefined) EM[ moblabel ] = {};
		var OEM = EM[ moblabel ]; if (OEM[ param_name ]==undefined) OEM[ param_name ] = {};
		var OEMP = OEM[ param_name ];
		var preconfidx = "preconf_"+preconfig;
		var MOVOBJECT = OEMP[preconfidx];
		if (MOVOBJECT==undefined) { OEMP[preconfidx] = {}; MOVOBJECT = OEMP[ preconfidx ]; }

		if (MOVOBJECT) {
			MOVOBJECT["src"] = ParamValue[0]["v"];
			/*
			if (MOVOBJECT["img"]==undefined) {
				MOVOBJECT["img"] = new Image();
			}
			MOVOBJECT["img"].moblabel = moblabel;
			MOVOBJECT["img"].param_name = param_name;
			MOVOBJECT["img"].preconfig = preconfig;
			MOVOBJECT["img"].remote = remote;
			MOVOBJECT["img"].onload = onloadImage;
			//using real-path for this image, if we are in local-control
			var newsrc = ValueToSrc( ParamValue[0]["value"] );
			if (MOVOBJECT["img"].filesrc!=newsrc) {

				MOVOBJECT["filesrc"] = newsrc;
				MOVOBJECT["img"].filesrc = newsrc;
				MOVOBJECT["img"].src = newsrc;

			}
			*/
			return true;
		}
	} catch(err) {
		console.error("fetchMovie > ",err);
	}
	return false;
}

function drawParamVideo( moblabel, param_name, preconfig ) {

	var video_edition = document.getElementById("video_edition");
	if (video_edition==undefined) return;

	var filesrc = Editor.Movies[moblabel][param_name]["preconf_"+preconfig]["src"];
	if (video_edition) video_edition.setAttribute("title", filesrc );
}

function selectEditorMovie( moblabel, param_name, preconfig ) {
	try {
		var video_edition = document.getElementById("video_edition");
		if (video_edition==undefined) return;

		video_edition.setAttribute("moblabel", moblabel );
		video_edition.setAttribute("paramname", param_name );
		video_edition.setAttribute("preconfig", preconfig );

		unselectEditorObjects(preconfig);
		deactivateClass( video_edition, "object_edition_collapsed");

		if ( fetchMovie( moblabel, param_name, preconfig ) ) {
			drawParamVideo( moblabel, param_name, preconfig );
		}
	} catch(err) {
		alert(err);
	}

	/*
	if (video_edition) video_edition.setAttribute("moblabel", Editor.ObjectSelected );
	if (video_edition) video_edition.setAttribute("preconfig", Editor.PreconfigSelected );

	if (config.log.full) console.log("selectEditorMovie(",preconfig_index,")");

	var ObjectMovies = Editor.Movies[ Editor.ObjectSelected ];
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;

	for( var paramName in ObjectMovies) {
		var preconfidx = "preconf_"+preconfig_index;
		var filesrc = ObjectMovies[paramName][preconfidx]["src"];
		unselectEditorObjects(preconfig_index);
		deactivateClass( video_edition, "object_edition_collapsed");
		//var PreconfSound = ObjectSounds[paramName]["preconf_"+preconfig_index];
		if (video_edition) video_edition.setAttribute("paramname", paramName );
		if (video_edition) video_edition.setAttribute("title", filesrc );

	}
	*/
}



function fetchAudio( moblabel, param_name, preconfig, remote ) {
	try {
		if (remote==true) return fetchAudioRemote( moblabel, param_name, preconfig );

		var ParamValue = fetchValue( moblabel, param_name, preconfig );
		if (ParamValue==false)  {
			console.error("fetchImage > no values for "+preconfig );
			return false;
		}

		var ES = Editor.Sounds; if (ES[ moblabel ]==undefined) ES[ moblabel ] = {};
		var OES = ES[ moblabel ]; if (OES[ param_name ]==undefined) OES[ param_name ] = {};
		var OESP = OES[ param_name ];
		var preconfidx = "preconf_"+preconfig;
		var SNDOBJECT = OESP[preconfidx];
		if (SNDOBJECT==undefined) { OESP[preconfidx] = {}; SNDOBJECT = OESP[ preconfidx ]; }

		if (SNDOBJECT) {
			SNDOBJECT["src"] = ParamValue[0]["v"];
			/*
			if (SNDOBJECT["img"]==undefined) {
				SNDOBJECT["img"] = new Image();
			}
			SNDOBJECT["img"].moblabel = moblabel;
			SNDOBJECT["img"].param_name = param_name;
			SNDOBJECT["img"].preconfig = preconfig;
			SNDOBJECT["img"].remote = remote;
			SNDOBJECT["img"].onload = onloadImage;
			//using real-path for this image, if we are in local-control
			var newsrc = ValueToSrc( ParamValue[0]["value"] );
			if (SNDOBJECT["img"].filesrc!=newsrc) {

				SNDOBJECT["filesrc"] = newsrc;
				SNDOBJECT["img"].filesrc = newsrc;
				SNDOBJECT["img"].src = newsrc;

			}
			*/
			return true;
		}
	} catch(err) {
		console.error("fetchSound > ",err);
	}
	return false;
}

function drawParamAudio( moblabel, param_name, preconfig ) {

	var audio_edition = document.getElementById("audio_edition");
	if (audio_edition==undefined) return;

	var filesrc = Editor.Sounds[moblabel][param_name]["preconf_"+preconfig]["src"];
	if (audio_edition) audio_edition.setAttribute("title", filesrc );
}

function selectEditorSound( moblabel, param_name, preconfig ) {
	try {
		var audio_edition = document.getElementById("audio_edition");
		if (audio_edition==undefined) return;

		audio_edition.setAttribute("moblabel", moblabel );
		audio_edition.setAttribute("paramname", param_name );
		audio_edition.setAttribute("preconfig", preconfig );

		unselectEditorObjects(preconfig);
		deactivateClass( audio_edition, "object_edition_collapsed");

		if ( fetchAudio( moblabel, param_name, preconfig ) ) {
			drawParamAudio( moblabel, param_name, preconfig );
		}
	} catch(err) {
		alert(err);
	}
/*
	var audio_edition = document.getElementById("audio_edition");
	if (audio_edition==undefined) return;

	if (audio_edition) audio_edition.setAttribute("moblabel", Editor.ObjectSelected );
	if (audio_edition) audio_edition.setAttribute("preconfig", Editor.PreconfigSelected );

	if (config.log.full) console.log("selectEditorSound(",preconfig_index,")");



	var ObjectSounds = Editor.Sounds[ Editor.ObjectSelected ];
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;


	for( var paramName in ObjectSounds) {
		var preconfidx = "preconf_"+preconfig_index;
		var filesrc = ObjectSounds[paramName][preconfidx]["src"];
		unselectEditorObjects(preconfig_index);
		deactivateClass( audio_edition, "object_edition_collapsed");
		//var PreconfSound = ObjectSounds[paramName]["preconf_"+preconfig_index];
		if (audio_edition) audio_edition.setAttribute("paramname", paramName );
		if (audio_edition) audio_edition.setAttribute("title", filesrc );

	}
	*/

}

function drawParamImage( moblabel, param_name, preconfig ) {
	try {
		var EI = Editor.Images[ moblabel ];
		var IMGOBJECTS = EI[param_name];
		var IMGOBJECT = IMGOBJECTS["preconf_"+preconfig];

		var object_edition = document.getElementById("object_edition");
		var object_edition_image = document.getElementById("object_edition_image");

		var canvas_image_context = object_edition_image.getContext("2d");
		canvas_image_context.clearRect( 0,0, object_edition_image.width, object_edition_image.height);

		if (IMGOBJECT && IMGOBJECT.img) {
			object_edition.setAttribute("title", IMGOBJECT.img.filesrc );
			if (IMGOBJECT.img.width>0 && IMGOBJECT.img.height>0) {
				canvas_image_context.drawImage( IMGOBJECT.img, 0,0, object_edition_image.width, object_edition_image.height );
			}
		} else {
			if (config.log.full) console.log("selectEditorImage > no images in [",moblabel,"]");
		}
	}catch(err) {
		console.error("drawParamImage > ",err );
	}
}


function fetchValue( moblabel, param_name, preconfig ) {
	try {
		var EP = Editor.Parameters;
		if ( EP[ moblabel ]==undefined ) { console.error("fetchValue > no parameters for "+moblabel ); return false; }

		var EPO = EP[ moblabel ];
		if (EPO[param_name]==undefined)  { console.error("fetchValue > no parameter "+moblabel+"."+param_name ); return false; }

		var ParamValues = EPO[param_name]["pvals"];

		if ( ParamValues[ preconfig ] == undefined ) {
			console.error("fetchValue > no values for "+preconfig+" - trying to add default value" );
			moCI.AddValue( moblabel, param_name, preconfig );
			return false;
		}
		return ParamValues[ preconfig ];
	} catch(err) {
		console.error("fetchValue > ",err);
	}
	return false;
}

function ValueToSrc( value ) {
	if (value=="default") {
		return config.data_path+"/icons/moldeologo.png";
	}
	return moCI.Project.datapath + "/" + value;

}

function fetchImageRemote( moblabel, param_name, preconfig ) {
	var ParamValue = fetchValue( moblabel, param_name, preconfig );
	if (ParamValue==false)  { console.error("fetchImage > no values for "+preconfig ); return false; }
	//send moldeo signal: for fetching image/thumbnail !!!
	//same if we want to save remote image: we must transfer it... using mime???
	return false;
}

function onloadImage(event) {
	var m = event.target.moblabel;
	var p = event.target.param_name;
	var i = event.target.preconfig;
	if (i==Editor.PreconfigSelected)
		selectEditorImage( m, p, i );
};


var global_refresh = false;

function fetchImage( moblabel, param_name, preconfig, remote ) {
	try {
		if (remote) return fetchImageRemote( moblabel, param_name, preconfig );

		var ParamValue = fetchValue( moblabel, param_name, preconfig );
		if (ParamValue==false)  {
			console.error("fetchImage > no values for "+preconfig );
			return false;
		}

		var EI = Editor.Images; if (EI[ moblabel ]==undefined) EI[ moblabel ] = {};
		var OEI = EI[ moblabel ]; if (OEI[ param_name ]==undefined) OEI[ param_name ] = {};
		var OEIP = OEI[ param_name ];
		var preconfidx = "preconf_"+preconfig;
		var IMGOBJECT = OEIP[preconfidx];
		if (IMGOBJECT==undefined) { OEIP[preconfidx] = {}; IMGOBJECT = OEIP[ preconfidx ]; }

		if (IMGOBJECT) {
			IMGOBJECT["src"] = ParamValue[0]["v"];
			if (IMGOBJECT["img"]==undefined) {
				IMGOBJECT["img"] = new Image();
			}
			IMGOBJECT["img"].moblabel = moblabel;
			IMGOBJECT["img"].param_name = param_name;
			IMGOBJECT["img"].preconfig = preconfig;
			IMGOBJECT["img"].remote = remote;
			IMGOBJECT["img"].onload = onloadImage;
			//using real-path for this image, if we are in local-control
			var newsrc = ValueToSrc( ParamValue[0]["v"] );
			if (IMGOBJECT["img"].filesrc!=newsrc || global_refresh) {
			//if (newsrc) {
				global_refresh = false;
				IMGOBJECT["filesrc"] = newsrc;
				IMGOBJECT["img"].filesrc = newsrc;
				IMGOBJECT["img"].src = newsrc;

			}
			return true;
		}
	} catch(err) {
		console.error("fetchImage > ",err);
	}
	return false;
}

/**
*
*/
function selectEditorImage( moblabel, param_name, preconfig ) {
	try {
		if (config.log.full) console.log("selectEditorImage(",moblabel,param_name,preconfig,")");

		var object_edition = document.getElementById("object_edition");

		if ( fetchImage( moblabel, param_name, preconfig ) ) {

			object_edition.setAttribute("moblabel", moblabel );
			object_edition.setAttribute("paramname", param_name );
			object_edition.setAttribute("preconfig", preconfig );

			unselectEditorObjects(preconfig);
			deactivateClass( object_edition, "object_edition_collapsed");

			drawParamImage( moblabel, param_name, preconfig );
		}
	} catch(err) {
		console.error("selectEditorImage > ",err);
	}
	/*
	for( var paramName in EI) {
		if (config.log.full) console.log("selectEditorImage > Editor.Images[",Editor.ObjectSelected,"][",paramName,"] > ", EI[paramName], " preconf: ","preconf_",preconfig);

		var PreconfImage = EI[paramName]["preconf_"+preconfig];
		var filesrc = "";
		if (PreconfImage) {
			filesrc = PreconfImage["src"];
		} else {
			console.error("selectEditorImage > no preconf for: " + preconfig );
		}
		if (	paramName=="texture" //in general
				|| paramName=="images" //just for SECUENCIA -> FLOW
				) {
			object_edition.setAttribute("paramname", paramName );
			object_edition.setAttribute("title", filesrc );
		}

		unselectEditorObjects(preconfig);
		deactivateClass( object_edition, "object_edition_collapsed");

		if (config.log.full) console.log("selectEditorPreconfig > paramName: ",paramName," EI: ", filesrc);

		var IMGOBJECT = EI[paramName]["preconf_"+preconfig];

		if (IMGOBJECT && IMGOBJECT.img) {
			if (config.log.full) console.log("object_edition_image.width:",object_edition_image.width," object_edition_image:",object_edition_image.height );
			if (config.log.full) console.log("IMGOBJECT.width:",IMGOBJECT.img.width," IMGOBJECT:",IMGOBJECT.img.height );

			if (IMGOBJECT.img.width>0 && IMGOBJECT.img.height>0) {
				canvas_image_context.drawImage( IMGOBJECT.img, 0,0, object_edition_image.width, object_edition_image.height );
			}
		} else {
			if (config.log.full) console.log("selectEditorImage > no images in [",Editor.ObjectSelected,"]");
		}
	}
	*/
}

function rgbToHex(r, g, b) {

	var colorstr = "#FFFFFF";
	try {
		r = Number(Math.round(r));
		g = Number(Math.round(g));
		b = Number(Math.round(b));
		colorstr = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	} catch(e) {
		console.error(e,"rgbToHex > r:",r," g:",g," b:",b);
	}
	return colorstr;
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function selectEditorColor( preconfig_index ) {
	/*
	var object_edition = document.getElementById("object_edition");
	object_edition.setAttribute("moblabel", Editor.ObjectSelected );
	object_edition.setAttribute("preconfig", Editor.PreconfigSelected );
	*/
	var object_color_sel = document.getElementById("object_color_sel");

	if (config.log.full) console.log("selectEditorColor(",preconfig_index,")");
	if (preconfig_index==undefined) preconfig_index = Editor.PreconfigSelected;

	var Color = Editor.Parameters[Editor.ObjectSelected]["color"];
	if (Color) {
		Color = Color["pvals"][preconfig_index];
	}

	//create hexa color:
	if (Color && Color.length>3) {
		var red = Math.round( Color[0]["v"]*255 );
		var green = Math.round( Color[1]["v"]*255 );
		var blue = Math.round( Color[2]["v"]*255 );
		if (config.log.full) console.log("rgbToHex( ",red,", ",green,",", blue," ):",rgbToHex( red, green, blue ));
		object_color_sel.setAttribute( "style" , "background-color:"+ rgbToHex( red, green, blue )+";");
	}


}

function InspectorHideAll() {
	var allinspectors = document.getElementsByClassName("parameter_inspector");
	for( var i=0; i<allinspectors.length;i++) {
		var inspector = allinspectors[i];
		deactivateClass( inspector, "inspector_show" );
	}
}

function ParametersUnselectAll() {
	var psideWinPre = document.getElementById("parameters_side_"+Editor.ObjectSelected+"_" + Editor.PreconfigSelected );
	if (psideWinPre) {
		var params = psideWinPre.getElementsByClassName("parameter_group");
		for( var i=0; i<params.length; i++ ) {
			var pgroup = params[i];
			deactivateClass( pgroup, "group_selected" );
		}
	}
}

function ActivateInspectorSelector( event ) {

	try {
		var Inspector = GetInspector(event.target);

		if (Inspector==undefined) {
			console.error("ActivateInspectorSelector > Inspector parent not found",event);
			return;
		}

		var InspectorSelector = event.target;

		UnselectSelectorPositions(Inspector);

		activateClass( InspectorSelector, "selected");

		var selector = InspectorSelector.getAttribute("selector");
		var param = InspectorSelector.getAttribute("param");
		var group = Inspector.getAttribute("group");
		if (group==undefined) group = Inspector.getAttribute("paramtype");
		var moblabel = Inspector.getAttribute("moblabel");
		var preconfig = Inspector.getAttribute("preconfig");

		//register selected GROUP for this (moblabel, preconfig)
		if (Editor.InspectorGroup[ moblabel ]==undefined)
			Editor.InspectorGroup[ moblabel ] = {};
		Editor.InspectorGroup[ moblabel ][ preconfig ] = group;

		//register selected group SELECTOR for this (moblabel, group, preconfig)
		if (Editor.InspectorSelectorSelected[ moblabel ] == undefined )
			Editor.InspectorSelectorSelected[ moblabel ] = {};
		Editor.InspectorSelectorSelected[ moblabel ][ group ] = {};
		Editor.InspectorSelectorSelected[ moblabel ][ group ][ preconfig ] = selector;

		if (group==undefined) {
			console.error("ActivateInspectorSelector > Inspector group not defined!",Inspector);
			return;
		}

		//memorize selector in Tab Inspector Button!
		var TabInspector = GetTabInspector( moblabel, group, param, preconfig );
		if (TabInspector) TabInspector.setAttribute("selector", selector);

		SetInspectorMode( group, selector, moblabel );
	} catch(err) {
		console.error("ActivateInspectorSelector > ", err, event);
		alert("ActivateInspectorSelector > "+err);
	}
}

function ActivateInspector( event ) {

	try {
		var InspectorTab = event.target.parentNode;
		var inspectorName = InspectorTab.getAttribute("inspector");
		if (config.log.full) console.log("ActivateInspector > clicked parameter > show inspector:",inspectorName);
		var Inspector = document.getElementById(inspectorName);

		ParametersUnselectAll();
		InspectorHideAll();

		var mobLabel = InspectorTab.getAttribute("moblabel");
		if (Inspector) {
			activateClass( Inspector, "inspector_show");
			activateClass( InspectorTab, "group_selected" );

			Inspector.setAttribute("moblabel", mobLabel );
			Inspector.setAttribute("preconfig", Editor.PreconfigSelected );

			if (Editor.InspectorTabSelected[mobLabel]==undefined)
				Editor.InspectorTabSelected[mobLabel] = {};
			Editor.InspectorTabSelected[mobLabel][Editor.PreconfigSelected] = InspectorTab;

			if (Editor.InspectorSelected[mobLabel]==undefined)
				Editor.InspectorSelected[mobLabel] = {};
			Editor.InspectorSelected[mobLabel][Editor.PreconfigSelected] = Inspector;


			UpdateInspector( InspectorTab, Inspector, mobLabel, Editor.PreconfigSelected );
		} else {
			console.error("ActivateInspector > No inspector for tab : "  + inspectorName);
		}
	} catch(err) {
		console.error("ActivateInspector > ", err);
		alert("ActivateInspector > "+err);
	}
}


/**

CHECK IF A SPECIFIC PARAM_NAME "parameter" is REQUIRED FOR ANY CUSTOM_INSPECTORS

( so if it this, we return true, so the core notice this is a required parameter for a custom inspector (as EMITTER, POSITION, SCALE, etc...)
and it will not be rendered control for his own...!!!! )

Checking for every group dependencies of
parameter defined in Editor.CustomInspectors
and saving it in Editor.Inspectors:

Example:
Group "POSITION" has "selectors" "translatex","translatey","translatez" that needs paramaters "translatex", "translatey" and "translatez"
to be published in the actual Moldeo Object Configuration .

Group "SCALE" has "scalex,scaley" selector that needs "scalex" and "scaley" parameters.

*/

function PrepareGroupParameters( MOB_label, param_name ) {

	if (config.log.full) console.log("PrepareGroupParameters > MOB_label:",MOB_label," param_name:",param_name );

	var ret = false;
	//iterate over: Editor.CustomInspectors
	if ( Editor.Inspectors[MOB_label]==undefined )
		Editor.Inspectors[MOB_label] = {};

	MobInspectors = Editor.Inspectors[MOB_label];

	for( var inspector_custom_name in Editor.CustomInspectors ) {

		var CustomInspector = Editor.CustomInspectors[ inspector_custom_name ];

		for( var inspector_selector_name in CustomInspector ) {

			if ( CustomInspector[inspector_selector_name][param_name]==true ) {

				if (config.log.full) console.log("PrepareGroupParameters() > ",param_name," OK! for inspector: ", inspector_custom_name, " in selector:", inspector_selector_name );

				//create Inspector if not created
				if (MobInspectors[inspector_custom_name]==undefined)
					MobInspectors[inspector_custom_name] = {};

				//MobInspectors[inspector_custom_name][param_name] = true;
				if (MobInspectors[inspector_custom_name][inspector_selector_name] == undefined )
					MobInspectors[inspector_custom_name][inspector_selector_name] = {};

				MobInspectors[inspector_custom_name][inspector_selector_name][param_name] = true;

				ret = true;
			}
		}
	}

	if (config.log.full) console.log("PrepareGroupParameters > ended ok: ret:",ret);

	return ret;
}

/**
*	CreateGroupInspector
*
*	Group inspectors are inspector that take more than one parameters that are somehow related and are
*	better handled together like POSITION for parameters "translatex", "translatey", "translatez"
*
*	Create the elements of the group inspector defined by "Group" name and for the Moldeo Object "MOB_label"
*
*	@param MOB_label Moldeo Object unique label name
*	@param Group group name
*	@param preconfig Preconfig number index (0..N)
*	@param psideWinPre Parent window (usually the Preconfig side window)
*
*/
function CreateGroupedParameter( MOB_label, Group, preconfig, psideWinPre ) {
	var ret = false;
	try {

		if (psideWinPre==undefined)
			return ret;

		if (config.log.full) console.log("CreateGroupedParameter() > ",MOB_label,", ",Group,", ",preconfig);

		var ObjectInspector = Editor.Inspectors[MOB_label][Group];
		if (!ObjectInspector) { console.error("Editor.Inspectors["+MOB_label+"]["+Group+"] is not prepared. Check if PrepareGroupParameter() was called..."); return false; }
		if (!psideWinPre) { console.error("CreateGroupedParameter() > psideWinPre missing!"); return false; }

		if (ObjectInspector) {
			var ParamGroup = document.createElement("DIV");
			ParamGroup.setAttribute( "id", "parameter_group_"+MOB_label + "_"+ Group+"_"+preconfig+"_");
			ParamGroup.setAttribute( "moblabel", MOB_label );
			ParamGroup.setAttribute( "preconfig", preconfig );
			ParamGroup.setAttribute( "inspector", "parameter_inspector_"+Group );
			ParamGroup.setAttribute( "group", Group );
			//ParamGroup.setAttribute( "params",  );
			ParamGroup.setAttribute( "class","parameter_group");

			var ParamGroupLabel = document.createElement("LABEL");
			ParamGroupLabel.innerHTML = TR(Group);
			//ParamDivLabel.setAttribute("id",);
			ParamGroup.appendChild(ParamGroupLabel);

			//FOR EACH CLICK INSPECTOR IS UPDATED...
			ParamGroupLabel.addEventListener( "click", ActivateInspector );

			if (psideWinPre) psideWinPre.appendChild(ParamGroup);
			ret = true;
		}
	} catch(err) {
		console.error("CreateGroupedParameter > ", err);
		alert( "CreateGroupedParameter > " + err);
	}
	return ret;
}

function CreateGroupedParameters( MOB_label, preconfig, psideWinPre ) {
	var ret = false;
	try {

		if (psideWinPre==undefined)
			return ret;
		if (config.log.full) console.log("CreateGroupedParameters() > ",MOB_label);
		for( var Group in Editor.Inspectors[MOB_label] ) {
			CreateGroupedParameter( MOB_label, Group, preconfig, psideWinPre );
		}
		ret = true;
	} catch(err) {
		console.error("CreateGroupedParameters > " , err );
		alert( "CreateGroupedParameters > " + err );
	}
	return ret;
}

function ToggleParameterProperty( event ) {
	var pNode = event.target.parentNode;
	var mob_label = pNode.getAttribute("moblabel");
	var param = pNode.getAttribute("param");
	if (config.log.full) console.log("ToggleParameterProperty > moblabel: ",mob_label," param:",param," toggle:",event.target.checked);
	if (event.target.checked) {
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'paramset', 'val1': mob_label, 'val2': param, 'val3': 'property','val4': 'published' } );
		SetSaveNeeded();
	} else {
		SetSaveNeeded();
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'paramset', 'val1': mob_label, 'val2': param, 'val3': 'property','val4': '' } );
	}

}

/**
*	Create Parameter List Item
*/
function CreateStandardParameter( MOB_label, param_name, preconfig, psideWinPre ) {

	var ret = false;
	try {

		if (psideWinPre==undefined)
			return ret;

		if (config.log.full) console.log("CreateStandardParameter() for ",MOB_label,", ",param_name,", pre:",preconfig);

		var Parameters = Editor.Parameters[MOB_label];

		if ( Parameters==undefined ) {
			console.error("CreateStandardParameter > no parameters for label: " + MOB_label );
			return ret;
		}

		var pgroup_object_base = "parameter_group_"+MOB_label;
		var Param = Parameters[ param_name ];

		if (Param==undefined) {
			console.error("CreateStandardParameter > no parameter: " +param_name + "in mob: " + MOB_label);
			return ret;
		}

		var ParamType = Param.pdef["t"];
		var ParamProperty = Param.pdef["pr"];

		var ParamDiv = document.createElement("DIV");
		if (ParamDiv) {
			ParamDiv.setAttribute( "id", pgroup_object_base + "_"+ param_name+"_"+preconfig+"_");
			ParamDiv.setAttribute( "moblabel", MOB_label );
			ParamDiv.setAttribute( "preconfig", preconfig );
			ParamDiv.setAttribute( "param", param_name );
			ParamDiv.setAttribute( "paramtype", ParamType );
			ParamDiv.setAttribute( "inspector", "parameter_inspector_"+ParamType );
			ParamDiv.setAttribute( "class","parameter_group parameter_is_"+ParamProperty);

			var ParamDivLabel = document.createElement("LABEL");
			var ParamDivButton = document.createElement("INPUT");
			if (ParamDivButton) {
				ParamDivButton.setAttribute("type","checkbox");
				if (ParamProperty=="published") ParamDivButton.setAttribute("checked","");
			}

			if (ParamDivLabel) {

				ParamDivLabel.innerHTML = param_name;
				//ParamDivLabel.setAttribute("id",);
				ParamDiv.appendChild( ParamDivLabel );
				ParamDiv.appendChild( ParamDivButton );

				ParamDivLabel.addEventListener( "click", ActivateInspector );
				ParamDivButton.addEventListener( "change", ToggleParameterProperty );
			}
			psideWinPre.appendChild(ParamDiv);
			ret = true;
		}
	} catch(err) {
		console.error("CreateStandardParameter > " , err );
		alert( "CreateStandardParameter > " + err );
	}
	return ret;
}

function CreateTextureParameter( MOB_label, param_name, preconfig ) {

	if (config.log.full) console.log("CreateTextureParameter  > ",MOB_label," param_name:",param_name," pre:",preconfig);
	fetchImage( MOB_label, param_name, preconfig );
	/*
	var Param = Editor.Parameters[MOB_label][param_name];
	var ParamValues = Param.paramvalues;

	var EI = Editor.Images;
	if (EI[MOB_label]==undefined) EI[MOB_label] = {};

	var OEI = Editor.Images[MOB_label];

	if (OEI[param_name]==undefined) OEI[ param_name ] = {};

	var preconfidx = "preconf_"+preconfig;

	if (ParamValues[preconfig]) {
		if (param_name!="movies") {

			if (OEI[ param_name ][ preconfidx ]==undefined) OEI[param_name][ preconfidx ] = {};
			OEI[ param_name ][ preconfidx ]["src"] = ParamValues[preconfig][0]["value"];
			OEI[ param_name ][ preconfidx ]["img"] = new Image();
			OEI[ param_name ][ preconfidx ]["img"].src = moCI.Project.datapath + ParamValues[preconfig][0]["value"];
			if ( preconfig==0 ) {
				if (OEI[ param_name ][ preconfidx ]["img"])
					OEI[ param_name ][ preconfidx ]["img"].onload = function() {
						selectEditorImage(0);
					};
			}

		}

	} else {
		//TODO: create value for this preconfig... and update all PRECONFIGS??
		console.error("CreateTextureParameter > no param values for ",param_name," MUST ADD! " );
		moCI.AddValue( MOB_label, param_name, preconfig );
	}
	*/



}

function CreateMovieParameter( MOB_label, param_name, preconfig, prewindow ) {

	if (config.log.full) console.log("CreateMovieParameter  > ",MOB_label," param_name:",param_name," pre:",preconfig);
	var Param = Editor.Parameters[MOB_label][param_name];
	var ParamValues = Param["pvals"];

	if (Editor.Movies[MOB_label]==undefined) Editor.Movies[MOB_label] = {};

	var OM = Editor.Movies[MOB_label];

	if (OM[param_name]==undefined) OM[ param_name ] = {};

	var preconfidx = "preconf_"+preconfig;

	if (ParamValues[preconfig]) {

		if ( param_name=="movies" ) {
			if (OM[ param_name ][ preconfidx ]==undefined) OM[param_name][ preconfidx ] = {};
			 OM[param_name][ preconfidx ]["src"] = ParamValues[preconfig][0]["v"];
			selectEditorMovie( MOB_label,param_name, 0);
		}

	} else {
		/** TODO: create value for this preconfig... and update all PRECONFIGS?? */
		console.error("CreateMovieParameter > no param values for " + param_name+" MUST ADD! " );
	}


}

function CreateSoundParameter( MOB_label, param_name, preconfig, psideWin ) {
	if (config.log.full) console.log("CreateSoundParameter > ",MOB_label," param_name:",param_name );
	var Param = Editor.Parameters[MOB_label][param_name];
	var ParamValues = Param["pvals"];

	if (Editor.Sounds[MOB_label]==undefined) Editor.Sounds[MOB_label] = {};
	var ObjectSounds = Editor.Sounds[MOB_label];
	if (!ObjectSounds[param_name]) ObjectSounds[param_name] = {};

	var preconfidx = "preconf_"+preconfig;

	if (ObjectSounds[param_name][preconfidx]==undefined) ObjectSounds[param_name][preconfidx] = {};

	if (ParamValues[preconfig]) {
		if (config.log.full) console.log("CreateSoundParameter > value: ", ParamValues[preconfig][0]["v"] );
		ObjectSounds[param_name][preconfidx]["src"] = ParamValues[preconfig][0]["v"];
		selectEditorSound( MOB_label, param_name, 0);
	}
	else
		console.error("CreateSoundParameter > no paramvalues for "+MOB_label+" param_name: " + param_name+" preconfig:"+preconfig);

}


var sliderpos;
/**
*
*/
function SetPositionMode( group, parammode, moblabel ) {
	group = "POSITION";

	if (config.log.full) console.log("SetPositionMode > parammode: ", parammode);

	//CANVAS
	{
	//do nothing
	}

	//SLIDER
	if (parammode=="translatex"
		|| parammode=="translatey"
		|| parammode=="translatez"
	) {

		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		activateClass( inputEl, "param_input_selected");

		var slider = group+"_slide";

		var min = -5;
		var max = 5;
		var step = 0.01;
		var Cons;
		var Constraints;

		var Mob = Editor.Objects[moblabel];
		if (Mob==undefined) {
		} else {
			var effect_class_name = Mob.object.objectdefinition.name;
			Constraints = Editor.Constraints[effect_class_name];
			if (Constraints) {
				Cons = Constraints[parammode];
			}
		}

		if (Cons==undefined) {
			if (Editor.Constraints["standard"]) {
				Cons = Editor.Constraints["standard"][parammode];
				if (!Cons) {
					Cons = Editor.Constraints["standard"][group];
				}
			}
		}

		if (Cons) {
			if (Cons["min"]!=undefined) min = Cons["min"];
			if (Cons["max"]!=undefined) max = Cons["max"];
			if (Cons["step"]!=undefined) step = Cons["step"];
		}

		//the slider (one slider per group, N selectors )
		var sliderEl  = document.getElementById( slider );
		sliderEl.setAttribute("min", min );
		sliderEl.setAttribute("max", max );
		sliderEl.setAttribute("step", step );
		sliderEl.setAttribute("selector", parammode );
		if (sliderEl === document.activeElement ) {
			$(sliderEl).css("border", "solid 1px transparent");
			setTimeout(function()
			{
				$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
			}, 100);
		} else {
			sliderEl.value = inputEl.getAttribute("value");
			sliderEl.setAttribute("value", inputEl.getAttribute("value") );
			if (config.log.full) console.log("HasFocus: ", parammode);
		}
	}
}

function ExecutePositionCanvas( moblabel, selector, preconfig, sliderValue1, sliderValue2 ) {

}

function SetScaleMode( group, parammode, moblabel ) {
	group = "SCALE";
	var slider = group+"_slide";
	var sliderEl  = document.getElementById( slider );

	if (parammode=="scalex" || parammode=="scaley") {
		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		if (inputEl) {
			activateClass( inputEl, "param_input_selected");

			var min = -5;
			var max = 5;
			var step = 0.01;
			var Cons;
			var Constraints;

			var Mob = Editor.Objects[moblabel];
			if (Mob==undefined) {
			} else {
				var effect_class_name = Mob.object.objectdefinition.name;
				Constraints = Editor.Constraints[effect_class_name];
				if (Constraints) {
					Cons = Constraints[parammode];
				}
			}

			if (Cons==undefined) {
				if (Editor.Constraints["standard"]) {
					Cons = Editor.Constraints["standard"][parammode];
				}
			}

			if (Cons) {
				if (Cons["min"]!=undefined) min = Cons["min"];
				if (Cons["max"]!=undefined) max = Cons["max"];
				if (Cons["step"]!=undefined) step = Cons["step"];
			}

			//the slider (one slider per group, N selectors )
			var sliderEl  = document.getElementById( slider );
			sliderEl.setAttribute("min", min );
			sliderEl.setAttribute("max", max );
			sliderEl.setAttribute("step", step );
			sliderEl.setAttribute("selector", parammode );

			if (sliderEl === document.activeElement ) {
				$(sliderEl).css("border", "solid 1px transparent");
				setTimeout(function()
				{
					$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
				}, 100);
			} else {
				sliderEl.value = inputEl.getAttribute("value");
				sliderEl.setAttribute("value", inputEl.getAttribute("value") );
				if (config.log.full) console.log("HasFocus: ", parammode);
			}
		}

	} else if (parammode=="zoom") {

		var inputElx = document.getElementById( "selector_"+group+"_scalex_input" );
		var inputEly = document.getElementById( "selector_"+group+"_scaley_input" );
		var aver =  ( Number(inputElx.value) + Number(inputEly.value) ) / 2.0;
		if (config.log.full) console.log("SetScaleMode > aver:",aver," inputElx.value:",inputElx.value," inputEly.value:",inputEly.value);
		activateClass( inputElx, "param_input_selected");
		activateClass( inputEly, "param_input_selected");
		activateClass( inputEly, "param_input_selected_2");

		sliderEl.setAttribute("min", "-2.0" );
		sliderEl.setAttribute("max", "2.0" );
		sliderEl.setAttribute("step", "0.01" );
		sliderEl.setAttribute("value", aver );
		sliderEl.value = aver;
		sliderEl.setAttribute("selector", parammode );
	}
	/*
	$(sliderEl).css("border", "solid 1px transparent");
	setTimeout(function()
	{
		$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
	}, 100);
	*/

}

function SetScaleParticleMode( group, parammode, moblabel ) {
	group = "SCALEPARTICLE";
	var slider = group+"_slide";
	var sliderEl  = document.getElementById( slider );

	if (parammode=="scalex_particle" || parammode=="scaley_particle") {
		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		if (inputEl) {
			activateClass( inputEl, "param_input_selected");

			var min = -5;
			var max = 5;
			var step = 0.01;
			var Cons;
			var Constraints;

			var Mob = Editor.Objects[moblabel];
			if (Mob==undefined) {
			} else {
				var effect_class_name = Mob.object.objectdefinition.name;
				Constraints = Editor.Constraints[effect_class_name];
				if (Constraints) {
					Cons = Constraints[parammode];
				}
			}

			if (Cons==undefined) {
				if (Editor.Constraints["standard"]) {
					Cons = Editor.Constraints["standard"][parammode];
				}
			}

			if (Cons) {
				if (Cons["min"]!=undefined) min = Cons["min"];
				if (Cons["max"]!=undefined) max = Cons["max"];
				if (Cons["step"]!=undefined) step = Cons["step"];
			}

			//the slider (one slider per group, N selectors )
			var sliderEl  = document.getElementById( slider );
			sliderEl.setAttribute("min", min );
			sliderEl.setAttribute("max", max );
			sliderEl.setAttribute("step", step );
			sliderEl.setAttribute("selector", parammode );

			if (sliderEl === document.activeElement ) {
				$(sliderEl).css("border", "solid 1px transparent");
				setTimeout(function()
				{
					$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
				}, 100);
			} else {
				sliderEl.value = inputEl.getAttribute("value");
				sliderEl.setAttribute("value", inputEl.getAttribute("value") );
				if (config.log.full) console.log("HasFocus: ",parammode);
			}
		}

	} else if (parammode=="zoom") {

		var inputElx = document.getElementById( "selector_"+group+"_scalex_particle_input" );
		var inputEly = document.getElementById( "selector_"+group+"_scaley_particle_input" );
		var aver =  ( Number(inputElx.value) + Number(inputEly.value) ) / 2.0;
		if (config.log.full) console.log("SetScaleMode > aver:",aver," inputElx.value:",inputElx.value," inputEly.value:",inputEly.value);
		activateClass( inputElx, "param_input_selected");
		activateClass( inputEly, "param_input_selected");
		activateClass( inputEly, "param_input_selected_2");

		sliderEl.setAttribute("min", "-2.0" );
		sliderEl.setAttribute("max", "2.0" );
		sliderEl.setAttribute("step", "0.01" );
		sliderEl.setAttribute("value", aver );
		sliderEl.value = aver;
		sliderEl.setAttribute("selector", parammode );
	}
	/*
	$(sliderEl).css("border", "solid 1px transparent");
	setTimeout(function()
	{
		$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
	}, 100);
	*/

}


function SetMotionMode( group, parammode, moblabel ) {

	var slider = group+"_slide";
	var sliderEl  = document.getElementById( slider );

	if (parammode=="translatex" || parammode=="translatey") {

		var inputEl = document.getElementById( "selector_"+group+"_"+parammode+"_input" );
		if (sliderEl) {
			sliderEl.setAttribute("min", "-1" );
			sliderEl.setAttribute("max", "1.0" );
			sliderEl.setAttribute("step", "0.01" );
		}
		if (inputEl) {
			activateClass( inputEl, "param_input_selected");
			//aqui hay que interpretar la funcion!! A + B*C( C*time + D )
			sliderEl.setAttribute("value", inputEl.getAttribute("value") );
			sliderEl.value = inputEl.getAttribute("value");
		}
		sliderEl.setAttribute("selector", parammode );
		/*
		$(sliderEl).css("border", "solid 1px transparent");
		setTimeout(function()
		{
			$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
		}, 100);
		*/



	} else if (parammode=="translatex,translatey") {

		var inputElx = document.getElementById( "selector_"+group+"_translatex_input" );
		var inputEly = document.getElementById( "selector_"+group+"_translatey_input" );
		if (inputElx) activateClass( inputElx, "param_input_selected");
		if (inputEly) activateClass( inputEly, "param_input_selected");
		if (inputEly) activateClass( inputEly, "param_input_selected_2");

	}

}


/**
*	SetSceneObjectsMode
*/
function SetSceneObjectsMode( group, parammode, moblabel ) {
}

/**
*	SetSceneStatesMode
*
*	there is no scene states modes??
*/
function SetSceneStatesMode( group, parammode, moblabel ) {

}


function SetStandardMode( group, parammode, moblabel ) {

	var slider = group+"_slide";

	//the slider (one slider per group, N selectors )
	var sliderEl  = document.getElementById( slider );

	//the label field
	var labelEl = document.getElementById( group+"_slide_label" );

	if (labelEl) {
		//update slide label if any
		labelEl.innerHTML = parammode;
		labelEl.setAttribute( "title", parammode );
	}
	//the input field
	var inputElName = "selector_"+group+"_"+parammode+"_input";
	var inputEl = document.getElementById( inputElName );

	if (inputEl==undefined) {
		inputElName = "selector_"+group+"_input";
		inputEl = document.getElementById( inputElName );
		if (inputEl) {
			inputEl.setAttribute("selector",parammode);
		}
	}

	if (inputEl) {
		inputElSelName = inputElName+"_select";
		activateClass( inputEl, "param_input_selected");
		inputElSel = document.getElementById( inputElSelName );
		if (inputElSel) {
			inputElSel.setAttribute("selector",parammode);
			activateClass( inputElSel, "param_input_selected");
		}
	}

	var min = -5;
	var max = 5;
	var step = 0.01;
	var Cons;
	var Constraints;

	var Mob = Editor.Objects[moblabel];
	if (Mob==undefined) {
	} else {
		var effect_class_name = Mob.object.objectdefinition.name;
		Constraints = Editor.Constraints[effect_class_name];
		if (Constraints) {
			Cons = Constraints[parammode];
		}
	}

	if (Cons==undefined) {
		if (Editor.Constraints["standard"]) {
			Cons = Editor.Constraints["standard"][parammode];
			if (!Cons) {
				Cons = Editor.Constraints["standard"][group];
			}
		}
	}

	if (Cons) {
		if (Cons["min"]!=undefined) min = Cons["min"];
		if (Cons["max"]!=undefined) max = Cons["max"];
		if (Cons["step"]!=undefined) step = Cons["step"];
	}

	if (config.log.full)
		console.log("SetStandardMode(",parammode,") > min:",min," max:",max," step:",step );

	if (sliderEl && inputEl) {
		sliderEl.setAttribute("min", min );
		sliderEl.setAttribute("max",  max );
		sliderEl.setAttribute("step",  step );

		sliderEl.setAttribute("value", inputEl.getAttribute("value") );
		sliderEl.value = inputEl.value;
		sliderEl.setAttribute("selector", parammode );

		$(sliderEl).css("border", "solid 1px transparent");
		setTimeout(function()
		{
			$(sliderEl).css("border", "solid 1px rgba(0,0,0,0)");
		}, 100);
	}
}

/**
*	SetInspectorMode( group, param_mode )
*
*	SetInspectorMode set the mode for a group inspector where many parameters are used but only one is controlled
*	by the only slide available...
*
*	For SCALE group inspector, modes available are "horizontal", "vertical", and "proportional", so the behaviour for the slide is different
*
*/
function SetInspectorMode( group, parammode, moblabel ) {

	//the label field
	var labelEl = document.getElementById( group+"_slide_label" );
	if (labelEl) {
		//update slide label if any
		labelEl.innerHTML = parammode;
		labelEl.setAttribute("title",parammode);
	}

	var Inspector = document.getElementById("parameter_inspector_"+group);
	if (Inspector==undefined) {
		console.error("SetInspectorMode failed > not founded:  ", "parameter_inspector_", group, " parammode:",parammode);
		return;
	}
	var inputs = Inspector.getElementsByClassName("param_input");
	for(var i=0; i<inputs.length; i++) {
		var inp = inputs[i];
		if (inp) deactivateClass( inp,"param_input_selected");
		if (inp) deactivateClass( inp,"param_input_selected_2");
		if (inp) deactivateClass( inp,"param_input_selected_3");
	}

	Inspector.setAttribute( "selector", parammode );


	if (group=="POSITION") {
		SetPositionMode( group, parammode, moblabel );
	} else
	if (group=="SCALE") {
		SetScaleMode( group, parammode, moblabel );
	}else
	if (group=="SCALEPARTICLE") {
		SetScaleParticleMode( group, parammode, moblabel );
	}else
	if (group=="MOTION") {
		SetMotionMode( group, parammode, moblabel );
	} else
	if (group=="SCENE_OBJECTS") {
		if (config.log.full) console.log("SetInspectorMode !!! for SCENE_OBJECTS");
		SetSceneObjectsMode( group, parammode, moblabel );
	} else
	if (group=="SCENE_STATES") {
		if (config.log.full) console.log("SetInspectorMode !!! for SCENE_STATES");
		SetSceneStatesMode( group, parammode, moblabel );
	} else
	if (group=="EMITTER") {
		if (config.log.full) console.log("SetInspectorMode !!! for EMITTER: SetStandardMode: ", parammode);
		SetStandardMode( group, parammode, moblabel );
	} else
	if (group=="BEHAVIOUR") {
		if (config.log.full) console.log("SetInspectorMode !!! for BEHAVIOUR: SetStandardMode: ", parammode);
		SetStandardMode( group, parammode, moblabel );
	} else
	if (group=="ATTRACTOR") {
		if (config.log.full) console.log("SetInspectorMode !!! for ATTRACTOR: SetStandardMode: ", parammode);
		SetStandardMode( group, parammode, moblabel  );
	} else {
		if (config.log.full) console.log("SetInspectorMode !!! for group: ",group, " parammode: ", parammode);
		SetStandardMode( group, parammode, moblabel  );
	}
	if (group=="COLOR") {
		SetStandardMode( group, parammode, moblabel  );
	}
}

function controlId( group, selector ) {
	if (selector=="" || selector==undefined) return "selector_"+group+"_input";
	return "selector_"+group+"_"+selector+"_input";
}

function ExecuteStandardSlider( group, moblabel, selector, preconfig, sliderValue ) {
	try {
		if (config.log.full) console.log("ExecuteStandardSlider > ",
					" group:",group,
					" moblabel:",moblabel,
					" selector:",selector,
					" pre:",preconfig,
					" sliderValue:",sliderValue);

		if (selector==undefined) {  console.error("ExecuteStandardSlider > selector is undefined for:",group, moblabel); return; }

		if (Editor.CustomInspectors[group])
			if (Editor.CustomInspectors[group][selector]) {
				var composed_selector = "";
				var coma = "";
				for( var subsel in Editor.CustomInspectors[group][selector]) {
					var subsel_active = Editor.CustomInspectors[group][selector][subsel];
					if (subsel_active) {
						composed_selector+= coma + subsel;
						coma = ",";
					}
				}
				if (config.log.full) console.log("ExecuteStandardSlider > composed_selector:", composed_selector);
				selector = composed_selector;
			}

		var selector_composition = selector.split(",");
		if (selector_composition.length>=1) {
			for( var i in selector_composition) {
				if (config.log.full) console.log("ExecuteStandardSlider > selector[",i,"] = ",selector_composition[i]);
				var sub_selector = selector_composition[i];
				var inputEl = document.getElementById( controlId(group,sub_selector) );
				if (inputEl == undefined ) inputEl = document.getElementById( controlId(group) );
				if (inputEl) {
					var oldValue = inputEl.getAttribute("value");
					var nval = Number( oldValue );
					if ( isNaN(nval) ) {
						console.error(" oldValue is not a number, probably a function: ",oldValue," new:",sliderValue);
						//return;
						sliderValue = oldValue;
					}
					inputEl.setAttribute("value",sliderValue);
					inputEl.value = sliderValue;
					SetValue( moblabel, sub_selector, preconfig, sliderValue );
				} else {
					console.error("ExecuteStandardSlider > no input sel for:", controlId(group,sub_selector)," or:",controlId(group));
				}

			}
		}
	} catch(err) {
		alert( err );
		console.error("ExecuteStandardSlider > error:", err);
	}
}

function GetSliderInspector( target ) {
	if (!target) return;
	if (!target.parentNode) return;
	if (!target.parentNode.parentNode) return;
	return target.parentNode.parentNode;
}

function GetCanvasInspector( target ) {
	if (!target) return;
	if (!target.parentNode) return;
	if (!target.parentNode.parentNode) return;
	return target.parentNode.parentNode;
}

function GetInputInspector( target ) {
	if (!target) return;
	if (!target.parentNode) return;
	return target.parentNode;
}

function GetInspector( target ) {
	var t = target.parentNode;
	var classname = t.getAttribute("class");
	var founded = false;
	var it = 0;
	var maxit = 4;
	while( founded==false && t && it<maxit  ) {
		classname = t.getAttribute("class");
		if (console.log.full) console.log("GetInspector > classname:", classname, "it:",it );
		if (classname) {
			founded = (classname.indexOf("parameter_inspector")>=0 );
			return t;
		}
		t = t.parentNode;
		it++;
	}
	if (founded==false) return undefined;
	//console.log("GetInspector > t",t );
	return t;
}

function GetTabInspector( moblabel, group, param, preconfig ) {
	var tabid = "parameter_group_"+moblabel+"_"+group+"_"+preconfig+"_";
	var TabInspector = document.getElementById(tabid);
	if (!TabInspector) {
		tabid = "parameter_group_"+moblabel+"_"+param+"_"+preconfig+"_";
		TabInspector = document.getElementById(tabid);
	}
	return TabInspector;
}

/**
	Executed on every change event on every Inspector's Sliders...

*/
function ExecuteSliderInspector(event) {

	var Inspector = GetSliderInspector(event.target);

	if (!Inspector) {
		// we are not in inspector div
		console.error("ExecuteSliderInspector > we are not in inspector div ??? ", event);
		return;
	}

	var group = Inspector.getAttribute("group");
	if (group==undefined) group = Inspector.getAttribute("paramtype");
	var moblabel = Inspector.getAttribute("moblabel");
	var preconfig = Inspector.getAttribute("preconfig");

	var selector = event.target.getAttribute("selector");
	if (selector==undefined) selector = Inspector.getAttribute("param");
	var sliderValue = event.target.value;

	if (config.log.full) console.log("ExecuteSliderInspector > group:",group,
				" selector:", selector,
				" preconfig:",preconfig,
				" value:",sliderValue );

	ExecuteStandardSlider( group, moblabel, selector, preconfig, sliderValue );

}



function UpdateSound( moblabel, paramname, preconfig, filename ) {
	if (config.log.full) console.log("UpdateSound");
	var ObjectSounds = Editor.Sounds[moblabel];
	if (ObjectSounds!=undefined) {
		if (ObjectSounds[paramname]!=undefined) {
			if (ObjectSounds[paramname]["preconf_"+preconfig]!=undefined) {
				//var filesrc = ObjectSounds[paramname]["preconf_"+preconfig]["src"];
				ObjectSounds[paramname]["preconf_"+preconfig]["src"] = filename;
				//do something, like loading an audio object...
				selectEditorSound( moblabel, paramname, preconfig );
			}
		}
	}
}

function UpdateMovie( moblabel, paramname, preconfig, filename ) {
	if (config.log.full) console.log("UpdateMovie");
	var OM = Editor.Movies[moblabel];
	if (OM!=undefined) {
		if (OM[paramname]!=undefined) {
			if (OM[paramname]["preconf_"+preconfig]!=undefined) {
				//var filesrc = ObjectSounds[paramname]["preconf_"+preconfig]["src"];
				OM[paramname]["preconf_"+preconfig]["src"] = filename;
				//do something, like loading an audio object...
				selectEditorMovie( moblabel, paramname, preconfig );
			}
		}
	}
}

function UpdateColor( moblabel, paramname, preconfig, filename ) {
	if (config.log.full) console.log("UpdateColor");
	if (Editor.Parameters[moblabel]==undefined) return;
	if (Editor.Parameters[moblabel][paramname]==undefined) return;
	if (Editor.Parameters[moblabel][paramname]["pvals"]==undefined) return;
	if (Editor.Parameters[moblabel][paramname]["pvals"][preconfig]==undefined) return;
	var color_value = Editor.Parameters[moblabel][paramname]["pvals"][preconfig];
	var color = "#FFFFF";
	var red = 0;
	var green = 0;
	var blue = 0;
	if (color_value) {
		red = Math.round(Number(color_value[0]["v"])*255);
		green = Math.round(Number(color_value[1]["v"])*255);
		blue = Math.round(Number(color_value[2]["v"])*255);
		color = rgbToHex( red, green, blue );
	}
	if (config.log.full) console.log("UpdateColor > ",color,"for:",red,green,blue);
	document.getElementById("object_color_sel").setAttribute("style","background-color:"+color+";");

}

function UpdateImage( moblabel, param_name, preconfig, filename ) {
	try {
		if (config.log.full) console.log("UpdateImage");
		//ok
		//fecthImage and drawParamImage
		selectEditorImage( moblabel, param_name, preconfig );
	} catch(err) {
		console.error("UpdateImage > ",err);
	}
}

function ImportFile( moblabel, param_name, preconfig, filename ) {

	if (config.log.full) console.log("ImportFile > moblabel: ",moblabel," param_name: ",param_name," preconfig:",preconfig," filename:",filename);

	SetValue( moblabel, param_name, preconfig, filename );
	/**
	if (paramname=="texture") ImportImage( moblabel, paramname, preconfig, filename );
	if (paramname=="sound") ImportSound( moblabel, paramname, preconfig, filename );
	if (paramname=="movies") ImportMovie( moblabel, paramname, preconfig, filename );
	*/

}

function selectorToSubselector( selector ) {
	var subselec = 0;
	if (selector=="color:0") { subselec = 0;}
	if (selector=="color_1") subselec = 1;
	if (selector=="color_2") subselec = 2;
	if (selector=="color_3") subselec = 3;
	if (selector=="particlecolor:0") subselec = 0;
	if (selector=="particlecolor_1") subselec = 1;
	if (selector=="particlecolor_2") subselec = 2;
	if (selector=="particlecolor_3") subselec = 3;
	return subselec;
}

function selectorToParamSelector( selector ) {
	var Selector = selector;

	if (selector=="color:0"
	|| selector=="color_0"
	|| selector=="color_1"
	|| selector=="color_2"
	|| selector=="color_3") {
		Selector = "color";
	}


	if (selector=="particlecolor:0"
	|| selector=="particlecolor_0"
	|| selector=="particlecolor_1"
	|| selector=="particlecolor_2"
	|| selector=="particlecolor_3") {
		Selector = "particlecolor";
	}
	return Selector;
}

function SetSaveNeeded() {
	Editor.SaveNeeded = true;
	if (Editor.SaveNeeded) {
		activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
		activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
	}

}

function RefreshValue( moblabel, selector, preconfig ) {

	var subselec = selectorToSubselector(selector);
	paramname = selectorToParamSelector(selector);

	var APIObj = {
				"msg": "/moldeo",
				"val0": "valuerefresh",
				"val1": moblabel,
				"val2": paramname,
				"val3": preconfig
				};
	if (config.log.full) console.log("RefreshValue > APIObj:",APIObj);
	SetSaveNeeded();
	global_refresh = true;
	OscMoldeoSend( APIObj );

}

function SetValue( moblabel, selector, preconfig, value ) {

	if (config.log.full) console.log("SetValue("+moblabel+","+selector+","+preconfig+","+value+")");

	var subselec = undefined;
	var clselector=selector;

	subselec = selectorToSubselector(selector);
	paramname = selectorToParamSelector(selector);

	var success = false;
	try {
		/**WE UPDATE THE VALUE IN CONTROL MEMORY (to optimize for now not to fetch all object parameters values: MUST TODO NEXT: wait until fetch new value)*/
		var Params = Editor.Parameters[moblabel];
		if (Params) {
			var Param = Params[paramname];
			if (Param) {
				var ParamValues = Param["pvals"];
				if (ParamValues) {
					var ParamValue = ParamValues[preconfig];
					if (ParamValue) {
						var Data = ParamValue[0];
						if (Data) {
							if (Param["pdef"]["t"]=="COLOR") {
								//Data[];
								//explode( color
								if (config.log.full) console.log("SetValue of a color:",value,"subselec:",subselec,"ParamValue:",ParamValue );
								/*
								if ( !isNaN(Number(value)) && !isNaN(Number(subselec)) && ParamValue.length>=3 ) {
									ParamValue[subselec]["value"] = value;
									value = rgbToHex( ParamValue[0]["value"]*255,
													ParamValue[1]["value"]*255,
													ParamValue[2]["value"]*255);
									if (config.log.full) console.log("SetValue COLOR (rgbToHex) is ",paramname,value );
								} else */
								//HEXA: #FA3C05
								if (value!=undefined && value.indexOf("#")>=0 && ParamValue.length>=3) {
									if (config.log.full) console.log("SetValue COLOR (hexToRgb) is ",paramname,value );
									var resColor = hexToRgb(value);
									if (resColor) {
										if (resColor.r) ParamValue[0]["v"] = resColor.r / 255.0;
										if (resColor.g) ParamValue[1]["v"] = resColor.g / 255.0;
										if (resColor.b) ParamValue[2]["v"] = resColor.b / 255.0;
										if (ParamValue[3]) ParamValue[3]["v"] = 1.0;
									}
									selector = paramname;
								}
							} else {
								Data["v"] = value;
							}

							success = true;

						} else console.error("SetValue > no Data for paramname:" + paramname +" preconf:"+preconfig+" subvalue: 0 ");
					} else {
						moCI.AddValue( moblabel, paramname, preconfig, value );
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );
						console.error("SetValue > no ParamValue for " + preconfig,value);
					}
				} else console.error("SetValue > no ParamValues for paramname:" + paramname,value);
			} else console.error("SetValue > no Param for paramname:" + paramname,value);
		} else console.error("SetValue > no Params for " + moblabel,value);


		if (success) {
			var APIObj = {
						"msg": "/moldeo",
						"val0": "valueset",
						"val1": moblabel,
						"val2": selector,
						"val3": preconfig,
						"val4": value
						};
			if (config.log.full) console.log("APIObj:",APIObj);
			SetSaveNeeded();
			OscMoldeoSend( APIObj );
		}
	} catch(bigerr) {
		alert("Algo pasó asignando este valor:"+value+" intente de nuevo. Error: "+bigerr);
	}

}


function UpdateSceneObjectsInspector( inspectorElement, moblabel, preconfig ) {

	if (config.log.full) console.log("UpdateSceneObjectsInspector > " );

}

var moSceneState = {
	"Label": "",
	"In": "",
	"Out": "",
	"Action": "",
	"SceneKeys": []
};

var listitem = {}

function UpdateSceneStatesInspector( inspectorElement, moblabel, preconfig ) {
	if (config.log.full) console.log("UpdateSceneStatesInspector > ",inspectorElement,", ",moblabel,", ",preconfig );

	var SceneStatesValues = {};
	var ParamIndexValue = 0;

	//CLEAN
	inspectorElement.innerHTML = "";

	list = document.createElement("UL");
	list.setAttribute("class","scene_states");

	var Params = Editor.Parameters[moblabel];
	var moSceneState = {}
	if (Params) ParamSceneStates = Params["scene_states"];
	if (Params && ParamSceneStates) {
		SceneStatesValues = ParamSceneStates["pvals"];
		ParamIndexValue = ParamSceneStates["paramindexvalue"]
	}


	if (SceneStatesValues)
		for( var ei=0; ei<SceneStatesValues.length; ei++  ) {

			item = document.createElement("LI");

			/*
			if ( ParamIndexValue == ei )
				item.setAttribute("class","moSceneState moSceneStateActive");
			else
				item.setAttribute("class","moSceneState");
			*/

			PreconfigSelection = moCI.RememberPreconfigSelection( moblabel );

			if ( PreconfigSelection==ei )
				item.setAttribute("class","moSceneState moSceneStateActive");
			else
				item.setAttribute("class","moSceneState");


			StateValue = SceneStatesValues[ei];

			if (StateValue && StateValue.length>0) {

				StateLabel = StateValue[0].value;
				if (config.log.full) console.log("UpdateSceneStatesInspector > StateLabel: ",StateLabel);
				item.innerHTML = StateLabel;
				item.addEventListener( "click", function(event) {

					if (config.log.full) console.log("Activate this scene state: ", event.target.innerHTML );

				});

				if (StateValue.length>1) {
					moSceneState = StateValue[1].value;
				}
			}

			list.appendChild(item);
		}
	inspectorElement.appendChild(list);
	listitem = inspectorElement;
}


function CreateInspectorLabel( inspectorElement, moblabel, paramName, paramType, preconfig ) {

	var el = document.createElement("LABEL");
	el.setAttribute("title",paramType+" ("+paramName+")");
	el.innerHTML = paramType+" ("+paramName+")";
	inspectorElement.appendChild(el);
}

function CreateColorInspectorCanvas( inspectorElement, moblabel, paramName, paramType, preconfig ) {

}

//creates html inspector value...
function CreateInspectorValue( inspectorElement, moblabel, paramName, paramType, preconfig, sub ) {

	var Params = Editor.Parameters[moblabel];
	if (Params==undefined) return false;
	var Param = Params[paramName];
	var paramValue = Param["pvals"][preconfig];
	var paramDefinition = Param.pdef;

	var datav = paramValue[sub]["v"];
	var datavDef = paramValue[sub]["d"];
	var codeName = datavDef["cod"];

	var subs = "";
	if (paramValue.length>1)
		subs="_"+sub;

	var selectortype = paramType+subs;
	var selector = paramName+subs;

	var inputInspector;
	var inputInspectorName;
	var buttonInspectorName = "selector_"+paramType+"_"+selector;
	inputInspectorName = buttonInspectorName+"_input";

	inputInspector = document.getElementById( inputInspectorName );

	if (!inputInspector) {

		buttonInspector = document.createElement("BUTTON");
		buttonInspector.setAttribute("id", buttonInspectorName );
		buttonInspector.setAttribute("title", buttonInspectorName );
		buttonInspector.setAttribute("selector", selector);
		buttonInspector.setAttribute("param", paramName);
		buttonInspector.setAttribute("class", "parameter_selector parameter_selector_"+sub+" parameter_selector_"+selectortype+" parameter_selector_"+selector);
		buttonInspector.addEventListener("click", ActivateInspectorSelector );
		buttonInspector.innerHTML = codeName;
		inspectorElement.appendChild(buttonInspector);

		inputInspector = document.createElement("INPUT");
		inputInspector.setAttribute("id", inputInspectorName );
		inputInspector.setAttribute("title", inputInspectorName );
		inputInspector.setAttribute("selector", selector);
		inputInspector.setAttribute("param", paramName);
		//TODO: check ParamDefinition for class name
		inputInspector.setAttribute("class", "param_input param_input_"+sub+" param_input_"+selectortype+" param_input_"+selector);
		//TODO: check ParamDefinition!! for input type or class
		inputInspector.setAttribute("type", "text");
		inputInspector.addEventListener("change", inputValueUpdate )
		inspectorElement.appendChild(inputInspector);


	}
	return inputInspector;
}

function CreateSliderInspector( inspectorElement, moblabel, paramName, paramType, preconfig ) {
	/*
	<div id="COLOR_slide_back" class="slide_H_back parameter_slide_back">
							<label id="COLOR_slide_label">color</label>
							<input id="COLOR_slide" class="parameter_slide slide_H slide_controls"  type="range" min="0.0" max="1.0" step="0.01" value="0"/>
						</div>
	*/
	var Params = Editor.Parameters[moblabel];
	if (Params==undefined) return false;
	var Param = Params[paramName];
	var paramValue = Param["pvals"][preconfig];
	var paramDefinition = Param.pdef;
/*
	var datav = paramValue[sub]["value"];
	var datavDef = paramValue[sub]["value"];

	var subs = "";
	if (sub>0) subs="_"+sub;
	var selectortype = paramType+subs;
	var selector = paramName+subs;
*/
	var inputInspector;
	var inputInspectorName;

	var sliderInspectorName = paramType+"_slide";
	var sliderInspectorNameBack = sliderInspectorName+"_back";
	var sliderInspectorNameLabel = sliderInspectorName+"_label";

	inputInspector = document.getElementById( sliderInspectorName );

	if (!inputInspector) {
		inputInspector = document.createElement("DIV");
		inputInspector.setAttribute("id", sliderInspectorNameBack );
		inputInspector.setAttribute("title", sliderInspectorNameBack );
		inputInspector.setAttribute("class", "slide_H_back parameter_slide_back" );

		inspectorElement.appendChild(inputInspector);

		sliderInspectorLabel = document.createElement("LABEL");
		sliderInspectorLabel.setAttribute("id", sliderInspectorNameLabel );
		sliderInspectorLabel.setAttribute("title", sliderInspectorNameLabel );
		sliderInspectorLabel.innerHTML = paramName;
		inputInspector.appendChild( sliderInspectorLabel );

		sliderInspectorInput = document.createElement("INPUT");
		sliderInspectorInput.setAttribute("id", sliderInspectorName );
		sliderInspectorInput.setAttribute("title", sliderInspectorName );
		sliderInspectorInput.setAttribute("class", "parameter_slide slide_H slide_controls" );
		sliderInspectorInput.setAttribute("type", "range" );
		sliderInspectorInput.setAttribute("min", "0.0" );
		sliderInspectorInput.setAttribute("max", "1.0" );
		sliderInspectorInput.setAttribute("step", "0.01" );
		sliderInspectorInput.setAttribute("value", "0.0" );
		//sliderInspectorInput.addEventListener("change", ExecuteSliderInspector );
		inputInspector.appendChild( sliderInspectorInput );
	}
}

function UpdateColorInspector( inspectorElement, moblabel, paramName, paramType, preconfig ) {

		var Params = Editor.Parameters[moblabel];
		if (Params==undefined) return false;
		var Param = Params[paramName];
		var paramValue = Param["pvals"][preconfig];
		var paramDefinition = Param.pdef;


		//SetInspectorVariables( inspectorElement, moblabel, paramName, paramType, paramName, preconfig );

		inspectorElement.innerHTML = "";

		//INSPECTOR LABEL creation
		CreateInspectorLabel( inspectorElement, moblabel, paramName, paramType, paramName, preconfig );

		//INSPECTOR COLOR CANVAS
		CreateColorInspectorCanvas( inspectorElement, moblabel, paramName, paramType, paramName, preconfig );


		//INSPECTOR STANDARD SLIDER
		//only one slider
		CreateSliderInspector( inspectorElement, moblabel, paramName, paramType, paramName, preconfig );
		/*
		var sliderInspectorName = paramType+"_slide";
		var slider = document.getElementById(sliderInspectorName);
		if (slider) {
			slider.addEventListener("change", ExecuteSliderInspector );
		}
		*/

		//CHECK VALUES
		if (paramValue) {
			var subvalues = paramValue.length>1;
			var data_str = moCI.GetValuesToStr( moblabel, paramName, preconfig );


			if (paramValue.length) {
				for(var sub=0; sub<paramValue.length; sub++) {
 					var datav = paramValue[sub]["v"];

					//now that we have	it, assign it to inspector...
					var inputInspector;

					inputInspector = CreateInspectorValue( inspectorElement, moblabel, paramName, paramType, paramName, preconfig, sub );
					/*
					if (slider) {
						slider.value = datav;
					}

					if (inputInspector) {
						inputInspector.addEventListener("change", inputValueUpdate );
						inputInspector.setAttribute("value", datav);
						inputInspector.value = datav;
						activateClass(inputInspector,"param_input_selected");
					}
					*/
				}
			}
		}

		return;

}

function SetInspectorVariables( inspectorElement, moblabel, paramName, paramType, preconfig ) {
    	//SETTING INSPECTOR ATTRIBUTES
		inspectorElement.setAttribute("moblabel", moblabel);
		inspectorElement.setAttribute("param", paramName);
		inspectorElement.setAttribute("paramtype", paramType);
		// TODO: must use
		//inspectorElement.setAttribute("selector", paramName);
		inspectorElement.setAttribute("preconfig", preconfig );
}

function ClickInspectorSelector( group, selectorName ) {
	if (selectorName && group) {
		var idSelEleName = "selector_"+group+"_"+selectorName+"";
		var SelElement = document.getElementById( idSelEleName );
		if (SelElement) {
			SelElement.click();
		}
	}

}

function UpdateStandardInspector( TabInspector, inspectorElement, moblabel, preconfig ) {
	try {

		if (config.log.full) console.log("UpdateStandardInspector > ");

		if (inspectorElement==undefined) return;
		if (moblabel==undefined) return;
		if (preconfig==undefined) return;

		var Params = Editor.Parameters[moblabel];
		if (Params==undefined) return false;

		var paramName = TabInspector.getAttribute("param");
		var paramType = TabInspector.getAttribute("paramtype");
		var selectorName = TabInspector.getAttribute("selector");
		if (selectorName==undefined || selectorName=="") selectorName = paramName;

		SetInspectorVariables( inspectorElement, moblabel, paramName, paramType, paramName, preconfig );

		moCI.MemorizePreconfigSelection( moblabel, preconfig );

		var Param = Params[paramName];
		var paramValue = Param["pvals"][preconfig];
		var paramDefinition = Param.pdef;

		if (paramValue==undefined) {
			console.error("UpdateStandardInspector > NO PRECONFIG VALUE FOR : " + moblabel+"."+paramName+" AT POSITION ("+preconfig+")" );
			moCI.AddValue( moblabel, paramName, preconfig );
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );
			return;
			//ValueAdd( moblabel, param, preconf, value );
			//PresetValueAdd(...)
		}

		if (paramType=="COLOR") UpdateColorInspector( inspectorElement, moblabel, paramName, paramType, paramName, preconfig );

		//only one slide / PARAM_TYPE inspector
		var sliderInspectorName = paramType+"_slide";
		var slider = document.getElementById(sliderInspectorName);
		if (slider) {
			slider.addEventListener("change", ExecuteSliderInspector );
		}

		SetStandardMode( paramType, paramName, moblabel  );

		if (paramValue) {
			var subvalues = paramValue.length>1;
			var data_str = moCI.GetValuesToStr( moblabel, paramName, preconfig );


			if (paramValue.length) {
				for(var sub=0; sub<paramValue.length; sub++) {
 					var datav = paramValue[sub]["v"];

					//now that we have	it, assign it to inspector...
					var inputInspector;
					var inputInspectorName = "selector_"+paramType+"_"+paramName+"_input";
					if (subvalues) {
						inputInspectorName = "selector_"+paramType+"_"+paramName+"_"+sub+"_input";
					}

					if (slider) {
						slider.value = datav;
					}

					//now that we have it, assign it to inspector...
					inputInspector = document.getElementById( inputInspectorName );

					if (!inputInspector) {
						inputInspectorName = "selector_"+paramType+"_input";
						inputInspector = document.getElementById( inputInspectorName );
					}
					if (inputInspector) {
						inputInspector.addEventListener("change", inputValueUpdate );
						inputInspector.setAttribute("value", datav);
						inputInspector.value = datav;
						activateClass(inputInspector,"param_input_selected");

						var inputSelectInspectorName = inputInspectorName+"_select";
						var inputSelectInspector = document.getElementById( inputSelectInspectorName );

						if (paramDefinition['op'] && paramDefinition['op'].length>0) {


							if (!inputSelectInspector) {
								inputSelectInspector = document.createElement("SELECT");
							}
							inputSelectInspector.setAttribute( "id", inputSelectInspectorName );
							inputSelectInspector.setAttribute( "title", inputSelectInspectorName );
							inputSelectInspector.setAttribute( "class", "param_input" );

							/*var inputSelectInspector = document.getElementById( inputSelectInspectorName );
							if (!inputSelectInspector) {
								inputSelectInspectorName = "selector_"+paramType+"_input_select";
								inputSelectInspector = document.getElementById( inputSelectInspectorName );
							}
							if (!inputSelectInspector) {

							}
							*/
							if (inputSelectInspector) {

								inputSelectInspector.setAttribute("selector", paramName);
								inputSelectInspector.innerHTML = "";

								//update and create OPTIONS...
								if (paramDefinition['op'])
								for( var o=0; o<paramDefinition['op'].length; o++ ) {
									var optionname = paramDefinition['op'][o];
									var optionEl = document.createElement("OPTION");
									optionEl.setAttribute("value", o );
									optionEl.innerHTML = optionname;
									if (datav==o) {
										optionEl.setAttribute("selected","");
									}
									inputSelectInspector.appendChild(optionEl);
								}

								inputSelectInspector.addEventListener("change", inputSelectValueUpdate );
								//inputSelectInspector.value = datav;
								inputInspector.parentNode.insertBefore( inputSelectInspector, inputInspector );
								activateClass( inputSelectInspector, "param_input_selected");

							}
						} else {
							if (inputSelectInspector)
								deactivateClass( inputSelectInspector, "param_input_selected");
						}



					} else {
						console.error("UpdateStandardInspector > " + inputInspectorName+" not found!");
					}
				}
			} else {
				console.error("UpdateStandardInspector > NO PARAM VALUE (subvalue 0) FOR : " + moblabel+"."+paramName+" AT POSITION ("+preconfig+")" );
				moCI.AddValue( moblabel, paramName, preconfig );
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );

			}

		}

		ClickInspectorSelector( paramType, selectorName);

	} catch(err) {
		console.error("UpdateStandardInspector > ",err);
		alert("UpdateStandardInspector > " + err);
	}
}

function inputValueUpdate( event ) {
	if (config.log.full) console.log("Value updated!! ",event.target.value );
	var Inspector = GetInputInspector(event.target);
	if (Inspector) {
		moblabel = Inspector.getAttribute("moblabel");
		preconfig = Inspector.getAttribute("preconfig");

		selector = event.target.getAttribute("selector");
		sliderValue = event.target.value;
		SetValue( moblabel, selector, preconfig, sliderValue );
	}
}

function inputSelectValueUpdate( event ) {
	if (config.log.full) console.log("Select Value updated!! ",event.target.value );
	var Inspector = GetInputInspector(event.target);
	if (Inspector) {
		moblabel = Inspector.getAttribute("moblabel");
		preconfig = Inspector.getAttribute("preconfig");

		selector = event.target.getAttribute("selector");

		sliderValue = event.target.options[event.target.selectedIndex].value;

		SetValue( moblabel, selector, preconfig, sliderValue );
	}
}

/**
*	UpdateInspector > reconfigura el inspector recién activado por el botón de parámetro (ALPHA,TEXTURE,POSITION,MOTION,EMITTER...)
*/


/**
*	Devuelve el selector activado para este inspector
*/
function GetSelectedSelectorName( moblabel, group, preconfig ) {

	if (moblabel==undefined || group==undefined || preconfig==undefined) return false;

	var eiss = Editor.InspectorSelectorSelected;

	if ( eiss[ moblabel ]==undefined || eiss[ moblabel ][ group ]==undefined || eiss[ moblabel ][ group ][ preconfig ]==undefined) return false;

	return eiss[ moblabel ][ group ][ preconfig ];
}

function IsValidParamValues( paramValues ) {
	if (paramValues==undefined) return false;
	if (paramValues.length==undefined) return false;
	if (paramValues.length>0) {
		return true;
	}
	return false;
}

function UpdateGroupParam( group, moblabel, paramName, preconfig ) {

	try {
		var Params = Editor.Parameters[moblabel];
		if (Params==undefined) return false;

		var Param = Params[paramName];
		var paramValue = Param["pvals"][preconfig];
		var paramDefinition = Param.pdef;

		var paramValues = moCI.GetParamValues( moblabel, paramName, preconfig );

		if ( IsValidParamValues(paramValues) ) {

			var subvalues = paramValues.length>1;
			var data_str = moCI.GetValuesToStr( moblabel, paramName, preconfig );

			for(var sub=0; sub<paramValues.length; sub++) {
				var datav = paramValues[sub]["v"];

				//now that we have	it, assign it to inspector...

				var inputInspectorName = "selector_"+group+"_"+paramName+"_input";
				if (sub>0 && subvalues)
					inputInspectorName = "selector_"+group+"_"+paramName+"_"+sub+"_input";

				var inputInspector = document.getElementById( inputInspectorName );
				if (inputInspector) {
					inputInspector.addEventListener("change", inputValueUpdate );
					inputInspector.setAttribute("value", datav);
					inputInspector.value = datav;
					if (config.log.full)
						console.log("UpdateGroupParam > updated value "+inputInspectorName+" val:"+datav+" data_str:"+data_str);

					var inputSelectInspectorName = inputInspectorName+"_select";
					var inputSelectInspector = document.getElementById( inputSelectInspectorName );

					if (paramDefinition['op'] && paramDefinition['op'].length>0) {


						if (!inputSelectInspector) {
							inputSelectInspector = document.createElement("SELECT");
						}
						inputSelectInspector.setAttribute( "id", inputSelectInspectorName );
						inputSelectInspector.setAttribute( "title", inputSelectInspectorName );
						inputSelectInspector.setAttribute( "class", "param_input" );

						if (inputSelectInspector) {

							inputSelectInspector.setAttribute("selector", paramName);
							inputSelectInspector.innerHTML = "";

							//update and create OPTIONS...
							if (paramDefinition['op'])
							for( var o=0; o<paramDefinition['op'].length; o++ ) {
								var optionname = paramDefinition['op'][o];
								var optionEl = document.createElement("OPTION");
								optionEl.setAttribute("value", o );
								optionEl.innerHTML = optionname;
								if (datav==o) {
									optionEl.setAttribute("selected","");
								}
								inputSelectInspector.appendChild(optionEl);
							}

							inputSelectInspector.addEventListener("change", inputSelectValueUpdate );
							//inputSelectInspector.value = datav;
							inputInspector.parentNode.insertBefore( inputSelectInspector, inputInspector );
							activateClass( inputSelectInspector, "param_input_selected");

						}
					} else {
						if (inputSelectInspector)
							deactivateClass( inputSelectInspector, "param_input_selected");
					}


				} else {
					console.error("UpdateInspector > " + inputInsName+" not found!");
				}
			}
		} else {
			console.error("NO PRECONFIG PRINCIPAL VALUE values(0) FOR : " + moblabel+"."+paramName+" AT POSITION: "+preconfig+" " );
		}
	} catch(err) {
		console.error("UpdateGroupParam > ", err );
		alert("UpdateGroupParam > " + err );
	}
}





function UpdateGroupedInspector( moblabel, group, preconfig ) {

	try{
		var ObjectInspectors = Editor.Inspectors[moblabel]; if (ObjectInspectors==undefined) return;
		var inspectorSelectors = ObjectInspectors[group];
		var selectorSelected = false;
		var Params = moCI.GetParams( moblabel );
		var firstSel;
		// Ahora debemos memorizar que selector estaba seleccionado, para simular el click (que selecciona un selector y por ende pone al dia los valores).
		//recorre TODOS LOS SELECTORES de este INSPECTOR
		for( var selectorName in inspectorSelectors ) {
			var selParams = inspectorSelectors[ selectorName ];
			if (selParams) {
				//PONE AL DIA cualquier htmlElement con su PARAMETRO ( Editor.Parameters )
				for( var paramName in selParams) {
					//if this MOBLLE has this parameter as a member (==true), so we try to UPDATE IT( lo ponemos al dia con sus valores )
					if ( selParams[paramName] ) {

						var Param =  Params[paramName];
						if ( moCI.GetParamValues( moblabel, paramName, preconfig ) ) {

							UpdateGroupParam( group, moblabel, paramName, preconfig );

						} else if ( Param && Param["pvals"] ) {
							console.error("NO PARAM ENTRY FOR : " + moblabel+"."+paramName+" AT PRECONFIG POSITION: "+preconfig+" " );
							moCI.AddValue( moblabel, paramName, preconfig );
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );

						}
					}
				}
			}
		}

		//GENERA un CLICK SOBRE EL SELECTOR SELECCIONADO
		for( var selectorName in inspectorSelectors ) {
			var idSelEleName = "selector_"+group+"_"+selectorName+"";
			var SelElement = document.getElementById( idSelEleName );
			if (SelElement) {
				if (firstSel==undefined) firstSel = SelElement;
				//si coincide con el memorizado
				if ( selectorName == GetSelectedSelectorName( moblabel, group, preconfig ) ) {

					if (config.log.full) console.log("UpdateGroupedInspector > "+idSelEleName+" clicked, previously selected.");

					SelElement.click();//CLICK

					selectorSelected = true;
				}
			} else {
				console.error("UpdateGroupedInspector > no htmlElement for " + idSelEleName);
			}
		}

		if (selectorSelected == false && firstSel)
			firstSel.click();
	} catch(err) {
		console.error("UpdateGroupedInspector > ", err );
		alert("UpdateGroupedInspector > " + err );
	}
}

function UpdateInspector( TabInspector, inspEle, moblabel, preconfig ) {
	try {
		if (config.log.full) console.log("UpdateInspector()");

		if (inspEle==undefined || moblabel==undefined || preconfig==undefined) return;
		var Params = moCI.GetParams( moblabel );
		if (Params==undefined) return;

		moCI.SubscribeInspectorToMob( inspEle, moblabel, preconfig );

		//group is
		var group = inspEle.getAttribute("group");
		if (group=="" || group==undefined ) return UpdateStandardInspector( TabInspector, inspEle, moblabel, preconfig );
		if (config.log.full) console.log("UpdateInspector > assign parameters for inspector group: " + group);
		if ( group=="SCENE_OBJECTS" ) return UpdateSceneObjectsInspector( moblabel, preconfig );
		if ( group=="SCENE_STATES"  ) return UpdateSceneStatesInspector( inspEle, moblabel, preconfig );

		UpdateGroupedInspector( moblabel, group, preconfig );

	} catch(err) {
		console.error("UpdateInspector > ", err );
		alert("UpdateInspector > " + err );
	}

}

function ActivatePreconfigsParameters( preconf_index ) {

	//Populate parameters with preconfigs
	var btn_escala = document.getElementById("parameter_group_ESCALA_label_"+preconf_index+"_");

	btn_escala.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});

	var btn_position = document.getElementById("parameter_group_POSICION_label_"+preconf_index+"_");

	btn_position.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});

	var btn_movimiento = document.getElementById("parameter_group_MOVIMIENTO_label_"+preconf_index+"_");

	btn_movimiento.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});

	var btn_scene_objects = document.getElementById("parameter_group_SCENE_OBJECTS_label_"+preconf_index+"_");

	btn_scene_objects.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});

	var btn_scene_states = document.getElementById("parameter_group_SCENE_STATES_label_"+preconf_index+"_");

	btn_scene_states.addEventListener( "click", function(event) {
		ParametersUnselectAll(event.target.getAttribute("preconfig"));
		activateClass( event.target.parentNode, "group_selected" );
		if (config.log.full) console.log( event.target.getAttribute("id") );
	});

}

function hasParam( moblabel, param_name ) {
	var res = false;

	if (Editor.Parameters[moblabel][param_name]) {
		res = true;
	}

	return res;
}

