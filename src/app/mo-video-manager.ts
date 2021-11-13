import * as THREE from 'three';
import { IntToStr } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moResource } from "./mo-resource";
import { moTexture, moTextureAnimated, moTextureType } from "./mo-texture";
import { moResourceManager } from "./mo-resource-manager";

export enum moLiveSystemType {
	LST_VIDEOCAMERA=0,
	LST_UNKNOWN
};

export class moVideoBufferPath extends moAbstract {

};

export class moVideoBuffer extends moTextureAnimated {

};

export class moCircularBuffer extends moVideoBuffer {

};

export class moVideoFormat {


};

export class moCaptureDevice extends moAbstract {

  m_bPresent : boolean = false;///Presencia del dispositivo
	m_bPreferred : boolean = false;///Dispositivo preferido siempre se dan de alta cuando están presentes.

  m_Name : moText = "";///Nombre del dispositivo
	m_Description : moText = "";///Descripción del dispositivo
	m_Path : moText = "";///Camino o clave del dispositivo

	m_VideoFormat : moVideoFormat;///Formato video del dispositivo
	m_DevicePort : number = 0;///PUERTO DEL DISPOSITIVO

	m_SourceWidth : number = 0;
	m_SourceHeight : number = 0;
	m_SourceBpp : number = 0;
	m_SourceFlipH : number = 0;
	m_SourceFlipV : number = 0;

  m_LabelName : moText = "";

  m_Index : number = 0;

  constructor() {
    super();
  }

  Init(options?: any) : boolean {
		if (options) {
			//(options["width"];
		}
    return super.Init();
  }

  GetLabelName() : moText {
    return this.m_LabelName;
  }

  GetName() : moText {
    return this.m_Name;
  }

  GetVideoFormat() : moVideoFormat {
    return this.m_VideoFormat;
  }

  IsPreferred() : boolean {
    return this.m_bPreferred;
  }
  IsPresent() : boolean {
    return this.m_bPresent;
  }
	GetSourceWidth() : number {
		return this.m_SourceWidth;
	}
	GetSourceHeight() : number {
		return this.m_SourceHeight;
	}
};

export class moVideoGraph extends moAbstract {
  constructor() {
    super();

  }
};


export type moCaptureDevices = moCaptureDevice[];

export class moUserMediaVideoGraph extends moVideoGraph {
  constructor() {
    super();

  }
};

export class moVideoFramework extends moAbstract {
  m_CaptureDevices : moCaptureDevices;

  constructor() {
    super();

  }

  LoadCaptureDevices() : moCaptureDevices {
    var cap : moCaptureDevice;
		//console.log("moVideoFramework::LoadCaptureDevices")
    this.m_CaptureDevices = [];

    cap = new moCaptureDevice();
    cap.m_Name = "default";
    cap.m_LabelName = "LIVEIN"+IntToStr(0);
    cap.m_bPresent = true;
    cap.m_bPreferred = true;
    cap.m_Index = 0;

    this.m_CaptureDevices.push(cap);
    return this.m_CaptureDevices;
  }
};

export class moUserMediaVideoFramework extends moVideoFramework {

  constructor() {
    super();

  }

};

export class moLiveSystem extends moAbstract {

  m_CaptureDevice : moCaptureDevice;
  m_VideoGraph : moVideoGraph;
  m_Texture : moTexture;
  video : any;
	video_ready : boolean = false;
  n : any;
  canvas : any;
  cv_context : any;
	cv_id: any;
	vi_id: any;
	devices_str : any = "";

