/**
 * Moldeo Director (#918 Fase 7 / D1)
 *
 * El MISMO build de moldeojs que corre en el MoldeoLab, abierto sobre una carpeta de proyecto en disco.
 * Electron registra el protocolo moldeo:// que imita el contrato del Lab:
 *   moldeo://app/<archivo>          → el build de moldeojs (MOLDEO_APP_DIR o ./app)
 *   moldeo://app/proj/<ruta>        → archivos de la carpeta del proyecto        (Lab: /e/<slug>/mol/<ruta>)
 *   POST moldeo://app/proj-save     → escribe .mol/.cfg en la carpeta (+ commit) (Lab: /e/<slug>/mol-save)
 * Si la carpeta es un repo git, cada Guardar es un commit: el historial del proyecto son sus versiones.
 *
 * Uso: npm start -- /ruta/a/la/carpeta   (sin ruta: se abre un diálogo)
 */
const { app, BrowserWindow, protocol, dialog, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

protocol.registerSchemesAsPrivileged([
  { scheme: 'moldeo', privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true } },
]);

const APP_DIR = path.resolve(process.env.MOLDEO_APP_DIR || path.join(__dirname, 'app'));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.mol': 'text/xml', '.cfg': 'text/xml', '.json': 'application/json', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg', '.mp4': 'video/mp4', '.ico': 'image/x-icon' };

let projDir = null;

/** ruta dentro de `base`, o null si se escapa */
function inside(base, rel) {
  const p = path.resolve(base, '.' + path.sep + rel);
  return (p === base || p.startsWith(base + path.sep)) ? p : null;
}

function serveFile(file) {
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) return new Response('no existe', { status: 404 });
  return new Response(fs.readFileSync(file), { headers: { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-cache' } });
}

function log(...a) { console.log('[director]', ...a); }

function gitCommit(n) {
  if (!fs.existsSync(path.join(projDir, '.git'))) return null;
  try {
    execFileSync('git', ['add', '-A', '--', '*.mol', '*.cfg'], { cwd: projDir });
    execFileSync('git', ['commit', '-q', '-m', `moldeo: guardar (${n} archivos) ${new Date().toISOString()}`], { cwd: projDir });
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: projDir }).toString().trim();
  } catch (e) {
    return (('' + (e.stdout || '')) + (e.stderr || '')).includes('nothing to commit') ? 'sin-cambios' : 'error: ' + e.message.split('\n')[0];
  }
}

async function handle(req) {
  const u = new URL(req.url);
  const p = decodeURIComponent(u.pathname);
  if (p === '/proj-save' && req.method === 'POST') {
    let res;
    try {
      const body = JSON.parse(await req.text());
      const files = (body.params || {}).files || {};
      const names = Object.keys(files);
      if (!names.length || names.length > 200) throw new Error('nada para guardar');
      for (const name of names) {
        if (!/\.(mol|cfg)$/i.test(name) || typeof files[name] !== 'string') throw new Error('archivo no permitido: ' + name);
        const dest = inside(projDir, name);
        if (!dest) throw new Error('ruta no permitida: ' + name);
        fs.writeFileSync(dest, Buffer.from(files[name], 'latin1'));   // el .mol/.cfg del 1.0 es ISO-8859-1
      }
      const commit = gitCommit(names.length);
      log('guardado', names.length, 'archivos', commit ? 'commit ' + commit : '(sin git)');
      res = { ok: true, n: names.length, commit };
    } catch (e) {
      log('guardar falló:', e.message);
      res = { ok: false, error: e.message };
    }
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: null, result: res }), { headers: { 'content-type': 'application/json' } });
  }
  if (p.startsWith('/proj/')) return serveFile(inside(projDir, p.slice('/proj/'.length)));
  return serveFile(inside(APP_DIR, p === '/' ? 'index.html' : p.slice(1)));
}

function findMain(dir) {
  const mols = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.mol')).sort();
  return mols[0] || null;
}

