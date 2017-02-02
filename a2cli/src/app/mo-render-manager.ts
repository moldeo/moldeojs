import { moResource } from "./mo-resource";
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;
import { moCamera3D, moObject3D } from "./mo-gui-manager";

export enum moRenderManagerMode {
  RENDERMANAGER_MODE_NORMAL=0,
  RENDERMANAGER_MODE_FRAMEBUFFER=1,
  RENDERMANAGER_MODE_VDPAU=2
}

export class moRenderManager extends moResource {

  m_Renderer: THREE.WebGLRenderer;

  constructor() {
    super();
    this.m_Renderer = new THREE.WebGLRenderer({ alpha: true});
    this.m_Renderer.setSize( 500, 500);
    this.m_Renderer.setClearColor( 0xFF000000, 1 );
    //console.log("moRenderManager::constructor",  this.renderer);
  }

  Render( p_pObj : moObject3D, p_pCamera : moCamera3D  ) : void {

  }

}
