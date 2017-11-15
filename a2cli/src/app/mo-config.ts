import * as xml2js from "xml2js";

import {
  MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong,
  moNumber, moTextFilterParam,
  MO_RED, MO_GREEN, MO_BLUE, MO_ALPHA
} from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import {
  moData, moValue, moValues,
  moValueBase, moValueBases,
  moValueDefinition,
} from "./mo-value";
import {
  moParam, moParamType, moParamTypeToText, moParamIndex,
  moParams, moParamIndexes, moParamDefinition, moParamDefinitions
} from "./mo-param";
import { moPreconfig, moPreConfigs, moPreconfigParamIndex } from "./mo-pre-config";
import { moFile } from "./mo-file-manager";
import { moColor, moColor4fArray, moColorRGBA, moColorRGB, moColorArray } from "./mo-gui-manager";
import { moTexture, moTextureBuffer } from "./mo-texture";



export const MO_PARAM_NOT_SEL = -1;
export const MO_PARAM_NOT_FOUND = -1;
export const MO_CONFIGFILE_NOT_FOUND = -1;
export const MO_CONFIG_OK = 0;
export const MO_SELECTED = -1;


export class moConfigDefinition extends moAbstract {

  m_ParamDefinitions: moParamDefinitions;
  m_ParamDefinitions_Map: any = {};
  m_ParamIndexes : moParamIndexes;
  m_ObjectName : moText;
	m_ObjectClass : moText;

  Set( p_objectname : moText, p_objectclass : moText ) : void {
    this.m_ObjectName = p_objectname;
    this.m_ObjectClass = p_objectclass;
  }

  GetObjectName() : moText {
    return this.m_ObjectName;
  }

  GetObjectClass() : moText {
    return this.m_ObjectClass;
  }

  constructor() {
    super();
  }

  Init(): boolean {
    return super.Init();
  }

  Exists(p_name: moText): boolean {
    if (p_name in this.m_ParamDefinitions_Map) return true;
    return false;
  }

  GetParamDefinitions(): moParamDefinitions {
    return this.m_ParamDefinitions;
  }

  Empty(): void {
    this.m_ParamDefinitions = [];
    this.m_ParamDefinitions_Map = {};
    this.m_ParamIndexes = [];
  }

  /// Agrega la definición de un parámetro con un valor predeterminado a tomar
  /**
  *
  * @param p_name nombre del parámetro
  * @param p_type tipo del parámetro
  * @param p_index    índice del parámetro dentro del archivo de configuración (-1 si no está definido aún)
  * @param p_defaultvalue  valor predeterminado
  * @param p_OptionsStr opciones separadas por coma "opcion A, opcion B, opcion C"
  */
  Add(p_name: moText, p_type: moParamType,
    p_index?: MOint,
    p_defaultvalue?: moValue,
    p_OptionsStr?: moText) {

    if (this.Exists(p_name)) {
      this.MODebug2.Error(p_name + " already defined in " + this.m_ObjectName);
      return;
    }

    var pdef : moParamDefinition = new moParamDefinition(p_name, moParamTypeToText[p_type] );

    pdef.SetIndex(p_index);

    if (p_type != moParamType.MO_PARAM_MOLDEO_OBJECT) {
      if (p_defaultvalue == undefined)
        p_defaultvalue = new moValue("","UNDEFINED");

      pdef.SetDefault(p_defaultvalue);
    }

    if (p_OptionsStr)
      pdef.SetOptions(p_OptionsStr);

    //IF TYPE IS COLOR > sub 0: RED, 1: GREEN, 2: BLUE, 3: ALPHA
    if (p_type == moParamType.MO_PARAM_COLOR) {
      var vd : moValueDefinition;
      vd = pdef.GetDefaultValue().GetSubValue(MO_RED).GetValueDefinition();
      vd.SetCodeName("RED");
      pdef.GetDefaultValue().GetSubValue(MO_RED).SetValueDefinition(vd);

      vd = pdef.GetDefaultValue().GetSubValue(MO_GREEN).GetValueDefinition();
      vd.SetCodeName("GREEN");
      pdef.GetDefaultValue().GetSubValue(MO_GREEN).SetValueDefinition(vd);

      vd = pdef.GetDefaultValue().GetSubValue(MO_BLUE).GetValueDefinition();
      vd.SetCodeName("BLUE");
      pdef.GetDefaultValue().GetSubValue(MO_BLUE).SetValueDefinition(vd);

      vd = pdef.GetDefaultValue().GetSubValue(MO_ALPHA).GetValueDefinition();
      vd.SetCodeName("ALPHA");
      pdef.GetDefaultValue().GetSubValue(MO_ALPHA).SetValueDefinition(vd);

      /*
      p_defaultvalue.GetSubValue(MO_GREEN).GetValueDefinition().SetCodeName( "GREEN" );
      p_defaultvalue.GetSubValue(MO_BLUE).GetValueDefinition().SetCodeName( "BLUE" );
      p_defaultvalue.GetSubValue(MO_ALPHA).GetValueDefinition().SetCodeName( "ALPHA" );
      */
    }

    if (p_type == moParamType.MO_PARAM_FONT) {
      //p_defaultvalue.GetSubValue(0).GetValueDefinition().SetCodeName( "RED" );
    }

    this.m_ParamDefinitions.push(pdef);
    this.m_ParamDefinitions_Map[""+p_name] = p_index;
    this.m_ParamIndexes.push( new moParamIndex(p_index) );
  }

}
//type moPreConfigs = moPreconfig[];

