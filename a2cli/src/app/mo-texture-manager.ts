import * as THREE from 'three';
import TextureLoader = THREE.TextureLoader;

import {
  MOint, MOuint, MOlong, MOulong, MObyte, MOubyte,
  MOdouble, MOfloat,
  moTextFilterParam, moTexParam, MOUndefinedTex
} from "./mo-types";

import { moText } from "./mo-text";
import { moResource } from "./mo-resource";
import {
  moTexture, moTextureArray, moTextureType,
  moTextureMemory, moTextureFrames,
  moTextureBuffer, moTextureBuffers
} from "./mo-texture";
import { moDataManager } from "./mo-data-manager";
import { moFile, moFileManager, moDirectory } from "./mo-file-manager";
import { moEventList } from "./mo-event-list";
//export { moTexture, moTextureType, moTextureArray, moTextureMemory, moTextureFrames } from "./mo-texture";


export class moTextureManager extends moResource {

  m_textures_array: moTextureArray = [];
  m_textures_array_map: any = {};

  m_textures_buffers: moTextureBuffers = [];
  m_textures_buffers_map: any = {};

  m_TextureLoader: TextureLoader;

  default_id: MOint = -1;
  DefaultTexture: moTexture;

  default_flip_id: MOint = -1;
  DefaultTextureFlip: moTexture;

  moldeotrans_id: MOint = -1;
  MoldeotransTexture: moTexture;

  constructor() {
    super();
    this.SetName("_texturemanager_");
    this.m_TextureLoader = new TextureLoader();
  }

  Init(): boolean {
    this.default_id = this.AddTexture("default",512,512);
    this.DefaultTexture = this.GetTexture(this.default_id);
    this.DefaultTexture._texture = this.m_TextureLoader.load("data/icons/moldeologo.png");

    this.default_flip_id = this.AddTexture("defaultflip",512,512);
    this.DefaultTextureFlip = this.GetTexture(this.default_flip_id);
    this.DefaultTextureFlip._texture = this.m_TextureLoader.load("data/icons/moldeologo_flip.png");

    this.moldeotrans_id = this.AddTexture("moldeotrans",512,512);
    this.MoldeotransTexture = this.GetTexture(this.moldeotrans_id);
    this.MoldeotransTexture._texture = this.m_TextureLoader.load("data/icons/moldeotrans2.png");

    return super.Init();
  }

  GetTypeForFile(p_filename: moText): moTextureType {

    var FileName: moFile = new moFile(p_filename);
    var extension : string = FileName.GetExtension() + "";

    if (extension in [
      ".tga", ".jpg", ".png", ".bmp", ".tif", ".xpm"
    ]) {
      return moTextureType.MO_TYPE_TEXTURE;
    }

    if ( p_filename.indexOf("multiple") == 0) {
      return moTextureType.MO_TYPE_TEXTURE_MULTIPLE;
    }

    if (extension in [
      ".mkv", ".ogg", ".ogv", ".avi", ".mov", ".mpg",
      ".mpeg", ".mts", ".m2ts", ".vob", ".m2v", ".mp4",
      ".web", ".webm"
    ]) {
      return moTextureType.MO_TYPE_MOVIE;
    }

     return moTextureType.MO_TYPE_TEXTURE;
  }

  CreateTexture( p_type: MOuint, p_name: moText): moTexture {
    var Tex: moTexture = new moTexture();
    Tex.m_pResourceManager = this.m_pResourceManager;
    Tex.m_pFileMan = this.m_pResourceManager.GetFileMan();
    Tex.m_pDataMan = this.m_pResourceManager.GetDataMan();
    Tex.m_name = p_name;
    return Tex;
    //return null;
  }

