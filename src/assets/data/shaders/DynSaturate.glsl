uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;
uniform float par_flt1;

void main(void)
{
    float f = 1.0 + 10.0 * par_flt1;

    vec3 color = texture2D(src_tex_unit0, gl_TexCoord[0].st).rgb;
 
    gl_FragColor = vec4(f * color, 1.0);
}
