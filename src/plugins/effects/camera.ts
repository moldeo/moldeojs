import * as MO from "moldeojs";

export enum moEffectCameraMode {
	MO_CAMERA_MODE_VCR = 0,
	MO_CAMERA_MODE_SCRIPT = 1,
	MO_CAMERA_MODE_CYCLE = 2,
	MO_CAMERA_MODE_VCR_PLAYLIST = 3
};

export enum moEffectCameraPlayState {
	MO_CAMERA_PLAYSTATE_STOPPED = 0,
	MO_CAMERA_PLAYSTATE_PLAYING = 1,
	MO_CAMERA_PLAYSTATE_REVERSE = 2,
	MO_CAMERA_PLAYSTATE_SPEED = 3,
	MO_CAMERA_PLAYSTATE_PAUSED = 4,
	MO_CAMERA_PLAYSTATE_SEEKING = 5
};


export enum moEffectCameraSeekState {
	MO_CAMERA_SEEKSTATE_SEEKING = 0,
	MO_CAMERA_SEEKSTATE_REACHED = 1,
	MO_CAMERA_SEEKSTATE_PLAYING = 2,
	MO_CAMERA_SEEKSTATE_PAUSED = 3
};

export enum moEffectCameraVCRCommand {
	MO_CAMERA_VCR_STOP = 0,//Stop
	MO_CAMERA_VCR_PLAY = 1,//Play
	MO_CAMERA_VCR_PAUSE = 2,//Stop
	MO_CAMERA_VCR_REVERSE = 3,//Reverse
	MO_CAMERA_VCR_FW = 4,//Forward
	MO_CAMERA_VCR_RW = 5,//Rewind
	MO_CAMERA_VCR_FF = 6,//Fast Forward
	MO_CAMERA_VCR_FR = 7,//Fast Rewind
	MO_CAMERA_VCR_SEEK = 8,//Seek for a frame
	MO_CAMERA_VCR_SPEED = 9,//Play at speed
	MO_CAMERA_VCR_PREVFRAME = 10,//move to prev frame
	MO_CAMERA_VCR_NEXTFRAME = 11,//move to next frame
	MO_CAMERA_VCR_LOOP = 12//loop
};


export enum moCameraParamIndex {
	CAMERA_INLET=0,
	CAMERA_OUTLET,
	CAMERA_ALPHA,
	CAMERA_COLOR,
	CAMERA_SYNC,

	CAMERA_CAMERA,
	CAMERA_COLOR_FORMAT,
	CAMERA_WIDTH,
	CAMERA_HEIGHT,

	CAMERA_COLOR_BITS,

	CAMERA_SCALE_WIDTH,
	CAMERA_SCALE_HEIGHT,

	CAMERA_FLIP_HORIZONTAL,
	CAMERA_FLIP_VERTICAL,

	CAMERA_TEXTURE,

	CAMERA_POSITION,
	CAMERA_SPEED,
	CAMERA_VOLUME,
	CAMERA_BALANCE,
	CAMERA_BRIGHTNESS,
	CAMERA_CONTRAST,
	CAMERA_SATURATION,
	CAMERA_HUE,

	CAMERA_MODE,

	CAMERA_BLENDING,

	CAMERA_STARTPLAYING,

	CAMERA_LOOP,

	CAMERA_INTERPOLATION,

	CAMERA_POSTEXX,
	CAMERA_POSTEXY,
	CAMERA_ANCTEXX,
	CAMERA_ALTTEXY,
	CAMERA_POSCUADX,
	CAMERA_POSCUADY,
	CAMERA_ANCCUADX,
	CAMERA_ALTCUADY,

	CAMERA_SHOWCAMERADATA,

	CAMERA_DISPLAY_X,
	CAMERA_DISPLAY_Y,
	CAMERA_DISPLAY_WIDTH,
	CAMERA_DISPLAY_HEIGHT
};

