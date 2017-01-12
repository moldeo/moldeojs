
import { moEffectState } from "./mo-effect-state";
import { moMoldeoObject } from "./mo-moldeo-object";

export class moEffect extends moMoldeoObject {
	m_EffectState: moEffectState;
	Draw() {}
}

export class moPreEffect extends moEffect {
	Draw() {}
}
export class moPostEffect extends moEffect {
	Draw() {}
}
export class moMasterEffect extends moEffect {
	Draw() {}
}
