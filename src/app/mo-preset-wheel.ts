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

  /** F14 — esfera chica: el anillo se redibuja; el flash y el estilo quedan */
  private ring: HTMLDivElement;
  private flashEl: HTMLDivElement;
  private flashTimer: any = null;
  static SIZE = 176;
  /** ayudas (etiquetas) dentro de la esfera: opcionales, recordadas por visor */
  help: boolean = false;

  private build() {
    if (!document.getElementById("moPresetWheelStyle")) {
      const st = document.createElement("style");
      st.id = "moPresetWheelStyle";
      st.textContent = `
#moPresetWheel{--mw-neon:#5ef2ff;--mw-hot:#ff5ed8;--mw-ink:#06070f;position:fixed;z-index:2147483000;
 width:${moPresetWheel.SIZE}px;height:${moPresetWheel.SIZE}px;border-radius:50%;
 right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));
 background:radial-gradient(circle at 50% 42%,rgba(40,48,96,.78),rgba(6,7,15,.86) 68%);
 box-shadow:0 0 0 2px rgba(94,242,255,.55),0 0 18px rgba(94,242,255,.35),inset 0 0 22px rgba(94,242,255,.18);
 backdrop-filter:blur(4px);touch-action:none;user-select:none;-webkit-user-select:none;
 font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
#moPresetWheel::before{content:"";position:absolute;inset:7px;border-radius:50%;pointer-events:none;
 background:conic-gradient(from 0deg,transparent 0 70%,rgba(94,242,255,.55) 85%,transparent 100%);
 -webkit-mask:radial-gradient(circle,transparent 92%,#000 93%,#000 96%,transparent 97%);
         mask:radial-gradient(circle,transparent 92%,#000 93%,#000 96%,transparent 97%);
 animation:mwSpin 9s linear infinite}
@keyframes mwSpin{to{transform:rotate(360deg)}}
#moPresetWheel .mw-b{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;
 width:36px;height:36px;padding:0;border-radius:50%;cursor:pointer;touch-action:none;
 border:1.5px solid rgba(94,242,255,.7);background:rgba(6,7,15,.82);color:#e9fbff;
 font:600 17px/1 system-ui,sans-serif;transform:translate(-50%,-50%);
 transition:transform .12s ease,box-shadow .2s ease,background .2s ease}
#moPresetWheel .mw-b:hover{transform:translate(-50%,-50%) scale(1.12);box-shadow:0 0 10px var(--mw-neon)}
#moPresetWheel .mw-b:active{transform:translate(-50%,-50%) scale(.92)}
#moPresetWheel .mw-b.on{background:var(--mw-neon);color:var(--mw-ink);border-color:#fff;
 box-shadow:0 0 6px #fff,0 0 16px var(--mw-neon),0 0 28px rgba(94,242,255,.6)}
#moPresetWheel .mw-b.hot{background:var(--mw-hot);color:var(--mw-ink);border-color:#fff;box-shadow:0 0 12px var(--mw-hot)}
#moPresetWheel .mw-b.go{background:#9be38b;color:var(--mw-ink);border-color:#fff;box-shadow:0 0 12px #9be38b}
#moPresetWheel .mw-center{width:50px;height:50px;font-size:13px;letter-spacing:.04em;
 border-color:rgba(255,94,216,.85);box-shadow:0 0 12px rgba(255,94,216,.45)}
#moPresetWheel .mw-mini{width:26px;height:26px;font-size:13px}
#moPresetWheel .mw-t{display:none;font:600 8px/1 system-ui,sans-serif;margin-top:2px;max-width:58px;
 overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85}
#moPresetWheel.mw-help .mw-b{width:44px;height:44px;font-size:15px}
#moPresetWheel.mw-help .mw-t{display:block}
#moPresetWheel.mw-help .mw-mini{width:26px;height:26px;font-size:13px}
#moPresetWheel.mw-help .mw-center{width:50px;height:50px;font-size:13px}
#moPresetWheel.mw-help .mw-mini .mw-t{display:none}
#moPresetWheel .mw-flash{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);
 pointer-events:none;white-space:nowrap;font:700 15px/1.1 system-ui,sans-serif;letter-spacing:.06em;
 text-transform:uppercase;color:#fff;padding:6px 12px;border-radius:999px;background:rgba(6,7,15,.78);
 text-shadow:0 0 8px var(--mw-neon),0 0 16px var(--mw-neon);box-shadow:0 0 0 1px rgba(94,242,255,.5);opacity:0}
#moPresetWheel .mw-flash.show{animation:mwFlash 1.4s ease forwards}
@keyframes mwFlash{0%{opacity:0;transform:translate(-50%,6px) scale(.9)}15%{opacity:1;transform:translate(-50%,0) scale(1.06)}
 30%{transform:translate(-50%,0) scale(1)}75%{opacity:1}100%{opacity:0;transform:translate(-50%,-6px)}}
@media (prefers-reduced-motion:reduce){#moPresetWheel::before{animation:none}
 #moPresetWheel .mw-flash.show{animation:mwFade 1.4s linear forwards}}
@keyframes mwFade{0%,100%{opacity:0}15%,75%{opacity:1}}`;
      document.head.appendChild(st);
    }
    const r = document.createElement("div");
    r.id = "moPresetWheel";
    r.setAttribute("data-html2canvas-ignore", "");
    try { this.help = localStorage.getItem("moPresetWheel.help") == "1"; } catch (e) { }
    r.classList.toggle("mw-help", this.help);
    this.ring = document.createElement("div");
    this.flashEl = document.createElement("div");
    this.flashEl.className = "mw-flash";
    this.flashEl.setAttribute("aria-live", "polite");
    r.appendChild(this.ring); r.appendChild(this.flashEl);
    document.body.appendChild(r);
    this.root = r;
  }

  /** la palabra del botón tocado aparece y se va (fade in / fade out) */
  flash(text: string) {
    const f = this.flashEl; if (!f || !text) return;
    f.textContent = text;
    f.classList.remove("show"); void f.offsetWidth; f.classList.add("show");
    clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => f.classList.remove("show"), 1500);
  }

  toggleHelp() {
    this.help = !this.help;
    this.root.classList.toggle("mw-help", this.help);
    try { localStorage.setItem("moPresetWheel.help", this.help ? "1" : "0"); } catch (e) { }
    this.flash(this.help ? "ayudas ✓" : "ayudas ✕");
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
  static sigla(name: string): string {
    const w = ("" + name).replace(/[^a-záéíóúñ0-9 _-]/gi, "").split(/[ _-]+/).filter((x) => x);
    if (!w.length) return "◉";
    return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
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
    const fx = this.layer(); if (fx) this.flash(fx.isProject ? "proyecto" : "" + fx.GetLabelName());
  }

  call(i: number, hardCut: boolean = false) {
    const fx = this.layer(); if (!fx) return;
    if (this.history) this.history.record(fx.isProject ? this.project.layers() : fx, "preset " + (fx.GetConfig().m_PreConfigs[i].m_Name || i + 1));
    const d = hardCut ? 0 : moPresetWheel.MODES[this.mode];
    fx.GetConfig().SetCurrentPreConf(i, d === null ? undefined : d);
    if (this.channel) this.channel.send({ verb: "preconfigset", label: "" + fx.GetLabelName(), i, hard: hardCut, mode: this.mode });
    if (this.onCall) this.onCall(fx, i);
    this.render();
    this.flash((hardCut ? "✂ " : "") + ("" + (fx.GetConfig().m_PreConfigs[i].m_Name || i + 1)).replace(/_/g, " "));
  }

  onCapture: (layer: any, preset: number) => void = null;
  private shiftDown: boolean = false;

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
    if (this.history && !fx.isProject) this.history.record(fx, "guardar preset " + (cfg.m_PreConfigs[i].m_Name || i + 1));
    for (const [pidx, vidx] of cfg.CapturePreConf(i)) fx.ResolveValue(cfg.m_Params[pidx], vidx);
    if (this.channel) this.channel.send({ verb: "preconfigsave", label: "" + fx.GetLabelName(), i });
    if (this.onCapture) this.onCapture(fx, i);
    this.flash("guardado · " + ("" + (cfg.m_PreConfigs[i].m_Name || i + 1)).replace(/_/g, " "));
    setTimeout(() => this.render(), 250);
  }

  /** P9 — con varios grupos de estados (día / estaciones) la rueda muestra uno por vez */
  projGroup: string = null;
  private static GROUP_LABEL: { [g: string]: string } = { dia: "día", estacion: "estaciones", "": "estados" };
  private groupLabel(g: string): string { return moPresetWheel.GROUP_LABEL[g] || g; }

  render() {
    const r = this.ring; if (!r) return; r.innerHTML = "";
    const fx = this.layer(), S = moPresetWheel.SIZE, C = S / 2;
    /** un botón = símbolo; la palabra va en el title, en la ayuda opcional y en el flash */
    const btn = (glyph: string, word: string, cls: string, pos: string, fn: () => void, hold: () => void = null) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "mw-b " + cls; b.style.cssText = pos;
      b.setAttribute("aria-label", word); b.title = word;
      const g = document.createElement("span"); g.textContent = glyph; b.appendChild(g);
      const t = document.createElement("span"); t.className = "mw-t"; t.textContent = word; b.appendChild(t);
      b.addEventListener("pointerdown", (e) => {
        e.preventDefault(); e.stopPropagation();
        this.shiftDown = e.shiftKey;
        if (!hold) { fn(); return; }
        let held = false;
        const timer = setTimeout(() => { held = true; b.classList.add("hot"); hold(); }, 700);
        const end = () => { clearTimeout(timer); b.removeEventListener("pointerup", end); b.removeEventListener("pointercancel", cancel); if (!held) fn(); };
        const cancel = () => { clearTimeout(timer); b.removeEventListener("pointerup", end); b.removeEventListener("pointercancel", cancel); };
        b.addEventListener("pointerup", end); b.addEventListener("pointercancel", cancel);
      });
      r.appendChild(b);
      return b;
    };
    const corner = (x: number, y: number) => `left:${x}px;top:${y}px;`;
    /* centro: la capa (sigla) */
    const lname = fx ? (fx.isProject ? "proyecto" : "" + fx.GetLabelName()) : "sin presets";
    const c = btn(fx ? (fx.isProject ? "◉" : moPresetWheel.sigla(lname)) : "∅", lname, "mw-center", corner(C, C), () => this.nextLayer());
    c.title = lname + " — tocar: siguiente capa";
    /* modo de cambio (arriba izq.) */
    const mg = { proyecto: "≈", corte: "✂", lento: "∿" }[this.mode] || "≈";
    const mb = btn(mg, "modo " + this.mode, "mw-mini" + (this.mode != "proyecto" ? " hot" : ""), corner(14, 14), () => this.nextMode());
    mb.title = "Cómo cambian los presets: proyecto (su duración) · corte (0 s) · lento (3 s). Shift+tocar = corte puntual";
    /* ayudas (abajo der.) */
    const hb = btn("?", "ayudas", "mw-mini" + (this.help ? " on" : ""), corner(S - 14, S - 14), () => { this.toggleHelp(); this.render(); });
    hb.title = "Mostrar / ocultar los nombres dentro de la esfera";
    /* línea de tiempo (arriba der.) */
    const groups: string[] = (this.project && this.project.states().length) ? this.project.groups() : [];
    if (groups.length && (this.projGroup === null || groups.indexOf(this.projGroup) < 0)) this.projGroup = this.project.currentGroup();
    if (groups.length) {
      const pg = this.project.playing ? this.project.currentGroup() : this.projGroup;
      const tb = btn(this.project.playing ? "⏸" : "▶", (this.project.playing ? "pausa " : "play ") + this.groupLabel(pg),
        "mw-mini" + (this.project.playing ? " go" : ""), corner(S - 14, 14),
        () => { this.project.toggle(this.projGroup); this.render(); this.flash((this.project.playing ? "▶ " : "⏸ ") + this.groupLabel(this.projGroup)); });
      tb.title = "Línea de tiempo: recorre en loop los estados del grupo que muestra la rueda (cada uno con su duración)";
    }
    if (!fx) return;
    /* anillo: los presets, empezando arriba y en sentido horario */
    const cfg = fx.GetConfig(), cur = cfg.GetCurrentPreConf();
    let shown: number[] = [];
    for (let i = 0; i < cfg.GetPreConfCount(); i++) shown.push(i);
    if (fx.isProject && groups.length > 1) {
      shown = shown.filter((i) => this.project.group(cfg.m_PreConfigs[i]) == this.projGroup);
      /* abajo izq.: cambiar de grupo */
      const other = groups[(groups.indexOf(this.projGroup) + 1) % groups.length];
      const gb = btn("⇄", this.groupLabel(other), "mw-mini", corner(14, S - 14),
        () => { this.projGroup = other; this.render(); this.flash(this.groupLabel(other)); });
      gb.title = "La rueda muestra un grupo de estados por vez: día o estaciones (son ejes independientes)";
    }
    const n = shown.length, R = 58, used: { [g: string]: boolean } = {};
    for (let k = 0; k < n; k++) {
      const i = shown[k];
      const a = -Math.PI / 2 + (2 * Math.PI * k) / n;
      const name = ("" + (cfg.m_PreConfigs[i].m_Name || (i + 1))).replace(/_/g, " ");
      let g = moPresetWheel.glyph(name, i);
      if (used[g]) { const m = name.match(/[a-záéíóúñ0-9]/i); g = m ? m[0].toUpperCase() : "" + (i + 1); }   /* sin glifos repetidos */
      used[g] = true;
      const b = btn(g, name, i == cur ? "on" : "", corner(C + R * Math.cos(a), C + R * Math.sin(a)),
        () => this.call(i, this.shiftDown), () => this.capture(i));
      b.title = name + " — tocar: llamar · mantener: guardar el estado actual";
    }
  }
}
