"""#918 — capas del «Paisaje Interactivo» pintadas a mano por código.

Estética pedida por FCA (8-nov): fondo pintado tipo anime, cálido, verde y esperanzado (solarpunk):
degradés, bruma en el horizonte, cúmulos con sombras lavanda, colinas con árboles redondos, molinos y una casita con
invernadero, pradera con flores. Sin contorno de lapicera. Es inspiración de ESTILO, no copia de ninguna obra.
Todo se dibuja acá (propio, sin licencias de terceros); el movimiento ("que todo vibre") lo ponen los presets.
"""
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1600, 1000


# ---------------------------------------------------------------- utilidades
def vgrad(w, h, stops):
    """degradé vertical RGBA. stops = [(0..1, (r,g,b,a)), ...]"""
    ys = np.linspace(0, 1, h)
    out = np.zeros((h, w, 4), np.float32)
    for c in range(4):
        col = np.interp(ys, [s for s, _ in stops], [v[c] for _, v in stops])
        out[:, :, c] = col[:, None]
    return Image.fromarray(out.clip(0, 255).astype(np.uint8), 'RGBA')


def fill_mask(img, mask, paint):
    """pinta `paint` (Image RGBA del mismo tamaño) donde `mask` (L) es >0, con alfa del mask"""
    p = paint.copy()
    a = np.array(p.split()[3], np.float32) * (np.array(mask, np.float32) / 255.0)
    p.putalpha(Image.fromarray(a.astype(np.uint8)))
    img.alpha_composite(p)


def ridge_pts(rng, y0, amp, w=W, n=80, freqs=(2.3, 5.1, 11.7), weights=(0.6, 0.28, 0.12)):
    ph = [rng.uniform(0, 6.28) for _ in freqs]
    return [(w * i / n, y0 - amp * sum(wt * math.sin(i / n * f * math.pi + p) for f, wt, p in zip(freqs, weights, ph)))
            for i in range(n + 1)]


def poly_mask(pts, close_bottom=True):
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    d.polygon(pts + ([(W, H), (0, H)] if close_bottom else []), fill=255)
    return m


# ---------------------------------------------------------------- capas
def horizonte():
    """bruma luminosa sobre el horizonte: transparente arriba, blanco cálido abajo"""
    return vgrad(W, H, [(0.0, (255, 250, 240, 0)), (0.35, (255, 248, 235, 0)), (0.62, (255, 244, 226, 165)),
                        (0.78, (255, 240, 220, 120)), (1.0, (255, 240, 220, 60))])


def halo(n, r_frac, color, a_max, blur_frac):
    """resplandor suave: el color es fijo y sólo se difumina el alfa (sin bordes oscuros ni recuadro)"""
    m = Image.new('L', (n, n), 0)
    c = n / 2
    ImageDraw.Draw(m).ellipse((c - n * r_frac, c - n * r_frac, c + n * r_frac, c + n * r_frac), fill=a_max)
    m = m.filter(ImageFilter.GaussianBlur(n * blur_frac))
    im = Image.new('RGBA', (n, n), color + (0,))
    im.putalpha(m)
    return im


def sol(n=512):
    im = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    c = n / 2
    im.alpha_composite(halo(n, 0.26, (255, 214, 150), 150, 0.07))
    im.alpha_composite(halo(n, 0.20, (255, 228, 170), 220, 0.03))
    core = vgrad(n, n, [(0.3, (255, 250, 220, 255)), (0.7, (255, 200, 120, 255))])
    m = Image.new('L', (n, n), 0)
    ImageDraw.Draw(m).ellipse((c - n * .15, c - n * .15, c + n * .15, c + n * .15), fill=255)
    fill_mask(im, m.filter(ImageFilter.GaussianBlur(2)), core)
    return im


def luna(fase, n=512):
    c, R = n / 2, n * 0.30
    im = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    disc = Image.new('L', (n, n), 0)
    ImageDraw.Draw(disc).ellipse((c - R, c - R, c + R, c + R), fill=255)
    lit = disc.copy()
    if fase in ('creciente', 'menguante'):
        off = -R * 0.85 if fase == 'creciente' else R * 0.85
        sh = Image.new('L', (n, n), 0)
        ImageDraw.Draw(sh).ellipse((c - R + off, c - R, c + R + off, c + R), fill=255)
        lit = Image.composite(Image.new('L', (n, n), 0), lit, sh.filter(ImageFilter.GaussianBlur(6)))
    if fase == 'nueva':
        lit = Image.new('L', (n, n), 0)
    if fase != 'nueva':
        im.alpha_composite(halo(n, 0.38, (225, 232, 255), 90, 0.05))
    fill_mask(im, disc, Image.new('RGBA', (n, n), (70, 80, 120, 110)))
    face = vgrad(n, n, [(0.25, (255, 252, 236, 255)), (0.8, (226, 230, 240, 255))])
    d = ImageDraw.Draw(face)
    rng = random.Random(7)
    for _ in range(7):
        x, y, r = c + rng.uniform(-R * .55, R * .55), c + rng.uniform(-R * .55, R * .55), rng.uniform(R * .07, R * .17)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(214, 216, 228, 255))
    fill_mask(im, lit.filter(ImageFilter.GaussianBlur(1.5)), face.filter(ImageFilter.GaussianBlur(2)))
    return im


