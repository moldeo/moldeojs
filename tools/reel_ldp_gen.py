#!/usr/bin/env python3
"""#918 B5 — genera el proyecto .mol «Reel LDP» de UN dibujo: línea → contorno → real, con las velocidades PUBLICADAS.

    python3 tools/reel_ldp_gen.py <kit/<id>> <carpeta destino>

El kit (linea.png, orden.png 16 bit, contorno.png, real.png, params.json) lo arma la sesión de flyers desde jardin.drawing.
⛔ Los dibujos son de participantes de Lectura de Paisajes: el kit y el proyecto generado NO se versionan — este script sí.

Capas (de abajo hacia arriba, igual que el prototipo aprobado por FCA el 10-nov):
  papel     (erase)  color del papel del kit
  reel      (image, alpha 0) — CAPA DE CONTROL: los ritmos publicados que el autor mueve a mano en el editor
               vel_linea · vel_contorno · vel_cierre · t_entrada · t_sosten · paneo_desde · paneo_hasta · escala_alto
               y los derivados que leen las demás capas: dur · t (tiempo en loop) · p_linea · p_contorno · p_cierre · paneo
  linea     (image)  la tinta, revelada trazo a trazo: revela_mapa = orden invertido, revela = p_linea
  contorno  (image)  el redibujo a color; entra y tapa la línea (alpha = ease(p_contorno))
  real      (image)  el dibujo de quien lo hizo; fundido NORMAL (alpha = ease(p_cierre))
Un solo paneo horizontal (`reel.paneo`) mueve las tres capas; el dibujo conserva su aspecto en cualquier ventana (`prop()`).
"""
import json, os, re, sys
from PIL import Image, ImageFilter
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'src', 'assets', 'molrepos', 'basic', '00_Image')
ALTO = 1536   # px de alto de las texturas (el kit viene a 2048: 26 MB por dibujo es mucho para la web)


def rd(n): return open(os.path.join(SRC, n), encoding='latin-1').read()


def setvals(xml, pname, vals, ptype=None):
    """Reemplaza (o agrega) un <PARAM> con sus VAL. vals = [[(tipo, code, texto), ...], ...]"""
    def vxml(v):
        ds = ''.join('\n                <D type="%s"%s>%s</D>' % (t, (' code="%s"' % c) if c else '', x) for t, c, x in v)
        return '\n            <VAL>%s\n            </VAL>' % ds
    body = ''.join(vxml(v) for v in vals) + '\n        </PARAM>'
    pat = re.compile(r'(<PARAM name="%s"[^>]*?)(/>|>.*?</PARAM>)' % re.escape(pname), re.S)
    m = pat.search(xml)
    if m:
        return xml[:m.start()] + m.group(1).rstrip() + '>' + body + xml[m.end():]
    assert ptype, 'param nuevo sin tipo: ' + pname
    nuevo = '        <PARAM name="%s" type="%s" property="published">' % (pname, ptype) + body + '\n'
    return xml.replace('    </CONFIGPARAMS>', nuevo + '    </CONFIGPARAMS>', 1)


F = lambda x: [('FUNCTION', '', x)]
EASE = lambda u: '(%s)*(%s)*(3-2*(%s))' % (u, u, u)          # smoothstep, como ease() del prototipo
CL = lambda x: 'min(max(%s,0),1)' % x


def imagen(nombre, tex, alpha, extra=None):
    t = rd('image.cfg')
    t = setvals(t, 'texture', [[('TXT', '', tex)]])
    t = setvals(t, 'alpha', [F(alpha)])
    t = setvals(t, 'color', [[('FUNCTION', 'RED', '1'), ('FUNCTION', 'GREEN', '1'), ('FUNCTION', 'BLUE', '1'), ('FUNCTION', 'ALPHA', '1')]])
    # tamaño: alto = escala_alto × pantalla; ancho con el aspecto de la imagen (1,5) en cualquier ventana
    t = setvals(t, 'alt_cuad_y', [F('reel.escala_alto')])
    t = setvals(t, 'anc_cuad_x', [F('1.5*reel.escala_alto/prop()')])
    t = setvals(t, 'pos_cuad_x', [F('(0.5-reel.paneo)*1.5*reel.escala_alto/prop()')])
    t = setvals(t, 'pos_cuad_y', [F('0')])
    for k, (tipo, v) in (extra or {}).items():
        t = setvals(t, k, [[(('TXT' if tipo == 'TEXTURE' else 'FUNCTION'), '', v)]], tipo)
    # sin presets: cada param tiene un solo VAL y el ritmo lo dan las funciones del tiempo
    return re.sub(r'\s*<PRECONFIGS>.*?</PRECONFIGS>|\s*<PRECONFIGS\s*/>', '', t, flags=re.S)


