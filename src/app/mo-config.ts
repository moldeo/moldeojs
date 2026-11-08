import * as xml2js from "xml2js";
import * as xmljs from "xml-js";

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
    var name : string = p_name as string;
    if ( name in this.m_ParamDefinitions_Map) return true;
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

  /** #918 E0 — lo que el XML original traía y el modelo no guarda, para que SaveConfig no pierda nada */
  m_XmlHeader : string = '<?xml version="1.0" encoding="ISO-8859-1" ?>';
  m_XmlDefinition : any = null;   /** atributos de <DEFINITION> */
  m_XmlHasUpdate : boolean = false;
  m_XmlHasPreconfigs : boolean = false;
  m_LastSavedXml : string = "";

  /** #918 E1.6 — transición entre presets (duda de diseño = parámetro: duración y curva) */
  m_PresetDuration : number = 1.0;              /** segundos; 0 = salto */
  m_PresetCurve : string = "ease";              /** ease · linear · step */
  private m_TransFrom : any = {};               /** nombre del param ⇒ índice de VAL de donde viene */
  private m_TransFromNum : any = {};            /** nombre ⇒ [números por sub-valor]: si se cortó una transición a medias */
  private m_TransStart : number = 0;

  /** 0..1 de la transición en curso (1 = terminada) */
  TransitionK() : number {
    if (!this.m_PresetDuration || this.m_PresetDuration <= 0) return 1;
    const k = Math.min(1, Math.max(0, (performance.now() - this.m_TransStart) / (this.m_PresetDuration * 1000)));
    if (this.m_PresetCurve == "linear") return k;
    if (this.m_PresetCurve == "step") return k < 1 ? 0 : 1;
    return k * k * (3 - 2 * k); /* ease */
  }

  /** el valor del param mezclado si está en transición; null si no */
  private TransMix( Param: moParam, sub: number ) : any {
    const name = "" + Param.GetName();
    const from = this.m_TransFrom[name];
    if (from === undefined) return null;
    const k = this.TransitionK();
    if (k >= 1) { delete this.m_TransFrom[name]; delete this.m_TransFromNum[name]; return null; }
    const vFrom = Param.m_Values[from], vTo = Param.GetValue();
    if (!vTo || !vTo.GetSubValue(sub)) return null;
    const nums = this.m_TransFromNum[name];
    const a = (nums && nums[sub] !== undefined) ? nums[sub]
      : (vFrom && vFrom.GetSubValue(sub) ? Number(vFrom.GetSubValue(sub).Eval()) : NaN);
    const b = Number(vTo.GetSubValue(sub).Eval());
    if (isNaN(a) || isNaN(b)) return null;
    return a + (b - a) * k;
  }

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
    var xparam: moParam = new moParam(p_ParamDef);

    ///asigna valor predeterminado definido por el plugin, sino
    ///aplica el estandar
    if ( p_ParamDef.GetDefaultValue().GetSubValueCount()>0
        &&
        p_ParamDef.GetDefaultValue().GetSubValue(0).GetTypeStr()!="UNDEFINED" ) {
        xparam.AddValue( p_ParamDef.GetDefaultValue() );
    } else {
        xparam.SetDefaultValue();
    }
    this.m_Params.push( xparam );
    this.m_ParamsByName[""+p_ParamDef.GetName()] = xparam;

    ///asigna los indices...
    var pParam : moParam = this.m_Params[this.m_Params.length-1];
    pParam.GetParamDefinition().SetIndex(this.m_Params.length-1);
    p_ParamDef.SetIndex(this.m_Params.length-1);
  }

  CreateDefault( p_fullconfigfilename?: moText) : boolean {

    //moFile cFile( p_fullconfigfilename );

    var pt : moText;
    pt = p_fullconfigfilename;

    /// Do not overwrite... by default
    //if (cFile.Exists()) {
    //    cout << "moConfig::CreateDefault > file already exists " << pt << endl;
    //    return false;
    //}

    if (this.IsConfigLoaded()) {
        //cout << "moConfig::CreateDefault > config has information already (is loaded) " << endl;
        return false;
    }

    //crea los par�metros en funci�n de las definiciones, con valores por default...
    var pParamDefinitions : moParamDefinitions = undefined;

    pParamDefinitions = this.GetConfigDefinition().GetParamDefinitions();
    //console.log("pParamDefinitions: ", pParamDefinitions);

    if (pParamDefinitions) {

        //this.UnloadConfig();

        //cout << "moConfig::CreateDefault > Loading default ParamDefinition in moConfig : number of params : " << pParamDefinitions->Count() << endl;
        for( var i=0; i<pParamDefinitions.length; i++) {

            var pParamDefinition : moParamDefinition = pParamDefinitions[i];

            this.CreateParam( pParamDefinition );
        }

        //cout << "moConfig::CreateDefault > Saving Config to disk..." << endl;
        //if (this.SaveConfig( pt )==MO_CONFIG_OK) {
            //cout << "moConfig::CreateDefault > Saved Config Succesfully " << endl;
        //    return true;
        //}
        //cout << "moConfig::CreateDefault > Error Saving Config to disk " << endl;
        return true;
    }

    //cout << "moConfig::CreateDefault > Errors occured " << endl;
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
        var result : any;
        try {
         result = xmljs.xml2js( configtext, {alwaysArray: true,compact: true,ignoreComment: true, alwaysChildren: false});
       } catch (exc) {
         console.error(exc);
       }

        //{compact: true, spaces: 4}
        //console.log( "xmljs",result );
        var attr_sym = "_attributes";
        var xml_text_value = "_text";

        this.m_ParamsByName = {};
        var hdr = configtext.match(/^\s*(<\?xml[^>]*\?>)/);
        if (hdr) this.m_XmlHeader = hdr[1];
        if (typeof result == "object")
        if ("MOCONFIG" in result) {
          var MC0 = result["MOCONFIG"][0];
          if (MC0["DEFINITION"] && MC0["DEFINITION"][0] && MC0["DEFINITION"][0][attr_sym])
            this.m_XmlDefinition = Object.assign({}, MC0["DEFINITION"][0][attr_sym]);
          this.m_XmlHasUpdate = ("UPDATE" in MC0);
          this.m_XmlHasPreconfigs = ("PRECONFIGS" in MC0);
          if (result["MOCONFIG"][0][attr_sym]) {
            this.m_MajorVersion = result["MOCONFIG"][0][attr_sym]["majorversion"];
            this.m_MinorVersion = result["MOCONFIG"][0][attr_sym]["minorversion"];
          }
          if ("DEFINITION" in result["MOCONFIG"][0]) {
            var fxname = result["MOCONFIG"][0]["DEFINITION"]["name"];
            var objecttype = result["MOCONFIG"][0]["DEFINITION"]["class"];
            this.Set(fxname, objecttype);
          }
          if ("CONFIGPARAMS" in result["MOCONFIG"][0]) {
            if (result["MOCONFIG"][0]["CONFIGPARAMS"].length > 0) {
              var CFGPARAMS = result["MOCONFIG"][0]["CONFIGPARAMS"][0];
              if ("PARAM" in CFGPARAMS) {
                var PARAMS = CFGPARAMS["PARAM"];
                this.m_Params = [];
                if (PARAMS.length > 0) {
                  for (var PARAM_I in PARAMS) {
                    var PARAM = PARAMS[PARAM_I];
                    //console.log("Adding Param:", PARAM);
                    var p_param_def = new moParamDefinition(
                      PARAM[attr_sym]["name"],
                      PARAM[attr_sym]["type"],
                      PARAM[attr_sym]["property"],
                      PARAM[attr_sym]["group"],
                      PARAM[attr_sym]["interpolation"],
                      PARAM[attr_sym]["duration"],
                      PARAM[attr_sym]["options"]
                    );
                    var p_param = new moParam(p_param_def);
                    (p_param as any).m_XmlAttributes = Object.assign({}, PARAM[attr_sym]);
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

                            var subvalue: moText = "";
                            if (SUBVAL[xml_text_value]) {
                              subvalue = SUBVAL[xml_text_value][0];
                            }
                            var subvaluetype: moText = SUBVAL[attr_sym]["type"];

                            newValue.AddSubValue(subvalue, subvaluetype);
                            if (newValue.m_List.length) {
                              var lastvb : any = newValue.m_List[newValue.m_List.length - 1];
                              lastvb.m_XmlText = "" + subvalue;
                              lastvb.m_XmlAttributes = Object.assign({}, SUBVAL[attr_sym]);
                            }
                            //console.log("newValue:", newValue);
                            //var subvaluedata: moText = SUBVAL[0];
                            if (newValue.m_List.length) {
                              if (SUBVAL[attr_sym]["code"])
                                newValue.m_List[newValue.m_List.length - 1].SetCodeName(SUBVAL[attr_sym]["code"]);
                              if (SUBVAL[attr_sym]["attribute"])
                                newValue.m_List[newValue.m_List.length - 1].SetAttribute(SUBVAL[attr_sym]["attribute"]);
                              if (SUBVAL[attr_sym]["min"])
                                newValue.m_List[newValue.m_List.length - 1].SetRange(
                                  SUBVAL[attr_sym]["min"],
                                  SUBVAL[attr_sym]["max"]);
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

        if ("PRECONFIGS" in result["MOCONFIG"][0]) {
          //console.log(result["MOCONFIG"]);
          if (result["MOCONFIG"][0]["PRECONFIGS"].length > 0) {
            var PRECONFIGS = result["MOCONFIG"][0]["PRECONFIGS"][0];
            this.m_PreConfigs = [];
            //console.log(PRECONFIGS);
            if (typeof PRECONFIGS == "object")
            if ("PRE" in PRECONFIGS) {
              var PRES = PRECONFIGS["PRE"];
              if (PRES.length>0) {
                for (var PRE_I in PRES) {
                  var PRECONF = PRES[PRE_I];
                  var preconf_name = "";
                  if (PRECONF[attr_sym] && PRECONF[attr_sym]["name"]) preconf_name = PRECONF[attr_sym]["name"];
                  if (typeof PRECONF == "object") {
                    var PREPARAMS = PRECONF["P"];
                    var Pcfg: moPreconfig = new moPreconfig();
                    Pcfg.m_Name = preconf_name;
                    if (PREPARAMS && PREPARAMS.length > 0) {
                      for (var P_I in PREPARAMS) {
                        var P = PREPARAMS[P_I];
                        var name = "" + P_I;
                        if (P[attr_sym]) if (P[attr_sym]["name"]) name = P[attr_sym]["name"];
                        var value = (P[xml_text_value] ? P[xml_text_value][0] : "0");
                        var pidx: moPreconfigParamIndex = new moPreconfigParamIndex();
                        pidx.m_ParamName = name;
                        pidx.m_ParamIndex = this.GetParamIndex(name);
                        pidx.m_ValueIndex = Number(value);
                        Pcfg.m_PreconfIndexes.push(pidx);
                      }
                    }
                    this.m_PreConfigs.push(Pcfg);
                  }
                }
              }
            }
          }
        }//fin "PRECONFIGS"
        this.m_ConfigLoaded = true;
        if (callback) callback(MO_CONFIG_OK);

        return MO_CONFIG_OK;
    }
    this.m_ConfigLoaded = false;
    return MO_CONFIGFILE_NOT_FOUND;
  }

  /** #918 E0 — serializa el config completo al XML MOCONFIG del 1.0 (lo lee el player C++).
   *  Lo que no cambió se escribe con el texto original (p. ej. "0.0" no pasa a ser "0"). */
  ToXML() : string {
    const esc = (t: any) => ("" + (t === undefined || t === null ? "" : t))
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const attrs = (o: any) => Object.keys(o).filter(k => o[k] !== undefined && o[k] !== null)
      .map(k => " " + k + '="' + esc(o[k]).replace(/"/g, "&quot;") + '"').join("");
    const NUMERIC = ["NUM", "CHAR", "INT", "LONG", "FLOAT", "DOUBLE"];
    let x = this.m_XmlHeader + "\n";
    x += "<MOCONFIG" + attrs({ majorversion: this.m_MajorVersion, minorversion: this.m_MinorVersion }) + ">\n";
    const def = this.m_XmlDefinition || { name: this.GetObjectName(), class: this.GetObjectClass() };
    x += "    <DEFINITION" + attrs(def) + " />\n";
    if (this.m_XmlHasUpdate) x += "    <UPDATE />\n";
    x += "    <CONFIGPARAMS>\n";
    for (const param of this.m_Params) {
      const pd: any = param.m_ParamDefinition;
      const pa: any = Object.assign({}, (param as any).m_XmlAttributes || {});
      pa["name"] = pd.m_Name;
      if (pa["type"] === undefined) pa["type"] = pd.m_TypeStr;
      if (pd.m_Property) pa["property"] = pd.m_Property; else delete pa["property"];
      if (pd.m_OptionsStr) pa["options"] = pd.m_OptionsStr;
      const vals = param.GetValues();
      if (!vals || vals.length == 0) { x += "        <PARAM" + attrs(pa) + " />\n"; continue; }
      x += "        <PARAM" + attrs(pa) + ">\n";
      for (const val of vals) {
        x += "            <VAL>\n";
        for (const vb of (val.m_List as any[])) {
          const da: any = Object.assign({}, vb.m_XmlAttributes || {});
          if (da["type"] === undefined) da["type"] = vb.GetTypeStr();
          const cn = vb.GetCodeName(); if (cn) da["code"] = cn;
          const t = "" + da["type"];
          let text: any;
          if (NUMERIC.indexOf(t) >= 0) {
            text = (vb.m_XmlText !== undefined && Number(vb.m_XmlText) == vb.m_Number) ? vb.m_XmlText : "" + vb.m_Number;
          } else {
            text = vb.m_Text;
          }
          x += "                <D" + attrs(da) + ">" + esc(text) + "</D>\n";
        }
        x += "            </VAL>\n";
      }
      x += "        </PARAM>\n";
    }
    x += "    </CONFIGPARAMS>\n";
    if (this.m_PreConfigs.length) {
      x += "    <PRECONFIGS>\n";
      for (const pre of this.m_PreConfigs) {
        x += "        <PRE" + (pre.m_Name ? attrs({ name: pre.m_Name }) : "") + ">\n";
        for (const pi of pre.m_PreconfIndexes)
          x += "            <P" + attrs({ name: pi.m_ParamName }) + ">" + pi.m_ValueIndex + "</P>\n";
        x += "        </PRE>\n";
      }
      x += "    </PRECONFIGS>\n";
    } else if (this.m_XmlHasPreconfigs) {
      x += "    <PRECONFIGS />\n";
    }
    x += "</MOCONFIG>\n";
    return x;
  }

  SaveConfig( p_filename? : moText ) : MOint  {
    this.m_LastSavedXml = this.ToXML();
    if (p_filename) this.m_FileName = p_filename;
    return MO_CONFIG_OK;
  }

  SaveConfigAs( p_filename? : moText ) : MOint  {

    return MO_CONFIG_OK;
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

  /** #918 E1.7 — copia un VAL al final de la lista del param (texto, tipo, code y atributos originales) */
  CloneValue( P: moParam, idx: number ) : number {
    const src: any = P.m_Values[idx];
    if (!src) return -1;
    const nv: moValue = new moValue();
    for (const vb of (src.m_List as any[])) {
      const t = (vb.m_XmlAttributes && vb.m_XmlAttributes["type"]) || vb.GetTypeStr();
      const txt = (vb.GetDataType && vb.m_DataType !== undefined && ["NUM","CHAR","INT","LONG","FLOAT","DOUBLE"].indexOf(""+t) >= 0) ? "" + vb.m_Number : "" + vb.m_Text;
      nv.AddSubValue(txt, t);
      const nb: any = nv.m_List[nv.m_List.length - 1];
      if (vb.GetCodeName && vb.GetCodeName()) nb.SetCodeName(vb.GetCodeName());
      nb.m_XmlAttributes = Object.assign({}, vb.m_XmlAttributes || {});
    }
    P.AddValue(nv);
    return P.m_Values.length - 1;
  }

  /** ¿algún OTRO preset apunta a este VAL de este param? */
  ValueShared( P: moParam, idx: number ) : boolean {
    const name = "" + P.GetName();
    return this.m_PreConfigs.some((pre, i) => i != this.m_PreconfActual &&
      pre.m_PreconfIndexes.some(pi => ("" + pi.m_ParamName) == name && pi.m_ValueIndex == idx));
  }

  /** antes de editar a mano: si el VAL activo es compartido, el preset activo pasa a tener su copia.
   *  Devuelve el índice a editar (hay que ResolveValue si cambió). */
  ForkForEdit( P: moParam ) : number {
    const cur = Math.max(0, P.GetIndexValue());
    if (!this.ValueShared(P, cur)) return cur;
    const ni = this.CloneValue(P, cur);
    if (ni < 0) return cur;
    const pre = this.m_PreConfigs[this.m_PreconfActual];
    if (pre) for (const pi of pre.m_PreconfIndexes) if (("" + pi.m_ParamName) == ("" + P.GetName())) pi.m_ValueIndex = ni;
    P.SetIndexValue(ni);
    return ni;
  }

  /** mantener apretado un preset: guarda en él el estado actual. Por cada param del PRE, copia el VAL activo
   *  a uno nuevo y el PRE apunta ahí (no pisa VALs compartidos). Devuelve [paramIndex, valueIndex] a resolver. */
  CapturePreConf( p_index: MOint ) : number[][] {
    const pre = this.m_PreConfigs[p_index];
    const out: number[][] = [];
    if (!pre) return out;
    for (const pi of pre.m_PreconfIndexes) {
      if (pi.m_ParamIndex < 0) continue;
      const P = this.m_Params[pi.m_ParamIndex];
      const ni = this.CloneValue(P, Math.max(0, P.GetIndexValue()));
      if (ni >= 0) { pi.m_ValueIndex = ni; out.push([pi.m_ParamIndex, ni]); }
    }
    this.m_PreconfActual = p_index;
    this.m_TransFrom = {};
    for (const pi of pre.m_PreconfIndexes) if (pi.m_ParamIndex >= 0) this.m_Params[pi.m_ParamIndex].SetIndexValue(pi.m_ValueIndex);
    this.SaveConfig();
    return out;
  }

  SetCurrentPreConf( p_actual : MOint, p_duration? : number ) : void {
    if(0<=p_actual && p_actual<this.m_PreConfigs.length )
    {
      /* #918 E1.6: recordar de dónde viene cada param que cambia, para interpolar */
      if (p_duration !== undefined) this.m_PresetDuration = p_duration;
      /* si había una transición a medias, la nueva arranca de lo que se VE ahora (no del destino anterior) */
      const midway: any = {};
      if (this.TransitionK() < 1) {
        for (const name of Object.keys(this.m_TransFrom)) {
          const P = this.m_ParamsByName[name]; if (!P || !P.GetValue()) continue;
          const n = P.GetValue().GetSubValueCount(), arr: number[] = [];
          for (let i = 0; i < n; i++) { const m = this.TransMix(P, i); arr.push(m !== null ? m : Number(P.GetValue().GetSubValue(i).Eval())); }
          midway[name] = arr;
        }
      }
      this.m_TransFrom = {};
      this.m_TransFromNum = {};
      this.m_TransStart = performance.now();
      for (const pi of this.m_PreConfigs[p_actual].m_PreconfIndexes) {
        if (pi.m_ParamIndex < 0) continue;
        const P = this.m_Params[pi.m_ParamIndex];
        if (!P) continue;
        const nm = "" + P.GetName();
        if (midway[nm]) { this.m_TransFrom[nm] = P.GetIndexValue(); this.m_TransFromNum[nm] = midway[nm]; }
        else if (P.GetIndexValue() != pi.m_ValueIndex) this.m_TransFrom[nm] = P.GetIndexValue();
      }
		  for( var i=0; i<this.m_PreConfigs[p_actual].m_PreconfIndexes.length; i++) {
			  var Val : moPreconfigParamIndex = this.m_PreConfigs[p_actual].m_PreconfIndexes[i]; /* #918 E1: antes [p_actual][i] = undefined */
        if (Val.m_ParamIndex >= 0 && Val.m_ValueIndex < this.GetValuesCount(Val.m_ParamIndex))
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
        const m = this.TransMix(Param, 0);
        f = (m !== null) ? m : vb.GetSubValue(0).Eval();
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
        const mix = (i: number) => { const m = this.TransMix(Param, i); return (m !== null) ? m : vb.GetSubValue(i).Eval(); };
        rgba.r = mix(0);
        rgba.g = mix(1);
        rgba.b = mix(2);
        rgba.a = mix(3);
        //this.mr_Color.setRGB(r,g,b);
      }
    }
    return rgba;
  }
}
