var md5 = require('md5-node');

var ConsoleInterface = {
	Options: {
		"MAX_N_PRECONFIGS": 10,
		"GetMaxPreconfigs": function( MOB_label ) {

      ///cuenta la cantidad de preconfigs en este MOB_label
      if ( moCI.Editor.Preconfigs[MOB_label] ) {
        var nP = moCI.Editor.Preconfigs[MOB_label].length;
        //np = Math.max( np, moCI.Options[MAX_N_PRECONFIGS] );
        if (np>0) return np;
      }
      return moCI.Options["MAX_N_PRECONFIGS"];
		}
	},
	Log: true,
	State: {},
	Project: {},

	/**
	*	UPDATER OBJECT
	*	Check for last version from download site and popup a notification
	*   TODO: add
	*/
	Updater: {
		"actual_version": "", /* check moldeoversion.txt or .xml */
		"actual_version_str": "",
		"actual_full_version_number": 0,
		"last_version": "",
		"last_version_number": 0,
		"last_version_json": {},
		"version_json": {},
		"options": {
		},
		"Functions": {
			"ReleaseIndex": function( release_version ) {

				//config.versioning.release_version = release_version;
				var index_release_version = config.versioning.release_version[ release_version.toLowerCase() ];

				if ( !isNaN( index_release_version ) ) {
					return index_release_version;
				}
				return 0;

			},
			"ParseVersionStr": function( version_str) {
				//version (\build*)
				//build (build [0-9]*)
				var vjson = {
					major_version: "0",
					minor_version: "0",
					release_version: "Beta",
					build_version: "0",
					comments: "--no comments--",
					full_version_number: 0,
					full_version_str: "",
				};

				var re = "error";

				try {
					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString( version_str,"text/xml" );

					if (xmlDoc) {
						var xmlVersion = xmlDoc.getElementsByTagName("version")[0];
						if (xmlVersion) {
							vjson.major_version = Number(xmlVersion.getAttribute("major"));
							vjson.minor_version = Number(xmlVersion.getAttribute("minor"));
							vjson.release_version = xmlVersion.getAttribute("release");
							vjson.build_version = Number(xmlVersion.getAttribute("build"));
							//base 1 billon, 1 millon, 1 mil, 0
							vjson.full_version_number = Number(vjson.major_version*1000000000)
								+ Number(vjson.minor_version*1000000)
								+ Number(vjson.build_version*1000)
								+ moCI.Updater.Functions.ReleaseIndex(vjson.release_version);

							vjson.full_version_str = ""+vjson.major_version+"."+vjson.minor_version+" "+vjson.release_version+" (build "+vjson.build_version+")";
						}

						var xmlComments = xmlDoc.getElementsByTagName("comments")[0];
						vjson.comments = xmlComments.innerHTML;

						moCI.Updater.version_json = vjson;
						re = vjson.full_version_number;


					}

				} catch(err) {
					return err;
				}
				return re;
			},
			"checkMoldeoLastVersion": function( url ) { /** call this from the app.init() */
				if (url==undefined) {
					url = "http://www.moldeo.org/downloads/lastversion";
				}
				try {
					moCI.Updater.actual_version = fs.readFileSync( config.moldeo_version, "utf8" );
					//moCI.build_version = "";
				} catch(err) {
					console.error(err);
					alert(err);
					return;
				}

				moCI.Updater.actual_full_version_number = moCI.Updater.Functions.ParseVersionStr( moCI.Updater.actual_version );
				moCI.Updater.actual_version_str = moCI.Updater.version_json.full_version_str;
				//config.moldeo_version = moCI.Updater.actual_version_str;
				var title = document.getElementById("controltitle");
				if (title) {
					var mversion = "MOLDEO CONTROL "+moCI.Updater.actual_version_str;
					var titlebar = document.getElementById("titlebar");
					titlebar.setAttribute("title", mversion);
					titlebar.addEventListener("click", function(event) {
						//alert(event.target.getAttribute("title"));
					});
					title.setAttribute("title", mversion);
					title.innerHTML = mversion;
				}


				DynamicRequestVar( "moCI.Updater.last_version", url, "package=Moldeo 1.0 Beta&osversion="+config.platform+"&moldeoversion="+moCI.Updater.actual_version_str, function(response, ready_state) {

					if (response=="" || ready_state!=DYNAMIC_COMPLETED) return;
					//compare response with moldeoversion.txt
					moCI.Updater.last_version = response;
					moCI.Updater.last_version_number = moCI.Updater.Functions.ParseVersionStr( moCI.Updater.last_version );
					moCI.Updater.last_version_json = moCI.Updater.version_json;
					if ( moCI.Updater.last_version_number > moCI.Updater.actual_full_version_number ) {
						//nothing
						//if (confirm("¿Hay una actualización de Moldeo, quieres ir al sitio para instalarla? " )) {
						var title = "Actualización Disponible: " + moCI.Updater.last_version_json.full_version_str;
						var comments = moCI.Updater.last_version_json.comments;
						showModalDialog( title, comments, 	{
																"buttons": {
																	"OK": {
																		"class": "modal-button",
																		"return": true,
																	},
																	"NO": {
																		"class": "modal-button",
																		"return": false,
																	},
																}
															}, function(result) {
																//got to page
																if (result=="true") {
																	OpenExternalPage("http://www.moldeo.org/downloads#head");
																}

															});
					}
				} );

			},
		},
	},

	/**
	*   PLAYER OBJECT
	*
	*	All members and functions related to manipulate the Player (Reproductor)
	*
	*   TODO:
	*/
	Player: {
		'Display': {
		},
		'moConsole': {
		},
	},

	/**
	*   CONTROL OBJECT
	*
	*   All members and functions related to Controlling the state of moldeo objects and effects
	*
	*   TODO:
	*/
	Control: {
		"ObjectSelected": undefined,
		"PreconfigSelected": {},
		"PreconfigsSelected": {},
		"Objects": {},
		"Buttons": {
			"button_TAB": {
				"click": function(event) {
					OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolestop' } );
				},
			},
			"button_ENTER":	{
				"click": function(event) {
					/*si tiene el estado es playing: hacer una pausa*/
					if (event.target.getAttribute("class")=="button_ENTER special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay' } );
					} else {
						/*si tiene el estado es pausa: hacer una play*/
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepause' } );
					}
				},
			},
			"button_RECORD":	{
				"click": function(event) {
					/*si tiene el estado es playing: hacer una pausa*/
					/*
					if (event.target.getAttribute("class")=="button_RECORD special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerecordsession' } );
					} else if (event.target.getAttribute("class")=="button_RECORDING special_button"  ) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerendersession' } );
					} else {
						//si tiene el estado es pausa: hacer una play
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerecord' } );
					}
					*/
					if (event.target.getAttribute("class")=="button_RECORD special_button"  ) {

					moCI.checkWritePermission( function(success) {
						if (success)
						showModalDialog( 	"Elija la calidad de la imagen",
											moCI.QualitySelect(),
											{
												"buttons": {
													"START RENDER": {
														"class": "modal-button",
														"return": true,
													},
													"CANCEL": {
														"class": "modal-button",
														"return": false,
													},
												},
											},
											function( result ) {
												if (result=="true" || result==true) {

													var ql = document.getElementById("quality_select");
													if (ql && ql.options && ql.selectedIndex>=0) {
														config.render.frame_quality = ql.options[ql.selectedIndex].value;
													}

													OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerendersession', 'val1': config.render.frame_quality } );
												}
											}
										);
						else
							showModalDialog( 	"Sin permiso de escritura",
												"Para obtener permiso debe clonar el proyecto en otra carpeta.",
												{
													"buttons": {
														"CLONAR": { "class": "modal-button", "return": true,},
														"CERRAR": { "class": "modal-button", 	"return": false,},
													},
												},
												function( result ) {
													if (result=="true" || result==true) {
														//MAYBE
														//abrir ventana de clonado:
														moCI.Editor.Functions.CloneDialog();
													}
												});
									});
					} else {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolerendersession', 'val1': config.render.frame_quality } );
					}
				},
			},
			"button_RENDERVIDEO": {
				"click": function(event) {

				}
			},
			"button_SPACE": {
				"click": function(event) {
					//OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleplay', 'val1': selectedEffect } );
					/** cehck if wwe PLAY the SELECTED EFFECT > haria un boton de PLAY GENERAL*/
					OscMoldeoSend( { 'msg': '/moldeo', 'val0': 'effectsetstate', 'val1': Control.ObjectSelected, 'val2': 'tempo', 'val3': 'beatpulse' } );
				},
			},
			"button_LEFT": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_RIGHT": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_UP": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_DOWN": {
				"mousedown": function(event) {
					Control.Functions["cursor_mouse_down"](event);
				},
				"mouseup": function(event) {
					Control.Functions["cursor_mouse_up"](event);
				}
			},
			"button_1_": {
				"click": function(event) {
					if (config.log.full) console.log("button_1_ > click");
					Control.Functions.selectControlPreconfig( Control.ObjectSelected, 0 );
				},
			},
			"button_2_": {
				"click": function(event) {
					if (config.log.full) console.log("button_2_ > click");
					Control.Functions.selectControlPreconfig( Control.ObjectSelected, 1 );
				}
			},
			"button_3_": {
				"click": function(event) {
					if (config.log.full) console.log("button_3_ > click");
					Control.Functions.selectControlPreconfig( Control.ObjectSelected, 2 );
				}
			},
			"button_ALL": {
				"click": function(event) {
					if (config.log.full) console.log("button_ALL > click");
					Control.Functions.showAllPreconfigs();
				}
			},
			"button_F1": {
				"click": function(event) {
					if (config.log.full) console.log("button_F1");
					Control.Functions.selectControlPreset( 0 );
				},
			},
			"button_F2": {
				"click": function(event) {
					if (config.log.full) console.log("button_F2");
					Control.Functions.selectControlPreset( 1 );
				}
			},
			"button_F3": {
				"click": function(event) {
					if (config.log.full) console.log("button_F3");
					Control.Functions.selectControlPreset( 2 );
				}
			},
      "button_FALL": {
				"click": function(event) {
					if (config.log.full) console.log("button_FALL > click");
					Control.Functions.showAllPresets();
				}
			},
			"saveasvideo": {
				"change": function(event) {
					var filename = event.target.value;
					if (config.log.full) console.log("saveasvideo > ", filename );

					moCI.Render.SaveAsVideo( filename );
				},
			},
		},
		"Sliders": {
			"slide_HORIZONTAL_channel_alpha": {
				"change": function(event) {
					if (config.log.full) console.log("slide_HORIZONTAL_channel_alpha: ",event.target.value );
					//event.target.updateValue( event.target.value, event.target, true );
					updateSliderHorizontalValue(event.target.value, event.target, true);
				},
			},
			"slide_VERTICAL_channel_tempo": {
				"change": function(event) {
					if (config.log.full) console.log("slide_VERTICAL_channel_tempo: ", event.target.value );
					//event.target.updateValue( event.target.value, event.target, true );
					updateSliderVerticalValue(event.target.value, event.target, true);
				}
			}
		},
		"Functions": {
			"ObjectsToProjectPanel": function( ConsoleInfo ) {
				if (config.log.full) console.log("ObjectsToProjectPanel > ", ConsoleInfo);
				document.getElementById("control_project_header_label").innerHTML = path.basename( ConsoleInfo.configname );
				document.getElementById("control_project_header_label").setAttribute("title", path.basename( ConsoleInfo.configname) );
			},
			"cursor_mouse_down": function(event) {
				mkey = event.target.getAttribute("key");
				if (config.log.full) console.log("button_",mkey," event:", event.target.getAttribute("id") );
				if (Control.mapCursorStateMod)
					if (Control.mapCursorStateMod[mkey]) {
						Control.mapCursorStateMod[mkey]["pressed"] = true;
						Control.mapCursorStateMod[mkey]["command"] = { 'msg': '/moldeo',
																'val0': 'effectsetstate',
																 'val1': Control.ObjectSelected,
																 'val2': Control.mapCursorStateMod[mkey]["member"],
																 'val3': Control.mapCursorStateMod[mkey]["value"] };

						startSend( 	mkey );
					}
			},
			"cursor_mouse_up": function(event) {
				mkey = event.target.getAttribute("key");
				if (Control.mapCursorStateMod)
					if (Control.mapCursorStateMod[mkey])
						Control.mapCursorStateMod[mkey]["pressed"] = false;
			},
			"KeyActivation": function(event) {
				//console.log(event);

				var mkey = event.target.getAttribute("key");
				var mid = event.target.getAttribute("id");
				if (mkey) {
					if (config.log.full) console.log("RegisterPlayerButtons > button_",mkey," event:",event.target.getAttribute("id") );

					//OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectselect', 'val1': 'icono' } );
					if (shiftSelected() || ctrlSelected()) {
						selectEffect( mkey );
						//RegisterPlayerPreconfigsButton();
					} else {
						var label = moCI.mapSelectionsObjects[mkey];
						if ( !classActivated( event.target, "object_enabled") ) {
							if ( moCI.Project.MapObjects[label].classname.indexOf("Effect")>0) {
								OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectenable', 'val1': moCI.mapSelectionsObjects[mkey] } );
							} else OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectenable', 'val1': moCI.mapSelectionsObjects[mkey] } );
						} else {
							if (moCI.Project.MapObjects[label].classname) {
							if ( moCI.Project.MapObjects[label].classname.indexOf("Effect")>0) {
								OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1': moCI.mapSelectionsObjects[mkey] } );
							} else OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectdisable', 'val1': moCI.mapSelectionsObjects[mkey] } );
							} else OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectdisable', 'val1': moCI.mapSelectionsObjects[mkey] } );
						}
					}
				} else console.error("RegisterPlayerButtons > no key attribute in "+mid);
			},
			"selectControlPreconfig": function( object_selection, preconfig_selection, forceselect ) {

				if (config.log.full) console.log("selectControlPreconfig > object_selection: ",object_selection," preconfig_selection:",preconfig_selection );


				if (object_selection==undefined) object_selection = Control.ObjectSelected;
				if (object_selection==undefined) {
					console.error("selectControlPreconfig > no object selected");
					return false;
				}

				if (object_selection!=undefined) {

					if (preconfig_selection==undefined) preconfig_selection = 0;

					var APIObj = {
									'msg': '/moldeo',
									'val0': 'preconfigset',
									'val1': object_selection,
									'val2': preconfig_selection
								};

					Control.PreconfigSelected[object_selection] = preconfig_selection;
					Control.PreconfigsSelected[object_selection] = preconfig_selection;

					if (forceselect==true) {
						var key = moCI.mapSelectionsObjectsByLabel[object_selection];
						if (key) {
							selectEffect( key );
						} else {
							console.error("selectControlPreconfig > no key for: " + object_selection);
						}

					}

					if (object_selection==Control.ObjectSelected) {
						UnselectButtonsCircle();
						var di = document.getElementById("button_" + (preconfig_selection+1)+"_" );
						if (di) activateClass( di, "circle_selected" );

						var diA = document.getElementById("button_ALL" );
						if (preconfig_selection>=3) {
              $("#button_ALL").html((preconfig_selection+1));
              activateClass( diA, "circle_selected" );
						}
					}


					OscMoldeoSend( APIObj );
				}
			},
			"selectControlPreset": function( preconfig_selection ) {
				if (config.log.full) console.log("selectControlPreset > ",preconfig_selection);
				for( var object_label in moCI.mapSelectionsObjectsByLabel) {
					if (config.log.full) console.log("object_label:",object_label);
					Control.Functions.selectControlPreconfig( object_label, preconfig_selection );
				}
			},
			"showAllPreconfigs": function() {
        $("#preconfigs_all").html("");

        var nPreconfigs = moCI.Options.GetMaxPreconfigs();

        for(var i=4; i<=nPreconfigs; i++) {
          var button = document.createElement("BUTTON");
          //var label = document.createElement("BUTTON");
          //var ll = Control.Objects[Control.ObjectSelected];
          button.setAttribute("id","button_"+i+"_");
          button.setAttribute("title","Activate Preconfig "+i);
          button.setAttribute("key",i);
          button.setAttribute("class","button_"+i+" circle_button");
          button.addEventListener("click",function(event) {
            Control.Functions.selectControlPreconfig( Control.ObjectSelected, event.target.getAttribute("key")-1 );
            if (Editor.ObjectSelected) Editor.selectEditorPreconfig( event.target.getAttribute("key")-1 );
          });
          $("#preconfigs_all").append(button);
          button.innerHTML = i;
        }
        $("#preconfigs_all").toggle();
      },
      "showAllPresets": function() {
        $("#presets_all").html("");

        var nPreconfigs = moCI.Options.GetMaxPreconfigs();

        for(var i=4; i<=nPreconfigs; i++) {
          var button = document.createElement("BUTTON");
          button.setAttribute("id","button_F"+i+"_");
          button.setAttribute("title","Activate all preconfigs #"+i);
          button.setAttribute("key",i);
          button.setAttribute("class","button_F"+i+" circle_button");
          button.addEventListener("click",function(event) {
            Control.Functions.selectControlPreset( Control.ObjectSelected, event.target.getAttribute("key")-1 );
            //if (Editor.ObjectSelected) Editor.selectEditorPreconfig( event.target.getAttribute("key")-1 );
          });
          $("#presets_all").append(button);
          button.innerHTML = "F"+i;
        }
        $("#presets_all").toggle();
      },
		},

		"mapCursorStateMod": {
			"LEFT": { "member": "alpha", "value": "decrement", "pressed": false },
			"RIGHT": { "member": "alpha", "value": "increment", "pressed": false },

			"UP": { "member": "tempo", "value": "increment", "pressed": false },
			"DOWN": { "member": "tempo", "value": "decrement", "pressed": false }
		},
		"Register": function() {
			if (config.log.full) console.log("RegisterPlayerButtons");

			$(".objects_selector_panel>button").each( function(index,element) {
				element.setAttribute( "title", "");
				element.setAttribute( "data-original-title", "");
				deactivateClass( element, "object_enabled");
				deactivateClass( element, "present");
			});

			for( var key in moCI.mapSelectionsObjects ) {

				var MOBlabel = moCI.mapSelectionsObjects[key];
				var keyBtn = document.getElementById("button_"+key);

				if (config.log.full) console.log("RegisterPlayerButtons > key button: ","button_",key);
				if (keyBtn) {

					keyBtn.addEventListener( "click", Control.Functions.KeyActivation );

					if (MOBlabel) {
						//keyBtn.setAttribute("title",moCI.mapSelectionsObjects[key]);
						keyBtn.setAttribute( "data-original-title",MOBlabel);
						activateClass( keyBtn, "present");
						$(keyBtn).tooltip();
						activateClass( keyBtn, moCI.mapSelectionsObjects[key] );
					}
				} else {
					console.error("RegisterPlayerButtons > button_"+key+" NOT FOUND!");
				}

			}
			/*
			$(".objects_selector_panel>button").each( function(index,element) {
				//$(element).tooltip();
			});
			*/

			//buttons and cursors
			if (config.log.full) console.log("RegisterPlayerButtons > all buttons with events");
			for( var button in Control.Buttons) {
				var dd = document.getElementById(button);
				for( var eventname in Control.Buttons[button]) {
					if (dd) dd.addEventListener( eventname, Control.Buttons[button][eventname]);
				}
			}

			//sliders
			var sH = document.getElementById("slide_HORIZONTAL_channel_alpha");

			if (sH) {
				sH.updateValue = updateSliderHorizontalValue;
				sH.addEventListener( "change", Control.Sliders["slide_HORIZONTAL_channel_alpha"]["change"]);
				sH.updateValue( 0 , sH );
			}

			var sV = document.getElementById("slide_VERTICAL_channel_tempo");

			if (sV) {
				sV.updateValue = updateSliderVerticalValue;
				sV.addEventListener( "change", Control.Sliders["slide_VERTICAL_channel_tempo"]["change"]);
				sV.updateValue( 0 , sV );

			};



			//keyboard
			RegisterKeyboardControl();
		},
		"Update": function() {

		},
	},

	/**
	*   EDITOR OBJECT
	*
	*   All members and functions related to modifying the configuration of the moldeo objects and effects
	*
	*   TODO:
	*/
	Editor: {
		"ObjectSelected": "",
		"PreconfigSelected": 0,
		"SaveNeeded": false,
		"InspectorTabSelected": {},
		"InspectorSelected": {},
		"InspectorGroup": {},
		"InspectorSelectorSelected": {},

		"Objects": {},
		"States": {},
		"Preconfigs": {},
		"PreconfigsSelected": {},

		"Parameters": {},
		"Inspectors": {},
		"Constraints": {
			"particlessimple": {
				"maxage": {
					"min": "0",
					"max": "120000",
					"step": "1",
				},
				"emitionperiod": {
					"min": "0",
					"max": "10000",
					"step": "1",
				},
				"emitionrate": {
					"min": "0",
					"max": "100",
					"step": "1",
				},
				"emittertype": {
					"min": "0",
					"max": "8",
					"step": "1",
				},
				"randommethod": {
					"min": "0",
					"max": "2",
					"step": "1",
				},
				"creationmethod": {
					"min": "0",
					"max": "2",
					"step": "1",
				},
				"emittervectorx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"emittervectory": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"emittervectorz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},

				"translatex": {
					"min": "-50.0",
					"max": "50.0",
					"step": "1",
				},
				"translatey": {
					"min": "-50.0",
					"max": "50.0",
					"step": "1",
				},
				"translatez": {
					"min": "-50.0",
					"max": "50.0",
					"step": "1",
				},

				"randommotion": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randommotionx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randommotiony": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randommotionz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},

				"randomvelocity": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randomvelocityx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randomvelocityy": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"randomvelocityz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},

				"gravity": {
					"min": "-2",
					"max": "2",
					"step": "0.01",
				},
				"viscosity": {
					"min": "-2",
					"max": "2",
					"step": "0.01",
				},
				"attractortype": {
					"min": "0",
					"max": "4",
					"step": "1",
				},
				"attractormode": {
					"min": "0",
					"max": "4",
					"step": "1",
				},
				"attractorvectorx": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"attractorvectory": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},
				"attractorvectorz": {
					"min": "-5.0",
					"max": "5.0",
					"step": "0.01",
				},

				"rotatex_particle": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatey_particle": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatez_particle": {
					"min": -180,
					"max": 180,
					"step": 1,
				},

				"width": {
					"min": 1,
					"max": 40,
					"step": 1,
				},
				"height": {
					"min": 1,
					"max": 40,
					"step": 1,
				},
			},
			"standard" : {
				"alpha": {
					"min": 0.0,
					"max": 1.0,
					"step": 0.01,
				},
				"syncro": {
					"min": -5.0,
					"max": 5.0,
					"step": 0.01,
				},
				"phase": {
					"min": 0.0,
					"max": 20.0,
					"step": 0.1,
				},
				"COLOR": {
					"min": 0.0,
					"max": 1.0,
					"step": 0.01,
				},
				"volume": {
					"min": 0.0,
					"max": 2.0,
					"step": 0.01,
				},
				"blending": {
					"min": 0,
					"max": 9,
					"step": 1,
				},
				"wireframe": {
					"min": 0,
					"max": 1,
					"step": 1,
				},
				"sides": {
					"min": 2,
					"max": 64,
					"step": 1,
				},
				"segments": {
					"min": 2,
					"max": 100,
					"step": 1,
				},
				"rotatex": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatey": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"rotatez": {
					"min": -180,
					"max": 180,
					"step": 1,
				},
				"threshold": {
					"min": 0,
					"max": 255,
					"step": 1,
				},
				"threshold_max": {
					"min": 0,
					"max": 255,
					"step": 1,
				},
				"threshold_type": {
					"min": 0,
					"max": 5,
					"step": 1,
				},
				"reduce_width": {
					"min": 1,
					"max": 1920,
					"step": 1,
				},
				"reduce_height": {
					"min": 1,
					"max": 1080,
					"step": 1,
				},
			}
		},
		"Images": {},
		"Movies": {},
		"Sounds": {},
		"Models": {},

		"CustomSelectors": {
			"POSITION": {
				"translatexy": {
					"widget": {
						"name": "position_canvas",
						"options": {}
					},
					"events": {
						"click": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mouseup": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousedown": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousemove": function(event) { return ExecuteCanvasPositionInspector(event); },
					}
				},
				"translatezy": {
					"widget": {
						"name": "position_canvas",
						"options": {}
					},
					"events": {
						"click": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mouseup": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousedown": function(event) { return ExecuteCanvasPositionInspector(event); },
						"mousemove": function(event) { return ExecuteCanvasPositionInspector(event); },
					},
				},
			},
		},
		"CustomInspectors": {
			"POSITION": {
				"translatex": { "translatex": true, },
				"translatey": { "translatey": true, },
				"translatez": { "translatez": true, },
				"translatexy": { "translatex": true, "translatey": true, },
				"translatezy": { "translatey": true, "translatez": true, },
			},
			"SCALE": {
				"scalex": { "scalex": true, },
				"scaley": { "scaley": true, },
				"zoom": { "scalex": true, "scaley": true },
			},
			"SCALEPARTICLE": {
				"scalex_particle": { "scalex_particle": true, },
				"scaley_particle": { "scaley_particle": true, },
				"scalez_particle": { "scalez_particle": true, },
				"zoom": { "scalex_particle": true, "scaley_particle": true },
			},
			"MOTION": {
				"Vertical": { "translatey": true, },
				"Horizontal": { "translatex": true, },
				"Circular": { "translatex": true, "translatey": true },
			},
			"SCENE_OBJECTS": {
				"preeffect": { "preffect": true, },
				"effect": { "effect": true,},
				"posteffect": { "posteffect": true, },
			},
			"SCENE_STATES": {
				"scene_states": { "scene_states": true, },
				"sequence_mode": { "sequence_mode": true, },
				"sequence_loop": { "sequence_loop": true, },
				"sequence_duration": { "sequence_duration": true, },
			},
			"EMITTER": {
				"maxage": { "maxage": true, },
				"emitionperiod": { "emitionperiod": true, },
				"emitionrate": { "emitionrate": true, },
				"emittertype": { "emittertype": true, },
				"emittervectorx": { "emittervectorx": true, },
				"emittervectory": { "emittervectory": true, },
				"emittervectorz": { "emittervectorz": true, },
				"randommethod": { "randommethod": true, },
				"creationmethod": { "creationmethod": true, },
			},
			"ATTRACTOR": {
				"gravity": { "gravity": true, },
				"viscosity": { "viscosity": true, },
				"attractortype": { "attractortype": true, },
				"attractormode": { "attractormode": true, },
				"attractorvectorx": { "attractorvectorx": true, },
				"attractorvectory": { "attractorvectory": true, },
				"attractorvectorz": { "attractorvectorz": true, },
			},
			"BEHAVIOUR": {
				"randomvelocity": { "randomvelocity": true, },
				"randomvelocityx": { "randomvelocityx": true, },
				"randomvelocityy": { "randomvelocityy": true, },
				"randomvelocityz": { "randomvelocityz": true, },
				"randommotion": { "randommotion": true, },
				"randommotionx": { "randommotionx": true, },
				"randommotiony": { "randommotiony": true, },
				"randommotionz": { "randommotionz": true, },
			},

		},
		"Buttons": {
			"editor_button_go_back": {
				"click": function(event) {
							toggleEditor();
						}
			},
			"button_object_onoff": {
				"click": function(event) {
					if (config.log.full) console.log("button_object_onoff");

					var mob_label = event.target.getAttribute("moblabel");
					if (mob_label=="" || mob_label==undefined) {
						showModalDialog("Atención", "Debe tocar alguna de las teclas para seleccionar el efecto a editar.", {
							"buttons": {
								"OK": { "class": "button", "return": true  },
								"CANCEL": { "class": "button", "return": false  },
							}
						});
						return;
					}

					if ( !classActivated( event.target, "object_onoff_on") ) {
						if (moCI.Project.MapObjects[mob_label].classname.indexOf("Effect")>0) {
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectenable', 'val1': mob_label } );
						} else OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectenable', 'val1': mob_label } );
					} else {
						if (moCI.Project.MapObjects[mob_label].classname.indexOf("Effect")>0) {
							OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectdisable', 'val1': mob_label } );
						} else OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectdisable', 'val1': mob_label } );
					}

				}
			},
			"buttonED_1_": {
				"click": function(event) {
						if (config.log.full) console.log("buttonED_1 > ");
						Editor.selectEditorPreconfig(0);
				},
			},
			"buttonED_2_": {
				"click": function(event) {
						if (config.log.full) console.log("buttonED_2 > ");
						Editor.selectEditorPreconfig(1);
				},
			},
			"buttonED_3_": {
				"click": function(event) {
						if (config.log.full) console.log("buttonED_3 > ");
						Editor.selectEditorPreconfig(2);
				},
			},
			"buttonED_ALL": {
				"click": function(event) {
					if (config.log.full) console.log("buttonED_ALL > click");
					Editor.showAllEditorPreconfigs();
				}
			},
			"buttonED_OpenProject": {
				"click": function(event) {
					if (config.log.full) console.log("buttonED_OpenProject > ");

					if ( Editor.SaveNeeded==true  ) {
						if (confirm( "Tiene cambios sin guardar. ¿Está seguro que quiere abrir otro proyecto? " )) {

						} else {
							if (config.log.full) console.log("Aborting browser opening...");
							return;
						}
					}

					/*
					var cfile = document.getElementById("openproject");

					if (cfile) {
						cfile.value = "";
						cfile.click();
					}
					*/
					moCI.Browser.Open();
				},
			},
			"buttonED_SaveProject": {
				"click": function(event) { moCI.Save(); },
			},
			"buttonED_SaveProjectAs": {
				"click": function(event) {
					if (config.log.full)
						console.log("buttonED_SaveProjectAs > SaveAsDialog");

					moCI.Editor.Functions.CloneDialog();
				},
			},
			"buttonED_Presentation": {
				"click": function(event) { moCI.Presentation(); },
			},
			"buttonED_Screenshot": {
				"click": function(event) { moCI.Screenshot(); },
			},
			"buttonED_PreviewShot": {
				"click": function(event) { moCI.PreviewShot(); },
			},
			"toggle_third_editor_effects": {
				"click": function(event) {
					$("#third_editor_effects").toggle();
					$("#toggle_third_editor_effects").toggleClass("expanded");
				},
			},
			"importfile": {
				"change": function(event) {
					if (event.target.importobject==undefined) return;

					var moblabel = event.target.importobject.getAttribute("moblabel");
					var preconfig = event.target.importobject.getAttribute("preconfig");
					var paramname = event.target.importobject.getAttribute("paramname");

					var filename = event.target.value;
					if (config.log.full) console.log("choosefile > ", filename );
					if (filename!="") {
						ImportFile( moblabel, paramname, preconfig, filename );
					} else {
						console.error("importfile > change > "+paramname+": Nothing selected.");
					}
				},
			},
			"object_import": {
				"click": function(event) {

					if (config.log.full) console.log("object_import > IMPORT IMAGE/OBJECT");

					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar una imagen.");
						return;
					}

					var cfile = document.getElementById("importfile");

					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".jpg,.png");
						cfile.setAttribute("importobject","object_edition");
						cfile.importobject = event.target.parentNode;
						cfile.value = "";//so the value will change
						cfile.click();
					}

				},
			},
			"object_refresh": {
				"click": function(event) {

					if (config.log.full) console.log("object_refresh > REFRESH IMAGE/OBJECT");

					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar una imagen.");
						return;
					}


					var moblabel = event.target.parentNode.getAttribute("moblabel");
					var preconfig = event.target.parentNode.getAttribute("preconfig");
					var paramname = event.target.parentNode.getAttribute("paramname");

					RefreshValue( moblabel, paramname, preconfig );
					/*
					var cfile = document.getElementById("importfile");

					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".jpg,.png");
						cfile.setAttribute("importobject","object_edition");
						cfile.importobject = event.target.parentNode;
						cfile.value = "";//so the value will change
						cfile.click();
					}
					*/

				},
			},
			"audio_import": {
				"click": function(event) {

					if (config.log.full) console.log("audio_import > IMPORT SOUND");

					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar un sonido.");
						return;
					}

					var cfile = document.getElementById("importfile");

					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".mp3,.m4a,.ogg,,wav");
						cfile.setAttribute("importobject","audio_edition");
						cfile.importobject = event.target.parentNode;
						cfile.click();
					}

				},
			},
			"video_import": {
				"click": function(event) {

					if (config.log.full) console.log("videoo_import > IMPORT MOVIE/VIDEO");

					if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
						alert("Debe seleccionar un efecto antes de importar un video o película.");
						return;
					}

					var cfile = document.getElementById("importfile");

					if (cfile) {
						//cfile.setAttribute();
						cfile.setAttribute("accept",".mp4,.mpg,.avi,.mov,.mp2,.m2v,.ogg");
						cfile.setAttribute("importobject","video_edition");
						cfile.importobject = event.target.parentNode;
						cfile.click();
					}

				},
			},
			"object_color_palette": {
				"click": function(event) {
					  var canvaspalette = event.target;
					  var ctxpalette = canvaspalette.getContext("2d");
					  if (ctxpalette==undefined) return;
					  ctxpalette.clearRect(0,0,canvaspalette.width,canvaspalette.height);
					  ctxpalette.drawImage(	paletteImg,
										0,
										0,
										canvaspalette.width,
										canvaspalette.height);

					  var x;
					  var y;

					  var rect = event.target.getBoundingClientRect();
					  var fx = canvaspalette.width/140;
					  var fy = canvaspalette.height/30;

					  x = (event.clientX - rect.left)*fx;
					  y = (event.clientY - rect.top) *fy;


					  var pixel = ctxpalette.getImageData( x, y , 1, 1 );
					  var pixel_data = pixel.data;
					  if (config.log.full) console.log( "object_color_palette>click> color: r: ", pixel_data[0],
					   " g: ", pixel_data[1]
					  ," b: ", pixel_data[2]
					  );
					  Editor.Functions.SetColor( pixel_data[0], pixel_data[1], pixel_data[2], 1.0 );

				},
			},
			"saveasfile": {
				"change": function(event) {
					var filename = event.target.value;
					if (config.log.full) console.log("saveasfile > ", filename );

					moCI.SaveProjectAs( filename );
				},
			},
			"saveasproject": {
				"change": function(event) {

					var dirname = event.target.value+"/" + event.target.getAttribute("clone_name");
					if (config.log.full) console.log("saveasproject > ", dirname );

					moCI.SaveProjectAs( dirname );
				},
			},
			"openproject": {
				"change": function(event) {
					var filename = event.target.value;
					if (config.log.full) console.log("openproject > ", filename );

					moCI.OpenProject( filename );
				},
			},
			"saveasscreenshot": {
				"change": function(event) {

					var filename = event.target.value;
					var	screenshot = event.target.getAttribute("lastscreenshot");
					console.log("saveasscreenshot > screenshot:", screenshot," filename:", filename );

					moCI.SaveScreenshotAs( screenshot, filename );
				},
			},
			"action_param_unpublished": {
				"click": function(event) {
						if (config.log.full) console.log("toggle param list unpublished");
						var parameter_side_MOB = event.target.parentNode.parentNode;
						if (parameter_side_MOB) {
							var MOB_label = parameter_side_MOB.getAttribute("moblabel");
							if (classActivated( parameter_side_MOB, "show_all")) {
								deactivateClass( parameter_side_MOB, "show_all");
							} else {
								activateClass( parameter_side_MOB, "show_all");
							}
							var di = document.getElementById("parameters_side_"+MOB_label+"_scroller");
							if (di) {
								if ($("#parameters_side_"+MOB_label+"_scroller").data("plugin_tinyscrollbar")) {
									$("#parameters_side_"+MOB_label+"_scroller").data("plugin_tinyscrollbar").update("relative");
								} else {
									$("#parameters_side_"+MOB_label+"_scroller").tinyscrollbar();
								}
							}
						} else console.error("action_param_unpublished > error");
				},
			},
			"reload_interface_button": function(event) {
				return moCI.Editor.Functions["reload"]();
			}
		},
		"Functions": {
			"CloneDialog": function() {

				var saveasproject = document.getElementById("saveasproject");
				var clone_name = prompt("Ingresa el nuevo nombre del proyecto (sin acentos ni caracteres especiales por favor)","mi_clon");

				if (saveasproject && clone_name) {
					saveasproject.setAttribute("clone_name", clone_name );
					saveasproject.setAttribute("value", "" );
					saveasproject.value = "";
					saveasproject.click();
				}
			},
			"SetColor": function( red_byte, green_byte, blue_byte, alpha_float ) {
				var color = "#" + ("000000" + rgbToHex( red_byte, green_byte, blue_byte ) ).slice(-6);
					if (config.log.full) console.log( "SetColor color: ", color, " r: ", red_byte
					 , " g: " , green_byte
					  , " b: " , blue_byte
					  );

					  SetValue(	Editor.ObjectSelected,
								"color",
								Editor.PreconfigsSelected[Editor.ObjectSelected],
								color
								);
			},
			"reload": function() {
				moCI.ReloadInterface();
			},
			"edit_button_click": function(event) {
				try {
					var mkey = event.target.getAttribute("key");
					var MOBlabel;

					if (moCI.mapSelectionsObjects) {
						MOBlabel = moCI.mapSelectionsObjects[mkey];
					}

					if (config.log.full) console.log("buttonED_",mkey," event:", event.target.getAttribute("id") );
					if (MOBlabel) {
						OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': '' + MOBlabel + '' } ); //retreive all parameters
							//send a request to get full object info...ASYNC
					}
				} catch(err) {
					console.error("Editor.Functions.edit_button_click > ", err);
					alert(err);
				}
			},
		},
		"Register": function() {
			if (config.log.full) console.log("RegisterEditorButtons");

			$(".objects_editor_panel>button").each( function(index,element) {
				element.setAttribute( "title", "");
				element.setAttribute( "data-original-title", "");
				//element.removeEventListener( "click", Editor.Functions["edit_button_click"] );
				deactivateClass( element, "object_enabled");
				deactivateClass( element, "present");
			});

			for( var key in moCI.mapSelectionsObjects ) {

				var MOBlabel = moCI.mapSelectionsObjects[key];
				var selObject = document.getElementById("buttonED_"+key);

				if (selObject) {
					selObject.addEventListener( "click", Editor.Functions["edit_button_click"]);
					if (MOBlabel) {
						selObject.setAttribute( "title", "" );
						selObject.setAttribute( "data-original-title", MOBlabel );
						activateClass( selObject, "present");
						$(selObject).tooltip();
					}

				}
			}

      var eles = document.getElementsByClassName("keyED_button");
			for(var eb=0; eb<eles.length; eb++ ) {
        var ebut = eles[eb];
        if (ebut) {
          var key = ebut.getAttribute("key");
          if (key && moCI.mapSelectionsObjects[key]) {
            var MOBlabel = moCI.mapSelectionsObjects[key];
            ebut.addEventListener( "click", Editor.Functions["edit_button_click"]);
            ebut.setAttribute( "title", "" );
            ebut.setAttribute( "data-original-title", MOBlabel );
            activateClass( ebut, "present");
            $(ebut).tooltip();
          }
        }
			}

/*
			$(".objects_editor_panel button").each( function(index,element) {

			});	*/

			for( var button in Editor.Buttons ) {
				var dd = document.getElementById(button);
				for( var eventname in Editor.Buttons[button]) {
					if (dd) dd.addEventListener( eventname, Editor.Buttons[button][eventname]);
				}
			}
			RegisterEditorColorButtons();

			for(var groupName in Editor.CustomInspectors) {

				//CUSTOMSELECTORS > define special events! (like a canvas por 2d position)
				for(var paramName in Editor.CustomSelectors[groupName]) {
					var selector = document.getElementById("selector_"+groupName+"_"+paramName );
					if (selector) {
						var events = Editor.CustomSelectors[groupName][paramName]["events"];
						if (events)
							for( var eventname in events) {
								selector.addEventListener( eventname, events[eventname] );
							}
					}
				}

				//EACH GROUP SELECTOR calls > on click > ActivateInspectorSelector(...)
				for(var paramName in Editor.CustomInspectors[groupName]) {
					var selector = document.getElementById("selector_"+groupName+"_"+paramName );
					if (selector) {
						if ( Editor.CustomSelectors[groupName]==undefined
							||
							Editor.CustomSelectors[groupName][paramName]==undefined) {
							selector.addEventListener("click", ActivateInspectorSelector );
						}
					}
				}

				if (document.getElementById(groupName+"_slide"))
					document.getElementById(groupName+"_slide").addEventListener("change", ExecuteSliderInspector );
			}


		},
		"Update": function( MOB_label, fullobjectInfo ) {

			if (config.log.full) console.log("UpdateEditor > MOB_label: ",MOB_label," fullobjectInfo: ",fullobjectInfo);

      missing = false;

      Editor.ObjectRequested = MOB_label;

			if (moCI.Project.datapath==undefined) {
				console.error("ERROR > no console INFO, trying to get it...");
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'consoleget', 'val1': '' } );
				Editor.ObjectRequested = MOB_label;
				return -1;
			}

			selectEditorEffectByLabel( MOB_label );
			RegisterEditorLabelObject();
      if (fullobjectInfo["object"])
        Editor.Objects[MOB_label] = fullobjectInfo;


			var MObject = Editor.Objects[MOB_label];

      if (fullobjectInfo["objectconfig"] && MObject["object"])
        MObject["object"]["objectconfig"] = fullobjectInfo["objectconfig"];

			var Config = MObject["object"]["objectconfig"];
      if (Config==undefined) {  console.log("Must call objetgetpreconfig"); return -1; }
			Editor.PreconfigSelected = Config["currentpreconfig"];

			if (Editor.PreconfigSelected==-1) {
				Editor.PreconfigSelected = 0;
			}

			if (fullobjectInfo["effectstate"]) {
				Editor.States[MOB_label] = MObject["effectstate"];
			} else Editor.States[MOB_label] = MObject["object"]["objectstate"];

			Editor.Parameters[MOB_label] = Config["parameters"];
			var Params = Editor.Parameters[MOB_label];


			if (fullobjectInfo["preconfig"] && fullobjectInfo["position"]>=0 && Config["preconfigs"]) {
        Config["preconfigs"][fullobjectInfo["position"]] = fullobjectInfo["preconfig"];
			}

      if (Config["preconfigs"] &&
          (
            Config["preconfigs"].length==0
            ||
            ( Config["preconfigs"].length && Config["preconfigs"][Config["preconfigs"].length-1]["vidx"])
          )
          ) {
        Editor.Preconfigs[MOB_label] = Config["preconfigs"];
      } else {
        console.error("must call getpreconfig for each preconfig");
        //return -1;
        missing = true;
      }

      if (fullobjectInfo["pdef"]) {
        Params[fullobjectInfo["pdef"]["name"]] = fullobjectInfo;
      }

      for(var pname in Params ) {
        if ( Params[pname]["pdef"] ) {
        } else {
          console.error("pname: ", pname, Params[pname]["pdef"]);
          missing = true;
        }
      }

      if (missing) return -1;

			// Parameters:
			// console.log("target: "+ target+ " parameters:" + JSON.stringify( Editor.Parameters[target], "", "\t") );

			// Preconfigs
			// console.log("target: "+ target+ " preconfigs:" + JSON.stringify( Editor.Preconfigs[target], "", "\t") );

			// activamos o desactivamos el boton de Object_Enable
			if (config.log.full) console.log("Editor.Update > UpdateState > label: ",MOB_label);
			Editor.UpdateState( MOB_label );

			if (config.log.full) console.log("Editor.Update > UpdatePreconfigs > label: ",MOB_label);
			Editor.UpdatePreconfigs( MOB_label );

			if (config.log.full) console.log("Editor.Update > UpdateState > label: ",MOB_label);
			UpdateScene( MOB_label );

			if (config.log.full) console.log("Editor.Update > deactivate parameters_side_*");
			for( var ObjectLabel in Editor.Objects ) {
				var psideWin = document.getElementById("parameters_side_" + ObjectLabel );
				if (psideWin) deactivateClass( psideWin, "parameters_side_MOB_selected");
			}

			if (config.log.full) console.log("Editor.Update > activate parameters_side_",MOB_label);
			var psideWin = document.getElementById("parameters_side_" + MOB_label );
			if (psideWin) activateClass( psideWin, "parameters_side_MOB_selected");
		},
		"UpdateState": function( MOB_label ) {

			if (config.log.full) console.log("Editor.UpdateState(",MOB_label,")");

			var objectState = Editor.States[MOB_label];
			var btn_OnOff = document.getElementById("button_object_onoff");

			if (btn_OnOff) {

				btn_OnOff.setAttribute("moblabel", MOB_label );

				if (config.log.full) console.log("MOB_label: ",MOB_label," objectState:",objectState );

				if ( objectState["activated"]==1 ) {

					if (config.log.full) console.log("Editor.UpdateState > btn_OnOff activated");
					activateClass( btn_OnOff, "button_object_onoff_on");

				} else {

					if (config.log.full) console.log("Editor.UpdateState > btn_OnOff deactivated");
					deactivateClass( btn_OnOff, "button_object_onoff_on");

				}

				btn_OnOff.setAttribute("moblabel", MOB_label );
			}
		},
		"UpdateEditorParam": function( MOB_label, fullparaminfo ) {
			//recorre el Editor > Parameters
			if (config.log.full) console.log("UpdateEditorParam > MOB_label: ", MOB_label, " fullparaminfo:",fullparaminfo);
			var Param = Editor.Parameters[MOB_label];

			var paramName = fullparaminfo["pdef"]["name"];
			Param[ paramName ] = fullparaminfo;
			ParamDef = Param[ paramName ]["pdef"];
			var ParamProperty = ParamDef["pr"];

			//buscar todos los parametros: (usando el id)
			var parameter_name_base = "parameter_group_"+MOB_label+"_"+paramName;
			var nPreconfigs = Options.GetMaxPreconfigs();

			for(var preconfigi=0; preconfigi<nPreconfigs; preconfigi++) {
				var paramid = parameter_name_base+"_"+preconfigi+"_";
				var elem = document.getElementById(paramid);
				if (elem) {
					elem.setAttribute("class", "parameter_group parameter_is_"+ParamProperty);
				}
			}
		},
		"UpdatePreconfigs": function( MOB_label ) {

			if (config.log.full) console.log("UpdatePreconfigs(",MOB_label,")");
			//global Elements
			var parameters_side_AllWin = document.getElementById("parameters_side");

			if (!parameters_side_AllWin)
				return console.error("UpdatePreconfigs > No parameters side where to place windows");
			else
				Editor.CreateParametersSideWindow( MOB_label, parameters_side_AllWin );
			/** changed Object, repopulate parameters!!! */
			Editor.selectEditorPreconfig( Editor.PreconfigSelected );

		},
		/**
			SET
			TODO: always select first parameter inspector!!
			TODO: in inspector always select first value...
		*/
		"selectEditorPreconfig": function( preconfig_index ) {
			try {
				if (config.log.full) console.log("selectEditorPreconfig > ", preconfig_index);

				if (Editor.ObjectSelected=="" || Editor.ObjectSelected==undefined) {
					alert("Atención! Seleccione un efecto antes de editar una preconfiguración.");
					return;
				}

				if (config.log.full) console.log("selectEditorPreconfig(",preconfig_index,")");

				Editor.PreconfigSelected = preconfig_index;
				Preconfs = Editor.Preconfigs[ Editor.ObjectSelected ];
				Editor.PreconfigsSelected[Editor.ObjectSelected] = preconfig_index;

				/* selectControlPreconfig */
				if (config.log.full) console.log("selectEditorPreconfig > Editor.ObjectSelected: ", Editor.ObjectSelected );
				Control.Functions.selectControlPreconfig( Editor.ObjectSelected, Editor.PreconfigSelected, true /*force select*/ );

				var parameters_side_winID = "parameters_side_"+Editor.ObjectSelected+"_";

				var CurrentPreconfig = Preconfs[preconfig_index];
				var win_Preconfigs = document.getElementById("object_preconfigs");
				var btn_Preconfig = document.getElementById("buttonED_"+(Number(Editor.PreconfigSelected)+1)+"_" );

				if (!win_Preconfigs) return console.error("Element object_preconfigs doesnt exists");

				var win_parameters_Preconfig = document.getElementById( parameters_side_winID+preconfig_index+"_" );
				if (!win_parameters_Preconfig) return console.error("selectEditorPreconfig > no " + parameters_side_winID+preconfig_index+"_");

				//reset classes DEACTIVATE
				var nPreconfigs = Options.GetMaxPreconfigs();
				for( var p=1;p<=nPreconfigs;p++) {

					//DEACTIVATE PRECONFIG SELECTOR
					if (win_Preconfigs) deactivateClass( win_Preconfigs, "object_preconfigs_" + p + "_" );

					//DEACTIVATE PRECONFIG SELECTOR BUTTONS
					btn_Preconfigx = document.getElementById("buttonED_"+p+"_" );
					if (btn_Preconfigx) deactivateClass( btn_Preconfigx, "circle_selected" );

					//DEACTIVATE PARAMETERS SIDE
					win_parameters_Preconfigx = document.getElementById( parameters_side_winID + (p-1) +"_" );
					if (win_parameters_Preconfigx) {
						deactivateClass( win_parameters_Preconfigx, "parameters_selected" );
					} else {
						if (config.log.full) console.log("selectEditorPreconfig > win_parameters_Preconfigx:",win_parameters_Preconfigx," null in ",Editor.ObjectSelected);
					}
				}
				var diA = document.getElementById("buttonED_ALL" );
        if (preconfig_index>=3) {
          $("#buttonED_ALL").html((Number(preconfig_index)+1));
          activateClass( diA, "circle_selected" );
        } else {
          $("#buttonED_ALL").html("N");
          deactivateClass( diA, "circle_selected" );
        }

				//ACTIVATE ACTUAL PRECONFIG WINDOWS,BUTTONS AND PARAMETERS SIDE
				//activate class for window
				if (win_Preconfigs) activateClass( win_Preconfigs, "object_preconfigs_" + (Editor.PreconfigSelected+1)+"_" );
				//activate class for circle button
				if (btn_Preconfig) activateClass( btn_Preconfig, "circle_selected" );
				//activate class for parameters side
				if (win_parameters_Preconfig) activateClass( win_parameters_Preconfig, "parameters_selected" );



				selectEditorParameter(Editor.PreconfigSelected);
				//LOAD IMAGE in canvas for this Preconfig
				//EN funcion de las imagenes que tenemos en ObjectImages generamos THUMBNAILS
				// aqui solo para 1
				if (hasParam(Editor.ObjectSelected, "texture"))
					selectEditorImage( Editor.ObjectSelected, "texture", Editor.PreconfigSelected );
				if (hasParam(Editor.ObjectSelected, "images"))
					selectEditorImage( Editor.ObjectSelected, "images", Editor.PreconfigSelected );

				if (hasParam(Editor.ObjectSelected, "sound"))
					selectEditorSound( Editor.ObjectSelected, "sound", Editor.PreconfigSelected );

				if (hasParam(Editor.ObjectSelected, "movies"))
					selectEditorMovie( Editor.ObjectSelected, "movies", Editor.PreconfigSelected );

				selectEditorColor( Editor.PreconfigSelected );

				if (CurrentPreconfig!=undefined) {
					if (config.log.full) console.log( "Preconfig selected: ",CurrentPreconfig );
				} else {
					console.error("selectEditorPreconfig > no preconfig for (MUST ADD PRECONFIG):", Editor.PreconfigSelected);
					moCI.AddPreconfig( Editor.ObjectSelected, Editor.PreconfigSelected );
				}
			} catch(err) {
				console.error("selectEditorPreconfig > ", err);
				alert("selectEditorPreconfig > "+ err);
			}
		},

		"showAllEditorPreconfigs": function() {

      $("#object_preconfigs_all").html("");
      var nPreconfigs = moCI.Options.GetMaxPreconfigs();
      for(var i=4; i<=nPreconfigs; i++) {
        //htmla+= '<button id="buttonED_'+i+'" title="Edit Preconfig '+i+'"  key="'+i+'" class="buttonED_'+i+' circle_button"></button>';
        var button = document.createElement("BUTTON");
        button.setAttribute("id","buttonED_"+i+"_");
        button.setAttribute("key",i);
        button.setAttribute("title","Edit Preconfig "+i);
        button.setAttribute("class","buttonED_"+i+" circle_button");
        button.addEventListener("click",function(event) {
          Editor.selectEditorPreconfig( event.target.getAttribute("key")-1 );
        });
        $("#object_preconfigs_all").append(button);
        button.innerHTML = i;
      }
      $("#object_preconfigs_all").toggle();


		},

		"showAllEditorPreconfigs": function() {

        $("#object_preconfigs_all").html("");
        for(var i=4; i<=moCI.Options["MAX_N_PRECONFIGS"]; i++) {
            //htmla+= '<button id="buttonED_'+i+'" title="Edit Preconfig '+i+'"  key="'+i+'" class="buttonED_'+i+' circle_button"></button>';
            var button = document.createElement("BUTTON");
            button.setAttribute("id","buttonED_"+i+"_");
            button.setAttribute("key",i);
            button.setAttribute("title","Edit Preconfig "+i);
            button.setAttribute("class","buttonED_"+i+" circle_button");
            button.addEventListener("click",function(event) {
              Editor.selectEditorPreconfig( event.target.getAttribute("key")-1 );
            });
            $("#object_preconfigs_all").append(button);
            button.innerHTML = i;
        }
        $("#object_preconfigs_all").toggle();

		},

		/**event)
		*	CreateParametersSideWindow
		*
		*	Create Parameters Side Window for this Moldeo Object ( identified by his label name: MOB_label )
		*
		*	@param MOB_label Moldeo Object Label Name (must be unique)
		*/
		"CreateParametersSideWindow": function( MOB_label, parameters_side_AllWin ) {

			if (config.log.full) console.log("CreateParametersSideWindow > ",MOB_label);
			// Check and create DIV "parameter_side_MOB_LABEL"

			var ret = false;
			var psideWin = document.getElementById("parameters_side_" + MOB_label );

			if (!psideWin) {
				if (config.log.full) console.log("CreateParametersSideWindow > Create Parameters Side for ",MOB_label);
				//FIRST TIME ALWAYS SET ON FIRST PRECONFIG
				Editor.PreconfigSelected = 0;
				//Create DIV "parameter_side_MOB_LABEL"
				psideWin = document.createElement("DIV");
				psideWin.setAttribute("id","parameters_side_"+MOB_label);
				psideWin.setAttribute("class", "parameters_side_MOB");
				psideWin.setAttribute("moblabel", MOB_label );

				if (psideWin) {
					parameters_side_AllWin.appendChild( psideWin );
					ret = Editor.CreateParametersSideWindowActions( MOB_label, psideWin );
					ret = ret && Editor.CreateParametersPreconfigWindows( MOB_label, psideWin );
				}

			}

			return ret;
		},
		"CreateParametersSideWindowActions": function( MOB_label, psideMobWin ) {
			if (config.log.full) console.log("CreateParametersSideWindowActions > ",MOB_label);

			var ret = false;
			var psideNameA = "parameters_side_" + MOB_label + "_actions";
			var psideWinActions = document.getElementById(psideNameA);

			if (psideWinActions==undefined) {
				psideWinActions = document.createElement("DIV");

				if (psideWinActions) {
					psideWinActions.setAttribute("id",psideNameA);
					psideWinActions.setAttribute("class", "parameters_side_MOB_actions");

					var actionUnpublished = document.createElement("button");
					actionUnpublished.setAttribute( "id", "action_param_"+MOB_label+"_unpublished");
					actionUnpublished.setAttribute( "class", "action_param_SHOW_ALL");
					actionUnpublished.setAttribute( "title", "Muestra todos los parámetros.");
					actionUnpublished.innerHTML = "++";
					//
					//var actionUp = document.createElement("button");
					//actionUp.setAttribute("class", "action_param_UP_ONE");
					//actionUp.innerHTML = "UP";

					//var actionDown = document.createElement("button");
					//actionDown.setAttribute("class", "action_param_DOWN_ONE");
					//actionDown.innerHTML = "DO";

					psideWinActions.appendChild(actionUnpublished);
					//psideWinActions.appendChild(actionUp);
					//psideWinActions.appendChild(actionDown);

					if (psideMobWin) {
						psideMobWin.appendChild( psideWinActions );
						ret = true;
					}

					//actionUnpublished.addEventListener( "click", Editor.Buttons["action_param_unpublished"]["click"]);
					actionUnpublished.addEventListener( "click", Editor.Buttons["action_param_unpublished"]["click"]);
				}

			}

			return ret;

		},
		"CreateParametersPreconfigWindows": function( MOB_label, psideWin ) {

			if (config.log.full) console.log("CreateParametersPreconfigWindows > ", MOB_label, " psideWin:",psideWin);
			if (!psideWin) return console.error("CreateParametersPreconfigWindows > no psideWin");
			var ret = false;

			var psideWinPreScroller = document.createElement("DIV");
			psideWinPreScroller.setAttribute("id","parameters_side_"+MOB_label+"_scroller");
			psideWinPreScroller.setAttribute("class","parameters_side_MOB_scroller scroll-pane");


			//scrollbar
			var psideWinPreScrollbar = document.createElement("DIV");
			psideWinPreScrollbar.setAttribute("id","parameters_side_"+MOB_label+"_scrollbar");
			psideWinPreScrollbar.setAttribute("class","parameters_side_MOB_scrollbar scrollbar");
			psideWinPreScroller.appendChild( psideWinPreScrollbar );
				//track
			var psideWinPreScrolltrack = document.createElement("DIV");
			psideWinPreScrolltrack.setAttribute("id","parameters_side_"+MOB_label+"_scrolltrack");
			psideWinPreScrolltrack.setAttribute("class","parameters_side_MOB_scrolltrack track");
			psideWinPreScrollbar.appendChild( psideWinPreScrolltrack );
				//thumb
			var psideWinPreScrollthumb = document.createElement("DIV");
			psideWinPreScrollthumb.setAttribute("id","parameters_side_"+MOB_label+"_scrollthumb");
			psideWinPreScrollthumb.setAttribute("class","parameters_side_MOB_scrolltrack thumb");
			psideWinPreScrolltrack.appendChild( psideWinPreScrollthumb );
				//end
			var psideWinPreScrollend = document.createElement("DIV");
			psideWinPreScrollend.setAttribute("id","parameters_side_"+MOB_label+"_scrollend");
			psideWinPreScrollend.setAttribute("class","parameters_side_MOB_scrolltrack end");
			psideWinPreScrollthumb.appendChild( psideWinPreScrollend );
				//viewport
			var psideWinPreScrollviewport = document.createElement("DIV");
			psideWinPreScrollviewport.setAttribute("id","parameters_side_"+MOB_label+"_scrollviewport");
			psideWinPreScrollviewport.setAttribute("class","parameters_side_MOB_scrollviewport viewport");
			psideWinPreScroller.appendChild( psideWinPreScrollviewport );
				//overview
			var psideWinPreScrolloverview = document.createElement("DIV");
			psideWinPreScrolloverview.setAttribute("id","parameters_side_"+MOB_label+"_scrolloverview");
			psideWinPreScrolloverview.setAttribute("class","parameters_side_MOB_scrollviewport overview");
			psideWinPreScrollviewport.appendChild( psideWinPreScrolloverview );

			psideWin.appendChild( psideWinPreScroller );

			/*
			FOR THREE FIRST PRECONFIGS create DIVS !!! class="parameters_side_MOB_preconf"
			Create DIV "parameter_side_MOB_LABEL_0/1/2" PRECONFIGS GROUPS (could be more!!!!)
			*/
			var nPreconfigs = moCI.Options.GetMaxPreconfigs();
			for( var preconfigi=0; preconfigi<nPreconfigs; preconfigi++ ) {

				var psideWinPre = document.createElement("DIV");
				psideWinPre.setAttribute("id","parameters_side_"+MOB_label+"_" + preconfigi+"_" );
				psideWinPre.setAttribute("class", "parameters_side_MOB_preconf");

				if (psideWinPre) psideWinPreScrolloverview.appendChild( psideWinPre );

				if (config.log.full) console.log("CreateParametersPreconfigWindows > CREATED parameters side for preconfig ",preconfigi," with id: ", "parameters_side_",MOB_label,"_",preconfigi+"_");

				/**Create DIVs for every published/grouped parameters*/
				var pgroup_object_base = "parameter_group_"+MOB_label;

				ret = true;
				/*
				//CHECK FOR EVERY PARAM GROUP DEPENDENCIES
				//SO WE CREATE THE BUTTONS REFERENCING THE INSPECTORS
				// IN "PARAMETER_INSPECTOR_SIDE"*/
				for( var param_name in Editor.Parameters[MOB_label] ) {

					var Param = Editor.Parameters[MOB_label][param_name];
					var ParamType = Param.pdef["t"];
					var ParamProperty = Param.pdef["pr"];
					var ParamValues = Param["pvals"];

					if (config.log.full) console.log("CreateParametersPreconfigWindows > PARAM: ",param_name," PRE:",preconfigi," INFO:",Param);

						/*CHECK IF this param is defined in any GROUP inspector*/
						if ( PrepareGroupParameters( MOB_label,  param_name ) ) {
							/*
							ret = ret && true;
							YES! SO WE WILL CREATE THE GROUP INSPECTOR AFTER THAT.... see: CreateGroupInspectors()
							*/
						} else if (param_name!=undefined && param_name!=false && param_name!="false") {

							if ( ParamType=="TEXTURE" &&
								( param_name=="texture" || param_name=="images") ) {

								CreateTextureParameter( MOB_label, param_name, preconfigi );
								CreateStandardParameter(MOB_label, param_name, preconfigi, psideWinPre );

							} else if ( ParamType=="TEXTURE" &&
								( param_name=="movies") ) {

								CreateMovieParameter( MOB_label, param_name, preconfigi, psideWinPre );
								CreateStandardParameter(MOB_label, param_name, preconfigi, psideWinPre );

							} else if (param_name=="sound" && ParamType=="SOUND") {

								CreateSoundParameter( MOB_label, param_name, preconfigi, psideWinPre );
								CreateStandardParameter(MOB_label, param_name, preconfigi, psideWinPre );

							} else if (ParamType=="TEXT"
								|| ParamType=="TEXTURE"
								|| ParamType=="SOUND"
								|| ParamType=="OBJECT"
								|| ParamType=="3DMODEL"
								|| ParamType=="NUM"
								|| ParamType=="FUNCTION"
								|| ParamType=="COLOR"
								|| ParamType=="ALPHA"
								|| ParamType=="SYNC"
								|| ParamType=="PHASE"
								|| ParamType=="BLENDING"
								|| ParamType=="TRANSLATEX"
								|| ParamType=="TRANSLATEY"
								|| ParamType=="TRANSLATEZ"
								|| ParamType=="ROTATEX"
								|| ParamType=="ROTATEY"
								|| ParamType=="ROTATEZ"
								|| ParamType=="SCALEX"
								|| ParamType=="SCALEY"
								|| ParamType=="SCALEZ")	{
								CreateStandardParameter(MOB_label, param_name, preconfigi, psideWinPre );
							}
						}

				}

				//ret = ret &&
				CreateGroupedParameters( MOB_label, preconfigi, psideWinPre );

			}

			$("#parameters_side_"+MOB_label+"_scroller").tinyscrollbar();
			return ret;
		}
	},


	/**
	*   CONNECTOR OBJECT
	*
	*   All members and functions related to the connections configuration of the moldeo objects and effects
	*
	*   TODO:
	*/
	Connectors: {

		"Objects": {

		},

		"Tree": {

		},
		"Buttons": {
			"connector_panel_close": {
				"click": function(event) {
					hidediv('connector_panel');
				},
			},
		},
		"Functions": {
			"ObjectsToTree": function() {
				var console_tree = {
					"type": "seccion",
					"wid": "",
					"name": "console",
					"children": [
						{
							"name": "devices",
							"type": "seccion",
							"wid": "devices",
							"order": 0,
							"children": [
							]
						},
						{
							"name": "preeffect",
							"type": "seccion",
							"wid": "preeffect",
							"order": 1,
							"children": [
							]
						},
						{
							"name": "effect",
							"type": "seccion",
							"wid": "effect",
							"order": 2,
							"children": [
							]
						},
						{
							"name": "posteffect",
							"type": "seccion",
							"wid": "posteffect",
							"order": 3,
							"children": [
							]
						},
						{
							"name": "mastereffect",
							"type": "seccion",
							"wid": "mastereffect",
							"order": 4,
							"children": [
							]
						},
						{
							"name": "resources",
							"type": "seccion",
							"wid": "resources",
							"order": 5,
							"children": [
							]
						},
					],
				};
                if (moCI.Project.config==undefined) return;
                if (moCI.Project.config.parameters==undefined) return;

				var preeffect = moCI.Project.config.parameters["preeffect"].pvals;
				var effect = moCI.Project.config.parameters["effect"].pvals;
				var posteffect = moCI.Project.config.parameters["posteffect"].pvals;
				var mastereffect = moCI.Project.config.parameters["mastereffect"].pvals;
				var resources = moCI.Project.config.parameters["resources"].pvals;
				//var devices = moCI.Project.config.parameters["devices"].paramvalues;
				/* TODO: do it right, searching full objects, with moldeo ids*/

				var moldeo_ids = 0;

				for( var group_i in console_tree.children  ) {

					var node = console_tree.children[group_i];
					var moldeo_objects_values = moCI.Project.config.parameters[ node.name ]["pvals"];

					for( var index in moldeo_objects_values  ) {

						var mob = moldeo_objects_values[index];

						MobDefinition = new moMobDefinition();
						MobDefinition.Init( mob[0].value, mob[1].value, mob[2].value, "moIODevice" );
						MobDefinition.MoldeoId = moldeo_ids;
						moldeo_ids++;
						node["children"].push(
							{
								"name": MobDefinition.MoldeoLabelName,
								"type": "obra",
								"order": index,
								"wid": MobDefinition.MoldeoId,
								"MobDefinition": MobDefinition,
								"children": [],
							}
						);
					}
				}
				moCI.Connectors.Tree = console_tree;
				if (config.log.full) console.log("ObjectsToTree", moCI.Connectors.Tree );

				moCI.Connectors.FRib = new FractalRibosome( moCI.Connectors.Tree, window.innerWidth, window.innerHeight,
							{
								'glowopacity': 0.2,/*0.3*/
								'glowscalexy': 1.0,/*1.03*/
								'glowduration': 2700, /*2700*/
								'showBox': false,
								'showVars': false,
								'showRiboline': true,
								'riboSteps': 4,
								'riboNoise': 0.3,
								'riboInterpolation': 'basis',

								'node_size': 'fixed',
								'node_size_base': 1.0,
								'node_size_fixed': false, /* true for Vainer */


								'node_position_mode': "linear",
								/*
								'node_position_radius': 200.0,
								*/
							});

				moCI.Connectors.FRib.Init( "connector_panel" );
			},
		},
		"Register": function() {
			if (config.log.full) console.log("RegisterConnectorButtons > all buttons with events");
			for( var button in Connectors.Buttons) {
				var dd = document.getElementById(button);
				for( var eventname in Connectors.Buttons[button]) {
					if (dd) dd.addEventListener( eventname, Connectors.Buttons[button][eventname]);
				}
			}
		},
	},

	/**
	*   SCENES OBJECT
	*
	*   All members and functions related to the Moldeo Scene objectss
	*
	*   TODO:
	*/
	Scenes: {
		"ObjectSelected": false,
		"ScenePreEffects": {},
		"SceneEffects": {},
		"ScenePostEffects": {},
		"SceneStates": {}
	},

	/**
	*   BROWSER OBJECT
	*
	*   All members and functions related to the project browser.
	*
	*   TODO:
	*/
	Browser: {
		"Projects": {
			/*"Recents": [],*/
			/*
			"Favorites": {},
			"MoldeoLab": {},
			"Samples": {},
			*/
		},
		"Textures": {
		},
		"Movies": {
		},
		"Sounds": {
		},
		"document": null,
		"winBrowser": null,
		"winVisible": true,
		"initialized": false,
		"OpenFile": function() {
			if (config.log.full) console.log("Browser::OpenFile > ");
			try {
			if ( moCI.Editor.SaveNeeded==true  ) {
				if (confirm( "Tiene cambios sin guardar. ¿Está seguro que quiere abrir otro proyecto? " )) {

				} else {
					if (config.log.full) console.log("Aborting browser opening...");
					return;
				}
			}

			var cfile = moCI.document.getElementById("openproject");

			if (cfile) {
				cfile.value = "";
				cfile.click();
			}
			} catch(err) {
				alert(err);
				console.error(err);
			}
		},
		"initBrowser": function() {
			if (config.log.full) console.log("initBrowser()");
			try {
				if (moCI.Browser.initialized) {
					if (config.log.full) console.log("initBrowser > already initialized. returning.");
					return;
				}
				if (moCI.Browser.winBrowser) {
					moCI.Browser.winBrowser.moCI = moCI;
					if (moCI.Browser.winBrowser.window) {
						moCI.Browser.winBrowser.window.moCI = moCI;
						moCI.Browser.winBrowser.window.opener = gui.Window.get();
						if (config.log.full) console.log(this);
						moCI.Browser.document = moCI.Browser.winBrowser.window.document;
						moCI.Browser.document.getElementById("close-window-button").onclick = function() {
							moCI.Browser.Close();
						}
					} else console.error("initBrowser > no .window");
					moCI.Browser.updateBrowser();
					moCI.Browser.initialized = true;
				} else {
					moCI.Browser.initialized = false;
				}
			} catch(err) {
				console.error("initBrowser:",err);
			}
		},
		"Open": function() {
			try {
				if (moCI.Browser.winBrowser==null) {
					moCI.Browser.winBrowser = gui.Window.open('MoldeoBrowser.html', config.browser_window_options );
					if (moCI.Browser.winBrowser) {
						if (config.log.full) console.log("moCI.Browser.Open > registering events.");
                        moCI.Browser.winBrowser.moveTo(win.x, win.y-330);
						moCI.Browser.winVisible	= true;
						//moCI.Browser.winBrowser.opener = gui.Window.get();
						moCI.Browser.winBrowser.on('loaded', moCI.Browser.initBrowser);
						//moCI.Browser.winBrowser.on('focus', moCI.Browser.initBrowser);
						moCI.Browser.winBrowser.on('closed', function() {
							console.log("Browser closed!");
							moCI.Browser.winBrowser = null;
							moCI.Browser.initialized = false;
						});
						moCI.Browser.winBrowser.on('close', function() {
							console.log("Browser closing!");
							moCI.Browser.winBrowser = null;
							moCI.Browser.initialized = false;
							this.close(true);
						});
						///*setTimeout( moCI.Browser.initBrowser, 1000 );*/

                        setTimeout( function() { if (moCI.Browser.winBrowser) moCI.Browser.winBrowser.focus(); }, 2000 );
					} else {
						console.error("moCI.Browser.Open > moCI.Browser.winBrowser NULL: ", moCI.Browser.winBrowser);
					}
				} else {
					if (config.log.full) console.log("Browser.Open() > just show it",moCI.Browser.winBrowser.window);

					if (moCI.Browser.winBrowser.window==undefined) {
						if (config.log.full) console.log("Browser.Open() > re-open");
						moCI.Browser.winBrowser.close(true);
						moCI.Browser.winBrowser = null;
						moCI.Browser.initialized = false;
						moCI.Browser.Open();
					}

					moCI.Browser.winVisible = !moCI.Browser.winVisible;
					var result = moCI.Browser.winBrowser.show( moCI.Browser.winVisible );

				}
			} catch(err) {
				console.error("Open:",err);
			}


		},
		"Close": function() {
			if (moCI.Browser.winBrowser == null) return;
			moCI.Browser.winVisible	= false;
			moCI.Browser.initialized = false;
			moCI.Browser.winBrowser.show( moCI.Browser.winVisible );
		},
		"scanProjectsFolder": function(base_folder) {
			//* check: https://nodejs.org/api/path.html*/

			if (config.log.full) console.log("loadBrowserFolder(",base_folder,") check https://nodejs.org/api/path.html");
			var bProjects = moCI.Browser.Projects;

			if (bProjects[base_folder]==undefined)
				bProjects[base_folder] = {};
			try {

        moCI.fs.mkdir( base_folder, function (err) {

          //if (err) console.error( "making dir: " + base_folder, err );
try {
//          moCI.fs.walk( base_folder, 0x0777, function( filepath, stat ) {
	        moCI.fs.walk( base_folder, 0x0777, function( filepath, stat ) {
              //console.log("walk call:", filepath);
              if (stat.isFile()) {
                //check if it's a .mol project
                var extension = path.extname(filepath);
                if (extension==".mol") {
                  if (config.log.full) console.log("walk call MOL found: base_folder:",base_folder," path:", filepath);
                  bProjects[base_folder][filepath] = false;
                }
              } else if(stat.isDirectory()) {
                //iterate or wait
                if ( filepath.indexOf("temp_render")>=0 )
                  return false;
                return true;
              }
              return false;
          });
} catch(err) {
				console.error("fswalk: ",err);
}


        } );

			} catch(err) {
				console.error("loadBrowserFolder: ",err);
				//alert(err);
			}
		},
		"createProjectItem": function( base_mol_file ) {
			if (config.log.full) console.log("createProjectItem > ",base_mol_file);
			var CIB = moCI.Browser;
			var broDOM = CIB.document;
			var molEle = broDOM.createElement("DIV");

			var preview_shot_url = false;
			var project_data_path = path.dirname( base_mol_file );
			var project_preview_path = project_data_path+"/previewshots";
			var project_previews = {};

			for( var i=0; i<4;i++) {
				var project_preview_shot = project_preview_path+"/preview_shot_000000"+i+".jpg";
				if (config.log.full) console.log("project_preview_shot:",project_preview_shot);
				project_previews[ project_preview_shot ] = false;
				if (moCI.fs.existsSync( project_preview_shot )) {
					preview_shot_url = project_preview_shot;
					project_previews[ project_preview_shot ] = true;
					if (config.log.full) console.log("project_preview_shot FOUND:",project_preview_shot);
					break;
				}
			}


			$(molEle).attr("class","browser_project");
			$(molEle).attr("mol",base_mol_file);
			$(molEle).attr("title",base_mol_file);
			molEle.project_previews = Object.create(project_previews);

			if (preview_shot_url) {
				preview_shot_url = preview_shot_url.replace(/\\/g, "/");
				if (config.log.full) console.log("preview_shot_url > ",preview_shot_url);
				molEle.setAttribute("style","background-image: url('file:///"+preview_shot_url+"');");
			}

			molEle.addEventListener( "click", function(event) {

				if (config.log.full) console.log("Browser.createProjectItem > click browser_project :", event);

				try {
					var ele = event.target;
					var ele_file = ele.getAttribute("mol");
					if (ele_file) {
						moCI.OpenProject( ele_file );
					} else {
						console.error("opening ele_file:",ele_file,event);
					}
				} catch(err) {
					alert(err);
					console.error("opening :",event);
				}

			});

			var molEleLabel = broDOM.createElement("LABEL");
			var bname = path.basename(base_mol_file);
			var dataname = path.basename( path.dirname( base_mol_file )) +" / "+bname;
			molEleLabel.setAttribute("class","project_label");
			molEleLabel.setAttribute("title",dataname);
			//molEleLabel.innerHTML = path.basename(base_mol_file);
			molEleLabel.innerHTML = bname;
			molEle.appendChild( molEleLabel );

			return molEle;
		},
		"createProjectFolderView": function( base_folder_path ) {
			var folderEle = undefined;

			try {
				//base
				var CIB = moCI.Browser;
				var broDOM = CIB.document;

				folderEle = broDOM.createElement("DIV");
				var base_id = md5(base_folder_path);
				if (config.log.full) console.log("createBrowserFolderView > ", base_folder_path );
				var bProjects = CIB.Projects;
				var bProjectsInFolder = bProjects[ base_folder_path ];


				folderEle.setAttribute("id","base_folder_" + base_id );
				folderEle.setAttribute("base_id",base_id);
				folderEle.setAttribute("class","browser_project_category closed");

                var numprojects = 0;
                if (bProjectsInFolder) {
                    numprojects = Object.keys(bProjectsInFolder).length;
                }

				//label
				var folderLabel = broDOM.createElement("LABEL");
				folderLabel.setAttribute( "base_id", base_id );
				folderLabel.setAttribute( "title", base_folder_path );
				folderLabel.setAttribute( "class", "category_folder_label" );
				folderLabel.innerHTML = path.basename(base_folder_path )+"   ("+numprojects+")";

				folderLabel.addEventListener( "click", function(event) {

					var CIB = moCI.Browser;
					var broDOM = CIB.document;
					var bid = event.target.getAttribute("base_id");
					var container_name_id = "base_folder_"+bid+"_container";
					//togglediv(  );
					if (config.log.full) console.log("folder id is:", "base_folder_" + bid );
					if (config.log.full) console.log("projects container id is:", container_name_id );

					$(broDOM.getElementById("base_folder_" + bid) ).toggleClass("closed");
					//$(broDOM.getElementsByClassName("browser_project_category") ).addClass("closed");
					//$(broDOM.getElementById("browser_panel") ).addClass("browser_selection");

				});

				folderEle.appendChild( folderLabel );

				//samples container
				var samplesContainer = broDOM.createElement("DIV");
				samplesContainer.setAttribute( "id", "base_folder_"+base_id+"_container" );
				samplesContainer.setAttribute( "class", "browser_project_category_container" );
				folderEle.appendChild( samplesContainer );

				//now feed with projects .mol
				if (base_folder_path=="Recents") {
					//its an array of ( [index] = molfile )
					for( var	base_mol_index=bProjectsInFolder.length-1,base_mol_file=bProjectsInFolder[base_mol_index];
								base_mol_index>=0 && base_mol_file;
								base_mol_index--,base_mol_file=bProjectsInFolder[base_mol_index] ) {
						var molEleProject = CIB.createProjectItem( base_mol_file );
						samplesContainer.appendChild( molEleProject );
					}
				} else {
					for( var base_mol_file in bProjectsInFolder ) {
						var molEleProject = CIB.createProjectItem( base_mol_file );
						samplesContainer.appendChild( molEleProject );
					}
				}
			} catch(err) {
				console.error("createProjectFolderView > ",err);
			}
			return folderEle;
		},
		"updateBrowser": function() {
			try {
				var CIB = moCI.Browser;
				var broDOM = CIB.document;
				if (config.log.full) console.log("updateBrowser() browser DOM: ", broDOM);
				if (broDOM==undefined) {
					console.error("updateBrowser() no browser DOM");
					return;
				}
				var browser_div = broDOM.getElementById("browser_panel");
				if (browser_div==undefined) {
					console.error("updateBrowser() no 'browser_panel'");
					return;
				}
				if (config.log.full) console.log("updateBrowser in: ", browser_div);

				var check_for = [ config.desktop_path, config.basic_path, config.sample_path, config.moldeouser_path ];

				/* SCAN FOLDERS */
				for( var i in check_for ) {
					var base_folder = check_for[i];
					//iterate over
					CIB.scanProjectsFolder( base_folder );
				}

				/* CREATE PROJECTS LAUNCHERS */
				var base_id = 0;
				for( var base_folder_name in CIB.Projects ) {

					var folderEle = CIB.createProjectFolderView( base_folder_name );
					base_id+= 1;
					browser_div.appendChild( folderEle );
				}

				/* LEAVE OPEN THE "RECENT" FOLDER */
				var categories = browser_div.getElementsByClassName("category_folder_label");
				if (categories.length) $(categories[0]).click();

			} catch(err) {
				console.error("updateBrowser() > error",err);
			}
		},
		"SaveRecents": function( filename ) {
			if (filename && moCI.Browser.Projects.Recents) moCI.Browser.Projects.Recents.push( filename );
			for( var mol_index in Browser.Projects.Recents ) {
				var recent_mol_file = Browser.Projects.Recents[mol_index];

			}
		},
		"Functions": {

		}
	},

	/**
	*   RENDER OBJECT
	*
	*   All members and functions related to the rendering process.
	*
	*   TODO:
	*/
	Render: {
		"document": null,
		"winRender": null,
		"renderOptions": null,
		"initialized": false,
		"Open": function( options ) {
			moCI.Render.renderOptions = options;
			if (moCI.Render.winRender==null) {

				moCI.Render.winRender = gui.Window.open('MoldeoRender.html', {
					icon: "moldeocontrol.png",
					focus: true,
					toolbar: false,
					frame: true,
					width: win.width,
					height: 200,
					position: "center",
				});
				if (moCI.Render.winRender) {
					moCI.Render.winRender.moveTo(win.x, win.y-230);
					moCI.Render.winRender.moCI = moCI;
					moCI.Render.winRender.on('loaded', function() {
						moCI.Render.document = moCI.Render.winRender.window.document;
						moCI.Render.initialized = true;
						moCI.Render.renderOptions["stdout_stream"].resume();
					});
					//moCI.Browser.winBrowser.on('focus', moCI.Browser.initBrowser);
					moCI.Render.winRender.on('closed', function() {
						console.log("Render closed!");
						moCI.Render.winRender = null;
						moCI.Render.initialized = false;
					});
					moCI.Render.winRender.on('close', function() {
						console.log("Render closing!");
						moCI.Render.winRender = null;
						moCI.Render.initialized = false;
						this.close(true);
					});
				}
			}
		},
		"ShowVideo": function(error) {
			if (error==false) {
				alert("La grabación finalizó correctamente.");
				moCI.Render.winRender.close();
			} else {
				alert("La grabación NO finalizó. Revise el script, o ");
				return false;
			}
			var cfile = moCI.document.getElementById("saveasvideo");
			//moCI.Render.renderOptions
			try {
				if (cfile) {
					cfile.value = "";
					cfile.click();
				}
			} catch(err) {
				alert(err);
				console.error(err);
			}
		},
		"SaveAsVideo": function( filename ) {
			//moCI.Render.renderOptions
			console.log("SaveAsVideo > filename: ", filename);

			try {
				var vcontainer = moCI.Render.renderOptions["videocontainer"];
				var fullvideoname = moCI.Render.renderOptions["fullvideoname"];
				if ( isNaN(filename.indexOf( "." + vcontainer )) )
					filename+= "." + vcontainer;

				fs.copyFile( fullvideoname, filename, function(err) {
					if (err) {
						alert(err);
						console.error("SaveAsVideo > filename: ",filename, err);
					} else {
						alert("Video copiado a :" + filename );
					}
				} );
			} catch(err) {
				alert(err);
				console.error("SaveAsVideo > filename: ",filename, err);
			}
		},
	},

	mapSelectionsObjects: {
	},

	mapSelectionsObjectsByLabel: {

	},

	/**GENERAL CONSOLE FUNCTIONS*/
	"UpdateState": function( info ) {

		moCI.State = info;

		if (moCI.State==undefined) return;
		if (config.log.full) console.log("moCI.UpdateState > "+info);
		if (moCI.State["effectstate"]["tempo"]) {
			if (config.log.full) console.log("moCI.State[effectstate][tempo]:" + moCI.State["effectstate"]["tempo"]);

			var gtimerstate = moCI.State["effectstate"]["tempo"]["globaltimer_state"];
			var gtimerclock = moCI.State["effectstate"]["tempo"]["globaltimer_duration"];

			if (config.log.full) console.log("moCI.UpdateState: gtimerstate:" + gtimerstate + " gtimerclock:" + gtimerclock );

			var bENTER = document.getElementById("button_ENTER");
			var button_classes = { "playing": "button_PAUSE", "stopped": "button_ENTER", "paused": "button_ENTER" }

			if (bENTER && gtimerstate) {
				bENTER.setAttribute("class",button_classes[gtimerstate]+" special_button");
			} else {
				console.error("NO button_ENTER for PLAY action or no 'globaltimer_state/duration' received.");
			}
		}

		if ( moCI.State.mode=="rendersession" ) {
			document.getElementById("button_RECORD").setAttribute("class","button_RECORD_on special_button");
		} else {
			document.getElementById("button_RECORD").setAttribute("class","button_RECORD special_button");
		}

	},
	"UpdateConsole": function( target, info ) {

		if (this.Log)
			if (config.log.full) console.log( "moCI.UpdateConsole() > info: ",info );

		if (target=="__console__")
			if (config.log.full) console.log("OK: __console__ info message: ", info );
		if (info==undefined) return;

		moCI.Project = info;
		moCI.mapSelectionsObjectsByLabel = {};
		moCI.mapSelectionsObjects = {};
/*
		if (moCI.Project.MapEffects==undefined) return;

		for(var label in moCI.Project.MapEffects) {
			keyname = moCI.Project.MapEffects[label];

			if (moCI.mapSelectionsObjectsByLabel)
				moCI.mapSelectionsObjectsByLabel[ label ]  = keyname;

			if (keyname!="" && moCI.mapSelectionsObjects)
				moCI.mapSelectionsObjects[ keyname ] = label;
		}
*/
		if (moCI.Project.MapObjects==undefined) return;

		for(var label in moCI.Project.MapObjects) {
			keyname = moCI.Project.MapObjects[label]['key'];
			name = moCI.Project.MapObjects[label].name;

			if (moCI.mapSelectionsObjectsByLabel)
				moCI.mapSelectionsObjectsByLabel[ label ]  = keyname;

			if (keyname!="" && moCI.mapSelectionsObjects)
				moCI.mapSelectionsObjects[ keyname ] = label;
		}


		RegisterAllButtonActions();

		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolegetstate', 'val1': '__console__' } );

		//if (moCI.Project["
		//.setAttribute("class","button_PAUSE special_button");

		//update every object states
		/*
		for(var label in moCI.Project.MapEffects) {
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectgetstate', 'val1': label } );
		}
		*/
		for(var label in moCI.Project.MapObjects) {
			var MOB = moCI.Project.MapObjects[ label ];
			if (MOB.cfg) MOB.configname = MOB['cfg'];
			if (MOB.key) MOB.keyname = MOB['key'];
			if (MOB.cla) MOB.classname = MOB['cla'];

			if (	MOB.classname.indexOf("Effect")>0 ) {
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'effectgetstate', 'val1': label } );
			} else
			if (	MOB.classname=="moResource"
					|| MOB.classname=="moIODevice") {
				OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectgetstate', 'val1': label } );
			}

			if (MOB.keyname=="") {
			}

		}

		moCI.Control.Functions.ObjectsToProjectPanel( moCI.Project );

		moCI.Connectors.Functions.ObjectsToTree();

	},
	"OpenProject": function( filename ) {
		moCI.filename = ' -mol "'+filename+'" ';
		//filename = filename.replace( /\'/g , '"');
		//filename = filename.replace( /\\/g , '\\\\');

		console.log( "OpenProject:" , moCI.filename);

		moCI.launchPlayer( moCI.filename );

		moCI.Browser.SaveRecents( filename );
		moCI.ReloadInterface();
	},
	"Save": function() {
		if (config.log.full) console.log("buttonED_Presentation > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesave', 'val1': '' } );
	},
	"SaveProjectAs": function( filename ) {
		//must clone!!! Use moDataManager::Export function...
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolesaveas', 'val1': filename } );
	},
	"SaveScreenshotAs": function( screenshot, filename ) {
		console.log("screenshot:",screenshot," filename:",filename);
		try {
			fs.copyFile( screenshot, filename, function(err) {
				if (err) {
					console.error("fs.copyFile ERROR: ", err);
				} else {
					if (config.log.full) console.log("fs.copyFile OK!");
				}
			} );
		} catch(bigerr) {
			alert("Error copiando captura, intente de nuevo."+bigerr);
		}
	},
	"RecordSession": function( info ) {
		console.log("Record Session");
		console.log("Record Session", info);
		moCI.UpdateState( info );
	},
	"RenderSession": function( info ) {
		console.log("Render Session", info );
		//$("#button_RECORD").toggleClass("button_RECORD_on");
		moCI.UpdateState( info["consolestate"] );

		if (info["consolestate"].mode=="live") {
			config.render.session = info["session"];

			//finaliza el render mostrando una ventana para elegir el codec para el video
			var comments = '<span>Seleccionar formato del video:</span>'+moCI.CodecSelect();
			showModalDialog( 	"Choose Video Format",
								comments,
								{
									"buttons": {
										"OK": {
											"class": "modal-button",
											"return": true,
										},
										"CANCEL": {
											"class": "modal-button",
											"return": false,
										},
									}
								},
								function(result) {
									if (result=="true" || result==true) {
										moCI.PrepareAndRenderVideo();
									}
								});
		}
	},
	"PrepareAndRenderVideo": function() {
		try {
			console.log("PrepareAndRenderVideo > ");

			var videoname = "tmp_video";
			var container_codec = document.getElementById("render_video_info_container_codec");
			var videocontainer_codec = container_codec.options[container_codec.selectedIndex].value;
			var arx = videocontainer_codec.split(" codec:");
			var videocontainer = arx[0];
			var videocodec = arx[1];

			console.log("PrepareAndRenderVideo > Rendering in "+videoname+" codec ("+videocodec+")");

			//moCI.Project.datapath+"/temp_render" + XXXX
			frame_path = config.render.session["rendered_folder"];
			frame_path = frame_path.replace(/\\\\/g, "/" );
			frame_path = frame_path.replace(/\\/g, "/" );

			moCI.RenderVideo( frame_path, videocontainer, videocodec, videoname );

		} catch(err) {
			if (moCI.console) moCI.console.error(err);
			alert(err);
		}
	},
	"RenderVideo": function( frame_path, videocontainer, videocodec, videoname ) {
		console.log("RenderVideo:",frame_path,videocontainer,videocodec,videoname,config.platform);

		//Render Options
		var rOptions = {
            "GSTBIN": config.gstreamer.GSTBIN,
            "GSTLAUNCH": config.gstreamer.GSTLAUNCH,
            "COLORFILTER": config.gstreamer.COLORFILTER,
			"frame_path": frame_path,
			"videoname": videoname,
			"videocontainer": videocontainer,
			"videocodec": videocodec,
			"platform": config.platform,
			"full_call":  "",
			"rendered_folder": config.render.session["rendered_folder"],
			};
		var rvideoplat = config.render_video_pipes[ config.platform ];

		if (rvideoplat) {
			rOptions["full_call"] = rvideoplat[rOptions["videocontainer"]];
			if (rOptions["full_call"])
				rOptions["full_call"] = rOptions["full_call"][rOptions["videocodec"]];
			else return false;
		} else return;
		if (rOptions["full_call"]=="") {
			alert("No gstreamer pipeline prepared for codec:"+rOptions["videocodec"] );
			return false;
		}
		//video in same folder!!
		rOptions["videoname"] = rOptions["frame_path"]+"/"+rOptions["videoname"];
		rOptions["fullvideoname"] = rOptions["videoname"]+"."+rOptions["videocontainer"]

        rOptions["full_call"] = rOptions["full_call"].replace("{GSTBIN}", rOptions["GSTBIN"] );
        rOptions["full_call"] = rOptions["full_call"].replace("{GSTLAUNCH}", rOptions["GSTLAUNCH"] );
        rOptions["full_call"] = rOptions["full_call"].replace("{COLORFILTER}", rOptions["COLORFILTER"] );
		rOptions["full_call"] = rOptions["full_call"].replace("{VIDEONAME}", rOptions["videoname"] );
		rOptions["full_call"] = rOptions["full_call"].replace("{FRAMEPATH}", rOptions["frame_path"] );
		if (rOptions["H264ENCODE"]) {
			if (rOptions["H264ENCODE"][config.platform]) {
				if (rOptions["H264ENCODE"][config.platform]["normal"])
					rOptions["full_call"] = rOptions["full_call"].replace("{H264ENCODE}", rOptions["H264ENCODE"][config.platform]["normal"] );
				if (rOptions["H264ENCODE"][config.platform]["low"])
					rOptions["full_call"] = rOptions["full_call"].replace("{H264ENCODE_LOW}", rOptions["H264ENCODE"][config.platform]["low"] );
				if (rOptions["H264ENCODE"][config.platform]["high"])
					rOptions["full_call"] = rOptions["full_call"].replace("{H264ENCODE_HIGH}", rOptions["H264ENCODE"][config.platform]["high"] );
			}
		}
		//fs.write("render_video.bat");
		console.log("full_call:",rOptions["full_call"]);

		launchRender( rOptions["full_call"], rOptions );

	},
	"CodecSelect": function() {
		/**/
		var rvideoplatform = config.render_video_pipes[config.platform];
		var wini_container_codec = document.createElement("SELECT");
		$(wini_container_codec).attr("id","render_video_info_container_codec");

		for( var container in rvideoplatform ) {

			var codecs = rvideoplatform[ container ];

			for( var codec in codecs ) {

				videocontainer_codec = container+" codec:" + codec;

				var option = document.createElement("option");
				option.setAttribute("value", videocontainer_codec );
				option.innerHTML = videocontainer_codec;
				wini_container_codec.appendChild( option );
			}
		}
		return wini_container_codec.outerHTML;
	},
	"QualitySelect": function() {
		var select = '<span>Select frame quality</span><select id="quality_select" title="Quality Select">';
		for( var str in config.render.frame_qualities) {
			var option = config.render.frame_qualities[str];
			selected = "";
			if (option) {
				if (option==config.render.frame_quality) selected = "selected";
				select+= '<option value="'+option+'" '+selected+'>'+str+'</option>';
			}
		}
		select+= "</select>";
		return select;
	},
	"Presentation": function() {
		if (config.log.full) console.log("buttonED_Presentation > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepresentation', 'val1': '' } );
	},
	"Screenshot": function() {
		if (config.log.full) console.log("buttonED_Screenshot > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolescreenshot', 'val1': '' } );
	},
	"PreviewShot": function() {
		if (config.log.full) console.log("buttonED_PreviewShot > ");
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'consolepreviewshot', 'val1': '' } );
	},
	"GetValuesToStr": function( moblabel, paramName, preconfig) {
		var data = '';
		var coma = '';
		var Params = moCI.GetParams( moblabel );
		if (Params==undefined) return false;

		var Param = Params[ paramName ];
		if (Param==undefined) return;
		var paramValue = Param["pvals"][preconfig];
		if (paramValue && paramValue.length) {
			for(var sub=0; sub<paramValue.length; sub++) {
				var valuedef = paramValue[sub]["d"];
				data+= coma+paramValue[sub]["v"];
				coma = ",";
			}
		}
		return data;
	},

	/**
	* TOOLS:

	*	retreive "paramvalues"
	*/
	"GetParamValues": function( moblabel, paramName, preconfig ) {

		var Params = moCI.GetParams( moblabel );
		if (Params==undefined) return false;

		var Param = Params[ paramName ];
		if ( Param == undefined) return false;
		if ( Param["pvals"]==undefined ) return false;

		var pvals = Param["pvals"][preconfig];
		if ( pvals )
			return pvals

		return false;

	},
	/**
	*	Retreive Parameters object of a Moldeo Object named [moblabel]
	*/
	"GetParams": function( moblabel ) {
		return Editor.Parameters[moblabel];
	},
	// Save preconfig for moblabel
	"MemorizePreconfigSelection": function( moblabel, preconfig ) {
		Editor.PreconfigsSelected[ moblabel ] = preconfig;
	},
	// Get last preconfig for moblabel
	"RememberPreconfigSelection": function( moblabel ) {
		return Editor.PreconfigsSelected[ moblabel ];
	},
	// Set the inspector htmlElement with attributes so it can inspect the Object:
	// moblabel and preconfig
	"SubscribeInspectorToMob": function( inspEle, moblabel, preconfig ) {

		//SET inspectorElement with attributes: moblabel // preconfig
		if (inspEle && moblabel && preconfig>=0) {

			inspEle.setAttribute("moblabel", moblabel);
			inspEle.setAttribute("preconfig", preconfig );

			//remember the preconfig selection!
			moCI.MemorizePreconfigSelection( moblabel, preconfig );
		}

	},

	"checkWritePermission": function( callback ) {
		try {
			var fd = fs.openSync( moCI.Project.datapath+"/._test_dummy","w+" );
			fs.writeSync( fd, "testing dummy" );
			fs.closeSync( fd );
		} catch(err) {
			console.error(err);
			//alert(err);
			if (callback) callback( false );
			return;
		}

		var fd = fs.unlinkSync( moCI.Project.datapath+"/._test_dummy" );

		if (callback) callback( true );
	},

	"AddValue": function( moblabel, param, preconfig, value ) {
		if (config.log.full) console.log("AddValue: moblabel:",moblabel, "param:",param, "preconfig:",preconfig,"value:",value );
		Editor.SaveNeeded = true;
		if (value==undefined) {
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'valueadd', 'val1': moblabel, 'val2': param, 'val3': preconfig } );
		} else {
			OscMoldeoSend( { 'msg': '/moldeo','val0': 'valueadd', 'val1': moblabel, 'val2': param, 'val3': preconfig, 'val4': value } );
		}
		if (Editor.SaveNeeded) {
			activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
			activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		}
	},
	"AddPreconfig": function( moblabel, preconfig ) {
		if (config.log.full) console.log("AddPreconfig: moblabel:",moblabel, "preconfig:",preconfig );
		Editor.SaveNeeded = true;
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigadd', 'val1': moblabel, 'val2': preconfig } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'preconfigset', 'val1': moblabel, 'val2': preconfig } );
		OscMoldeoSend( { 'msg': '/moldeo','val0': 'objectget', 'val1': moblabel } );
		if (Editor.SaveNeeded) {
			activateClass( document.getElementById("buttonED_SaveProject"), "saveneeded" );
			activateClass( document.getElementById("buttonED_SaveProjectAs"), "saveneeded" );
		}
	},
	"ReloadInterface": function() {
		if (moCI.Browser.winBrowser)
			moCI.Browser.winBrowser.close();

		if (config.log.full) console.log("Console::ReloadInterface()",win);
		//setTimeout( function() { win.reloadDev(); }, 2000 );
	},
	"launchPlayer": launchPlayer,
	"fs": fs,
	"console": console,
};

var MCI = ConsoleInterface;
MCI.document = document;
var moCI = MCI;
/** SHORTCUTS */
var Player = moCI.Player;
var Browser = moCI.Browser;
var Connectors = moCI.Connectors;
var Options = moCI.Options;
var Control = moCI.Control;
var Editor = moCI.Editor;
var Scenes = moCI.Scenes;

var sliderMessages = {
	'channel_alpha': {
		'osc': '{ "msg": "/moldeo","val0": "effectsetstate", "val1": "moblabel", "val2": "alpha", "val3": msgvalue }',
		'divisor' : 100.0
	},
	'channel_tempo': {
		'osc': '{ "msg": "/moldeo","val0": "effectsetstate", "val1": "moblabel", "val2": "tempo", "val3": msgvalue }',
		'divisor': 50.0
	}
};

