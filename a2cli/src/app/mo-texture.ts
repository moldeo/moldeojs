import * as THREE from 'three';
import Texture = THREE.Texture;
import TextureLoader = THREE.TextureLoader;

import {
  MOint, MOuint, MOfloat, MOdouble,
  MOlong, MOulong, MObyte, MOubyte,
  moTexParam, MOUndefinedTex
} from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moFileManager, moFile, moFileType, moDirectory } from "./mo-file-manager";
import { moDataManager } from "./mo-data-manager";
import { moGLManager } from "./mo-gl-manager";
import { moResourceManager } from "./mo-resource-manager";
import { moVector3f } from "./mo-math-manager";

export enum moTextureType {
        MO_TYPE_TEXTURE, /// TEXTURA BASE
        MO_TYPE_TEXTURE_MULTIPLE, /// textura múltiple
        MO_TYPE_MOVIE,/// película
        MO_TYPE_VIDEOBUFFER,/// buffer de video
        MO_TYPE_TEXTUREMEMORY,/// textura en memoria
        MO_TYPE_TEXTUREBUFFER,/// buffer de texturas
        MO_TYPE_CIRCULARVIDEOBUFFER /// buffer circular de video
};

export class moTexture extends moAbstract {

  _texture: Texture;
  m_type : moTextureType;
  m_moid : MOint = -1;
  m_name : moText = "";

		m_param : moTexParam = MOUndefinedTex;
		m_width : MOuint = 0;
		m_height : MOuint = 0;
		m_bytespp : MOuint = 0;
		m_components : MOint = 0;
		m_max_coord_s : MOfloat = 0;
		m_max_coord_t : MOfloat = 0;

    m_bBuildedFromFile: boolean;

    m_pDataMan : moDataManager;
    m_pFileMan : moFileManager;
    m_gl : moGLManager;
    m_pResourceManager : moResourceManager;

/*
    moFile*			m_pFile;

    moFBO* m_fbo;
    MOuint m_fbo_attach_point;

		void SetParam();
		void CalculateSize(MOuint p_width, MOuint p_height);
		MOboolean Build();

		int Luminance;
		int Contrast;

		moDWord Histogram[256];
		MOubyte* m_pBufferData;
		MOuint m_buffer_width;
		MOuint m_buffer_height;
		MOuint m_buffer_bytespp;
*/
  constructor() { super(); }
  Init(): boolean { return super.Init(); }

  BuildFromFile( p_fullfilename: moText, p_textureloader: TextureLoader, p_callback?:any  ): boolean {
    console.log("moTexture.BuildFromFile >", p_fullfilename);
    this._texture = p_textureloader.load("" + p_fullfilename, (texture) => {
      this.m_width = texture.image.width;
      this.m_height = texture.image.height;
    } );
    if (this._texture) return true;
    return true;
  }

  SetMOId( p_moid : MOint ) {
    this.m_moid = p_moid;
  }

  GetMOId(): MOint {

    return this.m_moid;
  }

  GetType(): moTextureType {
    return this.m_type;
  }

  GetHeight(): number {
    return this.m_height;
  }

  GetWidth(): number {
    return this.m_width;
  }



};

export type moTextureArray = moTexture[];

export type moMemory = any;
export type moBitmapFormat = MOint;
export type moBitmap = any;
/// clase base para el manejo de una textura con su copia comprimida en memoria
/**
 *  Esta clase mantiene en memoria una copia comprimida de la imagen
 *  a medida que esta imagen es requerida se aumenta el numero de referencia
 *  cuando la cantidad de referencias llegan a cero se da de baja de la memoria de opengl
 *  @see moTexture
 *  @see moTextureBuffer
 *  @see moTextureManager
 *  @see moVideoManager
 */
export class moTextureMemory extends moTexture {
};

export type moTextureFrames = moTextureMemory[];

export class moTextureBuffer extends moTexture {

  pattern_width: MOint;
  pattern_height : MOint;

	m_ImagesProcessed : MOint = 0;
	m_bLoadCompleted : boolean = false;
  m_ActualImage : MOint = 0;


  m_FolderName : moText;
	m_BufferPath : moText;
	m_BufferFormat : moText;

  m_Frames : moTextureFrames;
  m_pDirectory: moDirectory;

  max_luminance : MOint;
  min_luminance : MOint;
  max_contrast : MOint;
  min_contrast : MOint;

  //size of max_luminance
  LevelDiagram: MObyte[] = [];

  constructor() {
    super();
  }