export class moConfig extends moAbstract {

  m_ConfigLoaded : MOboolean = false;
  m_Params: moParams = [];//los parametros del config
  m_ParamsByName: any = {};
  m_PreConfigs : moPreConfigs = [];
  m_ConfigDefinition : moConfigDefinition = new moConfigDefinition();

  m_MajorVersion : MOint = 0;
  m_MinorVersion : MOint = 0;
  m_FileName : moText;

  m_CurrentParam : MOint = 0;// el indice que indica cual es el parametro actual.
  m_PreconfParamNum : MOint = 0;
  m_PreconfActual: MOint = 0;

  m_pTexture: moTexture = new moTexture();
  m_pTextureBuffer: moTextureBuffer = new moTextureBuffer();
  ///solo para poder devolver una referencia
  /*
  static moFont*         m_pFont;
  static moMathFunction* m_pFun;
  static moTextureBuffer* m_pTextureBuffer;
  static moSceneNode*            m_pModel;
  static moVector2d*             m_pVector2d;
  static moVector2i*             m_pVector2i;
  static moVector3d*             m_pVector3d;
  static moVector3i*             m_pVector3i;
  static moVector4d*             m_pVector4d;
  static moVector4i*             m_pVector4i;
  static moDataMessage*          m_pMessage;
  static moDataMessages*         m_pMessages;
  static moSound*                m_pSound;
  */

  constructor() {
    super();
  }

  Set( p_objectname : moText, p_objectclass : moText ) : void {
    this.m_ConfigDefinition.Set( p_objectname, p_objectclass);
  }

  GetName(): moText {
    return this.m_FileName;
  }

  /// Devuelve el nombre del objeto asociado a este config
  /**
  * El nombre del objeto no especifica la clase.
  * @return el nombre del objeto
  */
  GetObjectName() : moText {
    return this.m_ConfigDefinition.GetObjectName();
  }

  /// Devuelve el nombre de la clase del objeto asociado a este config
  /**
  * El nombre de la clase puede ser del objeto del que deriva este.
  * @return el nombre de la clase
  */
  GetObjectClass() : moText {
    return this.m_ConfigDefinition.GetObjectClass();
  }


  GetConfigDefinition() : moConfigDefinition {
    return this.m_ConfigDefinition;
  }

  CreateParam( p_ParamDef: moParamDefinition ) : void {
    //
  }

  CreateDefault(p_fullconfigname: moText) : boolean {
    return false;
  }

  IsConfigLoaded(): boolean {
    return this.m_ConfigLoaded;
  }

  //LoadConfig( config: moFile ): boolean;

