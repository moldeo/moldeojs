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
		console.log("moVideoFramework::LoadCaptureDevices")
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
  n : any;
  canvas : any;
  context : any;
	cv_id: any;
	vi_id: any;

  constructor( cap : moCaptureDevice ) {
    super();
    this.m_CaptureDevice = cap;
    this.video = document.createElement("VIDEO");
    this.video.setAttribute("style", "display:none;");
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

  Init() : boolean {
    var _self = this;
    this.m_VideoGraph = new moUserMediaVideoGraph();
    /////////////////////////////
		console.log("moLiveSystem::Init",this.m_CaptureDevice);
    let constraints:any = {
      audio: false,
      video: {
          width: this.m_CaptureDevice.m_SourceWidth,
          height: this.m_CaptureDevice.m_SourceHeight
      }
    };
    if (this.n.mediaDevices === undefined) { //For Old Browsers
      this.n.mediaDevices = {};
    } //END mediaDevices for old browsers

    if (this.n.mediaDevices.getUserMedia === undefined) {  //Check the existence of getUserMedia
      this.n.mediaDevices.getUserMedia = function(constraints) {
				console.log("this.n.mediaDevices.getUserMedia",constraints);
        var getUserMedia = this.n.webkitGetUserMedia || this.n.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      }
    }//END check for getUserMedia

    this.n.mediaDevices.getUserMedia(constraints).then(function(stream) {
			console.log("getUserMedia",constraints);
      if ("srcObject" in _self.video) {
        _self.video.srcObject = stream;
      } else {
        _self.video.src = window.URL.createObjectURL(stream);//video.src just for older implementations
      }
      _self.video.onloadedmetadata = function(e) {
        _self.video.play();
      };
    });

    this.canvas = document.getElementById(this.cv_id);
		if (this.canvas) {
    	this.context = this.canvas.getContext('2d');
		}

    return super.Init();
  }

  Update() : void {
    this.context.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height);
    if (this.m_Texture._texture) {
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
		console.log("moVideoManager::GetCameraByName",camera,load,customCD);
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
						 this.MODebug2.Message("moVideoManager::GetCameraByName > load ok, creating camera:"+camera);
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
		console.log("moVideoManager::GetCaptureDevices > reload:",reload)
    if (reload) {
      this.m_CaptureDevices = this.m_LiveSystems.GetVideoFramework().LoadCaptureDevices();
			console.log("moVideoManager::m_CaptureDevices",this.m_CaptureDevices);
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
		console.log( "CreateCamera:", cap_device );
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
