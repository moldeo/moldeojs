import {
  MOulong, MOlong, MOint, MOuint
} from "./mo-types";
import {
  moTimer, moTimerAbsolute, moTimerState, GlobalMoldeoTimer,
  moStartTimer, moStopTimer, moPauseTimer, moContinueTimer,
  moIsTimerPaused, moIsTimerPlaying, moIsTimerStopped,
  moGetDuration, moSetDuration,
  moGetTicks
} from "./mo-timer";
import { moResource } from "./mo-resource";

export class moTimeManager extends moResource {

  m_Timers: moTimer[] = [];

  constructor() {
    super();
    this.SetName("_timemanager_");
  }

  SetDuration( p_timecode : MOulong ) : void {

    moSetDuration( p_timecode );
    this.FixTimers();

  }

  NewTimer(): moTimer {
    var pTimer: moTimer = new moTimer();
    this.AddTimer(pTimer);
    return pTimer;
  }

  AddTimer(p_timer: moTimer): void {
    this.m_Timers.push( p_timer );
  }

  RemoveTimer( p_timer : moTimer) : void {
    this.ClearByTimerId( p_timer.GetTimerId() );
  }

  ClearByTimerId( p_timerid : MOlong ) : void {
    var max : number = this.m_Timers.length;
    var NewTimers : moTimer[] = [];
    for( var i=0; i<max; i++ ) {
        var pTimer : moTimer = this.m_Timers[i];
        if ( pTimer.GetTimerId() != p_timerid) {
          NewTimers.push(pTimer);
        }
    }
    this.m_Timers = NewTimers;
  }

  ClearByObjectId( p_objectid: MOlong) : void {
    var max : number = this.m_Timers.length;
    var NewTimers : moTimer[] = [];
    for( var i=0; i<max; i++ ) {
        var pTimer : moTimer = this.m_Timers[i];
        if ( pTimer.GetObjectId() != p_objectid) {
          NewTimers.push(pTimer);
        }
    }
    this.m_Timers = NewTimers;
  }

  FixByObjectId( p_objectid: MOlong ) : void {
    for (var i = 0; i < this.m_Timers.length; i++) {
      ///aaaa
      var pTimer: moTimer = this.m_Timers[i];
      if (pTimer && pTimer.GetObjectId() == p_objectid) {
        pTimer.Fix();
      }
    }
  }

  FixTimers(): void {
    for (var i = 0; i < this.m_Timers.length; i++) {
      ///aaaa
      var pTimer: moTimer = this.m_Timers[i];
      if (pTimer) {
        pTimer.Fix();
      }
    }
  }

}
