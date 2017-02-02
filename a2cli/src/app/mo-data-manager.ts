import { MOlong, MOint, MOuint } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moResource } from "./mo-resource";
import { moResourceManager } from "./mo-resource-manager";
import { moValue } from "./mo-value";
import { moMoldeoActionType } from "./mo-actions";
import { moParamDefinition } from "./mo-param";
import { moEffectState } from "./mo-effect";
import { moPluginDefinitions } from "./mo-plugin";

/***

    Modos de funcionamiento de la sesion


*/
enum moDataSessionMode {
        MO_DATASESSION_INACTIVE = 0, ///grabación y reproducción inactivos, modo predeterminado...
        MO_DATASESSION_PLAYBACK_ACTIVE = 1, ///reproducción activa
        MO_DATASESSION_RECORD_ACTIVE = 2,///grabación activa
        MO_DATASESSION_PLAYANDRECORD_ACTIVE = 3 ///reproducción y grabación simultánea
};

/***

    Modos de grabación de sesión


*/
enum moDataSessionRecordMode {
    MO_DATASESSION_RECORD_TOMEMORY = 0, ///Grabación a memoria de las claves (al finalizar se puede elegir grabar o no a disco... modo predeterminado)
    MO_DATASESSION_RECORD_BUFFERINGTOFILE = 1, ///grabación con memoria intermedia a disco
    MO_DATASESSION_RECORD_DIRECTTOFILE = 2, ///grabación directa de claves a archivo
    MO_DATASESSION_RECORD_STREAMING = 4
};

/***

    Modos de reproducción de sesión


*/
enum moDataSessionPlaybackMode {
    MO_DATASESSION_PLAY_LIVETOCONSOLE = 0, ///Reproducción en tiempo real a consola
    MO_DATASESSION_PLAY_LIVETOVIDEO = 1, ///Reproducción en vivo a video
    MO_DATASESSION_PLAY_LIVETOSTREAM = 2, ///Reproducción en vivo por streaming
    MO_DATASESSION_PLAY_RENDERTOVIDEO = 4 ///Reproducción renderizada a video por cuadros
};


enum moDataSessionRenderdMode {
    MO_DATASESSION_RENDER_TOMEMORY = 0, ///Renderizado en memoria
    MO_DATASESSION_RENDER_BUFFERINGTOFILE = 1, ///renderizado con memoria intermedia a disco
    MO_DATASESSION_RENDER_DIRECTTOFILE = 2, ///
    MO_DATASESSION_RENDER_STREAMING = 4
};

enum moDataSessionConfigParameters {
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

		m_Port : boolean;///para streaming
		m_Address : boolean;///para streaming
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

    m_pDataSessionConfig : moDataSessionConfig;
		m_pDataSession : moDataSession;
    m_PluginDefinitions : moPluginDefinitions;

  constructor() { super(); }
  Init(): boolean {
    return super.Init();
  }

  NameToPath( p_name: moText ): moText {

    return p_name;
  }

}
