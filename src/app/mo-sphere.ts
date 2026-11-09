/**
 * #918 F15 — la ESFERA, el widget único del boceto («son todas esferas»).
 *
 *  - una esquina del mural: tl (objetos) · tr (parámetros) · bl (tiempo) · br (presets)
 *  - botones = sólo un símbolo; la palabra aparece con fade in/out (flash) y, opcional, como ayuda («?»)
 *  - plegable: un orbe chico con su glifo; tocar ⇒ se abre. Abierta/plegada y ayudas se recuerdan por visor.
 *
 * DOM propio, sin componente Angular (igual que la rueda de presets, que extiende esta clase).
 */

export type moSphereCorner = "tl" | "tr" | "bl" | "br";

export class moSphere {

  static SIZE = 176;
  static ORB = 52;
  private static all: moSphere[] = [];
  static help: boolean = (() => { try { return localStorage.getItem("moPresetWheel.help") == "1"; } catch (e) { return false; } })();

  root: HTMLDivElement;
  protected ring: HTMLDivElement;
  private flashEl: HTMLDivElement;
  private flashTimer: any = null;
  open: boolean = true;
  protected shiftDown: boolean = false;

  constructor(public id: string, public corner: moSphereCorner, public glyph: string, public word: string,
              public collapsible: boolean = false) {
    moSphere.ensureStyle();
    if (collapsible) { try { this.open = localStorage.getItem("moSphere.open." + id) == "1"; } catch (e) { this.open = false; } }
    const r = document.createElement("div");
    r.id = id; r.className = "mo-sphere mo-sphere-" + corner;
    r.setAttribute("data-html2canvas-ignore", "");
    this.ring = document.createElement("div");
    this.flashEl = document.createElement("div");
    this.flashEl.className = "mw-flash";
    this.flashEl.setAttribute("aria-live", "polite");
    r.appendChild(this.ring); r.appendChild(this.flashEl);
    document.body.appendChild(r);
    this.root = r;
    moSphere.all.push(this);
    this.applyHelp();
    this.place();
    window.addEventListener("resize", () => this.place());
    setTimeout(() => this.place(), 1500);   /* el header termina de armarse después (personas, versiones) */
  }

  /** arriba: debajo de lo que ocupe su columna (header —que en celular se parte en dos filas— y la barra 📷 del lienzo) */
  place() {
    if (this.corner[0] != "t") return;
    const vw = window.innerWidth, w = moSphere.SIZE + 14;
    const x0 = this.corner == "tl" ? 0 : vw - w, x1 = this.corner == "tl" ? w : vw;
    let b = 0;
    document.querySelectorAll("header.moHeader, header.moHeader *, #moldeobuttons, #moldeobuttons *").forEach((el: any) => {
      const r = el.getBoundingClientRect();
      if (!r.height || !r.width || r.top > window.innerHeight * 0.4) return;
      if (r.right < x0 || r.left > x1) return;
      b = Math.max(b, r.bottom);
    });
    this.root.style.top = Math.max(14, Math.round(b + 10)) + "px";
  }

  /** la palabra del botón tocado aparece y se va */
  flash(text: string) {
    const f = this.flashEl; if (!f || !text) return;
    f.textContent = text;
    f.classList.remove("show"); void f.offsetWidth; f.classList.add("show");
    clearTimeout(this.flashTimer);
    this.flashTimer = setTimeout(() => f.classList.remove("show"), 1500);
  }

  /** las ayudas son una sola para todas las esferas */
  get help(): boolean { return moSphere.help; }
  private applyHelp() { this.root.classList.toggle("mw-help", moSphere.help); }
  toggleHelp() {
    moSphere.help = !moSphere.help;
    try { localStorage.setItem("moPresetWheel.help", moSphere.help ? "1" : "0"); } catch (e) { }
    for (const s of moSphere.all) { s.applyHelp(); s.render(); }
    this.flash(moSphere.help ? "ayudas ✓" : "ayudas ✕");
  }

  toggleOpen() {
    this.open = !this.open;
    try { localStorage.setItem("moSphere.open." + this.id, this.open ? "1" : "0"); } catch (e) { }
    this.render();
    this.flash(this.word);
  }

  /** un botón = símbolo; la palabra va en aria-label/title, en la ayuda opcional y en el flash */
  protected btn(glyph: string, word: string, cls: string, x: number, y: number, fn: () => void, hold: () => void = null): HTMLButtonElement {
    const b = document.createElement("button");
    b.type = "button"; b.className = "mw-b " + cls;
    b.style.left = x + "px"; b.style.top = y + "px";
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
    this.ring.appendChild(b);
    return b;
  }

