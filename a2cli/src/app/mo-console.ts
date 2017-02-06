import { Http } from "@angular/http";
import * as THREE from "three";

import {
  MOfloat, MOdouble, MOulong,
  MOlong, MOint, MOuint, moNumber,
  moTextFilterParam, MOswitch,
  MO_DEACTIVATED, MO_ACTIVATED, MO_OFF, MO_ON, MO_FALSE,
  MO_NOERROR, MO_SUCCESS, MO_TRUE, MO_FAIL, MO_ERROR,
  MO_UNDEFINED, MO_RELEASED, MO_PULSED,
  MO_DISPLAY, MO_HANDLE, NULL
} from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { moMoldeoObject, moMoldeoObjects } from "./mo-moldeo-object";
import { moEffect, moSceneEffect } from "./mo-effect";
import { moEffectManager } from "./mo-effect-manager";
import { moIODeviceManager } from "./mo-iodevice-manager";
import { moResourceManager } from "./mo-resource-manager";
import {
  moGUIManager, moGuiObject,
  moMaterial, moMaterialBasic, moColor,
  moGeometry, moSphereGeometry, moPlaneGeometry,
  moMesh, moCamera3D
} from "./mo-gui-manager";
import {
  moSceneNode, moSceneNodeArray
} from "./mo-3d-model-manager";
import {
  moRenderManager, moRenderManagerMode,
  moDisplay, moResolution
} from "./mo-render-manager";
import { DEG_TO_RAD, PI, TWO_PI, RAD_TO_DEG } from "./mo-math";
import { moGLManager, moGLMatrixf } from "./mo-gl-manager";
import { moTextureManager, moTexture } from "./mo-texture-manager";
import {
  moConsoleState, moConsoleMode, MO_DEF_SCREEN_WIDTH, MO_DEF_SCREEN_HEIGHT, MO_DEF_RENDER_WIDTH, MO_DEF_RENDER_HEIGHT
} from "./mo-console-state";
import { moFile, moSlash, moFileManager } from "./mo-file-manager";
import { moTempo } from "./mo-tempo";
import {
  moTimer, moTimerAbsolute, moTimerState, GlobalMoldeoTimer,
  moStartTimer, moStopTimer, moPauseTimer, moContinueTimer,
  moIsTimerPaused, moIsTimerPlaying, moIsTimerStopped,
  moGetDuration, moSetDuration,
  moGetTicks, moGetTicksAbsolute, moGetTicksAbsoluteStep, moGetTimerState,
  moGetTimerStateStr
} from "./mo-timer";
import {
  moDataSession, moDataSessionConfig, moDataSessionEventKey,
  moDataSessionConfigParameters
} from "./mo-data-manager";


export const MO_MAX_EFFECT = 40;
export const MO_MAX_PRESETS = 9;
export const MO_NO_EFFECT = -1;

export const MO_CFG_EFFECT = 0;
export const MO_CFG_EFFECT_CONFIG = 1;
export const MO_CFG_EFFECT_LABEL = 2;
export const MO_CFG_EFFECT_PRE = 3;
export const MO_CFG_EFFECT_ON = 4;
export const MO_CFG_EFFECT_KEY = 5;

export const MO_CFG_ACCION_STR = 0;
export const MO_CFG_ACCION_COD = 1;
export const MO_CFG_ACCION_CODDISP = 2;

export const MAX_SELECCIONADOS = 255;


export class moConsoleOptions {
    apppath : moText;
    datapath : moText;
    consoleconfig : moText;
    pIODeviceManager : moIODeviceManager;
    pResourceManager : moResourceManager;
    render_to_texture_mode : moRenderManagerMode = moRenderManagerMode.RENDERMANAGER_MODE_NORMAL;
    screen_width : MOint = MO_DEF_SCREEN_WIDTH;
    screen_height : MOint = MO_DEF_SCREEN_HEIGHT;
    render_width : MOint = MO_DEF_RENDER_WIDTH;
    render_height : MOint = MO_DEF_RENDER_HEIGHT;
    OpWindowHandle : MO_HANDLE = 0;
    Display: MO_DISPLAY = NULL;

