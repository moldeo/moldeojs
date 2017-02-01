import {
  MOfloat, MOdouble, MOulong,
  MOlong, MOint, MOuint, moNumber,
  moTextFilterParam, MOswitch,
  MO_DISPLAY, MO_HANDLE, NULL
} from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moIODeviceManager } from "./mo-iodevice-manager";
import { moResourceManager } from "./mo-resource-manager";
import { moRenderManagerMode } from "./mo-render-manager";

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

export class moConsoleState {
    m_Mode : moConsoleMode;

    m_RenderFrameQuality : moText;

    pause : MOswitch;
    automatic : MOswitch;
    reinit : MOswitch;
    finish : MOswitch;

    setfps : MOswitch;
    fps: MOuint;
    fps0: MOuint;
    fps1: MOuint;

    //especiales
    stereooutput : MOswitch;

    savescreen : MOswitch;
    frame : MOuint;

    step_interval : MOlong;
};


