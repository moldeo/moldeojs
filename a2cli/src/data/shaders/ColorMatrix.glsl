uniform sampler2D src_tex_unit0;
uniform mat4 par_mat4;
uniform float fade_const;

void main(void)
{
	vec4 color0 = texture2D(src_tex_unit0, gl_TexCoord[0].st);
	vec4 color1 = color0 * par_mat4;	
    gl_FragColor = (1.0 - fade_const) * color0 +  fade_const * color1;	
}
