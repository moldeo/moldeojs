import { MOlong, MOulong, MOint, MOuint, IntToStr } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { moResource } from "./mo-resource";
import { moResourceType } from "./mo-resource-type.enum";
import { moFile, moFileManager } from "./mo-file-manager";
import { moResourceManager } from "./mo-resource-manager";
import { moValue } from "./mo-value";
import { moConfig, MO_CONFIGFILE_NOT_FOUND } from "./mo-config";
import { moMoldeoActionType } from "./mo-actions";
import { moParamDefinition } from "./mo-param";
import { moEffectState } from "./mo-effect";
import { moConsoleState } from "./mo-console-state";
import { moPluginDefinitions } from "./mo-plugin";

export const DATADIR: moText = "/data";
export const MODULESDIR: moText = "/plugins";

/***

    Modos de funcionamiento de la sesion


*/
export enum moDataSessionMode {
        MO_DATASESSION_INACTIVE = 0, ///grabación y reproducción inactivos, modo predeterminado...
        MO_DATASESSION_PLAYBACK_ACTIVE = 1, ///reproducción activa
        MO_DATASESSION_RECORD_ACTIVE = 2,///grabación activa
        MO_DATASESSION_PLAYANDRECORD_ACTIVE = 3 ///reproducción y grabación simultánea
};

/***

    Modos de grabación de sesión


*/
export enum moDataSessionRecordMode {
  MO_DATASESSION_RECORD_TOMEMORY = 0, ///Grabación a memoria de las claves
    MO_DATASESSION_RECORD_BUFFERINGTOFILE = 1, ///grabación con memoria intermedia a disco
    MO_DATASESSION_RECORD_DIRECTTOFILE = 2, ///grabación directa de claves a archivo
    MO_DATASESSION_RECORD_STREAMING = 4
};

/***

    Modos de reproducción de sesión


*/
export enum moDataSessionPlaybackMode {
    MO_DATASESSION_PLAY_LIVETOCONSOLE = 0, ///Reproducción en tiempo real a consola
    MO_DATASESSION_PLAY_LIVETOVIDEO = 1, ///Reproducción en vivo a video
    MO_DATASESSION_PLAY_LIVETOSTREAM = 2, ///Reproducción en vivo por streaming
    MO_DATASESSION_PLAY_RENDERTOVIDEO = 4 ///Reproducción renderizada a video por cuadros
};


export enum moDataSessionRenderMode {
    MO_DATASESSION_RENDER_TOMEMORY = 0, ///Renderizado en memoria
    MO_DATASESSION_RENDER_BUFFERINGTOFILE = 1, ///renderizado con memoria intermedia a disco
    MO_DATASESSION_RENDER_DIRECTTOFILE = 2, ///
    MO_DATASESSION_RENDER_STREAMING = 4
};

export enum moDataSessionConfigParameters {
  MO_DATA_SESSION_CONFIG_PROJECT=0,
  MO_DATA_SESSION_CONFIG_RESOLUTION,
  MO_DATA_SESSION_CONFIG_RENDER_FOLDER,
  MO_DATA_SESSION_CONFIG_LENGTH,
  MO_DATA_SESSION_CONFIG_KEYS,
  MO_DATA_SESSION_CONFIG_EVENT_KEYS,
};

export class moDataSessionKey {
  m_TimeCode : MOlong; /// Valor del tick
  m_ActionType : moMoldeoActionType; /// accion

  m_ObjectId : MOlong; ///Opcional para identificación del índice único de objeto
  m_ParamId : MOlong; ///Opcional para identificación del índice único de parámetro
  m_ValueId : MOlong; ///Opcional para identificación del índice único de valor
  m_PreconfId : MOlong;
  m_Value : moValue; /// Valor del dato agregado o modificado
  m_ParamDefinition : moParamDefinition; /// Valor del dato agregado o modificado
  m_EffectState: moEffectState; /// Valor del dato agregado o modificado


  IsInTime( time_position : MOlong, time_interval : MOlong ) : boolean {
      if (   this.m_TimeCode<=time_position
          && time_position< (this.m_TimeCode+time_interval) ) {
        return true;
      }
      return false;
  }

  GetValue() : moValue {
    return this.m_Value;
  }

  GetActionType() : moMoldeoActionType {
    return this.m_ActionType;
  }

}
export type moDataSessionKeys = moDataSessionKey[];

export class moDataSessionEventKey {

}
export type moDataSessionEventKeys = moDataSessionEventKey[];

