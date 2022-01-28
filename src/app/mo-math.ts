import {
  MOfloat, MOdouble,
  MOint, MOuint, MOlong, MOulong,
  MO_PI
} from "./mo-types";
import { moAbstract } from "./mo-abstract";


export const EPSILON = 1.19209e-07;
export const ZERO_TOLERANCE = 1e-06;
//export const MAX_REAL = (MOlong)FLT_MAX;
export const PI = 4.0*Math.atan(1.0);
export const TWO_PI = 2*PI;
export const HALF_PI = 0.5 * PI;
export const INVPI = 1.0 / PI;
export const INV_TWO_PI = 1.0/TWO_PI;
export const DEG_TO_RAD = PI / 180.0;
export const RAD_TO_DEG = 180.0 / PI;
export const LN_2 = Math.log(2.0);
export const LN_10 = Math.log(10.0);
export const INV_LN_2 = 1.0/LN_2;
export const INV_LN_10 = 1.0/LN_10;

export class moMathDouble extends moAbstract {

  constructor() {
    super();
  }

  fabs(x: number) {
    return Math.abs(x);
  }

  UnitRandom( seed?: number ) : number {
    //console.log("moMathDouble UnitRandom");
    return Math.random();
  }

  SymmetricRandom( seed?: number ) {
    return Math.random() - 0.5;
  }

  IntervalRandom( seed: number ) {
    return Math.random();
  }

  Sqrt(x: number): number {
    return Math.sqrt(x);
  }

  Cos(x: number): number {
    return Math.cos(x);
  }

  Sin(x: number): number {
    return Math.sin(x);
  }

  EPSILON = EPSILON;
  ZERO_TOLERANCE = ZERO_TOLERANCE;
  //export const MAX_REAL = (MOlong)FLT_MAX;
  PI : number = PI;
  TWO_PI : number = TWO_PI;
  HALF_PI : number = HALF_PI;
  INVPI : number = INVPI;
  INV_TWO_PI : number = INV_TWO_PI;
  DEG_TO_RAD : number = DEG_TO_RAD;
  RAD_TO_DEG : number = RAD_TO_DEG;
  LN_2 : number = LN_2;
  LN_10 : number = LN_10;
  INV_LN_2 : number = INV_LN_2;
  INV_LN_10 : number = INV_LN_10;

}

export const moMath = new moMathDouble();
export const moMathd = new moMathDouble();

export function FMod(a: MOfloat, b: MOfloat) : MOdouble {
  return 0.0;
}
