import * as MO from "moldeojs";

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
    console.log("InitDevice",camera);
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
    console.log("CheckIfDeviceNameExists",camera);

    var CapDevs : MO.moCaptureDevices = this.VMan.GetCaptureDevices(true);

    for( c=0; c<this.VMan.GetCameraCount(); c++ ) {
      var Cam : MO.moLiveSystem = this.VMan.GetCamera(c);
      if (Cam) {
        if (Cam.GetCaptureDevice().GetName()==camera
      || Cam.GetCaptureDevice().GetLabelName()==camera ) {
          console.log("CheckIfDeviceNameExists: founded",camera);
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
    if (this.Plane == undefined) {
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

    if (this.Mesh==undefined) {
      this.Mesh = new MO.moMesh( this.Plane, this.Mat );
    }
    if (this.Mesh && this.Model) {
      this.Mesh.SetModelMatrix(this.Model);
    }

    if (this.Scene==undefined) {
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

  GetDefinition(): MO.moConfigDefinition {
    console.log("moEffectCamera.GetDefinition Erase");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