def cumulo(img, cx, cy, s, rng):
    """un cúmulo: racimo de círculos, base plana, luz arriba y sombra lavanda abajo"""
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    for _ in range(14):
        dx, dy = rng.uniform(-1.0, 1.0) * 110 * s, rng.uniform(-0.6, 0.15) * 70 * s
        r = rng.uniform(45, 85) * s * (1.15 - abs(dx) / (130 * s) * 0.5)
        d.ellipse((cx + dx - r, cy + dy - r, cx + dx + r, cy + dy + r), fill=255)
    d.rectangle((0, cy + 30 * s, W, H), fill=0)                      # base plana
    top, bot = cy - 140 * s, cy + 30 * s
    paint = vgrad(W, H, [(0, (255, 255, 255, 255)), (max(0.01, top / H), (255, 255, 255, 255)),
                         (min(0.99, (top + bot) / 2 / H), (246, 242, 252, 255)), (min(1, bot / H), (184, 176, 214, 255)), (1, (184, 176, 214, 255))])
    fill_mask(img, m.filter(ImageFilter.GaussianBlur(3 * s)), paint)


def nubes():
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    rng = random.Random(11)
    for cx, cy, s in ((260, 250, 1.25), (820, 180, 0.9), (1300, 280, 1.4), (1550, 150, 0.7), (560, 360, 0.6)):
        cumulo(im, cx, cy, s, rng)
    return im


def montana():
    """cordón lejano azulado con nieve, perspectiva atmosférica"""
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    rng = random.Random(918)
    pts = ridge_pts(rng, 560, 190, freqs=(2.1, 4.7, 13.3), weights=(0.62, 0.26, 0.12))
    fill_mask(im, poly_mask(pts), vgrad(W, H, [(0.3, (122, 150, 196, 255)), (0.75, (168, 190, 220, 255))]))
    snow = Image.new('L', (W, H), 0)
    ds = ImageDraw.Draw(snow)
    top = min(y for _, y in pts)
    for i in range(1, len(pts) - 1):
        x, y = pts[i]
        if y < top + 55 and y <= pts[i - 1][1] and y <= pts[i + 1][1]:          # sólo picos altos
            ds.polygon([(x - 40, y + 46), (x - 14, y + 30), (x, y), (x + 16, y + 34), (x + 40, y + 46)], fill=235)
    snow = Image.composite(snow, Image.new('L', (W, H), 0), poly_mask(pts))
    fill_mask(im, snow.filter(ImageFilter.GaussianBlur(3)), Image.new('RGBA', (W, H), (248, 250, 255, 255)))
    return im.filter(ImageFilter.GaussianBlur(0.8))


def arbol(d, x, y, s, rng):
    d.rectangle((x - 3 * s, y, x + 3 * s, y + 22 * s), fill=(92, 70, 52, 255))
    for k, (ox, oy, r, col) in enumerate(((0, -10, 24, (46, 110, 60)), (-14, 2, 18, (40, 98, 54)), (14, 2, 18, (40, 98, 54)),
                                          (-6, -18, 13, (106, 176, 92)))):
        r = r * s
        d.ellipse((x + ox * s - r, y + oy * s - r, x + ox * s + r, y + oy * s + r), fill=col + (255,))


def molino(d, x, y, h):
    d.line((x, y, x, y - h), fill=(246, 248, 250, 255), width=max(3, int(h / 40)))
    hx, hy = x, y - h
    for k in range(3):
        a = math.radians(-90 + 120 * k + 15)
        L = h * 0.42
        d.polygon([(hx, hy), (hx + math.cos(a) * L - math.sin(a) * 5, hy + math.sin(a) * L + math.cos(a) * 5),
                   (hx + math.cos(a) * L, hy + math.sin(a) * L)], fill=(250, 251, 252, 255))
    d.ellipse((hx - 5, hy - 5, hx + 5, hy + 5), fill=(220, 226, 232, 255))


