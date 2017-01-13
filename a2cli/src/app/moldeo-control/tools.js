/**

	Utility tools (moldeo independent)

*/


var fs = require('fs');
var path = require('path');
var moment = require('moment');
var gui = require('nw.gui');
var today = moment();
var execFile = require('child_process').execFile,
exec = require('child_process').exec,
spawn = require('child_process').spawn,
child;

fs.copyFile = function(source, target, cb) {

  if (config.log.full) console.log("called fs.copyFile from source: " + source + " to:" + target + " cb:" + cb);

  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      if (cb!=undefined) cb(err);
      cbCalled = true;
    }
  }
}


callProgram = function( programrelativepath, programarguments, callback ) {
	try {
		moCI.console.log("Call Program: programrelativepath:",programrelativepath
					," programarguments:",programarguments );


		child = exec( programrelativepath + " "+ programarguments,
			function(error,stdout,stderr) {

				//alert(stdout);

				if (error) {
					//console.log(error.stack);
					//console.log('Error code: '+ error.code);
					//console.log('Signal received: '+
					//error.signal);
				}
				//console.log('Child Process stdout: '+ stdout);
				//console.log('Child Process stderr: '+ stderr);
				if (callback) {
					callback(error,stdout,stderr);
				}
			}
		);

		child.on('exit', function (code) {
			//moCI.console.log('Child process exited '+'with exit code '+ code);
		});

		programarguments = programarguments.trim();
		var args = programarguments.split(" ");
		moCI.console.log("Program:",programrelativepath," args:",args);

		//child = spawn( programrelativepath, []);

		//child.unref();
	} catch(err) {
		moCI.console.error("callProgram > ", err);
		alert(err);
	}
}

launchFile = function( file_open_path ) {

	moCI.console.log("Launching file:" + file_open_path );

	callProgram( file_open_path );

}

launchPlayer = function( project_file ) {
	if (config.player_full_path==undefined || config.player_full_path=="") {
		moCI.console.error("launchPlayer > config.player_full_path is undefined");
		return false;
	}
	moCI.console.log("launchPlayer > player_full_path:",config.player_full_path," project_file:",project_file );

	return callProgram( '"'+config.player_full_path+'"', project_file, function(error,stdout,stderr) {
		//console.log("Calling callback for: project_file: " + project_file);
		if (error) {
			moCI.console.error(error);
		}
	} );

}

launchRender = function( render_call, options ) {

	console.log("launchRender: ", render_call);

	if (options=="" || options==undefined) options = {};

	options["render_call"] = render_call;
	options["bash_render_call"] = "";

	try {

		if (config.platform.indexOf("win")==0) {
			options["bash_render_call"] = config.home_path+"/render_video.bat";
		} else if (config.platform=="linux") {
			options["bash_render_call"] = config.home_path+"/render_video.sh";
		} else if (config.platform=="mac" || config.platform=="osx" || config.platform.indexOf("darwin")>=0) {
			options["bash_render_call"] = config.home_path+"/render_video.sh";
		} else {
			alert("platform not recognized:"+config.platform);
			return false;
		}

		fd = fs.openSync( options["bash_render_call"],"w" );
		fs.writeSync( fd, options["render_call"] );

		if (config.platform=="linux" || config.platform=="mac" || config.platform=="osx" || config.platform.indexOf("darwin")>=0) {
			fs.chmodSync( options["bash_render_call"], 0755);
		}
		fs.closeSync(fd);

		var renderprocess = spawn( options["bash_render_call"], []);

		console.log( "stream stdout:",renderprocess.stdout );

		renderprocess.stdout.setEncoding('ascii');
		renderprocess.stdout.pause();
		renderprocess.stdout.on('data', function(data) {
			if (data) {
				moCI.console.log( data, moCI.Render  );
				if (moCI.Render.document==null) {
					if (moCI.Render.winRender.window) {
						moCI.Render.document = moCI.Render.winRender.window.document;
					}
				}
				if (moCI.Render.document && moCI.Render.initialized) {
					var logarea = moCI.Render.document.getElementById("logarea");
					if (logarea) {
						logarea.innerHTML+= data;
						logarea.scrollTop = logarea.scrollHeight
					}
				}
			}
		});

		// add an 'end' event listener to close the writeable stream
		renderprocess.stdout.on('end', function(data) {
			if (data) {
				moCI.console.log( data );
			}
			moCI.console.log("renderprocess end stream!");
			var logarea = moCI.Render.document.getElementById("logarea");
			var error = 0;
			if (logarea) {
				if (logarea.innerHTML.indexOf("ERROR")>=0) {
					error = true;
				}
			}
			moCI.Render.ShowVideo(error);
		});
		// when the spawn child process exits, check if there were any errors and close the writeable stream
		renderprocess.on('exit', function(code) {
			if (code != 0) {
				moCI.console.log('renderprocess Failed: ' + code);
			}

			moCI.console.log('renderprocess exited with code: ',code);
		});

		options["stdout_stream"] = renderprocess.stdout;

		moCI.Render.Open( options );
		/*
		return moCI.fs.callProgram( new_render_call, options, function(error,stdout,stderr) {
			//console.log("fs.launchRender > Calling callback for: project_file");
			if (error) {
				alert("No se pudo ejecutar el script de rendereo.");
				moCI.console.error(error);
			}
			if (stdout) {
				moCI.console.log(stdout);
			}
		} );
		*/
	} catch(err) {
		alert(err);
		console.error("launchRender > ",render_call,err);
	}
}

