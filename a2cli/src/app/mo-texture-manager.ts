import * as THREE from 'three';
import TextureLoader = THREE.TextureLoader;

import { MOint, MOuint } from "./mo-types";
import { moText } from "./mo-text";
import { moResource } from "./mo-resource";
import { moTexture, moTextureArray } from "./mo-texture";
export { moTexture } from "./mo-texture";
import { moDataManager } from "./mo-data-manager";

export class moTextureBuffer extends moTexture {

}
export type moTextureBuffers = moTextureBuffer[];

export class moTextureManager extends moResource {

  m_textures_array: moTextureArray = [];
  m_textures_array_map: any = {};
  m_textures_buffers : moTextureBuffers = [];

  private m_TextureLoader: TextureLoader;

  default_id: MOint = -1;
  DefaultTexture: moTexture;
  moldeotrans_id: MOint = -1;
  MoldeotransTexture: moTexture;

  constructor() {
    super();
    this.SetName("_texturemanager_");
    this.m_TextureLoader = new TextureLoader();
  }

  Init(): boolean {
    this.default_id = this.AddTexture("default");
    this.DefaultTexture = this.GetTexture(this.default_id);
    this.DefaultTexture._texture = this.m_TextureLoader.load("data/icons/moldeologo.png");

    this.moldeotrans_id = this.AddTexture("moldeotrans");
    this.MoldeotransTexture = this.GetTexture(this.moldeotrans_id);
    this.MoldeotransTexture._texture = this.m_TextureLoader.load("data/icons/moldeotrans2.png");

    return super.Init();
  }

  GetTypeForFile(p_filename: moText): MOuint {
    return -1;
  }

  CreateTexture( p_type: MOuint, p_name: moText): moTexture {
    var Tex: moTexture = new moTexture();
    Tex.m_name = p_name;
    return Tex;
    //return null;
  }

  AddTexture( p_filename : moText ) : MOint {

    var name : moText = p_filename;
    var type : MOuint = this.GetTypeForFile(name);

    var DMan: moDataManager = this.m_pResourceManager.MODataMan;
    //moMovie* ptex_mov;

    var ptex : moTexture = this.CreateTexture(type, name);
    var fullfilename = DMan.NameToPath( p_filename );

    this.m_textures_array.push(ptex);
    ptex.SetMOId(this.m_textures_array.length - 1);
    this.m_textures_array_map["" + name] = ptex.GetMOId();
    return this.m_textures_array_map["" + name];

    //TexFileName : moFile = new moFile( p_filename );
    //p_filename = TexFileName.GetAbsolutePath();
/*
    if (ptex != NULL)
    {
      MOboolean res = false;
      if (type == MO_TYPE_TEXTURE) {

        res = ptex->BuildFromFile(p_filename);

      } else if (type == MO_TYPE_MOVIE)	{

        ptex_mov = (moMovie*)ptex;
        res = ptex_mov->LoadMovieFile(p_filename);

      }


      if (res) {

        m_textures_array.Add(ptex);
        ptex->SetMOId(m_textures_array.Count() - 1);
        return ptex->GetMOId();

      }	else {
        MODebug2->Error("moTextureManager::AddTexture > filename: " + p_filename + " failed BuildFromFile()/LoadMovieFile()");
        DeleteTexture(ptex->GetMOId());
        return -1;
      }
    }
*/
    //return -1;
  }

  GetTextureMOId( p_name: moText, p_create_tex?: boolean, p_refresh?: boolean ): MOint {
    if (p_create_tex == undefined) p_create_tex = true;
    if (p_refresh == undefined) p_refresh = false;

    if (this.m_textures_array_map[""+p_name] != undefined) {
      return this.m_textures_array_map[""+p_name];
    } else {
      if (p_create_tex)
        return this.AddTexture(p_name);
    }

    return -1;
  }

  GetTexture(p_id: MOint): moTexture {
    if (p_id>-1) {
      return this.m_textures_array[p_id];
    } else {
      return null;
    }
  }




}
