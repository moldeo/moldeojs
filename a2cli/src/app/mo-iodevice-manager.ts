import { moAbstract } from "./mo-abstract";
import { moEventList, moEvent, moMessage } from "./mo-event-list";
import { moIODevice, moIODeviceArray, moIODevices } from "./mo-iodevice";
import { moIODevicePluginsArray } from "./mo-plugin";

export { moIODevice, moIODeviceArray, moIODevices } from "./mo-iodevice";
export class moIODeviceManager extends moAbstract {

  m_Events : moEventList;
  m_IODevices : moIODevices = [];
  m_Plugins: moIODevicePluginsArray;

  constructor() {
    super();
    //this.SetName("_iodevicemanager_");
  }
/**
         * constructor genérico de la clase.
         */
		//moIODevice*		NewIODevice( const moText& p_devname,  const moText& p_configname, const moText& p_labelname, const moText& p_keyname,  moMoldeoObjectType p_type, int paramindex = -1, int valueindex = -1, bool p_activate=true );

        /**
         * constructor genérico de la clase.
         */
        //RemoveIODevice( MOint p_ID ) : boolean {}


        /**
         * TODO:
         */
  IODevices(): moIODeviceArray {
    return this.m_IODevices;
  };

        /**
         * constructor genérico de la clase.
         */
        Update() : void {

        }

        /**
         * TODO:
         */
        Init() : boolean {
          return super.Init();
        }

        /**
         * TODO:
         */
        //virtual MOboolean Finish();

        /**
         * TODO:
         */
        //MOswitch GetStatus(MOdevcode);

        /**
         * TODO:
         */
        //MOswitch SetStatus( MOdevcode,MOswitch);

        /**
         * TODO:
         */
        //MOdevcode GetCode( char*);

        /**
         * TODO:
         */
        GetEvents() :  moEventList {
          return this.m_Events;
        }

        /**
         * Eliminar aquellos eventos que no son de la clase derivada de moEvent: moMessage
         * moEvent es un evento sin destinatario definido. Todos lo leen,
         * moMessage en cambio tiene un emisor y un destinatario
         */
        PurgeEvents() : void {

        }

    PollEvents() : void {

    }
}
