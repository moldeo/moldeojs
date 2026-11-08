#!/usr/bin/env python3
"""#918 — genera el proyecto «Paisaje Interactivo» (curso de Moldeo 2) en src/assets/molrepos/inphini/Paisaje/.

Cada lección agrega una capa al MISMO paisaje. Este script arma las capas hechas hasta ahora:
  P1 cielo   (erase)  presets: amanecer · dia · atardecer · noche
  P2 montana (image)  presets: lejos · cerca · niebla · silueta
  P3 sol     (image)  presets: quieto · arco · pulso · eclipse        (detrás de la montaña: se pone)
  P4 luna    (image)  presets: llena · creciente · menguante · nueva  (4 texturas: la fase cambia la imagen)
  P5 agua    (image)  presets: calma · viento · reflejo · seca         (delante de la montaña, transparente)
  P6 lluvia  (image)  presets: despejado · llovizna · lluvia · tormenta
             una capa de trazos que cae en loop (time %): las partículas (particlessimple) del ejemplo C++
             Rain_Particles no encuadran en moldeojs todavía ⇒ deuda del motor, ver plan #918
Las imágenes se dibujan acá (propias, sin licencias de terceros). Base de los .cfg: los de basic/00_Image.
Uso:  python3 tools/paisaje_gen.py
"""
import math, os, random, re, sys
from PIL import Image, ImageDraw, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import paisaje_arte as arte

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


def agua():
    """una laguna: elipse con líneas de onda, como el río del cuaderno"""
    w, h = 1600, 420
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).ellipse((40, 60, w - 40, h - 20), fill=255)
    body = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    db = ImageDraw.Draw(body)
    for y in range(h):                                   # más claro arriba (refleja el cielo), más hondo abajo
        k = y / h
        db.line((0, y, w, y), fill=(int(150 - 60 * k), int(190 - 60 * k), int(225 - 40 * k), 255))
    im.paste(body, (0, 0), mask)
    d = ImageDraw.Draw(im)
    rng = random.Random(5)
    for i in range(14):                                  # ondas de lapicera
        y = 110 + i * 20 + rng.uniform(-4, 4)
        x0 = rng.uniform(180, 600); x1 = x0 + rng.uniform(250, 700)
        pts = [(x, y + 4 * math.sin(x / 38.0)) for x in range(int(x0), int(min(x1, w - 200)), 12)]
        if len(pts) > 1:
            d.line(pts, fill=(235, 245, 255, 200), width=3)
    d.ellipse((40, 60, w - 40, h - 20), outline=(25, 45, 70, 255), width=5)
    return im


