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
 *   tMotion = (x, y, z, factor de velocidad [viscosity lo frena])
 *   tHead   = (rumbo θ [rad], elevación φ [rad], 0, 0) — Fase 3D (18-nov): el plano de división gira `angulo_z` por generación
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
 *   viscosity (frenado por paso, 0..1), alpha, color, blending (1/5 aditivo).
 *   geometry_mode — DISCRETO (FCA 18-nov): con `options="puntos,árbol (líneas),puntos + líneas"` en el PARAM el valor es el
 *   índice 0 puntos · 1 árbol (sólo líneas hijo→padre) · 2 puntos + líneas · 3 tela · 4 tela + árbol (la etiqueta manda:
 *   «tela/malla/mesh» ⇒ tela). Sin `options` (.cfg viejo) se lee el código del original: 0 = puntos · 3 QUADS = tela ·
 *   6 (rsGeometryTreeLines) = árbol · otro = puntos + líneas (2 sprites no está portado); con `options`, un 6 suelto
 *   (fuera de rango) también se lee como árbol. Relación con `forma`: forma MUEVE las partículas (0 nube ⇄ 1 árbol) y además atenúa las líneas
 *   (alpha·lineas·forma); geometry_mode elige QUÉ se dibuja. Con forma≈0 las líneas no se ven ⇒ en «árbol» se muestran los
 *   puntos para que la capa no quede vacía. (Estela = no borrar el cuadro queda fuera: el render limpia el lienzo entero.)
 *   capa «semilla» (borrador de FCA, se usa si el .cfg NO trae el nombre original equivalente):
 *   niveles (⇒ N = 2^ceil(niveles/2)), angulo (grados ⇒ ambos rep_angle), largo (⇒ randomvelocity tal que el largo de rama ≈
 *   largo), balanceo (grados: asimetría izq/der), forma (0 nube de partículas ⇄ 1 árbol con líneas), dispersion (radio de la
 *   nube), crece (ritmo de la simulación: 0 = quieto, 1 = 60 pasos/s), lineas, tamano, pos_x, pos_y, escala.
 *   3D: angulo_z (grados que gira el PLANO de división en cada generación; default 90 si `orbita` está activa, si no 0 =
 *   árbol plano de Fase 1), orbita (1 = cámara orbital propia: arrastrar con el botón izquierdo rota yaw/pitch con inercia,
 *   rueda = zoom 0.25..8, doble clic = vista inicial; no actúa en modo Edit del touchEdit ni sobre la interfaz).
 *   tela (18-nov): opacidad de la malla (× alpha, default 0.55 = semitransparente).
 *   MEDIO (18-nov, texturas del original §2 del doc — «datos» que deforman/tiñen; acá van al RENDER, no a la simulación):
 *   texture_altitude (TEXTURE; «más claro = más importante») ⇒ cada célula se dibuja desplazada en z
 *   altitude_amp · rojo(textura en su uv de grilla (i+½, j+½)/N) — puntos, líneas y tela (las normales de la tela incluyen el
 *   relieve ⇒ el sombreado lo muestra aun de frente). altitude_amp (default 0 = sin relieve) no existe en el original (allí el
 *   relieve era `medium.z` fijo sobre la esfera). texture_medium (TEXTURE) ⇒ tiñe el color (× rgb). "default" o sin cargar =
 *   sin efecto. Motor CPU: el relieve se suma en JS leyendo los píxeles de la imagen (canvas, una vez por imagen).
 *   reposo (0..1, 18-nov): resorte de cada célula hacia su LUGAR DE GRILLA ((i+½)/N − ½, (j+½)/N − ½, 0) — 12 %·reposo por
 *   paso, después de la dinámica. 0 = la dinámica del original; 1 (con randomvelocity 0) = «tela que se extiende»: la hija
 *   nace en la posición del padre (como siempre) y se DESLIZA a su lugar; lo que avanza con las generaciones es qué celdas
 *   están vivas ⇒ la tela crece desde la esquina de la semilla y se completa por refinamiento fractal (retícula 2×2 → 4×4
 *   → … → N×N; área ¼ → 9⁄16 → … → 1). Intermedios = la forma del árbol tirada hacia la tela (primer resorte — ver Fase
 *   siguiente). pfStats().reposo = {dMedio, dMax} distancia de las vivas a su lugar.
 *   PRESETS de L08 (pfractal.cfg): 0 árbol · 1 nube (puntos) · 2 semilla (quieta) · 3 ciclo · 4 tela (árbol dinámico como
 *   piel + relieve 0.12) · 5 «tela que se extiende» (reposo 1, velocidad 0, relieve 0.15, escala 0.5).
 *
 * MODO TELA (geometry_mode «tela» / «tela + árbol»; código viejo 3 = QUADS del original, rsGeometryQuads):
 *   la célula es partícula Y vértice de una malla. Malla indexada de triángulos (2 por celda (i,j)-(i+sx,j)-(i+sx,j+sy)-(i,j+sy));
 *   el vertex shader lee la posición de cada vértice de la MISMA textura tMotion que puntos y líneas, y la normal por
 *   diferencias con los vecinos (i±sx, j±sy) ⇒ lambert con luz fija + ambiente + rim, doble cara, color/alpha del efecto; mezcla
 *   NORMAL con depth test/write propio (la aditiva del efecto, en una piel plegada, quema a blanco: se usa sólo en puntos/líneas).
 *   ORDEN DE LA GRILLA = EL DE LA GENEALOGÍA (como el original: los vecinos son vecinos de ÍNDICE, no de espacio). Pero el
 *   original unía vecinos inmediatos (paso 1) porque en pfractalA todas las células estaban vivas (emisor esfera); acá crecen
 *   desde una ⇒ con paso 1 la tela sólo existiría en las 2 últimas generaciones. Como todas las células dividen al mismo ritmo,
 *   tras G divisiones las vivas forman una RETÍCULA REGULAR de la grilla (G par: paso 2^(n−G/2) en i y en j; G impar: la mitad
 *   en i). Se arma una malla por generación y se dibuja sólo la de la generación actual de la semilla (las otras colapsan a un
 *   punto): 1 celda en G=2, 2 en G=3, 9 en G=4 … (N−1)² al final. Las aristas de la retícula unen a cada célula con su hija de la
 *   última división (en un eje) y con sus primas de la generación anterior (en el otro): la tela es la red de PARENTESCO y se
 *   pliega con el árbol (con angulo_z ≠ 0 la superficie se curva en 3D). «tela + árbol» suma las líneas hijo→padre: el
 *   esqueleto genealógico sobre la piel (se lee mejor que el wireframe de la propia malla, que a N=64 son ~8000 aristas de ruido
 *   y repiten lo que el sombreado ya muestra). Celdas con algún vértice no vivo ⇒ discard en el fragment.
 *   Fallback CPU: la misma malla con posición/normal por atributos (normales en JS, sólo de la retícula visible).
 *
 * NO PORTADO EN FASE 1 (queda para Fase 2/3/4, ver el doc §6.3): física 3D (gravity, attractor*, randommotion, flow_*), emisores
 * (emittertype), texturas de medio, sprites (geometry_mode 2), color/escala por célula, genoma CellCode. El original
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