/**

Configuración de sesión. Se crea antes de empezar una sesión con los datos específicos como son:
    el directorio de datos
    el nombre del archivo de consola
    el nombre del archivo para grabar la sesión
    la cantidad máxima de claves
    la cantidad máxima de tiempo a grabar en milisegundos

*/
export class moDataSessionConfig extends moConfig {

    m_AppPath: moText;/// Directorio de ejecución de la aplicación
		m_DataPath : moText;/// Directorio de datos de la sesión
		m_ConsoleConfigName : moText;///archivo de definición de la consola (*.mol)
    m_AppDataPath : moText;
    m_PluginsPath : moText;
        /*
        MO_DATASESSION_MODE_SAVETOMEMORY
        */
		m_SessionFileName : moText; ///nombre del archivo a grabar
		m_VideoFileName : moText; ///nombre del arcivo de video a grabar
		m_MaxKeys : MOlong; ///número de eventos clave a grabar en memoria
		m_MaxTimecode : MOlong;///tiempo máximo de grabación de claves

		m_Port : MOlong;///para streaming
    m_Address: MOlong;///para streaming

    constructor(   p_apppath : moText,
                  p_datapath : moText,
                  p_consoleconfig : moText,
                  p_SessionFileName?: moText,
                  p_VideoFileName?: moText,
                  p_MaxKeys?: MOulong,
                  p_MaxTimecode?: MOulong,
                  p_Port?: MOulong,
                  p_Address?: MOulong ) {
        super();
        this.m_AppPath = p_apppath;
        this.m_DataPath = p_datapath;
        //this.m_PluginsPath = moDataManager.GetModulesDir();

        this.m_ConsoleConfigName = p_consoleconfig;
        this.m_SessionFileName = p_SessionFileName;
        this.m_VideoFileName = p_VideoFileName;
        this.m_MaxKeys = p_MaxKeys;
        this.m_MaxTimecode = p_MaxTimecode;

        if ( this.m_AppPath == "" ) {

          var fileMol : moFile = new moFile( p_apppath );
          //workPath : moText = moFileManager::GetWorkPath();
          //this.m_AppPath = workPath;
          /*moDebugManager::Message(  moText(" moDataSessionConfig() > m_AppPath empty, setting to Work Path: ")
                                  + m_AppPath
                                  + " p_Port: " + IntToStr( p_Port )
                                  + " p_Address: " + IntToStr( p_Address ) );*/
        }

        //moDebugManager::Message(  moText(" moDataSessionConfig() > m_AppPath: ") + m_AppPath );
        //moDebugManager::Message(  moText(" moDataSessionConfig() > m_ConsoleConfigName: ") + m_ConsoleConfigName );
/*
        moFile molFile(  m_ConsoleConfigName );

        if ( molFile.GetPath()==moText("") ) {
          m_ConsoleConfigName = m_DataPath + moSlash + m_ConsoleConfigName;
          moDebugManager::Message(  moText(" moDataSessionConfig() > m_ConsoleConfigName fixed to: ") + m_ConsoleConfigName );
        }
*/
/*
  moFile mosFile( m_SessionFileName );
  if ( mosFile.GetPath()==moText("") ) {
    m_SessionFileName = m_DataPath + moSlash + m_SessionFileName;
    moDebugManager::Message(  moText(" moDataSessionConfig() > m_SessionFileName fixed to: ") + m_SessionFileName );
  }

  GetConfigDefinition()->Set( "session", "moDataSession" );
  GetConfigDefinition()->Add( "project", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_PROJECT, moValue( m_ConsoleConfigName, "TXT") );
  GetConfigDefinition()->Add( "resolution", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_RESOLUTION, moValue( "1024x768", "TXT") );
  GetConfigDefinition()->Add( "render_folder", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_RENDER_FOLDER, moValue( "", "TXT") );
  GetConfigDefinition()->Add( "length", MO_PARAM_NUMERIC, MO_DATA_SESSION_CONFIG_LENGTH, moValue( "0", "NUM").Ref() );
  GetConfigDefinition()->Add( "keys", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_KEYS,
  moValue( "<moDataSessionKey></moDataSessionKey>", "XML") );
  GetConfigDefinition()->Add( "eventkeys", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_EVENT_KEYS,
  moValue( "<moDataSessionEventKey></moDataSessionEventKey>", "XML") );
  if (CreateDefault( m_SessionFileName )) {
    moDebugManager::Message("moDataSessionConfig > Created "+m_SessionFileName);
  }

  if (LoadConfig(m_SessionFileName)==MO_CONFIG_OK) {
    moDebugManager::Message("moDataSessionConfig > Loaded "+m_SessionFileName);
  } else moDebugManager::Error("moDataSessionConfig > Not Loaded "+m_SessionFileName);
*/
	///check if DATADIR exists
	/// a) in linux: just take the datadir
	/// b) in windows: it depends
	//this.m_AppDataPath = moDataManager::GetDataDir();
/*
	if ( m_AppDataPath == moText("../../data") ) {

    moDirectory mDir( m_AppDataPath );
    moDebugManager::Message(  moText(" moDataSessionConfig() > m_AppDataPath: ") + m_AppDataPath
                            + moText(" Exists: ") + IntToStr( mDir.Exists() ) );

    if (!mDir.Exists()) {
      /// check if
      /// moFile mFile(

      #ifdef MO_WIN32

      moDebugManager::Message(  moText(" moDataSessionConfig() > exeFile Path: ") + moFileManager::GetExePath() );
      moFile exeFile( moFileManager::GetExePath() );
      m_AppDataPath = exeFile.GetPath() + moSlash + m_AppDataPath;

      moDebugManager::Message( m_AppDataPath + moText(" doesn't exists > adding absolute path: ") + m_AppDataPath );
      #else
      moDebugManager::Error( moText(" moDataSessionConfig() > App Data Path doesn't exists: ")  + m_AppDataPath );
      moDebugManager::Error( moText(" please check libmoldeo DATADIR settings (configure.ac) > DATADIR is: ")
      + moDataManager::GetDataDir() );
    #endif

    }

	}
*/

  if ( this.m_DataPath == "" ) {
      this.m_DataPath = this.m_AppPath;
      //moDebugManager::Message(  moText(" moDataSessionConfig() > m_DataPath set to: ") + m_DataPath );
  }// else moDebugManager::Message(  moText(" moDataSessionConfig() > m_DataPath: ") + m_DataPath );

}


