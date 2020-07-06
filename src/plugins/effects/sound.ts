import * as MO from "moldeojs";
import * as p5 from 'p5';
import "p5/lib/addons/p5.sound";
import * as tone from 'tone';
//import "p5/lib/addons/p5.dom";

export class moEffectSound extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;
  osc: any = undefined;
  processor: any = undefined;
  lowfilter: any = undefined;
  analyzer: any = undefined;

  playing : boolean = false;
  elstart : any = undefined;
  divstart : any = undefined;

  sound_type: any = "sin";//cos,square,sawtooth
  sound_freq: any = 0.0;
  sound_volume: any = 0.0;
  sound_ramptime: any = 0.0;
  sound_fromnow: any = 0.0;
  p5 : any = undefined;
  audioContext : any = undefined;

  constructor() {
    super();
    this.SetName("sound");
    //CREATE SOUND INIT BUTTON:
    this.p5 = p5;
    this.elstart = document.getElementById("btn_start");
    this.divstart = document.getElementById("startaudio");
    if (this.elstart || this.divstart) return;

    this.divstart = document.createElement("div");
    this.divstart.setAttribute("id","startaudio");
    this.divstart.setAttribute("style","display: block; position: fixed; z-index: 10001; left: 0px; top: 0px; widtH: 100%; height: 100%; background-color: rgba(0,0,0,0.9);");
    document.body.appendChild(this.divstart);

    this.elstart = document.createElement("button");
    this.elstart.setAttribute("id","btn_start");
    this.elstart.setAttribute("style","display: block; position: relative; left: 50%; top: 50%; margin-left: -50px; margin-top: -50px; border: solid 2px #BBB;width: 100px; height: 100px; color: #BBB; background-color: #000;border-radius: 50px; font-size: 14px;letter-spacing: 2px;font-weight: bold;");
    this.elstart.innerHTML = '<img src="assets/data/icons/favicon.png" height="48" width="48" hspace="8" vpspac="8"/><span>start</span>';
    this.divstart.appendChild( this.elstart );

  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
    console.log(this.p5);
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
      var self = this;
      //this.elstart = document.getElementById("btn_start");
      this.p5.prototype.userStartAudio( this.elstart, function() {
        console.log("p5 userStartAudio: "+self.GetLabelName());
        /*alert(e);*/
        //(window.orientation);
        var landscapeok = window.innerWidth>=window.innerHeight;
        /*try { eval('landscapeok = (window.orientation==undefined) ? (Math.abs(window.screen.orientation) == 90 ) : (Math.abs(window.orientation) == 90);'); }
        catch(err) {alert(err); landscapeok = window.outerWidth>window.outerHeight; }*/
        //alert(landscapeok);
        if (self.divstart && landscapeok) {
          //setTimeout( function() { self.divstart.style.display = 'none'; }, 2000 );
          //self.divstart.style.display = 'none';
          self.divstart.setAttribute("class","ready_to_start");
        }
        if (self.divstart && landscapeok==false) {
          //alert("rotate to start");
          console.log("rotate to start");
          self.divstart.setAttribute("class","rotate_to_start");
        }
        /*THIS IS FOR IOS13 > if already granted this will only confirm it*/
        eval("if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission == 'function') DeviceMotionEvent.requestPermission().then(response => { /*alert(response);*/"+
                "if (response != 'granted') "+
                  "alert('requestPermission '+response+', no utilizaremos los sensores de movimiento.');"+
             "}).catch(function(err) { /*alert(err);*/ });");

        {
          self.elstart.addEventListener( 'click', function(event) {
            console.log(event);
            var landscapeok = window.innerWidth>=window.innerHeight;
            /*try { eval('landscapeok = (window.orientation==undefined) ? (Math.abs(window.screen.orientation) == 90 ) : (Math.abs(window.orientation) == 90);'); }
            catch(err) {alert(err); landscapeok = window.outerWidth>window.outerHeight; }*/
            //alert(landscapeok);
            //MEJORAR EL MENSAJE: que los mensajes aparezcan abajo del BOTON... en ROJITO (que puedas volver a cliquear sobre el texto rojito)
            try {
            eval("/*alert('request motion click');*/ if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission == 'function') DeviceMotionEvent.requestPermission().then(response => { /*alert(response);*/"+
                    "if (response != 'granted') "+
                      "alert('requestPermission '+response+', no utilizaremos los sensores de movimiento.');"+
                 "}).catch(function(err) { /*alert(err);*/ });");
            } catch(err) { alert(err); }

            if (landscapeok) self.divstart.style.display = 'none';
            else { alert("Rotar el teléfono a posición apaisada"); }
          } );
          window.addEventListener('orientationchange', function(event) {
            var landscapeok = window.innerWidth>=window.innerHeight;
            console.log(event);
            try { eval('landscapeok = (window.orientation==undefined) ? (Math.abs(window.screen.orientation) == 90 ) : (Math.abs(window.orientation) == 90);'); }
            catch(err) {alert(err); landscapeok = window.innerWidth>=window.innerHeight; }
            //CAMBIAR CLASE PARA QUE DIGA OK PRESIONA EL BOTON
            if (landscapeok==false) { self.divstart.style.display = 'block'; self.divstart.setAttribute("class","rotate_to_start"); console.log("rotate to start");}
            if (landscapeok==true) { self.divstart.setAttribute("class","ready_to_start"); console.log("ready_to_start");}
          }, false);
        }

        //eval("var elem = document.documentElement; if (elem) if (elem.requestFullscreen) elem.requestFullscreen();");

        self.sound_type = self.m_Config.Text("sound_type");
        self.audioContext =  self.p5.prototype.getAudioContext();
        if ( self.sound_type == "pinknoise" ) {
          var bufferSize = 8192;
          self.lowfilter = self.audioContext.createBiquadFilter();
          self.lowfilter.type = "lowpass";
          self.lowfilter.frequency.value = 10000;
          self.analyzer = self.audioContext.createAnalyser();


          self.processor = (function() {
              var b0, b1, b2, b3, b4, b5, b6;
              b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
              var node = self.audioContext.createScriptProcessor(bufferSize, 0, 2);
              node.onaudioprocess = function(e) {
                  if (window["oap"]==undefined) {
                    //alert("onaudioprocess ok " + bufferSize+" / "+node.bufferSize);
                    window["oap"]=true;
                  }
                  self.lowfilter.frequency.value = self.sound_freq;
                  var output = e.outputBuffer.getChannelData(0);
                  var output2 = e.outputBuffer.getChannelData(1);
                  //APLICAR PASABAJO con self.sound_freq...
                  for (var i = 0; i < self.processor.bufferSize; i++) {
                      var white = Math.random() * 2 - 1;//-1.0 y 1.0
                      b0 = 0.99886 * b0 + white * 0.0555179;
                      b1 = 0.99332 * b1 + white * 0.0750759;
                      b2 = 0.96900 * b2 + white * 0.1538520;
                      b3 = 0.86650 * b3 + white * 0.3104856;
                      b4 = 0.55000 * b4 + white * 0.5329522;
                      b5 = -0.7616 * b5 - white * 0.0168980;
                      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                      output[i] *= 0.11;
                      output[i] *= Math.max(0.0,Math.min(1.0,self.sound_volume)); // (roughly) compensate for gain
                      output2[i] = output[i];
                      b6 = white * 0.115926;
                  }
              }
              return node;
          })();

          if (self.processor) {
            self.processor.connect(self.lowfilter);
            self.lowfilter.connect(self.audioContext.destination);
          } else {
            alert(self.processor);
          }
          if (self.audioContext && self.audioContext.destination) {
              //
          } else {
            alert(self.audioContext.destination);
          }
        } else if (self.sound_type == "whitenoise") {
          var bufferSize = 8192;
          self.processor = (function() {
              var node = self.audioContext.createScriptProcessor(bufferSize, 0, 2);
              node.onaudioprocess = function(e) {
                  var output = e.outputBuffer.getChannelData(0);
                  var output2 = e.outputBuffer.getChannelData(1);
                  //APLICAR PASABAJO con self.sound_freq...
                  for (var i = 0; i < self.processor.bufferSize; i++) {
                      var white = Math.random() * 2 - 1;//-1.0 y 1.0
                      output[i] = white;
                      output[i] *= Math.max(0.0,Math.min(1.0,self.sound_volume));
                      output2[i] = output[i];
                  }
              }
              return node;
          })();

          if (self.processor) {
            self.processor.connect(self.audioContext.destination);
          } else {
            alert(self.processor);
          }
          if (self.audioContext && self.audioContext.destination) {
              //
          } else {
            alert(self.audioContext.destination);
          }
        } else {

          self.osc = new self.p5.Oscillator();
          self.osc.setType(self.sound_type);
          self.osc.freq(7.83*4);
          self.osc.amp(0.0);
          self.osc.start();

        }

        self.playing = true;
        if (callback) callback(res);
      } );
    }) == false) {
      return false;
    }
    return true;
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

    if (this.IsInitialized()) {
        if (this.ScriptHasFunction("Draw")) {
            this.SelectScriptFunction("Draw");
            //this.AddFunctionParam( i + j*this.m_cols);
            //this.AddFunctionParam( this.dt );
            if (!this.RunSelectedFunction(1)) {
                //this.MODebug2.Error( moText("RunParticle function not executed") );
            }
        }
    }

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

    //console.log("moEffectIcon.Update");
  }

  GetDefinition(): MO.moConfigDefinition {
    //console.log("moEffectSound.GetDefinition Erase");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

  UpdateParameters() : void {
    if (MO.moIsTimerStopped() || MO.moIsTimerPaused()) this.audiooff();
    else this.audioon();

    this.sound_type = this.m_Config.Text("sound_type");
    this.sound_freq = this.m_Config.Eval("sound_freq");
    this.sound_volume = this.m_Config.Eval("sound_volume");
    this.sound_ramptime = this.m_Config.Eval("sound_ramptime");
    if (this.osc && this.sound_type!="pinknoise" && this.sound_type!="") {
      this.osc.setType(this.sound_type);
      this.osc.freq(this.sound_freq);
      this.osc.amp(this.sound_volume, this.sound_ramptime, 0 /*time from now*/);
    }
  }

  audioon() :void {
    if (this.playing) {
    } else {
      if (this.osc) this.osc.start();
      if (this.processor) this.processor.connect(this.audioContext.destination);
      this.playing = true;
      console.log("sound playing",this.GetMobDefinition().GetLabelName());
    }
  }

  audiooff() :void {

    if (this.playing) {
      if (this.osc) this.osc.stop();
      if (this.processor) this.processor.disconnect();
      this.playing = false;
      console.log("sound stopped",this.GetMobDefinition().GetLabelName());
    } else {
    }
  }

  audioonoff() :void {
    if (this.playing) {
      if (this.osc) this.osc.stop();
      if (this.processor) this.processor.disconnect();
      this.playing = false;
      console.log("sound stopped",this.GetMobDefinition().GetLabelName());
    } else {
      if (this.osc) this.osc.start();
      if (this.processor) this.processor.connect(this.audioContext.destination);
      this.playing = true;
      console.log("sound playing",this.GetMobDefinition().GetLabelName());
    }
  }
}
