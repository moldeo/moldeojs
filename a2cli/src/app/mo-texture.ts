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

  constructor() { super(); }
  Init(): boolean { return super.Init(); }

  BuildFromFile(p_fullfilename: moText): boolean {

    return false;
  }
}

export type moTextureArray = moTexture[];