  GetAppPath() : moText {
    return this.m_AppPath;
  }

  GetDataPath() : moText {
    return this.m_DataPath;
  }

  GetAppDataPath() : moText {
    return this.m_AppDataPath;
  }



  GetConsoleConfigName() : moText {
    return this.m_ConsoleConfigName;
  }


  GetVideoFileName() : moText {
    return this.m_VideoFileName;
  }

  GetSessionFileName() : moText {
    return this.m_SessionFileName;
  }

  GetPluginsPath() : moText {
    return this.m_PluginsPath;
  }

  GetMaxKeys(): MOulong {
      return this.m_MaxKeys;
  }

  GetMaxTimecode() : MOulong {
    return this.m_MaxTimecode;
  }

  GetPort() : MOlong {
    return this.m_Port;
  }

  GetAddress() : MOlong {
    return this.m_Address;
  }

}


export class moDataSession extends moAbstract {

  m_StartTimeCode : MOlong;
  m_EndTimeCode : MOlong;
  m_Name : moText;
  m_pDataSessionConfig : moDataSessionConfig;
  m_pResourceManager : moResourceManager;

  m_iActualKey : MOint;
  m_Keys : moDataSessionKeys;
  m_EventKeys : moDataSessionEventKeys;

  m_SessionMode : moDataSessionMode;
  m_SessionRecordMode : moDataSessionRecordMode;
  m_SessionPlaybackMode : moDataSessionPlaybackMode;
  m_SessionRenderMode : moDataSessionRenderMode;

  //m_pVideoGraph : moVideoGraph;
  m_ActualKey : moDataSessionKey;

  m_Rendered_Frames : MOint;
  m_Rendered_Folder : moText;

