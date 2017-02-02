
import { MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moValue, moValues, moValueBase, moValueBases, moValueDefinition } from "./mo-value";
import { moParam, moParams, moParamIndexes, moParamDefinition, moParamDefinitions } from "./mo-param";
import { moPreconfig, moPreConfigs } from "./mo-pre-config";
import { moFile } from "./mo-file-manager";
import * as xml2js from "xml2js";


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

}
//type moPreConfigs = moPreconfig[];

export class moConfig extends moAbstract {

    m_ConfigLoaded : MOboolean;
		m_Params : moParams;//los parametros del config
		m_PreConfigs : moPreConfigs;
		m_ConfigDefinition : moConfigDefinition;

		m_MajorVersion : MOint;
		m_MinorVersion : MOint;
		m_FileName : moText;

		m_CurrentParam : MOint;// el indice que indica cual es el parametro actual.
		m_PreconfParamNum : MOint;
		m_PreconfActual: MOint;

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
    LoadConfig( configname : moText ) : boolean {
      if (configname.length > 1000) {
          //console.log("moConfig::LoadConfig > Full text", configname);
          //parse XML:
          xml2js.parseString(configname, (err, result) => {
            //console.log(result);
            //console.log('Parsing done');
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
                  }
                }
                console.log("Added params:", this.m_Params);

              }
            }//fin "CONFIGPARAMS"

            if ("PRECONFIGS" in result["MOCONFIG"]) {

            }//fin "PRECONFIGS"


          });

      }
      return false;
    }
}
