import { moAbstract } from "./mo-abstract";
import { moEventList, moEvent, moMessage } from "./mo-event-list";
import { moIODevice, moIODeviceArray, moIODevices } from "./mo-iodevice";
import { moIODevicePluginsArray } from "./mo-plugin";
import { MO_IODEVICE_KEYBOARD, MO_IODEVICE_MOUSE, MO_IODEVICE_MOBILE } from "./mo-moldeo-object";

export { moIODevice, moIODeviceArray, moIODevices } from "./mo-iodevice";

export enum moIODeviceCode {
  MO_SDL_MOUSEBUTTONUP = 0,
  MO_SDL_MOUSEBUTTONDOWN = 1,
  MO_SDL_MOUSEMOTION = 2,
  MO_SDL_MOUSEWHEEL = 3
};

export enum moIODeviceMobileCode {
  MO_ACCELERATION_LINEAR = 0,
  MO_ACCELERATION_LINEAR_W_GRAVITY = 1,
  MO_ROTATION = 2
};

function arrayRemove( arr : any, value : any ) : any { return arr.filter(function(mob){ return mob.GetLabelName() != value.GetLabelName(); });}

export class moIODeviceManager extends moAbstract {

  m_MouseEvents: any = [];
  m_MobileEvents: any = [];
  m_TouchEvents: any = [];
  m_Events : moEventList = new moEventList();
  m_IODevices : moIODevices = [];
  m_Plugins: moIODevicePluginsArray;
  m_lasttype : any = "";
  m_lastmouse : any = "";
  m_lasttouch : any = "";
  m_lastaccel : any = "";
  m_lastsensor : any = "";
  m_pResourceManager : any = null;

  constructor() {
    super();
    //this.SetName("_iodevicemanager_");
  }
/**
         * constructor genérico de la clase.
         */
		//moIODevice*		NewIODevice( const moText& p_devname,
    // const moText& p_configname, const moText& p_labelname,
    // const moText& p_keyname,  moMoldeoObjectType p_type,
    // int paramindex = -1, int valueindex = -1, bool p_activate=true );

  /**
   * constructor genérico de la clase.
   */
  RemoveIODevice( device : any ) : boolean {
    this.m_IODevices = arrayRemove( this.m_IODevices, device );
    return true;
  }


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

      console.log("moIODeviceManager::Init");

