import * as THREE from "three";


import { MOuint, MOint, MOfloat, MOdouble } from "./mo-types";
import { moText } from "./mo-text";
import { moResource } from "./mo-resource";
import {
  moVector2f, moVector3f, moVector4f,
  moMatrix4f, moMatrix3f
} from "./mo-math-manager";
import {
  moDisplay, moResolution
} from "./mo-render-manager";

export class moGLMatrixf extends THREE.Matrix4 {

  MakeIdentity() : moGLMatrixf {
    this.identity();
    return this;
  }
  MakeZero(): moGLMatrixf {
    this.identity().multiplyScalar(0.0);
    return this;
  }
  MakePerspective(fovy: MOfloat, aspect: MOfloat, zNear: MOfloat, zFar: MOfloat): moGLMatrixf {
    /*var ymax : MOfloat;
    var xmax : MOfloat;
    ymax = znear * tanf ( 0.5 * fovy * DEG_TO_RAD );
    xmax = ymax * aspect;
    MakeFrustrum( -xmax, xmax, -ymax, ymax, znear, zfar );*/
    this.makePerspective( fovy, aspect, zNear, zFar );
    return this;
  }
  MakeLookAt(eyeX: MOfloat = 0.0, eyeY: MOfloat = 0.0, eyeZ: MOfloat = -10.0,
    centerX: MOfloat = 0.0, centerY: MOfloat = 0.0, centerZ: MOfloat = 0.0,
    upX: MOfloat = 0.0, upY: MOfloat = 1.0, upZ: MOfloat = 0.0): moGLMatrixf {
    var eye: moVector3f = new moVector3f(eyeX, eyeY, eyeZ);
    var center: moVector3f = new moVector3f( centerX, centerY, centerZ );
    var up: moVector3f = new moVector3f( upX, upY, upZ );
    this.lookAt( eye, center, up );
    return this;
  }
  MakeFrustrum(left: MOfloat = -1.0, right: MOfloat = 1.0,
    bottom: MOfloat = -1.0, top: MOfloat = 1.0,
    near: MOfloat = 0.0001, far: MOfloat = 1000.0): moGLMatrixf {
    this.makeFrustum( left, right, bottom, top, near, far );
    return this;
  }

  MakeOrthographic(left: MOfloat = -1.0, right: MOfloat = 1.0,
    bottom: MOfloat = -1.0, top: MOfloat = 1.0,
    near: MOfloat = 0.0001, far: MOfloat = 1000.0): moGLMatrixf {
    this.makeOrthographic( left, right, top, bottom, near, far);
    return this;
  }
  Translate(x: MOfloat, y: MOfloat, z: MOfloat): moGLMatrixf {
    var m: moGLMatrixf = new moGLMatrixf().MakeIdentity();
    m.makeTranslation(x, y, z);
    //this.multiply( m.transpose() );
    this.multiplyMatrices( m, this.transpose() );
    //this.makeTranslation(x, y, z);
    return this;
  }
  /*Translate( m: moGLMatrixf, x : MOfloat, y : MOfloat, z : MOfloat ): moGLMatrixf {
    return this;
  }*/
  Rotate(angle: MOfloat, vx: MOfloat, vy: MOfloat, vz: MOfloat): moGLMatrixf {
    var axis: moVector3f = new moVector3f(vx, vy, vz);
    var m: moGLMatrixf = new moGLMatrixf().MakeIdentity();
    m.makeRotationAxis(axis, angle);
    this.multiplyMatrices( m, this.transpose() );
    return this;
  }
  /*Rotate( m: moGLMatrixf, angle: MOfloat, rx : MOfloat, ry : MOfloat, rz : MOfloat ): moGLMatrixf {
    return this;
  }  */
  Scale(sx: MOfloat, sy: MOfloat, sz: MOfloat): moGLMatrixf {
    this.makeScale(sx, sy, sz);
    return this;
  }
  /*Scale( m: moGLMatrixf, sx : MOfloat, sy : MOfloat, sz : MOfloat ): moGLMatrixf {
    return this;
  }
  */
};

export type moGLMatrixfArray = moGLMatrixf[];

export class moGLViewport extends moVector2f {
  Proportion: MOfloat = 0.0;

  GetProportion(): MOfloat {
    return this.Proportion;
  }
  constructor( w : MOint, h : MOint ) {
    super();
    this.setX(w);
    this.setY(h);
    this.Proportion = 1.0;
    if (this.y>0.0) {
      this.Proportion = this.x/this.y;
    }
  }
}

