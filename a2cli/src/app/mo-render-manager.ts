import { moResource } from "./mo-resource";
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;

export enum moRenderManagerMode {
  RENDERMANAGER_MODE_NORMAL=0,
  RENDERMANAGER_MODE_FRAMEBUFFER=1,
  RENDERMANAGER_MODE_VDPAU=2
}

export class moRenderManager extends moResource {

  renderer: THREE.WebGLRenderer;

  constructor() {
    super();
    this.renderer = new THREE.WebGLRenderer({ alpha: true});
    this.renderer.setSize( 500, 500);
    this.renderer.setClearColor( 0xFF000000, 1 );
    console.log("moRenderManager::constructor",  this.renderer);
  }

}