    constructor() {

    }
};

export class moConsole extends moMoldeoObject {

  m_ConsoleState : moConsoleState;
  m_EffectManager: moEffectManager;
  m_pIODeviceManager: moIODeviceManager;
  m_MoldeoObjects: moMoldeoObjects;

  constructor( private http: Http ) {
    super();
    this.m_ConsoleState = new moConsoleState();
    this.m_EffectManager = new moEffectManager();
    this.m_MoldeoObjects = [];
    this.SetName("__console__");
    this.SetLabelName("__console__");
    this.SetType( moMoldeoObjectType.MO_OBJECT_CONSOLE );
  }

/** moConsole.Init
 *
 * @options = {
 * "consoleconfig" : path to the *.mol project file
 * "callback" : callback when project is loaded,
 * }
 *
 * Example:
 * Console.Init( {
 *    "consoleconfig": "/moldeorepos/basic/00_Image/00_Image.mol",
 *    "callback": (result) => {
 *        //we are ok to draw
 *        this.animate();
 *    }
 * })
 *
 *
 * @options = {
 * "consoleconfig" : path to the *.mol project file
 * "callback" : callback when project is loaded,
 * "apppath" : Application Path (optional)
 * "datapath" : Data Path (optional)
	 "pIODeviceManager": moIODeviceManager Object (optional),
	 "pResourceManager",
	 "render_to_texture_mode": 0 (Normal), 1 (forcing FBOs), 2 (reserved)
	 "screen_width": Webgl Window Width
   "screen_height": Webgl Window Height
	 "render_width": Webgl Render Width for optimization
   "render_height": Webgl Render Height for optimization
   }
 */
  Init(options?: any): boolean {

    console.log("moConsole.Init > options: ", options, typeof options);

    if (typeof options == "string") {
      //we assume it is the full console config path... minimal...
      options = {
        "consoleconfig": options,
      };
    }

    if (typeof options == "object") {

      if ("IODeviceManager" in options) {
        //do not create ResourceManager
        this.m_pIODeviceManager = options["IODeviceManager"];
        // test if is ok
      } else {
        this.m_pIODeviceManager = new moIODeviceManager();
        this.m_pIODeviceManager.Init();
        this.m_pFileManager = new moFileManager(this.http);
        this.m_pFileManager.Init();
        //console.log("moConsole::Init > moResourceManager: ", this.m_pResourceManager);
      }

      // "consoleconfig"
      if ("consoleconfig" in options) {
        var cf_name = "";
        if (typeof options["consoleconfig"] == "object") {
          this.SetConfigName( options["consoleconfig"].name );
        } else if (typeof options["consoleconfig"] == "string") {
          this.SetConfigName( options["consoleconfig"] );
        }
      }

      //moFile
      if (options.constructor)
        if ("name" in options.constructor) {
          if (options.constructor.name == "moFile") {
            console.log("moConsole.Init > Loading moFile >", options);
            //this.m_Config.LoadConfig( options );
            var p_F: moFile = options;
            this.SetConfigName(options.m_CompletePath);
          }
        }
    }

    //OK ===
    if (this.GetConfigName() == undefined || this.GetConfigName() == "") {
      console.log("No config file (.mol) defined. Please read the manual.")
      return false;
    }

    //RUNNING MOLDEO OBJECT INIT for loading base
    super.Init((result) => {
      var File : moFile = new moFile(this.GetConfigName());
      console.log("Config Loaded!", this.m_Config, result, File);

      var res_ok = this.InitResources({
        "apppath": "/",
        "datapath": File.GetPath(),
        "consoleconfig": this.m_Config,
        "callback": options["start_loading"]
      });

      if (res_ok) {

        this.m_EffectManager.m_pResourceManager = this.GetResourceManager();
        this.m_EffectManager.Init();

        this.LoadObjects(moMoldeoObjectType.MO_OBJECT_PREEFFECT, (pre) => {
          this.LoadObjects(moMoldeoObjectType.MO_OBJECT_EFFECT, (efe) => {
            this.LoadObjects(moMoldeoObjectType.MO_OBJECT_POSTEFFECT, (pos) => {
              this.LoadObjects(moMoldeoObjectType.MO_OBJECT_MASTEREFFECT, (mas) => {
/*
                this.InitObjects(moMoldeoObjectType.MO_OBJECT_PREEFFECT, (initpre) => {
                  this.InitObjects(moMoldeoObjectType.MO_OBJECT_EFFECT, (initefe) => {
                    if (options["effects_started"]) options["effects_started"](initefe);
                  });
                });
*/
                //adding console!
                this.m_MoldeoObjects.push(this);

                this.UpdateMoldeoIds();
                if (options["effects_loaded"]) options["effects_loaded"](this);

                this.InitializeAllEffects();
                if (options["effects_started"]) options["effects_started"](this);
              });
            });
          });
        });
      }

      if (options["config_open"]) options["config_open"](result);
    });


    return this.Initialized();
  }

