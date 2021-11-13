import * as MO from "moldeojs";

export class moNetSocketIO extends MO.moIODevice {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  Mat: MO.moMaterialBasic;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;

  constructor() {
    super();
    this.SetName("netsocketio");
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    console.log(`mo${this.GetName()}.Init ${this.GetName()}`);
    if (this.Init((res) => {
      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moEffectIcon.Update");
  }

  GetDefinition(): MO.moConfigDefinition {
    //console.log("moNetSocketIo.GetDefinition");
    super.GetDefinition();

    return this.m_Config.GetConfigDefinition();
  }

}