  Set( p_Name : moText,
    pSessionConfig : moDataSessionConfig,
    p_sessionmode : moDataSessionMode,
    p_recordmode : moDataSessionRecordMode,
    p_playbackmode : moDataSessionPlaybackMode,
    p_ResMan : moResourceManager) {
    this.m_Name = p_Name;
    this.m_pDataSessionConfig = pSessionConfig;
    this.m_pResourceManager = p_ResMan;
    this.m_SessionMode = p_sessionmode;
    this.m_SessionPlaybackMode = p_playbackmode;
    this.m_SessionRecordMode = p_recordmode;
    //m_Keys.Init( pSessionConfig->GetMaxKeys(), NULL );
    this.m_Keys = [];
  }
/*
bool
moDataSession::SaveToFile( const moText& p_filename ) {

  MODebug2->Message("moDataSession::SaveToFile: ");

  bool result = false;
  if (m_pDataSessionConfig==NULL) {
    MODebug2->Error("moDataSession::SaveToFile > no Data Session Config defined.");
    return false;
  }
  moText FileDestination = m_pDataSessionConfig->GetSessionFileName();

  if (p_filename != moText("") && p_filename!=FileDestination) {
      //m_pDataSessionConfig->GetConfigDefinition()->Set
      //MODebug2->Error("moDataSession::SaveToFile > p_filename undefined.");
      //result = false;
      //m_pDataSessionConfig->CreateDefault( p_filename );
      FileDestination = p_filename;
  }

  moParam& paramKeys( m_pDataSessionConfig->GetParam( "keys" ) );
  moValues& valuesKey( paramKeys.GetValues() );
  valuesKey.Empty();

  for( int keyi=0; keyi<(int)this->m_Keys.Count(); keyi++) {

    moDataSessionKey* pKey = m_Keys[keyi];
    if (pKey) {
      moText pKeyXML = pKey->ToXML();
      moValue newValue( "","XML" );
      MODebug2->Message("moDataSession::SaveToFile > keyi: " + IntToStr(keyi) + " xml:" + pKeyXML );

      moValueBase& vb( newValue.GetSubValue(0) );
      vb.SetText( pKeyXML );
      vb.SetType( MO_VALUE_XML );
      paramKeys.AddValue( newValue );
    }
  }

  m_pDataSessionConfig->SaveConfig( FileDestination );


	return result;
}

bool
moDataSession::LoadFromFile( const moText& p_filename ) {
  bool result = false;

  moText FileDestination = p_filename;

  if (m_pDataSessionConfig==NULL) {
    MODebug2->Error("moDataSession::LoadFromFile > no Data Session Config defined.");
    return false;
  }


  if (p_filename == "") {
    FileDestination = m_pDataSessionConfig->GetSessionFileName();
  }

  if (m_pDataSessionConfig->LoadConfig( FileDestination )==MO_CONFIG_OK) {

    for( int keyi=0; keyi<(int)this->m_Keys.Count(); keyi++) {
      moDataSessionKey* dsk = m_Keys[keyi];
      if (dsk) delete dsk;
    }

    m_Keys.Empty();

    moParam& paramKeys( m_pDataSessionConfig->GetParam( "keys" ) );
    moValues& valuesKey( paramKeys.GetValues() );
    for( int i=0; i<(int)valuesKey.Count(); i++ ) {
      moValueBase& vbase( valuesKey[i].GetSubValue(0) );
      if (vbase.GetType()==MO_VALUE_XML) {
        moDataSessionKey* newKey = new moDataSessionKey();
        if (newKey) {
          newKey->Set( vbase.Text() );
          m_Keys.Add( newKey );
        }
      }
    }

  } else MODebug2->Error("moDataSession::LoadFromFile > could not load the session config file at " + FileDestination);

	return result;
}
*/
LoadSession() : boolean {
  if (!this.m_pDataSessionConfig) {
      this.MODebug2.Error("moDataSession::LoadSession() > no session config object.");
      return false;
  }
  return this.m_pDataSessionConfig.LoadConfig( this.m_pDataSessionConfig.GetSessionFileName() )!=MO_CONFIGFILE_NOT_FOUND;
}
/*
bool
moDataSession::AddKey( const moDataSessionKey& p_key ) {
  moDataSessionKey* newKey = new moDataSessionKey();
  if (newKey) {
    (*newKey) = p_key;
    m_Keys.Add( newKey );
    MODebug2->Message( "moDataSession::AddKey > " + newKey->ToJSON() );
    return true;
  }
	return false;
}

bool
moDataSession::AddEventKey( const moDataSessionEventKey& p_eventkey ) {
  moDataSessionEventKey* eventKey = new moDataSessionEventKey();
  if (eventKey) {
    (*eventKey) = p_eventkey;
    m_EventKeys.Add( eventKey );
    return true;
  }
  return false;
}

bool
moDataSession::Playback(moConsoleState& p_console_state) {
  m_SessionPlaybackMode = MO_DATASESSION_PLAY_LIVETOCONSOLE;
  m_iActualKey = 0;
  p_console_state.m_Mode = MO_CONSOLE_MODE_PLAY_SESSION;
	return true;
}

bool
moDataSession::StopRecord(moConsoleState& p_console_state) {
  m_EndTimeCode = moGetTicks();
  MODebug2->Message("moDataSession::StopRecord > m_StartTimeCode: "+IntToStr(m_StartTimeCode)+" m_EndTimeCode:" + IntToStr(m_EndTimeCode));
  p_console_state.m_Mode = MO_CONSOLE_MODE_LIVE;
  SaveToFile();
  return true;
}

bool
moDataSession::Record(moConsoleState& p_console_state) {
  m_SessionRecordMode = MO_DATASESSION_RECORD_TOMEMORY;

  if (p_console_state.m_Mode==MO_CONSOLE_MODE_RECORD_SESSION) {
    return StopRecord( p_console_state ) && Render( p_console_state );
  } else if (p_console_state.m_Mode==MO_CONSOLE_MODE_RENDER_SESSION) {
    return StopRender( p_console_state );
  }

  p_console_state.m_Mode = MO_CONSOLE_MODE_RECORD_SESSION;
  moStopTimer();
  moStartTimer();
  m_StartTimeCode = moGetTicks();
  MODebug2->Message("moDataSession::Record > m_StartTimeCode:" + IntToStr(m_StartTimeCode));

	return true;
}


int
moDataSession::GetRenderedFrames() const {
  return m_Rendered_Frames;
}

bool
moDataSession::StopRender(moConsoleState& p_console_state) {
  //m_EndTimeCode = moGetTicks();
  int zero = moResetTicksAbsoluteStep(0);
  p_console_state.m_Mode = MO_CONSOLE_MODE_LIVE;
  MODebug2->Message("moDataSession::StopRender > m_EndTimeCode:" + IntToStr(m_EndTimeCode)+" zero:" + IntToStr(zero));
  return true;
}

bool
moDataSession::Render( moConsoleState& p_console_state ) {
  m_SessionRenderMode = MO_DATASESSION_RENDER_TOMEMORY;

  if (p_console_state.m_Mode==MO_CONSOLE_MODE_RENDER_SESSION) {
    return StopRender( p_console_state );
  } else if (p_console_state.m_Mode!=MO_CONSOLE_MODE_RENDER_SESSION) {
    m_Rendered_Frames = 0;
  }

  p_console_state.m_Mode = MO_CONSOLE_MODE_RENDER_SESSION;
  //RESET
  int zero = moResetTicksAbsoluteStep(0);
  if (zero!=0) MODebug2->Error("moDataSession::Render> not zero! zero: " + IntToStr(zero));
  long tickis = moGetTicksAbsoluteStep( 41 );
  moStopTimer();
  moStartTimer();
  long tickis_moldeo = moGetTicks();
  MODebug2->Message("moConsole::ConsoleModeUpdate > START RENDER session: absolute tickis: "
  + IntToStr(tickis)+" tickis(moldeo): " + IntToStr(tickis_moldeo) );
  m_iActualKey = 0;
  MODebug2->Message("moConsole::ConsoleModeUpdate > START RENDER session: m_StartTimeCode: " + IntToStr(m_StartTimeCode) );

  moText temp_render_base = DataMan()->GetDataPath() + moText("temp_render");
  this->m_Rendered_Folder = temp_render_base;

  int ntemp = 0;

  while( moFileManager::DirectoryExists( this->m_Rendered_Folder )  ) {
    ntemp+=1;
    this->m_Rendered_Folder = temp_render_base + IntToStr( ntemp, 3 );
    if (ntemp>1000) {
      break;
    }
  }

  return true;
}

void
moDataSession::SetRenderedFolder( const moText& p_rendered_folder ) {
  m_Rendered_Folder = p_rendered_folder;
}
*/
StepRender( p_console_state : moConsoleState ) : boolean {
/*
    var frame_result : moText;

    p_console_state.Activated();
    //int mod1000 = m_Rendered_Frames / (int)1000;
    //temp_render+="_"+IntToStr(mod1000);
    var frame_filename : moText = "frame_" + IntToStr( this.m_Rendered_Frames, 7 );
    if (this.m_pResourceManager && this.m_pResourceManager.GetRenderMan())
      RenderMan()->Screenshot( DataMan()->GetSession()->GetRenderedFolder(),
      frame_result, p_console_state.m_RenderFrameQuality, frame_filename );

    //MODebug2->Message("moDataSession::StepRender > 24/1 frame number:"
    // + IntToStr(m_Rendered_Frames)+" frame_result:" + frame_result);
    this.m_Rendered_Frames+=1;
    */
    return true;
}
/*
bool
moDataSession::RecordLive( moResourceManager* pRM ) {

    m_SessionPlaybackMode = MO_DATASESSION_PLAY_LIVETOVIDEO;
    if (m_pVideoGraph && m_pDataSessionConfig) {
        m_pVideoGraph->BuildRecordGraph( m_pDataSessionConfig->GetVideoFileName(),
        pRM->GetRenderMan()->GetFramesPool() );
    }
	return true;
}
*/

