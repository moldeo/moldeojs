import * as MO from "moldeojs";
import * as THREE from "three";

/**
 * particlesfractal — port del plugin ParticlesFractal de Moldeo (C++/OpenGL) a moldeojs (three r110, WebGL1). FASE 1.
 * Registrado como `particlesfractal` (nombre original) y como `particle_fractal` / `semilla` / `semi` (capa «semilla» de FCA).
 * Estudio del original: .roots/moldeolab/docs/particlesfractal-original.md (§4 = la lógica que se porta acá).
 *
 * CÓMO PIENSA (igual que el original):
 *  · cada píxel de una grilla N×N (N = potencia de 2) es una CÉLULA y una PARTÍCULA a la vez;
 *  · todo nace de UNA célula madre, el píxel (0,0) = la semilla;
 *  · la genealogía está en el índice: whereIsMyFather(i,j) (pfractalA/Birth.glsl:78-130) ⇒ árbol binario implícito que llena
 *    la grilla en K = 2·log2(N) generaciones (1·2·4·…·N²);
 *  · reloj de madurez: cada paso age += incremento_madurez; con age ≥ 1−inc la célula se DIVIDE: renace (regla derecha, gira
 *    −right_rep_angle) y su hijo nace en SU posición heredando la velocidad girada +left_rep_angle (regla izquierda);
 *  · entre divisiones cada célula serpentea ±left/right_mov_angle y avanza (pos += velocidad);
 *  · el árbol se dibuja uniendo cada partícula con la posición ACTUAL de su padre (rsGeometryTreeLines ⇒ acá LineSegments).
 *
 * ESTADO EN GPU (texturas float N×N, ping-pong A/B con WebGLRenderTarget a mano — orden explícito: el motionShader lee el
 * estado de ESTE paso, cosa que GPUComputationRenderer no permite):
 *   tState  = (generación [entera], madurez, rol 0 nonato · 1 nacido/izq · 2 renacido/der, evento del paso 0 · 1 nació · 2 dividió)
 *   tMotion = (x, y, rumbo θ [rad], factor de velocidad [viscosity lo frena])
 *   tGene   = (u padre, v padre, generación de nacimiento, 1 si es la semilla) — CONSTANTE, calculada UNA vez en JS
 *             (WebGL1 / GLSL ES 1.0 no tiene operadores de bits ⇒ whereIsMyFather va en JS: pfGenealogia()).
 * La condición de nacimiento del original (GenSon/2 + scale == n−1 | n, Birth.glsl:146-185) es equivalente a
 * «padre maduro y generación del padre + 1 == generación de nacimiento de la célula» ⇒ se usa esa forma (sin bits).
 *
 * FALLBACK CPU: si el navegador no puede renderizar a texturas float (o no lee texturas en el vertex shader) corre la MISMA
 * máquina de estados en JS (Float32Array) y dibuja por atributos. `forceCPU = true` lo fuerza (test).
 *
 * PARAMS (todos FUNCTION, evaluados por nombre; si el .cfg no trae uno vale su default):
 *   nombres ORIGINALES: width/height (⇒ N = nextPow2(max)), incremento_madurez, left_rep_angle_min/max, right_rep_angle_min/max
 *   (radianes; como el original — rdivide = 1 — se usa el max), left_mov_angle_min/max, right_mov_angle_min/max (rad/paso),
 *   randomvelocity (avance por paso en centésimas de pantalla), randomvelocityx/y (rumbo inicial; default hacia arriba),
 *   viscosity (frenado por paso, 0..1), geometry_mode (0 puntos · 6 árbol), alpha, color, blending (1/5 aditivo).
 *   capa «semilla» (borrador de FCA, se usa si el .cfg NO trae el nombre original equivalente):
 *   niveles (⇒ N = 2^ceil(niveles/2)), angulo (grados ⇒ ambos rep_angle), largo (⇒ randomvelocity tal que el largo de rama ≈
 *   largo), balanceo (grados: asimetría izq/der), forma (0 nube de partículas ⇄ 1 árbol con líneas), dispersion (radio de la
 *   nube), crece (ritmo de la simulación: 0 = quieto, 1 = 60 pasos/s), lineas, tamano, pos_x, pos_y, escala.
 *
 * NO PORTADO EN FASE 1 (queda para Fase 2/3/4, ver el doc §6.3): física 3D (gravity, attractor*, randommotion, flow_*), emisores
 * (emittertype), texturas de medio, sprites/quads (geometry_mode 2/3), color/escala por célula, genoma CellCode. El original
 * tampoco interpretaba los opcodes del genoma. `multiplica` del borrador no aplica (la multiplicación es la mitosis).
 */

