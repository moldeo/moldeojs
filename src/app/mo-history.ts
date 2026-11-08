/**
 * #918 H1 — deshacer / rehacer en la sesión.
 *
 * Antes de cada acción se guarda una FOTO del config completo de la capa tocada:
 *  - por param: cuántos VAL tiene, cuál está activo y el texto de cada sub-valor
 *  - por preset: a qué VAL apunta cada param
 *  - el preset activo
 * Deshacer = volver a esa foto (se recortan los VAL agregados, se reponen textos e índices y se recompilan
 * las expresiones que cambiaron). Es genérico: sirve igual para arrastrar, editar un valor, llamar o guardar
 * un preset, sin que cada acción tenga que saber deshacerse.
 */

interface ParamPhoto { n: number; cur: number; texts: string[][]; }
interface CfgPhoto { fx: any; label: string; what: string; preActual: number; params: ParamPhoto[]; pres: number[][]; }

const NUMERIC = ["NUM", "CHAR", "INT", "LONG", "FLOAT", "DOUBLE"];

function subText(vb: any): string {
  const t = "" + ((vb.m_XmlAttributes && vb.m_XmlAttributes["type"]) || (vb.GetTypeStr && vb.GetTypeStr()));
  return NUMERIC.indexOf(t) >= 0 ? "" + vb.m_Number : "" + vb.m_Text;
}

export class moHistory {

  private undoStack: CfgPhoto[][] = [];   /** cada paso = fotos de una o varias capas */
  private redoStack: CfgPhoto[][] = [];
  max: number = 200;
  onChange: () => void = null;

  /** foto del estado actual de la capa */
  photo(fx: any, what: string): CfgPhoto {
    const cfg = fx.GetConfig();
    return {
      fx, what, label: "" + fx.GetLabelName(),
      preActual: cfg.m_PreconfActual,
      params: cfg.m_Params.map((P: any) => ({
        n: P.m_Values.length,
        cur: P.GetIndexValue(),
        texts: P.m_Values.map((v: any) => v.m_List.map((vb: any) => subText(vb))),
      })),
      pres: cfg.m_PreConfigs.map((pre: any) => pre.m_PreconfIndexes.map((pi: any) => pi.m_ValueIndex)),
    };
  }

  /** llamar ANTES de cambiar algo. `fx` puede ser una capa o varias (un estado de proyecto = un solo paso) */
  record(fx: any, what: string) {
    const fxs = (Array.isArray(fx) ? fx : [fx]).filter((f: any) => f && f.GetConfig && f.GetConfig() && f.GetConfig().m_Params);
    if (!fxs.length) return;
    this.undoStack.push(fxs.map((f: any) => this.photo(f, what)));
    if (this.undoStack.length > this.max) this.undoStack.shift();
    this.redoStack = [];
    if (this.onChange) this.onChange();
  }

  /** vuelve la capa a la foto */
  private restore(ph: CfgPhoto) {
    const fx = ph.fx, cfg = fx.GetConfig();
    cfg.m_PreConfigs.forEach((pre: any, i: number) => {
      const idx = ph.pres[i]; if (!idx) return;
      pre.m_PreconfIndexes.forEach((pi: any, j: number) => { if (idx[j] !== undefined) pi.m_ValueIndex = idx[j]; });
    });
    cfg.m_Params.forEach((P: any, i: number) => {
      const pp = ph.params[i]; if (!pp) return;
      if (P.m_Values.length > pp.n) P.m_Values.length = pp.n;        /* los VAL que agregó la acción */
      P.m_Values.forEach((v: any, vi: number) => {
        const tt = pp.texts[vi]; if (!tt) return;
        let changed = false;
        v.m_List.forEach((vb: any, si: number) => {
          if (tt[si] !== undefined && subText(vb) !== tt[si]) { vb.SetVal(tt[si]); changed = true; }
        });
        if (changed) fx.ResolveValue(P, vi);
      });
      if (pp.cur >= 0 && pp.cur < P.m_Values.length) P.SetIndexValue(pp.cur);
    });
    cfg.m_PreconfActual = ph.preActual;
    if (cfg.m_TransFrom !== undefined) cfg.m_TransFrom = {};   /* corta una transición a medias */
  }

  undo(): string {
    const st = this.undoStack.pop(); if (!st) return "";
    this.redoStack.push(st.map((ph) => this.photo(ph.fx, ph.what)));
    st.forEach((ph) => this.restore(ph));
    if (this.onChange) this.onChange();
    return st[0].what;
  }

  redo(): string {
    const st = this.redoStack.pop(); if (!st) return "";
    this.undoStack.push(st.map((ph) => this.photo(ph.fx, ph.what)));
    st.forEach((ph) => this.restore(ph));
    if (this.onChange) this.onChange();
    return st[0].what;
  }

  canUndo(): boolean { return this.undoStack.length > 0; }
  canRedo(): boolean { return this.redoStack.length > 0; }
  lastWhat(): string { const st = this.undoStack[this.undoStack.length - 1]; return st ? (st.length > 1 ? "proyecto" : st[0].label) + ": " + st[0].what : ""; }
}
