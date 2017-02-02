export class moAbstract {

  m_bInitialized: boolean;

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