      window.addEventListener('mousemove', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('touchmove', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('mouseclick', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('click', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('touchstart', (event) => { return this.ProcessEvent(event); }, false);
      window.addEventListener('touchend', (event) => { return this.ProcessEvent(event); }, false);
      window.addEventListener('touchcancel', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('mouseover', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('mouseenter', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('mouseout', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('mousedown', (event) => { return this.ProcessEvent(event) }, false);
      //prevent right click context menu
      //window.addEventListener('contextmenu', (event) => { event.preventDefault(); return false; }, false );
      window.addEventListener('mouseup', (event) => { return this.ProcessEvent(event) }, false);

      window.addEventListener('mousewheel', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('wheel', (event) => { return this.ProcessEvent(event) }, false);

      window.addEventListener('devicemotion', (event) => { return this.ProcessEvent(event) }, false);
      window.addEventListener('deviceorientation', (event) => { return this.ProcessEvent(event) }, false);


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

        //console.log("window.innerHeight:", window.innerHeight);

        var screen_height = window.innerHeight;
        var screen_width = window.innerWidth;
        var top_height = 0;
        var top_width = 0;

        if (this.m_pResourceManager) {

          //console.log("canvas.height:", this.m_pResourceManager.GetRenderMan().ScreenHeight() );
          screen_height = this.m_pResourceManager.GetRenderMan().ScreenHeight();
          screen_width = this.m_pResourceManager.GetRenderMan().ScreenWidth();
          top_height = window.innerHeight - screen_height;
        }

        //if (event.scale !== 1) { event.preventDefault(); }
        //console.log("ProcessEvent:", event, event.type, typeof event);
        if ( event.type.indexOf("mouse")==0 || event.type.indexOf("touch")==0 ) {
          //event.stopPropagation();
          //event.preventDefault();
          //console.log("is mouse move!");

          var mevent = {
            "type": event.type,
            "clientX": (event.clientX-top_width) / screen_width,
            "clientY": (event.clientY-top_height) / screen_height,
            "relX": 0,
            "relY": 0,
            "button": event.button,
            "buttons": event.buttons,
            "event": event,
          };
          if (event.movementX!=undefined) {
            mevent["relX"] = event.movementX / screen_width;
            mevent["relY"] = event.movementY / screen_height;
          }
          if (event.deltaY!=undefined) {
            mevent["relX"] = event.deltaX;
            mevent["relY"] = event.deltaY;
          }
          //console.log("x: "+mevent.clientX,"y: "+mevent.clientY);

          var Event : moEvent;

          if (event.type=="mouseup") {
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEBUTTONUP, mevent.button, mevent.clientX, mevent.clientY );
            console.log(screen_height,top_height,mevent.clientX,mevent.clientY);
          } else
          if (event.type=="touchend") {
            mevent.button = 0;
            mevent.clientX = (event.changedTouches[0].clientX-top_width)/screen_width;
            mevent.clientY = (event.changedTouches[0].clientY-top_height)/screen_height;
            this.m_TouchEvents = undefined;
            //this.m_TouchEvents[0] = { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY };
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEBUTTONUP, mevent.button, mevent.clientX, mevent.clientY );
            this.m_lasttype = event.type + " > "+mevent.clientX.toFixed(3)+","+mevent.clientY.toFixed(3)+","+mevent.relX.toFixed(3)+","+mevent.relY.toFixed(3);
            this.m_lasttouch = this.m_lasttype;
          }

          else
          if (event.type=="mousedown") {
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEBUTTONDOWN, mevent.button, mevent.clientX, mevent.clientY );
          } else
          if (event.type=="touchstart") {
            mevent.button = 0;
            mevent.clientX = (event.changedTouches[0].clientX-top_width)/screen_width;
            mevent.clientY = (event.changedTouches[0].clientY-top_height)/screen_height;
            this.m_TouchEvents = []
            this.m_TouchEvents[0] = { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY };
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEBUTTONDOWN, mevent.button, mevent.clientX, mevent.clientY );
            this.m_lasttype = event.type + " > "+mevent.clientX.toFixed(3)+","+mevent.clientY.toFixed(3)+","+mevent.relX.toFixed(3)+","+mevent.relY.toFixed(3);
            this.m_lasttouch = this.m_lasttype;
          }
          else
          if (event.type=="mousemove") {
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEMOTION, mevent.relX, mevent.relY, mevent.clientX, mevent.clientY );
          } else
          if (event.type=="touchmove") {
            try {
              //event.stopPropagation();
            } catch(err) {

            }
            try {
              //event.preventDefault();
            } catch(err) {

            }
            mevent.button = 0;
            mevent.clientX = (event.changedTouches[0].clientX-top_width)/screen_width;
            mevent.clientY = (event.changedTouches[0].clientY-top_height)/screen_height;
            if (this.m_TouchEvents && this.m_TouchEvents[0]) {
              mevent.relX = (event.changedTouches[0].clientX-this.m_TouchEvents[0].clientX) / screen_width;
              mevent.relY = (event.changedTouches[0].clientY-this.m_TouchEvents[0].clientY) / screen_height;
            } else {
              mevent.relX = 0.0;
              mevent.relY = 0.0;
            }
            this.m_TouchEvents = [];
            this.m_TouchEvents[0] = { clientX: event.changedTouches[0].clientX, clientY: event.changedTouches[0].clientY };
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEMOTION, mevent.relX, mevent.relY, mevent.clientX, mevent.clientY );
            this.m_lasttype = event.type + " > "+mevent.clientX.toFixed(3)+","+mevent.clientY.toFixed(3)+","+mevent.relX.toFixed(3)+","+mevent.relY.toFixed(3);
            this.m_lasttouch = this.m_lasttype;
          }
          if (Event) {
            Event.jsevent = mevent;
            this.m_MouseEvents.push( Event );
            this.m_lasttype = event.type + " j:"+Event.jsevent.type+" > "+mevent.clientX.toFixed(3)+","+mevent.clientY.toFixed(3)+","+mevent.relX.toFixed(5)+","+mevent.relY.toFixed(5);
            this.m_lastmouse = this.m_lasttype;
          }
          //console.log("is mouse move!", mevent, event);
        } else {
          if ( event.type.indexOf("devicemotion")==0 ) {
            let accel = "";
            let accelfull = "";
            let rotat = "";
            if (event.acceleration) {
              if (event.acceleration.x!=null) {
                accel = " acc: "+Number(event.acceleration.x).toFixed(3)+","+Number(event.acceleration.y).toFixed(3)+","+Number(event.acceleration.z).toFixed(3);
                var Event : moEvent;
                Event = new moEvent(  MO_IODEVICE_MOBILE,
                                      moIODeviceMobileCode.MO_ACCELERATION_LINEAR,
                                      Number(Number(event.acceleration.x).toFixed(3)),
                                      Number(Number(event.acceleration.y).toFixed(3)),
                                      Number(Number(event.acceleration.z).toFixed(3)) );
                this.m_MobileEvents.push( Event );
              }

              var el : any = document.getElementById("accxyz");
              //if (el) el.innerHTML = event.alpha + ' : ' + event.beta + ' : ' + event.gamma;
              if (el) el.innerHTML = Number(event.acceleration.x).toFixed(3)
                +' : '+Number(event.acceleration.y).toFixed(3)
                +' : '+Number(event.acceleration.z).toFixed(3);

            }
            if (event.accelerationIncludingGravity) {
              if (event.accelerationIncludingGravity.x!=null) {
                accelfull = " accfull: "+Number(event.accelerationIncludingGravity.x).toFixed(3)+","+Number(event.accelerationIncludingGravity.y).toFixed(3)+","+Number(event.accelerationIncludingGravity.z).toFixed(3);
                var Event : moEvent;
                Event = new moEvent(  MO_IODEVICE_MOBILE,
                                      moIODeviceMobileCode.MO_ACCELERATION_LINEAR_W_GRAVITY,
                                      Number(Number(event.accelerationIncludingGravity.x).toFixed(3)),
                                      Number(Number(event.accelerationIncludingGravity.y).toFixed(3)),
                                      Number(Number(event.accelerationIncludingGravity.z).toFixed(3)) );
                this.m_MobileEvents.push( Event );
              }
            }
            if (event.rotationRate) {
              if (event.rotationRate.alpha!=null) {
                rotat = " rot: "+Number(event.rotationRate.alpha).toFixed(3)+","+Number(event.rotationRate.beta).toFixed(3)+","+Number(event.rotationRate.gamma).toFixed(3);
                var Event : moEvent;
                Event = new moEvent(  MO_IODEVICE_MOBILE,
                                      moIODeviceMobileCode.MO_ROTATION,
                                      Number(Number(event.rotationRate.alpha).toFixed(3)),
                                      Number(Number(event.rotationRate.beta).toFixed(3)),
                                      Number(Number(event.rotationRate.gamma).toFixed(3)) );
                this.m_MobileEvents.push( Event );
              }
            }
            this.m_lasttype = "devicemotion > " + accel + accelfull + rotat;
            this.m_lastsensor = this.m_lasttype;

          }

          if ( event.type.indexOf("deviceorientation")==0 ) {
            if (event.alpha) {
            }
            if (event.beta) {
            }
            if (event.gamma) {
            }
            this.m_lasttype = "deviceorientation > " + event.alpha;
            this.m_lastsensor = this.m_lasttype;
          }

          if (event.type=="wheel" || event.type=="mousewheel") {
            console.log("wheel",event)
            Event = new moEvent( MO_IODEVICE_MOUSE, moIODeviceCode.MO_SDL_MOUSEWHEEL, event.deltaX, event.deltaY, event.deltaZ, event.deltaMode );
            if (Event) {
              Event.jsevent = event;
              this.m_MouseEvents.push( Event );
              this.m_lasttype = event.type + " j:"+Event.jsevent.type+" > "+event.deltaX.toFixed(3)+","+event.deltaY.toFixed(3)+","+event.deltaZ.toFixed(5)+","+event.deltaMode.toFixed(5);
              this.m_lastmouse = this.m_lasttype;
            }
          }
        }
          //console.log("Processed MouseEvent:", this.m_MouseEvent);
        //}
        //console.log(event);
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

      if (this.m_MobileEvents.length) {
        for (var i = 0; i < this.m_MobileEvents.length; i++) {
          this.m_Events.m_Array.push(this.m_MobileEvents[i]);
        }
        this.m_MobileEvents = [];
      }

    }
}
