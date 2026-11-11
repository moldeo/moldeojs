/**
 * #918 E1.5 / F14 / F15 — la esfera de PRESETS (esquina inferior derecha del boceto: «círculo de piedras, lentes»).
 *
 *  - centro  = la capa en foco (tocar ⇒ pasa a la siguiente capa que tenga presets)
 *  - anillo  = sus presets como piedras con símbolo; tocar ⇒ se llama · mantener ⇒ guarda el estado actual en él
 *  - ✦ Proponer (nivel 1): 4 lentes nuevas mezclando presets existentes (barato: no renderiza, interpola).
 *    Lente punteada: tocar = llamarla · mantener = quedársela · ✦ otra vez = descartar las no elegidas.
 *  - si en modo Edit se toca una capa en la pantalla, la esfera la toma (setLayer)
 */
import { moSphere } from "./mo-sphere";
import { moPreconfig, moPreconfigParamIndex } from "./mo-pre-config";

/** generador con semilla: Control y Player obtienen las mismas propuestas */
function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const NUMERIC = ["NUM", "CHAR", "INT", "LONG", "FLOAT", "DOUBLE"];
const NUMRE = /^\s*-?(\d+\.?\d*|\.\d+)(e-?\d+)?\s*$/i;
/** número de un sub-valor, o null si es texto / expresión */
function subNum(vb: any): number {
  const t = "" + ((vb.m_XmlAttributes && vb.m_XmlAttributes["type"]) || (vb.GetTypeStr && vb.GetTypeStr()));
  if (NUMERIC.indexOf(t) >= 0) return Number(vb.m_Number);
  const s = "" + vb.m_Text;
  return NUMRE.test(s) ? Number(s) : null;
}

export class moPresetWheel extends moSphere {

  private layers: any[] = [];
  private current: number = 0;
  onCall: (layer: any, preset: number) => void = null;
  history: any = null;            /** #918 H1 */
  /** modo de cambio, override del performer (FCA: "en vivo es fundamental el corte duro").
   *  proyecto = la duración/curva del proyecto (default) · corte = 0 s · lento = 3 s.  Shift+tocar = corte puntual. */
  mode: string = "proyecto";
  private static MODES: { [m: string]: number } = { proyecto: null, corte: 0, lento: 3 };
  onMode: (mode: string) => void = null;
  onLayer: (layer: any) => void = null;   /** F15: las otras esferas siguen a la capa en foco */

  project: any = null;            /** #918 P7: moProjectStates (estados del paisaje + línea de tiempo) */
  channel: any = null;            /** #918 D2: moChannel (Control → Player) */
  /** el Player aplica por acá lo que manda el Control */
  selectByLabel(label: string): boolean {
    const i = this.layers.findIndex((f: any) => ("" + f.GetLabelName()) == label);
    if (i < 0) return false;
    this.current = i; return true;
  }

  constructor(private console: any, project: any = null) {
    super("moPresetWheel", "br", "◎", "presets");
    this.project = project;
    if (project) project.onChange = () => this.render();
    this.collect();
    this.render();
  }

  /** capas con presets, en el orden de la consola: pre-efectos, efectos, post, master */
  private collect() {
    const em = this.console.m_EffectManager;
    const all = [].concat(em.PreEffects() || [], em.Effects() || [], em.PostEffects() || [], em.MasterEffects() || []);
    this.layers = all.filter((fx) => fx && fx.GetConfig && fx.GetConfig() && fx.GetConfig().GetPreConfCount() > 0);
    if (this.project && this.project.states().length) this.layers.unshift(this.project.asLayer());   /* el proyecto va primero */
  }

  /** símbolo de un preset: nombres conocidos ⇒ glifo; si no, la inicial */
  private static GLYPH: { [k: string]: string } = {
    dia: "☀", "día": "☀", sol: "☀", noche: "☾", luna: "☾", amanecer: "◓", alba: "◓", atardecer: "◒", ocaso: "◒",
    "mediodía": "☀", mediodia: "☀", primavera: "✿", verano: "☼", "otoño": "❦", otono: "❦", invierno: "❄",
    lluvia: "☂", nube: "☁", nubes: "☁", tormenta: "ϟ", viento: "≋", estrellas: "✦", mar: "≈", fuego: "♨",
    on: "●", off: "○", inicio: "⏮", fin: "⏭",
  };
  static glyph(name: string, i: number): string {
    const k = ("" + name).toLowerCase().replace(/_/g, " ").trim();
    if (moPresetWheel.GLYPH[k]) return moPresetWheel.GLYPH[k];
    for (const w of k.split(/\s+/)) if (moPresetWheel.GLYPH[w]) return moPresetWheel.GLYPH[w];
    const m = k.match(/[a-záéíóúñ0-9]/i);
    return m ? m[0].toUpperCase() : "" + (i + 1);
  }
  /** sigla de la capa para el centro: «paisaje» ⇒ PA, «sol_luz» ⇒ SL */
  static sigla(name: string): string { return moSphere.glyphOf(name); }

