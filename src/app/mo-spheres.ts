/**
 * #918 F15 — las otras tres esferas del mural (nivel 1). Arrancan plegadas (un orbe); tocar ⇒ se abren.
 *
 *  - moObjectsSphere (arriba-izq): las capas del .mol como piedras (color = PRE/FX/POST/MASTER).
 *      tocar = foco (presets y parámetros la siguen) · mantener = prender / apagar
 *  - moParamsSphere  (arriba-der): los params numéricos de la capa en foco.
 *      tocar = elegir · arrastrar arriba/abajo (o rueda del mouse) en la esfera = cambiar el valor
 *      param DISCRETO (PARAM con options="a,b,c" en el .cfg ⇒ valor entero 0..K−1): tocarlo abre el SELECTOR en anillo
 *      (K opciones alrededor, «×» al centro = cerrar sin cambiar) · clic = elegir y cerrar · rueda = mover el resaltado,
 *      Enter = elegir el resaltado · ESC = cerrar sin cambiar. El centro de la esfera muestra la etiqueta, no el número.
 *  - moTimeSphere    (abajo-izq): ▶ línea de tiempo del proyecto + ⇄ grupo · ● REC / ■ · ▷ reproducir la toma
 */
import { moSphere } from "./mo-sphere";
import { moCacheBust } from "./mo-cache-bust";

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
  /** null = nivel 0 (sunburst: listas adentro, capas afuera) · "pre"|"fx"|"post"|"master" = zoom a esa lista */
  private level: string = null;
  static PER_PAGE = 12;
  static KIND: { [k: string]: { g: string, w: string, c: string } } = {
    pre: { g: "PR", w: "pre-efectos", c: "#9be38b" }, fx: { g: "FX", w: "efectos", c: "#5ef2ff" },
    post: { g: "PO", w: "post-efectos", c: "#ffd36b" }, master: { g: "MA", w: "master", c: "#ff5ed8" },
  };

  constructor(private console: any) {
    super("moObjectsSphere", "tl", "⬡", "objetos", true);
    try { const l = localStorage.getItem("moSphere.objects.level"); this.level = l && moObjectsSphere.KIND[l] ? l : null; } catch (e) { }
    moObjectsSphere.ensureZoomStyle();
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

  /** entrar / salir del zoom a una lista; se recuerda por visor */
  zoom(kind: string) {
    this.level = kind; this.page = 0;
    try { localStorage.setItem("moSphere.objects.level", kind || ""); } catch (e) { }
    this.render();
    this.ring.classList.remove("mw-zoomin", "mw-zoomout"); void this.ring.offsetWidth;
    this.ring.classList.add(kind ? "mw-zoomin" : "mw-zoomout");
    this.flash(kind ? moObjectsSphere.KIND[kind].w : "objetos");
  }

  /** una piedra-capa: tocar = foco · mantener = prender/apagar (igual en los dos niveles) */
  private stone(fx: any, kind: string, x: number, y: number, small: boolean) {
    const name = "" + fx.GetLabelName();
    const cls = "k-" + kind + (fx === this.focus ? " on" : "") + (fx.Activated() ? "" : " off");
    const b = this.btn(moSphere.glyphOf(name), name, cls, x, y,
      () => { this.focus = fx; if (this.onFocus) this.onFocus(fx); this.render(); this.flash(name); },
      () => this.setActive(fx, !fx.Activated()));
    b.title = name + " (" + kind.toUpperCase() + ") — tocar: foco · mantener: " + (fx.Activated() ? "apagar" : "prender");
    if (small) { b.style.width = "28px"; b.style.height = "28px"; b.style.fontSize = "12px"; }
    return b;
  }

  protected renderOpen() {
    const S = moSphere.SIZE, C = S / 2;
    const L = allLayers(this.console);
    if (this.level && !L.some((l) => l.kind == this.level)) this.level = null;   /* la lista se vació */
    if (this.level) { this.renderZoom(L.filter((l) => l.kind == this.level)); return; }
    this.foldCenter("⬡", "objetos");
    const kinds = ["pre", "fx", "post", "master"].filter((k) => L.some((l) => l.kind == k));
    if (!L.length) return;
    // cada capa ocupa la misma porción del anillo; cada lista, el arco contiguo de sus capas
    const n = L.length, step = (2 * Math.PI) / n, a0 = -Math.PI / 2;
    const Ro = 70, Ri = 44, Ra = 56;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "mw-arcs"); svg.setAttribute("viewBox", "0 0 " + S + " " + S);
    let k0 = 0;
    for (const kind of kinds) {
      const items = L.filter((l) => l.kind == kind), K = moObjectsSphere.KIND[kind];
      const from = a0 + k0 * step, to = a0 + (k0 + items.length) * step, mid = (from + to) / 2;
      if (items.length < n) {   // trazo del arco de la lista (si es la única, el anillo entero ya la dice)
        const pad = Math.min(0.08, step * 0.2), f = from + pad, t = to - pad;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const big = t - f > Math.PI ? 1 : 0;
        path.setAttribute("d", "M " + (C + Ra * Math.cos(f)) + " " + (C + Ra * Math.sin(f)) +
          " A " + Ra + " " + Ra + " 0 " + big + " 1 " + (C + Ra * Math.cos(t)) + " " + (C + Ra * Math.sin(t)));
        path.setAttribute("stroke", K.c); svg.appendChild(path);
      }
      items.forEach(({ fx }, j) => {
        const a = from + (j + 0.5) * step;
        this.stone(fx, kind, C + Ro * Math.cos(a), C + Ro * Math.sin(a), n > 8);
      });
      const lb = this.btn(K.g, K.w + " (" + items.length + ")", "mw-mini mw-kind k-" + kind,
        C + Ri * Math.cos(mid), C + Ri * Math.sin(mid), () => this.zoom(kind));
      lb.title = K.w + " — " + items.length + " capa" + (items.length == 1 ? "" : "s") + " · tocar: acercar";
      k0 += items.length;
    }
    this.ring.insertBefore(svg, this.ring.firstChild);
  }

  /** nivel 1: una sola lista en anillo completo; el centro vuelve */
  private renderZoom(items: { fx: any, kind: string }[]) {
    const S = moSphere.SIZE, C = S / 2, per = moObjectsSphere.PER_PAGE, K = moObjectsSphere.KIND[this.level];
    const back = this.btn("‹" + K.g, "volver a objetos", "mw-center k-" + this.level, C, C, () => this.zoom(null));
    back.title = K.w + " — tocar: volver a todas las listas";
    const pages = Math.max(1, Math.ceil(items.length / per));
    if (this.page >= pages) this.page = 0;
    const shown = items.slice(this.page * per, (this.page + 1) * per);
    if (pages > 1) {
      const nb = this.btn("»", "más capas " + (this.page + 1) + "/" + pages, "mw-mini", S - 14, 14,
        () => { this.page = (this.page + 1) % pages; this.render(); this.flash("capas " + (this.page + 1) + "/" + pages); });
      nb.title = "Siguiente grupo de capas";
    }
    const pos = this.ringPos(shown.length, shown.length > 8 ? 62 : 58);
    shown.forEach(({ fx, kind }, k) => this.stone(fx, kind, pos[k].x, pos[k].y, shown.length > 8));
  }

  private static ensureZoomStyle() {
    if (document.getElementById("moObjectsZoomStyle")) return;
    const st = document.createElement("style"); st.id = "moObjectsZoomStyle";
    st.textContent = `
.mo-sphere .mw-arcs{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.mo-sphere .mw-arcs path{fill:none;stroke-width:5;stroke-linecap:round;opacity:.7;filter:drop-shadow(0 0 3px currentColor)}
.mo-sphere .mw-b.mw-kind{font-size:10px;letter-spacing:.02em}
.mo-sphere .mw-b.mw-kind.k-pre{color:#9be38b}.mo-sphere .mw-b.mw-kind.k-fx{color:#5ef2ff}
.mo-sphere .mw-b.mw-kind.k-post{color:#ffd36b}.mo-sphere .mw-b.mw-kind.k-master{color:#ff5ed8}
.mo-sphere .mw-center.k-pre{border-color:#9be38b}.mo-sphere .mw-center.k-post{border-color:#ffd36b}
.mo-sphere .mw-center.k-master{border-color:#ff5ed8}
.mo-sphere .mw-b.mw-color{border-width:3px;font-size:20px}
.mo-sphere .mw-center.mw-swatch{color:#06070f;text-shadow:0 0 4px #fff;border-color:#fff}
.mo-sphere .mw-zoomin,.mo-sphere .mw-zoomout{position:absolute;inset:0;transform-origin:50% 50%}
.mo-sphere .mw-zoomin{animation:mwZoomIn .22s ease-out}.mo-sphere .mw-zoomout{animation:mwZoomOut .22s ease-out}
@keyframes mwZoomIn{from{transform:scale(.55);opacity:.2}to{transform:none;opacity:1}}
@keyframes mwZoomOut{from{transform:scale(1.35);opacity:.2}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.mo-sphere .mw-zoomin,.mo-sphere .mw-zoomout{animation:none}}`;
    document.head.appendChild(st);
  }
}

