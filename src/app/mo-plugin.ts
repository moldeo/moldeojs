import {moText}from"./mo-text";
import { moMoldeoObjectType }from"./mo-moldeo-object-type.enum";
import {
  moEffect, moPreEffect, moPostEffect, moMasterEffect,
  moPreEffectsArray, moPostEffectsArray, moMasterEffectsArray,
  moEffectState, moSceneEffect
} from "./mo-effect";
import {
  moIODevice, moIODeviceArray, moIODevices
} from "./mo-iodevice";
import {
  moResource
} from "./mo-resource";
import {
  moDataManager
} from "./mo-data-manager";

//import { moEffectImage } from "../plugins/effects/image";
export const moPluginExtension = ".ts";
export class moPluginDefinition {
    m_Name : moText;
    m_FullPath : moText;
    m_MoldeoObjectType : moMoldeoObjectType;

    Constructor : any;

    constructor(name?: string, fullpath?: string, type?: moMoldeoObjectType, pconstructor?: any ) {
      this.m_Name = name;
      this.m_FullPath = fullpath;
      this.m_MoldeoObjectType = type;
      this.Constructor = pconstructor;
      PluginsDefinitionsMap[name] = this;
    }
}
export type moPluginDefinitions = moPluginDefinition[];
export const PluginsDefinitions: moPluginDefinitions = [];
export const PluginsDefinitionsMap = {};

/// PreEffect Erase ====================================================================
import { moPreEffectErase } from "../plugins/preeffects/erase";
PluginsDefinitions.push( new moPluginDefinition(
  "erase",
  "/plugins/preeffects/erase.ts",
  moMoldeoObjectType.MO_OBJECT_PREEFFECT,
moPreEffectErase ) );

/// PreEffect MirrorG ====================================================================
import { moPreEffectMirrorG } from "../plugins/preeffects/mirrorg";
PluginsDefinitions.push( new moPluginDefinition(
  "mirrorg",
  "/plugins/preeffects/mirrorg.ts",
  moMoldeoObjectType.MO_OBJECT_PREEFFECT,
moPreEffectMirrorG ));

/// Effect Image ====================================================================
import { moEffectImage } from "../plugins/effects/image";
PluginsDefinitions.push( new moPluginDefinition(
  "image",
  "/plugins/effects/image.ts",
  moMoldeoObjectType.MO_OBJECT_EFFECT,
moEffectImage ));

/// Effect Camera ====================================================================
import { moEffectCamera } from "../plugins/effects/camera";
PluginsDefinitions.push( new moPluginDefinition(
  "camera",
  "/plugins/effects/camera.ts",
  moMoldeoObjectType.MO_OBJECT_EFFECT,
moEffectCamera ));

/// Effect Icon ====================================================================
import { moEffectIcon } from "../plugins/effects/icon";
PluginsDefinitions.push( new moPluginDefinition(
  "icon",
  "/plugins/effects/icon.ts",
  moMoldeoObjectType.MO_OBJECT_EFFECT,
moEffectIcon ));

/// Effect Plane ====================================================================
import { moEffectPlane } from "../plugins/effects/plane";
PluginsDefinitions.push( new moPluginDefinition(
  "plane",
  "/plugins/effects/plane.ts",
  moMoldeoObjectType.MO_OBJECT_EFFECT,
moEffectPlane ) );

/// Effect Particles Simple ====================================================================
import { moEffectParticlesSimple } from "../plugins/effects/particlessimple";
PluginsDefinitions.push( new moPluginDefinition(
  "particlessimple",
  "/plugins/effects/particlessimple.ts",
  moMoldeoObjectType.MO_OBJECT_EFFECT,
moEffectParticlesSimple ) );
/*
export const PluginsTree = {
  "preeffects": {
    "erase": PluginsDefinitions[0],
    "mirrorg": PluginsDefinitions[1]
  },
  "effects": {
    "image": PluginsDefinitions[2],
    "icon": PluginsDefinitions[3],
    "plane": PluginsDefinitions[4],
    "particlessimple": PluginsDefinitions[5]
  },
  "posteffects": {},
  "mastereffects": {},
  "iodevices": {},
  "resources": {}
};
*/