  AddTexture(p_filename: moText, p_width: MOint = -1, p_height: MOint = -1, p_tex_param: moTexParam = MOUndefinedTex ) : MOint {
    //console.log("AddTexture", p_filename, p_width, p_height, p_tex_param );

    var DMan: moDataManager = this.m_pResourceManager.MODataMan;
    var name : moText = p_filename;
    var res : boolean = false;
    var type: moTextureType;
    var ptex : moTexture = this.CreateTexture(type, name);

    if (ptex != null) {
      res = true;
      if (p_width == -1) {
        var fullfilename = DMan.NameToPath(p_filename);
        type = this.GetTypeForFile(p_filename);
        //TexFileName : moFile = new moFile( p_filename );
        //p_filename = TexFileName.GetAbsolutePath();
        if (type == moTextureType.MO_TYPE_TEXTURE) {
          res = ptex.BuildFromFile( fullfilename, this.m_TextureLoader );
        } else if (type == moTextureType.MO_TYPE_MOVIE) {
          /* //TODO!
                  moMovie* ptex_mov;
                  ptex_mov = (moMovie*)ptex;
                  res = ptex_mov.LoadMovieFile(p_filename);
          */
        }
      }
    }

    if (res) {

      this.m_textures_array.push(ptex);
      ptex.SetMOId(this.m_textures_array.length - 1);
      this.m_textures_array_map["" + name] = ptex.GetMOId();
      //console.log("moTextureManager.Loaded > ", name, ptex );
      return ptex.GetMOId();

    }	else {
      this.MODebug2.Error("moTextureManager::AddTexture > filename: " + p_filename + " failed BuildFromFile()/LoadMovieFile()");
      //this.DeleteTexture(ptex.GetMOId());
      return -1;
    }

  }

  GetTextureMOId( p_name: moText, p_create_tex?: boolean, p_refresh?: boolean ): MOint {
    if (p_create_tex == undefined) p_create_tex = true;
    if (p_refresh == undefined) p_refresh = false;
    //console.log("GetTextureMOId", p_name, p_create_tex);
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

  AddTextureBuffer( p_foldername: string, p_bufferformat: moText ) : MOint {
    var ptexbuffer : moTextureBuffer = new moTextureBuffer();
    if (ptexbuffer) {
        if ( ptexbuffer.Init( p_foldername, p_bufferformat, this.m_pResourceManager ) ) {
            this.m_textures_buffers.push( ptexbuffer );
            console.log("tbuffer:", ptexbuffer );
            //MODebug2->Push( moText("TextureBuffer created:")
            // + (moText)p_foldername + moText(" idx:") +IntToStr((m_textures_buffers.Count() - 1)) );
            return (this.m_textures_buffers.length - 1);
        } else {
            //MODebug2->Error( moText("moTextureManager::AddTextureBuffer Error: Initializing texturebuffer: ")
            // + (moText)p_foldername );
        }

    } else {
        //MODebug2->Error( moText("moTextureManager::AddTextureBuffer Error: Creating texturebuffer: ")
        // + (moText)p_foldername );
    }
    return -1;
  }

  //GetTextureBuffer( p_foldername: MOint ): any;
  GetTextureBuffer( p_foldername: any, p_create_tex?: boolean, p_bufferformat?: moText): any {
    if (typeof p_foldername == "number") {
      return this.m_textures_buffers[""+p_foldername];
    } else if (typeof p_foldername == "string") {
      if (this.m_textures_buffers_map[""+p_foldername])
        return this.m_textures_buffers_map[""+p_foldername];
      var idx = -1;
      if (p_create_tex == true)
        idx = this.AddTextureBuffer(p_foldername, p_bufferformat);
      return idx;
    }
  }


  Update( Events : moEventList) : void
  {
    //console.log("update texturemanager", Events, this);
    if (Events==undefined) return;
    //if ( GetId() == MO_MOLDEOOBJECT_UNDEFINED_ID ) return;

    /// Texture buffer loading routine, 10 x ,,,,
    for(var k=0; k<this.m_textures_buffers.length; k++) {


      var pTextureBuffer : moTextureBuffer = this.m_textures_buffers[k];

      if (pTextureBuffer && !pTextureBuffer.LoadCompleted()) {

      //MODebug2->Push( pTextureBuffer->GetName() + moText(":") + IntToStr(pTextureBuffer->GetImagesProcessed() ));
        pTextureBuffer.UpdateImages( 1 );
      }
    }
  }


};//END TEXTUREMANAGER
