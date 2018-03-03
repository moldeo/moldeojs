
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

export class moIODevice extends moMoldeoObject {

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

  constructor() {
    super();
    this.m_EffectState = new moEffectState();
    this.SetType(moMoldeoObjectType.MO_OBJECT_IODEVICE);
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

}

export type moIODevices = moIODevice[];
export type moIODeviceArray = moIODevice[];
