
import { moEffectState } from "./mo-effect-state";
export { moEffectState } from "./mo-effect-state";
import {
  moConfig, moConfigDefinition,
  MO_PARAM_NOT_FOUND, MO_PARAM_NOT_SEL, MO_SELECTED,
  MO_CONFIG_OK, MO_CONFIGFILE_NOT_FOUND
} from "./mo-config";
import { moMoldeoObject, moMobState } from "./mo-moldeo-object";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { moEffectManager } from "./mo-effect-manager";
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

export class moEffect extends moMoldeoObject {

  m_EffectState: moEffectState;

  InletTime: moInlet;
  InletTimems: moInlet;
  InletTimes: moInlet;
  InletTempo: moInlet;
  InletT: moInlet;
  InletMilliseconds: moInlet;
  InletSeconds : moInlet;

  isyncro: MOint = -1;
  iphase: MOint = -1;
  drawOptions : any = {};

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

    this.InletTimems = new moInlet();
    if (this.InletTimems) {
      this.InletTimems.Init( "timems", this.m_Inlets.length, moDataType.MO_DATA_NUMBER_DOUBLE );
      this.m_Inlets.push(this.InletTimems);
      this.m_InletsStr["timems"] = this.InletTimems;
    }

    this.InletTimes = new moInlet();
    if (this.InletTimes) {
      this.InletTimes.Init( "times", this.m_Inlets.length, moDataType.MO_DATA_NUMBER_DOUBLE );
      this.m_Inlets.push(this.InletTimes);
      this.m_InletsStr["times"] = this.InletTimes;
    }

    /** Crea INLETS INTERNOS, es decir que no tienen un parametro asociado... (especificamente para su uso generico*/
    this.InletTime = new moInlet();
    if (this.InletTime) {
      //moDataType.MO_DATA_NUMBER_DOUBLE
      this.InletTime.Init( "time", this.m_Inlets.length, "DOUBLE"  );
      this.m_Inlets.push(this.InletTime);
      this.m_InletsStr["time"] = this.InletTime;
    }

    this.InletTempo = new moInlet();
    if (this.InletTempo) {
      //Inlet->Init( "tempo", m_Inlets.Count(), param.GetPtr() );
      //param.SetExternData( Inlet->GetData() );
      this.InletTempo.Init( "tempo", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletTempo);
      this.m_InletsStr["tempo"] = this.InletTempo;
    }

    this.InletT = new moInlet();
    if (this.InletT) {
      this.InletT.Init( "t", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletT);
      this.m_InletsStr["t"] = this.InletT;
    }


    this.InletMilliseconds = new moInlet();
    if (this.InletMilliseconds) {
      this.InletMilliseconds.Init( "milliseconds", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletMilliseconds);
      this.m_InletsStr["milliseconds"] = this.InletMilliseconds;
    }

    this.InletSeconds = new moInlet();
    if (this.InletSeconds) {
      this.InletSeconds.Init( "seconds", this.m_Inlets.length, "DOUBLE" );
      this.m_Inlets.push(this.InletSeconds);
      this.m_InletsStr["seconds"] = this.InletSeconds;
    }

    if (super.Init((res) => {

      ///Al fin luego de levantar todas las configuraciones,
      // creamos los conectores (Inlets <NO INTERNOS> y Outlets)
      // resolvemos los valores de cada parametros del config
      this.isyncro = this.m_Config.GetParamIndex("syncro");
      this.iphase = this.m_Config.GetParamIndex("phase");
      this.CreateConnectors();
      console.log( `moEffect.PreInit OK! ${this.GetLabelName()}:(${this.m_Config.m_Params.length})<-I[${this.m_Inlets.length}]->O[${this.m_Outlets.length}]]`, this);
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

    if (this.InletTime) {
      if (this.InletTime.GetData())
        this.InletTime.GetData().SetDouble(this.m_EffectState.tempo.ang);
      //console.log("tempo.ang", this.m_EffectState.tempo.ang);
    }

    if (this.InletTimems) {
      if (this.InletTimems.GetData())
        this.InletTimems.GetData().SetDouble(this.m_EffectState.tempo.Duration());
    }
    if (this.InletMilliseconds) {
      if (this.InletMilliseconds.GetData())
        this.InletMilliseconds.GetData().SetDouble( this.m_EffectState.tempo.Duration());
    }
    if (this.InletTimes) {
      if (this.InletTimes.GetData())
        this.InletTimes.GetData().SetDouble(this.m_EffectState.tempo.Duration() / 1000.0);
    }
    if (this.InletSeconds) {
      if (this.InletSeconds.GetData())
        this.InletSeconds.GetData().SetDouble(this.m_EffectState.tempo.Duration() / 1000.0);
    }
    if (this.InletT) {
      if (this.InletT.GetData())
        this.InletT.GetData().SetDouble( this.m_EffectState.tempo.ang);
    }
    if (this.InletTempo) {
      if (this.InletTempo.GetData())
        this.InletTempo.GetData().SetDouble( moMath.FMod( this.m_EffectState.tempo.ang, moMath.TWO_PI));
    }

    if (this.drawOptions["clear_depth"]) {
      this.m_pResourceManager.GetRenderMan().m_Renderer.clearDepth();
    }
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
    this.ScriptExeDraw();
  }

  ScriptExeDraw(): void {

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