def main():
    kit, dst = sys.argv[1], sys.argv[2]
    P = json.load(open(os.path.join(kit, 'params.json')))
    os.makedirs(dst, exist_ok=True)
    W = int(round(ALTO * P['tamano'][0] / P['tamano'][1]))
    papel = tuple(P.get('papel', (250, 248, 242)))

    # texturas: línea (RGBA), mapa de revelado (orden invertido, 8 bit), contorno y real aplanados sobre el papel
    Image.open(os.path.join(kit, 'linea.png')).convert('RGBA').resize((W, ALTO), Image.LANCZOS).save(os.path.join(dst, 'linea.png'))
    o = np.array(Image.open(os.path.join(kit, 'orden.png'))).astype(np.float32) / 65535.0
    rev = np.clip(255 * (1.0 - o), 0, 255).astype(np.uint8)
    rev = Image.fromarray(rev, 'L').resize((W, ALTO), Image.NEAREST)          # NEAREST: no mezclar órdenes
    # el BORDE suavizado de la tinta cae en píxeles de fondo (orden 0 ⇒ blanco ⇒ «aparece primero»): sin esto, cada trazo
    # no revelado deja su contorno a la vista desde el comienzo. El fondo toma el orden del trazo vecino (mínimo local).
    fondo = np.array(rev) == 255
    vec = np.array(rev.filter(ImageFilter.MinFilter(9)))
    rev = np.where(fondo, vec, np.array(rev)).astype(np.uint8)
    Image.fromarray(rev, 'L').save(os.path.join(dst, 'revela.png'))
    for n, out in (('contorno.png', 'contorno.jpg'), ('real.png', 'real.jpg')):
        im = Image.open(os.path.join(kit, n)).convert('RGBA')
        fondo = Image.new('RGBA', im.size, papel + (255,)); fondo.alpha_composite(im)
        fondo.convert('RGB').resize((W, ALTO), Image.LANCZOS).save(os.path.join(dst, out), quality=90)

    # capa de control: los ritmos (publicados) y los derivados
    reel = imagen('reel', 'default', '0')
    vel = {'vel_linea': 1 / P['t_linea'], 'vel_contorno': 1 / P['t_contorno'], 'vel_cierre': 1 / P['t_cierre']}
    base = dict(vel, t_entrada=P['entrada'], t_sosten=P['t_sosten'], paneo_desde=P['paneo_x'][0], paneo_hasta=P['paneo_x'][1],
                escala_alto=P.get('escala_alto', 1.45))
    for k, v in base.items():
        reel = setvals(reel, k, [F('%.4f' % v)], 'FUNCTION')
    d1, d2, d3 = '(1/reel.vel_linea)', '(1/reel.vel_contorno)', '(1/reel.vel_cierre)'
    deriv = {
        'dur': 'reel.t_entrada+%s+%s+%s+reel.t_sosten' % (d1, d2, d3),
        't': 'seconds %% reel.dur',          # ⚠️ `time` es un ÁNGULO (2π cada 10 s), no segundos
        'p_linea': CL('(reel.t-reel.t_entrada)*reel.vel_linea'),
        'p_contorno': CL('(reel.t-reel.t_entrada-%s)*reel.vel_contorno' % d1),
        'p_cierre': CL('(reel.t-reel.t_entrada-%s-%s)*reel.vel_cierre' % (d1, d2)),
        'paneo': 'reel.paneo_desde+(reel.paneo_hasta-reel.paneo_desde)*%s' % CL('reel.t/reel.dur'),
    }
    for k, v in deriv.items():
        reel = setvals(reel, k, [F(v.replace('%%', '%'))], 'FUNCTION')
    # las texturas de reel/derivados no se usan: reel no se ve (alpha 0) — su valor es ser el panel de ritmos
    open(os.path.join(dst, 'reel.cfg'), 'w', encoding='latin-1').write(reel)
    # la línea crece un 8 % más allá de 1 para que el último trazo termine de aparecer (como el prototipo, u·1,08)
    open(os.path.join(dst, 'linea.cfg'), 'w', encoding='latin-1').write(
        imagen('linea', 'linea.png', '1', {'revela_mapa': ('TEXTURE', 'revela.png'), 'revela': ('FUNCTION', 'reel.p_linea*1.08')}))
    open(os.path.join(dst, 'contorno.cfg'), 'w', encoding='latin-1').write(imagen('contorno', 'contorno.jpg', EASE('reel.p_contorno')))
    open(os.path.join(dst, 'real.cfg'), 'w', encoding='latin-1').write(imagen('real', 'real.jpg', EASE('reel.p_cierre')))

    er = rd('erase.cfg')
    r, g, b = (c / 255.0 for c in papel)
    er = setvals(er, 'color', [[('FUNCTION', 'RED', '%.3f' % r), ('FUNCTION', 'GREEN', '%.3f' % g), ('FUNCTION', 'BLUE', '%.3f' % b), ('FUNCTION', 'ALPHA', '1')]])
    open(os.path.join(dst, 'papel.cfg'), 'w', encoding='latin-1').write(er)

    mol = rd('00_Image.mol')
    mol = re.sub(r'<PARAM name="devices" type="MOLDEOOBJECT" >.*?</PARAM>', '<PARAM name="devices" type="MOLDEOOBJECT" />', mol, flags=re.S)
    mol = mol.replace('<D type="TXT">erase</D>\n                <D type="TXT">erase</D>\n                <D type="TXT">erase</D>',
                      '<D type="TXT">erase</D>\n                <D type="TXT">papel</D>\n                <D type="TXT">papel</D>')
    def mob(name, key):
        return ('<VAL>\n                <D type="TXT">image</D>\n                <D type="TXT">%s</D>\n                <D type="TXT">%s</D>\n'
                '                <D type="NUM">0</D>\n                <D type="NUM">1</D>\n                <D type="TXT">%s</D>\n            </VAL>') % (name, name, key)
    efectos = '\n            '.join(mob(n, k) for n, k in (('reel', 'R'), ('linea', 'L'), ('contorno', 'C'), ('real', 'D')))
    mol = re.sub(r'(<PARAM name="effect" type="MOLDEOOBJECT">\s*)<VAL>.*?</VAL>', lambda m: m.group(1) + efectos, mol, count=1, flags=re.S)
    assert '<D type="TXT">papel</D>' in mol and '<D type="TXT">real</D>' in mol
    nombre = 'ReelLDP%s' % P.get('jardin_drawing_id', '')
    open(os.path.join(dst, nombre + '.mol'), 'w', encoding='latin-1').write(mol)
    print('ok', nombre, sorted(os.listdir(dst)), 'textura %dx%d' % (W, ALTO))


if __name__ == '__main__':
    main()
