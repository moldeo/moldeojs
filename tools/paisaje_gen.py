#!/usr/bin/env python3
"""#918 — genera el proyecto «Paisaje Interactivo» (curso de Moldeo 2) en src/assets/molrepos/inphini/Paisaje/.

Cada lección agrega una capa al MISMO paisaje. Este script arma las capas hechas hasta ahora:
  P1 cielo   (erase)  presets: amanecer · dia · atardecer · noche
  P2 montana (image)  presets: lejos · cerca · niebla · silueta
  P3 sol     (image)  presets: quieto · arco · pulso · eclipse        (detrás de la montaña: se pone)
  P4 luna    (image)  presets: llena · creciente · menguante · nueva  (4 texturas: la fase cambia la imagen)
Las imágenes se dibujan acá (propias, sin licencias de terceros). Base de los .cfg: los de basic/00_Image.
Uso:  python3 tools/paisaje_gen.py
"""
import math, os, random, re
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
REPOS = os.path.join(HERE, '..', 'src', 'assets', 'molrepos')
SRC = os.path.join(REPOS, 'basic', '00_Image')
DST = os.path.join(REPOS, 'inphini', 'Paisaje')
W, H = 1600, 1000   # aspecto 1.6, como la pantalla


def ridge(rng, y0, amp, rough, n=64):
    """línea de cumbres: suma de ondas + ruido, de izquierda a derecha"""
    ph = [rng.uniform(0, 6.28) for _ in range(4)]
    pts = []
    for i in range(n + 1):
        x = W * i / n
        t = i / n
        y = y0 - amp * (0.55 * math.sin(t * 3.1 + ph[0]) + 0.3 * math.sin(t * 7.3 + ph[1])
                        + 0.15 * math.sin(t * 15.7 + ph[2])) - rough * rng.uniform(-1, 1)
        pts.append((x, y))
    return pts


def montana():
    rng = random.Random(918)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layers = [  # (base y, amplitud, rugosidad, color de relleno, color de línea)
        (560, 170, 10, (96, 120, 150, 255), (40, 50, 70, 255)),   # cordón lejano
        (700, 130, 8, (62, 92, 82, 255), (25, 40, 35, 255)),      # cerro medio
        (850, 70, 5, (40, 70, 50, 255), (15, 30, 20, 255)),       # loma cercana
    ]
    for y0, amp, rough, fill, line in layers:
        pts = ridge(rng, y0, amp, rough)
        d = ImageDraw.Draw(im)
        d.polygon(pts + [(W, H), (0, H)], fill=fill)
        d.line(pts, fill=line, width=5, joint='curve')            # trazo de lapicera, como el cuaderno
        # nieve/brillo en las cumbres del cordón lejano
        if y0 == 560:
            for (x, y) in pts[::6]:
                if y < y0 - amp * 0.6:
                    d.polygon([(x - 28, y + 34), (x, y), (x + 28, y + 34)], fill=(235, 240, 248, 255))
    return im


def sol(n=512):
    im = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    c = n / 2
    halo = Image.new('L', (n, n), 0)
    dh = ImageDraw.Draw(halo)
    for r in range(int(c), 0, -2):                       # halo que se apaga hacia afuera
        dh.ellipse((c - r, c - r, c + r, c + r), fill=int(255 * (1 - r / c) ** 1.6))
    im.paste((255, 214, 120, 255), (0, 0), halo)
    d = ImageDraw.Draw(im)
    R = n * 0.2
    d.ellipse((c - R, c - R, c + R, c + R), fill=(255, 226, 140, 255), outline=(120, 70, 20, 255), width=5)
    for k in range(12):                                   # rayos de lapicera, como en el cuaderno
        a = k * math.pi / 6
        d.line((c + math.cos(a) * R * 1.25, c + math.sin(a) * R * 1.25,
                c + math.cos(a) * R * 1.75, c + math.sin(a) * R * 1.75), fill=(120, 70, 20, 255), width=5)
    return im


