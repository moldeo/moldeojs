import { moAbstract } from "./mo-abstract";
import { moEventList, moEvent, moMessage } from "./mo-event-list";
import { moIODevice, moIODeviceArray, moIODevices } from "./mo-iodevice";
import { moIODevicePluginsArray, moNewIODevice, moPluginsArray } from "./mo-plugin";
import { moMoldeoObjectType } from './mo-moldeo-object-type.enum';
import { moMobDefinition } from './mo-moldeo-object';
import {moResourceManager} from './mo-resource-manager';

export { moIODevice, moIODeviceArray, moIODevices } from "./mo-iodevice";
export class moIODeviceManager extends moAbstract {

  m_MouseEvents: any = [];
  m_Events : moEventList = new moEventList();
  m_IODevices : moIODevices = [];
  //m_Plugins: moIODevicePluginsArray;
  m_Plugins : moPluginsArray = [];
  m_pResourceManager: moResourceManager;

  constructor() {
    super();
    //this.SetName("_iodevicemanager_");
  }
/**
         * constructor genérico de la clase.
         */
	NewIODevice( p_devname : any,
               p_configname : any,
               p_labelname : any,
               p_keyname : any,
               p_type : moMoldeoObjectType,
              p_paramindex : any,
              p_valueindex : any,
              p_activate : boolean ) : moIODevice {
                var pdevice : moIODevice;
                switch (p_type) {
                		case moMoldeoObjectType.MO_OBJECT_IODEVICE:
                			pdevice = moNewIODevice( p_devname, this.m_Plugins );
                			if (pdevice) this.m_IODevices.push( pdevice );
                			break;
                		default:
                			break;
                	}

                	if (pdevice) {
                      /*moMobDefinition MDef = pdevice->GetMobDefinition();

                	    MDef.SetConsoleParamIndex(paramindex);
                	    MDef.SetConsoleValueIndex(valueindex);
                      MDef.SetConfigName( p_configname );
                      MDef.SetLabelName( p_labelname );
                      MDef.SetKeyName( p_keyname );
                      MDef.SetActivate(p_activate);

                      pdevice->SetMobDefinition(MDef);*/
                      var MDef : moMobDefinition = pdevice.GetMobDefinition();
                      MDef.SetConfigName( p_configname );
                      MDef.SetLabelName( p_labelname );
                      MDef.SetKeyName( p_keyname );

                      MDef.SetConsoleParamIndex(p_paramindex);
                      MDef.SetConsoleValueIndex(p_valueindex);
                      MDef.SetActivate(p_activate);

                      pdevice.SetMobDefinition( MDef );
                      //m_pMoldeoObjects->Add( (moMoldeoObject*) peffect );
                      pdevice.SetResourceManager( this.m_pResourceManager );
                	}
                  return pdevice;
              }

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
  Update(): void {
    this.PollEvents();
    //console.log(`IO:Update (${this.m_Events.m_Array.length})`);
    for(var i = 0; i < this.m_IODevices.length; i++) {
      var piodevice : moIODevice = this.m_IODevices[i];
      if(piodevice) {
        if (piodevice.Activated())
          piodevice.Update(this.m_Events);
      }
    }
  }

        /**
         * TODO:
         */
        Init() : boolean {

          window.addEventListener('mousemove', (event) => { this.ProcessEvent(event) }, false);
          window.addEventListener('mouseclick', (event) => { this.ProcessEvent(event) }, false);
          window.addEventListener('mouseover', (event) => { this.ProcessEvent(event) }, false);
          window.addEventListener('mouseenter', (event) => { this.ProcessEvent(event) }, false);
          window.addEventListener('mouseout', (event) => { this.ProcessEvent(event) }, false);
          window.addEventListener('mousedown', (event) => { this.ProcessEvent(event) }, false);
          window.addEventListener('mouseup', (event) => { this.ProcessEvent(event) }, false);

          window.addEventListener('mousewheel', (event) => { this.ProcessEvent(event) }, false);


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
          this.m_Events.m_Array = [];
        }
        ProcessEvent( event : any ) : void {
          if (event) {
            //console.log("ProcessEvent:", event, event.type, typeof event);
            if ( event.type.indexOf("mouse")==0 ) {
              //console.log("is mouse move!");
              var mevent = {
                "type": event.type,
                "clientX": event.clientX / window.innerWidth,
                "clientY": event.clientY / window.innerHeight,
              };
              this.m_MouseEvents.push( mevent );
              //console.log("is mouse move!", this.m_MouseEvent);
            }
              //console.log("Processed MouseEvent:", this.m_MouseEvent);
            //}
          }
        }
        PollEvents() : void {
          //console.log("pollevent>post mouse event", this.m_MouseEvent);
          if (this.m_MouseEvents.length) {
            for (var i = 0; i < this.m_MouseEvents.length; i++) {
              this.m_Events.m_Array.push(this.m_MouseEvents[i]);
            }
            this.m_MouseEvents = [];
          }

    }
}
