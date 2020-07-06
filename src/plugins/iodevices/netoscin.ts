import * as MO from "moldeojs";
//import * as osc from "node-osc";
//import * as oscjs from "osc-js";

export class moNetOscIn extends MO.moIODevice {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;
  oscServer : any;
  configOsc : any;
  configOscDefault : any;
  ReceiverFunction : any;
  MoldeoApiReceiver : any;

  constructor() {
    super();
    this.SetName("netoscin");
    this.configOscDefault = {
    	/**MoldeoControl listen to MoldeoPlayer in port 3335 > netoscout (moldeo osc client plugin) must be configured to write to 3335*/
    	server: {
    		port: 3334,
    		host: '0.0.0.0'
    	},

    	/**MoldeoControl Speak to MoldeoPlayer in port 3334 > netoscin (molde osc server plugin) must be configured listening in port 3334*/
    	client: {
    		port: 3335,
    		host: '127.0.0.1'
    	}
    };
    this.configOsc = this.configOscDefault;
    this.MoldeoApiReceiver = {

    };
    this.ReceiverFunction = function(msg, rinfo) {

    	try {
    		//console.log( "oscServer.on('message'.....) receive ! msg: " + msg, ' rinfo:' + rinfo);
    		//if (config.log.full) console.log( "oscServer.on('message'.....) receive ! msg: ",msg );
    		//socket.emit("message", msg);
    		var object_regexp = /({.*})/i
    		//var data = msg.match( object_regexp );
    		var  moldeoapimessage = msg[2];
    		var moldeo_message = {};

    		// how many fields ??
    		if (moldeoapimessage[0]=="moldeo" || moldeoapimessage[0]=="/moldeo") {
          		moldeo_message["int"] = moldeoapimessage.length-1;
    		} else moldeo_message["int"] = moldeoapimessage[0];
    		// which command code ??
    		moldeo_message["code"] = moldeoapimessage[1];
    		// object ??
    		moldeo_message["target"] = moldeoapimessage[2];
    		// info transmission ??
    		var objectinfo = moldeoapimessage[3];
    		moldeo_message["info"] = undefined;

    		//history[nhis] = msg[2];

    		if (objectinfo!=undefined) {

    			//console.log( "oscServer.on('message'.....) objectinfo:" + JSON.stringify( objectinfo,"", "\n") );
    			//if (config.log.full) console.log( "oscServer.on('message',...)");
    			//console.log( "oscServer.on('message'.....) objectinfo:",objectinfo );

    			if ( moldeo_message["int"]>3) {
    				//console.error("objectinfo: is an array");
    				moldeo_message["param"] = moldeoapimessage[3];
    				moldeo_message["preconf"] = moldeoapimessage[4];
    				objectinfo = moldeoapimessage[5];
    			}

    			//if (config.log.full) console.log( "oscServer.on('message',...) replacing line return: \\n by nothing");
    			objectinfo = objectinfo.replace( /\n/g , '');
    			//objectinfo = objectinfo.replace( /\"/g , '##quote##');

    			//if (config.log.full) console.log( "oscServer.on('message',...) replacing apostrophe: \\' by \"");
    			objectinfo = objectinfo.replace( /\'/g , '"');
    			//if (config.log.full) console.log( "oscServer.on('message',...) replacing slash: \\ by double slash \\\\");
    			objectinfo = objectinfo.replace( /\\/g , '\\\\');
    			//objectinfo = objectinfo.replace( /##quote##/g , '\\\"');
    			//if (config.log.full) console.log( "oscServer.on('message',...) parsing:");
    			//if (config.log.full) console.log( "objetinfo:",objectinfo);
    			moldeo_message["info"] = JSON.parse( objectinfo );
    		}

    		//if (config.log.full) console.log( "moldeo_message > ",moldeo_message );

    		var CallingApiFunction : any = false;
    		if (moldeo_message["code"])
    			CallingApiFunction = this.MoldeoApiReceiver[ moldeo_message["code"] ];

    		if (CallingApiFunction) {
    			CallingApiFunction( moldeo_message );
    		} else {
    			console.error("No Moldeo Osc Api function registered for calling code:", moldeo_message["code"] );
    		}

    	} catch(err) {
    		console.error("oscServer > on message: ",err);
    		//alert("Error en el formato de recepción de datos",err);
    	}
    }
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    console.log(`mo${this.GetName()}.Init ${this.GetName()}`);
    if (this.Init((res) => {

      this.configOsc.server.host = this.m_Config.Text("hosts");
      this.configOsc.server.port = this.m_Config.Int("port");
      console.log(`mo${this.GetName()}.Init ${this.GetName()}`,this.configOsc);
      //this.oscServer = new osc.Server( this.configOsc.server.port, this.configOsc.server.host);
      //this.oscServer.on('message', this.ReceiverFunction );
      //this.oscServer = new oscjs.OSC({ plugin: new oscjs.OSC.WebsocketServerPlugin() });
      console.log("configOsc",this.configOsc,"oscServer",this.oscServer);
      /*this.oscServer.on('message', function(msg) {
        console.log("message received",msg);
      } );*/

      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moEffectIcon.Update");
  }

  GetDefinition(): MO.moConfigDefinition {
    console.log("moNetOscIn.GetDefinition");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
