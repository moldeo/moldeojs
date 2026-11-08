/**
 * #918 E1.5 — borrador de la RUEDA DE PRESETS (esquina inferior derecha del boceto de FCA).
 *
 *  - centro  = la capa en foco (tocar ⇒ pasa a la siguiente capa que tenga presets)
 *  - anillo  = sus presets, repartidos en círculo (4 ⇒ N·E·S·O); tocar ⇒ se llama (SetCurrentPreConf, salto inmediato)
 *  - si en modo Edit se toca una capa en la pantalla, la rueda la toma (setLayer)
 *
 * DOM propio, sin componente Angular: es un borrador para probar el gesto en la tablet.
 */

export class moPresetWheel {

  root: HTMLDivElement;
  private layers: any[] = [];
  private current: number = 0;
  onCall: (layer: any, preset: number) => void = null;
  history: any = null;            /** #918 H1 */
  /** modo de cambio, override del performer (FCA: "en vivo es fundamental el corte duro").
   *  proyecto = la duración/curva del proyecto (default) · corte = 0 s · lento = 3 s.  Shift+tocar = corte puntual. */
  mode: string = "proyecto";
  private static MODES: { [m: string]: number } = { proyecto: null, corte: 0, lento: 3 };
  onMode: (mode: string) => void = null;

  project: any = null;            /** #918 P7: moProjectStates (estados del paisaje + línea de tiempo) */
  channel: any = null;            /** #918 D2: moChannel (Control → Player) */
  /** el Player aplica por acá lo que manda el Control */
  selectByLabel(label: string): boolean {
    const i = this.layers.findIndex((f: any) => ("" + f.GetLabelName()) == label);
    if (i < 0) return false;
    this.current = i; return true;
  }

  constructor(private console: any, project: any = null) {
    this.project = project;
    if (project) project.onChange = () => this.render();
    this.collect();
    this.build();
    this.render();
  }

  /** capas con presets, en el orden de la consola: pre-efectos, efectos, post, master */
  private collect() {
    const em = this.console.m_EffectManager;
    const all = [].concat(em.PreEffects() || [], em.Effects() || [], em.PostEffects() || [], em.MasterEffects() || []);
    this.layers = all.filter((fx) => fx && fx.GetConfig && fx.GetConfig() && fx.GetConfig().GetPreConfCount() > 0);
    if (this.project && this.project.states().length) this.layers.unshift(this.project.asLayer());   /* el proyecto va primero */
  }

  private build() {
    const r = document.createElement("div");
    r.id = "moPresetWheel";
    r.setAttribute("data-html2canvas-ignore", "");
    r.style.cssText = [
      "position:fixed", "z-index:2147483000", "width:250px", "height:250px", "border-radius:50%",
      "right:calc(16px + env(safe-area-inset-right, 0px))", "bottom:calc(16px + env(safe-area-inset-bottom, 0px))",
      "background:rgba(10,12,24,.55)", "border:2px solid rgba(255,255,255,.55)", "backdrop-filter:blur(4px)",
      "touch-action:none", "user-select:none", "-webkit-user-select:none", "font-family:monospace",
    ].join(";");
    document.body.appendChild(r);
    this.root = r;
  }

  layer(): any { return this.layers[this.current]; }

  /** la capa tocada en la pantalla pasa a ser la de la rueda */
  setLayer(fx: any) {
    const i = this.layers.indexOf(fx);
    if (i >= 0) { this.current = i; this.render(); }
  }

  private nextLayer() {
    if (!this.layers.length) return;
    this.current = (this.current + 1) % this.layers.length;
    this.render();
  }

  call(i: number, hardCut: boolean = false) {
    const fx = this.layer(); if (!fx) return;
    if (this.history) this.history.record(fx.isProject ? this.project.layers() : fx, "preset " + (fx.GetConfig().m_PreConfigs[i].m_Name || i + 1));
    const d = hardCut ? 0 : moPresetWheel.MODES[this.mode];
    fx.GetConfig().SetCurrentPreConf(i, d === null ? undefined : d);
    if (this.channel) this.channel.send({ verb: "preconfigset", label: "" + fx.GetLabelName(), i, hard: hardCut, mode: this.mode });
    if (this.onCall) this.onCall(fx, i);
    this.render();
  }

  onCapture: (layer: any, preset: number) => void = null;
  private shiftDown: boolean = false;

  nextMode() {
    const ms = Object.keys(moPresetWheel.MODES);
    this.mode = ms[(ms.indexOf(this.mode) + 1) % ms.length];
    if (this.channel) this.channel.send({ verb: "mode", mode: this.mode });
    if (this.onMode) this.onMode(this.mode);
    this.render();
  }

  /** mantener apretado: el estado actual queda guardado en ese preset */
  capture(i: number) {
    const fx = this.layer(); if (!fx) return;
    const cfg = fx.GetConfig();
    if (this.history && !fx.isProject) this.history.record(fx, "guardar preset " + (cfg.m_PreConfigs[i].m_Name || i + 1));
    for (const [pidx, vidx] of cfg.CapturePreConf(i)) fx.ResolveValue(cfg.m_Params[pidx], vidx);
    if (this.channel) this.channel.send({ verb: "preconfigsave", label: "" + fx.GetLabelName(), i });
    if (this.onCapture) this.onCapture(fx, i);
    setTimeout(() => this.render(), 250);
  }