  Loaded() : boolean {
    if (this.m_pDataSessionConfig) {
      return this.m_pDataSessionConfig.IsConfigLoaded();
    }
    return false;
  }

  SessionEnded() : boolean {
    if (this.m_iActualKey>=this.m_Keys.length || this.m_Keys.length==0 )
      return true;

    return false;
  }

  GetKeyCount() : MOint {
    return this.m_Keys.length;
  }

  SessionStart() : boolean {
    this.m_iActualKey = 0;
    return true;
  }
/*
const moDataSessionKey&
moDataSession::GetActualKey() {
  return m_ActualKey;
}


bool
moDataSession::SetKey( int p_actual_key) {
if ( 0<=p_actual_key && p_actual_key<(int)m_Keys.Count()) {
    m_iActualKey = p_actual_key;
    m_ActualKey = (*m_Keys[m_iActualKey]);
    return true;
  }

  return false;
}

  */
  NextKey( m_ConsoleState : moConsoleState ) : moDataSessionKey {

    //check if timecode correspond to m_ConsoleState clock ??
    var m_ActualKey : moDataSessionKey = new moDataSessionKey();
    var time_code_ms : MOint = m_ConsoleState.tempo.Duration();

    if (this.m_iActualKey<0 || this.m_iActualKey>=this.m_Keys.length ) {
      return this.m_ActualKey;
    }

    if (this.m_iActualKey<this.m_Keys.length) {

      var TestKey : moDataSessionKey = this.m_Keys[this.m_iActualKey];

      if ( TestKey.IsInTime(time_code_ms, m_ConsoleState.step_interval ) ) {

        this.MODebug2.Message("moDataSession::NextKey > Founded timecode Key in! time_code_ms: "
          + time_code_ms );

        m_ActualKey = TestKey;
        this.m_iActualKey++;//go to the next key
      }
    }

    return this.m_ActualKey;
  }


}

