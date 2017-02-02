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

  constructor() {
    super();
    this.m_TextureLoader = new TextureLoader();
  }

  Init(): boolean {
    return super.Init();
  }

  GetTypeForFile(p_filename: moText): MOuint {
    return -1;
  }

  CreateTexture( p_type: MOuint, p_name: moText): moTexture {

    return null;
  }

  AddTexture( p_filename : moText ) : MOint {

    var name : moText = p_filename;
    var type : MOuint = this.GetTypeForFile(name);

    var DMan: moDataManager = this.m_pResourceManager.MODataMan;
    //moMovie* ptex_mov;

    var ptex : moTexture = this.CreateTexture(type, name);
    var fullfilename = DMan.NameToPath( p_filename );

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
    return -1;
  }

  GetTextureMOId( p_name: moText, p_create_tex?: boolean, p_refresh?: boolean ): MOint {
    if (p_create_tex == undefined) p_create_tex = false;
    if (p_refresh == undefined) p_refresh = false;

    if (this.m_textures_array_map[""+p_name] != undefined) {
      return this.m_textures_array_map[""+p_name];
    } else {
      if (p_create_tex)
        return this.AddTexture(p_name);
    }

    return -1;
  }

  GetTexture( p_id: MOint ) : moTexture {
    return this.m_textures_array[p_id];
  }




}
