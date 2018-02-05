
import { moAbstract } from "./mo-abstract";
import { moText } from "./mo-text";
import { MOint } from "./mo-types";

export class moPreconfigParamIndex  {
  m_ParamName : moText;
  m_ParamIndex : MOint;
  m_ValueIndex : MOint;
};
export type moPreconfigIndexes = moPreconfigParamIndex[];

export class moPreconfig extends moAbstract {

  m_Name : moText = "";
  m_PreconfIndexes : moPreconfigIndexes = [];
  m_pindex : moPreconfigParamIndex;

  constructor() {
    super();
  }

  Init(): boolean {
    return super.Init();
  }
}
export type moPreConfigs = moPreconfig[];
