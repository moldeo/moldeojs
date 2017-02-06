
import { moEffectState } from "./mo-effect-state";
export { moEffectState } from "./mo-effect-state";
import { moMoldeoObject, moMobState, moMoldeoObjectType } from "./mo-moldeo-object";
import { moEffectManager } from "./mo-effect-manager";
import { moConsoleState } from "./mo-console-state";
import { moTempo } from "./mo-tempo";

export class moEffect extends moMoldeoObject {

  m_EffectState: moEffectState;

  constructor() {
    super();
    this.m_EffectState = new moEffectState();
    this.SetType(moMoldeoObjectType.MO_OBJECT_EFFECT);
  }

  PreInit(callback?:any): boolean {
    this.m_EffectState.Init();
    if (this.m_pResourceManager==undefined) return false;

    if (super.Init((res) => {
      console.log("moEffect.PreInit OK!", this);
      this.CreateConnectors();
      if (callback) callback(res);
    } )) {
      ///Al fin luego de levantar todas las configuraciones, creamos los conectores (Inlets <NO INTERNOS> y Outlets)

    } else return false;

    return true;
  }

  Draw( p_tempo : moTempo ) : void {
    //console.log( `moEffect.Draw ${this.m_MobDefinition.GetName()}` );
  }

  GetState() : moMobState {
      return this.m_MobState;
  }

  SetState( p_MobState : moMobState ) : boolean {
      //TODO: check things before commit changes
      this.m_MobState = p_MobState;
      return true;
  }

  Activate() : void {
      var mobstate : moMobState = this.GetState();
      mobstate.Activate();
      this.SetState( mobstate );
  }

  Deactivate() : void {
      var mobstate : moMobState = this.GetState();
      mobstate.Deactivate();
      this.SetState( mobstate );
  }

  Activated() : boolean {
      return this.GetState().Activated();
  }

  Select() {
      var mobstate : moMobState = this.GetState();
      mobstate.Select();
      this.SetState( mobstate );
  }

  Unselect() {
      var mobstate : moMobState = this.GetState();
      mobstate.Unselect();
      this.SetState( mobstate );
  }

  Selected() : boolean {
      return this.GetState().Selected();
  }

}

export type moEffectsArray = moEffect[];

export class moPreEffect extends moEffect {
  constructor() {
    super();
    this.SetType(moMoldeoObjectType.MO_OBJECT_PREEFFECT);
  }
}
export type moPreEffectsArray = moPreEffect[];




export class moPostEffect extends moEffect {
  constructor() {
    super();
    this.SetType(moMoldeoObjectType.MO_OBJECT_POSTEFFECT);
  }
}
export type moPostEffectsArray = moPostEffect[];




export class moMasterEffect extends moEffect {

  m_pEffectManager: moEffectManager;

  constructor() {
    super();
    this.SetType(moMoldeoObjectType.MO_OBJECT_MASTEREFFECT);
  }

  Set(p_EffectManager: moEffectManager, cstate?: moConsoleState) {
    this.m_pEffectManager = p_EffectManager;
  }
}
export type moMasterEffectsArray = moMasterEffect[];

export class moSceneEffect extends moMasterEffect {
};
