/**
 * #918 F15 — las otras tres esferas del mural (nivel 1). Arrancan plegadas (un orbe); tocar ⇒ se abren.
 *
 *  - moObjectsSphere (arriba-izq): las capas del .mol como piedras (color = PRE/FX/POST/MASTER).
 *      tocar = foco (presets y parámetros la siguen) · mantener = prender / apagar
 *  - moParamsSphere  (arriba-der): los params numéricos de la capa en foco.
 *      tocar = elegir · arrastrar arriba/abajo (o rueda del mouse) en la esfera = cambiar el valor
 *  - moTimeSphere    (abajo-izq): ▶ línea de tiempo del proyecto + ⇄ grupo · ● REC / ■ · ▷ reproducir la toma
 */
import { moSphere } from "./mo-sphere";

const NUMERIC = ["NUM", "CHAR", "INT", "LONG", "FLOAT", "DOUBLE"];
const NUMRE = /^\s*-?(\d+\.?\d*|\.\d+)(e-?\d+)?\s*$/i;
function subNum(vb: any): number {
  if (!vb) return null;
  const t = "" + ((vb.m_XmlAttributes && vb.m_XmlAttributes["type"]) || (vb.GetTypeStr && vb.GetTypeStr()));
  if (NUMERIC.indexOf(t) >= 0) return Number(vb.m_Number);
  const s = "" + vb.m_Text;
  return NUMRE.test(s) ? Number(s) : null;
}
function fmt(v: number): string {
  const a = Math.abs(v);
  return (a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : v.toFixed(2)).replace(/\.?0+$/, "") || "0";
}

/** todas las capas de la consola, con su lista */
function allLayers(console: any): { fx: any, kind: string }[] {
  const em = console.m_EffectManager, out: { fx: any, kind: string }[] = [];
  const add = (arr: any[], kind: string) => (arr || []).forEach((fx) => { if (fx && fx.GetConfig && fx.GetConfig()) out.push({ fx, kind }); });
  add(em.PreEffects(), "pre"); add(em.Effects(), "fx"); add(em.PostEffects(), "post"); add(em.MasterEffects(), "master");
  return out;
}

/* ───────────────────────── Objetos ───────────────────────── */

export class moObjectsSphere extends moSphere {
  focus: any = null;
  onFocus: (fx: any) => void = null;
  channel: any = null;
  private page: number = 0;
  static PER_PAGE = 12;

  constructor(private console: any) {
    super("moObjectsSphere", "tl", "⬡", "objetos", true);
    this.render();
  }

  setFocus(fx: any) { this.focus = fx; this.render(); }

  /** prender / apagar una capa (también la usa el Player) */
  setActive(fx: any, on: boolean) {
    if (!fx) return;
    if (on) fx.Activate(); else fx.Deactivate();
    if (this.channel) this.channel.send({ verb: on ? "objectenable" : "objectdisable", label: "" + fx.GetLabelName() });
    this.render();
    this.flash((on ? "● " : "○ ") + fx.GetLabelName());
  }

  protected renderOpen() {
    const S = moSphere.SIZE, C = S / 2;
    this.foldCenter("⬡", "objetos");
    const L = allLayers(this.console), per = moObjectsSphere.PER_PAGE;
    const pages = Math.max(1, Math.ceil(L.length / per));
    if (this.page >= pages) this.page = 0;
    const shown = L.slice(this.page * per, (this.page + 1) * per);
    if (pages > 1) {
      const nb = this.btn("»", "más capas " + (this.page + 1) + "/" + pages, "mw-mini", S - 14, 14,
        () => { this.page = (this.page + 1) % pages; this.render(); this.flash("capas " + (this.page + 1) + "/" + pages); });
      nb.title = "Siguiente grupo de capas";
    }
    const pos = this.ringPos(shown.length, shown.length > 8 ? 62 : 58);
    shown.forEach(({ fx, kind }, k) => {
      const name = "" + fx.GetLabelName();
      const cls = "k-" + kind + (fx === this.focus ? " on" : "") + (fx.Activated() ? "" : " off");
      const b = this.btn(moSphere.glyphOf(name), name, cls, pos[k].x, pos[k].y,
        () => { this.focus = fx; if (this.onFocus) this.onFocus(fx); this.render(); this.flash(name); },
        () => this.setActive(fx, !fx.Activated()));
      b.title = name + " (" + kind.toUpperCase() + ") — tocar: foco · mantener: " + (fx.Activated() ? "apagar" : "prender");
      if (shown.length > 8) { b.style.width = "30px"; b.style.height = "30px"; b.style.fontSize = "13px"; }
    });
  }
}

