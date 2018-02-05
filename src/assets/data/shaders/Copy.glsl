uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;
uniform vec2 dest_tex_size;

void main(void)
{
    gl_FragColor = texture2D(src_tex_unit0, gl_TexCoord[0].st);
}
