/**
 * moValue
 *
 * All basic data and value definitions
 *
 */
import { MOfloat, MOdouble, MOlong, MOulong, MOint, MOuint, moNumber, moTextFilterParam } from "./mo-types"
import { moText } from "./mo-text"
import { moDataType, moDataTypeStr } from "./mo-data-type.enum"
export * from "./mo-data-type.enum";
import {
  moGetTicks, moGetTicksAbsolute, moGetTicksAbsoluteStep,
  moGetDuration, moGetTimerState, moGetTimerStateStr
} from "./mo-timer";
import { moMathFunction, moParserFunction } from "./mo-math-manager";
import { moTexture, moTextureBuffer } from "./mo-texture";

export class moData {

  m_DataType : moDataType;
  m_Number : moNumber;
  m_Text : moText;
  m_DataSize : MOulong;


  m_bFilteredAlpha : boolean;
  m_bFilteredParams : boolean;
  m_AlphaFilter : MOfloat;
  m_pFilterParam : moTextFilterParam;/**pointer or reference*/
  m_pAlphaFilter : moData;/**pointer or reference*/

  m_pTexture: moTexture = null;
  m_pTextureBuffer: moTextureBuffer = null;

  m_LastEval : MOdouble;

  constructor(type?: any) {
    if (typeof type == "string") {
      if (type in moDataTypeStr)
        this.SetType( moDataTypeStr[type] );
    }
    if (typeof type == "object") {
      if (type.constructor) {
        if (type.constructor.name) {
          if (type.constructor.name == "moDataType") {
            this.SetType( type );
          }

          if (type.constructor.name == "moData") {
            Object.assign(this, type );
          }
        }
      }
    }
  }

  SetType( p_type: moDataType ) {
    this.m_DataType = p_type;
  }

  GetData() : moData {
    return this;
  }

  SetText(p_text: any) {
    this.m_DataType = moDataType.MO_DATA_TEXT;
    this.m_Text = ""+p_text;
  }
  SetChar(p_number: any) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_CHAR;
    this.m_Number = Number(p_number);
  }
  SetInt(p_number: any) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_INT;
    this.m_Number = Number(p_number);
  }
  SetLong(p_number: any) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_LONG;
    this.m_Number = Number(p_number);
  }
  SetFloat(p_float: any) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_FLOAT;
    this.m_Number =  Number(p_float);
  }
  SetDouble(p_float: any) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_DOUBLE;
    this.m_Number = Number(p_float);
  }
  //SetColor( p_color: moText);
  SetTexture(p_texture: any /**moTexture*/) {
    this.m_DataType = moDataType.MO_DATA_IMAGESAMPLE;
    this.m_pTexture = p_texture;
  }

  SetTextureBuffer(p_texture_buffer: any /**moTextureBuffer*/) {
    this.m_DataType = moDataType.MO_DATA_IMAGESAMPLE_TEXTUREBUFFER;
    this.m_pTextureBuffer = p_texture_buffer;
  }

  SetTextureFiltered(p_texture: any /**moTexture*/) {
    this.m_DataType = moDataType.MO_DATA_IMAGESAMPLE_FILTERED;
    this.m_pTexture = p_texture;
  }

  m_pFun: moMathFunction;
  SetFun(p_function: any) {
    this.m_DataType = moDataType.MO_DATA_FUNCTION;
    if (typeof p_function == "string")
      this.m_Text = p_function;
    if (typeof p_function == "object") {
      if (p_function.constructor)
        if ("name" in p_function.constructor) {
          if (p_function.constructor.name == "moMathFunction"
            || p_function.constructor.name == "moParserFunction") {
            this.m_pFun = p_function;
            if (p_function) {
              this.m_Text = p_function.GetExpression();
            }
          }
        }
    }
  }

  Text() : moText {
    return this.m_Text;
  }

  Int() : MOint {
    return this.m_Number;
  }

  Long() : MOlong {
    return this.m_Number;
  }

  Float(): MOfloat {
    return this.m_Number;
  }

  Double() : MOdouble {
    return this.m_Number;
  }

  Eval(): MOfloat {
    if (this.m_DataType == moDataType.MO_DATA_FUNCTION) {
      //var t: string = "this.m_LastEval = " + this.m_Text+";";
      //var time = moGetTicks()/1000.0;
      //console.log("Eval:", t, this);
      //eval(t);
      if (this.m_pFun) {
        this.m_LastEval = this.m_pFun.Eval();
      } else {
        this.m_LastEval = this.m_Number;
      }
    } else {
      this.m_LastEval = this.m_Number;
    }
    return this.m_LastEval;
  }

  Texture(): moTexture {
    return this.m_pTexture;
  }

  TextureBuffer(): moTextureBuffer {
    return this.m_pTextureBuffer;
  }

}

