import {
  MOfloat, MOdouble, MOulong,
  MOlong, MOint, MOuint, moNumber,
  moTextFilterParam, MOswitch,
  MO_DEACTIVATED, MO_ACTIVATED, MO_OFF, MO_ON, MO_FALSE, MO_TRUE,
  MO_DISPLAY, MO_HANDLE, NULL
} from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moIODeviceManager } from "./mo-iodevice-manager";
import { moResourceManager } from "./mo-resource-manager";
import { moRenderManagerMode } from "./mo-render-manager";
import { moEffectState } from "./mo-effect-state";


export const MO_DEF_SCREEN_WIDTH = 640;
export const MO_DEF_SCREEN_HEIGHT = 300;
export const MO_DEF_RENDER_WIDTH = 640;
export const MO_DEF_RENDER_HEIGHT = 300;

export enum moConsoleMode {

  MO_CONSOLE_MODE_LIVE=0,
  MO_CONSOLE_MODE_RECORD_SESSION=1,
  MO_CONSOLE_MODE_PLAY_SESSION=2,
  MO_CONSOLE_MODE_RENDER_SESSION=3,

};

export class moConsoleState extends moEffectState {

    m_Mode: moConsoleMode = moConsoleMode.MO_CONSOLE_MODE_LIVE;
    m_RenderFrameQuality : moText = "JPGGOOD";

    pause : MOswitch = MO_DEACTIVATED;
    automatic : MOswitch = MO_DEACTIVATED;
    reinit : MOswitch = MO_FALSE;
    finish : MOswitch = MO_FALSE;

    setfps : MOswitch = MO_DEACTIVATED;
    fps: MOuint = 30;
    fps0: MOuint = 0;
    fps1: MOuint = 1;

    //especiales
    stereooutput : MOswitch;

    savescreen : MOswitch = MO_DEACTIVATED;
    frame : MOuint = 0;

    step_interval: MOlong = 0;

    constructor() {
      super();
    }

    Init(): boolean {
      this.automatic = MO_DEACTIVATED;
      this.pause = MO_DEACTIVATED;
      this.finish = MO_FALSE;
      this.reinit = MO_FALSE;
      this.setfps = MO_DEACTIVATED;

      this.fps = 30;
      this.fps0 = 0;
      this.fps1 = 1;

      this.m_Mode = moConsoleMode.MO_CONSOLE_MODE_LIVE;
      this.stereooutput = MO_DEACTIVATED;
	    this.savescreen = MO_DEACTIVATED;
	    this.frame = 0;

      this.m_RenderFrameQuality = "JPGGOOD";

      return true;
    }
};


