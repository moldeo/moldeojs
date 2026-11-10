#!/usr/bin/env python3
"""#918 B5·M4 — el reel LDP v9 como proyecto .mol: HOOK (un dibujo línea → color → real) + BOMBARDEO (21 dibujos que caen
sobre el fondo vitral con golpe, cada vez más rápido) + PILA (sostén). Todo el ritmo son params PUBLICADOS de la capa `reel`.

    python3 tools/reel_ldp_v9_gen.py <kit/<id del hook>> <dir fuentes (<id>.img)> <p-v9.json> <carpeta destino>

Arma primero el hook con reel_ldp_gen.py (M1) y le suma:
  fondo        (image)  vitral + logo pre-compuestos (el vitral SÓLO como fondo, nunca sobre los dibujos)
  d00 … d20    (image)  cada dibujo en su papel, con sombra y rotación HORNEADAS (misma semilla que el video del guion)
Ritmos nuevos en `reel`: t_bomb (cuándo arranca) · t_b (cada uno de los primeros) · t_ex_ini / t_ex_fin (los extra aceleran,
duraciones geométricas) · golpe / t_golpe (la caída sobre la pila) · t_pila (sostén final). Cambiar uno re-ritma la pila en vivo.
La composición es 9:16 y se mide en ALTOS de pantalla (`prop()`), así no se deforma en otra ventana.
⛔ Los dibujos son de participantes de Lectura de Paisajes: ni las fuentes ni el proyecto generado se versionan — este script sí.
"""
import json, os, random, re, subprocess, sys
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from reel_ldp_gen import setvals, rd, F, CL  # noqa: E402

W, H = 1080, 1920             # lienzo del guion (9:16)
ESC = 0.6                     # las texturas se guardan al 60 % (peso web); la posición se calcula a tamaño real
DEF = dict(orden_b=[24, 16, 27, 15, 22, 20, 18], extra=[], t_b=0.6, t_extra=(0.42, 0.12), b_in=5.5, b_out=16.3,
           ancho=0.86, dy=560, mosaico=[], vitral_alpha=0.55, logo_png='', logo_y=130, logo_w=820, rot=6, borde=14, seed=7,
           fondo_png='', vitral_png='')
# hook: el dibujo ENTERO en 2 s (línea 0,9 · contorno 0,5 · real 0,6), ancho de pantalla, sin paneo
HOOK = dict(vel_linea=1 / 0.9, vel_contorno=1 / 0.5, vel_cierre=1 / 0.6, t_entrada=0.0, t_sosten=0.0,
            paneo_desde=0.5, paneo_hasta=0.5, escala_alto=0.42)
GOLPE, T_GOLPE = 0.14, 4 / 30


def papel(P, FU, i):
    """Réplica de dibujo()+pegar() del prototipo: devuelve (RGBA con sombra, x, y) en px del lienzo 1080×1920."""
    im = Image.open('%s/%d.%s' % (FU, i, 'mos' if i in P['mosaico'] else 'img')).convert('RGB')
    w = int(W * P['ancho']); im = im.resize((w, int(im.height * w / im.width)), Image.LANCZOS)
    if im.height > H * 0.62:
        h = int(H * 0.62); im = im.resize((int(im.width * h / im.height), h), Image.LANCZOS)
    b = P['borde']; pap = Image.new('RGB', (im.width + 2 * b, im.height + 2 * b), (252, 251, 247)); pap.paste(im, (b, b))
    pap = pap.convert('RGBA').rotate(random.uniform(-P['rot'], P['rot']), expand=True, resample=Image.BICUBIC)
    sh = Image.new('RGBA', pap.size, (0, 0, 0, 0)); sh.putalpha(pap.getchannel('A').point(lambda v: int(v * 0.45)))
    sh = sh.filter(ImageFilter.GaussianBlur(14))
    x = (W - pap.width) // 2 + random.randint(-60, 60); y = (H - pap.height) // 2 + random.randint(-P['dy'], P['dy'])
    if P['logo_png']: y = max(y, P['logo_y'] + 190)
    y = min(y, H - pap.height - 40)
    # sombra (+10,+16) y papel en UNA textura; margen para el blur
    m = 40
    c = Image.new('RGBA', (pap.width + 2 * m + 10, pap.height + 2 * m + 16), (0, 0, 0, 0))
    c.alpha_composite(sh, (m + 10, m + 16)); c.alpha_composite(pap, (m, m))
    return c, x - m, y - m


