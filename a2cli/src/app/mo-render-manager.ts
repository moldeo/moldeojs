import { MOint, MOfloat, MOdouble, MOuint } from "./mo-types";
import { moAbstract } from "./mo-abstract";
import { moVector2f, moVector3f } from "./mo-math-manager";
import { moResource } from "./mo-resource";
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;
import { moSceneNode } from "./mo-3d-model-manager";
import { moCamera3D, moObject3D } from "./mo-gui-manager";

export enum moRenderManagerMode {
  RENDERMANAGER_MODE_NORMAL=0,
  RENDERMANAGER_MODE_FRAMEBUFFER=1,
  RENDERMANAGER_MODE_VDPAU=2
};


export enum moRenderOutputMode {

    MO_RENDER_OUTPUT_MODE_NORMAL, ///rsolution ouput to display output
    MO_RENDER_OUTPUT_MODE_ADVANCED ///clip based.... each clip is a subsection of render resolution to a display resolution
};

export class moResolution {

  Width(): MOint {
    return this.width;
  }

  Height(): MOint {
    return this.height;
  }

  Aspect(): MOfloat {
    return this.aspect;
  }

  width : MOint = 1;
  height : MOint = 1;
  aspect : MOfloat = 1;

  constructor( w : any, h : any ) {
    this.width = w;
    this.height = h;
    this.aspect = w / h;
  }

};


export class moRenderClip {
  points : moVector2f[] = [];
};

export type moRenderClips = moRenderClip[];


export class moDisplay extends moAbstract {

  m_DisplayResolution : moResolution;

  constructor(w: any, h: any) {
    super();
    this.m_DisplayResolution = new moResolution(w,h);
  }

    Resolution() : moResolution {
      return this.m_DisplayResolution;
    }

    HeightToProportion( p_height : MOfloat ) : MOfloat {
      return p_height / this.Proportion();
    }

    Proportion() : MOfloat {
      return this.m_DisplayResolution.Aspect();
    }

};


export class moRenderManager extends moResource {

  m_Renderer: THREE.WebGLRenderer;

  constructor() {
    super();
    this.SetName("_rendermanager_");
    this.m_Renderer = new THREE.WebGLRenderer({ alpha: true});
    this.m_Renderer.setSize( 500, 500);
    this.m_Renderer.setClearColor(0xFF000000, 1);
    this.m_Renderer.autoClear = false;
    //console.log("moRenderManager::constructor",  this.renderer);
  }

  BeginDraw() : void {

  }

  BeginDrawEffect(): void {

  }

  Render( p_pObj : moSceneNode, p_pCamera : moCamera3D  ) : void {
    this.m_Renderer.render( p_pObj, p_pCamera );
  }

  EndDraw() : void {

  }

  EndDrawEffect(): void {

  }

}
