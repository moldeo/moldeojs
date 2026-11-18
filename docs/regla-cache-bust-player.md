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
- El `seed`/`v` en la URL del iframe invalida `index.html`. ⚠️ Para que TAMBIÉN se renueven el `.mol`, los `.cfg` y las texturas, el
  player tiene que propagar `seed`/`v` a sus propias descargas (agregarlos como query a cada fetch del proyecto). Hasta que eso esté,
  además del seed en la URL, cambiar el nombre/ruta del proyecto o forzar recarga. Tarea abierta en moldeojs (ver plan Moldeo 2.0).
- Lo mismo vale para imágenes servidas con caché larga que se reemplazan en el mismo id (p. ej. `/ocapi/pub/<id>/hero` ⇒ `?v=<checksum>`).

## Dónde se aplica
moldeojs (player/editor) · odoo_moldeo_lab (`/e/<slug>`, static/moldeojs) · odoo_moldeo_studio (previews/piezas con .mol) ·
Folio (hero `hero_mode = mol`, embeds) · Moldeo 2.0 (todos los proyectos L0x y los que publiquen los autores).