export type moDatas = moData[];
export type moDataMessage = moDatas;
export type moDataMessages = moDataMessage[];

export enum moValueType {
	MO_VALUE_NUM=0,//cualquier número
	MO_VALUE_NUM_CHAR,//un byte
	MO_VALUE_NUM_INT,//entero 32b
	MO_VALUE_NUM_LONG,//entero largo 64b
	MO_VALUE_NUM_FLOAT,//coma flotante 32b
	MO_VALUE_NUM_DOUBLE,//coma flotante precision doble
	MO_VALUE_MATRIX,//any type of VECTOR
	MO_VALUE_TXT,//any type of text, single or multiline
	MO_VALUE_LNK,//link to a file, text is interpreted as relative, absolute link to a file
	MO_VALUE_FUNCTION,//function parameter value, with lots of attributes....
	MO_VALUE_XML,//text, xml formatted...
	MO_VALUE_UNDEFINED
};

export const moValueTypeStr = {
  "NUM": moValueType.MO_VALUE_NUM,//cualquier número
	"CHAR": moValueType.MO_VALUE_NUM_CHAR,//un byte
	"INT": moValueType.MO_VALUE_NUM_INT,//entero 32b
	"LONG": moValueType.MO_VALUE_NUM_LONG,//entero largo 64b
	"FLOAT": moValueType.MO_VALUE_NUM_FLOAT,//coma flotante 32b
	"DOUBLE": moValueType.MO_VALUE_NUM_DOUBLE,//coma flotante precision doble
	"MATRIX": moValueType.MO_VALUE_MATRIX,//any type of VECTOR
	"TXT": moValueType.MO_VALUE_TXT,//any type of text, single or multiline
	"LNK": moValueType.MO_VALUE_LNK,//link to a file, text is interpreted as relative, absolute link to a file
	"FUNCTION": moValueType.MO_VALUE_FUNCTION,//function parameter value, with lots of attributes....
	"XML": moValueType.MO_VALUE_XML,//text, xml formatted...
	"UNDEFINED": moValueType.MO_VALUE_UNDEFINED
};
export const moValueTypeArr = [ "NUM", "CHAR", "INT", "LONG", "FLOAT", "DOUBLE",
  "MATRIX", "TXT", "LNK", "FUNCTION", "XML", "UNDEFINED"];

export class moValueDefinition {

  m_Type : moValueType = moValueType.MO_VALUE_UNDEFINED;
  m_TypeStr: moText = "";
  m_Index : MOint = -1;
  m_CodeName : moText = "";
  m_Min: MOfloat = -1.0;
  m_Max: MOfloat = -1.0;

  m_Attribute : moText;

  constructor() {
  }

  SetType( p_type : moValueType ) : void {
    this.m_Type = p_type;
    this.m_TypeStr = this.GetTypeStr();
  }

  SetIndex( p_index : MOint ) : void {
    this.m_Index = p_index;
  }


  GetType() : moValueType {
    return this.m_Type;
  }


  GetTypeStr(): moText {
    var str = "UNDEFINED";
    var strtype = moValueTypeArr[this.m_Type];
    if (strtype)
      return strtype;
      /*
    switch( this.m_Type) {
      case moValueType.MO_VALUE_FUNCTION:
        str = "FUNCTION";
        break;
      case moValueType.MO_VALUE_LNK:
        str = "LNK";
        break;
      case moValueType.MO_VALUE_NUM:
        str = "NUM";
        break;
      case moValueType.MO_VALUE_NUM_CHAR:
        str = "CHAR";
        break;
      case moValueType.MO_VALUE_NUM_DOUBLE:
        str = "DOUBLE";
        break;
      case moValueType.MO_VALUE_NUM_FLOAT:
        str = "FLOAT";
        break;
      case moValueType.MO_VALUE_NUM_INT:
        str = "INT";
        break;
      case moValueType.MO_VALUE_NUM_LONG:
        str = "LONG";
        break;
      case moValueType.MO_VALUE_TXT:
        str = "TXT";
        break;
      case moValueType.MO_VALUE_XML:
        str = "XML";
        break;
      case moValueType.MO_VALUE_MATRIX:
        str = "MATRIX";
        break;
    }*/
    return str;
  }

