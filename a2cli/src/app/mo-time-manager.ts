import {
  moTimer, moTimerAbsolute, moTimerState, GlobalMoldeoTimer,
  moStartTimer, moStopTimer, moPauseTimer, moContinueTimer,
  moIsTimerPaused, moIsTimerPlaying, moIsTimerStopped,
  moGetDuration, moSetDuration,
  moGetTicks
} from "./mo-timer";
import { moResource } from "./mo-resource";

export class moTimeManager extends moResource {
  constructor() {
    super();
    this.SetName("_timemanager_");
  }
}