function OpenExternalPage( URL ) {
	try {
		gui.Shell.openExternal(URL);
	} catch(err) {
		console.error(err);
	}
}

fs.walk = function (currentDirPath, permissions, callback) {
//return;
    moCI.fs.readdirSync(currentDirPath).forEach(function(name) {
      try {
            if (name.indexOf(".")==0) return;
            var filePath = path.join(currentDirPath, name);
            var stat = moCI.fs.statSync(filePath);
            console.log( "currentDirPath:",currentDirPath, "name:",name );
            if (stat.isFile() && callback) {
                console.log( "filePath:",filePath,"stat:",stat," is a FILE! callback:",(callback!=undefined) );
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                console.log( "filePath:",filePath,"stat:",stat," is a DIRECTORY! callback:",(callback!=undefined) );

          if (callback) {
            if ( callback(filePath, stat) && moCI.fs.walk ) {
              moCI.fs.walk(filePath, permissions, callback );
            }
          }
            }
      } catch(err) {
        //alert("fs.walk:", err);
        console.log("fs.walk: ", err);
      }
    });
}


/*
var combinationStates = {
	"fxselected",
	"object_enabled"
};

function recombineClasses( element ) {

	if (	classActivated("fxselected")
			&&
			classActivated("object_enabled")) {
		activateClass("object_enabled_selected");
	}
}
*/
if (error==undefined) {
	function error(msg) {
		console.error("--ERROR-- ",msg );
	}
}

function activateClass( element, class_name, trigger_time, trigger_callback  ) {

	if (!element) return error("activateClass() > Element not defined: " + element + " class_name:" + class_name );

	var actual_class = element.getAttribute("class");

	if (actual_class) {
			var is_on = (actual_class.indexOf(class_name)>=0);
			if (!is_on) {
				element.setAttribute( "class", actual_class+" "+class_name );
			}
	} else element.setAttribute( "class", class_name );

	if (trigger_callback) setTimeout( trigger_callback, trigger_time );

}