  UpdateMoldeoIds() {
    console.log("moConsole.UpdateMoldeoIds");
    /*
    int max = RelativeToGeneralIndex( 0, MO_OBJECT_CONSOLE ) + 1;
    m_MoldeoObjects.Empty();
    m_MoldeoObjects.Init( max, NULL);

    m_MoldeoSceneObjects.Empty();

    for( MOuint i=0; i<m_pResourceManager->Resources().Count(); i++ ) {
    moResource* pResource = m_pResourceManager->Resources().GetRef(i);
    m_MoldeoObjects.Set( RelativeToGeneralIndex( i, MO_OBJECT_RESOURCE ), pResource );
    }

    for( MOuint i=0; i<m_pIODeviceManager->IODevices().Count(); i++ ) {
    moIODevice* pIODevice = m_pIODeviceManager->IODevices().GetRef(i);
    m_MoldeoObjects.Set( RelativeToGeneralIndex( i, MO_OBJECT_IODEVICE ), pIODevice );
    }

    for( MOuint i=0; i<m_EffectManager.PreEffects().Count(); i++ ) {
    moPreEffect* pFx = m_EffectManager.PreEffects().GetRef(i);
    m_MoldeoObjects.Set( RelativeToGeneralIndex( i, MO_OBJECT_PREEFFECT ), pFx );
    }

    for( MOuint i=0; i<m_EffectManager.PostEffects().Count(); i++ ) {
    moPostEffect* pFx = m_EffectManager.PostEffects().GetRef(i);
    m_MoldeoObjects.Set( RelativeToGeneralIndex( i, MO_OBJECT_POSTEFFECT ), pFx );
    }

    for( MOuint i=0; i<m_EffectManager.Effects().Count(); i++ ) {
    moEffect* pFx = m_EffectManager.Effects().GetRef(i);
    m_MoldeoObjects.Set( RelativeToGeneralIndex( i, MO_OBJECT_EFFECT ), pFx );
    }

    for( MOuint i=0; i<m_EffectManager.MasterEffects().Count(); i++ ) {
    moMasterEffect* pFx = m_EffectManager.MasterEffects().GetRef(i);
    m_MoldeoObjects.Set( RelativeToGeneralIndex( i, MO_OBJECT_MASTEREFFECT ), pFx );
    }

    m_MoldeoObjects.Set( RelativeToGeneralIndex( 0, MO_OBJECT_CONSOLE ), this);

    ///SET Moldeo Objects Unique Id's
    for( MOuint i=0; i<m_MoldeoObjects.Count(); i++) {
    moMoldeoObject* mobject = m_MoldeoObjects.GetRef(i);
    if (mobject) mobject->SetId(MO_MOLDEOOBJECTS_OFFSET_ID + i);
    }

    ///PROCESSING SCENE OBJECTS (recursive)

    for( MOuint i=0; i<m_EffectManager.Effects().Count(); i++ ) {
    moEffect* pFx = m_EffectManager.Effects().GetRef(i);
    if (pFx)
      if (pFx->GetName()=="scene") {
        moSceneEffect* pScene = (moSceneEffect*) pFx;
        pScene->UpdateMoldeoIds( m_MoldeoSceneObjects );
      }
    }
    */
  }

