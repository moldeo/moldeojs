#define PI 3.141592653589793

uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;
uniform vec2 dest_tex_size;
uniform float par_flt1;

void main(void)
{
    float n1 = 1.0;
    float n2 = 200.0;
    float n = par_flt1 * n2 + (1.0 - par_flt1) * n1;
    float d = 1.0 / n;
    vec2 tex_coords = gl_TexCoord[0].st;

    float s = (n * (int)(tex_coords.s * dest_tex_size.x / n) + d) / dest_tex_size.x;
    float t = (n * (int)(tex_coords.t * dest_tex_size.y / n) + d) / dest_tex_size.y;
    
    gl_FragColor = texture2D(src_tex_unit0, vec2(s, t)).rgba;
}
