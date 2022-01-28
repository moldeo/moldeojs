import { moEffectState } from "./mo-effect-state";
export { moEffectState } from "./mo-effect-state";
import * as THREE from 'three';
import {
  moConfig, moConfigDefinition,
  MO_PARAM_NOT_FOUND, MO_PARAM_NOT_SEL, MO_SELECTED,
  MO_CONFIG_OK, MO_CONFIGFILE_NOT_FOUND
} from "./mo-config";
import { moMoldeoObject, moMobState, MO_IODEVICE_KEYBOARD, MO_IODEVICE_MOUSE, MO_IODEVICE_MOBILE } from "./mo-moldeo-object";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { moBlendingModes, moBlendingModesStr, moBlendingModesToText } from "./mo-blending-modes.enum";
import { moMaterialBasic } from "./mo-gui-manager";
import { moEffectManager } from "./mo-effect-manager";
import { moIODeviceManager, moIODeviceCode, moIODeviceMobileCode } from "./mo-iodevice-manager";
import { moConsoleState } from "./mo-console-state";
import { moTempo } from "./mo-tempo";
import { moParamType, moParamTypeStrs, moParamTypeToText } from "./mo-param";
import { moDataType, moData, moValue, moDataTypeStr } from "./mo-value";
import {
  MO_DEACTIVATED, MO_ACTIVATED,
  MO_ON, MO_OFF, MO_ERROR, MO_TRUE, MO_FALSE,
  MOint, MOdouble
} from "./mo-types";
import { moInlet, moOutlet, moConnector, moConnections } from "./mo-connectors";
import * as moMath from "./mo-math";
import { moMathFunction } from "./mo-math-manager";
import { moTimerState, moTimer } from "./mo-timer";
import { moEvent, moEventList } from "./mo-event-list";

export class moEffect extends moMoldeoObject {

  m_EffectState: moEffectState;

  Mat: moMaterialBasic;

  InletTime: moInlet;
  InletTimems: moInlet;
  InletTimes: moInlet;
  InletTempo: moInlet;
  InletT: moInlet;
  InletMilliseconds: moInlet;
  InletSeconds : moInlet;
  InletSecondsS : moInlet;

  InletMouseX : moInlet;
  InletMouseY : moInlet;
  InletMouseFactor : moInlet;
  InletMouseButtonLeft : moInlet;
  InletMouseButtonRight : moInlet;
  InletMouseButtonMiddle : moInlet;
  InletMouseXButtonLeft : moInlet;
  InletMouseXButtonRight : moInlet;
  InletMouseXButtonMiddle : moInlet;
  InletMouseYButtonLeft : moInlet;
  InletMouseYButtonRight : moInlet;
  InletMouseYButtonMiddle : moInlet;

  InletMouseXWheel : moInlet;
  InletMouseYWheel : moInlet;
  InletMouseZWheel : moInlet;

  InletAccVelY: moInlet;
  InletAccVelX: moInlet;
  InletAccVelZ: moInlet;

  InletAccX: moInlet;
  InletAccY: moInlet;
  InletAccZ: moInlet;

  InletAccGX: moInlet;
  InletAccGY: moInlet;
  InletAccGZ: moInlet;

  InletRotX: moInlet;
  InletRotY: moInlet;
  InletRotZ: moInlet;

  InletVelocity: moInlet;
  InletVelocityX: moInlet;
  InletVelocityY: moInlet;
  InletVelocityZ: moInlet;

  InletMouseVelocity: moInlet;
  InletMouseVelocityX: moInlet;
  InletMouseVelocityY: moInlet;
  InletMouseVelocityZ: moInlet;

  mousex : MOdouble = 0.0;
  mousey : MOdouble = 0.0;
  mousex_old : MOdouble = 0.0;
  mousey_old : MOdouble = 0.0;
  mousexrel : MOdouble = 0.0;
  mouseyrel : MOdouble = 0.0;
  mousexleft_old : MOdouble = 0.0;
  mouseyleft_old : MOdouble = 0.0;
  mousexrel_left : MOdouble = 0.0;
  mouseyrel_left : MOdouble = 0.0;
  mousefactor : MOdouble = 0.0;
  //button left
  mousebuttonleft : MOdouble = 0.0;
  mousexbuttonleft : MOdouble = 0.0;
  mouseybuttonleft : MOdouble = 0.0;
  //button right
  mousebuttonright : MOdouble = 0.0;
  mousexbuttonright : MOdouble = 0.0;
  mouseybuttonright : MOdouble = 0.0;
  //button middle
  mousebuttonmiddle : MOdouble = 0.0;
  mousexbuttonmiddle : MOdouble = 0.0;
  mouseybuttonmiddle : MOdouble = 0.0;