  InitializeAllEffects() {
    console.log("moConsole.InitializeAllEffects");
    for ( var i= 0; i < this.m_EffectManager.m_AllEffects.length; i++ ) {
      var p_effect = this.m_EffectManager.m_AllEffects[i];
      if (p_effect) {
        p_effect.Init();
        p_effect.Activate();
        /*
        pre = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_PRE).Int();
                        on = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_ON).Int();

                        if (pre>=0) p_effect->GetConfig()->SetCurrentPreConf(pre);
                        if (on>0) p_effect->Activate();
                        else p_effect->Deactivate();
        */
      }
    }
/*
	int dg;
	moEffect*	p_effect = NULL;

	dg = m_Config.GetParamIndex("fulldebug");


	for(MOuint i=0; i<m_EffectManager.AllEffects().Count(); i++ ) {
		p_effect = m_EffectManager.AllEffects().GetRef(i);
		if( p_effect !=NULL) {

            moMobDefinition MD = p_effect->GetMobDefinition();

            Draw();

            MOint pre,on;
            MOint paramindex = MD.GetMobIndex().GetParamIndex();
            MOint valueindex = MD.GetMobIndex().GetValueIndex();
            moEffectState fxstate = p_effect->GetEffectState();

			if(m_Config.GetParam(dg).GetValue().GetSubValue(0).Text()==moText("yes")) {
				fxstate.fulldebug = MO_ACTIVATED;
			} else {
				fxstate.fulldebug = MO_DEACTIVATED;
			}

			if( p_effect->GetName()!=moText("debug") && p_effect->GetName()!=moText("erase")
				&& p_effect->GetName()!=moText("ligia")) {

				    bool res = p_effect->Init();


					if (res) {

                        pre = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_PRE).Int();
                        on = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_ON).Int();

                        if (pre>=0) p_effect->GetConfig()->SetCurrentPreConf(pre);
                        if (on>0) p_effect->Activate();
                        else p_effect->Deactivate();

                        // Sucio codigo agregado rapidamente para poder asignar los efectos a teclas arbitrarias de las 4 filas
                        // del teclado:

					} else {
            MODebug2->Error("Error Initializing Effect: " + p_effect->GetName()
            + " Label: " + p_effect->GetLabelName() + " Cfg: " + p_effect->GetConfigName() );
					}
			} else {

                pre = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_PRE).Int();
                on = m_Config.GetParam( paramindex ).GetValue( valueindex ).GetSubValue(MO_CFG_EFFECT_ON).Int();

                if (pre>=0) p_effect->GetConfig()->SetCurrentPreConf(pre);
                if (on>0) p_effect->Activate();
                else p_effect->Deactivate();

			}
			//carga códigos...
			p_effect->LoadCodes( m_pIODeviceManager );
		}
	}
*/
  }

  InitResources(options?: any) : boolean {
    if (options) {
      if (options["ResourceManager"]) {
        this.m_pResourceManager = options["ResourceManager"];
      } else {
        this.m_pResourceManager = new moResourceManager(this.http);
      }
    }

    return this.m_pResourceManager.Init(options);
  }

  InitObjects( fx_type : moMoldeoObjectType, callback?: any ): void {

  }

