
import { moMobState } from "./mo-moldeo-object";
import { moTempo  } from "./mo-tempo";
import { MOswitch, MOfloat, MO_DEACTIVATED, MO_ACTIVATED  } from "./mo-types";


export class moEffectState extends moMobState {
  /** moTempo, registro del beat del efecto */
  tempo: moTempo;
  /** on, efecto apagado o prendido, apagado: -1, prendido: 1 */
	on : MOswitch;

  /** synchronized, efecto sincronizado con el estado y beat de la consola, en sincro: 1, sin sincro: -1 */
  synchronized: MOswitch;
  /** enabled (OBSOLETO: moEffectState desciende de moMobState que tiene el miembro m_Activated ), si está activo o no, activado: 1 , desactivado: -1*/
  enabled: MOswitch;
  magnitude: MOfloat;
	amplitude : MOfloat;
  /** alpha: nivel de opacidad del efecto [0..1], opaco: 1, transparente: 0 */
  alpha : MOfloat;

  /** tint: nivel de brillo [0..1], luz: 1, oscuridad: 0, */
  tint: MOfloat;  //brillo 0..1

  /** tinr: nivel de rojo de la tinta [0..1], rojo puro: 1, sin rojo: 0 */
  tintr: MOfloat; //rojo 0..1

  /** ting: nivel de verde de la tinta [0..1], verde puro: 1, verde rojo: 0*/
  tintg : MOfloat; //verde 0..1

  /** tinb: nivel de azul de la tinta [0..1], azul puro: 1, azul rojo: 0*/
  tintb: MOfloat; //azul 0..1

  /** tinc: crominancia [0..1], 0: 0, 360: 1 */
  tintc: MOfloat;

  /** tints: saturación [0..1], 0: 0, 100%: 1 */
  tints: MOfloat; ///saturación

  /** fulldebug: información adicional para corrección de errores, descativado: -1, activado: 1 */
  fulldebug: MOswitch;

  /** 3d stereo capable: capacitado para diferenciar visión entre ojo izquierdo y derecho, profundidad, descativado: -1, activado: 1*/
  /*stereo: MOswitch;*/

  Init() {
    this.on = MO_DEACTIVATED;
    this.synchronized = MO_ACTIVATED;
    this.enabled = MO_ACTIVATED;
    this.magnitude = 1.0;
    this.amplitude = 1.0;
		this.alpha = 1.0;

    this.tintr = 1.0;
		this.tintg = 1.0;
		this.tintb = 1.0;

		this.tint = 1.0;
		this.tintc = 0.0;
		this.tints = 0.0;
/*
		this.stereo = MO_DEACTIVATED;
		this.stereoside = MO_STEREO_NONE;
		*/
		this.fulldebug = MO_DEACTIVATED;

		this.tempo.Init();
  }
}