  LoadConfig( configtext: any, callback?: any ): MOint {
    //console.log("configname:", { "fullconfig": configtext });
    //return MO_CONFIGFILE_NOT_FOUND;
    if ( configtext && typeof configtext == "string" ) {
        //console.log("moConfig::LoadConfig > Full text", configname);
        //parse XML:
        xml2js.parseString( configtext, (err, result) => {
          //console.log( configtext, result);
          //console.log('Parsing done');
          this.m_ParamsByName = {};
          if (typeof result == "object")
          if ("MOCONFIG" in result) {
            if (result["MOCONFIG"]["$"]) {
              this.m_MajorVersion = result["MOCONFIG"]["$"]["majorversion"];
              this.m_MinorVersion = result["MOCONFIG"]["$"]["minorversion"];
            }
            if ("DEFINITION" in result["MOCONFIG"]) {
              var fxname = result["MOCONFIG"]["DEFINITION"]["name"];
              var objecttype = result["MOCONFIG"]["DEFINITION"]["class"];
              this.Set(fxname, objecttype);
            }
            if ("CONFIGPARAMS" in result["MOCONFIG"]) {
              if (result["MOCONFIG"]["CONFIGPARAMS"].length > 0) {
                var CFGPARAMS = result["MOCONFIG"]["CONFIGPARAMS"][0];
                if ("PARAM" in CFGPARAMS) {
                  var PARAMS = CFGPARAMS["PARAM"];
                  this.m_Params = [];
                  if (PARAMS.length > 0) {
                    for (var PARAM_I in PARAMS) {
                      var PARAM = PARAMS[PARAM_I];
                      //console.log("Adding Param:", PARAM);
                      var p_param_def = new moParamDefinition(
                        PARAM["$"]["name"],
                        PARAM["$"]["type"],
                        PARAM["$"]["property"],
                        PARAM["$"]["group"],
                        PARAM["$"]["interpolation"],
                        PARAM["$"]["duration"],
                        PARAM["$"]["options"]
                      );
                      var p_param = new moParam(p_param_def);
                      this.m_Params.push(p_param);
                      this.m_ParamsByName["" + p_param.m_ParamDefinition.m_Name] = p_param;
                      var PARAMVALS = [];
                      if ("VAL" in PARAM) PARAMVALS = PARAM["VAL"];
                      if (PARAMVALS.length > 0) {
                        for (var PARAMVAL_I in PARAMVALS) {
                          var VAL = PARAMVALS[PARAMVAL_I];
                          var newValue: moValue = new moValue();
                          var VALSUBS = VAL["D"];

                          if (VALSUBS !== undefined && VALSUBS.length > 0) {
                            for (var SUBVAL_I in VALSUBS) {
                              var SUBVAL = VALSUBS[SUBVAL_I];
                              //console.log(" <D> Subvalue:", SUBVAL);
                              var vbd: moValueDefinition = new moValueDefinition();

                              var subvalue: moText = SUBVAL["_"];
                              var subvaluetype: moText = SUBVAL["$"]["type"];

                              newValue.AddSubValue(subvalue, subvaluetype);
                              //console.log("newValue:", newValue);
                              //var subvaluedata: moText = SUBVAL[0];
                              if (newValue.m_List.length) {
                                if (SUBVAL["$"]["code"])
                                  newValue.m_List[newValue.m_List.length - 1].SetCodeName(SUBVAL["$"]["code"]);
                                if (SUBVAL["$"]["attribute"])
                                  newValue.m_List[newValue.m_List.length - 1].SetAttribute(SUBVAL["$"]["attribute"]);
                                if (SUBVAL["$"]["min"])
                                  newValue.m_List[newValue.m_List.length - 1].SetRange(
                                    SUBVAL["$"]["min"],
                                    SUBVAL["$"]["max"]);
                              }
                            }
                          }//VALSUBS > 0
                          p_param.AddValue(newValue);
                          p_param.m_ParamDefinition.m_Index = this.m_Params.length - 1;
                        }
                      }//hay params
                    }
                  }//for...
                }//hay params
                //console.log("Added params:", this.m_Params);
              }//hay configparams >
            }
          }//fin "CONFIGPARAMS"

          if ("PRECONFIGS" in result["MOCONFIG"]) {
            //console.log(result["MOCONFIG"]);
            if (result["MOCONFIG"]["PRECONFIGS"].length > 0) {
              var PRECONFIGS = result["MOCONFIG"]["PRECONFIGS"][0];
              this.m_PreConfigs = [];
              //console.log(PRECONFIGS);
              if (typeof PRECONFIGS == "object")
              if ("PRE" in PRECONFIGS) {
                var PRES = PRECONFIGS["PRE"];
                if (PRES.length>0) {
                  for (var PRE_I in PRES) {
                    var PRECONF = PRES[PRE_I];
                    var preconf_name = "preconf_" + PRE_I;
                    if (PRECONF["$"]) preconf_name = PRECONF["$"]["name"];
                    if (typeof PRECONF == "object") {
                      var PREPARAMS = PRECONF["P"];
                      var Pcfg: moPreconfig = new moPreconfig();
                      //console.log(PREPARAMS);
                      if (PREPARAMS.length > 0) {
                        for (var P_I in PREPARAMS) {
                          var P = PREPARAMS[P_I];
                          var name = "" + P_I;
                          if (P["$"]) if (P["$"]["name"]) name = P["$"]["name"];
                          var value = P["_"];
                          //console.log(name, value);
                        }
                      }
                    }
                  }
                }
              }
            }
          }//fin "PRECONFIGS"
          this.m_ConfigLoaded = true;
          if (callback) callback(MO_CONFIG_OK);
          return MO_CONFIG_OK;
        });
      return MO_CONFIG_OK;//MUST BE MO_CONFIG_LOADING
    }
    this.m_ConfigLoaded = false;
    return MO_CONFIGFILE_NOT_FOUND;
  }