  accelerationgx : MOdouble = 0.0;
  accelerationgy : MOdouble = 0.0;
  accelerationgz : MOdouble = 0.0;

  accelerationx : MOdouble = 0.0;
  accelerationy : MOdouble = 0.0;
  accelerationz : MOdouble = 0.0;

  rotationx : MOdouble = 0.0;
  rotationy : MOdouble = 0.0;
  rotationz : MOdouble = 0.0;

  timestamp : any = 0;

  velocity : MOdouble = 0.0;
  velocityx : MOdouble = 0.0;
  velocityy : MOdouble = 0.0;
  velocityz : MOdouble = 0.0;

  mousevelocity : MOdouble = 0.0;
  mousevelocityx : MOdouble = 0.0;
  mousevelocityy : MOdouble = 0.0;
  mousevelocityz : MOdouble = 0.0;

  accelerationvelx : MOdouble = 0.0;
  accelerationvely : MOdouble = 0.0;
  accelerationvelz : MOdouble = 0.0;

  isyncro: MOint = -1;
  iphase: MOint = -1;

  mousexwheel : MOdouble = 0.0;
  mouseywheel : MOdouble = 0.0;
  mousezwheel : MOdouble = 0.0;
  mousewheeldeltamode : MOdouble = 0.0;
  lax : any = 0.0;
  lay : any = 0.0;
  laz : any = 0.0;
  la : any = 0.0;
  dT : any = 1.0;
  laccx : any = 0.0;
  laccy : any = 0.0;
  laccz : any = 0.0;
  lacc : any = 0.0;
  laccmax : any = 0.0;
  laccmaxcut : any = 0.0;
  laccsum : any = "";

  constructor() {
    super();
    this.m_EffectState = new moEffectState();
    this.SetType(moMoldeoObjectType.MO_OBJECT_EFFECT);
  }

  PreInit(callback?:any): boolean {
    this.m_EffectState.Init();
    if (this.m_pResourceManager == undefined) {
      console.error("no resource manager");
      return false;
    }

    this.InletTimems = this.AddInlet("timems","DOUBLE");
    this.InletTimes = this.AddInlet("times","DOUBLE");
    this.InletTime = this.AddInlet("time","DOUBLE");
    this.InletTempo = this.AddInlet("tempo","DOUBLE");
    this.InletT = this.AddInlet("t","DOUBLE");
    this.InletMilliseconds = this.AddInlet("milliseconds","DOUBLE");
    this.InletSeconds = this.AddInlet("seconds","DOUBLE");
    this.InletSecondsS = this.AddInlet("s","DOUBLE");
    this.InletMouseX = this.AddInlet("mousex","DOUBLE");
    this.InletMouseY = this.AddInlet("mousey","DOUBLE");

    this.InletMouseButtonLeft = this.AddInlet("mousebuttonleft", "DOUBLE");
    this.InletMouseButtonMiddle = this.AddInlet("mousebuttonmiddle", "DOUBLE");
    this.InletMouseButtonRight = this.AddInlet("mousebuttonright", "DOUBLE");

    this.InletMouseXButtonLeft = this.AddInlet("mousexbuttonleft","DOUBLE");
    this.InletMouseYButtonLeft = this.AddInlet("mouseybuttonleft","DOUBLE");
    this.InletMouseXButtonRight = this.AddInlet("mousexbuttonright","DOUBLE");
    this.InletMouseYButtonRight = this.AddInlet("mouseybuttonright","DOUBLE");
    this.InletMouseXButtonMiddle = this.AddInlet("mousexbuttonmiddle","DOUBLE");
    this.InletMouseYButtonMiddle = this.AddInlet("mouseybuttonmiddle","DOUBLE");

    this.InletMouseXWheel = this.AddInlet("mousexwheel","DOUBLE");
    this.InletMouseYWheel = this.AddInlet("mouseywheel","DOUBLE");
    this.InletMouseZWheel = this.AddInlet("mousezwheel","DOUBLE");

    this.InletAccX = this.AddInlet("accelerationx", "DOUBLE");
    this.InletAccY = this.AddInlet("accelerationy", "DOUBLE");
    this.InletAccZ = this.AddInlet("accelerationz", "DOUBLE");

    this.InletAccGX = this.AddInlet("accelerationgx", "DOUBLE");
    this.InletAccGY = this.AddInlet("accelerationgy", "DOUBLE");
    this.InletAccGZ = this.AddInlet("accelerationgz", "DOUBLE");

    this.InletRotX = this.AddInlet("rotationx", "DOUBLE");
    this.InletRotY = this.AddInlet("rotationy", "DOUBLE");
    this.InletRotZ = this.AddInlet("rotationz", "DOUBLE");

    this.InletVelocity = this.AddInlet("velocity", "DOUBLE");
    this.InletVelocityX = this.AddInlet("velocityx", "DOUBLE");
    this.InletVelocityY = this.AddInlet("velocityy", "DOUBLE");
    this.InletVelocityZ = this.AddInlet("velocityz", "DOUBLE");

    this.InletMouseVelocity = this.AddInlet("mousevelocity", "DOUBLE");
    this.InletMouseVelocityX = this.AddInlet("mousevelocityx", "DOUBLE");
    this.InletMouseVelocityY = this.AddInlet("mousevelocityy", "DOUBLE");
    this.InletMouseVelocityZ = this.AddInlet("mousevelocityz", "DOUBLE");


    this.InletAccVelX = this.AddInlet("accelerationvelx", "DOUBLE");
    this.InletAccVelY = this.AddInlet("accelerationvely", "DOUBLE");
    this.InletAccVelZ = this.AddInlet("accelerationvelz", "DOUBLE");

    if (super.Init((res) => {

      ///Al fin luego de levantar todas las configuraciones,
      // creamos los conectores (Inlets <NO INTERNOS> y Outlets)
      // resolvemos los valores de cada parametros del config
      this.isyncro = this.m_Config.GetParamIndex("syncro");
      this.iphase = this.m_Config.GetParamIndex("phase");
      this.CreateConnectors();
      //console.log( `moEffect.PreInit OK! ${this.GetLabelName()}:(${this.m_Config.m_Params.length})<-I[${this.m_Inlets.length}]->O[${this.m_Outlets.length}]]`, this);
      if (callback) callback(res);
    } )) {
      // esta función es asincrónica ahora
    } else return false;

    return true;
  }

