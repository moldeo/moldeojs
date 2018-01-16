import * as MO from "moldeojs";

export class moEffectJsfeat extends MO.moEffect {

  constructor() {
    super();
    this.SetName("jsfeat");

  }

  Init(callback?:any): boolean {

    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);

    if (this.PreInit((res) => {
      console.log("moJSFeat:", MO.jsfeat);

      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Draw( p_tempo : MO.moTempo, p_parentstate : MO.moEffectState = null ) : void {

    this.EndDraw();

  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
  }

  GetDefinition(): MO.moConfigDefinition {
    console.log("moEffectJsfeat.GetDefinition Erase");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
