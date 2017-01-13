
/** GLOBAL MOLDEO OBJECT */
var mo = {};

/** UNUSED */
var moNew = function( class_name, extended_properties ) {
	var base_object;
	//console.log("moNew > class_name:", class_name, " type:", typeof(class_name));
	if (typeof(class_name)=="string") eval( "base_object = new " + class_name+"();" );		
	if (typeof(class_name)=="object") base_object = class_name;
	return Object.create( base_object, extended_properties );
};


/** For Easy Object Inheritance:
*	options example: 
*		{ _inherit: "moAbstract", _class: "moMyNewClass" }
*/
var moCallConstructor = function( create_object, options ) {

	var obj_prototype = {};
		
	if (options._inherit!="" && options._inherit!=undefined) {
	
		//console.log( options._class, options._inherit+".call(create_object)");
		eval( options._inherit+".call(create_object)");
		//reference to global parent object functions...
		eval("create_object."+options._inherit+" = mo."+options._inherit+";");
	}
	
	create_object._inherit = options._inherit;
	create_object._class = options._class;
	
	var ancestors = "";
	if (create_object.inheritance) ancestors = create_object.inheritance+"::";
	create_object.inheritance = ancestors + create_object._class;
};

var moInherit = function( object, base_object, properties ) {
	if (properties==undefined && object.Props)
		properties = object.Props;
	object.prototype = Object.create( base_object.prototype, properties );
	object.prototype.constructor = object;

	mo[object.name] = new object(); 
};

function moDebug() {
	moCallConstructor( this, { _inherit: "", _class: "moDebug" } );
	this._DebugHeap = {};
	this._DebugHeap["__global__"] = "";
	
	this._DebugHeapErrors = {};
	this._DebugHeapErrors["__global__"] = "";
	
	this.Log = function( message ) {
		this._DebugHeap["__global__"]+= "\n"+message;
	};
	this.Message = function( message ) {
		this._DebugHeap["__global__"]+= "\n"+message;
		console.log( this._inherit+"::"+this._class+"::Log >", message );
	};
	this.Error = function( message ) {
		this._DebugHeap["__global__"]+= "\nERROR: "+message;
		this._DebugHeapErrors["__global__"]+= "\nERROR: "+message;
	};
}
moInherit( moDebug, Object );

/**
* moAbstract
*/
function moAbstract() {
	moCallConstructor( this, { _inherit: "", _class: "moAbstract" } );		
	this.Debug = mo.moDebug;
	this.Init = function() {
		console.log("moAbstract::Init > i am " + this._class);
		return true;
	};
	this.Finish = function() {
		console.log("moAbstract::Finish moAbstract");
		return true;
	};
	this.Test = function() {
		if (this.inheritance) {
			var classnames = this.inheritance.split("::");
			for( var classindex in classnames) {
				var classname = classnames[classindex];
				//console.log( "Testing if",this._class,"is instance of", classname, ":", this instanceof window[classname] );
			}
		}
		
		var json = {};
		for( var member in this) {
			json[member] = this[member];
		}
		this.Log(json)
		
		return true;
	};
	this.Log = function( message ) {
		this.Debug.Log( message );
	};
	
}
moAbstract.Props = {
	"Initialized": {
		configurable: true,
		get: function() { return this._Initialized; },
		set: function( value ) { this._Initialized = (value == 1 ); },		
	},	
	"DebugOn": {
		value: true,
		enumerable: true,
		writable: true,
	}	
};
moInherit( moAbstract, Object );

/**
* moScript
*/
function moScript() {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moScript" } );
	this.Init = function() {
		return this.moAbstract.Init.call(this);
	};
}
moInherit( moScript, moAbstract );


/**
* moParamDefinition
*/
function moParamDefinition( p_Name, p_Type, p_Index, p_DefaultValue, p_OptionsStr ) {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moParamDefinition" } );
	
	this.m_Name = p_Name;
	this.m_Type = p_Type;//moParamType
	this.m_Index = p_Index;//index of this parameter on moConfig parameters array

	this.m_Property = "";//published or not
	this.m_Group = "";
	this.m_DefaultValue = p_DefaultValue; //moValue
	this.m_Options = []; //moTextArray
	this.m_OptionsStr = p_OptionsStr;
	this.m_Interpolation = {};//moParamInterpolation
		
	this.Init = function() {
		return this.moAbstract.Init.call(this);
	};
		
}
moInherit( moParamDefinition, moAbstract );

/**
* moConfigDefinition
*/
function moConfigDefinition() {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moConfigDefinition" } );
	
	this.m_ParamDefinitions = {};
	this.m_ParamIndexes = {};
		
	this.m_ObjectName = "";
	this.m_ObjectClass = "";
	this.m_ParamDefinitions = {};
	
	this.Add = function( p_param_name, p_param_type, p_param_index, p_param_default_value, p_param_options ) {	
	
		var pdef = new moParamDefinition( p_param_name, p_param_type, p_param_default_value, p_param_options );						
		this.m_ParamDefinitions[ p_param_name ] = pdef;	
		return this.m_ParamDefinitions[ p_param_name ];
	};
	
	
}
moInherit( moConfigDefinition, moAbstract );