  BeginDraw(p_tempo: moTempo, parentstate : moEffectState = null ): void {

    var syncrotmp : MOdouble;

    if(this.isyncro != MO_PARAM_NOT_FOUND) {
      var sync : moData = this.m_Config.GetParam(this.isyncro).GetData();
      if (sync) {
        var pFun : moMathFunction = sync.Fun();
        if (sync.Type()==moDataType.MO_DATA_FUNCTION && pFun) {
          this.m_EffectState.tempo.syncro = pFun.Eval();
        }
        else this.m_EffectState.tempo.syncro = sync.Double();
      }

      //código alternativo
      //m_EffectState.tempo.syncro = m_Config.Fun(isyncro).Eval( m_EffectState.tempo.ang );
    }

    if (this.m_EffectState.synchronized == MO_DEACTIVATED)
      {
          //m_EffectState.tempo.ticks = moGetTicks();
          ///Clock independiente
          this.m_EffectState.tempo.Duration();
          this.m_EffectState.tempo.getTempo();
      }
      else
      {
          var syncrotmp = this.m_EffectState.tempo.syncro;
          Object.assign( this.m_EffectState.tempo, p_tempo );
          this.m_EffectState.tempo.syncro = syncrotmp;
          this.m_EffectState.tempo.getTempo();
          //if(m_EffectState.fulldebug==MO_ACTIVATED) MODebug2->Push("SYNCRO: " + FloatToStr(m_EffectState.tempo.syncro,3));
      }

    if(this.iphase != MO_PARAM_NOT_FOUND) {
      var phase : moData = this.m_Config.GetParam(this.iphase).GetData();
      if (phase) {
        var pFun : moMathFunction = phase.Fun();
            if (phase.Type()==moDataType.MO_DATA_FUNCTION && pFun) {
              //m_EffectState.tempo.ang+= pFun->Eval(m_EffectState.tempo.ang);
              this.m_EffectState.tempo.ang+= pFun.Eval();
            }
            else this.m_EffectState.tempo.ang+= phase.Double();
          }
    }

    if(parentstate) {
      //asginar parametros del state del padre al state del hijo
      Object.assign(this.m_EffectState, parentstate);
    }

    this.InletTime.SetNumber(this.m_EffectState.tempo.ang);
    this.InletTimems.SetNumber(this.m_EffectState.tempo.Duration());
    this.InletMilliseconds.SetNumber(this.m_EffectState.tempo.Duration());
    this.InletTimes.SetNumber(this.m_EffectState.tempo.Duration() / 1000.0);
    this.InletSeconds.SetNumber(this.m_EffectState.tempo.Duration() / 1000.0);
    this.InletSecondsS.SetNumber(this.m_EffectState.tempo.Duration() / 1000.0);
    this.InletT.SetNumber( this.m_EffectState.tempo.ang);
    this.InletTempo.SetNumber( moMath.FMod( this.m_EffectState.tempo.ang, moMath.TWO_PI));

    this.m_pResourceManager.GetRenderMan().m_Renderer.clearDepth();
    //this.m_pResourceManager.GetRenderMan().m_Renderer.clear(false, true, false);

    this.ScriptExeRun();
  }

