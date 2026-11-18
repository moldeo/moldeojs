import * as MO from "moldeojs";
import * as THREE from "three";

/**
 * semilla_cpu — borrador CPU SIN ESTADO de la «semilla» (Moldeo 2.0, FCA 18-nov-2026). Desde la Fase 1 del port de
 * ParticlesFractal, `particle_fractal` / `semilla` / `semi` usan el motor GPU (particlesfractalgpu.ts); este queda como
 * `semilla_cpu` (árbol explícito niveles×ramas, `crece` puede ir y volver).
 * Una MÓNADA: una sola semilla con un genoma (sus params) del que salen N nodos. Cada nodo es a la vez PARTÍCULA y NODO DE ÁRBOL:
 *   · posición en la NUBE  = dispersión alrededor de la semilla (determinista por `azar`), abierta según `multiplica`
 *   · posición en el ÁRBOL = ramificación recursiva (`ramas` hijos por nivel, `angulo`, `reduccion`, hasta `niveles`), brotada según `crece`
 *   · `forma` 0..1 interpola nube ⇄ árbol: la misma semilla se dispersa en partículas o se organiza en árbol.
 * Todos los params son FUNCTION ⇒ se animan con expresiones (seconds, escena.ritmo, otro.param…). Coordenadas = las de `image`
 * (x ∈ [-0.5, 0.5] el ancho de pantalla, y hacia arriba).
 * Params: pos_x pos_y escala · multiplica dispersion · crece niveles ramas angulo reduccion largo balanceo · forma lineas tamano · azar
 *         alpha color blending (0 transparencia · 1/5 aditivo).
 */
export enum moParticleFractalParamIndex {
  PF_INLET = 0, PF_OUTLET, PF_SCRIPT, PF_ALPHA, PF_COLOR, PF_SYNC, PF_PHASE,
  PF_BLENDING, PF_POSX, PF_POSY, PF_ESCALA, PF_MULTIPLICA, PF_DISPERSION, PF_CRECE, PF_NIVELES, PF_RAMAS, PF_ANGULO,
  PF_REDUCCION, PF_LARGO, PF_BALANCEO, PF_FORMA, PF_LINEAS, PF_TAMANO, PF_AZAR
};

const MAXN = 2047;

