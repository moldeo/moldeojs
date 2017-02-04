import * as THREE from "three";


import { moResource } from "./mo-resource";

import Vector = THREE.Vector;
import Vector2 = THREE.Vector2;
import Vector3 = THREE.Vector3;
import Vector4 = THREE.Vector4;
import Matrix = THREE.Matrix;
import Matrix3 = THREE.Matrix3;
import Matrix4 = THREE.Matrix4;

export type moVector = Vector;
export type moMatrix = Matrix;

export class moVector2f extends Vector2 {};
export class moVector3f extends Vector3 {};
export class moVector4f extends Vector4 {};
export class moVector2i extends Vector2 {};
export class moVector3i extends Vector3 {};
export class moVector4i extends Vector4 {};
export class moMatrix3f extends Matrix3 {};
export class moMatrix4f extends Matrix4 {};

export type moVector2fArray = moVector2f[];
export type moVector3fArray = moVector3f[];
export type moVector4fArray = moVector4f[];
export type moVector3iArray = moVector3i[];
export type moMatrix3fArray = moMatrix3f[];

export class moMathManager extends moResource {
  constructor() {
    super();
    this.SetName("_timemanager_");
  }
};
