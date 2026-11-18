# REGLA — todo link al player de moldeojs lleva `&seed=<número>&v=<versión>` (FCA 18-nov-2026)

> FCA, 18-nov 17:1xZ: «cuando linkeás en el iframe el `…/odoo_moldeo_lab/static/moldeojs/index.html?mol=…&role=player` es
> FUNDAMENTAL que agregues siempre un parámetro `&seed=83878724832` y un número de la versión, así no se queda colgado con el
> último caché… esto es fundamental como parte intrínseca del deploy siempre de estos proyectos».

## La regla
Cada URL que apunta al player / editor de moldeojs (iframe de un hero, link de una obra, `/e/<slug>` resuelto, previews del Studio,
embeds en Folio) se arma así:

```
/odoo_moldeo_lab/static/moldeojs/index.html?mol=<ruta .mol>&role=player&seed=<número>&v=<versión>
```

- **`seed`** = número que CAMBIA en cada deploy/publicación del proyecto (aleatorio grande o timestamp del deploy). Rompe el caché del
  navegador y de proxies para esa URL.
- **`v`** = versión legible de lo que se publica: versión del módulo que sirve el player (p. ej. `26.363`) y/o hash corto del
  proyecto/.mol (p. ej. commit de moldeojs `7921591`). Sirve para saber QUÉ versión está viendo alguien.
- Se aplica **siempre**, en cada deploy: es parte del deploy, no un arreglo opcional. Un deploy de un proyecto .mol sin seed/v nuevos
  **no está terminado**.

## Por qué
El player y sus archivos (`index.html`, el `.mol`, los `.cfg`, las texturas PNG) se sirven con caché larga (p. ej. `max-age=86400`).
Con la misma URL, el navegador muestra la versión vieja durante horas aunque el servidor ya tenga la nueva — pasó el 18-nov con la
imagen del hero de la landing Forest (server sirviendo la nueva, FCA viendo la vieja).

## Alcance y pendiente técnico
- ✅ **Hecho (18-nov, RC2):** el player propaga `seed`/`v` de su URL a TODAS las descargas del proyecto desde UN solo helper,
  `src/app/mo-cache-bust.ts` (`moCacheBust(url)`): `moFileManager.Load` (.mol/.cfg), `moTexture.BuildFromFile` (imágenes),
  video del effect image, json de particlesfractal, `tomas.take.json`, y `loadNewMol`/`loadCFG` del editor. **Una descarga nueva del
  proyecto tiene que pasar por `moCacheBust`.** Sin `seed`/`v` en la URL, la URL queda igual que antes.
- ✅ **Hecho (18-nov, RC3):** el Lab arma seed/v solo — `/e/<slug>` y el hero `hero_mode = mol` de Folio: `seed` = huella de los archivos
  del proyecto (cambia al subir zip / Guardar), `v` = versión instalada de odoo_moldeo_lab. Un seed/v puesto a mano en la URL guardada
  se REEMPLAZA por el automático (uno a mano envejece y congela el caché).
- Lo mismo vale para imágenes servidas con caché larga que se reemplazan en el mismo id (p. ej. `/ocapi/pub/<id>/hero` ⇒ `?v=<checksum>`).

## Dónde se aplica
moldeojs (player/editor) · odoo_moldeo_lab (`/e/<slug>`, static/moldeojs) · odoo_moldeo_studio (previews/piezas con .mol) ·
Folio (hero `hero_mode = mol`, embeds) · Moldeo 2.0 (todos los proyectos L0x y los que publiquen los autores).
