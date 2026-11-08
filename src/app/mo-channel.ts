/**
 * #918 D2 — canal Control → Player (mismo vocabulario que la API /moldeo del 1.0, en chico).
 * Entre ventanas del mismo origen (las 2 ventanas del Director, o 2 pestañas) va por BroadcastChannel.
 * El Control manda; el Player (?role=player) aplica por los MISMOS caminos que la interfaz, así su
 * historial y sus transiciones son idénticos.
 *   {verb:"preconfigset", label, i, hard}   {verb:"preconfigsave", label, i}
 *   {verb:"valueset", label, param, value}  {verb:"undo"} {verb:"redo"} {verb:"play"} {verb:"pause"} {verb:"mode", mode}
 */
export class moChannel {
  role: string;
  private bc: any = null;
  onMessage: (m: any) => void = null;

  constructor() {
    let r = "control";
    try { r = new URLSearchParams(window.location.search).get("role") || "control"; } catch (e) {}
    this.role = r;
    try {
      this.bc = new (window as any).BroadcastChannel("moldeo");
      this.bc.onmessage = (ev: any) => { if (this.role == "player" && this.onMessage) this.onMessage(ev.data); };
    } catch (e) { this.bc = null; }
  }
  isPlayer(): boolean { return this.role == "player"; }
  send(m: any) { if (this.bc && this.role == "control") this.bc.postMessage(m); }
}
