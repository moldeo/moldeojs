import { Http } from "@angular/http";


import { MOlong } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moConfig } from "./mo-config";
import { moResource, moResources } from "./mo-resource";

import { moFileManager } from "./mo-file-manager";
import { moVideoManager } from "./mo-video-manager";

//import { moFilterManager } from "./mo-filter-manager";

//import { moNetManager } from "./mo-net-manager";

import { moTimeManager } from "./mo-time-manager";

import { moDataManager } from "./mo-data-manager";

//import { moFBManager } from "./mo-fb-manager";

import { moGLManager } from "./mo-gl-manager";

import { moRenderManager } from "./mo-render-manager";

//import { moShaderManager } from "./mo-shader-manager";

import { moMathManager } from "./mo-math-manager";

//import { moFontManager } from "./mo-font-manager";

import { moGUIManager } from "./mo-gui-manager";

//import { moScriptManager } from "./mo-script-manager";

import { moTextureManager } from "./mo-texture-manager";

import { moSoundManager } from "./mo-sound-manager";

import { mo3dModelManager } from "./mo-3d-model-manager";

import { moDebugManager } from "./mo-debug-manager";

//import { moDecoderManager } from "./mo-decoder-manager";

import { moScriptManager } from "./mo-script-manager";

import * as JSFEAT from 'jsfeat'; //JSFeat

export var jsfeat = JSFEAT;

export
{
  moResource, moResources
} from "./mo-resource";
export class moResourceManager extends moAbstract {
    MOFileMan : moFileManager;
		MOVideoMan : moVideoManager;
		//MOFilterMan : moFilterManager;
		//MONetMan : moNetManager;
		MOTimeMan : moTimeManager;
		MODataMan : moDataManager;
		//MOFBMan : moFBManager;
		MOGLMan : moGLManager;
		MORenderMan : moRenderManager;
		//MOShaderMan : moShaderManager;
		MOMathMan : moMathManager;
		//MOFontMan : moFontManager;
		MOGuiMan : moGUIManager;
		//MOScriptMan : moScriptManager;
		MOTextureMan : moTextureManager;
		MOSoundMan : moSoundManager;
		MOModelMan : mo3dModelManager;
		MODebugMan : moDebugManager;
		//MODecoderMan : moDecoderManager;
    m_Resources: moResources = [];

    constructor(private http: Http) {
      super();
    }

    Init(options?: any): boolean {

      if (this.MOMathMan) { }
      else this.MOMathMan = new moMathManager();
      this.MOMathMan.SetResourceManager(this);
      //this.m_Resources.push(this.MOMathMan);

      if (this.MOFileMan) { }
      else this.MOFileMan = new moFileManager(this.http);
      this.MOFileMan.SetResourceManager(this);
      //console.log("moResourceManager::Init > MOFileMan:", this.MOFileMan);

      if (this.MORenderMan) { }
      else this.MORenderMan = new moRenderManager();
      this.MORenderMan.SetResourceManager(this);
      //console.log("moResourceManager::Init > MORenderMan:", this.MORenderMan);

      if (this.MODataMan) { }
      else this.MODataMan = new moDataManager();
      this.MODataMan.SetResourceManager(this);
      //console.log("moResourceManager::Init > MODataMan:", this.MODataMan);

      if (this.MOGuiMan) { }
      else this.MOGuiMan = new moGUIManager();
      this.MOGuiMan.SetResourceManager(this);
      //console.log("moResourceManager::Init > MOGuiMan:", this.MOGuiMan);
      //
      if (this.MOTextureMan) { }
      else this.MOTextureMan = new moTextureManager();
      this.MOTextureMan.SetResourceManager(this);
      this.m_Resources.push(this.MOTextureMan);

      if (this.MOVideoMan) { }
      else this.MOVideoMan = new moVideoManager();
      this.MOVideoMan.SetResourceManager(this);
      this.m_Resources.push(this.MOVideoMan);

      if (this.MOTimeMan) { }
      else this.MOTimeMan = new moTimeManager();
      this.MOTimeMan.SetResourceManager(this);

      if (this.MOGLMan) { }
      else this.MOGLMan = new moGLManager();
      this.MOGLMan.SetResourceManager(this);

      var ConsoleConfig: moConfig = options["consoleconfig"];
      var consoleconfigname: moText = ConsoleConfig.GetName();

/*
///Asigna configname, y labelname a los recursos PREDETERMINADOS en caso de encontrarse en el config
	moText resname;
	moText cfname;
	moText lblname;

  ///TODO: chequear errores...
	moParam& presources( p_consoleconfig.GetParam(moText("resources")) );

	presources.FirstValue();

	for(MOuint r=0; r<presources.GetValuesCount(); r++) {

		moResource* pResource = NULL;

		resname = presources[MO_SELECTED][MO_CFG_RESOURCE].Text();
		cfname = presources[MO_SELECTED][MO_CFG_RESOURCE_CONFIG].Text();
		lblname = presources[MO_SELECTED][MO_CFG_RESOURCE_LABEL].Text();

		MOint rid = GetResourceIndex( lblname );

		if(rid>-1) pResource = GetResource(rid);

		if (pResource) {
			pResource->SetConfigName(cfname);
			pResource->SetLabelName(lblname);
            pResource->SetConsoleParamIndex( presources.GetParamDefinition().GetIndex() );
            pResource->SetConsoleValueIndex( r );
		}
		presources.NextValue();
    }*/

      this.MOMathMan.Init();
      this.MOTextureMan.Init();
      this.MOTextureMan.Activate();
      this.MOVideoMan.Init();
      this.MOGLMan.Init();
      this.MOTimeMan.Init();
      this.MOGuiMan.Init();
      this.MODataMan.Init( options["apppath"], options["datapath"], consoleconfigname );
      this.MORenderMan.Init();
      this.MOFileMan.Init();

      super.Init();
      if (options["callback"]) options["callback"]("ResourceManager Initialized.");
      return this.Initialized();
    }

    GetDataMan(): moDataManager {
      return this.MODataMan;
    }

    GetRenderMan(): moRenderManager {
      return this.MORenderMan;
    }

    GetGLMan(): moGLManager {
      return this.MOGLMan;
    }

    GetFileMan(): moFileManager {
      return this.MOFileMan;
    }

    GetMathMan(): moMathManager {
      return this.MOMathMan;
    }

    GetTextureMan(): moTextureManager {
      return this.MOTextureMan;
    }

    GetVideoMan(): moVideoManager {
      return this.MOVideoMan;
    }

    GetTimeMan(): moTimeManager {
      return this.MOTimeMan;
    }

    Resources(): moResources {
      return this.m_Resources;
    }

    GetResource( index : number ) : moResource {
      return this.m_Resources[index];
    }

}