/** genealogía implícita del original (port de .roots/moldeolab/scripts/particlesfractal/genealogia.py) */
export function pfGenealogia(N: number): { fi: Int32Array, fj: Int32Array, gb: Int32Array, K: number } {
  const n = Math.round(Math.log2(N)), K = 2 * n;
  const fi = new Int32Array(N * N), fj = new Int32Array(N * N), gb = new Int32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i;
    if (i == 0 && j == 0) { fi[k] = 0; fj[k] = 0; gb[k] = 0; continue; }
    let a = i, b = j, s = 0;
    while (a % 2 == 0 && b % 2 == 0) { a /= 2; b /= 2; s++; }
    const p = Math.pow(2, s);
    if (b % 2 == 1) { fi[k] = a * p; fj[k] = (b - 1) * p; gb[k] = 2 * (n - s); }          // división VERTICAL (gen par)
    else { fi[k] = (a - 1) * p; fj[k] = b * p; gb[k] = 2 * (n - 1 - s) + 1; }              // división HORIZONTAL (gen impar)
  }
  return { fi, fj, gb, K };
}

const SIM_VS = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/** Birth (State): máquina de estados de pfractalA/Birth.glsl:235-331 */
const STATE_FS = `
uniform sampler2D tState; uniform sampler2D tGene; uniform float uInc; uniform float uReset;
varying vec2 vUv;
void main() {
  if (uReset > 0.5) { gl_FragColor = vec4(0.0); return; }
  vec4 s = texture2D(tState, vUv); vec4 g = texture2D(tGene, vUv);
  float M = 1.0 - uInc - 1e-4;
  if (s.b < 0.5) {                                   // nonata
    if (g.a > 0.5) { gl_FragColor = vec4(0.0, uInc, 1.0, 1.0); return; }          // BIG BANG (la semilla)
    vec4 f = texture2D(tState, g.rg);
    if (f.b > 0.5 && f.g >= M && abs(f.r + 1.0 - g.b) < 0.5) {                      // NACIMIENTO (regla izquierda)
      gl_FragColor = vec4(f.r + 1.0, uInc, 1.0, 1.0); return;
    }
    gl_FragColor = vec4(0.0); return;
  }
  if (s.g >= M) gl_FragColor = vec4(s.r + 1.0, uInc, 2.0, 2.0);                     // DIVISIÓN (regla derecha: renace)
  else gl_FragColor = vec4(s.r, s.g + uInc, s.b, 0.0);                               // maduración / migración
}`;

/** Velocity.bk + Position.bk simplificados a 2D: (x, y, θ, factor de velocidad) */
const MOTION_FS = `
uniform sampler2D tState; uniform sampler2D tMotion; uniform sampler2D tGene;
uniform float uReset, uSpeed, uVisc, uTheta0, uLRep, uRRep, uLMovMin, uLMovMax, uRMovMin, uRMovMax, uSeed, uN;
varying vec2 vUv;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec4 s = texture2D(tState, vUv);                 // estado de ESTE paso
  if (uReset > 0.5 || s.b < 0.5) { gl_FragColor = vec4(0.0, 0.0, uTheta0, 0.0); return; }
  vec4 m = texture2D(tMotion, vUv);
  if (s.a > 0.5 && s.a < 1.5) {                    // recién nacida
    vec4 g = texture2D(tGene, vUv);
    if (g.a > 0.5) { gl_FragColor = vec4(0.0, 0.0, uTheta0, 1.0); return; }        // la semilla: velocidad inicial
    vec4 f = texture2D(tMotion, g.rg);             // nace en la posición del padre, con su velocidad girada +left_rep_angle
    gl_FragColor = vec4(f.xy, f.z + uLRep, f.w); return;
  }
  if (s.a > 1.5) { gl_FragColor = vec4(m.xy, m.z - uRRep, m.w); return; }          // se dividió: gira −right_rep_angle, queda
  float r = h(vUv * uN + vec2(uSeed, uSeed * 0.37));
  m.z += s.b < 1.5 ? mix(uLMovMin, uLMovMax, r) : mix(uRMovMin, uRMovMax, r);    // serpenteo
  m.w *= (1.0 - uVisc);
  m.xy += uSpeed * m.w * vec2(cos(m.z), sin(m.z));
  gl_FragColor = m;
}`;