  /** posiciones de un anillo de n piedras, empezando arriba y en sentido horario */
  protected ringPos(n: number, R: number = 58): { x: number, y: number }[] {
    const C = moSphere.SIZE / 2, out = [];
    for (let k = 0; k < n; k++) {
      const a = -Math.PI / 2 + (2 * Math.PI * k) / Math.max(1, n);
      out.push({ x: C + R * Math.cos(a), y: C + R * Math.sin(a) });
    }
    return out;
  }

  render() {
    if (!this.ring) return;
    this.place();
    this.ring.innerHTML = "";
    this.root.classList.toggle("mo-sphere-closed", !this.open);
    if (!this.open) {
      const o = this.btn(this.glyph, this.word, "mw-orb", moSphere.ORB / 2, moSphere.ORB / 2, () => this.toggleOpen());
      o.title = this.word + " — tocar: abrir";
      return;
    }
    this.renderOpen();
  }

  /** contenido de la esfera abierta (cada esfera lo define) */
  protected renderOpen() { }

  /** el centro de una esfera plegable la pliega */
  protected foldCenter(glyph: string, word: string) {
    const C = moSphere.SIZE / 2;
    const c = this.btn(glyph, word, "mw-center", C, C, () => this.toggleOpen());
    c.title = word + " — tocar: plegar";
    return c;
  }

  static glyphOf(name: string): string {
    const w = ("" + name).replace(/[^a-záéíóúñ0-9 _-]/gi, "").split(/[ _-]+/).filter((x) => x);
    if (!w.length) return "◉";
    return (w.length > 1 ? w[0][0] + w[1][0] : w[0].slice(0, 2)).toUpperCase();
  }

