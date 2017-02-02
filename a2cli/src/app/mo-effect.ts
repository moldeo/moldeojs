
import { moEffectState } from "./mo-effect-state";
export { moEffectState } from "./mo-effect-state";
import { moMoldeoObject } from "./mo-moldeo-object";

export class moEffect extends moMoldeoObject {
	m_EffectState: moEffectState;
	Draw() {}
}
export type moEffectsArray = moEffect[];



export class moPreEffect extends moEffect {
	Draw() {}
}
export type moPreEffectsArray = moPreEffect[];




export class moPostEffect extends moEffect {
	Draw() {}
}
export type moPostEffectsArray = moPostEffect[];




export class moMasterEffect extends moEffect {
	Draw() {}
}
export type moMasterEffectsArray = moMasterEffect[];