const DRAW_VS = `
uniform sampler2D tMotion; uniform sampler2D tState;
uniform vec2 uPos; uniform float uEsc, uForma, uDisp, uSize;
attribute vec2 aRef; attribute vec2 aCell; attribute vec2 aCloud;
#ifdef PF_CPU
attribute vec3 aMot;
#endif
varying float vAlive;
void main() {
#ifdef PF_CPU
  vec2 tree = aMot.xy; float alive = aMot.z;
#else
  vec2 tree = texture2D(tMotion, aRef).xy; float alive = step(0.5, texture2D(tState, aCell).b);
#endif
  vec2 p = uPos + mix(aCloud * uDisp, tree, uForma) * uEsc;
  vAlive = alive;
  gl_Position = alive > 0.5 ? projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = uSize;
}`;

const DRAW_FS = `
uniform vec3 uColor; uniform float uAlpha;
varying float vAlive;
void main() {
#ifdef PF_POINTS
  vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard;
#endif
  if (vAlive < 0.5) discard;
  gl_FragColor = vec4(uColor, uAlpha);
}`;

export enum moParticlesFractalParamIndex {
  PF_INLET = 0, PF_OUTLET, PF_SCRIPT, PF_ALPHA, PF_COLOR, PF_SYNC, PF_PHASE, PF_BLENDING, PF_FIRST_CUSTOM
};

