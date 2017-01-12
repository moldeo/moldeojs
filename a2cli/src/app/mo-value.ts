/**
 * moValue
 *
 * All basic data and value definitions
 *
 */
import { MOfloat, MOdouble, MOulong, moNumber, moTextFilterParam } from "./mo-types"
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


}

export type moDatas = moData[];
export type moDataMessage = moDatas;
export type moDataMessages = moDataMessage[];


export class moValueBase extends moData {

}
export type moValueBases = moValueBase[];

export class moValue {
  m_List: moValueBases;
  constructor(subvalues: Object) {
    this.m_List = [];
  }
}
export type moValues = moValue[];
