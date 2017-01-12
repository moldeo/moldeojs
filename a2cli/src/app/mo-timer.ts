
import { MOboolean, MOfloat, MOdouble, MOlong, MOulong, moNumber, moTextFilterParam } from "./mo-types"
import { moText } from "./mo-text"
import { moDataType } from "./mo-data-type.enum"

export enum moTimerState {
  MO_TIMERSTATE_STOPPED,/// Parado, Detenido
  MO_TIMERSTATE_PLAYING,/// Corriendo
  MO_TIMERSTATE_PAUSED/// Pausado
};

export class moTimerAbsolute {
  on : MOboolean;
  pause_on : MOboolean;

  start_tick : MOlong;
  start_last : MOlong;

  duration : MOlong;

  last_duration : MOlong;
  state_str : moText;
  last_step_interval: MOlong;

  state: moTimerState;
  Start() {

  }
  Pause() {

  }
  Stop() {

  }
  State() : moTimerState  {
    return this.state;
  }
  Duration(): MOlong {
    return this.last_duration;
  }
}

export class moTimer extends moTimerAbsolute {

}