/* ───────────────────────── Parámetros ───────────────────────── */

export class moParamsSphere extends moSphere {
  focus: any = null;
  param: string = null;
  touchEdit: any = null;      /** moTouchEdit: setNumber ⇒ fork del VAL compartido + canal al Player */
  history: any = null;
  private page: number = 0;
  private centerEl: HTMLButtonElement = null;
  static PER_PAGE = 8;
  private static SKIP = ["blending", "polygonmode", "texture", "font", "text", "script", "filter", "sound", "video", "file"];
  private static GLYPH: { [k: string]: string } = {
    alpha: "α", pos_x: "x", pos_y: "y", pos_z: "z", translatex: "x", translatey: "y", translatez: "z",
    pos_cuad_x: "x", pos_cuad_y: "y", scalex: "↔", scaley: "↕", scalez: "⤢", width: "↔", height: "↕",
    rotatex: "⟲x", rotatey: "⟲y", rotatez: "⟲", rotate: "⟲", syncro: "⏱", phase: "φ", speed: "»", size: "◯",
    velocity: "»", gravity: "↓", radius: "◯", angle: "∠", brightness: "☼", contrast: "◑", saturation: "◕",
  };

  constructor() {
    super("moParamsSphere", "tr", "∿", "parámetros", true);
    this.root.addEventListener("pointerdown", (e) => this.dragStart(e));
    this.root.addEventListener("wheel", (e) => this.wheelMove(e), { passive: false });
    this.render();
  }

  setFocus(fx: any) {
    if (!fx || fx.isProject) return;
    if (fx !== this.focus) { this.focus = fx; this.param = null; this.page = 0; }
    this.render();
  }

  /** params editables: un solo sub-valor y numérico */
  params(): string[] {
    const fx = this.focus; if (!fx) return [];
    const cfg = fx.GetConfig(), out: string[] = [];
    for (const P of cfg.m_Params) {
      const nm = "" + P.m_ParamDefinition.m_Name;
      if (moParamsSphere.SKIP.indexOf(nm.toLowerCase()) >= 0) continue;
      const v = P.m_Values[Math.max(0, P.GetIndexValue())];
      if (!v || v.m_List.length != 1 || subNum(v.m_List[0]) === null) continue;
      out.push(nm);
    }
    return out;
  }

  private value(name: string): number {
    const P = this.focus && this.focus.GetConfig().m_ParamsByName[name]; if (!P) return 0;
    const v = P.m_Values[Math.max(0, P.GetIndexValue())];
    const n = v ? subNum(v.m_List[0]) : null;
    return n === null ? 0 : n;
  }

  private static glyph(name: string): string {
    const k = name.toLowerCase();
    return moParamsSphere.GLYPH[k] || moSphere.glyphOf(name).toLowerCase();
  }

  /* arrastrar (fuera de los botones) o rueda del mouse ⇒ cambia el param elegido */
  private drag: { id: number, y: number, v: number } = null;
  private step(v: number): number { return Math.max(Math.abs(v), 1) * 0.005; }

  private set(v: number) {
    if (!this.focus || !this.param || !this.touchEdit) return;
    this.touchEdit.setNumber(this.focus, this.param, v);
    if (this.centerEl) this.centerEl.firstChild.textContent = fmt(v);
  }

