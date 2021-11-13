import * as MO from "moldeojs";
declare var AudioContext, webkitAudioContext: any; // ADDED
declare var FaustModule: any;
declare var faust: any;
declare var noise: any;
declare var wind: any;
//declare var AudioWorkletNode : any;
//declare var AudioWorklet : any;
//declare var AudioWorkletProcessor : any;


import { moEffectSound } from "./sound";
/*

  Check github.com/grammes-fr/faust

  javascript:

  <script src="libfaust-wasm.js"></script>
  <script src="webaudio-wasm-wrapper.js"></script>

*/
//import "p5/lib/addons/p5.dom";

export class moEffectFaust extends moEffectSound {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;
  sound: any  = undefined;
  playing : boolean = false;

  sound_type: any = "sin";//cos,square,sawtooth
  old_sound_type : any = "";

  sound_freq: any = 0.0;
  sound_volume: any = 0.0;
  sound_ramptime: any = 0.0;
  sound_fromnow: any = 0.0;

  isWebKitAudio: any = undefined;
  audio_context: any = undefined;

  noise_dsp: any = undefined;
  wind_dsp: any = undefined;


  constructor() {
    super();
    this.SetName("faust");
    this.isWebKitAudio = (typeof (webkitAudioContext) !== "undefined");
    this.audio_context = (this.isWebKitAudio) ? new webkitAudioContext() : new AudioContext();
    this.sound = null;
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
    //console.log(FaustModule,faust, noise);


    /*const sketch = (s) => {

      s.preload = () => {
        // preload code
      }

      s.setup = () => {
        s.createCanvas(400, 400);
      };

      s.draw = () => {
        s.background(255);
        s.rect(100, 100, 100, 100);
      };
    }

    let canvas = new p5(sketch);
    */

    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
    if (this.PreInit((res) => {
      this.UpdateParameters();
      this.playing = true;
      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  startNoise() : void  {
      // Create the Faust generated node
      var pluginURL = ".";
      var plugin = new noise(this.audio_context, pluginURL);

      plugin.load().then(node => {
                              this.noise_dsp = node;
                              this.sound = node;
                              console.log(this.noise_dsp.getJSON());
                              // Print path to be used with 'setParamValue'
                              console.log(this.noise_dsp.getParams());
                              // Connect it to output as a regular WebAudio node
                              this.noise_dsp.connect(this.audio_context.destination);
                              this.UpdatePlayState();
                        });
  }

  startWind() : any {
    // Create the Faust generated node
    var pluginURL = ".";
    var plugin = new wind(this.audio_context, pluginURL);

    plugin.load().then(node => {
                            this.wind_dsp = node;
                            this.sound = node;
                            console.log(this.wind_dsp.getJSON());
                            // Print path to be used with 'setParamValue'
                            console.log(this.wind_dsp.getParams());
                            // Connect it to output as a regular WebAudio node
                            this.wind_dsp.connect(this.audio_context.destination);
                            this.UpdatePlayState();
                      });

  }

  Draw( p_tempo : MO.moTempo, p_parentstate : MO.moEffectState = null ) : void {
    this.BeginDraw(p_tempo, p_parentstate);


    if (this.RM == undefined) return;


    //console.log("sound_volume:"+sound_volume+" sound_freq:"+sound_freq);
    //this.osc.start();

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
    this.UpdateParameters();

    console.log("moSoundFaust.Update");
  }

  GetDefinition(): MO.moConfigDefinition {
    //console.log("moEffectSound.GetDefinition Erase");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

  UpdatePlayState() : void {
    if (MO.moIsTimerStopped() || MO.moIsTimerPaused() || !this.Activated()) this.audiooff();
    else this.audioon();
  }

  UpdateParameters() : void {
    //console.log("this.Activated()",this.Activated());
    this.UpdatePlayState();

    this.sound_type = this.m_Config.Text("sound_type");
    this.sound_freq = this.m_Config.Eval("sound_freq");
    this.sound_volume = this.m_Config.Eval("sound_volume");
    this.sound_ramptime = this.m_Config.Eval("sound_ramptime");

    if (this.old_sound_type!=this.sound_type) {
      this.old_sound_type = this.sound_type;
      if (this.sound) this.sound.disconnect();
      if (this.sound_type=="noise") {
        this.startNoise();
      } else if (this.sound_type=="wind") {
        this.startWind();
      }
    }

    if (this.noise_dsp && this.playing) {
        this.noise_dsp.setParamValue("/noise/Volume", this.sound_volume);
    }
    if (this.wind_dsp && this.playing) {
        this.wind_dsp.setParamValue("/wind/force", this.sound_volume);
    }
    /*if (this.osc) {
      this.osc.setType(this.sound_type);
      this.osc.freq(this.sound_freq);
      this.osc.amp(this.sound_volume, this.sound_ramptime, 0 );
    }*/
  }

  audioon() :void {
    if (this.sound) {
      if (this.playing) {
      } else {
        this.audio_context.resume();
        this.playing = true;
        console.log("sound playing",this.GetMobDefinition().GetLabelName());
      }
    }
  }

  audiooff() :void {
    if (this.sound) {
      if (this.playing) {
        this.audio_context.suspend();
        this.playing = false;
        console.log("sound stopped",this.GetMobDefinition().GetLabelName());
      } else {
      }
    }
  }

  audioonoff() :void {
    if (this.sound) {
      if (this.playing) {
        this.audio_context.suspend();
        this.playing = false;
        console.log("sound stopped",this.GetMobDefinition().GetLabelName());
      } else {
        this.audio_context.resume();
        this.playing = true;
        console.log("sound playing",this.GetMobDefinition().GetLabelName());
      }
    }
  }



}
