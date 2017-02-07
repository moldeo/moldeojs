import { moAbstract } from "./mo-abstract";
import { MOint, MOuint, MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText, moTextArray } from "./mo-text";
import { moDataType } from "./mo-data-type.enum";
import {
  moData, moValue, moValues, moValueBase,
  moValueType, moValueTypeStr, moValueTypeArr,
  moValueDefinition
} from "./mo-value";
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

   GetType(): moParamType {
     return this.m_Type;
   }

   GetName(): moText {
     return this.m_Name;
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
	m_CurrentIndexValue : MOint = 0;

	m_pExternData : moData;//Definido cuando el valor del parámetro es intervenido por un Inlet o un Outlet
  m_bExternDataUpdated : MOboolean = false;//Marcado cuando un Inlet actualiza este parámetro

  constructor( ParamDefinition? : moParamDefinition ) {
    super();
    this.m_ParamDefinition = ParamDefinition;
    this.m_Values = [];
  }

  GetData() : moData {
    var pReturnData : moData = null;

    ///this Data is connected and updated by an Outlet Connection
    if (this.m_pExternData && this.m_bExternDataUpdated) {
      pReturnData = this.m_pExternData;
      ///dato original del config
      if (this.GetParamDefinition().GetName()=="control_roll_angle" ) {
        ///cout << "control_roll_angle: updated externally val: " + FloatToStr(pReturnData->Eval()) << endl;
      }
    } else {
      //only work for single data values: FUNCTION > float evaluation
      pReturnData = this.GetValue().GetSubValue().GetData();
    }

    ///Interpolation code (defined in config using attributes: interpolation="linear" duration="1000"
    /*if ( this.m_ParamDefinition.GetInterpolation().IsOn() && pReturnData ) {

      /// Eval Data
      pReturnData.Eval();
      ///
      pReturnData = this.m_ParamDefinition.GetInterpolation().InterpolateData( pReturnData );
  }*/

    return null;
  }

  SetExternData( p_pExternData : moData ) {
    this.m_pExternData = p_pExternData;
  }

  GetParamDefinition(): moParamDefinition {
    return this.m_ParamDefinition;
  }


  GetValues() : moValues {
    return this.m_Values;
  }


  GetValuesCount() : MOuint {
    return this.m_Values.length;
  }


  AddValue( value : moValue ) : void {
    this.m_Values.push( value );
  }


  DeleteValue( i : MOint ) {
    this.m_Values.splice(i,1);
  }

  SetDefaultValue() : void {

      //atencion: siempre setear el tipo despues de pasar el valor del texto...
      if (this.GetValuesCount()==0) {
          var xvalue : moValue;
          var valuebase : moValueBase;

          switch( this.m_ParamDefinition.GetType() ) {
              case moParamType.MO_PARAM_COLOR:
                  valuebase.SetText( "1.0" );
                  valuebase.SetType( moValueType.MO_VALUE_FUNCTION );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_BLENDING:
              case moParamType.MO_PARAM_POLYGONMODE:
                  valuebase.SetText( "0" );
                  valuebase.SetInt(0);
                  valuebase.SetType( moValueType.MO_VALUE_NUM );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_ALPHA:
              case moParamType.MO_PARAM_SYNC:
              case moParamType.MO_PARAM_SCALEX:
              case moParamType.MO_PARAM_SCALEY:
              case moParamType.MO_PARAM_SCALEZ:
                  valuebase.SetText( "1.0" );
                  valuebase.SetType( moValueType.MO_VALUE_FUNCTION );
                  xvalue.AddSubValue( valuebase );
                  break;

              case moParamType.MO_PARAM_FUNCTION:
              case moParamType.MO_PARAM_PHASE:
              case moParamType.MO_PARAM_TRANSLATEX:
              case moParamType.MO_PARAM_TRANSLATEY:
              case moParamType.MO_PARAM_TRANSLATEZ:
              case moParamType.MO_PARAM_ROTATEX:
              case moParamType.MO_PARAM_ROTATEY:
              case moParamType.MO_PARAM_ROTATEZ:
                  valuebase.SetText( "0.0" );
                  valuebase.SetType( moValueType.MO_VALUE_FUNCTION );
                  xvalue.AddSubValue( valuebase );
                  break;

              case moParamType.MO_PARAM_TEXTURE:
                  valuebase.SetText( "default" );
                  valuebase.SetType( moValueType.MO_VALUE_TXT );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_3DMODEL:
              case moParamType.MO_PARAM_OBJECT:
              case moParamType.MO_PARAM_VIDEO:
              case moParamType.MO_PARAM_TEXTUREFOLDER:
              case moParamType.MO_PARAM_SOUND:
              case moParamType.MO_PARAM_SCRIPT:
              case moParamType.MO_PARAM_TEXT:
                  if ( this.GetParamDefinition().GetName()=="effect"
                      ||
                      this.GetParamDefinition().GetName()=="preeffect"
                      ||
                      this.GetParamDefinition().GetName()=="posteffect"
                      ||
                      this.GetParamDefinition().GetName()=="mastereffect"
                      ||
                      this.GetParamDefinition().GetName()=="devices"
                      ||
                      this.GetParamDefinition().GetName()=="resources" ) {
                        return;
                      }
                  valuebase.SetText( "" );
                  valuebase.SetType( moValueType.MO_VALUE_TXT );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_MOLDEO_OBJECT:
                return;
              case moParamType.MO_PARAM_FONT:
                  valuebase.SetText( "fonts/Tuffy.ttf" );
                  valuebase.SetType( moValueType.MO_VALUE_TXT );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_FILTER:
                  valuebase.SetText( "" );
                  valuebase.SetType( moValueType.MO_VALUE_TXT );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_INLET:
              case moParamType.MO_PARAM_OUTLET:
                  //valuebase.SetText( "" );
                  //valuebase.SetType( MO_VALUE_TXT );
                  //xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_NUMERIC:
                  valuebase.SetText( "" );
                  valuebase.SetType( moValueType.MO_VALUE_NUM );
                  valuebase.SetInt(0);
                  break;
              case moParamType.MO_PARAM_COMPOSE:
                  valuebase.SetText( "" );
                  valuebase.SetType( moValueType.MO_VALUE_TXT );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  break;
              case moParamType.MO_PARAM_VECTOR:
                  valuebase.SetText( "0.0" );
                  valuebase.SetType( moValueType.MO_VALUE_NUM_FLOAT );
                  xvalue.AddSubValue( valuebase );
                  xvalue.AddSubValue( valuebase );
                  break;

          }

          this.AddValue(xvalue);
      }
  }

  GetValue(p_valueindex?: MOint) {
      if (p_valueindex == undefined || p_valueindex == -1)
        p_valueindex = this.m_CurrentIndexValue;
      return this.m_Values[p_valueindex];
    }

  SetIndexValue( indexvalue : MOint ) : void {

    if (0<=indexvalue && indexvalue< this.m_Values.length ) {
      this.m_CurrentIndexValue = indexvalue;
      this.m_bExternDataUpdated = false;
    }

  }

  GetIndexValue() : MOint {

    return this.m_CurrentIndexValue;

  }

  NextValue() : void {
    if ( this.m_Values.length > 0 ) {
        this.m_bExternDataUpdated = false;
      if ( this.m_CurrentIndexValue < this.m_Values.length-1) {
        this.m_CurrentIndexValue++;
      }
    } else this.m_CurrentIndexValue = -1;
  }

  PrevValue() : void {
    if ( this.m_Values.length > 0 ) {
        this.m_bExternDataUpdated = false;
      if ( this.m_CurrentIndexValue > 0 ) {
        this.m_CurrentIndexValue--;
      }
    } else this.m_CurrentIndexValue = -1;
  }

  FirstValue() : void {
    if (this.m_Values.length > 0) {
        this.m_bExternDataUpdated = false;
      this.m_CurrentIndexValue = 0;
    } else this.m_CurrentIndexValue = -1;
  }


}

export type moParams = moParam[];