  LoadObjects( fx_type : moMoldeoObjectType, callback?: any ): void {

    if (fx_type == moMoldeoObjectType.MO_OBJECT_UNDEFINED) {

      for(var i=0;i<moMoldeoObjectType.MO_OBJECT_TYPES;i++ ) {
        this.LoadObjects( i );
      }
      return;
    } else {
      console.log("moConsole.LoadObjects fx_type: ", fx_type );
    }

    var text: moText;
    var fxname: moText;
    var cfname: moText;
    var lblname: moText;
    var keyname : moText;
    var efx: MOint;
    var i: MOint;
    var N : MOint;
    var activate : boolean = true;
    var peffect : moEffect;

    var fx_string: moText = this.m_MobDefinition.GetTypeToName(fx_type);

    efx = this.m_Config.GetParamIndex(fx_string);
    this.m_Config.SetCurrentParamIndex(efx);
    N = this.m_Config.GetValuesCount(efx);

    if (this.MODebug2) {
      this.MODebug2.Message( "moConsole::LoadObjects > Loading Object configs..." );
      this.MODebug2.Message( "moConsole::LoadObjects > Objects number: " + N );
    }

    if(N>0) {
      this.m_Config.FirstValue();
    for( var i=0; i < N; i++) {
      //this.Draw();
      fxname = this.m_Config.GetParam().GetValue().GetSubValue(MO_CFG_EFFECT).Text();
      cfname = this.m_Config.GetParam().GetValue().GetSubValue(MO_CFG_EFFECT_CONFIG).Text();
      lblname = this.m_Config.GetParam().GetValue().GetSubValue(MO_CFG_EFFECT_LABEL).Text();

      if (this.m_Config.GetParam().GetValue().GetSubValueCount()>=6)
        keyname = this.m_Config.GetParam().GetValue().GetSubValue(MO_CFG_EFFECT_KEY).Text();

      if (this.m_Config.GetParam().GetValue().GetSubValueCount()>=4)
        activate = (this.m_Config.GetParam().GetValue().GetSubValue(MO_CFG_EFFECT_ON).Int()>0);


      var completecfname : moText = "" + this.m_pResourceManager.GetDataMan().GetDataPath() + moSlash + cfname+ ".cfg";
      var FullCF : moFile = new moFile(completecfname);

      if ( FullCF.Exists() ) {
                if ( fxname  != "nil" ) {

                  peffect = this.m_EffectManager.NewEffect(fxname, cfname, lblname,
                    keyname, fx_type, efx, i, activate);

                    if (peffect) {
                      this.m_MoldeoObjects.push( peffect );
                    }

                    if (this.MODebug2) {
                      this.MODebug2.Message( "moConsole::LoadObjects > " + completecfname );
                    }

                } else {
                  /*
                    peffect = null;
                    if (fx_type == moMoldeoObjectType.MO_OBJECT_EFFECT)
                      this.m_EffectManager.m_Effects.push(peffect);
                    if (fx_type == moMoldeoObjectType.MO_OBJECT_PREEFFECT)
                      this.m_EffectManager.m_PreEffects.push(peffect);
                    if (fx_type == moMoldeoObjectType.MO_OBJECT_POSTEFFECT)
                      this.m_EffectManager.m_PostEffects.push(peffect);
                    if (fx_type == moMoldeoObjectType.MO_OBJECT_MASTEREFFECT)
                        this.m_EffectManager.m_MasterEffects.push(peffect);
                    this.m_EffectManager.m_AllEffects.push(peffect);
                    this.m_MoldeoObjects.push( peffect );*/
                }
      } else {
          this.MODebug2.Error( "moConsole::LoadObjects > Error: Config File doesn't exist : " + completecfname);
      }
      this.m_Config.NextValue();
    }
    }

    if (this.MODebug2)
      this.MODebug2.Message( "moConsole::LoadObjects > Objects were loaded..." );
    if (callback) callback("LoadObjects ok");
  }

