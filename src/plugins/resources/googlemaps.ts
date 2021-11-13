import * as MO from "moldeojs";
//import * as ml5 from "ml5";
//import * as p5 from 'p5';

export enum moMapType {
	MO_UNDEFINED = -1, /// Objeto indefinido
	MO_GOOGLEMAP = 0, ///
	MO_ = 1,///
	MO_ = 2,///
	MO_ = 3,///
	MO_ = 4 ///
};

export class moResourceGoogleMapsApi extends MO.moResource {

	RM: MO.moRenderManager;
	GL: MO.moGLManager;
	TM: MO.moTextureManager;
	VM: MO.moVideoManager;

	loaderReady : MO.MOboolean = false;

	options : any = undefined;

	apikey : any = undefined;
	maptype : any = undefined;
	libraries : any = undefined;


	pitch : any = undefined;
	heading : any = undefined;
	zoom : any = undefined;


	Init(callback?:any): boolean {

		this.RM = this.m_pResourceManager.GetRenderMan();
		this.GL = this.m_pResourceManager.GetGLMan();
		this.TM = this.m_pResourceManager.GetTextureMan();
		this.VM = this.m_pResourceManager.GetVideoMan();

		//console.log(ml5);
		console.log(`moResource${this.GetName()}.Init ${this.GetName()}`);

		//this.sensor = new Accelerometer();
		//console.log(sensor);

		/*this.canvas_bodypix = document.getElementById(this.cv_bodypix_id);
		if (this.canvas_bodypix) {
			this.cv_context = this.canvas_bodypix.getContext('2d');
		}*/

		if (super.Init((res) => {

			/*this.cv_context = this.canvas_bodypix.getContext('2d');
			var tid : any = this.TM.AddTexture("BODYPIX0",this.canvas_bodypix.width, this.canvas_bodypix.height);
			this.m_BodyPixBackTexture = this.TM.GetTexture( tid );
			this.m_BodyPixBackTexture._texture = new this.THREE.CanvasTexture(this.cv_context.canvas);
*/
			this.CreateConnectors();
			this.UpdateParameters();

			//console.log(this);
			if (callback) callback(res);
		}) == false) {
			return false;
		}

		return true;
	}

	UpdateParameters() : void {
		this.map_type = this.m_Config.Int("map_type");
		this.libraries = this.m_Config.Text("libraries");
		this.pitch = this.m_Config.Eval("pitch");
		this.heading = this.m_Config.Eval("heading");
		this.zoom = this.m_Config.Eval("zoom");

		/*this.texture = this.m_Config.Texture("texture");
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

		this.model = this.m_Config.Text("load");
		*/
	}

	Update( p_Event: MO.moEventList ) : void {
		super.Update(p_Event);

		this.UpdateParameters();
	}

	GetDefinition(): MO.moConfigDefinition {
		super.GetDefinition();
		return this.m_Config.GetConfigDefinition();
	}

}
