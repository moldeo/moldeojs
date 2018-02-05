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
import * as THREE from "three";



export class moSceneNode extends THREE.Scene {
  /*
  SceneNodeImplementation : any;

  m_ProjectionMatrix : moGLMatrixf;
  m_ModelMatrix : moGLMatrixf;

  m_Childrens : moSceneNodeArray = [];
  m_Parent : moSceneNode;
  m_Id : MOulong;
  m_Name: moText;
*/
/*
  constructor() {
    super();
    this.m_ProjectionMatrix = new moGLMatrixf();
    this.m_ProjectionMatrix.identity();
    this.m_ModelMatrix = new moGLMatrixf();
    this.m_ModelMatrix.identity();
    this.SceneNodeImplementation = new THREE.Scene();
  }

  AddChild(p_child_node: moSceneNode): MOint {
    this.m_Childrens.push(p_child_node);
    return -1;
  }
  */
}
export type moSceneNodeArray = moSceneNode[];



export class mo3dModelManager extends moResource {

  m_MotherNode: moSceneNode;

  constructor() {
    super();
    this.SetName("_3dmodelmanager_");
  }
}