/* ───────────────────────── Parámetros ───────────────────────── */

export class moParamsSphere extends moSphere {
  focus: any = null;
  param: string = null;
  /** B3b: param de color elegido (sub-esfera R·G·B·A) y canal que se mueve (0..3); fuera del color, sub = 0 */
  color: string = null;
  sub: number = 0;
  static CH = [{ g: "R", w: "rojo", c: "#ff5e6c" }, { g: "G", w: "verde", c: "#9be38b" }, { g: "B", w: "azul", c: "#5ea8ff" }, { g: "A", w: "opacidad", c: "#e9fbff" }];
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
    if (fx !== this.focus) { this.closePicker(); this.focus = fx; this.param = null; this.color = null; this.sub = 0; this.page = 0; }
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
      if (!v) continue;
      if (v.m_List.length == 1 && subNum(v.m_List[0]) !== null) { out.push(nm); continue; }
      if (moParamsSphere.isColorVal(v)) out.push(nm);
    }
    return out;
  }

  /** un VAL de color = 4 sub-valores numéricos (RED, GREEN, BLUE, ALPHA) */
  private static isColorVal(v: any): boolean {
    return !!v && v.m_List.length == 4 && v.m_List.every((d: any) => subNum(d) !== null);
  }
  private isColor(name: string): boolean {
    const P = this.focus && this.focus.GetConfig().m_ParamsByName[name]; if (!P) return false;
    return moParamsSphere.isColorVal(P.m_Values[Math.max(0, P.GetIndexValue())]);
  }

  /** opciones de un param discreto (atributo `options` del PARAM), o null si es continuo */
  options(name: string): string[] {
    const P = this.focus && this.focus.GetConfig().m_ParamsByName[name]; if (!P) return null;
    const pd: any = P.m_ParamDefinition, xa: any = (P as any).m_XmlAttributes || {};
    const raw = "" + ((pd && pd.m_OptionsStr) || xa["options"] || "");
    const o = raw.split(",").map((x) => x.trim()).filter((x) => x);
    return o.length >= 2 ? o : null;
  }
  /** índice actual de un param discreto (redondeado y acotado a 0..K−1) */
  private optIndex(name: string): number {
    const o = this.options(name); if (!o) return 0;
    return Math.max(0, Math.min(o.length - 1, Math.round(this.value(name))));
  }
  /** lo que se muestra de un param: la etiqueta si es discreto, el número si no */
  private shown(name: string): string {
    const o = this.options(name);
    return o ? o[this.optIndex(name)] : fmt(this.value(name, this.color ? this.sub : 0));
  }

  /* ── selector en anillo para params discretos ── */
  private picker: HTMLDivElement = null;
  private pickName: string = null;
  private pickSel: number = 0;
  private pickKey: (e: KeyboardEvent) => void = null;
  private pickWheel: (e: WheelEvent) => void = null;

  isPickerOpen(): boolean { return !!this.picker; }

  openPicker(name: string) {
    const o = this.options(name); if (!o || !this.focus) return;
    this.closePicker();
    moParamsSphere.ensurePickerStyle();
    this.pickName = name; this.pickSel = this.optIndex(name);
    const D = 300, C = D / 2, R = o.length > 6 ? 116 : 104;
    const p = document.createElement("div");
    p.className = "mo-sphere mw-picker"; p.id = "moParamsPicker";
    p.setAttribute("data-html2canvas-ignore", ""); p.setAttribute("role", "listbox"); p.setAttribute("aria-label", name);
    const mk = (txt: string, cls: string, x: number, y: number, fn: () => void, word: string) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "mw-b " + cls; b.textContent = txt; b.title = word; b.setAttribute("aria-label", word);
      b.style.left = x + "px"; b.style.top = y + "px";
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); e.stopPropagation(); fn(); });
      p.appendChild(b); return b;
    };
    const cur = this.optIndex(name);
    o.forEach((lb, k) => {
      const a = -Math.PI / 2 + (2 * Math.PI * k) / o.length;
      const b = mk(lb, "mw-opt" + (k == cur ? " cur" : ""), C + R * Math.cos(a), C + R * Math.sin(a), () => this.choose(k), lb);
      b.setAttribute("role", "option"); b.setAttribute("data-k", "" + k);
    });
    mk("×", "mw-center mw-x", C, C, () => this.closePicker(), "cerrar sin cambiar");
    const t = document.createElement("div"); t.className = "mw-ptitle"; t.textContent = name; p.appendChild(t);
    p.addEventListener("pointerdown", (e) => { e.stopPropagation(); if (e.target === p) this.closePicker(); });
    document.body.appendChild(p);
    this.picker = p;
    this.pickKey = (e: KeyboardEvent) => {
      if (e.key == "Escape") { e.preventDefault(); e.stopPropagation(); this.closePicker(); }
      else if (e.key == "Enter") { e.preventDefault(); e.stopPropagation(); this.choose(this.pickSel); }
      else if (e.key == "ArrowRight" || e.key == "ArrowDown") { e.preventDefault(); this.highlight(this.pickSel + 1); }
      else if (e.key == "ArrowLeft" || e.key == "ArrowUp") { e.preventDefault(); this.highlight(this.pickSel - 1); }
    };
    this.pickWheel = (e: WheelEvent) => { e.preventDefault(); e.stopPropagation(); if (e.deltaY) this.highlight(this.pickSel + Math.sign(e.deltaY)); };
    document.addEventListener("keydown", this.pickKey, true);
    window.addEventListener("wheel", this.pickWheel, { passive: false, capture: true });
    this.highlight(this.pickSel);
    this.flash(name + " · " + o[cur]);
  }

  /** mueve el resaltado (rueda / flechas) sin aplicar */
  private highlight(k: number) {
    if (!this.picker) return;
    const n = this.picker.querySelectorAll(".mw-opt").length; if (!n) return;
    this.pickSel = ((k % n) + n) % n;
    this.picker.querySelectorAll(".mw-opt").forEach((b: any) => b.classList.toggle("on", +b.getAttribute("data-k") == this.pickSel));
  }

  /** elige la opción k: mismo camino que el arrastre (historial + setNumber ⇒ fork del VAL + canal) y cierra */
  private choose(k: number) {
    const nm = this.pickName, o = this.options(nm);
    this.closePicker();
    if (!o || !this.focus || !this.touchEdit) return;
    this.param = nm; this.sub = 0;
    if (k != this.optIndex(nm)) {
      if (this.history) this.history.record(this.focus, "elegir " + nm);
      this.touchEdit.recNext = true;
      this.touchEdit.setNumber(this.focus, nm, k, 0);
    }
    this.render();
    this.flash(nm + " · " + o[k]);
  }

  closePicker() {
    if (this.pickKey) document.removeEventListener("keydown", this.pickKey, true);
    if (this.pickWheel) window.removeEventListener("wheel", this.pickWheel, { capture: true } as any);
    this.pickKey = null; this.pickWheel = null;
    if (this.picker) { this.picker.remove(); this.picker = null; }
  }

  private static ensurePickerStyle() {
    if (document.getElementById("moParamsPickerStyle")) return;
    const st = document.createElement("style"); st.id = "moParamsPickerStyle";
    st.textContent = `
.mo-sphere.mw-picker{left:50%;top:50%;width:300px;height:300px;transform:translate(-50%,-50%);z-index:2147483001;
 animation:mwPickIn .18s ease-out}
@keyframes mwPickIn{from{transform:translate(-50%,-50%) scale(.6);opacity:.2}to{transform:translate(-50%,-50%);opacity:1}}
.mo-sphere.mw-picker .mw-opt{width:auto;min-width:64px;height:34px;padding:0 12px;border-radius:999px;
 font:600 13px/1 system-ui,sans-serif;white-space:nowrap}
.mo-sphere.mw-picker .mw-opt.cur{border-color:#ff5ed8;box-shadow:0 0 10px rgba(255,94,216,.6)}
.mo-sphere.mw-picker .mw-x{font-size:24px}
.mo-sphere.mw-picker .mw-ptitle{position:absolute;left:50%;top:calc(50% + 34px);transform:translateX(-50%);pointer-events:none;
 font:600 10px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:rgba(233,251,255,.7)}
@media (prefers-reduced-motion:reduce){.mo-sphere.mw-picker{animation:none}}`;
    document.head.appendChild(st);
  }

  private value(name: string, sub: number = 0): number {
    const P = this.focus && this.focus.GetConfig().m_ParamsByName[name]; if (!P) return 0;
    const v = P.m_Values[Math.max(0, P.GetIndexValue())];
    const n = v && v.m_List[sub] ? subNum(v.m_List[sub]) : null;
    return n === null ? 0 : n;
  }

  /** el color actual como CSS (para la piedra y la muestra del centro) */
  private css(name: string): string {
    const c = (k: number) => Math.round(Math.max(0, Math.min(1, this.value(name, k))) * 255);
    return "rgba(" + c(0) + "," + c(1) + "," + c(2) + "," + Math.max(0.15, Math.min(1, this.value(name, 3))).toFixed(2) + ")";
  }
  private label(): string { return this.color ? this.param + "." + moParamsSphere.CH[this.sub].w : this.param; }

  private static glyph(name: string): string {
    const k = name.toLowerCase();
    return moParamsSphere.GLYPH[k] || moSphere.glyphOf(name).toLowerCase();
  }

  /* arrastrar (fuera de los botones) o rueda del mouse ⇒ cambia el param elegido */
  private drag: { id: number, y: number, v: number } = null;
  private step(v: number): number { return this.color ? 0.005 : Math.max(Math.abs(v), 1) * 0.005; }

  private set(v: number) {
    if (!this.focus || !this.param || !this.touchEdit) return;
    if (this.color) v = Math.max(0, Math.min(1, v));                 /* canales de color: 0..1 */
    this.touchEdit.setNumber(this.focus, this.param, v, this.sub);
    if (this.centerEl) {
      if (this.color) this.centerEl.style.background = this.css(this.param);
      else this.centerEl.firstChild.textContent = fmt(v);
    }
  }

  private dragStart(e: PointerEvent) {
    if (!this.open || !this.param || (e.target as HTMLElement).closest(".mw-b")) return;
    e.preventDefault(); e.stopPropagation();
    if (!this.color && this.options(this.param)) { this.openPicker(this.param); return; }   /* discreto: no hay valor continuo */
    if (this.history) this.history.record(this.focus, "mover " + this.label());
    if (this.touchEdit) this.touchEdit.recNext = true;
    this.drag = { id: e.pointerId, y: e.clientY, v: this.value(this.param, this.sub) };
    try { this.root.setPointerCapture(e.pointerId); } catch (x) { }
    const move = (ev: PointerEvent) => {
      if (!this.drag || ev.pointerId != this.drag.id) return;
      this.set(this.drag.v + (this.drag.y - ev.clientY) * this.step(this.drag.v));
    };
    const up = (ev: PointerEvent) => {
      if (!this.drag || ev.pointerId != this.drag.id) return;
      this.drag = null;
      this.root.removeEventListener("pointermove", move); this.root.removeEventListener("pointerup", up); this.root.removeEventListener("pointercancel", up);
      this.flash(this.label() + " " + fmt(this.value(this.param, this.sub)));
    };
    this.root.addEventListener("pointermove", move); this.root.addEventListener("pointerup", up); this.root.addEventListener("pointercancel", up);
  }

  private wheelTimer: any = null;
  private wheelMove(e: WheelEvent) {
    if (!this.open || !this.param) return;
    e.preventDefault();
    if (!this.color && this.options(this.param)) { if (!this.picker) this.openPicker(this.param); return; }
    if (!this.wheelTimer) { if (this.history) this.history.record(this.focus, "mover " + this.label()); if (this.touchEdit) this.touchEdit.recNext = true; }
    const v = this.value(this.param, this.sub);
    this.set(v - Math.sign(e.deltaY) * this.step(v) * 10);
    clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => { this.wheelTimer = null; this.flash(this.label() + " " + fmt(this.value(this.param, this.sub))); }, 400);
  }

  /** sub-esfera de un color: 4 canales alrededor, el centro es la muestra y vuelve */
  private renderColor() {
    const C = moSphere.SIZE / 2, nm = this.color;
    const back = this.btn("‹", "volver a los parámetros", "mw-center mw-swatch", C, C, () => {
      this.color = null; this.param = null; this.sub = 0; this.render(); this.flash("parámetros");
    });
    back.style.background = this.css(nm);
    back.title = nm + " — arrastrá en la esfera para cambiar el canal elegido · tocar: volver";
    this.centerEl = back;
    const pos = this.ringPos(4, 60);
    moParamsSphere.CH.forEach((ch, k) => {
      const b = this.btn(ch.g, ch.w, (this.param == nm && this.sub == k) ? "on" : "", pos[k].x, pos[k].y,
        () => { this.param = nm; this.sub = k; this.render(); this.flash(nm + "." + ch.w + " " + fmt(this.value(nm, k))); });
      b.style.borderColor = ch.c;
      if (!(this.param == nm && this.sub == k)) b.style.color = ch.c;
      b.title = ch.w + " = " + fmt(this.value(nm, k)) + " — tocar: elegir · después arrastrá en la esfera (0 a 1)";
    });
  }

  protected renderOpen() {
    const S = moSphere.SIZE, C = S / 2;
    if (this.color && this.focus && this.isColor(this.color)) { this.renderColor(); return; }
    this.color = null;
    const names = this.params();
    if (this.param && !this.options(this.param)) this.closePicker();
    const v = this.param ? this.shown(this.param) : (this.focus ? moSphere.glyphOf("" + this.focus.GetLabelName()) : "∿");
    const disc = this.param ? this.options(this.param) : null;
    this.centerEl = this.foldCenter(v, this.param ? this.param + (disc ? " (tocá la esfera o girá la rueda: opciones)" : " (arrastrá arriba/abajo)") : (this.focus ? "" + this.focus.GetLabelName() : "parámetros"));
    if (disc && this.centerEl) { this.centerEl.classList.add("mw-disc"); this.centerEl.style.fontSize = v.length > 8 ? "9px" : v.length > 5 ? "11px" : ""; }
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
      if (this.isColor(nm)) {
        const b = this.btn("◍", nm, "mw-color", pos[k].x, pos[k].y,
          () => { this.color = nm; this.param = null; this.sub = 0; this.render(); this.flash(nm); });
        b.style.borderColor = this.css(nm); b.style.color = this.css(nm);
        b.title = nm + " (color) — tocar: abrir rojo · verde · azul · opacidad";
        return;
      }
      const opts = this.options(nm);
      const b = this.btn(g, nm, nm == this.param ? "on" : "", pos[k].x, pos[k].y,
        () => { this.param = nm; this.sub = 0; this.render(); if (opts) this.openPicker(nm); else this.flash(nm + " " + fmt(this.value(nm))); });
      b.title = nm + " = " + this.shown(nm) + (opts ? " — tocar: abrir las " + opts.length + " opciones" : " — tocar: elegir · después arrastrá en la esfera (o rueda del mouse)");
      if (opts) b.setAttribute("data-discrete", "" + opts.length);
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
  /** B3c — las tomas viajan con el proyecto en `tomas.take.json` (las guarda el «Guardar» del Lab, entran en Versiones) */
  static TAKE_FILE = "tomas.take.json";
  private tomas: { nombre: string, fecha: string, dur_ms: number, gestos: { t: number, m: any }[] }[] = [];
  dirty: boolean = false;          /** hay una toma nueva que todavía no se guardó */

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
    if (!this.recording && this.take.length) {
      const dur = this.take[this.take.length - 1].t;
      this.tomas.push({ nombre: "toma " + (this.tomas.length + 1), fecha: new Date().toISOString(), dur_ms: Math.round(dur),
                        gestos: this.take.map((e) => ({ t: Math.round(e.t), m: e.m })) });
      this.dirty = true;
    }
    this.render();
    this.flash(this.recording ? "● grabando" : "■ toma · " + this.take.length + " gestos" + (this.dirty ? " · sin guardar" : ""));
  }

  /** contenido de tomas.take.json, o null si no hay tomas */
  takeJSON(): string | null {
    return this.tomas.length ? JSON.stringify({ v: 1, tomas: this.tomas }) : null;
  }
  markSaved() { if (this.dirty) { this.dirty = false; this.render(); } }

  /** al abrir: la última toma guardada queda lista para ▷ (404 o archivo inválido = sin tomas) */
  loadTakes(url: string): Promise<number> {
    return fetch(moCacheBust(url), { credentials: "same-origin", cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((j) => {
        if (!j || j.v !== 1 || !Array.isArray(j.tomas) || !j.tomas.length) return 0;
        this.tomas = j.tomas.filter((x: any) => x && Array.isArray(x.gestos));
        const ult = this.tomas[this.tomas.length - 1];
        this.take = ult ? ult.gestos.map((e: any) => ({ t: +e.t || 0, m: e.m })) : [];
        this.dirty = false; this.render();
        return this.tomas.length;
      })
      .catch(() => 0);
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
  /** FCA 18-nov — grabar video del lienzo (MediaRecorder sobre captureStream del canvas WebGL), se descarga al parar */
  private vrec: any = null;
  private toggleVideo(CON: any) {
    if (this.vrec) { try { this.vrec.stop(); } catch (e) {} return; }
    let cv: any = null;
    try { cv = CON.GetResourceManager().GetRenderMan().m_Renderer.domElement; } catch (e) {}
    if (!cv) cv = document.querySelector("canvas");
    if (!cv || !cv.captureStream || !(window as any).MediaRecorder) { this.flash("este navegador no puede grabar el lienzo"); return; }
    const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(m => (window as any).MediaRecorder.isTypeSupported(m)) || "";
    const chunks: any[] = [];
    const rec = new (window as any).MediaRecorder(cv.captureStream(30), mime ? { mimeType: mime, videoBitsPerSecond: 8e6 } : {});
    rec.ondataavailable = (e: any) => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      this.vrec = null; this.render();
      const blob = new Blob(chunks, { type: "video/webm" }), a = document.createElement("a");
      let nombre = "moldeo"; try { nombre = ((new URLSearchParams(window.location.search).get("mol") || "moldeo").split("/").pop() || "moldeo").replace(/\.mol$/, ""); } catch (e) {}
      a.href = URL.createObjectURL(blob); a.download = nombre + "-" + new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19) + ".webm";
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      this.flash("video descargado · " + Math.round(blob.size / 1024) + " KB");
    };
    rec.start(500); this.vrec = rec; this.flash("● grabando video");
  }

  protected renderOpen() {
    const S = moSphere.SIZE, C = S / 2, P = this.project, W = this.wheel;
    this.foldCenter("◷", "tiempo");
    const items: { g: string, w: string, cls: string, fn: () => void, title: string }[] = [];
    /* FCA 18-nov: el círculo de tiempo es el transporte del proyecto — sólo ⏸/▶ y ■. Lo de antes (línea de tiempo de estados,
       REC y tomas) queda como parámetro: ?tiempo=completo */
    const T: any = (window as any);
    const tr = T.moTransport || "play";
    const CON: any = P && (P as any).console;
    items.push({ g: tr == "play" ? "⏸" : "▶", w: tr == "play" ? "pausa" : "play", cls: tr == "play" ? "go" : "",
      fn: () => { const nx = (T.moTransport || "play") == "play" ? "pause" : "play"; T.moTransport = nx;
        try { if (CON) { if (nx == "pause") CON.ConsolePause(); else CON.ConsolePlay(); } } catch (e) {}
        this.render(); this.flash(nx == "pause" ? "⏸ pausa" : "▶ play"); },
      title: "Pausa / continúa todo el proyecto (animaciones y simulaciones)" });
    items.push({ g: "■", w: "stop", cls: tr == "stop" ? "rec" : "",
      fn: () => { T.moTransport = "stop"; try { if (CON) CON.ConsoleStop(); } catch (e) {}
        this.render(); this.flash("■ stop · ▶ para empezar de nuevo"); },
      title: "Detiene y vuelve al inicio (las simulaciones vuelven a la semilla); ▶ arranca de nuevo" });
    const V: any = T.moView;
    items.push({ g: this.vrec ? "■" : "●", w: this.vrec ? "parar video" : "grabar video", cls: this.vrec ? "rec" : "",
      fn: () => { this.toggleVideo(CON); this.render(); },
      title: "Graba el lienzo en video (.webm); al parar se descarga" });
    items.push({ g: "📷", w: "captura", cls: "", fn: () => { try { V && V.screenshot(); this.flash("📷 captura"); } catch (e) { this.flash("no se pudo capturar"); } },
      title: "Captura un cuadro (PNG)" });
    items.push({ g: "⛶", w: "pantalla completa", cls: "", fn: () => { try { V && V.fullscreen(); } catch (e) {} },
      title: "Pantalla completa (ESC para salir)" });
    let completo = false; try { completo = new URLSearchParams(window.location.search).get("tiempo") == "completo"; } catch (e) {}
    if (!completo) { const pos0 = this.ringPos(items.length); items.forEach((it, k) => { const b = this.btn(it.g, it.w, it.cls, pos0[k].x, pos0[k].y, it.fn); b.title = it.title; }); return; }
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
    items.push({ g: this.recording ? "■" : "●", w: this.recording ? "parar toma" : (this.dirty ? "grabar toma · sin guardar" : "grabar toma"),
      cls: this.recording ? "rec" : (this.dirty ? "rec" : ""),
      fn: () => this.toggleRec(), title: "REC: graba los gestos del Control (presets, valores, modo, tiempo) con su ritmo" });
    items.push({ g: this.playingTake ? "■" : "▷", w: this.playingTake ? "parar" : "reproducir toma", cls: this.playingTake ? "go" : (this.take.length ? "" : "off"),
      fn: () => this.playTake(), title: "Reproduce la última toma por los mismos caminos (llega al Player)" });
    const pos = this.ringPos(items.length);
    items.forEach((it, k) => { const b = this.btn(it.g, it.w, it.cls, pos[k].x, pos[k].y, it.fn); b.title = it.title; });
  }
}
