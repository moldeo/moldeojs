import * as MO from "moldeojs";

export enum moIconParamIndex {
  ICON_INLET=0,
  ICON_OUTLET,
  ICON_SCRIPT,
	ICON_ALPHA,
	ICON_COLOR,
	ICON_SYNC,
	ICON_PHASE,

  ICON_TEXTURE,
  ICON_BLENDING,
  ICON_WIDTH,
  ICON_HEIGHT,
  ICON_TRANSLATEX,
  ICON_TRANSLATEY,
  ICON_ROTATE,
  ICON_SCALEX,
  ICON_SCALEY

};


export class moEffectIcon extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;

  constructor() {
    super();
    this.SetName("icon");
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
    if (this.PreInit((res) => {
      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Draw( p_tempo : MO.moTempo, p_parentstate : MO.moEffectState = null ) : void {
    this.BeginDraw(p_tempo, p_parentstate);


    if (this.RM == undefined) return;

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgb.r, rgb.g, rgb.b);


    ///MESH MATERIAL
    if (this.Mat==undefined) {
      this.Mat = new MO.moMaterialBasic();
    }
    if (this.Mat) {
      this.Mat.map = this.m_Config.Texture("texture")._texture;
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
      this.Plane = new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1);
    }

    if (this.Plane) {
      if (this.Plane.m_Width != this.m_Config.Eval("width")
        || this.Plane.m_Height != this.m_Config.Eval("height")) {
        Object.assign(this.Plane, new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1));
      }
    }

    ///MESH MODEL
    if (this.Model==undefined)
      this.Model = new MO.moGLMatrixf().MakeIdentity();

    if (this.Model) {


      this.Model.Scale(
        this.m_Config.Eval("scalex"),
        this.m_Config.Eval("scaley"),
      1.0);

      this.Model.Rotate(
          -this.m_Config.Eval("rotate")*MO.moMath.DEG_TO_RAD,
          0.0,
          0.0,
          1.0);
      //console.log("this.m_Config.Eval(anc_cuad_x)",
      //  this.m_Config.Eval("anc_cuad_x"),
      //  this.m_Config.Eval("alt_cuad_y"));
      this.Model.Translate(
          this.m_Config.Eval("translatex"),
          this.m_Config.Eval("translatey"),
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
    //console.log("moEffectIcon.Update");
  }

  GetDefinition(p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {

    p_configdefinition = super.GetDefinition(p_configdefinition);

    p_configdefinition.Add( "texture", MO.moParamType.MO_PARAM_TEXTURE, moIconParamIndex.ICON_TEXTURE, new MO.moValue( "default", "TXT" ) );
    p_configdefinition.Add( "blending", MO.moParamType.MO_PARAM_BLENDING, moIconParamIndex.ICON_BLENDING, new MO.moValue( "0", "NUM" ) );
    p_configdefinition.Add( "width", MO.moParamType.MO_PARAM_FUNCTION, moIconParamIndex.ICON_WIDTH, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "height", MO.moParamType.MO_PARAM_FUNCTION, moIconParamIndex.ICON_HEIGHT, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "translatex", MO.moParamType.MO_PARAM_TRANSLATEX, moIconParamIndex.ICON_TRANSLATEX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "translatey", MO.moParamType.MO_PARAM_TRANSLATEY, moIconParamIndex.ICON_TRANSLATEY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "rotate", MO.moParamType.MO_PARAM_ROTATEZ, moIconParamIndex.ICON_ROTATE );
    p_configdefinition.Add( "scalex", MO.moParamType.MO_PARAM_SCALEX, moIconParamIndex.ICON_SCALEX );
    p_configdefinition.Add( "scaley", MO.moParamType.MO_PARAM_SCALEY, moIconParamIndex.ICON_SCALEY );
    console.log("moEffectIcon.GetDefinition Erase",p_configdefinition);

    return this.m_Config.GetConfigDefinition();
  }

}
