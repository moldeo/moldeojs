import * as MO from "moldeojs";
import * as ml5 from "ml5";

export enum moClassifierType {
	MO_UNDEFINED = -1, /// Objeto indefinido
	MO_MOBILENET = 0, /// MobileNet
	MO_POSENET = 1,/// PoseNet
	MO_DARKNET = 2,/// DarkNet
	MO_DOODLENET = 3/// DoodleNet
};

export const moClassifierTypeToStr = [
	"MobileNet",
	"PoseNet",
	"DarkNet",
	"DoodleNet"
];

export class moResourceMl5 extends MO.moResource {

	RM: MO.moRenderManager;
	GL: MO.moGLManager;
	TM: MO.moTextureManager;
	VM: MO.moVideoManager;

	//INTERNALS
	image_classifier: any = undefined;
	modelReady : MO.MOboolean = false;
	img : any = undefined;
	img_texture : any = undefined;
	video : any = undefined;
	video_ready : boolean = false;
	classifier_type_str : any = undefined;
	live : any = undefined;
	dataURL : any = undefined;

	model : any = undefined;
	modelloaded : any = false;

	results : any = undefined;
	mobilenet : any = undefined;


	//PARAMETERS
	folders : any = undefined;
	texture : any = undefined;
	texture_buffer : any = undefined;
  classifier_type : any = undefined;

	prediction : any = undefined;

	sensor : any = undefined;

	constructor() {
		super();
		this.SetName("ml5");
	}

