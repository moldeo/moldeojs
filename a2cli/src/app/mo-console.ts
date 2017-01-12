import { MOfloat, MOdouble, MOulong, moNumber, moTextFilterParam } from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moMoldeoObject } from "./mo-moldeo-object";

export enum moConsoleMode {

  MO_CONSOLE_MODE_LIVE=0,
  MO_CONSOLE_MODE_RECORD_SESSION=1,
  MO_CONSOLE_MODE_PLAY_SESSION=2,
  MO_CONSOLE_MODE_RENDER_SESSION=3,

};

export class moConsoleState {



}

export class moConsole extends moMoldeoObject {
  m_ConsoleState: string;
  m_Config: moConfig;
  constructor() {
    super();
    this.name = "__console__";
  }
  Init() : boolean {
    return super.Init();
  }

}