export class moEffectParticleFractal extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;
  Camera: MO.moCamera3D;
  Scene: any;
  private pts: any; private lines: any; private pMat: any; private lMat: any;
  private pPos: Float32Array; private lPos: Float32Array;
  private genKey = ""; private nodes: { parent: number, level: number, j: number, rnd: number[] }[] = [];
  /** cuántos nodos efectivos tiene el genoma actual (lo lee el test headless) */
  public nNodos = 0;

  constructor() {
    super();
    this.SetName("semilla_cpu");
  }

  Init(callback?: any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
    if (this.PreInit((res) => { if (callback) callback(res); }) == false) return false;
    return true;
  }

  /** valor de un param por nombre; si el .cfg no lo trae, el default (así un .cfg viejo o mínimo no rompe) */
  private num(n: string, def: number): number {
    const P = this.m_Config && this.m_Config.m_ParamsByName;
    if (!P || !P[n]) return def;
    try { const v = Number(this.m_Config.Eval(n)); return isNaN(v) ? def : v; } catch (e) { return def; }
  }

  /** pseudo-azar determinista (mulberry32) ⇒ la misma semilla da siempre la misma nube y el mismo árbol */
  private rng(seed: number) {
    let a = (seed * 2654435761) >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  /** genoma ⇒ lista de nodos (padre, nivel, índice entre hermanos, azares propios). Sólo se rehace si cambian niveles/ramas/azar. */
  private genome(niveles: number, ramas: number, azar: number) {
    const key = niveles + "|" + ramas + "|" + azar;
    if (key == this.genKey) return;
    this.genKey = key;
    const R = this.rng(Math.floor(azar) + 1);
    const nodes = [{ parent: -1, level: 0, j: 0, rnd: [R(), R(), R(), R()] }];   // 0 = la semilla
    nodes.push({ parent: 0, level: 1, j: 0, rnd: [R(), R(), R(), R()] });        // 1 = tronco
    let frontier = [1];
    for (let lv = 2; lv <= niveles && nodes.length < MAXN; lv++) {
      const next: number[] = [];
      for (const p of frontier) for (let j = 0; j < ramas && nodes.length < MAXN; j++) {
        nodes.push({ parent: p, level: lv, j, rnd: [R(), R(), R(), R()] }); next.push(nodes.length - 1);
      }
      frontier = next;
    }
    this.nodes = nodes; this.nNodos = nodes.length;
  }

  private build() {
    this.pPos = new Float32Array(MAXN * 3); this.lPos = new Float32Array(MAXN * 6);
    const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(this.pPos, 3));
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.BufferAttribute(this.lPos, 3));
    this.pMat = new THREE.PointsMaterial({ size: 4, sizeAttenuation: false, transparent: true, depthTest: false });
    this.lMat = new THREE.LineBasicMaterial({ transparent: true, depthTest: false });
    this.pts = new THREE.Points(pg, this.pMat); this.lines = new THREE.LineSegments(lg, this.lMat);
    this.pts.frustumCulled = false; this.lines.frustumCulled = false;
    this.Scene = new MO.moSceneNode(); this.Scene.add(this.lines); this.Scene.add(this.pts);
  }

  Draw(p_tempo: MO.moTempo, p_parentstate: MO.moEffectState = null): void {
    this.BeginDraw(p_tempo, p_parentstate);
    if (this.RM == undefined) return;
    if (!this.Scene) this.build();

    const niveles = Math.max(1, Math.min(10, Math.round(this.num("niveles", 6))));
    const ramas = Math.max(1, Math.min(4, Math.round(this.num("ramas", 2))));
    this.genome(niveles, ramas, this.num("azar", 1));

    const px = this.num("pos_x", 0), py = this.num("pos_y", -0.2), esc = this.num("escala", 1);
    const mult = Math.max(0, Math.min(1, this.num("multiplica", 1))), disp = this.num("dispersion", 0.25);
    const crece = Math.max(0, Math.min(1, this.num("crece", 1))), forma = Math.max(0, Math.min(1, this.num("forma", 1)));
    const ang = this.num("angulo", 28) * Math.PI / 180, red = this.num("reduccion", 0.72), largo = this.num("largo", 0.12);
    const bal = this.num("balanceo", 0) * Math.PI / 180;
    const lineas = Math.max(0, Math.min(1, this.num("lineas", 1))), alpha = this.num("alpha", 1);

    // árbol: posición plena de cada nodo + ángulo y largo heredados
    const N = this.nodes.length, tx = new Float32Array(N), ty = new Float32Array(N), ta = new Float32Array(N), tl = new Float32Array(N);
    const vivos = crece * niveles;            // niveles vivos (fraccional: el último brota de a poco)
    const gx = new Float32Array(N), gy = new Float32Array(N);   // posición BROTADA (con crece)
    for (let i = 0; i < N; i++) {
      const nd = this.nodes[i];
      if (nd.parent < 0) { tx[i] = 0; ty[i] = 0; ta[i] = Math.PI / 2; tl[i] = largo; gx[i] = 0; gy[i] = 0; continue; }
      const p = nd.parent;
      const spread = ramas > 1 ? (nd.j - (ramas - 1) / 2) * ang : 0;
      const jit = (nd.rnd[0] - 0.5) * ang * 0.35;
      ta[i] = nd.level == 1 ? Math.PI / 2 + bal * 0.3 : ta[p] + spread + jit + bal * nd.level / niveles;
      tl[i] = nd.level == 1 ? largo : tl[p] * red * (0.85 + 0.3 * nd.rnd[1]);
      tx[i] = tx[p] + Math.cos(ta[i]) * tl[i]; ty[i] = ty[p] + Math.sin(ta[i]) * tl[i];
      const g = Math.max(0, Math.min(1, vivos - (nd.level - 1)));   // cuánto brotó este nodo
      gx[i] = gx[p] + (tx[i] - tx[p]) * g; gy[i] = gy[p] + (ty[i] - ty[p]) * g;
    }
    // nube: offset determinista; `multiplica` abre la nube nodo a nodo desde la semilla
    const abiertos = mult * N;
    for (let i = 0; i < N; i++) {
      const nd = this.nodes[i];
      const r = disp * Math.sqrt(nd.rnd[2]), a = nd.rnd[3] * Math.PI * 2;
      const o = Math.max(0, Math.min(1, abiertos - i));
      const cx = Math.cos(a) * r * o, cy = Math.sin(a) * r * o;
      const x = cx + (gx[i] - cx) * forma, y = cy + (gy[i] - cy) * forma;
      this.pPos[i * 3] = px + x * esc; this.pPos[i * 3 + 1] = py + y * esc; this.pPos[i * 3 + 2] = 0;
    }
    // ramas: segmento nodo→padre sobre las posiciones ya mezcladas
    let k = 0;
    for (let i = 1; i < N; i++) {
      const p = this.nodes[i].parent;
      this.lPos.set([this.pPos[p * 3], this.pPos[p * 3 + 1], 0, this.pPos[i * 3], this.pPos[i * 3 + 1], 0], k * 6); k++;
    }
    this.pts.geometry.setDrawRange(0, N); this.pts.geometry.attributes.position.needsUpdate = true;
    this.lines.geometry.setDrawRange(0, k * 2); this.lines.geometry.attributes.position.needsUpdate = true;

    const rgb: any = this.m_Config.EvalColor("color");
    const add = [1, 5].indexOf(Math.round(this.num("blending", 0))) >= 0;
    for (const m of [this.pMat, this.lMat]) {
      m.color = new THREE.Color(rgb.r, rgb.g, rgb.b);
      m.blending = add ? THREE.AdditiveBlending : THREE.NormalBlending;
    }
    this.pMat.size = Math.max(0.5, this.num("tamano", 4));
    this.pMat.opacity = Math.max(0, Math.min(1, alpha));
    this.lMat.opacity = Math.max(0, Math.min(1, alpha * lineas * forma));
    this.lines.visible = this.lMat.opacity > 0.001;

    if (this.Camera == undefined) this.Camera = new MO.moCamera3D();
    const rs: MO.moVector2 = new MO.moVector2();
    this.RM.m_Renderer.getSize(rs);
    this.GL.SetDefaultOrthographicView(rs.width, rs.height);
    this.Camera.projectionMatrix = this.GL.GetProjectionMatrix();
    this.RM.Render(this.Scene, this.Camera);
    this.EndDraw();
  }

  Update(p_Event: MO.moEventList): void { super.Update(p_Event); }

  GetDefinition(p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {
    p_configdefinition = super.GetDefinition(p_configdefinition);
    const I = moParticleFractalParamIndex, F = MO.moParamType.MO_PARAM_FUNCTION;
    p_configdefinition.Add("blending", MO.moParamType.MO_PARAM_BLENDING, I.PF_BLENDING, new MO.moValue("1", "NUM"));
    const defs: [string, number, string][] = [
      ["pos_x", I.PF_POSX, "0.0"], ["pos_y", I.PF_POSY, "-0.2"], ["escala", I.PF_ESCALA, "1.0"],
      ["multiplica", I.PF_MULTIPLICA, "1.0"], ["dispersion", I.PF_DISPERSION, "0.25"],
      ["crece", I.PF_CRECE, "1.0"], ["niveles", I.PF_NIVELES, "6"], ["ramas", I.PF_RAMAS, "2"], ["angulo", I.PF_ANGULO, "28"],
      ["reduccion", I.PF_REDUCCION, "0.72"], ["largo", I.PF_LARGO, "0.12"], ["balanceo", I.PF_BALANCEO, "0"],
      ["forma", I.PF_FORMA, "1.0"], ["lineas", I.PF_LINEAS, "1.0"], ["tamano", I.PF_TAMANO, "4"], ["azar", I.PF_AZAR, "1"]];
    for (const [n, i, v] of defs) p_configdefinition.Add(n, F, i, new MO.moValue(v, "FUNCTION"));
    return this.m_Config.GetConfigDefinition();
  }
}