	Init(callback?:any): boolean {

    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
		this.TM = this.m_pResourceManager.GetTextureMan();
		this.VM = this.m_pResourceManager.GetVideoMan();

		//console.log(ml5);
    console.log(`moResource${this.GetName()}.Init ${this.GetName()}`);

		//this.sensor = new Accelerometer();
		//console.log(sensor);

    if (super.Init((res) => {
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

		this.model = this.m_Config.Text("load");
	}

	Classify() : void {
		if (this.image_classifier) {
			this.image_classifier.classify( (err, results) => {
				if (err) {
					console.error(err);
				} else console.log(results);
				this.Classify();
			});
		}

	}

	Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);

		this.UpdateParameters();

		this.img = undefined;
		this.img_texture = undefined;
		var self : any = this;
		//console.log("Updating resource: do the resource update iteration here.");

		if (this.VM.m_LiveSystems.m_LiveSystemsPtr.length>0) {
			this.live = this.VM.m_LiveSystems.m_LiveSystemsPtr[0];
			this.video = this.live.video;
			this.video_ready = this.live.video_ready;
			//this.dataURL = this.RM.m_Renderer.domElement.toDataURL();
			//if (this.img==undefined) this.img = new Image();
			//this.img.src = this.dataURL;
			//this.img_texture = this.live.m_Texture;
		}

		if (this.image_classifier) {

				if (this.texture_buffer) {
					var nimgs : any = this.texture_buffer.GetImagesProcessed();
					//console.log(nimgs);
					if (nimgs) {
						var TBMeta : any = this.texture_buffer.MetaData[""+this.GetLabelName()];
						if (TBMeta) {
							var next_image : MO.MOint = TBMeta["images_predicted"];
							if (next_image<this.texture_buffer.GetImagesProcessed()) {
								this.img_texture = this.texture_buffer.GetTexture(next_image);
								if (this.img_texture) {
									if (this.img_texture._texture) {
										this.img = this.img_texture._texture.image;
									}
								}
							}
						}
					}
				}

				if (this.texture) {
					/*console.log("ml5.ts: using texture:",this.texture);
					if (this.texture._texture) {
						console.log("ml5.ts: got _texture:",this.texture._texture);
						if (this.texture._video) {
							console.log("ml5.ts: got _video:",this.texture._video);
						}
					}
					*/
				}
				if (this.modelReady) {
					if ((this.img && this.img_texture) || (this.video && this.video_ready)) {
						//if (this.TM.m_textures_buffer.length)
						//if (this.img_texture.MetaData[this.classifier_type_str]==undefined) {

							//this.img_texture.MetaData[this.classifier_type_str] = {};

							//console.log("moResourceMl5::Update > Classifier '"+this.classifier_type_str+"' predicting from image:", this.img_texture );

							//let prediction = this.image_classifier.classify( this.img, (err, results) => {
							let prediction = this.image_classifier.classify( (err, results) => {
								//console.log(results);
								//this.img_texture.MetaData[this.classifier_type_str] = results;
								//alert("this.image_classifier.classify callback");
								self.results = results;
								/*if (this.texture_buffer)
									if (this.texture_buffer.MetaData[""+this.GetLabelName()])
										this.texture_buffer.MetaData[""+this.GetLabelName()]["images_predicted"]+= 1
								*/
								if (err) {
									alert(err)
								}
								if (self.results) {
									//console.log("results");
									//alert(self.results)
									if (self.results[0].confidence>0.9) {
										console.log(self.results[0].label);
										var resultados : any = self.results[0].label+" " + Math.floor(self.results[0].confidence*100)+"%";
										if (self.results[1]) {
											resultados+= "\n" + self.results[1].label+" " + Math.floor(self.results[1].confidence*100)+"%";
										}
										if (self.results[2]) {
											resultados+= "\n" + self.results[2].label+" " + Math.floor(self.results[2].confidence*100)+"%";
										}
										/*alert(resultados)*/
										/*alert(self.results[0].label+" confidence: " + self.results[0].confidence)*/
										if (self.results[0].label=="studio") {
											//load studio
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[1];
										}
										if (self.results[0].label=="vision") {
											//load vision
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[2];
										}
										if (self.results[0].label=="texto") {
											//load vision
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[3];
										}
										if (self.results[0].label=="ventana") {
											//load vision
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[4];
										}
									}
								}
							});

						//}
					}
				}
		} else {
			switch(this.classifier_type) {

					case moClassifierType.MO_MOBILENET:
					case moClassifierType.MO_DARKNET:
					case moClassifierType.MO_DOODLENET:

						var options : any = undefined;

						if (this.classifier_type==moClassifierType.MO_DARKNET)
							options = {
								version: "darknet-tiny",
								//version: "darknet-reference",
							};

						if (this.video && this.video_ready) {
							if (this.model) {
								this.mobilenet = ml5.featureExtractor( this.classifier_type_str, res => {
									let mjson = "./assets/molrepos/haro/sonidovisto/"+self.model+".json";
									console.log("load from : ", mjson);
									/*alert("load from : " + mjson)*/
									self.image_classifier.load( mjson, rr => {
										console.log("loaded mjson:" + mjson);
										/*alert("loaded")*/
										self.modelReady = true;
									});
								} );
								this.image_classifier = this.mobilenet.classification( this.video, res => {
										console.log("v ready",this.image_classifier);
										/*alert("v ready:");*/
										/*alert(this.image_classifier.video);*/
								})

							} else {
								this.image_classifier = ml5.imageClassifier( this.classifier_type_str, res => {

									console.log( "moResourceMl5::onModelReady " + this.classifier_type_str );
									/*alert( "moResourceMl5::onModelReady " + this.classifier_type_str )*/
									self.modelReady = true;
									//self.Classify();
									// Step 2: select an image
									//const img = document.querySelector("#myImage");
								});
								console.log( "moResourceMl5::Classifier MobileNet created" );
								/*alert("moResourceMl5::Classifier MobileNet created")*/
							}
						}
						break;

					case moClassifierType.MO_POSENET:
						//wait for video?? or try to open with a default imagen
						var video : any = undefined;
						this.image_classifier = ml5.poseNet( video, (err, results) => {
							if (err) console.error(err);
							if (results) console.log(results);
						});
						console.log( "moResourceMl5::Classifier MobileNet created" );
						break;

					default:
						break;
			};

		}

		/*
		// PoseNet example:

		const video = document.getElementById('video');
		const posenet = ml5.poseNet( video, (err, results) => {

		});

		*/

		//

  }

  GetDefinition(): MO.moConfigDefinition {
    super.GetDefinition();
    return this.m_Config.GetConfigDefinition();
  }

}
