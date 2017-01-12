
import { moAbstract } from "./mo-abstract";
import { moResource, moResourceElement } from "./mo-resource-manager";

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
}

export class moMaterial extends moMaterialBase {
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