  GetParams() : moParams {
    return this.m_Params;
  }

  GetParam(p_paramindex?: any): moParam {
    var param: moParam = new moParam();

    if (p_paramindex) {
      if (typeof p_paramindex == "string") {
        param = this.m_ParamsByName["" + p_paramindex];
      } else
        if (typeof p_paramindex == "number") {
          if (p_paramindex == -1)
            param = this.m_Params[this.m_CurrentParam];
          else
            param = this.m_Params[p_paramindex];
        }
    } else {
      if (this.m_CurrentParam>-1)
        param = this.m_Params[this.m_CurrentParam];
    }

    return param;
  }



  GetParamsCount() : MOint {
    return this.m_Params.length;
  }

  GetParamIndex( p_paramname : moText ) : MOint {
    var param: moParam = this.GetParam(p_paramname);
    if (param)
      return param.m_ParamDefinition.m_Index;
    return -1;
  }


  GetValuesCount( p_paramindex : MOint ) : MOuint {
    var Param: moParam = this.m_Params[p_paramindex];
    if (Param)
      return Param.GetValuesCount();
    return 0;
  }

  GetValue( p_paramindex : any, indexvalue : MOint ) : moValue {
    var Param: moParam = this.GetParam(p_paramindex);
    if (Param)
      return Param.GetValue( indexvalue );
    return new moValue();
  }

  GetCurrentValueIndex(p_paramindex: MOint) {
    return this.m_Params[p_paramindex].GetIndexValue();
  }

  SetCurrentValueIndex( p_paramindex : MOint, p_valueindex : MOint ) {
	  this.m_Params[p_paramindex].SetIndexValue( p_valueindex );
  }

  GetCurrentValue() : moValue {
    return this.m_Params[this.m_CurrentParam].GetValue();
  }

  GetCurrentParam() : moParam {
    return this.m_Params[this.m_CurrentParam];
  }

  GetCurrentParamIndex() : MOint {
    return this.m_CurrentParam;
  }

  SetCurrentParamIndex( p_currentparam : MOint ) : boolean {
    if (  0<=p_currentparam
          && p_currentparam< this.m_Params.length ) {
      this.m_CurrentParam = p_currentparam;
      return true;
    }
    return false;
  }

  FirstParam() : void {
    if ( this.m_Params.length>0 ) {
      this.m_CurrentParam = 0;
    } else this.m_CurrentParam = -1;
  }

  NextParam() : void {
    if ( this.m_Params.length>0 ) {
      if ( this.m_CurrentParam < ( this.m_Params.length-1 ) ) {
        this.m_CurrentParam++;
      }
    } else this.m_CurrentParam = -1;
  }

  PrevParam() : void {
    if ( this.m_Params.length > 0 ) {
      if ( this.m_CurrentParam > 0 ) {
        this.m_CurrentParam--;
      }
    } else this.m_CurrentParam = -1;
  }

  FirstValue() : boolean {
    if ( this.m_CurrentParam>=0 ) {
      var pParam : moParam = this.m_Params[this.m_CurrentParam];
      if ( pParam.GetValuesCount() == 0 ) {
        return false;
      }
      pParam.FirstValue();
      return true;
    }
    return false;
  }

