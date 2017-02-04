
import { moText, moTextHeap } from "./mo-text";

export class moDebug {

  Message(str: moText): void {
    console.log(str);
  }

  Error(str: moText): void {
    console.error(str);
  }

  _theap: moTextHeap;
};

var _MODebug2: moDebug = new moDebug();

export class moAbstract {

  m_bInitialized: boolean;
  MODebug2: moDebug = _MODebug2;

  constructor() {
    this.m_bInitialized = false;
  }

  Init(): boolean {
    //console.log("moAbstract::Init");
    this.m_bInitialized = true; return true;
  }

  Finish(): boolean {
    console.log("moAbstract::Finish");
    this.m_bInitialized = false; return true;
  }

  Initialized(): boolean {
    return this.m_bInitialized;
  }

  ToJSON(): any {
    return {};
  }
}