  layer(): any { return this.layers[this.current]; }

  /** la capa tocada en la pantalla (o en la esfera de objetos) pasa a ser la de la rueda */
  setLayer(fx: any) {
    const i = this.layers.indexOf(fx);
    if (i >= 0) { this.current = i; this.render(); }
  }

  private nextLayer() {
    if (!this.layers.length) return;
    this.current = (this.current + 1) % this.layers.length;
    this.render();
    const fx = this.layer();
    if (fx) { this.flash(fx.isProject ? "proyecto" : "" + fx.GetLabelName()); if (this.onLayer) this.onLayer(fx); }
  }

  private presetName(fx: any, i: number): string {
    return ("" + (fx.GetConfig().m_PreConfigs[i].m_Name || i + 1)).replace(/_/g, " ");
  }

  call(i: number, hardCut: boolean = false) {
    const fx = this.layer(); if (!fx) return;
    if (this.history) this.history.record(fx.isProject ? this.project.layers() : fx, "preset " + this.presetName(fx, i));
    const d = hardCut ? 0 : moPresetWheel.MODES[this.mode];
    fx.GetConfig().SetCurrentPreConf(i, d === null ? undefined : d);
    if (this.channel) this.channel.send({ verb: "preconfigset", label: "" + fx.GetLabelName(), i, hard: hardCut, mode: this.mode });
    if (this.onCall) this.onCall(fx, i);
    this.render();
    this.flash((hardCut ? "✂ " : "") + this.presetName(fx, i));
  }

  onCapture: (layer: any, preset: number) => void = null;

  nextMode() {
    const ms = Object.keys(moPresetWheel.MODES);
    this.mode = ms[(ms.indexOf(this.mode) + 1) % ms.length];
    if (this.channel) this.channel.send({ verb: "mode", mode: this.mode });
    if (this.onMode) this.onMode(this.mode);
    this.render();
    this.flash({ proyecto: "modo proyecto", corte: "corte duro", lento: "lento 3 s" }[this.mode] || this.mode);
  }

  /** mantener apretado: el estado actual queda guardado en ese preset */
  capture(i: number) {
    const fx = this.layer(); if (!fx) return;
    const cfg = fx.GetConfig();
    const pre: any = cfg.m_PreConfigs[i];
    if (pre && pre.m_Proposed) { this.keepProposal(i); return; }
    if (this.history && !fx.isProject) this.history.record(fx, "guardar preset " + this.presetName(fx, i));
    for (const [pidx, vidx] of cfg.CapturePreConf(i)) fx.ResolveValue(cfg.m_Params[pidx], vidx);
    if (this.channel) this.channel.send({ verb: "preconfigsave", label: "" + fx.GetLabelName(), i });
    if (this.onCapture) this.onCapture(fx, i);
    this.flash("guardado · " + this.presetName(fx, i));
    setTimeout(() => this.render(), 250);
  }

  /* ───────────── F15 · Proponer (nivel 1) ───────────── */

  static PROPOSALS = 4;

  /** ¿la capa en foco tiene lentes propuestas sin elegir? */
  private hasProposals(fx: any): boolean {
    return !!fx && fx.GetConfig().m_PreConfigs.some((p: any) => p.m_Proposed);
  }

  /** ✦: si hay lentes sin elegir, se descartan; si no, se proponen 4 nuevas */
  proposeToggle() {
    const fx = this.layer();
    if (!fx) { this.flash("elegí una capa"); return; }
    if (this.hasProposals(fx)) this.dropProposals(); else this.propose();
  }