  private dragStart(e: PointerEvent) {
    if (!this.open || !this.param || (e.target as HTMLElement).closest(".mw-b")) return;
    e.preventDefault(); e.stopPropagation();
    if (this.history) this.history.record(this.focus, "mover " + this.param);
    if (this.touchEdit) this.touchEdit.recNext = true;
    this.drag = { id: e.pointerId, y: e.clientY, v: this.value(this.param) };
    try { this.root.setPointerCapture(e.pointerId); } catch (x) { }
    const move = (ev: PointerEvent) => {
      if (!this.drag || ev.pointerId != this.drag.id) return;
      this.set(this.drag.v + (this.drag.y - ev.clientY) * this.step(this.drag.v));
    };
    const up = (ev: PointerEvent) => {
      if (!this.drag || ev.pointerId != this.drag.id) return;
      this.drag = null;
      this.root.removeEventListener("pointermove", move); this.root.removeEventListener("pointerup", up); this.root.removeEventListener("pointercancel", up);
      this.flash(this.param + " " + fmt(this.value(this.param)));
    };
    this.root.addEventListener("pointermove", move); this.root.addEventListener("pointerup", up); this.root.addEventListener("pointercancel", up);
  }

  private wheelTimer: any = null;
  private wheelMove(e: WheelEvent) {
    if (!this.open || !this.param) return;
    e.preventDefault();
    if (!this.wheelTimer) { if (this.history) this.history.record(this.focus, "mover " + this.param); if (this.touchEdit) this.touchEdit.recNext = true; }
    const v = this.value(this.param);
    this.set(v - Math.sign(e.deltaY) * this.step(v) * 10);
    clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => { this.wheelTimer = null; this.flash(this.param + " " + fmt(this.value(this.param))); }, 400);
  }

  protected renderOpen() {
    const S = moSphere.SIZE, C = S / 2;
    const names = this.params();
    const v = this.param ? fmt(this.value(this.param)) : (this.focus ? moSphere.glyphOf("" + this.focus.GetLabelName()) : "∿");
    this.centerEl = this.foldCenter(v, this.param ? this.param + " (arrastrá arriba/abajo)" : (this.focus ? "" + this.focus.GetLabelName() : "parámetros"));
    if (!this.focus) return;
    const per = moParamsSphere.PER_PAGE, pages = Math.max(1, Math.ceil(names.length / per));
    if (this.page >= pages) this.page = 0;
    if (pages > 1) {
      this.btn("»", "más parámetros " + (this.page + 1) + "/" + pages, "mw-mini", 14, 14,
        () => { this.page = (this.page + 1) % pages; this.render(); this.flash("parámetros " + (this.page + 1) + "/" + pages); });
    }
    const shown = names.slice(this.page * per, (this.page + 1) * per);
    const pos = this.ringPos(shown.length), used: { [g: string]: boolean } = {};
    shown.forEach((nm, k) => {
      let g = moParamsSphere.glyph(nm);
      if (used[g]) { const c = nm.replace(/[^a-z0-9]/gi, ""); g = (c[0] + c[c.length - 1]).toLowerCase(); }   /* sin glifos repetidos */
      if (used[g]) g = g[0] + (k + 1);
      used[g] = true;
      const b = this.btn(g, nm, nm == this.param ? "on" : "", pos[k].x, pos[k].y,
        () => { this.param = nm; this.render(); this.flash(nm + " " + fmt(this.value(nm))); });
      b.title = nm + " = " + fmt(this.value(nm)) + " — tocar: elegir · después arrastrá en la esfera (o rueda del mouse)";
    });
  }
}

/* ───────────────────────── Tiempo ───────────────────────── */

export class moTimeSphere extends moSphere {
  project: any = null;
  wheel: any = null;              /** la esfera de presets: comparte el grupo de estados que se muestra */
  apply: (m: any) => void = null; /** reproduce un mensaje por los mismos caminos que el Player */
  private take: { t: number, m: any }[] = [];
  private recording: boolean = false;
  private t0: number = 0;
  private playingTake: boolean = false;
  private timers: any[] = [];