export class moGLManager extends moResource {

  /*
  moGLContext m_Context;
  moDisplayServer m_DisplayServer;
  moDisplayScreen  m_DisplayScreen;
  moDisplayWindow  m_DisplayWindow;
  */
  m_gpu_vendor_code : MOuint;
  m_gpu_vendor_string : moText;
  m_gpu_renderer_string : moText;

  m_gl_version : moText;
  m_gl_major_version : MOint;
  m_gl_minor_version : MOint;

  m_current_fbo : MOuint;
  m_current_read_buffer : MOint;
  m_current_draw_buffer : MOint;
  m_previous_fbo : MOuint;
  m_previous_read_buffer : MOint;
  m_previous_draw_buffer : MOint;
  m_saved_fbo : MOuint;
  m_saved_read_buffer : MOint;
  m_saved_draw_buffer : MOint;

  m_Viewport : moGLViewport;
  m_ModelMatrix : moGLMatrixf;
  m_ProjectionMatrix : moGLMatrixf;
  m_StackModelMatrices : moGLMatrixfArray;
  m_StackProjectionMatrices : moGLMatrixfArray;

  m_bFrameBufferObjectActive : boolean;

  constructor() {
    super();
    this.SetName("_glmanager_");
    this.m_ProjectionMatrix = new moGLMatrixf().MakeIdentity();
    this.m_ModelMatrix = new moGLMatrixf().MakeIdentity();
  }

  SetPerspectiveView(p_width: MOint, p_height: MOint, fovy: MOdouble, aspect: MOdouble, znear: MOdouble, zfar: MOdouble): void {
    //glViewport(0, 0, p_width, p_height);
    this.m_Viewport = new moGLViewport(p_width, p_height);
    if (aspect == 0.0) {
      aspect = this.m_Viewport.GetProportion();
    }
    /*
    this.m_ProjectionMatrix.MakePerspective(fovy, aspect, znear, zfar);
    var Cam: THREE.Camera = new THREE.PerspectiveCamera(fovy, aspect, znear, zfar);
    */
    //check for errors
    //console.log("SetPerspectiveView: ",this.m_ProjectionMatrix, "THREE.PerspectiveCamera:",Cam.projectionMatrix);
  }

  SetDefaultPerspectiveView(p_width: MOint, p_height: MOint): void {
    //moDisplay(p_width, p_height).Proportion()
    this.SetPerspectiveView(p_width, p_height, 60.0,
      p_width / p_height,
      0.01, 1000.0 );

  }

  SetDefaultOrthographicView(p_width: MOint, p_height: MOint) {
    var Display: moDisplay = new moDisplay(p_width, p_height);
    this.SetOrthographicView(  p_width,
                        p_height,
                        -0.5,
                        0.5,
                        Display.HeightToProportion(-0.5),
                        Display.HeightToProportion(0.5)
                      );
   }

  SetOrthographicView(p_width: MOint = 0, p_height: MOint = 0,
    left: MOfloat = 0, right: MOfloat = 1,
    bottom: MOfloat = 0, top: MOfloat = 1,
    znear: MOfloat = -1.0, zfar: MOfloat = 1.0) {
    this.m_ProjectionMatrix.MakeIdentity();
    this.m_ProjectionMatrix.MakeOrthographic( left, right, bottom, top, znear, zfar );
  }

  GetProjectionMatrix() : moGLMatrixf {
    return this.m_ProjectionMatrix;
  }

  LookAt(eyeX: MOfloat = 0.0, eyeY: MOfloat = 0.0, eyeZ: MOfloat = -10.0,
    centerX: MOfloat = 0.0, centerY: MOfloat = 0.0, centerZ: MOfloat = 0.0,
    upX: MOfloat = 0.0, upY: MOfloat = 1.0, upZ: MOfloat = 0.0) {
    var Lat : moGLMatrixf = new moGLMatrixf();
    Lat.MakeIdentity();
    Lat.MakeLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
    var Lat2: moGLMatrixf;

    Lat = Lat.multiply(this.m_ProjectionMatrix) as moGLMatrixf;
    //this.m_ProjectionMatrix.copy( Lat );
    //this.m_ProjectionMatrix.transpose();
    //this.m_ProjectionMatrix.multiply(Lat.transpose());
    this.m_ProjectionMatrix.copy(Lat);

  }

}