  /** genera N presets mezclando dos existentes por param (t ∈ [−0,15, 1,15] + jitter); con `seed` es reproducible */
  /** B3d — sobre el PROYECTO no se interpola (los estados son índices de preset por capa): se RECOMBINAN dos estados del mismo
   *  grupo capa por capa y, con probabilidad MUTA, una capa toma un preset vecino (algo que ningún estado tenía). */
  static MUTA = 0.15;
  private proposeProject(seed: number) {
    const P = this.project; if (!P) return;
    const all: any[] = P.states().filter((s: any) => !s.m_Proposed);
    if (!all.length) return;
    const g = (this.projGroup !== null && this.projGroup !== undefined) ? this.projGroup : P.currentGroup();
    let base = all.filter((s: any) => P.group(s) == g);
    if (base.length < 2) base = all;
    const rnd = mulberry32(seed);
    const cc = this.console.m_Config;
    for (let k = 0; k < moPresetWheel.PROPOSALS; k++) {
      const A = base[Math.floor(rnd() * base.length)];
      let B = base[Math.floor(rnd() * base.length)];
      if (base.length > 1) for (let q = 0; q < 4 && B === A; q++) B = base[Math.floor(rnd() * base.length)];
      const pre: any = new moPreconfig();
      pre.m_Name = "✦" + (k + 1);
      pre.m_XmlAttributes = A.m_XmlAttributes ? Object.assign({}, A.m_XmlAttributes) : null;
      pre.m_Proposed = true;
      for (const pa of A.m_PreconfIndexes) {
        const name = "" + pa.m_ParamName;
        const pb = B.m_PreconfIndexes.find((x: any) => ("" + x.m_ParamName) == name);
        let vi = (pb && rnd() < 0.5) ? pb.m_ValueIndex : pa.m_ValueIndex;
        const r = rnd();
        if (name.indexOf(".") < 0 && r < moPresetWheel.MUTA) {          /* capa entera: preset vecino */
          const fx = P.layerByLabel(name), n = fx ? fx.GetConfig().m_PreConfigs.filter((x: any) => !x.m_Proposed).length : 0;
          if (n > 1) vi = (vi + (rnd() < 0.5 ? n - 1 : 1)) % n;
        }
        const pi = new moPreconfigParamIndex();
        pi.m_ParamName = name; pi.m_ParamIndex = pa.m_ParamIndex; pi.m_ValueIndex = vi;
        pre.m_PreconfIndexes.push(pi);
      }
      cc.m_PreConfigs.push(pre);
    }
  }

  propose(seed: number = null) {
    const fx = this.layer(); if (!fx) return;
    if (fx.isProject) {
      if (seed === null) seed = (Math.random() * 2147483647) | 0;
      this.proposeProject(seed);
      if (this.channel) this.channel.send({ verb: "propose", label: "" + fx.GetLabelName(), seed });
      this.render(); this.flash("✦ " + moPresetWheel.PROPOSALS + " estados"); return;
    }
    const cfg = fx.GetConfig();
    const base: any[] = cfg.m_PreConfigs.filter((p: any) => !p.m_Proposed);
    if (!base.length) return;
    if (seed === null) seed = (Math.random() * 2147483647) | 0;
    const rnd = mulberry32(seed);
    const names: string[] = [];
    for (const pre of base) for (const pi of pre.m_PreconfIndexes)
      if (pi.m_ParamIndex >= 0 && names.indexOf("" + pi.m_ParamName) < 0) names.push("" + pi.m_ParamName);
    const idxIn = (pre: any, name: string, P: any) => {
      const pi = pre.m_PreconfIndexes.find((x: any) => ("" + x.m_ParamName) == name);
      return pi ? pi.m_ValueIndex : Math.max(0, P.GetIndexValue());
    };
    for (let k = 0; k < moPresetWheel.PROPOSALS; k++) {
      const A = base[Math.floor(rnd() * base.length)];
      let B = base[Math.floor(rnd() * base.length)];
      if (base.length > 1) for (let g = 0; g < 4 && B === A; g++) B = base[Math.floor(rnd() * base.length)];
      const pre: any = new moPreconfig();
      pre.m_Name = "✦" + (k + 1);
      pre.m_XmlAttributes = A.m_XmlAttributes ? Object.assign({}, A.m_XmlAttributes) : null;
      pre.m_Proposed = true;
      for (const name of names) {
        const pidx = cfg.GetParamIndex(name); if (pidx < 0) continue;
        const P = cfg.m_Params[pidx];
        const ia = idxIn(A, name, P), ib = idxIn(B, name, P);
        const va = P.m_Values[ia], vb = P.m_Values[ib];
        const t = -0.15 + 1.3 * rnd(), jit = rnd() * 2 - 1;
        let vi = rnd() < 0.5 ? ia : ib;                 /* no numérico: el VAL de uno de los dos */
        const nums = va && vb && va.m_List.length == vb.m_List.length &&
          va.m_List.map((s: any, j: number) => [subNum(s), subNum(vb.m_List[j])]);
        if (nums && nums.length && nums.every((p: number[]) => p[0] !== null && p[1] !== null)) {
          vi = cfg.CloneValue(P, ia);
          if (vi < 0) continue;
          const nv: any = P.m_Values[vi]; nv.m_Proposed = true;
          /* B3d-2 — un param PUBLICADO (lo que el autor dejó para ajustar) no extrapola: queda dentro de lo que sus presets
           * definen. Los rnd() se consumen igual ⇒ la semilla da las mismas lentes en el Player. */
          const pub = ("" + (P.m_Property || "")).toLowerCase() == "published";
          nums.forEach((p: number[], j: number) => {
            const span = Math.max(Math.abs(p[1] - p[0]), Math.abs(p[0]) * 0.15, 0.05);
            let v = p[0] + t * (p[1] - p[0]) + 0.05 * span * jit;
            if (pub) v = Math.min(Math.max(v, Math.min(p[0], p[1])), Math.max(p[0], p[1]));
            nv.m_List[j].SetVal("" + Number(v.toFixed(4)));
          });
          fx.ResolveValue(P, vi);
        }
        const pi = new moPreconfigParamIndex();
        pi.m_ParamName = name; pi.m_ParamIndex = pidx; pi.m_ValueIndex = vi;
        pre.m_PreconfIndexes.push(pi);
      }
      cfg.m_PreConfigs.push(pre);
    }
    if (this.channel) this.channel.send({ verb: "propose", label: "" + fx.GetLabelName(), seed });
    this.render();
    this.flash("✦ " + moPresetWheel.PROPOSALS + " lentes");
  }