  constructor( cap : moCaptureDevice ) {
    super();
    this.m_CaptureDevice = cap;
    this.video = document.createElement("VIDEO");
    this.video.setAttribute("style", "display: none; position: fixed; bottom: 0px; left: 0px; width: 100px; heigh: 100px; z-index: -1;");
		this.vi_id = "_VIDEO_" + IntToStr(this.m_CaptureDevice.m_Index)+"_";
    this.video.setAttribute("id", this.vi_id );
    document.body.appendChild(this.video);

    this.canvas = document.createElement("CANVAS");
		this.cv_id = "moCanvasVideo_"+IntToStr(this.m_CaptureDevice.m_Index)+"_";
    this.canvas.setAttribute("id", this.cv_id);
    this.canvas.setAttribute("style", "display:none;");
    document.body.appendChild(this.canvas);

    this.n = <any>navigator;

    this.n.getUserMedia = ( this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia  || this.n.msGetUserMedia );



  }

	/**
	* https://www.w3.org/TR/mediacapture-streams/#dom-mediatracksupportedconstraints
	*
	* dictionary MediaTrackSupportedConstraints {
    boolean width = true;
    boolean height = true;
    boolean aspectRatio = true;
    boolean frameRate = true;
    boolean facingMode = true;
    boolean volume = true;
    boolean sampleRate = true;
    boolean sampleSize = true;
    boolean echoCancellation = true;
    boolean autoGainControl = true;
    boolean noiseSuppression = true;
    boolean latency = true;
    boolean channelCount = true;
    boolean deviceId = true;
    boolean groupId = true;
};
	*/

