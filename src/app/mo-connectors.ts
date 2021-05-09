
import { moAbstract } from "./mo-abstract";
import { moText } from "./mo-text";
import { MOint, MOuint, MOlong, MOulong, moNumber } from "./mo-types";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moParam, moParamType } from "./mo-param";
import { moData, moDataType, moDataMessages, moDataMessage } from "./mo-value";
import { moDataTypeStr } from "./mo-data-type.enum";
/// Conector para vincular objetos con datos
/**
 *  Objeto base de moOutlet (Emisor) e moInlet (Receptor) para manejar la transmisión de datos entre diferentes moMoldeoObject.
 *  Un moOutlet es un moConnector que tiene conexiones a uno o varios moInlet (Receptores).
 *  Cada moOutlet se comunica con los correspondientes moInlet a través de un moMessage.
 *  moMessage -> Tiene un destinatario definido con su respectivo inlet receptor.
 *
 *
 * @see moConnection
 * @see moOutlet
 * @see moInlet
 * @see moMessage
 * @see moMoldeoObject
 * @see moMoldeoObject::Update()
 */

export class moConnector extends moAbstract {

  //Type and Data, it may be a pointer to the plugins data...:-D
  /**
  * actual data, for realtime........(last one)
  */
  m_pData : moData = null;

  /**
  * historical data, for streaming....
  */
  m_DataMessages : moDataMessages = [];//historical data for streaming

  /**
  * For synchronization between internal parameter's config ( edited in real time ),
    and inlets ( receivers ),
    and outlets ( emitters ).
  */
  m_pParam : moParam = null;

  m_MoldeoId : MOint = -1;
  m_MoldeoLabelName : moText = "";
  m_ConnectorId : MOint = -1;
  m_ConnectorLabelName : moText = "";

  m_bUpdated : boolean = false;

  constructor() {
    super();
  }

  /**
  * Inicializador
  * @param p_ConnectorLabelName nombre único del objeto al que pertenece este conector
  * @param ConnectorId id único del objeto al que pertenece este conector
  * @param p_datatype tipo de dato manejado por este conector
  *                   [ moDataType | moText | moParam | ]
  */
  Init(p_ConnectorLabelName ?: moText, ConnectorId ?: MOint, t_datatype ?: any, t_def?:any): boolean {
    this.m_ConnectorLabelName = p_ConnectorLabelName;
    this.m_ConnectorId = ConnectorId;

    var ttype: moDataType;
    //console.log("t_datatype:", p_ConnectorLabelName, typeof t_datatype, t_datatype);
    if (typeof t_datatype == "string") {
      ttype = moDataTypeStr["" + t_datatype];
      this.m_pData = new moData( ttype );
      this.m_pParam = null;
    } else {
      if (typeof t_datatype == "object") {
        if (t_datatype.constructor) {
          if (t_datatype.constructor.name) {
            if (t_datatype.constructor.name == "moData") {
              this.m_pData = t_datatype;
            }

            if (t_datatype.constructor.name == "moDataType") {
              this.m_pData = new moData( t_datatype );
            }


            if (t_datatype.constructor.name == "moParamType"
            || t_datatype.constructor.name == "moParam") {

              if (t_datatype.constructor.name == "moParam") {
                var Param: moParam = t_datatype;
                var p_paramtype: moParamType = Param.GetParamDefinition().GetType();
                this.m_pParam = Param;
              } else {
                var p_paramtype: moParamType = t_datatype;
              }

              ///En este caso se crea un tipo de dato compatible con el dato que se quiere enviar
              ///tomando de base el tipo de parámetro ya conocemos el dato que recibiremos
              ///esto varia ligeramente del dato original del parametro
              // del config, ya que debería estar resuelto ya
              ///o sea, en caso de una funcion , se recibirá el resultado de esta
              ///en el caso de una textura, el puntero a ella
              ///en el caso de un texto será un texto
              ///de cualquier tipo de coordenada será un real
              ///de un color será un vector de 4 valores (float por precision)
              switch( p_paramtype ) {
                  case moParamType.MO_PARAM_ALPHA:
                  case moParamType.MO_PARAM_PHASE:
                  case moParamType.MO_PARAM_SYNC:
                  case moParamType.MO_PARAM_TRANSLATEX:
                  case moParamType.MO_PARAM_TRANSLATEY:
                  case moParamType.MO_PARAM_TRANSLATEZ:
                  case moParamType.MO_PARAM_SCALEX:
                  case moParamType.MO_PARAM_SCALEY:
                  case moParamType.MO_PARAM_SCALEZ:
                  case moParamType.MO_PARAM_ROTATEX:
                  case moParamType.MO_PARAM_ROTATEY:
                  case moParamType.MO_PARAM_ROTATEZ:
                  case moParamType.MO_PARAM_FUNCTION:
                      this.m_pData = new moData( moDataType.MO_DATA_NUMBER_FLOAT );
                      break;

                  case moParamType.MO_PARAM_NUMERIC:
                  case moParamType.MO_PARAM_BLENDING:
                  case moParamType.MO_PARAM_POLYGONMODE:
                      this.m_pData = new moData( moDataType.MO_DATA_NUMBER_LONG );
                      break;

                  case moParamType.MO_PARAM_COLOR:
                      this.m_pData = new moData( moDataType.MO_DATA_VECTOR4F );
                      break;

                  case moParamType.MO_PARAM_FONT:
                      this.m_pData = new moData( moDataType.MO_DATA_FONTPOINTER );
                      break;

                  case moParamType.MO_PARAM_TEXT:
                  case moParamType.MO_PARAM_SCRIPT:
                      this.m_pData = new moData( moDataType.MO_DATA_TEXT );
                      break;

                  case moParamType.MO_PARAM_OBJECT:
                  case moParamType.MO_PARAM_3DMODEL:
                      this.m_pData = new moData( moDataType.MO_DATA_3DMODELPOINTER );
                      break;

                  case moParamType.MO_PARAM_TEXTURE:
                  case moParamType.MO_PARAM_TEXTUREFOLDER:
                  case moParamType.MO_PARAM_VIDEO:
                      this.m_pData = new moData( moDataType.MO_DATA_VIDEOSAMPLE );
                      break;

                  case moParamType.MO_PARAM_COMPOSE:
                      this.m_pData = new moData( moDataType.MO_DATA_MESSAGE );
                      break;

                  case moParamType.MO_PARAM_SOUND:
                      this.m_pData = new moData( moDataType.MO_DATA_SOUNDSAMPLE );
                      break;

                  case moParamType.MO_PARAM_UNDEFINED:
                      this.m_pData = new moData( moDataType.MO_DATA_POINTER );
                      break;

                  default:
                      this.m_pData = new moData( moDataType.MO_DATA_NUMBER );
                      break;
              }

              if (t_datatype.constructor.name == "moParam") {
                //let P: moParam = t_datatype;
                //this.m_pData = new moData( ttype );
                /** Se fija al parámetro el m_pData como Dato Externo del Parámetro,

                Al llamar al moParam::GetData se evalua asi:

                a) DATO DINAMICO: el dato interno del inlet (m_pData)
                segun si fue Actualizado (m_bUpdated)
                b) DATO ESTATICO: el valor del valor de la configuracion

                */
                if (this.m_pParam) {
                    this.m_pParam.SetExternData( this.m_pData );
                }

              }
            }

          }
        }
      }
    }


    return true;
  }
  /**
   * Init(
    p_ConnectorLabelName: moText,
    ConnectorId: MOint,
    p_param : moParam ): boolean {

    var res: boolean = super.Init(p_ConnectorLabelName, ConnectorId, p_param);


  }
   */


