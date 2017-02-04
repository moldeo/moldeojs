#define PI 3.141592653589793

uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;

void main(void)
{
    vec4 color = texture2D(src_tex_unit0, gl_TexCoord[0].st);
    float c = cos(2.0 * PI * tempo_angle.y);
    vec3 f = vec3(2.0 + c, 2.0 + c, 2.0 + c);
    gl_FragColor = vec4(f.r * color.r, f.g * color.g, f.b * color.b, color.a);
}