def fondo(P):
    f = Image.open(P['fondo_png']).convert('RGBA').resize((W, H))
    v = Image.open(P['vitral_png']).convert('RGBA').resize((1500, 1500))
    v.putalpha(v.getchannel('A').point(lambda a: int(a * P['vitral_alpha'])))
    f.alpha_composite(v, ((W - 1500) // 2, (H - 1500) // 2))
    if P['logo_png']:
        lg = Image.open(P['logo_png']).convert('RGBA'); lg = lg.resize((P['logo_w'], int(lg.height * P['logo_w'] / lg.width)), Image.LANCZOS)
        f.alpha_composite(lg, ((W - lg.width) // 2, P['logo_y']))
    return f.convert('RGB')


def capa(tex, x, y, w, h, alpha, z='1'):
    """image en px del lienzo 9:16 → unidades del Lab (ancho de pantalla = 1, alto = 1/prop()), escala z en el centro."""
    t = rd('image.cfg')
    t = setvals(t, 'texture', [[('TXT', '', tex)]])
    t = setvals(t, 'alpha', [F(alpha)])
    t = setvals(t, 'color', [[('FUNCTION', 'RED', '1'), ('FUNCTION', 'GREEN', '1'), ('FUNCTION', 'BLUE', '1'), ('FUNCTION', 'ALPHA', '1')]])
    t = setvals(t, 'alt_cuad_y', [F('%.5f*(%s)' % (h / H, z))])
    t = setvals(t, 'anc_cuad_x', [F('%.5f*(%s)/prop()' % (w / H, z))])
    t = setvals(t, 'pos_cuad_x', [F('%.5f/prop()' % ((x + w / 2 - W / 2) / H))])
    t = setvals(t, 'pos_cuad_y', [F('%.5f/prop()' % (-(y + h / 2 - H / 2) / H))])
    return re.sub(r'\s*<PRECONFIGS>.*?</PRECONFIGS>|\s*<PRECONFIGS\s*/>', '', t, flags=re.S)


def wr(dst, n, s): open(os.path.join(dst, n), 'w', encoding='latin-1').write(s)
def rr(dst, n): return open(os.path.join(dst, n), encoding='latin-1').read()


def main():
    kit, FU, guion, dst = sys.argv[1:5]
    P = dict(DEF); P.update(json.load(open(guion)))
    hook_id = json.load(open(os.path.join(kit, 'params.json')))['jardin_drawing_id']
    ids = [i for i in P['orden_b'] if i != hook_id] + P['extra']     # el del hook no se repite en la pila
    nb, ne = len([i for i in P['orden_b'] if i != hook_id]), len(P['extra'])
    assert ne >= 2, 'hacen falta ≥2 extra para la aceleración geométrica'

    # 1) hook = M1 con ritmos de 2 s
    subprocess.run([sys.executable, os.path.join(HERE, 'reel_ldp_gen.py'), kit, dst], check=True)
    mol_n = 'ReelLDP%s.mol' % hook_id
    reel = rr(dst, 'reel.cfg')
    for k, v in HOOK.items():
        reel = setvals(reel, k, [F('%.4f' % v)])
    t_ex0, t_ex1 = P['t_extra']
    from_b = nb * P['t_b'] + sum(t_ex0 * (t_ex1 / t_ex0) ** (j / (ne - 1)) for j in range(ne))
    t_bomb = 2.0 + 0.4
    nuevos = dict(t_bomb=t_bomb, t_b=P['t_b'], t_ex_ini=t_ex0, t_ex_fin=t_ex1, golpe=GOLPE, t_golpe=T_GOLPE,
                  t_pila=max(1.0, (P['b_out'] - P['b_in']) - from_b))
    for k, v in nuevos.items():
        reel = setvals(reel, k, [F('%.4f' % v)], 'FUNCTION')
    r = 'pow(reel.t_ex_fin/reel.t_ex_ini,1/%d)' % (ne - 1)
    deriv = {
        'r_ex': r,
        't_extra0': 'reel.t_bomb+%d*reel.t_b' % nb,
        'dur': 'reel.t_extra0+reel.t_ex_ini*(1-pow(reel.r_ex,%d))/(1-reel.r_ex)+reel.t_pila' % ne,
        'hook_on': CL('(reel.t_bomb-reel.t)*1000'),
    }
    for k, v in deriv.items():
        reel = setvals(reel, k, [F(v)], 'FUNCTION')
    wr(dst, 'reel.cfg', reel)
    # las capas del hook se apagan cuando arranca el bombardeo
    for n in ('linea.cfg', 'contorno.cfg', 'real.cfg'):
        c = rr(dst, n)
        m = re.search(r'<PARAM name="alpha"[^>]*>\s*<VAL>\s*<D type="FUNCTION">(.*?)</D>', c, re.S)
        c = setvals(c, 'alpha', [F('(%s)*reel.hook_on' % m.group(1))]); wr(dst, n, c)

    # 2) fondo + 21 papeles
    fondo(P).save(os.path.join(dst, 'fondo.jpg'), quality=88)
    capas = [('fondo', 'F', capa('fondo.jpg', 0, 0, W, H, CL('(reel.t-reel.t_bomb)*1000')))]
    random.seed(P['seed'])
    for k, i in enumerate(ids):
        im, x, y = papel(P, FU, i)
        tn = 'd%02d.png' % k
        im.resize((int(im.width * ESC), int(im.height * ESC)), Image.LANCZOS).save(os.path.join(dst, tn), optimize=True)
        tk = ('(reel.t_bomb+%d*reel.t_b)' % k) if k < nb else \
             ('(reel.t_extra0+reel.t_ex_ini*(1-pow(reel.r_ex,%d))/(1-reel.r_ex))' % (k - nb))
        u = CL('(reel.t-%s)/reel.t_golpe' % tk)
        capas.append(('d%02d' % k, '', capa(tn, x, y, im.width, im.height, CL('(reel.t-%s)*1000' % tk),
                                            '1+reel.golpe*pow(1-%s,2)' % u)))
    for n, _, c in capas:
        wr(dst, n + '.cfg', c)

    # 3) .mol: las capas nuevas van después de las del hook (el fondo las tapa cuando arranca el bombardeo)
    mol = rr(dst, mol_n)
    def mob(name, key):
        return ('\n            <VAL>\n                <D type="TXT">image</D>\n                <D type="TXT">%s</D>\n                <D type="TXT">%s</D>\n'
                '                <D type="NUM">0</D>\n                <D type="NUM">1</D>\n                <D type="TXT">%s</D>\n            </VAL>') % (name, name, key)
    ult = mol.index('<D type="TXT">real</D>'); fin = mol.index('</VAL>', ult) + len('</VAL>')
    mol = mol[:fin] + ''.join(mob(n, k) for n, k, _ in capas) + mol[fin:]
    os.remove(os.path.join(dst, mol_n))
    wr(dst, 'ReelLDPv9.mol', mol)
    peso = sum(os.path.getsize(os.path.join(dst, f)) for f in os.listdir(dst))
    print('ok ReelLDPv9 · hook %d · pila %d dibujos (%d B + %d extra) · %.1f MB · dur ≈ %.1f s'
          % (hook_id, len(ids), nb, ne, peso / 1e6, nuevos['t_bomb'] + from_b + nuevos['t_pila']))


if __name__ == '__main__':
    main()