  Draw( p_tempo : moTempo, p_parentstate : moEffectState = null ) : void {
    //console.log( `moEffect.Draw ${this.m_MobDefinition.GetName()}` );
    this.BeginDraw(p_tempo, p_parentstate);
    //draw here
    this.EndDraw();
  }

  EndDraw() {
    // MUST CALL THIS BEFORE EndDraw. this.ScriptExeDraw();
  }

  ScriptExeDraw(): void {
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
  }
/*
  GetState() : moMobState {
      return this.m_MobState;
  }

  SetState( p_MobState : moMobState ) : boolean {
      //TODO: check things before commit changes
      this.m_MobState = p_MobState;
      return true;
  }
*/

  SetBlending( p_blending: moBlendingModes ) {

    //m_Effect3D.m_Material.m_Blending = p_blending;

    //glEnable (GL_BLEND);
  	switch(p_blending) {
  		//ALPHA DEPENDENT
  		case moBlendingModes.MO_BLENDING_TRANSPARENCY:
  			//TRANSPARENCY [Rs * As] + [Rd *(1 -As)] = As*(Rs-Rd) + Rd
  			//glBlendFunc( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA );
        //glBlendFuncSeparate( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
        this.Mat.blending = THREE.NormalBlending;
        //console.log("normal blending");
  			break;
  		case moBlendingModes.MO_BLENDING_ADDITIVEALPHA:
  			//ADDITIVE WITH TRANSPARENCY: Rs*As + Rd*Ad
  			/** DOESNT WORK NICELY BECAUSE DST_ALPHA DOESNT AFFECT FINAL FRAMEBUFFER */
  			//glBlendFunc(GL_SRC_ALPHA, GL_DST_ALPHA);
        //glBlendFuncSeparate( GL_SRC_ALPHA, GL_DST_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA );
              /** THIS WORKS LIKE A CHARM*/
  			//ADDITIVE WITH SRC TRANSPARENCY: Rs*As + Rd
  			//glBlendFunc(GL_SRC_ALPHA,GL_ONE);

        this.Mat.blending = THREE.AdditiveBlending;
        //console.log("additive blending");
  			break;

  		//NON ALPHA
  		case moBlendingModes.MO_BLENDING_MIXING:
  			//MIXING [Rs *( 1 - Rd )] + [ Rd * 1] = Rs + Rd - Rs*Rd
  			//additive without saturation
  			//glBlendFunc( GL_ONE_MINUS_DST_COLOR, GL_ONE );
        this.Mat.blending = THREE.CustomBlending;
  			break;
  		case moBlendingModes.MO_BLENDING_MULTIPLY:
  			//MULTIPLY: [Rs * Rd] + [Rd * 0] = Rs * Rd
  			//glBlendFunc( GL_DST_COLOR, GL_ZERO );
        //glBlendFuncSeparate( GL_DST_COLOR, GL_ZERO, GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
        this.Mat.blending = THREE.MultiplyBlending;
  			break;
  		case moBlendingModes.MO_BLENDING_EXCLUSION:
  			//EXCLUSION: [Rs *(1 - Rd)] + [Rd *(1 - Rs)] = Rs + Rd - 2*Rs*Rd
  			//glBlendFunc( GL_ONE_MINUS_DST_COLOR, GL_ONE_MINUS_SRC_COLOR);//
        this.Mat.blending = THREE.CustomBlending;
  			break;
  		case moBlendingModes.MO_BLENDING_ADDITIVE:
  			//ADDITIVE Rs+Rd
  			//glBlendFunc( GL_ONE, GL_ONE );
        this.Mat.blending = THREE.AdditiveBlending;
  			break;
  		case moBlendingModes.MO_BLENDING_OVERLAY:
  			//OVERLAY: 2*Rs*Rd
  			//glBlendFunc( GL_DST_COLOR, GL_SRC_COLOR );
        this.Mat.blending = THREE.CustomBlending;
  			break;
  		case moBlendingModes.MO_BLENDING_SUBSTRACTIVE:
  			//SUBSTRACTIVE [Rs *( 1 - Rd )] + [ Rd * 0] = Rs - Rs*Rd
  			//substractive
  			//glBlendFunc( GL_ONE_MINUS_DST_COLOR, GL_ZERO );
        this.Mat.blending = THREE.SubtractiveBlending;
  			break;
  		case moBlendingModes.MO_BLENDING_SATURATE:
  			// [Rs * min(As,1-Ad) ] + [ Rd * Ad]
  			//
  			//glBlendFunc( GL_SRC_ALPHA_SATURATE,  GL_DST_ALPHA);
        this.Mat.blending = THREE.CustomBlending;
  			break;
  			//Multiply mode:(a*b)
  			//Average mode:(a+b)/2
  			//Screen mode:  f(a,b) = 1 -(1-a) *(1-b)
  			//Difference mode:  f(a,b) = |a - b|
  			//Negation mode:  f(a,b) = 1 - |1 - a - b|
  			//Exclusion mode f(a,b) = a + b - 2ab or f(a,b) = average(difference(a,b),negation(a,b))
  			//Overlay mode f(a,b) =   	2ab(for a < ) 1 - 2 *(1 - a) *(1 - b)(else)
  			//Color dodge mode:  f(a,b) = a /(1 - b)
  			//Color burn mode:  f(a,b) = 1 -(1 - a) / b
  			//Inverse color dodge mode:  f(a,b) = b /(1 - a)
  			//Inverse color burn mode:  f(a,b) = 1 -(1 - b) / a
  		default: //alpha transparent
        this.Mat.blending = THREE.NormalBlending;
  			//glBlendFunc( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA );
  			break;
  	}

}

/*
  Activate() : void {
      var mobstate : moMobState = this.GetState();
      mobstate.Activate();
      this.SetState( mobstate );
  }

  Deactivate() : void {
      var mobstate : moMobState = this.GetState();
      mobstate.Deactivate();
      this.SetState( mobstate );
  }

  Activated() : boolean {
      return this.GetState().Activated();
  }
*/

