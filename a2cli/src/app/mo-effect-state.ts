
import { moMobState } from "./mo-moldeo-object";
import { moTempo  } from "./mo-tempo";
import { MOswitch, MOfloat, MO_DEACTIVATED, MO_ACTIVATED  } from "./mo-types";


export class moEffectState extends moMobState {
  /** moTempo, registro del beat del efecto */
  tempo: moTempo = new moTempo();
  /** on, efecto apagado o prendido, apagado: -1, prendido: 1 */
	on : MOswitch = MO_DEACTIVATED;

  /** synchronized, efecto sincronizado con el estado y beat de la consola, en sincro: 1, sin sincro: -1 */
  synchronized: MOswitch = MO_ACTIVATED;
  /** enabled (OBSOLETO: moEffectState desciende de moMobState que tiene el miembro m_Activated ),
   * si está activo o no, activado: 1 , desactivado: -1*/
  enabled: MOswitch = MO_ACTIVATED;
  magnitude: MOfloat = 1.0;
	amplitude : MOfloat = 1.0;
  /** alpha: nivel de opacidad del efecto [0..1], opaco: 1, transparente: 0 */
  alpha : MOfloat = 1.0;

  /** tint: nivel de brillo [0..1], luz: 1, oscuridad: 0, */
  tint: MOfloat = 1.0;  //brillo 0..1

  /** tinr: nivel de rojo de la tinta [0..1], rojo puro: 1, sin rojo: 0 */
  tintr: MOfloat = 1.0; //rojo 0..1

  /** ting: nivel de verde de la tinta [0..1], verde puro: 1, verde rojo: 0*/
  tintg : MOfloat = 1.0; //verde 0..1

  /** tinb: nivel de azul de la tinta [0..1], azul puro: 1, azul rojo: 0*/
  tintb: MOfloat = 1.0; //azul 0..1

  /** tinc: crominancia [0..1], 0: 0, 360: 1 */
  tintc: MOfloat = 0.0;

  /** tints: saturación [0..1], 0: 0, 100%: 1 */
  tints: MOfloat = 0.0; ///saturación

  /** fulldebug: información adicional para corrección de errores, descativado: -1, activado: 1 */
  fulldebug: MOswitch = MO_DEACTIVATED;

  /** 3d stereo capable: capacitado para diferenciar visión entre ojo izquierdo y derecho, profundidad, descativado: -1, activado: 1*/
  /*stereo: MOswitch;*/

  constructor() {
    super();
  }

  Init() : boolean {
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

    return super.Init();
  }

  SetColorRGB( r : MOfloat, g : MOfloat, b : MOfloat ): void {

  }

  SetColorCSV( c : MOfloat, s : MOfloat, t : MOfloat): void {

  }

  CSV2RGB() : void {

  }
}
