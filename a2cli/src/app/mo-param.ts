import { moAbstract } from "./mo-abstract";
import { MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText, moTextArray } from "./mo-text";
import { moDataType } from "./mo-data-type.enum";
import { moData, moValue, moValues } from "./mo-value";
import { moParamType } from "./mo-param-type.enum";
import { moTimer } from "./mo-timer";
export * from "./mo-param-type.enum";
import { moParamTypeStrs } from "./mo-param-type.enum";

export enum moParamInterpolationFunction {
    MO_INTERPOLATION_NONE=0,
    MO_INTERPOLATION_LINEAR,
    MO_INTERPOLATION_EASE,
    MO_INTERPOLATION_EASEIN,
    MO_INTERPOLATION_EASEOUT,
    MO_INTERPOLATION_EASEINOUT,
    MO_INTERPOLATION_STEPSTART,
    MO_INTERPOLATION_STEPEND,
    MO_INTERPOLATION_CUBICBEZIER,
    MO_INTERPOLATION_EXPRESSION,
    MO_INTERPOLATION_EASEINOUTQUAD,
    MO_INTERPOLATION_EASEINOUTSIN,
    MO_INTERPOLATION_EASEINOUTCUBIC
};

export class moParamInterpolation {
  m_bIsOn : boolean;
  m_Timer : moTimer;
  m_Duration : MOlong; //in milliseconds
  m_Function : moParamInterpolationFunction;

  m_DataIn : moData;
  m_DataOut : moData;
  m_DataInterpolated : moData;

  m_ValueIn : moValue;
  m_ValueOut : moValue;
  m_ValueInterpolated: moValue;

  constructor(  ) {
  }


}

export class moParamDefinition extends moAbstract {
  m_Name : moText;
  m_Type : moParamType;//type of parameter ()
  m_Index : MOint;//index of this parameter on moConfig parameters array

  m_Property : moText;//published or not
  m_Group : moText;
  m_DefaultValue : moValue;
  m_Options : moTextArray;
  m_OptionsStr : moText;
  m_Interpolation: moParamInterpolation;

  constructor(  p_name?: moText,
                p_type?: moText,
                p_property?: moText,
                p_group?: moText,
                p_interpolation?: moText,
                p_duration?: moText,
                p_optionsstr?: moText) {
    super();
    this.m_Name = p_name;
    this.m_Type = this.ParamTypeFromStr(p_type);
    this.m_Property = p_property;
    this.m_Group = p_group;
    this.m_OptionsStr = p_optionsstr;

    var valid_interpolation: boolean = false;
    if ( (""+p_type) in ["ALPHA", "SYNC", "PHASE",
      "TEXTURE", "FUNCTION",
      "ROTATEX", "ROTATEY", "ROTATEZ",
      "SCALEX", "SCALEY", "SCALEZ",
      "TRANSLATEX", "TRANSLATEY", "TRANSLATEZ"]) {
      valid_interpolation = true;
    }

    if (valid_interpolation) {
      this.m_Interpolation = new moParamInterpolation();
    }

  }

  ParamTypeFromStr(p_type: moText): moParamType {
    var p_Type : moParamType;
    p_Type = moParamTypeStrs[""+p_type+""];
    return p_Type;
  }

}
export type moParamDefinitions = moParamDefinition[];

export class moParamIndex {
  index: MOint;
  constructor(index: MOint) {
    this.index = index;
  }
}
export type moParamIndexes = moParamIndex[];

export class moParam extends moAbstract {

  m_ParamDefinition : moParamDefinition;
	m_Values : moValues;
	m_CurrentIndexValue : MOint = -1;

	m_pExternData : moData;//Definido cuando el valor del parámetro es intervenido por un Inlet o un Outlet
  m_bExternDataUpdated : MOboolean = false;//Marcado cuando un Inlet actualiza este parámetro

  constructor( ParamDefinition? : moParamDefinition ) {
    super();
    this.m_ParamDefinition = ParamDefinition;
    this.m_Values = [];
  }

  AddValue(p_value: moValue) {
    this.m_Values.push( p_value );
  }

}

export type moParams = moParam[];
