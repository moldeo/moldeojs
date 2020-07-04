/**

	Mobile plugin

	Mobile devicemotion events are memorized and analyzed.

	inlets:
		

	outlets:



*/


import * as MO from "moldeojs";

export class moMobile extends MO.moIODevice {

	RM: MO.moRenderManager;
	GL: MO.moGLManager;
	TM: MO.moTextureManager;
	VM: MO.moVideoManager;

	//INTERNALS
	image_classifier: any = undefined;
	modelReady : MO.MOboolean = false;
	img : any = undefined;
	img_texture : any = undefined;
	classifier_type_str : any = undefined;


	//PARAMETERS
	folders : any = undefined;
	texture : any = undefined;
	texture_buffer : any = undefined;
  classifier_type : any = undefined;

	constructor() {
		super();
		this.SetName("mobile");
	}

	Init(callback?:any): boolean {

    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
		this.TM = this.m_pResourceManager.GetTextureMan();
		this.VM = this.m_pResourceManager.GetVideoMan();

    console.log(`moIODevice${this.GetName()}.Init ${this.GetName()}`);

    if (super.Init((res) => {
			this.CreateConnectors();
			this.UpdateParameters();
			console.log(this);
      if (callback) callback(res);
    }) == false) {
      return false;
    }

    return true;
  }

	UpdateParameters() : void {
		/*
		this.classifier_type = this.m_Config.Int("classifier_type");
		this.folders = this.m_Config.Text("folders");
		this.texture = this.m_Config.Texture("texture");
		this.texture_buffer = this.m_Config.TextureBuffer("folders");
		if (this.texture_buffer) {
			if (this.texture_buffer.MetaData[""+this.GetLabelName()]==undefined) {
				this.texture_buffer.MetaData[""+this.GetLabelName()] = {
					"images_predicted": 0,
					"texture_buffer": this.texture_buffer
				}
			}
		}
		this.classifier_type_str = moClassifierTypeToStr[this.classifier_type];
		*/
	}

	Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);

		this.UpdateParameters();

		//send acceleration x,y,z and rotation o internal inlets..



  }

  GetDefinition(): MO.moConfigDefinition {
    super.GetDefinition();
    return this.m_Config.GetConfigDefinition();
  }

}
