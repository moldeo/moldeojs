
import { MOlong } from "./mo-types";
import { moAbstract } from "./mo-abstract";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moResource, moResources } from "./mo-resource";

//import { moFileManager } from "./mo-file-manager";
//import { moVideoManager } from "./mo-video-manager";

//import { moFilterManager } from "./mo-filter-manager";

//import { moNetManager } from "./mo-net-manager";

import { moTimeManager } from "./mo-time-manager";

import { moDataManager } from "./mo-data-manager";

//import { moFBManager } from "./mo-fb-manager";

import { moGLManager } from "./mo-gl-manager";

import { moRenderManager } from "./mo-render-manager";

//import { moShaderManager } from "./mo-shader-manager";

//import { moMathManager } from "./mo-math-manager";

//import { moFontManager } from "./mo-font-manager";

import { moGUIManager } from "./mo-gui-manager";

//import { moScriptManager } from "./mo-script-manager";

import { moTextureManager } from "./mo-texture-manager";

import { moSoundManager } from "./mo-sound-manager";

import { mo3dModelManager } from "./mo-3d-model-manager";

import { moDebugManager } from "./mo-debug-manager";

//import { moDecoderManager } from "./mo-decoder-manager";

import { moScriptManager } from "./mo-script-manager";


export class moResourceManager extends moAbstract {
    //MOFileMan : moFileManager;
		//MOVideoMan : moVideoManager;
		//MOFilterMan : moFilterManager;
		//MONetMan : moNetManager;
		MOTimeMan : moTimeManager;
		MODataMan : moDataManager;
		//MOFBMan : moFBManager;
		//MOGLMan : moGLManager;
		MORenderMan : moRenderManager;
		//MOShaderMan : moShaderManager;
		//MOMathMan : moMathManager;
		//MOFontMan : moFontManager;
		MOGuiMan : moGUIManager;
		//MOScriptMan : moScriptManager;
		MOTextureMan : moTextureManager;
		MOSoundMan : moSoundManager;
		MOModelMan : mo3dModelManager;
		MODebugMan : moDebugManager;
		//MODecoderMan : moDecoderManager;
    m_Resources: moResources;

    constructor() {
      super();
    }

    Init(options?: any): boolean {

      if (this.MORenderMan) { }
      else this.MORenderMan = new moRenderManager();
      console.log("moResourceManager::Init > MORenderMan:", this.MORenderMan);

      if (this.MODataMan) { }
      else this.MODataMan = new moDataManager();
      console.log("moResourceManager::Init > MODataMan:", this.MODataMan);

      if (this.MOGuiMan) { }
      else this.MOGuiMan = new moGUIManager();
      console.log("moResourceManager::Init > MOGuiMan:", this.MOGuiMan);

      return super.Init();
    }
};