/** Velocity.bk + Position.bk en 3D. Dos pasadas del MISMO shader (uPass) leyendo el estado anterior:
 *  pasada 0 ⇒ tMotion = (x, y, z, factor de velocidad) · pasada 1 ⇒ tHead = (rumbo θ, elevación φ, 0, 0).
 *  El PLANO DE DIVISIÓN gira con la generación: ψ = (gen−1)·uAngZ; el giro ±rep_angle se reparte en θ·cosψ + φ·sinψ
 *  (uAngZ = 0 ⇒ ψ = 0 ⇒ el árbol plano de Fase 1, idéntico). La primera división (gen 1) queda siempre en el plano. */
const MOTION_FS = `
uniform sampler2D tState; uniform sampler2D tMotion; uniform sampler2D tHead; uniform sampler2D tGene;
uniform float uPass, uReset, uSpeed, uVisc, uTheta0, uLRep, uRRep, uLMovMin, uLMovMax, uRMovMin, uRMovMax, uSeed, uN, uAngZ, uRepo;
varying vec2 vUv;
float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec4 outp(vec3 p, float w, float th, float ph) { return uPass < 0.5 ? vec4(p, w) : vec4(th, ph, 0.0, 0.0); }
void main() {
  vec4 s = texture2D(tState, vUv);                 // estado de ESTE paso
  if (uReset > 0.5 || s.b < 0.5) { gl_FragColor = outp(vec3(0.0), 0.0, uTheta0, 0.0); return; }
  vec4 m = texture2D(tMotion, vUv); vec4 hd = texture2D(tHead, vUv);
  float psi = max(s.r - 1.0, 0.0) * uAngZ; vec2 pl = vec2(cos(psi), sin(psi));
  if (s.a > 0.5 && s.a < 1.5) {                    // recién nacida
    vec4 g = texture2D(tGene, vUv);
    if (g.a > 0.5) { gl_FragColor = outp(vec3(0.0), 1.0, uTheta0, 0.0); return; }   // la semilla: velocidad inicial
    vec4 f = texture2D(tMotion, g.rg); vec4 fh = texture2D(tHead, g.rg);  // nace en la posición del padre, girada +left_rep_angle
    gl_FragColor = outp(f.xyz, f.w, fh.x + uLRep * pl.x, fh.y + uLRep * pl.y); return;
  }
  if (s.a > 1.5) { gl_FragColor = outp(m.xyz, m.w, hd.x - uRRep * pl.x, hd.y - uRRep * pl.y); return; }  // se dividió: −right_rep_angle
  float r = h(vUv * uN + vec2(uSeed, uSeed * 0.37));
  float d = s.b < 1.5 ? mix(uLMovMin, uLMovMax, r) : mix(uRMovMin, uRMovMax, r);    // serpenteo (en el plano de su división)
  hd.x += d * pl.x; hd.y += d * pl.y;
  m.w *= (1.0 - uVisc);
  m.xyz += uSpeed * m.w * vec3(cos(hd.y) * cos(hd.x), cos(hd.y) * sin(hd.x), sin(hd.y));
  if (uRepo > 0.0) m.xyz = mix(m.xyz, vec3(vUv - 0.5, 0.0), uRepo * 0.12);   // reposo: resorte a su lugar de grilla
  gl_FragColor = outp(m.xyz, m.w, hd.x, hd.y);
}`;

const DRAW_VS = `
uniform sampler2D tMotion; uniform sampler2D tState; uniform sampler2D tAlt;
uniform vec2 uPos; uniform float uEsc, uForma, uDisp, uSize, uAltAmp;
attribute vec2 aRef; attribute vec2 aCell; attribute vec2 aCloud;
#ifdef PF_CPU
attribute vec4 aMot;
#endif
varying float vAlive; varying vec2 vMuv;
void main() {
  vMuv = aRef;
#ifdef PF_CPU
  vec3 tree = aMot.xyz; float alive = aMot.w;                        // (la altitud ya viene sumada desde JS)
#else
  vec3 tree = texture2D(tMotion, aRef).xyz + vec3(0.0, 0.0, uAltAmp * texture2D(tAlt, aRef).r);
  float alive = step(0.5, texture2D(tState, aCell).b);
#endif
  vec3 p = vec3(uPos, 0.0) + mix(vec3(aCloud * uDisp, 0.0), tree, uForma) * uEsc;
  vAlive = alive;
  gl_Position = alive > 0.5 ? projectionMatrix * modelViewMatrix * vec4(p, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = uSize;
}`;

const DRAW_FS = `
uniform vec3 uColor; uniform float uAlpha, uMedAmt; uniform sampler2D tMed;
varying float vAlive; varying vec2 vMuv;
void main() {
#ifdef PF_POINTS
  vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard;
#endif
  if (vAlive < 0.5) discard;
  gl_FragColor = vec4(uColor * mix(vec3(1.0), texture2D(tMed, vMuv).rgb, uMedAmt), uAlpha);
}`;

/** TELA (geometry_mode QUADS del original, rsGeometryQuads): malla indexada sobre la RETÍCULA VIVA de la generación actual.
 *  aLvl = (paso u, paso v, generación G de la retícula). Sólo se dibuja la retícula G = min(generación de la semilla, K): las
 *  otras colapsan a un punto fuera de pantalla (triángulos degenerados). Normal = cruz de las diferencias con los vecinos de
 *  retícula (i±sx, j±sy) leídas de la MISMA textura de posición. Un vértice no vivo ⇒ vAlive < 1 en el triángulo ⇒ discard. */
