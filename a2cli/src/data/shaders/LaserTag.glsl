uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;
uniform float fade_const;

void main(void)
{

	vec4 color0 = texture2D(src_tex_unit0, gl_TexCoord[0].xy  );
	
	vec4 contrast = pow(color0,10);
	vec4 vec_g = vec4( 0.0-contrast.r ,1.0 - contrast.g, 0.0-contrast.b, 1.0 );
	float norm_g = 1.0 - (vec_g.r*vec_g.r + vec_g.g*vec_g.g + vec_g.b*vec_g.b);
	
	norm_g = pow(norm_g,4);
	
	vec4 color1 = vec4( norm_g,norm_g,norm_g,1);
	
	gl_FragColor = (1.0 - fade_const) * color0 +  fade_const * color1;

}
