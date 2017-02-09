import { moAbstract } from "./mo-abstract";
import { MOint } from "./mo-types";
import { moText } from "./mo-text";
import { moMoldeoObject, moMoldeoObjectType, moMobDefinition } from "./mo-moldeo-object";
import {
  moEffect, moEffectsArray,
  moPreEffect, moPreEffectsArray,
  moPostEffect, moPostEffectsArray,
  moMasterEffect, moMasterEffectsArray,
  moSceneEffect
} from "./mo-effect";
import {
  moPlugin, moPluginsArray,
  moPrePlugin, moPrePluginsArray,
  moPostPlugin, moPostPluginsArray,
  moMasterPlugin, moMasterPluginsArray,
  moNewEffect, moNewPostEffect, moNewMasterEffect, moNewPreEffect, moPluginDefinition,
  moPluginDefinitions, moPluginExtension
} from "./mo-plugin";
import { moDataManager } from "./mo-data-manager";
import { moFileManager } from "./mo-file-manager";
import { moResourceManager } from "./mo-resource-manager";

export class moEffectManager extends moAbstract {

    m_PreEffects : moPreEffectsArray  = [];
		m_Effects : moEffectsArray = [];
		m_PostEffects : moPostEffectsArray = [];
		m_MasterEffects : moMasterEffectsArray = [];

		m_PrePlugins : moPrePluginsArray = [];
		m_Plugins : moPluginsArray = [];
		m_PostPlugins : moPostPluginsArray = [];
		m_MasterPlugins : moMasterPluginsArray = [];

    m_AllEffects: moEffectsArray = [];
    m_pResourceManager: moResourceManager;
    m_pEffectManager: moEffectManager;

  constructor() {
    super();
  }

  Init(): boolean {

    return super.Init();
  }

  New( p_MobDefinition : moMobDefinition ) : moEffect {

    return this.NewEffect(   p_MobDefinition.GetName(),
                        p_MobDefinition.GetConfigName(),
                        p_MobDefinition.GetLabelName(),
                        p_MobDefinition.GetKeyName(),
                        p_MobDefinition.GetType(),
                        p_MobDefinition.GetMobIndex().GetParamIndex(),
                        p_MobDefinition.GetMobIndex().GetValueIndex(),
                        p_MobDefinition.GetActivate()
                    );
}

  NewEffect(p_resname: moText,
    p_configname: moText,
      p_labelname: moText,
      p_keyname: moText, p_type: moMoldeoObjectType,
      p_paramindex: MOint, p_valueindex: MOint,
      p_activate: boolean): moEffect {

    var peffect : any;

    switch( p_type ) {
      case moMoldeoObjectType.MO_OBJECT_EFFECT:
        if ( ""+p_resname=="scene" ) {
          peffect = new moSceneEffect();
        } else {
          peffect = moNewEffect( p_resname, this.m_Plugins);
        }
        p_valueindex = this.m_Effects.length;
        this.m_Effects.push( peffect );

        break;

      case moMoldeoObjectType.MO_OBJECT_PREEFFECT:
        peffect = moNewPreEffect( p_resname, this.m_PrePlugins );
        p_valueindex = this.m_PreEffects.length;
        this.m_PreEffects.push( peffect );
        break;

      case moMoldeoObjectType.MO_OBJECT_POSTEFFECT:
        peffect = moNewPostEffect( p_resname, this.m_PostPlugins );
        p_valueindex = this.m_PostEffects.length;
        this.m_PostEffects.push( peffect );
        break;

      case moMoldeoObjectType.MO_OBJECT_MASTEREFFECT:
        var pmastereffect : any = moNewMasterEffect( p_resname, this.m_MasterPlugins );
        p_valueindex = this.m_MasterEffects.length;
        this.m_MasterEffects.push( pmastereffect );
        peffect = pmastereffect;
        break;
      default:
        break;
    }

    if (peffect) {
      //console.log("moEffectManager.NewEffect", peffect);
      var MDef : moMobDefinition = peffect.GetMobDefinition();
      MDef.SetConfigName( p_configname );
      MDef.SetLabelName( p_labelname );
      MDef.SetKeyName( p_keyname );

      MDef.SetConsoleParamIndex(p_paramindex);
      MDef.SetConsoleValueIndex(p_valueindex);
      MDef.SetActivate(p_activate);

      peffect.SetMobDefinition( MDef );
      //m_pMoldeoObjects->Add( (moMoldeoObject*) peffect );
      peffect.SetResourceManager( this.m_pResourceManager );

      if (peffect.GetName()+"" == "scene"
        || peffect.GetName()+"" == "sequence") {
        peffect.Set( this.m_pEffectManager);
      }

      this.m_AllEffects.push(peffect);
      //console.log("moEffectManager.NewEffect(ok?)", peffect);
    }

    return (peffect);

  }

  PreEffects(): moPreEffectsArray {
    return this.m_PreEffects;
  }

  Effects(): moEffectsArray {
    return this.m_Effects;
  }

  PostEffects(): moPostEffectsArray {
    return this.m_PostEffects;
  }


  MasterEffects(): moMasterEffectsArray {
    return this.m_MasterEffects;
  }

}
