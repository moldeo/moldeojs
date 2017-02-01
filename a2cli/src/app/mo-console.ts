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
import {
  moConsoleState, moConsoleMode,
  MO_DEF_SCREEN_WIDTH, MO_DEF_SCREEN_HEIGHT,
  MO_DEF_RENDER_WIDTH, MO_DEF_RENDER_HEIGHT
} from "./mo-console-state";


export class moConsoleOptions {
    apppath : moText;
    datapath : moText;
    consoleconfig : moText;
    pIODeviceManager : moIODeviceManager;
    pResourceManager : moResourceManager;
    render_to_texture_mode : moRenderManagerMode = moRenderManagerMode.RENDERMANAGER_MODE_NORMAL;
    screen_width : MOint = MO_DEF_SCREEN_WIDTH;
    screen_height : MOint = MO_DEF_SCREEN_HEIGHT;
    render_width : MOint = MO_DEF_RENDER_WIDTH;
    render_height : MOint = MO_DEF_RENDER_HEIGHT;
    OpWindowHandle : MO_HANDLE = 0;
    Display: MO_DISPLAY = NULL;

    constructor() {

    }
};

export class moConsole extends moMoldeoObject {

  m_ConsoleState: moConsoleState;

  constructor() {
    super();
    this.name = "__console__";
    console.log("moConsole::constructor > created!");
  }

/**
 *
 */

  Init(options?: any): boolean {
    console.log("moConsole::Init > Console with:", options);
    if ("pResourceManager" in options) {
      //do not create ResourceManager
      this.m_pResourceManager = options["pResourceManager"];
      // test if is ok
    } else {
      this.m_pResourceManager = new moResourceManager();
      this.m_pResourceManager.Init();
    }

    if ("consoleconfig" in options) {
      //this.m_Config.Init();
      console.log("moConsole::Init > consoleconfig",
        typeof options["consoleconfig"],
        options["consoleconfig"].length,
        options["consoleconfig"]);
      //this.SetConfigName( options["consoleconfig"] );
      this.m_Config.LoadConfig( options["consoleconfig"] );
    }

    return super.Init();
  }

};