  private static ensureStyle() {
    if (document.getElementById("moSphereStyle")) return;
    const S = moSphere.SIZE, O = moSphere.ORB;
    const st = document.createElement("style");
    st.id = "moSphereStyle";
    st.textContent = `
.mo-sphere{--mw-neon:#5ef2ff;--mw-hot:#ff5ed8;--mw-ink:#06070f;position:fixed;z-index:2147483000;
 width:${S}px;height:${S}px;border-radius:50%;
 background:radial-gradient(circle at 50% 42%,rgba(40,48,96,.78),rgba(6,7,15,.86) 68%);
 box-shadow:0 0 0 2px rgba(94,242,255,.55),0 0 18px rgba(94,242,255,.35),inset 0 0 22px rgba(94,242,255,.18);
 backdrop-filter:blur(4px);touch-action:none;user-select:none;-webkit-user-select:none;
 font-family:system-ui,-apple-system,"Segoe UI",sans-serif;transition:width .18s ease,height .18s ease}
.mo-sphere-br{right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px))}
.mo-sphere-bl{left:calc(14px + env(safe-area-inset-left,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px))}
.mo-sphere-tl{left:calc(14px + env(safe-area-inset-left,0px));top:70px}
.mo-sphere-tr{right:calc(14px + env(safe-area-inset-right,0px));top:70px}
.mo-sphere::before{content:"";position:absolute;inset:7px;border-radius:50%;pointer-events:none;
 background:conic-gradient(from 0deg,transparent 0 70%,rgba(94,242,255,.55) 85%,transparent 100%);
 -webkit-mask:radial-gradient(circle,transparent 92%,#000 93%,#000 96%,transparent 97%);
         mask:radial-gradient(circle,transparent 92%,#000 93%,#000 96%,transparent 97%);
 animation:mwSpin 9s linear infinite}
.mo-sphere.mo-sphere-closed{width:${O}px;height:${O}px;background:none;box-shadow:none;backdrop-filter:none}
.mo-sphere.mo-sphere-closed::before{display:none}
@keyframes mwSpin{to{transform:rotate(360deg)}}
.mo-sphere .mw-b{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;
 width:36px;height:36px;padding:0;border-radius:50%;cursor:pointer;touch-action:none;overflow:visible;
 border:1.5px solid rgba(94,242,255,.7);background:rgba(6,7,15,.82);color:#e9fbff;
 font:600 17px/1 system-ui,sans-serif;transform:translate(-50%,-50%);
 transition:transform .12s ease,box-shadow .2s ease,background .2s ease}
.mo-sphere .mw-b:hover{transform:translate(-50%,-50%) scale(1.12);box-shadow:0 0 10px var(--mw-neon)}
.mo-sphere .mw-b:active{transform:translate(-50%,-50%) scale(.92)}
.mo-sphere .mw-b.on{background:var(--mw-neon);color:var(--mw-ink);border-color:#fff;
 box-shadow:0 0 6px #fff,0 0 16px var(--mw-neon),0 0 28px rgba(94,242,255,.6)}
.mo-sphere .mw-b.hot{background:var(--mw-hot);color:var(--mw-ink);border-color:#fff;box-shadow:0 0 12px var(--mw-hot)}
.mo-sphere .mw-b.go{background:#9be38b;color:var(--mw-ink);border-color:#fff;box-shadow:0 0 12px #9be38b}
.mo-sphere .mw-b.rec{background:#ff4d5e;color:#fff;border-color:#fff;box-shadow:0 0 14px #ff4d5e;animation:mwPulse 1s ease-in-out infinite}
@keyframes mwPulse{50%{box-shadow:0 0 4px #ff4d5e}}
.mo-sphere .mw-b.off{opacity:.38;border-style:dashed}
.mo-sphere .mw-b.ghost{border-style:dashed;border-color:#ffd36b;color:#ffd36b;background:rgba(40,30,6,.75)}
.mo-sphere .mw-b.ghost.on{background:#ffd36b;color:var(--mw-ink);box-shadow:0 0 14px #ffd36b}
.mo-sphere .mw-b.k-pre{border-color:#9be38b}.mo-sphere .mw-b.k-post{border-color:#ffd36b}.mo-sphere .mw-b.k-master{border-color:#ff5ed8}
.mo-sphere .mw-center{width:50px;height:50px;font-size:13px;letter-spacing:.04em;
 border-color:rgba(255,94,216,.85);box-shadow:0 0 12px rgba(255,94,216,.45)}
.mo-sphere .mw-mini{width:26px;height:26px;font-size:13px}
.mo-sphere .mw-orb{width:${O}px;height:${O}px;font-size:21px;border:2px solid rgba(94,242,255,.85);
 background:radial-gradient(circle at 50% 40%,rgba(40,48,96,.9),rgba(6,7,15,.92));box-shadow:0 0 14px rgba(94,242,255,.45)}
.mo-sphere .mw-t{display:none;font:600 8px/1 system-ui,sans-serif;margin-top:2px;max-width:58px;
 overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.85}
.mo-sphere.mw-help .mw-b{width:44px;height:44px;font-size:15px}
.mo-sphere.mw-help .mw-t{display:block}
.mo-sphere.mw-help .mw-mini{width:26px;height:26px;font-size:13px}
.mo-sphere.mw-help .mw-mini .mw-t,.mo-sphere.mw-help .mw-orb .mw-t{display:none}
.mo-sphere.mw-help .mw-center{width:50px;height:50px;font-size:13px}
.mo-sphere.mw-help .mw-orb{width:${O}px;height:${O}px;font-size:21px}
.mo-sphere .mw-flash{position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);
 pointer-events:none;white-space:nowrap;font:700 15px/1.1 system-ui,sans-serif;letter-spacing:.06em;
 text-transform:uppercase;color:#fff;padding:6px 12px;border-radius:999px;background:rgba(6,7,15,.78);
 text-shadow:0 0 8px var(--mw-neon),0 0 16px var(--mw-neon);box-shadow:0 0 0 1px rgba(94,242,255,.5);opacity:0;z-index:2}
.mo-sphere-tl .mw-flash,.mo-sphere-tr .mw-flash{bottom:auto;top:calc(100% + 8px)}
.mo-sphere-tl .mw-flash,.mo-sphere-bl .mw-flash{left:0;transform:none}
.mo-sphere-tr .mw-flash,.mo-sphere-br .mw-flash{left:auto;right:0;transform:none}
.mo-sphere .mw-flash.show{animation:mwFlash 1.4s ease forwards}
@keyframes mwFlash{0%{opacity:0;margin-bottom:-6px}15%{opacity:1;margin-bottom:0}75%{opacity:1}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.mo-sphere::before{animation:none}.mo-sphere .mw-b.rec{animation:none}
 .mo-sphere .mw-flash.show{animation:mwFade 1.4s linear forwards}}
@keyframes mwFade{0%,100%{opacity:0}15%,75%{opacity:1}}
body.mo-player .mo-sphere{display:none!important}`;
    document.head.appendChild(st);
  }
}
