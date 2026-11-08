/**
 * #918 P7 — presets de PROYECTO y línea de tiempo.
 *
 * Un estado del proyecto = qué preset usa cada capa (preset de presets, como los estados de escena del 1.0).
 * Viven en los PRECONFIGS de la consola (.mol): <PRE name="dia" duration="8" transition="4"><P name="cielo">1</P>…
 * La línea de tiempo recorre los estados en loop: cada uno dura `duration` s y se llega con `transition` s.
 *
 * P9 — dos ejes independientes:
 *  · `<P name="capa.param">idx</P>` fija el índice de ESE param, sin tocar el preset de la capa
 *    (las estaciones cambian `colinas.texture`; el día sigue manejando color y luz con los presets de siempre).
 *  · `group="dia"` / `group="estacion"`: llamar un estado sólo toca lo que lista, y ▶ recorre sólo su grupo.
 *
 * Se presenta a la rueda como una capa más ("proyecto"): GetConfig() devuelve un adaptador con la misma
 * interfaz que el config de una capa (GetPreConfCount, m_PreConfigs, SetCurrentPreConf, CapturePreConf…).
 */
export class moProjectStates {

  playing: boolean = false;
  channel: any = null;            /** #918 D2 */
  onChange: () => void = null;
  private timer: any = null;
  private cur: number = -1;

  constructor(private console: any) {}

  private cc(): any { return this.console.m_Config; }
  states(): any[] { return (this.cc() && this.cc().m_PreConfigs) || []; }

  layerByLabel(label: string): any {
    return this.console.m_EffectManager.m_AllEffects.find((e: any) => ("" + e.GetLabelName()) == label);
  }
  /** "colinas.texture" ⇒ ["colinas", "texture"]; "colinas" ⇒ ["colinas", ""] */
  private target(name: string): string[] {
    const s = "" + name, k = s.indexOf(".");
    return k < 0 ? [s, ""] : [s.slice(0, k), s.slice(k + 1)];
  }
  group(st: any): string { return (st && st.m_XmlAttributes && st.m_XmlAttributes["group"]) || ""; }

  layers(): any[] {
    const out: any[] = [];
    for (const st of this.states())
      for (const pi of st.m_PreconfIndexes) {
        const fx = this.layerByLabel(this.target(pi.m_ParamName)[0]);
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
      const [label, param] = this.target(pi.m_ParamName);
      const fx = this.layerByLabel(label); if (!fx) continue;
      if (!param) { fx.GetConfig().SetCurrentPreConf(pi.m_ValueIndex, d); continue; }
      const P = fx.GetConfig().m_ParamsByName[param];       /* un param suelto: índice directo (texturas no interpolan) */
      if (P && pi.m_ValueIndex < P.GetValuesCount()) P.SetIndexValue(pi.m_ValueIndex);
    }
    this.cur = i;
    if (this.onChange) this.onChange();
  }

  /** guarda en el estado i el preset que tiene ahora cada capa */
  capture(i: number) {
    const st = this.states()[i]; if (!st) return;
    for (const pi of st.m_PreconfIndexes) {
      const [label, param] = this.target(pi.m_ParamName);
      const fx = this.layerByLabel(label); if (!fx) continue;
      if (!param) { pi.m_ValueIndex = fx.GetConfig().GetCurrentPreConf(); continue; }
      const P = fx.GetConfig().m_ParamsByName[param];
      if (P) pi.m_ValueIndex = P.GetIndexValue();
    }
    this.cur = i;
    if (this.cc() && this.cc().SaveConfig) this.cc().SaveConfig();
  }

  groups(): string[] {
    const out: string[] = [];
    for (const s of this.states()) { const g = this.group(s); if (out.indexOf(g) < 0) out.push(g); }
    return out;
  }
  currentGroup(): string { const all = this.states(); return this.group(all[this.cur >= 0 ? this.cur : 0]); }

  /** línea de tiempo: recorre los estados en loop. `g` = grupo a recorrer (si el estado actual es de otro, arranca por el primero de `g`) */
  play(g?: string) {
    if (!this.states().length) return;
    if (g !== undefined && g !== null && this.currentGroup() != g) {
      const all = this.states(), idx = all.map((s: any, i: number) => i).filter((i: number) => this.group(all[i]) == g);
      if (idx.length) this.cur = idx[idx.length - 1];       /* así el primer paso cae en el primero del grupo */
    }
    this.playing = true;
    const step = () => {
      if (!this.playing) return;
      /* sólo el grupo del estado actual (día o estaciones); sin estado actual, el grupo del primero */
      const all = this.states();
      const g = this.group(all[this.cur >= 0 ? this.cur : 0]);
      const idx = all.map((s: any, i: number) => i).filter((i: number) => this.group(all[i]) == g);
      const pos = idx.indexOf(this.cur);
      const next = idx[(pos + 1) % idx.length];
      this.call(next);
      this.timer = setTimeout(step, this.attr(this.states()[next], "duration", 8) * 1000);
    };
    step();
    if (this.onChange) this.onChange();
  }
  pause() { this.playing = false; clearTimeout(this.timer); if (this.onChange) this.onChange(); }
  toggle(g?: string) {
    this.playing ? this.pause() : this.play(g);
    if (this.channel) this.channel.send({ verb: this.playing ? "play" : "pause", group: g });
  }

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
