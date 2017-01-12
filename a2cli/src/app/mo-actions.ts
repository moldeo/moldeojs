
import { MOfloat, MOdouble, MOulong, moNumber, moTextFilterParam } from "./mo-types"
import { moText } from "./mo-text"
import { moDataType } from "./mo-data-type.enum"
import { moData, moDataMessages } from "./mo-value"

/**
 * moActions
 */

export class moMoldeoActionType {

}

export class moAction {
  m_ActionType: moMoldeoActionType;
  m_Arguments: moDataMessages;

}
