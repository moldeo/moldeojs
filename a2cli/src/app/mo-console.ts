import {
  MOfloat, MOdouble, MOulong,
  MOlong, MOint, MOuint, moNumber,
  moTextFilterParam, MOswitch,
  MO_DISPLAY, MO_HANDLE, NULL
} from "./mo-types";
import { moText } from "./mo-text";
import { moConfig } from "./mo-config";
import { moMoldeoObjectType } from "./mo-moldeo-object-type.enum";
import { moMoldeoObject } from "./mo-moldeo-object";
import { moEffectManager } from "./mo-effect-manager";
import { moIODeviceManager } from "./mo-iodevice-manager";
import { moResourceManager } from "./mo-resource-manager";
import {
  moGUIManager, moGuiObject,
  moMaterial, moColor,
  moGeometry, moSphereGeometry
} from "./mo-gui-manager";
import { moRenderManager, moRenderManagerMode } from "./mo-render-manager";
import { moGLManager } from "./mo-gl-manager";
import { moTextureManager, moTexture } from "./mo-texture-manager";
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

  m_ConsoleState : moConsoleState;
  m_EffectManager: moEffectManager;

  constructor() {
    super();
    this.m_ConsoleState = new moConsoleState();
    this.m_EffectManager = new moEffectManager();
    this.SetName("__console__");
    this.SetLabelName("__console__");
    this.SetType( moMoldeoObjectType.MO_OBJECT_CONSOLE );
  }

/**
 *
 */

  Init(options?: any): boolean {
    console.log("moConsole::Init > options: ", options);
    if ("pResourceManager" in options) {
      //do not create ResourceManager
      this.m_pResourceManager = options["pResourceManager"];
      // test if is ok
    } else {
      this.m_pResourceManager = new moResourceManager();
      this.m_pResourceManager.Init();
      //console.log("moConsole::Init > moResourceManager: ", this.m_pResourceManager);
    }

    if ("consoleconfig" in options) {
      //this.m_Config.Init();
      /*
      console.log("moConsole::Init > consoleconfig",
        typeof options["consoleconfig"],
        options["consoleconfig"].length,
        options["consoleconfig"]);
        */
      var cf_name = "";
      if ("constructor" in options["consoleconfig"]) {
        if (options["consoleconfig"].constructor.name == "File") {
          //console.log("moConsole::Init > File: ", options["consoleconfig"]);
          cf_name = options["consoleconfig"].name;
        }
      } else if (typeof options["consoleconfig"] == "string") {
        cf_name = options["consoleconfig"];
      }
      this.SetConfigName(cf_name);
      if ("consoleconfig_fulltext" in options ) {
        this.m_Config.LoadConfig( options["consoleconfig_fulltext"] );
      }

    }

    return super.Init();
  }

  Draw() : void {

  }

  Update() : void {

  }

  Interaction() : boolean {
    return true;
  }

  TestScreen() {
    if (this.m_pResourceManager==null || this.m_pResourceManager==undefined) {
      this.m_pResourceManager = new moResourceManager();
      this.m_pResourceManager.Init();
    }
    var RMan: moRenderManager = this.m_pResourceManager.MORenderMan;
    var GMan: moGUIManager = this.m_pResourceManager.MOGuiMan;
    var TMan: moTextureManager = this.m_pResourceManager.MOTextureMan;

    ///MATERIAL
    var Mat: moMaterial = new moMaterial();
    Mat.base.opacity = 1.0;
    Mat.base.transparent = false;
    Mat.base.color = new moColor(1.0, 1.0, 1.0);
    //Mat.id = TMan.GetTextureMOId( "default" );
    //Mat.base.map =
    //Mat.base.
    /*
      Mat.m_Map = pTMan->GetTexture(pTMan->GetTextureMOId( "default", false ));
      Mat.m_MapGLId = Mat.m_Map->GetGLId();
      Mat.m_Color = moColor( 1.0, 1.0, 1.0 );
      Mat.m_fTextWSegments = 13.0f;
      Mat.m_fTextHSegments = 13.0f;
      Mat.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
      Mat.m_vLight.Normalize();
      //Mat.m_PolygonMode = MO_POLYGONMODE_LINE;
      Mat.m_PolygonMode = MO_POLYGONMODE_FILL;
      Mat.m_fWireframeWidth = 0.0005f;

      ///GEOMETRY
    moSphereGeometry Sphere( 0.5, 13, 13 );

    ///MESH MODEL (aka SCENE NODE)
    moGLMatrixf Model;
    Model.MakeIdentity()
         .Rotate(   360.0*progress*moMathf::DEG_TO_RAD, 0.0, 1.0, 0.0 )
         .Translate(    0.0, 0.0, -2.618 + 0.618*progress );
    moMesh Mesh( Sphere, Mat );
    Mesh.SetModelMatrix(Model);

    ///CAMERA PERSPECTIVE
    moCamera3D Camera3D;
    pGLMan->SetDefaultPerspectiveView( p_display_info.Resolution().Width(), p_display_info.Resolution().Height() );
    //  Camera3D.MakePerspective(60.0f, p_display_info.Proportion(), 0.01f, 1000.0f );
    Camera3D = pGLMan->GetProjectionMatrix();

    ///RENDERING
    pRMan->Render( &Mesh, &Camera3D );
      */
  }


};
