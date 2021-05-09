import * as MO from "moldeojs";

export enum moPlaneParamIndex {
  PLANE_INLET=0,
	PLANE_OUTLET,
	PLANE_ALPHA,
	PLANE_COLOR,
	PLANE_SYNC,
	PLANE_PHASE,
	PLANE_TEXTURE,
	PLANE_BLENDING,
	PLANE_WIDTH,
	PLANE_HEIGHT,
	PLANE_TRANSLATEX,
	PLANE_TRANSLATEY,
	PLANE_TRANSLATEZ,
	PLANE_ROTATEX,
	PLANE_ROTATEY,
	PLANE_ROTATEZ,
	PLANE_SCALEX,
	PLANE_SCALEY,
	PLANE_SCALEZ
};

export class moEffectPlane extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  PlaneB: MO.moPlaneGeometry;

  Mat: MO.moMaterialBasic;
  MatB: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  ModelB: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  MeshB: MO.moMesh;
  Scene: MO.moSceneNode;

  constructor() {
    super();
    this.SetName("plane");
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
    //console.log("ccolor:", rgb.r,rgb.g,rgb.b, ccolor);
    var rgbflip: any = this.m_Config.EvalColor("colorflip");
    var ccolorflip: MO.moColor = new MO.moColor( rgbflip.r, rgbflip.g, rgbflip.b);
    //console.log("ccolorflip:", rgbflip.r,rgbflip.g,rgbflip.b, ccolorflip);

    ///MESH MATERIAL
    if (this.Mat==undefined) {
      this.Mat = new MO.moMaterialBasic();
      this.MatB = new MO.moMaterialBasic();
    }
    if (this.Mat) {
      this.Mat.transparent = true;
      this.Mat.color = ccolor;
      this.Mat.vertexColors = MO.three.VertexColors;
      this.Mat.needsUpdate = true;
      //this.Mat.side = MO.three.FrontSide;
      // /CullFaceFrontBack
      this.Mat.side = MO.three.DoubleSide;
      this.Mat.opacity = this.m_Config.Eval("alpha");
      this.Mat.map = this.m_Config.Texture("texture")._texture;

      this.MatB.transparent = true;
      this.MatB.color = ccolorflip;
      this.MatB.vertexColors = MO.three.VertexColors;
      this.MatB.needsUpdate = true;
      this.MatB.side = MO.three.FrontSide;
      this.MatB.opacity = this.m_Config.Eval("alpha");
      this.MatB.map = this.m_Config.Texture("textureflip")._texture;
      //console.log("this.m_Config.Texture(textureflip)", this.Mat,this.MatB,this.GetResourceManager().GetTextureMan());

    }

    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.Normalize();

    ///MESH GEOMETRY
    //if (this.Plane == undefined) {
      this.Plane = new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1);
      this.PlaneB = new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1);
    //}
    if (this.Plane) {

      if (this.Plane.m_Width != this.m_Config.Eval("width")
        || this.Plane.m_Height != this.m_Config.Eval("height")) {
        Object.assign(this.Plane, new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1));
      }
      this.Plane.colors = [ccolor, ccolor, ccolor, ccolor];
      this.Plane.colorsNeedUpdate = true;


      if (this.PlaneB.m_Width != this.m_Config.Eval("width")
        || this.PlaneB.m_Height != this.m_Config.Eval("height")) {
        Object.assign(this.PlaneB, new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1));
      }
      this.PlaneB.colors = [ccolorflip, ccolorflip, ccolorflip, ccolorflip];
      this.PlaneB.colorsNeedUpdate = true;

    }

    ///MESH MODEL
    if (this.Model == undefined) {
    this.Model = new MO.moGLMatrixf().MakeIdentity();
    this.ModelB = new MO.moGLMatrixf().MakeIdentity();
    }

    if (this.Model) {
      /// === MODEL A ====
      this.Model.MakeIdentity();
      this.Model.Scale(
        this.m_Config.Eval("scalex"),
        this.m_Config.Eval("scaley"),
        this.m_Config.Eval("scalez"));

      this.Model.Rotate(this.m_Config.Eval("rotatez") * MO.DEG_TO_RAD, 0.0, 0.0, 1.0);
      this.Model.Rotate( this.m_Config.Eval("rotatey")*MO.DEG_TO_RAD, 0.0, 1.0, 0.0);
      this.Model.Rotate( this.m_Config.Eval("rotatex")*MO.DEG_TO_RAD, 1.0, 0.0, 0.0);

      this.Model.Translate(
          this.m_Config.Eval("translatex"),
          this.m_Config.Eval("translatey"),
          this.m_Config.Eval("translatez"));

      /// === MODEL B ====

      this.ModelB.Scale(
          this.m_Config.Eval("scalex"),
          this.m_Config.Eval("scaley"),
          this.m_Config.Eval("scalez"));

      //this.ModelB.Rotate( MO.PI, 0.0, 1.0, 0.0);
      this.ModelB.Rotate(this.m_Config.Eval("rotatez") * MO.DEG_TO_RAD, 0.0, 0.0, 1.0);
      this.ModelB.Rotate( MO.PI+this.m_Config.Eval("rotatey") * MO.DEG_TO_RAD, 0.0, 1.0, 0.0);
      this.ModelB.Rotate( this.m_Config.Eval("rotatex")*MO.DEG_TO_RAD, 1.0, 0.0, 0.0);

      this.ModelB.Translate(
          this.m_Config.Eval("translatex"),
          this.m_Config.Eval("translatey"),
          this.m_Config.Eval("translatez"));

    }

    if (this.Mesh==undefined) {
      this.Mesh = new MO.moMesh(this.Plane, this.Mat);
      this.Mesh.add(new MO.three.AxesHelper());
      this.MeshB = new MO.moMesh( this.PlaneB, this.MatB );
      this.MeshB.add(new MO.three.AxesHelper());
    }
    if (this.Mesh && this.Model) {
      this.Mesh.SetModelMatrix(this.Model);
      this.MeshB.SetModelMatrix(this.ModelB);
      //var _elements : any = this.Model.elements;
      //console.log(this.Mesh,this.Model,"ry:",this.m_Config.Eval("rotatey"), "tx:",this.m_Config.Eval("translatex"), _elements[12]);
    }

    if (this.Scene==undefined) {
      this.Scene = new MO.moSceneNode();
      this.Scene.add(this.Mesh);
      //this.Scene.add(this.MeshB);
    }


    ///CAMERA PERSPECTIVE
    if (this.Camera == undefined) {
      this.Camera = new MO.moCamera3D();
      this.Camera.frustumCulled = true;
      this.Camera.castShadow = false;
    }
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
  }

  GetDefinition(p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {

    p_configdefinition = super.GetDefinition(p_configdefinition);

    p_configdefinition.Add( "texture", MO.moParamType.MO_PARAM_TEXTURE, moPlaneParamIndex.PLANE_TEXTURE, new MO.moValue( "default", "TXT" ) );
    p_configdefinition.Add( "blending", MO.moParamType.MO_PARAM_BLENDING, moPlaneParamIndex.PLANE_BLENDING, new MO.moValue( "0", "NUM" ) );

    p_configdefinition.Add( "translatex", MO.moParamType.MO_PARAM_TRANSLATEX, moPlaneParamIndex.PLANE_TRANSLATEX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "translatey", MO.moParamType.MO_PARAM_TRANSLATEY, moPlaneParamIndex.PLANE_TRANSLATEY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "translatez", MO.moParamType.MO_PARAM_TRANSLATEZ, moPlaneParamIndex.PLANE_TRANSLATEZ, new MO.moValue( "0.0", "FUNCTION" ) );

    p_configdefinition.Add( "rotatex", MO.moParamType.MO_PARAM_ROTATEX, moPlaneParamIndex.PLANE_ROTATEX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "rotatey", MO.moParamType.MO_PARAM_ROTATEY, moPlaneParamIndex.PLANE_ROTATEY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "rotatez", MO.moParamType.MO_PARAM_ROTATEZ, moPlaneParamIndex.PLANE_ROTATEZ, new MO.moValue( "0.0", "FUNCTION" ) );

    p_configdefinition.Add( "scalex", MO.moParamType.MO_PARAM_SCALEX, moPlaneParamIndex.PLANE_SCALEX, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "scaley", MO.moParamType.MO_PARAM_SCALEY, moPlaneParamIndex.PLANE_SCALEY, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "scalez", MO.moParamType.MO_PARAM_SCALEZ, moPlaneParamIndex.PLANE_SCALEZ, new MO.moValue( "1.0", "FUNCTION" ) );
    console.log("moEffectPlane.GetDefinition Plane",p_configdefinition);

    return this.m_Config.GetConfigDefinition();
  }

}