  /** mantener una lente: pasa a ser un preset de verdad (y entra al guardado) */
  keepProposal(i: number) {
    const fx = this.layer(); if (!fx) return;
    const cfg = fx.GetConfig(), pre: any = cfg.m_PreConfigs[i];
    if (!pre || !pre.m_Proposed) return;
    pre.m_Proposed = false;
    const pfx = fx.isProject ? "estado ✦" : "lente ";
    pre.m_Name = pfx + (cfg.m_PreConfigs.filter((p: any) => !p.m_Proposed && ("" + p.m_Name).indexOf(pfx) == 0).length + 1);
    if (fx.isProject) {
      const cc = this.console.m_Config; if (cc && cc.SaveConfig) cc.SaveConfig();
      if (this.channel) this.channel.send({ verb: "proposekeep", label: "" + fx.GetLabelName(), i });
      this.render(); this.flash("elegido · " + pre.m_Name); return;
    }
    for (const pi of pre.m_PreconfIndexes) { const v: any = cfg.m_Params[pi.m_ParamIndex] && cfg.m_Params[pi.m_ParamIndex].m_Values[pi.m_ValueIndex]; if (v) v.m_Proposed = false; }
    cfg.SaveConfig();
    if (this.channel) this.channel.send({ verb: "proposekeep", label: "" + fx.GetLabelName(), i });
    this.render();
    this.flash("elegida · " + pre.m_Name);
  }

  /** descarta las lentes no elegidas; la que está sonando se queda (no se corta lo que se ve).
   *  Sus VAL siguen en memoria (deshacer depende de los índices) y ToXML no los escribe. */
  dropProposals() {
    const fx = this.layer(); if (!fx) return;
    if (fx.isProject) {
      const P = this.project, cc = this.console.m_Config, ci = P.currentIndex();
      if (ci >= 0 && P.states()[ci] && P.states()[ci].m_Proposed) this.keepProposal(ci);
      const curSt = P.states()[ci], before = cc.m_PreConfigs.length;
      cc.m_PreConfigs = cc.m_PreConfigs.filter((p: any) => !p.m_Proposed);
      P.setCurrentIndex(curSt ? cc.m_PreConfigs.indexOf(curSt) : -1);
      if (this.channel) this.channel.send({ verb: "proposedrop", label: "" + fx.GetLabelName() });
      this.render(); this.flash("✕ " + (before - cc.m_PreConfigs.length) + " estados"); return;
    }
    const cfg = fx.GetConfig();
    const cur = cfg.m_PreConfigs[cfg.GetCurrentPreConf()];
    if (cur && (cur as any).m_Proposed) { this.keepProposal(cfg.GetCurrentPreConf()); }
    const before = cfg.m_PreConfigs.length;
    cfg.m_PreConfigs = cfg.m_PreConfigs.filter((p: any) => !p.m_Proposed);
    cfg.m_PreconfActual = Math.max(-1, cfg.m_PreConfigs.indexOf(cur));
    if (this.channel) this.channel.send({ verb: "proposedrop", label: "" + fx.GetLabelName() });
    this.render();
    this.flash("✕ " + (before - cfg.m_PreConfigs.length) + " lentes");
  }

