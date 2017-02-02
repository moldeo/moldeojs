/**
 * moValue
 *
 * All basic data and value definitions
 *
 */
import { MOfloat, MOdouble, MOulong, MOint, moNumber, moTextFilterParam } from "./mo-types"
import { moText } from "./mo-text"
import { moDataType } from "./mo-data-type.enum"
export * from "./mo-data-type.enum";

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

  m_LastEval : MOdouble;

  SetText(p_text: moText) {
    this.m_DataType = moDataType.MO_DATA_TEXT;
    this.m_Text = p_text;
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
  SetFloat(p_float: moText) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_FLOAT;
    this.m_Number =  Number(p_float);
  }
  SetDouble(p_float: moText) {
    this.m_DataType = moDataType.MO_DATA_NUMBER_DOUBLE;
    this.m_Number = Number(p_float);
  }
  //SetColor( p_color: moText);
  SetTexture(p_texture: any /**moTexture*/) {
    this.m_DataType = moDataType.MO_DATA_IMAGESAMPLE_TEXTUREBUFFER;
  }

  SetTextureFiltered(p_texture: any /**moTexture*/) {
    this.m_DataType = moDataType.MO_DATA_IMAGESAMPLE_FILTERED;
  }

  SetFun(p_function: moText) {
    this.m_DataType = moDataType.MO_DATA_FUNCTION;
    this.m_Text = p_function;
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
  m_Index : MOint = -1;
  m_CodeName : moText = "";
  m_Min: MOfloat = -1.0;
  m_Max: MOfloat = -1.0;

  m_Attribute : moText;

  constructor() {
  }

  SetType( p_type : moValueType ) : void {
	  this.m_Type = p_type;
  }

  SetIndex( p_index : MOint ) : void {
    this.m_Index = p_index;
  }


  GetType() : moValueType {
    return this.m_Type;
  }


  GetTypeStr(): moText {
    var str = "UNDEFINED";
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
    }
    return str;
  }

  ValueTypeFromStr( p_value_type_str : moText ) : moValueType {
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
  GetIndex(): MOint { return this.m_ValueDefinition.m_Index;}
}
export type moValueBases = moValueBase[];

export class moValue {
  m_List: moValueBases = [];

  constructor(subvalues?: Object) {
  }

  AddSubValue( p_valuebase: moValueBase);
  AddSubValue( strvalue: moText, type: moText);
  AddSubValue( valuebase : any, type?: moText ) {
    //console.log("moValue::AddSubValue > ", valuebase, type);
    var vd: moValueDefinition = new moValueDefinition();

    if (valuebase == undefined) {
      valuebase = "";
    }

    if (typeof valuebase == "string") {
      var vb: moValueBase = new moValueBase();
      if (type == "TEXT") {
        vd.SetType(moValueType.MO_VALUE_TXT);
        vb.SetText(valuebase);
      } else if (type == "LNK") {
        vd.SetType(moValueType.MO_VALUE_LNK);
        vb.SetText(valuebase);
      } else if (type == "XML") {
        vd.SetType(moValueType.MO_VALUE_XML);
        vb.SetText(valuebase);
      } else if (type == "NUM") {
        vd.SetType(moValueType.MO_VALUE_NUM);
        vb.SetInt(valuebase);
      } else if (type == "INT") {
        vd.SetType(moValueType.MO_VALUE_NUM_INT);
        vb.SetInt(valuebase);
      } else if (type == "CHAR") {
        vd.SetType(moValueType.MO_VALUE_NUM_CHAR);
        vb.SetChar(valuebase);
      } else if (type == "LONG") {
        vd.SetType(moValueType.MO_VALUE_NUM_LONG);
        vb.SetLong(valuebase);
      } else if (type == "FLOAT") {
        vd.SetType(moValueType.MO_VALUE_NUM_FLOAT);
        vb.SetFloat(valuebase);
      } else if (type == "DOUBLE") {
        vd.SetType(moValueType.MO_VALUE_NUM_DOUBLE);
        vb.SetDouble(valuebase);
      } else if (type == "FUNCTION") {
        vd.SetType(moValueType.MO_VALUE_FUNCTION);
        vb.SetFun(valuebase);
      } else if (type == "MATRIX") {
        vb.SetText(valuebase);
        vd.SetType(moValueType.MO_VALUE_MATRIX);
      } else vb.SetText( valuebase );
      vb.SetValueDefinition(vd);
      this.m_List.push(vb);
    } else {
      vb = valuebase;
      this.m_List.push(vb);
      //console.log("moValue::AddSubValue(moValueBase) > ", vb, this.m_List);
    }
  }


}
export type moValues = moValue[];