  /**
  * observador de la clase, devuelve el id del conector
  * @return el id del conector
  */
  GetConnectorId() : MOint { return this.m_ConnectorId; }

  /**
  * observador de la clase, devuelve el nombre único del objeto al que pertenece el conector
  * @return el nombre único del objeto al que pertenece el conector
  */
  GetMoldeoLabelName(): moText { return this.m_ConnectorLabelName; }

  /**
  * fija el nombre único del objeto al que pertenece el conector
  * @param p_MoldeoLabelName el nombre único del objeto al que pertenece el conector
  */
  SetMoldeoLabelName(p_MoldeoLabelName: moText): void {
    this.m_MoldeoLabelName = p_MoldeoLabelName;
  }

  /**
  * observador de la clase, devuelve el id del objeto al que pertenece este conector
  * @return el id del objeto al que pertenece este conector
  */
  GetMoldeoId(): MOint {
    return this.m_MoldeoId;
  }

  /**
  * fija el id único del objeto al que pertenece este conector
  * @param p_moldeoid el id del objeto al que pertenece este conector
  */
  SetMoldeoId(p_moldeoid: MOint): void {
    this.m_MoldeoId = p_moldeoid;
  }

  /**
  * observador de la clase, devuelve el nombre único de este conector
  * @return el nombre único de este conector
  */
  GetConnectorLabelName(): moText {
    return this.m_ConnectorLabelName;
  }

  /**
  * fija el tipo de dato vinculado a este conector
  * @param p_datatype el tipo de dato vinculado a este conector
  */
  SetType(p_datatype: moDataType): void {
    this.m_pData.m_DataType = p_datatype;
  }

  /**
  * observador de la clase, devuelve el tipo de dato del conector
  * @return el tipo de dato del conector
  */
  GetType(): moDataType { return this.m_pData.m_DataType; }

