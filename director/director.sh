#!/bin/bash
# Moldeo Director — abre una carpeta de proyecto (.mol) con el editor moldeojs.
#   ./director.sh /ruta/al/proyecto      (sin ruta: diálogo para elegir carpeta)
# Si la carpeta es un repo git, cada Guardar hace un commit.
# app/ = build de moldeojs:  (desde moldeojs/master)
#   ng build --prod --base-href ./ --output-hashing none --output-path director/app
cd "$(dirname "$(readlink -f "$0")")"
[ -d node_modules/electron ] || npm install --no-audit --no-fund
# en Wayland el compositor rechaza los buffers de WebGL de Electron 33 ⇒ X11 (XWayland)
exec ./node_modules/electron/dist/electron . --ozone-platform=x11 "$@"