  GetEffectState() : moEffectState {
    return this.m_EffectState;
  }

  Select() {
      var mobstate : moMobState = this.GetState();
      mobstate.Select();
      this.SetState( mobstate );
  }

  Unselect() {
      var mobstate : moMobState = this.GetState();
      mobstate.Unselect();
      this.SetState( mobstate );
  }

  Selected() : boolean {
      return this.GetState().Selected();
  }


  TurnOn() : void  {
    this.m_EffectState.Activate();
    this.Activate();
  }

  TurnOff() : void {
    this.m_EffectState.Deactivate();
    this.Deactivate();
  }

  Enable() : void {
    this.m_EffectState.enabled = MO_ON;
    //this.Activate();
  }

  Disable() : void {
    this.m_EffectState.enabled = MO_OFF;
    //this.Deactivate();
  }

  SwitchOn() : void {
    if (this.m_EffectState.Activated()) {
      this.m_EffectState.Deactivate()
    } else  this.m_EffectState.Activate();
  }

  SwitchEnabled() : void {
    this.m_EffectState.enabled*= -1;
  }


  Synchronize() : void {
    this.m_EffectState.synchronized = MO_ACTIVATED;
  }


  Unsynchronize() : void {
    this.m_EffectState.synchronized = MO_DEACTIVATED;
  }

  Play() : void {
    this.Unsynchronize();
    return this.m_EffectState.tempo.Start();
  }

  Stop() : void {
    this.Unsynchronize();
    return this.m_EffectState.tempo.Stop();
  }

  Pause() : void {
    this.Unsynchronize();
    return this.m_EffectState.tempo.Pause();
  }

  Continue() : void {
    this.Unsynchronize();
    return this.m_EffectState.tempo.Continue();
  }

  State() : moTimerState {
    return this.m_EffectState.tempo.State();
  }