  /**
  * fija el parámetro al que estará vinculado este conector
  * @param p_data el parámetro al que estará vinculado este conector
  */
  SetData( p_data : moData ): void {
    this.m_pData = p_data;
  }

  /**
  * observador de la clase, devuelve el puntero al parámetro al que está vinculado este conector
  * @return el puntero al parámetro al que está vinculado este conector
  */
  GetData(): moData {
    if (this.m_pParam) {
      /** Si es un inlet asociado a un parametro devuelve el m_pData interno que fue asociado por el SetExternalData*/
      //MODebug2->Message("Es un inlet asociado a un parametro... connector: "
      // + GetConnectorLabelName() + " param:" + m_pParam->GetParamDefinition().GetName() );
      return this.m_pParam.GetData();
    }

    /** Unicamente para inlets o outlets independientes y alterar
     * parametros ya existentes (se accede luego desde moParam como m_pExternData...*/
    if (this.m_pData) {
    //MODebug2->Message("Es un inlet asociado a un dato... connector: " + GetConnectorLabelName());
    //MODebug2->Message("Es un inlet asociado a un dato... connector: " + GetConnectorLabelName() + " data: " + moText((long)m_pData));
      return this.m_pData;
    }
    return null;
  }

  GetInternalData() { return this.m_pData; }

  /**
  * crea un objeto nuevo de datos
  */
  NewData() : void {
    this.m_pData = new moData();
  }

  /**
  *   construye el mensaje para ser almacenado, esto es necesario para aquellos conectores que
  *   usen streaming de datos...sin estructura fija....
  */
  AddData( data : moData): void {
    var message : moDataMessage;

    if ( this.m_DataMessages.length == 0 ) {
        message = [];
        message.push( data );
        this.AddMessage(message);
    } else {
        message = this.m_DataMessages[ this.m_DataMessages.length - 1];
        message.push( data );
    }
  }

  /**
  *   agrega este mensaje al buffer de mensajes del outlet
  *   esta funcionalidad es util para streaming de datos estructurados por paquetes...(OSC y otros)
  */
  AddMessage( datamessage : moDataMessage): void {
    this.m_DataMessages.push(datamessage);
  }

  /**
  * observador de la clase, devuelve la referencia al buffer de mensajes
  * @return la referencia la buffer de mensajes
  */
  GetMessages(): moDataMessages { return this.m_DataMessages; };


  /**
  * observador sobre la actualización del conector
  * @return devuelve true si fue actualizado recientemente, false si no
  */
  Updated(): boolean {
    return this.m_bUpdated;
  }

  /**
  * marca este dato como actualizado
  */
  Update( force : boolean = true) : void {
    this.m_bUpdated = force;
    if (this.m_pParam) {
      // TODO: this.m_pParam.Update();
    }
  }

  //TODO: put in C++ code
  SetNumber( number : moNumber ) {
    this.GetData().SetNumber(number);
  }

  /**
    Devuelve verdadero si no está asociado a un parámetro.
    Es un conector independiente (personalizado).
  */
  IsIndependent() : boolean {
    return (this.m_pParam==null || this.m_pParam==undefined);
  }

  /**
    Devuelve verdadero si está asociado a un parámetro
    Su estado depende del parámetro asociado.
  */
  IsParameterDependent() : boolean {
    return !(this.IsIndependent());
  }


}


export type moConnectors = moConnector[];

/// Conección, vínculo entre dos objetos
/**
 *  Vínculo específico desde un conector (moConnector) a uno o más conectores
 *  Especialmente usado dentro de cada moOutlet para almacenar las conexiones a
 *  a diferentes moInlet.
 *
 *  El sentido de las conexiones son desde un moMoldeoObject fuente hacia
 *  un MoldeoObject destinatario. Los moInlet y correspondiente moMoldeoObject se identifican con sus respectivos
 *  nombres.
 *
 *  @ TODO El id de cada Inlet y cada MoldeoObject debería recalcularse al modificarse la estructura del proyecto.
 */
export class moConnection extends moAbstract  {

//SOURCE: not really necessary
		m_SourceMoldeoLabelName : moText = "";
		m_SourceMoldeoId : MOint = -1;
		m_SourceConnectorLabelName : moText = "";
		m_SourceConnectorId : MOint = -1;

		//DESTINATION
		m_DestinationMoldeoLabelName : moText = "";
		m_DestinationMoldeoId : MOint = -1;
		m_DestinationConnectorLabelName : moText = "";
		m_DestinationConnectorId : MOint = -1;

