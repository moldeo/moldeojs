
import { MOlong } from "./mo-types";
import { moAbstract } from "./mo-abstract";
import { moMoldeoObject } from "./mo-moldeo-object";

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



export class moResourceElement extends moAbstract {
}

export class moAttribute extends moResourceElement {
  buffer : void;
  itemsize : MOlong;
  length : MOlong;
}

type moAttributeArray = moAttribute[];



export class moResource extends moMoldeoObject {
}

export type moResources = moResource[];

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
		m_Resources : moResources;
 }
