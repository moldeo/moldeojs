uniform sampler2D tex_unit_grad;
uniform sampler2D tex_unit_brush;
uniform sampler2D tex_unit_color;

void main(void)
{
    vec2 grad_coord = gl_TexCoord[0].st;
    vec2 brush_coord = gl_TexCoord[1].st;
    vec2 color_coord = gl_TexCoord[2].st;

    vec2 dir_vector = texture2D(tex_unit_grad, grad_coord).xy;
    float c = dir_vector.x;
    float s = dir_vector.y;

    // Compute vertex rotation matrix.
    mat2 rotation = mat2(+c, -s,
                         +s, +c);

    vec2 center_point = vec2(0.5, 0.5);
    vec2 rotated_coord = center_point + rotation * (brush_coord - center_point);

    float brush_alpha = texture2D(tex_unit_brush, rotated_coord).a;
    vec3 image_color = texture2D(tex_unit_color, color_coord).rgb;
    gl_FragColor = vec4(image_color, brush_alpha);
}