  Init(p_foldername?: moText, p_bufferformat?: moText, p_pResourceManager?: moResourceManager ) : boolean {
    this.m_pResourceManager = p_pResourceManager;

	  this.m_FolderName = p_foldername;
    this.m_BufferPath = "" + this.m_pResourceManager.GetDataMan().GetDataPath();
    this.m_BufferPath = this.m_BufferPath + "" + p_foldername;
	  this.m_BufferFormat = p_bufferformat;

    console.log("texturebuffer.Init", this.m_BufferPath, this);
	  this.m_pDirectory = this.m_pResourceManager.GetFileMan().GetDirectory( this.m_BufferPath );

	  if (this.m_pDirectory) {} else return false;

	  //BuildEmpty( width, height);

    /*
    moShaderManager* SM = m_pResourceManager->GetShaderMan();
    moTextureManager* TM = m_pResourceManager->GetTextureMan();

    m_pShaderCopy = SM->GetShader(SM->GetShaderIndex(moText("shaders/Copy.cfg"),true) );
    */
    this.m_Frames = [];
    this.m_ActualImage = 0;
    this.m_bLoadCompleted = false;

    this.max_luminance = 0;//100
    this.min_luminance = 100;//0

    this.max_contrast = 0;
    this.min_contrast = 0;
/*
    for( var L=0; L<100*100*3; L++) {
        this.LevelDiagram[L] = 0;
    }*/
	  return super.Init();
  }

  GetImagesProcessed(): number {
    return this.m_Frames.length;
  }

  GetFrame( index : number ) : moTextureMemory {
    return this.m_Frames[index];
  }

  GetTexture( index: number ) : moTextureMemory {
    return this.m_Frames[index];
  }

  LoadCompleted() {
    return this.m_bLoadCompleted;
  }

  LoadImage( path: moText): boolean {
    var idx = this.m_pResourceManager.GetTextureMan().GetTextureMOId(path, true);
    if (idx > -1) {
      this.m_Frames.push( this.m_pResourceManager.GetTextureMan().GetTexture(idx) );
      return true;
    }
    return false;
  }

  UpdateImages( maxfiles : MOint ) : boolean {

    var pFile: moFile;
    var counter : MOint = 0;

    if (this.m_pDirectory==undefined) return false;

    if (this.m_ActualImage>=this.m_pDirectory.GetFiles().length ) {
      this.m_bLoadCompleted = true;
      return true;
    }

    if (this.m_ActualImage==0)
      pFile = this.m_pDirectory.FindFirst();
    else
      pFile = this.m_pDirectory.Find(this.m_ActualImage);


    if (pFile) {
      //while (pFile) {
        if (this.LoadImage(pFile.GetCompletePath())) {
          this.m_ImagesProcessed++;
        }
        console.log("Image processed:", this.m_ImagesProcessed, pFile );
        /*if (pFile.GetType() == moFileType.MO_FILETYPE_LOCAL && pFile.Exists()) {
          */
          /*
          if (this.LoadImage( m_FolderName + moSlash + pFile.GetFileName(), pImage, this.m_ActualImage)) {
            this.m_ImagesProcessed++;
            if (this.m_ActualImage == (this.m_pDirectory.GetFiles().length - 2)) {
            }
          }
          */
          /*
          this.m_ActualImage++;
          counter++;
          if (counter == maxfiles && maxfiles != (-1)) {
            return true;
          }
        }
        */
      //}
      this.m_ActualImage++;
      pFile = this.m_pDirectory.FindNext();
      //pFile = null;
    }

/*
    if (pFile)
    do {
      if ( pFile.GetType()==moFileType.MO_FILETYPE_LOCAL && pFile.Exists()) {
*/
      //LOAD AND UNCOMPRESS IMAGE
      /*
      FREE_IMAGE_FORMAT fif;
      fif = FreeImage_GetFileType( pFile->GetCompletePath(), 0);

      if( fif == FIF_UNKNOWN ) {
        // try to guess the file format from the file extension
        fif = FreeImage_GetFIFFromFilename(pFile->GetCompletePath());
      }

      if( (fif != FIF_UNKNOWN) && FreeImage_FIFSupportsReading(fif) ) {
        //decodificamos el archivo
        FIBITMAP* pImage;
        pImage = FreeImage_Load( fif, pFile->GetCompletePath(), 0);

        //ONCE LOADED SAVE ON EVERY VIDEOBUFFER
        if (pImage) {

                    //MODebug2->Push( moText("moTextureBuffer::UpdateImages > Trying to load image:") +  (moText)pFile->GetCompletePath() );
                    if ( LoadImage( m_FolderName + moSlash + pFile->GetFileName() , pImage, m_ActualImage ) ) {
                        m_ImagesProcessed++;
                        if ( m_ActualImage == (m_pDirectory->GetFiles().Count()-2) ) {
                            MODebug2->Log( moText(" ####TEXTUREBUFFER LEVEL HISTOGRAM####"));
                            var barra;
                            var nivel;
                            barra = _moText("###################################################################################");

                            for(int k=0; k<100; k++) {
                                nivel = barra;
                                nivel.Left( m_pBufferLevels[k][0].Count() );
                                MODebug2->Log( moText(" level:") + IntToStr(k) + (moText)nivel );
                            }
                        }
                    }
          FreeImage_Unload(pImage);
          pImage = NULL;

        }
  }*//*
    }

      this.m_ActualImage++;
      counter++;
      if (counter==maxfiles && maxfiles!=(-1))
        break;

    } while ( (pFile = this.m_pDirectory.FindNext()) );
*/
	  return true;
  }

};

export type moTextureBuffers = moTextureBuffer[];

export class moTextureAnimated extends moTexture {

};