  NextValue() : boolean {
    if ( this.m_CurrentParam>=0 ) {
      var pParam : moParam = this.m_Params[this.m_CurrentParam];
      if ( pParam.GetIndexValue() == pParam.GetValuesCount()-1) {
        return false;
      }
      pParam.NextValue();
      return true;
    }
    return false;
  }

  PreviousValue() : boolean {
    if ( this.m_CurrentParam>=0 ) {
      var pParam : moParam = this.m_Params[this.m_CurrentParam];
      if ( pParam.GetIndexValue() == 0 ) {
        return false;
      }
      pParam.PrevValue();
      return true;
    }
    return false;
  }



  GetPreConfCount() : MOint {
	  return this.m_PreConfigs.length;
  }

  GetCurrentPreConf() : MOint {
	  return this.m_PreconfActual;
  }

  SetCurrentPreConf( p_actual : MOint ) : void {
    if(0<=p_actual && p_actual<this.m_PreConfigs.length )
    {
		  for( var i=0; i<this.m_PreConfigs[p_actual].m_PreconfIndexes.length; i++) {
			  var Val : moPreconfigParamIndex = this.m_PreConfigs[p_actual][i];
        this.SetCurrentValueIndex( Val.m_ParamIndex, Val.m_ValueIndex);
		  }
      this.m_PreconfActual = p_actual;
    }
  }

  PreConfFirst() {
    if(this.m_PreConfigs.length>0)
      this.SetCurrentPreConf( 0 );
  }

  PreConfNext() {
    if ( this.m_PreconfActual > -1
      && (this.m_PreconfActual < this.m_PreConfigs.length - 1) )
      this.SetCurrentPreConf( this.m_PreconfActual+1 );
  }

  PreConfPrev() {
    if(this.m_PreconfActual>0)
      this.SetCurrentPreConf( this.m_PreconfActual-1 );
  }



  Text(param_id: any) : moText {
    var param: moParam;
    param = this.GetParam(param_id);
    if (param && param.m_Values.length>0)
      return param.m_Values[0].m_List[0].m_Text;
    return "";
  }

  Texture(p_paramid: any) : moTexture {
    var param: moParam = this.GetParam(p_paramid);
    //console.log("moConfig.Texture");
    if (param) {
      var pdata: moData = param.GetData();
      //console.log(param, pdata);
      if (pdata) {

        var pTexture: moTexture = pdata.Texture();

        if (pTexture) {
          return pTexture;
        }
      }
    }
    return this.m_pTexture;
  }

  TextureBuffer(p_paramid: any) : moTextureBuffer {
    var param: moParam = this.GetParam(p_paramid);
    //console.log("moConfig.Texture");
    if (param) {
      var pdata: moData = param.GetData();
      //console.log(param, pdata);
      if (pdata) {

        var pTextureBuffer: moTextureBuffer = pdata.TextureBuffer();
        if (pTextureBuffer) {
          return pTextureBuffer;
        }
      }
    }
    return this.m_pTextureBuffer;
  }


  Int(refid: any): MOint {
    var Param: moParam = this.GetParam(refid);
    var f: MOint;
    if (Param) {
      var vb: moValue = Param.GetValue();
      if (vb) {
        f = vb.GetSubValue(0).Int()
      }
    }
    return f;
  }

  Double(refid: any): MOint {
    var Param: moParam = this.GetParam(refid);
    var f: any;
    if (Param) {
      var vb: moValue = Param.GetValue();
      if (vb) {
        f = vb.GetSubValue(0).Double()
      }
    }
    return f;
  }

  Eval(refid: any): any {
    var Param: moParam = this.GetParam(refid);
    var f: any;
    if (Param) {
      var vb: moValue = Param.GetValue();
      if (vb) {
        f = vb.GetSubValue(0).Eval()
      }
    }
    return f;
  }

  EvalColor( refid: any ) : any {
    var rgba: any = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
    var Param: moParam = this.GetParam(refid);
    if (Param) {
      var vb: moValue = Param.GetValue();
      if (vb) {
        rgba.r = vb.GetSubValue(0).Eval();
        rgba.g = vb.GetSubValue(1).Eval();
        rgba.b = vb.GetSubValue(2).Eval();
        rgba.a = vb.GetSubValue(3).Eval();
        //this.mr_Color.setRGB(r,g,b);
      }
    }
    return rgba;
  }
}
