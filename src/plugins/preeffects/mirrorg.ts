import * as MO from "moldeojs";

export class moPreEffectMirrorG extends MO.moPreEffect {

  RMan: MO.moRenderManager;

  constructor() {
    super();
    this.SetName("mirrorg");
  }

  Init(callback?:any): boolean {
    this.RMan = this.m_pResourceManager.GetRenderMan();
    console.log(`moPreEffect${this.GetName()}.Init`);
    if (this.PreInit((res) => {

      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Draw( p_tempo : MO.moTempo ) : void {

    //console.log("moPreEffectMirrorG.Draw >");
    if (this.RMan == undefined) return;
    this.BeginDraw(p_tempo);

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgb.r, rgb.g, rgb.b);


    this.RMan.m_Renderer.setClearColor( ccolor, 1.0);
    this.RMan.m_Renderer.clear(true, true, false);

    this.EndDraw();
  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moPreEffectErase.Update Erase");
  }

  GetDefinition(): MO.moConfigDefinition {
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
