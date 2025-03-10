import * as MO from "moldeojs";

export enum moImageParamIndex {
  IMAGE_INLET=0,
	IMAGE_OUTLET,

  IMAGE_ALPHA,
	IMAGE_COLOR,
	IMAGE_SYNC,
	IMAGE_PHASE,
	IMAGE_TEXTURE,
	/*IMAGE_FILTER,*/
	IMAGE_BLENDING,
	IMAGE_POSTEXX,
	IMAGE_POSTEXY,
	IMAGE_ANCTEXX,
	IMAGE_ALTTEXY,
	IMAGE_POSCUADX,
	IMAGE_POSCUADY,
	IMAGE_ANCCUADX,
	IMAGE_ALTCUADY

};

export class moEffectImage extends MO.moEffect {

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
    this.SetName("image");
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
    this.BeginDraw( p_tempo, p_parentstate );


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
    //console.log(this.Model);

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
    //console.log(rs);
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

  GetDefinition(p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {

    p_configdefinition = super.GetDefinition(p_configdefinition);

    p_configdefinition.Add( "texture", MO.moParamType.MO_PARAM_TEXTURE, moImageParamIndex.IMAGE_TEXTURE, new MO.moValue( "default", "TXT" ) );
    p_configdefinition.Add( "blending", MO.moParamType.MO_PARAM_BLENDING, moImageParamIndex.IMAGE_BLENDING, new MO.moValue( "0", "NUM" ) );
    p_configdefinition.Add( "pos_tex_x", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_POSTEXX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "pos_tex_y", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_POSTEXY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "anc_tex_x", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_ANCTEXX, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "alt_tex_y", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_ALTTEXY, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "pos_cuad_x", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_POSCUADX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "pos_cuad_y", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_POSCUADY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "anc_cuad_x", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_ANCCUADX, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "alt_cuad_y", MO.moParamType.MO_PARAM_FUNCTION, moImageParamIndex.IMAGE_ALTCUADY, new MO.moValue( "1.0", "FUNCTION" ) );
    //console.log("moEffectImage.GetDefinition Image",p_configdefinition);

    return this.m_Config.GetConfigDefinition();
  }

}