def luna(fase, n=512):
    """fase: llena · creciente (iluminada a la derecha) · menguante (izquierda) · nueva"""
    c, R = n / 2, n * 0.42
    disc = Image.new('L', (n, n), 0)
    ImageDraw.Draw(disc).ellipse((c - R, c - R, c + R, c + R), fill=255)
    lit = disc.copy()
    if fase in ('creciente', 'menguante'):
        off = -R * 0.9 if fase == 'creciente' else R * 0.9
        sombra = Image.new('L', (n, n), 0)
        ImageDraw.Draw(sombra).ellipse((c - R + off, c - R, c + R + off, c + R), fill=255)
        lit = Image.composite(Image.new('L', (n, n), 0), lit, sombra)
    if fase == 'nueva':
        lit = Image.new('L', (n, n), 0)
    im = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    im.paste((60, 66, 90, 150), (0, 0), disc)             # la parte en sombra apenas se ve
    im.paste((236, 238, 228, 255), (0, 0), lit)
    d = ImageDraw.Draw(im)
    rng = random.Random(7)
    for _ in range(9):                                    # cráteres
        x, y, r = c + rng.uniform(-R * .6, R * .6), c + rng.uniform(-R * .6, R * .6), rng.uniform(R * .06, R * .16)
        if lit.getpixel((int(x), int(y))) > 0:
            d.ellipse((x - r, y - r, x + r, y + r), fill=(205, 208, 200, 255))
    d.ellipse((c - R, c - R, c + R, c + R), outline=(70, 70, 90, 255), width=5)
    return im


def setvals(xml, pname, vals):
    def vxml(v):
        ds = ''.join('\n                <D type="%s"%s>%s</D>' % (t, (' code="%s"' % c) if c else '', x) for t, c, x in v)
        return '\n            <VAL>%s\n            </VAL>' % ds
    pat = re.compile(r'(<PARAM name="%s"[^>]*?)(/>|>.*?</PARAM>)' % re.escape(pname), re.S)
    m = pat.search(xml)
    assert m, pname
    return xml[:m.start()] + m.group(1).rstrip() + '>' + ''.join(vxml(v) for v in vals) + '\n        </PARAM>' + xml[m.end():]


F = lambda x: [('FUNCTION', '', x)]
def col(r, g, b, a='1.0'): return [('FUNCTION', 'RED', r), ('FUNCTION', 'GREEN', g), ('FUNCTION', 'BLUE', b), ('FUNCTION', 'ALPHA', a)]
def pres(names, params): return '<PRECONFIGS>' + ''.join(
    '\n        <PRE name="%s">' % n + ''.join('\n            <P name="%s">%d</P>' % (p, i) for p in params) + '\n        </PRE>'
    for i, n in enumerate(names)) + '\n    </PRECONFIGS>'
def set_pre(xml, block):
    if re.search(r'<PRECONFIGS', xml):
        return re.sub(r'<PRECONFIGS>.*?</PRECONFIGS>|<PRECONFIGS\s*/>', block, xml, flags=re.S)
    return xml.replace('</MOCONFIG>', '    ' + block + '\n</MOCONFIG>')
def rd(n): return open(os.path.join(SRC, n), encoding='latin-1').read()
def wr(n, s): open(os.path.join(DST, n), 'w', encoding='latin-1').write(s)


