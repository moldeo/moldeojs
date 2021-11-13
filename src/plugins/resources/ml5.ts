import * as MO from "moldeojs";
import * as ml5 from "ml5";
import * as p5 from 'p5';

export enum moClassifierType {
	MO_UNDEFINED = -1, /// Objeto indefinido
	MO_MOBILENET = 0, /// MobileNet
	MO_POSENET = 1,/// PoseNet
	MO_DARKNET = 2,/// DarkNet
	MO_DOODLENET = 3,/// DoodleNet
	MO_BODYPIX = 4 /// bodypix = ml5.bodyPix(options);
};

export const moClassifierTypeToStr = [
	"MobileNet",
	"PoseNet",
	"DarkNet",
	"DoodleNet",
	"BodyPix"
];

export class moResourceMl5 extends MO.moResource {

	RM: MO.moRenderManager;
	GL: MO.moGLManager;
	TM: MO.moTextureManager;
	VM: MO.moVideoManager;

	//INTERNALS
	image_classifier: any = undefined;
	image_segmentation : any = undefined;
	image_bodypix : any = undefined;

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

	//BODYPIX background mask to texture
	canvas_bodypix : any = undefined;
	cv_bodypix_id : any = undefined;
	cv_context : any = undefined;
	m_BodyPixBackTexture : any = undefined;

	p5 : any = undefined;
	ml5 : any = undefined;
	p5image : any = undefined;

	constructor() {
		super();
		this.SetName("ml5");

		this.ml5 = ml5;
		this.p5 = p5;

		//console.log(p5);

		//cnv = p5.createCanvas(1062, 600);
		this.canvas_bodypix = document.createElement("CANVAS");

		//TODO: index for each capture device: this.cv_id = "moCanvasBodyPix_"+IntToStr(this.m_CaptureDevice.m_Index)+"_";
		this.cv_bodypix_id = "moCanvasBodyPix_"+"XX"+"_";
    this.canvas_bodypix.setAttribute("id", this.cv_bodypix_id);

    //this.canvas_bodypix.setAttribute("style", "display:none;");
		this.canvas_bodypix.setAttribute("style", "display: none; position: absolute; zindex: 20000; border: solid 4px #F000;");
    document.body.appendChild(this.canvas_bodypix);
	}

	BodyPixReady() : void {
		//console.log("BodyPixReady called:", this.image_bodypix);
		this.modelReady = true;
		if ( this.video && this.video_ready && this.image_bodypix ) {
			this.image_classifier = this.image_bodypix.segment( this.video, ( error, result ) => { this.gotBodyPixResults( error, result ) } );
			//console.log( "this.image_classifier: ", this.image_classifier );
		}
	}

	BodyPixStop() : void {
		//console.log("BodyPixStop called:", this.image_bodypix);
		delete this.image_bodypix;
	}

