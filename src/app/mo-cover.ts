/**
 * «cubrir» (cover, como CSS background-size: cover) — L07 (FCA 18-nov): una capa pintada para la banda 4:1 del hero se ve sin
 * deformar en CUALQUIER lienzo (1440×360, 390×240, …). Mundo ortográfico de moldeojs: x ∈ [−½, ½], y ∈ ±½·(alto/ancho).
 *   P = ancho/alto del lienzo · A = ancho/alto de la imagen · ancla_x/ancla_y 0..1 = qué parte de la imagen se conserva cuando
 *   sobra (0 = izquierda/arriba, ½ = centro, 1 = derecha/abajo).
 * Devuelve el cuadro de la imagen en el mundo: ancho w, alto h, centro (dx, dy). Sin A (textura sin cargar) ⇒ estirar (= antes).
 * La MISMA cuenta la usan `image` (ajuste = 1) y particlesfractal (`puntos` con ajuste = 1) ⇒ las luces caen sobre su dibujo.
 */
export function moCubrir(P: number, A: number, ancla_x = 0.5, ancla_y = 0.5): { w: number, h: number, dx: number, dy: number } {
  if (!(P > 0) || !(A > 0)) return { w: 1, h: P > 0 ? 1 / P : 1, dx: 0, dy: 0 };
  let w: number, h: number;
  if (A >= P) { h = 1 / P; w = A / P; } else { w = 1; h = 1 / A; }
  const ax = Math.max(0, Math.min(1, isFinite(ancla_x) ? ancla_x : 0.5)), ay = Math.max(0, Math.min(1, isFinite(ancla_y) ? ancla_y : 0.5));
  return { w, h, dx: (0.5 - ax) * (w - 1), dy: (ay - 0.5) * (h - 1 / P) };
}
