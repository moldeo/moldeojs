import { moText } from "./mo-text";
import { moAbstract } from "./mo-abstract";
import {
  MOfloat, MOdouble,
  MOint, MOuint, MOlong, MOulong
} from "./mo-types";
import { moResource, moResourceElement, moAttribute, moAttributeArray } from "./mo-resource";
import {
  moVector, moVector2f, moVector3f, moVector4f,
  moVector2fArray, moVector3fArray, moVector4fArray,
  moVector3iArray, moMatrix3fArray,
  moVector2i, moVector3i, moVector4i,
  moMatrix, moMatrix3f, moMatrix4f,
  moMathManager
} from "./mo-math-manager";
import { moGLMatrixf } from "./mo-gl-manager";
import * as THREE from 'three';
import MaterialBase = THREE.Material;
import MeshStandardMaterial = THREE.MeshStandardMaterial;
//export type moCamera3DBase = THREE.Camera;
import { moSceneNode, moSceneNodeArray  } from "./mo-3d-model-manager";

export type moPointf = moVector3f;
export type moPointd = moVector3f;
export type moPoint = moPointf;
export type moVertex3f = moVector3f;
export type moVertex = moVector3f;
export type moTCoord = moVector2f;

export type moPosition = moVertex;
export type moFace = moVector3i;
export type moFace3 = moMatrix3f;

export type moColorRGB = moVertex3f;
export type moColorRGBA = moVector4f;
//export type moColorx = THREE.Color;
export class moColor extends THREE.Color { };

export type moCameraMatrix = moGLMatrixf;
export type moCamera3DBase = moGLMatrixf;

export type moPointArray = moVector3fArray;
export type moColorArray = moVector3fArray;
export type moColor4fArray = moVector3fArray;
export type moColorRGBAArray = moVector3fArray;
export type moTCoordArray = moVector2fArray;
export type moVertexArray = moVector3fArray;
export type moFaceArray = moVector3iArray;
export type moFace3Array = moMatrix3fArray;
/*
typedef moVector3fArray moColorArray;
typedef moVector3fArray moColorRGBArray;
typedef moVector4fArray moColor4fArray;
typedef moVector4fArray moColorRGBAArray;
typedef moVector2fArray moTCoordArray;
typedef moVector3fArray moVertexArray;
typedef moVector3iArray moFaceArray;
typedef moMatrix3fArray moFace3Array;
*/

export class moCamera3D extends THREE.Camera {
/*
    m_Position : moPosition;
    m_Center: moPosition;
*/
  
};

export enum moGeometryType {
  MO_GEOMETRY_UNDEFINED=-1,
  MO_GEOMETRY_POINT=0,
  MO_GEOMETRY_BOX=1,
  MO_GEOMETRY_CIRCLE=2,
  MO_GEOMETRY_CYLINDER=3,
  MO_GEOMETRY_SHAPE=4,
  MO_GEOMETRY_PLANE=5,
  MO_GEOMETRY_EXTRUDE=6,
  MO_GEOMETRY_RING=7,
  MO_GEOMETRY_SPHERE=8,
  MO_GEOMETRY_POLYHEDRON=9,
  MO_GEOMETRY_ICOSAHEDRON=10,
  MO_GEOMETRY_DODECAHEDRON=11,
  MO_GEOMETRY_TETRAHEDRON=13,
  MO_GEOMETRY_TEXT=14,
  MO_GEOMETRY_TUBE=15,
  MO_GEOMETRY_MAX=16
};

//export class moGeometry extends moResourceElement {
export class moGeometry extends THREE.Geometry {
/*
  geometry: THREE.Geometry;

  n_Name : moText;
  m_Type : moGeometryType;

  m_Vertices : moPointArray;
  m_VerticesUvs : moTCoordArray;
  m_Normals : moVertexArray;
  m_Colors : moColorArray;

  m_VerticesBuffer : MOfloat[];
  m_NormalsBuffer : MOfloat[];
  m_VerticesUVBuffer : MOfloat[];
  m_ColorBuffer : MOfloat[];

  m_Faces : moFaceArray;//array of triangles, 3 points referencing each an index of m_Vertices.
  m_FaceVertexUvs : moTCoordArray;//array of texture coordinates for each vertex, corresponding to each face from m_Faces
  m_Attributes : moAttributeArray;

  constructor() {
    super();
    this.geometry = new THREE.Geometry();
  }
  */
}