export class moEffectParticlesFractal extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;
  Camera: MO.moCamera3D;
  Scene: any;

  /** lado de la grilla y cantidad de generaciones (públicos para el test headless) */
  public N = 0; public K = 0;
  /** "gpu" | "cpu" */
  public modo = "";
  /** forzar el motor CPU (test / navegadores sin float RT) */
  public forceCPU = false;
  /** debug: registra (generación de la semilla → vivas) en `historia` en cada división de la semilla */
  public debug = false;
  public historia: { gen: number, vivas: number, paso: number }[] = [];
  public pasos = 0;

  private gene: { fi: Int32Array, fj: Int32Array, gb: Int32Array, K: number };
  private R: any;
  // GPU
  private stateRT: any[] = []; private motionRT: any[] = []; private ic = 0;
  private geneTex: any; private simScene: any; private simCam: any; private simMesh: any;
  private stateMat: any; private motionMat: any;
  // CPU
  private cS: Float32Array; private cS2: Float32Array; private cM: Float32Array; private cM2: Float32Array;
  // render
  private pts: any; private lines: any; private pMat: any; private lMat: any;
  private acc = 0; private lastT = 0; private lastDur = -1; private needReset = true;
  private U: any = {};

  constructor() {
    super();
    this.SetName("particlesfractal");
  }

  Init(callback?: any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();
    if (this.PreInit((res) => { if (callback) callback(res); }) == false) return false;
    return true;
  }

  /** ¿el .cfg trae este param? (los definidos en GetDefinition existen igual, con su default) */
  private has(n: string): boolean {
    const P = this.m_Config && this.m_Config.m_ParamsByName;
    return !!(P && P[n] && P[n].m_XmlAttributes);
  }
  /** valor de un param por nombre, con default si falta o no es número */
  private num(n: string, def: number): number {
    const P = this.m_Config && this.m_Config.m_ParamsByName;
    if (!P || !P[n]) return def;
    try { const v = Number(this.m_Config.Eval(n)); return isNaN(v) ? def : v; } catch (e) { return def; }
  }

  private gridN(): number {
    let want = 16;
    if (this.has("width") || this.has("height")) want = Math.max(this.num("width", 16), this.num("height", 16));
    else if (this.has("niveles")) want = Math.pow(2, Math.ceil(Math.max(1, this.num("niveles", 8)) / 2));
    want = Math.max(2, Math.min(256, Math.round(want)));
    return Math.pow(2, Math.ceil(Math.log2(want)));
  }

  private floatRTOk(R: any): boolean {
    try {
      const caps = R.capabilities;
      if (!caps || caps.maxVertexTextures < 2) return false;
      if (!caps.isWebGL2 && !R.extensions.get("OES_texture_float")) return false;
      const rt = this.makeRT(2);
      const prev = R.getRenderTarget();
      R.setRenderTarget(rt);
      const gl = R.getContext();
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      R.setRenderTarget(prev);
      rt.dispose();
      return ok;
    } catch (e) { return false; }
  }

  private makeRT(N: number): any {
    return new THREE.WebGLRenderTarget(N, N, {
      type: THREE.FloatType, format: THREE.RGBAFormat, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping, depthBuffer: false, stencilBuffer: false,
    });
  }

  private dispose() {
    for (const rt of this.stateRT.concat(this.motionRT)) rt.dispose();
    this.stateRT = []; this.motionRT = [];
    if (this.geneTex) this.geneTex.dispose();
    for (const o of [this.pts, this.lines]) if (o) { o.geometry.dispose(); o.material.dispose(); }
    this.pts = this.lines = null;
  }

  /** arma (o rearma) todo para una grilla N×N */
  private setup(R: any, N: number) {
    this.dispose();
    this.R = R; this.N = N;
    this.gene = pfGenealogia(N); this.K = this.gene.K;
    const N2 = N * N, gene = this.gene;
    const gpu = !this.forceCPU && this.floatRTOk(R);
    this.modo = gpu ? "gpu" : "cpu";
    if (!gpu && !this.forceCPU) console.warn("particlesfractal: sin texturas float renderizables ⇒ motor CPU");

    const uv = (k: number) => [((k % N) + 0.5) / N, (Math.floor(k / N) + 0.5) / N];
    const uvF = (k: number) => [(gene.fi[k] + 0.5) / N, (gene.fj[k] + 0.5) / N];
    // nube: offset determinista en un disco (mulberry32) por célula
    let a = 0x9E3779B9 >>> 0;
    const rnd = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const cloud = new Float32Array(N2 * 2);
    for (let k = 0; k < N2; k++) { const r = Math.sqrt(rnd()), th = rnd() * Math.PI * 2; cloud[k * 2] = Math.cos(th) * r; cloud[k * 2 + 1] = Math.sin(th) * r; }

    if (gpu) {
      for (let i = 0; i < 2; i++) { this.stateRT.push(this.makeRT(N)); this.motionRT.push(this.makeRT(N)); }
      const gd = new Float32Array(N2 * 4);
      for (let k = 0; k < N2; k++) { const f = uvF(k); gd[k * 4] = f[0]; gd[k * 4 + 1] = f[1]; gd[k * 4 + 2] = gene.gb[k]; gd[k * 4 + 3] = k == 0 ? 1 : 0; }
      this.geneTex = new THREE.DataTexture(gd, N, N, THREE.RGBAFormat, THREE.FloatType);
      this.geneTex.minFilter = this.geneTex.magFilter = THREE.NearestFilter; this.geneTex.needsUpdate = true;
      if (!this.simScene) {
        this.simScene = new THREE.Scene(); this.simCam = new THREE.Camera();
        const mk = (fs: string, u: any) => new THREE.ShaderMaterial({ vertexShader: SIM_VS, fragmentShader: fs, uniforms: u, depthTest: false, depthWrite: false, blending: THREE.NoBlending });
        this.stateMat = mk(STATE_FS, { tState: { value: null }, tGene: { value: null }, uInc: { value: 0.05 }, uReset: { value: 0 } });
        const mu: any = { tState: { value: null }, tMotion: { value: null }, tGene: { value: null } };
        for (const n of ["uReset", "uSpeed", "uVisc", "uTheta0", "uLRep", "uRRep", "uLMovMin", "uLMovMax", "uRMovMin", "uRMovMax", "uSeed", "uN"]) mu[n] = { value: 0 };
        this.motionMat = mk(MOTION_FS, mu);
        this.simMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.stateMat);
        this.simMesh.frustumCulled = false; this.simScene.add(this.simMesh);
      }
      this.stateMat.uniforms.tGene.value = this.geneTex; this.motionMat.uniforms.tGene.value = this.geneTex;
    } else {
      this.cS = new Float32Array(N2 * 4); this.cS2 = new Float32Array(N2 * 4);
      this.cM = new Float32Array(N2 * 4); this.cM2 = new Float32Array(N2 * 4);
    }

    // ---- render: puntos (una célula = un punto) + líneas (hijo → padre, 2 vértices por célula salvo la semilla)
    this.U = {
      tMotion: { value: null }, tState: { value: null }, uPos: { value: new THREE.Vector2() }, uEsc: { value: 1 }, uForma: { value: 1 },
      uDisp: { value: 0.25 }, uSize: { value: 4 }, uColor: { value: new THREE.Color(1, 1, 1) }, uAlpha: { value: 1 },
    };
    const lU = Object.assign({}, this.U, { uAlpha: { value: 1 } });
    const defs: any = gpu ? {} : { PF_CPU: 1 };
    this.pMat = new THREE.ShaderMaterial({ vertexShader: DRAW_VS, fragmentShader: DRAW_FS, uniforms: this.U, defines: Object.assign({ PF_POINTS: 1 }, defs), transparent: true, depthTest: false, depthWrite: false });
    this.lMat = new THREE.ShaderMaterial({ vertexShader: DRAW_VS, fragmentShader: DRAW_FS, uniforms: lU, defines: Object.assign({}, defs), transparent: true, depthTest: false, depthWrite: false });

    const pg = new THREE.BufferGeometry();
    const pRef = new Float32Array(N2 * 2), pCl = new Float32Array(N2 * 2);
    for (let k = 0; k < N2; k++) { const u = uv(k); pRef[k * 2] = u[0]; pRef[k * 2 + 1] = u[1]; pCl[k * 2] = cloud[k * 2]; pCl[k * 2 + 1] = cloud[k * 2 + 1]; }
    pg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N2 * 3), 3));
    pg.setAttribute("aRef", new THREE.BufferAttribute(pRef, 2));
    pg.setAttribute("aCell", new THREE.BufferAttribute(pRef, 2));
    pg.setAttribute("aCloud", new THREE.BufferAttribute(pCl, 2));
    if (!gpu) pg.setAttribute("aMot", new THREE.BufferAttribute(new Float32Array(N2 * 3), 3));

    const L = (N2 - 1) * 2;
    const lg = new THREE.BufferGeometry();
    const lRef = new Float32Array(L * 2), lCell = new Float32Array(L * 2), lCl = new Float32Array(L * 2);
    for (let k = 1, v = 0; k < N2; k++, v += 2) {
      const u = uv(k), f = uvF(k), fk = gene.fj[k] * N + gene.fi[k];
      lRef.set(u, v * 2); lRef.set(f, v * 2 + 2);
      lCell.set(u, v * 2); lCell.set(u, v * 2 + 2);
      lCl.set([cloud[k * 2], cloud[k * 2 + 1]], v * 2); lCl.set([cloud[fk * 2], cloud[fk * 2 + 1]], v * 2 + 2);
    }
    lg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(L * 3), 3));
    lg.setAttribute("aRef", new THREE.BufferAttribute(lRef, 2));
    lg.setAttribute("aCell", new THREE.BufferAttribute(lCell, 2));
    lg.setAttribute("aCloud", new THREE.BufferAttribute(lCl, 2));
    if (!gpu) lg.setAttribute("aMot", new THREE.BufferAttribute(new Float32Array(L * 3), 3));

    this.pts = new THREE.Points(pg, this.pMat); this.lines = new THREE.LineSegments(lg, this.lMat);
    this.pts.frustumCulled = false; this.lines.frustumCulled = false;
    this.Scene = new MO.moSceneNode(); this.Scene.add(this.lines); this.Scene.add(this.pts);
    this.needReset = true;
  }

  /** vuelve a la semilla (y el BIG BANG ocurre en el mismo llamado: la semilla se ve aunque crece = 0) */
  public reset() { this.needReset = true; }

  private P: any = {};
  private readParams() {
    const P = this.P;
    P.inc = Math.max(0.001, Math.min(0.5, this.num("incremento_madurez", 0.05)));
    const period = Math.max(1, (1 - 2 * P.inc) / P.inc + 1);   // pasos entre divisiones
    const deg = Math.PI / 180, bal = this.num("balanceo", 0) * deg;
    const ang = this.has("angulo") ? this.num("angulo", 28.6) * deg : 0.5;
    P.lRep = (this.has("left_rep_angle_max") || this.has("left_rep_angle_min") ? this.num("left_rep_angle_max", this.num("left_rep_angle_min", 0.5)) : ang) + bal;
    P.rRep = (this.has("right_rep_angle_max") || this.has("right_rep_angle_min") ? this.num("right_rep_angle_max", this.num("right_rep_angle_min", 0.5)) : ang) - bal;
    P.lMovMin = this.num("left_mov_angle_min", 0); P.lMovMax = this.num("left_mov_angle_max", 0);
    P.rMovMin = this.num("right_mov_angle_min", 0); P.rMovMax = this.num("right_mov_angle_max", 0);
    if (this.has("randomvelocity")) P.speed = this.num("randomvelocity", 0.4) * 0.01;
    else P.speed = this.num("largo", 0.08) / period;
    const vx = this.has("randomvelocityx") ? this.num("randomvelocityx", 0) : 0, vy = this.has("randomvelocityy") ? this.num("randomvelocityy", 1) : 1;
    P.theta0 = (vx == 0 && vy == 0) ? Math.PI / 2 : Math.atan2(vy, vx);
    P.visc = Math.max(0, Math.min(1, this.num("viscosity", 0)));
    P.crece = Math.max(0, this.num("crece", 1));
  }

  private gpuStep(reset: boolean) {
    const R = this.R, P = this.P, a = this.ic, b = 1 - a;
    const prev = R.getRenderTarget();
    const su = this.stateMat.uniforms, mu = this.motionMat.uniforms;
    su.tState.value = this.stateRT[a].texture; su.uInc.value = P.inc; su.uReset.value = reset ? 1 : 0;
    this.simMesh.material = this.stateMat; R.setRenderTarget(this.stateRT[b]); R.render(this.simScene, this.simCam);
    mu.tState.value = this.stateRT[b].texture; mu.tMotion.value = this.motionRT[a].texture;
    mu.uReset.value = reset ? 1 : 0; mu.uSpeed.value = P.speed; mu.uVisc.value = P.visc; mu.uTheta0.value = P.theta0;
    mu.uLRep.value = P.lRep; mu.uRRep.value = P.rRep; mu.uLMovMin.value = P.lMovMin; mu.uLMovMax.value = P.lMovMax;
    mu.uRMovMin.value = P.rMovMin; mu.uRMovMax.value = P.rMovMax; mu.uSeed.value = (this.pasos % 997) * 1.618; mu.uN.value = this.N;
    this.simMesh.material = this.motionMat; R.setRenderTarget(this.motionRT[b]); R.render(this.simScene, this.simCam);
    R.setRenderTarget(prev);
    this.ic = b;
  }

  /** la MISMA máquina de estados en JS (fallback) */
  private cpuStep(reset: boolean) {
    const N = this.N, N2 = N * N, P = this.P, g = this.gene, S = this.cS, S1 = this.cS2, Mo = this.cM, M1 = this.cM2;
    if (reset) { S.fill(0); Mo.fill(0); return; }
    const M = 1 - P.inc - 1e-4;
    for (let k = 0; k < N2; k++) {
      const o = k * 4;
      if (S[o + 2] < 0.5) {
        if (k == 0) { S1.set([0, P.inc, 1, 1], o); continue; }
        const f = (g.fj[k] * N + g.fi[k]) * 4;
        if (S[f + 2] > 0.5 && S[f + 1] >= M && Math.abs(S[f] + 1 - g.gb[k]) < 0.5) S1.set([S[f] + 1, P.inc, 1, 1], o);
        else S1.set([0, 0, 0, 0], o);
      } else if (S[o + 1] >= M) S1.set([S[o] + 1, P.inc, 2, 2], o);
      else S1.set([S[o], S[o + 1] + P.inc, S[o + 2], 0], o);
    }
    for (let k = 0; k < N2; k++) {
      const o = k * 4;
      if (S1[o + 2] < 0.5) { M1.set([0, 0, P.theta0, 0], o); continue; }
      if (S1[o + 3] > 0.5 && S1[o + 3] < 1.5) {
        if (k == 0) { M1.set([0, 0, P.theta0, 1], o); continue; }
        const f = (g.fj[k] * N + g.fi[k]) * 4;
        M1.set([Mo[f], Mo[f + 1], Mo[f + 2] + P.lRep, Mo[f + 3]], o); continue;
      }
      if (S1[o + 3] > 1.5) { M1.set([Mo[o], Mo[o + 1], Mo[o + 2] - P.rRep, Mo[o + 3]], o); continue; }
      const r = Math.random();
      const th = Mo[o + 2] + (S1[o + 2] < 1.5 ? P.lMovMin + (P.lMovMax - P.lMovMin) * r : P.rMovMin + (P.rMovMax - P.rMovMin) * r);
      const w = Mo[o + 3] * (1 - P.visc);
      M1.set([Mo[o] + P.speed * w * Math.cos(th), Mo[o + 1] + P.speed * w * Math.sin(th), th, w], o);
    }
    this.cS = S1; this.cS2 = S; this.cM = M1; this.cM2 = Mo;
  }

  private step(reset = false) {
    if (this.modo == "gpu") this.gpuStep(reset); else this.cpuStep(reset);
    if (reset) { this.pasos = 0; this.historia = []; return; }
    this.pasos++;
    if (this.debug) {
      const st = this.readState();
      const gen = st[0], last = this.historia[this.historia.length - 1];
      if (!last || last.gen != gen) {
        let vivas = 0; for (let k = 0; k < this.N * this.N; k++) if (st[k * 4 + 2] > 0.5) vivas++;
        this.historia.push({ gen, vivas, paso: this.pasos });
      }
    }
  }

  private readTex(rts: any[], cpu: Float32Array): Float32Array {
    if (this.modo != "gpu") return cpu;
    const out = new Float32Array(this.N * this.N * 4);
    this.R.readRenderTargetPixels(rts[this.ic], 0, 0, this.N, this.N, out);
    return out;
  }
  private readState() { return this.readTex(this.stateRT, this.cS); }
  private readMotion() { return this.readTex(this.motionRT, this.cM); }

  /** para el test headless: vivas, generación de la semilla, vivas por generación de nacimiento, bbox del árbol */
  public pfStats(): any {
    if (!this.N) return null;
    const st = this.readState(), mo = this.readMotion(), N2 = this.N * this.N;
    const porGen = new Array(this.K + 1).fill(0);
    let vivas = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let k = 0; k < N2; k++) {
      if (st[k * 4 + 2] < 0.5) continue;
      vivas++; porGen[this.gene.gb[k]]++;
      const x = mo[k * 4], y = mo[k * 4 + 1];
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
    }
    const r = (v: number) => +v.toFixed(4);
    return { modo: this.modo, N: this.N, K: this.K, pasos: this.pasos, genSemilla: st[0], vivas, porGen,
      bbox: vivas ? { ancho: r(x1 - x0), alto: r(y1 - y0) } : null, lineas: !!(this.lines && this.lines.visible) };
  }

  Draw(p_tempo: MO.moTempo, p_parentstate: MO.moEffectState = null): void {
    this.BeginDraw(p_tempo, p_parentstate);
    if (this.RM == undefined) return;
    const R: any = this.RM.m_Renderer;

    const N = this.gridN();
    if (!this.Scene || N != this.N || (this.forceCPU && this.modo == "gpu")) this.setup(R, N);
    this.readParams();

    // si el tiempo del efecto vuelve atrás (rewind / reinicio) ⇒ de nuevo a la semilla
    try { const d = Number((this as any).m_EffectState.tempo.Duration()); if (d < this.lastDur - 200) this.needReset = true; this.lastDur = d; } catch (e) {}

    if (this.needReset) { this.needReset = false; this.step(true); this.step(); this.acc = 0; }
    const now = performance.now(), dt = this.lastT ? Math.min(0.25, (now - this.lastT) / 1000) : 1 / 60;
    this.lastT = now;
    this.acc += dt * 60 * this.P.crece;
    let n = Math.floor(this.acc); this.acc -= n; n = Math.min(n, 4);
    for (let i = 0; i < n; i++) this.step();

    // ---- render
    const U = this.U, lU = this.lMat.uniforms;
    const forma = Math.max(0, Math.min(1, this.num("forma", 1)));
    const alpha = Math.max(0, Math.min(1, this.num("alpha", 1)));
    const rgb: any = this.m_Config.EvalColor("color");
    U.uPos.value.set(this.num("pos_x", 0), this.num("pos_y", -0.25)); U.uEsc.value = this.num("escala", 1);
    U.uForma.value = forma; U.uDisp.value = this.num("dispersion", 0.25); U.uSize.value = Math.max(0.5, this.num("tamano", 4));
    U.uColor.value.setRGB(rgb.r, rgb.g, rgb.b); U.uAlpha.value = alpha;
    lU.uAlpha.value = alpha * Math.max(0, Math.min(1, this.num("lineas", 1))) * forma;
    const gm = this.has("geometry_mode") ? Math.round(this.num("geometry_mode", 6)) : 6;
    this.lines.visible = gm != 0 && lU.uAlpha.value > 0.001;
    const add = [1, 5].indexOf(Math.round(this.num("blending", 0))) >= 0;
    for (const m of [this.pMat, this.lMat]) m.blending = add ? THREE.AdditiveBlending : THREE.NormalBlending;

    if (this.modo == "gpu") {
      U.tMotion.value = this.motionRT[this.ic].texture; U.tState.value = this.stateRT[this.ic].texture;
    } else this.fillCPU();

    if (this.Camera == undefined) this.Camera = new MO.moCamera3D();
    const rs: MO.moVector2 = new MO.moVector2();
    this.RM.m_Renderer.getSize(rs);
    this.GL.SetDefaultOrthographicView(rs.width, rs.height);
    this.Camera.projectionMatrix = this.GL.GetProjectionMatrix();
    this.RM.Render(this.Scene, this.Camera);
    this.EndDraw();
  }

  /** fallback CPU: copia (x, y, viva) a los atributos de puntos y líneas */
  private fillCPU() {
    const N = this.N, N2 = N * N, S = this.cS, Mo = this.cM, g = this.gene;
    const pa = this.pts.geometry.attributes.aMot, la = this.lines.geometry.attributes.aMot;
    const p = pa.array as Float32Array, l = la.array as Float32Array;
    for (let k = 0; k < N2; k++) { p[k * 3] = Mo[k * 4]; p[k * 3 + 1] = Mo[k * 4 + 1]; p[k * 3 + 2] = S[k * 4 + 2] > 0.5 ? 1 : 0; }
    for (let k = 1, v = 0; k < N2; k++, v += 2) {
      const f = g.fj[k] * N + g.fi[k], alive = p[k * 3 + 2];
      l[v * 3] = p[k * 3]; l[v * 3 + 1] = p[k * 3 + 1]; l[v * 3 + 2] = alive;
      l[v * 3 + 3] = p[f * 3]; l[v * 3 + 4] = p[f * 3 + 1]; l[v * 3 + 5] = alive;
    }
    pa.needsUpdate = true; la.needsUpdate = true;
  }

  Update(p_Event: MO.moEventList): void { super.Update(p_Event); }

  GetDefinition(p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {
    p_configdefinition = super.GetDefinition(p_configdefinition);
    const F = MO.moParamType.MO_PARAM_FUNCTION;
    let idx = moParticlesFractalParamIndex.PF_FIRST_CUSTOM;
    p_configdefinition.Add("blending", MO.moParamType.MO_PARAM_BLENDING, moParticlesFractalParamIndex.PF_BLENDING, new MO.moValue("1", "NUM"));
    const defs: [string, string][] = [
      // nombres del .cfg original
      ["width", "16"], ["height", "16"], ["incremento_madurez", "0.05"],
      ["left_rep_angle_min", "0.5"], ["left_rep_angle_max", "0.5"], ["right_rep_angle_min", "0.5"], ["right_rep_angle_max", "0.5"],
      ["left_mov_angle_min", "0"], ["left_mov_angle_max", "0"], ["right_mov_angle_min", "0"], ["right_mov_angle_max", "0"],
      ["randomvelocity", "0.4"], ["randomvelocityx", "0"], ["randomvelocityy", "1"], ["viscosity", "0"], ["geometry_mode", "6"],
      // capa «semilla»
      ["pos_x", "0.0"], ["pos_y", "-0.25"], ["escala", "1.0"], ["forma", "1.0"], ["dispersion", "0.25"], ["crece", "1.0"],
      ["lineas", "1.0"], ["tamano", "4"], ["niveles", "8"], ["angulo", "28.6"], ["largo", "0.08"], ["balanceo", "0"]];
    for (const [n, v] of defs) p_configdefinition.Add(n, F, idx++, new MO.moValue(v, "FUNCTION"));
    return this.m_Config.GetConfigDefinition();
  }
}

/** alias con los nombres de FCA: el mismo motor */
export class moEffectParticleFractalGPU extends moEffectParticlesFractal { constructor() { super(); this.SetName("particle_fractal"); } }
export class moEffectSemilla extends moEffectParticlesFractal { constructor() { super(); this.SetName("semilla"); } }
export class moEffectSemi extends moEffectParticlesFractal { constructor() { super(); this.SetName("semi"); } }
