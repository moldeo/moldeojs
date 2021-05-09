import * as MO from "moldeojs";
var THREE = MO.three;

export class moPreEffectMirrorG extends MO.moPreEffect {

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
    this.SetName("mirrorg");
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
    console.log(`moPreEffect${this.GetName()}.Init`);
    if (this.PreInit((res) => {

      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Draw( p_tempo : MO.moTempo ) : void {

    //console.log("moPreEffectMirrorG.Draw >");
    //this.RM = this.m_pResourceManager.GetRenderMan();
    if (this.RM == undefined) return;
    this.BeginDraw(p_tempo);

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgb.r, rgb.g, rgb.b);

    ///MESH MATERIAL
    if (this.Mat==undefined && this.RM.m_FxTexture) {
      this.Mat = new MO.moMaterialBasic( { map: this.RM.m_FxTexture });
    }
    if (this.Mat && this.RM.m_FxTexture) {
      //this.Mat.map = this.m_Config.Texture("texture")._texture;
      if (this.RM.m_FxTexture) {
        this.Mat.map = this.RM.m_FxTexture;
        //this.Mat.map.needsUpdate = true;
      }
      //console.log(this.RM.m_FxTexture, this.Scene);
      this.Mat.transparent = true;
      this.Mat.color = ccolor;
      this.Mat.opacity = this.m_Config.Eval("alpha")*rgb.a;
      var blendings = [
      					{ name: 'No', constant: THREE.NoBlending },
      					{ name: 'Normal', constant: THREE.NormalBlending },
      					{ name: 'Additive', constant: THREE.AdditiveBlending },
      					{ name: 'Subtractive', constant: THREE.SubtractiveBlending },
      					{ name: 'Multiply', constant: THREE.MultiplyBlending }
      				];
      this.Mat.blending = THREE.NormalBlending;
    }

    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.Normalize();

    ///MESH GEOMETRY
    if (this.Plane == undefined || this.RM.m_bUpdated) {
      this.Plane = new MO.moPlaneGeometry( 1.0, 1.0/this.RM.Proportion(), 1, 1 );
    }

    ///MESH MODEL
    if (this.Model==undefined)
      this.Model = new MO.moGLMatrixf().MakeIdentity();

    if (this.Model) {
      this.Model.Scale(1.0,
        1.0,
        1.0);
      this.Model.Translate(
          0.0,
          0.0,
          0.0);
    }
    //console.log(this.Model);

    if ( (this.Mesh==undefined || this.RM.m_bUpdated) && this.Plane && this.Mat) {
      this.Mesh = new MO.moMesh( this.Plane, this.Mat );
    }
    if (this.Mesh && this.Model) {
      this.Mesh.SetModelMatrix(this.Model);
    }

    if ( (this.Scene==undefined || this.RM.m_bUpdated) && this.Mesh) {
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
    if (this.Scene && this.Camera)
      this.RM.Render( this.Scene, this.Camera);

    this.EndDraw();
  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moPreEffectErase.Update Erase");
  }

  GetDefinition(): MO.moConfigDefinition {
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