export class moPath extends moResourceElement {
}

export class moMaterialBase extends moResourceElement {
  //material_basic: MaterialBase;
  constructor() {
    super();
    //this.material = new MaterialBase();
  }
  Init(): boolean {
    return super.Init();
  }
}
/*
export class moMaterial extends moMaterialBase {
  material: MeshStandardMaterial;
  constructor() {
    super();
    this.material = new MeshStandardMaterial();
  }
  Init(): boolean {
    return super.Init();
  }
}
*/

export class moMaterial extends THREE.MeshStandardMaterial {
}

export class moMaterialBasic extends THREE.MeshBasicMaterial {
}

/**
 * mo3dModelManager
 *
 * Managing all 3d scene nodes
 */


//export class moObject3D extends moSceneNode {
export class moObject3D extends THREE.Object3D {
/*
  m_Geometry : moGeometry;
  m_Material : moMaterial;
  m_Position : moPosition;
  m_Scale : moVector3f;
  m_Rotation : moVector3f;

  constructor(p_geometry: moGeometry, p_material: moMaterial ) {
    super();
    this.m_Geometry = p_geometry;
    this.m_Material = p_material;
  }
*/
}

export class moBone extends THREE.Bone {
}

export class moSprite extends THREE.Sprite {
}

export class moLine extends THREE.Line {
}

export class moLineSegments extends THREE.LineSegments {
}

export class moPoints extends THREE.Points {
}

export class moLOD extends THREE.LOD {
}

export class moSkinnedMesh extends THREE.SkinnedMesh {
}

export class moSkeleton extends THREE.Skeleton {
}

export class moMesh extends THREE.Mesh {
  ResetMatrix() {
    this.matrix.identity();
    /*
    this.position.set( 0.0, 0.0, 0.0);
    this.scale.set( 1.0, 1.0, 1.0);
    this.rotation.set( 0.0 , 0.0, 0.0);
    this.updateMatrix();
    */
  }
  SetModelMatrix(matrix: moGLMatrixf) {
    this.ResetMatrix();
    this.applyMatrix( matrix );
  }
}

export class moGroup extends THREE.Group {
  ResetMatrix() {
    this.matrix.identity();
    /*
    this.position.set( 0.0, 0.0, 0.0);
    this.scale.set( 1.0, 1.0, 1.0);
    this.rotation.set( 0.0 , 0.0, 0.0);
    this.updateMatrix();
    */
  }
  SetModelMatrix(matrix: moGLMatrixf) {
    this.ResetMatrix();
    this.applyMatrix( matrix );
  }
}

export class moShape extends THREE.Shape {
}

export class moBoxGeometry extends THREE.BoxGeometry {
}

export class moCircleGeometry extends moGeometry {
}

export class moCylinderGeometry extends moGeometry {
}

export class moPolyhedronGeometry extends moGeometry {
}

export class moDodecahedronGeometry extends moGeometry {
}


export class moIcosahedronGeometry extends moGeometry {
}


export class moTetrahedronGeometry extends moGeometry {
}

export class moShapeGeometry extends moGeometry {
}

export class moPlaneGeometry extends THREE.PlaneGeometry {
  m_Width: MOint;
  m_Height: MOint;
  constructor( w: number, h: number, ws: number, hs: number ) {
    super(w, h, ws, hs);
    this.m_Width = w;
    this.m_Height = h;
  }
}
export class moExtrudeGeometry extends moGeometry {
}
export class moRingGeometry extends moGeometry {
}
export class moSphereGeometry extends THREE.SphereGeometry {
  //m_SphereGeometry: THREE.SphereGeometry;
  /*constructor( radius : MOfloat, width: MOint, height: MOint) {
    super();
    this.m_SphereGeometry = new THREE.SphereGeometry(radius,width,height);
  }*/
}
export class moTextGeometry extends moGeometry {
}
export class moTubeGeometry extends moGeometry {
}
export class moAxis3D extends moGeometry {
}
export class moBoundingBox3D extends moGeometry {
}

export class moGuiObject extends moAbstract {
}
export class moWidget extends moGuiObject {
}
export class moWindow extends moWidget {
}
export class mo3dWidget extends moWidget {
}


export class moGUIManager extends moResource {
  constructor() {
    super();
    this.SetName("_guimanager_");
  }
}
