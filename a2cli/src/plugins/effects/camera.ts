import * as MO from "moldeojs";

export class moEffectCamera extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;

  canvas: any;
  context: any;

  constructor() {
    super();
    this.SetName("camera");
    /////////////////////////////
    let vid = document.createElement("VIDEO");
    vid.setAttribute("style", "display:none;");
    document.body.appendChild(vid);
    let can = document.createElement("CANVAS");
    can.setAttribute("id", "moCanvasVideo");
    can.setAttribute("style", "display:none;");
    document.body.appendChild(can);
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    let video = document.querySelector('video');
    let n = <any>navigator;

    n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );

    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
    if (this.PreInit((res) => {

      let constraints:any = {
        audio: false,
        video: {
          width: {ideal:this.m_Config.Int("width")},
          height: {ideal:this.m_Config.Int("height")}
        }
      };

      if (n.mediaDevices === undefined) { //For Old Browsers
        n.mediaDevices = {};
      } //END mediaDevices for old browsers

      if (n.mediaDevices.getUserMedia === undefined) {  //Check the existence of getUserMedia
        n.mediaDevices.getUserMedia = function(constraints) {

          var getUserMedia = n.webkitGetUserMedia || n.mozGetUserMedia;

          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }

          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }//END check for getUserMedia

      n.mediaDevices.getUserMedia(constraints).then(function(stream) {
        if ("srcObject" in video) {
          video.srcObject = stream;
        } else {
          video.src = window.URL.createObjectURL(stream);//video.src just for older implementations
        }
        video.onloadedmetadata = function(e) {
          video.play();
        };
      });

      this.canvas = document.getElementById('moCanvasVideo');
      this.context = this.canvas.getContext('2d');

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
      //Texture of WebCam
      this.context.drawImage(document.querySelector('video'), 0, 0, this.canvas.width, this.canvas.height);
      let texture = new MO.three.Texture(this.canvas);
      texture.minFilter = MO.three.LinearFilter;
      texture.needsUpdate = true;//Important for update
      this.Mat.map = texture;
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

    this.GL.SetDefaultOrthographicView(
      this.RM.m_Renderer.getSize().width,
      this.RM.m_Renderer.getSize().height);
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
