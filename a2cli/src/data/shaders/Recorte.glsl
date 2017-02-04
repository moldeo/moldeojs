
uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;
uniform vec2 tempo_angle;
uniform float fade_const;

const vec3 coef= vec3(0.2125, 0.7154, 0.0721);

void main(void)
{
    vec2 coord0 = gl_TexCoord[0].st;
	
	float src_intensity;

	vec4 src_color = texture2D(src_tex_unit0, coord0);
	vec3 back_color = vec3( 0.9, 0.9, 0.9);
	
	vec3 dist = back_color - src_color.rgb;
	
	float d4 = sqrt(dist.x*dist.x + dist.y*dist.y + dist.z*dist.z);
	
	//gl_FragColor = vec4( d4, d4, d4, 1.0 );
	
	if ( d4 > 0.2 ) {
		gl_FragColor = vec4( src_color.rgb, 1.0);	
	} else gl_FragColor = vec4( src_color.rgb, 0.4);
	
}