  /** P9 — con varios grupos de estados (día / estaciones) la rueda muestra uno por vez */
  projGroup: string = null;
  private static GROUP_LABEL: { [g: string]: string } = { dia: "día", estacion: "estaciones", "": "estados" };
  private groupLabel(g: string): string { return moPresetWheel.GROUP_LABEL[g] || g; }

  render() {
    const r = this.root; r.innerHTML = "";
    const fx = this.layer();
    const btn = (label: string, css: string, fn: () => void, active = false, hold: () => void = null) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label;
      b.style.cssText = "position:absolute;touch-action:none;cursor:pointer;border-radius:999px;font:600 12px/1.1 monospace;" +
        "padding:8px 10px;border:2px solid #fff;" + (active ? "background:#fff;color:#0a0c18;" : "background:rgba(10,12,24,.8);color:#fff;") + css;
      b.addEventListener("pointerdown", (e) => {
        e.preventDefault(); e.stopPropagation();
        this.shiftDown = e.shiftKey;
        if (!hold) { fn(); return; }
        let held = false;
        const timer = setTimeout(() => { held = true; b.style.boxShadow = "0 0 0 6px rgba(255,255,255,.6)"; hold(); }, 700);
        const end = () => { clearTimeout(timer); b.removeEventListener("pointerup", end); b.removeEventListener("pointercancel", cancel); if (!held) fn(); };
        const cancel = () => { clearTimeout(timer); b.removeEventListener("pointerup", end); b.removeEventListener("pointercancel", cancel); };
        b.addEventListener("pointerup", end); b.addEventListener("pointercancel", cancel);
      });
      r.appendChild(b);
      return b;
    };
    /* centro: la capa */
    const c = btn(fx ? "" + fx.GetLabelName() : "sin presets", "left:50%;top:50%;transform:translate(-50%,-50%);max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
      () => this.nextLayer());
    c.title = "Tocar: pasar a la siguiente capa";
    /* modo de cambio: arriba a la izquierda del círculo */
    const label = { proyecto: "≈ proyecto", corte: "✂ corte", lento: "∿ lento" }[this.mode] || this.mode;
    const mb = btn(label, "left:2px;top:2px;padding:5px 8px;font-size:11px;" + (this.mode != "proyecto" ? "background:#ffd36b;color:#0a0c18;border-color:#ffd36b;" : ""),
      () => this.nextMode());
    mb.title = "Cómo cambian los presets: proyecto (su duración) · corte (0 s) · lento (3 s). Shift+tocar = corte puntual";
    /* línea de tiempo del proyecto (arriba a la derecha) */
    const groups: string[] = (this.project && this.project.states().length) ? this.project.groups() : [];
    if (groups.length && (this.projGroup === null || groups.indexOf(this.projGroup) < 0)) this.projGroup = this.project.currentGroup();
    if (groups.length) {
      const pg = this.project.playing ? this.project.currentGroup() : this.projGroup;
      const tb = btn((this.project.playing ? "⏸ " : "▶ ") + this.groupLabel(pg), "right:2px;top:2px;padding:5px 8px;font-size:11px;" +
        (this.project.playing ? "background:#9be38b;color:#0a0c18;border-color:#9be38b;" : ""), () => { this.project.toggle(this.projGroup); this.render(); });
      tb.title = "Línea de tiempo: recorre en loop los estados del grupo que muestra la rueda (cada uno con su duración)";
    }
    if (!fx) return;
    /* anillo: los presets, empezando arriba y en sentido horario */
    const cfg = fx.GetConfig(), cur = cfg.GetCurrentPreConf();
    let shown: number[] = [];
    for (let i = 0; i < cfg.GetPreConfCount(); i++) shown.push(i);
    if (fx.isProject && groups.length > 1) {
      shown = shown.filter((i) => this.project.group(cfg.m_PreConfigs[i]) == this.projGroup);
      /* abajo: cambiar de grupo */
      const other = groups[(groups.indexOf(this.projGroup) + 1) % groups.length];
      const gb = btn("⇄ " + this.groupLabel(other), "left:2px;bottom:2px;padding:5px 8px;font-size:11px;",
        () => { this.projGroup = other; this.render(); });
      gb.title = "La rueda muestra un grupo de estados por vez: día o estaciones (son ejes independientes)";
    }
    const n = shown.length, R = 84;
    for (let k = 0; k < n; k++) {
      const i = shown[k];
      const a = -Math.PI / 2 + (2 * Math.PI * k) / n;
      const x = 125 + R * Math.cos(a), y = 125 + R * Math.sin(a);
      const name = ("" + (cfg.m_PreConfigs[i].m_Name || (i + 1))).replace(/_/g, " ");
      btn(name, `left:${x}px;top:${y}px;transform:translate(-50%,-50%);max-width:86px;white-space:normal;`, () => this.call(i, this.shiftDown), i == cur, () => this.capture(i));
    }
  }
}