export class moPlugin {
}
export type moPluginsArray = moPlugin[];

export class moPrePlugin {
}
export type moPrePluginsArray = moPrePlugin[];


export class moPostPlugin {
}
export type moPostPluginsArray = moPostPlugin[];


export class moMasterPlugin {
}
export type moMasterPluginsArray = moMasterPlugin[];


export class moIODevicePlugin {
}
export type moIODevicePluginsArray = moIODevicePlugin[];



export function moNewEffect(p_resname: moText, plugins: any): moEffect {

  //var MDataMan: moDataManager = this.m_pResourceManager.GetDataMan();

  //var complete_name : moText = MDataMan.GetModulesDir()+ "/effects/" + p_resname;
  //complete_name += moPluginExtension;
var PluginDef : moPluginDefinition = PluginsDefinitionsMap[""+p_resname];
  if (PluginDef) {
    //console.log( "PluginDef", PluginDef ) ;
    return new PluginDef.Constructor();
  }

  //LoadPlugin( complete_name );

  return new moEffect();
}

export function moNewPreEffect(p_resname: moText, plugins: any): moEffect {
  //var MDataMan: moDataManager = this.m_pResourceManager.GetDataMan();
  //var complete_name : moText = MDataMan.GetModulesDir()+ "/effects/" + p_resname;
  //complete_name += moPluginExtension;
  var PluginDef : moPluginDefinition = PluginsDefinitionsMap[""+p_resname];
  if (PluginDef) {
    //console.log( "PluginDef", PluginDef ) ;
    return new PluginDef.Constructor();
  }

  return new moPreEffect();
}

export function moNewPostEffect( p_resname : moText, plugins : any ) : moEffect {

  var PluginDef: moPluginDefinition = PluginsDefinitionsMap["" + p_resname];
  if (PluginDef) {
    //console.log( "PluginDef", PluginDef ) ;
    return new PluginDef.Constructor();
  }

  return new moPostEffect();
}

export function moNewMasterEffect( p_resname : moText, plugins : any ) : moEffect {
  var PluginDef : moPluginDefinition = PluginsDefinitionsMap[""+p_resname];
  if (PluginDef) {
    //console.log( "PluginDef", PluginDef ) ;
    return new PluginDef.Constructor();
  }

  return new moMasterEffect();
}


export function moNewIODevice( p_resname : moText, plugins : any ) : moIODevice {
  var PluginDef : moPluginDefinition = PluginsDefinitionsMap[""+p_resname];
  if (PluginDef) {
    //console.log( "PluginDef", PluginDef ) ;
    return new PluginDef.Constructor();
  }
  return new moIODevice();
}

export function moNewResource( p_resname : moText, plugins : any ) : moResource {
  var PluginDef : moPluginDefinition = PluginsDefinitionsMap[""+p_resname];
  if (PluginDef) {
    //console.log( "PluginDef", PluginDef ) ;
    return new PluginDef.Constructor();
  }
  return new moResource();
}

/*
{

  constructor(
                private viewref: ViewContainerRef ,
               private resolver: ComponentFactoryResolver,
               private loader:SystemJsNgModuleLoader,
                private compiler:Compiler)  {}

   openWebApp(menu) {
                this.loader.load(menu.modulePath)  // load the module and its components
                .then ((modFac) => {
                    // the missing step, need to use Compiler to resolve the module's embedded components
                    this.compiler.compileModuleAndAllComponentsAsync<any>(modFac.moduleType)
                        .then((factory) => {
                            let cmpFactory: any;
                            // now look for the module's main component so we can instantiate it
                            for (let i = factory.componentFactories.length - 1; i >= 0; i--) {
                                if (factory.componentFactories[i].componentType.name === menu.componentName) {
                                    cmpFactory = factory.componentFactories[i];
                                }
                            }
                            return cmpFactory;
                            })
                        .then(cmpFactory => {
                            // need to instantiate the Module so we can use it as the provider for the new component
                            let modRef = modFac.create(this.viewref.parentInjector);
                            let compRef = this.viewRef.createComponent(cmpFactory,0,modRef);
                            // done, now Module and main Component are known to NG2
                            ........
                        });
 */