  Init() : boolean {
    var _self = this;
    this.m_VideoGraph = new moUserMediaVideoGraph();
    /////////////////////////////
		//console.log("moLiveSystem::Init",this.m_CaptureDevice);
    let constraints:any = {
      audio: false,
      video: {
        facingMode: 'environment',
        width: { min: 320, max: 640, ideal: 320 }
      }
       //{
				//facingMode: { ideal: "environment" }, //working in iOS 13 so in Android 7

				//facingMode: ["environment","user"], // ["environment","user"] "user" or "environment"
				//facingMode: ["environment"],
				//width: {
				//	ideal: 320,
				//},
				/*
				height: {
					ideal: 999999
				},*/
				/*frameRate: {
					ideal: 60,
						min: 10
				}*/
			//}
			/*advanced: [{
					facingMode: "environment"
			}]*/
    };
		if ( this.m_CaptureDevice.m_SourceWidth>0 && false ) {
			if (constraints['video']==true) {
				constraints['video'] = { width: { ideal: this.m_CaptureDevice.m_SourceWidth } };
			} else {
				constraints['video']['width'] = { ideal: this.m_CaptureDevice.m_SourceWidth };
			}
		}

		if ( this.m_CaptureDevice.m_SourceHeight>0 && false ) {
			if (constraints['video']==true) {
				constraints['video'] = { height: { ideal: this.m_CaptureDevice.m_SourceHeight }};
			} else {
				constraints['video']['height'] = { ideal: this.m_CaptureDevice.m_SourceHeight };
			}
		}

		//console.log("constraints:",constraints);
    if (this.n.mediaDevices === undefined) { //For Old Browsers
      this.n.mediaDevices = {};
    } //END mediaDevices for old browsers

    if (this.n.mediaDevices.getUserMedia === undefined) {  //Check the existence of getUserMedia
      this.n.mediaDevices.getUserMedia = function(constraints) {
				//console.log("this.n.mediaDevices.getUserMedia",constraints);
        var getUserMedia = this.n.getUserMedia;

        if (!getUserMedia) {
					alert('getUserMedia is not implemented in this browser');
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }//END check for getUserMedia

		this.n.mediaDevices.enumerateDevices()
        .then(devices => {
					 let devs = "";
					 let idx = 0;
					 //console.log(devices,JSON.stringify(devices));
					 let bestdevice_id = "";
					 for(let dev in devices) {
						 //alert(devices[dev]);
						 if (devices[dev].kind == "videoinput") {
							 devs+= " [ ("+idx+") label:" + devices[dev].label + " id: " + devices[dev].deviceId+"]";
							 idx+=1;
							 bestdevice_id = devices[dev].deviceId;
						 }
					 }

					 _self.devices_str = devs + "bestdevice_id: "+bestdevice_id;
					 _self.video.setAttribute('autoplay', '');
    	 		 _self.video.setAttribute('muted', '');
    			 _self.video.setAttribute('playsinline', '');

					 //alert(devices_str);

					//constraints["video"]["deviceId"] = bestdevice_id;
					//constraints["video"]["facingMode"] = { exact: "environment" };
          _self.getMedia(constraints);
          /*
					_self.n.mediaDevices.getUserMedia(constraints).then(function(stream) {
						console.log("getUserMedia",constraints);
						//alert( JSON.stringify(constraints) );

			      if ("srcObject" in _self.video) {
							 //alert("srcObject assignation")
			        _self.video.srcObject = stream;
			      } else {
			        _self.video.src = window.URL.createObjectURL(stream);//video.src just for older implementations
			      }
			      _self.video.onloadedmetadata = function(e) {
								//alert("on loaded metadata")
			       		_self.video.play();
								_self.video_ready = true;
			      };
			    }).catch(function(err) {
						alert(err);
            alert(JSON.stringify(_self.n.mediaDevices.getSupportedConstraints()));
					});*/

				});

    this.canvas = document.getElementById(this.cv_id);
		if (this.canvas) {
    	this.cv_context = this.canvas.getContext('2d');
		}

    return super.Init();
  }

  getMedia( constraints : any ) : void {
    var _self = this;
    _self.n.mediaDevices.getUserMedia(constraints).then(function(stream) {
        //console.log("getUserMedia",constraints);
        //alert( JSON.stringify(constraints) );

        if ("srcObject" in _self.video) {
           //alert("srcObject assignation")
          _self.video.srcObject = stream;
        } else {
          _self.video.src = window.URL.createObjectURL(stream);//video.src just for older implementations
        }
        _self.video.onloadedmetadata = function(e) {
            //alert("on loaded metadata")
            //alert(_self.video.videoWidth+"x"+_self.video.videoHeight );
            eval("window.videowxh = _self.video.videoWidth+'x'+_self.video.videoHeight+'"+JSON.stringify(constraints)+"';");
            _self.video.play();
            _self.video_ready = true;
        };
      }).catch(function(err) {
        if (window["moldeodebug"]) alert(err);
        if (window["moldeodebug"]) alert(JSON.stringify(constraints));
        if (window["moldeodebug"]) alert(JSON.stringify(_self.n.mediaDevices.getSupportedConstraints()));
        var constraints_base : any = { audio: false, video: { facingMode: 'environment', width: { min: 320, max: 640}}};
        var constraints_sure : any = { audio: false, video: { facingMode: 'environment' }};
        var constraints_supersure : any = { audio: false, video: true };
        if (JSON.stringify(constraints) == JSON.stringify(constraints_sure)) {constraints = constraints_supersure;}
        else if (JSON.stringify(constraints) == JSON.stringify(constraints_base)) { constraints = constraints_sure;}
        else if (JSON.stringify(constraints) != JSON.stringify(constraints_base)) { constraints = constraints_base;}
        _self.getMedia(constraints);
      });
  }

  Update() : void {
    this.cv_context.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height);
    if (this.m_Texture._texture) {
			this.m_Texture._video = this.video;
      this.m_Texture._texture.needsUpdate = true;//Important for update
    }
  }

  GetTexture() : moTexture {
    return this.m_Texture;
  }

  GetVideoGraph() : moVideoGraph {
    return this.m_VideoGraph;
  }

  GetCaptureDevice() : moCaptureDevice {
    return this.m_CaptureDevice;
  }

  GetLabelName() : moText {
    return this.m_CaptureDevice.GetLabelName();
  }

};

 export type moLiveSystemsPtr = moLiveSystem[];

export class moLiveSystems extends moAbstract {

  m_LiveSystemsPtr : moLiveSystemsPtr;
  m_VideoFramework : moVideoFramework;
  constructor() {
    super();
    this.m_VideoFramework = new moVideoFramework();
    this.m_LiveSystemsPtr = [];
  }
  LoadLiveSystems() : void {

  }