def main():
    os.makedirs(DST, exist_ok=True)
    montana().save(os.path.join(DST, 'montana.png'), optimize=True)

    # P1 cielo
    cielo = rd('erase.cfg').replace('name="erase" class', 'name="cielo" class', 1)
    cielo = setvals(cielo, 'color', [col('0.95', '0.62', '0.45'), col('0.45', '0.70', '0.95'),
                                      col('0.85', '0.35', '0.30'), col('0.03', '0.04', '0.12')])
    wr('cielo.cfg', set_pre(cielo, pres(['amanecer', 'dia', 'atardecer', 'noche'], ['color'])))

    # P2 montaña
    m = rd('image.cfg')
    m = setvals(m, 'texture', [[('TXT', '', 'montana.png')]])
    m = setvals(m, 'alpha', [F('1.0'), F('1.0'), F('0.55+0.1*sin(time*0.3)'), F('1.0')])
    m = setvals(m, 'color', [col('0.78', '0.84', '0.95'), col('1.0', '1.0', '1.0'), col('0.92', '0.94', '0.97'), col('0.06', '0.05', '0.10')])
    m = setvals(m, 'pos_cuad_x', [F('0.0'), F('0.0'), F('0.0'), F('0.0')])
    m = setvals(m, 'pos_cuad_y', [F('-0.03'), F('-0.10'), F('-0.03'), F('-0.03')])
    m = setvals(m, 'anc_cuad_x', [F('1.0'), F('1.25'), F('1.0'), F('1.0')])
    m = setvals(m, 'alt_cuad_y', [F('1.0'), F('1.25'), F('1.0'), F('1.0')])
    P = ['alpha', 'color', 'pos_cuad_x', 'pos_cuad_y', 'anc_cuad_x', 'alt_cuad_y']
    wr('montana.cfg', set_pre(m, pres(['lejos', 'cerca', 'niebla', 'silueta'], P)))

    # P3 sol — un cuadrado en pantalla: alto = ancho * aspecto (1.6)
    sol().save(os.path.join(DST, 'sol.png'), optimize=True)
    t = rd('image.cfg')
    t = setvals(t, 'texture', [[('TXT', '', 'sol.png')]])
    t = setvals(t, 'alpha', [F('1.0'), F('1.0'), F('1.0'), F('1.0')])
    t = setvals(t, 'color', [col('1.0', '1.0', '1.0'), col('1.0', '1.0', '1.0'), col('1.0', '0.95', '0.85'), col('0.25', '0.18', '0.18')])
    t = setvals(t, 'pos_cuad_x', [F('0.25'), F('-0.45*cos(time*0.15)'), F('0.25'), F('0.0')])
    t = setvals(t, 'pos_cuad_y', [F('0.17'), F('0.30*sin(time*0.15)-0.10'), F('0.17'), F('0.15')])
    t = setvals(t, 'anc_cuad_x', [F('0.22'), F('0.22'), F('0.22*(1+0.12*sin(time*3))'), F('0.22')])
    t = setvals(t, 'alt_cuad_y', [F('0.352'), F('0.352'), F('0.352*(1+0.12*sin(time*3))'), F('0.352')])
    wr('sol.cfg', set_pre(t, pres(['quieto', 'arco', 'pulso', 'eclipse'], P)))

    # P4 luna — la fase es la TEXTURA (no se interpola: cambia al empezar la transición)
    fases = ['llena', 'creciente', 'menguante', 'nueva']
    for f in fases:
        luna(f).save(os.path.join(DST, 'luna_%s.png' % f), optimize=True)
    t = rd('image.cfg')
    t = setvals(t, 'texture', [[('TXT', '', 'luna_%s.png' % f)] for f in fases])
    t = setvals(t, 'alpha', [F('1.0'), F('1.0'), F('1.0'), F('1.0')])
    t = setvals(t, 'color', [col('1.0', '1.0', '1.0')] * 4)
    t = setvals(t, 'pos_cuad_x', [F('-0.30')] * 4)
    t = setvals(t, 'pos_cuad_y', [F('0.19')] * 4)
    t = setvals(t, 'anc_cuad_x', [F('0.14')] * 4)
    t = setvals(t, 'alt_cuad_y', [F('0.224')] * 4)
    wr('luna.cfg', set_pre(t, pres(fases, ['texture'] + P)))

    # consola: cielo (pre-efecto) + sol, luna, montaña (efectos, en ese orden: lo primero queda atrás)
    mol = rd('00_Image.mol')
    mol = re.sub(r'<PARAM name="devices" type="MOLDEOOBJECT" >.*?</PARAM>', '<PARAM name="devices" type="MOLDEOOBJECT" />', mol, flags=re.S)
    mol = mol.replace('<D type="TXT">erase</D>\n                <D type="TXT">erase</D>\n                <D type="TXT">erase</D>',
                      '<D type="TXT">erase</D>\n                <D type="TXT">cielo</D>\n                <D type="TXT">cielo</D>')
    def mob(plugin, name, key):
        return ('<VAL>\n                <D type="TXT">%s</D>\n                <D type="TXT">%s</D>\n                <D type="TXT">%s</D>\n'
                '                <D type="NUM">0</D>\n                <D type="NUM">1</D>\n                <D type="TXT">%s</D>\n            </VAL>') % (plugin, name, name, key)
    efectos = '\n            '.join([mob('image', 'sol', 'S'), mob('image', 'luna', 'L'), mob('image', 'montana', 'M')])
    mol = re.sub(r'(<PARAM name="effect" type="MOLDEOOBJECT">\s*)<VAL>.*?</VAL>', lambda m: m.group(1) + efectos, mol, count=1, flags=re.S)
    assert '<D type="TXT">cielo</D>' in mol and '<D type="TXT">montana</D>' in mol and '<D type="TXT">luna</D>' in mol
    wr('Paisaje.mol', mol)
    print('ok', DST, sorted(os.listdir(DST)))


if __name__ == '__main__':
    main()