export class moDataManager extends moResource {

    m_DataDir : moText = DATADIR;
    m_ModulesDir : moText = MODULESDIR;


    m_pDataSessionConfig : moDataSessionConfig;
		m_pDataSession : moDataSession;
    m_PluginDefinitions : moPluginDefinitions;

    constructor() {
      super();
      this.SetName("_datamanager_");
      this.SetType( moMoldeoObjectType.MO_OBJECT_RESOURCE );
	    this.SetResourceType( moResourceType.MO_RESOURCETYPE_DATA );
      this.SetLabelName("datamanager");

	    this.m_pDataSession = null;
      this.m_pDataSessionConfig = null;
    }

    Init( p_apppath?: moText, p_datapath?: moText, p_consoleconfig?: moText ): boolean {
      this.m_pDataSessionConfig = new moDataSessionConfig(p_apppath, p_datapath, p_consoleconfig);
      this.m_pDataSession = new moDataSession();
      this.m_pDataSession.Set("session 1",
        this.m_pDataSessionConfig,
        moDataSessionMode.MO_DATASESSION_INACTIVE,
        moDataSessionRecordMode.MO_DATASESSION_RECORD_BUFFERINGTOFILE,
        moDataSessionPlaybackMode.MO_DATASESSION_PLAY_LIVETOCONSOLE,
        this.m_pResourceManager );
      return super.Init();
    }

    NameToPath( p_name: moText ): moText {
      var p: string = "" + this.GetDataPath();
      var s: string = "" + p_name;
      if (p_name.indexOf(p)==0) {
        return s;
      }
      return p+s;
    }

    GetDataPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetDataPath();
      return "";
    }

    GetConsoleConfigName(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetConsoleConfigName();
      return "";
    }
		GetAppPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetAppPath();
      return "";
    }
		GetAppDataPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetAppDataPath();
      return "";
    }
		GetPluginsPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetPluginsPath();
      return "";
    }

    GetDataDir(): moText {
      return this.m_DataDir;
    }

    GetModulesDir(): moText {
      return this.m_ModulesDir;
    }

    ReloadPluginDefinitions( plugindir : moText, mobjecttype : moMoldeoObjectType ) : MOint {

      return 0;
    }

    GetSession(): moDataSession {
      return this.m_pDataSession;
    }

}
