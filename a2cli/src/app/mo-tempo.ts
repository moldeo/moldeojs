import { MOdouble, MOulong, MOlong, MOfloat } from "./mo-types";
import { moTimer } from "./mo-timer";
import { moAbstract } from "./mo-abstract";
import * as moMath from "./mo-math";

export class moTempo extends moTimer {

  ticks: MOulong;
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

  m_pFromTempo: moTempo;

  constructor() {
    super();
  }

  Init(): boolean {
    this.ticks = 0;
    this.ticks_0 = 0;
    this.ticks_1 = 10000;

    this.syncro = 1.0;
    this.delta = 1.0;
    this.deltaprevious = 1.0;
    this.factor = 1.0;

    this.beatpulsecount = 0;
    this.m_pFromTempo = null;

    // siempre iniciamos encendiendo el timer
    this.Start();
    return true;
  }

  getTempo() : MOdouble {
    var dx: MOdouble;
    var dy : MOdouble;
    var intv: MOulong;
    var modv : MOulong;

	  var t0 : MOdouble ;
/*
    intv = ticks - ticks_0;
	modv = ticks_1 - ticks_0 +(MOulong) delta;
	resv = intv % modv;
	dx =(double) resv /(double) modv;
	dy =(double) 2.0 * pi;
	ang =(dx!=0.0 ? factor*dy*dx : 0.0);
	ang*=syncro;
*/

    //correcion para continuidad
    if(this.deltaprevious!=this.delta) {

          /// nuevo usamos el tick del moTimer,
      this.ticks = this.duration;
      intv = this.ticks - this.ticks_0;
      modv = this.ticks_1 - this.ticks_0;



      if (modv == 0) { modv = 1; };
      dy  = 2.0 * moMath.PI *(this.factor + this.deltaprevious - 1.0);
      dx  = modv;
      this.ang = intv * dy / dx;

      //t0 = ticks - ang * modv /(2.0 * moMathf::PI *(factor + delta - 1.0) );
      if ( (this.factor + this.delta - 1.0)!=0.0) {
        t0 = this.ticks - this.ang * modv /(2.0 * moMath.PI *(this.factor + this.delta - 1.0) );
      } else t0 = this.ticks;


      //corregimos el ticks_0(desfazaje que fuerza el desplazamiento de la funcion para su continuidad)
      this.ticks_0 = Math.floor( Number(t0) );
      this.ticks_1 = Math.floor( t0 + modv );
      this.deltaprevious = this.delta;
    }

    ///nuevo usamos el tick del moTimer,
    this.ticks = this.duration;
    intv = this.ticks - this.ticks_0;

    modv = this.ticks_1 - this.ticks_0;
    if (modv == 0) modv = 1;;
    dy  = 2.0 * moMath.PI *(this.factor + this.delta - 1.0);
    dx  = modv;
    this.ang = intv * dy / dx;
    this.ang = this.ang * this.syncro;
    return (this.ang);
  }

};
