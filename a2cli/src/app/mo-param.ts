import { moAbstract } from "./mo-abstract";
import { MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText, moTextArray } from "./mo-text";
import { moDataType } from "./mo-data-type.enum";
import { moData, moValue } from "./mo-value";
import { moParamType } from "./mo-param-type.enum";
import { moTimer } from "./mo-timer";
export * from "./mo-param-type.enum";

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
  m_ValueInterpolated : moValue;
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
  m_Interpolation : moParamInterpolation;
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

}

export type moParams = moParam[];