var elementclassError;
function classActivated( element, class_name ) {
	if (!element) return console.error("classActivated() > Element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	//console.log("actual_class:"+actual_class);
	if (actual_class!=undefined && actual_class!="") {
		var is_on = (actual_class.indexOf(class_name)>=0);
		return is_on;
	}
	return false;
}

function deactivateClass( element, class_name, trigger_time, trigger_callback  ) {
	if (!element) console.error("element not defined: " + element + " class_name:" + class_name );
	var actual_class = element.getAttribute("class");
	if (actual_class) {
			var position = actual_class.indexOf(class_name);
			var is_on = (position>=0);
			if (is_on) {

				if (position==0)/*is first*/
						actual_class = actual_class.replace( new RegExp(class_name,"g"), "" );
				else
				if( (position+class_name.length)==actual_class.length) /*is last*/
						actual_class = actual_class.replace( new RegExp(" "+class_name,"g"), "" );

				actual_class = actual_class.replace( new RegExp(" "+class_name+" ","g"), " " );
				element.setAttribute( "class", actual_class );
				if (console.log.full) console.log( "actual_class: " + actual_class );
			}
	} else element.setAttribute( "class", class_name );

	if (trigger_callback) setTimeout( trigger_callback, trigger_time );

}



function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function rgbToHex2(rgb){
	return '#' + ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showdiv( ID ) {
	var el = document.getElementById(ID);
	if (el) {
		el.style.display = 'block';
	} else alert( "div undefined: "+ID );
}

function hidediv( ID ) {
	var el = document.getElementById(ID);
	if (el) {
		el.style.display = 'none';
	} else alert( "div undefined: "+ID );
}

function togglediv( ID ) {
	var el = document.getElementById(ID);
	if (el.style.display == 'block') {
		el.style.display = 'none'
	} else {
		el.style.display = 'block'
	}
}


/**
showModalDialog( title, message, options, callback )
options = {
			"events": {
				"hide.bs.modal": callback,
			}
			"buttons": {
				"OK": { "class": "modal-button", "return": true, "events":  { "click": function( event) {
																return event.target.getAttribute("return");
																},},
				"NO": { "class": "modal-button", "return": false },
			},
			"fields": {
				"inputtext1": {
					"type": "textarea",
				},
				"parameterx": {
					"type": "input",
				}
			},
		}
*/


function showModalDialog( title, message, options, callback ) {

	var modaldialog = '<div id="dialogModal" class="modal modal-moldeocontrol fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Moldeo </h4></div><div class="modal-body"><p>Some text in the modal.</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button></div></div></div></div>';

	var eleDlg = document.getElementById("dialogModal");
	if (eleDlg) eleDlg.parentNode.removeChild(eleDlg);
	var body = $("body");//.remove(eleDlg);
	var eleDlg = document.createElement("div");
	eleDlg.innerHTML = modaldialog;
	$("body").prepend(eleDlg);

	if ($("#dialogModal")) {
		$("#dialogModal .modal-title")[0].innerHTML = title;
		$("#dialogModal .modal-body")[0].innerHTML = message;
		if (options && options.buttons) {
			$("#dialogModal .modal-footer")[0].innerHTML = "";

			for( var butid in options.buttons ) {
				var oBut = options.buttons[ butid ];
				var btn = document.createElement("button");
				btn.setAttribute("class","btn btn-default");
				btn.setAttribute("return", oBut.return );
				btn.setAttribute("data-dismiss","modal");
				btn.innerHTML = butid;
				footer = $("#dialogModal .modal-footer")[0];
				if (footer.appendChild) {
					footer.appendChild( btn );
				}

				if (oBut.events) {
					for( var evname in oBut.events) {
						var ev_function = oBut.events[evname];
						btn.addEventListener( evname, ev_function );
					}
				}

				btn.addEventListener( "click", function( event) {
											$("#dialogModal").attr( "return", event.target.getAttribute("return") );
										} );

			}

		}
		$("#dialogModal").on( "hide.bs.modal", function() {
			if (callback) {
				callback( $("#dialogModal").attr("return") );
			}
		} );
		$("#dialogModal").modal({
									'show': true, /* show the modal dialog*/
									'backdrop': true, /* Click in background close the modal*/
									'keyboard': true,/*ESC close the modal*/
									'remote': '',/* remote loading of page content*/
								  });
	}

}


var multiplexhrs = new Array();
var idxhrs = 0;


function getXhr()
{
	if(window.XMLHttpRequest) {
		multiplexhrs[idxhrs] = new XMLHttpRequest();
		idxhrs++;
	    return (idxhrs-1);
	} else if(window.ActiveXObject) {

	  	try{
	     	multiplexhrs[idxhrs] = new ActiveXObject('Msxml2.XMLHTTP');
	    } catch (e)
	     {
	     	multiplexhrs[idxhrs] = new ActiveXObject('Microsoft.XMLHTTP');
	     }
	     idxhrs++;
	    return (idxhrs-1);
	} else {
	 	alert('Your browser doesn\'t support XMLHTTPRequest objects...');
		return (-1);
	}
}

var DYNAMIC_UNINITIALIZED = 0;
var DYNAMIC_LOADING = 1;
var DYNAMIC_LOADED = 2;
var DYNAMIC_INTERACTIVE = 3;
var DYNAMIC_COMPLETED = 4;


function DynamicRequestVar( variable, phprequest, params, endcallback )
{
	//if (params!='') params+='&';
	//params+= 'rand='+Math.random ();

	var idxhr = getXhr();
	var XOBJ = null;
	if (idxhr>-1) {
		XOBJ = multiplexhrs[idxhr];
		XOBJ.onreadystatechange = function()
		    {
		     if( ( XOBJ.readyState == 4 && (XOBJ.status == 200 || XOBJ.status == 0 ))
		    	|| XOBJ.readyState==1 )
		     {
	    	 	eval( variable + '= XOBJ.responseText;');
		     	if (endcallback!=undefined) {
		     		//alert(endcallback);
		     		if ( (typeof endcallback) == "string") eval(endcallback);
		     		else if ((typeof endcallback) == "function") {
						//console.log( "endcallback:"+XOBJ.responseText );
		     			endcallback( XOBJ.responseText, XOBJ.readyState );
		     		}
		     	}

		     } else if (XOBJ.readyState == 4) {
		    	 if (XOBJ.status!=200) {
		    		 //alert("DynamicRequest error, status:"+XOBJ.status);
		    	 }
		     }

		    };
		//alert("REQUEST:"+phprequest + '?' + params);
		console.log( "REQUEST:"+phprequest + '?' + params );
		XOBJ.open('GET',phprequest + '?' + params, true);
		if (!document.all) {
			//XOBJ.overrideMimeType("text/html; charset=ISO-8859-1");
		}
		XOBJ.send(null);

	}
}
