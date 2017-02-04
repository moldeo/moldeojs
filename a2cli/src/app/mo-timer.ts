
import { MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types"
import { moText } from "./mo-text"
import { moDataType } from "./mo-data-type.enum"

export enum moTimerState {
  MO_TIMERSTATE_STOPPED,/// Parado, Detenido
  MO_TIMERSTATE_PLAYING,/// Corriendo
  MO_TIMERSTATE_PAUSED/// Pausado
};

export class moTimerAbsolute {
  on : MOboolean = false;
  pause_on : MOboolean  = false;

  start_tick : MOlong = 0;
  start_last : MOlong = 0;

  duration : MOlong = 0;

  last_duration : MOlong;
  state_str : moText;
  last_step_interval: MOlong;

  state: moTimerState;

  constructor() {
  }

  Start() {
    this.on = true;
    this.pause_on = false;
    this.start_tick = moGetTicksAbsolute();
  }

  /// Devuelve el estado del temporizador
    /**
    *   Devuelve el estado del temporizador
    * @return verdadero si fue iniciado, falso si no
    */
    Started() : boolean {
        return this.on;
    }

    /// Devuelve el estado en pausa del cronómetro
    /**
    *   Devuelve el estado en pausa del cronómetro
    * @return verdadero si fue pausado, falso si no
    */
    Paused() : boolean {
        return this.on && this.pause_on;
    }

  /// Congela o pausa el temporizador
    /**
    *   Congela o pausa el temporizador
    */
  Pause() {
    this.pause_on = true;
  }

  /// Prosigue el temporizador
  /**
  *   Prosigue el temporizador
  */
  Continue() {
    this.pause_on = false;
  }

  /// Detiene el temporizador
    /**
    *   Detiene el temporizador
    */
  Stop() {
    this.on = false;
    this.pause_on = false;
    this.start_tick = 0;
    this.start_last = 0;
    this.duration = 0;
  }

  Duration(): MOlong {
    if (this.on) {
        this.start_last = moGetTicksAbsolute();
        this.last_duration = this.duration;
        if (!this.pause_on) this.duration = this.start_last - this.start_tick;
        else this.start_tick = this.start_last - this.last_duration;
    } else this.duration = 0;
    return this.duration;
  }

  /// Devuelve el último valor del reloj
  /**
  *   Devuelve el último valor del reloj
  * @return duración del temporizador
  */
  LastDuration(): MOlong {
    return this.duration;
  }

  /// Devuelve el último valor del reloj
  /**
  *   Devuelve el último valor del reloj
  * @return duración del temporizador
  */
  State() : moTimerState {
    if ( this.Paused() ) {
        return moTimerState.MO_TIMERSTATE_PAUSED;
    } else if ( this.Started() ) {
        return moTimerState.MO_TIMERSTATE_PLAYING;
    }
    return moTimerState.MO_TIMERSTATE_STOPPED;
  }

  SetDuration( p_timecode : MOulong) {
    this.start_tick = moGetTicksAbsolute()-p_timecode;
    this.start_last = moGetTicksAbsolute();
    this.duration = p_timecode;
    this.last_duration = this.duration;
  }

  StateToStr() {
    var state_str : moText = "unknown";

      switch(this.State()) {
        case moTimerState.MO_TIMERSTATE_PAUSED:
          state_str = "paused";
          break;
        case moTimerState.MO_TIMERSTATE_PLAYING:
          state_str = "playing";
          break;
        case moTimerState.MO_TIMERSTATE_STOPPED:
          state_str = "stopped";
          break;
      }
      return state_str;
  }
}

export class moTimer extends moTimerAbsolute {
        m_TimerId : MOlong;/// identificador del temporizador
        m_ObjectId : MOlong;/// identificador del objeto asociado

        m_pRelativeTimer : moTimerAbsolute;

/// Corrige el reloj
        /**
        *   Corrige el reloj
        *   internamente el conteo del reloj es relativo al inicio del temporizador
        *   la marca de inicio vuelve a ser reseteada con esta función, esto puede acarrear problemas si no se manipula correctamente
        *   ya que la cuenta relativa puede ser negativa
        */
        Fix() : void {

        }

        /// Fija el valor del identificador interno del temporizador
        /**
        *   Fija el valor del identificador interno del temporizador
        * @param p_timerid entero que representa el identificador interno
        */
        SetTimerId( p_timerid : MOlong ) : void {
                this.m_TimerId = p_timerid;
        }

        /// Devuelve el valor del identificador interno del temporizador
        /**
        *   Devuelve el valor del identificador interno del temporizador
        * @return entero que representa el identificador interno
        */
        GetTimerId() : MOlong {
                return this.m_TimerId;
        }

        /// Fija el valor del identificador interno del objeto asociado
        /**
        *   Fija el valor del identificador interno del objeto asociado
        * @param p_objectid entero que representa el identificador del objeto relacionado
        */
        SetObjectId( p_objectid : MOlong ) : void {
                this.m_ObjectId = p_objectid;
        }

        /// Devuelve el valor del identificador interno del objeto asociado
        /**
        *   Devuelve el valor del identificador interno del objeto asociado
        * @return entero que representa el identificador del objeto relacionado
        */
        GetObjectId() : MOlong {
                return this.m_ObjectId;
        }

        /// Fija un temporizador relativo
        /**
        *   Fija un temporizador relativo
        * @param puntero al temporizador relacionado
        */
        SetRelativeTimer( p_pRelativeTimer : moTimerAbsolute ) : void {
            this.m_pRelativeTimer = p_pRelativeTimer;
        }


        /// Devuelve el puntero al temporizador relativo
        /**
        * Devuelve el puntero al temporizador relativo
        * @return puntero al temporizador relacionado
        */
        GetRelativeTimer() : moTimerAbsolute {
            return this.m_pRelativeTimer;
        }

}

var virtual_total_milliseconds: MOulong = 0;

///Devuelve en milisegundos el valor del reloj de Moldeo
/**
*   Función global que devuelve en milisegundos el valor del reloj de Moldeo
*   Esta función devuelve un valor relativo al inicio de la línea de tiempo de Moldeo
*   Si se detiene este reloj, el valor devuelto será 0
*   Si se pausa el reloj el valor siempre será el mismo
*   El valor siempre es en milisegundos
*/
export function moGetTicks(): MOulong {
  return GlobalMoldeoTimer.Duration();
}

window["Performance"] = window.performance || {};
window["Performance"].now = (function() {
    return performance.now       ||
        performance["mozNow"]    ||
        performance["msNow"]     ||
        performance["oNow"]      ||
        performance["webkitNow"] ||
        Date.now  /*none found - fallback to browser default */
})();

///Devuelve en milisegundos el valor del reloj de Moldeo
/**
*   Función global que devuelve en milisegundos el valor del reloj absoluto
*   Esta función devuelve un valor absoluto del reloj de la máquina
*   Este valor dependerá de la implementación según el sistema operativo y la librería utilizada,
*   y afectará el comportamiento de los otros temporizadores
*/
export function moGetTicksAbsolute( force_real_absolute : boolean = false): MOulong {

  if (!force_real_absolute && virtual_total_milliseconds > 0) {
    return virtual_total_milliseconds;
  }


/*
  ptime t( microsec_clock::local_time() );

  time_duration clockt = t.time_of_day();

  return clockt.total_milliseconds();
*/
  return window["Performance"].now();
  //return 0;
}

///Devuelve en milisegundos el valor del reloj de Moldeo
/**
*   Función global que devuelve en milisegundos el valor del reloj absoluto
*   Esta función devuelve un valor absoluto del reloj de la máquina
*   Este valor dependerá de la implementación según el sistema operativo y la librería utilizada,
*   y afectará el comportamiento de los otros temporizadores
*/
export function moGetTicksAbsoluteStep(step_interval: MOlong = 0): MOulong {

  virtual_total_milliseconds+= step_interval;

  return virtual_total_milliseconds;

}
export function moResetTicksAbsoluteStep(reset_value: MOulong = 0): MOulong {
  virtual_total_milliseconds = reset_value;
  return virtual_total_milliseconds;
}



export function  moStartTimer() {
    GlobalMoldeoTimer.Start();
}

export function moPauseTimer() {
    GlobalMoldeoTimer.Pause();
}

export function moContinueTimer() {
   GlobalMoldeoTimer.Continue();
}

export function  moStopTimer() {
    GlobalMoldeoTimer.Stop();
}

export function moSetDuration( p_timecode : MOulong ) {
    GlobalMoldeoTimer.SetDuration( p_timecode );
}

export function moGetDuration() : MOulong {
    return GlobalMoldeoTimer.Duration();
}


export function moGetTimerState() : moTimerState {
    return GlobalMoldeoTimer.State();
}

export function moGetTimerStateStr() : moText {
    return GlobalMoldeoTimer.StateToStr();
}


export function moIsTimerPaused() : boolean {
    return GlobalMoldeoTimer.State()==moTimerState.MO_TIMERSTATE_PAUSED;
}


export function moIsTimerStopped() : boolean {
    return GlobalMoldeoTimer.State()==moTimerState.MO_TIMERSTATE_STOPPED;
}

export function moIsTimerStarted() : boolean {
    return !moIsTimerStopped();
}

export function moIsTimerPlaying() : boolean {
    return GlobalMoldeoTimer.State()==moTimerState.MO_TIMERSTATE_PLAYING;
}

export var GlobalMoldeoTimer : moTimerAbsolute = new moTimerAbsolute();


