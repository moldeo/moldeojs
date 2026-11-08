/**
 * #918 P7 — presets de PROYECTO y línea de tiempo.
 *
 * Un estado del proyecto = qué preset usa cada capa (preset de presets, como los estados de escena del 1.0).
 * Viven en los PRECONFIGS de la consola (.mol): <PRE name="dia" duration="8" transition="4"><P name="cielo">1</P>…
 * La línea de tiempo recorre los estados en loop: cada uno dura `duration` s y se llega con `transition` s.
 *
 * Se presenta a la rueda como una capa más ("proyecto"): GetConfig() devuelve un adaptador con la misma
 * interfaz que el config de una capa (GetPreConfCount, m_PreConfigs, SetCurrentPreConf, CapturePreConf…).
 */
export class moProjectStates {

  playing: boolean = false;
  onChange: () => void = null;
  private timer: any = null;
  private cur: number = -1;

  constructor(private console: any) {}

  private cc(): any { return this.console.m_Config; }
  states(): any[] { return (this.cc() && this.cc().m_PreConfigs) || []; }

  layerByLabel(label: string): any {
    return this.console.m_EffectManager.m_AllEffects.find((e: any) => ("" + e.GetLabelName()) == label);
  }
  layers(): any[] {
    const out: any[] = [];
    for (const st of this.states())
      for (const pi of st.m_PreconfIndexes) {
        const fx = this.layerByLabel("" + pi.m_ParamName);
        if (fx && out.indexOf(fx) < 0) out.push(fx);
      }
    return out;
  }

  private attr(st: any, k: string, def: number): number {
    const v = st && st.m_XmlAttributes ? Number(st.m_XmlAttributes[k]) : NaN;
    return isNaN(v) ? def : v;
  }

  /** aplica el estado i a todas sus capas. duration = override (corte duro = 0); si no, el `transition` del estado */
  call(i: number, duration?: number) {
    const st = this.states()[i]; if (!st) return;
    const d = (duration !== undefined && duration !== null) ? duration : this.attr(st, "transition", 1);
    for (const pi of st.m_PreconfIndexes) {
      const fx = this.layerByLabel("" + pi.m_ParamName);
      if (fx) fx.GetConfig().SetCurrentPreConf(pi.m_ValueIndex, d);
    }
    this.cur = i;
    if (this.onChange) this.onChange();
  }

  /** guarda en el estado i el preset que tiene ahora cada capa */
  capture(i: number) {
    const st = this.states()[i]; if (!st) return;
    for (const pi of st.m_PreconfIndexes) {
      const fx = this.layerByLabel("" + pi.m_ParamName);
      if (fx) pi.m_ValueIndex = fx.GetConfig().GetCurrentPreConf();
    }
    this.cur = i;
    if (this.cc() && this.cc().SaveConfig) this.cc().SaveConfig();
  }

  /** línea de tiempo: recorre los estados en loop */
  play() {
    if (!this.states().length) return;
    this.playing = true;
    const step = () => {
      if (!this.playing) return;
      const n = this.states().length;
      const next = (this.cur + 1) % n;
      this.call(next);
      this.timer = setTimeout(step, this.attr(this.states()[next], "duration", 8) * 1000);
    };
    step();
    if (this.onChange) this.onChange();
  }
  pause() { this.playing = false; clearTimeout(this.timer); if (this.onChange) this.onChange(); }
  toggle() { this.playing ? this.pause() : this.play(); }

  /** adaptador para la rueda */
  asLayer(): any {
    const self = this;
    const cfg = {
      get m_PreConfigs() { return self.states(); },
      m_Params: null as any,
      GetPreConfCount: () => self.states().length,
      GetCurrentPreConf: () => self.cur,
      SetCurrentPreConf: (i: number, d?: number) => self.call(i, d),
      CapturePreConf: (i: number) => { self.capture(i); return []; },
    };
    return { isProject: true, GetLabelName: () => "paisaje", GetName: () => "proyecto", GetConfig: () => cfg };
  }
}
