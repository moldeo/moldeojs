import { MOint, MOfloat, MOdouble, MOuint } from "./mo-types";
import { moAbstract } from "./mo-abstract";
import { moVector2, moVector2f, moVector3f } from "./mo-math-manager";
import { moResource } from "./mo-resource";
import * as THREE from 'three';
import WebGLRenderer = THREE.WebGLRenderer;
import { moSceneNode } from "./mo-3d-model-manager";
import { moCamera3D, moObject3D } from "./mo-gui-manager";
import { moGLManager } from "./mo-gl-manager";


export var three = THREE;
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
  m_RendererTarget : THREE.WebGLRenderTarget = null;
  m_RendererTarget2 : THREE.WebGLRenderTarget = null;
  m_FxTexture : THREE.Texture = null;

  m_TargetScene : THREE.Scene;
  m_TargetCamera : THREE.Camera = undefined;
  m_step : number = 0;

  m_TargetMaterial : THREE.MeshBasicMaterial;
  m_TargetGeometry : THREE.Geometry;
  m_TargetMesh : THREE.Mesh;
  m_TargetSceneMode : number = 0;

  last_screenshot : any = undefined;

  m_CaptureStream : any = undefined;

  GL : moGLManager;

  m_bUpdated : boolean = false;

  constructor() {
    super();
    this.SetName("_rendermanager_");

    this.m_Renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
    this.m_Renderer.setSize( window.innerWidth, window.innerHeight);
    //this.m_Renderer.setClearColor(0xFF000000, 1);
    this.m_Renderer.setClearColor(0x00000000, 0);
    this.m_Renderer.autoClear = false
    this.m_Renderer.domElement.style.position = "fixed";
    this.m_Renderer.domElement.style.top = "0px";
    this.m_Renderer.domElement.style.left = "0px";
    this.m_Renderer.domElement.style.display = "block";
    this.m_Renderer.domElement.style.background = "transparent";
    //console.log("moRenderManager::constructor",  this.renderer);
    this.m_bUpdated = true;
  }

  Init(callback?:any) : boolean {
    this.GL = this.m_pResourceManager.GetGLMan();

    this.TargetScene(window.innerWidth, window.innerHeight);

    return super.Init(callback);
  }

  Resize(w ?: number, h ?: number) : void {
    this.m_bUpdated = true;
    this.m_Renderer.setSize( w, h);
    //this.m_Renderer.setSize(w,h);
    this.TargetScene(w,h);
    this.m_Renderer.setViewport(0, 0, w, h);
  }

  TargetScene(w ?: number, h ?: number ) : void {
    if (w==undefined) w = window.innerWidth;
    if (w==0) w=1;
    if (h==undefined) h = window.innerHeight;
    this.m_RendererTarget2 = new THREE.WebGLRenderTarget( w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
    this.m_RendererTarget = new THREE.WebGLRenderTarget( w, h, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

    //console.log(this.m_RendererTarget,this.m_RendererTarget2);



    if (this.m_TargetSceneMode==0) {
      if (this.m_TargetCamera==undefined || this.m_bUpdated)
        this.m_TargetCamera = new moCamera3D();
      this.GL.SetDefaultOrthographicView( w, h );
      this.m_TargetCamera.projectionMatrix = this.GL.GetProjectionMatrix();
      //this.m_TargetCamera.position.z = 0;
    } else {
      if (this.m_TargetCamera==undefined || this.m_bUpdated)
        this.m_TargetCamera = new THREE.PerspectiveCamera( 70, w/h, 1, 1000 );
    }

    this.m_TargetScene = new THREE.Scene();
    //this.m_TargetScene.background = new THREE.Color("red");
    this.m_TargetScene.background = null;

    this.m_TargetMaterial = new THREE.MeshBasicMaterial({
      map: this.m_RendererTarget.texture
    });

    this.m_FxTexture = this.m_RendererTarget2.texture;

    if (this.m_TargetSceneMode==0) {
      this.m_TargetGeometry = new THREE.PlaneGeometry( 1.0, h/w, 1, 1 );
      this.m_TargetMesh = new THREE.Mesh(this.m_TargetGeometry,this.m_TargetMaterial);
      this.m_TargetMesh.position.z = -1;
    } else {
      this.m_TargetGeometry = new THREE.BoxGeometry( 1, 1, 1 );
      this.m_TargetMesh = new THREE.Mesh(this.m_TargetGeometry,this.m_TargetMaterial);
      this.m_TargetMesh.position.z = -2;
    }
    // Add it to the main scene
    this.m_TargetScene.add(this.m_TargetMesh);
  }

  UpdateTargetScene() : void {
    if (this.m_TargetSceneMode==0) {

    } else {
      this.m_TargetMesh.rotation.x = this.m_step;
      this.m_TargetMesh.rotation.y = this.m_step*1.5;
    }
  }

  RenderWidth() {
    var rend_size : moVector2 = new moVector2();
    return this.m_Renderer.getSize(rend_size).width;
  }

  RenderHeight() {
    var rend_size : moVector2 = new moVector2();
    return this.m_Renderer.getSize(rend_size).height;
  }

  ScreenWidth() : MOint {
    var ss : moVector2 = new moVector2();
    return this.m_Renderer.getSize(ss).width;
  }

  ScreenHeight() : MOint {
    var ss : moVector2 = new moVector2();
    return this.m_Renderer.getSize(ss).height;
  }

  ScreenProportion() : MOfloat {
    return this.ScreenWidth() / this.ScreenHeight();
  }

  Width() : MOint {
    return this.ScreenWidth();
  }

  Height() : MOint {
    return this.ScreenHeight();
  }

  Proportion() : MOfloat {
    return this.Width()/this.Height();
  }

  CopyRenderToTexture( ptex_num : number = 0 ) : void {
    //this.m_FxTexture = this.m_RendererTarget.texture.clone();
    //this.m_FxTexture.needsUpdate = true;
    //this.m_RendererTarget2 = this.m_RendererTarget.clone();
    this.m_Renderer.setRenderTarget( this.m_RendererTarget2 );
    this.m_Renderer.render( this.m_TargetScene, this.m_TargetCamera);
    this.m_Renderer.setRenderTarget( this.m_RendererTarget );
  }


  BeginDraw() : void {
    this.m_Renderer.setRenderTarget( this.m_RendererTarget );
    if (this.m_bUpdated) {
      //TODO: make background transparent
      //this.m_Renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.0);
      //this.m_Renderer.clear( true, true, false );
      this.m_Renderer.setClearColor(0x00000000, 0);
      this.m_Renderer.clear( true, true, false );
    }
  }

  BeginDrawEffect(): void {

  }

  Render( p_pObj : moSceneNode, p_pCamera : moCamera3D  ) : void {
    this.m_step+=0.005;
    //renderer.info.autoReset = false;
    //renderer.info.reset();
    this.m_Renderer.setRenderTarget( this.m_RendererTarget );
    this.m_Renderer.render( p_pObj, p_pCamera );
    //this.m_Renderer.setRenderTarget( null );
  }

  EndDraw() : void {

    this.UpdateTargetScene();
    //this.m_Renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 1.0);
    //this.m_Renderer.clear(true,true,false);
    this.m_Renderer.setRenderTarget( null );
    this.m_Renderer.render( this.m_TargetScene, this.m_TargetCamera);
    this.m_bUpdated = false;
  }

  EndDrawEffect(): void {
  }

  /*Screenshot( pathname : moText, screenshot_result : moText, image_format : moText, file_pattern : moText ) {*/
  Screenshot( delay : any = 0) {
    //console.log( pathname, screenshot_result, image_format, file_pattern);
    console.log( "Screenshot (deelay) ", delay );
    this.last_screenshot = this.m_Renderer.domElement.toDataURL();
    console.log( "Screenshot: ", this.last_screenshot );
    //var img = new Image();
    //w.document.body.appendChild(img);
  }

  StartScreenCapture( options : any, callback : any = null ) {
    /*function startCapture(displayMediaOptions) {
      let captureStream = null;

      return navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
          .catch(err => { console.error("Error:" + err); return null; });
    }*/
    let captureStream = null;
    // @ts-ignore
    captureStream = navigator.mediaDevices.getDisplayMedia(options)
        .then( cstream => {
          this.m_CaptureStream = cstream;
          console.log("captureStream ok:",cstream, this.m_CaptureStream.readyState);
          var mediaStreamTracks : any = this.m_CaptureStream.getTracks();
          var track : any;
          for( let idx in mediaStreamTracks) {
            track = mediaStreamTracks[idx];
            console.log("captureStream tracks:",track);

          }
          if (callback) {
            callback(cstream);
          }
        })
        .catch(err => {
          console.error("Error:" + err); return null;
        });

    return captureStream;
  }

  StopScreenCapture( options : any = undefined ) {
    var mediaStreamTracks = this.m_CaptureStream.getTracks();
    var track : any;
    for( let idx in mediaStreamTracks) {
      track = mediaStreamTracks[idx];
      console.log("Stopping track",track,track.enabled);
      track.stop();
    }
  }

  BeginUpdate() : void {
  }

  BeginUpdateDevice() : void
  {
    //Lock();
    //if (m_pGLManager)
    //      m_pGLManager->SaveGLState();
  }

  EndUpdateDevice() : void
  {
      //if (m_pGLManager)
      //    m_pGLManager->RestoreGLState();
      //Unlock();
  }

  EndUpdate() : void
  {
  }

  BeginUpdateObject() : void
  {
  //	Lock();
  //	m_pGLManager->SaveGLState();
  }

  EndUpdateObject() : void
  {
  //  m_pGLManager->RestoreGLState();
  //  Unlock();
  }


}
