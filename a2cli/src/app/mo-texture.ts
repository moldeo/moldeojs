import * as THREE from 'three';
import Texture = THREE.Texture;
import TextureLoader = THREE.TextureLoader;

import {
  MOint, MOuint, MOfloat, MOdouble,
  moTexParam, MOUndefinedTex
} from "./mo-types";
import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import { moFileManager } from "./mo-file-manager";
import { moDataManager } from "./mo-data-manager";
import { moGLManager } from "./mo-gl-manager";
import { moResourceManager } from "./mo-resource-manager";

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
    console.log("moTexture.BuildFromFile>", p_fullfilename);
    this._texture = p_textureloader.load("" + p_fullfilename );
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

}

export type moTextureArray = moTexture[];
