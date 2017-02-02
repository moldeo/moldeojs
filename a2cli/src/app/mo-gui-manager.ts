
import { moAbstract } from "./mo-abstract";
import { moResource, moResourceElement } from "./mo-resource";
import {
  moVector, moVector2f, moVector3f, moVector4f,
  moVector2i, moVector3i, moVector4i,
  moMatrix, moMatrix3f, moMatrix4f,
  moMathManager
} from "./mo-math-manager";
import { moGLMatrixf } from "./mo-gl-manager";
import * as THREE from 'three';
import MaterialBase = THREE.Material;
import MeshStandardMaterial = THREE.MeshStandardMaterial;
//export type moCamera3DBase = THREE.Camera;

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

export class moCamera3D  {

    m_Position : moPosition;
    m_Center: moPosition;


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

export class moGeometry extends moResourceElement {
  /*
      moText        m_Name;
        moGeometryType m_Type;

        moPointArray m_Vertices;
        moTCoordArray m_VerticesUvs;
        moVertexArray m_Normals;
        moColorArray    m_Colors;

        MOfloat*       m_VerticesBuffer;
        MOfloat*       m_NormalsBuffer;
        MOfloat*       m_VerticesUVBuffer;
        MOfloat*       m_ColorBuffer;

        moFaceArray m_Faces;//array of triangles, 3 points referencing each an index of m_Vertices.
        moTCoordArray m_FaceVertexUvs;//array of texture coordinates for each vertex, corresponding to each face from m_Faces
        moAttributeArray m_Attributes;
        */
}


export class moPath extends moResourceElement {
}

export class moMaterialBase extends moResourceElement {
  base: MaterialBase;
  constructor() { super(); this.base = new MaterialBase(); }
  Init(): boolean {
    return super.Init();
  }
}

export class moMaterial extends moMaterialBase {
  base: MeshStandardMaterial;
  constructor() { super(); this.base = new MeshStandardMaterial(); }
  Init(): boolean {
    return super.Init();
  }
}

/**
 * mo3dModelManager
 *
 * Managing all 3d scene nodes
 */

export class moSceneNode extends moAbstract {
  /*
      void*   SceneNodeImplementation;

        moGLMatrixf  m_ProjectionMatrix;
        moGLMatrixf  m_ModelMatrix;

        moSceneNodePointerArray m_Childrens;
        moSceneNode* m_Parent;
        MOulong     m_Id;
        moText   m_Name;
  */
}

type moSceneNodeArray = moSceneNode[];

export class moObject3D extends moSceneNode {
}

export class moBone extends moObject3D {
}

export class moSprite extends moObject3D {
}

export class moLine extends moObject3D {
}

export class moLineSegments extends moObject3D {
}

export class moPoints extends moObject3D {
}

export class moLOD extends moObject3D {
}

export class moSkinnedMesh extends moObject3D {
}

export class moSkeleton extends moObject3D {
}

export class moMesh extends moObject3D {
}

export class moShape extends moObject3D {
}

export class moBoxGeometry extends moGeometry {
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

export class moPlaneGeometry extends moGeometry {
}
export class moExtrudeGeometry extends moGeometry {
}
export class moRingGeometry extends moGeometry {
}
export class moSphereGeometry extends moGeometry {
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
}