const TELA_VS = `
uniform sampler2D tMotion; uniform sampler2D tState; uniform sampler2D tAlt;
uniform vec2 uPos; uniform float uEsc, uForma, uDisp, uGen, uK, uN, uAltAmp;
attribute vec2 aCell; attribute vec2 aCloud; attribute vec3 aLvl;
#ifdef PF_CPU
attribute vec4 aMot; attribute vec3 aNrm;
#endif
varying float vAlive; varying vec3 vN; varying vec3 vV; varying vec2 vMuv;
vec3 P(vec2 uv) { return texture2D(tMotion, uv).xyz + vec3(0.0, 0.0, uAltAmp * texture2D(tAlt, uv).r); }  // + relieve
void main() {
  vMuv = aCell;
#ifdef PF_CPU
  float gen = uGen; vec3 tree = aMot.xyz; float alive = aMot.w; vec3 n = aNrm;
#else
  float gen = texture2D(tState, vec2(0.5 / uN)).r;                 // generación de la semilla = la de todo el árbol (síncrono)
  vec3 tree = P(aCell); float alive = step(0.5, texture2D(tState, aCell).b);
  vec2 du = vec2(aLvl.x, 0.0), dv = vec2(0.0, aLvl.y);
  vec2 a = aCell + du, b = aCell - du, c = aCell + dv, d = aCell - dv;
  vec3 px = (a.x < 1.0 ? P(a) : tree) - (b.x > 0.0 ? P(b) : tree);
  vec3 py = (c.y < 1.0 ? P(c) : tree) - (d.y > 0.0 ? P(d) : tree);
  vec3 n = cross(px, py);
#endif
  if (abs(aLvl.z - min(gen, uK)) > 0.5) { vAlive = 0.0; vN = vec3(0.0, 0.0, 1.0); vV = vN; gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 p = vec3(uPos, 0.0) + mix(vec3(aCloud * uDisp, 0.0), tree, uForma) * uEsc;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vN = normalMatrix * (dot(n, n) > 1e-14 ? normalize(n) : vec3(0.0, 0.0, 1.0));
  vV = projectionMatrix[3][3] > 0.5 ? vec3(0.0, 0.0, 1.0) : -mv.xyz;  // ortográfica: mira por −z
  vAlive = alive;
  gl_Position = projectionMatrix * mv;
}`;