  Draw(p_tempo: moTempo): void {

    if (this.m_pResourceManager == undefined) return;
    var RenderMan: moRenderManager = this.m_pResourceManager.GetRenderMan();

    if (this.Initialized())
      this.ScriptExeRun();

    //console.log("moConsole.Draw", this );
    if (this.m_ConsoleState.pause != MO_DEACTIVATED) return;

    this.ConsoleModeUpdate();

    var borrar: MOswitch = MO_ACTIVATED;
    var pre_effect_on: boolean = false;

    RenderMan.BeginDraw();
    for (var i = 1; i < this.m_EffectManager.m_PreEffects.length; i++) {
      var pEffect: moEffect = this.m_EffectManager.m_PreEffects[i];
      if (pEffect) {
        if (pEffect.Activated()) {
          pre_effect_on = true;
          RenderMan.BeginDrawEffect();
          pEffect.Draw(this.m_ConsoleState.tempo);
          RenderMan.EndDrawEffect();
          borrar = MO_DEACTIVATED;
        }
      }
    }

    if (borrar == MO_ACTIVATED) {
      if (this.m_EffectManager.m_PreEffects.length > 0) {
        var pEffect: moEffect = this.m_EffectManager.m_PreEffects[0];
        if (pEffect.Activated()) {
          RenderMan.BeginDrawEffect();
          pEffect.Draw(this.m_ConsoleState.tempo);
          RenderMan.EndDrawEffect();
        }/*
					else
          if (!pre_effect_on && !RenderMan.IsRenderToFBOEnabled()
            && !RenderMan.RenderResEqualScreenRes())
							// All the preeffects are disabled, including erase. And the screen resolution is different from
							// the render resolution. So the last screen image has to be redrawn at render resolution.
							RenderMan.DrawTexture(MO_RENDER_RESOLUTION, MO_FINAL_TEX);*/
      }
    }

    for (var i = 1; i < this.m_EffectManager.m_Effects.length; i++) {
      var pEffect: moEffect = this.m_EffectManager.m_Effects[i];
      if (pEffect) {
        if (pEffect.Activated()) {
          RenderMan.BeginDrawEffect();
          pEffect.Draw(this.m_ConsoleState.tempo);
          RenderMan.EndDrawEffect();
        }
      }
    }

    RenderMan.EndDraw();

  }

  ConsoleModeUpdate() : void {
    /**
    chequear que haya una sesion activa en el DataManager...
    */
    var loadedSession : moDataSession = this.GetResourceManager().GetDataMan().GetSession();
    /**
    moldeoplayer -mol xx.mol -mos session.mos -outputmode "AUTOPLAY" -mode "LIVE"|"RECORD"|"PLAYBACK"|"RENDER"
    */
    //session object
    if (loadedSession == undefined) {
      this.MODebug2.Error("moConsole::ConsoleModeUpdate > no session"); return;
    }


    switch( this.m_ConsoleState.m_Mode ) {

      case moConsoleMode.MO_CONSOLE_MODE_LIVE:
        {
        //normal mode: do nothing
          this.m_ConsoleState.tempo.Duration();
          this.m_ConsoleState.tempo.getTempo();
        }
        break;

      case moConsoleMode.MO_CONSOLE_MODE_PLAY_SESSION:
        {
        //playing back last session loaded
        //
          //loaded/loading session
          if (!loadedSession.Loaded())
            if (!loadedSession.LoadSession()) {
              this.MODebug2.Error("moConsole::ConsoleModeUpdate > no loaded session"); return;
            }

          //session ended?
          if (loadedSession.SessionEnded()) {
            this.MODebug2.Message("moConsole::ConsoleModeUpdate > session playback ended."); return;
          }

          // 1000 / 20fps = 50 ms
          // 1000 / 24fps = 41 ms = 24 frames + 16/24
          // 1000 / 25fps = 40 ms = 25 frames
          // 1000 / 30fps = 50 ms
          this.m_ConsoleState.step_interval = 41;

          moGetTicksAbsoluteStep( this.m_ConsoleState.step_interval );

          //process next keys
          this.ProcessSessionKey( loadedSession.NextKey( this.m_ConsoleState ) );

        }
        break;

      case moConsoleMode.MO_CONSOLE_MODE_RECORD_SESSION:
        {
          this.m_ConsoleState.tempo.Duration();
          this.m_ConsoleState.tempo.getTempo();

        }
        break;

      case moConsoleMode.MO_CONSOLE_MODE_RENDER_SESSION:
        {
          this.m_ConsoleState.step_interval = 41;
          var tickis : MOlong = moGetTicksAbsoluteStep( this.m_ConsoleState.step_interval );
          this.MODebug2.Message("moConsole::ConsoleModeUpdate > render session: " + tickis );
          var console_timecode : MOint = this.m_ConsoleState.tempo.Duration();

          if (console_timecode==0)  {
                this.m_ConsoleState.tempo.Fix();
                this.m_ConsoleState.tempo.Stop();
                this.m_ConsoleState.tempo.Start();
          }

          this.m_ConsoleState.tempo.getTempo();

          this.MODebug2.Message("moConsole::ConsoleModeUpdate > render session: "
            + "m_ConsoleState.tempo.Duration: "
            + console_timecode);

          this.ProcessSessionKey( loadedSession.NextKey( this.m_ConsoleState ) );
          loadedSession.StepRender( this.m_ConsoleState );

        }
        break;

      default:
        /**  */
        break;
    };

  }
  Update() : void {

  }

