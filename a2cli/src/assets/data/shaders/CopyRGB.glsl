uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform float tempo_angle;

void main(void)
{
    vec4 color = texture2D(src_tex_unit0, gl_TexCoord[0].st);
    
    gl_FragColor = vec4(color.rgb, 1.0);
}