  /**
  * Constructor
  * @param p_DestinationMoldeoLabelName el nombre único del objeto al que está conección se vinculará
  * @param p_DestinationConnectorLabelName el nombre único del conector del objeto al que está conección se vinculará
  * @param p_DestinationMoldeoId el id único del objeto al que está conección se vinculará
  * @param p_DestinationConnectorId el id único del conector del objeto al que está conección se vinculará
  */
  constructor(p_DestinationMoldeoLabelName: moText,
    p_DestinationConnectorLabelName: moText,
    p_DestinationMoldeoId: MOint = -1,
    p_DestinationConnectorId: MOint = -1) {
    super();
    this.m_DestinationMoldeoLabelName = p_DestinationMoldeoLabelName;
    this.m_DestinationConnectorLabelName = p_DestinationConnectorLabelName;
    this.m_DestinationMoldeoId = p_DestinationMoldeoId;
    this.m_DestinationConnectorId = p_DestinationConnectorId;
    }

    /**
    * Devuelve el id único del objeto al que está conección está destinada
    */
  GetDestinationMoldeoId(): MOint { return this.m_DestinationMoldeoId; }

        /**
        * Devuelve el nombre único del objeto al que está conección está destinada
        */
  GetDestinationMoldeoLabelName(): moText { return this.m_DestinationMoldeoLabelName; }

        /**
        * Devuelve el id único del conector al que está conección está destinada
        */
  GetDestinationConnectorId(): MOint { return this.m_DestinationConnectorId; }

        /**
        * Devuelve el nombre único del conector al que está conección está destinada
        */
  GetDestinationConnectorLabelName(): moText { return this.m_DestinationConnectorLabelName; }

        /**
        * Fija el id único del objeto al que está conección está destinada
        */
  SetDestinationMoldeoId(p_DestinationMoldeoId: MOint): void {
    this.m_DestinationMoldeoId = p_DestinationMoldeoId;
  }

        /**
        * Fija el nombre único del objeto al que está conección está destinada
        */
  SetDestinationMoldeoLabelName( p_DestinationMoldeoLabelName : moText ) {
    this.m_DestinationMoldeoLabelName = p_DestinationMoldeoLabelName;
  }

        /**
        * Fija el id único del conector al que está conección está destinada
        */
  SetDestinationConnectorId( p_DestinationConnectorId : MOint ) {
    this.m_DestinationConnectorId = p_DestinationConnectorId;
    }

        /**
        * Fija el nombre único del conector al que está conección está destinada
        */
  SetDestinationConnectorLabelName(p_DestinationConnectorLabelName: moText) {
    this.m_DestinationConnectorLabelName = p_DestinationConnectorLabelName;
  }

		/*
		virtual void Send();//ask to connector to receive data...
		virtual void OnSend();
		*/


}

export type moConnections = moConnection[];


/// Conector Inlet, conector que recibe datos
/**
 *  Recibe datos desde otro conector. El conector que envía es un Outlet (moOutlet)
 *
 *
 *
 * @see moConnector
 * @see moConnection
 * @see moOutlet
 */
export class moInlet extends moConnector {

  constructor() {
    super();
  }



}

export type moInlets = moInlet[];


/// Conector Outlet, conector que envía datos
/**
 *  Envía datos a uno o más conectores. El conector que recibe es un Intlet (moInlet)
 *
 *  Comunica los datos internos para cada conección de forma independiente
 *  genera el evento/mensaje poblando la lista de eventos (moEventList) con el nuevo dato y el MoldeoID correspondiente a cada conección
 *
 *  Los mensajes son creados por el mismo moMoldeoObject
 * en la función moMoldeoObject::Update() y puestos en la cola de eventos (moEventList)
 *
 * @see moConnector
 * @see moConnection
 * @see moInlet
 * @see moMoldeoObject
 * @see moMessage
 * @see moEventList
 */
export class moOutlet extends moConnector {

  /**
  * Conecciones
  */
  m_Connections : moConnections = [];

  constructor() {
    super();

  }

  /**
  * conecta el outlet a un conector inlet agregando una conección a la lista de conecciones del outlet
  */
  Connect( p_connector : moInlet ): boolean {
    for( var i = 0; i < this.m_Connections.length; i++ ) {
      if ( this.m_Connections[i].GetDestinationMoldeoId() == p_connector.GetMoldeoId()
        && this.m_Connections[i].GetDestinationConnectorId() == p_connector.GetConnectorId())
      return false;
    }
    var Connection: moConnection = new moConnection(
      p_connector.GetMoldeoLabelName(),
      p_connector.GetConnectorLabelName(),
      p_connector.GetMoldeoId(),
      p_connector.GetConnectorId())
    this.m_Connections.push( Connection );
    return true;
  }

        /**
        * desconecta el outlet de un conector inlet eliminando la conección de la lista de conecciones del outlet
        */
  Disconnect( p_connector : moInlet ): void {

  }

        /// Devuelve las conecciones de un outlet
        /**
        *   Es una lista de conecciones que puede ser enumerada
        */
  GetConnections() : moConnections {
    return this.m_Connections;
  }


}


export type moOutlets = moOutlet[];