  Interaction() : boolean {
    return true;
  }

  TestScreen( p_display_info?: moDisplay) {
    if (this.m_pResourceManager==null || this.m_pResourceManager==undefined) {
      this.m_pResourceManager = new moResourceManager(this.http);
      this.m_pResourceManager.Init();
    }
    var RMan: moRenderManager = this.m_pResourceManager.MORenderMan;
    var GMan: moGUIManager = this.m_pResourceManager.MOGuiMan;
    var TMan: moTextureManager = this.m_pResourceManager.MOTextureMan;
    var GLMan: moGLManager = this.m_pResourceManager.MOGLMan;

    ///MATERIAL
    var Mat: moMaterial = new moMaterial();
    var id: MOint = TMan.GetTextureMOId("default");
    if (id > -1) {
      var T: moTexture = TMan.GetTexture(id);
      Mat.map = T._texture;
      Mat.transparent = true;
    }

    this.m_ConsoleState.step_interval = 40;
    //var stepi : MOfloat = this.m_ConsoleState.step_interval;
    //var steps : MOfloat = moGetTicksAbsoluteStep( this.m_ConsoleState.step_interval );
    //var progress: MOfloat = (steps / stepi) / 120.0;

    //var stepi : MOfloat = this.m_ConsoleState.step_interval;
    var stepi: MOfloat = 15;
    var steps: MOfloat = moGetTicksAbsolute(true);
    //console.log("steps:", steps);
    var progress: MOfloat = (steps / stepi) / 120.0;

    RMan.m_Renderer.setClearColor(new moColor(1.0 - progress, 1.0 - progress, 1.0 - progress), 1.0);
    RMan.m_Renderer.clear( true, true, false);
    //glClearColor( 1.0 - progress, 1.0 - progress, 1.0 - progress, 1.0 );
    //glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

      //Mat.material.opacity = 1.0;
      //Mat.material.transparent = false;
      //Mat.material.color = new moColor(1.0, 1.0, 1.0);

      //Mat.material. = new moColor(1.0, 1.0, 1.0);

      //Mat.id = TMan.GetTextureMOId( "default" );
      //Mat.base.map =
      //Mat.base.
      /*
        Mat.m_Map = pTMan->GetTexture(pTMan->GetTextureMOId( "default", false ));
        Mat.m_MapGLId = Mat.m_Map->GetGLId();
        Mat.m_Color = moColor( 1.0, 1.0, 1.0 );
        Mat.m_fTextWSegments = 13.0f;
        Mat.m_fTextHSegments = 13.0f;
        Mat.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
        Mat.m_vLight.Normalize();
        //Mat.m_PolygonMode = MO_POLYGONMODE_LINE;
        Mat.m_PolygonMode = MO_POLYGONMODE_FILL;
        Mat.m_fWireframeWidth = 0.0005f;
  */

        ///GEOMETRY
    var Sphere : moSphereGeometry = new moSphereGeometry( 0.5, 20, 20 );

      ///MESH MODEL (aka SCENE NODE)
    var Model : moGLMatrixf = new moGLMatrixf();
    Model.MakeIdentity()
        .Rotate(360.0 * progress * DEG_TO_RAD, 0.0, 1.0, 0.0)
        .Translate(    0.0, 0.0, -2.618 + 0.618*progress );
    //console.log("Model:", Model);

    var Mesh: moMesh = new moMesh(Sphere, Mat);
    Mesh.SetModelMatrix(Model);

    var Scene: moSceneNode = new moSceneNode();
    Scene.add(Mesh);

    var ambientLight : THREE.AmbientLight = new THREE.AmbientLight(0xcccccc);
    Scene.add(ambientLight);

    var pointLight : THREE.PointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(300, 0, 300);
    Scene.add( pointLight );


    ///CAMERA PERSPECTIVE
    var Camera3D: moCamera3D = new moCamera3D();
    //p_display_info.Resolution().Width(),p_display_info.Resolution().Height()
    GLMan.SetDefaultPerspectiveView( RMan.m_Renderer.getSize().width, RMan.m_Renderer.getSize().height );
    Camera3D.projectionMatrix = GLMan.GetProjectionMatrix();

    ///RENDERING
    RMan.Render(Scene, Camera3D);


///MESH MATERIAL
    var Mat2: moMaterialBasic = new moMaterialBasic();
    var id2: MOint = TMan.GetTextureMOId("moldeotrans");
    if (id2 > -1) {
      var T: moTexture = TMan.GetTexture(id2);
      Mat2.map = T._texture;
      Mat2.transparent = true;
      //Mat2.color = new moColor(1.0, 1.0, 1.0);
      //Mat2;
    }
    //Mat2.m_Map = pTMan->GetTexture(pTMan->GetTextureMOId( "moldeotrans", false ));
    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.Normalize();

    ///MESH GEOMETRY
    var Plane3 : moPlaneGeometry = new moPlaneGeometry( 1.0, 0.33, 1, 1 );

    ///MESH MODEL
    var Model2 : moGLMatrixf = new moGLMatrixf().MakeIdentity();
    Model2.Scale( 1.0, 1.0, 1.0 );
    Model2.Translate( 0.0, 0.0, -0.5 );
    var Mesh2 : moMesh = new moMesh( Plane3, Mat2 );
    Mesh2.SetModelMatrix(Model2);
    var Scene2: moSceneNode = new moSceneNode();
    Scene2.add(Mesh2);


    ///CAMERA PERSPECTIVE
    var Camera3D2 : moCamera3D = new moCamera3D();
    GLMan.SetDefaultOrthographicView( RMan.m_Renderer.getSize().width, RMan.m_Renderer.getSize().height );
    Camera3D2.projectionMatrix = GLMan.GetProjectionMatrix();

    ///RENDERING
    RMan.Render( Scene2, Camera3D2 );

  }


