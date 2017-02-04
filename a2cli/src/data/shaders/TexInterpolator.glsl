uniform sampler2D src_tex_unit0;
uniform sampler2D src_tex_unit1;
uniform vec2 src_tex_offset0;
uniform vec2 src_tex_offset1;
uniform float par_flt1;

void main(void)
{
    vec2 coord0 = gl_TexCoord[0].st;
    vec2 coord1 = gl_TexCoord[1].st;

    vec4 color0 = texture2D(src_tex_unit0, coord0).xyzw;
    vec4 color1 = texture2D(src_tex_unit1, coord1).xyzw;

    gl_FragColor = (1.0 - par_flt1) * color0 + par_flt1 * color1;
}
