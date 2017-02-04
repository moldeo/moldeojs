import * as xml2js from "xml2js";


import { MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moValue, moValues, moValueBase, moValueBases, moValueDefinition } from "./mo-value";
import { moParam, moParams, moParamIndexes, moParamDefinition, moParamDefinitions } from "./mo-param";
import { moPreconfig, moPreConfigs } from "./mo-pre-config";
import { moFile } from "./mo-file-manager";

export const MO_PARAM_NOT_SEL = -1;
export const MO_PARAM_NOT_FOUND = -1;
export const MO_CONFIGFILE_NOT_FOUND = -1;
export const MO_CONFIG_OK = 0;
export const MO_SELECTED = -1;

export class moConfigDefinition extends moAbstract {

  m_ParamDefinitions : moParamDefinitions;
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

}
//type moPreConfigs = moPreconfig[];

export class moConfig extends moAbstract {

    m_ConfigLoaded : MOboolean = false;
    m_Params: moParams = [];//los parametros del config
    m_ParamsByName: any = {};
    m_PreConfigs : moPreConfigs = [];
		m_ConfigDefinition : moConfigDefinition;

		m_MajorVersion : MOint = 0;
		m_MinorVersion : MOint = 0;
		m_FileName : moText;

		m_CurrentParam : MOint = 0;// el indice que indica cual es el parametro actual.
		m_PreconfParamNum : MOint = 0;
		m_PreconfActual: MOint = 0;

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
		static moTexture*              m_pTexture;
    */
    constructor() {
      super();
      this.m_ConfigDefinition = new moConfigDefinition();
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

    }

    CreateDefault(p_fullconfigname: moText) : boolean {
      return false;
    }

    IsConfigLoaded(): boolean {
      return this.m_ConfigLoaded;
    }

    //LoadConfig( config: moFile ): boolean;
    LoadConfig( configtext: any, callback?: any ): MOint {
      console.log("configname:", typeof configtext, configtext);
      //return MO_CONFIGFILE_NOT_FOUND;
      if ( configtext && typeof configtext == "string" ) {
          //console.log("moConfig::LoadConfig > Full text", configname);
          //parse XML:
          xml2js.parseString( configtext, (err, result) => {
            //console.log(result);
            //console.log('Parsing done');
            this.m_ParamsByName = {};

            if ("MOCONFIG" in result) {
              if ("CONFIGPARAMS" in result["MOCONFIG"]) {
                var CFGPARAMS = result["MOCONFIG"]["CONFIGPARAMS"][0]["PARAM"];
                this.m_Params = [];
                for (var PARAM_I in CFGPARAMS) {
                  var PARAM = CFGPARAMS[PARAM_I];
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
                  var p_param = new moParam( p_param_def );
                  this.m_Params.push(p_param);
                  this.m_ParamsByName[""+p_param.m_ParamDefinition.m_Name] = p_param;
                  var PARAMVALS = PARAM["VAL"];
                  for (var PARAMVAL_I in PARAMVALS) {
                    var VAL = PARAMVALS[PARAMVAL_I];
                    var newValue: moValue = new moValue();
                    var VALSUBS = VAL["D"];
                    for (var SUBVAL_I in VALSUBS) {
                      var SUBVAL = VALSUBS[SUBVAL_I];
                      //console.log(" <D> Subvalue:", SUBVAL);
                      var vbd: moValueDefinition = new moValueDefinition();

                      var subvalue: moText = SUBVAL["_"];
                      var subvaluetype: moText = SUBVAL["$"]["type"];

                      newValue.AddSubValue( subvalue, subvaluetype );
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
                    p_param.AddValue(newValue);
                    p_param.m_ParamDefinition.m_Index = this.m_Params.length - 1;
                  }
                }
                console.log("Added params:", this.m_Params);

              }
            }//fin "CONFIGPARAMS"

            if ("PRECONFIGS" in result["MOCONFIG"]) {

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


    Text(param_id: any) : moText {
      var param: moParam;
      param = this.GetParam(param_id);
      if (param && param.m_Values.length>0)
        return param.m_Values[0].m_List[0].m_Text;
      return "";
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
    return this.m_Params[ p_paramindex].GetValuesCount();
  }

  GetValue( p_paramindex : any, indexvalue : MOint ) : moValue {
      var param : moParam = this.GetParam(p_paramindex);
      return param.GetValue( indexvalue );
  }

  GetCurrentValueIndex(p_paramindex: MOint) {
    return this.m_Params[p_paramindex].GetIndexValue();
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

}