export class moEffectCamera extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;
  VMan: MO.moVideoManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;

  canvas: any;
  context: any;
  texture: any;

  m_DeviceName : MO.moText;
  m_pCamera : MO.moLiveSystem;
  m_pCameraTexture : MO.moTexture;
  m_CaptureDevice : MO.moCaptureDevice;

  constructor() {
    super();
    this.SetName("camera");

  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
    this.VMan = this.m_pResourceManager.GetVideoMan();


    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
    if (this.PreInit((res) => {

      this.m_CaptureDevice = new MO.moCaptureDevice();
      this.m_CaptureDevice.m_Name = "default";
      this.m_CaptureDevice.m_LabelName = "LIVEIN0";
      this.m_CaptureDevice.m_SourceWidth = this.m_Config.Int("width");
      this.m_CaptureDevice.m_SourceHeight = this.m_Config.Int("height");
      this.InitDevice("default");



      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  InitDevice( camera : MO.moText ) : void {
    //console.log("moCamera:InitDevice",camera);
    if (this.CheckIfDeviceNameExists(camera)) {
      this.m_DeviceName = camera;
      this.m_pCamera = this.VMan.GetCameraByName( this.m_DeviceName, true /*CREATE!!!*/, this.m_CaptureDevice );
      if (this.m_pCamera) {
        this.m_pCameraTexture = this.m_pCamera.GetTexture();
      }
    }
  }

  CheckIfDeviceNameExists( camera : MO.moText ) : boolean {
    var c:number = 0;
    //console.log("CheckIfDeviceNameExists",camera);

    var CapDevs : MO.moCaptureDevices = this.VMan.GetCaptureDevices(true);

    for( c=0; c<this.VMan.GetCameraCount(); c++ ) {
      var Cam : MO.moLiveSystem = this.VMan.GetCamera(c);
      if (Cam) {
        if (Cam.GetCaptureDevice().GetName()==camera
      || Cam.GetCaptureDevice().GetLabelName()==camera ) {
          //console.log("CheckIfDeviceNameExists: founded",camera);
          return true;
        }
      }
    }

    if (camera=="default" && this.VMan.GetCameraCount()>0) {
      return true;
    }

    if (camera=="default" && CapDevs.length>0 ) {
    var Cap : MO.moCaptureDevice = CapDevs[0];
    if (Cap.IsPresent()) {
      this.MODebug2.Message("moEffectCamera::CheckIfDeviceNameExists > default selected, at least one camera device is available. Cap. Label Name: "
                    + Cap.GetLabelName()+" WxH:" + MO.IntToStr(Cap.GetSourceWidth())+"x"+ MO.IntToStr(Cap.GetSourceHeight()) );
    } else {
      this.MODebug2.Message("moEffectCamera::CheckIfDeviceNameExists > default selected, available but not present?");
    }
    return true;
  }
    console.log("CheckIfDeviceNameExists: NOTHING, camera count:",this.VMan.GetCameraCount());
    return false;
  }

  Draw( p_tempo : MO.moTempo, p_parentstate : MO.moEffectState = null ) : void {
    this.BeginDraw( p_tempo, p_parentstate );

    if (this.RM == undefined) return;

    var size_updated : boolean = this.RM.m_bUpdated;

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgb.r, rgb.g, rgb.b);

    ///MESH MATERIAL
    if (this.Mat==undefined) {
      this.Mat = new MO.moMaterialBasic();
    }
    if (this.Mat) {
      //Texture of WebCam
      /*
      this.context.drawImage(document.querySelector('video'), 0, 0, this.canvas.width, this.canvas.height);
      if (this.texture) {
        this.texture.needsUpdate = true;//Important for update
        this.Mat.map = this.texture;
      }
      */
      if (this.m_pCamera) {
        this.m_pCamera.Update();
        this.Mat.map = this.m_pCameraTexture._texture;
      }
      //Params
      this.Mat.transparent = true;
      this.Mat.color = ccolor;
      this.Mat.opacity = this.m_Config.Eval("alpha");
    }

    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.Normalize();

    ///MESH GEOMETRY
    if (this.Plane == undefined || size_updated) {
      this.Plane = new MO.moPlaneGeometry( 1.0, 1.0/this.RM.Proportion(), 1, 1 );
    }

    ///MESH MODEL
    if (this.Model==undefined)
      this.Model = new MO.moGLMatrixf().MakeIdentity();

    if (this.Model) {
      this.Model.Scale(
        this.m_Config.Eval("anc_cuad_x"),
        this.m_Config.Eval("alt_cuad_y"),
      1.0);
      //console.log("this.m_Config.Eval(anc_cuad_x)",
      //  this.m_Config.Eval("anc_cuad_x"),
      //  this.m_Config.Eval("alt_cuad_y"));
      this.Model.Translate(
          this.m_Config.Eval("pos_cuad_x"),
          this.m_Config.Eval("pos_cuad_y"),
          0.0);
    }

    if (this.Mesh==undefined || size_updated) {
      this.Mesh = new MO.moMesh( this.Plane, this.Mat );
    }
    if (this.Mesh && this.Model) {
      this.Mesh.SetModelMatrix(this.Model);
    }

    if (this.Scene==undefined || size_updated) {
      this.Scene = new MO.moSceneNode();
      this.Scene.add(this.Mesh);
    }


    ///CAMERA PERSPECTIVE
    if (this.Camera==undefined)
      this.Camera = new MO.moCamera3D();

    var rs: MO.moVector2 = new MO.moVector2();
    this.RM.m_Renderer.getSize(rs);
    this.GL.SetDefaultOrthographicView(
      rs.width,
      rs.height);
    this.Camera.projectionMatrix = this.GL.GetProjectionMatrix();

    ///RENDERING
    this.RM.Render( this.Scene, this.Camera);
    //console.log("moEffectImage.Draw", this.Scene, this.Camera, this.Mat.map );


    //this.RM.m_Renderer.setClearColor( ccolor, 1.0);
    //this.RM.m_Renderer.clear(true, true, false);

    this.EndDraw();

  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moEffectImage.Update");
  }

  GetDefinition( p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {

    p_configdefinition = super.GetDefinition(p_configdefinition);

    p_configdefinition.Add( "camera", MO.moParamType.MO_PARAM_TEXT, moCameraParamIndex.CAMERA_TEXTURE, new MO.moValue( "default", "TXT" ) );
    p_configdefinition.Add( "blending", MO.moParamType.MO_PARAM_BLENDING, moCameraParamIndex.CAMERA_BLENDING, new MO.moValue( "0", "NUM" ) );
    p_configdefinition.Add( "pos_tex_x", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_POSTEXX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "pos_tex_y", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_POSTEXY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "anc_tex_x", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_ANCTEXX, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "alt_tex_y", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_ALTTEXY, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "pos_cuad_x", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_POSCUADX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "pos_cuad_y", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_POSCUADY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "anc_cuad_x", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_ANCCUADX, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "alt_cuad_y", MO.moParamType.MO_PARAM_FUNCTION, moCameraParamIndex.CAMERA_ALTCUADY, new MO.moValue( "1.0", "FUNCTION" ) );
    console.log("moEffectCamera.GetDefinition Camera",p_configdefinition);

    return this.m_Config.GetConfigDefinition();
  }

}