  /** P9 — con varios grupos de estados (día / estaciones) la rueda muestra uno por vez */
  projGroup: string = null;
  private static GROUP_LABEL: { [g: string]: string } = { dia: "día", estacion: "estaciones", "": "estados" };
  groupLabel(g: string): string { return moPresetWheel.GROUP_LABEL[g] || g; }

  protected renderOpen() {
    const fx = this.layer(), S = moSphere.SIZE, C = S / 2;
    /* centro: la capa (sigla) */
    const lname = fx ? (fx.isProject ? "proyecto" : "" + fx.GetLabelName()) : "sin presets";
    const c = this.btn(fx ? (fx.isProject ? "◉" : moPresetWheel.sigla(lname)) : "∅", lname, "mw-center", C, C, () => this.nextLayer());
    c.title = lname + " — tocar: siguiente capa";
    /* modo de cambio (arriba izq.) */
    const mg = { proyecto: "≈", corte: "✂", lento: "∿" }[this.mode] || "≈";
    const mb = this.btn(mg, "modo " + this.mode, "mw-mini" + (this.mode != "proyecto" ? " hot" : ""), 14, 14, () => this.nextMode());
    mb.title = "Cómo cambian los presets: proyecto (su duración) · corte (0 s) · lento (3 s). Shift+tocar = corte puntual";
    /* ✦ proponer (arriba der.) */
    const hasP = this.hasProposals(fx);
    const pb = this.btn(hasP ? "✕" : "✦", hasP ? "descartar lentes" : "proponer", "mw-mini" + (hasP ? " hot" : ""), S - 14, 14, () => this.proposeToggle());
    pb.title = hasP ? "Descartar las lentes no elegidas (la que suena se queda)"
                    : "Proponer 4 presets nuevos mezclando los que hay — tocar una lente la llama, mantenerla la guarda";
    /* ayudas (abajo der.) */
    const hb = this.btn("?", "ayudas", "mw-mini" + (this.help ? " on" : ""), S - 14, S - 14, () => this.toggleHelp());
    hb.title = "Mostrar / ocultar los nombres dentro de las esferas";
    if (!fx) return;
    /* anillo: los presets, empezando arriba y en sentido horario */
    const cfg = fx.GetConfig(), cur = cfg.GetCurrentPreConf();
    const groups: string[] = (this.project && this.project.states().length) ? this.project.groups() : [];
    if (groups.length && (this.projGroup === null || groups.indexOf(this.projGroup) < 0)) this.projGroup = this.project.currentGroup();
    let shown: number[] = [];
    for (let i = 0; i < cfg.GetPreConfCount(); i++) shown.push(i);
    if (fx.isProject && groups.length > 1) {
      shown = shown.filter((i) => this.project.group(cfg.m_PreConfigs[i]) == this.projGroup);
      /* abajo izq.: cambiar de grupo */
      const other = groups[(groups.indexOf(this.projGroup) + 1) % groups.length];
      const gb = this.btn("⇄", this.groupLabel(other), "mw-mini", 14, S - 14,
        () => { this.projGroup = other; this.render(); this.flash(this.groupLabel(other)); });
      gb.title = "La rueda muestra un grupo de estados por vez: día o estaciones (son ejes independientes)";
    }
    const pos = this.ringPos(shown.length, shown.length > 8 ? 62 : 58), used: { [g: string]: boolean } = {};
    shown.forEach((i, k) => {
      const pre: any = cfg.m_PreConfigs[i];
      const name = ("" + (pre.m_Name || (i + 1))).replace(/_/g, " ");
      let g = pre.m_Proposed ? "✦" : moPresetWheel.glyph(name, i);
      if (!pre.m_Proposed && used[g]) { const m = name.match(/[a-záéíóúñ0-9]/i); g = m ? m[0].toUpperCase() : "" + (i + 1); }   /* sin glifos repetidos */
      used[g] = true;
      const cls = (pre.m_Proposed ? "ghost" : "") + (i == cur ? " on" : "");
      const b = this.btn(g, name, cls, pos[k].x, pos[k].y, () => this.call(i, this.shiftDown), () => this.capture(i));
      b.title = pre.m_Proposed ? name + " — tocar: probarla · mantener: quedársela"
                               : name + " — tocar: llamar · mantener: guardar el estado actual";
    });
  }
}