  ValueTypeFromStr(p_value_type_str: moText): moValueType {
      var vtype : moValueType = moValueTypeStr[""+p_value_type_str];
      if (vtype != undefined) return vtype;
        /*
      if (p_value_type_str=="FUNCTION") {
        return moValueType.MO_VALUE_FUNCTION;
      } else if (p_value_type_str=="NUM") {
        return moValueType.MO_VALUE_NUM;
      } else if (p_value_type_str=="CHAR") {
        return moValueType.MO_VALUE_NUM_CHAR;
      } else if (p_value_type_str=="INT") {
        return moValueType.MO_VALUE_NUM_INT;
      } else if (p_value_type_str=="LONG") {
        return moValueType.MO_VALUE_NUM_LONG;
      } else if (p_value_type_str=="FLOAT") {
        return moValueType.MO_VALUE_NUM_FLOAT;
      } else if (p_value_type_str=="DOUBLE") {
        return moValueType.MO_VALUE_NUM_DOUBLE;
      } else if (p_value_type_str=="TXT") {
        return moValueType.MO_VALUE_TXT;
      } else if (p_value_type_str=="XML") {
        return moValueType.MO_VALUE_XML;
      } else if (p_value_type_str=="LNK") {
        return moValueType.MO_VALUE_LNK;
      } else if (p_value_type_str=="MATRIX") {
        return moValueType.MO_VALUE_MATRIX;
      }
*/
      return moValueType.MO_VALUE_UNDEFINED;
  }


  GetIndex() : MOint {
    return this.m_Index;
  }


  GetCodeName() : moText {
    return this.m_CodeName;
  }


  SetCodeName( p_codename : moText ) : void {
    this.m_CodeName = p_codename;
  }
/*
  SetRange( min : MOfloat, max : MOfloat ) : void {
    this.m_Min = min;
    this.m_Max = max;
  }*/

  SetRange( min : any, max : any ) {
    this.m_Min = Number(min);
    this.m_Max = Number(max);
  }

  GetRange(): any {
    return { "min": this.m_Min, "max": this.m_Max };
  }

  GetAttribute() : moText {
    return this.m_Attribute;
  }

  SetAttribute( p_attribute : moText ) : moValueDefinition {
    this.m_Attribute = p_attribute;
    return this;
  }

  IsValid() : boolean {
    return (this.m_Type!=moValueType.MO_VALUE_UNDEFINED);
  }


};

/**
 * Value is made over data
 *
 * "la valeur des données"
 * "Une valeur de base (moValueBase) est donc une donnée (moData) avec une definition (moValueDefinition):"
 *
 * attribute : "attribut <son attribut principal [publié,non publié, ouvert, fermé]"
 * range : limites" <ses limites, gauche, droite>"
 * index : "indice <nom en reference a un arrangement préalable>"
 *
 *
 *  */
export class moValueBase extends moData {

  m_ValueDefinition : moValueDefinition;

  constructor() {
    super();
  }
  SetValueDefinition( p_valuedefinition : moValueDefinition ) { this.m_ValueDefinition = p_valuedefinition; }
  GetValueDefinition() : moValueDefinition { return this.m_ValueDefinition; }
  SetCodeName( p_codename : moText ) { this.m_ValueDefinition.SetCodeName(p_codename);}
  GetCodeName() : moText { return this.m_ValueDefinition.GetCodeName(); }
  SetAttribute(p_attribute: moText) { this.m_ValueDefinition.SetAttribute(p_attribute); }
  GetAttribute() { return this.m_ValueDefinition.GetAttribute(); }
  SetRange( min: any, max: any) { this.m_ValueDefinition.SetRange(min, max); }
  GetRange() : any { return this.m_ValueDefinition.GetRange(); }
  SetIndex( p_index: MOint) { this.m_ValueDefinition.SetIndex(p_index);}
  GetIndex(): MOint { return this.m_ValueDefinition.m_Index; }
  SetType(p_type: any) : void {
    this.m_ValueDefinition.m_Type = p_type;
  }
  GetType(): moValueType { return this.m_ValueDefinition.GetType(); }
  GetTypeStr(): moText { return this.m_ValueDefinition.GetTypeStr(); }
}
export type moValueBases = moValueBase[];