/**
* moConfig
*/
function moConfig( options ) {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moConfig" } );
	var self = this;
	this.ConfigDefinition = options | {};
	this.Params = {};
	this.Preconfigs = {};
	
	this.SetConfigDefinition = function( ConfigDefinition ) {
		self.ConfigDefinition = $.extend({}, self.ConfigDefinition, ConfigDefinition);
	};
	
	this.CreateDefault = function( config_file_name ) {
		//explore the Config Definition and create every parameter definition founded.
		var self2 = this;
		/*console.log("moConfig:", self, " moConfig.CreateDefault:",self2 );
		for( var paramdefinition in self.ConfigDefinition ) {
			var pDef = self.ConfigDefinition[ paramdefinition ];
			self.Params[ pDef.name ] = new moParam( pDef );
		}*/		
	};
	
	this.LoadConfig = function( config_file_name ) {
		//load from file:
		
	};
	
	this.SaveConfig = function( config_file_name ) {
		//save to file:
		
	};
}
moInherit( moConfig, moAbstract );

/**
* moMobState
*/
function moMobState() {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moMobState" } );	
	this.Activated = false;
	this.Selected = false;
}
moMobState.Props =  { 
	'Activated': { 
		configurable: true,
		get: function() { return this._Activated; },
		set: function( value ) { this._Activated = (value == 1 ); },
	},
	'Selected': { 
		configurable: true,
		get: function() { return this._Selected; },
		set: function( value ) { this._Selected = (value == 1 ); },
	}									
};
moInherit( moMobState, moAbstract );

/**
* moMobDefinition
*/
function moMobDefinition() {
	
	this.MoldeoFatherId = -1;
	this.MoldeoFatherLabelName = "-";
	  
	this.MoldeoId = -1; // Identificador de objeto Moldeo
    this.MoldeoLabelName = ""; // Etiqueta o Identificador de texto de este objeto

    this.Type = ""; // Tipo de Objeto
    this.Name = ""; // Nombre del objeto (relativo a la clase)
    this.ConfigName = ""; // Nombre del archivo de configuración
    this.Description = "";// Descripción del objeto

    this.MobIndex = {
		"param_index": 0,
		"value_index": 0
	}; // Índice referente al archivo de configuración que describe a este objeto

    this.KeyName = "";
	
	this.Init = function( name, config_name, label_name, type ) {
		this.Name = name;
		this.ConfigName = config_name;
		this.MoldeoLabelName = label_name;
		this.Type = type;
	};
	
}

function moConnector() {
}

function moOutlet() {
}

function moInlet() {
}

function moOutlets() {
}

function moInlets() {
}

/**
* moMoldeoObject (aka Mob or MOB (Moldeo Object) )
*/
function moMoldeoObject( MobDefinition ) {
	moCallConstructor( this, { _inherit: "moScript", _class: "moMoldeoObject" } );
	
	this.MobState = new moMobState( MobDefinition );
	this.MobDefinition = new moMobDefinition( MobDefinition );

	this.Config = new moConfig( {
		"configparams": {
			"script": {
				"paramdefinition": {
					"paramtype": "SCRIPT",
				},
			},
			"inlet": {
				"paramdefinition": {
					"paramtype": "INLET",
				},				
			},
			"outlet": {
				"paramdefinition": {
					"paramtype": "OUTLET",
				},								
			}
		},
		"preconfigs": {			
		},
	} );
	this.Outlets = new moOutlets();
	this.Inlets = new moInlets();

	this.Config.SetConfigDefinition( MobDefinition );
	
	this.Enable = function() {
		this.MobState.Activated = true;
	};	
	this.Disable = function() {
		this.MobState.Activated = false;
	};	
	this.Init = function() {
		if (this.MobDefinition.MoldeoLabelName=="")
			this.MobDefinition.MoldeoLabelName = "moMoldeoObject";
		this.Debug._DebugHeap[ this.MobDefinition.MoldeoLabelName ] = "";
		
		return this.moScript.Init.call(this);
	};
	this.Log = function( message ) {
		this.Debug.Log( message );
		this.Debug._DebugHeap[this.MobDefinition.MoldeoLabelName]+= "\n"+message;
	};	
}
moMoldeoObject.Props = {
	"MobState": {
		configurable: true,
		get: function() { return this._MobState; },
		set: function( value ) { this._MobState = value; },  
	},
	"MobDefinition": {
		configurable: true,
		get: function() { return this._MobDefinition; },
		set: function( value ) { this._MobDefinition = value; },  
	}
};
moInherit( moMoldeoObject, moScript );