	gotBodyPixResults( error : any, result : any ) : void {

		if (error) {
	    //console.log("gotBodyPixResults:",error);
	    return;
	  }
		//console.log("gotBodyPixResults",result);
	  this.image_segmentation = result;
		//p5 image(segmentation.backgroundMask, 0, 0, width, height);
		//this.cv_context.drawImage( this.image_segmentation.backgroundMask, 0, 0, this.canvas_bodypix.width, this.canvas_bodypix.height);
		if (this.p5image==undefined) {
				//console.log(this.image_segmentation,this.canvas_bodypix);
				this.canvas_bodypix.width = this.image_segmentation.segmentation.width;
				this.canvas_bodypix.height = this.image_segmentation.segmentation.height;

				//console.log("Creating p5.Image",this.canvas_bodypix.width, this.canvas_bodypix.height)
				this.p5image = new this.p5.Image(this.canvas_bodypix.width, this.canvas_bodypix.height);

				//var tid : any = this.TM.AddTexture("BODYPIX0",this.canvas_bodypix.width, this.canvas_bodypix.height);
		    //this.m_BodyPixBackTexture = this.TM.GetTexture( tid );
				this.m_BodyPixBackTexture.SetWidth(this.canvas_bodypix.width);
				this.m_BodyPixBackTexture.SetHeight(this.canvas_bodypix.height);
				if (this.m_BodyPixBackTexture._texture) {
						this.m_BodyPixBackTexture._texture.needsUpdate = true;
				}
				//this.m_BodyPixBackTexture._texture.needsUpdate = true;
				//Uint8ClampedArray to canvas
				//var arr = new Uint8ClampedArray([0,0,0,0]);
		}
		if (this.p5image) {
			var idata : any = new ImageData( this.image_segmentation.backgroundMask, this.image_segmentation.segmentation.width, this.image_segmentation.segmentation.height );
			this.cv_context.putImageData(idata,0,0);
			if (this.m_BodyPixBackTexture) {
				if (this.m_BodyPixBackTexture._texture) {
						this.m_BodyPixBackTexture._texture.minFilter = this.THREE.LinearFilter
						this.m_BodyPixBackTexture._texture.needsUpdate = true;
				}
			}
		}

		//this.p5.image( this.image_segmentation.backgroundMask, 0, 0, this.canvas_bodypix.width, this.canvas_bodypix.height);
    /*if (this.m_Texture._texture) {
			this.m_BodyPixBackTexture._video = this.video;
      this.m_BodyPixBackTexture._texture.needsUpdate = true;//Important for update
    }*/
		//console.log(this.image_segmentation,this.image_bodypix);
		if (this.image_bodypix) {
			this.image_classifier = this.image_bodypix.segment( this.video, ( error, result ) => { this.gotBodyPixResults( error, result ) } );
		}

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

		/*this.canvas_bodypix = document.getElementById(this.cv_bodypix_id);
		if (this.canvas_bodypix) {
			this.cv_context = this.canvas_bodypix.getContext('2d');
		}*/

    if (super.Init((res) => {

			this.cv_context = this.canvas_bodypix.getContext('2d');
			var tid : any = this.TM.AddTexture("BODYPIX0",this.canvas_bodypix.width, this.canvas_bodypix.height);
			this.m_BodyPixBackTexture = this.TM.GetTexture( tid );
			this.m_BodyPixBackTexture._texture = new this.THREE.CanvasTexture(this.cv_context.canvas);

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

	InitClassifier() : void {
		switch(this.classifier_type) {

				case moClassifierType.MO_BODYPIX:
					{
						//console.log("Resource ml5.js: ml5 Classifier Selected: MO_BODYPIX", this.classifier_type )
						var options : any = {
							outputStride: 32, // 8, 16, or 32, default is 16
							segmentationThreshold: 0.15, // 0 - 1, defaults to 0.5
						};
						var classifier_options : any = this.m_Config.Text("classifier_options");
						var segmentationThreshold : any = this.m_Config.Eval("segmentationThreshold");
						var outputStride : any = this.m_Config.Eval("outputStride");
						options.segmentationThreshold = segmentationThreshold;
							options.outputStride = outputStride;
						//console.log("classifier_options:",classifier_options);
						if (classifier_options) {
							//console.log("classifier_options ok:",classifier_options);
							//eval( ' options = ' + cfopt );
							//console.log("options:",options);
						}
						if ( (this.image_bodypix==undefined || !this.image_bodypix) && this.video && this.video_ready ) {
								//console.log("Resource ml5.js: Calling ml5.bodyPix(options)", options )
								this.image_bodypix = ml5.bodyPix( this.video, options, () => { this.BodyPixReady() } );
								//console.log("Resource ml5.js: this.image_bodypix:", this.image_bodypix )
						}
					}
					break;

				case moClassifierType.MO_MOBILENET:
				case moClassifierType.MO_DARKNET:
				case moClassifierType.MO_DOODLENET:
					{
						var options : any = undefined;

						if (this.classifier_type==moClassifierType.MO_DARKNET)
							options = {
								version: "darknet-tiny",
								//version: "darknet-reference",
							};

						if (this.video && this.video_ready) {
							if (this.model) {
								this.mobilenet = ml5.featureExtractor( this.classifier_type_str, res => {
									let mjson = "./assets/molrepos/haro/sonidovisto/"+this.model+".json";
									//console.log("load from : ", mjson);
									/*alert("load from : " + mjson)*/
									this.image_classifier.load( mjson, rr => {
										//console.log("loaded mjson:" + mjson);
										/*alert("loaded")*/
										this.modelReady = true;
									});
								} );
								this.image_classifier = this.mobilenet.classification( this.video, res => {
										//console.log("v ready",this.image_classifier);
										/*alert("v ready:");*/
										/*alert(this.image_classifier.video);*/
								})

							} else {
								this.image_classifier = ml5.imageClassifier( this.classifier_type_str, res => {

									//console.log( "moResourceMl5::onModelReady " + this.classifier_type_str );
									/*alert( "moResourceMl5::onModelReady " + this.classifier_type_str )*/
									this.modelReady = true;
									//this.Classify();
									// Step 2: select an image
									//const img = document.querySelector("#myImage");
								});
								//console.log( "moResourceMl5::Classifier MobileNet created" );
								/*alert("moResourceMl5::Classifier MobileNet created")*/
							}
						}
					}
					break;

				case moClassifierType.MO_POSENET:
					{
						//wait for video?? or try to open with a default imagen
						var video : any = undefined;
						this.image_classifier = ml5.poseNet( video, (err, results) => {
							if (err) console.error(err);
							//if (results) console.log(results);
						});
						//console.log( "moResourceMl5::Classifier MobileNet created" );
					}
					break;

				default:
					break;
		};
	}

	UpdateClassifier() : void {
		if (this.image_classifier == undefined) {
			return this.InitClassifier();
		}

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

		if (this.modelReady==undefined) return;

		switch(this.classifier_type) {
			case moClassifierType.MO_BODYPIX:
				{
					if (this.modelReady && this.image_bodypix && this.image_segmentation ) {
						//console.log("bodypix",this.image_segmentation)
						if (this.image_segmentation) {
					    //image(this.image_segmentation.backgroundMask, 0, 0, width, height);
					  }
					}

				}
				break;
			case moClassifierType.MO_MOBILENET:
			case moClassifierType.MO_DARKNET:
			case moClassifierType.MO_POSENET:
			case moClassifierType.MO_DOODLENET:
				{
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
								this.results = results;
								/*if (this.texture_buffer)
									if (this.texture_buffer.MetaData[""+this.GetLabelName()])
										this.texture_buffer.MetaData[""+this.GetLabelName()]["images_predicted"]+= 1
								*/
								if (err) {
									alert(err)
								}
								if (this.results) {
									//console.log("results");
									//alert(this.results)
									if (this.results[0].confidence>0.9) {
										//console.log(this.results[0].label);
										var resultados : any = this.results[0].label+" " + Math.floor(this.results[0].confidence*100)+"%";
										if (this.results[1]) {
											resultados+= "\n" + this.results[1].label+" " + Math.floor(this.results[1].confidence*100)+"%";
										}
										if (this.results[2]) {
											resultados+= "\n" + this.results[2].label+" " + Math.floor(this.results[2].confidence*100)+"%";
										}
										/*alert(resultados)*/
										/*alert(this.results[0].label+" confidence: " + this.results[0].confidence)*/
										/*
										if (this.results[0].label=="studio") {
											//load studio
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[1];
										}
										if (this.results[0].label=="vision") {
											//load vision
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[2];
										}
										if (this.results[0].label=="texto") {
											//load vision
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[3];
										}
										if (this.results[0].label=="ventana") {
											//load vision
											window["MoldeoApp"].sample = window["MoldeoApp"].samples[4];
										}
										*/
									}
								}
							});
					}
				}
				break;

			default:
				//console.log("Invalid classifier type, check ml5.ts classifiers");
				break;
		};	//end switch
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

		this.UpdateClassifier();

  }

  GetDefinition(): MO.moConfigDefinition {
    super.GetDefinition();
    return this.m_Config.GetConfigDefinition();
  }

}
