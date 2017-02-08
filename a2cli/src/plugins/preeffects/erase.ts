import { moEffect, moPreEffect, moEffectState } from "../../app/mo-effect";
import { moConfigDefinition } from "../../app/mo-config";
import { moMobDefinition } from "../../app/mo-moldeo-object";
import { moRenderManager } from "../../app/mo-render-manager";
import { moColor } from "../../app/mo-gui-manager";
import { moTempo } from "../../app/mo-tempo";

export class moPreEffectErase extends moPreEffect {

  RMan: moRenderManager;

  constructor() {
    super();
    this.SetName("erase");
  }

  Init(callback?:any): boolean {
    this.RMan = this.m_pResourceManager.GetRenderMan();
    console.log(`moPreEffecErase.Init ${this.GetName()}`);
    if (this.PreInit((res) => {

      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Draw( p_tempo : moTempo ) : void {

    //console.log("moPreEffectErase.Draw > Erasing", this.m_Config);
    if (this.RMan == undefined) return;
    this.BeginDraw(p_tempo);

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: moColor = new moColor( rgb.r, rgb.g, rgb.b);


    this.RMan.m_Renderer.setClearColor( ccolor, 1.0);
    this.RMan.m_Renderer.clear(true, true, false);

    this.EndDraw();
  }

  Update() {
    super.Update();
    console.log("moPreEffectErase.Update Erase");
  }

  GetDefinition(): moConfigDefinition {
    console.log("moPreEffectErase.GetDefinition Erase");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
