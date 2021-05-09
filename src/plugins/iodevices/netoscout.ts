import * as MO from "moldeojs";
//import * as nodeosc from "node-osc";
//import * as osc from "osc";
//import * as oscjs from "osc-js";

export class moNetOscOut extends MO.moIODevice {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;
  oscClient : any;
  configOsc : any;
  configOscDefault : any;

  constructor() {
    super();
    this.SetName("netoscout");
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
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    console.log(`mo${this.GetName()}.Init ${this.GetName()}`);
    if (super.Init((res) => {

      ///Al fin luego de levantar todas las configuraciones,
      // creamos los conectores (Inlets <NO INTERNOS> y Outlets)
      // resolvemos los valores de cada parametros del config
      /**
      this.isyncro = this.m_Config.GetParamIndex("syncro");
      this.iphase = this.m_Config.GetParamIndex("phase");
      this.CreateConnectors();
      console.log( `moEffect.PreInit OK! ${this.GetLabelName()}:(${this.m_Config.m_Params.length})<-I[${this.m_Inlets.length}]->O[${this.m_Outlets.length}]]`, this);
*/

      this.configOsc.client.host = this.m_Config.Text("hosts");
      this.configOsc.client.port = this.m_Config.Int("port");
      console.log(`mo${this.GetName()}.Init ${this.GetName()}`, this.configOsc );
      //this.oscClient = new oscjs.OSC({ plugin: new oscjs.OSC.WebsocketServerPlugin() });
      /*this.oscClient = new osc.WebSocketPort({
        url: "wss://localhost:"+this.configOsc.client.port, // URL to your Web Socket server.
        metadata: true
      });*/
      //this.oscClient = new nodeosc.Client( this.configOsc.client.host, this.configOsc.client.port);
      console.log("oscClient",this.oscClient);
      if (callback) callback(res);
    } )) {
      // esta función es asincrónica ahora
    } else return false;

    return true;
  }

  OscMoldeoSend( obj?:any )  : void {
  	//if (config.log.full) console.log("obj:",obj);
  	var str = "";

    for(var xx in obj) {
  		str+= obj[xx];
  	}

  	//if (config.log.full) console.log("obj:",str);
  	if (obj.msg!=undefined) {
  		if (obj.val0!=undefined) {
  			if (obj.val1!=undefined) {
  				if (obj.val2!=undefined) {
  					if (obj.val3!=undefined) {
  						if (obj.val4!=undefined) {
  							this.oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3, obj.val4 );
  							//console.log("obj.val4:"+obj.val4);
  						} else this.oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2, obj.val3 );
  					} else this.oscClient.send( obj.msg, obj.val0, obj.val1, obj.val2 );
  				} else this.oscClient.send( obj.msg, obj.val0, obj.val1 );
  			} else this.oscClient.send( obj.msg, obj.val0 );
  		} else this.oscClient.send( obj.msg );
  	} else this.oscClient.send( obj );

  }


  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moEffectIcon.Update");
  }

  GetDefinition(): MO.moConfigDefinition {
    console.log("moNetOscOut.GetDefinition");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
