import { MOdouble, MOulong, MOlong, MOfloat } from "./mo-types";
import { moTimer } from "./mo-timer";
import { moAbstract } from "./mo-abstract";

export class moTempo extends moTimer {
///Primer tick del beat
	ticks_0 : MOulong;    //primer beat

	///Segundo tick del beat
	ticks_1 : MOulong;    //segundo beat

    ///variacion de frecuencia entre 0X y 2X, delta es real
	delta : MOdouble;
	deltaprevious : MOdouble;

  ///incremento diferencial de tiempo
  dt : MOdouble;

	///Multiplicador a partir de 2X hasta KX, donde K en principio es entero
	factor : MOdouble;

    ///Syncronización o factor fraccionario, 1.0 predeterminado, sino KX donde K puede ser fraccional (un número real)
	syncro : MOdouble;

	ang : MOdouble;  //angulo en radianes entre 0 y 2*pi

    ///Temporales del beat
  beat_0: MOulong;
  beat_1: MOulong;
  beatpulsecount : MOulong;

  constructor() {
    super();
  }

  Init(): boolean {

    return true;
  }

};
