/**
 * #918 E1 — tocar y arrastrar sobre la pantalla en modo edición (mouse, dedo y lápiz por igual: Pointer Events).
 *
 *  - pointerdown sobre el lienzo ⇒ se elige la capa que está debajo (la de más arriba primero)
 *  - arrastrar ⇒ mueve esa capa (escribe sus params de posición en el VAL del preset activo)
 *  - varios dedos se registran en `pointers` (base de pellizcar / tracker.fuente=touch)
 *
 * Por ahora sabe tocar el plugin `image` (pos_cuad_x/y, anc_cuad_x, alt_cuad_y). Otros plugins se suman
 * declarando su "caja" en HIT_PARAMS.
 */

export interface moPointer { id: number; type: string; x: number; y: number; }

/** params que definen la caja de cada plugin: [pos x, pos y, ancho, alto] */
const HIT_PARAMS: { [plugin: string]: [string, string, string, string] } = {
  image: ["pos_cuad_x", "pos_cuad_y", "anc_cuad_x", "alt_cuad_y"],
};

export class moTouchEdit {

  enabled: boolean = false;
  pointers: { [id: number]: moPointer } = {};
  selected: any = null;          /** el efecto elegido */
  onSelect: (fx: any) => void = null;
  history: any = null;            /** #918 H1: moHistory (foto antes de cada gesto) */
  channel: any = null;            /** #918 D2 */
  applying: boolean = false;
  private recorded: boolean = false;
  /** F15: el primer valueset de un gesto lleva rec:true ⇒ el Player hace UNA foto por gesto, como el Control */
  recNext: boolean = false;

  private dragId: number = null;
  private last: { x: number, y: number } = null;

  /** ?log=1 ⇒ cada evento va a un registrador local (http://<host>:8899) para ver la sesión de prueba */
  logOn: boolean = /[?&]log=1/.test(window.location.search);
  /** botón «Log» de la interfaz */
  toggleLog(): boolean {
    this.logOn = !this.logOn;
    if (this.logOn) this.log("start", { ua: navigator.userAgent, w: window.innerWidth, h: window.innerHeight, touch: navigator.maxTouchPoints, edit: this.enabled });
    return this.logOn;
  }
  private logBuf: any[] = [];
  log(ev: string, data: any = {}) {
    if (!this.logOn) return;
    this.logBuf.push(Object.assign({ t: Math.round(performance.now()), ev }, data));
    if (this.logBuf.length == 1) setTimeout(() => this.flush(), 400);
  }
  private flush() {
    const b = this.logBuf; this.logBuf = [];
    try { fetch("http://" + window.location.hostname + ":8899/log", { method: "POST", body: JSON.stringify(b) }).catch(() => {}); } catch (x) {}
  }

  constructor(private console: any, private surface: () => HTMLElement[]) {
    window.addEventListener("lostpointercapture", (e: PointerEvent) => this.log("lostcapture", { id: e.pointerId }));
    this.log("start", { ua: navigator.userAgent, w: window.innerWidth, h: window.innerHeight, touch: navigator.maxTouchPoints });
    window.addEventListener("pointerdown", (e) => this.down(e), { passive: false });
    window.addEventListener("pointermove", (e) => this.move(e), { passive: false });
    window.addEventListener("pointerup", (e) => this.up(e));
    window.addEventListener("pointercancel", (e) => this.up(e));
  }

  /** coordenadas 0..1 del lienzo */
  private norm(e: PointerEvent): { x: number, y: number } {
    /* el lienzo del render = el canvas visible más grande (hay otros ocultos: capturas, video) */
    let r: any = null, area = 0;
    document.querySelectorAll("canvas").forEach((c) => {
      const b = c.getBoundingClientRect();
      if (b.width * b.height > area) { area = b.width * b.height; r = b; }
    });
    if (!r) r = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }

  private aspect(): number {
    try { return this.console.GetResourceManager().GetRenderMan().Proportion() || 1; } catch (x) { return 1; }
  }

  /** sólo el fondo del lienzo cuenta como "pantalla"; nodos, paneles y botones siguen siendo de la interfaz */
  private onSurface(e: PointerEvent): boolean {
    const t = e.target as HTMLElement;
    return t && (t.tagName == "CANVAS" || t.id == "moConnect" || t.id == "moCanvas" || this.surface().indexOf(t) >= 0);
  }

  private val(cfg: any, name: string): number {
    try { return Number(cfg.Eval(name)); } catch (x) { return 0; }
  }