  UpdateLiveSystems() : void {

  }

  UnloadLiveSystems() : void {

  }
  GetStatus() : void {

  }
  GetVideoFramework() : moVideoFramework {
    return this.m_VideoFramework;
  }
}

export class moVideoManager extends moResource {

  m_LiveSystems : moLiveSystems;
  m_CaptureDevices : moCaptureDevices;

	constructor() {
    super();
    this.SetName("_videomanager_");
    this.m_LiveSystems = new moLiveSystems();
  }

  Init() : boolean {

    return super.Init();
  }

  GetCameraByName( camera : moText, load : boolean, customCD :  moCaptureDevice ) : moLiveSystem {
    var Cam : moLiveSystem = null;
    var c : number;
		//console.log("moVideoManager::GetCameraByName",camera,load,customCD);
    if (this.m_LiveSystems) {
      for( c=0; c<this.m_LiveSystems.m_LiveSystemsPtr.length; c++ ) {
        Cam = this.m_LiveSystems.m_LiveSystemsPtr[c];
        if (Cam) {
          if (Cam.GetCaptureDevice().GetLabelName()==camera
            ||
            Cam.GetCaptureDevice().GetName()==camera
            ||
            ( camera=="default" && c>=0 && Cam.GetVideoGraph() )
           ) {
             this.MODebug2.Message("moVideoManager::GetCameraByName > camera already loaded, returnin:"+camera);
             return Cam;
           }
         }
       }
     }

     for( var d : number =0; d<this.m_CaptureDevices.length; d++) {
       var CapDev : moCaptureDevice = this.m_CaptureDevices[d];
       if (CapDev.GetName()==camera
        ||
        CapDev.GetLabelName()==camera
        ||
        (  camera=="default" && d>=0 && CapDev.IsPresent() )
         ) {
           ///Try to create it!!!
           if (load) {
						 //this.MODebug2.Message("moVideoManager::GetCameraByName > load ok, creating camera:"+camera);
						 if (customCD) {
							 CapDev.m_SourceWidth = customCD.m_SourceWidth;
							 CapDev.m_SourceHeight = customCD.m_SourceHeight;
						 }
             Cam = this.CreateCamera( CapDev );
           }
         }
     }
     return Cam;
  }

  GetCaptureDevices( reload? : boolean ) : moCaptureDevices {
		//console.log("moVideoManager::GetCaptureDevices > reload:",reload)
    if (reload) {
      this.m_CaptureDevices = this.m_LiveSystems.GetVideoFramework().LoadCaptureDevices();
			//console.log("moVideoManager::m_CaptureDevices",this.m_CaptureDevices);
    }
    return this.m_CaptureDevices;
  }

  GetCameraCount() : number {
    return this.m_LiveSystems.m_LiveSystemsPtr.length;
  }

  GetCamera( c : number ) : moLiveSystem {
    if (this.m_LiveSystems.m_LiveSystemsPtr.length
    && c<this.m_LiveSystems.m_LiveSystemsPtr.length ) {
      return this.m_LiveSystems.m_LiveSystemsPtr[c];
    }
    return null;
  }

  CreateCamera( cap_device : moCaptureDevice ) : moLiveSystem {
    var Cam : moLiveSystem;
		//console.log( "CreateCamera:", cap_device );
    Cam = new moLiveSystem( cap_device );
    Cam.Init();

    var resid : number = this.m_pResourceManager.GetTextureMan().AddTexture( moTextureType.MO_TYPE_TEXTURE, Cam.GetLabelName() );
    if (resid>-1) {
      Cam.m_Texture = this.m_pResourceManager.GetTextureMan().GetTexture(resid);
      Cam.m_Texture._texture = new THREE.Texture(Cam.canvas);
      Cam.m_Texture._texture.minFilter = THREE.LinearFilter;
      Cam.m_Texture._texture.needsUpdate = true;//Important for update

    }
    this.m_LiveSystems.m_LiveSystemsPtr.push(Cam);
    return Cam;
  }



}