def lluvia(w=800, h=1000):
    """trazos de lluvia que se repiten: la mitad de abajo = la de arriba (loop sin costura)"""
    half = Image.new('RGBA', (w, h // 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(half)
    rng = random.Random(6)
    for _ in range(140):
        x, y, L = rng.uniform(0, w), rng.uniform(0, h // 2), rng.uniform(18, 46)
        for dy in (0, -h // 2, h // 2):                      # que los trazos del borde se repitan del otro lado
            d.line((x, y + dy, x - L * 0.18, y + dy + L), fill=(215, 230, 255, 210), width=3)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    im.paste(half, (0, 0)); im.paste(half, (0, h // 2))
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
    for f in os.listdir(DST):
        os.remove(os.path.join(DST, f))
    P = ['alpha', 'color', 'pos_cuad_x', 'pos_cuad_y', 'anc_cuad_x', 'alt_cuad_y']
    def capa(nombre, png, presets, alpha, color, px, py, anc, alt, texturas=None, tex_en_preset=True):
        t = rd('image.cfg')
        t = setvals(t, 'texture', [[('TXT', '', x)] for x in (texturas or [png])])
        for pn, v in (('alpha', alpha), ('color', color), ('pos_cuad_x', px), ('pos_cuad_y', py), ('anc_cuad_x', anc), ('alt_cuad_y', alt)):
            t = setvals(t, pn, [F(x) if isinstance(x, str) else x for x in v])
        # P9: si la textura la elige OTRO eje (la estación), los presets de la capa no la tocan
        wr(nombre + '.cfg', set_pre(t, pres(presets, (['texture'] if texturas and tex_en_preset else []) + P)))

    # P1 cielo (color de fondo)
    cielo = rd('erase.cfg').replace('name="erase" class', 'name="cielo" class', 1)
    # P8 — «sigue al sol»: el color sale de la altura del sol (conexión simple: sol.pos_cuad_y)
    k = 'min(1,max(0,(sol.pos_cuad_y+0.26)/0.46))'                 # 0 = sol oculto … 1 = mediodía
    w = 'max(0,1-abs(sol.pos_cuad_y+0.02)/0.14)'                   # cerca del horizonte = cálido
    sigue = [('FUNCTION', 'RED', '0.08+0.42*%s+0.5*%s' % (k, w)), ('FUNCTION', 'GREEN', '0.10+0.68*%s+0.12*%s' % (k, w)),
             ('FUNCTION', 'BLUE', '0.24+0.69*%s-0.12*%s' % (k, w)), ('FUNCTION', 'ALPHA', '1.0')]
    cielo = setvals(cielo, 'color', [col('0.99', '0.78', '0.62'), col('0.50', '0.78', '0.93'), col('0.97', '0.55', '0.42'), col('0.08', '0.10', '0.24'), sigue])
    wr('cielo.cfg', set_pre(cielo, pres(['amanecer', 'dia', 'atardecer', 'noche', 'sigue_al_sol'], ['color'])))

    # cada capa vibra un poco por defecto ("todo tiene que vibrar")
    arte.sol().save(os.path.join(DST, 'sol.png'), optimize=True)
    B = '*(1+0.02*sin(time*1.3))'                       # el sol respira
    capa('sol', 'sol.png', ['amanecer', 'mediodia', 'atardecer', 'oculto', 'arco'],
         ['1.0'] * 5,
         [col('1', '0.9', '0.8'), col('1', '1', '1'), col('1', '0.85', '0.7'), col('1', '0.8', '0.7'), col('1', '1', '1')],
         ['-0.34', '0.05', '0.34', '0.36', '-0.45*cos(time*0.15)'],
         ['-0.02', '0.20', '-0.03', '-0.26', '0.30*sin(time*0.15)-0.10'],
         ['0.30' + B] * 5, ['0.48' + B] * 5)

    fases = ['llena', 'creciente', 'menguante', 'nueva']
    for f in fases:
        arte.luna(f).save(os.path.join(DST, 'luna_%s.png' % f), optimize=True)
    capa('luna', None, fases, ['0.95+0.05*sin(time*0.9)'] * 4, [col('1', '1', '1')] * 4, ['-0.30'] * 4, ['0.19+0.004*sin(time*0.6)'] * 4,
         ['0.20'] * 4, ['0.32'] * 4, texturas=['luna_%s.png' % f for f in fases])

    arte.nubes().save(os.path.join(DST, 'nubes.png'), optimize=True)
    capa('nubes', 'nubes.png', ['pocas', 'cumulos', 'tormenta', 'arrebol'],
         ['0.55', '1.0', '1.0', '1.0'],
         [col('1', '1', '1'), col('1', '1', '1'), col('0.55', '0.56', '0.66'), col('1.0', '0.78', '0.74')],
         ['0.06*sin(time*0.05)'] * 4, ['0.004*sin(time*0.4)'] * 4, ['1.08'] * 4, ['1.0'] * 4)

    arte.montana().save(os.path.join(DST, 'montana.png'), optimize=True)
    capa('montana', 'montana.png', ['lejos', 'cerca', 'niebla', 'silueta'],
         ['1.0', '1.0', '0.55+0.08*sin(time*0.3)', '1.0'],
         [col('1', '1', '1'), col('0.92', '0.96', '1.0'), col('0.96', '0.97', '1.0'), col('0.16', '0.14', '0.26')],
         ['0.0'] * 4, ['0.0', '-0.04', '0.0', '0.0'], ['1.0', '1.15', '1.0', '1.0'], ['1.0', '1.15', '1.0', '1.0'])

    arte.horizonte().save(os.path.join(DST, 'horizonte.png'), optimize=True)
    capa('horizonte', 'horizonte.png', ['claro', 'bruma', 'dorado', 'noche'],
         ['0.55+0.04*sin(time*0.5)', '0.95+0.04*sin(time*0.5)', '0.85+0.04*sin(time*0.5)', '0.45'],
         [col('1', '1', '1'), col('1', '1', '1'), col('1.0', '0.82', '0.58'), col('0.35', '0.40', '0.70')],
         ['0.0'] * 4, ['0.0'] * 4, ['1.0'] * 4, ['1.0'] * 4)

    # P9 — estaciones = TEXTURA (índice 0 verano · 1 primavera · 2 otoño · 3 invierno); la luz del día = presets de color
    EST = ['verano', 'primavera', 'otono', 'invierno']
    for e in EST:
        arte.colinas(e).save(os.path.join(DST, 'colinas_%s.png' % e), optimize=True)
        arte.pradera(e).save(os.path.join(DST, 'pradera_%s.png' % e), optimize=True)
    capa('colinas', None, ['dia', 'manana', 'atardecer', 'frio', 'noche'],
         ['1.0'] * 5,
         [col('1', '1', '1'), col('0.95', '1.0', '0.9'), col('1.0', '0.78', '0.52'), col('0.82', '0.88', '1.0'), col('0.30', '0.36', '0.58')],
         ['0.0'] * 5, ['0.002*sin(time*0.7)'] * 5, ['1.0'] * 5, ['1.0'] * 5,
         texturas=['colinas_%s.png' % e for e in EST], tex_en_preset=False)

    arte.agua().save(os.path.join(DST, 'agua.png'), optimize=True)
    capa('agua', 'agua.png', ['calma', 'viento', 'reflejo', 'seca', 'noche'],
         ['0.88+0.06*sin(time*2.1)', '0.85+0.1*sin(time*4.3)', '0.8+0.06*sin(time*2.1)', '0.18', '0.8+0.08*sin(time*1.7)'],
         [col('1', '1', '1'), col('0.92', '0.96', '1.0'), col('1.0', '0.78', '0.66'), col('0.7', '0.55', '0.4'), col('0.32', '0.38', '0.62')],
         ['0.10+0.003*sin(time*1.1)', '0.10+0.008*sin(time*2.3)', '0.10+0.003*sin(time*1.1)', '0.10', '0.10+0.003*sin(time*1.1)'], ['-0.175'] * 3 + ['-0.18', '-0.175'],
         ['0.62', '0.62+0.01*sin(time*3.1)', '0.62', '0.45', '0.62'], ['0.20', '0.20+0.01*sin(time*2.7)', '0.20', '0.12', '0.20'])

    capa('pradera', None, ['brisa', 'viento', 'atardecer', 'noche'],
         ['1.0'] * 4,
         [col('1', '1', '1'), col('0.96', '1.0', '0.94'), col('1.0', '0.74', '0.56'), col('0.26', '0.32', '0.52')],
         ['0.004*sin(time*1.7)', '0.012*sin(time*3.1)', '0.004*sin(time*1.7)', '0.002*sin(time*1.1)'], ['0.0'] * 4,
         ['1.03', '1.04', '1.03', '1.03'], ['1.0'] * 4,
         texturas=['pradera_%s.png' % e for e in EST], tex_en_preset=False)

    arte.lluvia().save(os.path.join(DST, 'lluvia.png'), optimize=True)
    capa('lluvia', 'lluvia.png', ['despejado', 'llovizna', 'lluvia', 'tormenta'],
         ['0.0', '0.35', '0.7', '0.95'],
         [col('1', '1', '1'), col('1', '1', '1'), col('0.9', '0.95', '1.0'), col('0.8', '0.85', '0.95')],
         ['0.0', '0.0', '0.0', '0.03*sin(time*0.7)'],
         ['0.3125', '0.3125-((time*0.25)%0.625)', '0.3125-((time*0.6)%0.625)', '0.3125-((time*1.1)%0.625)'],
         ['1.05'] * 4, ['2.0'] * 4)

    # consola: cielo (pre-efecto) + capas de atrás hacia adelante
    mol = rd('00_Image.mol')
    mol = re.sub(r'<PARAM name="devices" type="MOLDEOOBJECT" >.*?</PARAM>', '<PARAM name="devices" type="MOLDEOOBJECT" />', mol, flags=re.S)
    mol = mol.replace('<D type="TXT">erase</D>\n                <D type="TXT">erase</D>\n                <D type="TXT">erase</D>',
                      '<D type="TXT">erase</D>\n                <D type="TXT">cielo</D>\n                <D type="TXT">cielo</D>')
    def mob(plugin, name, key):
        return ('<VAL>\n                <D type="TXT">%s</D>\n                <D type="TXT">%s</D>\n                <D type="TXT">%s</D>\n'
                '                <D type="NUM">0</D>\n                <D type="NUM">1</D>\n                <D type="TXT">%s</D>\n            </VAL>') % (plugin, name, name, key)
    orden = [('sol', 'S'), ('luna', 'L'), ('nubes', 'N'), ('montana', 'M'), ('horizonte', 'H'), ('colinas', 'C'),
             ('agua', 'A'), ('pradera', 'P'), ('lluvia', 'R')]
    efectos = '\n            '.join(mob('image', n, k) for n, k in orden)
    mol = re.sub(r'(<PARAM name="effect" type="MOLDEOOBJECT">\s*)<VAL>.*?</VAL>', lambda m: m.group(1) + efectos, mol, count=1, flags=re.S)
    assert '<D type="TXT">cielo</D>' in mol and all('<D type="TXT">%s</D>' % n in mol for n, _ in orden)
    # P7 — presets de PROYECTO (estado = qué preset usa cada capa) + tiempo de cada estado y de la transición.
    # Van en los PRECONFIGS de la consola: <P name="<capa>">; el player C++ ignora lo que no es un param suyo.
    estados = [
        ('amanecer',  8, 4, dict(cielo=0, sol=0, luna=3, nubes=3, montana=0, horizonte=2, colinas=1, agua=2, pradera=2)),
        ('dia',       8, 4, dict(cielo=1, sol=1, luna=3, nubes=1, montana=0, horizonte=0, colinas=0, agua=0, pradera=0)),
        ('atardecer', 8, 4, dict(cielo=2, sol=2, luna=1, nubes=3, montana=3, horizonte=2, colinas=2, agua=2, pradera=2)),
        ('noche',     8, 4, dict(cielo=3, sol=3, luna=0, nubes=2, montana=3, horizonte=3, colinas=4, agua=4, pradera=3)),
        # P8: el sol anda solo (arco) y el cielo lo sigue por conexión — el día pasa sin línea de tiempo
        ('sol_vivo', 40, 3, dict(cielo=4, sol=4, luna=3, nubes=1, montana=0, horizonte=0, colinas=0, agua=0, pradera=0)),
    ]
    # P9 — estaciones: otro eje. Fijan la TEXTURA de colinas y pradera (param suelto, `capa.param`) y la lluvia;
    # no tocan la luz, así «invierno» + «noche» = nieve con luz de noche. `group` separa los ejes en la línea de tiempo.
    estados = [(n, d, tr, idx, 'dia') for n, d, tr, idx in estados] + [
        ('primavera', 12, 2, {'colinas.texture': 1, 'pradera.texture': 1, 'lluvia': 1}, 'estacion'),
        ('verano',    12, 2, {'colinas.texture': 0, 'pradera.texture': 0, 'lluvia': 0}, 'estacion'),
        ('otono',     12, 2, {'colinas.texture': 2, 'pradera.texture': 2, 'lluvia': 1}, 'estacion'),
        ('invierno',  12, 2, {'colinas.texture': 3, 'pradera.texture': 3, 'lluvia': 0}, 'estacion'),
    ]
    pre = '<PRECONFIGS>' + ''.join(
        '\n        <PRE name="%s" duration="%d" transition="%d" group="%s">' % (n, d, tr, g) +
        ''.join('\n            <P name="%s">%d</P>' % (k, v) for k, v in idx.items()) + '\n        </PRE>'
        for n, d, tr, idx, g in estados) + '\n    </PRECONFIGS>'
    mol = re.sub(r'<PRECONFIGS>.*?</PRECONFIGS>|<PRECONFIGS\s*/>', pre, mol, flags=re.S)
    wr('Paisaje.mol', mol)
    print('ok', sorted(os.listdir(DST)))


if __name__ == '__main__':
    main()