const TELA_FS = `
uniform vec3 uColor; uniform float uAlpha, uMedAmt; uniform sampler2D tMed;
varying float vAlive; varying vec3 vN; varying vec3 vV; varying vec2 vMuv;
void main() {
  if (vAlive < 0.999) discard;
  vec3 base = uColor * mix(vec3(1.0), texture2D(tMed, vMuv).rgb, uMedAmt);   // texture_medium tiñe
  vec3 n = normalize(vN), v = normalize(vV);
  if (dot(n, v) < 0.0) n = -n;                                       // doble cara: la cara que mira a la cámara
  float dif = max(dot(n, normalize(vec3(0.35, 0.55, 0.75))), 0.0);   // lambert, luz fija (espacio de vista)
  float rim = pow(1.0 - max(dot(n, v), 0.0), 2.0);
  vec3 col = base * (0.3 + 0.7 * dif) + rim * 0.35 * (0.5 * base + 0.5);
  gl_FragColor = vec4(col, uAlpha * (0.7 + 0.3 * rim));
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
  private stateRT: any[] = []; private motionRT: any[] = []; private headRT: any[] = []; private ic = 0;
  private geneTex: any; private simScene: any; private simCam: any; private simMesh: any;
  private stateMat: any; private motionMat: any;
  // CPU
  private cS: Float32Array; private cS2: Float32Array; private cM: Float32Array; private cM2: Float32Array;
  private cH: Float32Array; private cH2: Float32Array;
  // render
  private pts: any; private lines: any; private pMat: any; private lMat: any;
  private tela: any; private tMat: any;
  /** retículas de la tela: por generación G, paso (sx, sy) en celdas, primer vértice, columnas, filas; y por vértice su célula */
  private telaLv: { G: number, sx: number, sy: number, base: number, cols: number, rows: number }[] = [];
  private telaCell: Int32Array;
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
    for (const rt of this.stateRT.concat(this.motionRT, this.headRT)) rt.dispose();
    this.stateRT = []; this.motionRT = []; this.headRT = [];
    if (this.geneTex) this.geneTex.dispose();
    for (const o of [this.pts, this.lines, this.tela]) if (o) { o.geometry.dispose(); o.material.dispose(); }
    this.pts = this.lines = this.tela = null;
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
      for (let i = 0; i < 2; i++) { this.stateRT.push(this.makeRT(N)); this.motionRT.push(this.makeRT(N)); this.headRT.push(this.makeRT(N)); }
      const gd = new Float32Array(N2 * 4);
      for (let k = 0; k < N2; k++) { const f = uvF(k); gd[k * 4] = f[0]; gd[k * 4 + 1] = f[1]; gd[k * 4 + 2] = gene.gb[k]; gd[k * 4 + 3] = k == 0 ? 1 : 0; }
      this.geneTex = new THREE.DataTexture(gd, N, N, THREE.RGBAFormat, THREE.FloatType);
      this.geneTex.minFilter = this.geneTex.magFilter = THREE.NearestFilter; this.geneTex.needsUpdate = true;
      if (!this.simScene) {
        this.simScene = new THREE.Scene(); this.simCam = new THREE.Camera();
        const mk = (fs: string, u: any) => new THREE.ShaderMaterial({ vertexShader: SIM_VS, fragmentShader: fs, uniforms: u, depthTest: false, depthWrite: false, blending: THREE.NoBlending });
        this.stateMat = mk(STATE_FS, { tState: { value: null }, tGene: { value: null }, uInc: { value: 0.05 }, uReset: { value: 0 } });
        const mu: any = { tState: { value: null }, tMotion: { value: null }, tHead: { value: null }, tGene: { value: null } };
        for (const n of ["uPass", "uAngZ", "uRepo", "uReset", "uSpeed", "uVisc", "uTheta0", "uLRep", "uRRep", "uLMovMin", "uLMovMax", "uRMovMin", "uRMovMax", "uSeed", "uN"]) mu[n] = { value: 0 };
        this.motionMat = mk(MOTION_FS, mu);
        this.simMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.stateMat);
        this.simMesh.frustumCulled = false; this.simScene.add(this.simMesh);
      }
      this.stateMat.uniforms.tGene.value = this.geneTex; this.motionMat.uniforms.tGene.value = this.geneTex;
    } else {
      this.cS = new Float32Array(N2 * 4); this.cS2 = new Float32Array(N2 * 4);
      this.cM = new Float32Array(N2 * 4); this.cM2 = new Float32Array(N2 * 4);
      this.cH = new Float32Array(N2 * 2); this.cH2 = new Float32Array(N2 * 2);
    }

    // ---- render: puntos (una célula = un punto) + líneas (hijo → padre, 2 vértices por célula salvo la semilla)
    this.U = {
      tMotion: { value: null }, tState: { value: null }, uPos: { value: new THREE.Vector2() }, uEsc: { value: 1 }, uForma: { value: 1 },
      uDisp: { value: 0.25 }, uSize: { value: 4 }, uColor: { value: new THREE.Color(1, 1, 1) }, uAlpha: { value: 1 },
      tAlt: { value: null }, uAltAmp: { value: 0 }, tMed: { value: null }, uMedAmt: { value: 0 },
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
    if (!gpu) pg.setAttribute("aMot", new THREE.BufferAttribute(new Float32Array(N2 * 4), 4));

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
    if (!gpu) lg.setAttribute("aMot", new THREE.BufferAttribute(new Float32Array(L * 4), 4));

    this.pts = new THREE.Points(pg, this.pMat); this.lines = new THREE.LineSegments(lg, this.lMat);
    this.pts.frustumCulled = false; this.lines.frustumCulled = false;

    // ---- TELA: una retícula por generación G (las células vivas tras G divisiones forman una retícula regular de paso
    // sx×sy: G par = 2^(n−G/2) en ambos ejes; G impar = la mitad en i). Celda (i,j)-(i+sx,j)-(i+sx,j+sy)-(i,j+sy) = 2 triángulos.
    const nn = Math.round(Math.log2(N)), tCell: number[] = [], tLvl: number[] = [], tIdx: number[] = [];
    this.telaLv = [];
    for (let G = 1; G <= this.K; G++) {
      const m = Math.floor(G / 2), sy = Math.pow(2, nn - m), sx = G % 2 == 0 ? sy : sy / 2;
      const cols = N / sx, rows = N / sy, base = tCell.length;
      this.telaLv.push({ G, sx, sy, base, cols, rows });
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { tCell.push(r * sy * N + c * sx); tLvl.push(sx / N, sy / N, G); }
      for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
        const a0 = base + r * cols + c, b0 = a0 + 1, d0 = a0 + cols, e0 = d0 + 1;
        tIdx.push(a0, b0, e0, a0, e0, d0);
      }
    }
    const TV = tCell.length;
    this.telaCell = Int32Array.from(tCell);
    const tg = new THREE.BufferGeometry(), tRef = new Float32Array(TV * 2), tCl = new Float32Array(TV * 2);
    for (let v = 0; v < TV; v++) { const k = tCell[v], u = uv(k); tRef[v * 2] = u[0]; tRef[v * 2 + 1] = u[1]; tCl[v * 2] = cloud[k * 2]; tCl[v * 2 + 1] = cloud[k * 2 + 1]; }
    tg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TV * 3), 3));
    tg.setAttribute("aCell", new THREE.BufferAttribute(tRef, 2));
    tg.setAttribute("aCloud", new THREE.BufferAttribute(tCl, 2));
    tg.setAttribute("aLvl", new THREE.BufferAttribute(Float32Array.from(tLvl), 3));
    if (!gpu) { tg.setAttribute("aMot", new THREE.BufferAttribute(new Float32Array(TV * 4), 4)); tg.setAttribute("aNrm", new THREE.BufferAttribute(new Float32Array(TV * 3), 3)); }
    tg.setIndex(new THREE.BufferAttribute(TV > 65535 ? Uint32Array.from(tIdx) : Uint16Array.from(tIdx), 1));
    const tU = Object.assign({}, this.U, { uAlpha: { value: 0.55 }, uGen: { value: 0 }, uK: { value: this.K }, uN: { value: N } });
    this.tMat = new THREE.ShaderMaterial({ vertexShader: TELA_VS, fragmentShader: TELA_FS, uniforms: tU, defines: Object.assign({}, defs),
      transparent: true, depthTest: true, depthWrite: true, side: THREE.DoubleSide });
    this.tela = new THREE.Mesh(tg, this.tMat); this.tela.frustumCulled = false;

    // órbita: Scene → orbG (gira alrededor del pivote) → pivG (−pivote) → tela (con depth) + líneas + puntos (sin depth: van encima)
    this.orbG = new THREE.Group(); this.pivG = new THREE.Group();
    this.pivG.add(this.tela); this.pivG.add(this.lines); this.pivG.add(this.pts); this.orbG.add(this.pivG);
    this.Scene = new MO.moSceneNode(); this.Scene.add(this.orbG);
    this.pivOk = false;
    this.needReset = true;
  }

  /** vuelve a la semilla (y el BIG BANG ocurre en el mismo llamado: la semilla se ve aunque crece = 0) */
  private held = false;
  public reset() { this.needReset = true; }

  private P: any = {};
  private readParams() {
    const P = this.P;
    P.inc = Math.max(0.001, Math.min(0.5, this.num("incremento_madurez", 0.05)));
    const period = Math.max(1, (1 - 2 * P.inc) / P.inc + 1);   // pasos entre divisiones
    P.period = period;
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
    P.orbita = this.num("orbita", 0) > 0.5;
    P.repo = Math.max(0, Math.min(1, this.num("reposo", 0)));
    P.altAmp = this.num("altitude_amp", 0);
    P.angZ = (this.has("angulo_z") ? this.num("angulo_z", 90) : (P.orbita ? 90 : 0)) * deg;
  }

  private gpuStep(reset: boolean) {
    const R = this.R, P = this.P, a = this.ic, b = 1 - a;
    const prev = R.getRenderTarget();
    const su = this.stateMat.uniforms, mu = this.motionMat.uniforms;
    su.tState.value = this.stateRT[a].texture; su.uInc.value = P.inc; su.uReset.value = reset ? 1 : 0;
    this.simMesh.material = this.stateMat; R.setRenderTarget(this.stateRT[b]); R.render(this.simScene, this.simCam);
    mu.tState.value = this.stateRT[b].texture; mu.tMotion.value = this.motionRT[a].texture; mu.tHead.value = this.headRT[a].texture;
    mu.uAngZ.value = P.angZ; mu.uRepo.value = P.repo;
    mu.uReset.value = reset ? 1 : 0; mu.uSpeed.value = P.speed; mu.uVisc.value = P.visc; mu.uTheta0.value = P.theta0;
    mu.uLRep.value = P.lRep; mu.uRRep.value = P.rRep; mu.uLMovMin.value = P.lMovMin; mu.uLMovMax.value = P.lMovMax;
    mu.uRMovMin.value = P.rMovMin; mu.uRMovMax.value = P.rMovMax; mu.uSeed.value = (this.pasos % 997) * 1.618; mu.uN.value = this.N;
    this.simMesh.material = this.motionMat;
    mu.uPass.value = 0; R.setRenderTarget(this.motionRT[b]); R.render(this.simScene, this.simCam);
    mu.uPass.value = 1; R.setRenderTarget(this.headRT[b]); R.render(this.simScene, this.simCam);
    R.setRenderTarget(prev);
    this.ic = b;
  }

  /** la MISMA máquina de estados en JS (fallback) */
  private cpuStep(reset: boolean) {
    const N = this.N, N2 = N * N, P = this.P, g = this.gene, S = this.cS, S1 = this.cS2, Mo = this.cM, M1 = this.cM2;
    const H = this.cH, H1 = this.cH2;
    if (reset) { S.fill(0); Mo.fill(0); for (let k = 0; k < N2; k++) { H[k * 2] = P.theta0; H[k * 2 + 1] = 0; } return; }
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
      const o = k * 4, q = k * 2;
      if (S1[o + 2] < 0.5) { M1.set([0, 0, 0, 0], o); H1[q] = P.theta0; H1[q + 1] = 0; continue; }
      const psi = Math.max(S1[o] - 1, 0) * P.angZ, cx = Math.cos(psi), sy = Math.sin(psi);
      if (S1[o + 3] > 0.5 && S1[o + 3] < 1.5) {
        if (k == 0) { M1.set([0, 0, 0, 1], o); H1[q] = P.theta0; H1[q + 1] = 0; continue; }
        const fk = g.fj[k] * N + g.fi[k], f = fk * 4;
        M1.set([Mo[f], Mo[f + 1], Mo[f + 2], Mo[f + 3]], o); H1[q] = H[fk * 2] + P.lRep * cx; H1[q + 1] = H[fk * 2 + 1] + P.lRep * sy; continue;
      }
      if (S1[o + 3] > 1.5) { M1.set([Mo[o], Mo[o + 1], Mo[o + 2], Mo[o + 3]], o); H1[q] = H[q] - P.rRep * cx; H1[q + 1] = H[q + 1] - P.rRep * sy; continue; }
      const r = Math.random();
      const d = S1[o + 2] < 1.5 ? P.lMovMin + (P.lMovMax - P.lMovMin) * r : P.rMovMin + (P.rMovMax - P.rMovMin) * r;
      const th = H[q] + d * cx, ph = H[q + 1] + d * sy, w = Mo[o + 3] * (1 - P.visc), v = P.speed * w;
      M1.set([Mo[o] + v * Math.cos(ph) * Math.cos(th), Mo[o + 1] + v * Math.cos(ph) * Math.sin(th), Mo[o + 2] + v * Math.sin(ph), w], o);
      if (P.repo > 0) {                                                   // reposo: resorte a su lugar de grilla
        const a = P.repo * 0.12, rx = ((k % N) + 0.5) / N - 0.5, ry = (Math.floor(k / N) + 0.5) / N - 0.5;
        M1[o] += (rx - M1[o]) * a; M1[o + 1] += (ry - M1[o + 1]) * a; M1[o + 2] += (0 - M1[o + 2]) * a;
      }
      H1[q] = th; H1[q + 1] = ph;
    }
    this.cS = S1; this.cS2 = S; this.cM = M1; this.cM2 = Mo; this.cH = H1; this.cH2 = H;
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

  /** geometry_mode ⇒ "puntos" | "arbol" | "ambos" | "tela" | "tela_arbol" (ver el comentario del archivo: índice si hay
   *  `options`, código viejo del original si no) */
  public geomMode(): string {
    if (!this.has("geometry_mode")) return "ambos";
    const v = Math.round(this.num("geometry_mode", 2));
    const P: any = this.m_Config.m_ParamsByName["geometry_mode"], pd: any = P && P.m_ParamDefinition;
    const opts = "" + ((pd && pd.m_OptionsStr) || (P && P.m_XmlAttributes && P.m_XmlAttributes["options"]) || "");
    if (opts.trim()) {
      const o = opts.split(",").map((x) => x.trim().toLowerCase());
      const lb = v >= 0 && v < o.length ? o[v] : (v == 6 ? "árbol" : v == 3 ? "tela" : "");
      const lin = /l[ií]nea|[aá]rbol/.test(lb);
      if (/tela|malla|mesh|quad/.test(lb)) return lin ? "tela_arbol" : "tela";
      if (/punto/.test(lb) && lin) return "ambos";
      if (/punto/.test(lb)) return "puntos";
      if (lin) return "arbol";
      return ["puntos", "arbol", "ambos", "tela", "tela_arbol"][Math.max(0, Math.min(4, v))];
    }
    /* .cfg viejo: códigos del original — 0 POINTS · 3 QUADS (rsGeometryQuads = superficie) · 6 TREE · otro = puntos + líneas */
    return v == 0 ? "puntos" : v == 6 ? "arbol" : v == 3 ? "tela" : "ambos";
  }

  /** textura de un param TEXTURE, o null si no está en el .cfg / vale "default" / la imagen no cargó */
  private texParam(n: string): any {
    if (!this.has(n)) return null;
    const P: any = this.m_Config.m_ParamsByName[n];
    let txt = ""; try { txt = ("" + P.m_Values[Math.max(0, P.GetIndexValue())].m_List[0].m_Text).trim(); } catch (e) {}
    if (!txt || txt == "default") return null;
    try { const t: any = this.m_Config.Texture(n), tx = t && t._texture, im = tx && tx.image; return im && (im.width || 0) > 0 ? tx : null; } catch (e) { return null; }
  }
  /** píxeles de una textura (para el motor CPU y las mediciones): canal rojo 0..1, con el flipY de three (v=0 abajo) */
  private pix = new WeakMap<any, { w: number, h: number, d: Uint8ClampedArray }>();
  private texRed(tx: any, u: number, v: number): number {
    let c = this.pix.get(tx);
    if (!c) {
      try {
        const im = tx.image, cv = document.createElement("canvas"); cv.width = im.width; cv.height = im.height;
        const g = cv.getContext("2d"); g.drawImage(im, 0, 0); c = { w: im.width, h: im.height, d: g.getImageData(0, 0, im.width, im.height).data };
      } catch (e) { c = { w: 1, h: 1, d: new Uint8ClampedArray(4) }; }
      this.pix.set(tx, c);
    }
    const x = Math.min(c.w - 1, Math.floor(u * c.w)), y = Math.min(c.h - 1, Math.floor((tx.flipY === false ? v : 1 - v) * c.h));
    return c.d[(y * c.w + x) * 4] / 255;
  }
  private altTx: any = null;
  /** relieve (z) de la célula k: altitude_amp · rojo(texture_altitude en su uv de grilla) — lo mismo que suma el shader */
  private altZ(k: number): number {
    if (!this.altTx || !this.P.altAmp) return 0;
    const N = this.N; return this.P.altAmp * this.texRed(this.altTx, ((k % N) + 0.5) / N, (Math.floor(k / N) + 0.5) / N);
  }

  /** tela: generación de la retícula visible y cuántas de sus celdas tienen los 4 vértices vivos (lo que se dibuja) */
  private telaStats(st: Float32Array): { nivel: number, celdas: number, triangulos: number, reticula: string } {
    const N = this.N, gen = st[2] > 0.5 ? Math.min(Math.round(st[0]), this.K) : 0;
    const L = this.telaLv[gen - 1];
    if (!L) return { nivel: gen, celdas: 0, triangulos: 0, reticula: "-" };
    const al = (k: number) => st[k * 4 + 2] > 0.5;
    let c = 0;
    for (let r = 0; r < L.rows - 1; r++) for (let q = 0; q < L.cols - 1; q++) {
      const k = r * L.sy * N + q * L.sx;
      if (al(k) && al(k + L.sx) && al(k + L.sy * N) && al(k + L.sy * N + L.sx)) c++;
    }
    return { nivel: gen, celdas: c, triangulos: 2 * c, reticula: L.cols + "x" + L.rows };
  }

  /** para el test headless: vivas, generación de la semilla, vivas por generación de nacimiento, bbox del árbol */
  public pfStats(): any {
    if (!this.N) return null;
    const st = this.readState(), mo = this.readMotion(), N2 = this.N * this.N;
    const porGen = new Array(this.K + 1).fill(0);
    let vivas = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (let k = 0; k < N2; k++) {
      if (st[k * 4 + 2] < 0.5) continue;
      vivas++; porGen[this.gene.gb[k]]++;
      const x = mo[k * 4], y = mo[k * 4 + 1], z = mo[k * 4 + 2];
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z);
    }
    const r = (v: number) => +v.toFixed(4);
    let dS = 0, dM = 0;                                                    // distancia a su lugar de grilla (reposo)
    for (let k = 0; k < N2; k++) {
      if (st[k * 4 + 2] < 0.5) continue;
      const dx = mo[k * 4] - (((k % this.N) + 0.5) / this.N - 0.5), dy = mo[k * 4 + 1] - ((Math.floor(k / this.N) + 0.5) / this.N - 0.5), dz = mo[k * 4 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz); dS += d; dM = Math.max(dM, d);
    }
    return { modo: this.modo, N: this.N, K: this.K, pasos: this.pasos, genSemilla: st[0], vivas, porGen,
      bbox: vivas ? { ancho: r(x1 - x0), alto: r(y1 - y0), prof: r(z1 - z0) } : null, lineas: !!(this.lines && this.lines.visible),
      puntos: !!(this.pts && this.pts.visible), geometry_mode: this.geomMode(),
      tela: Object.assign({ visible: !!(this.tela && this.tela.visible) }, this.telaStats(st)),
      reposo: { valor: r(this.P.repo || 0), dMedio: vivas ? r(dS / vivas) : 0, dMax: r(dM), celda: r(1 / this.N) },
      medio: { altitud: !!this.altTx, altitude_amp: r(this.P.altAmp || 0), medium: !!(this.U.tMed && this.U.tMed.value) },
      orbita: { activa: !!this.P.orbita, yaw: r(this.yaw), pitch: r(this.pitch), zoom: r(this.zoom), angulo_z: r((this.P.angZ || 0) * 180 / Math.PI) } };
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

    // transporte del proyecto (círculo de tiempo): pausa ⇒ no avanza · stop ⇒ vuelve a la semilla y queda quieta · play ⇒ crece
    const tr = (window as any).moTransport || "play";
    if (tr == "stop" && !this.held) { this.needReset = true; this.held = true; }
    if (tr != "stop") this.held = false;
    if (this.needReset) { this.needReset = false; this.step(true); this.step(); this.acc = 0; }
    const now = performance.now(), dt = this.lastT ? Math.min(0.25, (now - this.lastT) / 1000) : 1 / 60;
    this.lastT = now;
    if (tr == "play") this.acc += dt * 60 * this.P.crece;
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
    const altTx = this.texParam("texture_altitude"), medTx = this.texParam("texture_medium");
    this.altTx = altTx; U.tAlt.value = altTx; U.uAltAmp.value = altTx ? this.P.altAmp : 0;
    U.tMed.value = medTx; U.uMedAmt.value = medTx ? 1 : 0;
    lU.uAlpha.value = alpha * Math.max(0, Math.min(1, this.num("lineas", 1))) * forma;
    const gm = this.geomMode(), esTela = gm == "tela" || gm == "tela_arbol", tU = this.tMat.uniforms;
    tU.uAlpha.value = alpha * Math.max(0, Math.min(1, this.num("tela", 0.55)));
    this.tela.visible = esTela && tU.uAlpha.value > 0.001;
    this.lines.visible = gm != "puntos" && gm != "tela" && lU.uAlpha.value > 0.001;
    // tela: antes de la 2ª división no hay celdas (retícula 2×1) ⇒ se ve la semilla como punto para que la capa no quede vacía
    if (esTela) this.pts.visible = !this.tela.visible || this.pasos < 2 * (this.P.period || 1) + 1;
    else this.pts.visible = gm != "arbol" || !this.lines.visible;
    const add = [1, 5].indexOf(Math.round(this.num("blending", 0))) >= 0;
    for (const m of [this.pMat, this.lMat]) m.blending = add ? THREE.AdditiveBlending : THREE.NormalBlending;
    // la tela SIEMPRE con mezcla normal + depth: aditiva sobre una piel plegada (miles de capas casi coplanares) quema a blanco
    // y se pierde la forma (medido en L08, blending=1); así se ve la capa de adelante sombreada y, semitransparente, lo de atrás.
    this.tMat.blending = THREE.NormalBlending;

    if (this.modo == "gpu") {
      U.tMotion.value = this.motionRT[this.ic].texture; U.tState.value = this.stateRT[this.ic].texture;
    } else this.fillCPU();

    if (this.Camera == undefined) this.Camera = new MO.moCamera3D();
    const rs: MO.moVector2 = new MO.moVector2();
    this.RM.m_Renderer.getSize(rs);
    this.drawT = now;
    if (this.tela.visible) { try { R.clearDepth(); } catch (e) {} }   // la tela usa depth propio (ver TELA_FS): no heredar el de otras capas
    if (this.P.orbita) {
      this.bindOrbit(R);
      this.orbitFrame(rs.width, rs.height, dt);
      this.RM.Render(this.Scene, this.pCam);
    } else {
      this.orbG.rotation.set(0, 0, 0); this.orbG.position.set(0, 0, 0); this.pivG.position.set(0, 0, 0);
      this.GL.SetDefaultOrthographicView(rs.width, rs.height);
      this.Camera.projectionMatrix = this.GL.GetProjectionMatrix();
      this.RM.Render(this.Scene, this.Camera);
    }
    this.EndDraw();
  }

  /** fallback CPU: copia (x, y, viva) a los atributos de puntos y líneas */
  private fillCPU() {
    const N = this.N, N2 = N * N, S = this.cS, Mo = this.cM, g = this.gene;
    const pa = this.pts.geometry.attributes.aMot, la = this.lines.geometry.attributes.aMot;
    const p = pa.array as Float32Array, l = la.array as Float32Array;
    for (let k = 0; k < N2; k++) { p.set([Mo[k * 4], Mo[k * 4 + 1], Mo[k * 4 + 2] + this.altZ(k), S[k * 4 + 2] > 0.5 ? 1 : 0], k * 4); }
    for (let k = 1, v = 0; k < N2; k++, v += 2) {
      const f = g.fj[k] * N + g.fi[k], alive = p[k * 4 + 3];
      l.set([p[k * 4], p[k * 4 + 1], p[k * 4 + 2], alive, p[f * 4], p[f * 4 + 1], p[f * 4 + 2], alive], v * 4);
    }
    pa.needsUpdate = true; la.needsUpdate = true;
    // tela: posición + viva por vértice, y la normal (diferencias con los vecinos de retícula) sólo en la retícula visible
    const tg = this.tela.geometry, ta = tg.attributes.aMot, tn = tg.attributes.aNrm;
    const tm = ta.array as Float32Array, nr = tn.array as Float32Array, cell = this.telaCell;
    const gen = S[2] > 0.5 ? Math.min(Math.round(S[0]), this.K) : 0;
    this.tMat.uniforms.uGen.value = gen;
    const L = this.telaLv[gen - 1];
    if (L) {
      const P = (k: number, c: number) => p[k * 4 + c];                  // posición + relieve (ya en los atributos de puntos)
      for (let r = 0; r < L.rows; r++) for (let q = 0; q < L.cols; q++) {
        const v = L.base + r * L.cols + q, k = cell[v];
        const kx1 = q + 1 < L.cols ? k + L.sx : k, kx0 = q > 0 ? k - L.sx : k;
        const ky1 = r + 1 < L.rows ? k + L.sy * N : k, ky0 = r > 0 ? k - L.sy * N : k;
        const ax = P(kx1, 0) - P(kx0, 0), ay = P(kx1, 1) - P(kx0, 1), az = P(kx1, 2) - P(kx0, 2);
        const bx = P(ky1, 0) - P(ky0, 0), by = P(ky1, 1) - P(ky0, 1), bz = P(ky1, 2) - P(ky0, 2);
        tm[v * 4] = P(k, 0); tm[v * 4 + 1] = P(k, 1); tm[v * 4 + 2] = P(k, 2); tm[v * 4 + 3] = S[k * 4 + 2] > 0.5 ? 1 : 0;
        nr[v * 3] = ay * bz - az * by; nr[v * 3 + 1] = az * bx - ax * bz; nr[v * 3 + 2] = ax * by - ay * bx;
      }
      ta.needsUpdate = true; tn.needsUpdate = true;
    }
  }

  // ---------------------------------------------------------------- órbita (param `orbita` = 1)
  public yaw = 0; public pitch = 0; public zoom = 1;
  private vYaw = 0; private vPitch = 0; private drag: { id: number, x: number, y: number, t: number } = null;
  private orbG: any; private pivG: any; private pCam: any; private orbBound = false; private drawT = 0;
  private piv = new THREE.Vector3(); private pivTgt = new THREE.Vector3(); private pivOk = false; private pivT = 0;

  /** ¿el gesto es para la órbita? activa, dibujada hace poco, fuera de modo Edit y sobre el lienzo (no sobre la interfaz) */
  private orbitWants(e: any): boolean {
    if (!this.P.orbita || performance.now() - this.drawT > 500) return false;
    const te = (window as any).moTouchEdit; if (te && te.enabled) return false;
    const t = e.target as HTMLElement;
    return !!t && (t === (this.R && this.R.domElement) || t.tagName == "CANVAS" || t.id == "moCanvas" || t.id == "moConnect");
  }

  private bindOrbit(R: any) {
    if (this.orbBound) return;
    this.orbBound = true;
    window.addEventListener("pointerdown", (e: PointerEvent) => {
      if (e.button !== 0 || !this.orbitWants(e)) return;
      this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() }; this.vYaw = this.vPitch = 0;
    });
    window.addEventListener("pointermove", (e: PointerEvent) => {
      const d = this.drag; if (!d || e.pointerId !== d.id) return;
      const now = performance.now(), dx = e.clientX - d.x, dy = e.clientY - d.y, k = 0.008;
      this.yaw += dx * k; this.pitch = Math.max(-1.55, Math.min(1.55, this.pitch + dy * k));
      const dts = Math.max(1, now - d.t) / 1000;
      this.vYaw = dx * k / dts; this.vPitch = dy * k / dts;          // rad/s para la inercia
      d.x = e.clientX; d.y = e.clientY; d.t = now;
    });
    const up = (e: PointerEvent) => {
      const d = this.drag; if (!d || e.pointerId !== d.id) return;
      if (performance.now() - d.t > 80) this.vYaw = this.vPitch = 0;   // soltó quieto ⇒ sin inercia
      this.drag = null;
    };
    window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    /* la rueda va sobre el canvas del renderer (en window Chrome la fuerza a pasiva y no deja frenar el scroll) */
    const cv: HTMLElement = R.domElement || window as any;
    cv.addEventListener("wheel", (e: WheelEvent) => {
      if (!this.orbitWants(e)) return;
      if (e.cancelable) e.preventDefault();
      const dy = e.deltaMode == 1 ? e.deltaY * 16 : e.deltaY;
      this.zoom = Math.max(0.25, Math.min(8, this.zoom * Math.exp(-dy * 0.0015)));
    }, { passive: false });
    window.addEventListener("dblclick", (e: MouseEvent) => {
      if (!this.orbitWants(e)) return;
      this.yaw = this.pitch = 0; this.zoom = 1; this.vYaw = this.vPitch = 0;
    });
  }

  /** inercia + pivote (centro del árbol, suavizado) + cámara en perspectiva que a zoom 1 encuadra igual que la ortográfica */
  private orbitFrame(w: number, h: number, dt: number) {
    if (!this.drag && (this.vYaw || this.vPitch)) {
      this.yaw += this.vYaw * dt; this.pitch = Math.max(-1.55, Math.min(1.55, this.pitch + this.vPitch * dt));
      const f = Math.pow(0.04, dt);                                     // se apaga en ~1 s
      this.vYaw *= f; this.vPitch *= f;
      if (Math.abs(this.vYaw) + Math.abs(this.vPitch) < 0.01) this.vYaw = this.vPitch = 0;
    }
    const now = performance.now();
    if (now - this.pivT > 500) {                                        // centro de la caja del árbol (lectura chica, 2 por s)
      this.pivT = now;
      const st = this.readState(), mo = this.readMotion(), N2 = this.N * this.N;
      const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; let n = 0;
      for (let k = 0; k < N2; k++) {
        if (st[k * 4 + 2] < 0.5) continue; n++;
        for (let c = 0; c < 3; c++) { const v = mo[k * 4 + c]; if (v < lo[c]) lo[c] = v; if (v > hi[c]) hi[c] = v; }
      }
      const U = this.U, e = U.uEsc.value * U.uForma.value;
      this.pivTgt.copy(n ? new THREE.Vector3(U.uPos.value.x + (lo[0] + hi[0]) / 2 * e, U.uPos.value.y + (lo[1] + hi[1]) / 2 * e, (lo[2] + hi[2]) / 2 * e)
                    : new THREE.Vector3(U.uPos.value.x, U.uPos.value.y, 0));
      if (!this.pivOk) { this.piv.copy(this.pivTgt); this.pivOk = true; }
    }
    this.piv.lerp(this.pivTgt, Math.min(1, dt * 2));
    this.orbG.position.copy(this.piv); this.pivG.position.copy(this.piv).multiplyScalar(-1);
    this.orbG.rotation.set(this.pitch, this.yaw, 0, "YXZ");
    const aspect = w / Math.max(1, h), fov = 45;
    if (!this.pCam) this.pCam = new THREE.PerspectiveCamera(fov, aspect, 0.001, 100);
    this.pCam.aspect = aspect; this.pCam.updateProjectionMatrix();
    const D = (0.5 / aspect) / Math.tan(fov / 2 * Math.PI / 180);       // altura visible = la de la vista ortográfica
    const k = this.zoom > 1 ? 1 - 1 / this.zoom : 0;                     // al acercar, el centro va hacia el pivote
    const tx = this.piv.x * k, ty = this.piv.y * k;
    this.pCam.position.set(tx, ty, D / this.zoom); this.pCam.lookAt(tx, ty, 0); this.pCam.updateMatrixWorld();
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
      ["lineas", "1.0"], ["tamano", "4"], ["niveles", "8"], ["angulo", "28.6"], ["largo", "0.08"], ["balanceo", "0"],
      // 3D (18-nov)
      ["angulo_z", "90"], ["orbita", "0"],
      // tela (18-nov): opacidad de la malla (× alpha)
      ["tela", "0.55"], ["altitude_amp", "0"], ["reposo", "0"]];
    for (const [n, v] of defs) p_configdefinition.Add(n, F, idx++, new MO.moValue(v, "FUNCTION"));
    // medio (texturas del original, §2 del doc): altitud = relieve (z) de cada célula, medio = tinte
    for (const n of ["texture_altitude", "texture_medium"]) p_configdefinition.Add(n, MO.moParamType.MO_PARAM_TEXTURE, idx++, new MO.moValue("default", "TXT"));
    return this.m_Config.GetConfigDefinition();
  }
}

/** alias con los nombres de FCA: el mismo motor */
export class moEffectParticleFractalGPU extends moEffectParticlesFractal { constructor() { super(); this.SetName("particle_fractal"); } }
export class moEffectSemilla extends moEffectParticlesFractal { constructor() { super(); this.SetName("semilla"); } }
export class moEffectSemi extends moEffectParticlesFractal { constructor() { super(); this.SetName("semi"); } }
