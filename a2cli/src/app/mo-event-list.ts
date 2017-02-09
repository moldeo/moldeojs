import { moAbstract } from "./mo-abstract";

/// Estructura base de un evento
/**
* Estructura base de un evento
*/
/*
struct LIBMOLDEO_API moEventStruct
{
	MOint valid;
	MOint deviceid;
	MOint devicecode;
	MOint reservedvalue0;
	MOint reservedvalue1;
	MOint reservedvalue2;
	MOint reservedvalue3;
};
*/

/// Clase Evento
/**
* Clase Evento
*/

export class moEvent {
  /*
public:

	moEvent *previous;
	moEvent *next;

	MOint deviceid; //esto vuela
	MOint devicecode;//esto puede q quede
	MOint reservedvalue0;
	MOint reservedvalue1;
	MOint reservedvalue2;
	MOint reservedvalue3;
	MOpointer pointer;

    /// Constructor
	moEvent();
	/// Constructor
	moEvent(MOint did, MOint cod, MOint val0 = 0, MOint val1 = 0, MOint val2 = 0, MOint val3 = 0, MOpointer ptr=0);
	/// Constructor
	moEvent(MOint did, MOint cod, MOint val0, MOpointer ptr );
	/// Destructor
	virtual ~moEvent();

	moText JSON;

  virtual const moText& ToJSON();
  */
};

export const MO_MESSAGE  = 0xFABC05;
export const MO_DATAMESSAGE  = 0xFABFAB;

/// Clase Mensaje
/**
* Clase Mensaje
* Esta clase deriva de un Evento adquiriendo además tanto un emisor como un receptor
* identificados ambos en el contexto de el administrador general de objetos moConsole y los identificadores
* individuales únicos de los objetos creados
*
*   Atención de no confundir con moDataMessage, que es un stream de moData que vienen de una misma fuente...
*
*/
export class moMessage extends moEvent {
/*
	public:
     moMessage();
    moMessage(const moMessage& src) : moEvent() {
      (*this) = src;
    }
    moMessage& operator=(const moMessage& src);

		moMessage( MOint m_MoldeoIdDest, MOint m_MoldeoIdSrc, const moData& data );
		moMessage( MOint m_MoldeoIdDest, MOint m_InletIdDest, MOint m_MoldeoIdSrc, const moData& data );
		moMessage( MOint p_MoldeoIdDest, MOint m_InletIdDest, moMoldeoObjectType p_TypeDest, MOint p_MoldeoIdSrc, moMoldeoObjectType p_TypeSrc, const moData& p_data );
		moMessage( MOint p_MoldeoIdDest, MOint m_InletIdDest, moMoldeoObjectType p_TypeDest, moText	p_NameDest, MOint p_MoldeoIdSrc, moMoldeoObjectType p_TypeSrc, moText p_NameSrc, const moData& p_data );
		virtual ~moMessage();

		moData					m_Data;

		MOint					m_MoldeoIdDest;
		MOint					m_InletIdDest;
		moMoldeoObjectType		m_TypeDest;
		moText					m_NameDest;

		MOint					m_MoldeoIdSrc;
		MOint					m_OutletIdSrc;
		moMoldeoObjectType		m_TypeSrc;
		moText					m_NameSrc;

    virtual const moText& ToJSON();
    */
}

export type moEvents = moEvent[];


/// Lista de eventos
/**
* Lista de eventos
* Esta lista es creada por el moIODeviceManager, el administrador de dispositivos de entrada/salida de Moldeo
* se crea un único moIODeviceManager por cada instancia de moConsole creado
* Esta lista de eventos funciona de forma sincrónica con el ciclo de dibujado y está protegida de todas maneras para ser utilizada de forma asinc´ronica
* a través de semáforos
*/

export class moEventList extends moAbstract {

	//moLock	m_lock;
	First : moEvent = null;
	Last : moEvent = null;

  constructor() {
    super();
  }


/*
	moEventList();
	virtual ~moEventList();


	MOboolean Init();
	void Add( moMessage* p_Message );
	void Add( moEvent* p_Event );
	void Add(MOint did, MOint cod, MOint val0 = 0, MOint val1 = 0, MOint val2 = 0, MOint val3 = 0, MOpointer ptr=0);
	void Add(MOint did, MOint cod, MOint val0, MOpointer ptr );
	MOboolean Delete(moEvent *ev);
	MOboolean Delete(moMessage *ev);
	MOboolean Finish();
*/
};

// moEventPacket class **************************************************
/// Paquete de eventos
/**
* Paquete de eventos
*   creado para poder empaquetar una cantidad de eventos determinada, y ser enviados o procesados simultaneamente,
*   se implementa para la conección via TCP/UDP entre dos estaciones y agiliazar/acelerar la comunicación entre estas.
*
*/
/*
class LIBMOLDEO_API moEventPacket : public moAbstract
{
public:
	moEventPacket(float p_sendInterval, int p_maxEventNum);
    ~moEventPacket();

	void ClearPacket();
	bool AddEvent(moEvent *e);
	bool ReadyToSend();

	int GetNumEvents() { return num_events; }
	int GetPacketSize() { return num_events * sizeof(moEventStruct); }
	moEventStruct* GetPacket() { return buffer_events; }
	moEventStruct GetEvent(int i) { return buffer_events[i]; }
private:
	float sendInterval;
	int maxEventNum;

    float time0;

    moEventStruct* buffer_events;
	void* pointer;
	moEventStruct empty_event;
	int num_events;
	bool packet_full;
};

moDeclareExportedDynamicArray( moEventPacket*, moEventPacketArray );

*/