export class moValue {
  m_List: moValueBases = [];

  //constructor(strvalues?: Object) {}
  /*
  constructor(strvalues?: Object);
  constructor(p_Value?: moValue);
  constructor(strvalue: moText, type: moText);
  constructor(strvalue: moText, type: moValueType);
  constructor(strvalue: moText, type: moText,
              strvalue2: moText, type2: moText);
  constructor(strvalue: moText, type: moText,
              strvalue2: moText, type2: moText,
              strvalue3: moText, type3: moText);*/
  constructor(strvalue?: any, type?: any,
              strvalue2?: moText, type2?: any,
              strvalue3?: moText, type3?: any,
              strvalue4?: moText, type4?: any) {
    //if (strvalue == undefined)
      //this.AddSubValue("", "UNDEFINED");

    if (typeof strvalue == "object") {
      if ("length" in strvalue) {
        for (let i = 0; i < strvalue.length; i += 2) {
          this.AddSubValue(strvalue[i], strvalue[i + 1]);
        }
      } else {
        Object.assign(this, strvalue);
      }
    }
    if (typeof strvalue == "string")
      this.AddSubValue(strvalue, type);
    if (typeof strvalue2 == "string")
      this.AddSubValue(strvalue2, type2);
    if (typeof strvalue3 == "string")
      this.AddSubValue(strvalue3, type3);
    if (typeof strvalue4 == "string")
      this.AddSubValue(strvalue4, type4);

  }


  AddSubValue( p_valuebase: moValueBase);
  AddSubValue( strvalue: moText, type: moText);
  AddSubValue( valuebase : any, type?: moText ) {
    //console.log("moValue::AddSubValue > ", valuebase, type);
    var vD: moValueDefinition = new moValueDefinition();

    if (valuebase == undefined) {
      valuebase = "";
    }

    if (typeof valuebase == "string") {
      var vB: moValueBase = new moValueBase();

      if (type == "TEXT" || type=="TXT") {
        vD.SetType(moValueType.MO_VALUE_TXT);
        vB.SetText(valuebase);
      } else if (type == "LNK") {
        vD.SetType(moValueType.MO_VALUE_LNK);
        vB.SetText(valuebase);
      } else if (type == "XML") {
        vD.SetType(moValueType.MO_VALUE_XML);
        vB.SetText(valuebase);
      } else if (type == "NUM") {
        vD.SetType(moValueType.MO_VALUE_NUM);
        vB.SetInt(valuebase);
      } else if (type == "INT") {
        vD.SetType(moValueType.MO_VALUE_NUM_INT);
        vB.SetInt(valuebase);
      } else if (type == "CHAR") {
        vD.SetType(moValueType.MO_VALUE_NUM_CHAR);
        vB.SetChar(valuebase);
      } else if (type == "LONG") {
        vD.SetType(moValueType.MO_VALUE_NUM_LONG);
        vB.SetLong(valuebase);
      } else if (type == "FLOAT") {
        vD.SetType(moValueType.MO_VALUE_NUM_FLOAT);
        vB.SetFloat(valuebase);
      } else if (type == "DOUBLE") {
        vD.SetType(moValueType.MO_VALUE_NUM_DOUBLE);
        vB.SetDouble(valuebase);
      } else if (type == "FUNCTION") {
        vD.SetType(moValueType.MO_VALUE_FUNCTION);
        vB.SetFun(valuebase);
      } else if (type == "MATRIX") {
        vB.SetText(valuebase);
        vD.SetType(moValueType.MO_VALUE_MATRIX);
      } else {
        vB.SetText(valuebase);
      }

      vB.SetValueDefinition(vD);
      this.m_List.push(vB);
    } else {
      vB = valuebase;
      this.m_List.push(vB);
        //console.log("moValue::AddSubValue(moValueBase) > ", vb, this.m_List);
    }
  }

  GetSubValue(  p_indexsubvalue : MOint = 0 ) : moValueBase {
    return this.m_List[p_indexsubvalue];
  }
    GetLastSubValue() : moValueBase {
    return this.m_List[this.GetSubValueCount() - 1];
  }
  GetSubValueCount() : MOuint {
    return this.m_List.length;
  }

  RemoveSubValues(): void {
    this.m_List = [];
  }

}
export type moValues = moValue[];