function moEffect() {
	
	moCallConstructor( this, { _inherit: "moMoldeoObject", _class: "moEffect" } );
	
	this.EffectState = {
		"tempo": "",
		"alpha": 1.0,
		"tint": 1.0,
		"tintr": 1.0,
		"tintg": 1.0,
		"tint": 1.0,
		"tintc": 1.0,
		"tints": 1.0,
		"tintv": 1.0
	};
	
	this.Config = {		
		"configparams": {
			"alpha": {
				"paramdefinition": {
					"paramtype": "ALPHA",
				},
			},
			"color": {
				"paramdefinition": {
					"paramtype": "COLOR",
				},				
			},
			"syncro": {
				"paramdefinition": {
					"paramtype": "SYNCRO",
				},				
			},
			"phase": {
				"paramdefinition": {
					"paramtype": "PHASE",
				},				
			}
		}
	};

	this.Draw = function( p_tempo_gral, p_parent_state ) { };
	this.Interaction = function( p_device_manager ) { };
	this.LoadCodes = function() { };
	
	this.Play = function() { };
	this.Stop = function() { };
	this.Pause = function() { };
	this.Init = function() {
		return this.moMoldeoObject.Init.call(this);
	}
	

	/**override moAbstract:Log*/
	/*
	self.Log = function( message ) {		
		console.log("moEffect::Log ! ", message, self._inherit,"::", self._class );
	};
	*/
	
}
moInherit( moEffect, moMoldeoObject );

function moEffectManager() {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moEffectManager" } );

	this.PreEffects = [];
	this.PreEffectsByName = {};

	this.Effects = [];
	this.EffectsByName = {};

	this.PostEffects = [];
	this.PostEffectsByName = {};

	this.MasterEffects = [];
	this.MasterEffectsByName = {};

	this.AllEffects = [];
	this.AllEffectsByName = {};
	
	this.New = function( p_MobDefinition ) {
		if ( (p_MobDefinition instanceof moMobDefinition) == false
			|| p_MobDefinition.Name==undefined
			|| p_MobDefinition.ConfigName==undefined
			|| p_MobDefinition.MoldeoLabelName==undefined)
			return console.error("p_MobDefinition error");
		new_effect = this.NewEffect( p_MobDefinition );
		return new_effect;
	};
	this.NewEffect = function( p_name, p_config_name, p_labelname, p_key_name, p_type, p_param_index, p_value_index ) {
		new_effect = {};
		return new_effect;
	};
	this.AddEffect = function( p_Effect ) {
			
	};
	this.RemoveEffect = function( p_EffectId, p_EffectType ) {
			
	};	
	this.GetEffectId = function( p_LabelName ) {
			
	};	
	this.GetEffectLabelName = function( p_EffectId ) {
			
	};
	this.GetType = function( p_EffectId ) {
			
	};
	this.GetEffectByLabel = function( p_LabelName, p_Type ) {
	
	};
	
	
	
}
moInherit( moEffectManager, moAbstract );

function moResourceManager() {
	moCallConstructor( this, { _inherit: "moAbstract", _class: "moResourceManager" } );
	
	/** This Render Manager is based on WEBGL/THREE.JS*/
	this.RenderMan = {};
	this.TextureMan = {};
	this.VideoMan = {};
	this.SoundMan = {};
	
	/** This GL Functions are for webgl or three.js (depending on the best mode for your computer)*/
	this.GLMan = {};
	this.GuiMan = {};
	this.MathMan = {};
	this.DataMan = {};
	this.FileMan = {};
	this.ScriptMan = {};
}
moInherit( moResourceManager, moAbstract );

function moConsole() {
	var self = this;
	moCallConstructor( this, { _inherit: "moEffect", _class: "moConsole" } );
	
	this.Init = function() {	
		var res = this.moEffect.Init.call(this);
		console.log("moConsole::Init moConsole");
		return res && true;
	};

}
moInherit( moConsole, moEffect );



function moMoldeoJsTest() {
	mo.Test = {};
	mo.Test.Abstract = new moAbstract();
	mo.Test.Abstract.Test();
	
	mo.Test.Script = new moScript();
	mo.Test.Script.Test();

	mo.Test.MoldeoObject = new moMoldeoObject();
	mo.Test.MoldeoObject.Log("Created!!");
	mo.Test.MoldeoObject.Test();

	mo.Test.Effect = new moEffect();
	mo.Test.Effect.Log("Created!!");
	mo.Test.Effect.Test();

	mo.Test.PlayerConsole = new moConsole();
	mo.Test.PlayerConsole.Log("Created!!");
	mo.Test.PlayerConsole.Test();
	mo.Test.PlayerConsole.Init();
}


/*var MoldeoJsTest = new moMoldeoJsTest();*/