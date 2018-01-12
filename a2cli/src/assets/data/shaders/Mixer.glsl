uniform sampler2D src_tex_unit0;
uniform sampler2D src_tex_unit1;
uniform sampler2D src_tex_unit2;
uniform sampler2D src_tex_unit3;
uniform vec2 src_tex_offset0;
uniform vec2 src_tex_offset1;
uniform vec2 src_tex_offset2;
uniform vec2 src_tex_offset3;
uniform vec2 tempo_angle;
uniform vec2 dest_tex_size;

void main(void)
{
    vec4 color0 = texture2D(src_tex_unit0, gl_TexCoord[0].st);
    vec4 color1 = texture2D(src_tex_unit1, gl_TexCoord[1].st);
    vec4 color2 = texture2D(src_tex_unit2, gl_TexCoord[2].st); 
    vec4 color3 = texture2D(src_tex_unit3, gl_TexCoord[3].st); 

    gl_FragColor = 0.25 * (color0 + color1 + color2 + color3);
}
