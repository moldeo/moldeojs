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

  private undoStack: CfgPhoto[] = [];
  private redoStack: CfgPhoto[] = [];
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

  /** llamar ANTES de cambiar algo */
  record(fx: any, what: string) {
    if (!fx || !fx.GetConfig || !fx.GetConfig()) return;
    this.undoStack.push(this.photo(fx, what));
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
    const ph = this.undoStack.pop(); if (!ph) return "";
    this.redoStack.push(this.photo(ph.fx, ph.what));
    this.restore(ph);
    if (this.onChange) this.onChange();
    return ph.what;
  }

  redo(): string {
    const ph = this.redoStack.pop(); if (!ph) return "";
    this.undoStack.push(this.photo(ph.fx, ph.what));
    this.restore(ph);
    if (this.onChange) this.onChange();
    return ph.what;
  }

  canUndo(): boolean { return this.undoStack.length > 0; }
  canRedo(): boolean { return this.redoStack.length > 0; }
  lastWhat(): string { const p = this.undoStack[this.undoStack.length - 1]; return p ? p.label + ": " + p.what : ""; }
}