  ConsolePlay() : void {

    if (this.m_ConsoleState.tempo.State()!=moTimerState.MO_TIMERSTATE_PLAYING) {
      this.m_ConsoleState.tempo.Start();
    }

    if (moIsTimerPaused()) {
        moContinueTimer();
    } else {
        moStartTimer();
    }
  /*
    if (this.m_ConsoleState.m_Mode==moTimerState.MO_CONSOLE_MODE_RECORD_SESSION) {
      if (this.m_pResourceManager==NULL) return;
      moDataSessionKey key( moGetTicksAbsolute(), MO_ACTION_CONSOLE_PLAY );
      GetResourceManager()->GetDataMan()->GetSession()->AddKey( key );
    }
    */
  }

  ConsolePause() : void {
    moPauseTimer();
    /*
    if (m_ConsoleState.m_Mode==MO_CONSOLE_MODE_RECORD_SESSION) {
      if (m_pResourceManager==NULL) return;
      moDataSessionKey key( moGetTicksAbsolute(), MO_ACTION_CONSOLE_PAUSE );
      GetResourceManager()->GetDataMan()->GetSession()->AddKey( key );
    }
    */
  }

  ConsoleStop() : void {
    moStopTimer();
    /*
    if (m_ConsoleState.m_Mode==MO_CONSOLE_MODE_RECORD_SESSION) {
      if (m_pResourceManager==NULL) return;
      moDataSessionKey key( moGetTicksAbsolute(), MO_ACTION_CONSOLE_STOP );
      GetResourceManager()->GetDataMan()->GetSession()->AddKey( key );
    }
    */
  }

  GetConsoleState() : moTimerState {
    return moGetTimerState();
  }

  ProcessSessionKey( key : any ) {

  }

};
