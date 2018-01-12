uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;
uniform float fade_const;

void main(void)
{
    vec4 color0 = texture2D(src_tex_unit0, gl_TexCoord[0].st);
    float luminance = 0.299 * color0.r + 0.587 * color0.g + 0.114 * color0.b;
    
	vec4 color1;
    if (luminance < 0.5) color1 = vec4(0.0, 0.0, 0.0, 1.0);
    else color1 = vec4(1.0, 1.0, 1.0, 1.0);
	
    gl_FragColor = (1.0 - fade_const) * color0 +  fade_const * color1;	
}
