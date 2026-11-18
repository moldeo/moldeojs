/**
 * REGLA de deploy (FCA 18-nov-2026): todo link al player lleva `&seed=<número>&v=<versión>`.
 * El seed de la URL de index.html sólo renueva el index: para que también se renueven el .mol, los .cfg,
 * las texturas, los videos y los json del proyecto, CADA descarga del proyecto pasa por acá.
 * Sin `seed` ni `v` en la URL del player la URL vuelve IGUAL (comportamiento de siempre).
 * Doc: docs/regla-cache-bust-player.md
 */
let _suffix: string = null;

/** `seed=…&v=…` tomado de la URL del player ("" si no trae ninguno). Se lee una vez. */
export function moCacheBustSuffix(): string {
  if (_suffix !== null) return _suffix;
  _suffix = "";
  try {
    const q = new URLSearchParams(window.location.search);
    const parts: string[] = [];
    for (const k of ["seed", "v"]) {
      const val = q.get(k);
      if (val) parts.push(k + "=" + encodeURIComponent(val));
    }
    _suffix = parts.join("&");
  } catch (e) { _suffix = ""; }
  return _suffix;
}

/** Agrega `seed`/`v` del player a una URL de descarga (no toca data:/blob: ni una URL que ya los traiga). */
export function moCacheBust(url: string): string {
  const sfx = moCacheBustSuffix();
  if (!sfx || !url) return url;
  const u = "" + url;
  if (/^(data|blob):/i.test(u)) return u;
  const hashAt = u.indexOf("#");
  const base = hashAt >= 0 ? u.substring(0, hashAt) : u;
  const hash = hashAt >= 0 ? u.substring(hashAt) : "";
  if (/[?&]seed=/.test(base)) return u;
  return base + (base.indexOf("?") >= 0 ? "&" : "?") + sfx + hash;
}
