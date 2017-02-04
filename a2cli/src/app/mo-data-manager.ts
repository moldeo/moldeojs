import { MOlong, MOulong, MOint, MOuint } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { moResource, moResourceType } from "./mo-resource";
import { moFile, moFileManager } from "./mo-file-manager";
import { moResourceManager } from "./mo-resource-manager";
import { moValue } from "./mo-value";
import { moConfig } from "./mo-config";
import { moMoldeoActionType } from "./mo-actions";
import { moParamDefinition } from "./mo-param";
import { moEffectState } from "./mo-effect";
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
    MO_DATASESSION_RECORD_TOMEMORY = 0, ///Grabación a memoria de las claves (al finalizar se puede elegir grabar o no a disco... modo predeterminado)
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


export enum moDataSessionRenderdMode {
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
  m_EffectState : moEffectState; /// Valor del dato agregado o modificado
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
export class moDataSessionConfig extends moAbstract {

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
  GetConfigDefinition()->Add( "keys", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_KEYS, moValue( "<moDataSessionKey></moDataSessionKey>", "XML") );
  GetConfigDefinition()->Add( "eventkeys", MO_PARAM_TEXT, MO_DATA_SESSION_CONFIG_EVENT_KEYS, moValue( "<moDataSessionEventKey></moDataSessionEventKey>", "XML") );
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
      moDebugManager::Error( moText(" please check libmoldeo DATADIR settings (configure.ac) > DATADIR is: ")  + moDataManager::GetDataDir() );
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
        m_SessionRenderMode : moDataSessionRenderdMode;

        //m_pVideoGraph : moVideoGraph;
        m_ActualKey : moDataSessionKey;

        m_Rendered_Frames : MOint;
        m_Rendered_Folder : moText;
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
      /*
      m_pDataSession = new moDataSession();
            m_pDataSession->Set( moText("session 1"),
                                 m_pDataSessionConfig,
                                 MO_DATASESSION_INACTIVE,
                                 MO_DATASESSION_RECORD_BUFFERINGTOFILE,
                                 MO_DATASESSION_PLAY_LIVETOCONSOLE,
                                 m_pResourceManager );
       */
      return super.Init();
    }

    NameToPath( p_name: moText ): moText {

      return p_name;
    }

    GetDataPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetDataPath();
      return "";
    }

    GetConsoleConfigName(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetDataPath();
      return "";
    }
		GetAppPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetDataPath();
      return "";
    }
		GetAppDataPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetDataPath();
      return "";
    }
		GetPluginsPath(): moText {
      if (this.m_pDataSessionConfig)
		    return this.m_pDataSessionConfig.GetDataPath();
      return "";
    }



}