  GetDefinition(p_configdefinition?: moConfigDefinition): moConfigDefinition {

    p_configdefinition = super.GetDefinition(p_configdefinition);
    p_configdefinition.Add("alpha", moParamType.MO_PARAM_ALPHA, -1,
      new moValue("1.0", "FUNCTION"));
    p_configdefinition.Add( "color", moParamType.MO_PARAM_COLOR, -1,
      new moValue( "1.0","FUNCTION","1.0","FUNCTION","1.0","FUNCTION","1.0","FUNCTION") );
    p_configdefinition.Add("syncro", moParamType.MO_PARAM_SYNC, -1,
        new moValue("1.0", "FUNCTION") );
    p_configdefinition.Add("phase", moParamType.MO_PARAM_PHASE, -1,
    new moValue("0.0", "FUNCTION") );
    p_configdefinition.Add("guides", moParamType.MO_PARAM_NUMERIC, -1,
      new moValue("0", "NUM"), "No,Yes,Full" );
    //console.log("Effect definitions:", p_configdefinition);
    return p_configdefinition;
  }

  Interaction( p_iodeviceman : moIODeviceManager ) {

    if (p_iodeviceman==undefined || !p_iodeviceman) return;

    //console.log("moEffect::Interaction > p_iodeviceman");
    this.mousexrel = 0.0;
    this.mouseyrel = 0.0;
    this.mousexrel_left = 0.0;
    this.mouseyrel_left = 0.0;

    for( var ev_idx : MOint = 0; ev_idx < p_iodeviceman.GetEvents().List().length; ev_idx++ ) {
      var event : moEvent = p_iodeviceman.GetEvents().GetRef(ev_idx);
      //console.log(event);

      if (event.deviceid==MO_IODEVICE_MOUSE) {
        if (event.jsevent) {

          if (event.devicecode==moIODeviceCode.MO_SDL_MOUSEMOTION ) {
            //console.log("x: "+mevent.clientX,"y: "+mevent.clientY);
            //console.log(event);
            this.mousexrel = event.reservedvalue0;
            this.mouseyrel = event.reservedvalue1;
            this.mousex_old = this.mousex;
            this.mousey_old = this.mousey;
            this.mousex = event.reservedvalue2;
            this.mousey = event.reservedvalue3;

            this.mousexrel = this.mousex-this.mousex_old;
            this.mouseyrel = this.mousey-this.mousey_old;
            //this.mousefactor = event.reservedvalue2;
          } else {
            this.mousexrel = 0.0;
            this.mouseyrel = 0.0;
          }

          if (event.jsevent.type=="mouseup" || event.devicecode == moIODeviceCode.MO_SDL_MOUSEBUTTONUP) {
            if (event.jsevent.button==0) {
              this.mousebuttonleft = 0.0;
            }
            if (event.jsevent.button==1) {
              this.mousebuttonmiddle = 0.0;
            }
            if (event.jsevent.button==2) {
              this.mousebuttonright = 0.0;
            }

            this.InletMouseButtonLeft.SetNumber( this.mousebuttonleft );
            this.InletMouseButtonMiddle.SetNumber( this.mousebuttonmiddle );
            this.InletMouseButtonRight.SetNumber( this.mousebuttonright );

            //console.log(event);
            //console.log(event, this);
          }

          if (event.jsevent.type=="mousedown" || event.devicecode == moIODeviceCode.MO_SDL_MOUSEBUTTONDOWN) {
            if (event.jsevent.button==0) {
              this.mousebuttonleft = 1.0;
              this.mousex = event.reservedvalue1;
              this.mousey = event.reservedvalue2;
              this.mousex_old = this.mousex;
              this.mousey_old = this.mousey;
              //console.log("mousex_old",this.mousex_old);
            }
            if (event.jsevent.button==1) {
              this.mousebuttonmiddle = 1.0;
              this.mousex = event.reservedvalue1;
              this.mousey = event.reservedvalue2;
              this.mousex_old = this.mousex;
              this.mousey_old = this.mousey;
            }
            if (event.jsevent.button==2) {
              this.mousebuttonright = 1.0;
              this.mousex = event.reservedvalue1;
              this.mousey = event.reservedvalue2;
              this.mousex_old = this.mousex;
              this.mousey_old = this.mousey;
            }
            this.InletMouseButtonLeft.SetNumber( this.mousebuttonleft );
            this.InletMouseButtonMiddle.SetNumber( this.mousebuttonmiddle );
            this.InletMouseButtonRight.SetNumber( this.mousebuttonright );
            //console.log(event);
            //console.log(event, this);
          }

          this.InletMouseX.SetNumber( this.mousex );
          this.InletMouseY.SetNumber( this.mousey );

          if (event.jsevent.type=="mousemove" || event.devicecode == moIODeviceCode.MO_SDL_MOUSEMOTION) {

            //this.mousexrel = 0.0;
            //this.mouseyrel = 0.0;

            if (this.mousebuttonleft==1.0) {
              //console.log("mousebuttonleft",this.mousexbuttonleft, this.mousexrel);
              this.mousexbuttonleft+= Number(this.mousexrel);
              this.mouseybuttonleft+= Number(this.mouseyrel);
            }

            if (this.mousebuttonmiddle==1.0) {
              this.mousexbuttonmiddle+= this.mousexrel;
              this.mouseybuttonmiddle+= this.mouseyrel;
            }

            if (this.mousebuttonright==1.0) {
              this.mousexbuttonright+= this.mousexrel;
              this.mouseybuttonright+= this.mouseyrel;
            }

            this.InletMouseXButtonLeft.SetNumber( this.mousexbuttonleft );
            this.InletMouseXButtonMiddle.SetNumber( this.mousexbuttonmiddle );
            this.InletMouseXButtonRight.SetNumber( this.mousexbuttonright );
            this.InletMouseYButtonLeft.SetNumber( this.mouseybuttonleft );
            this.InletMouseYButtonMiddle.SetNumber( this.mouseybuttonmiddle );
            this.InletMouseYButtonRight.SetNumber( this.mouseybuttonright );
            //console.log(event);
          }

          if (event.devicecode==moIODeviceCode.MO_SDL_MOUSEWHEEL ) {
            this.mousexwheel+= event.reservedvalue0;
            this.mouseywheel+= event.reservedvalue1;
            this.mousezwheel+= event.reservedvalue2;
            this.mousewheeldeltamode = event.reservedvalue3;
            //console.log(this.mouseywheel);
          }
          this.InletMouseXWheel.SetNumber( this.mousexwheel );
          this.InletMouseYWheel.SetNumber( this.mouseywheel );
          this.InletMouseZWheel.SetNumber( this.mousezwheel );

          //if ( this.timestamp != 0 ) {

              //var NS2S : MOdouble = 1.0 / 1000000000;
              //var NS2Sm : MOdouble = 1.0 / 100000;
              //console.log("NS2S:",NS2S)
              //console.log("jsev.timestamp:",this.m_EffectState.tempo.Duration())
              //var dT : any = ( this.m_EffectState.tempo.Duration() - this.timestamp ) * NS2Sm;
              this.dT = 1.0;
              //console.log("dT:",dT)
              /*
              lax = this.accelerationx;
              lay = this.accelerationy;
              laz = this.accelerationz;
              */
              this.lax = this.mousexrel;
              this.lay = this.mouseyrel;
              this.laz = 0.0;//this.mousezrel;

              this.mousevelocityx = this.mousevelocityx + this.lax * this.dT ;
              this.mousevelocityy = this.mousevelocityy + this.lay * this.dT ;
              this.mousevelocityz = this.mousevelocityz + this.laz * this.dT ;

              this.mousevelocity = Math.sqrt( this.mousevelocityx*this.mousevelocityx + this.mousevelocityy*this.mousevelocityy + this.mousevelocityz*this.mousevelocityz );
              if (this.mousevelocity < 0.01) { this.mousevelocity = 0 ; }
              //tv_speed.setText(String.valueOf(speed));

          //}

          //this.timestamp = this.m_EffectState.tempo.Duration();

        }

      }

      if (event.deviceid==MO_IODEVICE_MOBILE) {

        if (event.devicecode==moIODeviceMobileCode.MO_ACCELERATION_LINEAR ) {
          this.InletAccX.SetNumber( event.reservedvalue0 );
          this.accelerationx = event.reservedvalue0;
          this.InletAccY.SetNumber( event.reservedvalue1 );
          this.accelerationy = event.reservedvalue1;
          this.InletAccZ.SetNumber( event.reservedvalue2 );
          this.accelerationz = event.reservedvalue2;
        }



        if (event.devicecode==moIODeviceMobileCode.MO_ROTATION ) {
          this.InletRotX.SetNumber( event.reservedvalue0 );
          this.rotationx = event.reservedvalue0;
          this.InletRotY.SetNumber( event.reservedvalue1 );
          this.rotationy = event.reservedvalue1;
          this.InletRotZ.SetNumber( event.reservedvalue2 );
          this.rotationz = event.reservedvalue2;
        }



        this.dT = 1.0;
        //console.log("dT:",dT)
        /*
        lax = this.accelerationx;
        lay = this.accelerationy;
        laz = this.accelerationz;
        */
        //this.lax = this.accelerationgx*this.dT;
        //this.lay = this.accelerationgy*this.dT;
        //this.laz = this.accelerationgz*this.dT;
        if (event.devicecode==moIODeviceMobileCode.MO_ACCELERATION_LINEAR_W_GRAVITY ) {
          this.InletAccGX.SetNumber( event.reservedvalue0 );
          this.laccx = event.reservedvalue0 - this.accelerationgx;
          this.accelerationgx = event.reservedvalue0;

          this.InletAccGY.SetNumber( event.reservedvalue1 );
          this.laccy = event.reservedvalue1 - this.accelerationgy;
          this.accelerationgy = event.reservedvalue1;

          this.InletAccGZ.SetNumber( event.reservedvalue2 );
          this.laccz = event.reservedvalue2 - this.accelerationgz;
          this.accelerationgz = event.reservedvalue2;

          this.lacc = Math.sqrt( this.laccx*this.laccx + this.laccy*this.laccy + this.laccz*this.laccz );

          this.laccmax = ( this.laccmax >= this.lacc ) ? this.laccmax : this.lacc;
          if (this.laccmaxcut == 0.0) this.laccmaxcut = 2.0;
          this.laccsum = String(this.lacc > this.laccmaxcut);
          if ( this.lacc > this.laccmaxcut ) {

            /*
            this.velocityx = this.velocityx + this.laccx * this.dT ;
            this.velocityy = this.velocityy + this.laccy * this.dT ;
            this.velocityz = this.velocityz + this.laccz * this.dT ;
*/
            this.velocityx = this.laccx * this.dT ;
            this.velocityy = this.laccy * this.dT ;
            this.velocityz = this.laccz * this.dT ;
          }

          this.velocity = Math.sqrt( this.velocityx*this.velocityx + this.velocityy*this.velocityy + this.velocityz*this.velocityz );

          if (this.velocity < 0.01) { this.velocity = 0 ; }
	}

        if (event.devicecode==moIODeviceMobileCode.MO_ROTATION ) {
          this.InletRotX.SetNumber( event.reservedvalue0 );
          this.InletRotY.SetNumber( event.reservedvalue1 );
          this.InletRotZ.SetNumber( event.reservedvalue2 );
        }

      }

    }

    //console.log( "mousevelocity: ", this.mousevelocity );
    this.InletMouseVelocity.SetNumber( this.mousevelocity );
    this.mousevelocity = this.mousevelocity * 0.98;
    if (this.mousevelocity<0.001) this.mousevelocity = 0.0;

    this.velocity = this.velocity * 0.98;
    this.velocityx = this.velocityx * 0.98;
    this.velocityy = this.velocityy * 0.98;
    this.velocityz = this.velocityz * 0.98;
    if (this.velocity<0.001) this.velocity = 0.0;
    this.InletVelocity.SetNumber( this.velocity );
  }

}

export type moEffectsArray = moEffect[];

export class moPreEffect extends moEffect {
  constructor() {
    super();
    this.SetType(moMoldeoObjectType.MO_OBJECT_PREEFFECT);
  }
}
export type moPreEffectsArray = moPreEffect[];




export class moPostEffect extends moEffect {
  constructor() {
    super();
    this.SetType(moMoldeoObjectType.MO_OBJECT_POSTEFFECT);
  }
}
export type moPostEffectsArray = moPostEffect[];




export class moMasterEffect extends moEffect {

  m_pEffectManager: moEffectManager;

  constructor() {
    super();
    this.SetType(moMoldeoObjectType.MO_OBJECT_MASTEREFFECT);
  }

  Set(p_EffectManager: moEffectManager, cstate?: moConsoleState) {
    this.m_pEffectManager = p_EffectManager;
  }
}
export type moMasterEffectsArray = moMasterEffect[];

export class moSceneEffect extends moMasterEffect {
  UpdateMoldeoIds( p_MoldeoSceneObjects : any ) {

  }
};