app.whenReady().then(async () => {
  protocol.handle('moldeo', handle);
  const arg = process.argv.slice(1).find((a) => !a.startsWith('-') && a !== '.' && fs.existsSync(a) && fs.statSync(a).isDirectory());
  projDir = arg ? path.resolve(arg) : null;
  if (!projDir) {
    const r = await dialog.showOpenDialog({ title: 'Abrir proyecto Moldeo (carpeta con un .mol)', properties: ['openDirectory'] });
    if (r.canceled || !r.filePaths.length) { app.quit(); return; }
    projDir = r.filePaths[0];
  }
  const main = findMain(projDir);
  if (!main) { dialog.showErrorBox('Moldeo Director', 'La carpeta no tiene ningún .mol:\n' + projDir); app.quit(); return; }
  if (!fs.existsSync(path.join(APP_DIR, 'index.html'))) { dialog.showErrorBox('Moldeo Director', 'No encuentro el build de moldeojs en ' + APP_DIR); app.quit(); return; }
  log('proyecto', projDir, '·', main, '· app', APP_DIR);

  const win = new BrowserWindow({
    width: 1280, height: 800, title: 'Moldeo Director — ' + path.basename(projDir),
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  const base = `moldeo://app/index.html?mol=${encodeURIComponent('/proj/' + main)}`;
  win.loadURL(`${base}&save=${encodeURIComponent('/proj-save')}`);

  /* D2 — PLAYER: 2ª ventana a pantalla completa en el último monitor (proyector), sin interfaz.
     Recibe todo lo que se hace en el Control por BroadcastChannel (mismo origen moldeo://app). */
  const displays = screen.getAllDisplays();
  const prim = screen.getPrimaryDisplay();
  const out = displays.filter((d) => d.id !== prim.id).pop();
  let player = null;
  if (out || process.env.MOLDEO_PLAYER) {
    const b = (out || prim).bounds;
    player = new BrowserWindow({
      x: b.x, y: b.y, width: b.width, height: b.height, fullscreen: !!out, frame: !out, title: 'Moldeo Player',
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true },
    });
    player.loadURL(`${base}&role=player`);
    log('player en', out ? `monitor ${out.id} (${b.width}x${b.height} @ ${b.x},${b.y})` : 'ventana (un solo monitor)');
    player.on('closed', () => { player = null; });
  } else {
    log('un solo monitor: sin ventana Player (MOLDEO_PLAYER=1 la fuerza en ventana)');
  }

  /* MOLDEO_SELFTEST=1: abre, llama un preset de la imagen, Guarda y sale (verificación sin manos) */
  if (process.env.MOLDEO_SELFTEST) {
    win.webContents.on('console-message', (_e, level, msg) => { if (level >= 2) log('consola', msg); });
    setTimeout(async () => {
      const r = await win.webContents.executeJavaScript(`(async () => {
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        const ui = window.ng ? null : null;
        const W = window.moPresetWheel; if (!W) return 'sin rueda';
        const fx = W.layers.find((f) => ('' + f.GetName()) === 'image') || W.layer();
        W.setLayer(fx); W.call(2); await wait(300); W.capture(3); await wait(400);
        const btn = document.querySelector('button[name=save]'); if (!btn) return 'sin boton Guardar';
        btn.click(); await wait(1500);
        return 'ok preset=' + fx.GetConfig().GetCurrentPreConf() + ' boton=' + btn.textContent.trim();
      })()`);
      log('selftest', r);
      if (player) {
        const p = await player.webContents.executeJavaScript(`(() => { const PS = window.moProjectStates;
          const f = PS && PS.layerByLabel('image'); return 'player rol=' + (document.body.classList.contains('mo-player') ? 'player' : '?') +
          (f ? ' image.preset=' + f.GetConfig().GetCurrentPreConf() : ''); })()`);
        log('selftest', p);
      }
      setTimeout(() => app.quit(), 500);
    }, 6000);
  }
});

app.on('window-all-closed', () => app.quit());
