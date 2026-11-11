import * as MO from "moldeojs";
import * as THREE from "three";

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
      this.Mat.map = this.Video() || this.m_Config.Texture("texture")._texture;
      this.Mat.transparent = true;
      this.Mat.color = ccolor;
      this.Mat.opacity = this.m_Config.Eval("alpha");
      this.Revelar();
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

  /**
   * #918 B5 — «revelar»: params OPCIONALES del image (si no están, nada cambia).
   *   revela_mapa (TEXTURE) — mapa en gris: blanco = aparece primero, negro = aparece último (p. ej. el orden de los trazos)
   *   revela      (FUNCTION 0..1) — cuánto está revelado; un píxel se ve cuando mapa ≥ 1 − revela
   * Se hace con un uniform inyectado en el shader (onBeforeCompile): en three r110 `alphaTest` es un #define y animarlo
   * recompilaría el programa con cada valor. El mapa sólo decide qué se descarta: no multiplica la transparencia.
   */
  private revelaU: any = null;
  private Revelar(): void {
    const byName = this.m_Config.m_ParamsByName;
    if (!byName || !byName["revela_mapa"]) return;
    const t: any = this.m_Config.Texture("revela_mapa");
    const tex = t && t._texture;
    if (!tex) return;
    if (!this.revelaU) {
      this.revelaU = { value: 0 };
      const U = this.revelaU;
      (this.Mat as any).onBeforeCompile = (shader: any) => {
        shader.uniforms.moRevela = U;
        shader.fragmentShader = "uniform float moRevela;\n" + shader.fragmentShader
          .replace("#include <alphamap_fragment>", "")
          .replace("#include <alphatest_fragment>", "if ( texture2D( alphaMap, vUv ).g < 1.0 - moRevela ) discard;");
      };
    }
    if (this.Mat.alphaMap !== tex) { this.Mat.alphaMap = tex; this.Mat.needsUpdate = true; }
    const r = Number(this.m_Config.Eval("revela"));
    this.revelaU.value = isNaN(r) ? 1 : Math.max(0, Math.min(1.0001, r));
  }

  /**
   * #918 B5·N5b — video como textura: params OPCIONALES del image (si no están, nada cambia).
   *   video   (TXT)      archivo .mp4/.webm del proyecto (mismo directorio que el .mol)
   *   video_t (FUNCTION) segundos dentro del clip que tienen que verse ahora (la expresión manda: así el reel se re-ritma igual
   *                      que las demás capas). Si el video se aleja más de 0,15 s ⇒ seek. Con alpha ≤ 0 el video se pausa.
   * Sin sonido (muted): es material visual; el audio del reel va aparte.
   */
  private vid: HTMLVideoElement = null;
  private vtex: any = null;
  private Video(): any {
    const byName = this.m_Config.m_ParamsByName;
    if (!byName || !byName["video"]) return null;
    if (!this.vid) {
      const name = ("" + this.m_Config.Text("video")).trim();
      if (!name) return null;
      let base = "";
      try { const mol = new URLSearchParams(window.location.search).get("mol") || ""; base = mol.replace(/[^\/]*$/, ""); } catch (e) {}
      const v = document.createElement("video");
      v.muted = true; (v as any).playsInline = true; v.loop = false; v.preload = "auto"; v.crossOrigin = "anonymous";
      v.setAttribute("playsinline", ""); v.src = base + name;
      this.vid = v;
      this.vtex = new THREE.VideoTexture(v);
      this.vtex.minFilter = THREE.LinearFilter; this.vtex.magFilter = THREE.LinearFilter;
    }
    const v = this.vid;
    const visible = Number(this.m_Config.Eval("alpha")) > 0;
    if (!visible) { if (!v.paused) v.pause(); return this.vtex; }
    const t = byName["video_t"] ? Number(this.m_Config.Eval("video_t")) : NaN;
    if (!isNaN(t) && v.readyState >= 1) {
      const tt = Math.max(0, Math.min(t, (v.duration || t) - 0.05));
      if (Math.abs(v.currentTime - tt) > 0.15) v.currentTime = tt;
    }
    if (v.paused) { const pr: any = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
    return this.vtex;
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