def colinas():
    """lomas verdes con árboles, molinos y una casita con techo verde e invernadero"""
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    rng = random.Random(42)
    far = ridge_pts(rng, 700, 70, freqs=(1.7, 3.9, 8.1))
    fill_mask(im, poly_mask(far), vgrad(W, H, [(0.6, (120, 176, 120, 255)), (0.9, (92, 150, 96, 255))]))
    near = ridge_pts(rng, 800, 60, freqs=(1.3, 3.1, 6.7))
    fill_mask(im, poly_mask(near), vgrad(W, H, [(0.7, (104, 172, 86, 255)), (1.0, (60, 128, 64, 255))]))
    d = ImageDraw.Draw(im)
    for x, y, h in ((1180, 668, 150), (1290, 690, 120), (1385, 700, 95)):    # molinos en la loma lejana
        molino(d, x, y, h)
    for i in range(26):                                                       # bosquecitos sobre las lomas
        x = rng.uniform(30, 1570)
        yy = min(p[1] for p in far if abs(p[0] - x) < 25) if rng.random() < 0.5 else min(p[1] for p in near if abs(p[0] - x) < 25)
        arbol(d, x, yy - 6, rng.uniform(0.7, 1.3), rng)
    # casita solarpunk: paredes crema, techo verde vivo, cúpula de invernadero
    hx, hy = 180, min(p[1] for p in near if abs(p[0] - 180) < 25) - 4
    d.rectangle((hx - 40, hy - 46, hx + 40, hy), fill=(246, 236, 214, 255))
    d.polygon([(hx - 52, hy - 44), (hx, hy - 82), (hx + 52, hy - 44)], fill=(84, 150, 74, 255))
    d.rectangle((hx - 10, hy - 26, hx + 10, hy), fill=(150, 104, 72, 255))
    d.rectangle((hx + 20, hy - 34, hx + 32, hy - 22), fill=(170, 214, 236, 255))
    dome = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    dd = ImageDraw.Draw(dome)
    dd.pieslice((hx + 50, hy - 52, hx + 130, hy + 28), 180, 360, fill=(190, 236, 240, 150), outline=(240, 250, 252, 220), width=3)
    for k in range(1, 4):
        xx = hx + 50 + k * 20
        dd.line((xx, hy - 12 - 28 * math.sin(math.pi * k / 4), xx, hy - 12), fill=(240, 250, 252, 200), width=2)
    im.alpha_composite(dome)
    return im


def agua():
    w, h = 1600, 420
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).ellipse((40, 60, w - 40, h - 20), fill=255)
    body = vgrad(w, h, [(0.15, (196, 228, 246, 255)), (0.55, (110, 182, 220, 255)), (1.0, (64, 132, 186, 255))])
    fill_mask(im, m.filter(ImageFilter.GaussianBlur(4)), body)
    d = ImageDraw.Draw(im)
    rng = random.Random(5)
    for i in range(10):                                                       # reflejos suaves
        y = 120 + i * 24
        x0 = rng.uniform(220, 700)
        d.line((x0, y, x0 + rng.uniform(160, 480), y), fill=(240, 250, 255, 120), width=3)
    for _ in range(60):                                                       # destellos
        x, y = rng.uniform(220, 1380), rng.uniform(110, 330)
        r = rng.uniform(1.5, 3.5)
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, 230))
    return im


def pradera():
    """primer plano: pastos curvos y flores; el preset lo mece"""
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    base = Image.new('L', (W, H), 0)
    ImageDraw.Draw(base).polygon(ridge_pts(random.Random(3), 815, 26, freqs=(2.2, 6.1, 13)) + [(W, H), (0, H)], fill=255)
    fill_mask(im, base.filter(ImageFilter.GaussianBlur(2)), vgrad(W, H, [(0.78, (96, 168, 76, 255)), (1.0, (54, 116, 52, 255))]))
    d = ImageDraw.Draw(im)
    rng = random.Random(9)
    greens = [(70, 140, 60), (96, 170, 70), (124, 190, 84), (58, 120, 52)]
    for _ in range(1400):
        x = rng.uniform(-10, W + 10)
        y = rng.uniform(805, H + 10)
        L = rng.uniform(22, 70)
        bend = rng.uniform(-14, 14)
        col = rng.choice(greens) + (255,)
        d.polygon([(x - 2.5, y), (x + bend, y - L), (x + 2.5, y)], fill=col)
    for _ in range(140):
        x, y = rng.uniform(0, W), rng.uniform(815, H - 8)
        col = rng.choice([(250, 216, 92), (244, 150, 186), (255, 250, 245), (176, 150, 232)])
        r = rng.uniform(3, 6)
        for k in range(5):
            a = k * 2 * math.pi / 5
            d.ellipse((x + math.cos(a) * r - r * .7, y + math.sin(a) * r - r * .7, x + math.cos(a) * r + r * .7, y + math.sin(a) * r + r * .7), fill=col + (255,))
        d.ellipse((x - r * .5, y - r * .5, x + r * .5, y + r * .5), fill=(250, 196, 70, 255))
    return im


def lluvia(w=800, h=1000):
    half = Image.new('RGBA', (w, h // 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(half)
    rng = random.Random(6)
    for _ in range(140):
        x, y, L = rng.uniform(0, w), rng.uniform(0, h // 2), rng.uniform(18, 46)
        for dy in (0, -h // 2, h // 2):
            d.line((x, y + dy, x - L * 0.18, y + dy + L), fill=(225, 236, 255, 190), width=3)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    im.paste(half, (0, 0))
    im.paste(half, (0, h // 2))
    return im