  constructor(project: any) {
    super("moTimeSphere", "bl", "▶", "tiempo", true);
    this.project = project;
    this.render();
  }

  /** el canal pasa por acá: si se está grabando, el mensaje queda en la toma */
  tap(m: any) {
    if (!this.recording || this.playingTake || !m || !m.verb) return;
    this.take.push({ t: performance.now() - this.t0, m });
  }

  toggleRec() {
    if (this.playingTake) this.stopTake();
    this.recording = !this.recording;
    if (this.recording) { this.take = []; this.t0 = performance.now(); }
    this.render();
    this.flash(this.recording ? "● grabando" : "■ toma · " + this.take.length + " gestos");
  }

  playTake() {
    if (this.recording) this.toggleRec();
    if (this.playingTake) { this.stopTake(); return; }
    if (!this.take.length || !this.apply) { this.flash("no hay toma"); return; }
    this.playingTake = true;
    this.timers = this.take.map((e) => setTimeout(() => { if (this.playingTake) this.apply(e.m); }, e.t));
    const end = this.take[this.take.length - 1].t + 300;
    this.timers.push(setTimeout(() => { this.playingTake = false; this.render(); this.flash("fin de la toma"); }, end));
    this.render();
    this.flash("▷ toma · " + this.take.length + " gestos");
  }

  private stopTake() {
    this.timers.forEach((t) => clearTimeout(t)); this.timers = [];
    this.playingTake = false; this.render(); this.flash("■ toma");
  }

  isPlayingTake(): boolean { return this.playingTake; }

  protected renderOpen() {
    const S = moSphere.SIZE, C = S / 2, P = this.project, W = this.wheel;
    this.foldCenter("◷", "tiempo");
    const items: { g: string, w: string, cls: string, fn: () => void, title: string }[] = [];
    const groups: string[] = (P && P.states().length) ? P.groups() : [];
    if (groups.length) {
      const sel = (W && W.projGroup !== null && groups.indexOf(W.projGroup) >= 0) ? W.projGroup : P.currentGroup();
      const lbl = (g: string) => W ? W.groupLabel(g) : g;
      const pg = P.playing ? P.currentGroup() : sel;
      items.push({ g: P.playing ? "⏸" : "▶", w: (P.playing ? "pausa " : "play ") + lbl(pg), cls: P.playing ? "go" : "",
        fn: () => { P.toggle(sel); this.render(); this.flash((P.playing ? "▶ " : "⏸ ") + lbl(sel)); },
        title: "Línea de tiempo: recorre en loop los estados del grupo (cada uno con su duración)" });
      if (groups.length > 1) {
        const other = groups[(groups.indexOf(sel) + 1) % groups.length];
        items.push({ g: "⇄", w: lbl(other), cls: "", fn: () => { if (W) { W.projGroup = other; W.render(); } this.render(); this.flash(lbl(other)); },
          title: "Cambiar el grupo de estados que recorre la línea de tiempo (día / estaciones)" });
      }
    }
    items.push({ g: this.recording ? "■" : "●", w: this.recording ? "parar toma" : "grabar toma", cls: this.recording ? "rec" : "",
      fn: () => this.toggleRec(), title: "REC: graba los gestos del Control (presets, valores, modo, tiempo) con su ritmo" });
    items.push({ g: this.playingTake ? "■" : "▷", w: this.playingTake ? "parar" : "reproducir toma", cls: this.playingTake ? "go" : (this.take.length ? "" : "off"),
      fn: () => this.playTake(), title: "Reproduce la última toma por los mismos caminos (llega al Player)" });
    const pos = this.ringPos(items.length);
    items.forEach((it, k) => { const b = this.btn(it.g, it.w, it.cls, pos[k].x, pos[k].y, it.fn); b.title = it.title; });
  }
}
