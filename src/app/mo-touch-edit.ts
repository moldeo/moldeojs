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

  private dragId: number = null;
  private last: { x: number, y: number } = null;

  constructor(private console: any, private surface: () => HTMLElement[]) {
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
      if (Math.abs(wx - px) <= w / 2 && Math.abs(wy - py) <= h / 2) return fx;
    }
    return null;
  }

  /** escribe un número en el VAL del preset activo de ese param (mismo camino que el panel de params) */
  setNumber(fx: any, pname: string, v: number) {
    const cfg = fx.GetConfig();
    const param = cfg.GetParam(cfg.GetParamIndex(pname));
    if (!param) return;
    const idx = Math.max(0, param.GetIndexValue());
    const sub = param.m_Values[idx].m_List[0];
    sub.SetVal("" + Number(v.toFixed(4)));
    fx.ResolveValue(param, idx);
  }

  private down(e: PointerEvent) {
    const p = this.norm(e);
    this.pointers[e.pointerId] = { id: e.pointerId, type: e.pointerType, x: p.x, y: p.y };
    if (!this.enabled || !this.onSurface(e)) return;
    const fx = this.pick(p);
    this.selected = fx;
    if (this.onSelect) this.onSelect(fx);
    if (fx) {
      this.dragId = e.pointerId; this.last = p;
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
    const a = this.aspect();
    const dx = p.x - this.last.x, dy = -(p.y - this.last.y) / a;
    this.setNumber(this.selected, hp[0], this.val(cfg, hp[0]) + dx);
    this.setNumber(this.selected, hp[1], this.val(cfg, hp[1]) + dy);
    this.last = p;
    e.preventDefault();
  }

  private up(e: PointerEvent) {
    delete this.pointers[e.pointerId];
    if (this.dragId === e.pointerId) { this.dragId = null; this.last = null; }
  }

  count(): number { return Object.keys(this.pointers).length; }
}