  private alphaCache: Map<any, { w: number, h: number, data: Uint8ClampedArray }> = new Map();
  /** alfa (0..1) de la textura de la capa en (u, v) — v de arriba hacia abajo; null si no se puede leer */
  private pixelAlpha(cfg: any, u: number, v: number): number {
    try {
      const t: any = cfg.Texture("texture");
      const img: any = t && t._texture && t._texture.image;
      if (!img || !img.width) return null;
      let c = this.alphaCache.get(img);
      if (!c) {
        const k = Math.min(1, 512 / Math.max(img.width, img.height));
        const cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(img.width * k)); cv.height = Math.max(1, Math.round(img.height * k));
        const g = cv.getContext("2d"); g.drawImage(img, 0, 0, cv.width, cv.height);
        c = { w: cv.width, h: cv.height, data: g.getImageData(0, 0, cv.width, cv.height).data };
        this.alphaCache.set(img, c);
      }
      const x = Math.min(c.w - 1, Math.max(0, Math.floor(u * c.w))), y = Math.min(c.h - 1, Math.max(0, Math.floor(v * c.h)));
      return c.data[(y * c.w + x) * 4 + 3] / 255;
    } catch (e) { return null; }
  }

  /** la capa de más arriba que contiene el punto (coordenadas de mundo: x -0.5..0.5, y según el aspecto) */
  pick(p: { x: number, y: number }): any {
    const a = this.aspect();
    const wx = p.x - 0.5, wy = (0.5 - p.y) / a;
    const fxs = this.console.m_EffectManager.Effects();
    for (let i = fxs.length - 1; i >= 0; i--) {
      const fx = fxs[i];
      if (!fx || !fx.Activated || !fx.Activated()) continue;
      const hp = HIT_PARAMS["" + fx.GetName()];
      if (!hp) continue;
      const cfg = fx.GetConfig();
      const px = this.val(cfg, hp[0]), py = this.val(cfg, hp[1]);
      const w = this.val(cfg, hp[2]), h = this.val(cfg, hp[3]) / a;
      if (!(Math.abs(wx - px) <= w / 2 && Math.abs(wy - py) <= h / 2)) continue;
      /* P9-T1: una capa invisible (lluvia en «despejado») o un píxel transparente (el cielo de la pradera) no se
         agarran: el toque sigue a la capa de abajo. Sin imagen legible, vale la caja como antes. */
      const la = this.val(cfg, "alpha");
      if (la < 0.05) continue;
      const pa = this.pixelAlpha(cfg, (wx - px) / w + 0.5, 0.5 - (wy - py) / h);
      if (pa !== null && pa * Math.min(1, la) < 0.3) continue;      /* casi transparente (bruma, borde): pasa de largo */
      return fx;
    }
    return null;
  }

  /** escribe un número en el VAL del preset activo de ese param (mismo camino que el panel de params) */
  setNumber(fx: any, pname: string, v: number) {
    const cfg = fx.GetConfig();
    const param = cfg.GetParam(cfg.GetParamIndex(pname));
    if (!param) return;
    const before = Math.max(0, param.GetIndexValue());
    const idx = cfg.ForkForEdit ? cfg.ForkForEdit(param) : before;   /* #918 E1.7: no mover otros presets */
    if (idx != before) { fx.ResolveValue(param, idx); this.log("fork", { param: pname, from: before, to: idx }); }
    const sub = param.m_Values[idx].m_List[0];
    sub.SetVal("" + Number(v.toFixed(4)));
    fx.ResolveValue(param, idx);
    if (this.channel && !this.applying) { this.channel.send({ verb: "valueset", label: "" + fx.GetLabelName(), param: pname, value: Number(v.toFixed(4)), rec: this.recNext }); this.recNext = false; }
  }

  private down(e: PointerEvent) {
    const p = this.norm(e);
    this.pointers[e.pointerId] = { id: e.pointerId, type: e.pointerType, x: p.x, y: p.y };
    const t = e.target as HTMLElement;
    this.log("down", { id: e.pointerId, type: e.pointerType, x: +p.x.toFixed(3), y: +p.y.toFixed(3), target: t && (t.id || t.tagName), edit: this.enabled, surface: this.onSurface(e), n: this.count() });
    if (!this.enabled || !this.onSurface(e)) return;
    const fx = this.pick(p);
    this.log("pick", { fx: fx ? "" + fx.GetLabelName() : null });
    this.selected = fx;
    if (this.onSelect) this.onSelect(fx);
    if (fx) {
      this.dragId = e.pointerId; this.last = p; this.recorded = false;
      try { (e.target as HTMLElement).setPointerCapture(e.pointerId); } catch (x) {}
      e.preventDefault();
    }
  }

  private move(e: PointerEvent) {
    const p = this.norm(e);
    if (this.pointers[e.pointerId]) { this.pointers[e.pointerId].x = p.x; this.pointers[e.pointerId].y = p.y; }
    if (this.dragId !== e.pointerId || !this.selected) return;
    const hp = HIT_PARAMS["" + this.selected.GetName()];
    const cfg = this.selected.GetConfig();
    if (!this.recorded) { if (this.history) this.history.record(this.selected, "mover"); this.recorded = true; this.recNext = true; }
    const a = this.aspect();
    const dx = p.x - this.last.x, dy = -(p.y - this.last.y) / a;
    this.setNumber(this.selected, hp[0], this.val(cfg, hp[0]) + dx);
    this.setNumber(this.selected, hp[1], this.val(cfg, hp[1]) + dy);
    this.last = p;
    this.moves++;
    if (this.moves % 10 == 0) this.log("drag", { x: +this.val(cfg, hp[0]).toFixed(3), y: +this.val(cfg, hp[1]).toFixed(3) });
    e.preventDefault();
  }
  private moves: number = 0;

  private up(e: PointerEvent) {
    if (this.dragId === e.pointerId || e.type == "pointercancel")
      this.log(e.type == "pointercancel" ? "CANCEL" : "up", { id: e.pointerId, moves: this.moves, type: e.pointerType });
    if (this.dragId === e.pointerId) this.moves = 0;
    delete this.pointers[e.pointerId];
    if (this.dragId === e.pointerId) { this.dragId = null; this.last = null; }
  }

  count(): number { return Object.keys(this.pointers).length; }
}
