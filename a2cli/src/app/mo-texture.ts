import { MOint, MOuint } from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import * as THREE from 'three';
import Texture = THREE.Texture;

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
/**
    MOboolean       m_bBuildedFromFile;

    moFile*			m_pFile;
    moDataManager*	m_pDataMan;
    moFileManager*	m_pFileMan;
    moGLManager* m_gl;
    moResourceManager*	m_pResourceManager;

    moFBO* m_fbo;
    MOuint m_fbo_attach_point;

    moTextureType m_type;
    MOint m_moid;
    MOuint m_glid;
    moText m_name;

		moTexParam m_param;
		MOuint m_width;
		MOuint m_height;
		MOuint m_bytespp;
		MOint m_components;
		MOfloat m_max_coord_s;
		MOfloat m_max_coord_t;

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

  BuildFromFile(p_fullfilename: moText): boolean {

    return false;
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

}

export type moTextureArray = moTexture[];
